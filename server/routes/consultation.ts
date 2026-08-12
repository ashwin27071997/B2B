import { Router } from 'express';
import { authMiddleware, createError } from '../middleware';
import type { AuthenticatedRequest } from '../middleware';
import * as backendClient from '../services/backend-client';

const router = Router();

// All consultation routes require authentication
router.use(authMiddleware);

/**
 * GET /api/v1/consultations
 * Get all consultations for the authenticated user
 */
router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.query;

    const result = await backendClient.get('/api/v1/consultations', {
      params: { page, limit, sortBy, sortOrder },
      headers: {
        Authorization: `Bearer ${req.token}`,
        'X-User-Id': req.user?.id || '',
      },
    });

    res.json(result);
  } catch (error: any) {
    next(createError(
      error.response?.data?.message || 'Failed to fetch consultations',
      error.response?.status || 500
    ));
  }
});

/**
 * GET /api/v1/consultations/slots
 * Get available consultation slots
 */
router.get('/slots', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const result = await backendClient.get('/api/v1/consultations/slots', {
      params: { startDate, endDate },
      headers: {
        Authorization: `Bearer ${req.token}`,
        'X-User-Id': req.user?.id || '',
      },
    });

    res.json(result);
  } catch (error: any) {
    next(createError(
      error.response?.data?.message || 'Failed to fetch available slots',
      error.response?.status || 500
    ));
  }
});

/**
 * GET /api/v1/consultations/:id
 * Get a single consultation by ID
 */
router.get('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const result = await backendClient.get(`/api/v1/consultations/${id}`, {
      headers: {
        Authorization: `Bearer ${req.token}`,
        'X-User-Id': req.user?.id || '',
      },
    });

    res.json(result);
  } catch (error: any) {
    next(createError(
      error.response?.data?.message || 'Failed to fetch consultation',
      error.response?.status || 500
    ));
  }
});

/**
 * POST /api/v1/consultations
 * Book a new consultation
 */
router.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await backendClient.post('/api/v1/consultations', req.body, {
      headers: {
        Authorization: `Bearer ${req.token}`,
        'X-User-Id': req.user?.id || '',
      },
    });

    res.status(201).json(result);
  } catch (error: any) {
    next(createError(
      error.response?.data?.message || 'Failed to book consultation',
      error.response?.status || 500
    ));
  }
});

/**
 * PUT /api/v1/consultations/:id/reschedule
 * Reschedule a consultation
 */
router.put('/:id/reschedule', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const result = await backendClient.put(
      `/api/v1/consultations/${id}/reschedule`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${req.token}`,
          'X-User-Id': req.user?.id || '',
        },
      }
    );

    res.json(result);
  } catch (error: any) {
    next(createError(
      error.response?.data?.message || 'Failed to reschedule consultation',
      error.response?.status || 500
    ));
  }
});

/**
 * PUT /api/v1/consultations/:id/cancel
 * Cancel a consultation
 */
router.put('/:id/cancel', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const result = await backendClient.put(
      `/api/v1/consultations/${id}/cancel`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${req.token}`,
          'X-User-Id': req.user?.id || '',
        },
      }
    );

    res.json(result);
  } catch (error: any) {
    next(createError(
      error.response?.data?.message || 'Failed to cancel consultation',
      error.response?.status || 500
    ));
  }
});

/**
 * PUT /api/v1/consultations/:id/confirm
 * Confirm a consultation
 */
router.put('/:id/confirm', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const result = await backendClient.put(
      `/api/v1/consultations/${id}/confirm`,
      {},
      {
        headers: {
          Authorization: `Bearer ${req.token}`,
          'X-User-Id': req.user?.id || '',
        },
      }
    );

    res.json(result);
  } catch (error: any) {
    next(createError(
      error.response?.data?.message || 'Failed to confirm consultation',
      error.response?.status || 500
    ));
  }
});

export default router;
