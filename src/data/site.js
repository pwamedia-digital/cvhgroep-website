import companyContent from '../content/company.json'
import openingContent from '../content/opening.json'
import introContent from '../content/intro.json'
import projectContent from '../content/project.json'
import storyContent from '../content/story.json'
import galleryContent from '../content/gallery.json'
import processContent from '../content/process.json'
import testimonialsContent from '../content/testimonials.json'
import contactContent from '../content/contact.json'
import { applyCmsServices, cmsServices } from './cmsServices'

export let company = companyContent
export let nav = [{label:'Specialisaties',href:'#specialisaties'},{label:'Projecten',href:'#projecten'},{label:'Over ons',href:'#over-ons'},{label:'Werkwijze',href:'#werkwijze'},{label:'Contact',href:'#contact'}]
export let hero = openingContent.hero
export let marquee = openingContent.marquee
export let intro = introContent
export let services = cmsServices
export let signatureProject = projectContent
export let story = storyContent
export let gallery = galleryContent.items
export let process = processContent
export let testimonials = testimonialsContent
export let contact = contactContent

export function applySiteContent(content) {
  if (!content || typeof content !== 'object') return

  company = content.company ?? company
  nav = content.nav ?? nav
  hero = content.hero ?? hero
  marquee = content.marquee ?? marquee
  intro = content.intro ?? intro
  services = content.services ?? services
  signatureProject = content.signatureProject ?? content.project ?? signatureProject
  story = content.story ?? story
  gallery = content.gallery ?? gallery
  process = content.process ?? process
  testimonials = content.testimonials ?? testimonials
  contact = content.contact ?? contact
  applyCmsServices(services)
}
