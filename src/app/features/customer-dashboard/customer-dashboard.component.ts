import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingApi } from '../../core/services/booking.api';
import { BookingDto, BookingStatus } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { formatDateLabel, formatTimeLabel, todayDateString } from '../../shared/utils/date-time.util';
import { ChangePasswordModalComponent } from '../../shared/components/change-password-modal.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ChangePasswordModalComponent],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss',
})
export class CustomerDashboardComponent implements OnInit {
  private readonly bookingApi = inject(BookingApi);
  private readonly toast = inject(ToastService);
  protected readonly auth = inject(AuthService);

  protected readonly showChangePassword = signal(false);

  protected readonly formatDateLabel = formatDateLabel;
  protected readonly formatTimeLabel = formatTimeLabel;
  protected readonly BookingStatus = BookingStatus;

  protected readonly bookings = signal<BookingDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly cancellingId = signal<number | null>(null);

  private readonly today = todayDateString();

  protected readonly upcoming = computed(() =>
    this.bookings()
      .filter((b) => b.bookingDate >= this.today && b.status === BookingStatus.Confirmed)
      .sort((a, b) => (a.bookingDate + a.startTime).localeCompare(b.bookingDate + b.startTime)),
  );

  protected readonly history = computed(() =>
    this.bookings()
      .filter((b) => b.bookingDate < this.today || b.status !== BookingStatus.Confirmed)
      .sort((a, b) => (b.bookingDate + b.startTime).localeCompare(a.bookingDate + a.startTime)),
  );

  protected readonly nextBooking = computed(() => this.upcoming()[0] ?? null);

  ngOnInit(): void {
    this.loadBookings();
  }

  private loadBookings(): void {
    this.loading.set(true);
    this.bookingApi.getMine().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  cancelBooking(booking: BookingDto): void {
    if (!confirm(`Cancel your booking on ${this.formatDateLabel(booking.bookingDate)} at ${this.formatTimeLabel(booking.startTime)}?`)) {
      return;
    }

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

  statusLabel(status: BookingStatus): string {
    return BookingStatus[status];
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
