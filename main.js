// AOT-themed Valentine interactions for Ryl
// Random event logic and Web Audio sound design are documented inline.

(() => {
    const els = {
        yes: document.getElementById('yesBtn'),
        no: document.getElementById('noBtn'),
        cta: document.getElementById('cta'),
        status: document.getElementById('status'),
        subtext: document.getElementById('subtext'),
        overlay: document.getElementById('overlayMessage'),
        countdownBar: document.getElementById('countdownBar'),
        countdownText: document.getElementById('countdownText'),
        confetti: document.getElementById('confettiLayer'),
        titan: document.getElementById('titanEvent'),
        shell: document.getElementById('shell'),
        celebration: document.getElementById('celebrationCard'),
        prompt: document.getElementById('promptCard'),
        heartField: document.getElementById('heartField'),
        muteToggle: document.getElementById('muteToggle'),
        motionToggle: document.getElementById('motionToggle'),
        fog: document.querySelector('.fog-layer'),
        ash: document.querySelector('.ash-layer'),
        body: document.body,
    };

    const messages = {
        textChanges: ["Are you sure? 🥺", "Think again…", "Some choices matter yessir 💗"],
        overlays: ["Think about it", "Really sure?", "One more chance?"],
    };

    const state = {
        lastEvent: null,
        cooldowns: { titan: 0, sad: 0 },
        hasInteracted: false,
        motionReduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        muted: localStorage.getItem('aot-valentine-muted') === 'true',
        theme: 'default',
        avoidanceActive: false,
    };

    /* ---------------- Audio Engine (procedural Web Audio) ---------------- */
    // Sounds start only after first interaction; all tones are synthesized (no external files).
    const audio = (() => {
        let ctx;
        let master;
        let windSource;
        let windTimer;

        const ensure = () => {
            if (ctx) return;
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            master = ctx.createGain();
            master.gain.value = state.muted ? 0 : 0.18;
            master.connect(ctx.destination);
            startWind();
        };

        const makeGain = (value) => {
            const g = ctx.createGain();
            g.gain.value = value;
            return g;
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

            // Gentle movement of the filter to keep wind alive
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
            if (!master) return;
            master.gain.setTargetAtTime(muted ? 0 : 0.18, ctx.currentTime, 0.1);
        };

        return {
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
            stopWind,
        };
    })();

    /* ---------------- Interaction Helpers ---------------- */
    const markInteracted = () => {
        if (state.hasInteracted) return;
        state.hasInteracted = true;
        audio.ensure();
    };

    const setMuted = (muted) => {
        state.muted = muted;
        localStorage.setItem('aot-valentine-muted', muted ? 'true' : 'false');
        audio.setMuted(muted);
        els.muteToggle.textContent = muted ? '🔇 Muted' : '🔈 Sound on';
        els.muteToggle.setAttribute('aria-pressed', String(!muted));
    };

    const toggleMotion = () => {
        state.motionReduced = !state.motionReduced;
        els.body.classList.toggle('reduce-motion', state.motionReduced);
        els.motionToggle.textContent = state.motionReduced ? '🌙 Soft mode' : '✨ Effects on';
        els.motionToggle.setAttribute('aria-pressed', String(!state.motionReduced));
    };

    const setStatus = (text) => {
        els.status.textContent = text || '';
    };

    const showOverlay = (text, duration = 1500) => {
        els.overlay.textContent = text;
        els.overlay.classList.add('active');
        setTimeout(() => els.overlay.classList.remove('active'), duration);
    };

    const runCountdown = () => {
        els.countdownBar.classList.add('active');
        els.countdownText.textContent = 'Deciding in 3…';
        setTimeout(() => { els.countdownText.textContent = '2…'; }, 500);
        setTimeout(() => { els.countdownText.textContent = '1…'; }, 1000);
        setTimeout(() => {
            els.countdownBar.classList.remove('active');
            els.countdownText.textContent = '';
        }, 1500);
    };

    const setTheme = (theme) => {
        state.theme = theme;
        if (theme === 'sad') {
            els.body.classList.add('sad');
            els.fog.classList.add('sad');
            els.ash.classList.add('sad');
        } else if (theme === 'happy') {
            els.body.classList.remove('sad');
            els.body.classList.add('happy');
            els.fog.classList.remove('sad');
            els.ash.classList.remove('sad');
        } else {
            els.body.classList.remove('sad', 'happy');
            els.fog.classList.remove('sad');
            els.ash.classList.remove('sad');
        }
    };

    /* ---------------- Random Event Logic ---------------- */
    // Event pool covers all required behaviors; last event is skipped to avoid immediate repeats.
    const baseEvents = [
        'dodge', 'shrink', 'growYes', 'swap', 'fakeDisable',
        'becomeYes', 'avoid', 'textChange', 'overlay',
        'countdown', 'yesGlow', 'heartbeat', 'sad', 'shake', 'confetti',
    ];

    const pickEvent = () => {
        const now = Date.now();
        if (Math.random() < 0.05 && now > state.cooldowns.titan) return 'titan';
        const pool = baseEvents.filter((e) => e !== state.lastEvent && !(e === 'sad' && now < state.cooldowns.sad));
        const choice = pool[Math.floor(Math.random() * pool.length)];
        return choice || baseEvents[0];
    };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const events = {
        dodge() {
            const rect = els.no.getBoundingClientRect();
            const maxX = window.innerWidth * 0.4;
            const maxY = window.innerHeight * 0.25;
            const dx = (Math.random() - 0.5) * 2 * maxX;
            const dy = (Math.random() - 0.5) * 2 * maxY;
            const safeDx = clamp(dx, -maxX, maxX);
            const safeDy = clamp(dy, -maxY, maxY);
            els.no.style.transform = `translate(${safeDx}px, ${safeDy}px)`;
            els.no.classList.add('avoid');
            audio.gust();
            setTimeout(() => {
                els.no.style.transform = 'translate(0, 0)';
            }, 1500);
        },
        shrink() {
            els.no.classList.add('shrink');
            audio.paper();
            setTimeout(() => els.no.classList.remove('shrink'), 1800);
        },
        growYes() {
            els.yes.classList.add('grow');
            audio.tick();
            setTimeout(() => els.yes.classList.remove('grow'), 1200);
        },
        swap() {
            els.cta.classList.add('swap');
            audio.tick();
            setTimeout(() => els.cta.classList.remove('swap'), 3500);
        },
        fakeDisable() {
            const original = els.no.textContent;
            els.no.textContent = '…';
            els.no.disabled = true;
            els.no.classList.add('disabled');
            audio.echo();
            setTimeout(() => {
                els.no.disabled = false;
                els.no.classList.remove('disabled');
                els.no.textContent = original;
            }, 1500);
        },
        becomeYes() {
            const original = els.no.textContent;
            els.no.textContent = 'Yes?';
            audio.tick();
            setTimeout(() => { els.no.textContent = original; }, 1800);
        },
        avoid() {
            state.avoidanceActive = true;
            audio.paper();
            setTimeout(() => { state.avoidanceActive = false; }, 1400);
        },
        textChange() {
            const next = messages.textChanges[Math.floor(Math.random() * messages.textChanges.length)];
            const original = els.subtext.textContent;
            els.subtext.textContent = next;
            audio.echo();
            setTimeout(() => { els.subtext.textContent = original; }, 2200);
        },
        overlay() {
            const msg = messages.overlays[Math.floor(Math.random() * messages.overlays.length)];
            showOverlay(msg, 1800);
            audio.heartbeat();
        },
        countdown() {
            runCountdown();
            audio.tick();
        },
        yesGlow() {
            els.yes.classList.add('glow');
            setTimeout(() => els.yes.classList.remove('glow'), 2400);
            audio.echo();
        },
        heartbeat() {
            els.shell.classList.add('heartbeat');
            setTimeout(() => els.shell.classList.remove('heartbeat'), 700);
            audio.heartbeat();
        },
        sad() {
            setTheme('sad');
            state.cooldowns.sad = Date.now() + 12000;
            audio.cello();
            setTimeout(() => setTheme('default'), 6000);
        },
        shake() {
            if (state.motionReduced) return;
            els.shell.classList.add('shake');
            audio.drum();
            setTimeout(() => els.shell.classList.remove('shake'), 650);
        },
        confetti() {
            spawnConfetti(14, true);
            audio.paper();
        },
        titan() {
            state.cooldowns.titan = Date.now() + 20000;
            els.titan.classList.add('active');
            audio.cello();
            audio.drum();
            audio.scream();
            setTimeout(() => {
                els.titan.classList.remove('active');
            }, 2600);
        },
    };

    const triggerRandomEvent = () => {
        const eventId = pickEvent();
        state.lastEvent = eventId;
        events[eventId]();
        setStatus(`Event: ${eventId.replace(/([A-Z])/g, ' $1')}`);
    };

    /* ---------------- Confetti & Hearts ---------------- */
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

    /* ---------------- Interaction Wiring ---------------- */
    const handleYes = () => {
        // Warm celebration state; stop playful prompts and show floating hearts.
        markInteracted();
        audio.yesChime();
        setTheme('happy');
        els.prompt.hidden = true;
        els.celebration.hidden = false;
        spawnHearts();
        spawnConfetti(28, false);
        els.no.disabled = true;
        setStatus('Thank you, Ryl ❤️');
    };

    const handleNo = () => {
        markInteracted();
        triggerRandomEvent();
    };

    const handleAvoidanceMove = (e) => {
        // Slide the NO button away from the pointer/touch while avoidance is active.
        if (!state.avoidanceActive) return;
        const rect = els.no.getBoundingClientRect();
        const dx = rect.x + rect.width / 2 - e.clientX;
        const dy = rect.y + rect.height / 2 - e.clientY;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
            const factor = 120 / (dist + 1);
            const moveX = clamp(dx * factor, -160, 160);
            const moveY = clamp(dy * factor, -120, 120);
            els.no.style.transform = `translate(${moveX}px, ${moveY}px)`;
            setTimeout(() => { els.no.style.transform = 'translate(0,0)'; }, 900);
        }
    };

    const initToggles = () => {
        els.muteToggle.addEventListener('click', () => {
            markInteracted();
            setMuted(!state.muted);
        });
        els.motionToggle.addEventListener('click', () => {
            toggleMotion();
        });
        setMuted(state.muted); // initialize labels
        if (state.motionReduced) {
            els.body.classList.add('reduce-motion');
            els.motionToggle.textContent = '🌙 Soft mode';
            els.motionToggle.setAttribute('aria-pressed', 'false');
        } else {
            els.motionToggle.setAttribute('aria-pressed', 'true');
        }
    };

    const initAccessibility = () => {
        // allow keyboard activation
        [els.yes, els.no].forEach((btn) => {
            btn.addEventListener('keyup', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    };

    const addButtonTicks = () => {
        document.querySelectorAll('.btn').forEach((btn) => {
            btn.addEventListener('pointerdown', () => {
                markInteracted();
                audio.tick();
            });
        });
    };

    const init = () => {
        els.yes.addEventListener('click', handleYes);
        els.no.addEventListener('click', handleNo);
        document.addEventListener('pointermove', handleAvoidanceMove);
        document.addEventListener('touchmove', handleAvoidanceMove);
        initToggles();
        initAccessibility();
        addButtonTicks();
    };

    init();
})();
