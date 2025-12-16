import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { AnimeResult } from '../types';
import AnimeCard from '../components/AnimeCard';
import FilterBar from '../components/FilterBar';
import { Loader, SearchX } from 'lucide-react';

const Search: React.FC = () => {
  const { query } = useParams<{ query: string }>();
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  // Mock filters - in a real app, these would come from the API or be dynamic
  const filters = ['All', 'TV', 'Movie', 'OVA', 'Special'];

  useEffect(() => {
    if (query) {
      setLoading(true);
      api.searchAnime(query)
        .then((data) => {
          setResults(data.results);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <div className="min-h-screen">
      <h2 className="font-dela text-2xl text-white mb-6">
        Search Results for <span className="text-white">"{query}"</span>
      </h2>

      {/* Filter Bar */}
      <div className="mb-6">
        <FilterBar 
          filters={filters} 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
           <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {results.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <SearchX className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-outfit">No results found.</p>
        </div>
      )}
    </div>
  );
};

export default Search;