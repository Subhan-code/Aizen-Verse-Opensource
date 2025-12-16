import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Loader, ChevronLeft } from 'lucide-react';
import { AnimeResult } from '../types';
import AnimeCard from '../components/AnimeCard';

interface RecentlyAddedEpisodesProps {
  theme: 'light' | 'dark';
}

export const RecentlyAddedEpisodes: React.FC<RecentlyAddedEpisodesProps> = ({ theme }) => {
  const [recentEpisodes, setRecentEpisodes] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentEpisodes = async () => {
      try {
        setLoading(true);
        // Using the dedicated endpoint for recent episodes
        const response = await api.getRecentlyAdded(page);
        
        if (response.results && response.results.length > 0) {
          setRecentEpisodes(prev => page === 1 ? response.results : [...prev, ...response.results]);
          setHasMore(response.hasNextPage);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching recent episodes:', error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEpisodes();
  }, [page]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-black dark:text-white" />
        </button>
        <h1 className="text-2xl font-dela font-bold text-black dark:text-white">
          Recently Added Episodes
        </h1>
      </div>

      {loading && page === 1 ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recentEpisodes.map((anime) => (
              <AnimeCard 
                key={anime.id} 
                anime={anime} 
                onClick={() => navigate(`/anime/${anime.id}`)} 
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}

          {!hasMore && recentEpisodes.length > 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              You've reached the end of the list
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecentlyAddedEpisodes;