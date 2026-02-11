// sequences.js - cinematic multi-step sequences (atomic, self-cleaning).
import { TEXT_CONFIG, IMAGE_CONFIG, ANIMATION_CONFIG, NARRATOR_CONFIG, VIDEO_CONFIG } from './config.js';
import { MusicPlayer } from './sound.js';

export function createSequences(ctx, showEventImage) {
  const { els, sound, helpers, state } = ctx;
  const { runCountdown, setSubtext, setStatus, heartbeatCaption, showOverlayLocal, setHeadline, setTheme, spawnConfetti, speakNarrator, setGlobalMuted, syncMuteUi } = helpers;
  const pick = (arr = []) => arr[Math.floor(Math.random() * arr.length)];

  /* -------- Sequence E: Countdown → Image Reveal -------- */
  // Trigger: selected randomly. Visual: countdown, dim, image popup, soft sound, fade out.
  function sequenceCountdownImage() {
    els.shell.classList.add('ui-dim');
    runCountdown(() => {
      showEventImage(IMAGE_CONFIG.eventPlaceholder);
      sound.echo();
      setTimeout(() => els.shell.classList.remove('ui-dim'), 900);
    });
    setStatus('Sequence: countdown reveal');
  }

  /* -------- Sequence F: Almost Gone -------- */
  // Trigger: selected randomly. Visual: NO shrinks slowly, line appears, disappears, then restores.
  function sequenceAlmostGone() {
    const btn = els.no;
    setStatus('Sequence: almost gone');
    btn.classList.add('shrink-soft');
    btn.style.transform = 'scale(0.7)';
    setTimeout(() => { btn.style.transform = 'scale(0.4)'; }, 400);
    setTimeout(() => { btn.style.transform = 'scale(0.15)'; }, 800);
    sound.paper();
    setTimeout(() => {
      showOverlayLocal('Still here…', 1400);
      btn.classList.add('shrink-away');
      btn.style.pointerEvents = 'none';
    }, 1100);
    setTimeout(() => {
      btn.classList.remove('shrink-away');
      btn.style.transform = 'scale(1)';
      btn.style.pointerEvents = 'auto';
      btn.classList.remove('shrink-soft');
    }, ANIMATION_CONFIG.shrinkNoDuration + 1200);
  }

  /* -------- Sequence G: Yes Takes Space -------- */
  // Trigger: selected randomly. Visual: YES grows with glow, NO untouched, then resets.
  function sequenceYesTakesSpace() {
    const btn = els.yes;
    setStatus('Sequence: yes takes space');
    btn.classList.add('grow-soft', 'glow');
    btn.style.transform = `scale(${ANIMATION_CONFIG.yesMaxScale})`;
    sound.yesChime();
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
      btn.classList.remove('glow');
      setTimeout(() => btn.classList.remove('grow-soft'), 420);
    }, ANIMATION_CONFIG.growYesDuration + 500);
  }

  /* -------- Sequence H: Memory of Choices -------- */
  // Trigger: selected randomly. Visual: faint memory text, wind, clears.
  function sequenceMemoryChoices() {
    const original = TEXT_CONFIG.subtext;
    const ghost = TEXT_CONFIG.emotional.memoryTrace;
    setSubtext(ghost);
    els.subtext.style.opacity = '0.5';
    heartbeatCaption(TEXT_CONFIG.emotional.memoryTrace);
    sound.gust();
    setStatus('Sequence: memory of choices');
    setTimeout(() => {
      els.subtext.style.opacity = '1';
      heartbeatCaption('');
      setSubtext(original);
    }, 2400);
  }

  /* -------- YES pipeline sequences (A–E) -------- */

  // Sequence A: Song play + warm fade.
  function sequenceYesSongIntro() {
    setTheme('happy');
    els.shell.classList.add('ui-dim');
    sound.playYesSong('main');
    spawnConfetti(18, false);
    setTimeout(() => els.shell.classList.remove('ui-dim'), 900);
    setStatus('YES: song intro');
  }

  // Sequence B: Confirmation text dissolve/type.
  function sequenceYesConfirmation() {
    const line = "Then it’s decided.";
    setSubtext('');
    let idx = 0;
    const type = () => {
      setSubtext(line.slice(0, idx));
      idx += 1;
      if (idx <= line.length) setTimeout(type, 40);
    };
    type();
    flashGlow();
    setStatus('YES: confirmation');
  }

  // Sequence C: World opens (fog clear + warm particles).
  function sequenceYesWorldOpens() {
    els.fog.style.transition = 'opacity 600ms ease, transform 600ms ease';
    els.fog.style.opacity = '0.2';
    els.fog.style.transform = 'translateY(-8%)';
    els.ash.style.opacity = '0.15';
    spawnConfetti(22, false);
    setStatus('YES: world opens');
    setTimeout(() => {
      els.fog.style.opacity = '';
      els.fog.style.transform = '';
      els.ash.style.opacity = '';
    }, 1600);
  }

  // Sequence D: Narrator closure line.
  function sequenceYesNarratorClosure() {
    speakNarrator("And the choice was made.");
    setStatus('YES: narrator closure');
  }

  // Sequence E (optional): Memory montage floating narrator lines.
  function sequenceYesMemoryMontage() {
    if (!state.narratorLog.length) return;
    const layer = document.createElement('div');
    layer.style.position = 'fixed';
    layer.style.inset = '0';
    layer.style.pointerEvents = 'none';
    layer.style.zIndex = '9';
    document.body.appendChild(layer);
    state.narratorLog.slice(-5).forEach((line, i) => {
      const span = document.createElement('div');
      span.textContent = line;
      span.style.position = 'absolute';
      span.style.left = `${20 + i * 8}%`;
      span.style.bottom = `${10 + i * 6}%`;
      span.style.color = 'rgba(230,225,216,0.8)';
      span.style.fontSize = '0.95rem';
      span.style.animation = 'heart-float 4s ease-in forwards';
      layer.appendChild(span);
      setTimeout(() => span.remove(), 4000);
    });
    setTimeout(() => layer.remove(), 4200);
    setStatus('YES: memories float');
  }

  /* -------- YES Page Overlay -------- */
  const clearYesPageTimers = () => {
    if (!state.yesPageTimers) state.yesPageTimers = [];
    state.yesPageTimers.forEach((id) => clearTimeout(id));
    state.yesPageTimers = [];
  };

  const closeYesPage = () => {
    state.yesPageOpen = false;
    clearYesPageTimers();
    MusicPlayer.stopAllMusic();
    if (els.yesVideo) {
      els.yesVideo.pause();
      els.yesVideo.currentTime = 0;
    }
    if (els.yesImage) els.yesImage.classList.remove('visible');
    if (els.yesPage) {
      els.yesPage.classList.remove('active');
      els.yesPage.setAttribute('aria-hidden', 'true');
    }
  };

  const toggleYesPageMute = () => {
    setGlobalMuted(!state.muted);
  };

  const bindYesPageControls = () => {
    if (state.yesPageBound) return;
    state.yesPageBound = true;
    if (els.yesPageClose) els.yesPageClose.addEventListener('click', closeYesPage);
    if (els.yesPageMute) els.yesPageMute.addEventListener('click', toggleYesPageMute);
  };

  const startYesSlideshow = () => {
    const images = IMAGE_CONFIG.yesImages || [];
    if (!images.length || !els.yesImage) return;
    const minDelay = IMAGE_CONFIG.yesFlashMinDelay || 3000;
    const maxDelay = IMAGE_CONFIG.yesFlashMaxDelay || minDelay;
    const fadeDuration = IMAGE_CONFIG.yesFlashDuration || 900;
    els.yesImage.style.setProperty('--yes-fade-duration', `${fadeDuration}ms`);
    let index = Math.floor(Math.random() * images.length);

    const showImage = (nextIndex, immediate = false) => {
      const src = images[nextIndex];
      if (!src) return;
      if (immediate || !els.yesImage.src) {
        els.yesImage.src = src;
        requestAnimationFrame(() => els.yesImage.classList.add('visible'));
        return;
      }
      els.yesImage.classList.remove('visible');
      const swapTimer = setTimeout(() => {
        els.yesImage.src = src;
        requestAnimationFrame(() => els.yesImage.classList.add('visible'));
      }, fadeDuration);
      state.yesPageTimers.push(swapTimer);
    };

    const scheduleNext = () => {
      if (!state.yesPageOpen || images.length < 2) return;
      const delay = minDelay + Math.random() * Math.max(0, maxDelay - minDelay);
      const timer = setTimeout(() => {
        index = (index + 1) % images.length;
        showImage(index);
        scheduleNext();
      }, delay);
      state.yesPageTimers.push(timer);
    };

    showImage(index, true);
    scheduleNext();
  };

  function sequenceYesPage() {
    if (!els.yesPage) return;
    state.yesPageOpen = true;
    els.yesPage.classList.add('active');
    els.yesPage.setAttribute('aria-hidden', 'false');
    if (els.yesMessage && !els.yesMessage.textContent) {
      els.yesMessage.textContent = "Happy Valentine's Day, Ryl ❤️";
    }
    bindYesPageControls();
    clearYesPageTimers();
    syncMuteUi(state.muted);
    try {
      MusicPlayer.playYesSong('main');
    } catch (e) {
      // ignore playback errors
    }
    if (els.yesVideo) {
      const configuredSrc = VIDEO_CONFIG.yesPageSrc || '';
      if (configuredSrc && els.yesVideo.getAttribute('src') !== configuredSrc) {
        els.yesVideo.src = configuredSrc;
      }
      els.yesVideo.autoplay = Boolean(VIDEO_CONFIG.yesAutoplay);
      els.yesVideo.loop = Boolean(VIDEO_CONFIG.yesLoop);
      const shouldMute = Boolean(VIDEO_CONFIG.yesMuted);
      els.yesVideo.defaultMuted = shouldMute;
      els.yesVideo.muted = shouldMute;
      els.yesVideo.volume = shouldMute ? 0 : 1;
      const playPromise = els.yesVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
    startYesSlideshow();
  }

  const sequences = {
    sequenceCountdownImage,
    sequenceAlmostGone,
    sequenceYesTakesSpace,
    sequenceMemoryChoices,
    sequenceYesSongIntro,
    sequenceYesConfirmation,
    sequenceYesWorldOpens,
    sequenceYesNarratorClosure,
    sequenceYesMemoryMontage,
    sequenceYesPage,
  };

  return { sequences };
}

function flashGlow() {
  const el = document.body;
  el.classList.add('glow');
  setTimeout(() => el.classList.remove('glow'), 600);
}
