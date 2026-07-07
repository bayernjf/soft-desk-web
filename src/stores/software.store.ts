import { create } from 'zustand';
import type { Software, Workflow, SoftwareCategory } from '@/types';
import { MOCK_SOFTWARE, MOCK_WORKFLOWS } from '@/data/software.mock';

interface SoftwareStore {
  software: Software[];
  workflows: Workflow[];
  favoriteIds: string[];
  selectedCategory: SoftwareCategory | 'all';
  searchQuery: string;
  sortBy: 'name' | 'usage' | 'recent' | 'size';
  setSelectedCategory: (cat: SoftwareCategory | 'all') => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (sort: 'name' | 'usage' | 'recent' | 'size') => void;
  launchSoftware: (id: string) => void;
  launchWorkflow: (id: string) => void;
  toggleWorkflowFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  uninstallSoftware: (id: string) => void;
}

export const useSoftwareStore = create<SoftwareStore>((set, get) => ({
  software: MOCK_SOFTWARE,
  workflows: MOCK_WORKFLOWS,
  favoriteIds: ['sw-001', 'sw-003'],
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'recent',

  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSortBy: (sort) => set({ sortBy: sort }),

  launchSoftware: (id) => {
    const software = get().software.map((s) =>
      s.id === id
        ? { ...s, launchCount: s.launchCount + 1, lastUsed: new Date().toISOString() }
        : s
    );
    set({ software });
  },

  launchWorkflow: (id) => {
    const workflows = get().workflows.map((w) =>
      w.id === id
        ? { ...w, usageCount: w.usageCount + 1, lastUsed: new Date().toISOString() }
        : w
    );
    set({ workflows });
  },

  toggleWorkflowFavorite: (id) => {
    const workflows = get().workflows.map((w) =>
      w.id === id ? { ...w, isFavorite: !w.isFavorite } : w
    );
    set({ workflows });
  },

  toggleFavorite: (id) => {
    const { favoriteIds } = get();
    set({
      favoriteIds: favoriteIds.includes(id)
        ? favoriteIds.filter((fid) => fid !== id)
        : [...favoriteIds, id],
    });
  },

  uninstallSoftware: (id) => {
    const software = get().software.filter((s) => s.id !== id);
    set({ software });
  },
}));
