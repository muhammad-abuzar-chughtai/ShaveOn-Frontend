import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScheduleApi } from '../../core/services/schedule.api';
import { ScheduleOverrideDto, WEEK_DAY_LABELS, WeekDay, WorkingHourDto } from '../../core/models';
import { ToastService } from '../../core/services/toast.service';
import { formatDateLabel, todayDateString } from '../../shared/utils/date-time.util';

@Component({
  selector: 'app-admin-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-schedule.component.html',
  styleUrl: '../../shared/styles/admin-shared.scss',
})
export class AdminScheduleComponent implements OnInit {
  private readonly api = inject(ScheduleApi);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly weekDayLabels = WEEK_DAY_LABELS;
  protected readonly formatDateLabel = formatDateLabel;
  protected readonly minDate = todayDateString();

  protected readonly workingHours = signal<WorkingHourDto[]>([]);
  protected readonly overrides = signal<ScheduleOverrideDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly savingDay = signal<WeekDay | null>(null);

  protected readonly showOverrideForm = signal(false);
  protected readonly savingOverride = signal(false);

  protected readonly overrideForm = this.fb.nonNullable.group({
    date: [this.minDate, [Validators.required]],
    isFullDayClosed: [true],
    closedStart: [''],
    closedEnd: [''],
    reason: [''],
  });

  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading.set(true);
    this.api.getWorkingHours().subscribe({
      next: (data) => {
        this.workingHours.set([...data].sort((a, b) => a.day - b.day));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.api.getOverrides(this.minDate).subscribe({ next: (data) => this.overrides.set(data) });
  }

  toggleDayOpen(day: WorkingHourDto): void {
    this.updateDay(day, { isOpen: !day.isOpen });
  }

  onTimeChange(day: WorkingHourDto, field: 'openTime' | 'closeTime' | 'breakStart' | 'breakEnd', value: string): void {
    this.updateDay(day, { [field]: value || null } as Partial<WorkingHourDto>);
  }

  private updateDay(day: WorkingHourDto, changes: Partial<WorkingHourDto>): void {
    const merged: WorkingHourDto = { ...day, ...changes };
    this.savingDay.set(day.day);

    this.api
      .updateWorkingHour(day.day, {
        isOpen: merged.isOpen,
        openTime: merged.openTime,
        closeTime: merged.closeTime,
        breakStart: merged.breakStart,
        breakEnd: merged.breakEnd,
      })
      .subscribe({
        next: (updated) => {
          this.workingHours.update((list) => list.map((d) => (d.day === updated.day ? updated : d)));
          this.savingDay.set(null);
          this.toast.success(`${this.weekDayLabels[day.day]} hours updated.`);
        },
        error: () => this.savingDay.set(null),
      });
  }

  openOverrideForm(): void {
    this.overrideForm.reset({ date: this.minDate, isFullDayClosed: true, closedStart: '', closedEnd: '', reason: '' });
    this.showOverrideForm.set(true);
  }

  saveOverride(): void {
    if (this.overrideForm.invalid) {
      this.overrideForm.markAllAsTouched();
      return;
    }

    const value = this.overrideForm.getRawValue();
    if (!value.isFullDayClosed && (!value.closedStart || !value.closedEnd)) {
      this.toast.error('Provide a closed time window, or mark the whole day as closed.');
      return;
    }

    this.savingOverride.set(true);
    this.api
      .createOverride({
        date: value.date,
        isFullDayClosed: value.isFullDayClosed,
        closedStart: value.isFullDayClosed ? null : value.closedStart,
        closedEnd: value.isFullDayClosed ? null : value.closedEnd,
        reason: value.reason || null,
      })
      .subscribe({
        next: () => {
          this.toast.success('Schedule override added.');
          this.savingOverride.set(false);
          this.showOverrideForm.set(false);
          this.loadAll();
        },
        error: () => this.savingOverride.set(false),
      });
  }

  deleteOverride(override: ScheduleOverrideDto): void {
    if (!confirm(`Remove the override for ${this.formatDateLabel(override.date)}?`)) return;

    this.api.deleteOverride(override.id).subscribe({
      next: () => {
        this.toast.success('Override removed.');
        this.loadAll();
      },
    });
  }
}
