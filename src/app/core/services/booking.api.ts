import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BookingDto, CreateBookingRequest, AdminCreateBookingRequest, DaySlotsResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AvailabilityApi {
  private readonly base = `${environment.apiUrl}/availability`;

  constructor(private http: HttpClient) {}

  getDaySlots(date: string, durationMinutes: number): Observable<DaySlotsResponse> {
    return this.http.get<DaySlotsResponse>(this.base, {
      params: { date, durationMinutes },
    });
  }
}

@Injectable({ providedIn: 'root' })
export class BookingApi {
  private readonly base = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  create(request: CreateBookingRequest): Observable<BookingDto> {
    return this.http.post<BookingDto>(this.base, request);
  }

  createForWalkIn(request: AdminCreateBookingRequest): Observable<BookingDto> {
    return this.http.post<BookingDto>(`${this.base}/admin`, request);
  }

  getMine(): Observable<BookingDto[]> {
    return this.http.get<BookingDto[]>(`${this.base}/mine`);
  }

  getAll(date?: string): Observable<BookingDto[]> {
    const params: Record<string, string> = {};
    if (date) params['date'] = date;
    return this.http.get<BookingDto[]>(this.base, { params });
  }

  cancel(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/cancel`, {});
  }
}
