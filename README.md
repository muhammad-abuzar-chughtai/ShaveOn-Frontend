# ShaveOn Frontend

Frontend for **ShaveOn**, a barbershop booking management system. Built with Angular 21,
standalone components, and Signals.

> This is a demo/portfolio project. See [License](#license) below.

## Tech Stack

- **Angular 21** — standalone components, Signals (no NgModules)
- **Bootstrap 5** — fully rethemed via centralized SCSS design tokens, no default Bootstrap look
- **TypeScript**, Reactive Forms
- **Font Awesome** for icons

## Design System

Corporate, ERP-inspired visual direction, built to spec rather than default AI-generated styling:

- **Color**: white background, near-black text (`#1A1A1A`), purple accent (`#5B2C8F`) for
  navigation, buttons, and links
- **Radius**: 5px everywhere (buttons, cards, inputs) — precise and structured, not the
  soft consumer-app look
- **Type**: Plus Jakarta Sans (headings) / Inter (body) / IBM Plex Mono (prices, times,
  booking data — the one deliberate "data-table" tell, used only where numbers matter)
- **Signature element**: the booking form's summary panel behaves like a POS receipt —
  itemized services with mono-spaced prices and a running total, since a booking is
  fundamentally a transaction

All tokens live in `src/app/styles/_variables.scss` — change values there to retheme the
entire app in one place.

## Features

**Public site**: Home, About, Contact, Privacy Policy, Login/Signup.

**Booking flow**: service checklist → live receipt panel (price/duration update as you
select) → date + real-time slot picker → confirm. No guest checkout — accounts are required
so customers get a booking history.

**Customer Dashboard**: upcoming bookings, next-appointment reminder card, history, cancel,
change password.

**Admin Panel** (ERP-style sidebar layout, fully responsive with an off-canvas mobile drawer):
- Dashboard — today's stats and schedule at a glance
- Bookings — filterable table, cancel, **book on behalf of a walk-in/phone customer**
- Schedule — toggle any day off, set hours, set a recurring daily break, add one-off date
  exceptions (holidays, private events)
- Services & Barbers — full CRUD; barber count directly controls booking capacity
- Shop Settings — deposit %, booking window, contact info

## Project Structure

```
src/app/
  core/           Models, API services, auth (Signal-based session state), interceptors, guards
  shared/         Reusable components (navbar, footer, modals, notification bell), utils, styles
  layout/         Main (public/customer) layout and Admin layout shells
  features/
    landing/      Home, About, Contact, Privacy Policy
    auth/         Login, Register
    booking/      The booking form
    customer-dashboard/
    admin/        All 6 admin screens + the walk-in booking modal
```

## Getting Started (local)

```powershell
npm install
npm start
```

Runs at `http://localhost:4200`, configured to call the backend at `http://localhost:5000/api`
(see `src/environments/environment.ts`). Requires the `shaveon-backend` API running locally
alongside it — see that repo's README.

Before deploying, update `src/environments/environment.prod.ts` with your real backend URL.

## Testing

```powershell
npm test
```

## Deployment

Deployed to Vercel. `vercel.json` is already configured with the correct build output path
(`dist/frontend/browser`) and SPA routing fallback.

## License

No license is granted. This repository is public for portfolio/demonstration purposes only.
All rights reserved — viewing is welcome, but reuse, modification, or redistribution of this
code requires explicit permission.
