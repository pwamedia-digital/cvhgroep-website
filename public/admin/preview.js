(function () {
  'use strict';

  var h = window.h;
  var createClass = window.createClass;
  var CMS = window.CMS;

  if (!CMS || !h || !createClass) return;

  CMS.registerPreviewStyle('/cvhgroep-website/admin/preview.css');

  function dataFrom(entry) {
    var data = entry && entry.get && entry.get('data');
    return data && data.toJS ? data.toJS() : (data || {});
  }

  function list(value) {
    return Array.isArray(value) ? value : [];
  }

  function assetUrl(path, getAsset) {
    if (!path || !getAsset) return '';
    var asset = getAsset(path);
    if (!asset) return '';
    return asset.url || (asset.toString ? asset.toString() : '');
  }

  function label(text) {
    return h('div', { className: 'cvh-preview-label' }, text);
  }

  function eyebrow(text) {
    return h('div', { className: 'cvh-eyebrow' }, text || '');
  }

  function media(path, getAsset, alt) {
    var url = assetUrl(path, getAsset);
    return h('div', { className: 'cvh-media' },
      url ? h('img', { src: url, alt: alt || '' }) : h('div', { className: 'cvh-media__empty' }, 'De bestaande websitefoto blijft zichtbaar zolang je geen nieuwe foto kiest')
    );
  }

  function tags(items) {
    return h('div', { className: 'cvh-tags' }, list(items).map(function (item, index) {
      return h('span', { className: 'cvh-tag', key: index }, item);
    }));
  }

  function bullets(items) {
    return h('ul', { className: 'cvh-list' }, list(items).map(function (item, index) {
      return h('li', { key: index }, item);
    }));
  }

  function section(children, modifier) {
    return h('section', { className: 'cvh-section' + (modifier ? ' ' + modifier : '') },
      h('div', { className: 'cvh-wrap' }, children)
    );
  }

  function makePreview(render, previewName) {
    return createClass({
      render: function () {
        return h('main', { className: 'cvh-preview' }, label(previewName), render(dataFrom(this.props.entry), this.props));
      }
    });
  }

  var ServicesPreview = makePreview(function (data, props) {
    var services = list(data.services);
    return h('div', {},
      section([
        eyebrow('Specialisaties — tegeloverzicht'),
        h('h2', {}, 'Van totaalproject tot gespecialiseerd vakwerk.'),
        h('div', { className: 'cvh-grid cvh-grid--four' }, services.map(function (service, index) {
          var url = assetUrl(service.image, props.getAsset);
          return h('article', {
            className: 'cvh-service-card',
            key: service.id || index,
            style: url ? { backgroundImage: 'linear-gradient(180deg, rgba(14,31,57,.08), rgba(14,31,57,.94)), url("' + url + '")', backgroundSize: 'cover', backgroundPosition: 'center' } : {}
          },
            h('span', { className: 'cvh-number' }, service.number),
            eyebrow(service.subtitle),
            h('h3', {}, service.title),
            h('p', {}, service.description),
            tags(service.tags)
          );
        }))
      ], 'cvh-section--white'),
      services.map(function (service, index) {
        return h('article', { className: 'cvh-service-detail', key: service.id || index },
          section([
            eyebrow((service.number || '') + ' — ' + (service.subtitle || '')),
            h('h1', {}, service.title),
            h('div', { className: 'cvh-rule' }),
            h('p', { className: 'cvh-lead' }, service.lead),
            tags(service.tags)
          ], 'cvh-section--navy'),
          section(h('div', { className: 'cvh-split' },
            media(service.image, props.getAsset, service.title),
            h('div', {}, list(service.intro).map(function (paragraph, pIndex) {
              return h('p', { key: pIndex }, paragraph);
            }))
          ), 'cvh-section--white'),
          section([
            eyebrow('Technieken & uitvoering'),
            h('div', { className: 'cvh-grid cvh-techniques' }, list(service.techniques).map(function (technique, tIndex) {
              return h('div', { className: 'cvh-card', key: tIndex },
                h('span', { className: 'cvh-number' }, String(tIndex + 1).padStart(2, '0')),
                h('h3', {}, technique.title),
                h('p', {}, technique.text)
              );
            })),
            h('div', { className: 'cvh-split cvh-techniques' },
              h('div', {}, eyebrow('Geschikt voor'), bullets(service.suitable)),
              h('div', { className: 'cvh-note' }, h('strong', {}, 'Goed om te weten'), h('p', {}, service.note))
            )
          ])
        );
      })
    );
  }, 'Live preview — diensten en detailpagina’s');

  var OpeningPreview = makePreview(function (data) {
    var hero = data.hero || {};
    return h('div', {},
      h('section', { className: 'cvh-section cvh-hero' }, h('div', { className: 'cvh-wrap' },
        eyebrow(hero.eyebrow),
        h('h1', {}, list(hero.titleLines).map(function (line, index) { return h('div', { key: index }, line); })),
        h('p', { className: 'cvh-lead' }, hero.intro),
        h('span', { className: 'cvh-button cvh-button--solid' }, (hero.primaryCta || {}).label),
        h('span', { className: 'cvh-button' }, (hero.secondaryCta || {}).label)
      )),
      h('div', { className: 'cvh-marquee' }, list(data.marquee).map(function (item, index) { return h('span', { key: index }, item); }))
    );
  }, 'Live preview — opening van de website');

  var IntroPreview = makePreview(function (data) {
    return section([
      eyebrow(data.eyebrow),
      h('h2', {}, data.title),
      h('div', { className: 'cvh-split' },
        h('div', {}, list(data.paragraphs).map(function (paragraph, index) { return h('p', { key: index }, paragraph); })),
        h('div', { className: 'cvh-grid' }, list(data.pillars).map(function (pillar, index) {
          return h('div', { className: 'cvh-card', key: index }, h('h3', {}, pillar.title), h('p', {}, pillar.text));
        }))
      )
    ], 'cvh-section--white');
  }, 'Live preview — wie zijn we');

  var CompanyPreview = makePreview(function (data) {
    return section([
      eyebrow(data.tagline),
      h('h1', {}, data.name),
      h('p', { className: 'cvh-lead' }, data.legalName),
      h('div', { className: 'cvh-rule' }),
      h('div', { className: 'cvh-grid' },
        h('div', { className: 'cvh-card' }, h('h3', {}, 'Contact'), h('p', {}, data.email), h('p', {}, data.street + ', ' + data.city), h('p', {}, data.region)),
        h('div', { className: 'cvh-card' }, h('h3', {}, 'Sociale media'), bullets(list(data.socials).map(function (social) { return social.label + (social.href && social.href !== '#' ? ' — ' + social.href : ''); })))
      )
    ], 'cvh-section--white');
  }, 'Live preview — bedrijfsgegevens');

  var ProjectPreview = makePreview(function (data, props) {
    return section(h('div', { className: 'cvh-split' },
      media(data.image, props.getAsset, data.title),
      h('div', {},
        eyebrow(data.eyebrow), h('h2', {}, data.title),
        h('div', { className: 'cvh-meta' },
          h('div', {}, h('small', {}, 'Klant'), data.client), h('div', {}, h('small', {}, 'Locatie'), data.location),
          h('div', {}, h('small', {}, 'Jaar'), data.year), h('div', {}, h('small', {}, 'Status'), data.status)
        ),
        h('p', {}, data.description), bullets(data.scope)
      )
    ), 'cvh-section--white');
  }, 'Live preview — project in de kijker');

  var StoryPreview = makePreview(function (data, props) {
    return section(h('div', { className: 'cvh-split' },
      h('div', {}, eyebrow(data.eyebrow), h('h2', {}, data.title), h('p', { className: 'cvh-lead' }, data.lead), list(data.paragraphs).map(function (p, i) { return h('p', { key: i }, p); }), h('div', { className: 'cvh-rule' }), h('strong', {}, data.signature), h('div', { className: 'cvh-muted' }, data.signatureRole)),
      media(data.image, props.getAsset, data.signature)
    ), 'cvh-section--white');
  }, 'Live preview — over ons');

  var GalleryPreview = makePreview(function (data, props) {
    return section([
      eyebrow('Realisaties'), h('h2', {}, 'Vakwerk in beeld.'),
      h('div', { className: 'cvh-gallery' }, list(data.items).map(function (item, index) {
        var url = assetUrl(item.image, props.getAsset);
        return h('div', { className: 'cvh-gallery__item cvh-gallery__item--' + (item.span || 'normal'), key: index },
          url ? h('img', { src: url, alt: item.caption }) : null,
          h('span', {}, item.caption)
        );
      }))
    ], 'cvh-section--white');
  }, 'Live preview — fotogalerij');

  var ProcessPreview = makePreview(function (data) {
    return section([
      eyebrow(data.eyebrow), h('h2', {}, data.title), h('p', { className: 'cvh-lead' }, data.intro),
      h('div', { className: 'cvh-grid cvh-techniques' }, list(data.steps).map(function (step, index) {
        return h('div', { className: 'cvh-card', key: index }, h('span', { className: 'cvh-number' }, step.number), h('h3', {}, step.title), h('p', {}, step.text));
      }))
    ]);
  }, 'Live preview — werkwijze');

  var ReviewsPreview = makePreview(function (data) {
    return section([
      eyebrow(data.eyebrow), h('h2', {}, data.title),
      h('div', { className: 'cvh-grid cvh-techniques' }, list(data.items).map(function (item, index) {
        return h('figure', { className: 'cvh-quote', key: index }, h('blockquote', {}, '“' + item.quote + '”'), h('figcaption', {}, h('strong', {}, item.author), h('div', { className: 'cvh-muted' }, item.detail)));
      }))
    ]);
  }, 'Live preview — klantenreviews');

  var ContactPreview = makePreview(function (data) {
    var fields = data.fields || {};
    return section(h('div', { className: 'cvh-split' },
      h('div', {}, eyebrow(data.eyebrow), h('h2', {}, data.title), h('p', { className: 'cvh-lead' }, data.text)),
      h('div', { className: 'cvh-contact-box' },
        h('div', { className: 'cvh-field' }, 'Naam'), h('div', { className: 'cvh-field' }, 'E-mailadres'), h('div', { className: 'cvh-field' }, 'Telefoonnummer'),
        h('div', { className: 'cvh-field' }, 'Type project: ' + list(fields.services).join(' · ')),
        h('span', { className: 'cvh-button cvh-button--solid' }, 'Verstuur aanvraag')
      )
    ), 'cvh-section--navy');
  }, 'Live preview — contactblok');

  CMS.registerPreviewTemplate('diensten', ServicesPreview);
  CMS.registerPreviewTemplate('bedrijfsgegevens', CompanyPreview);
  CMS.registerPreviewTemplate('opening', OpeningPreview);
  CMS.registerPreviewTemplate('wie_zijn_we', IntroPreview);
  CMS.registerPreviewTemplate('uitgelicht_project', ProjectPreview);
  CMS.registerPreviewTemplate('over_ons', StoryPreview);
  CMS.registerPreviewTemplate('galerij', GalleryPreview);
  CMS.registerPreviewTemplate('werkwijze', ProcessPreview);
  CMS.registerPreviewTemplate('reviews', ReviewsPreview);
  CMS.registerPreviewTemplate('contactblok', ContactPreview);
})();
