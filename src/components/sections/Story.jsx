import Container from '../ui/Container'
import Eyebrow from '../ui/Eyebrow'
import Reveal from '../ui/Reveal'
import { story } from '../../data/site'

export default function Story() {
  return (
    <section id="over-ons" className="relative scroll-mt-24 bg-sand-50 py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Beeld met overlay-citaat */}
          <Reveal y="2.5rem" className="lg:col-span-5">
            <figure className="relative overflow-hidden rounded-3xl shadow-lift">
              <img
                src={story.image}
                alt="Chris Van Hoey — vakmanschap bij CVH Groep"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-7">
                <p className="font-display text-2xl font-700 italic text-white">{story.signature}</p>
                <p className="mt-1 font-sans text-sm font-500 text-brand-100/80">{story.signatureRole}</p>
              </figcaption>
            </figure>
          </Reveal>

          {/* Verhaal */}
          <div className="lg:col-span-7 lg:pl-6">
            <Reveal>
              <Eyebrow>{story.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-giant font-800 text-ink text-balance">
                {story.title}
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 font-display text-2xl font-500 italic leading-snug text-brand-700">
                {story.lead}
              </p>
            </Reveal>
            <div className="mt-7 flex flex-col gap-5">
              {story.paragraphs.map((para, i) => (
                <Reveal key={i} delay={200 + i * 80}>
                  <p className="font-sans text-lg leading-relaxed text-ink-soft">{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
