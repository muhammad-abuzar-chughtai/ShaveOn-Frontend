import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardApi } from '../../core/services/notification-dashboard.api';
import { AdminDashboardDto, BookingStatus } from '../../core/models';
import { formatTimeLabel } from '../../shared/utils/date-time.util';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-overview.component.html',
  styleUrl: '../../shared/styles/admin-shared.scss',
})
export class AdminOverviewComponent implements OnInit {
  private readonly dashboardApi = inject(DashboardApi);

  protected readonly formatTimeLabel = formatTimeLabel;
  protected readonly BookingStatus = BookingStatus;
  protected readonly data = signal<AdminDashboardDto | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.dashboardApi.get().subscribe({
      next: (d) => {
        this.data.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
