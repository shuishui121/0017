import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import {
  BatchScheme,
  Role,
  LayerState,
  ROLE_TYPE_LABELS,
} from '@/types';
import { costumes } from '@/data/costumes';
import { headpieces } from '@/data/headpieces';
import {
  renderSchemeThumbnail,
  renderBatchThumbnails,
  THUMBNAIL_WIDTH,
  THUMBNAIL_HEIGHT,
  DEFAULT_LANDMARKS,
} from '@/utils/batchRenderUtils';

export default function BatchCompareView() {
  const {
    batchSession,
    schemeThumbnails,
    setAllSchemeThumbnails,
    setSchemeThumbnail,
    updateScheme,
    removeScheme,
    generateRecommendations,
  } = useEditorStore();

  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [activeEditLayer, setActiveEditLayer] = useState<'costume' | 'headpiece'>('costume');

  const selectedScheme = useMemo(() => {
    if (!selectedSchemeId || !batchSession) return null;
    return batchSession.schemes.find(s => s.id === selectedSchemeId) || null;
  }, [selectedSchemeId, batchSession]);

  const selectedRole = useMemo(() => {
    if (!selectedScheme || !batchSession) return null;
    return batchSession.roles.find(r => r.id === selectedScheme.roleId) || null;
  }, [selectedScheme, batchSession]);

  const roles = batchSession?.roles || [];
  const schemesPerRole = batchSession?.schemesPerRole || 4;

  const schemesByRole = useMemo(() => {
    const map = new Map<string, BatchScheme[]>();
    for (const role of roles) {
      map.set(role.id, []);
    }
    if (batchSession) {
      for (const scheme of batchSession.schemes) {
        const arr = map.get(scheme.roleId) || [];
        arr.push(scheme);
        map.set(scheme.roleId, arr);
      }
    }
    return map;
  }, [batchSession, roles]);

  const renderAllThumbnails = useCallback(async () => {
    if (!batchSession || batchSession.schemes.length === 0) return;

    setIsRendering(true);
    try {
      const thumbnails = await renderBatchThumbnails(
        batchSession.schemes,
        batchSession.roles,
        THUMBNAIL_WIDTH,
        THUMBNAIL_HEIGHT
      );
      setAllSchemeThumbnails(thumbnails);
    } catch (e) {
      console.error('Failed to render thumbnails:', e);
    } finally {
      setIsRendering(false);
    }
  }, [batchSession, setAllSchemeThumbnails]);

  useEffect(() => {
    if (batchSession && schemeThumbnails.size === 0) {
      renderAllThumbnails();
    }
  }, [batchSession, schemeThumbnails.size, renderAllThumbnails]);

  const refreshSingleThumbnail = async (schemeId: string) => {
    if (!batchSession) return;
    const scheme = batchSession.schemes.find(s => s.id === schemeId);
    const role = batchSession.roles.find(r => r.id === scheme?.roleId);
    if (!scheme || !role) return;

    try {
      const thumb = await renderSchemeThumbnail(scheme, role);
      setSchemeThumbnail(schemeId, thumb);
    } catch (e) {
      console.error('Failed to refresh thumbnail:', e);
    }
  };

  const handleLayerAdjust = (layer: 'costume' | 'headpiece', updates: Partial<LayerState>) => {
    if (!selectedSchemeId) return;
    const scheme = batchSession?.schemes.find(s => s.id === selectedSchemeId);
    if (!scheme) return;

    const currentLayer = layer === 'costume' ? scheme.costumeLayer : scheme.headpieceLayer;
    const newState = { ...currentLayer };

    if (updates.x !== undefined) newState.x += updates.x;
    if (updates.y !== undefined) newState.y += updates.y;
    if (updates.scale !== undefined) {
      newState.scale = Math.max(0.5, Math.min(2, newState.scale + updates.scale));
    }
    if (updates.rotation !== undefined) {
      newState.rotation = (newState.rotation + updates.rotation) % 360;
    }

    const key = layer === 'costume' ? 'costumeLayer' : 'headpieceLayer';
    updateScheme(selectedSchemeId, { [key]: newState });
    setTimeout(() => refreshSingleThumbnail(selectedSchemeId), 50);
  };

  const resetSelectedSchemeLayers = () => {
    if (!selectedSchemeId || !batchSession) return;
    const scheme = batchSession.schemes.find(s => s.id === selectedSchemeId);
    const role = batchSession.roles.find(r => r.id === scheme?.roleId);
    if (!scheme || !role) return;

    const landmarks = role.defaultLandmarks || DEFAULT_LANDMARKS;
    const costume = scheme.costumeId
      ? costumes.find(c => c.id === scheme.costumeId)
      : null;
    const headpiece = scheme.headpieceId
      ? headpieces.find(h => h.id === scheme.headpieceId)
      : null;

    updateScheme(selectedSchemeId, {
      costumeLayer: {
        x: landmarks.neckBase.x,
        y: landmarks.neckBase.y + (costume?.defaultOffsetY || 0),
        scale: costume?.defaultScale || 1,
        rotation: 0,
      },
      headpieceLayer: {
        x: landmarks.faceCenter.x,
        y: landmarks.faceCenter.y + (headpiece?.defaultOffsetY || 0),
        scale: headpiece?.defaultScale || 1,
        rotation: 0,
      },
    });
    setTimeout(() => refreshSingleThumbnail(selectedSchemeId), 50);
  };

  if (!batchSession) {
    return (
      <div className="bg-white rounded-lg shadow-opera p-8 text-center">
        <p className="text-gray-500">请先选择角色并创建批量会话</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-opera p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-opera-red font-opera-display">
            方案对比视图
          </h2>
          <p className="text-sm text-gray-500">
            {roles.length} 个角色 · {batchSession.schemes.length} 个方案 · 每行一个角色
          </p>
        </div>
        <div className="flex gap-2">
          {isRendering && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <RefreshCw size={14} className="animate-spin" />
              渲染中...
            </span>
          )}
          <button
            onClick={renderAllThumbnails}
            disabled={isRendering}
            className="flex items-center gap-1 px-3 py-1.5 bg-opera-gold text-opera-dark rounded-lg hover:bg-yellow-500 transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRendering ? 'animate-spin' : ''} />
            刷新预览
          </button>
          <button
            onClick={() => generateRecommendations()}
            className="flex items-center gap-1 px-3 py-1.5 bg-opera-red text-white rounded-lg hover:bg-red-900 transition-colors text-sm"
          >
            <RefreshCw size={14} />
            重新推荐
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex">
            <div
              className="sticky left-0 z-10 bg-opera-cream border-r-2 border-opera-gold"
              style={{ width: 140 }}
            >
              <div
                className="p-3 border-b-2 border-opera-gold font-bold text-opera-dark text-center"
                style={{ height: 40 }}
              >
                角色 \ 方案
              </div>
              {roles.map(role => (
                <div
                  key={role.id}
                  className="p-2 border-b border-opera-gold/30"
                  style={{ height: THUMBNAIL_HEIGHT + 80 }}
                >
                  <p className="font-bold text-opera-dark text-sm">{role.name}</p>
                  <p className="text-xs text-opera-red">
                    {ROLE_TYPE_LABELS[role.roleType]}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex">
              {Array.from({ length: schemesPerRole }).map((_, colIdx) => (
                <div key={colIdx} className="flex flex-col">
                  <div
                    className="p-3 border-b-2 border-opera-gold bg-opera-cream/50 font-bold text-opera-dark text-center"
                    style={{ width: THUMBNAIL_WIDTH + 24, height: 40 }}
                  >
                    方案 {colIdx + 1}
                  </div>
                  {roles.map(role => {
                    const roleSchemes = schemesByRole.get(role.id) || [];
                    const scheme = roleSchemes[colIdx];

                    return (
                      <div
                        key={role.id}
                        className="p-3 border-b border-r border-opera-gold/20"
                        style={{ width: THUMBNAIL_WIDTH + 24, height: THUMBNAIL_HEIGHT + 80 }}
                      >
                        {scheme ? (
                          <SchemeThumbnailCard
                            scheme={scheme}
                            role={role}
                            thumbnail={schemeThumbnails.get(scheme.id)}
                            isSelected={selectedSchemeId === scheme.id}
                            onClick={() => setSelectedSchemeId(scheme.id)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-xs text-gray-400">无方案</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedScheme && selectedRole && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-opera-cream rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b-2 border-opera-gold bg-white">
              <div>
                <h3 className="text-xl font-bold text-opera-red font-opera-display">
                  {selectedRole.name} - 方案详情
                </h3>
                <p className="text-sm text-gray-500">
                  {ROLE_TYPE_LABELS[selectedRole.roleType]}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => removeScheme(selectedScheme.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="删除方案"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => setSelectedSchemeId(null)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-opera-gold/50">
                  <h4 className="font-bold text-opera-dark mb-3 text-center">预览效果</h4>
                  <div className="flex justify-center">
                    {schemeThumbnails.get(selectedScheme.id) ? (
                      <img
                        src={schemeThumbnails.get(selectedScheme.id)!}
                        alt="方案预览"
                        className="rounded-lg shadow-md"
                        style={{ width: THUMBNAIL_WIDTH * 1.5, height: THUMBNAIL_HEIGHT * 1.5, objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="w-[375px] h-[525px] bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">渲染中...</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-opera-cream p-3 rounded-lg">
                      <p className="text-xs text-gray-500">服装</p>
                      <p className="font-bold text-opera-dark">
                        {selectedScheme.costumeId
                          ? costumes.find(c => c.id === selectedScheme.costumeId)?.name || '未选择'
                          : '未选择'}
                      </p>
                    </div>
                    <div className="bg-opera-cream p-3 rounded-lg">
                      <p className="text-xs text-gray-500">盔头</p>
                      <p className="font-bold text-opera-dark">
                        {selectedScheme.headpieceId
                          ? headpieces.find(h => h.id === selectedScheme.headpieceId)?.name || '未选择'
                          : '未选择'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-opera-gold/50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-opera-dark">位置调整</h4>
                    <button
                      onClick={resetSelectedSchemeLayers}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                    >
                      <RotateCcw size={12} />
                      重置
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setActiveEditLayer('costume')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeEditLayer === 'costume'
                            ? 'bg-opera-red text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        服装
                      </button>
                      <button
                        onClick={() => setActiveEditLayer('headpiece')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeEditLayer === 'headpiece'
                            ? 'bg-opera-red text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        盔头
                      </button>
                    </div>

                    <div className="bg-opera-cream rounded-lg p-4">
                      <div className="flex flex-col items-center gap-1 mb-4">
                        <button
                          onClick={() => handleLayerAdjust(activeEditLayer, { y: -5 })}
                          className="p-2 bg-white rounded-lg shadow hover:bg-opera-gold/20 transition-colors"
                        >
                          <ChevronUp size={20} />
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleLayerAdjust(activeEditLayer, { x: -5 })}
                            className="p-2 bg-white rounded-lg shadow hover:bg-opera-gold/20 transition-colors"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <div className="w-10 h-10 flex items-center justify-center">
                            <Move size={20} className="text-opera-gold" />
                          </div>
                          <button
                            onClick={() => handleLayerAdjust(activeEditLayer, { x: 5 })}
                            className="p-2 bg-white rounded-lg shadow hover:bg-opera-gold/20 transition-colors"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleLayerAdjust(activeEditLayer, { y: 5 })}
                          className="p-2 bg-white rounded-lg shadow hover:bg-opera-gold/20 transition-colors"
                        >
                          <ChevronDown size={20} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <button
                          onClick={() => handleLayerAdjust(activeEditLayer, { scale: -0.05 })}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white rounded-lg shadow hover:bg-opera-gold/20 transition-colors"
                        >
                          <ZoomOut size={16} />
                          <span className="text-sm">缩小</span>
                        </button>
                        <span className="text-sm font-bold text-opera-dark min-w-[60px] text-center">
                          {(
                            (activeEditLayer === 'costume'
                              ? selectedScheme.costumeLayer.scale
                              : selectedScheme.headpieceLayer.scale) * 100
                          ).toFixed(0)}
                          %
                        </span>
                        <button
                          onClick={() => handleLayerAdjust(activeEditLayer, { scale: 0.05 })}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white rounded-lg shadow hover:bg-opera-gold/20 transition-colors"
                        >
                          <ZoomIn size={16} />
                          <span className="text-sm">放大</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                    <p>💡 提示：</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>使用方向键调整位置</li>
                      <li>使用缩放按钮调整大小</li>
                      <li>调整完成后会自动更新预览</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SchemeThumbnailCardProps {
  scheme: BatchScheme;
  role: Role;
  thumbnail?: string;
  isSelected: boolean;
  onClick: () => void;
}

function SchemeThumbnailCard({
  scheme,
  role,
  thumbnail,
  isSelected,
  onClick,
}: SchemeThumbnailCardProps) {
  const costumeName = scheme.costumeId
    ? costumes.find(c => c.id === scheme.costumeId)?.name
    : undefined;
  const headpieceName = scheme.headpieceId
    ? headpieces.find(h => h.id === scheme.headpieceId)?.name
    : undefined;

  return (
    <button
      onClick={onClick}
      className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all text-left ${
        isSelected
          ? 'border-opera-red ring-2 ring-opera-red/30 scale-105 shadow-lg'
          : 'border-opera-gold/30 hover:border-opera-gold hover:shadow-md'
      }`}
    >
      <div className="bg-white" style={{ height: THUMBNAIL_HEIGHT }}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`${role.name} 方案`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="w-6 h-6 border-2 border-opera-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="p-2 bg-opera-cream border-t border-opera-gold/20">
        <p className="text-xs text-gray-600 truncate">
          服装: <span className="text-opera-dark font-medium">{costumeName || '-'}</span>
        </p>
        <p className="text-xs text-gray-600 truncate">
          盔头: <span className="text-opera-dark font-medium">{headpieceName || '-'}</span>
        </p>
      </div>
    </button>
  );
}
