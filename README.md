# CVH Groep — Website

Premium one-page website voor **CVH Groep** (Chris Van Hoey Groep) uit Oostende —
specialist in renovaties, spanplafonds, gietvloeren & steentapijten en platte daken.

> _Méér dan renovaties, een partnerschap in perfectie._

## Stack

- **Vite** — build tool & dev server
- **React 18** — component-architectuur
- **Tailwind CSS v4** — utility-first styling via `@tailwindcss/vite`
- **Alegreya** + **Alegreya Sans** — huisstijl-typografie (Google Fonts)

## Lokaal draaien

```bash
npm install
npm run dev      # ontwikkelserver op http://localhost:5173
npm run build    # productie-build naar /dist
npm run preview  # bekijk de productie-build lokaal
```

## Designsysteem

Alle merktokens (kleuren, typografie, timing, schaduwen) staan centraal in
[`src/index.css`](src/index.css) onder `@theme`. Afgeleid van het logo:

| Token            | Waarde      | Gebruik                          |
| ---------------- | ----------- | -------------------------------- |
| `brand-600`      | `#2656A3`   | Primaire merkkleur               |
| `brand-400`      | `#5B8DD5`   | Accent                           |
| `brand-900/950`  | `#14305E` … | Diepe navy-secties               |
| `timber-*`       | houttinten  | Warme afgeleiden (logo-textuur)  |
| `sand-*`         | warm wit    | Lichte achtergronden             |

## Projectstructuur

```
src/
├── App.jsx                 # paginacompositie (sectievolgorde)
├── index.css               # Tailwind v4 + designsysteem (@theme)
├── data/site.js            # alle content & sitegegevens (één bron van waarheid)
├── assets/
│   ├── images/projects/    # projectfoto's
│   └── logo/               # officieel CVH-logo
└── components/
    ├── ui/                 # herbruikbare bouwstenen (Button, Reveal, …)
    ├── layout/             # Header, Footer
    └── sections/           # paginasecties (Hero, Services, …)
```

## Content aanpassen

Teksten, navigatie, diensten, projecten en getuigenissen beheer je centraal in
[`src/data/site.js`](src/data/site.js) — zonder de componenten aan te raken.

## Opmerking

Het offerteformulier opent het mailprogramma van de bezoeker met een ingevuld
bericht naar `info@cvhgroep.be`. Voor automatische verwerking kan dit later
gekoppeld worden aan een formulierdienst (bv. Formspree) of een eigen backend.
