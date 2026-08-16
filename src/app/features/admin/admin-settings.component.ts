import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShopSettingsApi } from '../../core/services/catalog.api';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrl: '../../shared/styles/admin-shared.scss',
})
export class AdminSettingsComponent implements OnInit {
  private readonly api = inject(ShopSettingsApi);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    shopName: ['', [Validators.required]],
    address: ['', [Validators.required]],
    contactPhone: ['', [Validators.required]],
    contactEmail: ['', [Validators.required, Validators.email]],
    depositPercentage: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
    bookingWindowDays: [14, [Validators.required, Validators.min(1), Validators.max(90)]],
    minLeadTimeMinutes: [30, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.api.get().subscribe({
      next: (data) => {
        this.form.reset(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.api.update(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.success('Shop settings updated.');
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }
}
