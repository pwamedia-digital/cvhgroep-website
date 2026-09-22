import content from '../content/services.json'

export let cmsServices = content.services

export function applyCmsServices(services) {
  if (Array.isArray(services)) cmsServices = services
}
