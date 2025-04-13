import { useEffect } from 'react';
import { usePatternStore } from '../pattern/store/patternStore';
import { ImageLayer, GifLayer, VideoLayer, ShapeType } from '../layer/types/layer.types';

const Collage = () => {
  const { patterns, currentPatternIndex, setCurrentPatternIndex } = usePatternStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (!isNaN(key) && key >= 1 && key <= patterns.length) {
        setCurrentPatternIndex(key - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [patterns.length, setCurrentPatternIndex]);

  // Create base image layer (no shape masks)
  const baseLayer: ImageLayer = {
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
    shapeMasks: []
  };

  // Create second layer with current pattern
  const secondLayer: VideoLayer = {
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
    shapeMasks: patterns[currentPatternIndex].shapeMasks,
    currentTime: 0,
    duration: 0,
    playing: true
  };

  const getShapePathData = (shape: ShapeType, dimensions: { width: number; height: number }) => {
    const { width, height } = dimensions;
    switch (shape) {
      case 'circle':
        const radius = width / 2;
        return `M ${radius},0 A ${radius},${radius} 0 1,1 ${radius},${width} A ${radius},${radius} 0 1,1 ${radius},0 Z`;
      case 'triangle':
        return `M ${width/2},0 L 0,${height} L ${width},${height} Z`;
      case 'rectangle':
        return `M 0,0 L ${width},0 L ${width},${height} L 0,${height} Z`;
      default:
        return '';
    }
  };

  const renderLayer = (layer: ImageLayer | GifLayer | VideoLayer) => {
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

    const mediaStyle: React.CSSProperties = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const
    };

    const renderMedia = () => {
      switch (layer.type) {
        case 'image':
          return <img src={layer.src} alt={layer.name} style={mediaStyle} />;
        case 'gif':
          return <img src={layer.src} alt={layer.name} style={mediaStyle} />;
        case 'video':
          return (
            <video
              src={layer.src}
              style={mediaStyle}
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

    return (
      <div key={layer.id} style={layerStyle}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div
            style={{
              ...mediaStyle,
              maskImage: layer.shapeMasks.map(mask => {
                const pathData = getShapePathData(mask.type, mask.dimensions);
                return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><path d='${pathData}' fill='black'/></svg>")`;
              }).join(', '),
              WebkitMaskImage: layer.shapeMasks.map(mask => {
                const pathData = getShapePathData(mask.type, mask.dimensions);
                return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><path d='${pathData}' fill='black'/></svg>")`;
              }).join(', '),
              maskSize: layer.shapeMasks.map(mask => `${mask.dimensions.width}px ${mask.dimensions.height}px`).join(', '),
              WebkitMaskSize: layer.shapeMasks.map(mask => `${mask.dimensions.width}px ${mask.dimensions.height}px`).join(', '),
              maskPosition: layer.shapeMasks.map(mask => `${mask.position.x}% ${mask.position.y}%`).join(', '),
              WebkitMaskPosition: layer.shapeMasks.map(mask => `${mask.position.x}% ${mask.position.y}%`).join(', '),
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskComposite: 'add',
              WebkitMaskComposite: 'add'
            }}
          >
            {renderMedia()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#f0f0f0'
    }}>
      {renderLayer(baseLayer)}
      {renderLayer(secondLayer)}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: 5
      }}>
        Current Pattern: {patterns[currentPatternIndex].name} (Press 1-{patterns.length} to switch)
      </div>
    </div>
  );
};

export default Collage; 