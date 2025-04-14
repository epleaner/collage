import { create } from 'zustand';
import { Layer } from '../types/layer.types';

interface LayerState {
    layers: Layer[];
    selectedLayerId: string | null;
    addLayer: (layer: Layer) => void;
    removeLayer: (layerId: string) => void;
    updateLayer: (layerId: string, updates: Partial<Layer>) => void;
    setLayerPattern: (layerId: string, patternId: string | null) => void;
    setLayerSrcUrl: (layerId: string, srcUrl: string) => void;
    reorderLayers: (startIndex: number, endIndex: number) => void;
    setSelectedLayer: (layerId: string | null) => void;
}

const createBaseLayer = (): Layer => ({
    id: 'base-image',
    srcUrl: 'https://archive.org/download/jojo-no-kimyou-na-bouken-1993-all-episodes-english-dubbed/jojos-bizarre-adventure-dub-episode-2.mp4',
    transform: {
        position: { x: 0, y: 0 },
        scale: 1,
        rotation: 0,
        opacity: 1
    },
    visible: true,
    locked: false,
    zIndex: 0,
    patternId: null,
    currentTime: 10,
    playing: true
});

const createPatternLayer = (): Layer => ({
    id: 'pattern-layer',
    srcUrl: 'https://archive.org/download/x-men-marvel-anime-1080p-ai-upscale/X-Men%20Anime/X-Men%20%28Marvel%20ANIME%29%20-%20Episode%2002%20-%20U-Men...Mutant%20Hunting.mp4',
    transform: {
        position: { x: 0, y: 0 },
        scale: 1,
        rotation: 0,
        opacity: 1
    },
    visible: true,
    locked: false,
    zIndex: 1,
    patternId: "row-of-rectangles",
    currentTime: 200,
    playing: true
});

export const useLayerStore = create<LayerState>((set, get) => ({
    layers: [createBaseLayer(), createPatternLayer()],
    selectedLayerId: null,
    addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
    removeLayer: (layerId) => set((state) => ({
        layers: state.layers.filter(layer => layer.id !== layerId)
    })),
    updateLayer: (layerId, updates) => set((state) => ({
        layers: state.layers.map(layer =>
            layer.id === layerId ? { ...layer, ...updates } as Layer : layer
        )
    })),
    setLayerPattern: (layerId, patternId) => {
        set((state) => ({
            layers: state.layers.map(layer =>
                layer.id === layerId
                    ? {
                        ...layer,
                        patternId,
                    } as Layer
                    : layer
            )
        }));
    },
    setLayerSrcUrl: (layerId, srcUrl) => {
        set((state) => ({
            layers: state.layers.map(layer =>
                layer.id === layerId
                    ? { ...layer, srcUrl } as Layer
                    : layer
            )
        }));
    },
    reorderLayers: (startIndex, endIndex) => {
        set((state) => {
            const result = Array.from(state.layers);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return { layers: result };
        });
    },
    setSelectedLayer: (layerId) => set({ selectedLayerId: layerId })
})); 