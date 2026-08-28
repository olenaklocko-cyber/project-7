// ===== SOUNDS — Web Audio API =====

var Sounds = {
    context: null,
    sounds: {},
    
    // Ініціалізація
    init: function() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
    },
    
    // Запуск звуку дощу (Web Audio API)
    playRain: function() {
        if (this.sounds.rain) return;
        this.init();
        
        // Створюємо шумовий буфер
        var bufferSize = 2 * this.context.sampleRate;
        var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        var output = buffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        var source = this.context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        var filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        
        var gain = this.context.createGain();
        gain.gain.value = 0.25;
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.context.destination);
        
        source.start(0);
        
        this.sounds.rain = { source: source, gain: gain };
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
    
    // Запуск білого шуму (Web Audio API)
    playWhiteNoise: function() {
        if (this.sounds.whitenoise) return;
        this.init();
        
        // Створюємо шумовий буфер
        var bufferSize = 2 * this.context.sampleRate;
        var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        var output = buffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        var source = this.context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        var filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 3000;
        
        var gain = this.context.createGain();
        gain.gain.value = 0.2;
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.context.destination);
        
        source.start(0);
        
        this.sounds.whitenoise = { source: source, gain: gain };
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
