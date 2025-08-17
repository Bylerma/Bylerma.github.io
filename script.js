// Reserve scrollbar space to prevent layout shift when scrollbars appear/disappear (where supported)
try { document.documentElement.style.setProperty('scrollbar-gutter', 'stable both-edges'); } catch {}

// Theme toggle (dark <-> light) with localStorage
(function themeInit(){
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const saved = localStorage.getItem('theme');
  if(saved === 'light' || (!saved && prefersLight)) document.body.classList.add('light');
})();
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

// Mobile nav
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', (e) => {
    // Close menu first
    navLinks.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');

    // Smooth-scroll to in-page anchors without abrupt jumps under sticky headers
    const href = a.getAttribute('href') || '';
    if(href.startsWith('#')){
      e.preventDefault();
      const target = document.getElementById(href.slice(1));
      if(target){
        const headerH = document.querySelector('header')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top, behavior: 'smooth' });
        history.pushState(null, '', href);
      }
    }
  });
});

// Smooth scroll active link highlighting
const sections = [...document.querySelectorAll('section[id]')];
const links = [...document.querySelectorAll('.nav-link')];
const byId = id => document.getElementById(id);
function onScroll(){
  const y = window.scrollY + 100;
  let current = '';
  for(const sec of sections){
    if(y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight){
      current = sec.id; break;
    }
  }
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
}
document.addEventListener('scroll', onScroll);
onScroll();

// Reveal on scroll using IntersectionObserver
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  })
}, {threshold: .12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Back to top visibility
const backToTop = document.getElementById('back-to-top');
function toggleBackToTop(){
  if(window.scrollY > 500) backToTop?.classList.add('visible');
  else backToTop?.classList.remove('visible');
}
document.addEventListener('scroll', toggleBackToTop);
toggleBackToTop();

// Typewriter rotating messages
const typeEl = document.getElementById('typewriter');
const phrases = [
  'Passionate Coder',
  'Open Source Enthusiast',
  'Problem Solver',
  'Python Developer'
];

// Prevent layout shifting by reserving width for the widest phrase
(function reserveTypewriterWidth(){
  if(!typeEl || !phrases.length) return;
  const meas = document.createElement('span');
  // Copy relevant typography from target
  const cs = getComputedStyle(typeEl);
  meas.style.position = 'absolute';
  meas.style.visibility = 'hidden';
  meas.style.whiteSpace = 'pre';
  meas.style.fontFamily = cs.fontFamily;
  meas.style.fontSize = cs.fontSize;
  meas.style.fontWeight = cs.fontWeight;
  meas.style.letterSpacing = cs.letterSpacing;
  meas.style.textTransform = cs.textTransform;
  document.body.appendChild(meas);
  let maxW = 0;
  for(const p of phrases){
    meas.textContent = p;
    maxW = Math.max(maxW, meas.getBoundingClientRect().width);
  }
  document.body.removeChild(meas);
  typeEl.style.display = 'inline-block';
  typeEl.style.minWidth = Math.ceil(maxW) + 'px';
})();

let pi = 0, ci = 0, deleting = false;
function tick(){
  if(!typeEl) return;
  const current = phrases[pi % phrases.length];
  if(!deleting){
    ci++;
    typeEl.textContent = current.slice(0, ci);
    if(ci === current.length){deleting = true; setTimeout(tick, 1200); return;}
    setTimeout(tick, 70);
  }else{
    ci--;
    typeEl.textContent = current.slice(0, ci);
    if(ci === 0){deleting = false; pi++; setTimeout(tick, 250); return;}
    setTimeout(tick, 35);
  }
}
setTimeout(tick, 600); 

// Contact form client-side validation (no backend submit)
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
function setErr(id, msg){
  const err = document.querySelector(`.error[data-for="${id}"]`);
  if(err) err.textContent = msg || '';
}
form?.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  setErr('name'); setErr('email'); setErr('message');

  if(name.length < 2){ setErr('name', 'Please enter your name.'); ok = false; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setErr('email', 'Enter a valid email.'); ok = false; }
  if(message.length < 10){ setErr('message', 'Message should be at least 10 characters.'); ok = false; }

  if(!ok) return;

  statusEl.textContent = 'Thanks! Your message has been prepared in your email client.';
  // Fallback: open mailto compose
  const subject = encodeURIComponent('Portfolio Contact');
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:contact@example.com?subject=${subject}&body=${body}`;
});

// Dynamic year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = String(new Date().getFullYear());
