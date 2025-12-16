import { PROXY_URL } from '../constants';

/**
 * Proxies a video URL through the Rust proxy service
 * @param url The original video URL to proxy
 * @param headers Optional headers to include in the proxied request
 * @param origin Optional origin to include in the proxied request
 * @returns The proxied URL
 */
export const proxyVideoUrl = (
  url: string, 
  headers?: Record<string, string>,
  origin?: string
): string => {
  // If the URL is already proxied, return it as is
  if (url.startsWith(PROXY_URL)) {
    return url;
  }

  // Build the proxy URL with obscured query parameters
  const proxyUrl = new URL(PROXY_URL);
  
  // Simple base64 encoding to obscure the URL (not encryption, just obscurity)
  const encodedUrl = btoa(url);
  
  proxyUrl.searchParams.set('u', encodedUrl);
  
  if (headers) {
    // Encode headers as base64 JSON
    const encodedHeaders = btoa(JSON.stringify(headers));
    proxyUrl.searchParams.set('h', encodedHeaders);
  }

  if (origin) {
    // Encode origin as base64
    const encodedOrigin = btoa(origin);
    proxyUrl.searchParams.set('o', encodedOrigin);
  }

  return proxyUrl.toString();
};

/**
 * Simple hash-based proxy URL generator for local development
 * @param url The original video URL to proxy
 * @param headers Optional headers to include in the proxied request
 * @param origin Optional origin to include in the proxied request
 * @returns The proxied URL
 */
export const proxyVideoUrlSimple = (
  url: string, 
  headers?: Record<string, string>,
  origin?: string
): string => {
  // If the URL is already proxied, return it as is
  if (url.startsWith(PROXY_URL)) {
    return url;
  }

  // Build the proxy URL with hashed query parameters
  const proxyUrl = new URL(PROXY_URL);
  
  // Create a simple hash of the URL to obscure it
  const urlHash = btoa(url).substring(0, 20); // Simple base64 encoding for obscurity
  
  proxyUrl.searchParams.set('id', urlHash);
  proxyUrl.searchParams.set('t', Date.now().toString());
  
  // Store actual URL in sessionStorage with the hash as key
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`proxy_${urlHash}`, JSON.stringify({
      url: url,
      headers: headers,
      origin: origin
    }));
  }

  return proxyUrl.toString();
};