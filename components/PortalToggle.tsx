import React, { useEffect, useState } from 'react';
import { Theme } from '../types';

interface ThemeTransitionProps {
  theme: Theme;
  onMidpoint: () => void;
  onComplete: () => void;
}

export const ThemeTransition: React.FC<ThemeTransitionProps> = ({ theme, onMidpoint, onComplete }) => {
  const [stage, setStage] = useState<'idle' | 'zooming'>('idle');

  useEffect(() => {
    // Phase 1: Show GIF for about 1 second (buildup)
    const zoomTimer = setTimeout(() => {
      setStage('zooming');
      onMidpoint(); // Switch theme right as zoom starts
    }, 1000);

    // Phase 2: Complete and unmount after zoom finishes
    // Zoom takes about 800ms
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(completeTimer);
    };
  }, []); // Empty dependency array ensures this runs strictly once on mount

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none overflow-hidden">
      {/* 
        Container 
        - Transparent background (so we see the theme change behind)
        - Scales up massively
        - Fades out only at the very end of the transition
      */}
      <div 
        className={`relative flex items-center justify-center transition-all duration-[800ms] ease-in-expo will-change-transform ${
          stage === 'zooming' 
            ? 'scale-[50] opacity-0' 
            : 'scale-100 opacity-100'
        }`}
      >
        {/* GIF Holder - No circle, no border, larger size */}
        <div className="w-96 h-96 md:w-[32rem] md:h-[32rem] flex items-center justify-center">
             <img 
                src="https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif" 
                alt="Transition"
                className={`w-full h-full object-contain filter grayscale contrast-125 transition-[filter] duration-300 ${theme === 'light' ? 'invert' : ''}`}
             />
        </div>
      </div>
    </div>
  );
};