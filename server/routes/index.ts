import { Router } from 'express';
import businessRouter from './business';
import consultationRouter from './consultation';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
router.use('/business', businessRouter);
router.use('/consultations', consultationRouter);

export default router;
