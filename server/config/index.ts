import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.SERVER_PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Backend API
  backend: {
    baseUrl: process.env.BACKEND_API_URL || 'http://localhost:8000',
    apiKey: process.env.BACKEND_API_KEY || '',
    timeout: parseInt(process.env.BACKEND_TIMEOUT || '30000', 10),
  },

  // Supabase (for token verification)
  supabase: {
    url: process.env.VITE_SUPABASE_URL || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
    jwtSecret: process.env.SUPABASE_JWT_SECRET || '',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

/**
 * Validate required environment variables
 * Throws error in production if critical vars are missing
 */
export function validateConfig(): void {
  const errors: string[] = [];

  if (config.isProduction) {
    if (!config.supabase.jwtSecret) {
      errors.push('SUPABASE_JWT_SECRET is required in production');
    }
    if (!config.backend.baseUrl || config.backend.baseUrl === 'http://localhost:8000') {
      errors.push('BACKEND_API_URL must be set to production URL');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join('\n')}`);
  }
}

export type Config = typeof config;
