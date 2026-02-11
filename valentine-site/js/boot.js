// boot.js - chooses module or legacy runtime based on protocol.
(() => {
  'use strict';

  const MESSAGE = 'You opened this via file://. Interactions use a legacy fallback. For the full experience, serve with a local server.';
  const WARNING_ID = 'local-warning';
  const state = { warningShown: false, legacyLoaded: false, moduleLoaded: false };

  const appendWarning = () => {
    if (state.warningShown || document.getElementById(WARNING_ID)) return;
    state.warningShown = true;

    const warning = document.createElement('div');
    warning.className = 'local-warning';
    warning.id = WARNING_ID;
    warning.setAttribute('role', 'status');

    const text = document.createElement('span');
    text.className = 'local-warning__text';
    text.textContent = MESSAGE;

    const close = document.createElement('button');
    close.className = 'local-warning__close';
    close.type = 'button';
    close.textContent = 'Close';
    close.setAttribute('aria-label', 'Dismiss warning');
    close.addEventListener('click', () => warning.remove());

    warning.appendChild(text);
    warning.appendChild(close);

    const attach = () => document.body.appendChild(warning);
    if (document.body) {
      attach();
    } else {
      document.addEventListener('DOMContentLoaded', attach, { once: true });
    }
  };

  const loadLegacy = () => {
    if (state.legacyLoaded) return;
    state.legacyLoaded = true;
    appendWarning();
    const script = document.createElement('script');
    script.src = './js/legacy.js';
    script.defer = true;
    document.head.appendChild(script);
  };

  const loadModule = () => {
    if (state.moduleLoaded) return;
    state.moduleLoaded = true;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = './js/main.js';
    script.onerror = () => {
      state.moduleLoaded = false;
      loadLegacy();
    };
    document.head.appendChild(script);
  };

  if (window.location.protocol === 'file:') {
    loadLegacy();
  } else {
    loadModule();
  }
})();
