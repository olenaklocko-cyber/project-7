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
    
    // Запуск звуку кота (реальний MP3)
    playCat: function() {
        if (this.sounds.cat) return;
        
        var self = this;
        var audio = new Audio('sounds/cat.mp3');
        audio.loop = true;
        
        // Підсилюємо через Web Audio API
        if (!this.context) this.init();
        
        var source = this.context.createMediaElementSource(audio);
        var gainNode = this.context.createGain();
        gainNode.gain.value = 1.2;
        
        source.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        audio.play().then(function() {
            self.sounds.cat = {
                audio: audio,
                gain: gainNode,
                source: source
            };
        }).catch(function(e) {
            console.log('Помилка відтворення кота:', e);
        });
    },
    
    // Запуск білого шуму (ніжний)
    playWhiteNoise: function() {
        if (this.sounds.whitenoise) return;
        
        var noiseBuffer = this.createWhiteNoiseBuffer();
        var source = this.context.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        
        // М'який фільтр — ніжний звук
        var lowpass = this.context.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 2000;
        lowpass.Q.value = 0.3;
        
        // Додатковий фільтр для м'якості
        var highshelf = this.context.createBiquadFilter();
        highshelf.type = 'highshelf';
        highshelf.frequency.value = 3000;
        highshelf.gain.value = -8;
        
        // Підсилення — тихе
        var gainNode = this.context.createGain();
        gainNode.gain.value = 0.15;
        
        source.connect(lowpass);
        lowpass.connect(highshelf);
        highshelf.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        source.start(0);
        
        this.sounds.whitenoise = {
            source: source,
            gain: gainNode,
            filters: [lowpass, highshelf]
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
            // Різне підсилення для різних звуків
            var multiplier = 1.0;
            if (name === 'fire') multiplier = 2.0;
            if (name === 'cat') multiplier = 1.2;
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
