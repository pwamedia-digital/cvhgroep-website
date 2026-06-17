/**
 * Eyebrow — kleine, gespatieerde labeltekst met merkstreepje.
 * Terugkerend ankerpunt boven elke sectietitel.
 */
export default function Eyebrow({ children, tone = 'dark', className = '' }) {
  const color = tone === 'light' ? 'text-brand-200' : 'text-brand-600'
  const line = tone === 'light' ? 'bg-brand-300/70' : 'bg-brand-400'
  return (
    <span
      className={`inline-flex items-center gap-3 font-sans text-xs font-700 uppercase tracking-[0.28em] ${color} ${className}`}
    >
      <span className={`h-px w-8 ${line}`} aria-hidden="true" />
      {children}
    </span>
  )
}
