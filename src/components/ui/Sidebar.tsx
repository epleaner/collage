import { useUIStore } from './store/uiStore';
import { useLayerStore } from '../layer/store/layerStore';
import { usePatternStore } from '../pattern/store/patternStore';
import { Layer } from '../layer/types/layer.types';
import { v4 as uuidv4 } from 'uuid';

const LayerItem = ({ layer }: { layer: Layer }) => {
    const { removeLayer, setLayerPattern, setLayerSrcUrl } = useLayerStore();
    const { patterns } = usePatternStore();

    return (
        <div style={{
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '5px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{layer.name}</h3>
                    <p style={{ margin: '0', fontSize: '0.9em', opacity: 0.8 }}>
                        Type: {layer.type} | Visible: {layer.visible ? 'Yes' : 'No'}
                    </p>
                </div>
                <button
                    onClick={() => removeLayer(layer.id)}
                    style={{
                        backgroundColor: 'rgba(255, 0, 0, 0.3)',
                        border: 'none',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                >
                    Delete
                </button>
            </div>
            <div style={{ marginTop: '10px' }}>
                <input
                    type="text"
                    value={layer.srcUrl}
                    onChange={(e) => setLayerSrcUrl(layer.id, e.target.value)}
                    placeholder="Enter media URL"
                    style={{
                        width: '100%',
                        padding: '5px',
                        marginBottom: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '3px'
                    }}
                />
                <select
                    value={layer.patternId || ''}
                    onChange={(e) => setLayerPattern(layer.id, e.target.value || null)}
                    style={{
                        width: '100%',
                        padding: '5px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '3px'
                    }}
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
    );
};

const AddLayerButton = () => {
    const { addLayer } = useLayerStore();

    const handleAddLayer = () => {
        const newLayer: Layer = {
            id: uuidv4(),
            type: 'image',
            name: 'New Layer',
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
            style={{
                backgroundColor: 'rgba(0, 255, 0, 0.3)',
                border: 'none',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%',
                marginBottom: '20px'
            }}
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
            style={{
                position: 'fixed',
                right: 0,
                top: 0,
                width: '300px',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '20px',
                boxSizing: 'border-box',
                zIndex: 1000,
                overflowY: 'auto'
            }}
        >
            <h2 style={{ marginTop: 0 }}>Layer Management</h2>
            <AddLayerButton />
            <div>
                {layers.map(layer => (
                    <LayerItem key={layer.id} layer={layer} />
                ))}
            </div>
        </div>
    );
};

export default Sidebar; 