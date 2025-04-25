import { useLayerStore } from '../../layer/store/layerStore';

interface TextPatternEditorProps {
  layerId: string;
}

export const TextPatternEditor = ({ layerId }: TextPatternEditorProps) => {
  const { layers, setLayerTextContent, updateLayerTextStyle } = useLayerStore();

  const layer = layers.find((l) => l.id === layerId);

  if (!layer) return null;

  const textContent = layer.textContent || '';
  const textStyle = layer.textStyle || {
    fontFamily: 'Arial, sans-serif',
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'center' as const,
    lineHeight: 1.2,
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLayerTextContent(layerId, e.target.value);
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLayerTextStyle(layerId, { fontFamily: e.target.value });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLayerTextStyle(layerId, { fontSize: parseInt(e.target.value) });
  };

  const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLayerTextStyle(layerId, { fontWeight: e.target.value });
  };

  const handleTextAlignChange = (align: 'left' | 'center' | 'right') => {
    updateLayerTextStyle(layerId, { textAlign: align });
  };

  const handleLineHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Parse value as float and round to 1 decimal place
    const lineHeight = parseFloat(parseFloat(e.target.value).toFixed(1));
    updateLayerTextStyle(layerId, { lineHeight });
  };

  return (
    <div className="mt-4 text-pattern-editor">
      <div className="mb-3">
        <label className="block mb-1.5 text-white text-xs">Text Content</label>
        <textarea
          value={textContent}
          onChange={handleTextChange}
          className="w-full p-1.5 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:border-white/40"
          rows={3}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1.5 text-white text-xs">Font Family</label>
        <select
          value={textStyle.fontFamily}
          onChange={handleFontFamilyChange}
          className="w-full p-1.5 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:border-white/40"
        >
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="Impact, sans-serif">Impact</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block mb-1.5 text-white text-xs">
          Font Size ({textStyle.fontSize}px)
        </label>
        <input
          type="range"
          min="12"
          max="500"
          value={textStyle.fontSize}
          onChange={handleFontSizeChange}
          className="w-full"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1.5 text-white text-xs">
          Line Height ({textStyle.lineHeight}×)
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={textStyle.lineHeight}
          onChange={handleLineHeightChange}
          className="w-full"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1.5 text-white text-xs">Font Weight</label>
        <select
          value={textStyle.fontWeight}
          onChange={handleFontWeightChange}
          className="w-full p-1.5 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:border-white/40"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="300">Light</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block mb-1.5 text-white text-xs">Text Alignment</label>
        <div className="flex gap-2">
          <button
            className={`flex-1 p-1.5 rounded ${textStyle.textAlign === 'left' ? 'bg-white/30' : 'bg-white/10'}`}
            onClick={() => handleTextAlignChange('left')}
          >
            Left
          </button>
          <button
            className={`flex-1 p-1.5 rounded ${textStyle.textAlign === 'center' ? 'bg-white/30' : 'bg-white/10'}`}
            onClick={() => handleTextAlignChange('center')}
          >
            Center
          </button>
          <button
            className={`flex-1 p-1.5 rounded ${textStyle.textAlign === 'right' ? 'bg-white/30' : 'bg-white/10'}`}
            onClick={() => handleTextAlignChange('right')}
          >
            Right
          </button>
        </div>
      </div>
    </div>
  );
};
