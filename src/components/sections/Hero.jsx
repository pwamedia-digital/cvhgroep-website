import Container from '../ui/Container'
import Button from '../ui/Button'
import DiagonalStripes from '../ui/DiagonalStripes'
import { hero, company, marquee } from '../../data/site'

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-brand-950">
      {/* Achtergrondbeeld */}
      <div className="absolute inset-0">
        <img
          src={hero.image}
          alt="Vakmanschap bij CVH Groep — afwerking tijdens het gouden uur"
          className="h-full w-full object-cover object-center"
          fetchpriority="high"
        />
        {/* Merk-gradiënt voor leesbaarheid en huisstijlkleur */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/80 to-brand-950/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/85 via-brand-950/30 to-transparent" />
      </div>

      {/* Diagonaal merkmotief, subtiel rechtsboven */}
      <DiagonalStripes
        tone="light"
        opacity={0.08}
        className="absolute -right-10 top-0 h-[60%] w-[55%]"
      />

      {/* Inhoud */}
      <Container className="relative z-10 flex flex-1 flex-col justify-center pt-32 pb-12">
        <div className="max-w-4xl">
          <div className="mb-7 inline-flex translate-y-6 items-center gap-3 opacity-0 animate-[fadeUp_0.9s_var(--ease-premium)_forwards]">
            <span className="flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 font-sans text-xs font-700 uppercase tracking-[0.24em] text-brand-100 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              {hero.eyebrow}
            </span>
          </div>

          <h1 className="font-display text-mega font-800 text-white">
            {hero.titleLines.map((line, i) => (
              <span
                key={i}
                className="block translate-y-6 opacity-0 animate-[fadeUp_1s_var(--ease-premium)_forwards]"
                style={{ animationDelay: `${0.15 + i * 0.12}s` }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p
            className="mt-8 max-w-xl translate-y-6 font-sans text-lg leading-relaxed text-brand-100/85 opacity-0 animate-[fadeUp_1s_var(--ease-premium)_forwards] sm:text-xl"
            style={{ animationDelay: '0.6s' }}
          >
            {hero.intro}
          </p>

          <div
            className="mt-10 flex translate-y-6 flex-wrap items-center gap-4 opacity-0 animate-[fadeUp_1s_var(--ease-premium)_forwards]"
            style={{ animationDelay: '0.78s' }}
          >
            <Button href={hero.primaryCta.href} variant="light" size="lg" arrow>
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="ghostLight" size="lg">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </Container>

      {/* Onderbalk: specialisaties + locatie */}
      <Container className="relative z-10 pb-8">
        <div
          className="flex translate-y-6 flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/15 pt-6 opacity-0 animate-[fadeUp_1s_var(--ease-premium)_forwards]"
          style={{ animationDelay: '0.95s' }}
        >
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-sans text-xs font-600 uppercase tracking-[0.18em] text-brand-100/70">
            {marquee.slice(0, 5).map((item) => (
              <li key={item} className="flex items-center gap-5">
                {item}
                <span className="hidden h-1 w-1 rounded-full bg-brand-400/70 last:hidden sm:inline-block" />
              </li>
            ))}
          </ul>
          <span className="font-sans text-xs font-600 uppercase tracking-[0.18em] text-brand-100/70">
            {company.region}
          </span>
        </div>
      </Container>

      {/* Scroll-indicator */}
      <div
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-0 animate-[fadeUp_1s_var(--ease-premium)_forwards] lg:flex"
        style={{ animationDelay: '1.2s' }}
      >
        <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-white/50">Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/30 pt-1.5">
          <span className="h-1.5 w-1 animate-bounce rounded-full bg-white/70" />
        </span>
      </div>

      {/* Lokale keyframes voor de hero-intro */}
      <style>{`
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
