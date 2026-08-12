import { Router } from "express";
import { authMiddleware, createError } from "../middleware";
import type { AuthenticatedRequest } from "../middleware";
import * as backendClient from "../services/backend-client";

const router = Router();

// All business routes require authentication
router.use(authMiddleware);

/**
 * GET /api/v1/business
 * Get all businesses for the authenticated user
 */
router.get("/", async (req: AuthenticatedRequest, res, next) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.query;

    const result = await backendClient.get("/api/v1/business", {
      params: { page, limit, sortBy, sortOrder },
      headers: {
        Authorization: `Bearer ${req.token}`,
        "X-User-Id": req.user?.id || "",
      },
    });

    res.json(result);
  } catch (error: any) {
    next(
      createError(
        error.response?.data?.message || "Failed to fetch businesses",
        error.response?.status || 500,
      ),
    );
  }
});

/**
 * GET /api/v1/business/:id
 * Get a single business by ID
 */
router.get("/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const result = await backendClient.get(`/api/v1/business/${id}`, {
      headers: {
        Authorization: `Bearer ${req.token}`,
        "X-User-Id": req.user?.id || "",
      },
    });

    res.json(result);
  } catch (error: any) {
    next(
      createError(
        error.response?.data?.message || "Failed to fetch business",
        error.response?.status || 500,
      ),
    );
  }
});

/**
 * POST /api/v1/business
 * Create a new business registration
 */
router.post("/", async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await backendClient.post("/api/v1/business", req.body, {
      headers: {
        Authorization: `Bearer ${req.token}`,
        "X-User-Id": req.user?.id || "",
      },
    });

    res.status(201).json(result);
  } catch (error: any) {
    next(
      createError(
        error.response?.data?.message || "Failed to create business",
        error.response?.status || 500,
      ),
    );
  }
});

/**
 * PUT /api/v1/business/:id
 * Update a business
 */
router.put("/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const result = await backendClient.put(`/api/v1/business/${id}`, req.body, {
      headers: {
        Authorization: `Bearer ${req.token}`,
        "X-User-Id": req.user?.id || "",
      },
    });

    res.json(result);
  } catch (error: any) {
    next(
      createError(
        error.response?.data?.message || "Failed to update business",
        error.response?.status || 500,
      ),
    );
  }
});

/**
 * DELETE /api/v1/business/:id
 * Delete a business (draft only)
 */
router.delete("/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const result = await backendClient.del(`/api/v1/business/${id}`, {
      headers: {
        Authorization: `Bearer ${req.token}`,
        "X-User-Id": req.user?.id || "",
      },
    });

    res.json(result);
  } catch (error: any) {
    next(
      createError(
        error.response?.data?.message || "Failed to delete business",
        error.response?.status || 500,
      ),
    );
  }
});

/**
 * GET /api/v1/business/:id/steps
 * Get registration steps for a business
 */
router.get("/:id/steps", async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const result = await backendClient.get(`/api/v1/business/${id}/steps`, {
      headers: {
        Authorization: `Bearer ${req.token}`,
        "X-User-Id": req.user?.id || "",
      },
    });

    res.json(result);
  } catch (error: any) {
    next(
      createError(
        error.response?.data?.message || "Failed to fetch registration steps",
        error.response?.status || 500,
      ),
    );
  }
});

/**
 * GET /api/v1/business/:id/documents
 * Get documents for a business
 */
router.get("/:id/documents", async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const result = await backendClient.get(`/api/v1/business/${id}/documents`, {
      headers: {
        Authorization: `Bearer ${req.token}`,
        "X-User-Id": req.user?.id || "",
      },
    });

    res.json(result);
  } catch (error: any) {
    next(
      createError(
        error.response?.data?.message || "Failed to fetch documents",
        error.response?.status || 500,
      ),
    );
  }
});

/**
 * POST /api/v1/business/:id/documents
 * Upload a document
 */
router.post("/:id/documents", async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    // Forward multipart form data to backend
    const result = await backendClient.post(
      `/api/v1/business/${id}/documents`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${req.token}`,
          "X-User-Id": req.user?.id || "",
          "Content-Type": req.headers["content-type"] || "application/json",
        },
      },
    );

    res.status(201).json(result);
  } catch (error: any) {
    next(
      createError(
        error.response?.data?.message || "Failed to upload document",
        error.response?.status || 500,
      ),
    );
  }
});

/**
 * DELETE /api/v1/business/:businessId/documents/:documentId
 * Delete a document
 */
router.delete(
  "/:businessId/documents/:documentId",
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { businessId, documentId } = req.params;

      const result = await backendClient.del(
        `/api/v1/business/${businessId}/documents/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${req.token}`,
            "X-User-Id": req.user?.id || "",
          },
        },
      );

      res.json(result);
    } catch (error: any) {
      next(
        createError(
          error.response?.data?.message || "Failed to delete document",
          error.response?.status || 500,
        ),
      );
    }
  },
);

export default router;
