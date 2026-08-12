import type { Request, Response, NextFunction } from 'express';
import { z, ZodError, type ZodSchema } from 'zod';
import { logger } from '../lib/logger.js';

/**
 * Validation Middleware Factory
 * Creates middleware that validates request body, query, or params against a Zod schema
 */

type ValidationTarget = 'body' | 'query' | 'params';

interface ValidationOptions {
  target?: ValidationTarget;
  stripUnknown?: boolean;
}

export function validate<T extends ZodSchema>(
  schema: T,
  options: ValidationOptions = {}
) {
  const { target = 'body', stripUnknown = true } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req[target];

      const result = await schema.safeParseAsync(data);

      if (!result.success) {
        const errors = formatZodErrors(result.error);

        logger.debug({ errors, target }, 'Validation failed');

        res.status(400).json({
          error: 'Validation Error',
          message: 'Request validation failed',
          details: errors,
        });
        return;
      }

      // Replace with validated (and potentially transformed) data
      if (stripUnknown) {
        req[target] = result.data;
      }

      next();
    } catch (error) {
      logger.error({ error }, 'Validation middleware error');
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Validation processing failed',
      });
    }
  };
}

/**
 * Format Zod errors into a user-friendly structure
 */
function formatZodErrors(error: ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_root';

    if (!errors[path]) {
      errors[path] = [];
    }

    errors[path].push(issue.message);
  }

  return errors;
}

/**
 * Validate request body
 */
export function validateBody<T extends ZodSchema>(schema: T) {
  return validate(schema, { target: 'body' });
}

/**
 * Validate query parameters
 */
export function validateQuery<T extends ZodSchema>(schema: T) {
  return validate(schema, { target: 'query' });
}

/**
 * Validate URL parameters
 */
export function validateParams<T extends ZodSchema>(schema: T) {
  return validate(schema, { target: 'params' });
}
