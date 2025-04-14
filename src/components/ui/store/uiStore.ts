import { create } from 'zustand';

interface UIState {
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarVisible: false,
    toggleSidebar: () => set((state) => ({ isSidebarVisible: !state.isSidebarVisible }))
})); 