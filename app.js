const $ = id => document.getElementById(id)
const el = (tag, text, attrs = {}) => Object.assign(document.createElement(tag), { textContent: text }, attrs)
const count = c => c.sections.reduce((n, s) => n + s.links.length, 0)
const isExternal = u => /^https?:/.test(u)
const host = u => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return '' } }

// favorites live only in this browser
const FAV_KEY = 'weblinks-favs'
let favs = []
try { favs = JSON.parse(localStorage.getItem(FAV_KEY)) || [] } catch {}
const saveFavs = () => { try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)) } catch {} }
const isFav = u => favs.some(f => f.u === u)
function toggleFav(l) {
  favs = isFav(l.u) ? favs.filter(f => f.u !== l.u) : [...favs, { t: l.t, u: l.u }]
  saveFavs()
  render()
}
const favCategory = () => ({ id: 'favs', title: '★ Αγαπημένα', sections: favs.length ? [{ title: 'Αγαπημένα', links: favs }] : [] })

// wraps the matched part of text in <mark>
function highlight(text, q) {
  const span = el('span')
  const i = q ? text.toLowerCase().indexOf(q) : -1
  if (i < 0) { span.textContent = text; return span }
  span.append(text.slice(0, i), el('mark', text.slice(i, i + q.length)), text.slice(i + q.length))
  return span
}

function linkItem(l, q) {
  const li = el('li')
  const a = el('a', '', { href: l.u, className: 'link' })
  if (isExternal(l.u)) {
    a.target = '_blank'
    a.rel = 'noopener'
    const img = el('img', '', { src: `https://icons.duckduckgo.com/ip3/${host(l.u)}.ico`, loading: 'lazy', alt: '', width: 16, height: 16 })
    img.onerror = () => img.replaceWith(el('span', '›', { className: 'fallback-icon' }))
    a.append(img)
  } else a.append(el('span', '›', { className: 'fallback-icon' }))
  const body = el('span', '', { className: 'link-body' })
  body.append(highlight(l.t, q))
  if (l.n) body.append(el('small', l.n, { className: 'note' }))
  if (isExternal(l.u)) body.append(el('small', host(l.u), { className: 'host' }))
  a.append(body)
  const star = el('button', isFav(l.u) ? '★' : '☆', { className: 'star' + (isFav(l.u) ? ' on' : ''), title: 'Αγαπημένο' })
  star.setAttribute('aria-label', 'Αγαπημένο: ' + l.t)
  star.onclick = () => toggleFav(l)
  li.append(a, star)
  return li
}

function card(title, links, q, sub) {
  const sec = el('section', '', { className: 'card' })
  const h = el('h3')
  const name = el('span', title)
  if (sub) name.prepend(el('span', sub + ' / ', { className: 'crumb' }))
  h.append(name, el('span', links.length, { className: 'badge' }))
  const ul = el('ul')
  ul.append(...links.map(l => linkItem(l, q)))
  sec.append(h, ul)
  return sec
}

function render() {
  const q = $('search').value.trim().toLowerCase()
  const id = location.hash.slice(1)
  const cats = [favCategory(), ...DATA]
  const cat = cats.find(c => c.id === id) || DATA[0]
  const content = $('content')
  content.replaceChildren()
  for (const a of $('menu').querySelectorAll('a')) a.classList.toggle('active', !q && a.hash === '#' + cat.id)
  $('menu').querySelector('a[href="#favs"] .badge').textContent = favs.length

  if (!q) {
    document.title = cat.title + ' · ted-links'
    $('page-title').textContent = cat.title
    $('page-meta').textContent = count(cat) + ' links'
    for (const s of cat.sections) content.append(card(s.title, s.links, ''))
    if (!cat.sections.length) content.append(el('p', 'Πάτα ☆ σε οποιοδήποτε link για να το προσθέσεις εδώ.', { className: 'empty' }))
    return
  }
  // search: matches from all categories
  let n = 0
  for (const c of DATA) for (const s of c.sections) {
    const links = s.links.filter(l => [l.t, l.u, l.n].join(' ').toLowerCase().includes(q))
    if (links.length) { n += links.length; content.append(card(s.title, links, q, c.title)) }
  }
  $('page-title').textContent = 'Αναζήτηση: ' + $('search').value.trim()
  $('page-meta').textContent = n + ' αποτελέσματα'
  if (!n) content.append(el('p', 'Δεν βρέθηκε τίποτα.', { className: 'empty' }))
}

function setMenu(open) {
  document.body.classList.toggle('menu-open', open)
  $('menu-toggle').setAttribute('aria-expanded', open)
}

$('menu').append(...[favCategory(), ...DATA].map(c => {
  const li = el('li')
  const a = el('a', c.title, { href: '#' + c.id })
  a.append(el('span', count(c), { className: 'badge' }))
  a.onclick = () => setMenu(false)
  li.append(a)
  return li
}))
$('menu-toggle').onclick = () => setMenu(!document.body.classList.contains('menu-open'))
$('overlay').onclick = () => setMenu(false)
$('search').oninput = render
$('search').onkeydown = e => {
  if (e.key === 'Escape') { $('search').value = ''; render(); $('search').blur() }
  if (e.key === 'Enter') $('content').querySelector('a.link')?.click()
}
document.onkeydown = e => {
  if (e.key === '/' && document.activeElement !== $('search')) { e.preventDefault(); $('search').focus() }
}
window.onhashchange = () => { $('search').value = ''; render(); window.scrollTo(0, 0) }
render()
