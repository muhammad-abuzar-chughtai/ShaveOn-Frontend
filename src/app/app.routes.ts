import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/landing/home.component').then((m) => m.HomeComponent),
        title: 'ShaveOn - Book Your Slot',
      },
      {
        path: 'about',
        loadComponent: () => import('./features/landing/about.component').then((m) => m.AboutComponent),
        title: 'About - ShaveOn',
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/landing/contact.component').then((m) => m.ContactComponent),
        title: 'Contact - ShaveOn',
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('./features/landing/privacy-policy.component').then((m) => m.PrivacyPolicyComponent),
        title: 'Privacy Policy - ShaveOn',
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
        title: 'Log In - ShaveOn',
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/register.component').then((m) => m.RegisterComponent),
        title: 'Sign Up - ShaveOn',
      },
      {
        path: 'book',
        canActivate: [authGuard],
        loadComponent: () => import('./features/booking/book-slot.component').then((m) => m.BookSlotComponent),
        title: 'Book Your Slot - ShaveOn',
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/customer-dashboard/customer-dashboard.component').then((m) => m.CustomerDashboardComponent),
        title: 'My Bookings - ShaveOn',
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/admin-overview.component').then((m) => m.AdminOverviewComponent),
        title: 'Admin Dashboard - ShaveOn',
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/admin/admin-bookings.component').then((m) => m.AdminBookingsComponent),
        title: 'Bookings - ShaveOn Admin',
      },
      {
        path: 'schedule',
        loadComponent: () => import('./features/admin/admin-schedule.component').then((m) => m.AdminScheduleComponent),
        title: 'Schedule - ShaveOn Admin',
      },
      {
        path: 'services',
        loadComponent: () => import('./features/admin/admin-services.component').then((m) => m.AdminServicesComponent),
        title: 'Services - ShaveOn Admin',
      },
      {
        path: 'barbers',
        loadComponent: () => import('./features/admin/admin-barbers.component').then((m) => m.AdminBarbersComponent),
        title: 'Barbers - ShaveOn Admin',
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/admin-settings.component').then((m) => m.AdminSettingsComponent),
        title: 'Shop Settings - ShaveOn Admin',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
