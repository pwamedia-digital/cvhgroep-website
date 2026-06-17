/**
 * ServiceCard — premium beeldkaart voor één specialisatie.
 * Toont nummer, titel en ondertitel; bij hover/focus schuift de
 * omschrijving met tags omhoog. Volledig toetsenbordtoegankelijk.
 */
export default function ServiceCard({ service, featured = false }) {
  return (
    <article
      tabIndex={0}
      aria-label={service.title}
      className={`group relative isolate overflow-hidden rounded-3xl bg-brand-950 shadow-soft outline-none transition-shadow duration-500 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ${
        featured ? 'min-h-[26rem] lg:min-h-[34rem]' : 'min-h-[24rem] lg:min-h-[28rem]'
      }`}
    >
      {/* Beeld */}
      <img
        src={service.image}
        alt={`${service.title} — CVH Groep`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.1s] ease-premium group-hover:scale-105 group-focus-visible:scale-105"
      />
      {/* Gradiënt-overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/55 to-brand-950/10 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />

      {/* Nummer */}
      <span className="absolute right-6 top-5 font-display text-5xl font-800 italic text-white/15 transition-colors duration-500 group-hover:text-brand-300/50">
        {service.number}
      </span>

      {/* Inhoud */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-7 sm:p-8">
        <span className="font-sans text-xs font-700 uppercase tracking-[0.22em] text-brand-300">
          {service.subtitle}
        </span>
        <h3 className="mt-2 font-display text-3xl font-800 text-white sm:text-4xl">
          {service.title}
        </h3>

        {/* Onthuld bij hover/focus */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-premium group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="pt-4 font-sans text-[0.95rem] leading-relaxed text-brand-100/85">
              {service.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 font-sans text-xs font-600 text-white/85 backdrop-blur-sm"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  )
}
