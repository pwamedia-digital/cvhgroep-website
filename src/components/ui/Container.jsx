/**
 * Container — consistente horizontale marges en maximale breedte.
 * Eén centrale plek voor het grid-ritme van de hele site.
 */
export default function Container({ as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </Tag>
  )
}
