import { NotificationType } from './enums';
import { BookingDto } from './booking.model';

export interface NotificationDto {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  bookingId: number | null;
  createdAt: string;
}

export interface AdminDashboardDto {
  todayBookingsCount: number;
  upcomingBookingsCount: number;
  unreadNotificationsCount: number;
  todayRevenue: number;
  todayBookings: BookingDto[];
}

export interface ShopSettingsDto {
  shopName: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  depositPercentage: number;
  bookingWindowDays: number;
  minLeadTimeMinutes: number;
}

export type UpdateShopSettingsRequest = ShopSettingsDto;
