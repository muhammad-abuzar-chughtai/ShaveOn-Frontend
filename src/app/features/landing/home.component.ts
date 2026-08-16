import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServiceCatalogApi } from '../../core/services/catalog.api';
import { ServiceDto } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly serviceApi = inject(ServiceCatalogApi);
  protected readonly services = signal<ServiceDto[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.serviceApi.getActive().subscribe({
      next: (data) => {
        this.services.set(data.slice(0, 6));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
