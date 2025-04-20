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

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'custom' | 'text';

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number; // Multiplier of fontSize (e.g., 1.2 means 1.2× fontSize)
}

export interface ShapeMask {
  type: ShapeType;
  dimensions: Dimensions;
  position: Position;
  rotation: number;
  pathData?: string;
  textContent?: string;
  textStyle?: TextStyle;
}

// Pattern transform for per-layer pattern configuration
export interface PatternTransform {
  scale: { x: number; y: number };
  rotation: number;
  position: { x: number; y: number };
  spacing: number;
  repetitions: number;
  shapeCount?: number;
}

export interface Layer {
  id: string;
  transform: Transform;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  patternId: string | null;
  patternTransform?: PatternTransform; // Per-layer pattern configuration
  srcUrl: string;
  currentTime?: number;
  playing?: boolean;
  frameRate?: number;
  startTime?: number; // In seconds
  endTime?: number; // In seconds
  loopMode?: 'normal' | 'forward-backward'; // Loop mode: normal (default) or forward-backward
  textContent?: string; // Text content for text patterns
  textStyle?: TextStyle; // Style for text patterns
}

export interface LayerState {
  layers: Layer[];
  selectedLayerId: string | null;
  activeLayerId: string | null;
} 