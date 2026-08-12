import type { Request, Response, NextFunction } from 'express';
import { config } from '../config';

/**
 * Authentication Middleware
 * Verifies the JWT token from Supabase and attaches user info to request.
 */

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
  token?: string;
}

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

    // Verify token with Supabase
    // In production, you'd verify the JWT signature using Supabase's JWT secret
    // For now, we'll decode and forward the token to backend for verification
    const payload = decodeJWT(token);

    if (!payload || !payload.sub) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: payload.sub,
      email: payload.email || '',
      role: payload.role,
    };
    req.token = token;

    next();
  } catch (error) {
    console.error('[Auth Error]', error);
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token verification failed',
    });
  }
}

// Simple JWT decode (payload only, no verification)
// In production, use proper JWT verification with Supabase secret
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

// Optional auth - doesn't fail if no token, but attaches user if present
export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = decodeJWT(token);

      if (payload && payload.sub) {
        req.user = {
          id: payload.sub as string,
          email: (payload.email as string) || '',
          role: payload.role as string,
        };
        req.token = token;
      }
    }

    next();
  } catch {
    // Continue without auth
    next();
  }
}
