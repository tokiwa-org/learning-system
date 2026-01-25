/**
 * Cloudflare Workers Environment Bindings
 * 人事考課システム API
 */

import type { EvaluationWorkflow } from './workflows/evaluation-workflow';
import type { CurriculumWorkflow } from './workflows/curriculum-workflow';

export interface Env {
  // D1 Database
  DB: D1Database;

  // Workflows
  EVALUATION_WORKFLOW: Workflow<EvaluationWorkflow>;
  CURRICULUM_WORKFLOW: Workflow<CurriculumWorkflow>;

  // Queues
  NOTIFICATION_QUEUE: Queue<NotificationMessage>;

  // KV Namespace
  CACHE: KVNamespace;

  // AI
  AI: Ai;

  // Environment Variables
  CF_ACCESS_TEAM_NAME: string;
  API_VERSION: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';

  // Secrets (set via wrangler secret put)
  CF_ACCESS_AUD?: string;
  SLACK_WEBHOOK_URL?: string;
  EMAIL_API_KEY?: string;
  SENTRY_DSN?: string;
}

// Notification Queue Message Types
export interface NotificationMessage {
  type: NotificationType;
  recipientId: string;
  recipientEmail?: string;
  data: Record<string, unknown>;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  scheduledAt?: string;
}

export type NotificationType =
  | 'SELF_EVALUATION_START'
  | 'SELF_EVALUATION_REMINDER'
  | 'PEER_EVALUATION_REQUEST'
  | 'PEER_EVALUATION_REMINDER'
  | 'MANAGER_EVALUATION_REQUEST'
  | 'MANAGER_EVALUATION_REMINDER'
  | 'HR_APPROVAL_REQUEST'
  | 'EVALUATION_REJECTED'
  | 'EVALUATION_REJECTED_BY_HR'
  | 'EVALUATION_FINALIZED'
  | 'CURRICULUM_ASSIGNED'
  | 'CURRICULUM_DEADLINE_NEAR'
  | 'CURRICULUM_OVERDUE'
  | 'CURRICULUM_REVIEW_REQUEST'
  | 'CURRICULUM_COMPLETED';

// Cloudflare Access JWT Claims
export interface CFAccessJWT {
  aud: string[];
  email: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  identity_nonce: string;
  custom?: {
    groups?: string[];
  };
}

// Application User Context
export interface UserContext {
  id: string;
  email: string;
  role: UserRole;
  employeeId: string;
  departmentId?: string;
  managerId?: string;
}

export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'HR' | 'ADMIN';

// Workflow Types
export interface WorkflowEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
  source: 'API' | 'SYSTEM' | 'CRON' | 'USER';
  sourceId?: string;
}

// Extend Hono Context
declare module 'hono' {
  interface ContextVariableMap {
    requestId: string;
    user: UserContext;
    jwtPayload: CFAccessJWT;
    container: import('./container').Container;
  }
}
