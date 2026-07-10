import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Library,
  Star,
  Workflow,
  BarChart3,
  Trash2,
  Settings,
  Sparkles,
  ChevronRight,
  CircleDot,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { useSoftwareStore } from '@/stores/software.store';
import { CATEGORIES } from '@/data/categories';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';

interface SidebarProps {
  onOpenRadialMenu?: () => void;
}

const navItems = [
  { path: '/app', icon: LayoutDashboard, label: '工作台' },
  { path: '/app/library', icon: Library, label: '软件库' },
  { path: '/app/favorites', icon: Star, label: '收藏夹' },
  { path: '/app/workflows', icon: Workflow, label: '工作流' },
  { path: '/app/radial', icon: CircleDot, label: '径向菜单', badge: '中键' },
  { path: '/app/my-shares', icon: Share2, label: '我的分享' },
  { path: '/app/statistics', icon: BarChart3, label: '统计分析' },
  { path: '/app/uninstall', icon: Trash2, label: '软件清理' },
];

export function Sidebar({ onOpenRadialMenu }: SidebarProps) {
  const { software, favoriteIds } = useSoftwareStore();
  const location = useLocation();

  return (
    <aside className="w-72 shrink-0 h-screen border-r border-slate-800/60 bg-[#161b22]/95 backdrop-blur-sm flex flex-col">
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <BrandMark className="w-10 h-10 shadow-lg shadow-primary-500/20 rounded-xl" gradientId="softdesk-sidebar" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-[#161b22]" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-white tracking-tight">SoftDesk</h1>
            <p className="text-xs text-slate-500">AI 智能软件工作台</p>
          </div>
          <Sparkles className="w-4 h-4 text-accent-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-6">
        <div className="space-y-0.5">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isRadial = item.path === '/app/radial';
            if (isRadial) {
              return (
                <button
                  key={item.path}
                  onClick={onOpenRadialMenu}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group text-left',
                    'text-slate-400 border border-transparent hover:bg-slate-800/60 hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] text-slate-600 bg-slate-800/60 px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => track('sidebar_nav_click', { nav_item: item.label, nav_index: index })}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  'hover:bg-slate-800/60 hover:text-white',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/15 to-primary-500/10 text-white border border-primary-500/20'
                    : 'text-slate-400 border border-transparent'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.path === '/app/favorites' && favoriteIds.length > 0 && (
                  <span className="text-[10px] text-slate-500 tabular-nums">{favoriteIds.length}</span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary-400" />}
              </NavLink>
            );
          })}
        </div>

        <div>
          <div className="px-3.5 mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">分类</h3>
            <span className="text-[10px] text-slate-600">{software.length} 个软件</span>
          </div>

          <div className="space-y-0.5">
            {CATEGORIES.slice(0, 5).map((cat) => {
              const count = software.filter((s) => s.category === cat.id).length;
              if (count === 0) return null;
              return (
                <NavLink
                  key={cat.id}
                  to="/app/library"
                  onClick={() => useSoftwareStore.getState().setSelectedCategory(cat.id)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm transition-all duration-200',
                      'hover:bg-slate-800/40 hover:text-slate-200 text-slate-500',
                      isActive && 'text-slate-300'
                    )
                  }
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="flex-1 truncate">{cat.name}</span>
                  <span className="text-xs text-slate-600 tabular-nums">{count}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-slate-800/60 space-y-2">
        <a
          href="/#cta"
          onClick={() => track('cta_click', { cta_text: '免费下载', cta_location: 'sidebar' })}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
        >
          免费下载
          <ArrowRight className="w-4 h-4" />
        </a>
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-slate-800/60 text-white'
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            )
          }
        >
          <Settings className="w-4 h-4" />
          <span>设置</span>
        </NavLink>
      </div>
    </aside>
  );
}
