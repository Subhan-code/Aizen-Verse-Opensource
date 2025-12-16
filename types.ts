// API Response Types

export interface AnimeResult {
  id: string;
  title: string;
  url: string;
  image: string;
  releaseDate?: string;
  subOrDub?: 'sub' | 'dub';
  episodeNumber?: number;
  rating?: number;
  description?: string;
  // Additional properties for HeroSlider
  bannerUrl?: string;
  status?: string;
  type?: string;
  episodes?: number;
  genres?: string[];
}

export interface SearchResponse {
  currentPage: number;
  hasNextPage: boolean;
  results: AnimeResult[];
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  url: string;
}

export interface AnimeInfo {
  id: string;
  title: string;
  url: string;
  image: string;
  description: string;
  genres: string[];
  subOrDub: 'sub' | 'dub';
  type: string;
  status: string;
  otherName: string;
  totalEpisodes: number;
  episodes: Episode[];
  releaseDate?: string;
  rating?: number;
}

export interface Subtitle {
  lang: string;
  url: string;
}

export interface Source {
  url: string;
  quality: string;
  isM3U8: boolean;
  server?: string; // Added server information
}

export interface StreamingLinksResponse {
  headers: {
    Referer: string;
    "User-Agent": string;
  };
  sources: Source[];
  download: string;
  subtitles?: Subtitle[]; // Added subtitles support
}

export enum StreamCategory {
  SUB = 'sub',
  DUB = 'dub'
}

export enum StreamServer {
  VIDSTREAMING = 'vidstreaming',
  VIDCLOUD = 'vidcloud',
  STREAMTAPE = 'streamtape'
}

// Theme type for light/dark mode
export type Theme = 'light' | 'dark';

// View mode for navigation
export type ViewMode = 'home' | 'search' | 'profile' | 'watch';

// User profile type
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}