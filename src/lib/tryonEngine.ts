/**
 * TryOnX AI Virtual Try-On Engine v4
 * Powered by pretrained IDM-VTON (Diffusion-based Virtual Try-On Network).
 *
 * Architecture:
 * 1. Takes the uploaded user photo as the base human image.
 * 2. Takes the selected product image as the target garment reference.
 * 3. Uses genuine pretrained AI virtual try-on (IDM-VTON / CatVTON architecture)
 *    to detect body pose, segment the upper garment region, and perform image-to-image
 *    garment transfer with natural fabric drape, folds, shadows, and contours.
 * 4. Preserves 100% of the user's face, hair, arms, hands, pose, and background.
 * 5. Replaces basic canvas cutouts and prevents overlapping/stickers entirely.
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
      return `${desc} (Selected garment: "${productName}"). Strictly preserve the authentic colors, embroidery, fabric texture, and silhouette from the product reference: ${garmentImageUrl}`
    }
  }
  return `Authentic clothing: "${productName}". Naturally draped on the person. Match the authentic color palette, fabric texture, neckline, collar, buttons, and patterns of the selected garment shown in ${garmentImageUrl}.`
}

/**
 * Converts a data URL or remote URL to a Web standard Blob.
 */
async function toBlob(url: string): Promise<Blob> {
  if (url.startsWith('data:')) {
    const parts = url.split(',')
    const mimeMatch = parts[0].match(/:(.*?);/)
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
    const bstr = atob(parts[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  const proxiedUrl = proxyGarmentUrl(url)
  const res = await fetch(proxiedUrl)
  if (!res.ok) throw new Error(`Could not fetch image at ${url}`)
  return res.blob()
}

/**
 * Proxy external images through local Vite dev server to prevent CORS issues.
 */
function proxyGarmentUrl(url: string): string {
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
 * Executes genuine image-to-image garment transfer using IDM-VTON.
 */
export async function generateVirtualTryOn(options: TryOnOptions): Promise<string> {
  const { personImageUrl, garmentImageUrl, productName } = options

  if (!personImageUrl) {
    throw new Error('Please upload or select a photograph before generating Virtual Try-On.')
  }
  if (!garmentImageUrl) {
    throw new Error('Please select an outfit to try on.')
  }

  // 1. Normalize person image orientation and ensure proper resolution
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

  // 2. Primary Method: Call backend endpoint /api/tryon
  try {
    const response = await fetch('/api/tryon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personImage: normalizedPersonUrl,
        garmentImage: garmentImageUrl,
        prompt: detailedPrompt,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      if (data?.resultUrl) {
        const uprightResult = await autoCorrectResultOrientation(data.resultUrl, wasPortrait)
        return uprightResult
      }
      if (data?.error) {
        console.warn('[TryOnX] Backend /api/tryon returned error:', data.error)
      }
    }
  } catch (backendErr) {
    console.warn('[TryOnX] Backend /api/tryon call failed, attempting client-side fallback:', backendErr)
  }

  // 3. Fallback Method: Direct client-side connection to IDM-VTON via @gradio/client
  try {
    console.log('[TryOnX] Initializing direct client-side IDM-VTON inference...')
    const { Client, handle_file } = await import('@gradio/client')
    const [personBlob, garmentBlob] = await Promise.all([
      toBlob(normalizedPersonUrl),
      toBlob(garmentImageUrl),
    ])

    const app = await Client.connect('yisol/IDM-VTON')
    const prediction = (await app.predict('/tryon', [
      {
        background: handle_file(personBlob),
        layers: [],
        composite: null,
      },
      handle_file(garmentBlob),
      detailedPrompt,
      true, // is_checked (auto-masking)
      false, // is_checked_crop
      25, // denoise_steps
      42, // seed
    ])) as any

    const outData = prediction?.data?.[0]
    const outUrl = outData?.url || (typeof outData === 'string' ? outData : null)

    if (outUrl) {
      const imgRes = await fetch(outUrl)
      const blob = await imgRes.blob()
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })

      const uprightResult = await autoCorrectResultOrientation(dataUrl, wasPortrait)
      return uprightResult
    }
  } catch (clientErr: any) {
    console.error('[TryOnX] Client-side IDM-VTON inference error:', clientErr)
  }

  // 4. If genuine AI try-on cannot generate an image, throw a descriptive user-facing error
  // Never return an overlay sticker or the original photo!
  throw new Error(
    'AI Virtual Try-On failed to process this garment onto the photograph. The neural IDM-VTON model could not detect a compatible body pose or the service is temporarily busy. Please ensure your photo clearly shows your upper body/pose and try again in a few moments.'
  )
}
