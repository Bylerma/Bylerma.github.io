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
  a.addEventListener('click', () => navLinks.classList.remove('open'));
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

// Prevent layout shift by reserving width for the widest phrase
(function initTypewriterWidthReservation(){
  if(!typeEl || !phrases.length) return;

  // Simple debounce to avoid excessive re-measures on resize
  const debounce = (fn, ms=150) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  function reserveWidth(){
    // Create a hidden measuring element with the same typography as #typewriter
    const meas = document.createElement('span');
    const cs = getComputedStyle(typeEl);
    meas.style.position = 'absolute';
    meas.style.visibility = 'hidden';
    meas.style.whiteSpace = 'pre'; // match typing behavior
    meas.style.fontFamily = cs.fontFamily;
    meas.style.fontSize = cs.fontSize;
    meas.style.fontWeight = cs.fontWeight;
    meas.style.letterSpacing = cs.letterSpacing;
    meas.style.textTransform = cs.textTransform;
    meas.style.lineHeight = cs.lineHeight;

    document.body.appendChild(meas);

    let maxW = 0;
    for(const p of phrases){
      meas.textContent = p;
      const w = meas.getBoundingClientRect().width;
      if(w > maxW) maxW = w;
    }
    meas.remove();

    // Reserve at least the max width so the container doesn't change size while typing
    typeEl.style.display = 'inline-block';
    typeEl.style.whiteSpace = 'pre';
    typeEl.style.minWidth = Math.ceil(maxW) + 'px';
  }

  reserveWidth();

  // Recalculate after web fonts load (if any), on resize, and after theme toggles (fonts/weights might differ)
  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(reserveWidth).catch(()=>{});
  }
  window.addEventListener('resize', debounce(reserveWidth, 150));
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    // Wait a tick for class changes to apply styles, then measure
    setTimeout(reserveWidth, 0);
  });
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
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Smooth scroll active link highlighting
const sections = [...document.querySelectorAll('section[id]')];
const links = [...document.querySelectorAll('.nav-link')];
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

// Contact form client-side validation + Formspree submit
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('contact-submit');

function setErr(id, msg) {
  const err = document.querySelector(`.error[data-for="${id}"]`);
  if (err) err.textContent = msg || '';
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Honeypot: if filled, silently ignore (likely a bot)
  const gotcha = form.querySelector('input[name="_gotcha"]');
  if (gotcha && gotcha.value.trim() !== '') {
    return;
  }

  // Read inputs safely by ID (avoid form.name collision with HTMLFormElement.name)
  const nameVal = document.getElementById('name')?.value?.trim() ?? '';
  const emailVal = document.getElementById('email')?.value?.trim() ?? '';
  const messageVal = document.getElementById('message')?.value?.trim() ?? '';

  // Clear previous errors
  setErr('name'); setErr('email'); setErr('message');

  // Validate
  let ok = true;
  if (nameVal.length < 2) { setErr('name', 'Please enter your name.'); ok = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { setErr('email', 'Enter a valid email.'); ok = false; }
  if (messageVal.length < 10) { setErr('message', 'Message should be at least 10 characters.'); ok = false; }
  if (!ok) return;

  // Use the current form action as endpoint each submit
  const endpoint = form.getAttribute('action');
  if (!endpoint) {
    if (statusEl) statusEl.textContent = 'Form endpoint not configured.';
    return;
  }

  try {
    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Sending...';

    const formData = new FormData(form);
    // Ensure expected field names exist in FormData
    formData.set('name', nameVal);
    formData.set('email', emailVal);
    formData.set('message', messageVal);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    if (res.ok) {
      if (statusEl) statusEl.textContent = 'Thanks! Your message has been sent.';
      form.reset();
    } else {
      let msg = 'Something went wrong. Please try again later.';
      try {
        const data = await res.json();
        if (data?.errors?.length) {
          msg = data.errors.map(e => e.message).join(', ');
        }
      } catch (_) {}
      if (statusEl) statusEl.textContent = msg;
    }
  } catch (err) {
    if (statusEl) statusEl.textContent = 'Network error. Please try again.';
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});

// Dynamic year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = String(new Date().getFullYear());
});

// Dynamic year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = String(new Date().getFullYear());
