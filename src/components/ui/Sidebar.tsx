import { useUIStore } from './store/uiStore';
import { useLayerStore } from '../layer/store/layerStore';
import { usePatternStore } from '../pattern/store/patternStore';
import { Layer } from '../layer/types/layer.types';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Eye, EyeOff, GripVertical, ChevronDown, ChevronRight, Play, Pause } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRef, useEffect, useState } from 'react';
import { LayerPatternTransformControls } from '../pattern/ui/LayerPatternTransformControls';

interface DraggableLayerItemProps {
    layer: Layer;
    index: number;
    moveLayer: (dragIndex: number, hoverIndex: number) => void;
    isSelected: boolean;
}

const DraggableLayerItem = ({ layer, index, moveLayer, isSelected }: DraggableLayerItemProps) => {
    const { removeLayer, setLayerPattern, setLayerSrcUrl, updateLayer, setLayerTimeRange, setLayerLoopMode } = useLayerStore();
    const { patterns } = usePatternStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPatternExpanded, setIsPatternExpanded] = useState(false);
    const [videoDuration, setVideoDuration] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const layerRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    // Create a hidden video element to get the duration
    useEffect(() => {
        if (!layer.srcUrl) return;

        const video = document.createElement('video');
        video.style.display = 'none';
        video.src = layer.srcUrl;

        const handleMetadataLoaded = () => {
            if (video.duration && !isNaN(video.duration)) {
                setVideoDuration(video.duration);

                // If endTime is not set, initialize it to the video duration
                if (layer.endTime === undefined) {
                    updateLayer(layer.id, { endTime: video.duration });
                }
            }
        };

        video.addEventListener('loadedmetadata', handleMetadataLoaded);
        document.body.appendChild(video);
        videoRef.current = video;

        // If metadata is already loaded, call the handler immediately
        if (video.readyState >= 1) {
            handleMetadataLoaded();
        }

        return () => {
            video.removeEventListener('loadedmetadata', handleMetadataLoaded);
            document.body.removeChild(video);
            videoRef.current = null;
        };
    }, [layer.srcUrl, layer.id, layer.endTime, updateLayer]);

    // Drag only from the handle
    const [{ isDragging }, drag] = useDrag({
        type: 'LAYER',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // Apply the drag ref to the grip handle only
    drag(handleRef);

    const [, drop] = useDrop({
        accept: 'LAYER',
        hover: (item: { index: number }, monitor) => {
            if (!layerRef.current) {
                return;
            }

            if (item.index === index) return;
            moveLayer(item.index, index);
            item.index = index;
        },
    });

    // Apply the drop ref to the whole component
    drop(layerRef);

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartTime = parseFloat(e.target.value);
        const currentEndTime = layer.endTime ?? (videoDuration || 0);

        if (newStartTime < currentEndTime) {
            setLayerTimeRange(layer.id, newStartTime, currentEndTime);
        }
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndTime = parseFloat(e.target.value);
        const currentStartTime = layer.startTime ?? 0;

        if (newEndTime > currentStartTime && videoDuration !== null) {
            setLayerTimeRange(layer.id, currentStartTime, Math.min(newEndTime, videoDuration));
        }
    };

    const handleLoopModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLoopMode = e.target.value as 'normal' | 'forward-backward';
        setLayerLoopMode(layer.id, newLoopMode);
    };

    const togglePlayPause = () => {
        updateLayer(layer.id, { playing: !layer.playing });
    };

    // Format time in seconds to mm:ss format
    const formatTime = (seconds: number | undefined): string => {
        if (seconds === undefined) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={layerRef}
            className={`p-2.5 mb-2.5 bg-white/10 rounded ${isDragging ? 'opacity-50' : ''} ${isSelected ? 'border-white/50' : 'border-transparent'} border transition-colors`}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                    <div
                        ref={handleRef}
                        className="cursor-move p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        <GripVertical size={12} className="text-white/50" />
                    </div>
                    <button
                        onClick={() => updateLayer(layer.id, { visible: !layer.visible })}
                        className="bg-transparent border-none text-white p-1.5 rounded cursor-pointer flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                    >
                        {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <button
                        onClick={togglePlayPause}
                        className="bg-transparent border-none text-white p-1.5 rounded cursor-pointer flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                    >
                        {layer.playing ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="bg-transparent border-none text-white p-1.5 rounded cursor-pointer flex items-center gap-1.5 hover:bg-white/10 transition-colors mr-1"
                    >
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                    <button
                        onClick={() => removeLayer(layer.id)}
                        className="bg-transparent border-none text-white p-1.5 rounded cursor-pointer flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-2.5">
                    <div className="mb-2.5">
                        <label className="block mb-1.5 text-white">Source URL</label>
                        <input
                            type="text"
                            value={layer.srcUrl}
                            onChange={(e) => setLayerSrcUrl(layer.id, e.target.value)}
                            placeholder="Enter media URL"
                            className="w-full p-1.5 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:border-white/40"
                        />
                    </div>
                    <div className="mb-2.5">
                        <label className="block mb-1.5 text-white">Pattern</label>
                        <select
                            value={layer.patternId || ''}
                            onChange={(e) => setLayerPattern(layer.id, e.target.value || null)}
                            className="w-full p-1.5 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:border-white/40"
                        >
                            <option value="">No Pattern</option>
                            {patterns.map(pattern => (
                                <option key={pattern.id} value={pattern.id}>
                                    {pattern.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {layer.patternId && (
                        <div className="mb-3 bg-white/5 p-2 rounded">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => setIsPatternExpanded(!isPatternExpanded)}
                            >
                                <span className="text-white text-xs">Pattern Settings</span>
                                {isPatternExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            </div>

                            {isPatternExpanded && (
                                <div className="mt-2">
                                    <LayerPatternTransformControls layerId={layer.id} />
                                </div>
                            )}
                        </div>
                    )}

                    {videoDuration !== null && (
                        <>
                            <div className="mb-2.5">
                                <label className="block mb-1.5 text-white">Video Loop Mode</label>
                                <select
                                    value={layer.loopMode || 'normal'}
                                    onChange={handleLoopModeChange}
                                    className="w-full p-1.5 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:border-white/40"
                                >
                                    <option value="normal">Normal Loop</option>
                                    <option value="forward-backward">Forward-Backward</option>
                                </select>
                            </div>

                            <div className="mb-2.5">
                                <label className="block mb-1.5 text-white">
                                    Start Time: {formatTime(layer.startTime)} / {formatTime(videoDuration)}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max={videoDuration}
                                    step="0.1"
                                    value={layer.startTime || 0}
                                    onChange={handleStartTimeChange}
                                    className="w-full"
                                />
                            </div>

                            <div className="mb-2.5">
                                <label className="block mb-1.5 text-white">
                                    End Time: {formatTime(layer.endTime)} / {formatTime(videoDuration)}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max={videoDuration}
                                    step="0.1"
                                    value={layer.endTime || videoDuration}
                                    onChange={handleEndTimeChange}
                                    className="w-full"
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const AddLayerButton = () => {
    const { addLayer } = useLayerStore();

    const handleAddLayer = () => {
        const newLayer: Layer = {
            id: uuidv4(),
            srcUrl: 'https://picsum.photos/800/600',
            transform: {
                position: { x: 0, y: 0 },
                scale: 1,
                rotation: 0,
                opacity: 1
            },
            visible: true,
            locked: false,
            zIndex: 0,
            patternId: null,
            startTime: 0,
            playing: true,
            loopMode: 'normal'
        };
        addLayer(newLayer);
    };

    return (
        <button
            onClick={handleAddLayer}
            className="w-full mb-5 p-2.5 text-white rounded cursor-pointer hover:border-white/20 border border-transparent transition-colors"
        >
            Add Layer
        </button>
    );
};

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    children,
    defaultExpanded = true
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="mb-4">
            <div
                className="flex items-center justify-between cursor-pointer mb-2 pb-1"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="text-white flex items-center gap-2">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    {title}
                </h3>
            </div>
            {isExpanded && children}
        </div>
    );
};

const Sidebar = () => {
    const { isSidebarVisible } = useUIStore();
    const { layers, reorderLayers, selectedLayerId, setSelectedLayer } = useLayerStore();

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Handle number keys 1-9 for layer selection
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key) - 1;
                if (index < layers.length) {
                    setSelectedLayer(layers[index].id);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [layers, setSelectedLayer]);

    if (!isSidebarVisible) return null;

    const moveLayer = (dragIndex: number, hoverIndex: number) => {
        reorderLayers(dragIndex, hoverIndex);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="fixed right-0 top-0 w-[300px] h-screen bg-black/50 backdrop-blur-xl text-white p-5 box-border z-[9999] overflow-y-auto">

                <CollapsibleSection title="Keyboard Shortcuts" defaultExpanded={false}>
                    <div className="bg-white/5 p-2 rounded text-xs">
                        <div><span className="font-semibold">1-9:</span> Select layer</div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Layers">
                    <div>
                        {layers.map((layer, index) => (
                            <DraggableLayerItem
                                key={layer.id}
                                layer={layer}
                                index={index}
                                moveLayer={moveLayer}
                                isSelected={layer.id === selectedLayerId}
                            />
                        ))}
                    </div>
                    <AddLayerButton />
                </CollapsibleSection>
            </div>
        </DndProvider>
    );
};

export default Sidebar; 