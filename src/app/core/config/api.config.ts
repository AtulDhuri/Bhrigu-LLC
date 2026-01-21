/**
 * Centralized API configuration
 * All API endpoints for the application
 */
export const API_CONFIG = {
  BASE_URL: 'https://jsonplaceholder.typicode.com',
  ENDPOINTS: {
    POSTS: '/posts',
    COMMENTS: '/comments',
    ALBUMS: '/albums',
    PHOTOS: '/photos',
    USERS: '/users'
  }
} as const;

/**
 * Helper function to build full API URLs
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}
