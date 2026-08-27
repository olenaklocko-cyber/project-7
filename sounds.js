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
        audio.volume = 0.9;
        
        audio.play().then(function() {
            self.sounds.fire = {
                audio: audio
            };
        }).catch(function(e) {
            console.log('Помилка відтворення вогню:', e);
        });
    },
    
    // Запуск звуку кота (мурчання)
    playCat: function() {
        if (this.sounds.cat) return;
        
        // Основний тон мурчання
        var osc1 = this.context.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = 25;
        
        var osc2 = this.context.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 50;
        
        // Модуляція амплітуди для пульсації
        var lfo = this.context.createOscillator();
        var lfoGain = this.context.createGain();
        lfo.frequency.value = 4;
        lfoGain.gain.value = 0.3;
        lfo.connect(lfoGain);
        
        // Підсилення
        var gainNode = this.context.createGain();
        gainNode.gain.value = 0.15;
        
        lfoGain.connect(gainNode.gain);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        osc1.start(0);
        osc2.start(0);
        lfo.start(0);
        
        this.sounds.cat = {
            oscillators: [osc1, osc2],
            gain: gainNode,
            lfo: lfo
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
        
        if (this.sounds[name].audio) {
            this.sounds[name].audio.volume = volume;
        }
        
        if (this.sounds[name].gain) {
            this.sounds[name].gain.gain.setTargetAtTime(volume, this.context.currentTime, 0.1);
        }
    },
    
    // Перевірка чи грає звук
    isPlaying: function(name) {
        return !!this.sounds[name];
    }
};
