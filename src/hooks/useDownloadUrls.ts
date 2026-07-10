import { useEffect, useState } from 'react';

const RELEASES_API = 'https://api.github.com/repos/bayernjf/soft-desk/releases';
const FALLBACK_URL = 'https://github.com/bayernjf/soft-desk/releases';

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

export function useDownloadUrls() {
  const [urls, setUrls] = useState<{ mac: string; win: string }>({ mac: '', win: '' });

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(RELEASES_API, {
          headers: { Accept: 'application/vnd.github+json' },
        });
        const releases = await res.json();
        // /releases returns all releases including pre-releases, most recent first
        const latest = Array.isArray(releases) && releases.length > 0 ? releases[0] : null;
        const assets: ReleaseAsset[] = latest?.assets || [];
        const mac = assets.find((a) => a.name.endsWith('.dmg'));
        const win = assets.find((a) => a.name.endsWith('.exe'));
        setUrls({
          mac: mac?.browser_download_url || '',
          win: win?.browser_download_url || '',
        });
      } catch {
        setUrls({ mac: '', win: '' });
      }
    };
    fetchLatest();
  }, []);

  const downloadMac = () => {
    if (urls.mac) {
      window.location.href = urls.mac;
    } else {
      window.open(FALLBACK_URL, '_blank');
    }
  };

  const downloadWin = () => {
    if (urls.win) {
      window.location.href = urls.win;
    } else {
      window.open(FALLBACK_URL, '_blank');
    }
  };

  return { downloadMac, downloadWin };
}
