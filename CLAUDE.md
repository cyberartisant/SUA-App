# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server at http://localhost:5173
npm run build     # Production build → dist/ (generates service worker via workbox)
npm run preview   # Serve the production build locally
```

No test runner or linter is configured — there are no `test` or `lint` scripts.

## Architecture

**SUA Fishing** is an offline-first PWA built with React + Vite. All data lives in `localStorage` — there is no backend or API. The app is linked to [suafishing.com](https://suafishing.com).

### Data layer (`src/utils/storage.js`)

Three `localStorage` keys drive everything:
- `fishinapp_users` — array of all registered users (passwords stored in plaintext — demo only, swap for a real backend when adding a server)
- `fishinapp_user` — the currently logged-in user object (sans password)
- `fishinapp_catches` — flat array of all catches across all users, filtered by `userId` at read time

`CatchContext` and `AuthContext` are the only consumers of the storage utils — pages and components never call storage directly.

### State management

Two React contexts wrap the entire app (see `src/App.jsx`):

```
AuthProvider → CatchProvider → AppRoutes
```

`CatchProvider` depends on `useAuth`, so the nesting order is required. `CatchContext` reloads its catches whenever the authenticated user changes (via `useEffect([user])`).

### Routing & layout

`Guard` redirects unauthenticated users to `/login`. Authenticated routes are wrapped in `Shell` (Header + scrollable `<main>` + BottomNav). Auth pages (`/login`, `/register`) render fullscreen with no shell.

### Catch data model

```js
{
  id: string,           // crypto.randomUUID()
  userId: string,
  species: string,
  weight: number|null,  // lbs
  length: number|null,  // inches
  date: string,         // YYYY-MM-DD
  time: string,         // HH:MM
  notes: string,
  photos: string[],     // base64 data URLs, max 3
  location: { lat, lng, name } | null,
  weather: { temp, feelsLike, description, icon, windSpeed, humidity, city } | null,
  createdAt: string     // ISO timestamp
}
```

Photos are stored as base64 strings in `localStorage` — this works for MVP but will hit storage limits with many high-res images.

### Weather

`src/utils/weather.js` calls OpenWeatherMap's `/data/2.5/weather` endpoint. The API key is stored in `localStorage` as `weather_api_key` and also on the user object as `user.weatherApiKey`. Users set it in the Profile page. Weather is fetched and attached to a catch at save time in `AddCatch.jsx`.

### Map

`MapView` uses `react-leaflet` with OpenStreetMap tiles (no API key needed). The Leaflet default marker icon fix (delete `_getIconUrl`, `mergeOptions` with bundled PNGs) is applied once in `src/main.jsx` at app startup.

### PWA / offline

`vite-plugin-pwa` (workbox) generates the service worker on `npm run build`. Two runtime caches are configured: OSM map tiles (`CacheFirst`, 1 week) and OpenWeatherMap responses (`NetworkFirst`, 10 min). In dev mode the service worker is not active.

PWA icons (`public/icons/icon-192.png`, `icon-512.png`) need to be generated from `public/logo.png` before deploying — the manifest references them but they don't exist yet.

### Styling

Single global stylesheet at `src/index.css` using CSS custom properties. All brand colors are defined in `:root` — update them there to retheme the app. No CSS framework or CSS modules. The layout is a flex column (`shell`) — no `position: fixed` on the header or nav.
