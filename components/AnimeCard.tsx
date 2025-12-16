import React from 'react';
import { Link } from 'react-router-dom';
import { AnimeResult } from '../types';

interface AnimeCardProps {
  anime: AnimeResult;
  onClick?: (anime: AnimeResult) => void;
  rank?: number;
  trending?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick, rank, trending }) => {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation if onClick handler is provided
    if (onClick) {
      e.preventDefault();
      onClick(anime);
    }
  };

  return (
    <Link to={`/anime/${anime.id}`} className="block">
      <div 
        className={`group relative w-full cursor-pointer bento-card`}
        onClick={handleClick}
      >
        {/* Poster Container */}
        <div className="relative aspect-[3/4.2] overflow-hidden rounded-[2rem] mb-4 bg-gray-200 dark:bg-[#1c1c1c] shadow-lg group-hover:shadow-2xl group-hover:shadow-black/40 dark:group-hover:shadow-white/20 transition-all duration-500 ease-out group-hover:-translate-y-2">
          
          {/* Rank Number for Trending Strip */}
          {rank && (
            <div className="absolute -left-2 bottom-4 z-10 pointer-events-none">
               <span className="font-display font-bold text-[7rem] leading-none italic text-transparent text-stroke-mono drop-shadow-xl opacity-90">
                  {rank}
               </span>
            </div>
          )}

          {/* Image */}
          <img 
            src={anime.image} 
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
            loading="lazy"
          />

          {/*
  Floating Badges
  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 items-start opacity-100 transition-opacity duration-300">
    <span className="bg-black/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-black text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20 dark:border-black/20 group-hover:scale-105 transition-transform">
      <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black animate-pulse"></span>
      EP {anime.episodeNumber || 0}
    </span>
  </div>
*/}

{/*
  Rating Badge
  <div className="absolute top-3 right-3 z-10">
    <span className="bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg group-hover:rotate-12 transition-transform duration-300">
      {anime.rating || 'N/A'}
    </span>
  </div>
*/}


          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]">
             <div className="w-16 h-16 bg-white dark:bg-black rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 scale-50 group-hover:scale-100 transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) shadow-xl border-4 border-black dark:border-white">
                <svg className="w-6 h-6 ml-1 fill-black dark:fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
             </div>
          </div>
        </div>

        {/* Info */}
        <div className="px-1.5 sm:px-2">
          <h3 className="font-display font-bold text-black dark:text-white text-sm leading-tight mb-1.5 line-clamp-1 sm:text-lg sm:mb-2">
              <span className="bg-left-bottom bg-gradient-to-r from-black to-black dark:from-white dark:to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-200 ease-out pb-0.5 sm:bg-[length:0%_3px] sm:pb-1 sm:duration-300 sm:ease-out">
                  {anime.title}
              </span>
          </h3>
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide group-hover:text-black dark:group-hover:text-white transition-colors duration-200 sm:text-xs sm:duration-300">
              <span className="flex items-center gap-1">
                 {anime.type || 'TV'}
                 <span className="w-1 h-1 bg-gray-400 dark:bg-gray-600 group-hover:bg-black dark:group-hover:bg-white rounded-full transition-colors"></span>
                 {anime.episodes || anime.episodeNumber || 0} eps
              </span>
              <span className="border border-gray-300 dark:border-white/20 px-1.5 py-0.5 rounded text-black dark:text-white group-hover:border-black dark:group-hover:border-white transition-colors text-[9px] sm:text-xs sm:px-2">
                  {anime.status || 'Unknown'}
              </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;