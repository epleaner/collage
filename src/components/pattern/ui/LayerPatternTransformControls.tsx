import React from 'react';
import { useLayerStore } from '../../layer/store/layerStore';
import { usePatternStore } from '../store/patternStore';
import { defaultPatternTransform } from '../utils';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { defaultTransformLFOs, LFOConfig, WaveformType } from '../types/lfo.types';
import { Switch } from '../../ui/switch';
import { Settings } from 'lucide-react';
import { cn } from '../../../lib/utils';

type LayerPatternTransformControlsProps = {
  layerId: string;
  onTransformChange?: () => void;
};

export const LayerPatternTransformControls: React.FC<LayerPatternTransformControlsProps> = ({
  layerId,
  onTransformChange,
}) => {
  const { updateLayerPatternTransform, updateLayerLFO } = useLayerStore();
  const { patterns } = usePatternStore();
  const layer = useLayerStore((state) => state.layers.find((l) => l.id === layerId));

  const waveformOptions: { value: WaveformType; label: string }[] = [
    { value: 'sine', label: 'Sine' },
    { value: 'triangle', label: 'Triangle' },
    { value: 'sawtooth', label: 'Sawtooth' },
    { value: 'square', label: 'Square' },
    { value: 'noise', label: 'Noise' },
  ];

  if (!layer || !layer.patternId) {
    return <div className="text-sm text-white/50">No pattern selected for this layer.</div>;
  }

  const pattern = patterns.find((p) => p.id === layer.patternId);

  if (!pattern) {
    return <div className="text-sm text-white/50">Pattern not found.</div>;
  }

  const patternTransform = layer.patternTransform || defaultPatternTransform;

  // Get LFO configurations
  const lfos = patternTransform.lfos || defaultTransformLFOs;

  const handleScaleChange = (axis: 'x' | 'y', value: number) => {
    updateLayerPatternTransform(layerId, {
      scale: { ...patternTransform.scale, [axis]: value },
    });
    onTransformChange?.();
  };

  const handleRotationChange = (value: number) => {
    updateLayerPatternTransform(layerId, { rotation: value });
    onTransformChange?.();
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    updateLayerPatternTransform(layerId, {
      position: { ...patternTransform.position, [axis]: value },
    });
    onTransformChange?.();
  };

  const handleSpacingChange = (value: number) => {
    updateLayerPatternTransform(layerId, { spacing: value });
    onTransformChange?.();
  };

  const handleRepetitionsChange = (value: number) => {
    updateLayerPatternTransform(layerId, { repetitions: value });
    onTransformChange?.();
  };

  const handleShapeCountChange = (value: number) => {
    updateLayerPatternTransform(layerId, { shapeCount: value });
    onTransformChange?.();
  };

  const handleReset = () => {
    // Reset to default values
    updateLayerPatternTransform(layerId, {
      ...defaultPatternTransform,
    });
    onTransformChange?.();
  };

  const handleLFOToggle = (parameter: keyof typeof lfos) => {
    const currentLFO = lfos[parameter];
    updateLayerLFO(layerId, parameter, { enabled: !currentLFO.enabled });
  };

  // Component for inline LFO controls
  const InlineLFOControls = ({
    parameter,
    lfoConfig,
  }: {
    parameter: keyof typeof lfos;
    lfoConfig: LFOConfig;
  }) => (
    <div className="flex gap-2 items-center">
      <div className="flex gap-1 items-center">
        <Switch checked={lfoConfig.enabled} onCheckedChange={() => handleLFOToggle(parameter)} />
        <span className={cn('text-xs text-white')}>LFO</span>

        <Popover>
          <PopoverTrigger asChild disabled={!lfoConfig.enabled}>
            <Settings
              size={10}
              className={cn(lfoConfig.enabled ? 'text-white' : 'text-white/30')}
            />
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              {/* Waveform dropdown */}
              <div>
                <label className="block mb-1 text-xs text-white/80">Waveform</label>
                <select
                  value={lfoConfig.waveform}
                  onChange={(e) =>
                    updateLayerLFO(layerId, parameter, { waveform: e.target.value as WaveformType })
                  }
                  className="px-2 py-1 w-full text-xs text-white rounded border bg-white/10 border-white/20 focus:border-blue-400 focus:outline-none"
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
                <label className="block mb-1 text-xs text-white/80">
                  Frequency: {lfoConfig.frequency.toFixed(2)} Hz
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={lfoConfig.frequency}
                  onChange={(e) =>
                    updateLayerLFO(layerId, parameter, { frequency: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              {/* Amplitude */}
              <div>
                <label className="block mb-1 text-xs text-white/80">
                  Amplitude: {lfoConfig.amplitude.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={lfoConfig.amplitude}
                  onChange={(e) =>
                    updateLayerLFO(layerId, parameter, { amplitude: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              {/* Phase */}
              <div>
                <label className="block mb-1 text-xs text-white/80">
                  Phase: {lfoConfig.phase.toFixed(0)}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={lfoConfig.phase}
                  onChange={(e) =>
                    updateLayerLFO(layerId, parameter, { phase: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              {/* Offset */}
              <div>
                <label className="block mb-1 text-xs text-white/80">
                  Offset: {lfoConfig.offset.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={lfoConfig.offset}
                  onChange={(e) =>
                    updateLayerLFO(layerId, parameter, { offset: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {/* Shape Count Control */}
        <div>
          <label className="block mb-1 text-white">
            Shape Count: {patternTransform.shapeCount || pattern.shapeMasks.length}
          </label>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={patternTransform.shapeCount || pattern.shapeMasks.length}
            onChange={(e) => handleShapeCountChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-white">Scale X: {patternTransform.scale.x.toFixed(2)}</label>
            <InlineLFOControls parameter="scaleX" lfoConfig={lfos.scaleX} />
          </div>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={patternTransform.scale.x}
            onChange={(e) => handleScaleChange('x', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-white">Scale Y: {patternTransform.scale.y.toFixed(2)}</label>
            <InlineLFOControls parameter="scaleY" lfoConfig={lfos.scaleY} />
          </div>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={patternTransform.scale.y}
            onChange={(e) => handleScaleChange('y', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Offset Controls */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-white">
              Offset X: {patternTransform.position.x.toFixed(0)}%
            </label>
            <InlineLFOControls parameter="positionX" lfoConfig={lfos.positionX} />
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={patternTransform.position.x}
            onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-white">
              Offset Y: {patternTransform.position.y.toFixed(0)}%
            </label>
            <InlineLFOControls parameter="positionY" lfoConfig={lfos.positionY} />
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={patternTransform.position.y}
            onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Rotation Control */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-white">Rotation: {patternTransform.rotation.toFixed(0)}°</label>
            <InlineLFOControls parameter="rotation" lfoConfig={lfos.rotation} />
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={patternTransform.rotation}
            onChange={(e) => handleRotationChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Spacing Control - only show for patterns with multiple shapes */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-white">Spacing: {patternTransform.spacing.toFixed(2)}</label>
            <InlineLFOControls parameter="spacing" lfoConfig={lfos.spacing} />
          </div>
          <input
            disabled={!pattern.shapeMasks || pattern.shapeMasks.length <= 1}
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={patternTransform.spacing}
            onChange={(e) => handleSpacingChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Repetition Control */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-white">Repetitions: {patternTransform.repetitions}</label>
            <InlineLFOControls parameter="repetitions" lfoConfig={lfos.repetitions} />
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={patternTransform.repetitions}
            onChange={(e) => handleRepetitionsChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Reset Button */}
        <div className="flex justify-center pb-1">
          <button
            onClick={handleReset}
            className="px-4 py-1 text-white rounded transition-colors bg-white/10 hover:bg-white/20"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
