import { OutfitScheme, BatchSession, BatchScheme, Role, ROLE_TYPE_LABELS } from '@/types';
import { loadImage } from './canvasUtils';
import { costumes } from '@/data/costumes';
import { headpieces } from '@/data/headpieces';
import { renderSchemeThumbnail } from './batchRenderUtils';

export const COMPARE_WIDTH = 1000;
export const COMPARE_HEIGHT = 1200;
export const IMAGE_WIDTH = 300;
export const IMAGE_HEIGHT = 900;
export const PADDING = 25;

export const BATCH_CELL_WIDTH = 280;
export const BATCH_CELL_HEIGHT = 400;
export const BATCH_LABEL_HEIGHT = 70;
export const BATCH_HEADER_HEIGHT = 120;
export const BATCH_ROLE_COL_WIDTH = 140;
export const BATCH_PADDING = 20;

interface CompareOptions {
  layout?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  backgroundColor?: string;
  borderColor?: string;
}

interface BatchExportOptions {
  backgroundColor?: string;
  borderColor?: string;
  title?: string;
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

export async function generateBatchCompareImage(
  session: BatchSession,
  thumbnails: Map<string, string>,
  options: BatchExportOptions = {}
): Promise<string> {
  const {
    backgroundColor = '#FFF8E7',
    borderColor = '#8B0000',
    title = '戏曲角色服装方案对比表',
  } = options;

  const roles = session.roles;
  const schemesPerRole = session.schemesPerRole;
  const roleCount = roles.length;

  const totalWidth = BATCH_ROLE_COL_WIDTH + schemesPerRole * BATCH_CELL_WIDTH + BATCH_PADDING * 2;
  const totalHeight =
    BATCH_HEADER_HEIGHT +
    roleCount * (BATCH_CELL_HEIGHT + BATCH_LABEL_HEIGHT) +
    80;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(totalWidth, 800);
  canvas.height = totalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法获取Canvas上下文');
  }

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBatchDecorativeBorder(ctx, canvas.width, canvas.height, borderColor);

  drawBatchHeader(ctx, canvas.width, borderColor, title, `${roleCount}个角色 · ${session.schemes.length}个方案`);

  let cursorY = BATCH_HEADER_HEIGHT;

  const schemesByRole = new Map<string, BatchScheme[]>();
  for (const role of roles) {
    schemesByRole.set(role.id, []);
  }
  for (const scheme of session.schemes) {
    const arr = schemesByRole.get(scheme.roleId) || [];
    arr.push(scheme);
    schemesByRole.set(scheme.roleId, arr);
  }

  const headerStartX = BATCH_PADDING;
  const cellTotalHeight = BATCH_CELL_HEIGHT + BATCH_LABEL_HEIGHT;

  ctx.fillStyle = borderColor;
  ctx.fillRect(headerStartX, cursorY, BATCH_ROLE_COL_WIDTH, 40);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px "Noto Serif SC", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('角色 / 方案', headerStartX + BATCH_ROLE_COL_WIDTH / 2, cursorY + 20);

  for (let col = 0; col < schemesPerRole; col++) {
    const x = headerStartX + BATCH_ROLE_COL_WIDTH + col * BATCH_CELL_WIDTH;
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(x, cursorY, BATCH_CELL_WIDTH, 40);
    ctx.fillStyle = '#8B0000';
    ctx.font = 'bold 14px "Noto Serif SC", serif';
    ctx.fillText(`方案 ${col + 1}`, x + BATCH_CELL_WIDTH / 2, cursorY + 20);
  }
  cursorY += 40;

  for (const role of roles) {
    const roleSchemes = schemesByRole.get(role.id) || [];

    ctx.fillStyle = '#FFF0DB';
    ctx.fillRect(headerStartX, cursorY, BATCH_ROLE_COL_WIDTH, cellTotalHeight);

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(headerStartX, cursorY, BATCH_ROLE_COL_WIDTH, cellTotalHeight);

    ctx.save();
    ctx.translate(headerStartX + BATCH_ROLE_COL_WIDTH / 2, cursorY + cellTotalHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#8B0000';
    ctx.font = 'bold 18px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(role.name, 0, -15);
    ctx.fillStyle = '#6B4423';
    ctx.font = '14px "Noto Sans SC", sans-serif';
    ctx.fillText(ROLE_TYPE_LABELS[role.roleType], 0, 12);
    ctx.restore();

    for (let col = 0; col < schemesPerRole; col++) {
      const scheme = roleSchemes[col];
      const x = headerStartX + BATCH_ROLE_COL_WIDTH + col * BATCH_CELL_WIDTH;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x, cursorY, BATCH_CELL_WIDTH, cellTotalHeight);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, cursorY, BATCH_CELL_WIDTH, cellTotalHeight);

      if (scheme) {
        let imgData = thumbnails.get(scheme.id);
        if (!imgData) {
          try {
            imgData = await renderSchemeThumbnail(scheme, role);
          } catch (e) {
            console.error('Failed to render scheme:', e);
          }
        }

        if (imgData) {
          try {
            const img = await loadImage(imgData);
            const targetW = BATCH_CELL_WIDTH - 20;
            const targetH = BATCH_CELL_HEIGHT - 20;
            const scale = Math.min(targetW / img.width, targetH / img.height);
            const drawW = img.width * scale;
            const drawH = img.height * scale;
            const drawX = x + (BATCH_CELL_WIDTH - drawW) / 2;
            const drawY = cursorY + 10 + (BATCH_CELL_HEIGHT - 20 - drawH) / 2;
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
          } catch (e) {
            console.error('Failed to draw image:', e);
          }
        }

        const costumeName = scheme.costumeId
          ? costumes.find(c => c.id === scheme.costumeId)?.name || '-'
          : '-';
        const headpieceName = scheme.headpieceId
          ? headpieces.find(h => h.id === scheme.headpieceId)?.name || '-'
          : '-';

        const labelY = cursorY + BATCH_CELL_HEIGHT + 10;

        ctx.fillStyle = '#8B0000';
        ctx.font = 'bold 13px "Noto Serif SC", serif';
        ctx.textAlign = 'center';
        ctx.fillText(role.name, x + BATCH_CELL_WIDTH / 2, labelY);

        ctx.fillStyle = '#6B4423';
        ctx.font = '11px "Noto Sans SC", sans-serif';
        ctx.fillText(`服装: ${costumeName}`, x + BATCH_CELL_WIDTH / 2, labelY + 18);
        ctx.fillText(`盔头: ${headpieceName}`, x + BATCH_CELL_WIDTH / 2, labelY + 35);
      } else {
        ctx.fillStyle = '#E5E7EB';
        ctx.fillRect(x + 10, cursorY + 10, BATCH_CELL_WIDTH - 20, BATCH_CELL_HEIGHT - 20);
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '14px "Noto Sans SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('无方案', x + BATCH_CELL_WIDTH / 2, cursorY + BATCH_CELL_HEIGHT / 2);
      }
    }

    cursorY += cellTotalHeight;
  }

  drawBatchFooter(ctx, canvas.width, canvas.height, borderColor);

  return canvas.toDataURL('image/png');
}

function drawBatchDecorativeBorder(
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

function drawBatchHeader(
  ctx: CanvasRenderingContext2D,
  width: number,
  color: string,
  title: string,
  subtitle: string
): void {
  ctx.save();

  ctx.fillStyle = color;
  ctx.font = 'bold 32px "Noto Serif SC", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, width / 2, 50);

  ctx.fillStyle = '#6B4423';
  ctx.font = '16px "Noto Sans SC", sans-serif';
  ctx.fillText(subtitle, width / 2, 85);

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 200, 110);
  ctx.lineTo(width / 2 + 200, 110);
  ctx.stroke();

  ctx.restore();
}

function drawBatchFooter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
  ctx.save();

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 150, height - 50);
  ctx.lineTo(width / 2 + 150, height - 50);
  ctx.stroke();

  ctx.fillStyle = '#6B4423';
  ctx.font = '14px "Noto Sans SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    '虚拟戏服试穿工具 | 批量对比图 | 生成时间 ' + new Date().toLocaleString('zh-CN'),
    width / 2,
    height - 28
  );

  ctx.restore();
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

export function getBatchImageDimensions(
  roleCount: number,
  schemesPerRole: number
): { width: number; height: number } {
  const width = BATCH_ROLE_COL_WIDTH + schemesPerRole * BATCH_CELL_WIDTH + BATCH_PADDING * 2;
  const height =
    BATCH_HEADER_HEIGHT +
    roleCount * (BATCH_CELL_HEIGHT + BATCH_LABEL_HEIGHT) +
    80;
  return { width: Math.max(width, 800), height };
}
