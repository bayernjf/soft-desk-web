import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { RadialMenu } from '@/components/RadialMenu';
import { useSoftwareStore } from '@/stores/software.store';
import { cn } from '@/lib/utils';
import { track, trackPageView } from '@/lib/analytics';

const pageNameMap: Record<string, string> = {
  '/app': 'dashboard',
  '/app/library': 'software',
  '/app/favorites': 'favorites',
  '/app/workflows': 'workflows',
  '/app/radial': 'radial_menu',
  '/app/my-shares': 'shares',
  '/app/statistics': 'stats',
  '/app/uninstall': 'cleanup',
  '/app/settings': 'settings',
};

export function Layout() {
  const location = useLocation();
  const { software, workflows, launchSoftware, launchWorkflow } = useSoftwareStore();
  const [radialOpen, setRadialOpen] = useState(false);

  useEffect(() => {
    trackPageView(location.pathname);
    const pageName = pageNameMap[location.pathname] || 'unknown';
    track('app_page_view', { page_name: pageName });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans antialiased flex overflow-hidden">
      <Sidebar onOpenRadialMenu={() => setRadialOpen(true)} />

      <main
        className={cn(
          'flex-1 flex flex-col overflow-hidden',
          'bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]'
        )}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full px-8 py-6 lg:px-12 lg:py-8 max-w-[1600px] mx-auto w-full">
            <Outlet key={location.pathname} />
          </div>
        </div>
      </main>

      {/* 径向菜单:鼠标中键全局唤起 + Sidebar 按钮唤起 */}
      <RadialMenu
        software={software}
        workflows={workflows}
        onLaunchSoftware={launchSoftware}
        onLaunchWorkflow={launchWorkflow}
        open={radialOpen}
        onOpenChange={setRadialOpen}
      />
    </div>
  );
}
