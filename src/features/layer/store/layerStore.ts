import { create } from 'zustand';
import { Layer, LayerState } from '../types/layer.types';

const initialState: LayerState = {
  layers: [],
  selectedLayerId: null,
  activeLayerId: null,
};

export const useLayerStore = create<LayerState & {
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  selectLayer: (id: string | null) => void;
  setActiveLayer: (id: string | null) => void;
  reorderLayers: (layers: Layer[]) => void;
}>((set) => ({
  ...initialState,
  
  addLayer: (layer) => set((state) => ({
    layers: [...state.layers, layer],
  })),

  removeLayer: (id) => set((state) => ({
    layers: state.layers.filter((layer) => layer.id !== id),
    selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
    activeLayerId: state.activeLayerId === id ? null : state.activeLayerId,
  })),

  updateLayer: (id, updates) => set((state) => ({
    layers: state.layers.map((layer) =>
      layer.id === id ? { ...layer, ...updates } : layer
    ),
  })),

  selectLayer: (id) => set({ selectedLayerId: id }),

  setActiveLayer: (id) => set({ activeLayerId: id }),

  reorderLayers: (layers) => set({ layers }),
})); 