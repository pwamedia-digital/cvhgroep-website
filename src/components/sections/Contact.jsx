import { useState } from 'react'
import Container from '../ui/Container'
import Eyebrow from '../ui/Eyebrow'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import DiagonalStripes from '../ui/DiagonalStripes'
import { contact, company } from '../../data/site'

const inputBase =
  'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 font-sans text-ink placeholder:text-ink-soft/50 transition-colors duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400/30'

const labelBase = 'mb-1.5 block font-sans text-sm font-600 text-ink'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Geen backend: open de mailclient met een voorgestelde mail als kanaal.
    const subject = encodeURIComponent(`Offerteaanvraag — ${form.service || 'CVH Groep'}`)
    const body = encodeURIComponent(
      `Naam: ${form.name}\nE-mail: ${form.email}\nTelefoon: ${form.phone}\nType project: ${form.service}\n\n${form.message}`,
    )
    window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-brand-900 py-24 text-white sm:py-32">
      <DiagonalStripes tone="light" opacity={0.07} className="absolute right-0 top-0 h-full w-1/3" />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Linkerkolom — uitnodiging + gegevens */}
          <div className="flex flex-col">
            <Reveal>
              <Eyebrow tone="light">{contact.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-giant font-800 text-white text-balance">
                {contact.title}
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-md font-sans text-lg leading-relaxed text-brand-100/80">
                {contact.text}
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 flex flex-col gap-5 border-t border-white/15 pt-8">
                <ContactRow label="E-mail" value={company.email} href={`mailto:${company.email}`} icon="mail" />
                <ContactRow label="Adres" value={`${company.street}, ${company.city}`} icon="pin" />
              </div>
            </Reveal>
          </div>

          {/* Rechterkolom — formulier */}
          <Reveal delay={120} y="2.5rem">
            <div className="rounded-3xl bg-white p-7 shadow-lift sm:p-9">
              {sent ? (
                <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-800 text-ink">Bedankt voor uw aanvraag!</h3>
                  <p className="mt-3 max-w-sm font-sans text-ink-soft">
                    Uw mailprogramma opent met uw bericht. Verzend het en we nemen zéér snel contact met u op.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 font-sans text-sm font-600 text-brand-600 underline-offset-4 hover:underline"
                  >
                    Nieuw bericht opstellen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelBase}>Naam</label>
                      <input id="name" type="text" required value={form.name} onChange={update('name')} className={inputBase} placeholder="Uw naam" />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelBase}>Telefoon</label>
                      <input id="phone" type="tel" value={form.phone} onChange={update('phone')} className={inputBase} placeholder="Uw telefoonnummer" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelBase}>E-mail</label>
                    <input id="email" type="email" required value={form.email} onChange={update('email')} className={inputBase} placeholder="naam@voorbeeld.be" />
                  </div>

                  <div>
                    <label htmlFor="service" className={labelBase}>Type project</label>
                    <select id="service" value={form.service} onChange={update('service')} className={`${inputBase} appearance-none bg-[length:1.2rem] bg-[right_1rem_center] bg-no-repeat`} style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%233a4658%27 stroke-width=%272%27 stroke-linecap=%27round%27%3E%3Cpath d=%27M6 9l6 6 6-6%27/%3E%3C/svg%3E")' }}>
                      <option value="" disabled>Maak een keuze…</option>
                      {contact.fields.services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelBase}>Uw bericht</label>
                    <textarea id="message" rows={4} value={form.message} onChange={update('message')} className={`${inputBase} resize-none`} placeholder="Vertel ons over uw project…" />
                  </div>

                  <Button type="submit" variant="primary" size="lg" arrow className="mt-1 w-full sm:w-auto">
                    Verstuur aanvraag
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

function ContactRow({ label, value, href, icon }) {
  const icons = {
    mail: <path d="M4 6h16v12H4z M22 6l-10 7L2 6" />,
    pin: <path d="M12 21s-7-5.2-7-11a7 7 0 0114 0c0 5.8-7 11-7 11z M12 10a2 2 0 100-4 2 2 0 000 4z" />,
  }
  const content = (
    <div className="flex items-center gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-brand-300">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {icons[icon]}
        </svg>
      </span>
      <span>
        <span className="block font-sans text-xs font-600 uppercase tracking-[0.18em] text-brand-300">{label}</span>
        <span className="font-sans text-lg font-600 text-white">{value}</span>
      </span>
    </div>
  )
  return href ? (
    <a href={href} className="transition-opacity duration-200 hover:opacity-80">{content}</a>
  ) : (
    content
  )
}
