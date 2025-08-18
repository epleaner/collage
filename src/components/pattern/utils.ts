import { defaultTransformLFOs } from './types/lfo.types';

export const defaultPatternTransform = {
  scale: { x: 1, y: 1 },
  rotation: 0,
  position: { x: 0, y: 0 },
  spacing: 1,
  repetitions: 1,
  shapeCount: 1,
  lfos: defaultTransformLFOs,
};
