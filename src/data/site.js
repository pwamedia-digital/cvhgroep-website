/* ============================================================
   CVH GROEP — Centrale content & sitegegevens
   Eén bron van waarheid voor copy, navigatie en projectdata.
   Teksten zijn overgenomen uit de bestaande site en enkel
   verfijnd voor leesbaarheid, hiërarchie en ritme.
   ============================================================ */

// Projectfoto's
import entrance from '../assets/images/projects/entrance-black-door.jpg'
import bathroom from '../assets/images/projects/bathroom-shower.jpg'
import renovation from '../assets/images/projects/renovation-in-progress.jpg'
import kitchen from '../assets/images/projects/kitchen-modern.jpg'
import spanplafond from '../assets/images/projects/spanplafond-led.jpg'
import craftsmanship from '../assets/images/projects/craftsmanship-sunset.jpg'
import flatRoof from '../assets/images/projects/flat-roof-oostende.jpg'

export const images = {
  entrance,
  bathroom,
  renovation,
  kitchen,
  spanplafond,
  craftsmanship,
  flatRoof,
}

export const company = {
  name: 'CVH Groep',
  legalName: 'Chris Van Hoey Groep',
  tagline: 'Renovaties & Totaalprojecten',
  email: 'info@cvhgroep.be',
  street: 'Prins Roselaan 82',
  city: '8400 Oostende',
  region: 'Oostende & omstreken',
  socials: [
    { label: 'Facebook', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
}

export const nav = [
  { label: 'Specialisaties', href: '#specialisaties' },
  { label: 'Projecten', href: '#projecten' },
  { label: 'Over ons', href: '#over-ons' },
  { label: 'Werkwijze', href: '#werkwijze' },
  { label: 'Contact', href: '#contact' },
]

export const hero = {
  eyebrow: 'Chris Van Hoey Groep — Oostende',
  titleLines: ['Méér dan renovaties,', 'een partnerschap', 'in perfectie.'],
  intro:
    'Eén persoonlijke partner van offerte tot afwerking. Wij vertalen uw visie naar een afgewerkt project — met oog voor elk detail.',
  primaryCta: { label: 'Vraag een offerte', href: '#contact' },
  secondaryCta: { label: 'Ontdek ons werk', href: '#specialisaties' },
}

// Doorlopende band met specialisaties (typografisch statement)
export const marquee = [
  'Renovaties',
  'Spanplafonds',
  'Gietvloeren',
  'Steentapijten',
  'Platte daken',
  'Totaalprojecten',
]

export const intro = {
  eyebrow: 'Wie zijn we',
  title: 'Een gevestigde naam in renovatie, gedreven door detail.',
  paragraphs: [
    'CVH Groep is een gevestigde naam wanneer het over renovatieprojecten gaat. Vanaf de eerste kennismaking tot het fijnste detail werken we samen naar een ultiem resultaat — met een team van dynamische en ervaren experts.',
    'Samen houden we toezicht op de afgesproken kwaliteitsnormen, budgetten en planning. Bij elke uitdaging denken we proactief met u mee, zodat elk detail aansluit bij uw persoonlijke smaak en visie.',
    'Of het nu gaat om een kleine herstelling of een complete renovatie, particulier of zakelijk: CVH Groep is dé totaaloplossing voor iedereen met verbouwingswensen.',
  ],
  pillars: [
    { title: 'Eén aanspreekpunt', text: 'Van offerte tot oplevering blijft Chris uw vaste partner.' },
    { title: 'Heldere afspraken', text: 'Kwaliteitsnormen, budget en planning — transparant bewaakt.' },
    { title: 'Oog voor detail', text: 'Elk detail sluit aan bij uw persoonlijke smaak en visie.' },
    { title: 'Totaaloplossing', text: 'Van kleine herstelling tot complete renovatie, onder één dak.' },
  ],
}

export const services = [
  {
    id: 'renovaties',
    number: '01',
    title: 'Renovaties',
    subtitle: 'Totaalprojecten',
    description:
      'Van eerste kennismaking tot de laatste afwerking begeleiden we uw volledige renovatie. Wij coördineren elke fase en bewaken kwaliteit, budget en timing — zodat u nergens naar om hoeft te kijken.',
    image: images.renovation,
    tags: ['Coördinatie', 'Afwerking', 'Particulier & zakelijk'],
  },
  {
    id: 'spanplafonds',
    number: '02',
    title: 'Spanplafonds',
    subtitle: 'Strak & verlicht',
    description:
      'Strakke, naadloze plafonds met geïntegreerde verlichting en sfeer. Wij geven traditionele ruimtes een moderne touch, zonder in te boeten op kwaliteit of service.',
    image: images.spanplafond,
    tags: ['LED-integratie', 'Naadloos', 'Sfeer'],
  },
  {
    id: 'gietvloeren',
    number: '03',
    title: 'Gietvloeren & Steentapijten',
    subtitle: 'Naadloze vloeren',
    description:
      'Gespecialiseerde, naadloze vloerafwerkingen die elegantie en duurzaamheid verenigen. Een verfijnde basis die uw interieur rust en ruimte geeft.',
    image: images.bathroom,
    tags: ['Naadloos', 'Duurzaam', 'Maatwerk'],
  },
  {
    id: 'platte-daken',
    number: '04',
    title: 'Platte daken',
    subtitle: 'Waterdicht & verzorgd',
    description:
      'Vakkundig geplaatste, waterdichte platte daken die jaren meegaan. Degelijk uitgevoerd en netjes afgewerkt, met respect voor uw woning.',
    image: images.flatRoof,
    tags: ['Waterdicht', 'Duurzaam', 'Vakwerk'],
  },
]

export const signatureProject = {
  eyebrow: 'Project in de kijker',
  title: 'Totale badkamerrenovatie',
  client: 'Yentl Goethals',
  year: '2022',
  status: 'Afgewerkt',
  location: 'Oostende',
  scope: ['Volledige strip & heropbouw', 'Inloopdouche op maat', 'Naadloze vloerafwerking'],
  description:
    'Een complete badkamerrenovatie van A tot Z: van het strippen van de bestaande ruimte tot een strakke, moderne badkamer met inloopdouche en naadloze afwerking. Een project waarbij communicatie en afwerking hand in hand gingen.',
  image: images.bathroom,
}

export const story = {
  eyebrow: 'Over ons',
  title: 'Samen van uw visie een afgewerkt project maken.',
  lead:
    'Als jong en gedreven bedrijf streeft CVH Groep naar continue groei — door elke dag samen met u te bouwen aan een resultaat dat klopt.',
  paragraphs: [
    'Achter CVH Groep staat Chris Van Hoey: uw persoonlijke partner van offerte tot afwerking. Geen anonieme aannemer, maar één vast aanspreekpunt dat uw project van begin tot eind opvolgt.',
    'Met gespecialiseerde kennis in spanplafonds, gietvloeren & steentapijten en platte daken geven we traditionele woningen een moderne touch — zonder in te boeten op kwaliteit en service.',
  ],
  signature: 'Chris Van Hoey',
  signatureRole: 'Zaakvoerder, CVH Groep',
  image: images.craftsmanship,
}

export const gallery = [
  { image: images.entrance, caption: 'Inkomhal & interieur', span: 'tall' },
  { image: images.kitchen, caption: 'Keuken & leefruimte', span: 'wide' },
  { image: images.spanplafond, caption: 'Spanplafond met LED', span: 'normal' },
  { image: images.renovation, caption: 'Renovatie in uitvoering', span: 'normal' },
  { image: images.flatRoof, caption: 'Plat dak — Oostende', span: 'wide' },
  { image: images.craftsmanship, caption: 'Vakmanschap', span: 'tall' },
]

export const process = {
  eyebrow: 'Werkwijze',
  title: 'Van offerte tot afwerking, in vier heldere stappen.',
  steps: [
    {
      number: '01',
      title: 'Kennismaking',
      text: 'We luisteren naar uw wensen en bekijken de ruimte. Samen brengen we de mogelijkheden in kaart.',
    },
    {
      number: '02',
      title: 'Offerte & plan',
      text: 'U ontvangt een heldere offerte met duidelijke afspraken over kwaliteit, budget en planning.',
    },
    {
      number: '03',
      title: 'Uitvoering',
      text: 'Een ervaren team gaat aan de slag. U blijft betrokken via een vaste lijn — alles is bespreekbaar.',
    },
    {
      number: '04',
      title: 'Oplevering',
      text: 'We werken elk detail tot in de puntjes af en leveren een project op waar u trots op bent.',
    },
  ],
}

export const testimonials = {
  eyebrow: 'Wat onze klanten zeggen',
  title: 'Vertrouwen, opgebouwd project na project.',
  items: [
    {
      quote:
        'Een zeer sympathieke mens. Van bij het begin was er een goede samenwerking en communicatie. Foto’s en documenten kan je altijd opvragen — alles is netjes terug te vinden. Alles is bespreekbaar en samen kom je er zeker uit. Kortom een goede ervaring, zeker een aanrader.',
      author: 'Yentl Goethals',
      detail: 'Totale badkamerrenovatie',
    },
    {
      quote:
        'Hebben schilderwerken laten uitvoeren door dit bedrijf. Uiterst tevreden, zowel voor de afwerking als de planning. Ze bleven zelfs onder de raming — uitzonderlijk in de bouw. Een aanrader.',
      author: 'Walter Decock',
      detail: 'Schilderwerken',
    },
    {
      quote:
        'Fantastisch werk en alles netjes op tijd. Nieuwe badkamer en schilderwerken slaapkamer. Aanrader!',
      author: "Mel's Wonderland",
      detail: 'Badkamer & schilderwerken',
    },
  ],
}

export const contact = {
  eyebrow: 'Vraag een offerte',
  title: 'Klaar om samen te bouwen?',
  text: 'Vul het formulier in en we nemen zéér snel contact met u op. Eén partner, van eerste idee tot laatste detail.',
  fields: {
    services: ['Renovatie / totaalproject', 'Spanplafonds', 'Gietvloeren & steentapijten', 'Platte daken', 'Iets anders'],
  },
}
