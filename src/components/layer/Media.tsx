import { Layer } from '../layer/types/layer.types';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useLayerStore } from './store/layerStore';

interface MediaProps {
    layer: Layer;
    style: React.CSSProperties;
}

const getMediaType = (srcUrl: string): 'image' | 'gif' | 'video' => {
    const extension = srcUrl.split('.').pop()?.toLowerCase();
    if (extension === 'gif') return 'gif';
    if (['mp4', 'webm', 'ogg'].includes(extension || '')) return 'video';
    return 'image';
};

const Media = ({ layer, style }: MediaProps) => {
    const [initialTime, setInitialTime] = useState(false);
    const [isReversed, setIsReversed] = useState(false);
    const [videoDuration, setVideoDuration] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const boundaryCheckRef = useRef<NodeJS.Timeout | null>(null);
    const boundaryCheckingRef = useRef(false); // Use ref instead of state to avoid re-renders
    const prevStartTimeRef = useRef<number | undefined>(layer.startTime);
    const lastTimeRef = useRef<number>(0); // Track the last time for manual reverse playback
    const mediaType = getMediaType(layer.srcUrl);
    const updateLayer = useLayerStore(state => state.updateLayer);

    // Memoize the check boundaries function to avoid recreating it on each render
    const checkBoundaries = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        const startTime = layer.startTime ?? 0;
        const endTime = layer.endTime ?? videoDuration;

        // Save current time occasionally but not on every check
        if (Math.random() < 0.05) {
            updateLayer(layer.id, { currentTime: video.currentTime });
        }

        if (isReversed) {
            // Manual reverse playback
            if (video.paused && layer.playing) {
                // Calculate how much to move backward
                const currentTime = video.currentTime;
                const timeDelta = 1 / 30; // Simulate 30fps playback
                const newTime = Math.max(startTime, currentTime - timeDelta);

                // Only update if time would change
                if (newTime !== currentTime) {
                    video.currentTime = newTime;
                    lastTimeRef.current = newTime;
                }

                // If we reached the start boundary
                if (Math.abs(newTime - startTime) < 0.1) {
                    console.log(`Hit start boundary at ${newTime.toFixed(2)}s while in simulated reverse`);

                    if (layer.loopMode === 'forward-backward') {
                        console.log('Switching to forward playback');
                        setIsReversed(false);

                        // Move slightly forward to prevent immediate boundary hit
                        video.currentTime = startTime + 0.1;

                        // Resume normal playback
                        video.play().catch(e => console.error("Error playing video:", e));
                    } else {
                        // For normal looping, jump to the end
                        console.log(`Looping to end: ${endTime.toFixed(2)}s`);
                        video.currentTime = endTime - 0.1;
                    }
                }
            }
        } else {
            // Normal forward playback
            if (video.currentTime >= endTime - 0.1) {
                console.log(`Hit end boundary at ${video.currentTime.toFixed(2)}s while playing forward`);

                if (layer.loopMode === 'forward-backward') {
                    console.log('Switching to reverse playback (simulated)');
                    setIsReversed(true);

                    // For reverse, we'll pause the video and manually control time
                    video.pause();

                    // Ensure we're a little before the boundary
                    video.currentTime = endTime - 0.1;
                    lastTimeRef.current = video.currentTime;
                } else {
                    // For normal looping, jump to the start
                    console.log(`Looping to start: ${startTime.toFixed(2)}s`);
                    video.currentTime = startTime;
                }
            }
        }
    }, [layer.id, layer.startTime, layer.endTime, layer.loopMode, layer.playing, isReversed, videoDuration, updateLayer]);

    // Clear any existing interval when component unmounts
    useEffect(() => {
        return () => {
            if (boundaryCheckRef.current) {
                clearInterval(boundaryCheckRef.current);
                boundaryCheckRef.current = null;
            }
        };
    }, []);

    // Initialize video and get duration when metadata is loaded
    useEffect(() => {
        if (mediaType !== 'video' || !videoRef.current) return;

        const video = videoRef.current;

        const handleMetadataLoaded = () => {
            if (video.duration && !isNaN(video.duration)) {
                console.log(`Video metadata loaded. Duration: ${video.duration}s`);
                setVideoDuration(video.duration);

                // Initialize time position
                if (!initialTime) {
                    if (layer.currentTime !== undefined) {
                        video.currentTime = layer.currentTime;
                    } else if (layer.startTime !== undefined) {
                        video.currentTime = layer.startTime;
                    }
                    setInitialTime(true);
                    lastTimeRef.current = video.currentTime;

                    // If endTime is not set, initialize it to the video duration
                    if (layer.endTime === undefined) {
                        updateLayer(layer.id, { endTime: video.duration });
                    }
                }
            }
        };

        video.addEventListener('loadedmetadata', handleMetadataLoaded);

        // If metadata is already loaded, call the handler immediately
        if (video.readyState >= 1) {
            handleMetadataLoaded();
        }

        return () => {
            video.removeEventListener('loadedmetadata', handleMetadataLoaded);
        };
    }, [mediaType, layer.id, layer.startTime, layer.currentTime, layer.endTime, initialTime, updateLayer]);

    // Set up boundary checking interval - only run once when video is ready
    useEffect(() => {
        if (
            mediaType !== 'video' ||
            !videoRef.current ||
            !videoDuration ||
            boundaryCheckingRef.current ||
            boundaryCheckRef.current
        ) return;

        console.log(`Setting up boundary checking for layer ${layer.id}`);
        boundaryCheckingRef.current = true;

        // Check boundaries more frequently for better responsiveness
        // Use a faster interval for smoother reverse playback simulation
        boundaryCheckRef.current = setInterval(checkBoundaries, 30); // ~30fps

        return () => {
            if (boundaryCheckRef.current) {
                clearInterval(boundaryCheckRef.current);
                boundaryCheckRef.current = null;
            }
            boundaryCheckingRef.current = false;
        };
    }, [mediaType, videoDuration, layer.id, checkBoundaries]);

    // Handle play state changes
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (layer.playing) {
            console.log(`Playing video for layer ${layer.id}, isReversed: ${isReversed}`);

            if (isReversed) {
                // For reverse playback, we use manual frame updates
                // The video remains paused, but we'll update the time in the interval
                video.pause();
                lastTimeRef.current = video.currentTime;
            } else {
                // For forward playback, use the normal play method
                video.play().catch(e => {
                    console.error("Error playing video:", e);
                    // If there's an error playing, update the state
                    updateLayer(layer.id, { playing: false });
                });
            }
        } else {
            console.log(`Pausing video for layer ${layer.id}`);
            video.pause();
        }
    }, [layer.playing, isReversed, layer.id, updateLayer]);

    // Handle changes to loop mode or time range
    useEffect(() => {
        if (mediaType !== 'video' || !videoRef.current || !videoDuration) return;

        const video = videoRef.current;
        const startTime = layer.startTime ?? 0;
        const endTime = layer.endTime ?? videoDuration;

        console.log(`Loop settings updated for layer ${layer.id}: ${startTime}s - ${endTime}s, mode: ${layer.loopMode}`);

        // Check if start time has changed
        const startTimeChanged = prevStartTimeRef.current !== startTime;
        prevStartTimeRef.current = startTime;

        // If start time was changed or video is outside the range, jump to start time
        if (startTimeChanged || video.currentTime < startTime || video.currentTime > endTime) {
            console.log(`Repositioning video to start time ${startTime}s (was at ${video.currentTime.toFixed(2)}s)`);
            video.currentTime = startTime;
            lastTimeRef.current = startTime;

            // Reset playback direction to forward when jumping to start
            if (isReversed) {
                setIsReversed(false);

                // If it should be playing, restart normal playback
                if (layer.playing) {
                    video.play().catch(e => console.error("Error playing video:", e));
                }
            }
        }

    }, [layer.startTime, layer.endTime, layer.loopMode, mediaType, videoDuration, layer.id, isReversed, layer.playing]);

    // Explicitly handle the seeking event to prevent the browser from seeking outside our range
    useEffect(() => {
        if (mediaType !== 'video' || !videoRef.current) return;

        const video = videoRef.current;
        const startTime = layer.startTime ?? 0;
        const endTime = layer.endTime ?? videoDuration;

        const handleSeeking = () => {
            if (video.currentTime < startTime) {
                video.currentTime = startTime;
                lastTimeRef.current = startTime;
            } else if (video.currentTime > endTime) {
                video.currentTime = endTime;
                lastTimeRef.current = endTime;
            } else {
                lastTimeRef.current = video.currentTime;
            }
        };

        video.addEventListener('seeking', handleSeeking);

        return () => {
            video.removeEventListener('seeking', handleSeeking);
        };
    }, [layer.startTime, layer.endTime, mediaType, videoDuration]);

    const mediaStyle = {
        ...style,
        opacity: layer.visible ? 1 : 0
    };

    switch (mediaType) {
        case 'image':
        case 'gif':
            return <img src={layer.srcUrl} alt={layer.id} style={mediaStyle} />;
        case 'video':
            return (
                <video
                    ref={videoRef}
                    src={layer.srcUrl}
                    style={mediaStyle}
                    autoPlay={false}
                    loop={false}
                    muted
                    playsInline
                    onError={(e) => console.error("Video error:", e)}
                />
            );
        default:
            return null;
    }
};

export default Media; 