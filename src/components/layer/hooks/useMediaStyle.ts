import { usePatternStore } from '../../pattern/store/patternStore';
import { defaultPatternTransform } from '../../pattern/ui/LayerPatternTransformControls';
import { Layer } from '../types/layer.types';
import { getShapePathData, createTextSVG } from '../utils';

export const useMediaStyle = (layer: Layer): React.CSSProperties => {
  const { patterns } = usePatternStore();
  const pattern = patterns.find((p) => p.id === layer.patternId);

  // If no pattern is selected, return empty style
  if (!pattern) {
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    };
  }

  // Use the layer-specific pattern transform if available, otherwise fall back to global transform
  const patternTransform = layer.patternTransform ||
    pattern.globalTransform || {
    scale: { x: 1, y: 1 },
    rotation: 0,
    position: { x: 0, y: 0 },
    spacing: 1,
    repetitions: 1,
  };

  // Determine the number of shapes to use - from layer settings or pattern definition
  const shapeCount = layer.patternTransform?.shapeCount || pattern.shapeMasks.length;
  // Get the original shapes or a subset of them based on shapeCount
  const shapeMasks = pattern.shapeMasks.slice(0, shapeCount);

  // Calculate transformed shapes with pattern transform applied
  let transformedShapes = shapeMasks.map((mask, index) => {
    const { type, dimensions, position, rotation, pathData, transform, textContent, textStyle } =
      mask;
    const individualTransform = transform || defaultPatternTransform;

    // Apply pattern transform and individual transform
    const scaledWidth = dimensions.width * patternTransform.scale.x * individualTransform.scale.x;
    const scaledHeight = dimensions.height * patternTransform.scale.y * individualTransform.scale.y;

    // Apply spacing for multi-shape patterns
    const spacingOffset =
      shapeMasks.length > 1 ? index * patternTransform.spacing * individualTransform.spacing : 0;

    // Calculate final position with transforms
    const finalPosition = {
      x: position.x + patternTransform.position.x + individualTransform.position.x + spacingOffset,
      y: position.y + patternTransform.position.y + individualTransform.position.y,
    };

    // Calculate final rotation
    const finalRotation = rotation + patternTransform.rotation + individualTransform.rotation;

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

  // Apply repetitions - duplicate shapes with additional offset
  if (patternTransform.repetitions > 1) {
    const originalShapes = [...transformedShapes];
    transformedShapes = [];

    for (let rep = 0; rep < patternTransform.repetitions; rep++) {
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
    maskImage: transformedShapes
      .map((mask) => {
        if (mask.type === 'text') {
          // Use the createTextSVG function for text masks
          const svgContent = createTextSVG(mask.textContent || '', mask.dimensions, mask.textStyle);
          const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
          return `url("${svgDataUri}")`;
        } else {
          const pathData = getShapePathData(mask.type, mask.dimensions, mask.pathData);
          // Include rotation in SVG
          return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><path transform='rotate(${mask.rotation} ${mask.dimensions.width / 2} ${mask.dimensions.height / 2})' d='${pathData}' fill='black'/></svg>")`;
        }
      })
      .join(', '),
    WebkitMaskImage: transformedShapes
      .map((mask) => {
        if (mask.type === 'text') {
          // Use the createTextSVG function for text masks
          const svgContent = createTextSVG(mask.textContent || '', mask.dimensions, mask.textStyle);
          const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
          return `url("${svgDataUri}")`;
        } else {
          const pathData = getShapePathData(mask.type, mask.dimensions, mask.pathData);
          // Include rotation in SVG
          return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><path transform='rotate(${mask.rotation} ${mask.dimensions.width / 2} ${mask.dimensions.height / 2})' d='${pathData}' fill='black'/></svg>")`;
        }
      })
      .join(', '),
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
