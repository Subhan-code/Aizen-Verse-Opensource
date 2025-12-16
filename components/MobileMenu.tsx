import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Star, Activity, Award, Film, Heart, User, Play } from 'lucide-react';
import { CustomXIcon } from './CustomXIcon';
import { ViewMode } from '../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveItem: (id: string) => void;
  activeItem: string;
  theme?: 'dark' | 'light';
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, setActiveItem, activeItem, theme = 'dark' }) => {
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
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed top-0 left-0 h-full w-64 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${theme === 'light' ? 'bg-white text-black' : 'bg-[#1c1c1c] text-white'}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${theme === 'light' ? 'border-gray-200 text-black' : 'border-gray-700 text-white'}`}>
          <h2 className="font-dela text-xl">Menu</h2>
          <button 
            onClick={onClose}
            className={`w-10 h-10 flex items-center justify-center ${theme === 'light' ? 'text-black' : 'text-white'}`}
          >
            <CustomXIcon className={`w-6 h-6 ${theme === 'light' ? 'text-black' : 'text-white'}`} />
          </button>
        </div>
        
        {/* Menu Items */}
        <div className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${
                    isActive 
                      ? (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
                      : (theme === 'light' 
                          ? 'text-gray-700 hover:bg-gray-100' 
                          : 'text-gray-300 hover:bg-gray-800')
                  }`}
                  onClick={() => {
                    setActiveItem(item.id);
                    onClose();
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-base">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};