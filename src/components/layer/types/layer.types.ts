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

export interface Layer {
  id: string;
  transform: Transform;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  patternId: string | null;
  srcUrl: string;
  currentTime?: number;
  playing?: boolean;
  frameRate?: number;
  startTime?: number; // In seconds
  endTime?: number; // In seconds
  loopMode?: 'normal' | 'forward-backward'; // Loop mode: normal (default) or forward-backward
}

export interface LayerState {
  layers: Layer[];
  selectedLayerId: string | null;
  activeLayerId: string | null;
} 