import { useState } from 'react';
import { Crown, X, Check, Info } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { headpieces } from '@/data/headpieces';
import { HeadpieceCategory } from '@/types';
import { svgToDataUrl } from '@/utils/canvasUtils';

const categoryInfo: Record<HeadpieceCategory, { name: string; description: string }> = {
  imperial: { name: '帝后', description: '帝王后妃专属冠帽' },
  official: { name: '官员', description: '文臣武将礼帽' },
  warrior: { name: '武将', description: '将帅军师头盔' },
  female: { name: '女眷', description: '贵族妇女头饰' },
  other: { name: '其他', description: '各类特殊角色盔头' },
};

const categoryOrder: HeadpieceCategory[] = ['imperial', 'official', 'warrior', 'female', 'other'];

export default function HeadpiecePanel() {
  const [activeCategory, setActiveCategory] = useState<HeadpieceCategory>('imperial');
  const [previewHeadpiece, setPreviewHeadpiece] = useState<string | null>(null);
  
  const { selectedHeadpiece, setSelectedHeadpiece } = useEditorStore();

  const filteredHeadpieces = headpieces.filter(h => h.category === activeCategory);

  const handleSelectHeadpiece = (headpieceId: string) => {
    if (selectedHeadpiece?.id === headpieceId) {
      setSelectedHeadpiece(null);
    } else {
      const headpiece = headpieces.find(h => h.id === headpieceId);
      if (headpiece) {
        setSelectedHeadpiece(headpiece);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-opera h-full flex flex-col">
      <div className="p-4 border-b border-opera-gold/20">
        <h3 className="text-lg font-bold text-opera-red mb-3 font-opera-display flex items-center gap-2">
          <Crown size={20} />
          盔头库
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
            <p className="text-sm font-medium text-opera-dark">{categoryInfo[activeCategory].name}盔头</p>
            <p className="text-xs text-gray-600">{categoryInfo[activeCategory].description}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredHeadpieces.map((headpiece) => (
            <div
              key={headpiece.id}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedHeadpiece?.id === headpiece.id
                  ? 'border-opera-red shadow-lg ring-2 ring-opera-red/30'
                  : 'border-gray-200 hover:border-opera-gold hover:shadow-md'
              }`}
              onClick={() => handleSelectHeadpiece(headpiece.id)}
              onMouseEnter={() => setPreviewHeadpiece(headpiece.id)}
              onMouseLeave={() => setPreviewHeadpiece(null)}
            >
              <div className="aspect-square bg-opera-cream flex items-center justify-center p-3">
                <img
                  src={svgToDataUrl(headpiece.svgContent)}
                  alt={headpiece.name}
                  className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
                  draggable={false}
                />
              </div>
              
              {selectedHeadpiece?.id === headpiece.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-opera-red rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                <div className="p-2 w-full">
                  <p className="text-white text-sm font-medium truncate">{headpiece.name}</p>
                  <p className="text-white/70 text-xs">{headpiece.description}</p>
                </div>
              </div>

              <div className="p-2 bg-white border-t">
                <p className="text-xs font-medium text-gray-800 truncate">{headpiece.name}</p>
                <p className="text-xs text-gray-500 truncate">{headpiece.description}</p>
              </div>

              {previewHeadpiece === headpiece.id && (
                <div className="absolute top-2 left-2 bg-opera-gold/90 text-opera-dark text-xs px-2 py-0.5 rounded max-w-[80%] overflow-hidden text-ellipsis whitespace-nowrap">
                  {headpiece.suitableRole || headpiece.color}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredHeadpieces.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Crown size={48} className="mx-auto mb-3 opacity-30" />
            <p>该分类暂无盔头</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            共 <span className="font-bold text-opera-red">{headpieces.length}</span> 款盔头
          </span>
          {selectedHeadpiece && (
            <button
              onClick={() => setSelectedHeadpiece(null)}
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
