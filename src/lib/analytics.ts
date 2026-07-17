const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined;

const isProd = import.meta.env.PROD;
const COOKIE_CONSENT_KEY = 'soft_desk_consent';

let consentInitialized = false;
let ga4Loaded = false;
let clarityLoaded = false;

export interface ConsentState {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
}

export const DEFAULT_CONSENT: ConsentState = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

let currentConsent: ConsentState = DEFAULT_CONSENT;

export function getStoredConsent(): ConsentState | null {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setStoredConsent(consent: ConsentState): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch {
    return;
  }
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as (...args: unknown[]) => void;
}

function loadGa4() {
  if (!GA_MEASUREMENT_ID || ga4Loaded) return;
  ga4Loaded = true;

  ensureGtag();
  window.gtag!('js', new Date());
  window.gtag!('config', GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function updateClarityConsent(consent: ConsentState) {
  if (typeof window.clarity !== 'function') return;

  window.clarity('consentv2', {
    ad_Storage: consent.ad_storage,
    analytics_Storage: consent.analytics_storage,
  });
}

function loadClarity() {
  if (!CLARITY_PROJECT_ID || clarityLoaded) return;
  clarityLoaded = true;

  window.clarity = window.clarity || function (...args: unknown[]) {
    (window.clarity!.q = window.clarity!.q || []).push(args);
  };
  updateClarityConsent(currentConsent);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode?.insertBefore(script, firstScript);
}

function loadAnalyticsScripts() {
  if (currentConsent.analytics_storage !== 'granted') return;
  loadGa4();
  loadClarity();
}

export function initAnalytics(consent: ConsentState = DEFAULT_CONSENT) {
  if (!isProd) return;

  currentConsent = consent;
  ensureGtag();

  if (!consentInitialized) {
    window.gtag!('consent', 'default', currentConsent);
    consentInitialized = true;
  } else {
    window.gtag!('consent', 'update', currentConsent);
  }

  loadAnalyticsScripts();
}

export function updateConsent(consent: ConsentState) {
  currentConsent = consent;

  if (!isProd) return;

  ensureGtag();
  window.gtag!(consentInitialized ? 'consent' : 'consent', consentInitialized ? 'update' : 'default', consent);
  consentInitialized = true;
  updateClarityConsent(consent);
  loadAnalyticsScripts();
}

export function track(eventName: string, params?: Record<string, unknown>) {
  if (!isProd) {
    console.debug('[analytics]', eventName, params ?? {});
    return;
  }
  if (typeof window.gtag === 'function' && currentConsent.analytics_storage === 'granted') {
    window.gtag('event', eventName, params);
  }
}

export function trackPageView(path?: string, title?: string) {
  const pagePath = path || window.location.pathname + window.location.search;
  const pageTitle = title || document.title;

  if (!isProd) {
    console.debug('[analytics] page_view', { page_path: pagePath, page_title: pageTitle });
    return;
  }
  if (typeof window.gtag === 'function' && currentConsent.analytics_storage === 'granted') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
}

export function setUserProperty(name: string, value: string | boolean) {
  if (!isProd) {
    console.debug('[analytics] set_user_property', name, value);
    return;
  }
  if (typeof window.gtag === 'function' && currentConsent.analytics_storage === 'granted') {
    window.gtag('set', { [name]: value });
  }
}

const SCROLL_DEPTH_MILESTONES = [25, 50, 75, 100];
const scrollDepthReported = new Set<number>();

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

export function resetScrollDepth() {
  scrollDepthReported.clear();
}

export function trackElementView(sectionName: string) {
  if (!isProd) {
    console.debug('[analytics] landing_section_view', { section_name: sectionName });
    return;
  }
  if (typeof window.gtag === 'function' && currentConsent.analytics_storage === 'granted') {
    window.gtag('event', 'landing_section_view', { section_name: sectionName });
  }
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}
