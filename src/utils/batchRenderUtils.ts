import { BatchScheme, Role, LayerState } from '@/types';
import { costumes } from '@/data/costumes';
import { headpieces } from '@/data/headpieces';
import {
  svgToDataUrl,
  loadImage,
  drawImageOnCanvas,
  drawCostumeOnCanvas,
  drawHeadpieceOnCanvas,
} from './canvasUtils';

export const THUMBNAIL_WIDTH = 250;
export const THUMBNAIL_HEIGHT = 350;
export const DEFAULT_LANDMARKS = {
  faceCenter: { x: 125, y: 100 },
  leftShoulder: { x: 75, y: 160 },
  rightShoulder: { x: 175, y: 160 },
  neckBase: { x: 125, y: 150 },
  confidence: 1.0,
};

const imageCache = new Map<string, HTMLImageElement>();

async function getCachedImage(dataUrl: string): Promise<HTMLImageElement> {
  if (imageCache.has(dataUrl)) {
    return imageCache.get(dataUrl)!;
  }
  const img = await loadImage(dataUrl);
  imageCache.set(dataUrl, img);
  return img;
}

export function clearImageCache(): void {
  imageCache.clear();
}

export function createDefaultLayerState(): LayerState {
  return {
    x: DEFAULT_LANDMARKS.neckBase.x,
    y: DEFAULT_LANDMARKS.neckBase.y,
    scale: 1.0,
    rotation: 0,
  };
}

export function createDefaultHeadpieceLayerState(): LayerState {
  return {
    x: DEFAULT_LANDMARKS.faceCenter.x,
    y: DEFAULT_LANDMARKS.faceCenter.y,
    scale: 0.9,
    rotation: 0,
  };
}

export function generatePlaceholderImage(
  width: number,
  height: number,
  bgColor: string = '#FFF8E7'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(10, 10, width - 20, height - 20);
  ctx.setLineDash([]);

  ctx.fillStyle = '#8B0000';
  ctx.font = 'bold 16px "Noto Serif SC", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('角色预览图', width / 2, height / 2);

  return canvas.toDataURL('image/png');
}

export async function renderSchemeThumbnail(
  scheme: BatchScheme,
  role: Role,
  width: number = THUMBNAIL_WIDTH,
  height: number = THUMBNAIL_HEIGHT
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#FFF8E7';
  ctx.fillRect(0, 0, width, height);

  const landmarks = role.defaultLandmarks || DEFAULT_LANDMARKS;

  if (role.avatarDataUrl) {
    try {
      const userImg = await getCachedImage(role.avatarDataUrl);
      drawImageOnCanvas(ctx, userImg, width, height);
    } catch (e) {
      drawDefaultSilhouette(ctx, width, height);
    }
  } else {
    drawDefaultSilhouette(ctx, width, height);
  }

  if (scheme.costumeId) {
    const costume = costumes.find(c => c.id === scheme.costumeId);
    if (costume) {
      try {
        const costumeDataUrl = svgToDataUrl(costume.svgContent);
        const costumeImg = await getCachedImage(costumeDataUrl);
        const costumeLayer = {
          ...scheme.costumeLayer,
          x: scheme.costumeLayer.x !== 0 ? scheme.costumeLayer.x : landmarks.neckBase.x,
          y: scheme.costumeLayer.y !== 0 ? scheme.costumeLayer.y : landmarks.neckBase.y + costume.defaultOffsetY,
          scale: scheme.costumeLayer.scale !== 1 ? scheme.costumeLayer.scale : costume.defaultScale,
        };
        drawCostumeOnCanvas(ctx, costumeImg, costumeLayer, costume.neckPosition);
      } catch (e) {
        console.error('Failed to render costume:', e);
      }
    }
  }

  if (scheme.headpieceId) {
    const headpiece = headpieces.find(h => h.id === scheme.headpieceId);
    if (headpiece) {
      try {
        const headpieceDataUrl = svgToDataUrl(headpiece.svgContent);
        const headpieceImg = await getCachedImage(headpieceDataUrl);
        const headpieceLayer = {
          ...scheme.headpieceLayer,
          x: scheme.headpieceLayer.x !== 0 ? scheme.headpieceLayer.x : landmarks.faceCenter.x,
          y: scheme.headpieceLayer.y !== 0 ? scheme.headpieceLayer.y : landmarks.faceCenter.y + headpiece.defaultOffsetY,
          scale: scheme.headpieceLayer.scale !== 1 ? scheme.headpieceLayer.scale : headpiece.defaultScale,
        };
        drawHeadpieceOnCanvas(ctx, headpieceImg, headpieceLayer, headpiece.bottomPosition);
      } catch (e) {
        console.error('Failed to render headpiece:', e);
      }
    }
  }

  return canvas.toDataURL('image/png');
}

function drawDefaultSilhouette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.fillStyle = '#F5F5F5';
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;

  ctx.fillStyle = '#FFE4C4';
  ctx.beginPath();
  ctx.arc(centerX, 90, 35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2D2D2D';
  ctx.beginPath();
  ctx.arc(centerX, 70, 30, Math.PI, 0, false);
  ctx.fill();

  ctx.fillStyle = '#8B0000';
  ctx.beginPath();
  ctx.moveTo(centerX - 70, 130);
  ctx.lineTo(centerX + 70, 130);
  ctx.lineTo(centerX + 60, 340);
  ctx.lineTo(centerX - 60, 340);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export async function renderBatchThumbnails(
  schemes: BatchScheme[],
  roles: Role[],
  width: number = THUMBNAIL_WIDTH,
  height: number = THUMBNAIL_HEIGHT
): Promise<Map<string, string>> {
  const resultMap = new Map<string, string>();
  const roleMap = new Map(roles.map(r => [r.id, r]));

  const BATCH_SIZE = 5;
  for (let i = 0; i < schemes.length; i += BATCH_SIZE) {
    const batch = schemes.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (scheme) => {
      const role = roleMap.get(scheme.roleId);
      if (!role) return [scheme.id, ''] as const;
      try {
        const thumbnail = await renderSchemeThumbnail(scheme, role, width, height);
        return [scheme.id, thumbnail] as const;
      } catch (e) {
        console.error(`Failed to render scheme ${scheme.id}:`, e);
        return [scheme.id, ''] as const;
      }
    });

    const results = await Promise.all(promises);
    for (const [id, thumbnail] of results) {
      resultMap.set(id, thumbnail);
    }

    if (i + BATCH_SIZE < schemes.length) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  return resultMap;
}

export function generateBatchThumbnailsSync(
  schemes: BatchScheme[],
  roles: Role[],
  width: number = THUMBNAIL_WIDTH,
  height: number = THUMBNAIL_HEIGHT
): Map<string, string> {
  const resultMap = new Map<string, string>();

  for (const scheme of schemes) {
    const role = roles.find(r => r.id === scheme.roleId);
    if (!role) continue;

    const costumeName = scheme.costumeId
      ? costumes.find(c => c.id === scheme.costumeId)?.name || ''
      : '';
    const headpieceName = scheme.headpieceId
      ? headpieces.find(h => h.id === scheme.headpieceId)?.name || ''
      : '';

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    ctx.fillStyle = '#FFF8E7';
    ctx.fillRect(0, 0, width, height);

    drawDefaultSilhouette(ctx, width, height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(5, height - 60, width - 10, 55);

    ctx.fillStyle = '#8B0000';
    ctx.font = 'bold 14px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.fillText(role.name, width / 2, height - 40);

    ctx.fillStyle = '#6B4423';
    ctx.font = '11px "Noto Sans SC", sans-serif';
    if (costumeName) {
      ctx.fillText(`服装: ${costumeName}`, width / 2, height - 24);
    }
    if (headpieceName) {
      ctx.fillText(`盔头: ${headpieceName}`, width / 2, height - 8);
    }

    resultMap.set(scheme.id, canvas.toDataURL('image/png'));
  }

  return resultMap;
}
