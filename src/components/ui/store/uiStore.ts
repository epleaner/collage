import { create } from 'zustand';

interface UIState {
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarVisible: true,
    toggleSidebar: () => set((state) => ({ isSidebarVisible: !state.isSidebarVisible }))
})); 