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

// Enhanced Contact form with real-time validation and better UX
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('contact-submit');

// Validation patterns and rules
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Please enter a valid name (letters and spaces only)'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    required: false,
    pattern: /^[\+]?[(]?[\d\s\-\(\)]{10,}$/,
    message: 'Please enter a valid phone number'
  },
  subject: {
    required: true,
    message: 'Please select a subject'
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    message: 'Message must be between 10-1000 characters'
  }
};

// Set error message for a field
function setFieldError(fieldName, message = '') {
  const errorEl = document.getElementById(`${fieldName}-error`);
  const fieldEl = document.getElementById(fieldName);
  
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.setAttribute('aria-live', message ? 'assertive' : 'polite');
  }
  
  if (fieldEl) {
    fieldEl.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) {
      fieldEl.setAttribute('aria-describedby', `${fieldName}-error`);
    }
  }
}

// Validate individual field
function validateField(fieldName, value, showError = true) {
  const rules = validationRules[fieldName];
  if (!rules) return true;

  // Check required
  if (rules.required && (!value || value.trim().length === 0)) {
    if (showError) setFieldError(fieldName, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
    return false;
  }

  // If field is optional and empty, it's valid
  if (!rules.required && (!value || value.trim().length === 0)) {
    if (showError) setFieldError(fieldName);
    return true;
  }

  // Check min length
  if (rules.minLength && value.trim().length < rules.minLength) {
    if (showError) setFieldError(fieldName, `Minimum ${rules.minLength} characters required`);
    return false;
  }

  // Check max length
  if (rules.maxLength && value.trim().length > rules.maxLength) {
    if (showError) setFieldError(fieldName, `Maximum ${rules.maxLength} characters allowed`);
    return false;
  }

  // Check pattern
  if (rules.pattern && value.trim() && !rules.pattern.test(value.trim())) {
    if (showError) setFieldError(fieldName, rules.message);
    return false;
  }

  // Clear error if validation passes
  if (showError) setFieldError(fieldName);
  return true;
}

// Real-time validation setup
function setupRealTimeValidation() {
  Object.keys(validationRules).forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (!field) return;

    // Validate on blur (when user leaves field)
    field.addEventListener('blur', () => {
      const value = field.value;
      validateField(fieldName, value, true);
    });

    // Clear errors on input for better UX
    field.addEventListener('input', () => {
      const value = field.value;
      // Only show validation if field was previously invalid
      const errorEl = document.getElementById(`${fieldName}-error`);
      if (errorEl && errorEl.textContent) {
        validateField(fieldName, value, true);
      }
    });

    // Handle phone number formatting
    if (fieldName === 'phone') {
      field.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
          if (value.length <= 3) {
            value = `(${value}`;
          } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
          } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
          }
          e.target.value = value;
        }
      });
    }
  });
}

// Set form status message
function setFormStatus(message, type = 'info') {
  if (!statusEl) return;
  
  statusEl.textContent = message;
  statusEl.className = `form-status ${type}`;
  
  // Announce to screen readers
  statusEl.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  
  // Focus management for accessibility
  if (type === 'error') {
    // Find first field with error and focus it
    const firstErrorField = form.querySelector('[aria-invalid="true"]');
    if (firstErrorField) {
      firstErrorField.focus();
    }
  }
}

// Clear form and reset states
function clearForm() {
  form.reset();
  Object.keys(validationRules).forEach(fieldName => {
    setFieldError(fieldName);
  });
  setFormStatus('');
}

// Set loading state
function setLoadingState(isLoading) {
  if (!submitBtn) return;
  
  if (isLoading) {
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
  } else {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    submitBtn.setAttribute('aria-busy', 'false');
  }
}

// Form submission handler
if (form) {
  setupRealTimeValidation();
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check (spam protection)
    const gotcha = form.querySelector('input[name="_gotcha"]');
    if (gotcha && gotcha.value.trim() !== '') {
      return; // Silent fail for bots
    }

    // Get form values
    const formData = new FormData(form);
    const values = {
      name: formData.get('name')?.trim() || '',
      email: formData.get('email')?.trim() || '',
      phone: formData.get('phone')?.trim() || '',
      subject: formData.get('subject')?.trim() || '',
      message: formData.get('message')?.trim() || ''
    };

    // Validate all fields
    let isValid = true;
    Object.keys(validationRules).forEach(fieldName => {
      if (!validateField(fieldName, values[fieldName], true)) {
        isValid = false;
      }
    });

    if (!isValid) {
      setFormStatus('Please fix the errors above and try again.', 'error');
      return;
    }

    // Check form endpoint
    const endpoint = form.getAttribute('action');
    if (!endpoint) {
      setFormStatus('Form configuration error. Please try again later.', 'error');
      return;
    }

    // Submit form
    try {
      setLoadingState(true);
      setFormStatus('Sending your message...', 'info');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (response.ok) {
        setFormStatus('Thank you! Your message has been sent successfully.', 'success');
        clearForm();
        
        // Focus management - move focus to success message for screen readers
        statusEl.focus();
      } else {
        let errorMessage = 'Something went wrong. Please try again later.';
        
        try {
          const errorData = await response.json();
          if (errorData?.errors?.length) {
            errorMessage = errorData.errors.map(e => e.message).join(', ');
          } else if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // Use default error message
        }
        
        setFormStatus(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus('Network error. Please check your connection and try again.', 'error');
    } finally {
      setLoadingState(false);
    }
  });
}

// Dynamic year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = String(new Date().getFullYear());
