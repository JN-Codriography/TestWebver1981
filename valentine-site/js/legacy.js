// Legacy bundle for file:// mode. Keep in sync with module files.
(() => {
  'use strict';

  // config.js
  // Central configuration for copy, colors, timing, probabilities, audio, and narrator behavior.
  
  // TEXT_CONFIG controls all on-screen copy.
  const TEXT_CONFIG = {
    headline: "Ryl, will you be my Valentine? 💌", // Main question text.
    subtext: "click yes for an amazing amazing surprise!", // Supportive line under the question.
    overlays: ["That hurt a little 💔", "yeowch 😔", "Nooooo"], // Short overlay toasts.
    textChanges: ["Are you sure? 🥺", "Think again…", "Some choices matter 💗", "There might be a surprise"], // Temporary subtext swaps.
    emotional: {
      innerMonologue: "This took wayy to much time.", // Inner monologue overlay line.
      quietChoice: "Are you sure?", // Quiet choice overlay line.
      memoryTrace: "Every choice leaves a trace.", // Used for memory sequence.
      heartbeatCaption: "thump", // Caption synced to heartbeat pulse.
    },
    rewriteWords: ["Every", "choice", "matters"], // Words for "Rewrite With Pause".
    fragmentPieces: ["Consider", "clicking", "the", "yes", "button fr"], // Pieces for text fragment event.
  };
  
  // NARRATOR_CONFIG defines narrator text, timing, and cooldowns.
  const NARRATOR_CONFIG = {
    cooldown: 1800, // Minimum ms between narrator messages.
    idleDelay: 6000, // Ms of inactivity before idle narrator speaks.
    minDisplay: 3000, // Minimum ms narrator stays visible.
    maxDisplay: 5000, // Maximum ms narrator stays visible.
    idleLines: [
      "The yes button wait patiently.",
      "This moment feels suspended.",
      "Im waiting",
      "A decision lingers.",
      "Still thinking is allowed.",
      "I can wait all day.",
      "Im actually quite patient.",
      "Boy if you dont pick yes...",
    ], // Lines used when idle.
    noEarly: ["Interesting.", "I'll give you another chance to click yes.", "WOW", "Erm.", "Misclick?"], // NO clicks 1–2.
    noMid: ["Hmmmm.", "Narrator: She decides to click yes.", "Stop spamming no.", "Doesnt the big red button look inviting?"], // NO clicks 3–6.
    noLate: ["This is getting dramatic.", "Just click yes already.", "Well, now what?", "Looks like im gonna be here for a while.","So hows your day?","Did you know that I am watching you rn"
      ,"Time is an illusion.", "Im bored.", "You know I could just keep talking like this forever right?", "Im starting to feel lonely.","The yes button misses you.","67% of people click yes on the first try.","Youre really making me work for it."
      ,"Are you sure about that?", "What business should I do fr","Fun fact: I can see your screen.","I wonder what youre thinking about.","You do know that I can see you right?","Im just saying, the yes button is a good choice.",
      "Youre really testing my patience.","At this point, I might just start telling you my life story.","Did you know that I have a pet rock?","Sometimes I like to imagine what it would be like to be a butterfly."
      ,"my pet ant is called anthony. Get it?","scientists say that clicken yes is good for you.","I once clicked yes and it changed my life.","The yes button believes in you.", "Happy Valentines Day!"
    ], // NO clicks 7+.
    eventLines: {
      eventDodge: ["The button says no. get it?"],
      eventCountdownImageReveal: ["Something is about to appear."],
      eventShake: ["That startled the interface."],
      eventUIFragment: ["We’ll fix that."],
      eventScreenCrackHeal: ["That might be cosmetic."],
    }, // Optional narrator lines keyed by event name.
    yesPre: ["Finally.", "That felt final.", "Everything aligns."], // Narrator before YES flow.
    yesDuring: ["Stability restored.", "This is the good ending.", "The system approves."], // During YES sequences.
    yesAfter: ["Amazing.", "Correct build achieved.", "Happy paths are underrated."], // After final state.
  };
  
  // COLOR_CONFIG collects theme colors used by JS-driven effects.
  const COLOR_CONFIG = {
    defaultBg: "#1c1f26", // Base background color.
    sadBg: "#0f141a", // Background used during sad mode.
    happyStart: "#5b1f1f", // Happy gradient start.
    happyEnd: "#c94b4b", // Happy gradient end.
    beam: "rgba(255,255,255,0.14)", // Light beam color.
  };
  
  // ANIMATION_CONFIG centralizes timing and scale values.
  const ANIMATION_CONFIG = {
    shrinkNoDuration: 900, // Ms for NO button to shrink away.
    shrinkNoReturnDelay: 900, // Ms before NO returns.
    growYesDuration: 700, // Ms for YES to grow.
    yesMaxScale: 1.35, // Cap scale for YES growth.
    imagePopupDuration: 450, // Ms for popup fade/scale in.
    imageDisplayTime: 1400, // Ms before popup auto-dismiss.
    countdownDuration: 1500, // Ms total for countdown bar.
    avoidanceRadius: 140, // Px radius for avoidance check.
    uiFragmentSpread: 8, // Px max offset for UI fragment drift.
  };

  // EVENT_UI_CONFIG centralizes durations and UI options for events.
  const EVENT_UI_CONFIG = {
    textChangeDurationMs: 8000,
    dodgeDurationMs: 7000,
    dodgeClicksMin: 4,
    dodgeClicksMax: 6,
    sadShiftMinMs: 7000,
    sadShiftMaxMs: 10000,
    sadEmoji: ['😞', '😔', '😢', '🥀', '💔'],
    sadEmojiCount: 10,
    sadEmojiDurationMs: 3000,
    gravityDropDurationMs: 700,
    gravityHoldMs: 1200,
    gravityReturnMs: 600,
    eventBagMaxDeferrals: 6,
  };

  // EVENT_NAMES provides the canonical pool for equal-probability random picks.
  const EVENT_NAMES = [
    'eventCountdownImageReveal',
    'eventShrinkNoButton',
    'eventGrowYes',
    'eventDodge',
    'eventSwapButtons',
    'eventFakeDisable',
    'eventBecomeYes',
    'eventAvoidance',
    'eventTextChange',
    'eventOverlay',
    'eventYesGlow',
    'eventHeartbeatPulse',
    'eventSadShift',
    'eventShake',
    'eventConfettiFake',
    'eventTitanPeek',
    'eventNarratorInterrupt',
    'eventNarratorQuestions',
    'eventNarratorTimePause',
    'eventNarratorEncourage',
    'eventNarratorMemory',
    'eventButtonBreathing',
    'eventTextWeightShift',
    'eventCursorEcho',
    'eventUiBlink',
    'eventButtonHesitation',
    'eventUIFragment',
    'eventUILayerSlip',
    'eventUIDisintegrateSoft',
    'eventUIGravityFail',
    'eventScreenCrackHairline',
    'eventScreenCrackPulse',
    'eventScreenCrackHeal',
    'eventGravityFlip',
    'eventPerspectiveZoom',
    'eventFalseReset',
    'eventTextDrift',
    'eventMirrorMoment',
    'eventWallPulse',
    'eventShadowTurn',
    'eventFogSpiral',
    'eventBannerTear',
    'eventLightBreak',
    'eventInnerMonologue',
    'eventQuietChoice',
    'eventRewriteWithPause',
    'eventTextFragment',
    'eventHeartbeatCaption',
    'sequenceCountdownImage',
    'sequenceAlmostGone',
    'sequenceYesTakesSpace',
    'sequenceMemoryChoices',
  ];
  
  // EVENT_PROBABILITIES controls event enabling for the equal-weight event bag.
  // Zero removes an item from the bag; any positive value keeps it eligible.
  const EVENT_PROBABILITIES = {
    // Core playful events with variants
    eventDodge: 3,                  // Button Dodge variants
    eventShrinkNoButton: 3,         // Shrink NO until it disappears
    eventGrowYes: 3,                // YES grows gradually
    eventSwapButtons: 2,            // Swap positions briefly
    eventFakeDisable: 2,            // NO disables briefly
    eventBecomeYes: 2,              // NO label becomes "Yes?"
    eventAvoidance: 2,              // NO avoids cursor/touch
    eventTextChange: 2,             // Subtext swap variants
    eventOverlay: 2,                // Overlay toast
    eventCountdownImageReveal: 2,   // Countdown then image popup
    eventYesGlow: 2,                // YES glow pulse
    eventHeartbeatPulse: 2,         // Screen heartbeat pulse
    eventSadShift: 2,               // Temporary sad theme variants
    eventShake: 2,                  // Light rumble variants
    eventConfettiFake: 2,           // Confetti fake-out
    eventTitanPeek: 2,              // Rare titan wall cameo
    // Narrator-driven
    eventNarratorInterrupt: 2,
    eventNarratorQuestions: 1,
    eventNarratorTimePause: 2,
    eventNarratorEncourage: 2,
    eventNarratorMemory: 1,
    // Micro-detail additions
    eventButtonBreathing: 2,        // NO breathes once
    eventTextWeightShift: 2,        // Headline weight shift
    eventCursorEcho: 2,             // Ripple at tap point
    eventUiBlink: 1,                // Brief UI dim
    eventButtonHesitation: 2,       // Shrink-stop-shrink
    // UI falling apart
    eventUIFragment: 2,
    eventUILayerSlip: 2,
    eventUIDisintegrateSoft: 2,
    eventUIGravityFail: 2,
    // Screen cracking
    eventScreenCrackHairline: 1,
    eventScreenCrackPulse: 1,
    eventScreenCrackHeal: 1,
    // UI transformations
    eventGravityFlip: 2,            // Buttons drop/bounce
    eventPerspectiveZoom: 2,        // Mini perspective zoom
    eventFalseReset: 1,             // Fake refresh snap-back
    eventTextDrift: 2,              // Headline drifts sideways
    eventMirrorMoment: 1,           // Buttons mirrored visually
    // Environmental story
    eventWallPulse: 2,              // Background wall pulses
    eventShadowTurn: 1,             // Shadow changes direction
    eventFogSpiral: 2,              // Fog spirals inward
    eventBannerTear: 2,             // Banner ripple/tear illusion
    eventLightBreak: 1,             // Light beam crack
    // Emotional text
    eventInnerMonologue: 1,         // Inner monologue overlay
    eventQuietChoice: 1,            // Quiet choice overlay
    eventRewriteWithPause: 1,       // Headline rewrites with pauses
    eventTextFragment: 2,           // Subtext fragments/reforms
    eventHeartbeatCaption: 1,       // Caption synced to pulse
    // Sequences (multi-step)
    sequenceCountdownImage: 2,      // Sequence E
    sequenceAlmostGone: 2,          // Sequence F
    sequenceYesTakesSpace: 2,       // Sequence G
    sequenceMemoryChoices: 2,       // Sequence H
  };
  
  // SOUND_CONFIG toggles audio behavior.
  const SOUND_CONFIG = {
    enabled: true, // Master enable/disable for all procedural sounds.
    defaultVolume: 0.18, // Master gain value.
  };
  
  // SONG_CONFIG controls YES song playback.
  const SONG_CONFIG = {
    enabled: true, // Toggle music playback for YES sequences.
    main: "assets/sounds/yes-song-placeholder.mp4", // Placeholder audio path; replace with your song.
  };

  // VIDEO_CONFIG controls YES-page video playback.
  const VIDEO_CONFIG = {
    yesPageSrc: "./assets/videos/YesVid.mp4",
    yesAutoplay: true,
    yesLoop: true,
    yesMuted: true,
  };
  
  // IMAGE_CONFIG lists placeholder assets.
  const IMAGE_CONFIG = {
    eventPlaceholder: "./assets/images/placeholder.png", // Used by event popups and sequences.
    yesImages: [
      "./assets/images/YesImage1.png",
      "./assets/images/YesImage2.png",
      "./assets/images/YesImage3.png",
    ],
    yesFlashMinDelay: 3000,
    yesFlashMaxDelay: 4000,
    yesFlashDuration: 900,
  };
  
  // sound.js - procedural Web Audio graph
  const MusicPlayer = (() => {
    let audio;
    let muted = false;
  
    const ensureAudio = () => {
      if (!audio) {
        audio = new Audio();
        audio.loop = false;
        audio.preload = 'auto';
        audio.onended = () => { /* no-op */ };
        audio.onerror = () => { /* no-op */ };
      }
      return audio;
    };
  
    const setMuted = (isMuted) => {
      muted = Boolean(isMuted);
      if (audio) {
        audio.muted = muted;
        audio.volume = muted ? 0 : 0.55;
      }
    };
  
    const toggleMute = () => {
      setMuted(!muted);
      return muted;
    };
  
    const playYesSong = (songId = 'main') => {
      if (!SONG_CONFIG.enabled) return false;
      const src = SONG_CONFIG[songId] || SONG_CONFIG.main;
      try {
        const player = ensureAudio();
        player.src = src;
        player.muted = muted;
        player.volume = muted ? 0 : 0.55;
        const playPromise = player.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
        return true;
      } catch (e) {
        return false;
      }
    };
  
    const stopAllMusic = () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  
    return { playYesSong, stopAllMusic, toggleMute, setMuted };
  })();
  function createSoundEngine(state) {
    // If sound globally disabled, return no-op stubs.
    if (!SOUND_CONFIG.enabled) {
      const noop = () => {};
      return {
        ensure: noop,
        setMuted: MusicPlayer.setMuted,
        tick: noop,
        heartbeat: noop,
        gust: noop,
        cello: noop,
        drum: noop,
        paper: noop,
        echo: noop,
        scream: noop,
        yesChime: noop,
        playYesSong: MusicPlayer.playYesSong,
        stopAllMusic: MusicPlayer.stopAllMusic,
        stopWind: noop,
      };
    }
    let ctx;
    let master;
    let windSource;
    let windTimer;
  
    const makeGain = (value) => {
      const g = ctx.createGain();
      g.gain.value = value;
      return g;
    };
  
    const ensure = () => {
      if (ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = state.muted ? 0 : SOUND_CONFIG.defaultVolume;
      master.connect(ctx.destination);
      startWind();
    };
  
    const playTone = (freq, duration = 0.18, type = 'sine', gainValue = 0.15, attack = 0.01, decay = 0.12) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = makeGain(gainValue);
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain).connect(master);
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(gainValue, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration + decay);
      osc.start(now);
      osc.stop(now + duration + decay + 0.05);
    };
  
    const playNoiseBurst = (duration = 0.35, gainValue = 0.18, lowpass = 1200, highpass = 200) => {
      if (!ctx) return;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = lowpass;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = highpass;
      const gain = makeGain(gainValue);
      source.connect(hp).connect(lp).connect(gain).connect(master);
      source.start();
      source.stop(ctx.currentTime + duration + 0.05);
    };
  
    const startWind = () => {
      if (windSource || !ctx) return;
      const duration = 2;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
      windSource = ctx.createBufferSource();
      windSource.buffer = buffer;
      windSource.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      const gain = makeGain(0.08);
      windSource.connect(filter).connect(gain).connect(master);
      windSource.start();
      windTimer = setInterval(() => {
        filter.frequency.setTargetAtTime(300 + Math.random() * 400, ctx.currentTime, 1.5);
      }, 2500);
    };
  
    const stopWind = () => {
      if (windSource) {
        windSource.stop();
        windSource.disconnect();
        windSource = null;
      }
      if (windTimer) clearInterval(windTimer);
    };
  
    const setMuted = (muted) => {
      MusicPlayer.setMuted(muted);
      if (!master) return;
      master.gain.setTargetAtTime(muted ? 0 : SOUND_CONFIG.defaultVolume, ctx.currentTime, 0.1);
    };
  
    const api = {
      ensure,
      setMuted,
      tick: () => { ensure(); playTone(660, 0.08, 'triangle', 0.12, 0.005, 0.08); },
      heartbeat: () => {
        ensure();
        playTone(70, 0.1, 'sine', 0.3, 0.01, 0.05);
        setTimeout(() => playTone(90, 0.12, 'sine', 0.22, 0.01, 0.06), 120);
      },
      gust: () => { ensure(); playNoiseBurst(0.25, 0.2, 900, 120); },
      cello: () => { ensure(); playTone(110, 0.4, 'sawtooth', 0.18, 0.02, 0.2); },
      drum: () => { ensure(); playTone(60, 0.3, 'sine', 0.25, 0.01, 0.18); },
      paper: () => { ensure(); playNoiseBurst(0.18, 0.12, 2200, 1000); },
      echo: () => { ensure(); playTone(520, 0.22, 'triangle', 0.16, 0.01, 0.12); },
      scream: () => { ensure(); playNoiseBurst(0.9, 0.08, 1400, 280); playTone(420, 0.8, 'triangle', 0.05, 0.02, 0.5); },
      yesChime: () => {
        ensure();
        [523, 659, 784].forEach((f, i) => setTimeout(() => playTone(f, 0.4, 'sine', 0.2, 0.02, 0.3), i * 80));
      },
      // Plays the configured YES song; falls back to a soft chord if the file fails to load.
      playYesSong: (songId = 'main') => {
        ensure();
        const ok = MusicPlayer.playYesSong(songId);
        if (!ok) {
          api.yesChime();
        }
      },
      // Stops any playing music and ambient wind.
      stopAllMusic: () => {
        MusicPlayer.stopAllMusic();
      },
      stopWind,
    };
  
    return api;
  }
  
  // events.js - individual events registry with doc comments.
  
  /**
   * createEvents builds the event registry.
   * Each event lives in its own function with comments on trigger & reset.
   */
  function createEvents(ctx) {
    const { els, state, sound, helpers } = ctx;
    const { setTheme, setStatus, setSubtext, showOverlay, runCountdown, spawnConfetti, setHeadline, heartbeatCaption, speakNarrator } = helpers;
  
    /* ---------- Shared utilities ---------- */
  
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

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
    /* ---------------- Required core behaviors ---------------- */
  
    /** Trigger: NO click. Visual: countdown then popup image. Reset: countdown bar hides, image auto-dismisses. */
    function eventCountdownImageReveal() {
      runCountdown(() => showEventImage());
      sound.echo();
      setStatus('Countdown → reveal');
      speakNarrator(pick(NARRATOR_CONFIG.eventLines.eventCountdownImageReveal || []));
    }
  
    /** Trigger: NO click. Visual: NO shrinks away (ease-in), disables. Reset: returns after delay. */
    function eventShrinkNoButton() {
      const btn = els.no;
      btn.classList.add('shrink-soft');
      requestAnimationFrame(() => {
        btn.classList.add('shrink-away');
        btn.style.pointerEvents = 'none';
      });
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
  
    /** Trigger: NO click. Visual: YES grows (ease-in) up to capped scale. Reset: returns smoothly. */
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
  
    /* ---------------- Core playful events with variants ---------------- */
  
    /** Trigger: NO click. Visual: NO jumps/escapes. Reset: returns after delay. */
    function eventDodge(chained = false) {
      if (!chained) {
        const minClicks = EVENT_UI_CONFIG.dodgeClicksMin || 4;
        const maxClicks = EVENT_UI_CONFIG.dodgeClicksMax || minClicks;
        state.dodgeClicksRemaining = Math.max(0, randInt(minClicks, maxClicks) - 1);
      }
      const variant = pick(['lateral', 'float', 'circle']);
      const maxX = window.innerWidth * 0.4;
      const maxY = window.innerHeight * 0.25;
      let dx = 0, dy = 0;
      if (variant === 'lateral') {
        dx = (Math.random() > 0.5 ? 1 : -1) * maxX * 0.6;
        dy = 0;
      } else if (variant === 'float') {
        dx = (Math.random() - 0.5) * 2 * maxX * 0.5;
        dy = (Math.random() - 0.2) * maxY * 0.8;
      } else {
        const angle = Math.random() * Math.PI * 2;
        dx = Math.cos(angle) * maxX * 0.4;
        dy = Math.sin(angle) * maxY * 0.4;
      }
      els.no.style.transform = `translate(${clamp(dx, -maxX, maxX)}px, ${clamp(dy, -maxY, maxY)}px)`;
      els.no.classList.add('avoid');
      sound.gust();
      setStatus('No dodged away');
      speakNarrator(pick(NARRATOR_CONFIG.eventLines.eventDodge || []));
      const duration = EVENT_UI_CONFIG.dodgeDurationMs || 7000;
      setTimeout(() => { els.no.style.transform = 'translate(0,0)'; }, duration);
    }
  
    /** Trigger: NO click. Visual: YES/NO swap visual order. Reset: auto after 3.5s. */
    function eventSwapButtons() {
      flashClass(els.cta, 'swap', 3500);
      sound.tick();
      setStatus('Positions swapped');
    }
  
    /** Trigger: NO click. Visual: NO disables briefly. Reset: re-enables after 1.5s. */
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
      }, 1500);
      setStatus('No pauses briefly');
    }
  
    /** Trigger: NO click. Visual: NO label becomes "Yes?". Reset: label restored after 1.8s. */
    function eventBecomeYes() {
      const original = els.no.textContent;
      els.no.textContent = 'Yes?';
      sound.tick();
      setTimeout(() => { els.no.textContent = original; }, 1800);
      setStatus('No is tempted…');
    }
  
    /** Trigger: NO click. Visual: activates avoidance on pointer move. Reset: off after 1.4s. */
    function eventAvoidance() {
      state.avoidanceActive = true;
      sound.paper();
      setTimeout(() => { state.avoidanceActive = false; }, 1400);
      setStatus('No starts to avoid you');
    }
  
    /** Trigger: NO click. Visual: subtext swaps using variant. Reset: restore after a longer read. */
    function eventTextChange() {
      const variant = pick(['instant', 'type', 'flicker']);
      const next = pick(TEXT_CONFIG.textChanges);
      const original = TEXT_CONFIG.subtext;
      const duration = EVENT_UI_CONFIG.textChangeDurationMs || 8000;
      clearTimers('text');
      const scheduleReset = () => {
        const timer = setTimeout(() => setSubtext(original), duration);
        pushTimer('text', timer);
      };
      if (variant === 'instant') {
        setSubtext(next);
        scheduleReset();
      } else if (variant === 'type') {
        let idx = 0;
        const typeNext = () => {
          setSubtext(next.slice(0, idx));
          idx += 1;
          if (idx <= next.length) requestAnimationFrame(typeNext);
          else scheduleReset();
        };
        typeNext();
      } else {
        let toggles = 0;
        const flicker = () => {
          setSubtext(toggles % 2 === 0 ? next : original);
          toggles += 1;
          if (toggles < 6) {
            const timer = setTimeout(flicker, 120);
            pushTimer('text', timer);
          } else {
            setSubtext(next);
            scheduleReset();
          }
        };
        flicker();
      }
      sound.echo();
      setStatus('Text shifted');
    }
  
    /** Trigger: NO click. Visual: toast overlay message. Reset: fades after duration. */
    function eventOverlay() {
      const msg = pick(TEXT_CONFIG.overlays);
      showOverlay(msg, 1800);
      sound.heartbeat();
      setStatus('Overlay shown');
    }
  
    /** Trigger: NO click. Visual: YES button glows warmly. Reset: auto after 2.4s. */
    function eventYesGlow() {
      flashClass(els.yes, 'glow', 2400);
      sound.echo();
      setStatus('Yes glows warmly');
    }
  
    /** Trigger: NO click. Visual: shell heartbeat pulse + caption. Reset: clears after 0.7s. */
    function eventHeartbeatPulse() {
      flashClass(els.shell, 'heartbeat', 700);
      heartbeatCaption(TEXT_CONFIG.emotional.heartbeatCaption);
      sound.heartbeat();
      setTimeout(() => heartbeatCaption(''), 700);
      setStatus('Heartbeat felt');
    }
  
    /** Trigger: NO click. Visual: full melancholy theme + emoji rain. Reset: back to default after 7–10s. */
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
  
    /** Trigger: NO click (if motion allowed). Visual: shake variant. Reset: after class duration. */
    function eventShake() {
      if (state.motionReduced) return;
      const variant = pick(['shake', 'shake-y', 'jitter']);
      flashClass(els.shell, variant, 760);
      sound.drum();
      setStatus('A gentle shake');
      speakNarrator(pick(NARRATOR_CONFIG.eventLines.eventShake || []));
    }
  
    /** Trigger: NO click. Visual: brief confetti with sad tint. Reset: particles auto-remove. */
    function eventConfettiFake() {
      spawnConfetti(14, true);
      sound.paper();
      setStatus('Confetti fake-out');
    }
  
    /** Trigger: rare NO click (cooldown). Visual: titan wall cameo + distant sound. Reset: hides after 2.6s. */
    function eventTitanPeek() {
      state.cooldowns.titan = Date.now() + 20000;
      els.titan.classList.add('active');
      sound.cello();
      sound.drum();
      sound.scream();
      setStatus('Narrator: What an interesting individual we have here...');
      setTimeout(() => els.titan.classList.remove('active'), 2600);
    }
  
    /* ---------------- Narrator-driven events ---------------- */
  
    /** Trigger: NO click. Visual: short pause + narrator line. Reset: resumes immediately. */
    function eventNarratorInterrupt() {
      speakNarrator("I should probably say something.");
      setStatus('Narrator interrupt');
    }
    /** Trigger: NO click. Visual: narrator asks a question. */
    function eventNarratorQuestions() {
      speakNarrator("Was that the answer?");
      setStatus('Narrator wonders');
    }
    /** Trigger: NO click. Visual: micro time-freeze with narrator. */
    function eventNarratorTimePause() {
      flashClass(els.shell, 'ui-blink', 200);
      speakNarrator("Even time waited.");
      setStatus('Time paused');
    }
    /** Trigger: NO click. Visual: narrator encouragement. */
    function eventNarratorEncourage() {
      speakNarrator("Some paths better.");
      setStatus('Encouraged');
    }
    /** Trigger: NO click. Visual: narrator memory callback. */
    function eventNarratorMemory() {
      speakNarrator("This choice has been seen before.");
      setStatus('Memory noted');
    }
  
    /* ---------------- Micro-detail events ---------------- */
  
    /** Trigger: NO click. Visual: gentle scale up/down once. Reset: auto. */
    function eventButtonBreathing() {
      flashClass(els.no, 'breathe', 900);
      setStatus('No takes a breath');
    }
  
    /** Trigger: NO click. Visual: headline bold then normal. Reset: auto after 1s. */
    function eventTextWeightShift() {
      const h = els.headline;
      const original = h.style.fontWeight;
      h.style.fontWeight = '800';
      setStatus('Idk what to put here');
      setTimeout(() => { h.style.fontWeight = original || '600'; }, 900);
    }
  
    /** Trigger: NO click (uses last pointer). Visual: ripple at tap point. Reset: ripple removed when animation ends. */
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
  
    /** Trigger: NO click. Visual: whole UI dims briefly. Reset: remove class after 160ms. */
    function eventUiBlink() {
      flashClass(els.shell, 'ui-blink', 160);
      setStatus('UI blinked');
    }
  
    /** Trigger: NO click. Visual: partial shrink, pause, then final shrink. Reset: auto restore. */
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
  
    /** Trigger: NO click. Visual: elements offset/rotate slightly. Reset: snap back after 1s. */
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
  
    /** Trigger: NO click. Visual: text layer misaligns briefly. Reset: snaps back. */
    function eventUILayerSlip() {
      flashClass(els.subtext, 'layer-slip', 320);
      setStatus('Layer slipped');
    }
  
    /** Trigger: NO click. Visual: buttons fade to 60% then reassemble. Reset: opacity restores. */
    function eventUIDisintegrateSoft() {
      [els.yes, els.no].forEach((el) => el.classList.add('disintegrate'));
      setStatus('UI softens');
      setTimeout(() => [els.yes, els.no].forEach((el) => el.classList.remove('disintegrate')), 1200);
    }
  
    /** Trigger: NO click. Visual: UI drops to bottom then returns. Reset: transitions end. */
    /* ---------------- Screen cracking ---------------- */
  
    /** Trigger: NO click. Visual: thin crack overlay fades out. Reset: removes class. */
    function eventScreenCrackHairline() {
      els.crackLayer.classList.add('visible');
      setStatus('Hairline crack');
      setTimeout(() => els.crackLayer.classList.remove('visible'), 700);
    }
  
    /** Trigger: NO click. Visual: crack pulses with heartbeat. Reset: class removed. */
    function eventScreenCrackPulse() {
      els.crackLayer.classList.add('visible', 'pulse');
      flashClass(els.shell, 'heartbeat', 600);
      setStatus('Crack pulse');
      setTimeout(() => els.crackLayer.classList.remove('visible', 'pulse'), 600);
    }
  
    /** Trigger: NO click. Visual: crack forms then seals. Reset: class removed. */
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
  
    /** Trigger: NO click. Visual: background wall pulses subtly. Reset: auto via animation. */
    function eventWallPulse() {
      flashClass(els.bgGradient, 'breathe', 900);
      setStatus('Wall pulses');
    }
  
    /** Trigger: NO click. Visual: card shadow direction shifts. Reset: animation end. */
    function eventShadowTurn() {
      flashClass(els.prompt, 'shadow-turned', 900);
      setStatus('Shadow shifted');
    }
  
    /** Trigger: NO click. Visual: fog layer spirals inward. Reset: animation end. */
    function eventFogSpiral() {
      flashClass(els.fog, 'spiral', 1200);
      setStatus('Fog swirls');
    }
  
    /** Trigger: NO click. Visual: banners ripple/tear illusion. Reset: animation end. */
    function eventBannerTear() {
      flashClass(els.bannerLeft, 'banner-ripple', 900);
      flashClass(els.bannerRight, 'banner-ripple', 900);
      sound.paper();
      setStatus('Banners ripple');
    }
  
    /** Trigger: NO click. Visual: thin beam cracks through background. Reset: animation end. */
    function eventLightBreak() {
      flashClass(els.lightBeam, 'light-crack', 1200);
      setStatus('Light breaks through');
    }
  
    /* ---------------- Emotional text events ---------------- */
  
    /** Trigger: NO click. Visual: overlay with inner monologue text. Reset: overlay fades. */
    function eventInnerMonologue() {
      showOverlay(TEXT_CONFIG.emotional.innerMonologue, 2000);
      sound.cello();
      setStatus('Inner monologue');
    }
  
    /** Trigger: NO click. Visual: overlay with quiet choice text. Reset: overlay fades. */
    function eventQuietChoice() {
      showOverlay(TEXT_CONFIG.emotional.quietChoice, 2000);
      sound.heartbeat();
      setStatus('Quiet choice');
    }
  
    /** Trigger: NO click. Visual: headline rewrites word by word. Reset: restores original headline. */
    function eventRewriteWithPause() {
      const original = TEXT_CONFIG.headline;
      const words = [...TEXT_CONFIG.rewriteWords];
      let idx = 0;
      const writeNext = () => {
        if (idx > words.length) {
          setHeadline(original);
          setStatus('Rewritten back');
          return;
        }
        setHeadline(words.slice(0, idx).join(' '));
        idx += 1;
        setTimeout(writeNext, 260);
      };
      writeNext();
      sound.tick();
      setStatus('Rewriting…');
    }
  
    /** Trigger: NO click. Visual: subtext fragments into pieces. Reset: restores after 1.8s. */
    function eventTextFragment() {
      const original = TEXT_CONFIG.subtext;
      setSubtext(TEXT_CONFIG.fragmentPieces.join(' • '));
      setTimeout(() => setSubtext(original), 1800);
      sound.echo();
      setStatus('Text fragmented');
    }
  
    /** Trigger: NO click. Visual: heartbeat caption synced to pulse. Reset: clears caption. */
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
  
  // sequences.js - cinematic multi-step sequences (atomic, self-cleaning).
  function createSequences(ctx, showEventImage) {
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
  
    const updateYesPageMuteLabel = (isMuted) => {
      syncMuteUi(isMuted);
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
      updateYesPageMuteLabel(state.muted);
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
  
  // main.js - orchestrates interactions, randomness, narrator, and YES pipeline.
  
  
  
  
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
})();
