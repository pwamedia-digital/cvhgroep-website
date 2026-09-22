import Container from '../ui/Container'
import Logo from '../ui/Logo'
import { company, nav } from '../../data/site'

export default function Footer() {
  const year = 2024

  return (
    <footer className="relative bg-brand-950 pt-20 pb-10 text-brand-100/70">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Merk */}
          <div className="lg:col-span-5">
            <Logo height="h-14" />
            <p className="mt-6 max-w-sm font-display text-2xl font-500 italic leading-snug text-white">
              Méér dan renovaties, een partnerschap in perfectie.
            </p>
            <p className="mt-4 max-w-sm font-sans leading-relaxed text-brand-100/60">
              {company.legalName} — uw persoonlijke partner van offerte tot afwerking, in {company.region}.
            </p>
          </div>

          {/* Navigatie */}
          <div className="lg:col-span-3">
            <h3 className="font-sans text-xs font-700 uppercase tracking-[0.22em] text-brand-300">Navigatie</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="font-sans text-brand-100/75 transition-colors duration-200 hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="font-sans text-xs font-700 uppercase tracking-[0.22em] text-brand-300">Contact</h3>
            <ul className="mt-5 flex flex-col gap-3 font-sans">
              <li>
                <a href={`mailto:${company.email}`} className="text-brand-100/75 transition-colors duration-200 hover:text-white">
                  {company.email}
                </a>
              </li>
              <li className="text-brand-100/75">{company.street}</li>
              <li className="text-brand-100/75">{company.city}</li>
            </ul>

            <div className="mt-6 flex gap-3">
              {company.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-brand-100/75 transition-all duration-200 hover:border-brand-400 hover:bg-brand-400 hover:text-white"
                >
                  <SocialIcon name={s.label} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="font-sans text-sm text-brand-100/50">
            © {year} {company.legalName}. Alle rechten voorbehouden.
          </p>
          <p className="font-sans text-sm text-brand-100/50">
            {company.street} · {company.city}
          </p>
        </div>
      </Container>
    </footer>
  )
}

function SocialIcon({ name }) {
  const paths = {
    Facebook: <path d="M14 9V7c0-1 .3-1.5 1.5-1.5H17V2.5h-2.5C11.8 2.5 11 4 11 6v3H8.5v3H11v9h3v-9h2.3l.4-3z" />,
    Instagram: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
    LinkedIn: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
        <path d="M8 10v6M8 7v.5M12 16v-3.5c0-1 .8-1.8 1.8-1.8s1.7.8 1.7 1.8V16" />
      </>
    ),
  }
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
