import { useState, useMemo } from 'react';
import { GitCompare, Download, Loader2, AlertTriangle, Check, LayoutGrid, LayoutList } from 'lucide-react';
import { OutfitScheme } from '@/types';
import { getAllSchemes, getSchemeById } from '@/utils/storageUtils';
import { generateCompareImage, downloadCompareImage, COMPARE_WIDTH, COMPARE_HEIGHT } from '@/utils/compareUtils';
import SchemeManager from '../SchemeManager/SchemeManager';

type LayoutMode = 'horizontal' | 'vertical';

export default function CompareGenerator() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutMode>('horizontal');
  const [showLabels, setShowLabels] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedSchemes = useMemo(() => {
    return selectedIds
      .map(id => getSchemeById(id))
      .filter((s): s is OutfitScheme => s !== undefined);
  }, [selectedIds]);

  const handleToggleScheme = (schemeId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(schemeId)) {
        return prev.filter(id => id !== schemeId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, schemeId];
    });
    setGeneratedImage(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (selectedSchemes.length !== 3) {
      setError('请选择3套方案');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setShowSuccess(false);

    try {
      const imageData = await generateCompareImage(selectedSchemes, {
        layout,
        showLabels,
      });
      setGeneratedImage(imageData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const schemeNames = selectedSchemes.map(s => s.name).join('_');
    const filename = `对比图_${schemeNames}_${new Date().toLocaleDateString('zh-CN')}.png`;
    downloadCompareImage(generatedImage, filename);
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
    setGeneratedImage(null);
    setError(null);
  };

  const schemeCount = getAllSchemes().length;

  return (
    <div className="min-h-screen bg-opera-gradient py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-opera-display">
            造型对比图生成
          </h1>
          <p className="text-white/80">
            选择3套搭配方案，一键生成高清对比图，方便导演挑选
          </p>
        </div>

        {showSuccess && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
            <Check size={20} />
            <span>对比图生成成功！</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-opera p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-opera-red font-opera-display">
                  选择方案
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    selectedIds.length === 3 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedIds.length}/3
                  </span>
                  {selectedIds.length > 0 && (
                    <button
                      onClick={handleClearSelection}
                      className="text-sm text-gray-500 hover:text-red-600"
                    >
                      清空
                    </button>
                  )}
                </div>
              </div>

              {selectedSchemes.length > 0 && (
                <div className="mb-4 p-3 bg-opera-cream rounded-lg border border-opera-gold/30">
                  <h3 className="text-sm font-bold text-opera-dark mb-2">已选择：</h3>
                  <div className="flex gap-2">
                    {selectedSchemes.map((scheme, index) => (
                      <div key={scheme.id} className="flex items-center gap-1">
                        <span className="w-5 h-5 bg-opera-red text-white rounded-full text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-xs text-gray-700 max-w-[100px] truncate">
                          {scheme.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {schemeCount < 3 && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-2">
                  <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">方案不足</p>
                    <p className="text-xs text-yellow-600">需要至少3套方案才能生成对比图，当前只有{schemeCount}套</p>
                  </div>
                </div>
              )}
            </div>

            <div className="h-[500px]">
              <SchemeManager
                showCompareSelection={true}
                selectedForCompare={selectedIds}
                onToggleCompare={handleToggleScheme}
              />
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-opera p-6">
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-lg font-bold text-opera-red font-opera-display">
                  生成选项
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">布局：</span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setLayout('horizontal')}
                        className={`p-2 rounded ${
                          layout === 'horizontal'
                            ? 'bg-white shadow text-opera-red'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title="横向布局"
                      >
                        <LayoutGrid size={18} />
                      </button>
                      <button
                        onClick={() => setLayout('vertical')}
                        className={`p-2 rounded ${
                          layout === 'vertical'
                            ? 'bg-white shadow text-opera-red'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title="纵向布局"
                      >
                        <LayoutList size={18} />
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showLabels}
                      onChange={(e) => setShowLabels(e.target.checked)}
                      className="w-4 h-4 accent-opera-red"
                    />
                    <span className="text-sm text-gray-600">显示标签</span>
                  </label>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">输出规格</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-opera-red">{COMPARE_WIDTH}</p>
                    <p className="text-xs text-gray-500">宽度 (px)</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-opera-red">{COMPARE_HEIGHT}</p>
                    <p className="text-xs text-gray-500">高度 (px)</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-opera-red">3</p>
                    <p className="text-xs text-gray-500">方案对比</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || selectedSchemes.length !== 3}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-opera-red text-white rounded-lg hover:bg-red-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>生成中...</span>
                    </>
                  ) : (
                    <>
                      <GitCompare size={20} />
                      <span>生成对比图</span>
                    </>
                  )}
                </button>
                {generatedImage && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-opera-gold text-opera-dark rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                  >
                    <Download size={20} />
                    <span>下载</span>
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
                  {error}
                </div>
              )}

              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
                {generatedImage ? (
                  <div className="p-4">
                    <img
                      src={generatedImage}
                      alt="对比图"
                      className="max-w-full mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <GitCompare size={64} className="mb-4 opacity-30" />
                    <p className="text-lg">选择3套方案后生成对比图</p>
                    <p className="text-sm mt-2">生成后可下载高清图片用于导演评审</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
