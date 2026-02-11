// config.js
// Central configuration for copy, colors, timing, probabilities, audio, and narrator behavior.

// TEXT_CONFIG controls all on-screen copy.
export const TEXT_CONFIG = {
  headline: "Ryl, will you be my Valentine? ðŸ’Œ", // Main question text.
  subtext: "click yes for an amazing amazing surprise!", // Supportive line under the question.
  overlays: ["That hurt a little ðŸ’”", "yeowch ðŸ˜”", "Nooooo"], // Short overlay toasts.
  textChanges: ["Are you sure? ðŸ¥º", "Think againâ€¦", "Some choices matter ðŸ’—", "There might be a surprise"], // Temporary subtext swaps.
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
export const NARRATOR_CONFIG = {
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
  noEarly: ["Interesting.", "I'll give you another chance to click yes.", "WOW", "Erm.", "Misclick?"], // NO clicks 1â€“2.
  noMid: ["Hmmmm.", "Narrator: She decides to click yes.", "Stop spamming no.", "Doesnt the big red button look inviting?"], // NO clicks 3â€“6.
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
    eventUIFragment: ["Weâ€™ll fix that."],
    eventScreenCrackHeal: ["That might be cosmetic."],
  }, // Optional narrator lines keyed by event name.
  yesPre: ["Finally.", "That felt final.", "Everything aligns."], // Narrator before YES flow.
  yesDuring: ["Stability restored.", "This is the good ending.", "The system approves."], // During YES sequences.
  yesAfter: ["Amazing.", "Correct build achieved.", "Happy paths are underrated."], // After final state.
};

// COLOR_CONFIG collects theme colors used by JS-driven effects.
export const COLOR_CONFIG = {
  defaultBg: "#1c1f26", // Base background color.
  sadBg: "#0f141a", // Background used during sad mode.
  happyStart: "#5b1f1f", // Happy gradient start.
  happyEnd: "#c94b4b", // Happy gradient end.
  beam: "rgba(255,255,255,0.14)", // Light beam color.
};

// ANIMATION_CONFIG centralizes timing and scale values.
export const ANIMATION_CONFIG = {
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
export const EVENT_UI_CONFIG = {
  textChangeDurationMs: 8000,
  dodgeDurationMs: 7000,
  dodgeClicksMin: 4,
  dodgeClicksMax: 6,
  sadShiftMinMs: 7000,
  sadShiftMaxMs: 10000,
  sadEmoji: ['ðŸ˜ž', 'ðŸ˜”', 'ðŸ˜¢', 'ðŸ¥€', 'ðŸ’”'],
  sadEmojiCount: 10,
  sadEmojiDurationMs: 3000,
  gravityDropDurationMs: 700,
  gravityHoldMs: 1200,
  gravityReturnMs: 600,
  eventBagMaxDeferrals: 6,
};

// EVENT_NAMES provides the canonical pool for equal-probability random picks.
export const EVENT_NAMES = [
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
export const EVENT_PROBABILITIES = {
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
export const SOUND_CONFIG = {
  enabled: true, // Master enable/disable for all procedural sounds.
  defaultVolume: 0.18, // Master gain value.
};

// SONG_CONFIG controls YES song playback.
export const SONG_CONFIG = {
  enabled: true, // Toggle music playback for YES sequences.
  main: "assets/sounds/yes-song-placeholder.mp4", // Placeholder audio path; replace with your song.
};

// VIDEO_CONFIG controls YES-page video playback.
export const VIDEO_CONFIG = {
  yesPageSrc: "./assets/videos/YesVid.mp4",
  yesAutoplay: true,
  yesLoop: true,
  yesMuted: true,
};

// IMAGE_CONFIG lists placeholder assets.
export const IMAGE_CONFIG = {
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


