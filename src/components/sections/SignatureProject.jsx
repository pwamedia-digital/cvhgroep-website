import Container from '../ui/Container'
import Eyebrow from '../ui/Eyebrow'
import Reveal from '../ui/Reveal'
import DiagonalStripes from '../ui/DiagonalStripes'
import { signatureProject as p } from '../../data/site'

export default function SignatureProject() {
  return (
    <section id="projecten" className="relative scroll-mt-24 overflow-hidden bg-brand-950 py-24 text-white sm:py-32">
      <DiagonalStripes tone="light" opacity={0.06} className="absolute -left-10 bottom-0 h-[55%] w-[45%]" />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Beeld */}
          <Reveal y="2.5rem" className="order-2 lg:order-1">
            <figure className="relative overflow-hidden rounded-3xl shadow-lift">
              <img
                src={p.image}
                alt={`${p.title} — ${p.client}`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-premium hover:scale-105"
              />
              <figcaption className="absolute bottom-5 left-5 rounded-full bg-brand-950/70 px-4 py-2 font-sans text-xs font-600 uppercase tracking-[0.18em] text-brand-100 backdrop-blur-sm">
                {p.location} · {p.year}
              </figcaption>
            </figure>
          </Reveal>

          {/* Tekst */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <Eyebrow tone="light">{p.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-giant font-800 text-white text-balance">
                {p.title}
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-7 grid grid-cols-3 gap-4 border-y border-white/15 py-6">
                {[
                  { k: 'Klant', v: p.client },
                  { k: 'Status', v: p.status },
                  { k: 'Jaar', v: p.year },
                ].map((item) => (
                  <div key={item.k}>
                    <dt className="font-sans text-xs font-600 uppercase tracking-[0.18em] text-brand-300">
                      {item.k}
                    </dt>
                    <dd className="mt-1.5 font-display text-lg font-700 text-white">{item.v}</dd>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-7 max-w-xl font-sans text-lg leading-relaxed text-brand-100/80">
                {p.description}
              </p>
            </Reveal>

            <Reveal delay={260}>
              <ul className="mt-7 flex flex-col gap-3">
                {p.scope.map((item) => (
                  <li key={item} className="flex items-center gap-3 font-sans text-brand-100/90">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-400/20 text-brand-300">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
