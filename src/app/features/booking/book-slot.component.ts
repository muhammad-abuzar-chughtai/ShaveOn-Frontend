import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceCatalogApi, ShopSettingsApi } from '../../core/services/catalog.api';
import { AvailabilityApi, BookingApi } from '../../core/services/booking.api';
import { ToastService } from '../../core/services/toast.service';
import { AvailableSlotDto, ServiceDto, ShopSettingsDto } from '../../core/models';
import { formatTimeLabel, todayDateString } from '../../shared/utils/date-time.util';

@Component({
  selector: 'app-book-slot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-slot.component.html',
  styleUrl: './book-slot.component.scss',
})
export class BookSlotComponent implements OnInit {
  private readonly serviceApi = inject(ServiceCatalogApi);
  private readonly shopSettingsApi = inject(ShopSettingsApi);
  private readonly availabilityApi = inject(AvailabilityApi);
  private readonly bookingApi = inject(BookingApi);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly formatTimeLabel = formatTimeLabel;

  // ----- Static reference data -----
  protected readonly services = signal<ServiceDto[]>([]);
  protected readonly shopSettings = signal<ShopSettingsDto | null>(null);
  protected readonly loadingServices = signal(true);

  // ----- Selection state -----
  protected readonly selectedServiceIds = signal<Set<number>>(new Set());
  protected readonly selectedDate = signal<string>(todayDateString());
  protected readonly selectedSlot = signal<string | null>(null);

  // ----- Slot data -----
  protected readonly slots = signal<AvailableSlotDto[]>([]);
  protected readonly isShopOpen = signal(true);
  protected readonly loadingSlots = signal(false);
  protected readonly submitting = signal(false);

  // ----- Derived (computed) values - the receipt panel reads from these -----
  protected readonly selectedServices = computed(() =>
    this.services().filter((s) => this.selectedServiceIds().has(s.id)),
  );
  protected readonly totalDuration = computed(() =>
    this.selectedServices().reduce((sum, s) => sum + s.durationMinutes, 0),
  );
  protected readonly totalPrice = computed(() =>
    this.selectedServices().reduce((sum, s) => sum + s.price, 0),
  );
  protected readonly depositAmount = computed(() => {
    const pct = this.shopSettings()?.depositPercentage ?? 10;
    return Math.round(this.totalPrice() * (pct / 100) * 100) / 100;
  });
  protected readonly maxDate = computed(() => {
    const days = this.shopSettings()?.bookingWindowDays ?? 14;
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  });
  protected readonly minDate = todayDateString();

  ngOnInit(): void {
    this.serviceApi.getActive().subscribe({
      next: (data) => {
        this.services.set(data);
        this.loadingServices.set(false);
      },
      error: () => this.loadingServices.set(false),
    });

    this.shopSettingsApi.get().subscribe({ next: (data) => this.shopSettings.set(data) });
  }

  toggleService(serviceId: number): void {
    const next = new Set(this.selectedServiceIds());
    if (next.has(serviceId)) {
      next.delete(serviceId);
    } else {
      next.add(serviceId);
    }
    this.selectedServiceIds.set(next);
    this.selectedSlot.set(null);
    this.refreshSlots();
  }

  onDateChange(value: string): void {
    this.selectedDate.set(value);
    this.selectedSlot.set(null);
    this.refreshSlots();
  }

  selectSlot(slot: AvailableSlotDto): void {
    if (!slot.isAvailable) return;
    this.selectedSlot.set(slot.startTime);
  }

  private refreshSlots(): void {
    const duration = this.totalDuration();
    if (duration <= 0) {
      this.slots.set([]);
      return;
    }

    this.loadingSlots.set(true);
    this.availabilityApi.getDaySlots(this.selectedDate(), duration).subscribe({
      next: (response) => {
        this.isShopOpen.set(response.isShopOpen);
        this.slots.set(response.slots);
        this.loadingSlots.set(false);
      },
      error: () => this.loadingSlots.set(false),
    });
  }

  confirmBooking(): void {
    if (this.selectedServices().length === 0 || !this.selectedSlot()) return;

    this.submitting.set(true);
    this.bookingApi
      .create({
        bookingDate: this.selectedDate(),
        startTime: this.selectedSlot()!,
        serviceIds: this.selectedServices().map((s) => s.id),
      })
      .subscribe({
        next: () => {
          this.toast.success('Booking confirmed! See you soon.');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.submitting.set(false);
          // Slot may have just been taken by someone else - refresh the grid so the user can pick again.
          this.refreshSlots();
        },
      });
  }
}
