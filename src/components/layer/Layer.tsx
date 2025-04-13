import { ImageLayer, GifLayer, VideoLayer } from '../layer/types/layer.types';
import Media from './Media';
import { getMediaStyle } from './utils';

interface LayerProps {
    layer: ImageLayer | GifLayer | VideoLayer;
}

const Layer = ({ layer }: LayerProps) => {
    if (!layer.visible) return null;

    const layerStyle: React.CSSProperties = {
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) rotate(${layer.transform.rotation}deg)`,
        opacity: layer.transform.opacity
    };

    return (
        <div key={layer.id} style={layerStyle}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div style={getMediaStyle(layer.shapeMasks)}>
                    <Media layer={layer} style={{ width: '100%', height: '100%', objectFit: 'cover' as const }} />
                </div>
            </div>
        </div>
    );
};

export default Layer;
