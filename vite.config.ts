import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function tryonApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-tryon-api',
    configureServer(server) {
      server.middlewares.use('/api/tryon', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const chunks: Buffer[] = []
        req.on('data', (chunk) => {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
        })

        req.on('end', async () => {
          try {
            const rawBody = Buffer.concat(chunks).toString('utf-8')
            const { personImage, garmentImage, prompt } = JSON.parse(rawBody)

            if (!personImage || !garmentImage) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'personImage and garmentImage are required' }))
              return
            }

            console.log('[TryOnX IDM-VTON] Initializing neural model connection...')

            // Dynamically import @gradio/client
            const { Client, handle_file } = await import('@gradio/client')

            const toBlob = async (input: string): Promise<Blob> => {
              if (input.startsWith('data:')) {
                const parts = input.split(',')
                const mimeMatch = parts[0].match(/:(.*?);/)
                const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
                const buf = Buffer.from(parts[1], 'base64')
                return new Blob([buf], { type: mime })
              }
              const fetchUrl = input.startsWith('/img-proxy')
                ? input.replace('/img-proxy', 'https://m.media-amazon.com')
                : input.startsWith('/unsplash-proxy')
                ? input.replace('/unsplash-proxy', 'https://images.unsplash.com')
                : input

              const r = await fetch(fetchUrl)
              if (!r.ok) throw new Error(`Failed to fetch image: ${fetchUrl}`)
              const buf = await r.arrayBuffer()
              const ct = r.headers.get('content-type') || 'image/jpeg'
              return new Blob([buf], { type: ct })
            }

            const [pBlob, gBlob] = await Promise.all([
              toBlob(personImage),
              toBlob(garmentImage),
            ])

            console.log('[TryOnX IDM-VTON] Submitting to yisol/IDM-VTON neural inference...')
            const hfToken = process.env.HF_TOKEN || process.env.VITE_HF_TOKEN
            const app = await Client.connect('yisol/IDM-VTON', hfToken ? ({ hf_token: hfToken } as any) : undefined)

            const prediction = (await app.predict('/tryon', [
              {
                background: handle_file(pBlob),
                layers: [],
                composite: null,
              },
              handle_file(gBlob),
              prompt || 'Photorealistic clothing garment fitted naturally to body',
              true, // is_checked (auto-masking)
              false, // is_checked_crop
              25, // denoise_steps
              42, // seed
            ])) as any

            const outFileData = prediction?.data?.[0]
            const resultUrl = outFileData?.url || (typeof outFileData === 'string' ? outFileData : null)

            if (!resultUrl) {
              throw new Error('IDM-VTON model did not return an output image')
            }

            console.log('[TryOnX IDM-VTON] Inference successful! Downloading result:', resultUrl)

            // Convert to base64 dataUrl so it is completely self-contained and durable
            const imgRes = await fetch(resultUrl)
            const imgBuf = await imgRes.arrayBuffer()
            const mime = imgRes.headers.get('content-type') || 'image/png'
            const dataUrl = `data:${mime};base64,${Buffer.from(imgBuf).toString('base64')}`

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, resultUrl: dataUrl }))
          } catch (err: any) {
            console.error('[TryOnX IDM-VTON] Error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message || 'AI Virtual Try-On inference failed' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tryonApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy Amazon CDN garment images to avoid canvas CORS errors
      '/img-proxy': {
        target: 'https://m.media-amazon.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy/, ''),
        secure: false,
      },
      // Proxy Unsplash sample model images
      '/unsplash-proxy': {
        target: 'https://images.unsplash.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/unsplash-proxy/, ''),
        secure: false,
      },
    },
  },
})
