import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  BarberDto,
  ServiceDto,
  ShopSettingsDto,
  UpdateShopSettingsRequest,
  UpsertBarberRequest,
  UpsertServiceRequest,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ServiceCatalogApi {
  private readonly base = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  getActive(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(this.base);
  }

  getAllForAdmin(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(`${this.base}/all`);
  }

  create(request: UpsertServiceRequest): Observable<ServiceDto> {
    return this.http.post<ServiceDto>(this.base, request);
  }

  update(id: number, request: UpsertServiceRequest): Observable<ServiceDto> {
    return this.http.put<ServiceDto>(`${this.base}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class BarberApi {
  private readonly base = `${environment.apiUrl}/barbers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BarberDto[]> {
    return this.http.get<BarberDto[]>(this.base);
  }

  create(request: UpsertBarberRequest): Observable<BarberDto> {
    return this.http.post<BarberDto>(this.base, request);
  }

  update(id: number, request: UpsertBarberRequest): Observable<BarberDto> {
    return this.http.put<BarberDto>(`${this.base}/${id}`, request);
  }
}

@Injectable({ providedIn: 'root' })
export class ShopSettingsApi {
  private readonly base = `${environment.apiUrl}/shop-settings`;

  constructor(private http: HttpClient) {}

  get(): Observable<ShopSettingsDto> {
    return this.http.get<ShopSettingsDto>(this.base);
  }

  update(request: UpdateShopSettingsRequest): Observable<ShopSettingsDto> {
    return this.http.put<ShopSettingsDto>(this.base, request);
  }
}
