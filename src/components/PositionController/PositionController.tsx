import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { calculateFitError } from '@/utils/detectionUtils';

type LayerType = 'costume' | 'headpiece';

export default function PositionController() {
  const [activeTab, setActiveTab] = useState<LayerType>('costume');
  const [fitError, setFitError] = useState<number | null>(null);
  
  const {
    landmarks,
    selectedCostume,
    selectedHeadpiece,
    costumeLayer,
    headpieceLayer,
    setCostumeLayer,
    setHeadpieceLayer,
  } = useEditorStore();

  const currentLayer = activeTab === 'costume' ? costumeLayer : headpieceLayer;
  const setCurrentLayer = activeTab === 'costume' ? setCostumeLayer : setHeadpieceLayer;
  const selectedItem = activeTab === 'costume' ? selectedCostume : selectedHeadpiece;

  useEffect(() => {
    if (landmarks && selectedCostume) {
      const error = calculateFitError(landmarks, costumeLayer.x, costumeLayer.y, costumeLayer.scale);
      setFitError(error);
    } else {
      setFitError(null);
    }
  }, [landmarks, selectedCostume, costumeLayer]);

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right', amount: number = 5) => {
    const { x, y, ...rest } = currentLayer;
    let newX = x;
    let newY = y;
    
    switch (direction) {
      case 'up': newY -= amount; break;
      case 'down': newY += amount; break;
      case 'left': newX -= amount; break;
      case 'right': newX += amount; break;
    }
    
    setCurrentLayer({ x: newX, y: newY, ...rest });
  };

  const handleScale = (delta: number) => {
    const { scale, ...rest } = currentLayer;
    const newScale = Math.max(0.3, Math.min(2.0, scale + delta));
    setCurrentLayer({ scale: newScale, ...rest });
  };

  const handleReset = () => {
    if (activeTab === 'costume') {
      setCostumeLayer({ x: 0, y: 0, scale: 1, rotation: 0 });
    } else {
      setHeadpieceLayer({ x: 0, y: 0, scale: 1, rotation: 0 });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const amount = e.shiftKey ? 10 : 5;
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handleMove('up', amount);
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleMove('down', amount);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleMove('left', amount);
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleMove('right', amount);
        break;
    }
  };

  if (!selectedCostume && !selectedHeadpiece) {
    return (
      <div className="bg-white rounded-lg shadow-opera p-6">
        <h3 className="text-lg font-bold text-opera-red mb-4 font-opera-display">位置微调</h3>
        <p className="text-gray-500 text-center py-8">
          请先从左侧选择服装或盔头
        </p>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-opera p-6"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-opera-red font-opera-display">位置微调</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('costume')}
            disabled={!selectedCostume}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              activeTab === 'costume'
                ? 'bg-opera-red text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            服装
          </button>
          <button
            onClick={() => setActiveTab('headpiece')}
            disabled={!selectedHeadpiece}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              activeTab === 'headpiece'
                ? 'bg-opera-red text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            盔头
          </button>
        </div>
      </div>

      {selectedItem && (
        <div className="mb-4 p-3 bg-opera-cream rounded-lg border border-opera-gold/30">
          <p className="text-sm text-opera-dark">
            当前选中：<span className="font-bold">{selectedItem.name}</span>
          </p>
        </div>
      )}

      {activeTab === 'costume' && fitError !== null && (
        <div className="mb-4 p-3 rounded-lg border">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">贴合误差</span>
            <span className={`text-sm font-bold ${
              fitError <= 15 ? 'text-green-600' : fitError <= 25 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {fitError.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                fitError <= 15 ? 'bg-green-500' : fitError <= 25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, 100 - fitError * 3))}%` }}
            />
          </div>
          {fitError <= 15 && (
            <p className="text-xs text-green-600 mt-1">✓ 贴合精度达标</p>
          )}
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3 text-center">方向键移动（按住Shift快移）</p>
        <div className="grid grid-cols-3 gap-2 w-40 mx-auto">
          <div></div>
          <button
            onClick={() => handleMove('up')}
            className="p-3 bg-gray-100 hover:bg-opera-gold hover:text-opera-dark rounded-lg transition-colors"
            title="向上"
          >
            <ChevronUp size={20} className="mx-auto" />
          </button>
          <div></div>
          <button
            onClick={() => handleMove('left')}
            className="p-3 bg-gray-100 hover:bg-opera-gold hover:text-opera-dark rounded-lg transition-colors"
            title="向左"
          >
            <ChevronLeft size={20} className="mx-auto" />
          </button>
          <div className="p-3 bg-opera-cream rounded-lg flex items-center justify-center">
            <Maximize2 size={18} className="text-opera-gold" />
          </div>
          <button
            onClick={() => handleMove('right')}
            className="p-3 bg-gray-100 hover:bg-opera-gold hover:text-opera-dark rounded-lg transition-colors"
            title="向右"
          >
            <ChevronRight size={20} className="mx-auto" />
          </button>
          <div></div>
          <button
            onClick={() => handleMove('down')}
            className="p-3 bg-gray-100 hover:bg-opera-gold hover:text-opera-dark rounded-lg transition-colors"
            title="向下"
          >
            <ChevronDown size={20} className="mx-auto" />
          </button>
          <div></div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600">缩放大小</span>
          <span className="text-sm font-bold text-opera-red">
            {(currentLayer.scale * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleScale(-0.05)}
            className="p-2 bg-gray-100 hover:bg-opera-gold hover:text-opera-dark rounded-lg transition-colors"
            title="缩小"
          >
            <ZoomOut size={18} />
          </button>
          <input
            type="range"
            min="0.3"
            max="2.0"
            step="0.01"
            value={currentLayer.scale}
            onChange={(e) => setCurrentLayer({ ...currentLayer, scale: parseFloat(e.target.value) })}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-opera-red"
          />
          <button
            onClick={() => handleScale(0.05)}
            className="p-2 bg-gray-100 hover:bg-opera-gold hover:text-opera-dark rounded-lg transition-colors"
            title="放大"
          >
            <ZoomIn size={18} />
          </button>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>30%</span>
          <span>200%</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600">旋转角度</span>
          <span className="text-sm font-bold text-opera-red">
            {currentLayer.rotation.toFixed(0)}°
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentLayer({ ...currentLayer, rotation: currentLayer.rotation - 5 })}
            className="px-3 py-2 bg-gray-100 hover:bg-opera-gold hover:text-opera-dark rounded-lg transition-colors text-sm font-medium"
          >
            -5°
          </button>
          <input
            type="range"
            min="-45"
            max="45"
            step="1"
            value={currentLayer.rotation}
            onChange={(e) => setCurrentLayer({ ...currentLayer, rotation: parseFloat(e.target.value) })}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-opera-gold"
          />
          <button
            onClick={() => setCurrentLayer({ ...currentLayer, rotation: currentLayer.rotation + 5 })}
            className="px-3 py-2 bg-gray-100 hover:bg-opera-gold hover:text-opera-dark rounded-lg transition-colors text-sm font-medium"
          >
            +5°
          </button>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>-45°</span>
          <span>0°</span>
          <span>+45°</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCcw size={16} />
          <span>重置</span>
        </button>
        <button
          onClick={() => {
            if (activeTab === 'costume') {
              setCostumeLayer({ x: 250, y: 280, scale: 1, rotation: 0 });
            } else {
              setHeadpieceLayer({ x: 250, y: 120, scale: 1, rotation: 0 });
            }
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-opera-gold text-opera-dark rounded-lg hover:bg-yellow-500 transition-colors font-medium"
        >
          居中对齐
        </button>
      </div>

      <div className="mt-6 p-4 bg-opera-cream/50 rounded-lg border border-opera-gold/20">
        <h4 className="text-sm font-bold text-opera-dark mb-2">操作提示</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• 使用键盘方向键微调位置，按住Shift可快速移动</li>
          <li>• 直接在画布上拖动服装或盔头也可以移动</li>
          <li>• 调整缩放时注意领口与颈部对齐</li>
          <li>• 贴合误差≤15%为合格标准</li>
        </ul>
      </div>
    </div>
  );
}
