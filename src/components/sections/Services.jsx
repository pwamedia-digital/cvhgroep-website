import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import ServiceCard from './ServiceCard'
import { cmsServices as services } from '../../data/cmsServices'

export default function Services() {
  return <section id="specialisaties" className="relative scroll-mt-24 bg-white py-24 sm:py-32"><Container>
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><SectionHeading eyebrow="Specialisaties" title="Vier disciplines, één vakkundige hand." intro="Van complete renovatie tot de meest verfijnde afwerking — telkens met dezelfde zorg en hetzelfde oog voor detail." /></div>
    <div className="mt-14 grid gap-5 sm:gap-6 lg:grid-cols-2">{services.map((service, i) => <Reveal key={service.id} delay={(i % 2) * 100} className="h-full"><ServiceCard service={service} /></Reveal>)}</div>
  </Container></section>
}
