import { Costume } from '@/types';
import { generateMangpaoSVG, generateKaoSVG, generatePeiSVG, generateZheziSVG, generateGuanyiSVG, COSTUME_NECK_X, COSTUME_NECK_Y } from '@/utils/svgGenerator';

const goldColor = '#D4AF37';

const colorVariants = [
  { name: '红', main: '#C41E3A', accent: '#8B0000' },
  { name: '绿', main: '#228B22', accent: '#006400' },
  { name: '黄', main: '#FFD700', accent: '#DAA520' },
  { name: '白', main: '#F5F5F5', accent: '#E0E0E0' },
  { name: '黑', main: '#2D2D2D', accent: '#1A1A1A' },
  { name: '紫', main: '#8B008B', accent: '#4B0082' },
  { name: '蓝', main: '#4169E1', accent: '#1E3A8A' },
  { name: '粉', main: '#FFB6C1', accent: '#FF69B4' },
];

const mangpaoList: Costume[] = colorVariants.slice(0, 8).map((color, idx) => ({
  id: `mangpao_${idx + 1}`,
  name: `${color.name}团龙蟒`,
  category: 'mangpao' as const,
  color: color.name,
  pattern: '龙纹',
  svgContent: generateMangpaoSVG({
    mainColor: color.main,
    accentColor: color.accent,
    goldColor,
    pattern: 'dragon',
  }),
  defaultScale: 1.0,
  defaultOffsetY: 0,
  neckPosition: { x: COSTUME_NECK_X, y: COSTUME_NECK_Y },
}));

const kaoColors = [
  { name: '红', main: '#C41E3A', accent: '#8B0000' },
  { name: '绿', main: '#228B22', accent: '#006400' },
  { name: '白', main: '#F5F5F5', accent: '#E0E0E0' },
  { name: '黑', main: '#2D2D2D', accent: '#1A1A1A' },
  { name: '蓝', main: '#4169E1', accent: '#1E3A8A' },
  { name: '粉', main: '#FFB6C1', accent: '#FF69B4' },
];

const kaoList: Costume[] = kaoColors.map((color, idx) => ({
  id: `kao_${idx + 1}`,
  name: `${color.name}缎金绣靠`,
  category: 'kao' as const,
  color: color.name,
  pattern: '鱼鳞甲纹',
  svgContent: generateKaoSVG({
    mainColor: color.main,
    accentColor: color.accent,
    goldColor,
    pattern: 'scale',
  }),
  defaultScale: 1.05,
  defaultOffsetY: -5,
  neckPosition: { x: COSTUME_NECK_X, y: COSTUME_NECK_Y - 5 },
}));

const peiColors = [
  { name: '红', main: '#DC143C', accent: '#8B0000' },
  { name: '蓝', main: '#4169E1', accent: '#1E3A8A' },
  { name: '紫', main: '#9932CC', accent: '#4B0082' },
  { name: '绿', main: '#2E8B57', accent: '#006400' },
  { name: '黄', main: '#FFD700', accent: '#DAA520' },
  { name: '粉', main: '#FFB6C1', accent: '#FF69B4' },
];

const peiList: Costume[] = peiColors.map((color, idx) => ({
  id: `pei_${idx + 1}`,
  name: `${color.name}花帔`,
  category: 'pei' as const,
  color: color.name,
  pattern: '团花纹',
  svgContent: generatePeiSVG({
    mainColor: color.main,
    accentColor: color.accent,
    goldColor,
    pattern: 'flower',
  }),
  defaultScale: 0.98,
  defaultOffsetY: 3,
  neckPosition: { x: COSTUME_NECK_X, y: COSTUME_NECK_Y + 3 },
}));

const zheziColors = [
  { name: '红', main: '#C41E3A', accent: '#8B0000' },
  { name: '蓝', main: '#4682B4', accent: '#1E3A8A' },
  { name: '白', main: '#FFFAF0', accent: '#F5F5DC' },
  { name: '黑', main: '#2D2D2D', accent: '#1A1A1A' },
  { name: '紫', main: '#800080', accent: '#4B0082' },
  { name: '绿', main: '#3CB371', accent: '#2E8B57' },
];

const zheziList: Costume[] = zheziColors.map((color, idx) => ({
  id: `zhezi_${idx + 1}`,
  name: `${color.name}褶子`,
  category: 'zhezi' as const,
  color: color.name,
  pattern: '暗纹',
  svgContent: generateZheziSVG({
    mainColor: color.main,
    accentColor: color.accent,
    goldColor,
    pattern: 'plain',
  }),
  defaultScale: 0.95,
  defaultOffsetY: 5,
  neckPosition: { x: COSTUME_NECK_X, y: COSTUME_NECK_Y + 5 },
}));

const guanyiColors = [
  { name: '红', main: '#B22222', accent: '#8B0000' },
  { name: '紫', main: '#663399', accent: '#4B0082' },
  { name: '蓝', main: '#4169E1', accent: '#1E3A8A' },
  { name: '绿', main: '#2E8B57', accent: '#006400' },
  { name: '黑', main: '#2D2D2D', accent: '#1A1A1A' },
  { name: '粉', main: '#FFB6C1', accent: '#FF69B4' },
];

const guanyiList: Costume[] = guanyiColors.map((color, idx) => ({
  id: `guanyi_${idx + 1}`,
  name: `${color.name}官衣`,
  category: 'guanyi' as const,
  color: color.name,
  pattern: '飞禽纹',
  svgContent: generateGuanyiSVG({
    mainColor: color.main,
    accentColor: color.accent,
    goldColor,
    pattern: 'bird',
  }),
  defaultScale: 1.02,
  defaultOffsetY: -2,
  neckPosition: { x: COSTUME_NECK_X, y: COSTUME_NECK_Y - 2 },
}));

export const costumes: Costume[] = [
  ...mangpaoList,
  ...kaoList,
  ...peiList,
  ...zheziList,
  ...guanyiList,
];

export const getCostumeById = (id: string): Costume | undefined => {
  return costumes.find(c => c.id === id);
};

export const getCostumesByCategory = (category: string): Costume[] => {
  return costumes.filter(c => c.category === category);
};
