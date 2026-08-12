import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { logger } from '../lib/logger.js';

/**
 * Authentication Middleware
 * Verifies the JWT token from Supabase and attaches user info to request.
 */

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
    aud?: string;
  };
  token?: string;
}

interface SupabaseJWTPayload {
  sub: string;
  email?: string;
  role?: string;
  aud?: string;
  exp?: number;
  iat?: number;
}

/**
 * Verify JWT token using Supabase JWT secret
 * Validates signature, expiration, and claims
 */
function verifySupabaseToken(token: string): SupabaseJWTPayload | null {
  const secret = config.supabase.jwtSecret;

  // Production requires proper JWT verification
  if (!secret) {
    if (config.isProduction) {
      logger.error('SUPABASE_JWT_SECRET not configured in production');
      return null;
    }
    // Development fallback - decode only (logs warning)
    logger.warn('JWT verification disabled - using decode-only mode (dev only)');
    return decodeJWTUnsafe(token);
  }

  try {
    const payload = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      audience: 'authenticated',
    }) as SupabaseJWTPayload;

    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.debug('JWT token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.debug({ message: (error as Error).message }, 'JWT verification failed');
    }
    return null;
  }
}

/**
 * Decode JWT without verification (development fallback only)
 * WARNING: Does not verify signature - tokens can be forged
 */
function decodeJWTUnsafe(token: string): SupabaseJWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
    const decoded = JSON.parse(payload) as SupabaseJWTPayload;

    // Check expiration manually
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Required authentication middleware
 * Returns 401 if no valid token present
 */
export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifySupabaseToken(token);

    if (!payload || !payload.sub) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: payload.sub,
      email: payload.email || '',
      role: payload.role,
      aud: payload.aud,
    };
    req.token = token;

    next();
  } catch (error) {
    logger.error({ error }, 'Auth middleware error');
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token verification failed',
    });
  }
}

/**
 * Optional authentication middleware
 * Doesn't fail if no token, but attaches user if valid token present
 */
export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifySupabaseToken(token);

      if (payload && payload.sub) {
        req.user = {
          id: payload.sub,
          email: payload.email || '',
          role: payload.role,
          aud: payload.aud,
        };
        req.token = token;
      }
    }

    next();
  } catch {
    next();
  }
}
