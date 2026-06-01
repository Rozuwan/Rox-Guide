<div align="center">

<br />

<img src="public/favicon.svg" alt="RoxGuide" width="80" />

# RoxGuide

**A developer-grade knowledge base for the curious.**
Build, browse, and share curated learning paths — Topics packed with deep-dive Guides, all rendered in a fast, terminal-inspired UI.

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status: Alpha](https://img.shields.io/badge/Status-Alpha-f59e0b)]()

<br />

[Live Demo](#-live-demo) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Quick Start](#-quick-start) · [Environment](#-environment-variables) · [Project Structure](#-project-structure) · [Design System](#-design-system) · [Roadmap](#-roadmap) · [Contributing](#-contributing) · [License](#-license)

</div>

---

## The Pitch

RoxGuide is a **personal + community-driven learning portal** for developers. Instead of drowning in scattered Notion docs, YouTube playlists, and random blog tabs, you organize knowledge into **Topics** — each one a curated learning area filled with rich, markdown-rendered **Guides**.

It's built for people who treat learning like shipping: track what you started, what you finished, and what's worth coming back to.

> "Stop collecting links. Start building a brain."

---

## Highlights

- **Topic → Guide hierarchy** — group related deep-dives under a single, shareable topic.
- **Markdown-native guides** — write once, render beautifully with `react-markdown`.
- **Supabase auth** — email/password with persistent sessions, secured routes out of the box.
- **Personal + Community feeds** — your private collection + the public topics others have shipped.
- **Live stats** — topic count, guide count, completion tracking on the dashboard.
- **Lightning fast** — Vite 8 + React 19 + Tailwind v4, zero bloat.
- **Dark, terminal-flavored UI** — inspired by Vercel's design language (see [Design System](#-design-system)).
- **Mobile-first nav** — sticky desktop bar, animated slide-down mobile menu.

---

## Features

### For Learners
- **Dashboard** at-a-glance overview of topics, guides, and progress.
- **Search** across your topics and community topics.
- **Deep-linked slugs** — `/topic/:slug` and `/guide/:slug` URLs you can share.
- **Markdown rendering** with full-fidelity guides.
- **Persistent sessions** via Supabase JWTs.

### For Builders
- **Component-scoped state** with React Context (Auth).
- **Protected route wrapper** — drop-in `<ProtectedRoute>` guard.
- **Composable layout** — `AuthLayout`, `Navbar`, `ErrorMessage`, `SearchInput`.
- **Tailwind v4 via Vite plugin** — no `tailwind.config.js` bloat, CSS-first config.
- **ESLint flat config** with React Hooks + React Refresh rules.

---

## Tech Stack

| Layer        | Tool                                | Why                                          |
|--------------|-------------------------------------|----------------------------------------------|
| Framework    | **React 19**                        | Latest stable, concurrent rendering          |
| Build        | **Vite 8**                          | Sub-second HMR, native ES modules            |
| Styling      | **Tailwind CSS v4** (`@tailwindcss/vite`) | CSS-first config, zero runtime cost  |
| Routing      | **React Router 7**                  | Data-router APIs, lazy loading               |
| Backend      | **Supabase** (Auth + Postgres)      | Open-source BaaS, row-level security ready   |
| Markdown     | **react-markdown 10**               | Secure, extensible MD rendering              |
| Icons        | **lucide-react**                    | Tree-shakable, consistent geometry           |
| Lint         | **ESLint 10** (flat config)         | React Hooks + Refresh rules                  |
| Deploy       | **Vercel** (recommended)            | Zero-config Vite + env handling              |

---

## Quick Start

> Requires **Node.js 18.18+** (or 20+) and **npm**.

```bash
# 1. Clone
git clone https://github.com/<your-username>/roxguide.git
cd roxguide

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env
# then edit .env with your Supabase credentials (see below)

# 4. Run
npm run dev
```

Open **http://localhost:5173** — you'll land on the login screen. Create an account, and you're in.

### NPM Scripts

| Command          | What it does                          |
|------------------|---------------------------------------|
| `npm run dev`    | Start the Vite dev server with HMR    |
| `npm run build`  | Production build into `dist/`         |
| `npm run preview`| Preview the production build locally  |
| `npm run lint`   | Run ESLint over the project           |

---

## Environment Variables

RoxGuide reads its Supabase credentials via Vite's `import.meta.env`. All keys must be prefixed with `VITE_` to be exposed to the client.

Create a `.env` file in the project root:

```bash
# .env
VITE_SUPABASE_URL="https://<your-project-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_xxxxxxxxxxxxx"
```

> These are the **publishable** (anon) keys — safe for the browser when paired with Supabase Row Level Security (RLS). Never commit a service-role key.

### Supabase Setup (minimum)

1. Create a new project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the schema you need for `topics` and `guides` (example below).
3. Enable **Email** auth under *Authentication → Providers*.
4. Paste the URL and publishable key into `.env`.

```sql
-- Suggested starter schema
create table topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text,
  is_public boolean default false,
  created_at timestamptz default now()
);

create table guides (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  slug text not null,
  content text,            -- markdown body
  completed boolean default false,
  created_at timestamptz default now()
);

alter table topics enable row level security;
alter table guides enable row level security;

-- Owners manage their own rows; public topics are world-readable.
create policy "owner_all" on topics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public_read" on topics
  for select using (is_public = true);
```

---

## Project Structure

```
roxguide/
├── public/                  # Static assets served as-is
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/              # Bundled assets (images, logos)
│   ├── components/          # Reusable UI building blocks
│   │   ├── AuthLayout.jsx
│   │   ├── CreateTopicTest.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── SearchInput.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Supabase session + login/signup/logout
│   ├── lib/
│   │   └── supabase.js      # Singleton Supabase client
│   ├── pages/               # Route-level views
│   │   ├── Dashboard.jsx
│   │   ├── GuideDetails.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── TopicDetails.jsx
│   │   └── Topics.jsx
│   ├── routes/
│   │   └── Router.jsx       # React Router v7 route tree
│   ├── App.jsx              # Root component
│   ├── index.css            # Tailwind v4 entry stylesheet
│   └── main.jsx             # Vite entry
├── vercel/                  # Internal design analysis (gitignored)
├── .env.example             # Template for environment variables
├── eslint.config.js         # ESLint flat config
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Design System

RoxGuide's visual language is a love letter to **Vercel's stark, terminal-flavored aesthetic** — paired with curated references from the Notion design system. The full token spec lives internally (see `vercel/DESIGN.md` for the canonical source), and highlights include:

- **Color** — deep ink (`#0a0a0a`) canvas, neon gradient accents (cyan / violet / magenta / amber), neutral-900 borders.
- **Typography** — Geist for UI, monospace for terminal-flavored metadata (emails, log pills, route labels).
- **Shape** — rounded-full for status pills, rounded-xl/2xl for cards, sharp 0-radius for code blocks.
- **Motion** — 150–200ms ease, fade + slide-in for menus, subtle hover elevation on cards.

The internal design docs are kept out of the repo on purpose (`DESIGN.md` is in `.gitignore`) so the public-facing product stays clean.

---

## Routing Map

| Path             | Component        | Access     |
|------------------|------------------|------------|
| `/`              | `RootRedirect`   | public     |
| `/login`         | `Login`          | public     |
| `/signup`        | `Signup`         | public     |
| `/dashboard`     | `Dashboard`      | protected  |
| `/topics`        | `Topics`         | protected  |
| `/topic/:slug`   | `TopicDetails`   | protected  |
| `/guide/:slug`   | `GuideDetails`   | protected  |

`ProtectedRoute` checks `useAuth().currentUser` and redirects unauthenticated users to `/login`.

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Vercel auto-detects Vite. Add the two env vars in **Project Settings → Environment Variables** and you're done.

### Any static host

```bash
npm run build       # outputs to dist/
```

Drop `dist/` on Netlify, Cloudflare Pages, GitHub Pages, or any static CDN. Just remember to set the env vars at the host level.

> If you deploy to a non-root path, update `base` in `vite.config.js` and the `<BrowserRouter basename=...>` prop in `Router.jsx`.

---

## Roadmap

- [ ] OAuth providers (GitHub, Google) via Supabase
- [ ] Inline markdown editor with live preview
- [ ] Topic favorites + bookmarks
- [ ] Reading progress tracking
- [ ] Public profiles at `/u/:email`
- [ ] Server-side rendering (RSC or Astro hybrid)
- [ ] Full-text search with Postgres `tsvector`
- [ ] Dark/light theme toggle

---

## Contributing

PRs welcome. Keep it small, keep it focused.

```bash
git checkout -b feat/your-feature
npm run lint          # must pass
npm run build         # must succeed
```

Please don't commit `.env` — the `.gitignore` will block you, but be aware that rotating Supabase keys after an accidental push is mandatory.

---

## Acknowledgments

- [Vercel](https://vercel.com) — design language inspiration
- [Notion](https://notion.so) — secondary design reference
- [Supabase](https://supabase.com) — backend that doesn't make you write boilerplate
- [lucide](https://lucide.dev) — the only icon set you need
- [Tailwind Labs](https://tailwindcss.com) — for keeping CSS honest

---

## License

[MIT](LICENSE) — go build something weird with it.

---

<div align="center">

Built with care. Ship your learning.

</div>
