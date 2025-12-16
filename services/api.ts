import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { 
  SearchResponse, 
  AnimeInfo, 
  StreamingLinksResponse, 
  StreamCategory, 
  StreamServer 
} from '../types';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const api = {
  /**
   * Search for an anime
   */
  searchAnime: async (query: string, page: number = 1): Promise<SearchResponse> => {
    try {
      // API Route: /anime/hianime/{query}
      const encodedQuery = encodeURIComponent(query);
      const response = await apiClient.get<SearchResponse>(`/anime/hianime/${encodedQuery}`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching anime:", error);
      throw error;
    }
  },

  /**
   * Get recently added anime
   */
  getRecentlyAdded: async (page: number = 1): Promise<SearchResponse> => {
    try {
      // API Route: /anime/hianime/recently-added
      const response = await apiClient.get<SearchResponse>('/anime/hianime/recently-added', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching recently added:", error);
      throw error;
    }
  },

  /**
   * Get trending anime
   */
  getTrending: async (page: number = 1): Promise<SearchResponse> => {
    try {
      // API Route: /anime/hianime/trending
      const response = await apiClient.get<SearchResponse>('/anime/hianime/trending', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching trending anime:", error);
      throw error;
    }
  },

  /**
   * Get most popular anime
   */
  getMostPopular: async (page: number = 1): Promise<SearchResponse> => {
    try {
      // API Route: /anime/hianime/most-popular
      const response = await apiClient.get<SearchResponse>('/anime/hianime/most-popular', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching most popular anime:", error);
      throw error;
    }
  },

  /**
   * Get top airing anime
   */
  getTopAiring: async (page: number = 1): Promise<SearchResponse> => {
    try {
      // API Route: /anime/hianime/top-airing
      const response = await apiClient.get<SearchResponse>('/anime/hianime/top-airing', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top airing anime:", error);
      throw error;
    }
  },

  /**
   * Get most favorite anime
   */
  getMostFavorite: async (page: number = 1): Promise<SearchResponse> => {
    try {
      // API Route: /anime/hianime/most-favorite
      const response = await apiClient.get<SearchResponse>('/anime/hianime/most-favorite', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching most favorite anime:", error);
      throw error;
    }
  },

  /**
   * Get movies
   */
  getMovies: async (page: number = 1): Promise<SearchResponse> => {
    try {
      // API Route: /anime/hianime/movie
      const response = await apiClient.get<SearchResponse>('/anime/hianime/movie', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  },

  /**
   * Get detailed info for a specific anime
   */
  getAnimeInfo: async (id: string): Promise<AnimeInfo> => {
    try {
      // API Route: /anime/hianime/info?id={id}
      const response = await apiClient.get<AnimeInfo>('/anime/hianime/info', {
        params: { id },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching anime info:", error);
      throw error;
    }
  },

  /**
   * Get streaming links for a specific episode
   */
  getStreamingLinks: async (
    episodeId: string, 
    server: StreamServer = StreamServer.VIDSTREAMING, 
    category: StreamCategory = StreamCategory.SUB
  ): Promise<StreamingLinksResponse> => {
    try {
      // API Route: /anime/hianime/watch/{episodeId}
      const response = await apiClient.get<StreamingLinksResponse>(`/anime/hianime/watch/${episodeId}`, {
        params: { server, category },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching streaming links:", error);
      throw error;
    }
  }
};