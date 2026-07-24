# Me & Coach — MVP Prototype

Interactive front-end prototype of the Me & Coach MVP (mock data, no backend
calls) covering: Dashboard, Students, Batches, Attendance (offline-sync
indicator), Payments & Receipts, WhatsApp Log & Broadcast, Coaches & Roles,
Reports, and Settings.

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Build for production

```bash
npm run build
```

Outputs static files to `dist/` — this is what gets deployed.

## Deploy

This project is pre-configured for all three platforms. No manual settings
needed — just connect the repo.

### Vercel
- Import the GitHub repo in Vercel → it auto-detects Vite via `vercel.json`.
- Build command: `npm run build` · Output directory: `dist`

### Netlify
- New site from Git → Netlify reads `netlify.toml` automatically.
- Build command: `npm run build` · Publish directory: `dist`

### Cloudflare Pages
- Create a project from the GitHub repo.
- Framework preset: **Vite**
- Build command: `npm run build`
- Build output directory: `dist`

## Stack

- React 18 + Vite 5
- Tailwind CSS 3
- lucide-react (icons)
- Google Fonts: Sora, Inter, JetBrains Mono

## Notes

- All data (`students`, `batches`, `payments`, etc.) is mock data held in
  React state inside `src/App.jsx` — nothing persists on reload, and there
  are no API calls. This is a click-through prototype, not the production
  app (which is on Supabase/Express, per the Me & Coach architecture).
