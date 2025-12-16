// Use process.env if available, otherwise fallback to the public URL provided in prompt
// Note: In a real app, API keys should be handled securely on the backend.
export const API_BASE_URL = typeof process !== 'undefined' && process.env.REACT_APP_API_URL || "https://aizenbackend.vercel.app";

// Proxy URL for video streaming
export const PROXY_URL = typeof process !== 'undefined' && process.env.REACT_APP_PROXY_URL || "https://aizen-rust-proxy1.vercel.app";

// Fallback images
export const PLACEHOLDER_IMAGE = "https://picsum.photos/300/450?grayscale";