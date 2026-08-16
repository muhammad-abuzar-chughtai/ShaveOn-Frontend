import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, ChangePasswordRequest, LoginRequest, RegisterRequest } from '../models';

const STORAGE_KEY = 'shaveon_auth';

interface StoredAuth {
  token: string;
  expiresAtUtc: string;
  userId: number;
  fullName: string;
  email: string;
  role: 'Admin' | 'Customer';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Single source of truth for session state - everything else derives from this signal.
  private readonly authState = signal<StoredAuth | null>(this.readFromStorage());

  readonly currentUser = computed(() => this.authState());
  readonly isAuthenticated = computed(() => this.authState() !== null && !this.isExpired());
  readonly isAdmin = computed(() => this.authState()?.role === 'Admin');
  readonly fullName = computed(() => this.authState()?.fullName ?? '');

  constructor(private http: HttpClient, private router: Router) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap((response) => this.persistSession(response)),
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => this.persistSession(response)),
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.authState.set(null);
    this.router.navigate(['/login']);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, request);
  }

  getToken(): string | null {
    const state = this.authState();
    return state && !this.isExpired() ? state.token : null;
  }

  private persistSession(response: AuthResponse): void {
    const toStore: StoredAuth = {
      token: response.token,
      expiresAtUtc: response.expiresAtUtc,
      userId: response.userId,
      fullName: response.fullName,
      email: response.email,
      role: response.role,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    this.authState.set(toStore);
  }

  private isExpired(): boolean {
    const state = this.authState();
    if (!state) return true;
    return new Date(state.expiresAtUtc).getTime() <= Date.now();
  }

  private readFromStorage(): StoredAuth | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as StoredAuth;
    } catch {
      return null;
    }
  }
}
