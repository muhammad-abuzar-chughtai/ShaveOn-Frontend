import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShopSettingsApi } from '../../core/services/catalog.api';
import { ShopSettingsDto } from '../../core/models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private readonly shopSettingsApi = inject(ShopSettingsApi);
  protected readonly settings = signal<ShopSettingsDto | null>(null);

  ngOnInit(): void {
    this.shopSettingsApi.get().subscribe({ next: (data) => this.settings.set(data) });
  }
}
