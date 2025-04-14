import { Pattern } from '../../pattern/store/patternStore';

export type LayerType = 'image' | 'gif' | 'video';

export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Transform {
  position: Position;
  scale: number;
  rotation: number;
  opacity: number;
}

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'custom';

export interface ShapeMask {
  type: ShapeType;
  dimensions: Dimensions;
  position: Position;
  rotation: number;
  pathData?: string;
}

export interface BaseLayer {
  id: string;
  type: LayerType;
  name: string;
  transform: Transform;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  patternId: string | null;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
}

export interface GifLayer extends BaseLayer {
  type: 'gif';
  src: string;
  frameRate?: number;
}

export interface VideoLayer extends BaseLayer {
  type: 'video';
  src: string;
  currentTime: number;
  duration: number;
  playing: boolean;
}

export type Layer = ImageLayer | GifLayer | VideoLayer;

export interface LayerState {
  layers: Layer[];
  selectedLayerId: string | null;
  activeLayerId: string | null;
} 