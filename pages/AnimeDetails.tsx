import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AnimeInfo } from '../types';
import { Loader, Play, Calendar, Star, Info, Heart } from 'lucide-react';

const AnimeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<AnimeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getAnimeInfo(id)
        .then(setAnime)
        .catch((err) => {
            console.error(err);
            setError("Failed to load anime details.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    // Check if anime is in favorites
    if (anime) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(anime.id));
    }
  }, [anime]);

  const handleToggleFavorite = () => {
    if (!anime) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      // Remove from favorites
      newFavorites = favorites.filter((favId: string) => favId !== anime.id);
    } else {
      // Add to favorites
      newFavorites = [...favorites, anime.id];
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    
    // Show a notification
    alert(`${anime.title} ${isFavorite ? 'removed from' : 'added to'} favorites!`);
  };

  const handlePlayFirstEpisode = () => {
    if (anime && anime.episodes.length > 0) {
      navigate(`/watch/${anime.episodes[0].id}`);
    }
  };

  if (loading) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader className="w-10 h-10 animate-spin" />
        </div>
    );
  }

  if (error || !anime) {
    return <div className="text-center py-20 text-red-400">{error || "Anime not found"}</div>;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Poster */}
        <div className="w-full md:w-1/4 max-w-[300px] mx-auto md:mx-0 flex-shrink-0">
          <div className="rounded-xxl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-[2/3]">
            <img 
              src={anime.image} 
              alt={anime.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/300x450/1a1a1a/ffffff?text=No+Image';
              }}
            />
          </div>
          <div className="mt-4 flex flex-col gap-2">
             <div className="bg-gray-800/50 rounded-xxl p-3 text-sm">
                <p className="text-gray-400">Type: <span className="text-white">{anime.type}</span></p>
                <p className="text-gray-400">Status: <span className="text-white">{anime.status}</span></p>
                <p className="text-gray-400">Total Eps: <span className="text-white">{anime.totalEpisodes}</span></p>
                {anime.releaseDate && (
                  <p className="text-gray-400">Release: <span className="text-white">{anime.releaseDate}</span></p>
                )}
                {anime.rating && (
                  <p className="text-gray-400">Rating: <span className="text-white">{anime.rating}/10</span></p>
                )}
             </div>
             
             {/* Action Buttons */}
             <div className="flex gap-2">
               <button 
                 onClick={handlePlayFirstEpisode}
                 disabled={anime.episodes.length === 0}
                 className={`flex-1 py-3 rounded-xxl font-bold flex items-center justify-center gap-2 ${
                   anime.episodes.length > 0 
                     ? 'bg-white text-black hover:bg-black hover:text-white transition-colors' 
                     : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                 }`}
               >
                 <Play className="w-5 h-5" />
                 Play
               </button>
               
               <button 
                 onClick={handleToggleFavorite}
                 className={`w-12 h-12 rounded-xxl flex items-center justify-center ${
                   isFavorite 
                     ? 'bg-red-500 text-white' 
                     : 'bg-gray-800 text-white hover:bg-red-500 hover:text-white transition-colors'
                 }`}
               >
                 <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
               </button>
             </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex-1">
          <h1 className="font-dela text-3xl md:text-5xl text-white mb-2 leading-tight">{anime.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {anime.genres.map(genre => (
                <span key={genre} className="px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20">
                    {genre}
                </span>
            ))}
            <span className="px-3 py-1 bg-black/50 text-white text-xs rounded-full border border-white/20">
                {anime.subOrDub}
            </span>
          </div>

          {anime.otherName && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-400">Japanese Title:</span>
              <span className="text-white font-medium">{anime.otherName}</span>
            </div>
          )}

          <p className="text-gray-300 leading-relaxed mb-8 max-w-4xl">
            {anime.description}
          </p>

          {/* Episodes Section */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Episodes ({anime.episodes.length})
            </h3>

            {/* Episode Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar pb-4">
                {anime.episodes.map((ep) => (
                    <Link 
                        key={ep.id} 
                        to={`/watch/${ep.id}`}
                        className="group flex flex-col bg-gray-800/50 hover:bg-gray-700 rounded-xl p-3 transition-all text-center border border-gray-700/50 hover:border-gray-600"
                    >
                        <span className="text-xs text-gray-400 mb-1 group-hover:text-white/80">Ep {ep.number}</span>
                        <span className="text-sm font-medium text-white group-hover:text-white truncate">{ep.title || `Episode ${ep.number}`}</span>
                    </Link>
                ))}
            </div>
            {anime.episodes.length === 0 && (
                <p className="text-gray-500 italic">No episodes available.</p>
            )}
          </div>

          {/* Anime Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="font-bold text-xl text-white mb-4">Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Title</span>
                  <span className="text-white font-medium">{anime.title}</span>
                </div>
                {anime.otherName && (
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Japanese Title</span>
                    <span className="text-white font-medium">{anime.japaneseTitle}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white font-medium">{anime.type || 'TV'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Status</span>
                  <span className="text-white font-medium">{anime.status || 'Unknown'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Total Episodes</span>
                  <span className="text-white font-medium">{anime.totalEpisodes || anime.episodes.length}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Version</span>
                  <span className="text-white font-medium capitalize">{anime.subOrDub || 'Unknown'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="font-bold text-xl text-white mb-4">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres && anime.genres.length > 0 ? (
                  anime.genres.map((genre, index) => (
                    <span key={index} className="px-3 py-1 bg-white/10 text-white text-sm rounded-full border border-white/20">
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No genres available</span>
                )}
              </div>
              
              <h3 className="font-bold text-xl text-white mt-6 mb-4">Episode List</h3>
              <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {anime.episodes && anime.episodes.length > 0 ? (
                  <ul className="space-y-2">
                    {anime.episodes.slice(0, 10).map((ep) => (
                      <li key={ep.id} className="flex justify-between text-sm border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Episode {ep.number}</span>
                        <span className="text-white truncate ml-2">{ep.title || `Episode ${ep.number}`}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No episode list available</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;