import { useState, useEffect, useRef, useMemo } from 'react';
import { usePatternStore } from '../../pattern/store/patternStore';
import { defaultPatternTransform } from '../../pattern/utils';
import { Layer } from '../types/layer.types';
import { getShapePathData, createTextSVG } from '../utils';
import { calculateEnabledLFOValues, applyLFOToParameter } from '../../pattern/utils/lfoUtils';
import { defaultTransformLFOs } from '../../pattern/types/lfo.types';

export const useMediaStyle = (layer: Layer): React.CSSProperties => {
  const { patterns } = usePatternStore();
  const pattern = patterns.find((p) => p.id === layer.patternId);

  // State for animated transform values
  const [animatedTransform, setAnimatedTransform] = useState(() => ({
    scale: { x: 1, y: 1 },
    rotation: 0,
    position: { x: 0, y: 0 },
    spacing: 1,
    repetitions: 1,
  }));

  // Refs for animation loop
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Use the layer-specific pattern transform if available, otherwise fall back to global transform
  const patternTransform = useMemo(() => {
    const basePatternTransform =
      layer.patternTransform ||
      (pattern?.globalTransform
        ? {
            scale: pattern.globalTransform.scale,
            rotation: pattern.globalTransform.rotation,
            position: pattern.globalTransform.position,
            spacing: pattern.globalTransform.spacing,
            repetitions: pattern.globalTransform.repetitions,
          }
        : {
            scale: { x: 1, y: 1 },
            rotation: 0,
            position: { x: 0, y: 0 },
            spacing: 1,
            repetitions: 1,
          });

    return {
      ...basePatternTransform,
      lfos: layer.patternTransform?.lfos,
    };
  }, [layer.patternTransform, pattern?.globalTransform]);

  // Get LFO configuration and enabled states - memoized to prevent unnecessary re-renders
  const { lfos, enabledLFOs } = useMemo(() => {
    const lfoConfig = pattern
      ? patternTransform.lfos || defaultTransformLFOs
      : defaultTransformLFOs;

    const enabled = {
      scaleX: lfoConfig.scaleX.enabled,
      scaleY: lfoConfig.scaleY.enabled,
      rotation: lfoConfig.rotation.enabled,
      positionX: lfoConfig.positionX.enabled,
      positionY: lfoConfig.positionY.enabled,
      spacing: lfoConfig.spacing.enabled,
      repetitions: lfoConfig.repetitions.enabled,
    };

    return { lfos: lfoConfig, enabledLFOs: enabled };
  }, [pattern, patternTransform.lfos]);

  const hasAnyLFOEnabled = useMemo(() => Object.values(enabledLFOs).some(Boolean), [enabledLFOs]);

  // Memoize expensive mask generation
  const generateMaskUrls = useMemo(() => {
    return (
      shapes: Array<{
        type: string;
        dimensions: { width: number; height: number };
        rotation: number;
        pathData?: string;
        textContent?: string;
        textStyle?: Record<string, any>;
      }>
    ) => {
      return shapes.map((mask) => {
        if (mask.type === 'text') {
          // Use the createTextSVG function for text masks
          const svgContent = createTextSVG(mask.textContent || '', mask.dimensions, mask.textStyle);
          const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
          return `url("${svgDataUri}")`;
        } else {
          const pathData = getShapePathData(mask.type as any, mask.dimensions, mask.pathData);
          // Include rotation in SVG
          return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><path transform='rotate(${mask.rotation} ${mask.dimensions.width / 2} ${mask.dimensions.height / 2})' d='${pathData}' fill='black'/></svg>")`;
        }
      });
    };
  }, []);

  // Clean up animation frame effect - always runs
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Animation loop effect
  useEffect(() => {
    if (!pattern || !hasAnyLFOEnabled) {
      // No pattern or no LFOs enabled, just set base values
      setAnimatedTransform({
        scale: pattern ? patternTransform.scale : { x: 1, y: 1 },
        rotation: pattern ? patternTransform.rotation : 0,
        position: pattern ? patternTransform.position : { x: 0, y: 0 },
        spacing: pattern ? patternTransform.spacing : 1,
        repetitions: pattern ? patternTransform.repetitions : 1,
      });
      return;
    }

    // Animation loop function
    const animate = () => {
      // Use layer's currentTime if available, otherwise use performance.now()
      const currentTime = layer.videoElement?.currentTime || performance.now() / 1000;

      // Calculate LFO values for enabled LFOs only
      const lfoValues = calculateEnabledLFOValues(currentTime, enabledLFOs, lfos);

      // Apply LFO values to base transform values
      const newTransform = {
        scale: {
          x: enabledLFOs.scaleX
            ? applyLFOToParameter(patternTransform.scale.x, lfoValues.scaleX!, 'scale')
            : patternTransform.scale.x,
          y: enabledLFOs.scaleY
            ? applyLFOToParameter(patternTransform.scale.y, lfoValues.scaleY!, 'scale')
            : patternTransform.scale.y,
        },
        rotation: enabledLFOs.rotation
          ? applyLFOToParameter(patternTransform.rotation, lfoValues.rotation!, 'rotation')
          : patternTransform.rotation,
        position: {
          x: enabledLFOs.positionX
            ? applyLFOToParameter(patternTransform.position.x, lfoValues.positionX!, 'position')
            : patternTransform.position.x,
          y: enabledLFOs.positionY
            ? applyLFOToParameter(patternTransform.position.y, lfoValues.positionY!, 'position')
            : patternTransform.position.y,
        },
        spacing: enabledLFOs.spacing
          ? applyLFOToParameter(patternTransform.spacing, lfoValues.spacing!, 'spacing')
          : patternTransform.spacing,
        repetitions: enabledLFOs.repetitions
          ? applyLFOToParameter(patternTransform.repetitions, lfoValues.repetitions!, 'repetitions')
          : patternTransform.repetitions,
      };

      // Direct value setting without interpolation
      setAnimatedTransform(newTransform);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    hasAnyLFOEnabled,
    pattern?.id,
    layer.patternTransform,
    pattern?.globalTransform,
    lfos,
    enabledLFOs,
    patternTransform,
    pattern,
    layer.videoElement?.currentTime,
  ]);

  // If no pattern is selected, return empty style
  if (!pattern) {
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    };
  }

  // Determine the number of shapes to use - from layer settings or pattern definition
  const shapeCount = layer.patternTransform?.shapeCount || pattern.shapeMasks.length;
  // Get the original shapes or a subset of them based on shapeCount
  const shapeMasks = pattern.shapeMasks.slice(0, shapeCount);

  // Calculate transformed shapes with animated pattern transform applied
  let transformedShapes = shapeMasks.map((mask, index) => {
    const { type, dimensions, position, rotation, pathData, transform, textContent, textStyle } =
      mask;
    const individualTransform = transform || defaultPatternTransform;

    // Apply animated pattern transform and individual transform
    const scaledWidth = dimensions.width * animatedTransform.scale.x * individualTransform.scale.x;
    const scaledHeight =
      dimensions.height * animatedTransform.scale.y * individualTransform.scale.y;

    // Apply animated spacing for multi-shape patterns
    const spacingOffset =
      shapeMasks.length > 1 ? index * animatedTransform.spacing * individualTransform.spacing : 0;

    // Calculate final position with animated transforms
    const finalPosition = {
      x: position.x + animatedTransform.position.x + individualTransform.position.x + spacingOffset,
      y: position.y + animatedTransform.position.y + individualTransform.position.y,
    };

    // Calculate final rotation with animated transform
    const finalRotation = rotation + animatedTransform.rotation + individualTransform.rotation;

    // For text type, use layer text content if available, otherwise use pattern text
    const finalTextContent = type === 'text' ? layer.textContent || textContent || '' : textContent;

    // For text type, use layer text style if available, otherwise use pattern text style
    const finalTextStyle = type === 'text' ? layer.textStyle || textStyle : textStyle;

    return {
      type,
      dimensions: { width: scaledWidth, height: scaledHeight },
      position: finalPosition,
      rotation: finalRotation,
      pathData,
      textContent: finalTextContent,
      textStyle: finalTextStyle,
    };
  });

  // Apply animated repetitions - duplicate shapes with additional offset
  if (animatedTransform.repetitions > 1) {
    const originalShapes = [...transformedShapes];
    transformedShapes = [];

    for (let rep = 0; rep < animatedTransform.repetitions; rep++) {
      originalShapes.forEach((shape) => {
        // Create a new shape with adjusted position for each repetition
        const offsetX = rep * 10; // Offset each repetition by 10% to the right
        const offsetY = rep * 5; // Offset each repetition by 5% down

        transformedShapes.push({
          ...shape,
          position: {
            x: shape.position.x + offsetX,
            y: shape.position.y + offsetY,
          },
        });
      });
    }
  }

  return {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    maskImage: generateMaskUrls(transformedShapes).join(', '),
    WebkitMaskImage: generateMaskUrls(transformedShapes).join(', '),
    maskSize: transformedShapes
      .map((mask) => `${mask.dimensions.width}px ${mask.dimensions.height}px`)
      .join(', '),
    WebkitMaskSize: transformedShapes
      .map((mask) => `${mask.dimensions.width}px ${mask.dimensions.height}px`)
      .join(', '),
    maskPosition: transformedShapes
      .map((mask) => `${mask.position.x}% ${mask.position.y}%`)
      .join(', '),
    WebkitMaskPosition: transformedShapes
      .map((mask) => `${mask.position.x}% ${mask.position.y}%`)
      .join(', '),
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskComposite: 'add',
    WebkitMaskComposite: 'add',
  };
};
