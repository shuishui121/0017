import { useState, useEffect } from 'react';
import { FolderOpen, Trash2, Eye, Download, Check, Clock, AlertCircle } from 'lucide-react';
import { OutfitScheme } from '@/types';
import { getAllSchemes, deleteScheme, getSchemeCount, MAX_SCHEMES } from '@/utils/storageUtils';
import { useEditorStore } from '@/store/useEditorStore';
import { costumes } from '@/data/costumes';
import { headpieces } from '@/data/headpieces';

interface SchemeManagerProps {
  onLoadScheme?: (scheme: OutfitScheme) => void;
  selectedForCompare?: string[];
  onToggleCompare?: (schemeId: string) => void;
  showCompareSelection?: boolean;
}

export default function SchemeManager({
  onLoadScheme,
  selectedForCompare = [],
  onToggleCompare,
  showCompareSelection = false,
}: SchemeManagerProps) {
  const [schemes, setSchemes] = useState<OutfitScheme[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const { loadScheme } = useEditorStore();

  useEffect(() => {
    refreshSchemes();
  }, []);

  const refreshSchemes = () => {
    setSchemes(getAllSchemes());
  };

  const handleDelete = (schemeId: string) => {
    const success = deleteScheme(schemeId);
    if (success) {
      setDeleteConfirm(null);
      refreshSchemes();
    }
  };

  const handleLoad = (scheme: OutfitScheme) => {
    loadScheme(scheme);
    onLoadScheme?.(scheme);
  };

  const handleDownload = (scheme: OutfitScheme) => {
    const link = document.createElement('a');
    link.download = `${scheme.name}_${new Date(scheme.createdAt).toLocaleDateString('zh-CN')}.png`;
    link.href = scheme.imageData;
    link.click();
  };

  const getCostumeName = (costumeId: string | null) => {
    if (!costumeId) return '未选择';
    return costumes.find(c => c.id === costumeId)?.name || '未知';
  };

  const getHeadpieceName = (headpieceId: string | null) => {
    if (!headpieceId) return '未选择';
    return headpieces.find(h => h.id === headpieceId)?.name || '未知';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const schemeCount = getSchemeCount();

  return (
    <div className="bg-white rounded-lg shadow-opera h-full flex flex-col">
      <div className="p-4 border-b border-opera-gold/20">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-opera-red font-opera-display flex items-center gap-2">
            <FolderOpen size={20} />
            我的方案
          </h3>
          {showCompareSelection && (
            <span className="text-sm text-gray-600">
              已选 <span className="font-bold text-opera-red">{selectedForCompare.length}</span>/3
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">存储</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  schemeCount >= MAX_SCHEMES ? 'bg-red-500' : schemeCount >= 15 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${(schemeCount / MAX_SCHEMES) * 100}%` }}
              />
            </div>
            <span className={`font-bold ${
              schemeCount >= MAX_SCHEMES ? 'text-red-500' : 'text-gray-800'
            }`}>
              {schemeCount}/{MAX_SCHEMES}
            </span>
          </div>
          <button
            onClick={refreshSchemes}
            className="text-sm text-opera-red hover:text-red-700"
          >
            刷新
          </button>
        </div>

        {showCompareSelection && (
          <div className="mt-3 p-3 bg-opera-cream rounded-lg border border-opera-gold/30">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-opera-gold" />
              <span className="text-opera-dark">选择3套方案生成对比图</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {schemes.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FolderOpen size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">暂无保存的方案</p>
            <p className="text-sm">在编辑器中搭配好造型后保存</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schemes.map((scheme) => {
              const isSelected = selectedForCompare.includes(scheme.id);
              return (
                <div
                  key={scheme.id}
                  className={`relative bg-white rounded-lg border-2 overflow-hidden transition-all ${
                    deleteConfirm === scheme.id
                      ? 'border-red-300'
                      : isSelected
                      ? 'border-opera-red ring-2 ring-opera-red/30'
                      : 'border-gray-200 hover:border-opera-gold'
                  }`}
                >
                  {showCompareSelection && (
                    <button
                      onClick={() => onToggleCompare?.(scheme.id)}
                      disabled={!isSelected && selectedForCompare.length >= 3}
                      className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-opera-red border-opera-red text-white'
                          : 'bg-white border-gray-300 text-transparent hover:border-opera-gold'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Check size={14} />
                    </button>
                  )}

                  <div className="flex">
                    <div className="w-24 h-32 bg-opera-cream flex-shrink-0 flex items-center justify-center p-1">
                      <img
                        src={scheme.thumbnail}
                        alt={scheme.name}
                        className="max-w-full max-h-full object-contain"
                        draggable={false}
                      />
                    </div>

                    <div className="flex-1 p-3 min-w-0">
                      <h4 className="font-bold text-opera-dark truncate">{scheme.name}</h4>
                      
                      <div className="mt-1 space-y-0.5">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="text-gray-400">服装：</span>
                          <span className="truncate">{getCostumeName(scheme.costumeId)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="text-gray-400">盔头：</span>
                          <span className="truncate">{getHeadpieceName(scheme.headpieceId)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <Clock size={12} />
                          <span>{formatDate(scheme.createdAt)}</span>
                        </div>
                      </div>

                      {deleteConfirm === scheme.id ? (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-red-600">确定删除？</span>
                          <button
                            onClick={() => handleDelete(scheme.id)}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                          >
                            删除
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => handleLoad(scheme)}
                            className="flex items-center gap-1 px-2 py-1 bg-opera-gold text-opera-dark text-xs rounded hover:bg-yellow-500 transition-colors"
                          >
                            <Eye size={12} />
                            加载
                          </button>
                          <button
                            onClick={() => handleDownload(scheme)}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                          >
                            <Download size={12} />
                            下载
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(scheme.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded hover:bg-red-100 hover:text-red-600 transition-colors ml-auto"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && showCompareSelection && (
                    <div className="absolute top-3 left-3 bg-opera-red text-white text-xs px-2 py-0.5 rounded z-10">
                      {selectedForCompare.indexOf(scheme.id) + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          最多保存{MAX_SCHEMES}套方案，超出请删除旧方案
        </p>
      </div>
    </div>
  );
}
