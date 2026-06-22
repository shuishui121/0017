import { useState } from 'react';
import {
  Download,
  Play,
  Loader2,
  ArrowLeft,
  Layers,
  Check,
  AlertCircle,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Role } from '@/types';
import { useEditorStore } from '@/store/useEditorStore';
import BatchRoleSelector from '@/components/BatchRoleSelector/BatchRoleSelector';
import BatchCompareView from '@/components/BatchCompareView/BatchCompareView';
import {
  generateBatchCompareImage,
  downloadCompareImage,
  getBatchImageDimensions,
} from '@/utils/compareUtils';

export default function BatchComparePage() {
  const {
    batchSession,
    schemeThumbnails,
    createBatchSession,
    clearBatchSession,
  } = useEditorStore();

  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [sessionName, setSessionName] = useState('新戏服装方案对比');
  const [schemesPerRole, setSchemesPerRole] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCreateSession = () => {
    if (selectedRoles.length === 0) {
      setError('请至少选择一个角色');
      return;
    }
    createBatchSession(sessionName, selectedRoles, schemesPerRole);
    setError(null);
  };

  const handleGenerateImage = async () => {
    if (!batchSession) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setShowSuccess(false);

    try {
      const imageData = await generateBatchCompareImage(
        batchSession,
        schemeThumbnails,
        { title: sessionName }
      );
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
    const filename = `批量对比图_${sessionName}_${new Date().toLocaleDateString('zh-CN')}.png`;
    downloadCompareImage(generatedImage, filename);
  };

  const handleBackToSetup = () => {
    clearBatchSession();
    setGeneratedImage(null);
    setError(null);
  };

  const dims = batchSession
    ? getBatchImageDimensions(batchSession.roles.length, batchSession.schemesPerRole)
    : { width: 0, height: 0 };

  return (
    <div className="min-h-screen bg-opera-gradient py-8 px-4">
      <div className="max-w-[1800px] mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-opera-display">
            批量方案对比
          </h1>
          <p className="text-white/80">
            批量选择角色，自动推荐服装搭配，一键生成对比长图供团长审批
          </p>
        </div>

        {showSuccess && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
            <Check size={20} />
            <span>对比图生成成功！</span>
          </div>
        )}

        {!batchSession ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <div className="bg-white rounded-lg shadow-opera p-4 mb-4">
                <h2 className="text-lg font-bold text-opera-red font-opera-display mb-4">
                  会话设置
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-opera-dark mb-1">
                      对比表名称
                    </label>
                    <input
                      type="text"
                      value={sessionName}
                      onChange={e => setSessionName(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-opera-gold rounded-lg focus:outline-none focus:border-opera-red"
                      placeholder="例如：《空城计》角色服装方案"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-opera-dark mb-1">
                      每个角色方案数
                    </label>
                    <div className="flex gap-2">
                      {[3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => setSchemesPerRole(n)}
                          className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                            schemesPerRole === n
                              ? 'bg-opera-red text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {n} 套
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      系统会根据角色类型自动推荐 {schemesPerRole} 套服装和盔头组合
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleCreateSession}
                  disabled={selectedRoles.length === 0}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-opera-red text-white rounded-lg hover:bg-red-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={18} />
                  <span>
                    生成推荐方案 ({selectedRoles.length} 个角色 × {schemesPerRole} 套 ={' '}
                    {selectedRoles.length * schemesPerRole} 个方案)
                  </span>
                </button>
              </div>

              <div className="h-[600px]">
                <BatchRoleSelector
                  selectedRoles={selectedRoles}
                  onRolesChange={setSelectedRoles}
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-lg shadow-opera p-6 h-full">
                <h2 className="text-lg font-bold text-opera-red font-opera-display mb-4">
                  操作流程
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: '批量选择角色',
                      desc: '从左侧角色库中选择需要定服装的角色，支持老生、青衣、花脸等多种行当',
                    },
                    {
                      step: 2,
                      title: '自动推荐方案',
                      desc: '系统根据每个角色的行当类型，自动匹配 3-5 套最合适的服装和盔头组合',
                    },
                    {
                      step: 3,
                      title: '网格对比调整',
                      desc: '在网格视图中查看所有角色的多套方案，点击缩略图可放大调整位置和缩放',
                    },
                    {
                      step: 4,
                      title: '一键导出长图',
                      desc: '自动排版生成对比长图，每个方案标注角色名、服装名、盔头名，方便审批',
                    },
                  ].map(item => (
                    <div
                      key={item.step}
                      className="flex gap-4 p-4 bg-opera-cream rounded-lg border border-opera-gold/30"
                    >
                      <div className="w-10 h-10 bg-opera-red text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-opera-dark">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-opera-gold/10 rounded-lg border border-opera-gold/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers size={18} className="text-opera-gold" />
                    <h3 className="font-bold text-opera-dark">性能特点</h3>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>⚡ 批量生成 20 个方案预览图不超过 3 秒</li>
                    <li>🎨 自动根据角色行当匹配最合适的行头</li>
                    <li>📐 导出图片高度根据方案数量自动计算</li>
                    <li>🔍 支持在对比页面直接微调每个方案</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4 bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToSetup}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span>返回设置</span>
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white font-opera-display">
                    {batchSession.name}
                  </h2>
                  <p className="text-white/70 text-sm">
                    {batchSession.roles.length} 个角色 · {batchSession.schemes.length} 个方案 ·{' '}
                    每角色 {batchSession.schemesPerRole} 套
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {dims.width > 0 && (
                  <div className="text-white/70 text-sm bg-white/10 px-3 py-1.5 rounded-lg">
                    导出尺寸: {dims.width} × {dims.height}px
                  </div>
                )}
                <button
                  onClick={handleGenerateImage}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-5 py-2.5 bg-opera-gold text-opera-dark rounded-lg hover:bg-yellow-500 transition-colors font-medium disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>生成中...</span>
                    </>
                  ) : (
                    <>
                      <Layers size={18} />
                      <span>生成对比长图</span>
                    </>
                  )}
                </button>
                {generatedImage && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-5 py-2.5 bg-opera-red text-white rounded-lg hover:bg-red-900 transition-colors font-medium"
                  >
                    <Download size={18} />
                    <span>下载</span>
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {generatedImage && (
              <div className="bg-white rounded-lg shadow-opera p-4">
                <h3 className="font-bold text-opera-red mb-4 font-opera-display">
                  导出预览
                </h3>
                <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-[600px]">
                  <img
                    src={generatedImage}
                    alt="对比长图预览"
                    className="max-w-full mx-auto rounded shadow-lg"
                  />
                </div>
              </div>
            )}

            <BatchCompareView />
          </div>
        )}
      </div>
    </div>
  );
}
