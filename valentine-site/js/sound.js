// sound.js - procedural Web Audio graph
import { SOUND_CONFIG, SONG_CONFIG } from './config.js';

export const MusicPlayer = (() => {
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

export function createSoundEngine(state) {
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
