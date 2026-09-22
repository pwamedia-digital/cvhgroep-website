import { useEffect, useRef, useState } from 'react'

/**
 * Reveal — subtiele scroll-onthulling via IntersectionObserver.
 * Houdt micro-interacties licht en zonder externe afhankelijkheden.
 *
 * @param {number} delay   Vertraging in ms (voor gestaffelde reeksen)
 * @param {string} y       Verticale verschuiving voor de animatie
 * @param {boolean} once   Eenmalig onthullen (standaard true)
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = '2rem',
  once = true,
  className = '',
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-[900ms] ease-premium will-change-transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0'
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? 'none' : `translateY(${y})`,
      }}
    >
      {children}
    </Tag>
  )
}
