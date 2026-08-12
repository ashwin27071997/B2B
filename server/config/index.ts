import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.SERVER_PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

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
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
};

export type Config = typeof config;
