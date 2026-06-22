import { useState, useMemo } from 'react';
import { Shirt, X, Check, Info } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { costumes } from '@/data/costumes';
import { CostumeCategory } from '@/types';
import { svgToDataUrl } from '@/utils/canvasUtils';

const categoryInfo: Record<CostumeCategory, { name: string; description: string }> = {
  mangpao: { name: '蟒袍', description: '帝王将相官服，彰显尊贵身份' },
  kao: { name: '靠', description: '武将戎装，威武勇猛' },
  pei: { name: '帔', description: '贵族便服，文雅端庄' },
  zhezi: { name: '褶子', description: '平民百姓服饰，朴素大方' },
  guanyi: { name: '官衣', description: '官员礼服，等级分明' },
};

const categoryOrder: CostumeCategory[] = ['mangpao', 'kao', 'pei', 'zhezi', 'guanyi'];

export default function CostumePanel() {
  const [activeCategory, setActiveCategory] = useState<CostumeCategory>('mangpao');
  const [previewCostume, setPreviewCostume] = useState<string | null>(null);
  
  const { selectedCostume, setSelectedCostume } = useEditorStore();

  const filteredCostumes = useMemo(() => {
    return costumes.filter(c => c.category === activeCategory);
  }, [activeCategory]);

  const handleSelectCostume = (costumeId: string) => {
    if (selectedCostume?.id === costumeId) {
      setSelectedCostume(null);
    } else {
      const costume = costumes.find(c => c.id === costumeId);
      if (costume) {
        setSelectedCostume(costume);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-opera h-full flex flex-col">
      <div className="p-4 border-b border-opera-gold/20">
        <h3 className="text-lg font-bold text-opera-red mb-3 font-opera-display flex items-center gap-2">
          <Shirt size={20} />
          服装库
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {categoryOrder.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-opera-red text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {categoryInfo[category].name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 bg-opera-cream/50 border-b border-opera-gold/10">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-opera-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-opera-dark">{categoryInfo[activeCategory].name}</p>
            <p className="text-xs text-gray-600">{categoryInfo[activeCategory].description}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredCostumes.map((costume) => (
            <div
              key={costume.id}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedCostume?.id === costume.id
                  ? 'border-opera-red shadow-lg ring-2 ring-opera-red/30'
                  : 'border-gray-200 hover:border-opera-gold hover:shadow-md'
              }`}
              onClick={() => handleSelectCostume(costume.id)}
              onMouseEnter={() => setPreviewCostume(costume.id)}
              onMouseLeave={() => setPreviewCostume(null)}
            >
              <div className="aspect-[3/4] bg-opera-cream flex items-center justify-center p-2">
                <img
                  src={svgToDataUrl(costume.svgContent)}
                  alt={costume.name}
                  className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
                  draggable={false}
                />
              </div>
              
              {selectedCostume?.id === costume.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-opera-red rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                <div className="p-2 w-full">
                  <p className="text-white text-sm font-medium truncate">{costume.name}</p>
                  <p className="text-white/70 text-xs">{costume.color}</p>
                </div>
              </div>

              <div className="p-2 bg-white border-t">
                <p className="text-xs font-medium text-gray-800 truncate">{costume.name}</p>
                <p className="text-xs text-gray-500">{costume.color}</p>
              </div>

              {previewCostume === costume.id && costume.pattern && (
                <div className="absolute top-2 left-2 bg-opera-gold/90 text-opera-dark text-xs px-2 py-0.5 rounded">
                  {costume.pattern}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            共 <span className="font-bold text-opera-red">{costumes.length}</span> 款服装
          </span>
          {selectedCostume && (
            <button
              onClick={() => setSelectedCostume(null)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <X size={14} />
              取消选择
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
