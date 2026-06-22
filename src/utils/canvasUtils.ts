import { LayerState } from '@/types';
import { COSTUME_WIDTH, COSTUME_HEIGHT, COSTUME_NECK_X, COSTUME_NECK_Y, HEADPIECE_WIDTH, HEADPIECE_HEIGHT, HEADPIECE_BOTTOM_Y } from './svgGenerator';

export function svgToDataUrl(svgContent: string): string {
  const encoded = encodeURIComponent(svgContent)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function drawImageOnCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
): { offsetX: number; offsetY: number; scale: number } {
  const imgRatio = img.width / img.height;
  const canvasRatio = canvasWidth / canvasHeight;
  
  let drawWidth: number, drawHeight: number;
  if (imgRatio > canvasRatio) {
    drawHeight = canvasHeight;
    drawWidth = drawHeight * imgRatio;
  } else {
    drawWidth = canvasWidth;
    drawHeight = drawWidth / imgRatio;
  }
  
  const offsetX = (canvasWidth - drawWidth) / 2;
  const offsetY = (canvasHeight - drawHeight) / 2;
  const scale = drawWidth / img.width;
  
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  
  return { offsetX, offsetY, scale };
}

export function drawCostumeOnCanvas(
  ctx: CanvasRenderingContext2D,
  costumeImg: HTMLImageElement,
  layer: LayerState,
  neckPosition: { x: number; y: number }
): void {
  const { x, y, scale, rotation } = layer;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);
  
  const drawX = -neckPosition.x;
  const drawY = -neckPosition.y;
  
  ctx.drawImage(costumeImg, drawX, drawY, COSTUME_WIDTH, COSTUME_HEIGHT);
  ctx.restore();
}

export function drawHeadpieceOnCanvas(
  ctx: CanvasRenderingContext2D,
  headpieceImg: HTMLImageElement,
  layer: LayerState,
  bottomPosition: { x: number; y: number }
): void {
  const { x, y, scale, rotation } = layer;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);
  
  const drawX = -bottomPosition.x;
  const drawY = -bottomPosition.y;
  
  ctx.drawImage(headpieceImg, drawX, drawY, HEADPIECE_WIDTH, HEADPIECE_HEIGHT);
  ctx.restore();
}

export function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: {
    faceCenter: { x: number; y: number };
    leftShoulder: { x: number; y: number };
    rightShoulder: { x: number; y: number };
    neckBase: { x: number; y: number };
  },
  show: boolean = true
): void {
  if (!show) return;
  
  ctx.save();
  ctx.strokeStyle = '#D4AF37';
  ctx.fillStyle = '#D4AF37';
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  ctx.moveTo(landmarks.leftShoulder.x, landmarks.leftShoulder.y);
  ctx.lineTo(landmarks.rightShoulder.x, landmarks.rightShoulder.y);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(landmarks.faceCenter.x, landmarks.faceCenter.y);
  ctx.lineTo(landmarks.neckBase.x, landmarks.neckBase.y);
  ctx.stroke();
  
  const drawPoint = (x: number, y: number, label: string) => {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = '#D4AF37';
    ctx.fillStyle = '#FFF';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y + 20);
    ctx.fillStyle = '#D4AF37';
  };
  
  drawPoint(landmarks.faceCenter.x, landmarks.faceCenter.y, '面部中心');
  drawPoint(landmarks.leftShoulder.x, landmarks.leftShoulder.y, '左肩');
  drawPoint(landmarks.rightShoulder.x, landmarks.rightShoulder.y, '右肩');
  drawPoint(landmarks.neckBase.x, landmarks.neckBase.y, '颈根');
  
  ctx.restore();
}

export function canvasToDataUrl(canvas: HTMLCanvasElement, type: string = 'image/png'): string {
  return canvas.toDataURL(type);
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function getScaledCoordinates(
  clientX: number,
  clientY: number,
  canvas: HTMLCanvasElement,
  transform: { offsetX: number; offsetY: number; scale: number }
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const canvasX = (clientX - rect.left) * (canvas.width / rect.width);
  const canvasY = (clientY - rect.top) * (canvas.height / rect.height);
  
  return {
    x: (canvasX - transform.offsetX) / transform.scale,
    y: (canvasY - transform.offsetY) / transform.scale,
  };
}
