import { Layer, Position, Dimensions, Transform } from '../types/layer.types';
import { v4 as uuidv4 } from 'uuid';

export const createDefaultTransform = (): Transform => ({
  position: { x: 0, y: 0 },
  scale: 1,
  rotation: 0,
  opacity: 1,
});

export const createImageLayer = (
  src: string,
  dimensions: Dimensions,
  name: string = 'New Image Layer'
): Layer => ({
  id: uuidv4(),
  type: 'image',
  name,
  src,
  dimensions,
  transform: createDefaultTransform(),
  visible: true,
  locked: false,
  zIndex: 0,
});

export const createGifLayer = (
  src: string,
  dimensions: Dimensions,
  name: string = 'New GIF Layer'
): Layer => ({
  id: uuidv4(),
  type: 'gif',
  name,
  src,
  dimensions,
  frameRate: 30,
  transform: createDefaultTransform(),
  visible: true,
  locked: false,
  zIndex: 0,
});

export const createVideoLayer = (
  src: string,
  dimensions: Dimensions,
  name: string = 'New Video Layer'
): Layer => ({
  id: uuidv4(),
  type: 'video',
  name,
  src,
  dimensions,
  currentTime: 0,
  duration: 0,
  playing: false,
  transform: createDefaultTransform(),
  visible: true,
  locked: false,
  zIndex: 0,
});

export const createShapeLayer = (
  shapeType: 'rectangle' | 'circle' | 'triangle',
  dimensions: Dimensions,
  name: string = 'New Shape Layer'
): Layer => ({
  id: uuidv4(),
  type: 'shape',
  name,
  shapeType,
  dimensions,
  fill: '#ffffff',
  stroke: '#000000',
  strokeWidth: 1,
  transform: createDefaultTransform(),
  visible: true,
  locked: false,
  zIndex: 0,
});

export const updateLayerPosition = (
  layer: Layer,
  position: Position
): Layer => ({
  ...layer,
  transform: {
    ...layer.transform,
    position,
  },
});

export const updateLayerScale = (
  layer: Layer,
  scale: number
): Layer => ({
  ...layer,
  transform: {
    ...layer.transform,
    scale,
  },
});

export const updateLayerRotation = (
  layer: Layer,
  rotation: number
): Layer => ({
  ...layer,
  transform: {
    ...layer.transform,
    rotation,
  },
});

export const updateLayerOpacity = (
  layer: Layer,
  opacity: number
): Layer => ({
  ...layer,
  transform: {
    ...layer.transform,
    opacity,
  },
}); 