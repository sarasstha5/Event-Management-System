# EventFlow — Frontend

React + Tailwind CSS frontend for the Event Management System (Group 6 spec).
This is a static/mock frontend — wire it up to your existing backend by
replacing the arrays in `src/data/mockData.js` with real API calls to your
`/events`, `/categories`, `/registrations`, and `/users` endpoints.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Structure

```
src/
  components/     Shared UI: Button, Badge, EventCard (ticket-stub design),
                   StatCard, Input/Select/Textarea, Table, Modal, DashboardShell
  layouts/         PublicLayout, UserLayout, AdminLayout
  pages/
    public/        Home, About, UpcomingEvents, EventDetails, Login, Register, Contact
    user/          Dashboard, BrowseEvents, MyRegistrations, Profile
    admin/         Dashboard, EventManagement, CategoryManagement,
                   ParticipantManagement, RegistrationManagement
  data/mockData.js Mock data shaped like the MySQL tables (users, categories,
                   events, registrations) + small formatting helpers
```

## Design system

- **Colors**: paper (bg), ink (text), cobalt (primary action/links), amber (accent/warnings)
- **Type**: Fraunces (display/headings), Inter (body/UI), IBM Plex Mono (data, dates, labels)
- **Signature element**: event cards are styled like ticket stubs — a perforated
  tear-line separates event info from a rotated date-stamp side, echoing a
  physical event ticket throughout the browsing and detail pages.

## Wiring to your backend

Each page currently imports from `src/data/mockData.js`. To connect the real
API:
1. Add a small `fetch` wrapper (e.g. `src/lib/api.js`) that attaches your JWT
   from wherever you store it (localStorage, cookie, etc.) as an
   `Authorization: Bearer <token>` header.
2. Replace the mock imports in each page with calls to that wrapper
   (`GET /events`, `POST /registrations`, etc. — see the API list in the spec).
3. Forms in `EventManagement`, `CategoryManagement`, `Login`, and `Register`
   already have the right fields — just wire their `onSubmit` handlers to
   your `POST`/`PUT` calls.
