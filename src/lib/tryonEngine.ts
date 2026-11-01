/**
 * TryOnX AI Virtual Try-On Engine v3
 * High-fidelity virtual try-on using an advanced canvas-based garment compositor.
 *
 * Strategy:
 * 1. Attempt Google Gemini Vision image-gen (requires billing-enabled key).
 * 2. Fall back to the Advanced Canvas Compositor which:
 *    - Uses flood-fill background removal from the 4 corners of the garment image
 *    - Scales / warps the garment from neck to waist, covering the full torso
 *    - Extracts and re-composites the person's head + shoulders on top
 *    - Applies natural fabric shadow, lighting blend, and edge feathering
 */

import { normalizeImage, autoCorrectResultOrientation } from './imageUtils'

export interface TryOnOptions {
  personImageUrl: string
  garmentImageUrl: string
  productName: string
}

export const SAMPLE_MODELS = [
  {
    id: 'model-female-full',
    label: 'Female Model',
    type: 'Full Body',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    gender: 'female',
  },
  {
    id: 'model-male-full',
    label: 'Male Model',
    type: 'Full Body',
    url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&q=80',
    gender: 'men',
  },
  {
    id: 'model-female-half',
    label: 'Female Model',
    type: 'Half Body',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    gender: 'female',
  },
  {
    id: 'model-male-half',
    label: 'Male Model',
    type: 'Half Body',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    gender: 'men',
  },
]

export const GARMENT_VISUAL_CATALOG: Record<string, string> = {
  // Shirts
  'deemoon': 'Navy blue, dark grey and white plaid flannel checkered button-down casual shirt with spread collar, chest pocket, long sleeves with button cuffs, relaxed fit.',
  'deelmo stylish': 'Crisp white and light beige textured linen breathable button-down casual shirt with spread collar, front pocket, long sleeves.',
  'cb-colebrook': 'Solid jet black casual button-down dress shirt with structured spread collar, long sleeves with button cuffs, clean tailored fit.',
  'deelmo casual': 'Light cream beige textured waffle-weave casual button-down shirt with spread collar and long sleeves.',
  'imperial choice': 'Rich deep maroon wine-burgundy ethnic mandarin collar kurta with intricate white floral vine embroidery cascading down the left chest and collar, stand band collar, front button placket, long sleeves. Must strictly match the deep maroon burgundy color and white floral embroidery.',
  'toplot': 'Pista light mint green breathable textured casual button-down shirt with spread collar, short sleeves, summer relaxed fit.',

  // T-Shirts
  'ausk baggy': 'Dark charcoal black oversized drop-shoulder graphic t-shirt with loose streetwear hip-hop fit, short sleeves, crew neckline.',
  'lymio': 'Beige cream casual cotton t-shirt with modern typography graphic print across chest, crew neck, short sleeves.',
  'ausk cable knit': 'Premium beige cream cable knit quarter-zip textured polo t-shirt with ribbed collar, zippered neck, short sleeves.',
  'noble monk': 'Solid olive sage green oversized drop-shoulder t-shirt, relaxed baggy streetwear silhouette, crew neck.',
  'tagdo': 'Black and white textured fine-knit polo shirt with contrast white tipping on collar and sleeve cuffs, button placket.',
  'leotude': 'Deep navy blue oversized graphic t-shirt with bold white "BOSTON" collegiate varsity lettering across chest, crew neck.',

  // Women's Collection
  'kzully': 'Emerald dark green and white floral printed fit-and-flare western dress with V-neckline, flutter sleeves, knee-length.',
  'shasmi': 'Solid rich chocolate brown cinched waist western dress with tie belt, collared neckline, rolled short sleeves, A-line skirt.',
  'klosia': 'Traditional maroon wine Anarkali flared ethnic kurta suit with golden foil ethnic prints, intricate lace yoke border, paired with matching printed dupatta.',
  'gosriki': 'Vibrant teal kerosene blue and gold printed straight kurti with geometric ethnic bandhani borders, 3/4 sleeves, matching pants.',
  'litzo': 'Soft blush pink and floral printed elegant western midi dress with tiered ruffle hem, square neck, puff sleeves.',
  'lookmark': 'Royal blue and white printed traditional festive ethnic kurta set with floral block print and matching printed dupatta.',

  // Kids' Wear
  'outfit mandarin collar': 'Kids boy vertical striped pastel yellow and white mandarin collar cotton kurta shirt with half sleeves and front buttons.',
  'white button': 'Kids traditional South Indian Pavadai lehenga choli set in bright royal blue and golden zari brocade silk with festive borders.',
  'dingdong': 'Kids black and grey athletic fleece tracksuit set with contrast typography printed sleeves sweatshirt and matching jogger pants.',
  'mi kidz': 'Kids bright royal blue collared polo t-shirt with yellow contrast collar stripe, short sleeves, embroidered chest badge.',
  'indhrani': 'Kids multicolored graphic printed comfortable cotton co-ord set with short sleeve top and matching elastic shorts.',
  'peeloo': 'Kids casual cotton activewear set with graphic print t-shirt and comfortable track pants.',
  'tagas': 'Girls elegant party frock in soft pastel pink with multi-tiered tulle ruffles, delicate floral lace embroidery on bodice.',
  'minicult': 'Kids 100% cotton bright red sweatshirt with official Mickey Mouse graphic illustration on front, paired with black trackpants.',
}

export function getDetailedGarmentPrompt(productName: string, garmentImageUrl: string): string {
  const lower = productName.toLowerCase()
  for (const [key, desc] of Object.entries(GARMENT_VISUAL_CATALOG)) {
    if (lower.includes(key)) {
      return `${desc} (Selected garment: "${productName}"). Strictly preserve the exact colors, embroidery, fabric texture, and silhouette from the product image: ${garmentImageUrl}`
    }
  }
  return `Exact matching garment: "${productName}". Draped naturally on the person. Match the authentic color palette, fabric texture, neckline, and patterns of the garment shown in ${garmentImageUrl}. Do not substitute with different colors or random designs.`
}

// ─────────────────────────────────────────────────────────
// Gemini Vision (requires billing-enabled key)
// ─────────────────────────────────────────────────────────
async function callGeminiTryOn(
  personBase64: string,
  garmentBase64: string,
  detailedPrompt: string,
  apiKey?: string
): Promise<string | null> {
  const key = apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY
  if (!key) return null

  const cleanPerson = personBase64.replace(/^data:image\/\w+;base64,/, '')
  const cleanGarment = garmentBase64.replace(/^data:image\/\w+;base64,/, '')

  const imageModels = [
    'models/gemini-3.1-flash-image',
    'models/gemini-2.5-flash-image',
    'models/gemini-3-pro-image',
    'models/gemini-3.1-flash-lite-image',
  ]

  const prompt = `You are a photorealistic virtual clothing try-on AI.

Task: Take the PERSON image and replace ONLY their upper clothing with the GARMENT shown in the second image.

Rules:
- Keep the person's FACE, HAIR, SKIN, POSE, and BACKGROUND exactly the same
- Replace their shirt/top with the selected garment draped naturally over their body
- Match the garment's exact COLOR, PATTERN, FABRIC TEXTURE and DESIGN: ${detailedPrompt}
- The garment should look like the person is genuinely wearing it
- DO NOT overlay a product image rectangle — actually replace the clothing
- Maintain realistic lighting, shadows and body-fit drape

Output: A single photorealistic image of the person wearing the new garment.`

  for (const model of imageModels) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  { inlineData: { mimeType: 'image/jpeg', data: cleanPerson } },
                  { inlineData: { mimeType: 'image/jpeg', data: cleanGarment } },
                ],
              },
            ],
            generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const imgPart = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData?.mimeType?.startsWith('image'))
        if (imgPart?.inlineData?.data) {
          return `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}`
        }
      }
      // 429 = quota exceeded → skip
    } catch {
      // continue
    }
  }
  return null
}

// ─────────────────────────────────────────────────────────
// Main orchestrator
// ─────────────────────────────────────────────────────────
export async function generateVirtualTryOn(options: TryOnOptions): Promise<string> {
  const { personImageUrl, garmentImageUrl, productName } = options

  // 1. Normalize person image orientation
  let normalizedPersonUrl = personImageUrl
  let wasPortrait = true
  try {
    const norm = await normalizeImage(personImageUrl, 0)
    normalizedPersonUrl = norm.dataUrl
    wasPortrait = norm.isPortrait
  } catch (err) {
    console.warn('Image normalization note:', err)
  }

  // 2. Fetch garment as base64 for Gemini
  let garmentBase64 = ''
  try {
    garmentBase64 = await fetchImageAsBase64(garmentImageUrl)
  } catch {/* ignore */}

  const detailedPrompt = getDetailedGarmentPrompt(productName, garmentImageUrl)

  // 3. Try Gemini Vision image generation
  try {
    const geminiResult = await callGeminiTryOn(normalizedPersonUrl, garmentBase64, detailedPrompt)
    if (geminiResult) {
      const uprightResult = await autoCorrectResultOrientation(geminiResult, wasPortrait)
      return uprightResult
    }
  } catch (err) {
    console.warn('Gemini direct API note:', err)
  }

  // 4. Advanced Canvas Compositor (always available, no API needed)
  return advancedCanvasTryOn(normalizedPersonUrl, garmentImageUrl)
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function fetchImageAsBase64(url: string): Promise<string> {
  const proxied = proxyGarmentUrl(url)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const c = document.createElement('canvas')
        c.width = img.naturalWidth
        c.height = img.naturalHeight
        const ctx = c.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        resolve(c.toDataURL('image/jpeg', 0.92))
      } catch {
        reject(new Error('Canvas tainted'))
      }
    }
    img.onerror = () => {
      // Proxy fallback via fetch
      fetch(proxied)
        .then(r => r.blob())
        .then(blob => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
        .catch(reject)
    }
    img.src = proxied
  })
}

/**
 * Rewrite external CDN URLs to go through local Vite proxy (avoids canvas CORS errors).
 * In production, garment images should be stored in Supabase Storage instead.
 */
function proxyGarmentUrl(url: string): string {
  if (url.includes('m.media-amazon.com')) {
    return url.replace('https://m.media-amazon.com', '/img-proxy')
  }
  if (url.includes('images.unsplash.com')) {
    return url.replace('https://images.unsplash.com', '/unsplash-proxy')
  }
  // data URLs and local blob URLs pass through unchanged
  return url
}

/**
 * Load an image with crossOrigin=anonymous so canvas.getImageData() works.
 * Returns { img, canRead } where canRead=false if pixel-reading is blocked by CORS.
 */
function loadImage(src: string): Promise<{ img: HTMLImageElement; canRead: boolean }> {
  const proxied = proxyGarmentUrl(src)
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve({ img, canRead: true })
    img.onerror = () => {
      // Proxied load failed — try without crossOrigin as a display-only fallback
      const img2 = new Image()
      img2.onload = () => resolve({ img: img2, canRead: false })
      img2.onerror = () => resolve({ img: img2, canRead: false })
      img2.src = src  // try original URL without proxy
    }
    img.src = proxied
  })
}

// ─────────────────────────────────────────────────────────
// Advanced Canvas Try-On Compositor
// ─────────────────────────────────────────────────────────
/**
 * Steps:
 * A. Load person + garment
 * B. Remove garment background using flood-fill from all 4 corners
 * C. Scale the cut-out garment to span from ~neck position to bottom of canvas
 * D. Draw base person photo
 * E. Draw cut-out garment on top
 * F. Overdraw person's head+neck region with soft bottom fade so the collar
 *    naturally "sits under" the chin
 * G. Apply soft-light shadow pass for fabric depth
 */
async function advancedCanvasTryOn(
  personUrl: string,
  garmentUrl: string,
): Promise<string> {
  try {
    const [personResult, garmentResult] = await Promise.all([
      loadImage(personUrl).catch(() => null),
      loadImage(garmentUrl).catch(() => null),
    ])

    if (!personResult || !garmentResult) return personUrl

    const personImg = personResult.img
    const garmentImg = garmentResult.img
    const garmentCanRead = garmentResult.canRead

    // ── Canvas size (output) ──────────────────────────────
    const OUT_W = 800
    const OUT_H = Math.round((personImg.naturalHeight / personImg.naturalWidth) * OUT_W) || 1067

    // ── Step B: Cut garment background ───────────────────
    const gW = garmentImg.naturalWidth  || garmentImg.width  || 600
    const gH = garmentImg.naturalHeight || garmentImg.height || 700

    const gCanvas = document.createElement('canvas')
    gCanvas.width  = gW
    gCanvas.height = gH
    const gCtx = gCanvas.getContext('2d', { willReadFrequently: true })!
    gCtx.drawImage(garmentImg, 0, 0, gW, gH)

    // Only attempt background removal if we can read pixels (CORS OK)
    if (garmentCanRead) {
      try {
        const imgData = gCtx.getImageData(0, 0, gW, gH)
        removeBackground(imgData)
        gCtx.putImageData(imgData, 0, 0)
      } catch {
        // Security error — canvas tainted; skip background removal
      }
    }

    // ── Step C: Garment placement ────────────────────────
    const garmentRenderW = OUT_W * 0.88
    const garmentRenderH = (gH / gW) * garmentRenderW
    const garmentX = (OUT_W - garmentRenderW) / 2
    const garmentY = OUT_H * 0.34  // collar at ~34% from top (collarbone)

    // ── Step D-G: Main canvas ─────────────────────────────
    const canvas = document.createElement('canvas')
    canvas.width  = OUT_W
    canvas.height = OUT_H
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!

    // D: Draw person photo as base
    ctx.drawImage(personImg, 0, 0, OUT_W, OUT_H)

    // E: Draw the cut garment over the torso with shadow
    ctx.save()
    ctx.shadowColor   = 'rgba(0,0,0,0.28)'
    ctx.shadowBlur    = 18
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 6
    ctx.drawImage(gCanvas, garmentX, garmentY, garmentRenderW, garmentRenderH)
    ctx.restore()

    // F: Re-draw person's head & upper shoulder region on top of the garment
    const headRegionH = OUT_H * 0.44
    const headRegionX = OUT_W * 0.10
    const headRegionW = OUT_W * 0.80

    const headCanvas = document.createElement('canvas')
    headCanvas.width  = headRegionW
    headCanvas.height = headRegionH
    const hCtx = headCanvas.getContext('2d')!

    hCtx.drawImage(
      personImg,
      (headRegionX / OUT_W) * personImg.naturalWidth,
      0,
      (headRegionW / OUT_W) * personImg.naturalWidth,
      (headRegionH / OUT_H) * personImg.naturalHeight,
      0, 0, headRegionW, headRegionH
    )

    // Feather bottom of head region into the collar (fade starts at 72%)
    const grad = hCtx.createLinearGradient(0, headRegionH * 0.72, 0, headRegionH)
    grad.addColorStop(0, 'rgba(0,0,0,1)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    hCtx.globalCompositeOperation = 'destination-in'
    hCtx.fillStyle = grad
    hCtx.fillRect(0, 0, headRegionW, headRegionH)

    ctx.drawImage(headCanvas, headRegionX, 0, headRegionW, headRegionH)

    // G: Subtle soft-light blend for natural lighting
    ctx.save()
    ctx.globalCompositeOperation = 'soft-light'
    ctx.globalAlpha = 0.18
    ctx.drawImage(personImg, 0, 0, OUT_W, OUT_H)
    ctx.restore()

    // Watermark
    ctx.save()
    ctx.fillStyle = 'rgba(15,23,42,0.85)'
    const bW = 160, bH = 28, bX = OUT_W - bW - 14, bY = OUT_H - bH - 14
    ctx.beginPath()
    ctx.roundRect(bX, bY, bW, bH, 6)
    ctx.fill()
    ctx.fillStyle = '#ccff00'
    ctx.font = 'bold 11px sans-serif'
    ctx.fillText('✨ TryOnX AI Studio', bX + 10, bY + 18)
    ctx.restore()

    return canvas.toDataURL('image/jpeg', 0.94)
  } catch (err) {
    console.warn('Canvas compositor error:', err)
    return personUrl
  }
}

// ─────────────────────────────────────────────────────────
// Background Removal: Flood-fill from all 4 corners
// ─────────────────────────────────────────────────────────
/**
 * Two-pass background removal:
 * Pass 1 – Flood-fill from corners using BFS: pixels whose color is
 *           within FLOOD_TOLERANCE of the corner seed are marked transparent.
 *           This correctly handles gradients and soft shadows around the backdrop.
 * Pass 2 – Also erase any remaining near-pure-white or near-pure-grey pixels
 *           that weren't caught by flood-fill (studio gradients at center edges).
 */
function removeBackground(imgData: ImageData): void {
  const { data, width, height } = imgData
  const visited = new Uint8Array(width * height)

  // Sample backdrop color from each corner (average of a 3×3 patch)
  const cornerColors = [
    samplePatch(data, width, 0, 0),
    samplePatch(data, width, width - 3, 0),
    samplePatch(data, width, 0, height - 3),
    samplePatch(data, width, width - 3, height - 3),
  ]

  const FLOOD_TOLERANCE = 32  // how similar a pixel must be to the backdrop

  // Flood-fill BFS from each corner
  const queue: number[] = []
  function enqueue(x: number, y: number) {
    if (x < 0 || x >= width || y < 0 || y >= height) return
    const idx = y * width + x
    if (visited[idx]) return

    const pIdx = idx * 4
    const pr = data[pIdx], pg = data[pIdx + 1], pb = data[pIdx + 2]

    // Check against all corner colors — mark visited ONLY if it matches backdrop
    const matchesBackdrop = cornerColors.some(([cr, cg, cb]) => {
      return Math.abs(pr - cr) <= FLOOD_TOLERANCE &&
             Math.abs(pg - cg) <= FLOOD_TOLERANCE &&
             Math.abs(pb - cb) <= FLOOD_TOLERANCE
    })

    visited[idx] = 1  // Always mark visited to avoid repeated checking

    if (matchesBackdrop) {
      data[pIdx + 3] = 0
      queue.push(x, y)  // Only expand flood fill from matching pixels
    }
  }

  // Seed all 4 corners + top/bottom/left/right edges every 10px
  for (let x = 0; x < width; x += 8) {
    enqueue(x, 0)
    enqueue(x, height - 1)
  }
  for (let y = 0; y < height; y += 8) {
    enqueue(0, y)
    enqueue(width - 1, y)
  }

  let qi = 0
  while (qi < queue.length) {
    const x = queue[qi++]
    const y = queue[qi++]
    enqueue(x + 1, y)
    enqueue(x - 1, y)
    enqueue(x, y + 1)
    enqueue(x, y - 1)
  }

  // Pass 2: Hard-erase remaining near-pure-white pixels (studio backdrop that
  // flood-fill may have missed because of soft vignette or compressed JPEG artifacts)
  for (let i = 0; i < width * height; i++) {
    if (visited[i]) continue
    const p = i * 4
    const r = data[p], g = data[p + 1], b = data[p + 2]
    const isNearWhite = r > 230 && g > 230 && b > 230 && Math.abs(r - g) < 20 && Math.abs(r - b) < 20
    if (isNearWhite) {
      data[p + 3] = 0
    }
  }

  // Pass 3: Feather hard edges — apply anti-alias by slightly reducing alpha near
  // any alpha-0 neighbor (soft 1-px fringe removal)
  featherEdges(data, width, height)
}

function samplePatch(
  data: Uint8ClampedArray,
  width: number,
  x0: number,
  y0: number
): [number, number, number] {
  let r = 0, g = 0, b = 0, count = 0
  for (let dy = 0; dy < 4; dy++) {
    for (let dx = 0; dx < 4; dx++) {
      const i = ((y0 + dy) * width + (x0 + dx)) * 4
      r += data[i]; g += data[i + 1]; b += data[i + 2]
      count++
    }
  }
  return [Math.round(r / count), Math.round(g / count), Math.round(b / count)]
}

function featherEdges(data: Uint8ClampedArray, width: number, height: number): void {
  // Shrink semi-transparent fringe pixels to avoid harsh sticker borders
  const FRINGE_ALPHA = 120
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4
      if (data[i + 3] === 0) continue  // already transparent
      // Check neighbors
      const n = ((y - 1) * width + x) * 4
      const s = ((y + 1) * width + x) * 4
      const w = (y * width + (x - 1)) * 4
      const e = (y * width + (x + 1)) * 4
      const transparentNeighbors =
        (data[n + 3] === 0 ? 1 : 0) +
        (data[s + 3] === 0 ? 1 : 0) +
        (data[w + 3] === 0 ? 1 : 0) +
        (data[e + 3] === 0 ? 1 : 0)
      if (transparentNeighbors >= 2) {
        data[i + 3] = Math.min(data[i + 3], FRINGE_ALPHA)
      } else if (transparentNeighbors === 1) {
        data[i + 3] = Math.min(data[i + 3], 200)
      }
    }
  }
}
