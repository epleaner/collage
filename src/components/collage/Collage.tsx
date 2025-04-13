import { useEffect } from 'react';
import { usePatternStore } from '../pattern/store/patternStore';
import { ImageLayer, VideoLayer } from '../layer/types/layer.types';
import Layer from '../layer/Layer';

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

  const layers = [baseLayer, secondLayer];

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#f0f0f0'
    }}>
      {layers.map(layer => (
        <Layer key={layer.id} layer={layer} />
      ))}
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