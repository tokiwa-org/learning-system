/**
 * 人事考課システム API
 * Cloudflare Workers + Hono
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { timing } from 'hono/timing';

import type { Env } from './env';
import { createContainer } from './container';
import type { AppVariables } from './adapters/in/http/types';

// Routes
import { authRoutes } from './adapters/in/http/routes/auth';
import { periodsRoutes } from './adapters/in/http/routes/periods';
import { cyclesRoutes } from './adapters/in/http/routes/cycles';
import { employeesRoutes } from './adapters/in/http/routes/employees';
import { roadmapRoutes } from './adapters/in/http/routes/roadmap';
import { scenariosRoutes } from './adapters/in/http/routes/scenarios';
import { curriculumsRoutes } from './adapters/in/http/routes/curriculums';
import { notificationsRoutes } from './adapters/in/http/routes/notifications';
import { dashboardRoutes } from './adapters/in/http/routes/dashboard';
import { adminRoutes } from './adapters/in/http/routes/admin';

// Middleware
import { authMiddleware } from './adapters/in/http/middleware/auth';
import { errorHandler } from './adapters/in/http/middleware/error-handler';

// Workflows
export { EvaluationWorkflow } from './workflows/evaluation-workflow';
export { CurriculumWorkflow } from './workflows/curriculum-workflow';

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// Global Middleware
app.use('*', timing());
app.use('*', secureHeaders());
app.use('*', cors({
  origin: (origin) => {
    // Allow Cloudflare Access origins
    if (origin?.endsWith('.tokiwa-tech.com')) return origin;
    if (origin === 'http://localhost:3000') return origin;
    return null;
  },
  credentials: true,
}));

// Request ID Middleware
app.use('*', async (c, next) => {
  const requestId = c.req.header('cf-ray') || crypto.randomUUID();
  c.set('requestId', requestId);
  c.header('X-Request-ID', requestId);
  await next();
});

// Logger (development only)
app.use('*', async (c, next) => {
  if (c.env.ENVIRONMENT !== 'production') {
    return logger()(c, next);
  }
  await next();
});

// Health Check (no auth required)
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    version: c.env.API_VERSION,
    environment: c.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
  });
});

// API Routes (with auth)
const api = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// Container middleware - creates DI container from env
api.use('*', async (c, next) => {
  const container = createContainer(c.env);
  c.set('container', container);
  await next();
});

// Auth middleware for all API routes
api.use('*', authMiddleware);

// Mount route handlers
api.route('/auth', authRoutes);
api.route('/periods', periodsRoutes);
api.route('/cycles', cyclesRoutes);
api.route('/employees', employeesRoutes);
api.route('/roadmap', roadmapRoutes);
api.route('/scenarios', scenariosRoutes);
api.route('/curriculums', curriculumsRoutes);
api.route('/notifications', notificationsRoutes);
api.route('/dashboard', dashboardRoutes);
api.route('/admin', adminRoutes);

// Mount API under /api/v1
app.route('/api/v1', api);

// 404 Handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found',
      path: c.req.path,
      requestId: c.get('requestId'),
      timestamp: new Date().toISOString(),
    },
  }, 404);
});

// Global Error Handler
app.onError(errorHandler);

export default app;
