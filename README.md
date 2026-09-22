# CVH Groep — website

Productiewebsite voor **CVH Groep**, gebouwd met Next.js en het beveiligde PWAMEDIA CMS.

## Actieve stack

- Next.js 16 en React 19
- Tailwind CSS 4
- PostgreSQL/Neon voor CMS-content en authenticatie
- Better Auth met verplichte 2FA
- Vercel Blob voor nieuwe CMS-afbeeldingen
- PWAMEDIA Business Hub SSO

## Ontwikkeling

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

De website gebruikt `content/site.json` als initiële CMS-fallback. De Next.js-laag staat in `app/`; de bestaande visuele React-componenten en merkassets in `src/` vormen nog steeds de actieve presentatielaag. CMS-routes en serverlogica staan in `app/api/cms`, `server` en `cms-starter`.

De vroegere losse Vite-opstart, het statische browser-CMS en de GitHub Pages-workflow zijn na de CMS-migratie verwijderd.
