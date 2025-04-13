import React from 'react';
import { Layer } from './Layer';
import { useLayerStore } from '../store/layerStore';

export const LayerContainer: React.FC = () => {
  const { layers } = useLayerStore();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {layers.map((layer) => (
        <Layer key={layer.id} layer={layer} />
      ))}
    </div>
  );
}; 