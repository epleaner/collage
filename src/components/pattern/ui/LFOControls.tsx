import React from 'react';
import { LFOConfig, WaveformType } from '../types/lfo.types';

interface LFOControlsProps {
  label: string;
  lfoConfig: LFOConfig;
  onUpdate: (updates: Partial<LFOConfig>) => void;
}

const waveformOptions: { value: WaveformType; label: string }[] = [
  { value: 'sine', label: 'Sine' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'sawtooth', label: 'Sawtooth' },
  { value: 'square', label: 'Square' },
  { value: 'noise', label: 'Noise' },
];

export const LFOControls: React.FC<LFOControlsProps> = ({ label, lfoConfig, onUpdate }) => {
  return (
    <div className="space-y-2 p-2 bg-white/5 rounded">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">{label} LFO</label>
        <button
          onClick={() => onUpdate({ enabled: !lfoConfig.enabled })}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            lfoConfig.enabled
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          {lfoConfig.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Controls - only visible when enabled */}
      {lfoConfig.enabled && (
        <div className="space-y-2">
          {/* Waveform dropdown */}
          <div>
            <label className="block text-xs text-white/80 mb-1">Waveform</label>
            <select
              value={lfoConfig.waveform}
              onChange={(e) => onUpdate({ waveform: e.target.value as WaveformType })}
              className="w-full px-2 py-1 text-xs bg-white/10 text-white rounded border border-white/20 focus:border-blue-400 focus:outline-none"
            >
              {waveformOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs text-white/80 mb-1">
              Frequency: {lfoConfig.frequency.toFixed(2)} Hz
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={lfoConfig.frequency}
              onChange={(e) => onUpdate({ frequency: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Amplitude */}
          <div>
            <label className="block text-xs text-white/80 mb-1">
              Amplitude: {lfoConfig.amplitude.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={lfoConfig.amplitude}
              onChange={(e) => onUpdate({ amplitude: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Phase */}
          <div>
            <label className="block text-xs text-white/80 mb-1">
              Phase: {lfoConfig.phase.toFixed(0)}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={lfoConfig.phase}
              onChange={(e) => onUpdate({ phase: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Offset */}
          <div>
            <label className="block text-xs text-white/80 mb-1">
              Offset: {lfoConfig.offset.toFixed(2)}
            </label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={lfoConfig.offset}
              onChange={(e) => onUpdate({ offset: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
