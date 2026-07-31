/* ==========================================================================
   M/S Alok S Kumar And Company — site scripts
   Vanilla JS, no dependencies, deferred. Handles:
     1. Mobile navigation toggle
     2. Services dropdown (mouse, keyboard, touch)
     3. Current-year stamp in the footer
     4. Contact form validation + submission hand-off
   ========================================================================== */
(function () {
  'use strict';

  var MOBILE_QUERY = window.matchMedia('(max-width: 899px)');

  /* ------------------------------------------------------------------
     1. Mobile navigation
     ------------------------------------------------------------------ */
  var navToggle = document.querySelector('.nav-toggle');
  var primaryNav = document.getElementById('primary-nav');

  function setNavOpen(open) {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    primaryNav.classList.toggle('is-open', open);
    var label = navToggle.querySelector('.nav-toggle-label');
    if (label) label.textContent = open ? 'Close' : 'Menu';
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      setNavOpen(!open);
    });
  }

  /* ------------------------------------------------------------------
     2. Services dropdown
     ------------------------------------------------------------------ */
  var dropdownToggles = Array.prototype.slice.call(document.querySelectorAll('.dd-toggle'));

  function closeAllDropdowns(except) {
    dropdownToggles.forEach(function (btn) {
      if (btn === except) return;
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', 'false');
      if (panel) panel.classList.remove('is-open');
    });
  }

  dropdownToggles.forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      closeAllDropdowns(btn);
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.classList.toggle('is-open', !open);
    });

    // Desktop: close the panel when focus leaves the whole nav item.
    var parent = btn.closest('.has-dropdown');
    if (parent) {
      parent.addEventListener('focusout', function (event) {
        if (MOBILE_QUERY.matches) return;
        if (parent.contains(event.relatedTarget)) return;
        btn.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
      });
    }
  });

  // Escape closes the menu / dropdowns and returns focus to the toggle.
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var openDd = dropdownToggles.filter(function (b) {
      return b.getAttribute('aria-expanded') === 'true';
    });
    if (openDd.length) {
      closeAllDropdowns();
      openDd[0].focus();
      return;
    }
    if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
      setNavOpen(false);
      navToggle.focus();
    }
  });

  // Click outside closes everything (desktop and mobile).
  document.addEventListener('click', function (event) {
    var header = document.querySelector('.site-header');
    if (!header || header.contains(event.target)) return;
    closeAllDropdowns();
    if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') setNavOpen(false);
  });

  // Reset state when crossing the desktop breakpoint.
  function handleBreakpoint() {
    if (!MOBILE_QUERY.matches) {
      setNavOpen(false);
      closeAllDropdowns();
    }
  }
  if (typeof MOBILE_QUERY.addEventListener === 'function') {
    MOBILE_QUERY.addEventListener('change', handleBreakpoint);
  } else if (typeof MOBILE_QUERY.addListener === 'function') {
    MOBILE_QUERY.addListener(handleBreakpoint);
  }

  /* ------------------------------------------------------------------
     3. Footer year
     ------------------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('[data-current-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------------
     4. Contact form
     ------------------------------------------------------------------ */
  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var PHONE_RE = /^[+]?[0-9\s\-()]{8,18}$/;

  function showError(field, message) {
    var box = document.querySelector('[data-error-for="' + field.id + '"]');
    if (box) box.textContent = message;
    field.setAttribute('aria-invalid', 'true');
  }

  function clearError(field) {
    var box = document.querySelector('[data-error-for="' + field.id + '"]');
    if (box) box.textContent = '';
    field.removeAttribute('aria-invalid');
  }

  function validateField(field) {
    clearError(field);

    if (field.hasAttribute('required') && !field.value.trim()) {
      showError(field, 'This field is required.');
      return false;
    }
    if (field.type === 'email' && field.value.trim() && !field.checkValidity()) {
      showError(field, 'Enter a valid email address, e.g. name@example.com.');
      return false;
    }
    if (field.type === 'tel' && field.value.trim() && !PHONE_RE.test(field.value.trim())) {
      showError(field, 'Enter a valid phone number, e.g. +91 97173 55259.');
      return false;
    }
    if (field.id === 'message' && field.value.trim() && field.value.trim().length < 10) {
      showError(field, 'Please add a little more detail (at least 10 characters).');
      return false;
    }
    return true;
  }

  var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'))
    .filter(function (el) { return el.type !== 'hidden' && el.type !== 'submit'; });

  fields.forEach(function (field) {
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  function setStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.className = 'form-status is-visible ' + (kind === 'error' ? 'is-error' : 'is-success');
  }

  form.addEventListener('submit', function (event) {
    var firstInvalid = null;
    fields.forEach(function (field) {
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      event.preventDefault();
      setStatus('Please correct the highlighted fields and submit again.', 'error');
      firstInvalid.focus();
      return;
    }

    // ------------------------------------------------------------------
    // WIRE YOUR ENDPOINT HERE.
    // The form's `action` attribute (see contact/index.html) is currently a
    // placeholder. Replace it with one of the following, then this handler
    // needs no change — the browser performs a normal POST:
    //
    //   Formspree  : action="https://formspree.io/f/XXXXXXXX"  method="post"
    //   Netlify    : add  data-netlify="true"  netlify-honeypot="company"
    //                and keep action="/contact/?sent=1"
    //   Web3Forms  : action="https://api.web3forms.com/submit" + hidden access_key
    //
    // If the action is still the placeholder we block the POST so no data is
    // silently lost, and tell the visitor to call or WhatsApp instead.
    // ------------------------------------------------------------------
    var action = form.getAttribute('action') || '';
    if (action.indexOf('REPLACE-WITH-YOUR-FORM-ENDPOINT') !== -1) {
      event.preventDefault();
      setStatus(
        'This form is not connected to an email endpoint yet. Please call +91 97173 55259 or email ask.ca.audit@gmail.com — we reply the same working day.',
        'error'
      );
      return;
    }

    setStatus('Sending your enquiry…', 'success');
  });

  // Success message after a redirect back with ?sent=1
  if (window.location.search.indexOf('sent=1') !== -1) {
    setStatus('Thank you — your enquiry has been received. We will respond within one working day.', 'success');
  }
})();
