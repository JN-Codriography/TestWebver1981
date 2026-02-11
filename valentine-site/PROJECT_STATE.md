# Project State — AOT Valentine (Feb 2026 snapshot)

Use this document to prompt future iterations. It summarizes what exists, how it works, and where to customize.

## Feature Summary
- Single-scene Valentine prompt: “Ryl, will you be my Valentine? 💌”
- YES → multi-stage cinematic pipeline (song intro, confirmation, world opens, narrator closure, optional memory montage) then celebration card with hearts/confetti.
- NO → equal-weight random playful events from enabled config entries (variants + new categories) with narrator lines and guaranteed reversibility.
- Narrator system: subtitle overlay, cooldown-controlled, idle + NO-stage + event + YES lines, aria-live polite, non-blocking.
- Procedural audio + optional YES-song placeholder; mute toggle and motion toggle with persistence.
- Mobile-first layout, safe-area aware, thumb-friendly buttons; prefers-reduced-motion respected.
- Offline cache via `sw.js`.

## Event Inventory (by category)
- Core/variants: eventDodge (lateral/float/circle), eventShrinkNoButton, eventGrowYes, eventSwapButtons, eventFakeDisable, eventBecomeYes, eventAvoidance, eventTextChange (instant/type/flicker), eventOverlay, eventYesGlow, eventHeartbeatPulse, eventSadShift (fog/desat/ash), eventShake (x/y/jitter), eventConfettiFake, eventTitanPeek.
- Narrator-driven: eventNarratorInterrupt, eventNarratorQuestions, eventNarratorTimePause, eventNarratorEncourage, eventNarratorMemory.
- Micro-detail: eventButtonBreathing, eventTextWeightShift, eventCursorEcho, eventUiBlink, eventButtonHesitation.
- UI falling apart: eventUIFragment, eventUILayerSlip, eventUIDisintegrateSoft, eventUIGravityFail.
- Screen cracking: eventScreenCrackHairline, eventScreenCrackPulse, eventScreenCrackHeal.
- UI transformations: eventGravityFlip, eventPerspectiveZoom, eventFalseReset, eventTextDrift, eventMirrorMoment.
- Environmental story: eventWallPulse, eventShadowTurn, eventFogSpiral, eventBannerTear, eventLightBreak.
- Emotional text: eventInnerMonologue, eventQuietChoice, eventRewriteWithPause, eventTextFragment, eventHeartbeatCaption.

## Sequence Inventory
- Random-pool sequences: sequenceCountdownImage (E), sequenceAlmostGone (F), sequenceYesTakesSpace (G), sequenceMemoryChoices (H).
- YES pipeline: sequenceYesSongIntro (A), sequenceYesConfirmation (B), sequenceYesWorldOpens (C), sequenceYesNarratorClosure (D), sequenceYesMemoryMontage (E optional).

## Customization Entry Points
- `js/config.js`: TEXT_CONFIG, NARRATOR_CONFIG, COLOR_CONFIG, ANIMATION_CONFIG, EVENT_PROBABILITIES, SOUND_CONFIG, SONG_CONFIG, IMAGE_CONFIG.
- CSS variables and helpers: `css/base.css`, `css/themes.css`, `css/animations.css`.
- Event/sequence logic: `js/events.js`, `js/sequences.js`, YES flow in `js/main.js`.
- Assets: replace `assets/images/placeholder.png`; swap `assets/sounds/yes-song-placeholder.mp4`.

## Accessibility Constraints
- aria-live on status + narrator; buttons focusable; keyboard activation with Enter/Space.
- Min ~52px buttons; high-contrast palette; no blocking overlays.
- Motion reduction honored via media query and Effects toggle.
- Narrator never prevents interaction; YES always reachable.

## Performance Limits / Guardrails
- ES modules require http(s); opening via file:// uses a legacy fallback with a warning banner.
- Lightweight vanilla JS; no external runtime deps.
- Animations capped ≤ ~600ms; confetti/hearts auto-remove; crack/fragment effects self-clean.
- Audio initialized only after first interaction; music playback falls back to procedural chord if asset missing.

## Known Assets
- Images: `assets/images/placeholder.png`.
- Sounds: procedural tones + `assets/sounds/yes-song-placeholder.mp4` (silent placeholder).

## File Pointers
- Entry: `index.html`
- Styles: `css/base.css`, `css/themes.css`, `css/animations.css`
- Scripts: `js/config.js`, `js/main.js`, `js/events.js`, `js/sequences.js`, `js/sound.js`
- PWA: `sw.js`
- Docs: `README.md`, `LICENSE`, `PROJECT_STATE.md`
