import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AnimeResult, Theme } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import HeroSlider from '../components/HeroSlider';
import { Loader } from 'lucide-react';

interface HomeProps {
  fallbackData?: {
    trending: AnimeResult[];
    popular: AnimeResult[];
  };
  theme?: Theme;
}

const Home: React.FC<HomeProps> = ({ fallbackData, theme = 'dark' }) => {
  const navigate = useNavigate();
  const [recentAnime, setRecentAnime] = useState<AnimeResult[]>([]);
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeResult[]>([]);
  const [movies, setMovies] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredAnime, setFeaturedAnime] = useState<AnimeResult | null>(null);
  const [hasError, setHasError] = useState(false);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentData, movieData, airingData] = await Promise.all([
          api.getRecentlyAdded(1),
          api.getMovies(1),
          api.getTopAiring(1)
        ]);
        
        setRecentAnime(recentData.results);
        setMovies(movieData.results);
        setTopAiringAnime(airingData.results);
        
        // Set the first recent anime as featured
        if (recentData.results.length > 0) {
          setFeaturedAnime(recentData.results[0]);
        }
        
        setHasError(false);
      } catch (error) {
        console.error("Failed to fetch home data", error);
        setHasError(true);
        
        // Use fallback data if API fails
        if (fallbackData) {
          setTopAiringAnime(fallbackData.trending);
          setRecentAnime(fallbackData.popular);
          setMovies(fallbackData.popular);
          
          // Set first trending as featured
          if (fallbackData.trending.length > 0) {
            setFeaturedAnime(fallbackData.trending[0]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      setWatchlist(new Set(JSON.parse(savedWatchlist)));
    }
  }, [fallbackData]);

  const handleAnimeClick = (anime: AnimeResult) => {
    navigate(`/anime/${anime.id}`);
  };

  const handlePlay = async (anime: AnimeResult) => {
    try {
      // Fetch detailed anime info to get episodes
      const animeInfo = await api.getAnimeInfo(anime.id);
      
      // Navigate to the first episode if available
      if (animeInfo.episodes && animeInfo.episodes.length > 0) {
        navigate(`/watch/${animeInfo.episodes[0].id}`);
      } else {
        // Fallback to anime details page if no episodes
        navigate(`/anime/${anime.id}`);
      }
    } catch (error) {
      console.error("Failed to fetch anime info for playback", error);
      // Fallback to anime details page
      navigate(`/anime/${anime.id}`);
    }
  };

  const handleAddToList = (anime: AnimeResult) => {
    setWatchlist(prev => {
      const newWatchlist = new Set(prev);
      if (newWatchlist.has(anime.id)) {
        newWatchlist.delete(anime.id);
      } else {
        newWatchlist.add(anime.id);
      }
      // Save to localStorage
      localStorage.setItem('watchlist', JSON.stringify(Array.from(newWatchlist)));
      return newWatchlist;
    });
    
    // Show a notification or alert
    alert(`${anime.title} ${watchlist.has(anime.id) ? 'removed from' : 'added to'} your watchlist!`);
  };

  const handleViewAll = () => {
    // Navigate to the Top Airing page
    navigate('/top-airing');
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  // Combine all anime data for the HeroSlider
  const allAnime = [...(featuredAnime ? [featuredAnime] : []), ...topAiringAnime, ...recentAnime].slice(0, 8);

  // Mobile/Tablet UI Implementation
  const renderMobileTabletUI = () => (
    <div className="space-y-8 md:hidden">
      {/* Hero Featured Section - Simplified for mobile */}
      {featuredAnime && (
        <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
          <img 
            src={featuredAnime.bannerUrl || featuredAnime.image} 
            alt={featuredAnime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-white font-bold text-xl mb-2">{featuredAnime.title}</h2>
            <div className="flex gap-2 mb-3">
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                {featuredAnime.status || 'ONGOING'}
              </span>
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                {featuredAnime.type || 'TV'}
              </span>
            </div>
            <button 
              onClick={() => handlePlay(featuredAnime)}
              className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Watch Now
            </button>
          </div>
        </div>
      )}

      {/* Continue Watching Section */}
      <section className="bg-white/10 dark:bg-black/20 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-dela text-xl text-black dark:text-white">Continue Watching</h2>
          <button className="text-blue-500 text-sm font-bold">See All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[...recentAnime, ...topAiringAnime].slice(0, 5).map((anime) => (
            <div key={anime.id} className="flex-shrink-0 w-32" onClick={() => handleAnimeClick(anime)}>
              <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
                <img 
                  src={anime.image} 
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <p className="text-white text-xs font-bold truncate">{anime.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Updated Section */}
      <section className="bg-white/10 dark:bg-black/20 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-dela text-xl text-black dark:text-white">Recently Updated</h2>
          <button 
            onClick={() => navigate('/recently-added')}
            className="text-blue-500 text-sm font-bold"
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {recentAnime.slice(0, 6).map((anime) => (
            <div key={anime.id} className="rounded-xl overflow-hidden" onClick={() => handleAnimeClick(anime)}>
              <div className="relative aspect-[2/3]">
                <img 
                  src={anime.image} 
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 bg-black/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                  EP {anime.episodeNumber || 0}
                </div>
              </div>
              <p className="text-black dark:text-white text-xs font-bold mt-1 truncate">{anime.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Airing Section */}
      <section className="bg-white/10 dark:bg-black/20 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-dela text-xl text-black dark:text-white">Top Airing</h2>
          <button 
            onClick={() => navigate('/top-airing')}
            className="text-blue-500 text-sm font-bold"
          >
            See All
          </button>
        </div>
        <div className="space-y-3">
          {topAiringAnime.slice(0, 5).map((anime, index) => (
            <div 
              key={anime.id} 
              className="flex items-center gap-3 p-2 rounded-xl bg-white/5 dark:bg-black/30 hover:bg-white/10 dark:hover:bg-black/40 transition-colors"
              onClick={() => handleAnimeClick(anime)}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-lg overflow-hidden">
                  <img 
                    src={anime.image} 
                    alt={anime.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -left-1 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-black dark:text-white font-bold text-sm truncate">{anime.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{anime.genres?.slice(0, 2).join(', ') || 'Anime'}</p>
              </div>
              <div className="bg-white/20 dark:bg-black/30 text-black dark:text-white text-xs font-bold px-2 py-1 rounded-full">
                {anime.rating || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Movies Section */}
      <section className="bg-white/10 dark:bg-black/20 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-dela text-xl text-black dark:text-white">Movies</h2>
          <button 
            onClick={() => navigate('/movies')}
            className="text-blue-500 text-sm font-bold"
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {movies.slice(0, 6).map((anime) => (
            <div key={anime.id} className="rounded-xl overflow-hidden" onClick={() => handleAnimeClick(anime)}>
              <div className="relative aspect-[2/3]">
                <img 
                  src={anime.image} 
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-black dark:text-white text-xs font-bold mt-1 truncate">{anime.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  // Desktop UI (unchanged)
  const renderDesktopUI = () => (
    <div className="hidden md:block space-y-12">
      {/* Hero Slider Component */}
      {allAnime.length > 0 && (
        <HeroSlider 
          animeList={allAnime} 
          onPlay={handlePlay} 
          onAddToList={handleAddToList}
          onViewAll={handleViewAll} 
        />
      )}

      {/* Recently Updated Section */}
      <section className={`glass rounded-2xl p-6`}>
        <div className="flex items-center gap-2 mb-6 pl-4 border-l-4 border-black dark:border-white">
          <div className="w-3 h-6 bg-black dark:bg-white"></div>
          <h2 className="font-dela text-2xl">Recently Updated</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {recentAnime.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} onClick={handleAnimeClick} />
          ))}
        </div>
        
        {hasError && (
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg text-yellow-200">
            <p>Using fallback data due to API connectivity issues.</p>
          </div>
        )}
      </section>

      {/* Top Airing Section */}
      <section className={`glass rounded-2xl p-6`}>
        <div className="flex items-center gap-2 mb-6 pl-4 border-l-4 border-black dark:border-white">
          <div className="w-3 h-6 bg-black dark:bg-white"></div>
          <h2 className="font-dela text-2xl">Top Airing</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {topAiringAnime.map((anime, index) => (
            <AnimeCard key={anime.id} anime={anime} onClick={handleAnimeClick} rank={index + 1} trending={true} />
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <>
      {renderMobileTabletUI()}
      {renderDesktopUI()}
    </>
  );
};

export default Home;