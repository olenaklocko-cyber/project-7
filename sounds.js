// ===== SOUNDS — Web Audio API =====

var Sounds = {
    context: null,
    sounds: {},
    
    // Ініціалізація
    init: function() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
    },
    
    // Створення буфера білого шуму
    createWhiteNoiseBuffer: function() {
        var bufferSize = 2 * this.context.sampleRate;
        var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        var output = buffer.getChannelData(0);
        
        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        return buffer;
    },
    
    // Запуск звуку дощу (м'який літній дощ)
    playRain: function() {
        if (this.sounds.rain) return;
        
        var noiseBuffer = this.createWhiteNoiseBuffer();
        var source = this.context.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        
        // М'який низький фільтр — тихий дощик
        var lowpass = this.context.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 500;
        lowpass.Q.value = 0.5;
        
        // Середні частоти — краплі на листя
        var bandpass = this.context.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1800;
        bandpass.Q.value = 0.3;
        
        // Прибираємо високі — не шумить
        var highshelf = this.context.createBiquadFilter();
        highshelf.type = 'highshelf';
        highshelf.frequency.value = 4000;
        highshelf.gain.value = -12;
        
        // Повільна модуляція — плавність
        var lfo = this.context.createOscillator();
        var lfoGain = this.context.createGain();
        lfo.frequency.value = 0.15;
        lfoGain.gain.value = 80;
        lfo.connect(lfoGain);
        lfoGain.connect(lowpass.frequency);
        lfo.start(0);
        
        // Тихе підсилення
        var gainNode = this.context.createGain();
        gainNode.gain.value = 0.18;
        
        source.connect(lowpass);
        lowpass.connect(bandpass);
        bandpass.connect(highshelf);
        highshelf.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        source.start(0);
        
        this.sounds.rain = {
            source: source,
            gain: gainNode,
            lfo: lfo,
            filters: [lowpass, bandpass, highshelf]
        };
    },
    
    // Запуск звуку вогню (реальний MP3)
    playFire: function() {
        if (this.sounds.fire) return;
        
        var self = this;
        var audio = new Audio('sounds/fire.mp3');
        audio.loop = true;
        
        // Підсилюємо через Web Audio API (в 2 рази)
        if (!this.context) this.init();
        
        var source = this.context.createMediaElementSource(audio);
        var gainNode = this.context.createGain();
        gainNode.gain.value = 2.0;
        
        source.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        audio.play().then(function() {
            self.sounds.fire = {
                audio: audio,
                gain: gainNode,
                source: source
            };
        }).catch(function(e) {
            console.log('Помилка відтворення вогню:', e);
        });
    },
    
    // Запуск звуку кота (дуже реалістичне мурчання)
    playCat: function() {
        if (this.sounds.cat) return;
        
        if (!this.context) this.init();
        
        // === ОСНОВНІ ТОНИ МУРЧАННЯ ===
        
        // Головний тон (26 Гц — типове мурчання)
        var osc1 = this.context.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = 26;
        
        // Обертон (52 Гц)
        var osc2 = this.context.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 52;
        
        // Третій тон — текстура (39 Гц)
        var osc3 = this.context.createOscillator();
        osc3.type = 'triangle';
        osc3.frequency.value = 39;
        
        // Четвертий — повітря (78 Гц)
        var osc4 = this.context.createOscillator();
        osc4.type = 'sine';
        osc4.frequency.value = 78;
        
        // П'ятий — глибина (13 Гц — майже не чути, але відчувається)
        var osc5 = this.context.createOscillator();
        osc5.type = 'sine';
        osc5.frequency.value = 13;
        
        // === МОДУЛЯЦІЯ ===
        
        // Швидка пульсація (як дихання кота)
        var lfo1 = this.context.createOscillator();
        var lfo1Gain = this.context.createGain();
        lfo1.frequency.value = 2.8;
        lfo1Gain.gain.value = 0.6;
        lfo1.connect(lfo1Gain);
        
        // Повільна хвиля (настрій)
        var lfo2 = this.context.createOscillator();
        var lfo2Gain = this.context.createGain();
        lfo2.frequency.value = 0.7;
        lfo2Gain.gain.value = 0.3;
        lfo2.connect(lfo2Gain);
        
        // Дуже повільна — для реалістичності
        var lfo3 = this.context.createOscillator();
        var lfo3Gain = this.context.createGain();
        lfo3.frequency.value = 0.2;
        lfo3Gain.gain.value = 0.15;
        lfo3.connect(lfo3Gain);
        
        // === ПІДСИЛЕННЯ ===
        var gainNode = this.context.createGain();
        gainNode.gain.value = 1.0;
        
        lfo1Gain.connect(gainNode.gain);
        lfo2Gain.connect(gainNode.gain);
        lfo3Gain.connect(gainNode.gain);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        osc3.connect(gainNode);
        osc4.connect(gainNode);
        osc5.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        osc1.start(0);
        osc2.start(0);
        osc3.start(0);
        osc4.start(0);
        osc5.start(0);
        lfo1.start(0);
        lfo2.start(0);
        lfo3.start(0);
        
        this.sounds.cat = {
            oscillators: [osc1, osc2, osc3, osc4, osc5],
            gain: gainNode,
            lfo: [lfo1, lfo2, lfo3]
        };
    },
    
    // Запуск білого шуму
    playWhiteNoise: function() {
        if (this.sounds.whitenoise) return;
        
        var noiseBuffer = this.createWhiteNoiseBuffer();
        var source = this.context.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        
        // Низькочастотний фільтр для м'якості
        var lowpass = this.context.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 3000;
        
        // Підсилення
        var gainNode = this.context.createGain();
        gainNode.gain.value = 0.2;
        
        source.connect(lowpass);
        lowpass.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        source.start(0);
        
        this.sounds.whitenoise = {
            source: source,
            gain: gainNode,
            filters: [lowpass]
        };
    },
    
    // Зупинка звуку
    stopSound: function(name) {
        if (!this.sounds[name]) return;
        
        var sound = this.sounds[name];
        
        if (sound.audio) {
            sound.audio.pause();
            sound.audio.currentTime = 0;
        }
        
        if (sound.source) {
            sound.source.stop();
        }
        
        if (sound.oscillators) {
            sound.oscillators.forEach(function(osc) {
                osc.stop();
            });
        }
        
        if (sound.lfo) {
            if (Array.isArray(sound.lfo)) {
                sound.lfo.forEach(function(l) { l.stop(); });
            } else {
                sound.lfo.stop();
            }
        }
        
        delete this.sounds[name];
    },
    
    // Зупинка всіх звуків
    stopAll: function() {
        for (var name in this.sounds) {
            this.stopSound(name);
        }
    },
    
    // Встановлення гучності
    setVolume: function(name, value) {
        if (!this.sounds[name]) return;
        
        var volume = value / 100;
        
        if (this.sounds[name].gain) {
            // Для вогню — підсилюємо в 2 рази
            var multiplier = (name === 'fire') ? 2.0 : 1.0;
            this.sounds[name].gain.gain.setTargetAtTime(volume * multiplier, this.context.currentTime, 0.1);
        } else if (this.sounds[name].audio) {
            this.sounds[name].audio.volume = volume;
        }
    },
    
    // Перевірка чи грає звук
    isPlaying: function(name) {
        return !!this.sounds[name];
    }
};
