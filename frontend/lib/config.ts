/**
 * Centralized configuration for the frontend application
 * All environment-dependent values should be defined here
 */

/**
 * Backend API base URL
 * Uses NEXT_PUBLIC_API_URL environment variable if set, otherwise defaults to localhost:3003
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

/**
 * Enable local mode feature (offline-first ordering)
 * When false, mode toggle is hidden and /local/ routes redirect to server routes
 * Defaults to false for production deployments
 */
export const ENABLE_LOCAL_MODE = process.env.NEXT_PUBLIC_ENABLE_LOCAL_MODE === 'true';
