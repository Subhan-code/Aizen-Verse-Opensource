// Storage utility for Aizen Verse

// Watchlist
export const getWatchlist = (): string[] => {
  if (typeof window === 'undefined') return [];
  const watchlist = localStorage.getItem('aizenverse_watchlist');
  return watchlist ? JSON.parse(watchlist) : [];
};

export const addToWatchlist = (animeId: string): void => {
  if (typeof window === 'undefined') return;
  const watchlist = getWatchlist();
  if (!watchlist.includes(animeId)) {
    watchlist.push(animeId);
    localStorage.setItem('aizenverse_watchlist', JSON.stringify(watchlist));
  }
};

export const removeFromWatchlist = (animeId: string): void => {
  if (typeof window === 'undefined') return;
  const watchlist = getWatchlist();
  const filtered = watchlist.filter(id => id !== animeId);
  localStorage.setItem('aizenverse_watchlist', JSON.stringify(filtered));
};

// Watch History
export const getWatchHistory = (): any[] => {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem('aizenverse_history');
  return history ? JSON.parse(history) : [];
};

export const addToWatchHistory = (anime: any): void => {
  if (typeof window === 'undefined') return;
  const history = getWatchHistory();
  const existingIndex = history.findIndex(item => item.id === anime.id);
  
  if (existingIndex !== -1) {
    history.splice(existingIndex, 1);
  }
  
  history.unshift(anime);
  
  const trimmed = history.slice(0, 50);
  localStorage.setItem('aizenverse_history', JSON.stringify(trimmed));
};

export const clearWatchHistory = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('aizenverse_history');
};

// Continue Watching
export const getContinueWatching = (): any[] => {
  if (typeof window === 'undefined') return [];
  const continueWatching = localStorage.getItem('aizenverse_continue_watching');
  return continueWatching ? JSON.parse(continueWatching) : [];
};

export const addToContinueWatching = (anime: any): void => {
  if (typeof window === 'undefined') return;
  const continueWatching = getContinueWatching();
  const existingIndex = continueWatching.findIndex(item => item.id === anime.id);
  
  if (existingIndex !== -1) {
    continueWatching.splice(existingIndex, 1);
  }
  
  continueWatching.unshift(anime);
  
  const trimmed = continueWatching.slice(0, 20);
  localStorage.setItem('aizenverse_continue_watching', JSON.stringify(trimmed));
};

export const removeFromContinueWatching = (animeId: string): void => {
  if (typeof window === 'undefined') return;
  const continueWatching = getContinueWatching();
  const filtered = continueWatching.filter(item => item.id !== animeId);
  localStorage.setItem('aizenverse_continue_watching', JSON.stringify(filtered));
};