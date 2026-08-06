# Express Glass — Website & Admin Portal

Production-oriented Next.js App Router site for **Express Glass** (Riverside / Corona / Southern California), with a MongoDB-powered CMS admin portal, local image uploads, lead forms, SEO, and cinematic glass-inspired UI.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- MongoDB + Mongoose
- NextAuth (credentials) + bcryptjs
- React Hook Form + Zod
- Framer Motion + GSAP + Lenis
- Sharp (image resize / WebP)
- TipTap-ready blog editor path, Recharts dashboard
- Nodemailer (optional notifications)

## Quick start

1. Install MongoDB locally (or use Atlas).
2. Copy environment template:

```bash
copy .env.example .env.local
```

3. Set at least:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/express_glass
AUTH_SECRET=generate-a-long-random-string
NEXTAUTH_SECRET=generate-a-long-random-string
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@localhost.local
ADMIN_PASSWORD=Admin123!ChangeMe
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MAX_UPLOAD_SIZE_MB=10
UPLOADS_DIRECTORY=public/uploads
```

4. Install and seed:

```bash
npm install
npm run seed
npm run dev
```

5. Open:
   - Site: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

`ADMIN_EMAIL` / `ADMIN_PASSWORD` are for the **admin login only**. The public business email stays empty until you enter it under **Admin → Settings**. Until then, the site shows a development “email pending” warning.

## MongoDB Compass

1. Start MongoDB.
2. Open Compass and connect to `mongodb://127.0.0.1:27017`.
3. Select database `express_glass`.
4. Inspect collections: `services`, `pages`, `sitesettings`, `faqs`, `inquiries`, `estimaterequests`, etc.

Atlas works without code changes: set `MONGODB_URI` to your Atlas connection string.

## Seed data

`npm run seed` upserts:

- Admin user from env credentials
- Verified business settings (phones, address, license `#898000`, Mario / SoCal history, service areas, 10% senior/military offer)
- All 12 services and CMS pages
- FAQ categories / FAQs (no invented warranties)
- Gallery categories
- Draft blog posts (not published)
- **No fake published testimonials**

## Public routes

`/`, `/about`, `/services`, `/services/[slug]`, `/service-areas`, `/gallery`, `/testimonials`, `/faq`, `/contact`, `/blog`, `/blog/[slug]`, `/privacy-policy`, `/terms-and-conditions`, `/accessibility`

## Admin routes

`/admin/login`, `/admin`, `/admin/pages`, `/admin/pages/[slug]`, `/admin/services`, `/admin/services/new`, `/admin/services/[id]`, `/admin/gallery`, `/admin/testimonials`, `/admin/faqs`, `/admin/inquiries`, `/admin/estimates`, `/admin/media`, `/admin/blogs`, `/admin/settings`

## Local uploads

Files are stored under:

- `public/uploads/pages/`
- `public/uploads/services/`
- `public/uploads/gallery/`
- `public/uploads/testimonials/`
- `public/uploads/blogs/`
- `public/uploads/settings/`

Upload API validates MIME type, extension, size, safe filenames, path traversal, and uses Sharp for resize + WebP. Architecture is adapter-based (`lib/uploads.ts`) so another storage backend can replace the local filesystem later.

### Important deployment limitation

Local filesystem uploads work for **local development** and **persistent Node.js servers**. **Vercel’s runtime filesystem is not reliable permanent storage** for user uploads. Do not assume uploaded media will persist on Vercel. For Vercel/serverless production, connect a persistent store (S3, R2, etc.) via the storage adapter.

## Email notifications

Contact and estimate forms always save to MongoDB. Nodemailer notifications send only when SMTP / recipient configuration is present (`CONTACT_RECIPIENT_EMAIL` or Settings → contact recipient). Business public email is editable in Settings and starts empty by design.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run seed
```

## Brand / logo

Creative EG monogram SVGs live in `public/logos/` (horizontal, icon, light/dark variants) plus `public/favicon.svg`.

## Verified business facts (do not invent extras)

- Express Glass — licensed, bonded, insured — CA Contractor’s License **#898000**
- Phone: **(951) 371-2601**
- Fax: **(951) 496-4305**
- Address: mobile service (Riverside, CA area — no public shop address)
- Hours: Mon–Fri 8:00 a.m.–5:00 p.m.; Saturday by appointment
- Mobile service; no in-shop repairs
- Started in New York in 1980; Southern California since 2003; owner Mario
- Optional Christian-owned statement is Settings-controlled
