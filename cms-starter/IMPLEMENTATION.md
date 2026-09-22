# Implementatie-notities

De uiteindelijke CMS-implementatie gebruikt deze map als functionele blauwdruk.

## Stap 1 — CMS nodig?
Alleen uitvoeren wanneer het project in de PWAMEDIA Hub `CMS nodig = Ja` heeft.

## Stap 2 — Modules kiezen
Pas `config.ts` aan op basis van de concrete website. De CMS-structuur volgt de echte inhoud van de klant en niet omgekeerd.

## Stap 3 — Auth aansluiten
Gebruik de vaste PWAMEDIA auth-starter:
- Better Auth
- Neon/PostgreSQL
- TOTP 2FA
- recoverycodes
- server-side sessies
- PWAMEDIA beheer/recovery
- klantbeheerder

## Stap 4 — Editor UX
Gebruik de Bar Foubert-principes:
- vaste sidebar
- editor + preview
- desktop/mobiel
- undo/redo
- save/publish
- image crop

## Stap 5 — Publicatie
Mutaties uitsluitend via beveiligde server-endpoints.
Geen PAT/token in frontend of browser storage.

## Stap 6 — Test
Voor go-live:
- correcte/foute login
- 2FA
- recoverycode
- logout/sessie
- onbevoegde admin/API
- publish-flow
- image upload
- mobiel
- noindex

