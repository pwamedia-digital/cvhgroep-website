export type CmsFieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'image'
  | 'url'
  | 'email'
  | 'phone'
  | 'hours'
  | 'list'

export type CmsField = {
  key: string
  label: string
  type: CmsFieldType
  required?: boolean
  help?: string
}

export type CmsModule = {
  key: string
  number: string
  title: string
  enabled: boolean
  fields: CmsField[]
}

export type PwamediaCmsConfig = {
  siteName: string
  cmsLabel: string
  previewPath: string
  modules: CmsModule[]
}

export const cmsConfig: PwamediaCmsConfig = {
  siteName: 'CVH Groep',
  cmsLabel: 'Websitebeheer door PWAMEDIA',
  previewPath: '/',
  modules: [
    {
      key: 'hero',
      number: '01',
      title: 'Opening',
      enabled: true,
      fields: [
        { key: 'eyebrow', label: 'Kleine bovenregel', type: 'text' },
        { key: 'title', label: 'Titel', type: 'text', required: true },
        { key: 'intro', label: 'Intro', type: 'textarea' },
        { key: 'image', label: 'Afbeelding', type: 'image' },
        { key: 'imageAlt', label: 'Alt-tekst', type: 'text' },
      ],
    },
    {
      key: 'company',
      number: '02',
      title: 'Gegevens & uren',
      enabled: true,
      fields: [
        { key: 'name', label: 'Naam', type: 'text', required: true },
        { key: 'street', label: 'Straat', type: 'text' },
        { key: 'city', label: 'Postcode & gemeente', type: 'text' },
        { key: 'phone', label: 'Telefoon', type: 'phone' },
        { key: 'email', label: 'E-mail', type: 'email' },
        { key: 'hours', label: 'Openingsuren', type: 'hours' },
      ],
    },
  ],
}
