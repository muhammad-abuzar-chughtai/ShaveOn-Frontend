import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { NotificationBellComponent } from '../shared/components/notification-bell.component';
import { ToastContainerComponent } from '../shared/components/toast-container.component';
import { ChangePasswordModalComponent } from '../shared/components/change-password-modal.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NotificationBellComponent, ToastContainerComponent, ChangePasswordModalComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly showChangePassword = signal(false);
  protected readonly showUserMenu = signal(false);
  // Off-canvas sidebar state for mobile/tablet - hidden by default below the lg breakpoint.
  protected readonly isSidebarOpen = signal(false);

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.isSidebarOpen.set(false);
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
  }

  goHome(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/'])
    );

    window.open(url, '_blank');
  }

  toggleUserMenu(): void {
    this.showUserMenu.update((v) => !v);
  }

  openChangePassword(): void {
    this.showUserMenu.set(false);
    this.showChangePassword.set(true);
  }
}
