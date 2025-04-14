import { useUIStore } from './store/uiStore';
import { useLayerStore } from '../layer/store/layerStore';
import { usePatternStore } from '../pattern/store/patternStore';
import { Layer } from '../layer/types/layer.types';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRef, useEffect } from 'react';
import { PatternTransformControls } from '../pattern/ui/PatternTransformControls';

interface DraggableLayerItemProps {
    layer: Layer;
    index: number;
    moveLayer: (dragIndex: number, hoverIndex: number) => void;
    isSelected: boolean;
}

const DraggableLayerItem = ({ layer, index, moveLayer, isSelected }: DraggableLayerItemProps) => {
    const { removeLayer, setLayerPattern, setLayerSrcUrl, updateLayer } = useLayerStore();
    const { patterns } = usePatternStore();

    const [{ isDragging }, drag] = useDrag({
        type: 'LAYER',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'LAYER',
        hover: (item: { index: number }) => {
            if (item.index === index) return;
            moveLayer(item.index, index);
            item.index = index;
        },
    });

    const ref = useRef<HTMLDivElement>(null);
    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`p-2.5 mb-2.5 bg-white/10 rounded cursor-move ${isDragging ? 'opacity-50' : ''} ${isSelected ? 'border-white/50' : 'border-transparent'} border  transition-colors`}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                    <GripVertical size={12} className="text-white/50" />
                    <button
                        onClick={() => updateLayer(layer.id, { visible: !layer.visible })}
                        className="bg-transparent border-none text-white p-1.5 rounded cursor-pointer flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                    >
                        {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                </div>
                <button
                    onClick={() => removeLayer(layer.id)}
                    className="bg-transparent border-none text-white p-1.5 rounded cursor-pointer flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                >
                    <Trash2 size={12} />
                </button>
            </div>
            <div className="mt-2.5">
                <div className="mb-2.5">
                    <label className="block mb-1.5 text-white">Source URL</label>
                    <input
                        type="text"
                        value={layer.srcUrl}
                        onChange={(e) => setLayerSrcUrl(layer.id, e.target.value)}
                        placeholder="Enter media URL"
                        className="w-full p-1.5 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:border-white/40"
                    />
                </div>
                <div className="mb-2.5">
                    <label className="block mb-1.5 text-white">Pattern</label>
                    <select
                        value={layer.patternId || ''}
                        onChange={(e) => setLayerPattern(layer.id, e.target.value || null)}
                        className="w-full p-1.5 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:border-white/40"
                    >
                        <option value="">No Pattern</option>
                        {patterns.map(pattern => (
                            <option key={pattern.id} value={pattern.id}>
                                {pattern.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

const AddLayerButton = () => {
    const { addLayer } = useLayerStore();

    const handleAddLayer = () => {
        const newLayer: Layer = {
            id: uuidv4(),
            srcUrl: 'https://picsum.photos/800/600',
            transform: {
                position: { x: 0, y: 0 },
                scale: 1,
                rotation: 0,
                opacity: 1
            },
            visible: true,
            locked: false,
            zIndex: 0,
            patternId: null
        };
        addLayer(newLayer);
    };

    return (
        <button
            onClick={handleAddLayer}
            className="w-full mb-5 p-2.5 text-white rounded cursor-pointer hover:border-white/20 border border-transparent transition-colors"
        >
            Add Layer
        </button>
    );
};

const Sidebar = () => {
    const { isSidebarVisible } = useUIStore();
    const { layers, reorderLayers, selectedLayerId, setSelectedLayer, setLayerPattern } = useLayerStore();
    const { patterns } = usePatternStore();

    // Get the selected layer and its pattern
    const selectedLayer = layers.find(layer => layer.id === selectedLayerId);
    const selectedPattern = selectedLayer?.patternId ?
        patterns.find(p => p.id === selectedLayer.patternId) : null;

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Handle number keys 1-9 for layer selection
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key) - 1;
                if (index < layers.length) {
                    setSelectedLayer(layers[index].id);
                }
            }

            // Handle pattern switching for selected layer
            if (selectedLayerId) {
                const patternKeys: { [key: string]: string | null } = {
                    'q': 'row-of-rectangles',
                    'w': 'center-circle',
                    'e': 'squiggly-lines',
                    'r': 'triangle-grid',
                    't': null, // No pattern
                };

                if (patternKeys[e.key] !== undefined) {
                    setLayerPattern(selectedLayerId, patternKeys[e.key]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [layers, selectedLayerId, setSelectedLayer, setLayerPattern]);

    if (!isSidebarVisible) return null;

    const moveLayer = (dragIndex: number, hoverIndex: number) => {
        reorderLayers(dragIndex, hoverIndex);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="fixed right-0 top-0 w-[300px] h-screen bg-black/50 backdrop-blur-xl text-white p-5 box-border z-[9999] overflow-y-auto">

                {selectedPattern && (
                    <div className="mb-4">
                        <PatternTransformControls patternId={selectedPattern.id} />
                    </div>
                )}

                <div>
                    {layers.map((layer, index) => (
                        <DraggableLayerItem
                            key={layer.id}
                            layer={layer}
                            index={index}
                            moveLayer={moveLayer}
                            isSelected={layer.id === selectedLayerId}
                        />
                    ))}
                </div>
                <AddLayerButton />
            </div>
        </DndProvider>
    );
};

export default Sidebar; 