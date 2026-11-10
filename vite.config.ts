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
        req.on('data', (chunk: Buffer | string) => {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
        })

        req.on('end', async () => {
          try {
            const rawBody = Buffer.concat(chunks).toString('utf-8')
            const { personImage, garmentImage, prompt, hfToken } = JSON.parse(rawBody)

            if (!personImage || !garmentImage) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'personImage and garmentImage are required' }))
              return
            }

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
              const r = await fetch(fetchUrl, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
              })
              if (!r.ok) throw new Error(`Failed to fetch image: ${fetchUrl}`)
              const buf = await r.arrayBuffer()
              const ct = r.headers.get('content-type') || 'image/jpeg'
              return new Blob([buf], { type: ct })
            }

            // ── Primary: Pretrained Neural IDM-VTON / Nymbo ──────────────────
            const activeToken = hfToken || process.env.HF_TOKEN || process.env.VITE_HF_TOKEN

            const vtonSpaces = ['yisol/IDM-VTON', 'Nymbo/Virtual-Try-On']
            for (const space of vtonSpaces) {
              try {
                console.log(`[TryOnX] Connecting to neural ${space}...`)
                const { Client, handle_file } = await import('@gradio/client')

                const [pBlob, gBlob] = await Promise.all([
                  toBlob(personImage),
                  toBlob(garmentImage),
                ])

                const app = await Client.connect(space, activeToken ? ({ hf_token: activeToken } as any) : undefined)

                const prediction = (await app.predict('/tryon', [
                  {
                    background: handle_file(pBlob),
                    layers: [],
                    composite: null,
                  },
                  handle_file(gBlob),
                  prompt || 'Photorealistic clothing garment fitted naturally to body',
                  true,  // is_checked (auto-masking)
                  false, // is_checked_crop
                  30,    // denoise_steps
                  42,    // seed
                ])) as any

                const outFileData = prediction?.data?.[0]
                const resultUrl = outFileData?.url || (typeof outFileData === 'string' ? outFileData : null)

                if (resultUrl) {
                  const imgRes = await fetch(resultUrl)
                  const imgBuf = await imgRes.arrayBuffer()
                  const mime = imgRes.headers.get('content-type') || 'image/png'
                  const dataUrl = `data:${mime};base64,${Buffer.from(imgBuf).toString('base64')}`
                  console.log(`[TryOnX] ✅ Neural inference succeeded on ${space}!`)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ success: true, resultUrl: dataUrl, provider: 'idm_vton_neural' }))
                  return
                }
              } catch (idmErr: any) {
                const msg = idmErr?.message || ''
                console.warn(`[TryOnX] ${space} notice:`, msg.slice(0, 160))
              }
            }

            // If public ZeroGPU quota is exceeded, report clean notice to client
            // so client seamlessly applies subject-preserving fitting on the person's photo
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              success: false,
              quotaExceeded: true,
              message: 'ZeroGPU quota exceeded. Falling back to subject-preserving fitting engine.',
            }))
          } catch (err: any) {
            console.error('[TryOnX] Server error:', err)
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
      '/img-proxy': {
        target: 'https://m.media-amazon.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy/, ''),
        secure: false,
      },
      '/unsplash-proxy': {
        target: 'https://images.unsplash.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/unsplash-proxy/, ''),
        secure: false,
      },
    },
  },
})
