import React, { useEffect, useRef } from 'react';
import { LFOConfig } from '../types/lfo.types';
import { calculateLFOValue } from '../utils/lfoUtils';

interface LFOVisualizerProps {
  lfoConfig: LFOConfig;
  className?: string;
}

export const LFOVisualizer: React.FC<LFOVisualizerProps> = ({ lfoConfig }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!lfoConfig.enabled) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000; // Convert to seconds

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw waveform
      ctx.strokeStyle = 'white'; // Blue color
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Draw the waveform across the canvas width
      for (let x = 0; x < width; x++) {
        // Normalize x to 0-1 for phase calculation
        const phaseProgress = x / width;

        // Calculate the LFO value at this phase, offset by current time
        const timeForPhase = elapsed + phaseProgress / (lfoConfig.frequency || 1);
        const lfoValue = calculateLFOValue(timeForPhase, lfoConfig);

        // Map the raw LFO value (-1 to 1) to canvas coordinates
        const y = centerY - lfoValue.raw * (height * 0.4); // Use 40% of height for amplitude

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [lfoConfig]);

  if (!lfoConfig.enabled) {
    return null;
  }

  return <canvas ref={canvasRef} width={20} height={15} />;
};
