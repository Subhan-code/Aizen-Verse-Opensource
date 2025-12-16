import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { StreamingLinksResponse, StreamServer, StreamCategory, AnimeInfo, Source, Subtitle, Theme } from '../types';
import { Loader, Settings, ArrowLeft, SkipBack, SkipForward, X, AlertCircle, Play, Pause, Volume2, Maximize, Minimize, ChevronLeft, ChevronRight, RotateCcw, RotateCw, Menu } from 'lucide-react';
import { addToWatchHistory, addToContinueWatching } from '../utils/storage';
import { proxyVideoUrl } from '../utils/proxy';
import { detectDevTools, disableContextMenu, disableDevToolShortcuts } from '../utils/devToolsDetector';
import Sidebar from '../components/Sidebar';

interface WatchProps {
  theme?: Theme;
  setIsNavbarGlass?: (isGlass: boolean) => void;
}

const Watch: React.FC<WatchProps> = ({ theme = 'dark', setIsNavbarGlass }) => {
  const { episodeId } = useParams<{ episodeId: string }>();
  const navigate = useNavigate();
  
  const [streamData, setStreamData] = useState<StreamingLinksResponse | null>(null);
  const [animeInfo, setAnimeInfo] = useState<AnimeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<StreamCategory>(StreamCategory.SUB);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [availableSources, setAvailableSources] = useState<Source[]>([]);
  const [selectedServer, setSelectedServer] = useState<StreamServer>(StreamServer.VIDCLOUD);
  const [captions, setCaptions] = useState<Subtitle[]>([]); // Store caption tracks
  const [megaPlayEpisodeId, setMegaPlayEpisodeId] = useState<string>(''); // New variable for MegaPlay episode ID
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
  const [isScrolled, setIsScrolled] = useState(false); // State for navbar glass effect
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeEpisodeRef = useRef<HTMLButtonElement>(null);

  // Custom video controls (no longer needed with iframe embed)
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [currentTime, setCurrentTime] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const [volume, setVolume] = useState(1);
  // const [isFullscreen, setIsFullscreen] = useState(false);
  // const [playbackRate, setPlaybackRate] = useState(1);
  // const [showControls, setShowControls] = useState(true);
  // const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Available servers
  const availableServers = [
    { id: StreamServer.VIDSTREAMING, name: 'VidStreaming' },
    { id: StreamServer.VIDCLOUD, name: 'VidCloud' },
    { id: StreamServer.STREAMTAPE, name: 'StreamTape' }
  ];

  // --- FIXED extractAnimeId for $episode$ IDs ---
  const extractAnimeId = (epId: string) => {
    if (!epId) return '';
    if (epId.includes('$episode$')) {
      return epId.split('$episode$')[0];
    }
    // fallback for other formats
    const parts = epId.split('-');
    if (parts.length >= 2) return parts.slice(0, -1).join('-');
    return epId;
  };

  // Extract MegaPlay episode ID (last 5 digits from episode URL)
  const extractMegaPlayEpisodeId = (epId: string) => {
  if (!epId) return '';
  const match = epId.match(/\$episode\$(\d+)$/);
  return match ? match[1] : '';
};

  // Fetch streaming links from VidCloud server only
  const fetchAllStreamingLinks = async () => {
    if (!episodeId) return;
    setLoading(true);
    setError(null);

    try {
      // Only fetch from VidCloud server
      const response = await api.getStreamingLinks(episodeId, StreamServer.VIDCLOUD, category);
      
      // Set the stream data
      setStreamData(response);
      
      // Set available sources
      setAvailableSources(response.sources || []);
      
      // Auto-select the first available source
      if (response.sources && response.sources.length > 0) {
        setSelectedSource(response.sources[0]);
      }
      
      // Set captions
      setCaptions(response.subtitles || []);
    } catch (err) {
      console.error('Streaming error:', err);
      setError('Failed to load video. Please try again.');
      setAvailableSources([]);
      setSelectedSource(null);
      setCaptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stream when episodeId, category, or selectedServer changes
  useEffect(() => {
    // Extract MegaPlay episode ID
    if (episodeId) {
      setMegaPlayEpisodeId(extractMegaPlayEpisodeId(episodeId));
    }
    fetchAllStreamingLinks();
  }, [episodeId, category]); // Removed selectedServer from dependencies since it's fixed to VidCloud

  // Fetch anime info and episodes
  useEffect(() => {
    if (!episodeId) return;
    setEpisodesLoading(true);

    const animeId = extractAnimeId(episodeId);

    api.getAnimeInfo(animeId)
      .then(response => {
        // Ensure episodes array exists
        setAnimeInfo({ ...response, episodes: response.episodes || [] });
      })
      .catch(() => 
        // fallback to episodeId if needed
        api.getAnimeInfo(episodeId).then(res => setAnimeInfo({ ...res, episodes: res.episodes || [] }))
      )
      .finally(() => setEpisodesLoading(false));
  }, [episodeId]);

  // Scroll active episode into view
  useEffect(() => {
    if (activeEpisodeRef.current) {
      activeEpisodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [episodeId, animeInfo]);

  // Save watch history & continue watching
  useEffect(() => {
    if (!animeInfo || !episodeId) return;
    const currentEpisode = animeInfo.episodes.find(ep => ep.id === episodeId);
    if (currentEpisode) {
      addToContinueWatching({
        ...currentEpisode,
        animeTitle: animeInfo.title,
        animeId: animeInfo.id,
        watchedAt: new Date().toISOString()
      });
      addToWatchHistory({
        id: episodeId,
        title: `Episode ${currentEpisode.number}`,
        animeTitle: animeInfo.title,
        animeId: animeInfo.id,
        watchedAt: new Date().toISOString()
      });
    }
  }, [animeInfo, episodeId]);

  const getCurrentEpisodeIndex = () => animeInfo?.episodes.findIndex(ep => ep.id === episodeId) ?? -1;
  const handleNextEpisode = () => {
    if (!animeInfo) return;
    const idx = getCurrentEpisodeIndex();
    if (idx < animeInfo.episodes.length - 1) navigate(`/watch/${animeInfo.episodes[idx + 1].id}`);
  };
  const handlePrevEpisode = () => {
    if (!animeInfo) return;
    const idx = getCurrentEpisodeIndex();
    if (idx > 0) navigate(`/watch/${animeInfo.episodes[idx - 1].id}`);
  };
  const handleClose = () => navigate(-1);

  // Get the proxied video URL for the selected source
  const getProxiedVideoSrc = (): string | null => {
    if (!selectedSource?.url || !streamData) return null;
    
    // Proxy the video URL through our Rust proxy
    return proxyVideoUrl(
      selectedSource.url,
      streamData.headers ? {
        Referer: streamData.headers.Referer,
        'User-Agent': streamData.headers['User-Agent']
      } : undefined
    );
  };

  const videoSrc = getProxiedVideoSrc();

  // Handle source selection
  const handleSourceSelect = (source: Source & { server?: StreamServer }) => {
    console.log("Selecting source:", source);
    setSelectedSource(source);
  };

  // Handle server selection
  const handleServerSelect = (server: StreamServer) => {
    console.log("Selecting server:", server);
    setSelectedServer(server);
  };

  // Mouse move handler (minimal implementation for iframe compatibility)
  const handleMouseMove = () => {
    // Minimal implementation for iframe compatibility
  };

  useEffect(() => {
    // Initialize dev tools detection
    detectDevTools((isOpen) => {
      if (isOpen) {
        // Redirect to home when dev tools are detected
        navigate('/');
      }
    });
    
    // Disable context menu and dev tool shortcuts
    disableContextMenu();
    disableDevToolShortcuts();
    
    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, [navigate]);

  // Add scroll event listener for navbar effect
  

  // Mobile UI Implementation
  const renderMobileUI = () => (
  <div className="md:hidden w-full bg-black min-h-screen pt-16">

    {/* Header */}
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
      <button onClick={handleClose} className="text-white">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1 className="text-white font-bold text-base truncate">
        {animeInfo?.title || 'Watching'}
      </h1>
    </div>

    {/* Video Player (iframe ONLY) */}
    <div className="w-full aspect-video bg-black">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader className="w-10 h-10 animate-spin text-white" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : megaPlayEpisodeId ? (
        <iframe
          src={selectedSource ? selectedSource.url : ''}
          className="w-full h-full"
          frameBorder="0"
          allow="fullscreen; autoplay"
          allowFullScreen
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No stream available
        </div>
      )}
    </div>

    {/* Controls */}
    <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
      <button
        onClick={handlePrevEpisode}
        disabled={getCurrentEpisodeIndex() <= 0}
        className="text-white disabled:opacity-40"
      >
        <ChevronLeft />
      </button>

      <div className="flex gap-2">
        <button
          onClick={() => setCategory(StreamCategory.SUB)}
          className={`px-3 py-1 rounded-full text-sm font-bold ${
            category === StreamCategory.SUB
              ? 'bg-white text-black'
              : 'bg-gray-700 text-white'
          }`}
        >
          SUB
        </button>
        <button
          onClick={() => setCategory(StreamCategory.DUB)}
          className={`px-3 py-1 rounded-full text-sm font-bold ${
            category === StreamCategory.DUB
              ? 'bg-white text-black'
              : 'bg-gray-700 text-white'
          }`}
        >
          DUB
        </button>
      </div>

      <button
        onClick={handleNextEpisode}
        disabled={
          getCurrentEpisodeIndex() >= (animeInfo?.episodes.length || 0) - 1
        }
        className="text-white disabled:opacity-40"
      ><span className="text-sm">Next</span>
        <ChevronRight />
      </button>
    </div>

    {/* Episodes */}
    <div className="px-4 py-4">
      <h3 className="text-white font-bold mb-3">
        Episodes ({animeInfo?.episodes.length || 0})
      </h3>

      <div className="grid grid-cols-4 gap-2">
        {episodesLoading ? (
          <div className="col-span-4 flex justify-center py-6">
            <Loader className="w-6 h-6 animate-spin text-white" />
          </div>
        ) : animeInfo?.episodes.length ? (
          animeInfo.episodes.map(ep => {
            const active = ep.id === episodeId;
            return (
              <button
                key={ep.id}
                ref={active ? activeEpisodeRef : null}
                onClick={() => navigate(`/watch/${ep.id}`)}
                className={`aspect-square rounded-lg font-bold ${
                  active
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-white'
                }`}
              >
                {ep.number}
              </button>
            );
          })
        ) : (
          <div className="col-span-4 text-center text-gray-500">
            No episodes found
          </div>
        )}
      </div>
    </div>
  </div>
);


  // Desktop UI (preserved)
  const renderDesktopUI = () => (
    <div className="w-full flex flex-col lg:flex-row hidden md:flex">
      {/* Video Player */}
      <div className={`flex-1 flex flex-col items-center justify-center p-4 ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
        <div 
          className={`relative w-full max-w-6xl aspect-video shadow-2xl rounded-xl overflow-hidden video-container ${theme === 'light' ? 'bg-white' : 'bg-black'}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseMove}
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className={`w-12 h-12 animate-spin ${theme === 'light' ? 'text-black' : 'text-white'}`} />
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <AlertCircle className={`w-12 h-12 mb-2 ${theme === 'light' ? 'text-red-600' : 'text-red-500'}`} />
              <p className={`mb-2 ${theme === 'light' ? 'text-red-700' : 'text-red-400'}`}>{error}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableServers.map(server => (
                  <button
                    key={server.id}
                    onClick={() => handleServerSelect(server.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedServer === server.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                  >
                    Retry {server.name}
                  </button>
                ))}
              </div>
            </div>
          ) : megaPlayEpisodeId ? (
            <div className="w-full h-full relative">
              <iframe
                src={selectedSource ? selectedSource.url : ''}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                className={`w-full h-full ${theme === 'light' ? 'bg-white' : 'bg-black'}`}
              />
            </div>
          ) : (
            <div className={`absolute inset-0 flex items-center justify-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              No stream available
            </div>
          )}
        </div>

        {/* Server/Category/Quality Selection */}
        <div className="flex flex-wrap gap-3 mt-4 w-full max-w-6xl items-center">
          {/* Server Info - Fixed to VidCloud */}
          <div className="flex items-center gap-2">
            <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Server:</span>
            <span className={`px-3 py-2 rounded-full text-sm font-bold ${theme === 'light' ? 'bg-gray-300 text-black' : 'bg-white text-black'}`}>
              VidCloud
            </span>
          </div>
          
          {/* Prev/Next Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handlePrevEpisode}
              disabled={getCurrentEpisodeIndex() <= 0}
              className={`px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-gray-300 text-black hover:bg-gray-400' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={handleNextEpisode}
              disabled={getCurrentEpisodeIndex() >= (animeInfo?.episodes.length || 0) - 1}
              className={`px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-gray-300 text-black hover:bg-gray-400' : 'bg-white text-black hover:bg-gray-200'}`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Episode List */}
      <div className={`w-full lg:w-96 border-l flex flex-col max-h-[calc(100vh-64px)] overflow-hidden ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#121212] border-white/5'}`}>
        {/* Navigation at the top */}
        <div className={`p-4 border-b flex gap-2 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#1a1a1a] border-white/10'}`}>
          {/* Sub/Dub Toggle Buttons */}
          <div className="flex gap-2 mb-3 w-full">
            <button
              onClick={() => setCategory(StreamCategory.SUB)}
              className={`flex-1 px-4 py-2 rounded-xl transition-all ${
                category === StreamCategory.SUB
                  ? (theme === 'light' ? 'bg-gray-300 text-black font-bold' : 'bg-white text-black font-bold')
                  : (theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')
              }`}
            >
              Sub
            </button>
            <button
              onClick={() => setCategory(StreamCategory.DUB)}
              className={`flex-1 px-4 py-2 rounded-xl transition-all ${
                category === StreamCategory.DUB
                  ? (theme === 'light' ? 'bg-gray-300 text-black font-bold' : 'bg-white text-black font-bold')
                  : (theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')
              }`}
            >
              Dub
            </button>
          </div>
        </div>
          
          <div className={`p-4 border-b flex justify-between items-center ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
            <h3 className="font-bold text-lg">Episodes ({animeInfo?.episodes.length || 0})</h3>
          </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {episodesLoading ? (
            <div className={`p-4 text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-500'}`}>
              <Loader className={`w-6 h-6 animate-spin mx-auto mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`} />
              <p>Loading episodes...</p>
            </div>
          ) : animeInfo && animeInfo.episodes.length > 0 ? (
            animeInfo.episodes.map(ep => {
              const isCurrent = ep.id === episodeId;
              return (
                <button
                  key={ep.id}
                  ref={isCurrent ? activeEpisodeRef : null}
                  onClick={() => navigate(`/watch/${ep.id}`)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    isCurrent
                      ? (theme === 'light' ? 'bg-gray-300 text-black shadow-lg font-bold' : 'bg-white text-black shadow-lg font-bold')
                      : (theme === 'light' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white')
                  }`}
                >
                  <span className={`w-8 text-center font-bold ${isCurrent ? (theme === 'light' ? 'text-black' : 'text-black') : (theme === 'light' ? 'text-gray-700' : 'text-gray-600')}`}>
                    {ep.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`truncate ${isCurrent ? 'text-black' : theme === 'light' ? 'text-black' : 'text-white'}`}>{ep.title || `Episode ${ep.number}`}</p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className={`p-4 text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-500'}`}>No episodes found.</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderMobileUI()}
      {renderDesktopUI()}
      
      {/* Footer placeholder - ensures footer appears at the end of the page */}
      
    </>
  );
};

export default Watch;