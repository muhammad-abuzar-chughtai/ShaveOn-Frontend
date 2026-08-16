import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateScheduleOverrideRequest,
  ScheduleOverrideDto,
  UpdateWorkingHourRequest,
  WeekDay,
  WorkingHourDto,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ScheduleApi {
  private readonly base = `${environment.apiUrl}/schedule`;

  constructor(private http: HttpClient) {}

  getWorkingHours(): Observable<WorkingHourDto[]> {
    return this.http.get<WorkingHourDto[]>(`${this.base}/working-hours`);
  }

  updateWorkingHour(day: WeekDay, request: UpdateWorkingHourRequest): Observable<WorkingHourDto> {
    return this.http.put<WorkingHourDto>(`${this.base}/working-hours/${day}`, request);
  }

  getOverrides(fromDate?: string): Observable<ScheduleOverrideDto[]> {
    const url = fromDate ? `${this.base}/overrides?fromDate=${fromDate}` : `${this.base}/overrides`;
    return this.http.get<ScheduleOverrideDto[]>(url);
  }

  createOverride(request: CreateScheduleOverrideRequest): Observable<ScheduleOverrideDto> {
    return this.http.post<ScheduleOverrideDto>(`${this.base}/overrides`, request);
  }

  deleteOverride(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/overrides/${id}`);
  }
}
