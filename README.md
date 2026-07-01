# Sodiol Sayem Next.js Firebase SEO Portfolio

This is a full Next.js App Router conversion of the uploaded portfolio website. It includes SEO metadata, sitemap, robots file, Open Graph image support, structured data, Firebase Firestore storage, and a protected admin dashboard.

## Main features

1. Next.js App Router project structure
2. Firebase Admin SDK connected API routes
3. Firestore powered portfolio data and contact inquiries
4. SEO metadata with canonical URL, keywords, Open Graph, Twitter cards, robots, sitemap, and JSON LD structured data
5. Responsive portfolio sections for hero, skills, projects, experience, FAQ, and contact
6. Admin dashboard at `/admindashboard`
7. Contact form storing messages in Firestore
8. Uploaded project images added to `/public/projects`

## Project structure

```txt
src/app
  page.tsx
  layout.tsx
  sitemap.ts
  robots.ts
  admindashboard/page.tsx
  api/portfolio/route.ts
  api/inquiries/route.ts
  api/inquiries/[id]/route.ts
  api/admin/login/route.ts

src/components
  PortfolioClient.tsx
  DashboardClient.tsx
  Header.tsx
  Hero.tsx
  Projects.tsx
  Skills.tsx
  Experience.tsx
  Faq.tsx
  Contact.tsx
  AdminDashboard.tsx

src/lib
  data.ts
  firebaseAdmin.ts
  adminAuth.ts
  site.ts
```

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```txt
http://localhost:3000
```

Admin dashboard:

```txt
http://localhost:3000/admindashboard
```

## Firebase setup

Create a Firebase project, enable Firestore, then create a Firebase service account from Project settings. The easiest Vercel setup is to convert the service account JSON into base64 and paste it into `FIREBASE_SERVICE_ACCOUNT_BASE64`.

Example command:

```bash
base64 serviceAccountKey.json
```

Then add these variables to `.env.local` and Vercel Environment Variables:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
ADMIN_PASSWORD=your_secure_dashboard_password
ADMIN_TOKEN_SECRET=your_long_random_secret
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_service_account_json
```

Alternative Firebase variables:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

## Firestore collections

The project automatically creates and uses:

```txt
portfolio/sayem-profile
inquiries/{inquiryId}
```

## Deployment on Vercel

```bash
npm run build
```

Push the project to GitHub, import it into Vercel, add the environment variables, then deploy.

## SEO checklist included

1. Dynamic page title and description from portfolio data
2. Canonical URL through `NEXT_PUBLIC_SITE_URL`
3. Open Graph and Twitter preview image
4. `sitemap.xml`
5. `robots.txt`
6. Manifest icons
7. JSON LD Person, WebSite, and ItemList schema
8. Server rendered initial portfolio data for better crawling
