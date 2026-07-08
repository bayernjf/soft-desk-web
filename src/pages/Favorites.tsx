import { Heart, Star, Play, Clock, X } from 'lucide-react';
import { useSoftwareStore } from '@/stores/software.store';
import { formatTimeAgo } from '@/services/software.service';
import { SoftwareCard } from '@/components/features/SoftwareCard';
import { track } from '@/lib/analytics';

export function Favorites() {
  const { software, workflows, favoriteIds, toggleFavorite, launchWorkflow, toggleWorkflowFavorite } =
    useSoftwareStore();

  const handleToggleFavorite = (id: string, name: string, type: 'software' | 'workflow') => {
    const wasFavorited = type === 'software' 
      ? favoriteIds.includes(id) 
      : workflows.find(w => w.id === id)?.isFavorite;
    if (type === 'software') {
      toggleFavorite(id);
    } else {
      toggleWorkflowFavorite(id);
    }
    track(wasFavorited ? 'favorite_remove' : 'favorite_add', {
      item_name: name,
      item_type: type,
    });
  };

  const favoriteSoftware = software.filter((s) => favoriteIds.includes(s.id));
  const favoriteWorkflows = workflows.filter((w) => w.isFavorite);

  return (
    <div className="space-y-8">
      {/* 页头 */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-center">
            <Heart className="w-5 h-5 text-amber-400" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">收藏夹</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {favoriteSoftware.length} 个软件 · {favoriteWorkflows.length} 个工作流
            </p>
          </div>
        </div>
      </div>

      {/* 收藏的软件 */}
      <section>
        <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
          收藏的软件
        </h2>

        {favoriteSoftware.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favoriteSoftware.map((app) => (
              <div key={app.id} className="relative group">
                <SoftwareCard software={app} />
                <button
                  onClick={() => handleToggleFavorite(app.id, app.name, 'software')}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-slate-900/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/20 text-rose-400"
                  title="取消收藏"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-slate-800">
            <div className="w-14 h-14 rounded-full bg-slate-800/60 flex items-center justify-center mb-3">
              <Star className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">还没有收藏的软件</p>
            <p className="text-xs text-slate-600 mt-1">在软件库中点击星标即可收藏</p>
          </div>
        )}
      </section>

      {/* 收藏的工作流 */}
      <section>
        <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
          收藏的工作流
        </h2>

        {favoriteWorkflows.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {favoriteWorkflows.map((wf) => {
              const wfApps = wf.softwareIds
                .map((id) => software.find((s) => s.id === id))
                .filter(Boolean)
                .slice(0, 5);

              return (
                <div
                  key={wf.id}
                  className="relative p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 transition-all duration-300 overflow-hidden group"
                >
                  <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${wf.color}40 0%, transparent 60%)`,
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-white">{wf.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{wf.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggleFavorite(wf.id, wf.name, 'workflow')}
                        className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10"
                        title="取消收藏"
                      >
                        <Star className="w-4 h-4" fill="currentColor" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center -space-x-2">
                        {wfApps.map((app) =>
                          app ? (
                            <div
                              key={app.id}
                              className="w-8 h-8 rounded-lg border-2 border-slate-900 flex items-center justify-center text-[10px] font-semibold"
                              style={{ backgroundColor: app.color + '30', color: app.color }}
                              title={app.name}
                            >
                              {app.name.slice(0, 2)}
                            </div>
                          ) : null
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(wf.lastUsed)}
                        </span>
                        <button
                          onClick={() => launchWorkflow(wf.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-1 transition-colors"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          启动
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-slate-800">
            <div className="w-14 h-14 rounded-full bg-slate-800/60 flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">还没有收藏的工作流</p>
          </div>
        )}
      </section>
    </div>
  );
}