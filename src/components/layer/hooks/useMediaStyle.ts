import { usePatternStore } from "../../pattern/store/patternStore";
import { Layer } from "../types/layer.types";
import { getShapePathData } from "../utils";

export const useMediaStyle = (layer: Layer): React.CSSProperties => {
    const { patterns } = usePatternStore();
    const pattern = patterns.find(p => p.id === layer.patternId);
    const shapeMasks = pattern?.shapeMasks || [];

    return {
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        maskImage: shapeMasks.map(mask => {
            const pathData = getShapePathData(mask.type, mask.dimensions, mask.pathData);
            return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><path d='${pathData}' fill='black'/></svg>")`;
        }).join(', '),
        WebkitMaskImage: shapeMasks.map(mask => {
            const pathData = getShapePathData(mask.type, mask.dimensions, mask.pathData);
            return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><path d='${pathData}' fill='black'/></svg>")`;
        }).join(', '),
        maskSize: shapeMasks.map(mask => `${mask.dimensions.width}px ${mask.dimensions.height}px`).join(', '),
        WebkitMaskSize: shapeMasks.map(mask => `${mask.dimensions.width}px ${mask.dimensions.height}px`).join(', '),
        maskPosition: shapeMasks.map(mask => `${mask.position.x}% ${mask.position.y}%`).join(', '),
        WebkitMaskPosition: shapeMasks.map(mask => `${mask.position.x}% ${mask.position.y}%`).join(', '),
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskComposite: 'add',
        WebkitMaskComposite: 'add'
    };
}; 