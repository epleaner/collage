import { create } from 'zustand';
import { Layer, PatternTransform, TextStyle } from '../types/layer.types';
import { v4 as uuidv4 } from 'uuid';

interface LayerState {
    layers: Layer[];
    selectedLayerId: string | null;
    addLayer: (layer: Layer) => void;
    removeLayer: (layerId: string) => void;
    updateLayer: (layerId: string, updates: Partial<Layer>) => void;
    setLayerPattern: (layerId: string, patternId: string | null) => void;
    setLayerSrcUrl: (layerId: string, srcUrl: string) => void;
    setLayerTimeRange: (layerId: string, startTime: number, endTime: number) => void;
    setLayerLoopMode: (layerId: string, loopMode: 'normal' | 'forward-backward') => void;
    updateLayerPatternTransform: (layerId: string, patternTransform: Partial<PatternTransform>) => void;
    setLayerTextContent: (layerId: string, textContent: string) => void;
    updateLayerTextStyle: (layerId: string, textStyle: Partial<TextStyle>) => void;
    duplicateLayer: (layerId: string) => void;
    reorderLayers: (startIndex: number, endIndex: number) => void;
    setSelectedLayer: (layerId: string | null) => void;
}

// Default pattern transform values
const defaultPatternTransform: PatternTransform = {
    scale: { x: 1, y: 1 },
    rotation: 0,
    position: { x: 0, y: 0 },
    spacing: 1,
    repetitions: 1,
    shapeCount: 5 // Default shape count
};

// Default text style
const defaultTextStyle: TextStyle = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 72,
    fontWeight: 'normal',
    textAlign: 'center',
    lineHeight: 1.2
};

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
    playing: true,
    startTime: 0,
    endTime: undefined,  // Will be set to video duration when loaded
    loopMode: 'normal'
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
    patternId: "rectangles",
    patternTransform: { ...defaultPatternTransform },
    currentTime: 200,
    playing: true,
    startTime: 0,
    endTime: undefined, // Will be set to video duration when loaded
    loopMode: 'normal'
});

export const useLayerStore = create<LayerState>((set) => ({
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
                        // Initialize pattern transform when setting a pattern
                        patternTransform: patternId ? { ...defaultPatternTransform } : undefined
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
    setLayerTimeRange: (layerId, startTime, endTime) => {
        set((state) => ({
            layers: state.layers.map(layer =>
                layer.id === layerId
                    ? { ...layer, startTime, endTime } as Layer
                    : layer
            )
        }));
    },
    setLayerLoopMode: (layerId, loopMode) => {
        set((state) => ({
            layers: state.layers.map(layer =>
                layer.id === layerId
                    ? { ...layer, loopMode } as Layer
                    : layer
            )
        }));
    },
    updateLayerPatternTransform: (layerId, patternTransform) => {
        set((state) => ({
            layers: state.layers.map(layer => {
                if (layer.id !== layerId) return layer;

                const currentTransform = layer.patternTransform || { ...defaultPatternTransform };
                return {
                    ...layer,
                    patternTransform: {
                        ...currentTransform,
                        ...patternTransform,
                        scale: {
                            ...currentTransform.scale,
                            ...(patternTransform.scale || {})
                        },
                        position: {
                            ...currentTransform.position,
                            ...(patternTransform.position || {})
                        }
                    }
                } as Layer;
            })
        }));
    },
    setLayerTextContent: (layerId, textContent) => {
        set((state) => ({
            layers: state.layers.map(layer =>
                layer.id === layerId
                    ? { ...layer, textContent } as Layer
                    : layer
            )
        }));
    },
    updateLayerTextStyle: (layerId, textStyle) => {
        set((state) => ({
            layers: state.layers.map(layer => {
                if (layer.id !== layerId) return layer;

                const currentStyle = layer.textStyle || { ...defaultTextStyle };
                return {
                    ...layer,
                    textStyle: {
                        ...currentStyle,
                        ...textStyle
                    }
                } as Layer;
            })
        }));
    },
    duplicateLayer: (layerId) => {
        set((state) => {
            const layerToDuplicate = state.layers.find(layer => layer.id === layerId);

            if (!layerToDuplicate) return state;

            // Create a deep copy of the layer
            const duplicatedLayer: Layer = {
                ...JSON.parse(JSON.stringify(layerToDuplicate)),
                id: uuidv4() // Generate a new unique ID
            };

            // Find the index of the original layer
            const originalIndex = state.layers.findIndex(layer => layer.id === layerId);

            // Insert the duplicated layer after the original
            const newLayers = [...state.layers];
            newLayers.splice(originalIndex + 1, 0, duplicatedLayer);

            return {
                layers: newLayers,
                selectedLayerId: duplicatedLayer.id // Select the new layer
            };
        });
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