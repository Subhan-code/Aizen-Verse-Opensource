import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface MobileSearchBarProps {
  onSearch: (query: string) => void;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({ onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      navigate(`/search/${encodeURIComponent(query)}`);
      setQuery('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="md:hidden">
      {isExpanded ? (
        <>
          {/* Overlay to close search when clicking outside */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsExpanded(false)}
          />
          {/* Expanded search bar below navbar */}
          <div className="fixed top-20 left-0 right-0 z-50 bg-white dark:bg-[#121212] p-4 shadow-lg">
            <form onSubmit={handleSubmit} className="flex items-center">
              <button 
                type="button"
                onClick={() => setIsExpanded(false)}
                className="mr-2 w-10 h-10 flex items-center justify-center text-black dark:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anime..."
                className="flex-1 bg-gray-100 dark:bg-[#1c1c1c] border-2 border-transparent text-black dark:text-white px-4 py-2 rounded-full focus:outline-none focus:border-black dark:focus:border-white focus:ring-0 transition-all placeholder-gray-400 text-sm font-medium"
              />
              <button 
                type="submit"
                className="ml-2 w-8 h-8 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </>
      ) : (
        <button 
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-8 h-8 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      )}
    </div>
  );
};