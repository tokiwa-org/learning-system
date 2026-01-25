/**
 * Global Error Handler Middleware
 */

import { Context } from 'hono';
import type { Env } from '@/env';
import type { AppVariables } from '../types';
import { AppError } from '@/domain/errors/app-error';

export function errorHandler(err: Error, c: Context<{ Bindings: Env; Variables: AppVariables }>): Response {
  const requestId = c.get('requestId') || crypto.randomUUID();

  // Log error
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    category: 'ERROR',
    message: err.message,
    requestId,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    context: {
      method: c.req.method,
      path: c.req.path,
      userAgent: c.req.header('user-agent'),
    },
    environment: c.env.ENVIRONMENT,
    service: 'evaluation-api',
  }));

  // Handle AppError instances
  if (err instanceof AppError) {
    return c.json(err.toResponse(requestId), err.httpStatus as 400 | 401 | 403 | 404 | 409 | 500);
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    const zodError = err as any;
    return c.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '入力データにエラーがあります',
        details: zodError.errors?.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message,
          constraint: e.code,
        })),
        requestId,
        timestamp: new Date().toISOString(),
      },
    }, 400);
  }

  // Handle D1 database errors
  if (err.message?.includes('D1_ERROR') || err.message?.includes('SQLITE')) {
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'データベースエラーが発生しました',
        requestId,
        timestamp: new Date().toISOString(),
      },
    }, 500);
  }

  // Default: Internal Server Error
  return c.json({
    success: false,
    error: {
      code: 'SYSTEM_INTERNAL_ERROR',
      message: 'システムエラーが発生しました',
      requestId,
      timestamp: new Date().toISOString(),
    },
  }, 500);
}
