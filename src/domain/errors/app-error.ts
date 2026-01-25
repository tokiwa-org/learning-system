/**
 * Application Error Classes
 * 詳細設計書 01_エラーハンドリング仕様 に基づく実装
 */

export interface ErrorDetail {
  field?: string;
  value?: unknown;
  constraint?: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
    requestId?: string;
    timestamp: string;
  };
}

export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: number;
  readonly details?: ErrorDetail[];
  readonly timestamp: string;

  constructor(message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toResponse(requestId?: string): ErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        requestId,
        timestamp: this.timestamp,
      },
    };
  }
}

// Validation Errors (400)
export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly httpStatus = 400;

  static requiredField(field: string): ValidationError {
    return new ValidationError('必須項目が入力されていません', [{
      field,
      constraint: 'required',
      message: `${field}は必須です`,
    }]);
  }

  static scoreOutOfRange(value: number): ValidationError {
    return new ValidationError('スコアは1〜5の範囲で入力してください', [{
      field: 'score',
      value,
      constraint: 'range',
      message: 'スコアは1〜5の範囲で入力してください',
    }]);
  }

  static invalidDateRange(): ValidationError {
    return new ValidationError('開始日は終了日より前である必要があります', [{
      constraint: 'dateRange',
      message: '開始日は終了日より前である必要があります',
    }]);
  }
}

// Authentication Errors (401)
export class AuthenticationError extends AppError {
  readonly httpStatus = 401;

  constructor(readonly code: string, message: string) {
    super(message);
  }

  static tokenMissing(): AuthenticationError {
    return new AuthenticationError('AUTH_TOKEN_MISSING', '認証トークンがありません');
  }

  static tokenInvalid(): AuthenticationError {
    return new AuthenticationError('AUTH_TOKEN_INVALID', '認証トークンが無効です');
  }

  static tokenExpired(): AuthenticationError {
    return new AuthenticationError('AUTH_TOKEN_EXPIRED', '認証トークンが期限切れです');
  }
}

// Authorization Errors (403)
export class AuthorizationError extends AppError {
  readonly httpStatus = 403;

  constructor(readonly code: string, message: string, details?: ErrorDetail[]) {
    super(message, details);
  }

  static insufficientRole(requiredRole: string, actualRole: string): AuthorizationError {
    return new AuthorizationError('AUTHZ_INSUFFICIENT_ROLE', 'この操作を実行する権限がありません', [{
      field: 'role',
      value: actualRole,
      constraint: 'requiredRole',
      message: `Required: ${requiredRole}, Actual: ${actualRole}`,
    }]);
  }

  static notOwner(): AuthorizationError {
    return new AuthorizationError('AUTHZ_NOT_OWNER', '自分のリソースのみ操作可能です');
  }

  static notManager(): AuthorizationError {
    return new AuthorizationError('AUTHZ_NOT_MANAGER', 'この社員の上司ではありません');
  }
}

// Not Found Errors (404)
export class NotFoundError extends AppError {
  readonly code = 'DATABASE_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(resource: string, id: string) {
    super(`${resource}が見つかりません: ${id}`, [{
      field: 'id',
      value: id,
      message: `${resource} not found`,
    }]);
  }

  static employee(id: string): NotFoundError {
    return new NotFoundError('Employee', id);
  }

  static period(id: string): NotFoundError {
    return new NotFoundError('EvaluationPeriod', id);
  }

  static cycle(id: string): NotFoundError {
    return new NotFoundError('EvaluationCycle', id);
  }

  static roadmapItem(id: string): NotFoundError {
    return new NotFoundError('RoadmapItem', id);
  }

  static notification(id: string): NotFoundError {
    return new NotFoundError('Notification', id);
  }

  static scenario(id: string): NotFoundError {
    return new NotFoundError('Scenario', id);
  }

  static curriculum(id: string): NotFoundError {
    return new NotFoundError('Curriculum', id);
  }

  static curriculumAssignment(id: string): NotFoundError {
    return new NotFoundError('CurriculumAssignment', id);
  }
}

// Workflow Errors (409)
export class WorkflowError extends AppError {
  readonly httpStatus = 409;

  constructor(readonly code: string, message: string, details?: ErrorDetail[]) {
    super(message, details);
  }

  static invalidTransition(currentStatus: string, action: string): WorkflowError {
    return new WorkflowError('WORKFLOW_INVALID_TRANSITION', 'この状態からの遷移は許可されていません', [{
      field: 'status',
      value: currentStatus,
      constraint: 'transition',
      message: `Cannot perform ${action} from status ${currentStatus}`,
    }]);
  }

  static alreadySubmitted(): WorkflowError {
    return new WorkflowError('WORKFLOW_ALREADY_SUBMITTED', '既に提出済みです');
  }

  static peerIncomplete(): WorkflowError {
    return new WorkflowError('WORKFLOW_PEER_INCOMPLETE', '同僚評価が完了していません');
  }

  static periodNotActive(): WorkflowError {
    return new WorkflowError('WORKFLOW_PERIOD_NOT_ACTIVE', '評価期間がアクティブではありません');
  }

  static alreadyFinalized(): WorkflowError {
    return new WorkflowError('WORKFLOW_ALREADY_FINALIZED', '既に確定済みの評価は変更できません');
  }
}

// Business Rule Errors (400)
export class BusinessRuleError extends AppError {
  readonly httpStatus = 400;

  constructor(readonly code: string, message: string, details?: ErrorDetail[]) {
    super(message, details);
  }

  static selfEvaluationOwnOnly(): BusinessRuleError {
    return new BusinessRuleError('BUSINESS_SELF_EVALUATION_OWN_ONLY', '自分以外の自己評価は提出できません');
  }

  static peerSelfEvaluation(): BusinessRuleError {
    return new BusinessRuleError('BUSINESS_PEER_SELF_EVALUATION', '自分自身を同僚評価することはできません');
  }

  static duplicatePeer(): BusinessRuleError {
    return new BusinessRuleError('BUSINESS_DUPLICATE_PEER', '同じ社員への同僚評価は1回のみです');
  }
}

// External Service Errors (502/504)
export class ExternalServiceError extends AppError {
  readonly httpStatus: number;

  constructor(readonly code: string, service: string, originalError?: Error) {
    super(`${service}への接続に失敗しました`);
    this.httpStatus = code.includes('TIMEOUT') ? 504 : 502;
  }

  static aiGenerationFailed(error?: Error): ExternalServiceError {
    return new ExternalServiceError('EXTERNAL_AI_GENERATION_FAILED', 'Cloudflare AI', error);
  }

  static aiTimeout(): ExternalServiceError {
    return new ExternalServiceError('EXTERNAL_AI_TIMEOUT', 'Cloudflare AI');
  }

  static notificationFailed(error?: Error): ExternalServiceError {
    return new ExternalServiceError('EXTERNAL_NOTIFICATION_FAILED', 'Notification Service', error);
  }
}

// Database Errors (409/500)
export class DatabaseError extends AppError {
  constructor(readonly code: string, message: string, readonly httpStatus: number = 500) {
    super(message);
  }

  static conflict(): DatabaseError {
    return new DatabaseError('DATABASE_CONFLICT', 'データの競合が発生しました', 409);
  }

  static constraintViolation(constraint: string): DatabaseError {
    return new DatabaseError('DATABASE_CONSTRAINT_VIOLATION', `データ整合性制約違反です: ${constraint}`, 409);
  }

  static connectionFailed(): DatabaseError {
    return new DatabaseError('DATABASE_CONNECTION_FAILED', 'データベース接続に失敗しました', 503);
  }
}
