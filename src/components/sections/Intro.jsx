import Container from '../ui/Container'
import Eyebrow from '../ui/Eyebrow'
import Reveal from '../ui/Reveal'
import { intro } from '../../data/site'

export default function Intro() {
  return (
    <section className="relative bg-sand-50 py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Linkerkolom — eyebrow + grote titel */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <Eyebrow>{intro.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="mt-6 font-display text-giant font-800 text-ink text-balance">
                  {intro.title}
                </h2>
              </Reveal>
            </div>
          </div>

          {/* Rechterkolom — tekst + pijlers */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-6">
              {intro.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 90}>
                  <p
                    className={`font-sans leading-relaxed text-ink-soft ${
                      i === 0 ? 'text-xl sm:text-2xl text-ink' : 'text-lg'
                    }`}
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
              {intro.pillars.map((pillar, i) => (
                <Reveal key={pillar.title} delay={i * 80} className="h-full">
                  <div className="group h-full bg-sand-50 p-7 transition-colors duration-300 hover:bg-white">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                      <Checkmark />
                    </div>
                    <h3 className="font-display text-xl font-700 text-ink">{pillar.title}</h3>
                    <p className="mt-2 font-sans text-[0.95rem] leading-relaxed text-ink-soft">
                      {pillar.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Checkmark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
