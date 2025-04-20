import { ShapeType, TextStyle } from '../layer/types/layer.types';

export const getShapePathData = (
    shape: ShapeType,
    dimensions: { width: number; height: number },
    customPathData?: string,
) => {
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
        case 'text':
            // For text, we don't return a path but let useMediaStyle handle it separately
            return '';
        default:
            return '';
    }
};

// Helper function for text SVG creation
export const createTextSVG = (
    text: string,
    dimensions: { width: number; height: number },
    textStyle?: TextStyle
) => {
    const { width, height } = dimensions;
    const style = textStyle || {
        fontFamily: 'Arial, sans-serif',
        fontSize: 72,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 1.2
    };

    // Split text by newlines
    const lines = text.split('\n');

    // Calculate text position based on alignment
    let x;
    let textAnchor;

    switch (style.textAlign) {
        case 'left':
            x = 10;
            textAnchor = 'start';
            break;
        case 'right':
            x = width - 10;
            textAnchor = 'end';
            break;
        case 'center':
        default:
            x = width / 2;
            textAnchor = 'middle';
            break;
    }

    // Generate text elements for each line
    const textElements = lines.map((line, index) => {
        // Escape special characters for SVG
        const escapedLine = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');

        // Calculate y position - position each line with proper spacing
        // For one line, center it; for multiple lines, space them evenly
        const lineHeight = style.fontSize * style.lineHeight;
        const totalTextHeight = lineHeight * lines.length;
        const startY = (height - totalTextHeight) / 2 + lineHeight / 2; // Start from the appropriate position
        const y = startY + index * lineHeight;

        return `<text 
            x="${x}" 
            y="${y}" 
            font-family="${style.fontFamily}" 
            font-size="${style.fontSize}px" 
            font-weight="${style.fontWeight}" 
            text-anchor="${textAnchor}" 
            dominant-baseline="middle"
            fill="black"
        >${escapedLine}</text>`;
    }).join('\n');

    // Create an SVG with auto dimensions to ensure text is fully visible
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        ${textElements}
    </svg>`;
};

