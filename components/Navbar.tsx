import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ViewMode, Theme, UserProfile } from '../types';
import { ThemeTransition } from './ThemeTransition';
import { MobileSearchBar } from './MobileSearchBar';
import { MobileMenu } from './MobileMenu';
import { HamburgerIcon } from './HamburgerIcon';

interface HeaderProps {
  onSearch: (query: string) => void;
  setView: (mode: ViewMode) => void;
  theme: Theme;
  toggleTheme: () => void;
  user?: UserProfile;
  isGlass?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, setView, theme, toggleTheme, user, isGlass = false }) => {
  const [query, setQuery] = useState('');
  const [showTransition, setShowTransition] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    setShowTransition(true);
  };

  const handleTransitionMidpoint = () => {
    toggleTheme();
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      navigate(`/search/${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <>
      {showTransition && (
        <ThemeTransition 
          theme={theme} 
          onMidpoint={handleTransitionMidpoint} 
          onComplete={handleTransitionComplete} 
        />
      )}
      
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        setActiveItem={() => {}}
        activeItem=""
        theme={theme}
      />
      
      <header className={`sticky top-4 z-40 flex items-center justify-between py-3 px-4 transition-all duration-300 rounded-2xl shadow-xl mx-2 md:mx-8 md:py-4 md:px-6 ${isGlass ? (theme === 'light' ? 'bg-white border border-gray-200' : 'glass backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20') : 'bg-white dark:bg-black border border-gray-200 dark:border-gray-800'} ${theme === 'light' ? 'text-black' : 'text-white'}`} style={{ backgroundColor: theme === 'light' ? '#FFFFFF' : undefined, color: theme === 'light' ? '#000000' : undefined }}>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-black dark:text-white"
        >
          <HamburgerIcon className="w-6 h-6" />
        </button>
        
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-dela text-lg font-bold bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded-lg md:text-xl">
              AV
            </span>
            <span className="font-dela text-base hidden sm:block md:text-lg">
              Aizen Verse
            </span>
          </Link>
        </div>

        {/* Search - High Contrast */}
        <div className="flex-1 max-w-xl relative mx-4 md:mx-8">
          {/* Mobile Search Bar */}
          <div className="md:hidden flex justify-end">
            <MobileSearchBar onSearch={onSearch} />
          </div>
          
          {/* Desktop Search */}
          <form 
            onSubmit={handleSubmit} 
            className="hidden md:block relative flex items-center"
            onMouseEnter={() => setIsSearchFocused(true)}
            onMouseLeave={() => setIsSearchFocused(false)}
          >
            <div className="relative group w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anime..."
                className="w-full bg-gray-100 dark:bg-[#1c1c1c] border-2 border-transparent group-hover:border-black/30 dark:group-hover:border-white/30 text-black dark:text-white pl-6 pr-14 py-3 rounded-full focus:outline-none focus:border-black dark:focus:border-white focus:ring-0 transition-all placeholder-gray-400 text-sm font-medium tracking-wide shadow-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-105 transition-transform shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            {/* Expanded Search Panel on Hover */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 z-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-dela text-lg mb-3 text-black dark:text-white">Quick Search Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li>• Search by title, e.g. "Demon Slayer"</li>
                      <li>• Search by genre, e.g. "Action"</li>
                      <li>• Search by year, e.g. "2023"</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-dela text-lg mb-3 text-black dark:text-white">Popular This Week</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li>• Jujutsu Kaisen</li>
                      <li>• Attack on Titan</li>
                      <li>• Demon Slayer</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          
          {/* Theme Toggle */}
          <button 
            onClick={handleThemeToggle}
            className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-md"
          >
            {theme === 'light' ? (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
             <div 
               onClick={() => navigate('/profile')}
               className="w-12 h-12 rounded-full p-[3px] bg-black dark:bg-white cursor-pointer hover:scale-110 transition-transform shadow-lg"
             >
               <div className="w-full h-full rounded-full bg-white dark:bg-black overflow-hidden border-2 border-white dark:border-black">
                 <img src={user?.avatar || "https://picsum.photos/100/100?random=user"} alt="User" className="w-full h-full object-cover hover:opacity-80 transition-all" />
               </div>
             </div>
          </div>
        </div>
      </header>
    </>
  );
};
