import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { process } from '../../data/site'

export default function Process() {
  return <section id="werkwijze" className="relative scroll-mt-24 bg-sand-100 py-24 sm:py-32"><Container>
    <SectionHeading eyebrow={process.eyebrow} title={process.title} intro={process.intro} />
    <ol className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">{process.steps.map((step, i) => <Reveal key={step.number} delay={i * 100} as="li" className="relative">
      {i < process.steps.length - 1 && <span className="absolute left-9 right-0 top-7 hidden h-px bg-gradient-to-r from-brand-300 to-transparent lg:block" />}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 font-display text-xl font-800 text-white shadow-soft">{step.number}</div>
      <h3 className="mt-6 font-display text-2xl font-700 text-ink">{step.title}</h3><p className="mt-3 font-sans leading-relaxed text-ink-soft">{step.text}</p>
    </Reveal>)}</ol>
  </Container></section>
}
