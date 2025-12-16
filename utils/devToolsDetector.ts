/**
 * Utility to detect if developer tools are open and handle protective measures
 */

let devtools = {
  open: false,
  orientation: null
};

const threshold = 160;

// Function to detect if dev tools are open
export const detectDevTools = (callback: (isOpen: boolean) => void) => {
  if (typeof window === 'undefined') return;
  
  setInterval(() => {
    if (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    ) {
      if (!devtools.open) {
        devtools.open = true;
        callback(true);
      }
    } else {
      if (devtools.open) {
        devtools.open = false;
        callback(false);
      }
    }
  }, 500);
};

// Function to disable right-click context menu
export const disableContextMenu = () => {
  if (typeof document === 'undefined') return;
  
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
};

// Function to disable common keyboard shortcuts for dev tools
export const disableDevToolShortcuts = () => {
  if (typeof document === 'undefined') return;
  
  document.addEventListener('keydown', (e) => {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
      (e.ctrlKey && e.key === 'u')
    ) {
      e.preventDefault();
      return false;
    }
  });
};

// Enhanced proxy URL generator with additional security
export const secureProxyVideoUrl = (
  url: string, 
  headers?: Record<string, string>,
  origin?: string
): string => {
  // Add timestamp to make URLs time-sensitive
  const timestamp = Date.now();
  
  // Create a more complex hash
  const data = `${url}${timestamp}${Math.random()}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Simple hash function (in production, use a proper crypto library)
  let hash = 0;
  for (let i = 0; i < dataBuffer.length; i++) {
    hash = ((hash << 5) - hash + dataBuffer[i]) | 0;
  }
  
  // Store in sessionStorage with expiration
  if (typeof window !== 'undefined') {
    const storageKey = `secure_proxy_${Math.abs(hash)}`;
    sessionStorage.setItem(storageKey, JSON.stringify({
      url: url,
      headers: headers,
      origin: origin,
      timestamp: timestamp,
      expires: timestamp + (5 * 60 * 1000) // 5 minutes expiration
    }));
    
    // Clean up expired entries
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('secure_proxy_')) {
        try {
          const item = JSON.parse(sessionStorage.getItem(key) || '{}');
          if (item.expires && item.expires < Date.now()) {
            sessionStorage.removeItem(key);
          }
        } catch (e) {
          // Remove invalid entries
          sessionStorage.removeItem(key);
        }
      }
    });
  }
  
  // Return URL with hash parameter
  const proxyUrl = new URL(import.meta.env.VITE_PROXY_URL || "http://localhost:8080");
  proxyUrl.searchParams.set('token', Math.abs(hash).toString());
  proxyUrl.searchParams.set('ts', timestamp.toString());
  
  return proxyUrl.toString();
};

// Server-side validation recommendations:
// 1. Validate token and timestamp on the server
// 2. Check that the request is coming from an authorized domain
// 3. Implement rate limiting per IP/user
// 4. Add referer validation
// 5. Expire tokens after a short period
// 6. Log suspicious activity
//
// Example server-side validation (pseudo-code):
/*
app.get('/proxy', async (req, res) => {
  const { token, ts } = req.query;
  
  // 1. Validate timestamp (e.g., within 5 minutes)
  if (Math.abs(Date.now() - parseInt(ts)) > 5 * 60 * 1000) {
    return res.status(403).send('Token expired');
  }
  
  // 2. Validate token against stored data
  const storageKey = `secure_proxy_${token}`;
  const storedData = sessionStorage.getItem(storageKey);
  if (!storedData) {
    return res.status(403).send('Invalid token');
  }
  
  // 3. Validate referer
  const referer = req.get('Referer');
  if (!referer || !referer.includes('yourdomain.com')) {
    return res.status(403).send('Unauthorized');
  }
  
  // 4. Rate limiting
  const ip = req.ip;
  // Implement rate limiting logic here
  
  // Process the request
  // ...
});
*/