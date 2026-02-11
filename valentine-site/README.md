# AOT-Inspired Valentine — “Ryl, will you be my Valentine?”

A cinematic, mobile-first Valentine website with playful YES/NO interactions, narrator overlays, random AOT-flavored events, procedural sound, optional YES-song placeholder, and offline support. Built with HTML, CSS, and vanilla JS—no build step required.

## Project Structure
```
valentine-site/
├─ index.html
├─ sw.js
├─ assets/
│  ├─ images/placeholder.png
│  ├─ sounds/yes-song-placeholder.mp4   # replace with your song
│  └─ fonts/
├─ css/
│  ├─ base.css          # layout, typography, components
│  ├─ themes.css        # theme utility classes and toggles
│  └─ animations.css    # keyframes and motion helpers
├─ js/
│  ├─ config.js         # text, colors, durations, probabilities, assets, narrator, music
│  ├─ sound.js          # procedural Web Audio engine + song playback fallback
│  ├─ events.js         # single-step events (one function each, documented)
│  ├─ sequences.js      # multi-step cinematic sequences (YES pipeline + E–H)
│  └─ main.js           # orchestration, narrator, randomness, accessibility
├─ README.md
├─ LICENSE
└─ PROJECT_STATE.md
```

## Customization Guide
- **Text**: `TEXT_CONFIG` in `js/config.js` (headline, subtext, overlays, emotional lines).
- **Narrator**: `NARRATOR_CONFIG` for idle delay, cooldown, NO-stage lines, event lines, YES-stage lines.
- **Colors**: `COLOR_CONFIG` in `config.js` plus CSS variables in `base.css` / `themes.css`.
- **Animation Durations & Scales**: `ANIMATION_CONFIG` (shrink/grow timings, countdown length, popup duration, fragment spread).
- **Event Probabilities**: `EVENT_PROBABILITIES` to enable/disable events and sequences (`0` disables, positive values enable).
- **Images**: Replace `assets/images/placeholder.png`; update `IMAGE_CONFIG` if renamed.
- **Sounds**: Procedural by default; set `SOUND_CONFIG.enabled` to `false` to disable or mute via UI chip.
- **Music**: `SONG_CONFIG` points to `assets/sounds/yes-song-placeholder.mp4`; replace with your track or set `enabled: false`.

## Randomness & Quality Rules
- Equal-weight random picks across enabled `EVENT_PROBABILITIES` entries.
- Session event bag reduces repeat fatigue and reshuffles after the enabled pool is used.
- `prefers-reduced-motion` respected; motion toggle provides manual control.
- All effects are reversible; YES is always reachable and never hidden.
- Narrator obeys cooldowns and never blocks controls; idle narrator triggers after inactivity.

## Events & Sequences
- Each event is a single function in `events.js` with doc comments covering trigger, effect, and reset.
- Variants are built into core events (Dodge, Text Change, Sad Theme, Screen Shake).
- New categories include narrator-driven beats, UI falling apart, screen cracks, emotional text, and more.
- Cinematic sequences E–H live in `sequences.js`:
  - `sequenceCountdownImage` (Countdown → Image Reveal)
  - `sequenceAlmostGone`
  - `sequenceYesTakesSpace`
  - `sequenceMemoryChoices`
- YES pipeline (A–E) runs on YES click:
  - `sequenceYesSongIntro`, `sequenceYesConfirmation`, `sequenceYesWorldOpens`, `sequenceYesNarratorClosure`, `sequenceYesMemoryMontage`.
- `showEventImage(imageId)` supplies the required fade/scale popup for countdown-related reveals.

## Sounds & Music
- Procedural Web Audio: wind loop, ticks, heartbeat, gusts, cello/drum hits, paper flutter, echo tone, filtered “scream,” YES chime.
- Music placeholder: `playYesSong('main')` loads `SONG_CONFIG.main`; falls back to a soft chord if unavailable.
- Sounds start only after first user interaction; mute state persists via `localStorage`.

## Deployment
- **Netlify**: Deploy the `valentine-site` folder. No build step needed.
- **GitHub Pages (Recommended)**:
  1. Push to `main`.
  2. In repo settings, set **Pages** source to **GitHub Actions**.
  3. Use `.github/workflows/deploy-pages.yml` (already included) to publish the `valentine-site` folder.
  4. Optional: keep `index.html` at repo root as a simple redirect for local/manual root hosting.
  5. `sw.js` caches core assets after first load for offline use.

## Accessibility Notes
- Semantic structure, aria-live regions (status + narrator), keyboard activation on buttons.
- Minimum ~52px hit targets; focus outlines preserved.
- Motion respect: `prefers-reduced-motion` plus in-page Effects toggle.
- Tone stays playful—no guilt, violence, or pressure; YES always accessible.

## How to Run Locally
- For the full experience, serve the `valentine-site` folder with a local static server (required for ES module scripts and service worker registration).
- If you open `valentine-site/index.html` via `file://`, the site will use a legacy fallback and show a warning banner.
