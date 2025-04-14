import { useEffect } from 'react';
import { useUIStore } from '../ui/store/uiStore';
import { useLayerStore } from '../layer/store/layerStore';
import Layer from '../layer/Layer';
import Sidebar from '../ui/Sidebar';

const Collage = () => {
  const { toggleSidebar } = useUIStore();
  const { layers } = useLayerStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '\\') {
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleSidebar]);

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
      <Sidebar />
    </div>
  );
};

export default Collage; 