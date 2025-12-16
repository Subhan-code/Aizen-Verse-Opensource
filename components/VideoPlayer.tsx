import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import {
  SkipForward,
  SkipBack,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  RefreshCcw,
  MessageSquare
} from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title: string;
  captionsSrc?: string; // URL to .vtt file
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, captionsSrc, onEnded }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  let hideTimeout: NodeJS.Timeout;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      hlsRef.current = new Hls();
      hlsRef.current.loadSource(src);
      hlsRef.current.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }

    if (captionsSrc) {
      const track = document.createElement('track');
      track.kind = 'subtitles';
      track.src = captionsSrc;
      track.default = captionsEnabled;
      track.srclang = 'en';
      track.label = 'English';
      video.appendChild(track);
    }

    const updateDuration = () => setDuration(video.duration);
    const updateProgress = () => setProgress(video.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const handleEnded = () => onEnded && onEnded();
    
    // Fullscreen change handlers
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', handleEnded);
    
    // Add fullscreen change listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', handleEnded);
      
      // Remove fullscreen change listeners
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      
      hlsRef.current?.destroy();
    };
  }, [src, captionsSrc, captionsEnabled, onEnded]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    isPlaying ? video.pause() : video.play();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = time;
    setProgress(time);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    if (videoRef.current) videoRef.current.volume = vol;
    setVolume(vol);
  };

  const skip = (seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  };

  const toggleCaptions = () => {
    const video = videoRef.current;
    if (!video || !video.textTracks) return;
    const track = video.textTracks[0];
    if (!track) return;
    track.mode = track.mode === 'showing' ? 'hidden' : 'showing';
    setCaptionsEnabled(track.mode === 'showing');
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => setShowControls(false), 2500);
  };

  const setSpeed = (rate: number) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const enterFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    
    // Check for fullscreen support
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) { // Safari
      (video as any).webkitRequestFullscreen();
    } else if ((video as any).mozRequestFullScreen) { // Firefox
      (video as any).mozRequestFullScreen();
    } else if ((video as any).msRequestFullscreen) { // IE/Edge
      (video as any).msRequestFullscreen();
    }
    
    setIsFullscreen(true);
  };
  
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) { // Safari
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) { // Firefox
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) { // IE/Edge
      (document as any).msExitFullscreen();
    }
    
    setIsFullscreen(false);
  };
  
  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const formatTime = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  return (
    <div className="relative bg-gray-900 dark:bg-black rounded-3xl overflow-hidden video-player-container" onMouseMove={handleMouseMove}>
      <video ref={videoRef} className="w-full h-full bg-black" onClick={togglePlay} />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 backdrop-blur-sm" onClick={togglePlay}>
          <div className="w-20 h-20 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center">
            <Play className="w-10 h-10 text-white dark:text-black" />
          </div>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <input
          type="range"
          min={0}
          max={duration}
          value={progress}
          onChange={seek}
          className="w-full h-1.5 bg-white/20 dark:bg-white/30 rounded-full appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-white font-space mt-1">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => skip(-10)} className="text-white hover:bg-white/10 p-2 rounded-full touch-control"><SkipBack className="w-6 h-6" /></button>
            <button onClick={togglePlay} className="text-white hover:bg-white/10 p-2 rounded-full touch-control">{isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}</button>
            <button onClick={() => skip(10)} className="text-white hover:bg-white/10 p-2 rounded-full touch-control"><SkipForward className="w-6 h-6" /></button>
            <button onClick={() => videoRef.current && (videoRef.current.currentTime = 0)} className="text-white hover:bg-white/10 p-2 rounded-full touch-control"><RefreshCcw className="w-5 h-5" /></button>
            <button onClick={toggleMute} className="text-white hover:bg-white/10 p-2 rounded-full touch-control">{isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}</button>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={changeVolume} className="w-24 h-1.5 bg-white/20 dark:bg-white/30 rounded-full appearance-none cursor-pointer" />
            <button onClick={toggleCaptions} className={`p-2 rounded-full touch-control ${captionsEnabled ? 'bg-white text-black' : 'bg-black text-white'} hover:invert transition-colors`}><MessageSquare className="w-5 h-5" /></button>
          </div>

          <div className="flex items-center gap-4 relative">
            <div>
              <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="text-white hover:bg-white/10 p-2 rounded-full flex items-center gap-1 touch-control">
                <Settings className="w-5 h-5" /> {playbackRate}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-12 right-0 bg-gray-900 dark:bg-gray-800 border border-white/20 dark:border-white/40 rounded-xl p-2 text-white z-50">
                  {[0.5,1,1.25,1.5,2,3].map(r => (
                    <button key={r} onClick={() => setSpeed(r)} className="block w-full text-left px-3 py-1 hover:bg-white/10 dark:hover:bg-white/20 rounded touch-control">{r}x</button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-white font-dela text-sm hidden md:block truncate max-w-xs">{title}</span>
            <button onClick={toggleFullscreen} className="text-white hover:bg-white/10 p-2 rounded-full touch-control">
              {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;