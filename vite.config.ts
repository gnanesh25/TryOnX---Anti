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
            const { personImage, garmentImage, prompt, productName } = JSON.parse(rawBody)

            if (!personImage || !garmentImage) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'personImage and garmentImage are required' }))
              return
            }

            // Helper: convert data URL or remote URL to Buffer
            const toBuffer = async (input: string): Promise<{ buffer: Buffer; mime: string }> => {
              if (input.startsWith('data:')) {
                const parts = input.split(',')
                const mimeMatch = parts[0].match(/:(.*?);/)
                const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
                return { buffer: Buffer.from(parts[1], 'base64'), mime }
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
              return { buffer: Buffer.from(buf), mime: ct }
            }

            // ── TIER 1: Gemini Image Generation (Primary) ─────────────────────
            const geminiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
            if (geminiKey) {
              // Try multiple Gemini image models in sequence
              const geminiImageModels = [
                'models/gemini-3.1-flash-image',
                'models/gemini-2.5-flash-image',
                'models/gemini-3-pro-image',
                'models/gemini-3.1-flash-image-preview',
              ]

              for (const geminiModel of geminiImageModels) {
                try {
                  console.log(`[TryOnX] 🔮 Trying Gemini ${geminiModel}...`)
                  const [personData, garmentData] = await Promise.all([
                    toBuffer(personImage),
                    toBuffer(garmentImage),
                  ])

                  const tryOnPrompt = `You are an expert AI virtual try-on system performing photorealistic garment transfer.

INPUT:
- Image 1: Person's photograph (the base - keep everything the same)
- Image 2: Clothing garment reference

TASK: Generate a photorealistic image showing the SAME person wearing the garment from Image 2.

STRICT REQUIREMENTS:
1. Person's face, hair, skin tone, body shape, pose, expression → IDENTICAL to Image 1
2. Person's legs, hands, feet, background → IDENTICAL to Image 1  
3. Replace ONLY the upper body clothing with the garment from Image 2
4. Garment must look naturally worn: proper draping, fabric folds, wrinkles, shadows
5. Match garment details exactly: ${prompt || 'color, pattern, neckline, collar, buttons, fabric texture'}
6. Final image = single photorealistic photo of the person wearing the selected garment
7. Do NOT add extra elements, do NOT overlay images, do NOT crop differently

Output: One photorealistic try-on result image.`

                  const geminiBody = {
                    contents: [
                      {
                        parts: [
                          { text: tryOnPrompt },
                          {
                            inline_data: {
                              mime_type: personData.mime,
                              data: personData.buffer.toString('base64'),
                            },
                          },
                          { text: 'Image 1: Person to dress (keep face/pose/background unchanged)' },
                          {
                            inline_data: {
                              mime_type: garmentData.mime,
                              data: garmentData.buffer.toString('base64'),
                            },
                          },
                          { text: 'Image 2: Target garment to put on the person' },
                        ],
                      },
                    ],
                    generationConfig: {
                      responseModalities: ['IMAGE', 'TEXT'],
                      temperature: 0.3,
                    },
                  }

                  const geminiRes = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/${geminiModel}:generateContent?key=${geminiKey}`,
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(geminiBody),
                      signal: AbortSignal.timeout(60000),
                    }
                  )

                  if (geminiRes.ok) {
                    const geminiData = await geminiRes.json()
                    const parts = geminiData?.candidates?.[0]?.content?.parts || []
                    const imagePart = parts.find((p: any) => p.inline_data?.data)
                    if (imagePart?.inline_data?.data) {
                      const mime = imagePart.inline_data.mime_type || 'image/png'
                      const dataUrl = `data:${mime};base64,${imagePart.inline_data.data}`
                      console.log(`[TryOnX] ✅ Gemini ${geminiModel} success!`)
                      res.statusCode = 200
                      res.setHeader('Content-Type', 'application/json')
                      res.end(JSON.stringify({ success: true, resultUrl: dataUrl, provider: 'gemini' }))
                      return
                    }
                    const errMsg = geminiData?.error?.message || ''
                    if (errMsg.includes('quota') || errMsg.includes('429')) {
                      console.warn(`[TryOnX] ${geminiModel} quota exceeded, trying next model...`)
                      continue
                    }
                    console.warn(`[TryOnX] ${geminiModel} no image in response:`, errMsg.slice(0, 200))
                  } else {
                    const errText = await geminiRes.text()
                    if (geminiRes.status === 429 || errText.includes('quota')) {
                      console.warn(`[TryOnX] ${geminiModel} quota (${geminiRes.status}), trying next...`)
                      continue
                    }
                    console.warn(`[TryOnX] ${geminiModel} error ${geminiRes.status}:`, errText.slice(0, 200))
                  }
                } catch (geminiErr: any) {
                  console.warn(`[TryOnX] ${geminiModel} exception:`, geminiErr.message?.slice(0, 150))
                }
              }
            }

            // ── TIER 2: IDM-VTON / Nymbo (HuggingFace Gradio) ─────────────────
            const idmSpaces = ['Nymbo/Virtual-Try-On', 'yisol/IDM-VTON']
            for (const spaceName of idmSpaces) {
              try {
                console.log(`[TryOnX] 🧠 Trying ${spaceName}...`)
                const { Client, handle_file } = await import('@gradio/client')

                const toBlob = async (input: string): Promise<Blob> => {
                  const { buffer, mime } = await toBuffer(input)
                  return new Blob([buffer], { type: mime })
                }

                const [pBlob, gBlob] = await Promise.all([
                  toBlob(personImage),
                  toBlob(garmentImage),
                ])

                const hfToken = process.env.HF_TOKEN || process.env.VITE_HF_TOKEN
                const app = await Client.connect(spaceName, hfToken ? ({ hf_token: hfToken } as any) : undefined)

                const prediction = (await app.predict('/tryon', [
                  {
                    background: handle_file(pBlob),
                    layers: [],
                    composite: null,
                  },
                  handle_file(gBlob),
                  prompt || 'Photorealistic clothing transfer, natural fit',
                  true,  // is_checked
                  false, // is_checked_crop
                  25,    // denoise_steps
                  42,    // seed
                ])) as any

                const outFileData = prediction?.data?.[0]
                const resultUrl = outFileData?.url || (typeof outFileData === 'string' ? outFileData : null)

                if (resultUrl) {
                  const imgRes = await fetch(resultUrl)
                  const imgBuf = await imgRes.arrayBuffer()
                  const mime = imgRes.headers.get('content-type') || 'image/png'
                  const dataUrl = `data:${mime};base64,${Buffer.from(imgBuf).toString('base64')}`
                  console.log(`[TryOnX] ✅ ${spaceName} success!`)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ success: true, resultUrl: dataUrl, provider: 'idm_vton' }))
                  return
                }
              } catch (idmErr: any) {
                console.warn(`[TryOnX] ${spaceName} failed:`, idmErr.message?.slice(0, 150))
              }
            }

            // ── TIER 3: Leffa Virtual Try-On ───────────────────────────────────
            try {
              console.log('[TryOnX] 👔 Trying Leffa VTON...')
              const { Client, handle_file } = await import('@gradio/client')
              const toBlob = async (input: string): Promise<Blob> => {
                const { buffer, mime } = await toBuffer(input)
                return new Blob([buffer], { type: mime })
              }
              const [pBlob, gBlob] = await Promise.all([
                toBlob(personImage),
                toBlob(garmentImage),
              ])
              const app = await Client.connect('franciszzj/Leffa')
              const prediction = (await app.predict('/leffa_predict_vt', [
                handle_file(pBlob),
                handle_file(gBlob),
                'False',   // ref_acceleration
                50,        // step
                2.5,       // scale
                42,        // seed
                'viton_hd',// vt_model_type
                'upper',   // vt_garment_type
                'False',   // vt_repaint
              ])) as any

              const outData = prediction?.data?.[0]
              const resultUrl = outData?.url || (typeof outData === 'string' ? outData : null)
              if (resultUrl) {
                const imgRes = await fetch(resultUrl)
                const imgBuf = await imgRes.arrayBuffer()
                const mime = imgRes.headers.get('content-type') || 'image/png'
                const dataUrl = `data:${mime};base64,${Buffer.from(imgBuf).toString('base64')}`
                console.log('[TryOnX] ✅ Leffa VTON success!')
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, resultUrl: dataUrl, provider: 'leffa' }))
                return
              }
            } catch (leffaErr: any) {
              console.warn('[TryOnX] Leffa failed:', leffaErr.message?.slice(0, 150))
            }

            // ── TIER 4: OOTDiffusion ───────────────────────────────────────────
            try {
              console.log('[TryOnX] 🎨 Trying OOTDiffusion...')
              const { Client, handle_file } = await import('@gradio/client')
              const toBlob = async (input: string): Promise<Blob> => {
                const { buffer, mime } = await toBuffer(input)
                return new Blob([buffer], { type: mime })
              }
              const [pBlob, gBlob] = await Promise.all([
                toBlob(personImage),
                toBlob(garmentImage),
              ])
              const app = await Client.connect('levihsu/OOTDiffusion')
              const prediction = (await app.predict('/process_hd', [
                handle_file(pBlob),
                handle_file(gBlob),
                1,  // n_samples
                20, // n_steps
                2,  // image_scale
                42, // seed
              ])) as any

              const gallery = prediction?.data?.[0]
              const firstItem = Array.isArray(gallery) ? gallery[0] : gallery
              const resultUrl = firstItem?.image?.url || firstItem?.url || (typeof firstItem === 'string' ? firstItem : null)
              if (resultUrl) {
                const imgRes = await fetch(resultUrl)
                const imgBuf = await imgRes.arrayBuffer()
                const mime = imgRes.headers.get('content-type') || 'image/png'
                const dataUrl = `data:${mime};base64,${Buffer.from(imgBuf).toString('base64')}`
                console.log('[TryOnX] ✅ OOTDiffusion success!')
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, resultUrl: dataUrl, provider: 'ootd' }))
                return
              }
            } catch (ootdErr: any) {
              console.warn('[TryOnX] OOTDiffusion failed:', ootdErr.message?.slice(0, 150))
            }

            // ── TIER 5: Pollinations.ai (always available, no key) ─────────────
            try {
              console.log('[TryOnX] 🌟 Using Pollinations.ai fallback...')
              const pollinationsPrompt = encodeURIComponent(
                `Professional fashion photography, photorealistic virtual try-on result. ` +
                `${prompt || productName || 'clothing garment'} naturally worn by a person. ` +
                `Realistic fabric draping, natural folds, proper lighting and shadows. ` +
                `The garment fits naturally on the person's body with correct proportions. ` +
                `High quality fashion photo, studio lighting, detailed fabric texture.`
              )
              const pollinationsUrl = `https://image.pollinations.ai/prompt/${pollinationsPrompt}?width=512&height=768&nologo=true&enhance=true&model=flux&seed=42`
              const imgRes = await fetch(pollinationsUrl, { signal: AbortSignal.timeout(45000) })
              if (imgRes.ok) {
                const imgBuf = await imgRes.arrayBuffer()
                const mime = imgRes.headers.get('content-type') || 'image/jpeg'
                const dataUrl = `data:${mime};base64,${Buffer.from(imgBuf).toString('base64')}`
                console.log('[TryOnX] ✅ Pollinations fallback success!')
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, resultUrl: dataUrl, provider: 'pollinations_fallback', isApproximate: true }))
                return
              }
            } catch (pollinationsErr: any) {
              console.warn('[TryOnX] Pollinations failed:', pollinationsErr.message?.slice(0, 150))
            }

            // All tiers exhausted
            res.statusCode = 503
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              error: 'All AI virtual try-on services are temporarily at capacity. Please try again in a few minutes.',
            }))
          } catch (err: any) {
            console.error('[TryOnX] Fatal error:', err)
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
