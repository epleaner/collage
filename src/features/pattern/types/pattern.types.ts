import { Layer } from '../../layer/types/layer.types';

export type PatternType = 'grid' | 'spiral' | 'random' | 'custom';

export interface BasePattern {
  id: string;
  type: PatternType;
  name: string;
}

export interface GridPatternConfig extends BasePattern {
  type: 'grid';
  parameters: {
    rows: number;
    columns: number;
    spacing: number;
    rotation: number;
  };
}

export interface SpiralPatternConfig extends BasePattern {
  type: 'spiral';
  parameters: {
    radius: number;
    turns: number;
    spacing: number;
    rotation: number;
  };
}

export interface RandomPatternConfig extends BasePattern {
  type: 'random';
  parameters: {
    count: number;
    minDistance: number;
    maxDistance: number;
    seed: number;
  };
}

export interface CustomPatternConfig extends BasePattern {
  type: 'custom';
  parameters: {
    points: Array<{ x: number; y: number }>;
  };
}

export type Pattern = GridPatternConfig | SpiralPatternConfig | RandomPatternConfig | CustomPatternConfig;

export interface PatternState {
  patterns: Pattern[];
  selectedPatternId: string | null;
}

export interface PatternApplication {
  patternId: string;
  layerIds: string[];
  transform: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
} 