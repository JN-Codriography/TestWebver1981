// events.js - individual events registry
import { ANIMATION_CONFIG, IMAGE_CONFIG, TEXT_CONFIG, EVENT_UI_CONFIG, NARRATOR_CONFIG } from './config.js';

/**
 * createEvents builds the event registry.
 * Each event lives in its own function with comments on trigger & reset.
 */
export function createEvents(ctx) {
  const { els, state, sound, helpers } = ctx;
  const { setTheme, setStatus, setSubtext, showOverlay, runCountdown, spawnConfetti, setHeadline, heartbeatCaption, speakNarrator } = helpers;
  const pick = (arr = []) => arr[Math.floor(Math.random() * arr.length)];

  // Reusable image popup for countdowns & reveals.
  const showEventImage = (imageId = IMAGE_CONFIG.eventPlaceholder) => {
    const wrapper = els.eventImage;
    const img = els.eventImageTag;
    img.src = imageId || IMAGE_CONFIG.eventPlaceholder;
    wrapper.classList.add('visible');
    setTimeout(() => wrapper.classList.remove('visible'), ANIMATION_CONFIG.imageDisplayTime);
  };

  // Helper to toggle a class for a duration.
  const flashClass = (element, cls, duration = 800) => {
    element.classList.add(cls);
    setTimeout(() => element.classList.remove(cls), duration);
  };

  const randInt = (min, max) => {
    const safeMin = Number.isFinite(min) ? min : 0;
    const safeMax = Number.isFinite(max) ? max : safeMin;
    return Math.floor(safeMin + Math.random() * (safeMax - safeMin + 1));
  };

  const ensureTimerGroup = (group) => {
    if (!state.eventTimers) state.eventTimers = {};
    if (!state.eventTimers[group]) state.eventTimers[group] = [];
    return state.eventTimers[group];
  };

  const clearTimers = (group) => {
    const list = ensureTimerGroup(group);
    list.forEach((id) => clearTimeout(id));
    state.eventTimers[group] = [];
  };

  const pushTimer = (group, id) => {
    ensureTimerGroup(group).push(id);
  };

  const getGravityTargets = () => ([
    els.shell,
    els.overlay,
    els.narrator,
    els.countdownBar,
  ]).filter(Boolean);

  const applyGravityDrop = () => {
    clearTimers('gravity');
    const targets = getGravityTargets();
    if (!targets.length) return;
    const dropDuration = EVENT_UI_CONFIG.gravityDropDurationMs || 700;
    const holdDuration = EVENT_UI_CONFIG.gravityHoldMs || 1200;
    const returnDuration = EVENT_UI_CONFIG.gravityReturnMs || 600;
    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const drop = Math.max(0, window.innerHeight - rect.bottom - 8);
      el.style.setProperty('--gravity-drop', `${drop}px`);
      el.style.setProperty('--gravity-drop-duration', `${dropDuration}ms`);
      el.style.setProperty('--gravity-return-duration', `${returnDuration}ms`);
      el.classList.remove('gravity-return');
      el.classList.add('gravity-drop');
    });
    const returnTimer = setTimeout(() => {
      targets.forEach((el) => {
        el.classList.remove('gravity-drop');
        el.classList.add('gravity-return');
      });
      const cleanupTimer = setTimeout(() => {
        targets.forEach((el) => {
          el.classList.remove('gravity-return');
          el.style.removeProperty('--gravity-drop');
          el.style.removeProperty('--gravity-drop-duration');
          el.style.removeProperty('--gravity-return-duration');
        });
      }, returnDuration + 60);
      pushTimer('gravity', cleanupTimer);
    }, dropDuration + holdDuration);
    pushTimer('gravity', returnTimer);
  };

  /* ---------------- Required core behaviors ---------------- */

  // Trigger: NO click. Visual: countdown then popup image. Reset: countdown bar hides, image auto-dismisses.
  function eventCountdownImageReveal() {
    runCountdown(() => showEventImage());
    sound.echo();
    setStatus('Countdown → reveal');
  }

  // Trigger: NO click. Visual: NO shrinks away (ease-in), disables. Reset: returns after delay.
  function eventShrinkNoButton() {
    const btn = els.no;
    btn.classList.add('shrink-soft');
    requestAnimationFrame(() => btn.classList.add('shrink-away'));
    btn.style.pointerEvents = 'none';
    setStatus('No is slipping away…');
    sound.paper();
    setTimeout(() => {
      btn.classList.remove('shrink-away');
      btn.classList.add('return-soft');
      btn.style.pointerEvents = 'auto';
      btn.style.transform = 'scale(1)';
      btn.style.opacity = '1';
      setTimeout(() => btn.classList.remove('return-soft', 'shrink-soft'), 420);
    }, ANIMATION_CONFIG.shrinkNoDuration + ANIMATION_CONFIG.shrinkNoReturnDelay);
  }

  // Trigger: NO click. Visual: YES grows (ease-in) up to capped scale. Reset: returns smoothly.
  function eventGrowYes() {
    const btn = els.yes;
    btn.style.transformOrigin = 'center';
    btn.classList.add('grow-soft');
    btn.style.transform = `scale(${ANIMATION_CONFIG.yesMaxScale})`;
    sound.tick();
    setStatus('Yes glows brighter');
    setTimeout(() => {
      btn.classList.add('grow-reset');
      btn.style.transform = 'scale(1)';
      setTimeout(() => btn.classList.remove('grow-soft', 'grow-reset'), 420);
    }, ANIMATION_CONFIG.growYesDuration);
  }

  /* ---------------- Legacy core playful events ---------------- */

  // Trigger: NO click. Visual: NO jumps to random safe position. Reset: returns after delay.
  function eventDodge(chained = false) {
    if (!chained) {
      const minClicks = EVENT_UI_CONFIG.dodgeClicksMin || 4;
      const maxClicks = EVENT_UI_CONFIG.dodgeClicksMax || minClicks;
      state.dodgeClicksRemaining = Math.max(0, randInt(minClicks, maxClicks) - 1);
    }
    const maxX = window.innerWidth * 0.4;
    const maxY = window.innerHeight * 0.25;
    const dx = (Math.random() - 0.5) * 2 * maxX;
    const dy = (Math.random() - 0.5) * 2 * maxY;
    els.no.style.transform = `translate(${clamp(dx, -maxX, maxX)}px, ${clamp(dy, -maxY, maxY)}px)`;
    els.no.classList.add('avoid');
    sound.gust();
    setStatus('No dodged away');
    const duration = EVENT_UI_CONFIG.dodgeDurationMs || 7000;
    setTimeout(() => { els.no.style.transform = 'translate(0,0)'; }, duration);
  }

  // Trigger: NO click. Visual: YES/NO swap visual order. Reset: auto after 6s.
  function eventSwapButtons() {
    flashClass(els.cta, 'swap', 6000);
    sound.tick();
    setStatus('Positions swapped');
  }

  // Trigger: NO click. Visual: NO disables briefly. Reset: re-enables after 6s.
  function eventFakeDisable() {
    const original = els.no.textContent;
    els.no.textContent = '…';
    els.no.disabled = true;
    els.no.classList.add('disabled');
    sound.echo();
    setTimeout(() => {
      els.no.disabled = false;
      els.no.classList.remove('disabled');
      els.no.textContent = original;
    }, 6000);
    setStatus('No pauses briefly');
  }

  // Trigger: NO click. Visual: NO label becomes "Yes?". Reset: label restored after 7s.
  function eventBecomeYes() {
    const original = els.no.textContent;
    els.no.textContent = 'Yes';
    sound.tick();
    setTimeout(() => { els.no.textContent = original; }, 7000);
    setStatus('No is tempted…');
  }

  // Trigger: NO click. Visual: activates avoidance on pointer move. Reset: off after 5s.
  function eventAvoidance() {
    state.avoidanceActive = true;
    sound.paper();
    setTimeout(() => { state.avoidanceActive = false; }, 5000);
    setStatus('No starts to avoid you');
  }

  // Trigger: NO click. Visual: subtext swaps to playful prompt. Reset: restore after a longer read.
  function eventTextChange() {
    const next = TEXT_CONFIG.textChanges[Math.floor(Math.random() * TEXT_CONFIG.textChanges.length)];
    const original = TEXT_CONFIG.subtext;
    clearTimers('text');
    setSubtext(next);
    sound.echo();
    const duration = EVENT_UI_CONFIG.textChangeDurationMs || 8000;
    const resetTimer = setTimeout(() => setSubtext(original), duration);
    pushTimer('text', resetTimer);
    setStatus('Text shifted');
  }

  // Trigger: NO click. Visual: toast overlay message. Reset: fades after duration.
  function eventOverlay() {
    const msg = TEXT_CONFIG.overlays[Math.floor(Math.random() * TEXT_CONFIG.overlays.length)];
    showOverlay(msg, 1800);
    sound.heartbeat();
    setStatus('Overlay shown');
  }

  // Trigger: NO click. Visual: YES button glows warmly. Reset: auto after 2.4s.
  function eventYesGlow() {
    flashClass(els.yes, 'glow', 2400);
    sound.echo();
    setStatus('Yes glows warmly');
  }

  // Trigger: NO click. Visual: shell heartbeat pulse + caption. Reset: clears after 0.7s.
  function eventHeartbeatPulse() {
    flashClass(els.shell, 'heartbeat', 700);
    heartbeatCaption(TEXT_CONFIG.emotional.heartbeatCaption);
    sound.heartbeat();
    setTimeout(() => heartbeatCaption(''), 700);
    setStatus('Heartbeat felt');
  }

  // Trigger: NO click. Visual: full melancholy theme. Reset: back to default after 7–10s.
  function eventSadShift() {
    clearTimers('sad');
    const minMs = EVENT_UI_CONFIG.sadShiftMinMs || 7000;
    const maxMs = EVENT_UI_CONFIG.sadShiftMaxMs || minMs;
    const duration = randInt(minMs, maxMs);
    setTheme('sad');
    document.body.classList.add('sad-heavy');
    state.cooldowns.sad = Date.now() + duration;
    if (els.sadLayer) {
      els.sadLayer.innerHTML = '';
      const emojiCount = EVENT_UI_CONFIG.sadEmojiCount || 10;
      const emojiDuration = EVENT_UI_CONFIG.sadEmojiDurationMs || 3000;
      const choices = EVENT_UI_CONFIG.sadEmoji || ['😞', '😔', '😢', '🥀', '💔'];
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < emojiCount; i += 1) {
        const span = document.createElement('span');
        span.className = 'sad-emoji';
        span.textContent = choices[Math.floor(Math.random() * choices.length)];
        span.style.left = `${Math.random() * 100}%`;
        span.style.animationDelay = `${Math.random() * 0.6}s`;
        span.style.setProperty('--sad-emoji-duration', `${emojiDuration}ms`);
        span.style.setProperty('--sad-emoji-x', `${(Math.random() - 0.5) * 60}px`);
        fragment.appendChild(span);
      }
      els.sadLayer.appendChild(fragment);
      const emojiCleanup = setTimeout(() => {
        if (els.sadLayer) els.sadLayer.innerHTML = '';
      }, emojiDuration + 800);
      pushTimer('sad', emojiCleanup);
    }
    sound.cello();
    setStatus('Mood darkened 😞');
    const resetTimer = setTimeout(() => {
      document.body.classList.remove('sad-heavy');
      if (els.sadLayer) els.sadLayer.innerHTML = '';
      setTheme('default');
    }, duration);
    pushTimer('sad', resetTimer);
  }

  // Trigger: NO click (if motion allowed). Visual: light rumble. Reset: after 0.76s.
  function eventShake() {
    if (state.motionReduced) return;
    flashClass(els.shell, 'shake', 760);
    sound.drum();
    setStatus('A gentle shake');
  }

  // Trigger: NO click. Visual: brief confetti with sad tint. Reset: particles auto-remove.
  function eventConfettiFake() {
    spawnConfetti(14, true);
    sound.paper();
    setStatus('Yahoo you clicked Yes! wait what?');
  }

  // Trigger: rare NO click (cooldown). Visual: titan wall cameo + distant sound. Reset: hides after 5s.
  function eventTitanPeek() {
    state.cooldowns.titan = Date.now() + 20000;
    els.titan.classList.add('active');
    sound.cello();
    sound.drum();
    sound.scream();
    setStatus('Narrator: What an interesting individual we have here...');
    setTimeout(() => els.titan.classList.remove('active'), 5000);
  }

  /* ---------------- Narrator-driven events ---------------- */

  // Trigger: NO click. Visual: short pause + narrator line. Reset: resumes immediately.
  function eventNarratorInterrupt() {
    speakNarrator('I should probably say something.');
    setStatus('Narrator interrupt');
  }

  // Trigger: NO click. Visual: narrator asks a question.
  function eventNarratorQuestions() {
    speakNarrator('Was that the answer?');
    setStatus('Narrator wonders');
  }

  // Trigger: NO click. Visual: micro time-freeze with narrator.
  function eventNarratorTimePause() {
    flashClass(els.shell, 'ui-blink', 200);
    speakNarrator('Even time waited.');
    setStatus('Time paused');
  }

  // Trigger: NO click. Visual: narrator encouragement.
  function eventNarratorEncourage() {
    speakNarrator('Some paths are softer.');
    setStatus('Encouraged');
  }

  // Trigger: NO click. Visual: narrator memory callback.
  function eventNarratorMemory() {
    speakNarrator('This choice has been seen before.');
    setStatus('Memory noted');
  }

  /* ---------------- Micro-detail events ---------------- */

  // Trigger: NO click. Visual: gentle scale up/down once. Reset: auto.
  function eventButtonBreathing() {
    flashClass(els.no, 'breathe', 900);
    setStatus('No takes a breath');
  }

  // Trigger: NO click. Visual: headline bold then normal. Reset: auto after 1s.
  function eventTextWeightShift() {
    const h = els.headline;
    const original = h.style.fontWeight;
    h.style.fontWeight = '800';
    setStatus('Text feels heavier');
    setTimeout(() => { h.style.fontWeight = original || '600'; }, 900);
  }

  // Trigger: NO click (uses last pointer). Visual: ripple at tap point. Reset: ripple removed when animation ends.
  function eventCursorEcho() {
    const { x, y } = state.lastPointer || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 900);
    sound.tick();
    setStatus('Echo ripple');
  }

  // Trigger: NO click. Visual: whole UI dims briefly. Reset: remove class after 160ms.
  function eventUiBlink() {
    flashClass(els.shell, 'ui-blink', 160);
    setStatus('UI blinked');
  }

  // Trigger: NO click. Visual: partial shrink, pause, then final shrink. Reset: auto restore.
  function eventButtonHesitation() {
    const btn = els.no;
    btn.classList.add('shrink-soft');
    btn.style.transform = 'scale(0.92)';
    setTimeout(() => {
      btn.style.transform = 'scale(0.82)';
      setTimeout(() => {
        btn.classList.add('shrink-away');
        btn.style.pointerEvents = 'none';
        setTimeout(() => {
          btn.classList.remove('shrink-away');
          btn.style.transform = 'scale(1)';
          btn.style.pointerEvents = 'auto';
          setTimeout(() => btn.classList.remove('shrink-soft'), 300);
        }, 800);
      }, 260);
    }, 260);
    sound.paper();
    setStatus('No hesitates');
  }

  /* ---------------- UI falling apart ---------------- */

  // Trigger: NO click. Visual: elements offset/rotate slightly. Reset: snap back after 1s.
  function eventUIFragment() {
    const targets = [els.headline, els.subtext, els.yes, els.no];
    targets.forEach((el) => {
      const x = (Math.random() - 0.5) * ANIMATION_CONFIG.uiFragmentSpread;
      const y = (Math.random() - 0.5) * ANIMATION_CONFIG.uiFragmentSpread;
      const r = (Math.random() - 0.5) * 6;
      el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
    });
    speakNarrator(pick(NARRATOR_CONFIG.eventLines.eventUIFragment || []));
    setStatus('UI fragments softly');
    setTimeout(() => targets.forEach((el) => { el.style.transform = 'translate(0,0) rotate(0)'; }), 900);
  }

  // Trigger: NO click. Visual: text layer misaligns briefly. Reset: snaps back.
  function eventUILayerSlip() {
    flashClass(els.subtext, 'layer-slip', 320);
    setStatus('Layer slipped');
  }

  // Trigger: NO click. Visual: buttons fade to 60% then reassemble. Reset: opacity restores.
  function eventUIDisintegrateSoft() {
    [els.yes, els.no].forEach((el) => el.classList.add('disintegrate'));
    setStatus('UI softens');
    setTimeout(() => [els.yes, els.no].forEach((el) => el.classList.remove('disintegrate')), 1200);
  }

  /* ---------------- Screen cracking ---------------- */

  // Trigger: NO click. Visual: thin crack overlay fades out. Reset: removes class.
  function eventScreenCrackHairline() {
    els.crackLayer.classList.add('visible');
    setStatus('Hairline crack');
    setTimeout(() => els.crackLayer.classList.remove('visible'), 700);
  }

  // Trigger: NO click. Visual: crack pulses with heartbeat. Reset: class removed.
  function eventScreenCrackPulse() {
    els.crackLayer.classList.add('visible', 'pulse');
    flashClass(els.shell, 'heartbeat', 600);
    setStatus('Crack pulse');
    setTimeout(() => els.crackLayer.classList.remove('visible', 'pulse'), 600);
  }

  // Trigger: NO click. Visual: crack forms then seals. Reset: class removed.
  function eventScreenCrackHeal() {
    els.crackLayer.classList.add('visible');
    speakNarrator(pick(NARRATOR_CONFIG.eventLines.eventScreenCrackHeal || []));
    setStatus('Crack heals');
    setTimeout(() => els.crackLayer.classList.remove('visible'), 900);
  }

  /* ---------------- UI transformation events ---------------- */

  function eventGravityFlip() {
    applyGravityDrop();
    sound.tick();
    setStatus('Gravity failed');
  }

  function eventUIGravityFail() {
    applyGravityDrop();
    sound.tick();
    setStatus('UI dropped');
  }

  function eventPerspectiveZoom() {
    flashClass(els.shell, 'perspective', 800);
    sound.echo();
    setStatus('Perspective shifted');
  }

  function eventFalseReset() {
    flashClass(els.shell, 'false-reset', 1000);
    sound.echo();
    setStatus('False reset… just kidding');
  }

  function eventTextDrift() {
    flashClass(els.headline, 'drift-text', 1200);
    setStatus('Text drifted');
  }

  function eventMirrorMoment() {
    flashClass(els.cta, 'mirror', 600);
    setStatus('Mirror moment');
  }

  /* ---------------- Environmental story events ---------------- */

  // Trigger: NO click. Visual: background wall pulses subtly. Reset: auto via animation.
  function eventWallPulse() {
    flashClass(els.bgGradient, 'breathe', 900);
    setStatus('Wall pulses');
  }

  // Trigger: NO click. Visual: card shadow direction shifts. Reset: animation end.
  function eventShadowTurn() {
    flashClass(els.prompt, 'shadow-turned', 900);
    setStatus('Shadow shifted');
  }

  // Trigger: NO click. Visual: fog layer spirals inward. Reset: animation end.
  function eventFogSpiral() {
    flashClass(els.fog, 'spiral', 1200);
    setStatus('Fog swirls');
  }

  // Trigger: NO click. Visual: banners ripple/tear illusion. Reset: animation end.
  function eventBannerTear() {
    flashClass(els.bannerLeft, 'banner-ripple', 900);
    flashClass(els.bannerRight, 'banner-ripple', 900);
    sound.paper();
    setStatus('Banners ripple');
  }

  // Trigger: NO click. Visual: thin beam cracks through background. Reset: animation end.
  function eventLightBreak() {
    flashClass(els.lightBeam, 'light-crack', 1200);
    setStatus('Light breaks through');
  }

  /* ---------------- Emotional text events ---------------- */

  // Trigger: NO click. Visual: overlay with inner monologue text. Reset: overlay fades.
  function eventInnerMonologue() {
    showOverlay(TEXT_CONFIG.emotional.innerMonologue, 2000);
    sound.cello();
    setStatus('Inner monologue');
  }

  // Trigger: NO click. Visual: overlay with quiet choice text. Reset: overlay fades.
  function eventQuietChoice() {
    showOverlay(TEXT_CONFIG.emotional.quietChoice, 2000);
    sound.heartbeat();
    setStatus('Quiet choice');
  }

  // Trigger: NO click. Visual: headline rewrites word by word. Reset: restores original headline.
  function eventRewriteWithPause() {
    const original = TEXT_CONFIG.headline;
    const words = [...TEXT_CONFIG.rewriteWords];
    let idx = 0;
    const writeNext = () => {
      if (idx >= words.length) {
        setHeadline(original);
        setStatus('Rewritten back');
        return;
      }
      setHeadline(words.slice(0, idx + 1).join(' '));
      idx += 1;
      setTimeout(writeNext, 260);
    };
    writeNext();
    sound.tick();
    setStatus('Rewriting…');
  }

  // Trigger: NO click. Visual: subtext fragments into pieces. Reset: restores after 1.8s.
  function eventTextFragment() {
    const original = TEXT_CONFIG.subtext;
    setSubtext(TEXT_CONFIG.fragmentPieces.join(' • '));
    setTimeout(() => setSubtext(original), 1800);
    sound.echo();
    setStatus('Text fragmented');
  }

  // Trigger: NO click. Visual: heartbeat caption synced to pulse. Reset: clears caption.
  function eventHeartbeatCaption() {
    heartbeatCaption(TEXT_CONFIG.emotional.heartbeatCaption);
    setTimeout(() => heartbeatCaption(''), 900);
    sound.heartbeat();
    setStatus('Heartbeat caption');
  }

  /* ---------------- Event registry ---------------- */
  const events = {
    eventCountdownImageReveal,
    eventShrinkNoButton,
    eventGrowYes,
    eventDodge,
    eventSwapButtons,
    eventFakeDisable,
    eventBecomeYes,
    eventAvoidance,
    eventTextChange,
    eventOverlay,
    eventYesGlow,
    eventHeartbeatPulse,
    eventSadShift,
    eventShake,
    eventConfettiFake,
    eventTitanPeek,
    eventNarratorInterrupt,
    eventNarratorQuestions,
    eventNarratorTimePause,
    eventNarratorEncourage,
    eventNarratorMemory,
    eventButtonBreathing,
    eventTextWeightShift,
    eventCursorEcho,
    eventUiBlink,
    eventButtonHesitation,
    eventUIFragment,
    eventUILayerSlip,
    eventUIDisintegrateSoft,
    eventUIGravityFail,
    eventScreenCrackHairline,
    eventScreenCrackPulse,
    eventScreenCrackHeal,
    eventGravityFlip,
    eventPerspectiveZoom,
    eventFalseReset,
    eventTextDrift,
    eventMirrorMoment,
    eventWallPulse,
    eventShadowTurn,
    eventFogSpiral,
    eventBannerTear,
    eventLightBreak,
    eventInnerMonologue,
    eventQuietChoice,
    eventRewriteWithPause,
    eventTextFragment,
    eventHeartbeatCaption,
  };

  return { events, showEventImage };
}

// Utility
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
