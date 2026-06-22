export type CostumeCategory = 'mangpao' | 'kao' | 'pei' | 'zhezi' | 'guanyi';
export type HeadpieceCategory = 'imperial' | 'official' | 'warrior' | 'female' | 'other';

export interface Costume {
  id: string;
  name: string;
  category: CostumeCategory;
  color: string;
  pattern: string;
  svgContent: string;
  defaultScale: number;
  defaultOffsetY: number;
  neckPosition: { x: number; y: number };
}

export interface Headpiece {
  id: string;
  name: string;
  category: HeadpieceCategory;
  description: string;
  suitableRole?: string;
  color: string;
  svgContent: string;
  defaultScale: number;
  defaultOffsetY: number;
  bottomPosition: { x: number; y: number };
}

export interface LayerState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface Landmarks {
  faceCenter: { x: number; y: number };
  leftShoulder: { x: number; y: number };
  rightShoulder: { x: number; y: number };
  neckBase: { x: number; y: number };
  confidence: number;
}

export interface OutfitScheme {
  id: string;
  name: string;
  createdAt: number;
  thumbnail: string;
  costumeId: string | null;
  headpieceId: string | null;
  costumeLayer: LayerState;
  headpieceLayer: LayerState;
  landmarks: Landmarks;
  imageData: string;
}

export interface EditorState {
  userImage: HTMLImageElement | null;
  imageDataUrl: string | null;
  landmarks: Landmarks | null;
  selectedCostume: Costume | null;
  selectedHeadpiece: Headpiece | null;
  costumeLayer: LayerState;
  headpieceLayer: LayerState;
  activeLayer: 'costume' | 'headpiece' | null;
  isDragging: boolean;
  dragStart: { x: number; y: number } | null;
}

export const CATEGORY_LABELS: Record<CostumeCategory, string> = {
  mangpao: '蟒袍',
  kao: '靠',
  pei: '帔',
  zhezi: '褶子',
  guanyi: '官衣',
};

export const HEADPIECE_CATEGORY_LABELS: Record<HeadpieceCategory, string> = {
  imperial: '帝后',
  official: '官员',
  warrior: '武将',
  female: '女眷',
  other: '其他',
};
