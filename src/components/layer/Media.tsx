import { ImageLayer, GifLayer, VideoLayer } from '../layer/types/layer.types';

interface MediaProps {
    layer: ImageLayer | GifLayer | VideoLayer;
    style: React.CSSProperties;
}

const Media = ({ layer, style }: MediaProps) => {
    switch (layer.type) {
        case 'image':
            return <img src={layer.src} alt={layer.name} style={style} />;
        case 'gif':
            return <img src={layer.src} alt={layer.name} style={style} />;
        case 'video':
            return (
                <video
                    src={layer.src}
                    style={style}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            );
        default:
            return null;
    }
};

export default Media; 