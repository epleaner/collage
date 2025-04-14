import { useUIStore } from './store/uiStore';
import { useLayerStore } from '../layer/store/layerStore';
import { usePatternStore } from '../pattern/store/patternStore';
import { Layer } from '../layer/types/layer.types';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Eye, EyeOff } from 'lucide-react';

const LayerItem = ({ layer }: { layer: Layer }) => {
    const { removeLayer, setLayerPattern, setLayerSrcUrl, updateLayer } = useLayerStore();
    const { patterns } = usePatternStore();

    return (
        <div className="p-2.5 mb-2.5 bg-white/10 rounded">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => updateLayer(layer.id, { visible: !layer.visible })}
                        className="bg-transparent border-none text-white p-1.5 rounded cursor-pointer flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                    >
                        {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                </div>
                <button
                    onClick={() => removeLayer(layer.id)}
                    className="bg-transparent border-none text-white p-1.5 rounded cursor-pointer flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                >
                    <Trash2 size={16} />
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
            Add New Layer
        </button>
    );
};

const Sidebar = () => {
    const { isSidebarVisible } = useUIStore();
    const { layers } = useLayerStore();

    if (!isSidebarVisible) return null;

    return (
        <div
            className="fixed right-0 top-0 w-[300px] h-screen bg-black/50 backdrop-blur-xl text-white p-5 box-border z-[9999] overflow-y-auto"
        >
            <div>
                {layers.map(layer => (
                    <LayerItem key={layer.id} layer={layer} />
                ))}
            </div>
            <AddLayerButton />
        </div>
    );
};

export default Sidebar; 