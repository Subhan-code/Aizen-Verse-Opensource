import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AnimeResult, Theme } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import { Loader } from 'lucide-react';

interface RecentlyUpdatedProps {
  theme?: Theme;
}

const RecentlyUpdated: React.FC<RecentlyUpdatedProps> = ({ theme = 'dark' }) => {
  const navigate = useNavigate();

  const [animeList, setAnimeList] = useState<AnimeResult[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchRecentlyUpdated = useCallback(
    async (pageNum: number, append = false) => {
      try {
        append ? setLoadingMore(true) : setLoading(true);

        // ✅ CORRECT API CALL
        const data = await api.getRecentlyAdded(pageNum);

        setAnimeList(prev =>
          append ? [...prev, ...data.results] : data.results
        );

        setHasMore(data.hasNextPage);
        setHasError(false);
      } catch (err) {
        console.error('Failed to fetch recently updated anime:', err);
        setHasError(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchRecentlyUpdated(1);
  }, [fetchRecentlyUpdated]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRecentlyUpdated(nextPage, true);
    }
  };

  const handleAnimeClick = (anime: AnimeResult) => {
    navigate(`/anime/${anime.id}`);
  };

  if (loading && animeList.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h1 className="font-dela text-3xl md:text-4xl">
          Recently Updated Episodes
        </h1>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
      </div>

      {/* Error */}
      {hasError && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200">
          Failed to load recently updated anime. Please try again later.
        </div>
      )}

      {/* Content */}
      {animeList.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {animeList.map(anime => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onClick={handleAnimeClick}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-80 transition-opacity uppercase tracking-wide text-sm flex items-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No recently updated anime found.
        </div>
      )}
    </div>
  );
};

export default RecentlyUpdated;
