import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceCatalogApi } from '../../core/services/catalog.api';
import { ServiceDto } from '../../core/models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-services.component.html',
  styleUrl: '../../shared/styles/admin-shared.scss',
})
export class AdminServicesComponent implements OnInit {
  private readonly api = inject(ServiceCatalogApi);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly services = signal<ServiceDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    durationMinutes: [30, [Validators.required, Validators.min(5), Validators.max(480)]],
    price: [0, [Validators.required, Validators.min(0)]],
    isActive: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.api.getAllForAdmin().subscribe({
      next: (data) => {
        this.services.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreateForm(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', description: '', durationMinutes: 30, price: 0, isActive: true });
    this.showForm.set(true);
  }

  openEditForm(service: ServiceDto): void {
    this.editingId.set(service.id);
    this.form.reset({
      name: service.name,
      description: service.description ?? '',
      durationMinutes: service.durationMinutes,
      price: service.price,
      isActive: service.isActive,
    });
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue();
    const editingId = this.editingId();

    const request$ = editingId ? this.api.update(editingId, payload) : this.api.create(payload);

    request$.subscribe({
      next: () => {
        this.toast.success(editingId ? 'Service updated.' : 'Service created.');
        this.saving.set(false);
        this.showForm.set(false);
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  deactivate(service: ServiceDto): void {
    if (!confirm(`Deactivate "${service.name}"? It will no longer appear on the booking form.`)) return;

    this.api.delete(service.id).subscribe({
      next: () => {
        this.toast.success('Service deactivated.');
        this.load();
      },
    });
  }
}
