import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceCatalogApi } from '../../core/services/catalog.api';
import { AvailabilityApi, BookingApi } from '../../core/services/booking.api';
import { ToastService } from '../../core/services/toast.service';
import { AvailableSlotDto, ServiceDto } from '../../core/models';
import { formatTimeLabel, todayDateString } from '../../shared/utils/date-time.util';

@Component({
  selector: 'app-admin-new-booking-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-new-booking-modal.component.html',
  styleUrls: ['../../shared/styles/modal-shared.scss', './admin-new-booking-modal.component.scss'],
})
export class AdminNewBookingModalComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly serviceApi = inject(ServiceCatalogApi);
  private readonly availabilityApi = inject(AvailabilityApi);
  private readonly bookingApi = inject(BookingApi);
  private readonly toast = inject(ToastService);

  protected readonly formatTimeLabel = formatTimeLabel;
  protected readonly minDate = todayDateString();

  protected readonly customerForm = this.fb.nonNullable.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    customerPhone: ['', [Validators.required]],
    customerEmail: [''],
  });

  protected readonly services = signal<ServiceDto[]>([]);
  protected readonly selectedServiceIds = signal<Set<number>>(new Set());
  protected readonly selectedDate = signal<string>(todayDateString());
  protected readonly selectedSlot = signal<string | null>(null);
  protected readonly slots = signal<AvailableSlotDto[]>([]);
  protected readonly isShopOpen = signal(true);
  protected readonly loadingSlots = signal(false);
  protected readonly submitting = signal(false);

  protected readonly selectedServices = computed(() =>
    this.services().filter((s) => this.selectedServiceIds().has(s.id)),
  );
  protected readonly totalDuration = computed(() =>
    this.selectedServices().reduce((sum, s) => sum + s.durationMinutes, 0),
  );
  protected readonly totalPrice = computed(() =>
    this.selectedServices().reduce((sum, s) => sum + s.price, 0),
  );

  ngOnInit(): void {
    this.serviceApi.getActive().subscribe({ next: (data) => this.services.set(data) });
  }

  toggleService(serviceId: number): void {
    const next = new Set(this.selectedServiceIds());
    next.has(serviceId) ? next.delete(serviceId) : next.add(serviceId);
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

  submit(): void {
    if (this.customerForm.invalid || this.selectedServices().length === 0 || !this.selectedSlot()) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const customer = this.customerForm.getRawValue();

    this.bookingApi
      .createForWalkIn({
        customerName: customer.customerName,
        customerPhone: customer.customerPhone,
        customerEmail: customer.customerEmail || null,
        bookingDate: this.selectedDate(),
        startTime: this.selectedSlot()!,
        serviceIds: this.selectedServices().map((s) => s.id),
      })
      .subscribe({
        next: () => {
          this.toast.success('Booking created.');
          this.created.emit();
        },
        error: () => {
          this.submitting.set(false);
          this.refreshSlots();
        },
      });
  }

  close(): void {
    this.closed.emit();
  }
}
