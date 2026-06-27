import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  Clock,
  Github,
  Layers,
  Search,
  Sparkles,
  Trash2,
  Workflow,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandMark } from '@/components/BrandMark';
import { BrandIcon, BRAND_ICONS } from '@/components/BrandIcons';

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <BrandMark className="w-8 h-8 shadow-glow-brand rounded-lg" gradientId="softdesk-nav" />
      <span className="text-lg font-bold tracking-tight text-white">SoftDesk</span>
    </div>
  );
}

function Nav() {
  const links = [
    { label: '功能', href: '#features' },
    { label: '场景', href: '#scenarios' },
    { label: '工作流', href: '#workflow' },
    { label: '数据洞察', href: '#insights' },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#0d1117]/70 border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/app"
            className="hidden sm:inline-flex text-sm text-slate-400 hover:text-white transition-colors"
          >
            进入工作台
          </Link>
          <a
            href="#cta"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-glow-brand"
          >
            免费下载
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-40 pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-500/15 rounded-full blur-[140px]" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-medium mb-8 animate-in">
          <Sparkles className="w-3.5 h-3.5" />
          AI 驱动的桌面软件智能指挥中心
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
          让 AI 替你管软件，
          <br />
          <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-brandamber-500 bg-clip-text text-transparent">
            而不是你替软件分类
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          SoftDesk 是一款桌面端 AI 系统工具，统一管理你电脑上的所有软件。自动识别用途、感知使用习惯、智能编排工作流——你只需享受结果，零维护成本。
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-all shadow-glow-brand hover:scale-[1.02]"
          >
            免费下载 SoftDesk
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            to="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-sm font-semibold transition-colors"
          >
            <Github className="w-4 h-4" />
            查看在线演示
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
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
      </div>

      <HeroPreview />
    </section>
  );
}

interface AppItem {
  name: string;
  slug: keyof typeof BRAND_ICONS;
  usage: string;
}

function AppLogo({ slug }: { slug: keyof typeof BRAND_ICONS }) {
  return (
    <div className="w-9 h-9 rounded-lg bg-slate-950/60 border border-slate-700/50 flex items-center justify-center shrink-0">
      <BrandIcon slug={slug} className="w-5 h-5" />
    </div>
  );
}

function HeroPreview() {
  const apps: AppItem[] = [
    { name: 'VS Code', slug: 'vscode', usage: '42.0h' },
    { name: 'GitHub', slug: 'github', usage: '21.3h' },
    { name: 'Figma', slug: 'figma', usage: '18.5h' },
    { name: 'Docker', slug: 'docker', usage: '12.7h' },
    { name: 'Postman', slug: 'postman', usage: '8.4h' },
    { name: 'Slack', slug: 'slack', usage: '7.1h' },
  ];
  return (
    <div className="max-w-5xl mx-auto mt-20 px-2">
      <div className="relative rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 shadow-card animate-in">
        <div className="flex items-center gap-1.5 mb-5 px-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <div className="ml-4 flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/60 text-xs text-slate-500">
            <Search className="w-3 h-3" />
            搜索 “截屏” 即可定位工具…
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {apps.map((app) => (
            <div
              key={app.name}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/30 border border-slate-800/60 hover:border-slate-700 transition-colors"
            >
              <AppLogo slug={app.slug} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200 truncate">{app.name}</div>
                <div className="text-xs text-slate-500">本周 {app.usage}</div>
              </div>
              <div
                className="w-1.5 h-8 rounded-full"
                style={{ backgroundColor: BRAND_ICONS[app.slug].hex, opacity: 0.5 }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const items = [
    { value: '30+', label: '平均管理软件数' },
    { value: '10-15', label: '每天节省分钟数' },
    { value: '90 天', label: '僵尸软件自动识别' },
    { value: '零', label: '手动维护成本' },
  ];
  return (
    <section className="px-6 py-12 border-y border-slate-800/60 bg-slate-900/20">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 via-accent-500 to-brandamber-500 bg-clip-text text-transparent">
              {item.value}
            </div>
            <div className="mt-1.5 text-xs text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: BrainCircuit,
    color: '#7c3aed',
    title: 'AI 自动识别与分类',
    desc: '基于软件功能语义理解自动归类，告别手动建文件夹。装再多软件也不会乱。',
  },
  {
    icon: BarChart3,
    color: '#ec4899',
    title: '使用频率与时间分析',
    desc: '追踪每款软件的启动次数、使用时长、活跃时段，生成你的个人软件使用画像。',
  },
  {
    icon: Workflow,
    color: '#a78bfa',
    title: '智能工作流编排',
    desc: '根据使用习惯自动推荐软件组合，一键启动 IDE + 终端 + 浏览器等场景套件。',
  },
  {
    icon: Search,
    color: '#f472b6',
    title: '自然语言搜索',
    desc: '用「截屏」「修图」等描述性语言找到软件，无需记住任何软件名称。',
  },
  {
    icon: Trash2,
    color: '#f85149',
    title: '深度卸载与清理',
    desc: '主动发现长期未用的僵尸软件，深度清理残留注册表与文件，释放磁盘空间。',
  },
  {
    icon: Layers,
    color: '#f59e0b',
    title: '版本追踪',
    desc: '统一掌握所有软件的版本状态，及时感知更新，让软件资产一目了然。',
  },
];

function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            一个真正智能的软件管家
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            不是更好的文件夹，而是能自己理解软件用途、自动归类、主动帮你做决策的 AI。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 transition-all duration-300 overflow-hidden"
            >
              <div
                className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-[0.07] group-hover:opacity-15 transition-opacity"
                style={{ backgroundColor: f.color }}
              />
              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: f.color + '20' }}
              >
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="relative text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="relative text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SCENARIOS = [
  {
    tag: '场景一 · 智能工作流',
    title: '早上开机，AI 自动备好你的工作套件',
    desc: '根据过去两周的使用数据，识别「工作日上午」的软件组合模式，自动推荐 IDE + 终端 + 数据库工具 + 浏览器，一键全部启动。',
    icon: Zap,
    color: '#7c3aed',
  },
  {
    tag: '场景二 · 自然语言搜索',
    title: '忘了软件名？描述它就能找到',
    desc: '想找一个很久没用的截图工具但忘了名字，直接输入「截屏」，AI 理解语义后从上百款软件中精准定位。',
    icon: Search,
    color: '#ec4899',
  },
  {
    tag: '场景三 · 使用分析驱动清理',
    title: '主动发现僵尸软件，一键清理',
    desc: 'AI 展示每款软件的使用频率、累计时长、活跃时段，并主动建议：「这 5 款软件超过 90 天未使用，是否考虑卸载？」',
    icon: Trash2,
    color: '#f85149',
  },
  {
    tag: '场景四 · 使用习惯洞察',
    title: '月底收到你的「软件使用月报」',
    desc: '本周 VS Code 42 小时、Figma 18 小时、微信 12 小时…… 直观看到时间花在了哪里，帮你优化工作节奏。',
    icon: Clock,
    color: '#f59e0b',
  },
];

function Scenarios() {
  return (
    <section id="scenarios" className="px-6 py-24 bg-slate-900/20 border-y border-slate-800/60">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            真实场景，立竿见影
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            为程序员、设计师、产品经理、创作者等重度电脑用户量身打造。
          </p>
        </div>

        <div id="workflow" className="grid md:grid-cols-2 gap-5">
          {SCENARIOS.map((s) => (
            <div
              key={s.tag}
              className="p-7 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700/80 transition-all duration-300"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: s.color + '20' }}
                >
                  <s.icon className="w-4.5 h-4.5" style={{ color: s.color }} />
                </div>
                <span className="text-xs font-medium" style={{ color: s.color }}>
                  {s.tag}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2.5">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    { label: '软件分类', old: '手动建文件夹，两周就崩', neo: 'AI 语义自动归类，零维护' },
    { label: '使用数据', old: '全凭感觉，一片空白', neo: '频率 / 时长 / 时段全画像' },
    { label: '查找软件', old: '翻菜单、找图标', neo: '自然语言一搜即达' },
    { label: '清理卸载', old: '残留注册表越积越多', neo: '深度清理 + 僵尸软件提醒' },
  ];
  return (
    <section id="insights" className="px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            AI 替你管，而不是你替 AI 分类
          </h2>
          <p className="mt-4 text-slate-400">这是 SoftDesk 与传统方案最本质的差别。</p>
        </div>

        <div className="rounded-2xl border border-slate-800/60 overflow-hidden">
          <div className="grid grid-cols-3 bg-slate-900/60 text-xs font-semibold text-slate-400 px-6 py-3.5">
            <div></div>
            <div className="text-center">传统方案</div>
            <div className="text-center text-primary-300">SoftDesk</div>
          </div>
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`grid grid-cols-3 items-center px-6 py-4 text-sm ${
                i % 2 === 0 ? 'bg-slate-900/20' : 'bg-transparent'
              }`}
            >
              <div className="font-medium text-slate-300">{r.label}</div>
              <div className="text-center text-slate-500">{r.old}</div>
              <div className="text-center text-slate-200 flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-success shrink-0" />
                <span>{r.neo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="px-6 py-24">
      <div className="max-w-4xl mx-auto relative rounded-3xl border border-primary-500/30 bg-gradient-to-br from-primary-500/10 via-slate-900/40 to-accent-500/5 px-8 py-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-500/20 rounded-full blur-[120px] -z-10" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          桌面端的软件管理基础设施
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          现在就让 AI 接管你的软件桌面
        </h2>
        <p className="mt-4 text-slate-400 max-w-xl mx-auto">
          重度用户每周多出近 1 小时专注工作时间。免费下载，开箱即用。
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-all shadow-glow-brand hover:scale-[1.02]"
          >
            免费下载 SoftDesk
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            to="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-sm font-semibold transition-colors"
          >
            进入在线演示
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-slate-800/60">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} SoftDesk · AI 驱动的桌面软件智能指挥中心
        </p>
        <div className="flex items-center gap-5 text-xs text-slate-500">
          <a href="#features" className="hover:text-slate-300 transition-colors">
            功能
          </a>
          <a href="#scenarios" className="hover:text-slate-300 transition-colors">
            场景
          </a>
          <a href="#cta" className="hover:text-slate-300 transition-colors">
            下载
          </a>
        </div>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-200">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Scenarios />
        <Comparison />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
