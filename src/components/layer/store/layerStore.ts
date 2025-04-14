import { create } from 'zustand';
import { Layer, ImageLayer, VideoLayer } from '../types/layer.types';
import { usePatternStore } from '../../pattern/store/patternStore';

interface LayerState {
    layers: Layer[];
    addLayer: (layer: Layer) => void;
    removeLayer: (layerId: string) => void;
    updateLayer: (layerId: string, updates: Partial<Layer>) => void;
    setLayerPattern: (layerId: string, patternId: string | null) => void;
}

const createBaseLayer = (): ImageLayer => ({
    id: 'base-image',
    type: 'image',
    name: 'Base Image',
    src: '/media/animal.jpg',
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
});

const createPatternLayer = (): VideoLayer => ({
    id: 'pattern-layer',
    type: 'video',
    name: 'Pattern Layer',
    src: '/media/video.mp4',
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
    currentTime: 0,
    duration: 0,
    playing: true
});

export const useLayerStore = create<LayerState>((set, get) => ({
    layers: [createBaseLayer(), createPatternLayer()],
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
    }
})); 