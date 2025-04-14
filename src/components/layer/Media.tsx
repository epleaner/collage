import { Layer } from '../layer/types/layer.types';
import { useEffect, useRef, useState } from 'react';

interface MediaProps {
    layer: Layer;
    style: React.CSSProperties;
}

const getMediaType = (srcUrl: string): 'image' | 'gif' | 'video' => {
    const extension = srcUrl.split('.').pop()?.toLowerCase();
    if (extension === 'gif') return 'gif';
    if (['mp4', 'webm', 'ogg'].includes(extension || '')) return 'video';
    return 'image';
};

const Media = ({ layer, style }: MediaProps) => {
    const [initialTime, setInitialTime] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaType = getMediaType(layer.srcUrl);

    useEffect(() => {
        if (mediaType === 'video' && videoRef.current && !initialTime) {
            if (layer.currentTime !== undefined) {
                videoRef.current.currentTime = layer.currentTime;
                setInitialTime(true);
            }
        }
    }, [layer, mediaType]);

    const mediaStyle = {
        ...style,
        opacity: layer.visible ? 1 : 0
    };

    switch (mediaType) {
        case 'image':
        case 'gif':
            return <img src={layer.srcUrl} alt={layer.id} style={mediaStyle} />;
        case 'video':
            return (
                <video
                    ref={videoRef}
                    src={layer.srcUrl}
                    style={mediaStyle}
                    autoPlay={layer.playing}
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