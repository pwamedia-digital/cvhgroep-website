/**
 * DiagonalStripes — het diagonale streepmotief uit het CVH-logo,
 * herbruikt als subtiel decoratief patroon doorheen de site.
 * Puur decoratief en zonder muisinteractie.
 */
export default function DiagonalStripes({
  className = '',
  tone = 'light',
  opacity = 0.5,
}) {
  const stroke = tone === 'light' ? '#ffffff' : '#2656a3'
  const id = `cvh-stripes-${tone}`
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={id}
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-32)"
        >
          <line x1="0" y1="0" x2="0" y2="22" stroke={stroke} strokeWidth="3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
