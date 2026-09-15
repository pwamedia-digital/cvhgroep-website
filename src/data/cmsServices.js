import content from '../content/services.json'
import renovation from '../assets/images/projects/renovation-in-progress.jpg'
import spanplafond from '../assets/images/projects/spanplafond-led.jpg'
import bathroom from '../assets/images/projects/bathroom-shower.jpg'
import flatRoof from '../assets/images/projects/flat-roof-oostende.jpg'

const fallbackImages = { renovaties: renovation, spanplafonds: spanplafond, gietvloeren: bathroom, 'platte-daken': flatRoof }

export const cmsServices = content.services.map((service) => ({
  ...service,
  image: service.image || fallbackImages[service.id],
}))
