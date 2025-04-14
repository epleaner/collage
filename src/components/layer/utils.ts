import { ShapeType } from '../layer/types/layer.types';

interface ShapeMask {
    type: ShapeType;
    dimensions: { width: number; height: number };
    position: { x: number; y: number };
    pathData?: string;
}

export const getShapePathData = (shape: ShapeType, dimensions: { width: number; height: number }, customPathData?: string) => {
    const { width, height } = dimensions;
    switch (shape) {
        case 'circle':
            const radius = width / 2;
            return `M ${radius},0 A ${radius},${radius} 0 1,1 ${radius},${width} A ${radius},${radius} 0 1,1 ${radius},0 Z`;
        case 'triangle':
            return `M ${width / 2},0 L 0,${height} L ${width},${height} Z`;
        case 'rectangle':
            return `M 0,0 L ${width},0 L ${width},${height} L 0,${height} Z`;
        case 'custom':
            return customPathData || '';
        default:
            return '';
    }
};

