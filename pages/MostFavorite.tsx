import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AnimeResult, Theme } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import { Loader } from 'lucide-react';

interface MostFavoriteProps {
  theme?: Theme;
}

const MostFavorite: React.FC<MostFavoriteProps> = ({ theme = 'dark' }) => {
  const navigate = useNavigate();
  const [mostFavoriteAnime, setMostFavoriteAnime] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const favoriteData = await api.getMostFavorite(1);
        setMostFavoriteAnime(favoriteData.results);
        setHasError(false);
      } catch (error) {
        console.error("Failed to fetch most favorite data", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAnimeClick = (anime: AnimeResult) => {
    navigate(`/anime/${anime.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="font-dela text-3xl md:text-4xl">Most Favorite</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
      </div>

      {hasError && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200">
          <p>Failed to load most favorite anime. Please try again later.</p>
        </div>
      )}

      {mostFavoriteAnime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {mostFavoriteAnime.map((anime, index) => (
            <AnimeCard 
              key={anime.id} 
              anime={anime} 
              onClick={handleAnimeClick} 
              rank={index + 1} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No favorite anime found.</p>
        </div>
      )}
    </div>
  );
};

export default MostFavorite;