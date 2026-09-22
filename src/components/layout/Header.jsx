import { useEffect, useState } from 'react'
import Container from '../ui/Container'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import { nav } from '../../data/site'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Voorkom scrollen achter het mobiele menu
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = scrolled || open

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-premium ${
          solid
            ? 'bg-sand-50/85 backdrop-blur-xl border-b border-ink/5 shadow-soft'
            : 'bg-transparent'
        }`}
      >
        <Container className="flex items-center justify-between gap-6 py-3.5">
        <Logo height={solid ? 'h-11' : 'h-12'} className="transition-all duration-500" />

        {/* Desktopnavigatie */}
        <nav className="hidden items-center gap-9 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`group relative font-sans text-sm font-500 tracking-wide transition-colors duration-300 ${
                solid ? 'text-ink-soft hover:text-brand-700' : 'text-white/90 hover:text-white'
              }`}
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-current transition-all duration-300 ease-premium group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="#contact" variant={solid ? 'primary' : 'light'} arrow>
            Offerte
          </Button>
        </div>

        {/* Hamburger (mobiel) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Menu sluiten' : 'Menu openen'}
          aria-expanded={open}
          className={`relative z-50 flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${
            solid ? 'text-ink hover:bg-ink/5' : 'text-white hover:bg-white/10'
          }`}
        >
          <div className="flex w-6 flex-col items-end gap-[5px]">
            <span
              className={`h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                open ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                open ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </div>
        </button>
        </Container>
      </header>

      {/* Mobiel menu-overlay — buiten de header (de blur van de header
          zou anders een containing block vormen voor dit fixed element) */}
      <div
        className={`fixed inset-0 z-40 bg-brand-900 transition-all duration-500 ease-premium lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <Container className="flex h-full flex-col justify-center gap-2 pt-20">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-4 font-display text-3xl font-700 text-white transition-all duration-500 hover:text-brand-300"
              style={{
                transitionDelay: open ? `${120 + i * 60}ms` : '0ms',
                transform: open ? 'none' : 'translateY(1rem)',
                opacity: open ? 1 : 0,
              }}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-8">
            <Button href="#contact" variant="light" size="lg" arrow onClick={() => setOpen(false)}>
              Vraag een offerte
            </Button>
          </div>
        </Container>
      </div>
    </>
  )
}
