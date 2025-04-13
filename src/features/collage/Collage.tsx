import { useEffect } from 'react';
import { usePatternStore } from '../pattern/store/patternStore';
import { useLayerStore } from '../layer/store/layerStore';
import { createDefaultGridPattern } from '../pattern/utils/pattern.utils';
import { ImageLayer, GifLayer, VideoLayer, ShapeType } from '../layer/types/layer.types';

const Collage = () => {
  const { addPattern, patterns } = usePatternStore();
  const { addLayer, layers } = useLayerStore();

  useEffect(() => {
    // Create a grid pattern for our collage
    const gridPattern = createDefaultGridPattern('Media Collage');
    addPattern(gridPattern);

    // Create base image layer (no shape masks)
    addLayer({
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
      shapeMasks: [] // No shape masks for base layer
    } as ImageLayer);

    // Create layers for other media types with shape masks
    const mediaLayers = [
      {
        type: 'gif' as const,
        src: '/media/flower.gif',
        name: 'Flower GIF',
        shapeMasks: [
          {
            type: 'rectangle' as ShapeType,
            dimensions: { width: 400, height: 200 },
            position: { x: 25, y: 25 }, // 25% from left and top
            rotation: 45
          }
        ]
      },
      {
        type: 'video' as const,
        src: '/media/video.mp4',
        name: 'Video',
        shapeMasks: [
          {
            type: 'triangle' as ShapeType,
            dimensions: { width: 300, height: 300 },
            position: { x: 75, y: 75 },
            rotation: 0
          },
          {
            type: 'circle' as ShapeType,
            dimensions: { width: 200, height: 200 },
            position: { x: 25, y: 75 },
            rotation: 0
          },
          {
            type: 'rectangle' as ShapeType,
            dimensions: { width: 250, height: 150 },
            position: { x: 50, y: 25 },
            rotation: 30
          },
          {
            type: 'triangle' as ShapeType,
            dimensions: { width: 180, height: 180 },
            position: { x: 85, y: 25 },
            rotation: 180
          }
        ]
      }
    ];

    mediaLayers.forEach((media, index) => {
      const baseLayer = {
        id: `layer-${index + 1}`, // Start from 1 since base is 0
        name: media.name,
        transform: {
          position: { x: 0, y: 0 },
          scale: 1,
          rotation: 0,
          opacity: 1
        },
        visible: true,
        locked: false,
        zIndex: index + 1, // Higher zIndex than base layer
        shapeMasks: media.shapeMasks
      };

      switch (media.type) {
        case 'gif':
          addLayer({
            ...baseLayer,
            type: 'gif',
            src: media.src,
            frameRate: 30
          } as GifLayer);
          break;
        case 'video':
          addLayer({
            ...baseLayer,
            type: 'video',
            src: media.src,
            currentTime: 0,
            duration: 0,
            playing: true
          } as VideoLayer);
          break;
      }
    });
  }, []);

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

    // Create a single media container with multiple masks
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
      {layers.map(renderLayer)}
    </div>
  );
};

export default Collage; 