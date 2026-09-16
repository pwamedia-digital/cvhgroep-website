const REPO = 'pwaseys/cvhgroep-website'
const BRANCH = 'main'
const API = `https://api.github.com/repos/${REPO}/contents/`
const TOKEN_KEY = 'cvh-cms-token'
const DRAFT_KEY = 'cvh-cms-draft-v4'

const text = (label, name) => ({ type: 'text', label, name })
const area = (label, name) => ({ type: 'area', label, name })
const strings = (label, name, itemLabel = 'Item') => ({ type: 'strings', label, name, itemLabel })
const image = (label, name, aspect = 4 / 3) => ({ type: 'image', label, name, aspect })
const group = (label, name, fields) => ({ type: 'group', label, name, fields })
const objects = (label, name, fields, summary = 'title') => ({ type: 'objects', label, name, fields, summary })
const select = (label, name, options) => ({ type: 'select', label, name, options })

const blocks = [
  {
    key: 'opening', number: '01', title: 'Opening', description: 'Eerste indruk, hoofdtitel, knoppen en specialisaties.', file: 'src/content/opening.json',
    fields: [
      group('Groot openingsblok', 'hero', [text('Kleine bovenregel', 'eyebrow'), image('Achtergrondfoto', 'image', 16 / 10), strings('Grote titel', 'titleLines', 'Titelregel'), area('Introductietekst', 'intro'), group('Eerste knop', 'primaryCta', [text('Tekst op de knop', 'label')]), group('Tweede knop', 'secondaryCta', [text('Tekst op de knop', 'label')])]),
      strings('Doorlopende regel', 'marquee', 'Specialisatie'),
    ],
  },
  {
    key: 'intro', number: '02', title: 'Wie zijn we', description: 'Introductie en vier sterke punten.', file: 'src/content/intro.json',
    fields: [text('Kleine bovenregel', 'eyebrow'), text('Titel', 'title'), strings('Tekstblokken', 'paragraphs', 'Alinea'), objects('Vier sterke punten', 'pillars', [text('Titel', 'title'), area('Korte uitleg', 'text')])],
  },
  {
    key: 'services', number: '03', title: 'Specialisaties', description: 'Tegels en volledige technische detailpagina’s.', file: 'src/content/services.json',
    fields: [objects('Specialisaties', 'services', [text('Nummer', 'number'), text('Titel', 'title'), text('Kleine bovenregel', 'subtitle'), image('Hoofdfoto', 'image', 4 / 3), area('Korte tekst op de tegel', 'description'), strings('Kenmerken op de tegel', 'tags', 'Kenmerk'), area('Inleidende tekst detailpagina', 'lead'), strings('Uitleg over de werkwijze', 'intro', 'Alinea'), objects('Gebruikte technieken en uitvoering', 'techniques', [text('Techniek', 'title'), area('Uitleg', 'text')]), strings('Geschikt voor', 'suitable', 'Toepassing'), area('Goed om te weten', 'note')])],
  },
  {
    key: 'project', number: '04', title: 'Project in de kijker', description: 'Projectgegevens, foto en uitgevoerde werken.', file: 'src/content/project.json',
    fields: [text('Kleine bovenregel', 'eyebrow'), text('Projecttitel', 'title'), image('Projectfoto', 'image', 16 / 10), group('Projectgegevens', '_meta', [text('Klant', 'client'), text('Jaar', 'year'), text('Status', 'status'), text('Locatie', 'location')]), area('Beschrijving', 'description'), strings('Uitgevoerde werken', 'scope', 'Onderdeel')],
    virtualGroup: true,
  },
  {
    key: 'story', number: '05', title: 'Over ons', description: 'Het verhaal en de voorstelling van Chris.', file: 'src/content/story.json',
    fields: [text('Kleine bovenregel', 'eyebrow'), text('Titel', 'title'), area('Inleidende tekst', 'lead'), strings('Tekstblokken', 'paragraphs', 'Alinea'), image('Portretfoto', 'image', 4 / 5), group('Onderschrift', '_signature', [text('Naam zaakvoerder', 'signature'), text('Functie', 'signatureRole')])],
    virtualGroup: true,
  },
  {
    key: 'gallery', number: '06', title: 'Fotogalerij', description: 'Foto’s, bijschriften en formaat.', file: 'src/content/gallery.json',
    fields: [objects('Foto’s', 'items', [image('Foto', 'image', 4 / 3), text('Bijschrift', 'caption'), select('Formaat op de website', 'span', [{ label: 'Normaal', value: 'normal' }, { label: 'Breed', value: 'wide' }, { label: 'Hoog', value: 'tall' }])], 'caption')],
  },
  {
    key: 'process', number: '07', title: 'Werkwijze', description: 'Van kennismaking tot oplevering.', file: 'src/content/process.json',
    fields: [text('Kleine bovenregel', 'eyebrow'), text('Titel', 'title'), area('Inleidende tekst', 'intro'), objects('Vier stappen', 'steps', [text('Nummer', 'number'), text('Titel', 'title'), area('Uitleg', 'text')])],
  },
  {
    key: 'testimonials', number: '08', title: 'Klantenreviews', description: 'Ervaringen van klanten.', file: 'src/content/testimonials.json',
    fields: [text('Kleine bovenregel', 'eyebrow'), text('Titel', 'title'), objects('Reviews', 'items', [area('Review', 'quote'), text('Naam van de klant', 'author'), text('Type project', 'detail')], 'author')],
  },
  {
    key: 'contact', number: '09', title: 'Contactblok', description: 'Afsluitende oproep en formulierkeuzes.', file: 'src/content/contact.json',
    fields: [text('Kleine bovenregel', 'eyebrow'), text('Titel', 'title'), area('Tekst', 'text'), group('Keuzes in het formulier', 'fields', [strings('Types projecten', 'services', 'Keuze')])],
  },
  {
    key: 'company', number: '10', title: 'Bedrijfsgegevens', description: 'Vaste gegevens en sociale media.', file: 'src/content/company.json',
    fields: [text('Bedrijfsnaam', 'name'), text('Officiële naam', 'legalName'), text('Korte omschrijving', 'tagline'), text('E-mailadres', 'email'), text('Straat en nummer', 'street'), text('Postcode en gemeente', 'city'), text('Werkregio', 'region'), objects('Sociale media', 'socials', [text('Platform', 'label'), text('Link', 'href')], 'label')],
  },
]

const state = {
  token: sessionStorage.getItem(TOKEN_KEY) || '',
  live: {}, staged: {}, draft: {}, shas: {}, assets: {}, active: 'opening',
  past: [], future: [], viewport: 'desktop', servicesPreview: 'detail', serviceIndex: 0,
  publishing: false, notice: '', error: '',
}

const app = document.querySelector('#app')
const clone = (value) => JSON.parse(JSON.stringify(value))
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const esc = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character])
const pathKey = (path) => path.join('.')
const getAt = (root, path) => path.reduce((value, key) => value?.[key], root)
const setAt = (root, path, value) => {
  const parent = path.slice(0, -1).reduce((current, key) => current[key], root)
  parent[path[path.length - 1]] = value
}

function icon(name) {
  const icons = { undo: '↶', redo: '↷', monitor: '▣', phone: '▯', logout: '↪', close: '×', add: '+', remove: '×', grip: '⋮⋮' }
  return `<span aria-hidden="true">${icons[name] || ''}</span>`
}

function apiHeaders() {
  return { Accept: 'application/vnd.github+json', Authorization: `Bearer ${state.token}`, 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' }
}

function decode(value) {
  const binary = atob(value.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function encode(value) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary)
}

function imageSource(value) {
  if (!value) return ''
  return state.assets[value]?.preview || value
}

function showLogin(message = '') {
  app.innerHTML = `<main class="login"><section class="login-card"><div class="brand-mark">CVH</div><p class="eyebrow">WEBSITEBEHEER</p><h1>Welkom terug.</h1><p>Beheer hier de inhoud en foto’s van de CVH-website.</p><form id="login-form"><label>Toegangstoken<input id="token" type="password" autocomplete="current-password" required /></label><button type="submit">Aanmelden</button></form><small>Het token blijft uitsluitend in dit browsertabblad bewaard.</small>${message ? `<p class="toast error">${esc(message)}</p>` : ''}</section></main>`
  document.querySelector('#login-form').addEventListener('submit', (event) => {
    event.preventDefault()
    state.token = document.querySelector('#token').value.trim()
    sessionStorage.setItem(TOKEN_KEY, state.token)
    loadContent()
  })
}

async function loadContent() {
  app.innerHTML = '<div class="boot"><span class="spinner"></span><p>Website-inhoud laden…</p></div>'
  try {
    const results = await Promise.all(blocks.map(async (block) => {
      const response = await fetch(`${API}${block.file}?ref=${BRANCH}`, { headers: apiHeaders() })
      if (!response.ok) throw new Error(response.status === 401 ? 'Dit toegangstoken wordt niet aanvaard.' : 'De website-inhoud kon niet worden geladen.')
      const file = await response.json()
      return { key: block.key, data: JSON.parse(decode(file.content)), sha: file.sha }
    }))
    results.forEach(({ key, data, sha }) => { state.live[key] = data; state.shas[key] = sha })
    const stored = localStorage.getItem(DRAFT_KEY)
    if (stored) {
      const saved = JSON.parse(stored)
      state.staged = saved.content || clone(state.live)
      state.assets = saved.assets || {}
    } else state.staged = clone(state.live)
    state.draft = clone(state.staged)
    state.past = []; state.future = []; state.error = ''
    render()
  } catch (error) {
    sessionStorage.removeItem(TOKEN_KEY); state.token = ''
    showLogin(error.message || 'Aanmelden is niet gelukt.')
  }
}

function currentBlock() { return blocks.find((block) => block.key === state.active) }
function blockDirty(key) { return !equal(state.draft[key], state.staged[key]) }
function allSaved() { return blocks.every((block) => !blockDirty(block.key)) }
function hasChanges() { return !equal(state.staged, state.live) }

function render() {
  const block = currentBlock()
  app.innerHTML = `<main class="shell">
    <header class="topbar"><div class="identity"><div class="brand-mark">CVH</div><div><strong>CVH Groep</strong><span>Websitebeheer door PWAMEDIA</span></div></div><div class="top-actions"><button class="icon-btn" data-action="undo" aria-label="Ongedaan maken" ${state.past.length ? '' : 'disabled'}>${icon('undo')}</button><button class="icon-btn" data-action="redo" aria-label="Opnieuw uitvoeren" ${state.future.length ? '' : 'disabled'}>${icon('redo')}</button><button class="publish" data-action="publish" ${allSaved() && hasChanges() && !state.publishing ? '' : 'disabled'}>${state.publishing ? 'PUBLICEREN…' : 'PUBLICEREN'}</button><button class="icon-btn" data-action="logout" aria-label="Afmelden">${icon('logout')}</button></div></header>
    <aside class="sidebar"><p class="sidebar-label">WEBSITEBLOKKEN</p><nav class="nav-list">${blocks.map((item) => `<button class="nav-item ${item.key === state.active ? 'active' : ''}" data-block="${item.key}"><span class="nav-number">${item.number}</span><span><strong>${esc(item.title)}</strong><small>${blockDirty(item.key) ? 'Niet opgeslagen' : 'Opgeslagen'}</small></span><i class="status-dot ${blockDirty(item.key) ? 'dirty' : 'saved'}"></i></button>`).join('')}</nav><div class="sidebar-footer"><a href="../" target="_blank" rel="noreferrer">Website openen ↗</a></div></aside>
    <section class="editor"><div class="editor-head"><p>BLOK ${block.number}</p><h1>${esc(block.title)}</h1><span>${esc(block.description)}</span></div><article class="form-card"><div class="form-body">${renderFields(block.fields, state.draft[block.key], [], block)}</div><div class="save-row"><span>${blockDirty(block.key) ? 'Bewaar dit blok om het klaar te zetten voor publicatie.' : 'Dit blok is opgeslagen.'}</span><button class="save-btn" data-action="save" ${blockDirty(block.key) ? '' : 'disabled'}>BLOK OPSLAAN</button></div></article></section>
    <aside class="preview"><div class="preview-bar"><strong>Live voorbeeld · ${esc(block.title)}</strong><div class="preview-tools">${block.key === 'services' ? `<div class="view-switch"><button data-service-view="overview" class="${state.servicesPreview === 'overview' ? 'active' : ''}">Overzicht</button><button data-service-view="detail" class="${state.servicesPreview === 'detail' ? 'active' : ''}">Detailpagina</button></div>` : ''}<div class="device-switch"><button data-device="desktop" class="${state.viewport === 'desktop' ? 'active' : ''}" aria-label="Desktop">${icon('monitor')}</button><button data-device="mobile" class="${state.viewport === 'mobile' ? 'active' : ''}" aria-label="Mobiel">${icon('phone')}</button></div></div></div><div class="preview-stage"><div class="site-preview ${state.viewport}" id="site-preview">${renderPreview(block.key, state.draft[block.key])}</div></div></aside>
  </main>${state.notice ? `<div class="toast">${esc(state.notice)}</div>` : ''}${state.error ? `<div class="toast error">${esc(state.error)}</div>` : ''}`
  bindEvents()
}

function renderFields(fields, data, basePath, block) {
  return fields.map((field) => {
    if (field.name.startsWith('_') && block.virtualGroup) {
      return `<section class="group"><h3 class="group-title">${esc(field.label)}</h3>${renderFields(field.fields, data, basePath, block)}</section>`
    }
    const path = [...basePath, field.name]
    const value = getAt(data, path) ?? (field.type === 'strings' || field.type === 'objects' ? [] : '')
    if (field.type === 'group') return `<section class="group"><h3 class="group-title">${esc(field.label)}</h3>${renderFields(field.fields, data, path, block)}</section>`
    if (field.type === 'strings') return renderStringList(field, value, path)
    if (field.type === 'objects') return renderObjectList(field, value, path, block)
    if (field.type === 'image') return renderImage(field, value, path)
    if (field.type === 'select') return `<label class="field"><span class="field-label">${esc(field.label)}</span><select data-path="${pathKey(path)}">${field.options.map((option) => `<option value="${esc(option.value)}" ${value === option.value ? 'selected' : ''}>${esc(option.label)}</option>`).join('')}</select></label>`
    if (field.type === 'area') return `<label class="field"><span class="field-label">${esc(field.label)}</span><textarea data-path="${pathKey(path)}">${esc(value)}</textarea></label>`
    return `<label class="field"><span class="field-label">${esc(field.label)}</span><input data-path="${pathKey(path)}" value="${esc(value)}" /></label>`
  }).join('')
}

function renderStringList(field, values, path) {
  return `<section class="list"><div class="list-head"><strong>${esc(field.label)}</strong><button class="add-btn" data-list-add="${pathKey(path)}" data-list-type="string">${icon('add')} ${esc(field.itemLabel)}</button></div>${values.map((value, index) => `<div class="list-row"><span class="drag">${icon('grip')}</span><textarea data-path="${pathKey([...path, index])}">${esc(value)}</textarea><button class="remove-btn" data-list-remove="${pathKey(path)}" data-index="${index}" aria-label="Verwijderen">${icon('remove')}</button></div>`).join('')}</section>`
}

function renderObjectList(field, values, path, block) {
  const serviceList = block.key === 'services' && pathKey(path) === 'services'
  const selectedIndex = Math.min(state.serviceIndex, Math.max(values.length - 1, 0))
  return `<section class="list"><div class="list-head"><strong>${esc(field.label)}</strong><button class="add-btn" data-list-add="${pathKey(path)}" data-list-type="object">${icon('add')} Toevoegen</button></div>${values.map((value, index) => `<article class="object-item ${serviceList ? (index === selectedIndex ? 'previewing' : 'collapsed') : (index ? 'collapsed' : '')}"><button class="object-summary" data-collapse ${serviceList ? `data-service-index="${index}"` : ''}><span><b>${String(index + 1).padStart(2, '0')}</b>${esc(value[field.summary] || `${field.label} ${index + 1}`)}</span><span>⌄</span></button><div class="object-fields">${renderFields(field.fields, state.draft[block.key], [...path, index], block)}<button class="remove-btn" data-list-remove="${pathKey(path)}" data-index="${index}" aria-label="Verwijderen">${icon('remove')}</button></div></article>`).join('')}</section>`
}

function renderImage(field, value, path) {
  const source = imageSource(value)
  return `<section class="image-field"><div class="field-label"><span>${esc(field.label)}</span><small>Aanbevolen verhouding ${aspectLabel(field.aspect)}</small></div><div class="image-preview">${source ? `<img src="${esc(source)}" alt="" /><div class="image-actions"><button data-image="${pathKey(path)}" data-aspect="${field.aspect}">Vervangen / uitsnijden</button><button data-image-remove="${pathKey(path)}">Verwijderen</button></div>` : `<button class="empty-image" data-image="${pathKey(path)}" data-aspect="${field.aspect}">+ Foto toevoegen en uitsnijden</button>`}</div></section>`
}

function aspectLabel(aspect) {
  if (Math.abs(aspect - .8) < .01) return '4:5'
  if (Math.abs(aspect - 1.6) < .01) return '16:10'
  return '4:3'
}

function bindEvents() {
  document.querySelectorAll('[data-block]').forEach((button) => button.addEventListener('click', () => { state.active = button.dataset.block; state.notice = ''; render() }))
  document.querySelectorAll('[data-path]').forEach((control) => {
    control.addEventListener('focus', () => { control._before = clone(state.draft) })
    control.addEventListener('input', () => { setAt(state.draft[state.active], control.dataset.path.split('.'), control.value); refreshStatusAndPreview() })
    control.addEventListener('change', () => {
      if (control._before && !equal(control._before, state.draft)) pushPast(control._before)
      control._before = null
    })
  })
  document.querySelectorAll('[data-collapse]').forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.serviceIndex !== undefined) {
      state.serviceIndex = Number(button.dataset.serviceIndex)
      state.servicesPreview = 'detail'
      render()
      return
    }
    button.closest('.object-item').classList.toggle('collapsed')
  }))
  document.querySelectorAll('[data-list-add]').forEach((button) => button.addEventListener('click', () => mutate(() => {
    const path = button.dataset.listAdd.split('.')
    let list = getAt(state.draft[state.active], path)
    if (!Array.isArray(list)) {
      setAt(state.draft[state.active], path, [])
      list = getAt(state.draft[state.active], path)
    }
    list.push(button.dataset.listType === 'string' ? '' : {})
    if (state.active === 'services' && pathKey(path) === 'services') {
      state.serviceIndex = list.length - 1
      state.servicesPreview = 'detail'
    }
  })))
  document.querySelectorAll('[data-list-remove]').forEach((button) => button.addEventListener('click', () => mutate(() => getAt(state.draft[state.active], button.dataset.listRemove.split('.')).splice(Number(button.dataset.index), 1))))
  document.querySelectorAll('[data-image]').forEach((button) => button.addEventListener('click', () => chooseImage(button.dataset.image.split('.'), Number(button.dataset.aspect))))
  document.querySelectorAll('[data-image-remove]').forEach((button) => button.addEventListener('click', () => mutate(() => setAt(state.draft[state.active], button.dataset.imageRemove.split('.'), ''))))
  document.querySelector('[data-action="save"]')?.addEventListener('click', saveBlock)
  document.querySelector('[data-action="publish"]')?.addEventListener('click', publish)
  document.querySelector('[data-action="undo"]')?.addEventListener('click', undo)
  document.querySelector('[data-action="redo"]')?.addEventListener('click', redo)
  document.querySelector('[data-action="logout"]')?.addEventListener('click', () => { sessionStorage.removeItem(TOKEN_KEY); state.token = ''; showLogin() })
  document.querySelectorAll('[data-device]').forEach((button) => button.addEventListener('click', () => { state.viewport = button.dataset.device; render() }))
  document.querySelectorAll('[data-service-view]').forEach((button) => button.addEventListener('click', () => { state.servicesPreview = button.dataset.serviceView; render() }))
}

function pushPast(snapshot) { state.past.push(snapshot); state.past = state.past.slice(-50); state.future = [] }
function mutate(callback) { const before = clone(state.draft); callback(); pushPast(before); state.notice = ''; render() }
function undo() { if (!state.past.length) return; state.future.unshift(clone(state.draft)); state.draft = state.past.pop(); render() }
function redo() { if (!state.future.length) return; state.past.push(clone(state.draft)); state.draft = state.future.shift(); render() }

function refreshStatusAndPreview() {
  state.notice = ''
  const block = currentBlock()
  const preview = document.querySelector('#site-preview')
  if (preview) preview.innerHTML = renderPreview(block.key, state.draft[block.key])
  const save = document.querySelector('[data-action="save"]')
  if (save) save.disabled = !blockDirty(block.key)
  const status = document.querySelector(`[data-block="${block.key}"]`)
  if (status) {
    status.querySelector('small').textContent = blockDirty(block.key) ? 'Niet opgeslagen' : 'Opgeslagen'
    status.querySelector('.status-dot').className = `status-dot ${blockDirty(block.key) ? 'dirty' : 'saved'}`
  }
  const publishButton = document.querySelector('[data-action="publish"]')
  if (publishButton) publishButton.disabled = !(allSaved() && hasChanges())
}

function saveBlock() {
  state.staged[state.active] = clone(state.draft[state.active])
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ content: state.staged, assets: state.assets }))
  } catch {
    state.error = 'De browser heeft onvoldoende lokale ruimte voor deze foto’s. Publiceer eerst de reeds opgeslagen blokken.'
    render()
    return
  }
  state.notice = `${currentBlock().title} is opgeslagen en klaar voor publicatie.`
  render()
}

async function publish() {
  if (!allSaved() || !hasChanges() || state.publishing) return
  state.publishing = true; state.error = ''; state.notice = ''; render()
  try {
    for (const [url, asset] of Object.entries(state.assets)) {
      if (!asset.base64) continue
      const response = await fetch(`${API}public/uploads/${url.split('/').pop()}`, { method: 'PUT', headers: apiHeaders(), body: JSON.stringify({ message: 'Voeg websitefoto toe via CVH CMS', content: asset.base64, branch: BRANCH }) })
      if (!response.ok) throw new Error('Een foto kon niet worden gepubliceerd.')
    }
    for (const block of blocks) {
      if (equal(state.staged[block.key], state.live[block.key])) continue
      const response = await fetch(`${API}${block.file}`, { method: 'PUT', headers: apiHeaders(), body: JSON.stringify({ message: `Publiceer ${block.title} via CVH CMS`, content: encode(`${JSON.stringify(state.staged[block.key], null, 2)}\n`), sha: state.shas[block.key], branch: BRANCH }) })
      if (!response.ok) throw new Error(`${block.title} kon niet worden gepubliceerd.`)
      const result = await response.json(); state.shas[block.key] = result.content.sha
    }
    state.live = clone(state.staged); state.draft = clone(state.staged); state.past = []; state.future = []
    localStorage.removeItem(DRAFT_KEY); state.notice = 'Alles is gepubliceerd. De website wordt nu automatisch bijgewerkt.'
  } catch (error) { state.error = error.message || 'Publiceren is niet gelukt.' }
  finally { state.publishing = false; render() }
}

function chooseImage(path, aspect) {
  const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/jpeg,image/png,image/webp'
  input.addEventListener('change', () => { const file = input.files?.[0]; if (file) openCropper(file, path, aspect) })
  input.click()
}

function openCropper(file, path, aspect) {
  if (file.size > 25 * 1024 * 1024) { state.error = 'Deze foto is groter dan 25 MB.'; render(); return }
  const before = clone(state.draft)
  const objectUrl = URL.createObjectURL(file)
  const modal = document.createElement('div'); modal.className = 'crop-modal'
  modal.innerHTML = `<div class="crop-dialog" role="dialog" aria-modal="true"><header class="crop-head"><h2>Foto uitsnijden</h2><button data-crop-close aria-label="Sluiten">${icon('close')}</button></header><div class="crop-main"><div class="crop-area"><div class="crop-host"><img id="crop-image" src="${objectUrl}" alt="Te bewerken foto" /></div></div><aside class="crop-controls"><div class="crop-note">Versleep de foto of het kader. Neem een hoek of zijde vast om de uitsnede te vergroten of verkleinen.</div><label>Zoom<input id="crop-zoom" type="range" min="0.1" max="3" step="0.01" value="1" /></label><div><button class="add-btn" id="rotate-left">↶ 90°</button> <button class="add-btn" id="rotate-right">↷ 90°</button></div><small>Vaste verhouding: ${aspectLabel(aspect)}</small></aside></div><footer class="crop-foot"><span>De foto wordt geoptimaliseerd voor de website.</span><button class="crop-apply">Uitsnede gebruiken</button></footer></div>`
  document.body.appendChild(modal)
  const imageElement = modal.querySelector('#crop-image')
  const cropper = new Cropper(imageElement, { aspectRatio: aspect, viewMode: 1, dragMode: 'move', autoCropArea: .82, responsive: true, background: false, guides: true, center: true, highlight: false, movable: true, rotatable: true, scalable: true, zoomable: true, zoomOnTouch: true, zoomOnWheel: true, cropBoxMovable: true, cropBoxResizable: true, toggleDragModeOnDblclick: false, ready() { const data = cropper.getImageData(); const ratio = data.width / data.naturalWidth; const slider = modal.querySelector('#crop-zoom'); slider.min = ratio; slider.max = ratio * 3; slider.step = Math.max(ratio / 100, .001); slider.value = ratio } })
  const close = () => { cropper.destroy(); URL.revokeObjectURL(objectUrl); modal.remove() }
  modal.querySelector('[data-crop-close]').addEventListener('click', close)
  modal.querySelector('#crop-zoom').addEventListener('input', (event) => cropper.zoomTo(Number(event.target.value)))
  modal.querySelector('#rotate-left').addEventListener('click', () => cropper.rotate(-90))
  modal.querySelector('#rotate-right').addEventListener('click', () => cropper.rotate(90))
  modal.querySelector('.crop-apply').addEventListener('click', () => {
    const canvas = cropper.getCroppedCanvas({ width: 1600, height: Math.round(1600 / aspect), fillColor: '#fff', imageSmoothingEnabled: true, imageSmoothingQuality: 'high' })
    canvas.toBlob((blob) => {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = String(reader.result); const base64 = dataUrl.split(',')[1]; const filename = `cvh-${Date.now()}.webp`; const url = `/cvhgroep-website/uploads/${filename}`
        state.assets[url] = { base64, preview: dataUrl }
        setAt(state.draft[state.active], path, url); pushPast(before); close(); render()
      }
      reader.readAsDataURL(blob)
    }, 'image/webp', .88)
  })
}

function renderPreview(key, data) {
  const paragraphs = (items = []) => items.map((item) => `<p class="pv-text">${esc(item)}</p>`).join('')
  const cards = (items = [], title = 'title', body = 'text') => `<div class="pv-grid">${items.map((item) => `<div class="pv-card"><b>${esc(item[title] || '')}</b><span class="pv-text">${esc(item[body] || '')}</span></div>`).join('')}</div>`
  const photo = (value) => value ? `<img class="pv-photo" src="${esc(imageSource(value))}" alt="" />` : ''
  if (key === 'opening') return `<section class="pv-section pv-hero"><span class="pv-kicker">${esc(data.hero.eyebrow)}</span><h1 class="pv-title">${(data.hero.titleLines || []).map(esc).join('<br>')}</h1>${photo(data.hero.image)}<p class="pv-text">${esc(data.hero.intro)}</p><div class="pv-buttons"><span>${esc(data.hero.primaryCta?.label)}</span><span>${esc(data.hero.secondaryCta?.label)}</span></div></section>`
  if (key === 'intro') return `<section class="pv-section"><span class="pv-kicker">${esc(data.eyebrow)}</span><h2 class="pv-title">${esc(data.title)}</h2>${paragraphs(data.paragraphs)}${cards(data.pillars)}</section>`
  if (key === 'services') {
    if (state.servicesPreview === 'overview') return `<section class="pv-section pv-dark"><span class="pv-kicker">Specialisaties</span><h2 class="pv-title">Vakwerk voor elke ruimte.</h2><div class="pv-grid">${(data.services || []).map((item) => `<div class="pv-card">${photo(item.image)}<span class="pv-kicker">${esc(item.subtitle)}</span><b>${esc(item.title)}</b><p class="pv-text">${esc(item.description)}</p></div>`).join('')}</div></section>`
    const services = data.services || []
    const service = services[Math.min(state.serviceIndex, Math.max(services.length - 1, 0))] || {}
    return `<section class="pv-detail-hero">${photo(service.image)}<div class="pv-detail-intro"><span class="pv-kicker">${esc(service.number)} · ${esc(service.subtitle)}</span><h2 class="pv-title">${esc(service.title)}</h2><p class="pv-lead">${esc(service.lead || service.description)}</p><div class="pv-tags">${(service.tags || []).map((tag) => `<span>${esc(tag)}</span>`).join('')}</div></div></section><section class="pv-section"><span class="pv-kicker">Aanpak & uitvoering</span>${paragraphs(service.intro)}<div class="pv-techniques">${(service.techniques || []).map((item, index) => `<article><b>${String(index + 1).padStart(2, '0')}</b><div><h3>${esc(item.title)}</h3><p class="pv-text">${esc(item.text)}</p></div></article>`).join('')}</div>${(service.suitable || []).length ? `<h3 class="pv-subtitle">Geschikt voor</h3><div class="pv-tags pv-tags-light">${service.suitable.map((item) => `<span>${esc(item)}</span>`).join('')}</div>` : ''}${service.note ? `<aside class="pv-note"><span class="pv-kicker">Goed om te weten</span><p>${esc(service.note)}</p></aside>` : ''}</section>`
  }
  if (key === 'project') return `<section class="pv-section"><span class="pv-kicker">${esc(data.eyebrow)}</span><h2 class="pv-title">${esc(data.title)}</h2>${photo(data.image)}<p class="pv-text">${esc(data.client)} · ${esc(data.location)} · ${esc(data.year)}</p><p class="pv-text">${esc(data.description)}</p></section>`
  if (key === 'story') return `<section class="pv-section pv-dark"><span class="pv-kicker">${esc(data.eyebrow)}</span><h2 class="pv-title">${esc(data.title)}</h2>${photo(data.image)}<p class="pv-text">${esc(data.lead)}</p>${paragraphs(data.paragraphs)}<p><b>${esc(data.signature)}</b><br><span class="pv-text">${esc(data.signatureRole)}</span></p></section>`
  if (key === 'gallery') return `<section class="pv-section"><span class="pv-kicker">Realisaties</span><h2 class="pv-title">Werk dat voor zichzelf spreekt.</h2><div class="pv-grid">${(data.items || []).map((item) => `<div class="pv-card">${photo(item.image)}<b>${esc(item.caption)}</b></div>`).join('')}</div></section>`
  if (key === 'process') return `<section class="pv-section"><span class="pv-kicker">${esc(data.eyebrow)}</span><h2 class="pv-title">${esc(data.title)}</h2><p class="pv-text">${esc(data.intro)}</p>${cards(data.steps)}</section>`
  if (key === 'testimonials') return `<section class="pv-section pv-dark"><span class="pv-kicker">${esc(data.eyebrow)}</span><h2 class="pv-title">${esc(data.title)}</h2><div class="pv-grid">${(data.items || []).map((item) => `<div class="pv-card"><p class="pv-text">“${esc(item.quote)}”</p><b>${esc(item.author)}</b><span class="pv-text">${esc(item.detail)}</span></div>`).join('')}</div></section>`
  if (key === 'contact') return `<section class="pv-section pv-hero"><span class="pv-kicker">${esc(data.eyebrow)}</span><h2 class="pv-title">${esc(data.title)}</h2><p class="pv-text">${esc(data.text)}</p><div class="pv-buttons"><span>Neem contact op</span></div></section>`
  return `<section class="pv-section"><span class="pv-kicker">Bedrijfsgegevens</span><h2 class="pv-title">${esc(data.name)}</h2><p class="pv-text">${esc(data.tagline)}</p><div class="pv-card"><b>${esc(data.email)}</b><span class="pv-text">${esc(data.street)} · ${esc(data.city)}<br>${esc(data.region)}</span></div></section>`
}

if (state.token) loadContent()
else showLogin()
