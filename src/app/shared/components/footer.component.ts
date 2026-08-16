import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShopSettingsApi } from '../../core/services/catalog.api';
import { ShopSettingsDto } from '../../core/models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  private readonly shopSettingsApi = inject(ShopSettingsApi);

  protected readonly settings = signal<ShopSettingsDto | null>(null);
  protected readonly currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.shopSettingsApi.get().subscribe({
      next: (data) => this.settings.set(data),
      error: () => {
        /* footer degrades gracefully without shop settings - not critical path */
      },
    });
  }
}
