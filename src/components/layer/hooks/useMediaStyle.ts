import { usePatternStore } from "../../pattern/store/patternStore";
import { Layer } from "../types/layer.types";
import { getShapePathData } from "../utils";

export const useMediaStyle = (layer: Layer): React.CSSProperties => {
    const { patterns } = usePatternStore();
    const pattern = patterns.find(p => p.id === layer.patternId);
    const shapeMasks = pattern?.shapeMasks || [];
    const globalTransform = pattern?.globalTransform || {
        scale: { x: 1, y: 1 },
        rotation: 0,
        position: { x: 0, y: 0 },
        spacing: 1,
        repetitions: 1
    };

    // Calculate transformed shapes with global transform applied
    let transformedShapes = shapeMasks.map((mask, index) => {
        const { type, dimensions, position, rotation, pathData, transform } = mask;
        const individualTransform = transform || {
            scale: { x: 1, y: 1 },
            rotation: 0,
            position: { x: 0, y: 0 },
            spacing: 1,
            repetitions: 1
        };

        // Apply global transform and individual transform
        const scaledWidth = dimensions.width * globalTransform.scale.x * individualTransform.scale.x;
        const scaledHeight = dimensions.height * globalTransform.scale.y * individualTransform.scale.y;

        // Apply spacing for multi-shape patterns
        const spacingOffset = shapeMasks.length > 1 ?
            index * globalTransform.spacing * individualTransform.spacing : 0;

        // Calculate final position with transforms
        const finalPosition = {
            x: position.x + globalTransform.position.x + individualTransform.position.x + spacingOffset,
            y: position.y + globalTransform.position.y + individualTransform.position.y
        };

        // Calculate final rotation
        const finalRotation = rotation + globalTransform.rotation + individualTransform.rotation;

        return {
            type,
            dimensions: { width: scaledWidth, height: scaledHeight },
            position: finalPosition,
            rotation: finalRotation,
            pathData
        };
    });

    // Apply repetitions - duplicate shapes with additional offset
    if (globalTransform.repetitions > 1) {
        const originalShapes = [...transformedShapes];
        transformedShapes = [];

        for (let rep = 0; rep < globalTransform.repetitions; rep++) {
            originalShapes.forEach(shape => {
                // Create a new shape with adjusted position for each repetition
                const offsetX = rep * 10; // Offset each repetition by 10% to the right
                const offsetY = rep * 5;  // Offset each repetition by 5% down

                transformedShapes.push({
                    ...shape,
                    position: {
                        x: shape.position.x + offsetX,
                        y: shape.position.y + offsetY
                    }
                });
            });
        }
    }

    return {
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        maskImage: transformedShapes.map(mask => {
            const pathData = getShapePathData(mask.type, mask.dimensions, mask.pathData);
            // Include rotation in SVG
            return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><path transform='rotate(${mask.rotation} ${mask.dimensions.width / 2} ${mask.dimensions.height / 2})' d='${pathData}' fill='black'/></svg>")`;
        }).join(', '),
        WebkitMaskImage: transformedShapes.map(mask => {
            const pathData = getShapePathData(mask.type, mask.dimensions, mask.pathData);
            // Include rotation in SVG
            return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><path transform='rotate(${mask.rotation} ${mask.dimensions.width / 2} ${mask.dimensions.height / 2})' d='${pathData}' fill='black'/></svg>")`;
        }).join(', '),
        maskSize: transformedShapes.map(mask => `${mask.dimensions.width}px ${mask.dimensions.height}px`).join(', '),
        WebkitMaskSize: transformedShapes.map(mask => `${mask.dimensions.width}px ${mask.dimensions.height}px`).join(', '),
        maskPosition: transformedShapes.map(mask => `${mask.position.x}% ${mask.position.y}%`).join(', '),
        WebkitMaskPosition: transformedShapes.map(mask => `${mask.position.x}% ${mask.position.y}%`).join(', '),
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskComposite: 'add',
        WebkitMaskComposite: 'add'
    };
}; 