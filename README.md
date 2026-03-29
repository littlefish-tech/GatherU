This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Introduction

GatherU is a campus and community events platform for discovering, creating, and booking local events in one place. It is designed to help students browse upcoming meetups, workshops, hackathons, and social events, while also giving organizers a simple way to publish new events with images and structured details.

The app includes:

- a homepage with featured events
- an events listing page
- an event detail page with booking support
- a create-event flow with image upload

## Next.js 16 Features Used Here

This project uses the App Router and modern Next.js 16 caching features.

### Cache Components

- `cacheComponents: true` is enabled in [next.config.ts](./next.config.ts).
- This turns on the current Cache Components model used by `use cache`.

### Data-Level Caching

The project caches database reads at the function level in [lib/actions/event.actions.ts](./lib/actions/event.actions.ts):

- `getEvents()`
- `getEventBySlug(slug)`

Each of these uses:

- `'use cache'` to cache the async function result
- `cacheLife('hours')` to define the cache profile
- `cacheTag(...)` to tag cached event data

This follows the current Next.js 16 recommendation of caching the data function itself instead of having Server Components fetch the app's own API routes.

### Cache Invalidation

This project uses tag-based invalidation so cached event data can refresh after writes:

- [lib/actions/booking.actions.ts](./lib/actions/booking.actions.ts) uses `updateTag(...)` inside a Server Action after a booking is created
- [app/api/events/route.ts](./app/api/events/route.ts) uses `revalidateTag(..., 'max')` inside the Route Handler after an event is created

The difference is intentional:

- `updateTag()` is the modern choice for immediate read-your-own-writes behavior in Server Actions
- `revalidateTag(..., 'max')` is the recommended Route Handler pattern and uses stale-while-revalidate semantics

### Route Features

The project also uses several current App Router conventions:

- dynamic routing with [app/events/[slug]/page.tsx](./app/events/[slug]/page.tsx)
- route-level loading UI with [app/events/[slug]/loading.tsx](./app/events/[slug]/loading.tsx)
- route-level not-found UI with [app/events/[slug]/not-found.tsx](./app/events/[slug]/not-found.tsx)
- metadata-based app icons via [app/icon.png](./app/icon.png) and [app/favicon.ico](./app/favicon.ico)

### In Practice

When the app reads event data:

- MongoDB is queried through cached server functions
- repeated requests can reuse cached results
- tags let related pages share the same cached data

When the app writes event data:

- creating an event revalidates `events` and `event:${slug}`
- creating a booking updates `events` and `event:${slug}`

That means event lists and event detail pages refresh using the current Next.js 16 cache model instead of older `unstable_cache`-based patterns.

## Frontend and Backend

### Frontend

- Next.js 16.2.1 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- `next/image` and `next/link`
- client components for interactive forms like booking and event creation

### Backend

- Next.js Route Handlers for API endpoints
- Server Actions for booking mutations
- MongoDB with Mongoose
- hybrid image uploads:
  local fallback to `public/images` during development and Vercel Blob when `BLOB_READ_WRITE_TOKEN` is available

## Supported Routes

### App Routes

- `/`
  Home page with featured events
- `/events`
  Event listing page
- `/events/create`
  Create event page with local image upload
- `/events/[slug]`
  Event detail page

### Route Files

- [app/page.tsx](./app/page.tsx)
- [app/events/page.tsx](./app/events/page.tsx)
- [app/events/create/page.tsx](./app/events/create/page.tsx)
- [app/events/[slug]/page.tsx](./app/events/[slug]/page.tsx)
- [app/events/[slug]/loading.tsx](./app/events/[slug]/loading.tsx)
- [app/events/[slug]/not-found.tsx](./app/events/[slug]/not-found.tsx)

## Supported API

### Event API

- `GET /api/events`
  Returns all events
- `GET /api/events/[slug]`
  Returns a single event by slug
- `POST /api/events`
  Creates a new event and uploads its image either to local storage or Vercel Blob

### API Route Files

- [app/api/events/route.ts](./app/api/events/route.ts)
- [app/api/events/[slug]/route.ts](./app/api/events/[slug]/route.ts)

### Booking Backend

Booking is handled through a Server Action instead of a public `/api/bookings` route.

- [lib/actions/booking.actions.ts](./lib/actions/booking.actions.ts)
- [components/BookEvent.tsx](./components/BookEvent.tsx)

When a user submits the booking form on an event detail page, the client component calls the `createBooking(...)` Server Action, which writes the booking into MongoDB and updates related cache tags.

## How Users Book Events

1. Open an event detail page at `/events/[slug]`
2. Enter an email address in the booking form
3. Click `Submit`
4. The app creates a booking record for that event
5. The booking count on the page updates after the mutation

## Data Layer

### Database Models

- [database/event.model.ts](./database/event.model.ts)
- [database/booking.model.ts](./database/booking.model.ts)

### Server Utilities

- [lib/mongodb.ts](./lib/mongodb.ts)
- [lib/actions/event.actions.ts](./lib/actions/event.actions.ts)
- [lib/actions/booking.actions.ts](./lib/actions/booking.actions.ts)

## Deployment Note

This project supports a hybrid upload flow for event images.

Behavior:

- if `BLOB_READ_WRITE_TOKEN` is available, uploads are stored in Vercel Blob
- otherwise, uploads fall back to the local filesystem under `public/images`

In practice:

- local development works without Vercel Blob because files can still be written to `public/images`
- production on Vercel should use Vercel Blob so uploaded images persist reliably

This means the app can keep working locally while also being ready for deployment on Vercel once `BLOB_READ_WRITE_TOKEN` is configured.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
