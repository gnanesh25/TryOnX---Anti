export const config = {
  maxDuration: 60,
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  try {
    const { personImage, garmentImage, prompt, hfToken } = req.body || {}

    if (!personImage || !garmentImage) {
      res.status(400).json({ error: 'personImage and garmentImage are required' })
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

    const activeToken =
      hfToken ||
      process.env.HF_TOKEN ||
      process.env.VITE_HF_TOKEN ||
      ''

    const vtonSpaces = ['yisol/IDM-VTON', 'Nymbo/Virtual-Try-On']
    let lastError = ''

    for (const space of vtonSpaces) {
      try {
        console.log(`[TryOnX API] Connecting to neural ${space}...`)
        const { Client, handle_file } = await import('@gradio/client')

        const [pBlob, gBlob] = await Promise.all([
          toBlob(personImage),
          toBlob(garmentImage),
        ])

        const clientOptions = activeToken
          ? ({ token: activeToken, hf_token: activeToken } as any)
          : undefined

        const app = await Client.connect(space, clientOptions)

        console.log(`[TryOnX API] Submitting to ${space} /tryon...`)
        const prediction = (await app.predict('/tryon', [
          {
            background: handle_file(pBlob),
            layers: [],
            composite: null,
          },
          handle_file(gBlob),
          prompt || 'Photorealistic clothing garment fitted naturally to body',
          true,
          false,
          30,
          42,
        ])) as any

        const outFileData = prediction?.data?.[0]
        const resultUrl = outFileData?.url || (typeof outFileData === 'string' ? outFileData : null)

        if (resultUrl) {
          const imgRes = await fetch(resultUrl)
          const imgBuf = await imgRes.arrayBuffer()
          const mime = imgRes.headers.get('content-type') || 'image/png'
          const dataUrl = `data:${mime};base64,${Buffer.from(imgBuf).toString('base64')}`
          console.log(`[TryOnX API] ✅ Neural inference succeeded on ${space}!`)
          res.status(200).json({ success: true, resultUrl: dataUrl, provider: 'idm_vton_neural' })
          return
        }
      } catch (idmErr: any) {
        const msg = idmErr?.message || ''
        lastError = msg
        console.warn(`[TryOnX API] ${space} notice:`, msg.slice(0, 160))
      }
    }

    const isQuota = lastError.includes('ZeroGPU') || lastError.includes('quota')
    res.status(isQuota ? 429 : 500).json({
      success: false,
      quotaExceeded: isQuota,
      error: isQuota
        ? lastError || 'ZeroGPU quota limit reached. Please verify your token has active compute quota.'
        : lastError || 'Neural virtual try-on model is busy. Please try again shortly.',
    })
  } catch (err: any) {
    console.error('[TryOnX API] Server error:', err)
    res.status(500).json({ error: err.message || 'AI Virtual Try-On inference failed' })
  }
}
