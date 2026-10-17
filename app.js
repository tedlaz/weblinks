const $ = id => document.getElementById(id)
const el = (tag, text, attrs = {}) => Object.assign(document.createElement(tag), { textContent: text }, attrs)

function linkItem(l) {
  const li = el('li')
  const external = !l.u.startsWith('#') && !l.u.endsWith('.html')
  li.append(el('a', l.t, { href: l.u, target: external ? '_blank' : '' }))
  if (l.n) li.append(el('span', ' ' + l.n, { className: 'note' }))
  return li
}

function renderSections(heading, sections) {
  const frag = document.createDocumentFragment()
  if (heading) frag.append(el('h2', heading))
  for (const s of sections) {
    const ul = el('ul')
    ul.append(...s.links.map(linkItem))
    frag.append(el('h3', s.title), ul)
  }
  return frag
}

function render() {
  const q = $('search').value.trim().toLowerCase()
  const id = location.hash.slice(1)
  const cat = DATA.find(c => c.id === id) || DATA[0]
  for (const a of $('menu').querySelectorAll('a')) a.classList.toggle('active', !q && a.hash === '#' + cat.id)
  $('content').replaceChildren()
  if (!q) {
    document.title = cat.title + ' - ted-links'
    $('content').append(renderSections('', cat.sections))
    return
  }
  // search: matches from all categories, grouped by category
  for (const c of DATA) {
    const sections = c.sections
      .map(s => ({ title: s.title, links: s.links.filter(l => [l.t, l.u, l.n].join(' ').toLowerCase().includes(q)) }))
      .filter(s => s.links.length)
    if (sections.length) $('content').append(renderSections(c.title, sections))
  }
  if (!$('content').hasChildNodes()) $('content').append(el('p', 'Δεν βρέθηκε τίποτα.'))
}

$('menu').append(...DATA.map(c => { const li = el('li'); li.append(el('a', c.title, { href: '#' + c.id })); return li }))
$('menu-toggle').onclick = () => $('wrapper').classList.toggle('toggled')
$('search').oninput = render
window.onhashchange = () => { $('search').value = ''; render() }
render()
