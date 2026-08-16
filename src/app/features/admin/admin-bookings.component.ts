import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingApi } from '../../core/services/booking.api';
import { BookingDto, BookingStatus } from '../../core/models';
import { ToastService } from '../../core/services/toast.service';
import { formatDateLabel, formatTimeLabel, todayDateString } from '../../shared/utils/date-time.util';
import { AdminNewBookingModalComponent } from './admin-new-booking-modal.component';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, AdminNewBookingModalComponent],
  templateUrl: './admin-bookings.component.html',
  styleUrl: '../../shared/styles/admin-shared.scss',
})
export class AdminBookingsComponent implements OnInit {
  private readonly bookingApi = inject(BookingApi);
  private readonly toast = inject(ToastService);

  protected readonly formatDateLabel = formatDateLabel;
  protected readonly formatTimeLabel = formatTimeLabel;
  protected readonly BookingStatus = BookingStatus;

  protected readonly bookings = signal<BookingDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly cancellingId = signal<number | null>(null);
  protected readonly dateFilter = signal<string>(todayDateString());
  protected readonly showAllDates = signal(false);
  protected readonly showNewBookingModal = signal(false);

  ngOnInit(): void {
    this.loadBookings();
  }

  onBookingCreated(): void {
    this.showNewBookingModal.set(false);
    this.loadBookings();
  }

  toggleShowAll(): void {
    this.showAllDates.update((v) => !v);
    this.loadBookings();
  }

  onDateFilterChange(value: string): void {
    this.dateFilter.set(value);
    this.loadBookings();
  }

  private loadBookings(): void {
    this.loading.set(true);
    const date = this.showAllDates() ? undefined : this.dateFilter();
    this.bookingApi.getAll(date).subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  cancelBooking(booking: BookingDto): void {
    if (!confirm(`Cancel ${booking.customerName}'s booking on ${this.formatDateLabel(booking.bookingDate)}?`)) return;

    this.cancellingId.set(booking.id);
    this.bookingApi.cancel(booking.id).subscribe({
      next: () => {
        this.toast.success('Booking cancelled.');
        this.cancellingId.set(null);
        this.loadBookings();
      },
      error: () => this.cancellingId.set(null),
    });
  }

  statusBadgeClass(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.Confirmed: return 'status-badge--confirmed';
      case BookingStatus.Cancelled: return 'status-badge--cancelled';
      case BookingStatus.Completed: return 'status-badge--completed';
      case BookingStatus.NoShow: return 'status-badge--noshow';
      default: return '';
    }
  }
}
