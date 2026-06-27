/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 主色调 - SoftDesk 品牌紫（官方图标方案⑩ 渐变起点）
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        // 强调色 - 品牌粉（官方图标方案⑩ 渐变中点）
        accent: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
        // 第三渐变色 - 品牌橙（官方图标方案⑩ 渐变终点）
        brandamber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // 状态色
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        // SoftDesk 深色背景（GitHub 暗色体系）
        surface: {
          DEFAULT: '#0d1117',
          soft: '#161b22',
          card: '#1c2128',
        },
        ink: '#e6edf3',
        muted: '#8b949e',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        'lg': '0.625rem',
        'xl': '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'glow-brand': '0 0 20px rgba(124, 58, 237, 0.18)',
        'glow-violet': '0 0 20px rgba(124, 58, 237, 0.18)',
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
