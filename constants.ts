// Use Vite environment variables
// Note: In a real app, API keys should be handled securely on the backend.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Proxy URL for video streaming
export const PROXY_URL = import.meta.env.VITE_PROXY_URL || "http://localhost:8080";

// Fallback images
export const PLACEHOLDER_IMAGE = "https://picsum.photos/300/450?grayscale";