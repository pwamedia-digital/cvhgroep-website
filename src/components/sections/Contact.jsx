import { useState } from 'react'
import Container from '../ui/Container'
import Eyebrow from '../ui/Eyebrow'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import DiagonalStripes from '../ui/DiagonalStripes'
import { contact, company } from '../../data/site'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnpnayyq'
const emptyForm = { name: '', email: '', phone: '', service: '', message: '' }

const inputBase =
  'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 font-sans text-ink placeholder:text-ink-soft/50 transition-colors duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400/30'

const labelBase = 'mb-1.5 block font-sans text-sm font-600 text-ink'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(event.currentTarget),
        headers: { Accept: 'application/json' },
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = result.errors?.map((item) => item.message).filter(Boolean).join(' ')
        throw new Error(message || 'De aanvraag kon niet worden verzonden. Probeer het straks opnieuw.')
      }

      setForm(emptyForm)
      setSent(true)
    } catch (submitError) {
      setError(submitError.message || 'Er ging iets mis bij het verzenden. Probeer het straks opnieuw.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-brand-900 py-24 text-white sm:py-32">
      <DiagonalStripes tone="light" opacity={0.07} className="absolute right-0 top-0 h-full w-1/3" />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
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

          <Reveal delay={120} y="2.5rem">
            <div className="rounded-3xl bg-white p-7 shadow-lift sm:p-9">
              {sent ? (
                <div className="flex min-h-[24rem] flex-col items-center justify-center text-center" role="status">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-800 text-ink">Bedankt voor uw aanvraag!</h3>
                  <p className="mt-3 max-w-sm font-sans text-ink-soft">
                    Uw aanvraag is goed ontvangen. We nemen zo snel mogelijk contact met u op.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 font-sans text-sm font-600 text-brand-600 underline-offset-4 hover:underline"
                  >
                    Nog een aanvraag versturen
                  </button>
                </div>
              ) : (
                <form
                  action={FORMSPREE_ENDPOINT}
                  method="POST"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                >
                  <input type="hidden" name="_subject" value={`Nieuwe offerteaanvraag — ${form.service || 'CVH Groep'}`} />
                  <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Laat dit veld leeg</label>
                    <input id="website" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelBase}>Naam</label>
                      <input id="name" name="name" type="text" required autoComplete="name" value={form.name} onChange={update('name')} className={inputBase} placeholder="Uw naam" />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelBase}>Telefoon</label>
                      <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} className={inputBase} placeholder="Uw telefoonnummer" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelBase}>E-mail</label>
                    <input id="email" name="email" type="email" required autoComplete="email" value={form.email} onChange={update('email')} className={inputBase} placeholder="naam@voorbeeld.be" />
                  </div>

                  <div>
                    <label htmlFor="service" className={labelBase}>Type project</label>
                    <select id="service" name="service" required value={form.service} onChange={update('service')} className={`${inputBase} appearance-none bg-[length:1.2rem] bg-[right_1rem_center] bg-no-repeat`} style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%233a4658%27 stroke-width=%272%27 stroke-linecap=%27round%27%3E%3Cpath d=%27M6 9l6 6 6-6%27/%3E%3C/svg%3E")' }}>
                      <option value="" disabled>Maak een keuze…</option>
                      {contact.fields.services.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelBase}>Uw bericht</label>
                    <textarea id="message" name="message" rows={4} required value={form.message} onChange={update('message')} className={`${inputBase} resize-none`} placeholder="Vertel ons over uw project…" />
                  </div>

                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700" role="alert">
                      {error}
                    </p>
                  )}

                  <Button type="submit" disabled={submitting} variant="primary" size="lg" arrow={!submitting} className="mt-1 w-full sm:w-auto">
                    {submitting ? 'Aanvraag verzenden…' : 'Verstuur aanvraag'}
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
