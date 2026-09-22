import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { testimonials } from '../../data/site'

function Stars() {
  return (
    <div className="flex gap-0.5 text-brand-400" aria-label="5 op 5 sterren">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="relative bg-white py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          intro="Geen marketingbeloftes, maar de ervaringen van mensen die we mochten helpen."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.items.map((t, i) => (
            <Reveal key={t.author} delay={i * 110} className="h-full">
              <figure className="flex h-full flex-col rounded-3xl border border-ink/10 bg-sand-50 p-8 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
                <span className="font-display text-6xl font-800 leading-none text-brand-200" aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className="-mt-4 flex-1 font-sans text-[1.05rem] leading-relaxed text-ink-soft">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-7 border-t border-ink/10 pt-5">
                  <Stars />
                  <p className="mt-3 font-display text-lg font-700 text-ink">{t.author}</p>
                  <p className="font-sans text-sm text-brand-600">{t.detail}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
