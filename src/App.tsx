import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { AllSoftware } from './pages/AllSoftware';
import { Statistics } from './pages/Statistics';
import { Uninstall } from './pages/Uninstall';
import { Settings as SettingsPage } from './pages/Settings';
import { RadialMenu } from './components/RadialMenu';
import { useStore } from './store';

function App() {
  const { currentPage, software, workflows, launchApp, launchWorkflow } = useStore();
  const [radialMenuOpen, setRadialMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'all':
        return <AllSoftware />;
      case 'statistics':
        return <Statistics />;
      case 'uninstall':
        return <Uninstall />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0d1117] text-[#e6edf3]">
      <Sidebar onOpenRadialMenu={() => setRadialMenuOpen(true)} />
      <main className="flex-1 flex flex-col overflow-hidden">{renderPage()}</main>
      <RadialMenu
        software={software}
        workflows={workflows}
        onLaunchSoftware={launchApp}
        onLaunchWorkflow={launchWorkflow}
        open={radialMenuOpen}
        onOpenChange={setRadialMenuOpen}
      />
    </div>
  );
}

export default App;
