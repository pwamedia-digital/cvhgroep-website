import entrance from '../assets/images/projects/entrance-black-door.jpg'
import bathroom from '../assets/images/projects/bathroom-shower.jpg'
import renovation from '../assets/images/projects/renovation-in-progress.jpg'
import kitchen from '../assets/images/projects/kitchen-modern.jpg'
import spanplafond from '../assets/images/projects/spanplafond-led.jpg'
import craftsmanship from '../assets/images/projects/craftsmanship-sunset.jpg'
import flatRoof from '../assets/images/projects/flat-roof-oostende.jpg'
import ownerPortrait from '../assets/images/projects/owner-portrait.jpg'
import companyContent from '../content/company.json'
import homepageContent from '../content/homepage.json'
import projectContent from '../content/project.json'
import storyContent from '../content/story.json'
import galleryContent from '../content/gallery.json'
import processContent from '../content/process.json'
import testimonialsContent from '../content/testimonials.json'
import contactContent from '../content/contact.json'
import { cmsServices } from './cmsServices'

export const images = { entrance, bathroom, renovation, kitchen, spanplafond, craftsmanship, flatRoof, ownerPortrait }
export const company = companyContent
export const nav = [{label:'Specialisaties',href:'#specialisaties'},{label:'Projecten',href:'#projecten'},{label:'Over ons',href:'#over-ons'},{label:'Werkwijze',href:'#werkwijze'},{label:'Contact',href:'#contact'}]
export const hero = homepageContent.hero
export const marquee = homepageContent.marquee
export const intro = homepageContent.intro
export const services = cmsServices
export const signatureProject = { ...projectContent, image: projectContent.image || bathroom }
export const story = { ...storyContent, image: storyContent.image || ownerPortrait }
export const gallery = galleryContent.items.map((item) => ({ ...item, image: item.image || images[item.fallback] }))
export const process = processContent
export const testimonials = testimonialsContent
export const contact = contactContent
