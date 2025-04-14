import { create } from 'zustand';

export type Pattern = {
  id: string;
  name: string;
  shapeMasks: Array<{
    type: 'circle' | 'triangle' | 'rectangle' | 'custom';
    dimensions: { width: number; height: number };
    position: { x: number; y: number };
    rotation: number;
    pathData?: string;
  }>;
};

type PatternStore = {
  patterns: Pattern[];
  currentPatternIndex: number;
  setCurrentPatternIndex: (index: number) => void;
};

const createRowOfRectangles = (): Pattern => ({
  id: 'row-of-rectangles',
  name: 'Row of Rectangles',
  shapeMasks: Array.from({ length: 5 }, (_, i) => ({
    type: 'rectangle' as const,
    dimensions: { width: 150, height: 200 },
    position: { x: 20 + (i * 15), y: 50 },
    rotation: 0
  }))
});

const createCenterCircle = (): Pattern => ({
  id: 'center-circle',
  name: 'Center Circle',
  shapeMasks: [{
    type: 'circle' as const,
    dimensions: { width: 400, height: 400 },
    position: { x: 50, y: 50 },
    rotation: 0
  }]
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
  }))
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
  })
});

export const usePatternStore = create<PatternStore>((set) => ({
  patterns: [
    createRowOfRectangles(),
    createCenterCircle(),
    createSquigglyLines(),
    createTriangleGrid(),
  ],
  currentPatternIndex: 0,
  setCurrentPatternIndex: (index) => set({ currentPatternIndex: index })
})); 