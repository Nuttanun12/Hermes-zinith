# Hermes-Zenith — Corporate Website

> **Premium Industrial Solutions & Equipment**  
> A multilingual corporate website for Hermes-Zenith, a leading provider of industrial process rotating equipment solutions including lubrication systems, filtration technologies, and contamination control products.

---

## 🌐 Live Preview

Access the site at `http://localhost:3000` after running the development server. The app auto-redirects to the best-matched locale (`/en`, `/th`, or `/zh`) based on the browser's `Accept-Language` header.

---

## ✨ Features

### Public-Facing Pages
| Route | Description |
|---|---|
| `/{lang}/` | Home — hero, features, about snapshot, product highlights, contact form |
| `/{lang}/about` | Company story, values, mission & vision |
| `/{lang}/products` | Product catalog with search, category filter, infinite scroll & lazy loading |
| `/{lang}/products/[id]` | Product detail page with image carousel gallery |
| `/{lang}/services` | Industrial services overview |
| `/{lang}/contact` | Dedicated contact page with email inquiry form |

### Admin Panel (`/{lang}/admin`)
- **Protected by Supabase Auth** — unauthenticated users are redirected to `/{lang}/login`
- **Product Management** — view, add, edit, and delete products
- **Multi-Image Upload** — drag-and-drop reordering, per-image deletion, primary image badge; uploads go to Supabase Storage (`Product_img` bucket)
- **Category Management** — add/delete categories with full trilingual support (EN / TH / ZH) inline within the product form

### Internationalization (i18n)
- **3 languages**: English (`en`), Thai (`th`), Chinese (`zh`)
- Locale detection via `Accept-Language` header negotiation (RFC 9110)
- All UI strings, page metadata, and product fields are fully localized
- Dictionary files live in `src/dictionaries/`

### Email Contact
- Powered by the **Resend** API via `POST /api/send`
- Inline quick-inquiry form on the Home page; full form on the Contact page

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Backend / DB | [Supabase](https://supabase.com/) (PostgreSQL + Storage + Auth) |
| Email | [Resend](https://resend.com/) |
| Font | Inter (Google Fonts via `next/font`) |
| i18n | `@formatjs/intl-localematcher` + `negotiator` |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [lang]/                  # Locale-scoped routes
│   │   ├── page.tsx             # Home
│   │   ├── about/
│   │   ├── products/
│   │   │   └── [id]/            # Product detail
│   │   ├── services/
│   │   ├── contact/
│   │   ├── login/               # Admin login
│   │   └── admin/               # Protected admin dashboard
│   │       ├── add/             # Add product
│   │       └── edit/[id]/       # Edit product
│   ├── api/
│   │   ├── send/                # POST - Send email via Resend
│   │   └── products/            # GET  - Paginated product listing
│   └── globals.css
├── components/
│   ├── features/
│   │   ├── admin/               # AdminListClient
│   │   ├── auth/                # LoginClient
│   │   ├── contact/             # ContactForm
│   │   └── products/            # ProductCard, ProductsClient, ProductFormClient, ProductDetailClient
│   ├── layout/                  # Navbar, Footer, LanguageSwitcher, MobileMenu, LogoutButton, Flags
│   ├── pages/                   # HomeClient, AboutClient, ServicesClient, ContactClient
│   └── ui/                      # PageHero, SectionHeader, ConfirmationModal
├── dictionaries/
│   ├── en.json
│   ├── th.json
│   └── zh.json
├── lib/
│   └── supabase/
│       ├── client.ts            # Browser Supabase client
│       └── server.ts            # Server-side Supabase client (SSR)
├── get-dictionary.ts            # Dynamic dictionary loader
├── i18n-config.ts               # Supported locales & default
└── proxy.ts                     # Next.js middleware for locale detection & redirect
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- A [Supabase](https://supabase.com/) project with:
  - A `products` table
  - A `categories` table
  - A `Product_img` storage bucket (public)
  - Email/Password auth enabled
- A [Resend](https://resend.com/) account with an API key

### 1. Clone & Install

```bash
git clone <repo-url>
cd hermes-zenith
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You will be automatically redirected to the appropriate locale (e.g., `/en`).

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🗄 Database Schema

### `products`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `title_en` | text | English title |
| `title_th` | text | Thai title |
| `title_zh` | text | Chinese title |
| `description_en` | text | |
| `description_th` | text | |
| `description_zh` | text | |
| `category` | text | References `categories.slug` |
| `image_url` | text | Primary image URL (backward compat.) |
| `image_urls` | text[] | All image URLs (ordered) |
| `created_at` | timestamptz | |

### `categories`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `slug` | text | Unique identifier (e.g. `air_compressor`) |
| `name_en` | text | |
| `name_th` | text | |
| `name_zh` | text | |

---

## 🔐 Authentication

Admin authentication is handled by **Supabase Auth** (email/password).

- Visiting `/{lang}/admin` without a session redirects to `/{lang}/login`
- Visiting `/{lang}/login` with an active session redirects to `/{lang}/admin`
- Logout clears the session and redirects back to login

---

## 🌍 Adding a New Language

1. Add the new locale code to `src/i18n-config.ts`:
   ```ts
   export const i18n = {
     defaultLocale: 'en',
     locales: ['en', 'th', 'zh', 'ja'], // e.g. add 'ja'
   } as const
   ```
2. Create `src/dictionaries/ja.json` following the structure of `en.json`
3. Add the new locale flag/label to `src/components/layout/LanguageSwitcher.tsx`

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📄 License

Private — All rights reserved © Hermes-Zenith.
