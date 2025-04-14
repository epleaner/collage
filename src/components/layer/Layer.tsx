import { useMediaStyle } from './hooks/useMediaStyle';
import Media from './Media';
import { Layer as LayerType } from './types/layer.types';

interface LayerProps {
    layer: LayerType;
}

const Layer = ({ layer }: LayerProps) => {
    const layerStyle: React.CSSProperties = {
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) rotate(${layer.transform.rotation}deg)`,
        opacity: layer.transform.opacity
    };

    const mediaStyle = useMediaStyle(layer);

    return (
        <div key={layer.id} style={layerStyle}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div style={mediaStyle}>
                    <Media layer={layer} style={{ width: '100%', height: '100%', objectFit: 'cover' as const }} />
                </div>
            </div>
        </div>
    );
};

export default Layer;
