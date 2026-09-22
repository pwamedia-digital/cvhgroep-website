import { marquee } from '../../data/site'

/**
 * Marquee — doorlopende typografische band met de specialisaties.
 * Een groot, ritmisch statement dat hero en inhoud verbindt.
 */
export default function Marquee() {
  const items = [...marquee, ...marquee]
  return (
    <section
      aria-hidden="true"
      className="relative overflow-hidden border-y border-ink/10 bg-brand-600 py-6"
    >
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap will-change-transform sm:gap-16">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-10 sm:gap-16">
            <span className="font-display text-2xl font-700 italic text-white sm:text-4xl">
              {item}
            </span>
            <svg
              className="h-3 w-3 shrink-0 text-brand-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
            </svg>
          </span>
        ))}
      </div>
    </section>
  )
}
