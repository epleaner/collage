import React from 'react';
import { usePatternStore } from '../store/patternStore';

type TransformControlsProps = {
    patternId: string;
    onTransformChange?: () => void;
};

export const PatternTransformControls: React.FC<TransformControlsProps> = ({
    patternId,
    onTransformChange,
}) => {
    const { patterns, updateGlobalTransform, resetTransforms, duplicatePattern } = usePatternStore();

    const pattern = patterns.find(p => p.id === patternId);
    if (!pattern) return null;

    const globalTransform = pattern.globalTransform || {
        scale: { x: 1, y: 1 },
        rotation: 0,
        position: { x: 0, y: 0 },
        spacing: 1,
    };

    const handleScaleChange = (axis: 'x' | 'y', value: number) => {
        updateGlobalTransform(patternId, {
            scale: { ...globalTransform.scale, [axis]: value }
        });
        onTransformChange?.();
    };

    const handleRotationChange = (value: number) => {
        updateGlobalTransform(patternId, { rotation: value });
        onTransformChange?.();
    };

    const handlePositionChange = (axis: 'x' | 'y', value: number) => {
        updateGlobalTransform(patternId, {
            position: { ...globalTransform.position, [axis]: value }
        });
        onTransformChange?.();
    };

    const handleSpacingChange = (value: number) => {
        updateGlobalTransform(patternId, { spacing: value });
        onTransformChange?.();
    };

    const handleReset = () => {
        resetTransforms(patternId);
        onTransformChange?.();
    };

    const handleSave = () => {
        duplicatePattern(patternId);
    };

    return (
        <div className="space-y-3 p-2 rounded-md">
            <h3 className="text-white">Pattern Config</h3>

            <div>
                <label className="block text-white mb-1">Scale</label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-white text-xs">X: {globalTransform.scale.x.toFixed(2)}</label>
                        <input
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={globalTransform.scale.x}
                            onChange={(e) => handleScaleChange('x', parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="text-white text-xs">Y: {globalTransform.scale.y.toFixed(2)}</label>
                        <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={globalTransform.scale.y}
                            onChange={(e) => handleScaleChange('y', parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Rotation Control */}
            <div>
                <label className="block text-white mb-1">Rotation: {globalTransform.rotation.toFixed(0)}°</label>
                <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={globalTransform.rotation}
                    onChange={(e) => handleRotationChange(parseFloat(e.target.value))}
                    className="w-full"
                />
            </div>

            {/* Position Controls */}
            <div>
                <label className="block text-white mb-1">Position</label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-white text-xs">X: {globalTransform.position.x.toFixed(0)}</label>
                        <input
                            type="range"
                            min="-100"
                            max="100"
                            step="1"
                            value={globalTransform.position.x}
                            onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="text-white text-xs">Y: {globalTransform.position.y.toFixed(0)}</label>
                        <input
                            type="range"
                            min="-100"
                            max="100"
                            step="1"
                            value={globalTransform.position.y}
                            onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Spacing Control - only show for patterns with multiple shapes */}
            {pattern.shapeMasks.length > 1 && (
                <div>
                    <label className="block text-white mb-1">Spacing: {globalTransform.spacing.toFixed(2)}</label>
                    <input
                        type="range"
                        min="-10"
                        max="20"
                        step="0.1"
                        value={globalTransform.spacing}
                        onChange={(e) => handleSpacingChange(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button
                    onClick={handleReset}
                    className="grow"
                >
                    Reset
                </button>
                <button
                    onClick={handleSave}
                    className="grow"
                >
                    Save
                </button>
            </div>
        </div>
    );
}; 