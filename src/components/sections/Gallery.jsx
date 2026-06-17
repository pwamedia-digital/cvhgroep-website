import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { gallery } from '../../data/site'

// Vertaalt de span-aanduiding naar grid-klassen (desktop)
const spanMap = {
  tall: 'sm:row-span-2',
  wide: 'sm:col-span-2',
  normal: '',
}

export default function Gallery() {
  return (
    <section className="relative bg-white py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Sfeer & beleving"
          title="Een blik op ons vakmanschap."
          intro="Van ruwbouw tot de laatste afwerking — elk beeld vertelt een stuk van het verhaal."
        />

        <div className="mt-14 grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {gallery.map((item, i) => (
            <Reveal
              key={i}
              delay={(i % 3) * 90}
              className={`group h-full ${spanMap[item.span] || ''}`}
            >
              <figure className="relative h-full overflow-hidden rounded-2xl bg-brand-950 shadow-soft">
                <img
                  src={item.image}
                  alt={item.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.1s] ease-premium group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute bottom-0 left-0 flex translate-y-2 items-center gap-2.5 p-5 opacity-0 transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="h-px w-6 bg-brand-300" />
                  <span className="font-sans text-sm font-600 tracking-wide text-white">
                    {item.caption}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
