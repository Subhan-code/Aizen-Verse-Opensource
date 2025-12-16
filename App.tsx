import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Search from './pages/Search';
import MostPopular from './pages/MostPopular';
import TopAiring from './pages/TopAiring';
import MostFavorite from './pages/MostFavorite';
import Movies from './pages/Movies';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import AnimeDetails from './pages/AnimeDetails';
import Watch from './pages/Watch';
import RecentlyAddedEpisodes from './pages/RecentlyAddedEpisodes';
import Intro from './components/IntroSequence';
import { Github } from 'lucide-react';
import { ViewMode, UserProfile } from './types';

// Fallback data for when API fails
const FALLBACK_DATA = {
  trending: [
    {
      id: "jujutsu-kaisen",
      title: "Jujutsu Kaisen",
      image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
      releaseDate: "2020",
      rating: 8.7
    },
    {
      id: "solo-leveling",
      title: "Solo Leveling",
      image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
      releaseDate: "2024",
      rating: 8.9
    },
    {
      id: "chainsaw-man",
      title: "Chainsaw Man",
      image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
      releaseDate: "2022",
      rating: 8.5
    }
  ],
  popular: [
    {
      id: "demon-slayer",
      title: "Demon Slayer",
      image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
      releaseDate: "2019",
      rating: 8.6
    },
    {
      id: "attack-on-titan",
      title: "Attack on Titan",
      image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
      releaseDate: "2013",
      rating: 9.0
    }
  ]
};

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [user, setUser] = useState<UserProfile | undefined>(undefined);
  const [isWatchSidebarOpen, setIsWatchSidebarOpen] = useState(false); // State for watch page sidebar
  const [isNavbarGlass, setIsNavbarGlass] = useState(false); // State for navbar glass effect

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme as 'dark' | 'light');
    } else {
      // Default to dark theme
      setTheme('dark');
    }
    
    // Apply theme to document
    if (theme === 'light') {
      document.body.classList.remove('dark');
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark');
    }
    
    // Initialize user profile (in a real app, this would come from an API)
    setUser({
      id: 'user123',
      name: 'Anime Fan',
      email: 'anime@example.com',
      avatar: 'https://picsum.photos/100/100?random=user'
    });
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSearch = (query: string) => {
    // In a real app, this would trigger a search
    console.log('Searching for:', query);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <HashRouter>
      {showIntro && theme !== 'light' && <Intro onComplete={handleIntroComplete} />}
      <div className={`min-h-screen flex flex-col font-outfit ${theme === 'light' ? 'light-mode' : 'dark'}`}>
        <Sidebar theme={theme} />
        <Header 
          onSearch={handleSearch} 
          setView={setViewMode} 
          theme={theme} 
          toggleTheme={toggleTheme} 
          user={user} 
        />
        <main className="flex-grow w-full px-4 py-6 md:px-6 -mt-10">
          <div className={`p-4 md:rounded-tl-huge md:rounded-tr-huge md:p-8 md:ml-[4%] md:mr-[2%] ${
            theme === 'light' 
              ? 'bg-light-surface' 
              : 'bg-dark-surface'
          }`}>
            <Routes>
              <Route path="/" element={<Home fallbackData={FALLBACK_DATA} theme={theme} />} />
              <Route path="/most-popular" element={<MostPopular theme={theme} />} />
              <Route path="/top-airing" element={<TopAiring theme={theme} />} />
              <Route path="/most-favorite" element={<MostFavorite theme={theme} />} />
              <Route path="/movies" element={<Movies theme={theme} />} />
              <Route path="/profile" element={<Profile theme={theme} />} />
              <Route path="/favorites" element={<Favorites theme={theme} />} />
              <Route path="/search/:query" element={<Search />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/watch/:episodeId" element={<Watch theme={theme} setIsNavbarGlass={setIsNavbarGlass} />} />
              <Route path="/recently-added" element={<RecentlyAddedEpisodes theme={theme} />} />
            </Routes>
          </div>
        </main>
        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright - Left */}
              <p
  className={`text-base font-bold ${
    theme === 'light' ? '!text-black' : 'text-dark-text'
  }`}
>
  © {new Date().getFullYear()} Aizen Verse
</p>

{/* Developer Credit - Center */}
<p
  className={`text-base font-bold ${
    theme === 'light' ? '!text-black' : 'text-dark-text'
  }`}
>
  Developed by Syed Subhan
</p>

              
              {/* Social Links - Right */}
              <div className="flex gap-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full ${theme === 'light' ? 'bg-light-surface text-light-text hover:bg-gray-200' : 'bg-dark-surface text-dark-text hover:bg-gray-700'} transition-colors`}
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" style={{ color: theme === 'light' ? '#000000' : undefined }} />
                </a>
                <a 
  href="https://x.com/SubhanHQ" 
  target="_blank" 
  rel="noopener noreferrer"
  className={`p-2 rounded-full ${theme === 'light' ? 'bg-light-surface text-light-text hover:bg-gray-200' : 'bg-dark-surface text-dark-text hover:bg-gray-700'} transition-colors`}
  aria-label="X (Twitter)"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    imageRendering="optimizeQuality"
    fillRule="evenodd"
    clipRule="evenodd"
    viewBox="0 0 512 462.799"
    className="w-5 h-5"
    style={{ color: theme === 'light' ? '#000000' : undefined }}   // ← HERE
  >
    <path
      fillRule="nonzero"
      d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
      className="fill-current"
    />
  </svg>
</a>

              </div>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;