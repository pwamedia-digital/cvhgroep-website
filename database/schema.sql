-- PWAMEDIA Website Starter database schema
-- Snapshot for Better Auth 1.7.5 + PWAMEDIA CMS tables.
-- Intended for a fresh Neon/PostgreSQL database per customer website.

BEGIN;

CREATE TABLE IF NOT EXISTS "user" (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL DEFAULT false,
  image text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  "twoFactorEnabled" boolean DEFAULT false,
  role text NOT NULL DEFAULT 'klantbeheerder',
  banned boolean NOT NULL DEFAULT false,
  "banReason" text,
  "banExpires" timestamptz
);

CREATE TABLE IF NOT EXISTS account (
  id text PRIMARY KEY,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  scope text,
  password text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON account ("userId");

CREATE TABLE IF NOT EXISTS session (
  id text PRIMARY KEY,
  "expiresAt" timestamptz NOT NULL,
  token text NOT NULL UNIQUE,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "impersonatedBy" text
);
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON session ("userId");

CREATE TABLE IF NOT EXISTS verification (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  "expiresAt" timestamptz NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verification (identifier);

CREATE TABLE IF NOT EXISTS "twoFactor" (
  id text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  secret text NOT NULL,
  "backupCodes" text NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  "failedVerificationCount" integer NOT NULL DEFAULT 0,
  "lockedUntil" timestamptz
);
CREATE INDEX IF NOT EXISTS "twoFactor_userId_idx" ON "twoFactor" ("userId");

CREATE TABLE IF NOT EXISTS "rateLimit" (
  id text PRIMARY KEY,
  key text NOT NULL UNIQUE,
  count integer NOT NULL,
  "lastRequest" bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS cms_content (
  id text PRIMARY KEY,
  draft jsonb NOT NULL,
  published jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE TABLE IF NOT EXISTS cms_audit_log (
  id bigserial PRIMARY KEY,
  actor_user_id text,
  action text NOT NULL,
  target_user_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cms_audit_log_actor_idx ON cms_audit_log (actor_user_id);
CREATE INDEX IF NOT EXISTS cms_audit_log_target_idx ON cms_audit_log (target_user_id);
CREATE INDEX IF NOT EXISTS cms_audit_log_created_at_idx ON cms_audit_log (created_at DESC);

INSERT INTO cms_content (id, draft, published)
VALUES (
  'site',
  $cms$
{
  "company": {
    "name": "CVH Groep",
    "legalName": "Chris Van Hoey Groep",
    "tagline": "Renovaties & Totaalprojecten",
    "email": "info@cvhgroep.be",
    "street": "Prins Roselaan 82",
    "city": "8400 Oostende",
    "region": "Oostende & omstreken",
    "socials": [
      {
        "label": "Facebook",
        "href": "#"
      },
      {
        "label": "Instagram",
        "href": "#"
      },
      {
        "label": "LinkedIn",
        "href": "#"
      }
    ]
  },
  "nav": [
    {
      "label": "Specialisaties",
      "href": "#specialisaties"
    },
    {
      "label": "Projecten",
      "href": "#projecten"
    },
    {
      "label": "Over ons",
      "href": "#over-ons"
    },
    {
      "label": "Werkwijze",
      "href": "#werkwijze"
    },
    {
      "label": "Contact",
      "href": "#contact"
    }
  ],
  "hero": {
    "eyebrow": "Chris Van Hoey Groep — Oostende",
    "titleLines": [
      "Méér dan renovaties,",
      "een partnerschap",
      "in perfectie."
    ],
    "intro": "Eén persoonlijke partner van offerte tot afwerking. Wij vertalen uw visie naar een afgewerkt project — met oog voor elk detail.",
    "primaryCta": {
      "label": "Vraag een offerte",
      "href": "#contact"
    },
    "secondaryCta": {
      "label": "Ontdek ons werk",
      "href": "#specialisaties"
    },
    "image": "/uploads/current-craftsmanship-sunset.jpg"
  },
  "marquee": [
    "Renovaties",
    "Spanplafonds",
    "Gietvloeren",
    "Steentapijten",
    "Platte daken",
    "Totaalprojecten"
  ],
  "intro": {
    "eyebrow": "Wie zijn we",
    "title": "Een gevestigde naam in renovatie, gedreven door detail.",
    "paragraphs": [
      "CVH Groep is een gevestigde naam wanneer het over renovatieprojecten gaat. Vanaf de eerste kennismaking tot het fijnste detail werken we samen naar een ultiem resultaat — met een team van dynamische en ervaren experts.",
      "Samen houden we toezicht op de afgesproken kwaliteitsnormen, budgetten en planning. Bij elke uitdaging denken we proactief met u mee, zodat elk detail aansluit bij uw persoonlijke smaak en visie.",
      "Of het nu gaat om een kleine herstelling of een complete renovatie, particulier of zakelijk: CVH Groep is dé totaaloplossing voor iedereen met verbouwingswensen."
    ],
    "pillars": [
      {
        "title": "Eén aanspreekpunt",
        "text": "Van offerte tot oplevering blijft Chris uw vaste partner."
      },
      {
        "title": "Heldere afspraken",
        "text": "Kwaliteitsnormen, budget en planning — transparant bewaakt."
      },
      {
        "title": "Oog voor detail",
        "text": "Elk detail sluit aan bij uw persoonlijke smaak en visie."
      },
      {
        "title": "Totaaloplossing",
        "text": "Van kleine herstelling tot complete renovatie, onder één dak."
      }
    ]
  },
  "services": [
    {
      "id": "renovaties",
      "number": "01",
      "title": "Renovaties",
      "subtitle": "Totaalprojecten",
      "image": "/uploads/pasted-image-1789467997727.png",
      "description": "Van eerste kennismaking tot de laatste afwerking begeleiden we uw volledige renovatie. Wij coördineren elke fase en bewaken kwaliteit, budget en timing — zodat u nergens naar om hoeft te kijken.",
      "tags": [
        "Coördinatie",
        "Afwerking",
        "Particulier & zakelijk"
      ],
      "lead": "Een renovatie bestaat uit veel meer dan afzonderlijke werken. CVH Groep brengt alle onderdelen samen in één doordacht traject, met één aanspreekpunt dat planning, uitvoering en afwerking bewaakt.",
      "intro": [
        "We starten met een grondige bespreking van de bestaande situatie, uw wensen en het beschikbare budget. Daarna bepalen we samen welke ingrepen nodig zijn en in welke volgorde ze het best worden uitgevoerd.",
        "Tijdens de werken stemmen we de verschillende vakdisciplines op elkaar af. Zo vermijden we verloren tijd, onverwachte tussenstappen en afwerkingen die later opnieuw moeten worden opengebroken."
      ],
      "techniques": [
        {
          "title": "Afbraak en voorbereiding",
          "text": "Bestaande elementen worden gecontroleerd en zorgvuldig verwijderd. Ondergronden en aansluitingen worden voorbereid voor de nieuwe opbouw."
        },
        {
          "title": "Technieken en indeling",
          "text": "Elektriciteit, sanitair, verwarming en nieuwe indelingen worden logisch ingepland vóór de zichtbare afwerking begint."
        },
        {
          "title": "Binnenafwerking",
          "text": "Wanden, plafonds, vloeren, schilderwerk en maatdetails worden als één geheel uitgevoerd en op elkaar afgestemd."
        },
        {
          "title": "Coördinatie",
          "text": "Materialen, uitvoerders en timing worden centraal opgevolgd. U behoudt één duidelijk aanspreekpunt doorheen het hele project."
        }
      ],
      "suitable": [
        "Totaalrenovaties van woningen en appartementen",
        "Badkamers, keukens en leefruimtes",
        "Herindelingen en modernisering",
        "Kleine herstellingen en gerichte afwerking"
      ],
      "note": "Elke woning en iedere bestaande constructie is anders. Daarom volgt de definitieve werkwijze altijd uit een plaatsbezoek en een technische beoordeling."
    },
    {
      "id": "spanplafonds",
      "number": "02",
      "title": "Spanplafonds",
      "subtitle": "Strak & verlicht",
      "image": "/uploads/current-spanplafond-led.jpg",
      "description": "Strakke, naadloze plafonds met geïntegreerde verlichting en sfeer. Wij geven traditionele ruimtes een moderne touch, zonder in te boeten op kwaliteit of service.",
      "tags": [
        "LED-integratie",
        "Naadloos",
        "Sfeer"
      ],
      "lead": "Een spanplafond is een strak afgewerkt doek dat onder het bestaande plafond wordt gemonteerd. Het verbergt oneffenheden en leidingen en biedt tegelijk veel vrijheid voor verlichting en sfeer.",
      "intro": [
        "Langs de omtrek van de ruimte plaatsen we profielen op maat. Het plafondmembraan wordt daarin opgespannen, waardoor een egaal oppervlak ontstaat zonder traditioneel pleister- of schilderwerk.",
        "Verlichting, ventilatieroosters, luidsprekers en andere plafondonderdelen kunnen vooraf in het ontwerp worden geïntegreerd. De exacte opbouw stemmen we af op de ruimte en de gewenste uitstraling."
      ],
      "techniques": [
        {
          "title": "Strak spanplafond",
          "text": "Een matte, satijnen of glanzende afwerking zorgt voor een vlak en rustig plafond dat bij de stijl van het interieur past."
        },
        {
          "title": "Indirecte LED-verlichting",
          "text": "LED-lijnen of lichtnissen worden in de plafondopbouw verwerkt voor functioneel licht, sfeerlicht of een combinatie van beide."
        },
        {
          "title": "Lichtdoorlatend plafond",
          "text": "Een translucente uitvoering kan als groot, egaal lichtvlak dienen en het licht zacht over de ruimte verdelen."
        },
        {
          "title": "Akoestische oplossing",
          "text": "In geschikte ruimtes kan een geperforeerd membraan gecombineerd worden met absorberend materiaal om hinderlijke galm te beperken."
        }
      ],
      "suitable": [
        "Woonkamers, keukens en badkamers",
        "Renovatie van beschadigde of ongelijke plafonds",
        "Inbouw van verlichting en technische elementen",
        "Ruimtes waar een snelle, nette afwerking gewenst is"
      ],
      "note": "De beste folie, profielen en verlichting hangen af van de ruimte, vochtbelasting, ondergrond en gewenste lichtopbrengst. Dat bekijken we vooraf ter plaatse."
    },
    {
      "id": "gietvloeren",
      "number": "03",
      "title": "Gietvloeren & Steentapijten",
      "subtitle": "Naadloze vloeren",
      "image": "/uploads/current-bathroom-shower.jpg",
      "description": "Gespecialiseerde, naadloze vloerafwerkingen die elegantie en duurzaamheid verenigen. Een verfijnde basis die uw interieur rust en ruimte geeft.",
      "tags": [
        "Naadloos",
        "Duurzaam",
        "Maatwerk"
      ],
      "lead": "Gietvloeren en steentapijten creëren een rustige, doorlopende vloer met weinig visuele onderbrekingen. De juiste keuze hangt af van het gebruik, de ondergrond en de gewenste uitstraling.",
      "intro": [
        "Een duurzame vloer begint bij de ondergrond. We controleren vlakheid, stabiliteit en vocht en voeren waar nodig herstellingen of voorbereidende lagen uit. Pas daarna bouwen we het gekozen vloersysteem zorgvuldig op.",
        "Kleur, korrel, glansgraad en afwerking worden afgestemd op het interieur. Ook aansluitingen aan plinten, deuren, trappen en andere vloeren krijgen bijzondere aandacht."
      ],
      "techniques": [
        {
          "title": "Gietvloer",
          "text": "Een vloeibaar aangebracht meerlagensysteem vormt na uitharding een strak en vrijwel naadloos oppervlak met een moderne uitstraling."
        },
        {
          "title": "Steentapijt",
          "text": "Fijne, geselecteerde steenkorrels worden met een bindmiddel verwerkt tot een karaktervolle vloer met een natuurlijke structuur."
        },
        {
          "title": "Voorbereiding ondergrond",
          "text": "Reinigen, herstellen, egaliseren en primeren zorgen voor een stabiele hechting en een gelijkmatig eindresultaat."
        },
        {
          "title": "Beschermende afwerking",
          "text": "Afhankelijk van het systeem en gebruik wordt een geschikte sealer of toplak voorzien voor onderhoudsgemak en extra bescherming."
        }
      ],
      "suitable": [
        "Leefruimtes, keukens en badkamers",
        "Nieuwbouw en renovatie",
        "Moderne interieurs met een rustige vloerbasis",
        "Trappen en ruimtes met complexe vormen"
      ],
      "note": "Niet ieder vloersysteem is geschikt voor elke ondergrond of belasting. Bewegingsvoegen, restvocht en bestaande scheuren worden daarom altijd vooraf beoordeeld."
    },
    {
      "id": "platte-daken",
      "number": "04",
      "title": "Platte daken",
      "subtitle": "Waterdicht & verzorgd",
      "image": "/uploads/current-flat-roof-oostende.jpg",
      "description": "Vakkundig geplaatste, waterdichte platte daken die jaren meegaan. Degelijk uitgevoerd en netjes afgewerkt, met respect voor uw woning.",
      "tags": [
        "Waterdicht",
        "Duurzaam",
        "Vakwerk"
      ],
      "lead": "Een plat dak moet regen, wind en temperatuurschommelingen jarenlang aankunnen. Een correcte opbouw, zorgvuldige detaillering en vrije waterafvoer zijn daarbij minstens zo belangrijk als de dakbedekking zelf.",
      "intro": [
        "We bekijken de bestaande dakconstructie, helling, afvoeren, dakranden en doorvoeren. Bij renovatie controleren we welke lagen behouden kunnen blijven en waar herstel of een nieuwe opbouw nodig is.",
        "Isolatie en dakdichting worden als één systeem benaderd. Vooral aansluitingen rond koepels, schouwen, opstanden en regenwaterafvoer worden nauwkeurig uitgevoerd."
      ],
      "techniques": [
        {
          "title": "Dakvoorbereiding",
          "text": "De draagvloer en bestaande lagen worden gecontroleerd. Losse of beschadigde delen worden hersteld voor een stabiele en propere basis."
        },
        {
          "title": "Isolatie en dampscherm",
          "text": "Waar de dakopbouw dit vereist, beperken correct geplaatste lagen warmteverlies en ongewenst vochttransport in de constructie."
        },
        {
          "title": "Waterdichte dakbedekking",
          "text": "Het gekozen afdichtingssysteem wordt zorgvuldig aangebracht met bijzondere aandacht voor naden, randen en overlappingen."
        },
        {
          "title": "Details en afwatering",
          "text": "Dakdoorvoeren, lichtkoepels, opstanden en afvoeren worden degelijk aangesloten zodat regenwater vlot weg kan."
        }
      ],
      "suitable": [
        "Nieuwe platte daken en uitbreidingen",
        "Renovatie van verouderde dakbedekking",
        "Verbetering van dakisolatie",
        "Herstel van aansluitingen, randen en afvoeren"
      ],
      "note": "Vochtproblemen kunnen verschillende oorzaken hebben. Een plaatsbezoek is nodig om de bestaande opbouw te beoordelen en de juiste herstelmethode te bepalen."
    }
  ],
  "signatureProject": {
    "eyebrow": "Project in de kijker",
    "title": "Totale badkamerrenovatie",
    "client": "Yentl Goethals",
    "year": "2022",
    "status": "Afgewerkt",
    "location": "Oostende",
    "image": "/uploads/current-bathroom-shower.jpg",
    "scope": [
      "Volledige strip & heropbouw",
      "Inloopdouche op maat",
      "Naadloze vloerafwerking"
    ],
    "description": "Een complete badkamerrenovatie van A tot Z: van het strippen van de bestaande ruimte tot een strakke, moderne badkamer met inloopdouche en naadloze afwerking. Een project waarbij communicatie en afwerking hand in hand gingen."
  },
  "story": {
    "eyebrow": "Over ons",
    "title": "Samen van uw visie een afgewerkt project maken.",
    "lead": "Als jong en gedreven bedrijf streeft CVH Groep naar continue groei — door elke dag samen met u te bouwen aan een resultaat dat klopt.",
    "paragraphs": [
      "Achter CVH Groep staat Chris Van Hoey: uw persoonlijke partner van offerte tot afwerking. Geen anonieme aannemer, maar één vast aanspreekpunt dat uw project van begin tot eind opvolgt.",
      "Met gespecialiseerde kennis in spanplafonds, gietvloeren & steentapijten en platte daken geven we traditionele woningen een moderne touch — zonder in te boeten op kwaliteit en service."
    ],
    "signature": "Chris Van Hoey",
    "signatureRole": "Zaakvoerder, CVH Groep",
    "image": "/uploads/current-owner-portrait.jpg"
  },
  "gallery": [
    {
      "image": "/uploads/current-entrance-black-door.jpg",
      "caption": "Inkomhal & interieur",
      "span": "tall"
    },
    {
      "image": "/uploads/current-kitchen-modern.jpg",
      "caption": "Keuken & leefruimte",
      "span": "wide"
    },
    {
      "image": "/uploads/current-spanplafond-led.jpg",
      "caption": "Spanplafond met LED",
      "span": "normal"
    },
    {
      "image": "/uploads/current-renovation-in-progress.jpg",
      "caption": "Renovatie in uitvoering",
      "span": "normal"
    },
    {
      "image": "/uploads/current-flat-roof-oostende.jpg",
      "caption": "Plat dak — Oostende",
      "span": "wide"
    },
    {
      "image": "/uploads/current-craftsmanship-sunset.jpg",
      "caption": "Vakmanschap",
      "span": "tall"
    }
  ],
  "process": {
    "eyebrow": "Werkwijze",
    "title": "Van offerte tot afwerking, in vier heldere stappen.",
    "intro": "Eén persoonlijke partner begeleidt u door elke fase — helder, betrokken en zonder verrassingen.",
    "steps": [
      {
        "number": "01",
        "title": "Kennismaking",
        "text": "We luisteren naar uw wensen en bekijken de ruimte. Samen brengen we de mogelijkheden in kaart."
      },
      {
        "number": "02",
        "title": "Offerte & plan",
        "text": "U ontvangt een heldere offerte met duidelijke afspraken over kwaliteit, budget en planning."
      },
      {
        "number": "03",
        "title": "Uitvoering",
        "text": "Een ervaren team gaat aan de slag. U blijft betrokken via een vaste lijn — alles is bespreekbaar."
      },
      {
        "number": "04",
        "title": "Oplevering",
        "text": "We werken elk detail tot in de puntjes af en leveren een project op waar u trots op bent."
      }
    ]
  },
  "testimonials": {
    "eyebrow": "Wat onze klanten zeggen",
    "title": "Vertrouwen, opgebouwd project na project.",
    "items": [
      {
        "quote": "Een zeer sympathieke mens. Van bij het begin was er een goede samenwerking en communicatie. Foto’s en documenten kan je altijd opvragen — alles is netjes terug te vinden. Alles is bespreekbaar en samen kom je er zeker uit. Kortom een goede ervaring, zeker een aanrader.",
        "author": "Yentl Goethals",
        "detail": "Totale badkamerrenovatie"
      },
      {
        "quote": "Hebben schilderwerken laten uitvoeren door dit bedrijf. Uiterst tevreden, zowel voor de afwerking als de planning. Ze bleven zelfs onder de raming — uitzonderlijk in de bouw. Een aanrader.",
        "author": "Walter Decock",
        "detail": "Schilderwerken"
      },
      {
        "quote": "Fantastisch werk en alles netjes op tijd. Nieuwe badkamer en schilderwerken slaapkamer. Aanrader!",
        "author": "Mel's Wonderland",
        "detail": "Badkamer & schilderwerken"
      }
    ]
  },
  "contact": {
    "eyebrow": "Vraag een offerte",
    "title": "Klaar om samen te bouwen?",
    "text": "Vul het formulier in en we nemen zéér snel contact met u op. Eén partner, van eerste idee tot laatste detail.",
    "fields": {
      "services": [
        "Renovatie / totaalproject",
        "Spanplafonds",
        "Gietvloeren & steentapijten",
        "Platte daken",
        "Iets anders"
      ]
    }
  }
}
$cms$::jsonb,
  $cms$
{
  "company": {
    "name": "CVH Groep",
    "legalName": "Chris Van Hoey Groep",
    "tagline": "Renovaties & Totaalprojecten",
    "email": "info@cvhgroep.be",
    "street": "Prins Roselaan 82",
    "city": "8400 Oostende",
    "region": "Oostende & omstreken",
    "socials": [
      {
        "label": "Facebook",
        "href": "#"
      },
      {
        "label": "Instagram",
        "href": "#"
      },
      {
        "label": "LinkedIn",
        "href": "#"
      }
    ]
  },
  "nav": [
    {
      "label": "Specialisaties",
      "href": "#specialisaties"
    },
    {
      "label": "Projecten",
      "href": "#projecten"
    },
    {
      "label": "Over ons",
      "href": "#over-ons"
    },
    {
      "label": "Werkwijze",
      "href": "#werkwijze"
    },
    {
      "label": "Contact",
      "href": "#contact"
    }
  ],
  "hero": {
    "eyebrow": "Chris Van Hoey Groep — Oostende",
    "titleLines": [
      "Méér dan renovaties,",
      "een partnerschap",
      "in perfectie."
    ],
    "intro": "Eén persoonlijke partner van offerte tot afwerking. Wij vertalen uw visie naar een afgewerkt project — met oog voor elk detail.",
    "primaryCta": {
      "label": "Vraag een offerte",
      "href": "#contact"
    },
    "secondaryCta": {
      "label": "Ontdek ons werk",
      "href": "#specialisaties"
    },
    "image": "/uploads/current-craftsmanship-sunset.jpg"
  },
  "marquee": [
    "Renovaties",
    "Spanplafonds",
    "Gietvloeren",
    "Steentapijten",
    "Platte daken",
    "Totaalprojecten"
  ],
  "intro": {
    "eyebrow": "Wie zijn we",
    "title": "Een gevestigde naam in renovatie, gedreven door detail.",
    "paragraphs": [
      "CVH Groep is een gevestigde naam wanneer het over renovatieprojecten gaat. Vanaf de eerste kennismaking tot het fijnste detail werken we samen naar een ultiem resultaat — met een team van dynamische en ervaren experts.",
      "Samen houden we toezicht op de afgesproken kwaliteitsnormen, budgetten en planning. Bij elke uitdaging denken we proactief met u mee, zodat elk detail aansluit bij uw persoonlijke smaak en visie.",
      "Of het nu gaat om een kleine herstelling of een complete renovatie, particulier of zakelijk: CVH Groep is dé totaaloplossing voor iedereen met verbouwingswensen."
    ],
    "pillars": [
      {
        "title": "Eén aanspreekpunt",
        "text": "Van offerte tot oplevering blijft Chris uw vaste partner."
      },
      {
        "title": "Heldere afspraken",
        "text": "Kwaliteitsnormen, budget en planning — transparant bewaakt."
      },
      {
        "title": "Oog voor detail",
        "text": "Elk detail sluit aan bij uw persoonlijke smaak en visie."
      },
      {
        "title": "Totaaloplossing",
        "text": "Van kleine herstelling tot complete renovatie, onder één dak."
      }
    ]
  },
  "services": [
    {
      "id": "renovaties",
      "number": "01",
      "title": "Renovaties",
      "subtitle": "Totaalprojecten",
      "image": "/uploads/pasted-image-1789467997727.png",
      "description": "Van eerste kennismaking tot de laatste afwerking begeleiden we uw volledige renovatie. Wij coördineren elke fase en bewaken kwaliteit, budget en timing — zodat u nergens naar om hoeft te kijken.",
      "tags": [
        "Coördinatie",
        "Afwerking",
        "Particulier & zakelijk"
      ],
      "lead": "Een renovatie bestaat uit veel meer dan afzonderlijke werken. CVH Groep brengt alle onderdelen samen in één doordacht traject, met één aanspreekpunt dat planning, uitvoering en afwerking bewaakt.",
      "intro": [
        "We starten met een grondige bespreking van de bestaande situatie, uw wensen en het beschikbare budget. Daarna bepalen we samen welke ingrepen nodig zijn en in welke volgorde ze het best worden uitgevoerd.",
        "Tijdens de werken stemmen we de verschillende vakdisciplines op elkaar af. Zo vermijden we verloren tijd, onverwachte tussenstappen en afwerkingen die later opnieuw moeten worden opengebroken."
      ],
      "techniques": [
        {
          "title": "Afbraak en voorbereiding",
          "text": "Bestaande elementen worden gecontroleerd en zorgvuldig verwijderd. Ondergronden en aansluitingen worden voorbereid voor de nieuwe opbouw."
        },
        {
          "title": "Technieken en indeling",
          "text": "Elektriciteit, sanitair, verwarming en nieuwe indelingen worden logisch ingepland vóór de zichtbare afwerking begint."
        },
        {
          "title": "Binnenafwerking",
          "text": "Wanden, plafonds, vloeren, schilderwerk en maatdetails worden als één geheel uitgevoerd en op elkaar afgestemd."
        },
        {
          "title": "Coördinatie",
          "text": "Materialen, uitvoerders en timing worden centraal opgevolgd. U behoudt één duidelijk aanspreekpunt doorheen het hele project."
        }
      ],
      "suitable": [
        "Totaalrenovaties van woningen en appartementen",
        "Badkamers, keukens en leefruimtes",
        "Herindelingen en modernisering",
        "Kleine herstellingen en gerichte afwerking"
      ],
      "note": "Elke woning en iedere bestaande constructie is anders. Daarom volgt de definitieve werkwijze altijd uit een plaatsbezoek en een technische beoordeling."
    },
    {
      "id": "spanplafonds",
      "number": "02",
      "title": "Spanplafonds",
      "subtitle": "Strak & verlicht",
      "image": "/uploads/current-spanplafond-led.jpg",
      "description": "Strakke, naadloze plafonds met geïntegreerde verlichting en sfeer. Wij geven traditionele ruimtes een moderne touch, zonder in te boeten op kwaliteit of service.",
      "tags": [
        "LED-integratie",
        "Naadloos",
        "Sfeer"
      ],
      "lead": "Een spanplafond is een strak afgewerkt doek dat onder het bestaande plafond wordt gemonteerd. Het verbergt oneffenheden en leidingen en biedt tegelijk veel vrijheid voor verlichting en sfeer.",
      "intro": [
        "Langs de omtrek van de ruimte plaatsen we profielen op maat. Het plafondmembraan wordt daarin opgespannen, waardoor een egaal oppervlak ontstaat zonder traditioneel pleister- of schilderwerk.",
        "Verlichting, ventilatieroosters, luidsprekers en andere plafondonderdelen kunnen vooraf in het ontwerp worden geïntegreerd. De exacte opbouw stemmen we af op de ruimte en de gewenste uitstraling."
      ],
      "techniques": [
        {
          "title": "Strak spanplafond",
          "text": "Een matte, satijnen of glanzende afwerking zorgt voor een vlak en rustig plafond dat bij de stijl van het interieur past."
        },
        {
          "title": "Indirecte LED-verlichting",
          "text": "LED-lijnen of lichtnissen worden in de plafondopbouw verwerkt voor functioneel licht, sfeerlicht of een combinatie van beide."
        },
        {
          "title": "Lichtdoorlatend plafond",
          "text": "Een translucente uitvoering kan als groot, egaal lichtvlak dienen en het licht zacht over de ruimte verdelen."
        },
        {
          "title": "Akoestische oplossing",
          "text": "In geschikte ruimtes kan een geperforeerd membraan gecombineerd worden met absorberend materiaal om hinderlijke galm te beperken."
        }
      ],
      "suitable": [
        "Woonkamers, keukens en badkamers",
        "Renovatie van beschadigde of ongelijke plafonds",
        "Inbouw van verlichting en technische elementen",
        "Ruimtes waar een snelle, nette afwerking gewenst is"
      ],
      "note": "De beste folie, profielen en verlichting hangen af van de ruimte, vochtbelasting, ondergrond en gewenste lichtopbrengst. Dat bekijken we vooraf ter plaatse."
    },
    {
      "id": "gietvloeren",
      "number": "03",
      "title": "Gietvloeren & Steentapijten",
      "subtitle": "Naadloze vloeren",
      "image": "/uploads/current-bathroom-shower.jpg",
      "description": "Gespecialiseerde, naadloze vloerafwerkingen die elegantie en duurzaamheid verenigen. Een verfijnde basis die uw interieur rust en ruimte geeft.",
      "tags": [
        "Naadloos",
        "Duurzaam",
        "Maatwerk"
      ],
      "lead": "Gietvloeren en steentapijten creëren een rustige, doorlopende vloer met weinig visuele onderbrekingen. De juiste keuze hangt af van het gebruik, de ondergrond en de gewenste uitstraling.",
      "intro": [
        "Een duurzame vloer begint bij de ondergrond. We controleren vlakheid, stabiliteit en vocht en voeren waar nodig herstellingen of voorbereidende lagen uit. Pas daarna bouwen we het gekozen vloersysteem zorgvuldig op.",
        "Kleur, korrel, glansgraad en afwerking worden afgestemd op het interieur. Ook aansluitingen aan plinten, deuren, trappen en andere vloeren krijgen bijzondere aandacht."
      ],
      "techniques": [
        {
          "title": "Gietvloer",
          "text": "Een vloeibaar aangebracht meerlagensysteem vormt na uitharding een strak en vrijwel naadloos oppervlak met een moderne uitstraling."
        },
        {
          "title": "Steentapijt",
          "text": "Fijne, geselecteerde steenkorrels worden met een bindmiddel verwerkt tot een karaktervolle vloer met een natuurlijke structuur."
        },
        {
          "title": "Voorbereiding ondergrond",
          "text": "Reinigen, herstellen, egaliseren en primeren zorgen voor een stabiele hechting en een gelijkmatig eindresultaat."
        },
        {
          "title": "Beschermende afwerking",
          "text": "Afhankelijk van het systeem en gebruik wordt een geschikte sealer of toplak voorzien voor onderhoudsgemak en extra bescherming."
        }
      ],
      "suitable": [
        "Leefruimtes, keukens en badkamers",
        "Nieuwbouw en renovatie",
        "Moderne interieurs met een rustige vloerbasis",
        "Trappen en ruimtes met complexe vormen"
      ],
      "note": "Niet ieder vloersysteem is geschikt voor elke ondergrond of belasting. Bewegingsvoegen, restvocht en bestaande scheuren worden daarom altijd vooraf beoordeeld."
    },
    {
      "id": "platte-daken",
      "number": "04",
      "title": "Platte daken",
      "subtitle": "Waterdicht & verzorgd",
      "image": "/uploads/current-flat-roof-oostende.jpg",
      "description": "Vakkundig geplaatste, waterdichte platte daken die jaren meegaan. Degelijk uitgevoerd en netjes afgewerkt, met respect voor uw woning.",
      "tags": [
        "Waterdicht",
        "Duurzaam",
        "Vakwerk"
      ],
      "lead": "Een plat dak moet regen, wind en temperatuurschommelingen jarenlang aankunnen. Een correcte opbouw, zorgvuldige detaillering en vrije waterafvoer zijn daarbij minstens zo belangrijk als de dakbedekking zelf.",
      "intro": [
        "We bekijken de bestaande dakconstructie, helling, afvoeren, dakranden en doorvoeren. Bij renovatie controleren we welke lagen behouden kunnen blijven en waar herstel of een nieuwe opbouw nodig is.",
        "Isolatie en dakdichting worden als één systeem benaderd. Vooral aansluitingen rond koepels, schouwen, opstanden en regenwaterafvoer worden nauwkeurig uitgevoerd."
      ],
      "techniques": [
        {
          "title": "Dakvoorbereiding",
          "text": "De draagvloer en bestaande lagen worden gecontroleerd. Losse of beschadigde delen worden hersteld voor een stabiele en propere basis."
        },
        {
          "title": "Isolatie en dampscherm",
          "text": "Waar de dakopbouw dit vereist, beperken correct geplaatste lagen warmteverlies en ongewenst vochttransport in de constructie."
        },
        {
          "title": "Waterdichte dakbedekking",
          "text": "Het gekozen afdichtingssysteem wordt zorgvuldig aangebracht met bijzondere aandacht voor naden, randen en overlappingen."
        },
        {
          "title": "Details en afwatering",
          "text": "Dakdoorvoeren, lichtkoepels, opstanden en afvoeren worden degelijk aangesloten zodat regenwater vlot weg kan."
        }
      ],
      "suitable": [
        "Nieuwe platte daken en uitbreidingen",
        "Renovatie van verouderde dakbedekking",
        "Verbetering van dakisolatie",
        "Herstel van aansluitingen, randen en afvoeren"
      ],
      "note": "Vochtproblemen kunnen verschillende oorzaken hebben. Een plaatsbezoek is nodig om de bestaande opbouw te beoordelen en de juiste herstelmethode te bepalen."
    }
  ],
  "signatureProject": {
    "eyebrow": "Project in de kijker",
    "title": "Totale badkamerrenovatie",
    "client": "Yentl Goethals",
    "year": "2022",
    "status": "Afgewerkt",
    "location": "Oostende",
    "image": "/uploads/current-bathroom-shower.jpg",
    "scope": [
      "Volledige strip & heropbouw",
      "Inloopdouche op maat",
      "Naadloze vloerafwerking"
    ],
    "description": "Een complete badkamerrenovatie van A tot Z: van het strippen van de bestaande ruimte tot een strakke, moderne badkamer met inloopdouche en naadloze afwerking. Een project waarbij communicatie en afwerking hand in hand gingen."
  },
  "story": {
    "eyebrow": "Over ons",
    "title": "Samen van uw visie een afgewerkt project maken.",
    "lead": "Als jong en gedreven bedrijf streeft CVH Groep naar continue groei — door elke dag samen met u te bouwen aan een resultaat dat klopt.",
    "paragraphs": [
      "Achter CVH Groep staat Chris Van Hoey: uw persoonlijke partner van offerte tot afwerking. Geen anonieme aannemer, maar één vast aanspreekpunt dat uw project van begin tot eind opvolgt.",
      "Met gespecialiseerde kennis in spanplafonds, gietvloeren & steentapijten en platte daken geven we traditionele woningen een moderne touch — zonder in te boeten op kwaliteit en service."
    ],
    "signature": "Chris Van Hoey",
    "signatureRole": "Zaakvoerder, CVH Groep",
    "image": "/uploads/current-owner-portrait.jpg"
  },
  "gallery": [
    {
      "image": "/uploads/current-entrance-black-door.jpg",
      "caption": "Inkomhal & interieur",
      "span": "tall"
    },
    {
      "image": "/uploads/current-kitchen-modern.jpg",
      "caption": "Keuken & leefruimte",
      "span": "wide"
    },
    {
      "image": "/uploads/current-spanplafond-led.jpg",
      "caption": "Spanplafond met LED",
      "span": "normal"
    },
    {
      "image": "/uploads/current-renovation-in-progress.jpg",
      "caption": "Renovatie in uitvoering",
      "span": "normal"
    },
    {
      "image": "/uploads/current-flat-roof-oostende.jpg",
      "caption": "Plat dak — Oostende",
      "span": "wide"
    },
    {
      "image": "/uploads/current-craftsmanship-sunset.jpg",
      "caption": "Vakmanschap",
      "span": "tall"
    }
  ],
  "process": {
    "eyebrow": "Werkwijze",
    "title": "Van offerte tot afwerking, in vier heldere stappen.",
    "intro": "Eén persoonlijke partner begeleidt u door elke fase — helder, betrokken en zonder verrassingen.",
    "steps": [
      {
        "number": "01",
        "title": "Kennismaking",
        "text": "We luisteren naar uw wensen en bekijken de ruimte. Samen brengen we de mogelijkheden in kaart."
      },
      {
        "number": "02",
        "title": "Offerte & plan",
        "text": "U ontvangt een heldere offerte met duidelijke afspraken over kwaliteit, budget en planning."
      },
      {
        "number": "03",
        "title": "Uitvoering",
        "text": "Een ervaren team gaat aan de slag. U blijft betrokken via een vaste lijn — alles is bespreekbaar."
      },
      {
        "number": "04",
        "title": "Oplevering",
        "text": "We werken elk detail tot in de puntjes af en leveren een project op waar u trots op bent."
      }
    ]
  },
  "testimonials": {
    "eyebrow": "Wat onze klanten zeggen",
    "title": "Vertrouwen, opgebouwd project na project.",
    "items": [
      {
        "quote": "Een zeer sympathieke mens. Van bij het begin was er een goede samenwerking en communicatie. Foto’s en documenten kan je altijd opvragen — alles is netjes terug te vinden. Alles is bespreekbaar en samen kom je er zeker uit. Kortom een goede ervaring, zeker een aanrader.",
        "author": "Yentl Goethals",
        "detail": "Totale badkamerrenovatie"
      },
      {
        "quote": "Hebben schilderwerken laten uitvoeren door dit bedrijf. Uiterst tevreden, zowel voor de afwerking als de planning. Ze bleven zelfs onder de raming — uitzonderlijk in de bouw. Een aanrader.",
        "author": "Walter Decock",
        "detail": "Schilderwerken"
      },
      {
        "quote": "Fantastisch werk en alles netjes op tijd. Nieuwe badkamer en schilderwerken slaapkamer. Aanrader!",
        "author": "Mel's Wonderland",
        "detail": "Badkamer & schilderwerken"
      }
    ]
  },
  "contact": {
    "eyebrow": "Vraag een offerte",
    "title": "Klaar om samen te bouwen?",
    "text": "Vul het formulier in en we nemen zéér snel contact met u op. Eén partner, van eerste idee tot laatste detail.",
    "fields": {
      "services": [
        "Renovatie / totaalproject",
        "Spanplafonds",
        "Gietvloeren & steentapijten",
        "Platte daken",
        "Iets anders"
      ]
    }
  }
}
$cms$::jsonb
)
ON CONFLICT (id) DO NOTHING;

COMMIT;

CREATE UNIQUE INDEX IF NOT EXISTS user_single_customer_admin_idx
ON "user" (role)
WHERE role='klantbeheerder';


CREATE UNIQUE INDEX IF NOT EXISTS user_single_pwamedia_admin_idx
ON "user" (role)
WHERE role='pwamedia_admin';
