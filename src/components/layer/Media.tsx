import { ImageLayer, GifLayer, VideoLayer } from '../layer/types/layer.types';
import { useEffect, useRef } from 'react';

interface MediaProps {
    layer: ImageLayer | GifLayer | VideoLayer;
    style: React.CSSProperties;
}

const Media = ({ layer, style }: MediaProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (layer.type === 'video' && videoRef.current) {
            const videoLayer = layer as VideoLayer;
            if (videoLayer.currentTime !== undefined) {
                videoRef.current.currentTime = videoLayer.currentTime;
            }
        }
    }, [layer]);

    switch (layer.type) {
        case 'image':
            return <img src={layer.srcUrl} alt={layer.name} style={style} />;
        case 'gif':
            return <img src={layer.srcUrl} alt={layer.name} style={style} />;
        case 'video':
            return (
                <video
                    ref={videoRef}
                    src={layer.srcUrl}
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