import { create } from 'zustand';

// New type for transforms
export type Transform = {
  scale: { x: number; y: number };
  rotation: number;
  position: { x: number; y: number };
  spacing: number; // For patterns with multiple shapes
};

export type Pattern = {
  id: string;
  name: string;
  shapeMasks: Array<{
    type: 'circle' | 'triangle' | 'rectangle' | 'custom';
    dimensions: { width: number; height: number };
    position: { x: number; y: number };
    rotation: number;
    pathData?: string;
    transform?: Transform; // Individual shape transform
  }>;
  globalTransform?: Transform; // Global transform for the entire pattern
};

type PatternStore = {
  patterns: Pattern[];
  currentPatternIndex: number;
  setCurrentPatternIndex: (index: number) => void;
  // New transform functions
  updateShapeTransform: (patternId: string, shapeIndex: number, transform: Partial<Transform>) => void;
  updateGlobalTransform: (patternId: string, transform: Partial<Transform>) => void;
  resetTransforms: (patternId: string) => void;
  duplicatePattern: (patternId: string) => void;
};

// Default transform values
const defaultTransform: Transform = {
  scale: { x: 1, y: 1 },
  rotation: 0,
  position: { x: 0, y: 0 },
  spacing: 1,
};

const createRowOfRectangles = (): Pattern => ({
  id: 'row-of-rectangles',
  name: 'Row of Rectangles',
  shapeMasks: Array.from({ length: 5 }, (_, i) => ({
    type: 'rectangle' as const,
    dimensions: { width: 150, height: 200 },
    position: { x: 20 + (i * 15), y: 50 },
    rotation: 0
  })),
  globalTransform: { ...defaultTransform }
});

const createCenterCircle = (): Pattern => ({
  id: 'center-circle',
  name: 'Center Circle',
  shapeMasks: [{
    type: 'circle' as const,
    dimensions: { width: 400, height: 400 },
    position: { x: 50, y: 50 },
    rotation: 0
  }],
  globalTransform: { ...defaultTransform }
});

const createSquigglyLines = (): Pattern => ({
  id: 'squiggly-lines',
  name: 'Squiggly Lines',
  shapeMasks: Array.from({ length: 3 }, (_, i) => ({
    type: 'custom' as const,
    dimensions: { width: 400, height: 400 },
    position: { x: 20 + (i * 30), y: 50 },
    rotation: 0,
    pathData: ['M 0,200',
      `C ${50 + i * 20},${150 + i * 20} ${100 + i * 20},${250 + i * 20} ${200},${200}`,
      `C ${300 - i * 20},${150 - i * 20} ${350 - i * 20},${250 - i * 20} ${400},${200}`,
      'L 400,400',
      'L 0,400',
      'Z'
    ].join(' ')
  })),
  globalTransform: { ...defaultTransform }
});

const createTriangleGrid = (): Pattern => ({
  id: 'triangle-grid',
  name: 'Triangle Grid',
  shapeMasks: Array.from({ length: 9 }, (_, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return {
      type: 'triangle' as const,
      dimensions: { width: 150, height: 150 },
      position: { x: 25 + (col * 25), y: 25 + (row * 25) },
      rotation: (i % 2) * 180
    };
  }),
  globalTransform: { ...defaultTransform }
});

export const usePatternStore = create<PatternStore>((set) => ({
  patterns: [
    createRowOfRectangles(),
    createCenterCircle(),
    createSquigglyLines(),
    createTriangleGrid(),
  ],
  currentPatternIndex: 0,
  setCurrentPatternIndex: (index) => set({ currentPatternIndex: index }),

  // Update transform for a specific shape in a pattern
  updateShapeTransform: (patternId, shapeIndex, newTransform) =>
    set((state) => {
      const patternIndex = state.patterns.findIndex(p => p.id === patternId);
      if (patternIndex === -1) return state;

      const newPatterns = [...state.patterns];
      const pattern = { ...newPatterns[patternIndex] };
      const shapeMasks = [...pattern.shapeMasks];

      if (shapeIndex >= shapeMasks.length) return state;

      const shape = { ...shapeMasks[shapeIndex] };
      const currentTransform = shape.transform || { ...defaultTransform };

      shape.transform = {
        ...currentTransform,
        ...newTransform,
        scale: {
          ...currentTransform.scale,
          ...(newTransform.scale || {})
        },
        position: {
          ...currentTransform.position,
          ...(newTransform.position || {})
        }
      };

      shapeMasks[shapeIndex] = shape;
      pattern.shapeMasks = shapeMasks;
      newPatterns[patternIndex] = pattern;

      return { patterns: newPatterns };
    }),

  // Update global transform for an entire pattern
  updateGlobalTransform: (patternId, newTransform) =>
    set((state) => {
      const patternIndex = state.patterns.findIndex(p => p.id === patternId);
      if (patternIndex === -1) return state;

      const newPatterns = [...state.patterns];
      const pattern = { ...newPatterns[patternIndex] };
      const currentTransform = pattern.globalTransform || { ...defaultTransform };

      pattern.globalTransform = {
        ...currentTransform,
        ...newTransform,
        scale: {
          ...currentTransform.scale,
          ...(newTransform.scale || {})
        },
        position: {
          ...currentTransform.position,
          ...(newTransform.position || {})
        }
      };

      newPatterns[patternIndex] = pattern;

      return { patterns: newPatterns };
    }),

  // Reset all transforms for a pattern
  resetTransforms: (patternId) =>
    set((state) => {
      const patternIndex = state.patterns.findIndex(p => p.id === patternId);
      if (patternIndex === -1) return state;

      const newPatterns = [...state.patterns];
      const pattern = { ...newPatterns[patternIndex] };

      // Reset global transform
      pattern.globalTransform = { ...defaultTransform };

      // Reset individual shape transforms
      pattern.shapeMasks = pattern.shapeMasks.map(shape => ({
        ...shape,
        transform: undefined
      }));

      newPatterns[patternIndex] = pattern;

      return { patterns: newPatterns };
    }),

  // Duplicate a pattern with a new ID
  duplicatePattern: (patternId) =>
    set((state) => {
      const patternIndex = state.patterns.findIndex(p => p.id === patternId);
      if (patternIndex === -1) return state;

      const pattern = state.patterns[patternIndex];
      const newPattern = {
        ...JSON.parse(JSON.stringify(pattern)),
        id: `${pattern.id}-copy-${Date.now()}`,
        name: `${pattern.name} (Copy)`
      };

      return {
        patterns: [...state.patterns, newPattern],
        currentPatternIndex: state.patterns.length
      };
    })
})); 