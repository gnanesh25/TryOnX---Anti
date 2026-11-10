/**
 * TryOnX AI Virtual Try-On Engine v6
 *
 * Strict Architectural Rules:
 * 1. Takes the user's uploaded photograph or selected model as the base image.
 * 2. Takes the selected clothing product image as the garment reference.
 * 3. Uses genuine pretrained neural virtual try-on (IDM-VTON / CatVTON architecture)
 *    to detect body pose, segment clothing, and perform deep garment transfer.
 * 4. NEVER pastes a flat 2D photograph or sticker over the person.
 * 5. NEVER returns a random stranger or unrelated model.
 * 6. Preserves 100% of the user's face, identity, hair, skin tone, hands, body structure, and background.
 * 7. When public anonymous ZeroGPU quota is reached, gracefully prompts for the user's
 *    free Hugging Face token (from huggingface.co/settings/tokens) for private GPU quota.
 */

import { normalizeImage, autoCorrectResultOrientation } from './imageUtils'

export interface TryOnOptions {
  personImageUrl: string
  garmentImageUrl: string
  productName: string
  hfToken?: string
}

export const SAMPLE_MODELS = [
  {
    id: 'model-female-full',
    label: 'Female Model',
    type: 'Full Body',
    url: '/models/female-full.jpg',
    gender: 'female',
  },
  {
    id: 'model-male-full',
    label: 'Male Model',
    type: 'Full Body',
    url: '/models/male-full.jpg',
    gender: 'men',
  },
  {
    id: 'model-female-half',
    label: 'Female Model',
    type: 'Half Body',
    url: '/models/female-half.jpg',
    gender: 'female',
  },
  {
    id: 'model-male-half',
    label: 'Male Model',
    type: 'Half Body',
    url: '/models/male-half.jpg',
    gender: 'men',
  },
]

export const GARMENT_VISUAL_CATALOG: Record<string, string> = {
  // Shirts
  'deemoon': 'Navy blue, dark grey and white plaid flannel checkered button-down casual shirt with spread collar, chest pocket, long sleeves with button cuffs, relaxed fit.',
  'deelmo stylish': 'Crisp white and light beige textured linen breathable button-down casual shirt with spread collar, front pocket, long sleeves.',
  'cb-colebrook': 'Solid jet black casual button-down dress shirt with structured spread collar, long sleeves with button cuffs, clean tailored fit.',
  'deelmo casual': 'Light cream beige textured waffle-weave casual button-down shirt with spread collar and long sleeves.',
  'imperial choice': 'Rich deep maroon wine-burgundy ethnic mandarin collar kurta with intricate white floral vine embroidery cascading down the left chest and collar, stand band collar, front button placket, long sleeves.',
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
      return `${desc} (Selected garment: "${productName}"). Authentic colors, fabric texture, and silhouette from: ${garmentImageUrl}`
    }
  }
  return `Authentic clothing: "${productName}". Naturally draped on the person. Match the authentic color palette, fabric texture, neckline, collar, buttons, and patterns from ${garmentImageUrl}.`
}

/**
 * Proxy external images through local Vite dev server to prevent CORS issues.
 */
export function proxyGarmentUrl(url: string): string {
  if (url.includes('m.media-amazon.com')) {
    return url.replace('https://m.media-amazon.com', '/img-proxy')
  }
  if (url.includes('images.unsplash.com')) {
    return url.replace('https://images.unsplash.com', '/unsplash-proxy')
  }
  return url
}

/**
 * Main AI Virtual Try-On Entrypoint
 * Executes genuine neural virtual try-on via IDM-VTON / CatVTON.
 * Never performs 2D canvas overlays or returns random stranger models.
 */
export async function generateVirtualTryOn(options: TryOnOptions): Promise<{ resultUrl: string; provider: string }> {
  const { personImageUrl, garmentImageUrl, productName, hfToken } = options

  if (!personImageUrl) {
    throw new Error('Please upload or select a photograph before generating Virtual Try-On.')
  }
  if (!garmentImageUrl) {
    throw new Error('Please select an outfit to try on.')
  }

  // 1. Normalize person image orientation
  let normalizedPersonUrl = personImageUrl
  let wasPortrait = true
  try {
    const norm = await normalizeImage(personImageUrl, 0)
    normalizedPersonUrl = norm.dataUrl
    wasPortrait = norm.isPortrait
  } catch (err) {
    console.warn('[TryOnX] Note during image normalization:', err)
  }

  const detailedPrompt = getDetailedGarmentPrompt(productName, garmentImageUrl)

  // 2. Pre-fetch garment image to base64 in browser (avoids server-side Amazon CDN blocks)
  let garmentDataUrl = garmentImageUrl
  if (!garmentImageUrl.startsWith('data:')) {
    try {
      const proxiedUrl = proxyGarmentUrl(garmentImageUrl)
      const imgRes = await fetch(proxiedUrl)
      if (imgRes.ok) {
        const blob = await imgRes.blob()
        garmentDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(blob)
        })
      }
    } catch (fetchErr) {
      console.warn('[TryOnX] Note during garment pre-fetch:', fetchErr)
    }
  }

  // 3. Call Backend /api/tryon
  const activeToken = hfToken || (import.meta as any).env?.VITE_HF_TOKEN || localStorage.getItem('tryonx_hf_token') || ''
  const response = await fetch('/api/tryon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personImage: normalizedPersonUrl,
      garmentImage: garmentDataUrl,
      prompt: detailedPrompt,
      productName,
      hfToken: activeToken,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (response.ok && data?.resultUrl) {
    const uprightResult = await autoCorrectResultOrientation(data.resultUrl, wasPortrait)
    return { resultUrl: uprightResult, provider: data.provider || 'neural_idm_vton' }
  }

  // Handle specific errors cleanly without ever falling back to basic 2D stickers
  if (data?.quotaExceeded || data?.error?.includes('ZeroGPU quota')) {
    const err = new Error(
      'Hugging Face ZeroGPU quota exceeded for public anonymous requests. Please paste your free Hugging Face Access Token below to unlock dedicated GPU quota for genuine AI Virtual Try-On.'
    )
    ;(err as any).requiresToken = true
    throw err
  }

  throw new Error(
    data?.error ||
    'AI Virtual Try-On service is temporarily busy. Please ensure your photo clearly shows your upper body/pose and try again in a few moments.'
  )
}
