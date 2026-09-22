/**
 * Button — gedeelde call-to-action in drie varianten.
 * Rendert als <a> wanneer href is opgegeven, anders als <button>.
 */
const base =
  'group inline-flex items-center justify-center gap-2.5 rounded-full font-sans text-sm font-700 tracking-wide transition-all duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400 disabled:opacity-60 disabled:pointer-events-none'

const sizes = {
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-[0.95rem]',
}

const variants = {
  primary:
    'bg-brand-600 text-white shadow-soft hover:bg-brand-700 hover:shadow-lift hover:-translate-y-0.5',
  light:
    'bg-white text-brand-700 shadow-soft hover:-translate-y-0.5 hover:shadow-lift',
  outline:
    'border border-brand-600/30 text-brand-700 hover:border-brand-600 hover:bg-brand-600 hover:text-white',
  ghostLight:
    'border border-white/35 text-white hover:bg-white hover:text-brand-700',
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export default function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  className = '',
  ...rest
}) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  const inner = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  )

  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  )
}
