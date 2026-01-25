/**
 * List Notifications Use Case
 */

import type { Notification } from '@/domain/entities';
import type { NotificationRepository } from '@/domain/ports/out';

export interface ListNotificationsInput {
  employeeId: string;
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface ListNotificationsOutput {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
  };
}

export class ListNotificationsUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(input: ListNotificationsInput): Promise<ListNotificationsOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;

    const result = await this.notificationRepository.findByEmployeeId(input.employeeId, {
      unreadOnly: input.unreadOnly,
      page,
      limit,
    });

    return {
      notifications: result.data,
      pagination: {
        total: result.total,
        page,
        limit,
        hasNext: page * limit < result.total,
      },
    };
  }
}
