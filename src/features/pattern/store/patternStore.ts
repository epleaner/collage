import { create } from 'zustand';
import { Pattern, PatternState, PatternApplication } from '../types/pattern.types';
import { v4 as uuidv4 } from 'uuid';

const initialState: PatternState = {
  patterns: [],
  selectedPatternId: null,
  activePatternId: null,
};

export const usePatternStore = create<PatternState & {
  addPattern: (pattern: Omit<Pattern, 'id'>) => void;
  removePattern: (id: string) => void;
  updatePattern: (id: string, updates: Partial<Pattern>) => void;
  selectPattern: (id: string | null) => void;
  setActivePattern: (id: string | null) => void;
  applyPattern: (application: PatternApplication) => void;
}>((set) => ({
  ...initialState,

  addPattern: (pattern) => set((state) => ({
    patterns: [...state.patterns, { ...pattern, id: uuidv4() }],
  })),

  removePattern: (id) => set((state) => ({
    patterns: state.patterns.filter((pattern) => pattern.id !== id),
    selectedPatternId: state.selectedPatternId === id ? null : state.selectedPatternId,
    activePatternId: state.activePatternId === id ? null : state.activePatternId,
  })),

  updatePattern: (id, updates) => set((state) => ({
    patterns: state.patterns.map((pattern) =>
      pattern.id === id ? { ...pattern, ...updates } : pattern
    ),
  })),

  selectPattern: (id) => set({ selectedPatternId: id }),

  setActivePattern: (id) => set({ activePatternId: id }),

  applyPattern: (application) => {
    // This will be implemented when we create the pattern application logic
    console.log('Applying pattern:', application);
  },
})); 