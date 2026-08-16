import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminDashboardDto, NotificationDto } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationApi {
  private readonly base = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getMine(unreadOnly = false): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(this.base, { params: { unreadOnly } });
  }

  markAsRead(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.post<void>(`${this.base}/read-all`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly base = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  get(): Observable<AdminDashboardDto> {
    return this.http.get<AdminDashboardDto>(this.base);
  }
}
