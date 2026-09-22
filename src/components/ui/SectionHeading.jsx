import Eyebrow from './Eyebrow'
import Reveal from './Reveal'

/**
 * SectionHeading — terugkerende kop met eyebrow, grote serif-titel
 * en optionele introtekst. Houdt de typografische hiërarchie
 * consistent over alle secties.
 */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = 'dark',
  align = 'left',
  className = '',
}) {
  const titleColor = tone === 'light' ? 'text-white' : 'text-ink'
  const introColor = tone === 'light' ? 'text-brand-100/80' : 'text-ink-soft'
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start'

  return (
    <div className={`flex max-w-3xl flex-col gap-5 ${alignment} ${className}`}>
      {eyebrow && (
        <Reveal>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={80}>
        <h2
          className={`font-display text-giant font-800 ${titleColor} text-balance`}
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={160}>
          <p className={`max-w-2xl font-sans text-lg leading-relaxed ${introColor}`}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  )
}
