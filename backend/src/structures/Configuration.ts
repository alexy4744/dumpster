/* Configuration constants that needs to be computed */

interface Constants {
  [key: string]: number; // Could still potentiall be null/undefined so needs to be checked in app.ts
}

export default {
  SESSION_TTL: parseInt(process.env.SESSION_TTL, 0),

  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 0) * 1024 * 1024,
  MAX_FILES: parseInt(process.env.MAX_FILES, 0),

  HTTP_PORT: parseInt(process.env.HTTP, 0) || 80,
  HTTPS_PORT: parseInt(process.env.HTTPS, 0) || 443
} as Constants;