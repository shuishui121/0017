import { OutfitScheme } from '@/types';
import { loadImage } from './canvasUtils';

export const COMPARE_WIDTH = 1000;
export const COMPARE_HEIGHT = 1200;
export const IMAGE_WIDTH = 300;
export const IMAGE_HEIGHT = 900;
export const PADDING = 25;

interface CompareOptions {
  layout?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  backgroundColor?: string;
  borderColor?: string;
}

export async function generateCompareImage(
  schemes: OutfitScheme[],
  options: CompareOptions = {}
): Promise<string> {
  if (schemes.length !== 3) {
    throw new Error('必须选择3套方案生成对比图');
  }

  const {
    layout = 'horizontal',
    showLabels = true,
    backgroundColor = '#FFF8E7',
    borderColor = '#8B0000',
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = COMPARE_WIDTH;
  canvas.height = COMPARE_HEIGHT;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法获取Canvas上下文');
  }

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, COMPARE_WIDTH, COMPARE_HEIGHT);

  drawDecorativeBorder(ctx, COMPARE_WIDTH, COMPARE_HEIGHT, borderColor);

  drawHeader(ctx, COMPARE_WIDTH, borderColor);

  const images = await Promise.all(
    schemes.map(scheme => loadImage(scheme.imageData))
  );

  if (layout === 'horizontal') {
    const startX = (COMPARE_WIDTH - (IMAGE_WIDTH * 3 + PADDING * 2)) / 2;
    const startY = 150;

    for (let i = 0; i < 3; i++) {
      const x = startX + i * (IMAGE_WIDTH + PADDING);
      const y = startY;

      drawSchemeCard(ctx, images[i], schemes[i], x, y, IMAGE_WIDTH, IMAGE_HEIGHT, showLabels, borderColor, i + 1);
    }
  } else {
    const startX = (COMPARE_WIDTH - IMAGE_WIDTH) / 2;
    const startY = 150;
    const verticalPadding = 20;
    const itemHeight = (COMPARE_HEIGHT - startY - PADDING * 2) / 3 - verticalPadding;

    for (let i = 0; i < 3; i++) {
      const x = startX;
      const y = startY + i * (itemHeight + verticalPadding);

      drawSchemeCard(ctx, images[i], schemes[i], x, y, IMAGE_WIDTH, itemHeight, showLabels, borderColor, i + 1);
    }
  }

  drawFooter(ctx, COMPARE_WIDTH, COMPARE_HEIGHT, borderColor);

  return canvas.toDataURL('image/png');
}

function drawDecorativeBorder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
  ctx.save();
  
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, width - 20, height - 20);
  
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, width - 40, height - 40);
  
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(30, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 30);
    ctx.stroke();
    ctx.restore();
  };
  
  drawCorner(25, 25, 0);
  drawCorner(width - 25, 25, 90);
  drawCorner(width - 25, height - 25, 180);
  drawCorner(25, height - 25, 270);
  
  ctx.restore();
}

function drawHeader(
  ctx: CanvasRenderingContext2D,
  width: number,
  color: string
): void {
  ctx.save();
  
  ctx.fillStyle = color;
  ctx.font = 'bold 32px "Noto Serif SC", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('戏曲造型对比图', width / 2, 70);
  
  ctx.fillStyle = '#6B4423';
  ctx.font = '18px "Noto Sans SC", sans-serif';
  ctx.fillText('Traditional Opera Costume Comparison', width / 2, 105);
  
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 150, 130);
  ctx.lineTo(width / 2 + 150, 130);
  ctx.stroke();
  
  ctx.restore();
}

function drawSchemeCard(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  scheme: OutfitScheme,
  x: number,
  y: number,
  width: number,
  height: number,
  showLabels: boolean,
  borderColor: string,
  index: number
): void {
  ctx.save();
  
  ctx.shadowColor = 'rgba(139, 0, 0, 0.3)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 5;
  
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x, y, width, height);
  
  ctx.shadowBlur = 0;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, width, height);
  
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);
  
  const badgeRadius = 25;
  ctx.fillStyle = '#8B0000';
  ctx.beginPath();
  ctx.arc(x + 35, y + 35, badgeRadius, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  ctx.arc(x + 35, y + 35, badgeRadius - 4, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#8B0000';
  ctx.font = 'bold 24px "Noto Serif SC", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(index), x + 35, y + 35);
  
  const imgDisplayHeight = height - 80;
  const imgDisplayWidth = (image.width / image.height) * imgDisplayHeight;
  const imgX = x + (width - imgDisplayWidth) / 2;
  const imgY = y + 10;
  
  ctx.drawImage(image, imgX, imgY, imgDisplayWidth, imgDisplayHeight);
  
  if (showLabels) {
    const labelY = y + height - 55;
    
    ctx.fillStyle = '#8B0000';
    ctx.font = 'bold 20px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.fillText(scheme.name, x + width / 2, labelY);
    
    ctx.fillStyle = '#6B4423';
    ctx.font = '14px "Noto Sans SC", sans-serif';
    const date = new Date(scheme.createdAt).toLocaleDateString('zh-CN');
    ctx.fillText(date, x + width / 2, labelY + 25);
  }
  
  ctx.restore();
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
  ctx.save();
  
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 150, height - 60);
  ctx.lineTo(width / 2 + 150, height - 60);
  ctx.stroke();
  
  ctx.fillStyle = '#6B4423';
  ctx.font = '14px "Noto Sans SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('虚拟戏服试穿工具 | 生成时间 ' + new Date().toLocaleString('zh-CN'), width / 2, height - 35);
  
  ctx.restore();
}

export function downloadCompareImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function getImageDimensions(schemes: OutfitScheme[]): { width: number; height: number } {
  if (schemes.length === 0) {
    return { width: COMPARE_WIDTH, height: COMPARE_HEIGHT };
  }
  return { width: COMPARE_WIDTH, height: COMPARE_HEIGHT };
}
