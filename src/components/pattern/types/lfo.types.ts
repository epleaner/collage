export type WaveformType = 'sine' | 'triangle' | 'sawtooth' | 'square' | 'noise';

export interface LFOConfig {
  enabled: boolean;
  frequency: number; // Hz
  amplitude: number; // 0-1 multiplier
  phase: number; // 0-360 degrees
  waveform: WaveformType;
  offset: number; // -1 to 1, center bias
}

export interface TransformLFOs {
  scaleX: LFOConfig;
  scaleY: LFOConfig;
  rotation: LFOConfig;
  positionX: LFOConfig;
  positionY: LFOConfig;
  spacing: LFOConfig;
  repetitions: LFOConfig;
}

// Default LFO configuration
export const defaultLFOConfig: LFOConfig = {
  enabled: false,
  frequency: 1.0,
  amplitude: 0.1,
  phase: 0,
  waveform: 'sine',
  offset: 0,
};

// Default LFOs for all transform parameters
export const defaultTransformLFOs: TransformLFOs = {
  scaleX: { ...defaultLFOConfig },
  scaleY: { ...defaultLFOConfig },
  rotation: { ...defaultLFOConfig, amplitude: 10 }, // degrees
  positionX: { ...defaultLFOConfig, amplitude: 5 }, // percentage
  positionY: { ...defaultLFOConfig, amplitude: 5 }, // percentage
  spacing: { ...defaultLFOConfig, amplitude: 0.2 },
  repetitions: { ...defaultLFOConfig, amplitude: 2 },
};

// LFO value calculation result
export interface LFOValue {
  raw: number; // -1 to 1 oscillator output
  scaled: number; // amplitude and offset applied
}
