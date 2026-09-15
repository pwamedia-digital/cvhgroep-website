import { useEffect } from 'react'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import Button from '../ui/Button'
import Container from '../ui/Container'
import { services } from '../../data/site'
import { serviceDetails } from '../../data/serviceDetails'

export default function ServicePage({ serviceId }) {
  const service = services.find((item) => item.id === serviceId)
  const details = serviceDetails[serviceId]

  useEffect(() => {
    window.scrollTo(0, 0)
    if (service) document.title = `${service.title} | CVH Groep`
    return () => { document.title = 'CVH Groep | Renovaties & Totaalprojecten in Oostende' }
  }, [service])

  if (!service || !details) return null

  return <><Header /><main>
    <section className="relative isolate flex min-h-[70vh] items-end overflow-hidden bg-brand-950 pt-28">
      <img src={service.image} alt={`${service.title} door CVH Groep`} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/70 to-brand-950/25" />
      <Container className="relative z-10 pb-16 pt-24 sm:pb-20">
        <a href="#specialisaties" className="inline-flex items-center gap-2 font-sans text-sm font-600 text-brand-200 transition hover:text-white">← Alle specialisaties</a>
        <p className="mt-10 font-sans text-xs font-700 uppercase tracking-[0.24em] text-brand-300">{service.subtitle}</p>
        <h1 className="mt-3 max-w-5xl font-display text-5xl font-800 leading-[0.98] text-white sm:text-7xl lg:text-8xl">{service.title}</h1>
        <p className="mt-7 max-w-3xl font-sans text-lg leading-relaxed text-brand-100/90 sm:text-xl">{details.lead}</p>
      </Container>
    </section>
    <section className="bg-white py-20 sm:py-28"><Container><div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
      <div className="lg:col-span-5"><p className="font-sans text-xs font-700 uppercase tracking-[0.22em] text-brand-600">Hoe we te werk gaan</p><h2 className="mt-4 font-display text-4xl font-800 leading-tight text-ink sm:text-5xl">Een goede afwerking begint bij de juiste opbouw.</h2></div>
      <div className="space-y-5 font-sans text-lg leading-relaxed text-ink-soft lg:col-span-7">{details.intro.map((p) => <p key={p}>{p}</p>)}</div>
    </div></Container></section>
    <section className="bg-sand-100 py-20 sm:py-28"><Container>
      <p className="font-sans text-xs font-700 uppercase tracking-[0.22em] text-brand-600">Technieken & uitvoering</p><h2 className="mt-4 max-w-3xl font-display text-4xl font-800 leading-tight text-ink sm:text-5xl">Wat er achter een sterk eindresultaat zit.</h2>
      <div className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-brand-900/10 md:grid-cols-2">{details.techniques.map(([title, text], i) => <article key={title} className="bg-white p-8 sm:p-10"><span className="font-display text-4xl font-800 italic text-brand-200">0{i + 1}</span><h3 className="mt-5 font-display text-2xl font-800 text-ink sm:text-3xl">{title}</h3><p className="mt-3 font-sans text-base leading-relaxed text-ink-soft">{text}</p></article>)}</div>
    </Container></section>
    <section className="bg-white py-20 sm:py-28"><Container><div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
      <div><p className="font-sans text-xs font-700 uppercase tracking-[0.22em] text-brand-600">Toepassingen</p><h2 className="mt-4 font-display text-4xl font-800 text-ink sm:text-5xl">Waarvoor kunt u bij ons terecht?</h2><ul className="mt-8 divide-y divide-brand-900/10 border-y border-brand-900/10">{details.suitable.map((item) => <li key={item} className="flex gap-4 py-4 font-sans text-lg text-ink-soft"><span className="text-brand-500">✓</span>{item}</li>)}</ul></div>
      <aside className="rounded-3xl bg-brand-950 p-8 text-white sm:p-12"><p className="font-sans text-xs font-700 uppercase tracking-[0.22em] text-brand-300">Goed om te weten</p><p className="mt-5 font-display text-2xl font-600 leading-snug sm:text-3xl">{details.note}</p><div className="mt-9"><Button href="#contact" variant="light" arrow>Bespreek uw project</Button></div></aside>
    </div></Container></section>
    <section id="contact" className="bg-brand-600 py-16 text-white sm:py-20"><Container className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-sans text-xs font-700 uppercase tracking-[0.22em] text-brand-100">Persoonlijk advies</p><h2 className="mt-3 font-display text-4xl font-800 sm:text-5xl">Benieuwd naar de mogelijkheden?</h2></div><Button href="mailto:info@cvhgroep.be" variant="light" size="lg" arrow>Vraag een offerte</Button></Container></section>
  </main><Footer /></>
}
