/**
 * Mark All Notifications as Read Use Case
 */

import type { NotificationRepository } from '@/domain/ports/out';

export interface MarkAllNotificationsReadInput {
  employeeId: string;
}

export interface MarkAllNotificationsReadOutput {
  updatedCount: number;
}

export class MarkAllNotificationsReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(input: MarkAllNotificationsReadInput): Promise<MarkAllNotificationsReadOutput> {
    const updatedCount = await this.notificationRepository.markAllAsRead(input.employeeId);

    return { updatedCount };
  }
}
