import { LFOConfig, LFOValue, WaveformType } from '../types/lfo.types';

/**
 * Generate a random value for noise waveform (cached for performance)
 */
let lastNoiseTime = 0;
let cachedNoiseValue = 0;
const NOISE_UPDATE_INTERVAL = 1000 / 60; // 60fps noise updates

/**
 * Calculate waveform value based on normalized phase (0-1)
 */
function calculateWaveform(waveform: WaveformType, normalizedPhase: number): number {
  switch (waveform) {
    case 'sine':
      return Math.sin(normalizedPhase * Math.PI * 2);

    case 'triangle': {
      // Triangle wave: ramp up 0-0.5, ramp down 0.5-1
      const phase = normalizedPhase % 1;
      if (phase < 0.5) {
        return phase * 4 - 1; // 0 to 0.5 maps to -1 to 1
      } else {
        return 3 - phase * 4; // 0.5 to 1 maps to 1 to -1
      }
    }

    case 'sawtooth':
      // Sawtooth wave: linear ramp from -1 to 1
      return (normalizedPhase % 1) * 2 - 1;

    case 'square':
      // Square wave: -1 for first half, 1 for second half
      return normalizedPhase % 1 < 0.5 ? -1 : 1;

    case 'noise': {
      // Sample-and-hold noise, updated at fixed intervals for performance
      const now = performance.now();
      if (now - lastNoiseTime > NOISE_UPDATE_INTERVAL) {
        cachedNoiseValue = Math.random() * 2 - 1;
        lastNoiseTime = now;
      }
      return cachedNoiseValue;
    }

    default:
      return 0;
  }
}

/**
 * Calculate LFO value for a given time and configuration
 * @param time - Current time in seconds
 * @param config - LFO configuration
 * @returns LFO value with raw oscillator output and scaled result
 */
export function calculateLFOValue(time: number, config: LFOConfig): LFOValue {
  if (!config.enabled || config.frequency <= 0) {
    return { raw: 0, scaled: config.offset };
  }

  // Calculate phase with frequency and phase offset
  const phaseOffset = config.phase / 360; // Convert degrees to 0-1
  const normalizedPhase = time * config.frequency + phaseOffset;

  // Get raw waveform value (-1 to 1)
  const raw = calculateWaveform(config.waveform, normalizedPhase);

  // Apply amplitude and offset
  const scaled = raw * config.amplitude + config.offset;

  return { raw, scaled };
}

/**
 * Calculate all LFO values for a set of transform parameters
 * @param time - Current time in seconds
 * @param lfos - All LFO configurations
 * @returns Object with calculated values for each parameter
 */
export function calculateTransformLFOValues(time: number, lfos: any) {
  return {
    scaleX: calculateLFOValue(time, lfos.scaleX),
    scaleY: calculateLFOValue(time, lfos.scaleY),
    rotation: calculateLFOValue(time, lfos.rotation),
    positionX: calculateLFOValue(time, lfos.positionX),
    positionY: calculateLFOValue(time, lfos.positionY),
    spacing: calculateLFOValue(time, lfos.spacing),
    repetitions: calculateLFOValue(time, lfos.repetitions),
  };
}

/**
 * Apply LFO value to a base parameter value
 * @param baseValue - Original parameter value
 * @param lfoValue - LFO value to apply
 * @param paramType - Type of parameter for appropriate scaling
 * @returns Modified parameter value
 */
export function applyLFOToParameter(
  baseValue: number,
  lfoValue: LFOValue,
  paramType: 'scale' | 'rotation' | 'position' | 'spacing' | 'repetitions'
): number {
  switch (paramType) {
    case 'scale':
      // For scale, add LFO value (can go negative for flipping)
      return Math.max(0.01, baseValue + lfoValue.scaled); // Prevent zero scale

    case 'rotation':
      // For rotation, add LFO value directly (in degrees)
      return baseValue + lfoValue.scaled;

    case 'position':
      // For position, add LFO value directly (percentage)
      return baseValue + lfoValue.scaled;

    case 'spacing':
      // For spacing, add LFO value but prevent negative values
      return Math.max(0.1, baseValue + lfoValue.scaled);

    case 'repetitions':
      // For repetitions, add LFO value but ensure it's an integer >= 1
      return Math.max(1, Math.round(baseValue + lfoValue.scaled));

    default:
      return baseValue;
  }
}

/**
 * Performance-optimized version that calculates LFO values for specific parameters only
 * @param time - Current time in seconds
 * @param enabledLFOs - Object indicating which LFOs are enabled
 * @param lfos - LFO configurations
 * @returns Calculated values only for enabled LFOs
 */
export function calculateEnabledLFOValues(
  time: number,
  enabledLFOs: Record<string, boolean>,
  lfos: any
) {
  const values: Record<string, LFOValue> = {};

  if (enabledLFOs.scaleX) values.scaleX = calculateLFOValue(time, lfos.scaleX);
  if (enabledLFOs.scaleY) values.scaleY = calculateLFOValue(time, lfos.scaleY);
  if (enabledLFOs.rotation) values.rotation = calculateLFOValue(time, lfos.rotation);
  if (enabledLFOs.positionX) values.positionX = calculateLFOValue(time, lfos.positionX);
  if (enabledLFOs.positionY) values.positionY = calculateLFOValue(time, lfos.positionY);
  if (enabledLFOs.spacing) values.spacing = calculateLFOValue(time, lfos.spacing);
  if (enabledLFOs.repetitions) values.repetitions = calculateLFOValue(time, lfos.repetitions);

  return values;
}
