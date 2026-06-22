import { NavLink } from 'react-router-dom';
import { Palette, GitCompare, Home, Layers } from 'lucide-react';

export default function AppHeader() {
  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/editor', label: '试穿编辑', icon: Palette },
    { path: '/compare', label: '对比图', icon: GitCompare },
    { path: '/batch-compare', label: '批量对比', icon: Layers },
  ];

  return (
    <header className="bg-opera-red border-b-4 border-opera-gold shadow-lg">
      <div className="max-w-[1800px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-opera-gold rounded-lg flex items-center justify-center">
              <span className="text-opera-dark font-bold text-xl">戏</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl font-opera-display tracking-wider">
                虚拟戏服试穿
              </h1>
              <p className="text-opera-gold text-xs">Opera Costume Fitting System</p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-opera-gold text-opera-dark'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
