import React from 'react';
import { useLayerStore } from '../../layer/store/layerStore';
import { usePatternStore } from '../store/patternStore';
import { defaultPatternTransform } from '../utils';

type LayerPatternTransformControlsProps = {
  layerId: string;
  onTransformChange?: () => void;
};

export const LayerPatternTransformControls: React.FC<LayerPatternTransformControlsProps> = ({
  layerId,
  onTransformChange,
}) => {
  const { updateLayerPatternTransform } = useLayerStore();
  const { patterns } = usePatternStore();
  const layer = useLayerStore((state) => state.layers.find((l) => l.id === layerId));

  if (!layer || !layer.patternId) {
    return <div className="text-sm text-white/50">No pattern selected for this layer.</div>;
  }

  const pattern = patterns.find((p) => p.id === layer.patternId);

  if (!pattern) {
    return <div className="text-sm text-white/50">Pattern not found.</div>;
  }

  const patternTransform = layer.patternTransform || defaultPatternTransform;

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
          <label className="block mb-1 text-white">Scale</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-white">X: {patternTransform.scale.x.toFixed(2)}</label>
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
              <label className="text-xs text-white">Y: {patternTransform.scale.y.toFixed(2)}</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={patternTransform.scale.y}
                onChange={(e) => handleScaleChange('y', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Rotation Control */}
        <div>
          <label className="block mb-1 text-white">
            Rotation: {patternTransform.rotation.toFixed(0)}°
          </label>
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

        {/* Position Controls */}
        <div>
          <label className="block mb-1 text-white">Offset</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-white">
                X: {patternTransform.position.x.toFixed(0)}%
              </label>
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
              <label className="text-xs text-white">
                Y: {patternTransform.position.y.toFixed(0)}%
              </label>
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
          </div>
        </div>

        {/* Spacing Control - only show for patterns with multiple shapes */}
        <div>
          <label className="block mb-1 text-white">
            Spacing: {patternTransform.spacing.toFixed(2)}
          </label>
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
          <label className="block mb-1 text-white">
            Repetitions: {patternTransform.repetitions}
          </label>
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
