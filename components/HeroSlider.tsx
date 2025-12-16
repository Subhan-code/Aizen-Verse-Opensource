import React, { useState, useEffect, useRef } from 'react';
import { AnimeResult } from '../types';
import { Play, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface HeroSliderProps {
  animeList: AnimeResult[];
  onPlay: (anime: AnimeResult) => void;
  onViewAll: () => void;
  onAddToList: (anime: AnimeResult) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ animeList, onPlay, onViewAll, onAddToList }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Use top 5 for carousel, next 3 for side list
  const carouselItems = animeList.slice(0, 5);
  const sideList = animeList.slice(5, 8);

  useEffect(() => {
    if (carouselItems.length === 0) return;
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [carouselItems.length, isDragging]);

  if (animeList.length === 0) return null;

  const featured = carouselItems[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  // Touch handlers for mobile drag
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    if (carouselRef.current) {
      setTranslateX(carouselRef.current.getBoundingClientRect().left);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const endX = e.changedTouches[0].clientX;
    const deltaX = startX - endX;
    
    // Swipe threshold
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-8 md:mb-10">
      {/* Main Feature Carousel */}
      <div 
        className="lg:col-span-8 xl:col-span-9 relative h-[400px] sm:h-[500px] md:h-[600px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-black/20 dark:shadow-white/5 border border-black/5 dark:border-white/10 bg-black"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Carousel Items */}
        <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
          <div 
            key={featured.id}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0 animate-fade-in"
            style={{ backgroundImage: `url(${featured.bannerUrl || featured.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md flex items-center justify-center transition-all z-20 opacity-0 group-hover:opacity-100 dark:hover:bg-gray-200 dark:hover:text-gray-800"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md flex items-center justify-center transition-all z-20 opacity-0 group-hover:opacity-100 dark:hover:bg-gray-200 dark:hover:text-gray-800"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-10 pointer-events-none">
          <div className="max-w-4xl pointer-events-auto hero-slider-content">
            <div className="flex items-center gap-3 mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest hero-badge">
                Spotlight #{currentIndex + 1}
              </span>
              <span className="bg-black/50 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase hero-badge">
                {featured.status || 'ONGOING'}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-dela font-bold text-white mb-2 leading-none tracking-tight text-shadow-lg drop-shadow-2xl animate-fade-in-up hero-title" style={{ animationDelay: '0.2s' }}>
              {featured.title}
            </h1>

            <p className="text-gray-300 text-lg line-clamp-2 mb-4 max-w-2xl font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 shadow-black drop-shadow-md hero-description">
              {featured.description || ""}
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button 
                onClick={() => onPlay(featured)}
                className="bg-white text-black px-10 py-4 rounded-full font-black text-lg hover:bg-black hover:text-white transition-colors flex items-center gap-3 shadow-lg dark:bg-gray-200 dark:hover:bg-black dark:hover:text-white"
              >
                <Play className="w-6 h-6 fill-current" />
                WATCH NOW
              </button>
              <button 
                onClick={() => onAddToList(featured)}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all dark:hover:bg-gray-200 dark:hover:text-gray-800 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                LIST
              </button>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 right-8 flex gap-2 z-20">
          {carouselItems.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-8 dark:bg-gray-200' : 'bg-white/30 hover:bg-white/60 dark:bg-gray-400/50 dark:hover:bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      {/* Right Side Stack - Minimalist */}
      <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 md:gap-6 h-[400px] sm:h-[500px] md:h-[600px]">
        <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-[2rem] shadow-xl border border-gray-100 dark:border-white/5 flex-1 flex flex-col">
          <h3 className="font-dela font-bold text-lg md:text-xl text-black dark:text-white mb-4 md:mb-6 flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
            <span>TRENDING</span>
            <span className="text-black dark:text-white text-xs bg-gray-200 dark:bg-white/10 px-2 py-1 rounded">Top Picks</span>
          </h3>
          
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
            {sideList.map((anime, idx) => (
              <div 
                key={anime.id} 
                onClick={() => onPlay(anime)}
                className="group flex gap-4 p-3 rounded-2xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer transition-colors trending-card"
              >
                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden relative shadow-sm sm:shadow-md grayscale group-hover:grayscale-0 transition-all shrink-0">
                  <img src={anime.image} className="w-full h-full object-cover" alt={anime.title} />
                  <div className="absolute top-1 left-1 bg-white text-black text-[8px] font-bold w-5 h-5 flex items-center justify-center rounded sm:text-[10px] sm:w-6 sm:h-6 sm:rounded-md sm:border sm:border-black sm:shadow-sm dark:bg-gray-200 dark:text-gray-800 dark:border-gray-300">
                    0{idx + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="font-bold text-base leading-tight mb-1 truncate text-black dark:text-white group-hover:text-white dark:group-hover:text-black sm:text-lg">
                    {anime.title}
                  </h4>
                  <div className="text-[10px] opacity-60 mb-1.5 flex items-center gap-1.5 font-medium text-black dark:text-white group-hover:text-white dark:group-hover:text-black sm:text-xs sm:mb-2 sm:gap-2">
                    <span>{anime.type || 'TV'}</span>
                    <span className="w-1 h-1 bg-current rounded-full"></span>
                    <span>{anime.episodes || anime.episodeNumber || 0} eps</span>
                  </div>
                  <div className="flex gap-1">
                    {anime.genres?.slice(0,2).map((g: string) => (
                      <span key={g} className="text-[8px] border border-current px-1.5 py-0.5 rounded uppercase tracking-wider font-bold text-black dark:text-white group-hover:text-white dark:group-hover:text-black sm:text-[10px] sm:px-2 sm:py-0.5">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => {
              // Stop propagation to prevent carousel navigation
              onViewAll();
            }}
            className="w-full mt-3 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-80 transition-opacity uppercase tracking-wide dark:hover:bg-gray-200 dark:hover:text-gray-800 sm:mt-4 sm:py-3 sm:text-sm"
          >
            View All Top Airing
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;