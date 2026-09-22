# PWAMEDIA CMS Starter

Deze map bevat de **optionele** CMS-basis voor PWAMEDIA-klanten.

Belangrijk:
- Een klant zonder CMS krijgt deze laag niet geactiveerd.
- De website blijft altijd bruikbaar zonder CMS.
- De UX is gebaseerd op wat goed werkt in Bar Foubert: vaste navigatie, blokken per inhoudsdeel, live preview, desktop/mobiel preview, undo/redo, aparte opslaan/publiceren-flow en beeldbewerking.
- De beveiliging van Bar Foubert wordt **niet** overgenomen. Geen browser-PAT of GitHub-token in sessionStorage. Productie gebruikt de vaste PWAMEDIA-auth: Better Auth + PostgreSQL/Neon + server-side sessies + verplichte TOTP 2FA + recoverycodes.
- CMS-inhoud is klant-specifiek en configureerbaar. Designinstellingen blijven buiten bereik van de klant.

## Vaste UX-basis

1. Linkerzijbalk met inhoudsblokken/modules.
2. Editor in het midden.
3. Live preview rechts.
4. Desktop/mobiel preview.
5. Undo/redo per blok.
6. Eerst lokaal/binnen CMS opslaan, daarna expliciet publiceren.
7. Afbeeldingen kunnen vervangen, uitgesneden en geoptimaliseerd worden.
8. Duidelijke status: ongewijzigd / niet opgeslagen / klaar om te publiceren / gepubliceerd.

## Modulemodel

De CMS-modules worden per klant gekozen in `config.ts`.

Voorbeelden:
- Hero / opening
- Welkom / intro
- Verhaal / over ons
- Diensten
- Menu / producten
- Galerij
- Openingsuren
- Contactgegevens
- Meldingen / vakantie
- Reserveren / CTA
- Team
- FAQ
- Downloads

Niet iedere klant krijgt alle modules.

## Wat de klant mag aanpassen

Wel:
- teksten
- foto's
- alt-teksten
- contactgegevens
- openingsuren
- diensten/producten/menu-items
- links
- meldingen
- relevante CTA-teksten

Niet:
- fonts
- spacing
- grids
- kleuren
- componentstructuur
- responsive gedrag
- security
- technische SEO-structuur

## Publicatiemodel

De uiteindelijke productievariant schrijft **niet rechtstreeks vanuit de browser naar GitHub**.

Flow:
CMS UI → beveiligde server-route → autorisatie → validatie → opslag/publicatie → auditlog.

De concrete opslag kan per project verschillen:
- database/content API
- GitHub via server-side GitHub App
- object storage voor media

Nooit een persoonlijk GitHub-token in de browser.

## Security

Verplicht volgens PWAMEDIA:
- e-mail + wachtwoord
- TOTP 2FA
- recoverycodes
- server-side sessies
- geen publieke registratie
- rollen: PWAMEDIA beheer + klantbeheerder
- rate limiting / lockout
- auditlog voor publicaties en recovery
- secrets alleen server-side
- admin/CMS blijft noindex/nofollow

## Bar Foubert als referentie

Herbruik:
- editorervaring
- live preview
- bloknavigatie
- image cropper
- undo/redo
- save/publish onderscheid
- duidelijke statusfeedback

Niet hergebruiken:
- Bar Foubert branding
- vaste Bar Foubert-secties
- directe GitHub API vanuit de browser
- browser-token/login
- site-specifieke fonts/kleuren/layout

