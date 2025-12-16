import React, { useEffect, useState } from 'react';

interface IntroProps {
  onComplete: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
             setIsExiting(true);
             setTimeout(onComplete, 800); // Wait for shutter animation
          }, 500);
          return 100;
        }
        // Random increments for realistic feel
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none`}>
      
      {/* Top Shutter */}
      <div className={`absolute top-0 left-0 w-full h-1/2 bg-black z-20 transition-transform ${isExiting ? 'shutter-up-anim' : ''}`}></div>
      
      {/* Bottom Shutter */}
      <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-black z-20 transition-transform ${isExiting ? 'shutter-down-anim' : ''}`}></div>

      {/* Content Container (Behind Shutters) */}
      <div className={`relative z-30 flex flex-col items-center justify-center transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
        
        <h1 className="text-[2.85rem] md:text-8xl font-display font-black text-white tracking-[0.25em] relative inline-block uppercase">
  Aizen_Verse

  <span
    className="absolute top-0 left-0 w-full h-full text-white opacity-50 animate-glitch tracking-[0.25em]"
    style={{ clipPath: 'inset(10% 0 60% 0)', transform: 'translate(-2px, 0)' }}
  >
    Aizen_Verse
  </span>

  <span
    className="absolute top-0 left-0 w-full h-full text-white opacity-50 animate-glitch tracking-[0.05em]"
    style={{ clipPath: 'inset(70% 0 10% 0)', transform: 'translate(2px, 0)', animationDelay: '0.1s' }}
  >
    Aizen_Verse
  </span>
</h1>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mt-8 relative">
           <div 
              className="h-full bg-white transition-all duration-200 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
           />
        </div>

        {/* Japanese Text Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[2px] bg-white/10 rotate-45 pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 text-white/30 font-display text-[2.1375rem] hidden md:block select-none">
           アニメ
        </div>
        <div className="absolute top-10 right-10 text-white/30 font-display text-[2.1375rem] hidden md:block select-none">
           起動
        </div>

        <div className="mt-6 font-mono text-[0.7125rem] text-gray-500 flex flex-col items-center gap-2">
           <span>INITIALIZING RESOURCES... {Math.min(progress, 100)}%</span>
           <span className="text-white/60 tracking-widest uppercase text-[9.5px] mt-2 border-t border-white/10 pt-2">created by Syed Subhan</span>
        </div>

      </div>
    </div>
  );
};