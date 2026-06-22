import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Upload, Crown, GitCompare, Palette, ArrowRight, Star, Users, Clock, Layers } from 'lucide-react';
import { costumes } from '@/data/costumes';
import { headpieces } from '@/data/headpieces';
import { svgToDataUrl } from '@/utils/canvasUtils';

const features = [
  {
    icon: Upload,
    title: '智能识别',
    description: '自动识别面部和肩部轮廓，精准贴合人体',
  },
  {
    icon: Palette,
    title: '海量素材',
    description: '32种经典行头，15款盔头随心搭配',
  },
  {
    icon: Crown,
    title: '精细调整',
    description: '支持位置、缩放、旋转全维度微调',
  },
  {
    icon: GitCompare,
    title: '对比生成',
    description: '一键生成高清对比图，方便导演挑选',
  },
  {
    icon: Layers,
    title: '批量方案',
    description: '批量选择多角色，自动推荐多套搭配方案',
  },
  {
    icon: Users,
    title: '网格对比',
    description: '网格布局展示所有角色方案，一键微调导出',
  },
];

const sampleCostumes = costumes.slice(0, 6);
const sampleHeadpieces = headpieces.slice(0, 6);

export default function HomePage() {
  const [hoveredCostume, setHoveredCostume] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-opera-gradient">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-[200px] text-opera-gold/20">戏</div>
          <div className="absolute bottom-20 right-10 text-[200px] text-opera-gold/20">曲</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-20 h-20 bg-opera-gold rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-opera-dark font-bold text-5xl">戏</span>
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-6 font-opera-display tracking-wider">
              虚拟戏服试穿工具
            </h1>
            <p className="text-2xl mb-4 text-white/90">
              传统戏曲 · 智能试穿 · 高效排戏
            </p>
            <p className="text-lg mb-10 text-white/70 max-w-2xl mx-auto">
              剧团服装组每次排新戏都要把十几箱行头搬出来一件件试穿，演员穿脱蟒袍玉带特别耗时间。
              现在只需上传一张照片，即可在线搭好造型再实际换装，节省大量时间和人力。
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <NavLink
                to="/editor"
                className="group flex items-center gap-3 px-8 py-4 bg-opera-gold text-opera-dark rounded-xl text-lg font-bold shadow-2xl hover:bg-yellow-400 transition-all hover:scale-105"
              >
                <Palette size={24} />
                开始试穿
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </NavLink>
              <NavLink
                to="/batch-compare"
                className="flex items-center gap-3 px-8 py-4 bg-opera-red text-white rounded-xl text-lg font-bold border-2 border-opera-gold/50 hover:bg-red-900 transition-all hover:scale-105 shadow-2xl"
              >
                <Layers size={24} />
                批量对比
              </NavLink>
              <NavLink
                to="/compare"
                className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur text-white rounded-xl text-lg font-bold border-2 border-white/30 hover:bg-white/20 transition-all hover:scale-105"
              >
                <GitCompare size={24} />
                生成对比图
              </NavLink>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-opera-gold" />
                <p className="text-3xl font-bold">32</p>
                <p className="text-white/70 text-sm">款经典行头</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <Crown className="w-8 h-8 mx-auto mb-2 text-opera-gold" />
                <p className="text-3xl font-bold">15</p>
                <p className="text-white/70 text-sm">款盔头样式</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-opera-gold" />
                <p className="text-3xl font-bold">20</p>
                <p className="text-white/70 text-sm">套方案存储</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-opera-gold" />
                <p className="text-3xl font-bold">≤15%</p>
                <p className="text-white/70 text-sm">贴合误差</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-opera-cream py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-opera-red mb-4 font-opera-display">
            核心功能
          </h2>
          <p className="text-center text-gray-600 mb-12">
            专为剧团排戏打造的智能化试穿体验
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-opera hover:shadow-xl transition-all hover:-translate-y-2 text-center group"
              >
                <div className="w-16 h-16 bg-opera-red/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-opera-red/20 transition-colors">
                  <feature.icon size={32} className="text-opera-red" />
                </div>
                <h3 className="text-xl font-bold text-opera-dark mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-opera-red mb-4 font-opera-display">
            服装库预览
          </h2>
          <p className="text-center text-gray-600 mb-12">
            蟒袍、靠、帔、褶子、官衣五大类，32种经典款式
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {sampleCostumes.map((costume, index) => (
              <div
                key={costume.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredCostume(index)}
                onMouseLeave={() => setHoveredCostume(null)}
              >
                <div className="aspect-[3/4] bg-opera-cream rounded-xl p-4 flex items-center justify-center border-2 border-transparent hover:border-opera-gold transition-all overflow-hidden">
                  <img
                    src={svgToDataUrl(costume.svgContent)}
                    alt={costume.name}
                    className="max-w-full max-h-full object-contain transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-opera-red/90 to-transparent rounded-xl flex items-end opacity-0 group-hover:opacity-100 transition-opacity p-4">
                  <div>
                    <p className="text-white font-bold text-sm">{costume.name}</p>
                    <p className="text-white/80 text-xs">{costume.color}</p>
                  </div>
                </div>
                {hoveredCostume === index && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-opera-dark text-white text-xs px-3 py-1 rounded whitespace-nowrap z-10">
                    {costume.pattern || costume.category}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <NavLink
              to="/editor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-opera-red text-white rounded-xl font-medium hover:bg-red-900 transition-colors"
            >
              查看全部
              <ArrowRight size={18} />
            </NavLink>
          </div>
        </div>
      </div>

      <div className="bg-opera-cream py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-opera-red mb-4 font-opera-display">
            盔头库预览
          </h2>
          <p className="text-center text-gray-600 mb-12">
            王帽、相貂、纱帽、凤冠、紫金冠，15款精美盔头
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {sampleHeadpieces.map((headpiece) => (
              <div
                key={headpiece.id}
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-white rounded-xl p-4 flex items-center justify-center border-2 border-transparent hover:border-opera-gold transition-all">
                  <img
                    src={svgToDataUrl(headpiece.svgContent)}
                    alt={headpiece.name}
                    className="max-w-full max-h-full object-contain transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className="font-bold text-opera-dark text-sm">{headpiece.name}</p>
                  <p className="text-gray-500 text-xs">{headpiece.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-opera-dark py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-6 font-opera-display">
            开始您的虚拟试穿之旅
          </h2>
          <p className="text-white/70 mb-8">
            上传一张照片，即可体验传统戏曲服饰的魅力
          </p>
          <NavLink
            to="/editor"
            className="inline-flex items-center gap-3 px-10 py-5 bg-opera-gold text-opera-dark rounded-xl text-xl font-bold shadow-2xl hover:bg-yellow-400 transition-all hover:scale-105"
          >
            <Palette size={28} />
            立即开始
            <ArrowRight size={24} />
          </NavLink>
        </div>
      </div>

      <footer className="bg-opera-red py-8 border-t border-opera-gold/30">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/60 text-sm">
          <p>虚拟戏服试穿工具 © 2024</p>
          <p className="mt-2">
            专为戏曲艺术传承贡献科技力量
          </p>
        </div>
      </footer>
    </div>
  );
}
