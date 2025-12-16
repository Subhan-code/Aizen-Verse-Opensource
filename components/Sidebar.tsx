import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Heart, User, Film, Star, Activity, Award, Play } from 'lucide-react';

interface SidebarProps {
  theme?: 'dark' | 'light';
  isVisible?: boolean; // Control visibility for watch page
}

const Sidebar: React.FC<SidebarProps> = ({ theme = 'dark', isVisible = true }) => {
  const [activeItem, setActiveItem] = useState('home');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'popular', icon: Star, label: 'Most Popular', path: '/most-popular' },
    { id: 'airing', icon: Activity, label: 'Top Airing', path: '/top-airing' },
    { id: 'favorite', icon: Award, label: 'Most Favorite', path: '/most-favorite' },
    { id: 'movies', icon: Film, label: 'Movies', path: '/movies' },
    { id: 'recently-added', icon: Play, label: 'Recently Added', path: '/recently-added' },
    { id: 'favorites', icon: Heart, label: 'Favorites', path: '/favorites' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    isVisible ? (
      <div className="hidden md:block fixed left-3 top-1/2 transform -translate-y-1/2 z-30 md:left-4.5">
        <div className="md:hidden absolute -left-2 top-0 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-r-lg rotate-90 origin-bottom-left -translate-y-full">
          MENU
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xxl p-1.5 flex flex-col items-center gap-2.5 shadow-xl border border-white/20 md:p-2 md:gap-3 md:shadow-2xl">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`relative flex items-center justify-center p-2 rounded-full transition-all duration-300 md:p-2.5 ${
                  isActive 
                    ? 'bg-white text-black scale-110 shadow-lg' 
                    : isHovered 
                      ? 'bg-white text-black scale-110 shadow-md' 
                      : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveItem(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                
                {/* Tooltip - hidden on mobile */}
                {isHovered && (
                  <div className={`absolute left-full ml-4 px-3 py-2 text-sm rounded-full whitespace-nowrap z-50 hidden md:block ${theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    ) : null
  );
};

export default Sidebar;