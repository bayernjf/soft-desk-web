import { useEffect, useState } from 'react';

// /releases/latest 只返回最新的正式版（非 prerelease），
// 避免取到 dev snapshot（tag=snapshot, prerelease=true）。
const RELEASES_API = 'https://api.github.com/repos/bayernjf/soft-desk/releases/latest';
const FALLBACK_URL = 'https://github.com/bayernjf/soft-desk/releases';

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface DownloadInfo {
  url: string;
  size: number;
}

export interface DownloadUrlsState {
  mac: DownloadInfo | null;
  win: DownloadInfo | null;
  version: string | null;
  publishedAt: string | null;
  loading: boolean;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${mb.toFixed(1)} MB`;
}

function detectPlatform(): 'mac' | 'win' | 'unknown' {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac os x') || ua.includes('macintosh')) return 'mac';
  if (ua.includes('windows')) return 'win';
  return 'unknown';
}

export function useDownloadUrls() {
  const [state, setState] = useState<DownloadUrlsState>({
    mac: null,
    win: null,
    version: null,
    publishedAt: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchLatest = async () => {
      try {
        const res = await fetch(RELEASES_API, {
          headers: { Accept: 'application/vnd.github+json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const release = await res.json();
        if (cancelled) return;

        const assets: ReleaseAsset[] = release?.assets || [];
        const macAsset = assets.find((a) => a.name.endsWith('.dmg'));
        const winAsset = assets.find((a) => a.name.endsWith('.exe'));

        setState({
          mac: macAsset
            ? { url: macAsset.browser_download_url, size: macAsset.size }
            : null,
          win: winAsset
            ? { url: winAsset.browser_download_url, size: winAsset.size }
            : null,
          version: release?.tag_name ?? null,
          publishedAt: release?.published_at ?? null,
          loading: false,
        });
      } catch {
        if (cancelled) return;
        setState({
          mac: null,
          win: null,
          version: null,
          publishedAt: null,
          loading: false,
        });
      }
    };

    fetchLatest();
    return () => {
      cancelled = true;
    };
  }, []);

  const downloadMac = () => {
    if (state.mac?.url) {
      window.location.href = state.mac.url;
    } else {
      window.open(FALLBACK_URL, '_blank');
    }
  };

  const downloadWin = () => {
    if (state.win?.url) {
      window.location.href = state.win.url;
    } else {
      window.open(FALLBACK_URL, '_blank');
    }
  };

  const preferredPlatform = detectPlatform();

  return {
    ...state,
    macSizeLabel: state.mac ? formatBytes(state.mac.size) : '',
    winSizeLabel: state.win ? formatBytes(state.win.size) : '',
    preferredPlatform,
    downloadMac,
    downloadWin,
  };
}
