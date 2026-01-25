/**
 * Cloudflare Access Authentication Middleware
 */

import { Context, Next } from 'hono';
import type { Env, CFAccessJWT, UserContext, UserRole } from '@/env';

const ROLE_MAPPING: Record<string, UserRole> = {
  'evaluation-admins': 'ADMIN',
  'evaluation-hr': 'HR',
  'evaluation-managers': 'MANAGER',
  'evaluation-employees': 'EMPLOYEE',
};

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({
      success: false,
      error: {
        code: 'AUTH_TOKEN_MISSING',
        message: '認証トークンがありません',
        requestId: c.get('requestId'),
        timestamp: new Date().toISOString(),
      },
    }, 401);
  }

  const token = authHeader.slice(7);

  try {
    // Verify Cloudflare Access JWT
    const payload = await verifyCloudflareAccessToken(token, c.env);

    // Map user context and resolve employee from database
    const user = await resolveUserContext(payload, c.env.DB);
    c.set('user', user);
    c.set('jwtPayload', payload);

    await next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token verification failed';

    return c.json({
      success: false,
      error: {
        code: 'AUTH_TOKEN_INVALID',
        message: '認証トークンが無効です',
        details: [{ message }],
        requestId: c.get('requestId'),
        timestamp: new Date().toISOString(),
      },
    }, 401);
  }
}

async function verifyCloudflareAccessToken(token: string, env: Env): Promise<CFAccessJWT> {
  // Decode JWT payload (Cloudflare Access tokens are already verified at the edge)
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const payload = JSON.parse(atob(parts[1])) as CFAccessJWT;

  // Verify audience if configured
  if (env.CF_ACCESS_AUD) {
    if (!payload.aud.includes(env.CF_ACCESS_AUD)) {
      throw new Error('Invalid audience');
    }
  }

  // Verify expiration
  if (payload.exp * 1000 < Date.now()) {
    throw new Error('Token expired');
  }

  return payload;
}

async function resolveUserContext(payload: CFAccessJWT, db: D1Database): Promise<UserContext> {
  const groups = payload.custom?.groups || [];

  // Determine highest role based on priority: ADMIN > HR > MANAGER > EMPLOYEE
  const ROLE_PRIORITY: UserRole[] = ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'];

  let role: UserRole = 'EMPLOYEE';
  let currentPriority = ROLE_PRIORITY.indexOf(role);

  for (const group of groups) {
    const mappedRole = ROLE_MAPPING[group];
    if (mappedRole) {
      const newPriority = ROLE_PRIORITY.indexOf(mappedRole);
      if (newPriority < currentPriority) {
        role = mappedRole;
        currentPriority = newPriority;
      }
    }
  }

  // Look up employee in database by email
  const employee = await db
    .prepare('SELECT id, department_id, manager_id FROM employees WHERE email = ? AND is_active = 1')
    .bind(payload.email)
    .first<{ id: string; department_id: string | null; manager_id: string | null }>();

  if (!employee) {
    throw new Error('Employee not found');
  }

  return {
    id: payload.sub,
    email: payload.email,
    role,
    employeeId: employee.id,
    departmentId: employee.department_id ?? undefined,
    managerId: employee.manager_id ?? undefined,
  };
}

/**
 * Role-based authorization middleware factory
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const user = c.get('user') as UserContext;

    if (!user) {
      return c.json({
        success: false,
        error: {
          code: 'AUTH_TOKEN_MISSING',
          message: '認証が必要です',
          requestId: c.get('requestId'),
          timestamp: new Date().toISOString(),
        },
      }, 401);
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json({
        success: false,
        error: {
          code: 'AUTHZ_INSUFFICIENT_ROLE',
          message: 'この操作を実行する権限がありません',
          details: [{
            field: 'role',
            value: user.role,
            constraint: 'allowedRoles',
            message: `Required roles: ${allowedRoles.join(', ')}`,
          }],
          requestId: c.get('requestId'),
          timestamp: new Date().toISOString(),
        },
      }, 403);
    }

    await next();
  };
}
