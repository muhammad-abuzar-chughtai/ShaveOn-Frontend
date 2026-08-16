import { BookingStatus } from './enums';

export interface CreateBookingRequest {
  bookingDate: string; // "yyyy-MM-dd"
  startTime: string; // "HH:mm:ss"
  serviceIds: number[];
}

export interface AdminCreateBookingRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  bookingDate: string;
  startTime: string;
  serviceIds: number[];
}

export interface BookingServiceItemDto {
  serviceId: number;
  serviceName: string;
  durationMinutes: number;
  price: number;
}

export interface BookingDto {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalDurationMinutes: number;
  totalPrice: number;
  depositAmount: number;
  status: BookingStatus;
  services: BookingServiceItemDto[];
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  createdAt: string;
}

export interface AvailableSlotDto {
  startTime: string;
  isAvailable: boolean;
}

export interface DaySlotsResponse {
  date: string;
  isShopOpen: boolean;
  slots: AvailableSlotDto[];
}
