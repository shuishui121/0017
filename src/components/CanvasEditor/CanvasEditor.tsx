import { useRef, useEffect, useState, useCallback } from 'react';
import { Upload, Camera, RotateCcw, Eye, EyeOff, Save } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import {
  drawImageOnCanvas,
  drawCostumeOnCanvas,
  drawHeadpieceOnCanvas,
  drawLandmarks,
  svgToDataUrl,
  loadImage,
  canvasToDataUrl,
} from '@/utils/canvasUtils';
import { detectLandmarksFromCanvas, autoAdjustCostume } from '@/utils/detectionUtils';
import { saveScheme, generateSchemeId, canSaveScheme, MAX_SCHEMES } from '@/utils/storageUtils';
import { OutfitScheme } from '@/types';

interface CanvasEditorProps {
  width?: number;
  height?: number;
}

export default function CanvasEditor({ width = 500, height = 700 }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [costumeImg, setCostumeImg] = useState<HTMLImageElement | null>(null);
  const [headpieceImg, setHeadpieceImg] = useState<HTMLImageElement | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [schemeName, setSchemeName] = useState('');
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const transformRef = useRef({ offsetX: 0, offsetY: 0, scale: 1 });
  
  const {
    userImage,
    landmarks,
    selectedCostume,
    selectedHeadpiece,
    costumeLayer,
    headpieceLayer,
    activeLayer,
    isDragging,
    dragStart,
    setUserImage,
    setLandmarks,
    setCostumeLayer,
    setHeadpieceLayer,
    setActiveLayer,
    setIsDragging,
    setDragStart,
    resetAll,
  } = useEditorStore();

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (userImage) {
      const transform = drawImageOnCanvas(ctx, userImage, width, height);
      transformRef.current = transform;
      
      if (landmarks) {
        drawLandmarks(ctx, landmarks, showLandmarks);
      }
      
      if (selectedCostume && costumeImg) {
        drawCostumeOnCanvas(ctx, costumeImg, costumeLayer, selectedCostume.neckPosition);
      }
      
      if (selectedHeadpiece && headpieceImg) {
        drawHeadpieceOnCanvas(ctx, headpieceImg, headpieceLayer, selectedHeadpiece.bottomPosition);
      }
    } else {
      ctx.fillStyle = '#FFF8E7';
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(20, 20, width - 40, height - 40);
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#8B0000';
      ctx.font = 'bold 20px "Noto Serif SC", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('请上传或拍摄正面半身照', width / 2, height / 2 - 20);
      
      ctx.fillStyle = '#6B4423';
      ctx.font = '14px "Noto Sans SC", sans-serif';
      ctx.fillText('建议：光线充足，面部清晰，双肩可见', width / 2, height / 2 + 20);
    }
  }, [userImage, landmarks, selectedCostume, selectedHeadpiece, costumeLayer, headpieceLayer, costumeImg, headpieceImg, showLandmarks, width, height]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  useEffect(() => {
    if (selectedCostume) {
      const dataUrl = svgToDataUrl(selectedCostume.svgContent);
      loadImage(dataUrl).then(img => setCostumeImg(img));
    } else {
      setCostumeImg(null);
    }
  }, [selectedCostume]);

  useEffect(() => {
    if (selectedHeadpiece) {
      const dataUrl = svgToDataUrl(selectedHeadpiece.svgContent);
      loadImage(dataUrl).then(img => setHeadpieceImg(img));
    } else {
      setHeadpieceImg(null);
    }
  }, [selectedHeadpiece]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await processImageFile(file);
  };

  const processImageFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        const img = await loadImage(dataUrl);
        
        setUserImage(img, dataUrl);
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0);
          const detected = detectLandmarksFromCanvas(tempCanvas);
          setLandmarks(detected);
        }
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('图像处理失败:', error);
      setIsProcessing(false);
    }
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImageFile(file);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!userImage) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    setDragStart({ x, y });
    setIsDragging(true);
    
    if (selectedHeadpiece && isPointInHeadpiece(x, y)) {
      setActiveLayer('headpiece');
    } else if (selectedCostume && isPointInCostume(x, y)) {
      setActiveLayer('costume');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStart || !activeLayer) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    
    if (activeLayer === 'costume') {
      setCostumeLayer({
        x: costumeLayer.x + dx,
        y: costumeLayer.y + dy,
      });
    } else {
      setHeadpieceLayer({
        x: headpieceLayer.x + dx,
        y: headpieceLayer.y + dy,
      });
    }
    
    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const isPointInCostume = (x: number, y: number): boolean => {
    if (!selectedCostume) return false;
    const halfWidth = (200 * costumeLayer.scale);
    const halfHeight = (240 * costumeLayer.scale);
    return (
      x >= costumeLayer.x - halfWidth &&
      x <= costumeLayer.x + halfWidth &&
      y >= costumeLayer.y - 60 &&
      y <= costumeLayer.y + halfHeight
    );
  };

  const isPointInHeadpiece = (x: number, y: number): boolean => {
    if (!selectedHeadpiece) return false;
    const halfWidth = (150 * headpieceLayer.scale);
    const halfHeight = (100 * headpieceLayer.scale);
    return (
      x >= headpieceLayer.x - halfWidth &&
      x <= headpieceLayer.x + halfWidth &&
      y >= headpieceLayer.y - halfHeight &&
      y <= headpieceLayer.y + halfHeight
    );
  };

  const handleAutoFit = () => {
    if (!landmarks || !selectedCostume) return;
    
    const adjusted = autoAdjustCostume(landmarks, selectedCostume.defaultScale);
    setCostumeLayer({
      ...adjusted,
      rotation: costumeLayer.rotation,
    });
  };

  const handleSaveScheme = async () => {
    if (!schemeName.trim()) {
      setSaveMessage({ type: 'error', text: '请输入方案名称' });
      return;
    }
    
    if (!canSaveScheme()) {
      setSaveMessage({ type: 'error', text: `最多保存${MAX_SCHEMES}套方案，请先删除部分方案` });
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas || !userImage || !landmarks) return;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    drawImageOnCanvas(tempCtx, userImage, width, height);
    if (selectedCostume && costumeImg) {
      drawCostumeOnCanvas(tempCtx, costumeImg, costumeLayer, selectedCostume.neckPosition);
    }
    if (selectedHeadpiece && headpieceImg) {
      drawHeadpieceOnCanvas(tempCtx, headpieceImg, headpieceLayer, selectedHeadpiece.bottomPosition);
    }
    
    const thumbnail = canvasToDataUrl(tempCanvas);
    
    const scheme: OutfitScheme = {
      id: generateSchemeId(),
      name: schemeName.trim(),
      createdAt: Date.now(),
      thumbnail,
      costumeId: selectedCostume?.id || null,
      headpieceId: selectedHeadpiece?.id || null,
      costumeLayer,
      headpieceLayer,
      landmarks,
      imageData: thumbnail,
    };
    
    const success = saveScheme(scheme);
    if (success) {
      setSaveMessage({ type: 'success', text: '方案保存成功！' });
      setTimeout(() => {
        setSaveDialogOpen(false);
        setSchemeName('');
        setSaveMessage(null);
      }, 1500);
    } else {
      setSaveMessage({ type: 'error', text: '保存失败，请重试' });
    }
  };

  return (
    <div className="relative bg-opera-cream rounded-lg shadow-opera overflow-hidden">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-opera-red text-white rounded-lg hover:bg-red-900 transition-colors shadow-md disabled:opacity-50"
          >
            <Upload size={18} />
            <span className="text-sm">上传照片</span>
          </button>
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-opera-gold text-opera-dark rounded-lg hover:bg-yellow-500 transition-colors shadow-md disabled:opacity-50"
          >
            <Camera size={18} />
            <span className="text-sm">拍摄</span>
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`p-2 rounded-lg transition-colors shadow-md ${
              showLandmarks ? 'bg-opera-gold text-opera-dark' : 'bg-white text-gray-600'
            }`}
            title={showLandmarks ? '隐藏关键点' : '显示关键点'}
          >
            {showLandmarks ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button
            onClick={resetAll}
            className="p-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
            title="重置所有"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setSaveDialogOpen(true)}
            disabled={!userImage}
            className="flex items-center gap-2 px-4 py-2 bg-opera-red text-white rounded-lg hover:bg-red-900 transition-colors shadow-md disabled:opacity-50"
          >
            <Save size={18} />
            <span className="text-sm">保存方案</span>
          </button>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleCameraCapture}
        className="hidden"
      />
      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="cursor-move block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-12 h-12 border-4 border-opera-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>正在识别面部特征...</p>
          </div>
        </div>
      )}
      
      {landmarks && (
        <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-2 rounded-lg text-sm">
          <span className="text-opera-dark">识别置信度：</span>
          <span className={`font-bold ${landmarks.confidence > 0.7 ? 'text-green-600' : 'text-yellow-600'}`}>
            {(landmarks.confidence * 100).toFixed(0)}%
          </span>
        </div>
      )}
      
      {selectedCostume && landmarks && (
        <button
          onClick={handleAutoFit}
          className="absolute bottom-4 right-4 px-4 py-2 bg-opera-gold text-opera-dark rounded-lg hover:bg-yellow-500 transition-colors shadow-md text-sm font-medium"
        >
          自动贴合
        </button>
      )}
      
      {saveDialogOpen && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
          <div className="bg-opera-cream rounded-lg p-6 w-80 shadow-xl border-2 border-opera-gold">
            <h3 className="text-xl font-bold text-opera-red mb-4 font-opera-display">保存搭配方案</h3>
            <input
              type="text"
              value={schemeName}
              onChange={(e) => setSchemeName(e.target.value)}
              placeholder="请输入方案名称"
              className="w-full px-4 py-2 border-2 border-opera-gold rounded-lg mb-4 focus:outline-none focus:border-opera-red"
              autoFocus
            />
            {saveMessage && (
              <p className={`mb-4 text-sm ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage.text}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setSaveDialogOpen(false);
                  setSchemeName('');
                  setSaveMessage(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveScheme}
                className="px-4 py-2 bg-opera-red text-white rounded-lg hover:bg-red-900 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
