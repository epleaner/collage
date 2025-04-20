import { create } from 'zustand';

// New type for transforms
export type Transform = {
  scale: { x: number; y: number };
  rotation: number;
  position: { x: number; y: number };
  spacing: number; // For patterns with multiple shapes
  repetitions: number; // Number of repetitions of the shape
};

export type Pattern = {
  id: string;
  name: string;
  shapeMasks: Array<{
    type: 'circle' | 'triangle' | 'rectangle' | 'custom' | 'text';
    dimensions: { width: number; height: number };
    position: { x: number; y: number };
    rotation: number;
    pathData?: string;
    textContent?: string;
    textStyle?: {
      fontFamily: string;
      fontSize: number;
      fontWeight: string;
      textAlign: 'left' | 'center' | 'right';
      lineHeight: number;
    };
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
  updatePatternShapeCount: (patternId: string, count: number) => void;
};

// Default transform values
const defaultTransform: Transform = {
  scale: { x: 1, y: 1 },
  rotation: 0,
  position: { x: 0, y: 0 },
  spacing: 1,
  repetitions: 1,
};

const createRowOfRectangles = (): Pattern => ({
  id: 'rectangles',
  name: 'Rectangles',
  shapeMasks: Array.from({ length: 5 }, (_, i) => ({
    type: 'rectangle' as const,
    dimensions: { width: 150, height: 200 },
    position: { x: 20 + (i * 15), y: 50 },
    rotation: 0
  })),
  globalTransform: { ...defaultTransform }
});

const createCenterCircle = (): Pattern => ({
  id: 'circles',
  name: 'Circles',
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
  id: 'triangles',
  name: 'Triangles',
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

const createTextPattern = (): Pattern => ({
  id: 'text',
  name: 'Text',
  shapeMasks: [{
    type: 'text' as const,
    dimensions: { width: 800, height: 600 },
    position: { x: 20, y: 20 },
    rotation: 0,
    textContent: 'COLLAGE',
    textStyle: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 120,
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: 1.2
    }
  }],
  globalTransform: { ...defaultTransform }
});

export const usePatternStore = create<PatternStore>((set) => ({
  patterns: [
    createRowOfRectangles(),
    createCenterCircle(),
    createSquigglyLines(),
    createTriangleGrid(),
    createTextPattern(),
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
    }),

  // Update the number of shapes in a pattern
  updatePatternShapeCount: (patternId, count) =>
    set((state) => {
      const patternIndex = state.patterns.findIndex(p => p.id === patternId);
      if (patternIndex === -1) return state;

      const newPatterns = [...state.patterns];
      const pattern = { ...newPatterns[patternIndex] };
      const currentShapes = [...pattern.shapeMasks];
      const currentCount = currentShapes.length;

      if (count === currentCount) return state;

      // If we need to add shapes
      if (count > currentCount) {
        const shapeType = currentShapes[0]?.type || 'rectangle';
        const baseShape = currentShapes[0] || {
          type: 'rectangle' as const,
          dimensions: { width: 150, height: 200 },
          position: { x: 20, y: 50 },
          rotation: 0
        };

        // Add new shapes based on the first shape
        for (let i = currentCount; i < count; i++) {
          const newShape = { ...JSON.parse(JSON.stringify(baseShape)) };

          // Update position for the new shape to create a pattern
          if (shapeType === 'rectangle' || shapeType === 'triangle') {
            newShape.position = {
              x: baseShape.position.x + (i * 15),
              y: baseShape.position.y
            };
          } else if (shapeType === 'circle') {
            // For circles, arrange in a circular pattern
            const angle = (i / count) * Math.PI * 2;
            const radius = 20;
            newShape.position = {
              x: baseShape.position.x + Math.cos(angle) * radius,
              y: baseShape.position.y + Math.sin(angle) * radius
            };
          } else if (shapeType === 'custom') {
            // For custom shapes, just offset them
            newShape.position = {
              x: baseShape.position.x + (i * 30),
              y: baseShape.position.y
            };
          }

          // For triangle grid, alternate rotation
          if (shapeType === 'triangle') {
            newShape.rotation = (i % 2) * 180;
          }

          currentShapes.push(newShape);
        }
      }
      // If we need to remove shapes
      else if (count < currentCount) {
        // Remove shapes from the end
        currentShapes.splice(count);
      }

      pattern.shapeMasks = currentShapes;
      newPatterns[patternIndex] = pattern;

      return { patterns: newPatterns };
    })
})); 