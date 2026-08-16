import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BarberApi } from '../../core/services/catalog.api';
import { BarberDto } from '../../core/models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-barbers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-barbers.component.html',
  styleUrl: '../../shared/styles/admin-shared.scss',
})
export class AdminBarbersComponent implements OnInit {
  private readonly api = inject(BarberApi);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly barbers = signal<BarberDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    isActive: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (data) => {
        this.barbers.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  get activeCount(): number {
    return this.barbers().filter((b) => b.isActive).length;
  }

  openCreateForm(): void {
    this.editingId.set(null);
    this.form.reset({ fullName: '', isActive: true });
    this.showForm.set(true);
  }

  openEditForm(barber: BarberDto): void {
    this.editingId.set(barber.id);
    this.form.reset({ fullName: barber.fullName, isActive: barber.isActive });
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
        this.toast.success(editingId ? 'Barber updated.' : 'Barber added.');
        this.saving.set(false);
        this.showForm.set(false);
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  toggleActive(barber: BarberDto): void {
    this.api.update(barber.id, { fullName: barber.fullName, isActive: !barber.isActive }).subscribe({
      next: () => {
        this.toast.success(barber.isActive ? 'Barber deactivated.' : 'Barber activated.');
        this.load();
      },
    });
  }
}
