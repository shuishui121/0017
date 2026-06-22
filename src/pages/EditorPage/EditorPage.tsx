import { useState } from 'react';
import { Shirt, Crown, FolderOpen } from 'lucide-react';
import CanvasEditor from '@/components/CanvasEditor/CanvasEditor';
import PositionController from '@/components/PositionController/PositionController';
import CostumePanel from '@/components/CostumePanel/CostumePanel';
import HeadpiecePanel from '@/components/HeadpiecePanel/HeadpiecePanel';
import SchemeManager from '@/components/SchemeManager/SchemeManager';
import { useEditorStore } from '@/store/useEditorStore';

type LeftPanel = 'costume' | 'headpiece' | 'scheme';

export default function EditorPage() {
  const [leftPanel, setLeftPanel] = useState<LeftPanel>('costume');
  const { selectedCostume, selectedHeadpiece } = useEditorStore();

  return (
    <div className="min-h-screen bg-opera-gradient">
      <div className="max-w-[1800px] mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 font-opera-display tracking-wider">
            虚拟戏服试穿工具
          </h1>
          <p className="text-white/80 text-lg">
            上传照片 · 智能识别人物轮廓 · 搭配传统戏曲行头
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6" style={{ minHeight: 'calc(100vh - 180px)' }}>
          <div className="col-span-3 flex flex-col gap-4">
            <div className="flex bg-white/10 backdrop-blur rounded-lg p-1">
              <button
                onClick={() => setLeftPanel('costume')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md transition-all ${
                  leftPanel === 'costume'
                    ? 'bg-opera-red text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Shirt size={18} />
                <span className="text-sm font-medium">服装</span>
                {selectedCostume && (
                  <span className="w-2 h-2 bg-opera-gold rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setLeftPanel('headpiece')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md transition-all ${
                  leftPanel === 'headpiece'
                    ? 'bg-opera-red text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Crown size={18} />
                <span className="text-sm font-medium">盔头</span>
                {selectedHeadpiece && (
                  <span className="w-2 h-2 bg-opera-gold rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setLeftPanel('scheme')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md transition-all ${
                  leftPanel === 'scheme'
                    ? 'bg-opera-red text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <FolderOpen size={18} />
                <span className="text-sm font-medium">方案</span>
              </button>
            </div>

            <div className="flex-1 min-h-0">
              {leftPanel === 'costume' && <CostumePanel />}
              {leftPanel === 'headpiece' && <HeadpiecePanel />}
              {leftPanel === 'scheme' && <SchemeManager />}
            </div>
          </div>

          <div className="col-span-6 flex flex-col items-center">
            <CanvasEditor width={500} height={700} />
            
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2 text-white text-sm">
                <span className="text-white/60">服装：</span>
                <span className="font-medium">{selectedCostume?.name || '未选择'}</span>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2 text-white text-sm">
                <span className="text-white/60">盔头：</span>
                <span className="font-medium">{selectedHeadpiece?.name || '未选择'}</span>
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <PositionController />
          </div>
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur rounded-lg p-6">
          <h3 className="text-white font-bold text-lg mb-4 font-opera-display">使用说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="w-8 h-8 bg-opera-gold text-opera-dark rounded-full flex items-center justify-center font-bold mb-2">
                1
              </div>
              <h4 className="text-white font-medium mb-1">上传照片</h4>
              <p className="text-white/60 text-sm">上传或拍摄一张正面半身照，确保面部和双肩清晰可见</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="w-8 h-8 bg-opera-gold text-opera-dark rounded-full flex items-center justify-center font-bold mb-2">
                2
              </div>
              <h4 className="text-white font-medium mb-1">选择行头</h4>
              <p className="text-white/60 text-sm">从左侧面板选择服装和盔头，系统会自动贴合到人物身上</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="w-8 h-8 bg-opera-gold text-opera-dark rounded-full flex items-center justify-center font-bold mb-2">
                3
              </div>
              <h4 className="text-white font-medium mb-1">微调位置</h4>
              <p className="text-white/60 text-sm">使用方向键或拖拽调整服装位置和大小，确保领口对齐</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="w-8 h-8 bg-opera-gold text-opera-dark rounded-full flex items-center justify-center font-bold mb-2">
                4
              </div>
              <h4 className="text-white font-medium mb-1">保存方案</h4>
              <p className="text-white/60 text-sm">保存满意的搭配方案，可生成对比图供导演挑选</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
