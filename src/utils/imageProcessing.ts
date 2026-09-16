// Client-side pure HTML5 Canvas Image Processing Engine

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NameDateConfig {
  enabled: boolean;
  name: string;
  date: string;
  preset: 'official' | 'simple' | 'minimal' | 'bold';
  position: 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right';
  fontSize: number; // 12 to 36
  fontFamily: string;
  stripHeightPercent?: number;
}

export interface CompressResult {
  blob: Blob;
  dataUrl: string;
  fileSizeBytes: number;
  fileSizeKb: number;
  dimensions: ImageDimensions;
  qualityUsed: number;
  withinTarget: boolean;
  message?: string;
}

// Load an image from file or URL
export function loadImage(src: string | File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to decode image.'));

    if (typeof src === 'string') {
      img.src = src;
    } else {
      const url = URL.createObjectURL(src);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.src = url;
    }
  });
}

// Get file size in readable formatted string
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Render processed image with all filters, crop, resize, background, name/date
export async function renderProcessedCanvas(options: {
  image: HTMLImageElement;
  targetWidth: number;
  targetHeight: number;
  crop?: CropRect;
  rotation?: number; // 0, 90, 180, 270
  flipH?: boolean;
  flipV?: boolean;
  backgroundColor?: string; // 'original', 'white', 'transparent', or hex
  nameDate?: NameDateConfig;
  brightness?: number; // -50 to +50
  contrast?: number; // -50 to +50
  grayscale?: boolean;
  documentClean?: boolean; // binarize / threshold scanner style
}): Promise<HTMLCanvasElement> {
  const {
    image,
    targetWidth,
    targetHeight,
    crop,
    rotation = 0,
    flipH = false,
    flipV = false,
    backgroundColor = 'original',
    nameDate,
    brightness = 0,
    contrast = 0,
    grayscale = false,
    documentClean = false,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(targetWidth));
  canvas.height = Math.max(1, Math.round(targetHeight));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not create canvas context');

  // Background color handling
  if (backgroundColor === 'white') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (backgroundColor === 'transparent') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else if (backgroundColor && backgroundColor !== 'original') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Transformations
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Apply crop / source coords
  const sx = crop ? crop.x : 0;
  const sy = crop ? crop.y : 0;
  const sWidth = crop ? crop.width : image.naturalWidth;
  const sHeight = crop ? crop.height : image.naturalHeight;

  // Handle rotation and flip around center
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotation) {
    ctx.rotate((rotation * Math.PI) / 180);
  }
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  // If rotated 90 or 270 degrees, dimensions invert
  const isRotatedQuarter = rotation === 90 || rotation === 270;
  const drawWidth = isRotatedQuarter ? canvas.height : canvas.width;
  const drawHeight = isRotatedQuarter ? canvas.width : canvas.height;

  ctx.drawImage(
    image,
    sx,
    sy,
    sWidth,
    sHeight,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight
  );
  ctx.restore();

  // Document cleanup / scanner thresholding / grayscale / contrast filter
  if (grayscale || documentClean || brightness !== 0 || contrast !== 0) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < d.length; i += 4) {
      let r = d[i];
      let g = d[i + 1];
      let b = d[i + 2];

      if (brightness !== 0) {
        r += brightness;
        g += brightness;
        b += brightness;
      }

      if (contrast !== 0) {
        r = contrastFactor * (r - 128) + 128;
        g = contrastFactor * (g - 128) + 128;
        b = contrastFactor * (b - 128) + 128;
      }

      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      if (documentClean) {
        // Document scanner mode: High threshold binarization
        const val = lum > 165 ? 255 : lum < 90 ? 0 : lum * 0.7;
        d[i] = val;
        d[i + 1] = val;
        d[i + 2] = val;
      } else if (grayscale) {
        d[i] = lum;
        d[i + 1] = lum;
        d[i + 2] = lum;
      } else {
        d[i] = Math.min(255, Math.max(0, r));
        d[i + 1] = Math.min(255, Math.max(0, g));
        d[i + 2] = Math.min(255, Math.max(0, b));
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // Name & Date Overlay (Government/Exam standard)
  if (nameDate && nameDate.enabled && (nameDate.name.trim() || nameDate.date.trim())) {
    drawNameAndDate(ctx, canvas.width, canvas.height, nameDate);
  }

  return canvas;
}

// Draw Name & Date onto canvas with professional formatting
function drawNameAndDate(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: NameDateConfig
) {
  const { name, date, preset, position, fontSize = 16, fontFamily = 'sans-serif' } = config;
  ctx.save();

  // Dynamic strip height based on canvas size
  const stripHeight = Math.max(34, Math.round(height * 0.14));
  const isBottom = position.startsWith('bottom');

  if (preset === 'official') {
    // Official Exam Format: solid white background strip with solid black border & text
    const stripY = isBottom ? height - stripHeight : 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, stripY, width, stripHeight);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, stripY, width, stripHeight);

    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const calculatedFontSize = Math.max(11, Math.min(fontSize, Math.round(stripHeight * 0.32)));
    ctx.font = `700 ${calculatedFontSize}px ${fontFamily}`;

    if (name && date) {
      ctx.fillText(name.toUpperCase(), width / 2, stripY + stripHeight * 0.35);
      ctx.font = `600 ${Math.round(calculatedFontSize * 0.9)}px ${fontFamily}`;
      ctx.fillText(`D.O.P: ${date}`, width / 2, stripY + stripHeight * 0.75);
    } else {
      ctx.fillText((name || date).toUpperCase(), width / 2, stripY + stripHeight / 2);
    }
  } else if (preset === 'simple') {
    // Clean semi-transparent dark banner
    const stripY = isBottom ? height - stripHeight : 0;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, stripY, width, stripHeight);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const calculatedFontSize = Math.max(12, Math.min(fontSize, Math.round(stripHeight * 0.34)));
    ctx.font = `600 ${calculatedFontSize}px ${fontFamily}`;

    if (name && date) {
      ctx.fillText(name, width / 2, stripY + stripHeight * 0.36);
      ctx.font = `400 ${Math.round(calculatedFontSize * 0.85)}px ${fontFamily}`;
      ctx.fillText(date, width / 2, stripY + stripHeight * 0.74);
    } else {
      ctx.fillText(name || date, width / 2, stripY + stripHeight / 2);
    }
  } else if (preset === 'minimal') {
    // Text directly overlaid with subtle drop shadow
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    let posX = width / 2;
    let textAlign: CanvasTextAlign = 'center';
    if (position.includes('left')) {
      posX = 16;
      textAlign = 'left';
    } else if (position.includes('right')) {
      posX = width - 16;
      textAlign = 'right';
    }

    const posY = isBottom ? height - 20 : 30;
    ctx.textAlign = textAlign;
    ctx.font = `600 ${fontSize}px ${fontFamily}`;
    const textStr = [name, date].filter(Boolean).join(' • ');
    ctx.fillText(textStr, posX, posY);
  } else if (preset === 'bold') {
    // High contrast black pill/badge
    const textStr = [name, date].filter(Boolean).join(' | ');
    ctx.font = `700 ${fontSize}px ${fontFamily}`;
    const textWidth = ctx.measureText(textStr).width;
    const badgeW = textWidth + 24;
    const badgeH = fontSize + 16;
    const badgeX = (width - badgeW) / 2;
    const badgeY = isBottom ? height - badgeH - 12 : 12;

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(textStr, width / 2, badgeY + badgeH / 2);
  }

  ctx.restore();
}

// Compress canvas to target file size with binary search
export async function compressCanvasToTarget(
  canvas: HTMLCanvasElement,
  targetSizeKb: number,
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  onProgress?: (percent: number) => void
): Promise<CompressResult> {
  // If format is PNG, PNG is lossless so quality param is ignored by browser.
  // We handle PNG by resizing slightly if required, or converting to WebP/JPG if over.
  const targetBytes = targetSizeKb * 1024;

  if (format === 'image/png') {
    let currentCanvas = canvas;
    let blob = await canvasToBlob(currentCanvas, 'image/png', 1.0);

    let attempts = 0;
    while (blob.size > targetBytes && attempts < 5 && (currentCanvas.width > 200 || currentCanvas.height > 200)) {
      attempts++;
      onProgress?.(Math.round((attempts / 5) * 100));
      const scale = 0.85;
      const downCanvas = document.createElement('canvas');
      downCanvas.width = Math.round(currentCanvas.width * scale);
      downCanvas.height = Math.round(currentCanvas.height * scale);
      const ctx = downCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(currentCanvas, 0, 0, downCanvas.width, downCanvas.height);
        currentCanvas = downCanvas;
        blob = await canvasToBlob(currentCanvas, 'image/png', 1.0);
      }
    }

    const dataUrl = URL.createObjectURL(blob);
    return {
      blob,
      dataUrl,
      fileSizeBytes: blob.size,
      fileSizeKb: Math.round(blob.size / 1024),
      dimensions: { width: currentCanvas.width, height: currentCanvas.height },
      qualityUsed: 1.0,
      withinTarget: blob.size <= targetBytes,
      message: blob.size <= targetBytes ? 'Within target' : 'PNG format is lossless and larger than target. Consider JPG.',
    };
  }

  // Binary search for JPEG or WebP quality
  let minQ = 0.05;
  let maxQ = 0.98;
  let bestBlob: Blob | null = null;
  let bestQuality = 0.8;
  let iterations = 0;
  const maxIterations = 8;

  while (iterations < maxIterations) {
    iterations++;
    const currentQ = (minQ + maxQ) / 2;
    onProgress?.(Math.round((iterations / maxIterations) * 70));

    const testBlob = await canvasToBlob(canvas, format, currentQ);
    bestQuality = currentQ;

    if (testBlob.size <= targetBytes) {
      bestBlob = testBlob;
      // Try to get higher quality while staying under target
      minQ = currentQ;
    } else {
      // Too big, reduce quality
      maxQ = currentQ;
    }

    if (maxQ - minQ < 0.04) {
      break;
    }
  }

  // If even lowest quality is above targetBytes, downsample canvas resolution iteratively
  let finalCanvas = canvas;
  if (!bestBlob || bestBlob.size > targetBytes) {
    let downAttempts = 0;
    while (downAttempts < 4) {
      downAttempts++;
      const scale = 0.82;
      const downCanvas = document.createElement('canvas');
      downCanvas.width = Math.round(finalCanvas.width * scale);
      downCanvas.height = Math.round(finalCanvas.height * scale);
      const ctx = downCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(finalCanvas, 0, 0, downCanvas.width, downCanvas.height);
        finalCanvas = downCanvas;
        const testBlob = await canvasToBlob(finalCanvas, format, 0.4);
        if (testBlob.size <= targetBytes) {
          bestBlob = testBlob;
          break;
        }
      }
    }
  }

  if (!bestBlob) {
    bestBlob = await canvasToBlob(finalCanvas, format, 0.3);
  }

  onProgress?.(100);
  const dataUrl = URL.createObjectURL(bestBlob);
  const sizeKb = Math.round(bestBlob.size / 1024);

  return {
    blob: bestBlob,
    dataUrl,
    fileSizeBytes: bestBlob.size,
    fileSizeKb: sizeKb,
    dimensions: { width: finalCanvas.width, height: finalCanvas.height },
    qualityUsed: Math.round(bestQuality * 100),
    withinTarget: bestBlob.size <= targetBytes,
    message: bestBlob.size <= targetBytes ? 'Within target file size' : `Smallest achieved: ${sizeKb} KB`,
  };
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format = 'image/jpeg',
  quality = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      },
      format,
      quality
    );
  });
}

// Automatic whitespace trimming for signatures
export function autoTrimSignature(canvas: HTMLCanvasElement): {
  crop: CropRect;
  hasInk: boolean;
} {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { crop: { x: 0, y: 0, width: canvas.width, height: canvas.height }, hasInk: false };

  const { width, height } = canvas;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let inkCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Pixel is ink if non-transparent and darker than typical off-white paper
      // (either alpha > 30 and lum < 225)
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const isInk = a > 40 && lum < 235;

      if (isInk) {
        inkCount++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (inkCount < 50 || minX >= maxX || minY >= maxY) {
    return {
      crop: { x: 0, y: 0, width, height },
      hasInk: false,
    };
  }

  // Add 12px breathing room margin
  const pad = 14;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(width - cropX, maxX - minX + pad * 2);
  const cropH = Math.min(height - cropY, maxY - minY + pad * 2);

  return {
    crop: { x: cropX, y: cropY, width: cropW, height: cropH },
    hasInk: true,
  };
}

// Clean signature background: make paper pure white or transparent, enhance dark strokes
export function cleanSignatureBackground(
  canvas: HTMLCanvasElement,
  mode: 'pure-white' | 'transparent' | 'enhanced-contrast'
): HTMLCanvasElement {
  const output = document.createElement('canvas');
  output.width = canvas.width;
  output.height = canvas.height;
  const ctx = output.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;

  ctx.drawImage(canvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (mode === 'transparent') {
      // If close to white / paper background, make transparent
      if (lum > 220) {
        d[i + 3] = 0;
      } else {
        // Deepen the ink
        const darkFactor = Math.max(0, (lum - 60) / 160);
        d[i] = Math.round(r * darkFactor);
        d[i + 1] = Math.round(g * darkFactor);
        d[i + 2] = Math.round(b * darkFactor);
        d[i + 3] = 255;
      }
    } else if (mode === 'pure-white') {
      // Paper background to crisp pure #ffffff
      if (lum > 210) {
        d[i] = 255;
        d[i + 1] = 255;
        d[i + 2] = 255;
      } else {
        // Deepen dark ink to crisp solid black or navy
        const inkVal = Math.max(0, lum * 0.7);
        d[i] = inkVal;
        d[i + 1] = inkVal;
        d[i + 2] = inkVal;
      }
    } else if (mode === 'enhanced-contrast') {
      // Extreme threshold for scanned documents
      const val = lum > 190 ? 255 : 0;
      d[i] = val;
      d[i + 1] = val;
      d[i + 2] = val;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return output;
}

// Download helper
export function downloadFile(blobOrUrl: Blob | string, filename: string) {
  const a = document.createElement('a');
  if (typeof blobOrUrl === 'string') {
    a.href = blobOrUrl;
  } else {
    a.href = URL.createObjectURL(blobOrUrl);
  }
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
