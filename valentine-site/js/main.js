// main.js - orchestrates interactions, randomness, narrator, and YES pipeline.
import { TEXT_CONFIG, ANIMATION_CONFIG, NARRATOR_CONFIG, EVENT_NAMES, EVENT_PROBABILITIES, EVENT_UI_CONFIG } from './config.js';
import { createSoundEngine } from './sound.js';
import { createEvents } from './events.js';
import { createSequences } from './sequences.js';

const els = {
  yes: document.getElementById('yesBtn'),
  no: document.getElementById('noBtn'),
  cta: document.getElementById('cta'),
  status: document.getElementById('status'),
  subtext: document.getElementById('subtext'),
  overlay: document.getElementById('overlayMessage'),
  narrator: document.getElementById('narrator'),
  narratorText: document.getElementById('narratorText'),
  countdownBar: document.getElementById('countdownBar'),
  countdownText: document.getElementById('countdownText'),
  confetti: document.getElementById('confettiLayer'),
  sadLayer: document.getElementById('sadLayer'),
  titan: document.getElementById('titanEvent'),
  shell: document.getElementById('shell'),
  celebration: document.getElementById('celebrationCard'),
  prompt: document.getElementById('promptCard'),
  heartField: document.getElementById('heartField'),
  muteToggle: document.getElementById('muteToggle'),
  motionToggle: document.getElementById('motionToggle'),
  fog: document.getElementById('fogLayer'),
  ash: document.getElementById('ashLayer'),
  bannerLeft: document.getElementById('bannerLeft'),
  bannerRight: document.getElementById('bannerRight'),
  bgGradient: document.querySelector('.bg-gradient'),
  lightBeam: document.getElementById('lightBeam'),
  headline: document.getElementById('headline'),
  eventImage: document.getElementById('eventImage'),
  eventImageTag: document.getElementById('eventImageTag'),
  yesPage: document.getElementById('yes-page'),
  yesPageClose: document.getElementById('yesPageClose'),
  yesPageMute: document.getElementById('yesPageMute'),
  yesVideo: document.getElementById('yesVideo'),
  yesImage: document.getElementById('yesImage'),
  yesMessage: document.getElementById('yesMessage'),
  heartbeatCaption: document.getElementById('heartbeatCaption'),
  crackLayer: document.getElementById('crackLayer'),
};

const state = {
  lastEvent: null,
  cooldowns: { titan: 0, sad: 0 },
  hasInteracted: false,
  motionReduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  muted: localStorage.getItem('aot-valentine-muted') === 'true',
  theme: 'default',
  avoidanceActive: false,
  lastPointer: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  noClicks: 0,
  narratorLast: 0,
  narratorLog: [],
  idleTimer: null,
  dodgeClicksRemaining: 0,
  yesRunning: false,
  eventTimers: {},
  eventBag: [],
  eventDeferrals: 0,
  yesPageOpen: false,
  yesPageBound: false,
  yesPageTimers: [],
};

const sound = createSoundEngine(state);

/* ---------- Helper utilities ---------- */
// Status labels are intentionally suppressed in UI.
const setStatus = (_text = '') => { els.status.textContent = ''; };
const setSubtext = (text) => { els.subtext.textContent = text; };
const setHeadline = (text) => { els.headline.textContent = text; };
const heartbeatCaption = (text) => { els.heartbeatCaption.textContent = text; };
const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const pick = (arr = []) => arr[Math.floor(Math.random() * arr.length)];

const showOverlay = (text, duration = 1500) => {
  els.overlay.textContent = text;
  els.overlay.classList.add('active');
  setTimeout(() => els.overlay.classList.remove('active'), duration);
};

const Narrator = (() => {
  let hideTimer = null;

  const pickDuration = (duration) => {
    if (typeof duration === 'number' && duration > 0) return duration;
    const min = NARRATOR_CONFIG.minDisplay || 3000;
    const max = NARRATOR_CONFIG.maxDisplay || 5000;
    const range = Math.max(0, max - min);
    return Math.floor(min + Math.random() * range);
  };

  const show = (text, duration) => {
    if (!text) return;
    const now = Date.now();
    if (now - state.narratorLast < NARRATOR_CONFIG.cooldown) return;
    state.narratorLast = now;
    if (hideTimer) clearTimeout(hideTimer);
    const target = els.narratorText || els.narrator;
    target.textContent = text;
    els.narrator.classList.add('active');
    state.narratorLog.push(text);
    if (state.narratorLog.length > 12) state.narratorLog.shift();
    hideTimer = setTimeout(() => els.narrator.classList.remove('active'), pickDuration(duration));
  };

  const startIdleTimer = () => {
    if (state.idleTimer) clearTimeout(state.idleTimer);
    state.idleTimer = setTimeout(() => {
      show(pick(NARRATOR_CONFIG.idleLines));
    }, NARRATOR_CONFIG.idleDelay);
  };

  const resetIdleTimer = () => startIdleTimer();

  return { show, startIdleTimer, resetIdleTimer };
})();
window.Narrator = Narrator;

const runCountdown = (after) => {
  els.countdownBar.classList.add('active');
  els.countdownText.textContent = 'Deciding in 3...';
  setTimeout(() => { els.countdownText.textContent = '2...'; }, 500);
  setTimeout(() => { els.countdownText.textContent = '1...'; }, 1000);
  setTimeout(() => {
    els.countdownBar.classList.remove('active');
    els.countdownText.textContent = '';
    if (typeof after === 'function') after();
  }, ANIMATION_CONFIG.countdownDuration);
};

const spawnConfetti = (count = 18, sadTint = false) => {
  const colors = sadTint ? ['#6b7688', '#8b1e1e', '#c94b4b'] : ['#f1c27d', '#c94b4b', '#ffffff'];
  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'confetti-piece';
    div.style.left = `${Math.random() * 100}%`;
    div.style.background = colors[Math.floor(Math.random() * colors.length)];
    div.style.animationDelay = `${Math.random() * 0.3}s`;
    els.confetti.appendChild(div);
    setTimeout(() => div.remove(), 1500);
  }
};

const spawnHearts = () => {
  for (let i = 0; i < 16; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 1.4}s`;
    heart.style.background = Math.random() > 0.6 ? 'var(--gold)' : '#ff869a';
    els.heartField.appendChild(heart);
    setTimeout(() => heart.remove(), 4200);
  }
};

const setTheme = (theme) => {
  state.theme = theme;
  if (theme === 'sad') {
    document.body.classList.add('sad');
    els.fog.classList.add('sad');
    els.ash.classList.add('sad');
  } else if (theme === 'happy') {
    document.body.classList.remove('sad', 'sad-heavy');
    document.body.classList.add('happy');
    els.fog.classList.remove('sad');
    els.ash.classList.remove('sad');
  } else {
    document.body.classList.remove('sad', 'happy', 'sad-heavy');
    els.fog.classList.remove('sad');
    els.ash.classList.remove('sad');
  }
};

const speakNarrator = (line) => Narrator.show(line);

const syncMuteUi = (muted) => {
  const isMuted = Boolean(muted);
  if (els.muteToggle) {
    els.muteToggle.textContent = isMuted ? 'Muted' : 'Sound on';
    els.muteToggle.setAttribute('aria-pressed', String(isMuted));
  }
  if (els.yesPageMute) {
    els.yesPageMute.textContent = isMuted ? 'Muted' : 'Sound on';
    els.yesPageMute.setAttribute('aria-pressed', String(isMuted));
  }
};

function setMuted(muted) {
  state.muted = Boolean(muted);
  localStorage.setItem('aot-valentine-muted', state.muted ? 'true' : 'false');
  sound.setMuted(state.muted);
  syncMuteUi(state.muted);
}

const helpers = {
  setTheme,
  setStatus,
  setSubtext,
  setHeadline,
  showOverlay,
  runCountdown,
  spawnConfetti,
  heartbeatCaption,
  showOverlayLocal: showOverlay,
  speakNarrator,
  setGlobalMuted: setMuted,
  syncMuteUi,
};

// Build events & sequences
const { events, showEventImage } = createEvents({ els, state, sound, helpers });
const { sequences } = createSequences({ els, sound, helpers, state }, showEventImage);
window.sequenceYesPage = sequences.sequenceYesPage;

/* ---------- Randomness ---------- */
const EventManager = (() => {
  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const rebuildBag = () => {
    const hasRunnableHandler = (name) => typeof events[name] === 'function' || typeof sequences[name] === 'function';
    const enabled = Array.isArray(EVENT_NAMES)
      ? EVENT_NAMES.filter((name) => EVENT_PROBABILITIES?.[name] !== 0 && hasRunnableHandler(name))
      : [];
    state.eventBag = shuffle(enabled);
    state.eventDeferrals = 0;
  };

  const rebuild = () => rebuildBag();

  const isBlocked = (name) => {
    const now = Date.now();
    if (name === 'eventTitanPeek' && now < state.cooldowns.titan) return true;
    if (name === 'eventSadShift' && now < state.cooldowns.sad) return true;
    return false;
  };

  const pickEvent = () => {
    if (!state.eventBag || !state.eventBag.length) rebuildBag();
    if (!state.eventBag.length) return null;
    const maxDeferrals = EVENT_UI_CONFIG.eventBagMaxDeferrals || 6;
    let safety = state.eventBag.length + maxDeferrals + 2;
    while (state.eventBag.length && safety > 0) {
      safety -= 1;
      const candidate = state.eventBag.shift();
      if (!candidate) break;
      if (!isBlocked(candidate) || state.eventDeferrals >= maxDeferrals) {
        state.eventDeferrals = 0;
        return candidate;
      }
      state.eventBag.push(candidate);
      state.eventDeferrals += 1;
    }
    state.eventDeferrals = 0;
    return state.eventBag.shift() || null;
  };

  return { rebuild, pickEvent };
})();
window.EventManager = EventManager;

function triggerRandomEvent() {
  const name = EventManager.pickEvent();
  if (!name) return;
  state.lastEvent = name;
  if (events[name]) events[name]();
  else if (sequences[name]) sequences[name]();
}

/* ---------- Sound gating & toggles ---------- */
const markInteracted = () => {
  if (state.hasInteracted) return;
  state.hasInteracted = true;
  sound.ensure();
};

const toggleMotion = () => {
  state.motionReduced = !state.motionReduced;
  document.body.classList.toggle('reduce-motion', state.motionReduced);
  els.motionToggle.textContent = state.motionReduced ? 'Soft mode' : 'Effects on';
  els.motionToggle.setAttribute('aria-pressed', String(!state.motionReduced));
};

/* ---------- Narrator: NO-click stages ---------- */
const handleNoNarrator = () => {
  const n = state.noClicks;
  if (n <= 2) Narrator.show(pick(NARRATOR_CONFIG.noEarly));
  else if (n <= 6) Narrator.show(pick(NARRATOR_CONFIG.noMid));
  else Narrator.show(pick(NARRATOR_CONFIG.noLate));
};

/* ---------- Event handling ---------- */
const handleYes = async () => {
  if (state.yesRunning) return;
  state.yesRunning = true;
  markInteracted();
  els.yes.disabled = true;
  Narrator.show('Decision locked.');
  try {
    if (sequences.sequenceYesPage) {
      await sequences.sequenceYesPage();
    }
  } finally {
    els.yes.disabled = false;
    state.yesRunning = false;
    Narrator.resetIdleTimer();
  }
};

const handleNo = (e) => {
  state.lastPointer = {
    x: e.clientX || (e.touches && e.touches[0]?.clientX) || window.innerWidth / 2,
    y: e.clientY || (e.touches && e.touches[0]?.clientY) || window.innerHeight / 2,
  };
  state.noClicks += 1;
  markInteracted();
  handleNoNarrator();
  if (state.dodgeClicksRemaining > 0 && events.eventDodge) {
    state.dodgeClicksRemaining -= 1;
    events.eventDodge(true);
    Narrator.resetIdleTimer();
    return;
  }
  triggerRandomEvent();
  Narrator.resetIdleTimer();
};

const handleAvoidanceMove = (e) => {
  if (!state.avoidanceActive) return;
  const rect = els.no.getBoundingClientRect();
  const dx = rect.x + rect.width / 2 - e.clientX;
  const dy = rect.y + rect.height / 2 - e.clientY;
  const dist = Math.hypot(dx, dy);
  if (dist < ANIMATION_CONFIG.avoidanceRadius) {
    const factor = 120 / (dist + 1);
    const moveX = clamp(dx * factor, -160, 160);
    const moveY = clamp(dy * factor, -120, 120);
    els.no.style.transform = `translate(${moveX}px, ${moveY}px)`;
    setTimeout(() => { els.no.style.transform = 'translate(0,0)'; }, 900);
  }
};

const addButtonTicks = () => {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('pointerdown', () => {
      markInteracted();
      sound.tick();
      Narrator.resetIdleTimer();
    });
  });
};

const initToggles = () => {
  els.muteToggle.addEventListener('click', () => {
    markInteracted();
    setMuted(!state.muted);
  });
  els.motionToggle.addEventListener('click', toggleMotion);
  setMuted(state.muted);
  if (state.motionReduced) {
    document.body.classList.add('reduce-motion');
    els.motionToggle.textContent = 'Soft mode';
    els.motionToggle.setAttribute('aria-pressed', 'false');
  } else {
    els.motionToggle.setAttribute('aria-pressed', 'true');
  }
};

const initAccessibility = () => {
  [els.yes, els.no].forEach((btn) => {
    btn.addEventListener('keyup', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        btn.click();
      }
    });
  });
};

const initIdleListeners = () => {
  ['pointerdown', 'pointermove', 'keydown'].forEach((ev) => {
    document.addEventListener(ev, () => Narrator.resetIdleTimer(), { passive: true });
  });
  Narrator.startIdleTimer();
};

/* ---------- Boot ---------- */
const init = () => {
  setHeadline(TEXT_CONFIG.headline);
  setSubtext(TEXT_CONFIG.subtext);
  EventManager.rebuild();
  els.yes.addEventListener('click', handleYes);
  els.no.addEventListener('click', handleNo);
  document.addEventListener('pointermove', handleAvoidanceMove);
  document.addEventListener('touchmove', handleAvoidanceMove, { passive: true });
  initToggles();
  initAccessibility();
  addButtonTicks();
  initIdleListeners();
};

init();

// Utility
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
