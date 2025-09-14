/**
 * Utility functions for handling robot stream URLs and proxy conversion
 */

export const ROBOT_BASE_URL = 'http://100.112.177.9:8000'
export const PROXY_BASE_PATH = '/api/stream'

/**
 * Check if a URL is a direct robot URL that needs proxying
 */
export function isRobotUrl(url: string): boolean {
  return url.includes('100.112.177.9:8000/')
}

/**
 * Convert a robot URL to use the Next.js proxy to avoid CORS issues
 */
export function convertToProxyUrl(url: string): string {
  if (!isRobotUrl(url)) {
    return url
  }
  
  const path = url.split('100.112.177.9:8000/')[1]
  return `${PROXY_BASE_PATH}/${path}`
}

/**
 * Convert a proxy URL back to the original robot URL
 */
export function convertToRobotUrl(proxyUrl: string): string {
  if (!proxyUrl.startsWith(PROXY_BASE_PATH)) {
    return proxyUrl
  }
  
  const path = proxyUrl.replace(`${PROXY_BASE_PATH}/`, '')
  return `${ROBOT_BASE_URL}/${path}`
}

/**
 * Validate if a URL is a valid stream URL (HLS or WebSocket)
 */
export function isValidStreamUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin)
    const pathname = urlObj.pathname.toLowerCase()
    
    // Check for HLS manifest files
    if (pathname.endsWith('.m3u8')) return true
    
    // Check for WebSocket URLs
    if (urlObj.protocol === 'ws:' || urlObj.protocol === 'wss:') return true
    
    // Check for proxy URLs
    if (pathname.startsWith(PROXY_BASE_PATH)) return true
    
    return false
  } catch {
    return false
  }
}

/**
 * Get a user-friendly display URL (shows original robot URL even if using proxy)
 */
export function getDisplayUrl(url: string): string {
  if (url.startsWith(PROXY_BASE_PATH)) {
    return convertToRobotUrl(url) + ' (proxied)'
  }
  return url
}