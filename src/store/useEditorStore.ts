import { create } from 'zustand';
import { LayerState, Landmarks, Costume, Headpiece, OutfitScheme } from '@/types';
import { costumes } from '@/data/costumes';
import { headpieces } from '@/data/headpieces';
import { loadImage } from '@/utils/canvasUtils';

interface EditorState {
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
  imageSize: { width: number; height: number } | null;
  
  setUserImage: (image: HTMLImageElement | null, dataUrl: string | null) => void;
  setLandmarks: (landmarks: Landmarks | null) => void;
  setSelectedCostume: (costume: Costume | null) => void;
  setSelectedHeadpiece: (headpiece: Headpiece | null) => void;
  setCostumeLayer: (layer: Partial<LayerState>) => void;
  setHeadpieceLayer: (layer: Partial<LayerState>) => void;
  setActiveLayer: (layer: 'costume' | 'headpiece' | null) => void;
  setIsDragging: (dragging: boolean) => void;
  setDragStart: (point: { x: number; y: number } | null) => void;
  setImageSize: (size: { width: number; height: number } | null) => void;
  resetAll: () => void;
  resetLayer: (layer: 'costume' | 'headpiece') => void;
  loadScheme: (scheme: OutfitScheme) => void;
}

const initialLayerState: LayerState = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
};

export const useEditorStore = create<EditorState>((set, get) => ({
  userImage: null,
  imageDataUrl: null,
  landmarks: null,
  selectedCostume: null,
  selectedHeadpiece: null,
  costumeLayer: { ...initialLayerState },
  headpieceLayer: { ...initialLayerState },
  activeLayer: null,
  isDragging: false,
  dragStart: null,
  imageSize: null,

  setUserImage: (image, dataUrl) => {
    set({ 
      userImage: image, 
      imageDataUrl: dataUrl,
      selectedCostume: null,
      selectedHeadpiece: null,
      costumeLayer: { ...initialLayerState },
      headpieceLayer: { ...initialLayerState },
    });
    if (image) {
      set({ imageSize: { width: image.width, height: image.height } });
    }
  },

  setLandmarks: (landmarks) => set({ landmarks }),

  setSelectedCostume: (costume) => {
    const { landmarks } = get();
    if (costume && landmarks) {
      const defaultScale = costume.defaultScale;
      const offsetY = costume.defaultOffsetY;
      set({
        selectedCostume: costume,
        costumeLayer: {
          x: landmarks.neckBase.x,
          y: landmarks.neckBase.y + offsetY,
          scale: defaultScale,
          rotation: 0,
        },
        activeLayer: 'costume',
      });
    } else {
      set({ selectedCostume: costume });
    }
  },

  setSelectedHeadpiece: (headpiece) => {
    const { landmarks } = get();
    if (headpiece && landmarks) {
      const defaultScale = headpiece.defaultScale;
      const offsetY = headpiece.defaultOffsetY;
      set({
        selectedHeadpiece: headpiece,
        headpieceLayer: {
          x: landmarks.faceCenter.x,
          y: landmarks.faceCenter.y + offsetY,
          scale: defaultScale,
          rotation: 0,
        },
        activeLayer: 'headpiece',
      });
    } else {
      set({ selectedHeadpiece: headpiece });
    }
  },

  setCostumeLayer: (layer) => set((state) => ({
    costumeLayer: { ...state.costumeLayer, ...layer },
  })),

  setHeadpieceLayer: (layer) => set((state) => ({
    headpieceLayer: { ...state.headpieceLayer, ...layer },
  })),

  setActiveLayer: (layer) => set({ activeLayer: layer }),

  setIsDragging: (dragging) => set({ isDragging: dragging }),

  setDragStart: (point) => set({ dragStart: point }),

  setImageSize: (size) => set({ imageSize: size }),

  resetAll: () => set({
    selectedCostume: null,
    selectedHeadpiece: null,
    costumeLayer: { ...initialLayerState },
    headpieceLayer: { ...initialLayerState },
    activeLayer: null,
  }),

  resetLayer: (layer) => {
    const { landmarks, selectedCostume, selectedHeadpiece } = get();
    if (layer === 'costume' && selectedCostume && landmarks) {
      set({
        costumeLayer: {
          x: landmarks.neckBase.x,
          y: landmarks.neckBase.y + selectedCostume.defaultOffsetY,
          scale: selectedCostume.defaultScale,
          rotation: 0,
        },
      });
    } else if (layer === 'headpiece' && selectedHeadpiece && landmarks) {
      set({
        headpieceLayer: {
          x: landmarks.faceCenter.x,
          y: landmarks.faceCenter.y + selectedHeadpiece.defaultOffsetY,
          scale: selectedHeadpiece.defaultScale,
          rotation: 0,
        },
      });
    }
  },

  loadScheme: async (scheme) => {
    const costume = scheme.costumeId ? costumes.find(c => c.id === scheme.costumeId) || null : null;
    const headpiece = scheme.headpieceId ? headpieces.find(h => h.id === scheme.headpieceId) || null : null;

    if (scheme.imageData) {
      try {
        const img = await loadImage(scheme.imageData);
        set({
          userImage: img,
          imageDataUrl: scheme.imageData,
          imageSize: { width: img.width, height: img.height },
        });
      } catch (e) {
        console.error('Failed to load scheme image:', e);
      }
    }

    set({
      landmarks: scheme.landmarks,
      selectedCostume: costume,
      selectedHeadpiece: headpiece,
      costumeLayer: scheme.costumeLayer,
      headpieceLayer: scheme.headpieceLayer,
      activeLayer: null,
    });
  },
}));
