/**
 * Image Orientation and Canvas Normalization Utilities
 * Solves EXIF rotation issues, handles upright normalization, and provides manual/auto rotation.
 * Normalizes input photos to native 3:4 aspect ratio (768x1024) to eliminate compression/squashing.
 */

export interface NormalizedImageResult {
  dataUrl: string
  width: number
  height: number
  isPortrait: boolean
}

/**
 * Normalizes an image (from File or URL) onto an HTML5 Canvas.
 * Bakes true physical orientation and 3:4 aspect ratio into the pixel buffer
 * so IDM-VTON neural models and browsers see natural, uncompressed human body proportions.
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

      const rotatedW = is90or270 ? origHeight : origWidth
      const rotatedH = is90or270 ? origWidth : origHeight

      // Compute source crop rect to get natural 3:4 ratio without squashing or stretching
      const targetRatio = 3 / 4 // 0.75
      const currentRatio = rotatedW / rotatedH
      let sW = rotatedW
      let sH = rotatedH
      let sX = 0
      let sY = 0

      if (currentRatio < targetRatio) {
        // Narrower/taller than 3:4 (e.g. phone portrait 9:16)
        sH = Math.round(rotatedW / targetRatio)
        sY = Math.max(0, Math.round((rotatedH - sH) * 0.12)) // anchor near top to keep head & shoulders
        if (sY + sH > rotatedH) sY = rotatedH - sH
      } else if (currentRatio > targetRatio) {
        // Wider than 3:4
        sW = Math.round(rotatedH * targetRatio)
        sX = Math.round((rotatedW - sW) / 2) // center horizontally
      }

      // Native 3:4 resolution for IDM-VTON
      const CANVAS_W = 768
      const CANVAS_H = 1024

      const canvas = document.createElement('canvas')
      canvas.width = CANVAS_W
      canvas.height = CANVAS_H

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) {
        throw new Error('Canvas 2D context unavailable')
      }

      // Fill with neutral backdrop
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      if (normalizedRotation !== 0) {
        const rotCanvas = document.createElement('canvas')
        rotCanvas.width = rotatedW
        rotCanvas.height = rotatedH
        const rCtx = rotCanvas.getContext('2d')!
        rCtx.translate(rotatedW / 2, rotatedH / 2)
        rCtx.rotate((normalizedRotation * Math.PI) / 180)
        rCtx.drawImage(imageSource, -origWidth / 2, -origHeight / 2, origWidth, origHeight)

        ctx.drawImage(rotCanvas, sX, sY, sW, sH, 0, 0, CANVAS_W, CANVAS_H)
      } else {
        ctx.drawImage(imageSource, sX, sY, sW, sH, 0, 0, CANVAS_W, CANVAS_H)
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
      resolve({
        dataUrl,
        width: CANVAS_W,
        height: CANVAS_H,
        isPortrait: true,
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
 * If the input user photo was portrait, but the AI engine returned a landscape image,
 * automatically rotate it 90 degrees clockwise.
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
