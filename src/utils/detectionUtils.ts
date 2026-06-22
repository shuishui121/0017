import { Landmarks } from '@/types';

interface PixelData {
  r: number;
  g: number;
  b: number;
  a: number;
}

function getPixel(imageData: ImageData, x: number, y: number): PixelData {
  const idx = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[idx],
    g: imageData.data[idx + 1],
    b: imageData.data[idx + 2],
    a: imageData.data[idx + 3],
  };
}

function isSkinColor(pixel: PixelData): boolean {
  const { r, g, b } = pixel;
  const ycrcb = {
    Y: 0.299 * r + 0.587 * g + 0.114 * b,
    Cr: r - 0.4187 * g - 0.0813 * b + 128,
    Cb: b - 0.1687 * r - 0.3313 * g + 128,
  };
  return (
    ycrcb.Cr > 133 && ycrcb.Cr < 173 &&
    ycrcb.Cb > 77 && ycrcb.Cb < 127 &&
    ycrcb.Y > 60
  );
}

export function detectLandmarks(
  imageData: ImageData,
  canvasWidth: number,
  canvasHeight: number
): Landmarks {
  const width = imageData.width;
  const height = imageData.height;
  const scaleX = canvasWidth / width;
  const scaleY = canvasHeight / height;

  const skinPixels: { x: number; y: number }[] = [];
  const horizontalProjection: number[] = new Array(height).fill(0);
  const verticalProjection: number[] = new Array(width).fill(0);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = getPixel(imageData, x, y);
      if (pixel.a > 50 && isSkinColor(pixel)) {
        skinPixels.push({ x, y });
        horizontalProjection[y]++;
        verticalProjection[x]++;
      }
    }
  }

  let faceTop = 0;
  let faceBottom = height - 1;
  let faceLeft = 0;
  let faceRight = width - 1;

  const threshold = Math.max(...horizontalProjection) * 0.1;
  for (let y = 0; y < height; y++) {
    if (horizontalProjection[y] > threshold) {
      faceTop = y;
      break;
    }
  }
  for (let y = height - 1; y >= 0; y--) {
    if (horizontalProjection[y] > threshold) {
      faceBottom = y;
      break;
    }
  }

  const vThreshold = Math.max(...verticalProjection) * 0.1;
  for (let x = 0; x < width; x++) {
    if (verticalProjection[x] > vThreshold) {
      faceLeft = x;
      break;
    }
  }
  for (let x = width - 1; x >= 0; x--) {
    if (verticalProjection[x] > vThreshold) {
      faceRight = x;
      break;
    }
  }

  const faceCenterX = (faceLeft + faceRight) / 2;
  const faceCenterY = (faceTop + faceBottom) / 2;
  const faceHeight = faceBottom - faceTop;

  const neckBaseY = Math.min(faceBottom + faceHeight * 0.25, height - 1);
  const neckBaseX = faceCenterX;

  const shoulderY = Math.min(neckBaseY + faceHeight * 0.35, height - 1);
  const faceWidth = faceRight - faceLeft;
  
  let leftShoulderX = Math.max(faceLeft - faceWidth * 0.6, 0);
  let rightShoulderX = Math.min(faceRight + faceWidth * 0.6, width - 1);

  const shoulderSearchStart = Math.max(shoulderY - 20, 0);
  const shoulderSearchEnd = Math.min(shoulderY + 20, height - 1);
  
  let maxLeftChange = 0;
  let maxRightChange = 0;
  
  for (let y = shoulderSearchStart; y < shoulderSearchEnd; y++) {
    let leftEdge = faceLeft - faceWidth * 0.3;
    for (let x = Math.floor(faceLeft - faceWidth * 0.8); x < faceLeft; x++) {
      if (x < 0) continue;
      const pixel = getPixel(imageData, x, y);
      const nextPixel = getPixel(imageData, Math.min(x + 1, width - 1), y);
      const brightnessDiff = Math.abs(
        (pixel.r + pixel.g + pixel.b) / 3 - 
        (nextPixel.r + nextPixel.g + nextPixel.b) / 3
      );
      if (brightnessDiff > maxLeftChange) {
        maxLeftChange = brightnessDiff;
        leftEdge = x;
      }
    }
    leftShoulderX = Math.min(leftShoulderX, leftEdge);

    let rightEdge = faceRight + faceWidth * 0.3;
    for (let x = Math.floor(faceRight + faceWidth * 0.8); x > faceRight; x--) {
      if (x >= width) continue;
      const pixel = getPixel(imageData, x, y);
      const prevPixel = getPixel(imageData, Math.max(x - 1, 0), y);
      const brightnessDiff = Math.abs(
        (pixel.r + pixel.g + pixel.b) / 3 - 
        (prevPixel.r + prevPixel.g + prevPixel.b) / 3
      );
      if (brightnessDiff > maxRightChange) {
        maxRightChange = brightnessDiff;
        rightEdge = x;
      }
    }
    rightShoulderX = Math.max(rightShoulderX, rightEdge);
  }

  const estimatedShoulderWidth = rightShoulderX - leftShoulderX;
  const expectedShoulderWidth = faceWidth * 2.2;
  
  if (estimatedShoulderWidth < expectedShoulderWidth * 0.7) {
    const centerX = (leftShoulderX + rightShoulderX) / 2;
    leftShoulderX = centerX - expectedShoulderWidth / 2;
    rightShoulderX = centerX + expectedShoulderWidth / 2;
  }

  leftShoulderX = Math.max(0, leftShoulderX);
  rightShoulderX = Math.min(width - 1, rightShoulderX);

  const confidence = Math.min(1, skinPixels.length / (width * height * 0.1));

  return {
    faceCenter: {
      x: faceCenterX * scaleX,
      y: faceCenterY * scaleY,
    },
    leftShoulder: {
      x: leftShoulderX * scaleX,
      y: shoulderY * scaleY,
    },
    rightShoulder: {
      x: rightShoulderX * scaleX,
      y: shoulderY * scaleY,
    },
    neckBase: {
      x: neckBaseX * scaleX,
      y: neckBaseY * scaleY,
    },
    confidence,
  };
}

export function detectLandmarksFromCanvas(
  canvas: HTMLCanvasElement
): Landmarks {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Cannot get canvas context');
  }
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return detectLandmarks(imageData, canvas.width, canvas.height);
}

export function calculateFitError(
  landmarks: Landmarks,
  costumeNeckX: number,
  costumeNeckY: number,
  costumeScale: number
): number {
  const neckDistance = Math.sqrt(
    Math.pow(landmarks.neckBase.x - costumeNeckX, 2) +
    Math.pow(landmarks.neckBase.y - costumeNeckY, 2)
  );
  
  const shoulderDistance = landmarks.rightShoulder.x - landmarks.leftShoulder.x;
  const expectedShoulderWidth = 200 * costumeScale;
  
  const shoulderError = Math.abs(shoulderDistance - expectedShoulderWidth) / expectedShoulderWidth;
  const neckError = neckDistance / Math.max(shoulderDistance, 1);
  
  return (shoulderError * 0.6 + neckError * 0.4) * 100;
}

export function autoAdjustCostume(
  landmarks: Landmarks,
  currentScale: number
): { x: number; y: number; scale: number } {
  const shoulderWidth = landmarks.rightShoulder.x - landmarks.leftShoulder.x;
  const baseShoulderWidth = 200;
  const newScale = (shoulderWidth / baseShoulderWidth) * currentScale;
  
  return {
    x: landmarks.neckBase.x,
    y: landmarks.neckBase.y,
    scale: Math.max(0.3, Math.min(2.5, newScale)),
  };
}
