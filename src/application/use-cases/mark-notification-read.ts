/**
 * Mark Notification as Read Use Case
 */

import type { Notification } from '@/domain/entities';
import type { NotificationRepository } from '@/domain/ports/out';
import { NotFoundError } from '@/domain/errors/app-error';

export interface MarkNotificationReadInput {
  notificationId: string;
  employeeId: string;
}

export interface MarkNotificationReadOutput {
  notification: Notification;
}

export class MarkNotificationReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(input: MarkNotificationReadInput): Promise<MarkNotificationReadOutput> {
    const notification = await this.notificationRepository.findById(input.notificationId);

    if (!notification) {
      throw NotFoundError.notification(input.notificationId);
    }

    // Check ownership
    if (notification.employeeId !== input.employeeId) {
      throw NotFoundError.notification(input.notificationId);
    }

    await this.notificationRepository.markAsRead(input.notificationId);

    return {
      notification: {
        ...notification,
        isRead: true,
      },
    };
  }
}
