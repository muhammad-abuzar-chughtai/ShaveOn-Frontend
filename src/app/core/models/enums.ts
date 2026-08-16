export enum UserRole {
  Customer = 'Customer',
  Admin = 'Admin',
}

export enum BookingStatus {
  Confirmed = 0,
  Cancelled = 1,
  Completed = 2,
  NoShow = 3,
}

export enum WeekDay {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export const WEEK_DAY_LABELS: Record<WeekDay, string> = {
  [WeekDay.Sunday]: 'Sunday',
  [WeekDay.Monday]: 'Monday',
  [WeekDay.Tuesday]: 'Tuesday',
  [WeekDay.Wednesday]: 'Wednesday',
  [WeekDay.Thursday]: 'Thursday',
  [WeekDay.Friday]: 'Friday',
  [WeekDay.Saturday]: 'Saturday',
};

export enum NotificationType {
  NewBooking = 0,
  BookingCancelled = 1,
  BookingReminder = 2,
}
