import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimeResult, Theme } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import { Heart } from 'lucide-react';

interface FavoritesProps {
  theme?: Theme;
}

const Favorites: React.FC<FavoritesProps> = ({ theme = 'dark' }) => {
  const navigate = useNavigate();
  // Mock favorites data - in a real app, this would come from user data
  const [favorites] = useState<AnimeResult[]>([
    {
      id: "demon-slayer",
      title: "Demon Slayer",
      image: "https://cdn.myanimelist.net/images/anime/1286/109145.jpg",
      url: "",
      releaseDate: "2019",
    },
    {
      id: "jujutsu-kaisen",
      title: "Jujutsu Kaisen",
      image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
      url: "",
      releaseDate: "2020",
    },
    {
      id: "attack-on-titan",
      title: "Attack on Titan",
      image: "https://cdn.myanimelist.net/images/anime/1000/110531.jpg",
      url: "",
      releaseDate: "2013",
    },
    {
      id: "one-piece",
      title: "One Piece",
      image: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
      url: "",
      releaseDate: "1999",
    },
    {
      id: "naruto",
      title: "Naruto",
      image: "https://cdn.myanimelist.net/images/anime/5/72613.jpg",
      url: "",
      releaseDate: "2002",
    },
    {
      id: "my-hero-academia",
      title: "My Hero Academia",
      image: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
      url: "",
      releaseDate: "2016",
    },
  ]);

  const handleAnimeClick = (anime: AnimeResult) => {
    navigate(`/anime/${anime.id}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="font-dela text-3xl md:text-4xl">Favorites</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {favorites.map((anime, index) => (
            <div key={anime.id} className="relative">
              <AnimeCard 
                anime={anime} 
                onClick={handleAnimeClick} 
              />
              <div className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center z-10">
                <Heart className="w-4 h-4 text-white fill-current" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-dela mb-2">No Favorites Yet</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start adding anime to your favorites by clicking the heart icon on any anime.
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;