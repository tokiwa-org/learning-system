/**
 * 認証関連 API Routes
 * OpenAPI: /api/v1/auth/*
 */

import { Hono } from 'hono';
import type { Env, UserContext } from '@/env';

export const authRoutes = new Hono<{ Bindings: Env; Variables: { requestId: string; user: UserContext } }>();

// GET /auth/me - 現在のユーザー情報取得
authRoutes.get('/me', async (c) => {
  const user = c.get('user');
  const container = c.get('container');

  const result = await container.getCurrentUser.execute({ user });

  return c.json({
    success: true,
    data: result,
  });
});

// POST /auth/logout - ログアウト
authRoutes.post('/logout', async (c) => {
  // Cloudflare Access handles session management
  return c.json({
    success: true,
    data: {
      message: 'ログアウトしました',
      redirectUrl: `https://${c.env.CF_ACCESS_TEAM_NAME}.cloudflareaccess.com/cdn-cgi/access/logout`,
    },
  });
});

// GET /auth/permissions - 権限情報取得
authRoutes.get('/permissions', async (c) => {
  const user = c.get('user');

  const permissions = getPermissionsByRole(user.role);

  return c.json({
    success: true,
    data: {
      role: user.role,
      permissions,
    },
  });
});

function getPermissionsByRole(role: string): string[] {
  const basePermissions = [
    'self-evaluation:read',
    'self-evaluation:write',
    'peer-evaluation:read',
    'dashboard:read',
    'notifications:read',
  ];

  const managerPermissions = [
    ...basePermissions,
    'subordinates:read',
    'manager-evaluation:write',
    'approval:manager',
  ];

  const hrPermissions = [
    ...managerPermissions,
    'employees:read',
    'employees:write',
    'periods:write',
    'scenarios:write',
    'curriculums:write',
    'approval:hr',
    'reports:read',
  ];

  const adminPermissions = [
    ...hrPermissions,
    'admin:read',
    'admin:write',
    'settings:write',
  ];

  switch (role) {
    case 'ADMIN':
      return adminPermissions;
    case 'HR':
      return hrPermissions;
    case 'MANAGER':
      return managerPermissions;
    default:
      return basePermissions;
  }
}
