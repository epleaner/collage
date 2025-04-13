import { Pattern, GridPatternConfig, SpiralPatternConfig, RandomPatternConfig } from '../types/pattern.types';
import { v4 as uuidv4 } from 'uuid';

export const createDefaultGridPattern = (name: string = 'Grid Pattern'): GridPatternConfig => ({
  id: uuidv4(),
  type: 'grid',
  name,
  parameters: {
    rows: 3,
    columns: 3,
    spacing: 100,
    rotation: 0,
  },
});

export const createDefaultSpiralPattern = (name: string = 'Spiral Pattern'): SpiralPatternConfig => ({
  id: uuidv4(),
  type: 'spiral',
  name,
  parameters: {
    radius: 200,
    turns: 3,
    spacing: 50,
    rotation: 0,
  },
});

export const createDefaultRandomPattern = (name: string = 'Random Pattern'): RandomPatternConfig => ({
  id: uuidv4(),
  type: 'random',
  name,
  parameters: {
    count: 10,
    minDistance: 50,
    maxDistance: 200,
    seed: Math.random(),
  },
});

export const createDefaultCustomPattern = (name: string = 'Custom Pattern'): Pattern => ({
  id: uuidv4(),
  type: 'custom',
  name,
  parameters: {
    points: [],
  },
});

export const generatePatternPoints = (pattern: Pattern): Array<{ x: number; y: number }> => {
  switch (pattern.type) {
    case 'grid':
      return generateGridPoints(pattern.parameters);
    case 'spiral':
      return generateSpiralPoints(pattern.parameters);
    case 'random':
      return generateRandomPoints(pattern.parameters);
    case 'custom':
      return pattern.parameters.points;
    default:
      return [];
  }
};

const generateGridPoints = (params: GridPatternConfig['parameters']): Array<{ x: number; y: number }> => {
  const points: Array<{ x: number; y: number }> = [];
  const { rows, columns, spacing, rotation } = params;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = col * spacing;
      const y = row * spacing;
      points.push({ x, y });
    }
  }

  return rotatePoints(points, rotation);
};

const generateSpiralPoints = (params: SpiralPatternConfig['parameters']): Array<{ x: number; y: number }> => {
  const points: Array<{ x: number; y: number }> = [];
  const { radius, turns, spacing, rotation } = params;
  const totalPoints = Math.floor((radius * 2 * Math.PI * turns) / spacing);

  for (let i = 0; i < totalPoints; i++) {
    const angle = (i / totalPoints) * 2 * Math.PI * turns;
    const distance = (i / totalPoints) * radius;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    points.push({ x, y });
  }

  return rotatePoints(points, rotation);
};

const generateRandomPoints = (params: RandomPatternConfig['parameters']): Array<{ x: number; y: number }> => {
  const points: Array<{ x: number; y: number }> = [];
  const { count, minDistance, maxDistance, seed } = params;
  const random = new Random(seed);

  for (let i = 0; i < count; i++) {
    const angle = random.next() * 2 * Math.PI;
    const distance = minDistance + random.next() * (maxDistance - minDistance);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    points.push({ x, y });
  }

  return points;
};

const rotatePoints = (points: Array<{ x: number; y: number }>, angle: number): Array<{ x: number; y: number }> => {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return points.map(({ x, y }) => ({
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  }));
};

class Random {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
} 