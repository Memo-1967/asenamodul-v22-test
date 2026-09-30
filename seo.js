/* Métadonnées V22 communes. Chaque page conserve son titre et sa description propres. */
(() => {
  const page = location.pathname.split('/').pop() || 'index.html';
  const url = `https://asenamodul.com/${page === 'index.html' ? '' : page}`;
  const description = document.querySelector('meta[name="description"]')?.content || '';
  const images = {
    'index.html': 'maison-asena-habitat.webp',
    'maisons.html': 'asena-signature-165.webp',
    'azur-240.html': 'asena-azur-240-technique.webp',
    'collection-m130.html': 'm130-concrete-system.webp',
    'systeme-metallique.html': 'asena-neo-96-metal-technique.webp'
  };
  const addMeta = (property, content) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag); }
    tag.content = content;
  };
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
  canonical.href = url;
  addMeta('og:type', 'website');
  addMeta('og:locale', 'fr_FR');
  addMeta('og:title', document.title);
  addMeta('og:description', description);
  addMeta('og:url', url);
  if (images[page]) addMeta('og:image', `https://asenamodul.com/${images[page]}`);
})();
