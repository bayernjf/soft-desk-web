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
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
  }

  // Clarity
  if (CLARITY_PROJECT_ID) {
    window.clarity =
      window.clarity ||
      function (...args: unknown[]) {
        (window.clarity.q = window.clarity.q || []).push(args);
      };
    window.clarity.q = window.clarity.q || [];
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
    document.head.appendChild(script);
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
  if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
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

// ---- 类型声明 ----
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}
