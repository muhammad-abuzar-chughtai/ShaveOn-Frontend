import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription, switchMap, startWith } from 'rxjs';
import { NotificationApi } from '../../core/services/notification-dashboard.api';
import { NotificationDto } from '../../core/models';

const POLL_INTERVAL_MS = 60_000; // check for new notifications every 60s

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.scss',
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  private readonly api = inject(NotificationApi);
  private pollSub?: Subscription;

  protected readonly notifications = signal<NotificationDto[]>([]);
  protected readonly unreadCount = signal(0);
  protected readonly isOpen = signal(false);

  ngOnInit(): void {
    this.pollSub = interval(POLL_INTERVAL_MS)
      .pipe(
        startWith(0),
        switchMap(() => this.api.getMine()),
      )
      .subscribe({
        next: (list) => {
          this.notifications.set(list);
          this.unreadCount.set(list.filter((n) => !n.isRead).length);
        },
      });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  markRead(notification: NotificationDto): void {
    if (notification.isRead) return;
    this.api.markAsRead(notification.id).subscribe(() => {
      notification.isRead = true;
      this.unreadCount.update((c) => Math.max(0, c - 1));
    });
  }

  markAllRead(): void {
    this.api.markAllAsRead().subscribe(() => {
      this.notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
      this.unreadCount.set(0);
    });
  }
}
