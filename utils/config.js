/**
 * Configuration module for test suite settings
 *
 * Environment Variables:
 * - SERVEREST_BASE_URL: Base URL for ServeRest API (default: https://serverest.dev)
 *
 * @module utils/config
 * @example
 * import { BASE_URL } from './utils/config.js';
 * const url = `${BASE_URL}/usuarios`;
 */

/**
 * Validates that a URL is a valid HTTP/HTTPS URL
 * @param {string} url - URL to validate
 * @throws {Error} If URL is invalid or uses non-HTTP(S) protocol
 */
function validateUrl(url) {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error(`Invalid protocol: ${parsed.protocol}. Only HTTP/HTTPS allowed.`);
    }
  } catch (error) {
    throw new Error(`Invalid SERVEREST_BASE_URL: "${url}". ${error.message}`);
  }
}

// Read environment variable with default fallback
const rawUrl = process.env.SERVEREST_BASE_URL || 'https://serverest.dev';

// Validate URL format (fail fast if invalid)
validateUrl(rawUrl);

// Remove trailing slash for consistent URL construction
export const BASE_URL = rawUrl.replace(/\/$/, '');

// Log resolved configuration for verification
console.log(`[Config] ServeRest API Base URL: ${BASE_URL}`);
