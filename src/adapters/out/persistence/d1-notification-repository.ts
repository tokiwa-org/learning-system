/**
 * D1 Notification Repository Implementation
 */

import type { Notification, CreateNotificationInput } from '@/domain/entities';
import type { NotificationRepository } from '@/domain/ports/out';

export class D1NotificationRepository implements NotificationRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<Notification | null> {
    const result = await this.db
      .prepare('SELECT * FROM notifications WHERE id = ?')
      .bind(id)
      .first<NotificationRow>();

    return result ? this.mapToEntity(result) : null;
  }

  async findByEmployeeId(
    employeeId: string,
    options?: {
      unreadOnly?: boolean;
      page?: number;
      limit?: number;
    }
  ): Promise<{ data: Notification[]; total: number }> {
    const conditions: string[] = ['employee_id = ?'];
    const params: unknown[] = [employeeId];

    if (options?.unreadOnly) {
      conditions.push('is_read = 0');
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const countResult = await this.db
      .prepare(`SELECT COUNT(*) as count FROM notifications ${whereClause}`)
      .bind(...params)
      .first<{ count: number }>();

    const dataResult = await this.db
      .prepare(
        `SELECT * FROM notifications ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`
      )
      .bind(...params, limit, offset)
      .all<NotificationRow>();

    return {
      data: (dataResult.results ?? []).map((row) => this.mapToEntity(row)),
      total: countResult?.count ?? 0,
    };
  }

  async create(input: CreateNotificationInput): Promise<Notification> {
    const id = `notif_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `INSERT INTO notifications (id, employee_id, type, title, message, link, is_read, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 0, ?)`
      )
      .bind(
        id,
        input.employeeId,
        input.type,
        input.title,
        input.message,
        input.link ?? null,
        now
      )
      .run();

    return this.findById(id) as Promise<Notification>;
  }

  async markAsRead(id: string): Promise<void> {
    await this.db
      .prepare('UPDATE notifications SET is_read = 1 WHERE id = ?')
      .bind(id)
      .run();
  }

  async markAllAsRead(employeeId: string): Promise<number> {
    const result = await this.db
      .prepare('UPDATE notifications SET is_read = 1 WHERE employee_id = ? AND is_read = 0')
      .bind(employeeId)
      .run();

    return result.meta.changes ?? 0;
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM notifications WHERE id = ?').bind(id).run();
  }

  private mapToEntity(row: NotificationRow): Notification {
    return {
      id: row.id,
      employeeId: row.employee_id,
      type: row.type,
      title: row.title,
      message: row.message,
      link: row.link ?? undefined,
      isRead: Boolean(row.is_read),
      createdAt: row.created_at,
    };
  }
}

interface NotificationRow {
  id: string;
  employee_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: number;
  created_at: string;
}
