import { WeekDay } from './enums';

export interface WorkingHourDto {
  id: number;
  day: WeekDay;
  isOpen: boolean;
  openTime: string; // "HH:mm:ss"
  closeTime: string;
  breakStart: string | null;
  breakEnd: string | null;
}

export interface UpdateWorkingHourRequest {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart: string | null;
  breakEnd: string | null;
}

export interface ScheduleOverrideDto {
  id: number;
  date: string; // "yyyy-MM-dd"
  isFullDayClosed: boolean;
  closedStart: string | null;
  closedEnd: string | null;
  reason: string | null;
}

export interface CreateScheduleOverrideRequest {
  date: string;
  isFullDayClosed: boolean;
  closedStart: string | null;
  closedEnd: string | null;
  reason: string | null;
}
