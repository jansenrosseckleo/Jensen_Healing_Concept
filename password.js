/* ============================================
   JENSEN HEALING CONCEPT — Password Protection
   ============================================ */

(function() {
  var PASS_HASH = 'e904883f02b0baeb3c5a6b90a7ba0b083e0497ddbd588ddd22c06c89dd5f1569';
  var STORAGE_KEY = 'jhc_auth';

  function sha256(str) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function(buf) {
      return Array.from(new Uint8Array(buf)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
    });
  }

  if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
    return;
  }

  document.documentElement.style.overflow = 'hidden';

  document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.createElement('div');
    overlay.id = 'passwordOverlay';
    overlay.className = 'pw-overlay';

    var card = document.createElement('div');
    card.className = 'pw-card';

    var logoDiv = document.createElement('div');
    logoDiv.className = 'pw-logo';
    var logoTop = document.createElement('span');
    logoTop.className = 'pw-logo-top';
    logoTop.textContent = 'Jensen';
    var logoBottom = document.createElement('span');
    logoBottom.className = 'pw-logo-bottom';
    logoBottom.textContent = 'Healing Concept';
    logoDiv.appendChild(logoTop);
    logoDiv.appendChild(logoBottom);

    var text = document.createElement('p');
    text.className = 'pw-text';
    text.textContent = 'Diese Seite ist passwortgesch\u00fctzt.';

    var form = document.createElement('form');
    form.className = 'pw-form';

    var inputWrap = document.createElement('div');
    inputWrap.className = 'pw-input-wrap';

    var input = document.createElement('input');
    input.type = 'password';
    input.className = 'pw-input';
    input.placeholder = 'Passwort eingeben';
    input.autocomplete = 'off';
    input.autofocus = true;

    var btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'pw-btn';
    btn.setAttribute('aria-label', 'Absenden');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('fill', 'none');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M4 10h12M12 6l4 4-4 4');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    btn.appendChild(svg);

    inputWrap.appendChild(input);
    inputWrap.appendChild(btn);

    var error = document.createElement('p');
    error.className = 'pw-error';
    error.textContent = 'Falsches Passwort';

    form.appendChild(inputWrap);
    form.appendChild(error);

    card.appendChild(logoDiv);
    card.appendChild(text);
    card.appendChild(form);
    overlay.appendChild(card);

    document.body.prepend(overlay);

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      sha256(input.value.trim()).then(function(hash) {
        if (hash === PASS_HASH) {
          sessionStorage.setItem(STORAGE_KEY, 'true');
          overlay.classList.add('pw-overlay--hide');
          document.documentElement.style.overflow = '';
          setTimeout(function() { overlay.remove(); }, 500);
        } else {
          error.classList.add('visible');
          input.classList.add('pw-input--error');
          input.value = '';
          input.focus();
          setTimeout(function() {
            error.classList.remove('visible');
            input.classList.remove('pw-input--error');
          }, 2000);
        }
      });
    });
  });
})();
