import companyContent from '../content/company.json'
import openingContent from '../content/opening.json'
import introContent from '../content/intro.json'
import projectContent from '../content/project.json'
import storyContent from '../content/story.json'
import galleryContent from '../content/gallery.json'
import processContent from '../content/process.json'
import testimonialsContent from '../content/testimonials.json'
import contactContent from '../content/contact.json'
import { cmsServices } from './cmsServices'

export const company = companyContent
export const nav = [{label:'Specialisaties',href:'#specialisaties'},{label:'Projecten',href:'#projecten'},{label:'Over ons',href:'#over-ons'},{label:'Werkwijze',href:'#werkwijze'},{label:'Contact',href:'#contact'}]
export const hero = openingContent.hero
export const marquee = openingContent.marquee
export const intro = introContent
export const services = cmsServices
export const signatureProject = projectContent
export const story = storyContent
export const gallery = galleryContent.items
export const process = processContent
export const testimonials = testimonialsContent
export const contact = contactContent
