/**
 * 统一埋点 SDK
 * 支持 Google Analytics 4 + Microsoft Clarity
 * 开发环境仅输出 console.debug，不发送真实数据
 */

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined;

const isProd = import.meta.env.PROD;

let initialized = false;

/** 初始化 GA4 + Clarity 脚本（仅生产环境） */
export function initAnalytics() {
  if (initialized || !isProd) return;
  initialized = true;

  // GA4
  if (GA_MEASUREMENT_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    } as (...args: unknown[]) => void;
    window.gtag('consent', 'default', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      wait_for_update: 0,
    });
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  // Clarity (官方标准安装方式)
  if (CLARITY_PROJECT_ID) {
    window.clarity = window.clarity || function (...args: unknown[]) {
      (window.clarity!.q = window.clarity!.q || []).push(args);
    };
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
  }
}

/** 通用事件追踪 */
export function track(eventName: string, params?: Record<string, unknown>) {
  if (!isProd) {
    console.debug('[analytics]', eventName, params ?? {});
    return;
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

/** 页面浏览追踪 */
export function trackPageView(path?: string, title?: string) {
  const pagePath = path || window.location.pathname + window.location.search;
  const pageTitle = title || document.title;

  if (!isProd) {
    console.debug('[analytics] page_view', { page_path: pagePath, page_title: pageTitle });
    return;
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
}

/** 设置用户属性 */
export function setUserProperty(name: string, value: string | boolean) {
  if (!isProd) {
    console.debug('[analytics] set_user_property', name, value);
    return;
  }
  if (typeof window.gtag === 'function') {
    window.gtag('set', { [name]: value });
  }
}

const SCROLL_DEPTH_MILESTONES = [25, 50, 75, 100];
const scrollDepthReported = new Set<number>();

/** 滚动深度追踪 */
export function trackScrollDepth() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

  for (const milestone of SCROLL_DEPTH_MILESTONES) {
    if (!scrollDepthReported.has(milestone) && scrollPercent >= milestone) {
      scrollDepthReported.add(milestone);
      track('scroll_depth', { depth_percent: milestone });
    }
  }
}

/** 重置滚动深度（页面切换时调用） */
export function resetScrollDepth() {
  scrollDepthReported.clear();
}

/** 追踪元素可见性（Section 进入视口） */
export function trackElementView(sectionName: string) {
  if (!isProd) {
    console.debug('[analytics] landing_section_view', { section_name: sectionName });
    return;
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'landing_section_view', { section_name: sectionName });
  }
}

// ---- 类型声明 ----
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}
