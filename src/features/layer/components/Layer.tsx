import React from 'react';
import { Layer as LayerType } from '../types/layer.types';
import { useLayerStore } from '../store/layerStore';

interface LayerProps {
  layer: LayerType;
}

export const Layer: React.FC<LayerProps> = ({ layer }) => {
  const { selectedLayerId, selectLayer } = useLayerStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectLayer(layer.id);
  };

  const style: React.CSSProperties = {
    position: 'absolute',
    left: layer.transform.position.x,
    top: layer.transform.position.y,
    transform: `scale(${layer.transform.scale}) rotate(${layer.transform.rotation}deg)`,
    opacity: layer.transform.opacity,
    pointerEvents: layer.locked ? 'none' : 'auto',
    display: layer.visible ? 'block' : 'none',
    zIndex: layer.zIndex,
  };

  const renderContent = () => {
    switch (layer.type) {
      case 'image':
        return (
          <img
            src={layer.src}
            alt={layer.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        );
      case 'gif':
        return (
          <img
            src={layer.src}
            alt={layer.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        );
      case 'video':
        return (
          <video
            src={layer.src}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            controls={!layer.locked}
          />
        );
      case 'shape':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: layer.fill,
              border: `${layer.strokeWidth}px solid ${layer.stroke}`,
              borderRadius: layer.shapeType === 'circle' ? '50%' : '0',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={style}
      onClick={handleClick}
      className={`layer ${selectedLayerId === layer.id ? 'selected' : ''}`}
    >
      {renderContent()}
    </div>
  );
}; 