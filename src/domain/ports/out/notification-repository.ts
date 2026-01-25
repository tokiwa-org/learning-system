/**
 * Notification Repository Port (Outbound)
 */

import type { Notification, CreateNotificationInput } from '@/domain/entities';

export interface NotificationRepository {
  findById(id: string): Promise<Notification | null>;

  findByEmployeeId(
    employeeId: string,
    options?: {
      unreadOnly?: boolean;
      page?: number;
      limit?: number;
    }
  ): Promise<{ data: Notification[]; total: number }>;

  create(input: CreateNotificationInput): Promise<Notification>;

  markAsRead(id: string): Promise<void>;

  markAllAsRead(employeeId: string): Promise<number>;

  delete(id: string): Promise<void>;
}
