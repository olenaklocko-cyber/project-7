// ===== SOUNDS — Web Audio API =====

var Sounds = {
    context: null,
    sounds: {},
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || ('ontouchstart' in window),
    
    // Ініціалізація
    init: function() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
    },
    
    // Запуск звуку дощу
    playRain: function() {
        if (this.sounds.rain) return;
        
        var self = this;
        
        // На мобільних використовуємо OGG
        if (this.isMobile) {
            var audio = new Audio('sounds/rain.ogg');
            audio.loop = true;
            audio.volume = 0.5;
            
            audio.play().then(function() {
                self.sounds.rain = { audio: audio };
            }).catch(function(e) {
                console.log('Помилка дощу:', e);
                self.playRainWebAudio();
            });
        } else {
            this.playRainWebAudio();
        }
    },
    
    // Web Audio API версія для дощу (для комп'ютерів)
    playRainWebAudio: function() {
        if (this.sounds.rain) return;
        this.init();
        
        var noiseBuffer = this.createNoiseBuffer();
        var source = this.context.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        
        var lowpass = this.context.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 500;
        lowpass.Q.value = 0.5;
        
        var bandpass = this.context.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1800;
        bandpass.Q.value = 0.3;
        
        var highshelf = this.context.createBiquadFilter();
        highshelf.type = 'highshelf';
        highshelf.frequency.value = 4000;
        highshelf.gain.value = -12;
        
        var lfo = this.context.createOscillator();
        var lfoGain = this.context.createGain();
        lfo.frequency.value = 0.15;
        lfoGain.gain.value = 80;
        lfo.connect(lfoGain);
        lfoGain.connect(lowpass.frequency);
        lfo.start(0);
        
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
    
    // Створення шумового буферу
    createNoiseBuffer: function() {
        var bufferSize = 2 * this.context.sampleRate;
        var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        var output = buffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        return buffer;
    },
    
    // Запуск звуку вогню (MP3)
    playFire: function() {
        if (this.sounds.fire) return;
        
        var self = this;
        var audio = new Audio('sounds/fire.mp3');
        audio.loop = true;
        audio.volume = 0.8;
        
        audio.play().then(function() {
            self.sounds.fire = { audio: audio };
        }).catch(function(e) {
            console.log('Помилка вогню:', e);
        });
    },
    
    // Запуск звуку кота (MP3)
    playCat: function() {
        if (this.sounds.cat) return;
        
        var self = this;
        var audio = new Audio('sounds/cat.mp3');
        audio.loop = true;
        audio.volume = 0.7;
        
        audio.play().then(function() {
            self.sounds.cat = { audio: audio };
        }).catch(function(e) {
            console.log('Помилка кота:', e);
        });
    },
    
    // Запуск білого шуму
    playWhiteNoise: function() {
        if (this.sounds.whitenoise) return;
        
        var self = this;
        
        // На мобільних використовуємо OGG
        if (this.isMobile) {
            var audio = new Audio('sounds/whitenoise.ogg');
            audio.loop = true;
            audio.volume = 0.4;
            
            audio.play().then(function() {
                self.sounds.whitenoise = { audio: audio };
            }).catch(function(e) {
                console.log('Помилка білого шуму:', e);
                self.playWhiteNoiseWebAudio();
            });
        } else {
            this.playWhiteNoiseWebAudio();
        }
    },
    
    // Web Audio API версія для білого шуму (для комп'ютерів)
    playWhiteNoiseWebAudio: function() {
        if (this.sounds.whitenoise) return;
        this.init();
        
        var noiseBuffer = this.createNoiseBuffer();
        var source = this.context.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        
        var lowpass = this.context.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 2000;
        lowpass.Q.value = 0.3;
        
        var highshelf = this.context.createBiquadFilter();
        highshelf.type = 'highshelf';
        highshelf.frequency.value = 3000;
        highshelf.gain.value = -8;
        
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
            try { sound.source.stop(); } catch(e) {}
        }
        
        if (sound.oscillators) {
            sound.oscillators.forEach(function(osc) {
                try { osc.stop(); } catch(e) {}
            });
        }
        
        if (sound.lfo) {
            if (Array.isArray(sound.lfo)) {
                sound.lfo.forEach(function(l) { try { l.stop(); } catch(e) {} });
            } else {
                try { sound.lfo.stop(); } catch(e) {}
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
        } else if (this.sounds[name].gain) {
            this.sounds[name].gain.gain.setTargetAtTime(volume, this.context.currentTime, 0.1);
        }
    },
    
    // Перевірка чи грає звук
    isPlaying: function(name) {
        return !!this.sounds[name];
    }
};
