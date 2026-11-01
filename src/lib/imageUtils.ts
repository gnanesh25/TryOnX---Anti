/**
 * Image Orientation and Canvas Normalization Utilities
 * Solves EXIF rotation issues, handles upright normalization, and provides manual/auto rotation.
 */

export interface NormalizedImageResult {
  dataUrl: string
  width: number
  height: number
  isPortrait: boolean
}

/**
 * Normalizes an image (from File or URL) onto an HTML5 Canvas.
 * Bakes the true physical orientation into the pixel buffer so AI models and browsers
 * see the image genuinely upright without relying on fragile EXIF metadata.
 */
export async function normalizeImage(
  source: File | string,
  rotateClockwiseDegrees: number = 0
): Promise<NormalizedImageResult> {
  return new Promise(async (resolve, reject) => {
    try {
      let imageSource: CanvasImageSource

      if (typeof source !== 'string') {
        if ('createImageBitmap' in window) {
          try {
            // createImageBitmap automatically respects EXIF orientation by default
            imageSource = await createImageBitmap(source, { imageOrientation: 'from-image' })
          } catch {
            imageSource = await loadImageElement(URL.createObjectURL(source))
          }
        } else {
          imageSource = await loadImageElement(URL.createObjectURL(source))
        }
      } else {
        imageSource = await loadImageElement(source)
      }

      const origWidth = 'width' in imageSource ? (imageSource as any).width : 800
      const origHeight = 'height' in imageSource ? (imageSource as any).height : 1000

      // Normalize rotation degrees to [0, 90, 180, 270]
      const normalizedRotation = ((rotateClockwiseDegrees % 360) + 360) % 360
      const is90or270 = normalizedRotation === 90 || normalizedRotation === 270

      // Scale down large images (e.g. 12MP phone photos) to max 1200px for AI efficiency & fidelity
      const MAX_DIM = 1200
      let targetWidth = origWidth
      let targetHeight = origHeight

      if (targetWidth > MAX_DIM || targetHeight > MAX_DIM) {
        if (targetWidth > targetHeight) {
          targetHeight = Math.round((targetHeight * MAX_DIM) / targetWidth)
          targetWidth = MAX_DIM
        } else {
          targetWidth = Math.round((targetWidth * MAX_DIM) / targetHeight)
          targetHeight = MAX_DIM
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = is90or270 ? targetHeight : targetWidth
      canvas.height = is90or270 ? targetWidth : targetHeight

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) {
        throw new Error('Canvas 2D context unavailable')
      }

      // Fill canvas background with clean white for safety
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Apply rotation transformation from center
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((normalizedRotation * Math.PI) / 180)
      ctx.drawImage(
        imageSource,
        -targetWidth / 2,
        -targetHeight / 2,
        targetWidth,
        targetHeight
      )
      ctx.restore()

      const dataUrl = canvas.toDataURL('image/png')
      resolve({
        dataUrl,
        width: canvas.width,
        height: canvas.height,
        isPortrait: canvas.height >= canvas.width,
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Helper to rotate an existing image URL or base64 data URL by a specified angle (default 90 deg clockwise).
 */
export async function rotateImageDataUrl(
  dataUrl: string,
  clockwiseDegrees: number = 90
): Promise<string> {
  const norm = await normalizeImage(dataUrl, clockwiseDegrees)
  return norm.dataUrl
}

/**
 * Auto-corrects the generated virtual try-on result.
 * If the input user photo was portrait (height >= width), but the AI engine returned a landscape image
 * (width > height), automatically rotate it 90 degrees clockwise so it is never displayed sideways!
 */
export async function autoCorrectResultOrientation(
  resultDataUrl: string,
  referenceWasPortrait: boolean
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = async () => {
      const isLandscape = img.width > img.height
      // If reference was portrait but result came back landscape, rotate 90 degrees CW!
      if (referenceWasPortrait && isLandscape) {
        try {
          const corrected = await rotateImageDataUrl(resultDataUrl, 90)
          resolve(corrected)
          return
        } catch {
          // fallback to original if error
        }
      }
      resolve(resultDataUrl)
    }
    img.onerror = () => resolve(resultDataUrl)
    img.src = resultDataUrl
  })
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(new Error('Failed to load image from source: ' + e))
    img.src = src
  })
}
