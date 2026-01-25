/**
 * Notification Entity
 */

export interface Notification {
  id: string;
  employeeId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateNotificationInput {
  employeeId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}
