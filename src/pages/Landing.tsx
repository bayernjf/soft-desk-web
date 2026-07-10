import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  CircleDot,
  Clock,
  Github,
  Layers,
  Moon,
  Play,
  Search,
  Sparkles,
  Star,
  Sun,
  Workflow,
  Zap,
  X,
  Monitor,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandMark } from '@/components/BrandMark';
import { RadialMenu } from '@/components/RadialMenu';
import { useSoftwareStore } from '@/stores/software.store';
import { CATEGORIES } from '@/data/categories';
import { formatMinutes, formatTimeAgo } from '@/services/software.service';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { useSectionVisibility, useScrollDepthTracking } from '@/hooks/useAnalytics';
import type { Software, Workflow as WorkflowType } from '@/types';

// 主题切换 Hook
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('landing-theme') as 'light' | 'dark';
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('landing-theme', theme);
    document.documentElement.setAttribute('data-landing-theme', theme);
  }, [theme]);

  const toggle = () => {
    const from = theme;
    const to = theme === 'dark' ? 'light' : 'dark';
    setTheme(to);
    track('theme_toggle', { from_theme: from, to_theme: to });
  };
  return { theme, toggle };
}

// 模拟 AI 分类进度动画
function useClassifyProgress() {
  const [progress, setProgress] = useState(0);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classifiedCount, setClassifiedCount] = useState(0);

  const startClassify = () => {
    setIsClassifying(true);
    setProgress(0);
    setClassifiedCount(0);
    const total = 18;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setProgress(Math.round((current / total) * 100));
      setClassifiedCount(current);
      if (current >= total) {
        clearInterval(timer);
        setTimeout(() => setIsClassifying(false), 1000);
      }
    }, 150);
  };

  return { progress, isClassifying, classifiedCount, startClassify };
}

// 模拟自然语言搜索
function useNaturalSearch(software: Software[]) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Software[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchReason, setSearchReason] = useState('');

  const predefinedQueries = [
    { text: '截屏', reason: '匹配到包含"截屏"相关标签的软件' },
    { text: '修图', reason: '识别到设计类软件，适合图片编辑' },
    { text: '做表格', reason: '找到办公效率类软件，支持表格处理' },
    { text: '写代码', reason: '定位到开发工具类，适合编程环境' },
  ];

  const search = (text: string) => {
    setQuery(text);
    setIsSearching(true);
    setTimeout(() => {
      const matched = software.filter(
        (s) =>
          s.name.toLowerCase().includes(text.toLowerCase()) ||
          s.description.toLowerCase().includes(text.toLowerCase()) ||
          s.tags.some((t) => t.toLowerCase().includes(text.toLowerCase())) ||
          (text.includes('截屏') && s.category === 'utilities') ||
          (text.includes('修图') && s.category === 'design') ||
          (text.includes('表格') && s.category === 'productivity') ||
          (text.includes('代码') && s.category === 'dev-tools')
      );
      setResults(matched.slice(0, 4));
      const reasonData = predefinedQueries.find((q) => q.text === text);
      setSearchReason(reasonData?.reason || `找到 ${matched.length} 个匹配软件`);
      setIsSearching(false);
    }, 800);
  };

  const clear = () => {
    setQuery('');
    setResults([]);
    setSearchReason('');
  };

  return { query, results, isSearching, searchReason, search, clear };
}

// Logo 组件
function Logo({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div className="flex items-center gap-2.5">
      <BrandMark
        className={cn(
          'w-8 h-8 rounded-lg shadow-glow-brand',
          theme === 'light' && 'shadow-glow-brand-light'
        )}
        gradientId="softdesk-nav"
      />
      <span
        className={cn(
          'text-lg font-bold tracking-tight',
          theme === 'light' ? 'text-slate-800' : 'text-white'
        )}
      >
        SoftDesk
      </span>
    </div>
  );
}

// 导航栏
function Nav({ theme, toggleTheme }: { theme: 'light' | 'dark'; toggleTheme: () => void }) {
  const links = [
    { label: '径向菜单', href: '#radial-menu' },
    { label: 'AI 分类', href: '#ai-classify' },
    { label: '搜索', href: '#search' },
    { label: '工作流', href: '#workflow' },
    { label: '收藏夹', href: '#favorites' },
    { label: '统计', href: '#statistics' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b',
        theme === 'light'
          ? 'bg-white/80 border-slate-200'
          : 'bg-[#0d1117]/70 border-slate-800/60'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo theme={theme} />
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                'text-sm transition-colors',
                theme === 'light'
                  ? 'text-slate-500 hover:text-slate-800'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={cn(
              'p-2 rounded-xl transition-colors',
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400'
            )}
            aria-label="切换主题"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

// Hero 区域
function Hero({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <section className="relative pt-40 pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {theme === 'dark' && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-500/15 rounded-full blur-[140px]" />
            <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[120px]" />
          </>
        )}
        {theme === 'light' && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-accent-500/8 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <div
          className={cn(
            'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-8 animate-in',
            theme === 'light'
              ? 'bg-primary-500/10 border border-primary-500/20 text-primary-600'
              : 'bg-primary-500/10 border border-primary-500/20 text-primary-300'
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI 驱动的桌面软件智能指挥中心
        </div>

        <h1
          className={cn(
            'text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]',
            theme === 'light' ? 'text-slate-800' : 'text-white'
          )}
        >
          AI 驱动的软件管理效率工具，
          <br />
          <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-brandamber-500 bg-clip-text text-transparent">
            在繁多的窗口间快速切换常用软件
          </span>
        </h1>

        <p
          className={cn(
            'mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed',
            theme === 'light' ? 'text-slate-500' : 'text-slate-400'
          )}
        >
          SoftDesk 是一款桌面端 AI 系统工具，统一管理你电脑上的所有软件。自动识别用途、感知使用习惯、智能编排工作流——你只需享受结果，零维护成本。
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://github.com/bayernjf/soft-desk/releases"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('cta_click', { cta_text: '下载Mac', cta_location: 'hero' })}
              className={cn(
                'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-glow-brand hover:scale-[1.02]',
                theme === 'light'
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              )}
            >
              下载Mac
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/bayernjf/soft-desk/releases"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('cta_click', { cta_text: '下载Win', cta_location: 'hero' })}
              className={cn(
                'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-glow-brand hover:scale-[1.02]',
                theme === 'light'
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              )}
            >
              下载Win
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <Link
            to="/app"
            onClick={() => track('cta_click', { cta_text: '查看在线演示', cta_location: 'hero' })}
            className={cn(
              'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-colors border',
              theme === 'light'
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-200'
            )}
          >
            <Monitor className="w-4 h-4" />
            查看在线演示
          </Link>
        </div>

        <div
          className={cn(
            'mt-8 flex items-center justify-center gap-6 text-xs',
            theme === 'light' ? 'text-slate-400' : 'text-slate-500'
          )}
        >
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-success" />
            Windows / macOS
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-success" />
            本地隐私优先
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-success" />
            零配置开箱即用
          </span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Monitor className="w-3.5 h-3.5" />
          <span>点击鼠标中键可体验径向菜单快捷启动</span>
        </div>
      </div>
    </section>
  );
}

function isTouchpadWheel(e: WheelEvent): boolean {
  if (e.deltaY !== Math.floor(e.deltaY)) return true;
  const wd = (e as WheelEvent & { wheelDeltaY?: number }).wheelDeltaY;
  if (typeof wd === 'number' && wd !== 0 && wd % 120 !== 0) return true;
  if (e.deltaMode === 0 && Math.abs(e.deltaY) > 0 && Math.abs(e.deltaY) < 50) return true;
  return false;
}

// 径向菜单介绍
const RadialMenuSection = React.forwardRef<HTMLElement, {
  theme: 'light' | 'dark';
  software: Software[];
  workflows: WorkflowType[];
}>(({
  theme,
  software,
  workflows,
}, ref) => {
  const [demoOpen, setDemoOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState<0 | 1>(0);
  const [animPhase, setAnimPhase] = useState<'idle' | 'out' | 'switch' | 'in'>('idle');
  const wheelDirRef = useRef(1);
  const previewRef = useRef<HTMLDivElement>(null);

  const WHEEL_THRESHOLD = 60;
  const WHEEL_COOLDOWN = 800;
  const wheelAccumRef = useRef(0);
  const wheelCooldownRef = useRef(false);
  const wheelIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelCooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const PREVIEW_SIZE = 280;
  const PREVIEW_INNER = 50;
  const PREVIEW_OUTER = 120;
  const PREVIEW_LABEL_R = (PREVIEW_INNER + PREVIEW_OUTER) / 2;
  const sectors = 6;

  const previewItems = useMemo(() => {
    type PreviewItem = { slot: number; name: string; color: string; type: 'software' | 'workflow' };

    const favoriteSoftware = software
      .filter((s) => s.launchCount > 100)
      .sort((a, b) => b.launchCount - a.launchCount);

    const favoriteWorkflows = workflows.filter((w) => w.isFavorite);

    const page0Items: PreviewItem[] = [];
    favoriteSoftware.slice(0, 6).forEach((app, idx) => {
      page0Items.push({
        slot: idx,
        name: app.name,
        color: app.color,
        type: 'software' as const,
      });
    });

    if (page0Items.length < 6) {
      favoriteWorkflows.slice(0, 6 - page0Items.length).forEach((wf, idx) => {
        page0Items.push({
          slot: page0Items.length + idx,
          name: wf.name,
          color: wf.color,
          type: 'workflow' as const,
        });
      });
    }

    const page1Items: PreviewItem[] = [];
    const moreSoftware = favoriteSoftware.slice(6);
    const moreWorkflows = favoriteWorkflows.slice(Math.max(0, 6 - favoriteSoftware.length));

    moreSoftware.slice(0, 6).forEach((app, idx) => {
      page1Items.push({
        slot: idx,
        name: app.name,
        color: app.color,
        type: 'software' as const,
      });
    });

    if (page1Items.length < 6) {
      moreWorkflows.slice(0, 6 - page1Items.length).forEach((wf, idx) => {
        page1Items.push({
          slot: page1Items.length + idx,
          name: wf.name,
          color: wf.color,
          type: 'workflow' as const,
        });
      });
    }

    return [page0Items, page1Items];
  }, [software, workflows]);

  const itemBySlot = useMemo(() => {
    const items = previewItems[previewPage] ?? [];
    const map = new Map<number, (typeof items)[number]>();
    items.forEach((it) => map.set(it.slot, it));
    return map;
  }, [previewItems, previewPage]);

  const totalPages = previewItems.filter((p) => p.length > 0).length;

  const sectorAngle = 360 / sectors;
  const cx = PREVIEW_SIZE / 2;
  const cy = PREVIEW_SIZE / 2;

  const polarP = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const sectorPathP = (startDeg: number, endDeg: number, outerR = PREVIEW_OUTER, gapDeg = 0) => {
    const half = gapDeg / 2;
    const s = startDeg + half;
    const e = endDeg - half;
    const oStart = polarP(outerR, s);
    const oEnd = polarP(outerR, e);
    const iEnd = polarP(PREVIEW_INNER, e);
    const iStart = polarP(PREVIEW_INNER, s);
    const largeArc = e - s > 180 ? 1 : 0;
    return [
      `M ${oStart.x} ${oStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${oEnd.x} ${oEnd.y}`,
      `L ${iEnd.x} ${iEnd.y}`,
      `A ${PREVIEW_INNER} ${PREVIEW_INNER} 0 ${largeArc} 0 ${iStart.x} ${iStart.y}`,
      'Z',
    ].join(' ');
  };

  const isLight = theme === 'light';
  const styleTokens = {
    sectorFill: (_isActive: boolean, itemColor?: string) =>
      itemColor
        ? itemColor + '25'
        : isLight
          ? 'rgba(248,250,252,0.9)'
          : 'rgba(21,21,28,0.82)',
    sectorStroke: (isActive: boolean) =>
      isActive
        ? 'rgba(167,139,250,0.9)'
        : isLight
          ? 'rgba(148,163,184,0.35)'
          : 'rgba(148,163,184,0.25)',
    sectorStrokeWidth: (isActive: boolean) => (isActive ? 2 : 1.5),
    sectorGap: 0,
    centerFill: isLight ? 'rgba(248,250,252,0.95)' : 'rgba(21,21,28,0.55)',
    centerStroke: isLight ? 'rgba(148,163,184,0.3)' : 'rgba(148,163,184,0.2)',
    textFill: (isActive: boolean) =>
      isActive ? '#fff' : isLight ? '#334155' : '#cbd5e1',
    emptyMarkFill: isLight ? 'rgba(148,163,184,0.5)' : 'rgba(148,163,184,0.4)',
  };

  useEffect(() => {
    if (animPhase === 'out') {
      const t = setTimeout(() => {
        setPreviewPage((p) => {
          const len = Math.max(1, totalPages);
          return ((p + wheelDirRef.current) % len + len) % len as 0 | 1;
        });
        setAnimPhase('switch');
      }, 220);
      return () => clearTimeout(t);
    }
    if (animPhase === 'switch') {
      const t = setTimeout(() => {
        setAnimPhase('in');
      }, 40);
      return () => clearTimeout(t);
    }
    if (animPhase === 'in') {
      const t = setTimeout(() => {
        setAnimPhase('idle');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [animPhase, totalPages]);

  // 使用 ref 保持最新状态值，避免 wheel effect 频繁重新注册
  const animPhaseRef = useRef(animPhase);
  animPhaseRef.current = animPhase;
  const totalPagesRef = useRef(totalPages);
  totalPagesRef.current = totalPages;

  // 原生 wheel 事件（非 passive），阻止页面滚动
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (totalPagesRef.current <= 1) return;

      const touchpad = isTouchpadWheel(e);

      if (!touchpad) {
        if (animPhaseRef.current !== 'idle') return;
        wheelDirRef.current = e.deltaY > 0 ? 1 : -1;
        wheelAccumRef.current = 0;
        setAnimPhase('out');
        return;
      }

      if (wheelCooldownRef.current) return;
      wheelAccumRef.current += e.deltaY;

      if (wheelIdleTimerRef.current) {
        clearTimeout(wheelIdleTimerRef.current);
        wheelIdleTimerRef.current = null;
      }

      if (Math.abs(wheelAccumRef.current) >= WHEEL_THRESHOLD) {
        const dir = wheelAccumRef.current > 0 ? 1 : -1;
        wheelDirRef.current = dir;
        wheelAccumRef.current = 0;
        wheelCooldownRef.current = true;

        if (wheelCooldownTimerRef.current) clearTimeout(wheelCooldownTimerRef.current);
        wheelCooldownTimerRef.current = setTimeout(() => {
          wheelCooldownRef.current = false;
          wheelAccumRef.current = 0;
        }, WHEEL_COOLDOWN);

        setAnimPhase('out');
        return;
      }

      wheelIdleTimerRef.current = setTimeout(() => {
        wheelAccumRef.current = 0;
      }, 150);
    };

    el.addEventListener('wheel', handler, { passive: false } as AddEventListenerOptions);

    return () => {
      el.removeEventListener('wheel', handler, { passive: false } as EventListenerOptions);
    };
  }, []);

  const isAnimating = animPhase !== 'idle';
  const animRotate =
    animPhase === 'out'
      ? wheelDirRef.current * sectorAngle
      : animPhase === 'switch'
        ? -wheelDirRef.current * sectorAngle
        : 0;
  const animOpacity = animPhase === 'out' || animPhase === 'switch' ? 0.12 : 1;
  const animScale = animPhase === 'out' || animPhase === 'switch' ? 0.9 : 1;

  const features = [
    {
      icon: <Search className="w-5 h-5" />,
      color: '#ec4899',
      title: '多页滚轮切换',
      desc: '滚轮上下滑动，在第一页和第二页间流畅切换',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      color: '#f59e0b',
      title: '最近使用',
      desc: '按最近使用时间排序，高频软件触手可得',
    },
    {
      icon: <Star className="w-5 h-5" />,
      color: '#7c3aed',
      title: '收藏夹',
      desc: '收藏的软件和工作流置顶，零查找成本',
    },
    {
      icon: <Workflow className="w-5 h-5" />,
      color: '#00d4aa',
      title: '工作流',
      desc: '一键启动软件组合，快速进入工作状态',
    },
  ];

  return (
    <section ref={ref} id="radial-menu" className={cn('px-6 py-24')}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4',
              theme === 'light'
                ? 'bg-primary-500/10 text-primary-600'
                : 'bg-primary-500/10 text-primary-300'
            )}
          >
            <CircleDot className="w-3.5 h-3.5" />
            快捷交互
          </div>
          <h2
            className={cn(
              'text-3xl sm:text-4xl font-bold tracking-tight',
              theme === 'light' ? 'text-slate-800' : 'text-white'
            )}
          >
            径向菜单 — 鼠标中键即启
          </h2>
          <p
            className={cn(
              'mt-4 leading-relaxed',
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            )}
          >
            不用切换窗口、不用翻找菜单。按下鼠标中键，软件、工作流全部呈现在眼前。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左侧：功能列表 */}
          <div className="space-y-4">
            {features.map((f) => (
              <div
                key={f.title}
                className={cn(
                  'flex items-start gap-4 p-5 rounded-xl transition-all',
                  theme === 'light'
                    ? 'bg-white border border-slate-200 hover:shadow-sm'
                    : 'bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80'
                )}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: f.color + '20', color: f.color }}
                >
                  {f.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      'text-sm font-semibold',
                      theme === 'light' ? 'text-slate-800' : 'text-slate-100'
                    )}
                  >
                    {f.title}
                  </h3>
                  <p
                    className={cn(
                      'text-xs mt-1 leading-relaxed',
                      theme === 'light' ? 'text-slate-500' : 'text-slate-500'
                    )}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                track('radial_demo_try_click');
                setDemoOpen(true);
              }}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium transition-all mt-2',
                theme === 'light'
                  ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm'
                  : 'bg-primary-500 hover:bg-primary-600 text-white shadow-glow-brand'
              )}
            >
              <CircleDot className="w-4 h-4" />
              点击体验径向菜单
            </button>
            <p
              className={cn(
                'text-center text-xs',
                theme === 'light' ? 'text-slate-400' : 'text-slate-600'
              )}
            >
              或在页面任意位置点击鼠标中键唤起
            </p>
          </div>

          {/* 右侧：SVG 径向菜单预览 */}
          <div
            ref={previewRef}
            className={cn(
              'relative aspect-square flex flex-col items-center justify-center rounded-2xl border overflow-hidden',
              theme === 'light'
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-900/40 border-slate-800/60'
            )}
          >
            {/* 页面切换标签 */}
            <div className="flex items-center gap-1 p-1 rounded-lg mb-4"
              style={{ backgroundColor: isLight ? 'rgba(148,163,184,0.15)' : 'rgba(30,41,59,0.6)' }}
            >
              <button
                onClick={() => {
                  if (animPhase === 'idle') {
                    wheelDirRef.current = -1;
                    setAnimPhase('out');
                  }
                }}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                  previewPage === 0
                    ? 'bg-primary-500/20 text-primary-400'
                    : isLight
                      ? 'text-slate-500 hover:text-slate-700'
                      : 'text-slate-400 hover:text-slate-300'
                )}
              >
                第一页
              </button>
              <button
                onClick={() => {
                  if (animPhase === 'idle') {
                    wheelDirRef.current = 1;
                    setAnimPhase('out');
                  }
                }}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                  previewPage === 1
                    ? 'bg-primary-500/20 text-primary-400'
                    : isLight
                      ? 'text-slate-500 hover:text-slate-700'
                      : 'text-slate-400 hover:text-slate-300'
                )}
              >
                第二页
              </button>
            </div>

            {/* SVG 预览圆环 */}
            <svg width={PREVIEW_SIZE} height={PREVIEW_SIZE} className="overflow-visible">
              <g
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: `rotate(${animRotate}deg) scale(${animScale})`,
                  opacity: animOpacity,
                  transition: isAnimating
                    ? 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease-in-out'
                    : 'transform 160ms cubic-bezier(0.22, 1, 0.36, 1), opacity 140ms ease-out',
                }}
              >
                {Array.from({ length: sectors }).map((_, slot) => {
                  const center = slot * sectorAngle - 90;
                  const start = center - sectorAngle / 2;
                  const end = center + sectorAngle / 2;
                  const item = itemBySlot.get(slot);
                  const labelPos = polarP(PREVIEW_LABEL_R, center);

                  return (
                    <g key={slot}>
                      <path
                        d={sectorPathP(start, end)}
                        fill={styleTokens.sectorFill(false, item?.color)}
                        stroke={styleTokens.sectorStroke(false)}
                        strokeWidth={styleTokens.sectorStrokeWidth(false)}
                      />
                      {item ? (
                        <g>
                          <circle
                            cx={labelPos.x}
                            cy={labelPos.y - 6}
                            r={14}
                            fill={(item.color || '#8b5cf6') + '40'}
                          />
                          <text
                            x={labelPos.x}
                            y={labelPos.y + 14}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={10}
                            fill={styleTokens.textFill(false)}
                            style={{ pointerEvents: 'none' }}
                          >
                            {item.name.length > 6 ? item.name.slice(0, 5) + '…' : item.name}
                          </text>
                        </g>
                      ) : (
                        <text
                          x={labelPos.x}
                          y={labelPos.y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={18}
                          fill={styleTokens.emptyMarkFill}
                        >
                          +
                        </text>
                      )}
                    </g>
                  );
                })}

                <circle
                  cx={cx}
                  cy={cy}
                  r={PREVIEW_INNER - 2}
                  fill={styleTokens.centerFill}
                  stroke={styleTokens.centerStroke}
                  strokeWidth={1}
                />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={600}
                  fill={isLight ? '#475569' : 'rgba(148,163,184,0.7)'}
                >
                  {previewPage === 0 ? '第一页' : '第二页'}
                </text>
              </g>
            </svg>

            <p
              className={cn(
                'mt-4 text-xs',
                theme === 'light' ? 'text-slate-400' : 'text-slate-500'
              )}
            >
              滚动滚轮切换页面 ↕
            </p>
          </div>
        </div>
      </div>

      {/* 演示用径向菜单 */}
      {demoOpen && (
        <RadialMenu
          software={software}
          workflows={workflows}
          open={demoOpen}
          onOpenChange={setDemoOpen}
          trigger="disabled"
        />
      )}
    </section>
  );
});

// 统计数据
function Stats({ theme }: { theme: 'light' | 'dark' }) {
  const items = [
    { value: '18+', label: '智能管理软件数' },
    { value: '4', label: '预置工作流组合' },
    { value: '2', label: '双主题即时切换' },
    { value: '零', label: '手动维护成本' },
  ];

  return (
    <section
      className={cn(
        'px-6 py-12 border-y',
        theme === 'light'
          ? 'bg-slate-50 border-slate-200'
          : 'bg-slate-900/20 border-slate-800/60'
      )}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 via-accent-500 to-brandamber-500 bg-clip-text text-transparent">
              {item.value}
            </div>
            <div
              className={cn(
                'mt-1.5 text-xs',
                theme === 'light' ? 'text-slate-500' : 'text-slate-500'
              )}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// AI 分类演示区
const AIClassifySection = React.forwardRef<HTMLElement, {
  theme: 'light' | 'dark';
  software: Software[];
}>(({
  theme,
  software,
}, ref) => {
  const { progress, isClassifying, classifiedCount, startClassify } = useClassifyProgress();

  const categoryGroups = useMemo(() => {
    return CATEGORIES.filter((cat) => software.some((s) => s.category === cat.id)).map((cat) => ({
      ...cat,
      apps: software.filter((s) => s.category === cat.id).slice(0, 3),
    }));
  }, [software]);

  return (
    <section ref={ref} id="ai-classify" className={cn('px-6 py-24', theme === 'light' ? '' : '')}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4',
              theme === 'light'
                ? 'bg-primary-500/10 text-primary-600'
                : 'bg-primary-500/10 text-primary-300'
            )}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            MVP 核心功能
          </div>
          <h2
            className={cn(
              'text-3xl sm:text-4xl font-bold tracking-tight',
              theme === 'light' ? 'text-slate-800' : 'text-white'
            )}
          >
            AI 自动识别与分类
          </h2>
          <p
            className={cn(
              'mt-4 leading-relaxed',
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            )}
          >
            基于软件功能语义理解自动归类，告别手动建文件夹。装再多软件也不会乱。
          </p>
        </div>

        {/* 分类演示卡片 */}
        <div
          className={cn(
            'rounded-2xl border p-8 transition-all duration-500',
            theme === 'light'
              ? 'bg-white border-slate-200 shadow-sm'
              : 'bg-slate-900/40 border-slate-800/60'
          )}
        >
          {/* 顶部进度条 */}
          {isClassifying && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-500 animate-pulse" />
                  <span
                    className={cn(
                      'text-sm font-medium',
                      theme === 'light' ? 'text-slate-700' : 'text-slate-200'
                    )}
                  >
                    AI 正在分析软件用途...
                  </span>
                </div>
                <span
                  className={cn(
                    'text-xs tabular-nums',
                    theme === 'light' ? 'text-slate-500' : 'text-slate-500'
                  )}
                >
                  {classifiedCount} / {software.length}
                </span>
              </div>
              <div
                className={cn(
                  'h-2 rounded-full overflow-hidden',
                  theme === 'light' ? 'bg-slate-200' : 'bg-slate-800'
                )}
              >
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* 分类结果展示 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryGroups.map((group) => (
              <div
                key={group.id}
                className={cn(
                  'p-5 rounded-xl transition-all duration-300',
                  theme === 'light'
                    ? 'bg-slate-50 border border-slate-200'
                    : 'bg-slate-800/30 border border-slate-800/60',
                  isClassifying && progress > 30 && 'animate-in'
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      theme === 'light' ? 'text-slate-700' : 'text-slate-200'
                    )}
                  >
                    {group.name}
                  </span>
                  <span
                    className={cn(
                      'text-xs ml-auto tabular-nums',
                      theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                    )}
                  >
                    {group.apps.length} 个
                  </span>
                </div>
                <div className="space-y-2">
                  {group.apps.map((app) => (
                    <div
                      key={app.id}
                      className={cn(
                        'flex items-center gap-2.5 p-2.5 rounded-lg',
                        theme === 'light' ? 'bg-white' : 'bg-slate-900/40'
                      )}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: app.color + '20', color: app.color }}
                      >
                        {app.name.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            'text-xs font-medium truncate',
                            theme === 'light' ? 'text-slate-700' : 'text-slate-200'
                          )}
                        >
                          {app.name}
                        </div>
                      </div>
                      <BrainCircuit className="w-3.5 h-3.5 text-primary-500" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 演示按钮 */}
          <div className="mt-8 text-center">
            <button
              onClick={startClassify}
              disabled={isClassifying}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all',
                theme === 'light'
                  ? 'bg-primary-500 hover:bg-primary-600 text-white disabled:bg-primary-300'
                  : 'bg-primary-500 hover:bg-primary-600 text-white disabled:bg-primary-500/50',
                isClassifying && 'cursor-not-allowed opacity-80'
              )}
            >
              <Sparkles className="w-4 h-4" />
              {isClassifying ? `正在分类 ${progress}%` : '演示 AI 分类过程'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

// 自然语言搜索演示区
const SearchSection = React.forwardRef<HTMLElement, {
  theme: 'light' | 'dark';
  software: Software[];
}>(({
  theme,
  software,
}, ref) => {
  const { query, results, isSearching, searchReason, search, clear } = useNaturalSearch(software);

  const quickQueries = ['截屏', '修图', '做表格', '写代码'];

  return (
    <section
      ref={ref}
      id="search"
      className={cn(
        'px-6 py-24 border-y',
        theme === 'light'
          ? 'bg-slate-50 border-slate-200'
          : 'bg-slate-900/20 border-slate-800/60'
      )}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4',
              theme === 'light'
                ? 'bg-accent-500/10 text-accent-600'
                : 'bg-accent-500/10 text-accent-300'
            )}
          >
            <Search className="w-3.5 h-3.5" />
            自然语言搜索
          </div>
          <h2
            className={cn(
              'text-3xl sm:text-4xl font-bold tracking-tight',
              theme === 'light' ? 'text-slate-800' : 'text-white'
            )}
          >
            用描述找到软件
          </h2>
          <p
            className={cn(
              'mt-4 leading-relaxed',
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            )}
          >
            输入"截屏""修图""做表格"等描述性语言，AI 理解语义后精准定位。
          </p>
        </div>

        {/* 搜索演示卡片 */}
        <div
          className={cn(
            'rounded-2xl border p-8',
            theme === 'light'
              ? 'bg-white border-slate-200 shadow-sm'
              : 'bg-slate-900/40 border-slate-800/60'
          )}
        >
          {/* 搜索框 */}
          <div className="relative mb-6">
            <Search
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5',
                theme === 'light' ? 'text-slate-400' : 'text-slate-500'
              )}
            />
            <input
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="输入描述来搜索软件，如「截屏工具」「修图」..."
              className={cn(
                'w-full pl-12 pr-10 py-4 rounded-xl text-sm transition-all',
                theme === 'light'
                  ? 'bg-slate-100 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20'
                  : 'bg-slate-800/50 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20'
              )}
            />
            {query && (
              <button
                onClick={clear}
                className={cn(
                  'absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors',
                  theme === 'light'
                    ? 'hover:bg-slate-200 text-slate-400'
                    : 'hover:bg-slate-700 text-slate-500'
                )}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 快捷搜索标签 */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {quickQueries.map((q) => (
              <button
                key={q}
                onClick={() => search(q)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                    : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 border border-slate-800/60'
                )}
              >
                {q}
              </button>
            ))}
          </div>

          {/* 搜索结果 */}
          {isSearching && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <span
                  className={cn(
                    'text-sm',
                    theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                  )}
                >
                  AI 正在理解语义...
                </span>
              </div>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span
                  className={cn(
                    'text-xs font-medium',
                    theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                  )}
                >
                  {searchReason}
                </span>
              </div>
              {results.map((app) => (
                <div
                  key={app.id}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl transition-colors',
                    theme === 'light'
                      ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                      : 'bg-slate-800/30 hover:bg-slate-800/50 border border-slate-800/60'
                  )}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: app.color + '20', color: app.color }}
                  >
                    {app.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        'text-sm font-medium truncate',
                        theme === 'light' ? 'text-slate-800' : 'text-slate-100'
                      )}
                    >
                      {app.name}
                    </div>
                    <div
                      className={cn(
                        'text-xs truncate mt-0.5',
                        theme === 'light' ? 'text-slate-500' : 'text-slate-500'
                      )}
                    >
                      {app.description}
                    </div>
                  </div>
                  <div
                    className={cn(
                      'px-2 py-1 rounded-md text-xs',
                      theme === 'light'
                        ? 'bg-primary-500/10 text-primary-600'
                        : 'bg-primary-500/10 text-primary-300'
                    )}
                  >
                    {CATEGORIES.find((c) => c.id === app.category)?.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && query && results.length === 0 && (
            <div className="text-center py-12">
              <p
                className={cn(
                  'text-sm',
                  theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                )}
              >
                未找到匹配的软件
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

// 工作流演示区
const WorkflowSection = React.forwardRef<HTMLElement, {
  theme: 'light' | 'dark';
  workflows: WorkflowType[];
  software: Software[];
}>(({
  theme,
  workflows,
  software,
}, ref) => {
  return (
    <section ref={ref} id="workflow" className={cn('px-6 py-24')}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4',
              theme === 'light'
                ? 'bg-success/10 text-success'
                : 'bg-success/10 text-success'
            )}
          >
            <Workflow className="w-3.5 h-3.5" />
            智能工作流编排
          </div>
          <h2
            className={cn(
              'text-3xl sm:text-4xl font-bold tracking-tight',
              theme === 'light' ? 'text-slate-800' : 'text-white'
            )}
          >
            一键启动你的工作组合
          </h2>
          <p
            className={cn(
              'mt-4 leading-relaxed',
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            )}
          >
            根据使用习惯自动推荐软件组合，一键启动 IDE + 终端 + 浏览器等场景套件。
          </p>
        </div>

        {/* 工作流卡片 */}
        <div className="grid md:grid-cols-2 gap-5">
          {workflows.map((wf) => {
            const wfApps = wf.softwareIds
              .map((id) => software.find((s) => s.id === id))
              .filter(Boolean)
              .slice(0, 4);

            return (
              <div
                key={wf.id}
                className={cn(
                  'p-6 rounded-2xl transition-all duration-300 overflow-hidden group',
                  theme === 'light'
                    ? 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                    : 'bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80'
                )}
              >
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${wf.color}20 0%, transparent 60%)`,
                  }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            'text-base font-semibold',
                            theme === 'light' ? 'text-slate-800' : 'text-white'
                          )}
                        >
                          {wf.name}
                        </h3>
                        {wf.isFavorite && (
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                      <p
                        className={cn(
                          'text-xs mt-1',
                          theme === 'light' ? 'text-slate-500' : 'text-slate-500'
                        )}
                      >
                        {wf.description}
                      </p>
                    </div>
                    <button
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all',
                        theme === 'light'
                          ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm active:scale-95'
                          : 'bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-slate-900/20 active:scale-95'
                      )}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      启动
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center -space-x-2">
                      {wfApps.map((app) =>
                        app ? (
                          <div
                            key={app.id}
                            className={cn(
                              'w-9 h-9 rounded-xl border-2 flex items-center justify-center text-xs font-semibold',
                              theme === 'light' ? 'border-white' : 'border-slate-900'
                            )}
                            style={{ backgroundColor: app.color + '30', color: app.color }}
                            title={app.name}
                          >
                            {app.name.slice(0, 2)}
                          </div>
                        ) : null
                      )}
                    </div>
                    <div
                      className={cn(
                        'flex items-center gap-1.5 text-xs',
                        theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                      )}
                    >
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(wf.lastUsed)} · {wf.usageCount} 次使用
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

// 收藏夹演示区
const FavoritesSection = React.forwardRef<HTMLElement, {
  theme: 'light' | 'dark';
  workflows: WorkflowType[];
  software: Software[];
}>(({
  theme,
  workflows,
  software,
}, ref) => {
  const favoriteWorkflows = workflows.filter((w) => w.isFavorite);
  const favoriteSoftware = software.filter((s) => s.launchCount > 300);

  return (
    <section
      ref={ref}
      id="favorites"
      className={cn(
        'px-6 py-24 border-y',
        theme === 'light'
          ? 'bg-slate-50 border-slate-200'
          : 'bg-slate-900/20 border-slate-800/60'
      )}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4',
              theme === 'light'
                ? 'bg-amber-500/10 text-amber-600'
                : 'bg-amber-500/10 text-amber-400'
            )}
          >
            <Star className="w-3.5 h-3.5" />
            收藏夹
          </div>
          <h2
            className={cn(
              'text-3xl sm:text-4xl font-bold tracking-tight',
              theme === 'light' ? 'text-slate-800' : 'text-white'
            )}
          >
            快捷访问你的高频工具
          </h2>
          <p
            className={cn(
              'mt-4 leading-relaxed',
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            )}
          >
            收藏的软件和工作流置顶显示，一键启动，零查找成本。
          </p>
        </div>

        {/* 收藏软件 */}
        <div className="mb-8">
          <h3
            className={cn(
              'text-sm font-semibold mb-4 flex items-center gap-2',
              theme === 'light' ? 'text-slate-700' : 'text-slate-300'
            )}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            收藏软件 ({favoriteSoftware.length})
          </h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {favoriteSoftware.slice(0, 6).map((app) => (
              <div
                key={app.id}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl transition-colors',
                  theme === 'light'
                    ? 'bg-white border border-slate-200 hover:shadow-sm'
                    : 'bg-slate-800/30 border border-slate-800/60 hover:border-slate-700'
                )}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: app.color + '20', color: app.color }}
                >
                  {app.name.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      'text-sm font-medium truncate',
                      theme === 'light' ? 'text-slate-800' : 'text-slate-200'
                    )}
                  >
                    {app.name}
                  </div>
                  <div
                    className={cn(
                      'text-xs mt-0.5',
                      theme === 'light' ? 'text-slate-500' : 'text-slate-500'
                    )}
                  >
                    {formatMinutes(app.usageMinutes)} · {app.launchCount} 次启动
                  </div>
                </div>
                <button
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    theme === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                      : 'bg-slate-900/40 hover:bg-slate-900/60 text-slate-400'
                  )}
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 收藏工作流 */}
        <div>
          <h3
            className={cn(
              'text-sm font-semibold mb-4 flex items-center gap-2',
              theme === 'light' ? 'text-slate-700' : 'text-slate-300'
            )}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            收藏工作流 ({favoriteWorkflows.length})
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {favoriteWorkflows.map((wf) => {
              const wfApps = wf.softwareIds
                .map((id) => software.find((s) => s.id === id))
                .filter(Boolean)
                .slice(0, 4);

              return (
                <div
                  key={wf.id}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl transition-colors',
                    theme === 'light'
                      ? 'bg-white border border-slate-200 hover:shadow-sm'
                      : 'bg-slate-800/30 border border-slate-800/60 hover:border-slate-700'
                  )}
                >
                  <div className="flex items-center -space-x-2">
                    {wfApps.map((app) =>
                      app ? (
                        <div
                          key={app.id}
                          className={cn(
                            'w-9 h-9 rounded-xl border-2 flex items-center justify-center text-xs font-semibold',
                            theme === 'light' ? 'border-white' : 'border-slate-900'
                          )}
                          style={{ backgroundColor: app.color + '30', color: app.color }}
                        >
                          {app.name.slice(0, 2)}
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        'text-sm font-medium truncate',
                        theme === 'light' ? 'text-slate-800' : 'text-slate-200'
                      )}
                    >
                      {wf.name}
                    </div>
                    <div
                      className={cn(
                        'text-xs mt-0.5',
                        theme === 'light' ? 'text-slate-500' : 'text-slate-500'
                      )}
                    >
                      {wf.usageCount} 次使用
                    </div>
                  </div>
                  <button
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors',
                      theme === 'light'
                        ? 'bg-primary-500/10 text-primary-600 hover:bg-primary-500/20'
                        : 'bg-primary-500/10 text-primary-300 hover:bg-primary-500/20'
                    )}
                  >
                    <Play className="w-3 h-3" />
                    启动
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

// 统计可视化演示区
const StatisticsSection = React.forwardRef<HTMLElement, {
  theme: 'light' | 'dark';
  software: Software[];
}>(({
  theme,
  software,
}, ref) => {
  const totalMinutes = software.reduce((sum, s) => sum + s.usageMinutes, 0);
  const topApps = [...software].sort((a, b) => b.usageMinutes - a.usageMinutes).slice(0, 5);

  const categoryStats = CATEGORIES.filter((cat) => software.some((s) => s.category === cat.id))
    .map((cat) => {
      const apps = software.filter((s) => s.category === cat.id);
      const usage = apps.reduce((sum, s) => sum + s.usageMinutes, 0);
      return {
        ...cat,
        count: apps.length,
        usage,
        percent: Math.round((usage / totalMinutes) * 100),
      };
    })
    .sort((a, b) => b.usage - a.usage);

  return (
    <section ref={ref} id="statistics" className={cn('px-6 py-24')}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4',
              theme === 'light'
                ? 'bg-brandamber-500/10 text-brandamber-600'
                : 'bg-brandamber-500/10 text-brandamber-400'
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            使用时长统计
          </div>
          <h2
            className={cn(
              'text-3xl sm:text-4xl font-bold tracking-tight',
              theme === 'light' ? 'text-slate-800' : 'text-white'
            )}
          >
            数据驱动的效率洞察
          </h2>
          <p
            className={cn(
              'mt-4 leading-relaxed',
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            )}
          >
            追踪每款软件的启动次数、使用时长、活跃时段，生成你的个人软件使用画像。
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 总览 */}
          <div
            className={cn(
              'p-6 rounded-2xl border',
              theme === 'light'
                ? 'bg-white border-slate-200 shadow-sm'
                : 'bg-slate-900/40 border-slate-800/60'
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-accent-500" />
              <span
                className={cn(
                  'text-sm font-semibold',
                  theme === 'light' ? 'text-slate-700' : 'text-slate-200'
                )}
              >
                本周使用总时长
              </span>
            </div>
            <div
              className={cn(
                'text-4xl font-bold mb-2',
                theme === 'light' ? 'text-slate-800' : 'text-white'
              )}
            >
              {(totalMinutes / 60).toFixed(1)}h
            </div>
            <div
              className={cn(
                'text-xs',
                theme === 'light' ? 'text-slate-500' : 'text-slate-500'
              )}
            >
              共 {software.length} 个软件，{software.reduce((sum, s) => sum + s.launchCount, 0)} 次启动
            </div>
          </div>

          {/* Top 5 */}
          <div
            className={cn(
              'p-6 rounded-2xl border',
              theme === 'light'
                ? 'bg-white border-slate-200 shadow-sm'
                : 'bg-slate-900/40 border-slate-800/60'
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-500" />
              <span
                className={cn(
                  'text-sm font-semibold',
                  theme === 'light' ? 'text-slate-700' : 'text-slate-200'
                )}
              >
                高频软件 TOP 5
              </span>
            </div>
            <div className="space-y-2.5">
              {topApps.map((app, idx) => (
                <div key={app.id} className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'w-5 text-xs tabular-nums',
                      theme === 'light' ? 'text-slate-400' : 'text-slate-600'
                    )}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold"
                    style={{ backgroundColor: app.color + '20', color: app.color }}
                  >
                    {app.name.slice(0, 2)}
                  </div>
                  <div
                    className={cn(
                      'flex-1 text-xs font-medium truncate',
                      theme === 'light' ? 'text-slate-700' : 'text-slate-200'
                    )}
                  >
                    {app.name}
                  </div>
                  <div
                    className={cn(
                      'text-xs tabular-nums',
                      theme === 'light' ? 'text-slate-500' : 'text-slate-500'
                    )}
                  >
                    {(app.usageMinutes / 60).toFixed(1)}h
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 分类分布 */}
          <div
            className={cn(
              'p-6 rounded-2xl border',
              theme === 'light'
                ? 'bg-white border-slate-200 shadow-sm'
                : 'bg-slate-900/40 border-slate-800/60'
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-primary-500" />
              <span
                className={cn(
                  'text-sm font-semibold',
                  theme === 'light' ? 'text-slate-700' : 'text-slate-200'
                )}
              >
                分类使用占比
              </span>
            </div>
            <div className="space-y-3">
              {categoryStats.slice(0, 6).map((cat) => (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={cn(
                        'text-xs',
                        theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                      )}
                    >
                      {cat.name}
                    </span>
                    <span
                      className={cn(
                        'text-xs tabular-nums',
                        theme === 'light' ? 'text-slate-500' : 'text-slate-500'
                      )}
                    >
                      {cat.percent}% · {cat.count} 个
                    </span>
                  </div>
                  <div
                    className={cn(
                      'h-1.5 rounded-full overflow-hidden',
                      theme === 'light' ? 'bg-slate-200' : 'bg-slate-800'
                    )}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, cat.percent)}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// CTA 区域
const CTA = React.forwardRef<HTMLElement, { theme: 'light' | 'dark' }>(({ theme }, ref) => {
  return (
    <section ref={ref} id="cta" className={cn('px-6 py-24')}>
      <div className="max-w-4xl mx-auto">
        <div
          className={cn(
            'relative rounded-3xl px-8 py-16 text-center overflow-hidden',
            theme === 'light'
              ? 'bg-gradient-to-br from-primary-500/10 via-white to-accent-500/5 border border-primary-500/20'
              : 'bg-gradient-to-br from-primary-500/10 via-slate-900/40 to-accent-500/5 border border-primary-500/30'
          )}
        >
          {theme === 'dark' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-500/20 rounded-full blur-[120px] -z-10" />
          )}
          {theme === 'light' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-500/10 rounded-full blur-[100px] -z-10" />
          )}
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-6',
              theme === 'light'
                ? 'bg-primary-500/10 border border-primary-500/20 text-primary-600'
                : 'bg-primary-500/10 border border-primary-500/20 text-primary-300'
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            桌面端的软件管理基础设施
          </div>
          <h2
            className={cn(
              'text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mx-auto leading-tight',
              theme === 'light' ? 'text-slate-800' : 'text-white'
            )}
          >
            现在就让 AI 接管你的软件桌面
          </h2>
          <p
            className={cn(
              'mt-4 max-w-xl mx-auto',
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            )}
          >
            重度用户每周多出近 1 小时专注工作时间。免费下载，开箱即用。
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://github.com/bayernjf/soft-desk/releases"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('cta_click', { cta_text: '下载Mac', cta_location: 'bottom' })}
                className={cn(
                  'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-glow-brand hover:scale-[1.02]',
                  theme === 'light'
                    ? 'bg-primary-500 hover:bg-primary-600 text-white'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                )}
              >
                下载Mac
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/bayernjf/soft-desk/releases"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('cta_click', { cta_text: '下载Win', cta_location: 'bottom' })}
                className={cn(
                  'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-glow-brand hover:scale-[1.02]',
                  theme === 'light'
                    ? 'bg-primary-500 hover:bg-primary-600 text-white'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                )}
              >
                下载Win
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <Link
              to="/app"
              onClick={() => track('cta_click', { cta_text: '进入在线演示', cta_location: 'bottom' })}
              className={cn(
                'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-colors border',
                theme === 'light'
                  ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-200'
              )}
            >
              进入在线演示
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

// Footer
function Footer({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <footer
      className={cn(
        'px-6 py-10 border-t',
        theme === 'light' ? 'border-slate-200' : 'border-slate-800/60'
      )}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo theme={theme} />
        <p
          className={cn(
            'text-xs',
            theme === 'light' ? 'text-slate-500' : 'text-slate-500'
          )}
        >
          © {new Date().getFullYear()} SoftDesk · AI 驱动的桌面软件智能指挥中心
        </p>
        <div
          className={cn(
            'flex items-center gap-5 text-xs',
            theme === 'light' ? 'text-slate-500' : 'text-slate-500'
          )}
        >
          <a
            href="#ai-classify"
            className={cn(
              'transition-colors',
              theme === 'light' ? 'hover:text-slate-700' : 'hover:text-slate-300'
            )}
          >
            功能
          </a>
          <a
            href="#workflow"
            className={cn(
              'transition-colors',
              theme === 'light' ? 'hover:text-slate-700' : 'hover:text-slate-300'
            )}
          >
            工作流
          </a>
          <a
            href="https://github.com/bayernjf/soft-desk/releases"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'transition-colors',
              theme === 'light' ? 'hover:text-slate-700' : 'hover:text-slate-300'
            )}
          >
            下载
          </a>
          <a
            href="https://github.com/bayernjf/soft-desk"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-1 transition-colors',
              theme === 'light' ? 'hover:text-slate-700' : 'hover:text-slate-300'
            )}
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

// 主组件
export function Landing() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { software, workflows, launchSoftware, launchWorkflow } = useSoftwareStore();

  useScrollDepthTracking();

  const radialMenuRef = useSectionVisibility('radial_menu');
  const aiClassifyRef = useSectionVisibility('ai');
  const searchRef = useSectionVisibility('search');
  const workflowRef = useSectionVisibility('workflow');
  const favoritesRef = useSectionVisibility('favorites');
  const statisticsRef = useSectionVisibility('statistics');
  const ctaRef = useSectionVisibility('cta');

  return (
    <div
      className={cn(
        'min-h-screen',
        theme === 'light' ? 'bg-white text-slate-800' : 'bg-[#0d1117] text-slate-200'
      )}
    >
      <Nav theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero theme={theme} />
        <RadialMenuSection ref={radialMenuRef} theme={theme} software={software} workflows={workflows} />
        <Stats theme={theme} />
        <AIClassifySection ref={aiClassifyRef} theme={theme} software={software} />
        <SearchSection ref={searchRef} theme={theme} software={software} />
        <WorkflowSection ref={workflowRef} theme={theme} workflows={workflows} software={software} />
        <FavoritesSection ref={favoritesRef} theme={theme} workflows={workflows} software={software} />
        <StatisticsSection ref={statisticsRef} theme={theme} software={software} />
        <CTA ref={ctaRef} theme={theme} />
      </main>
      <Footer theme={theme} />

      {/* 径向菜单 */}
      <RadialMenu
        software={software}
        workflows={workflows}
        onLaunchSoftware={launchSoftware}
        onLaunchWorkflow={launchWorkflow}
      />
    </div>
  );
}