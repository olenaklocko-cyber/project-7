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
    
    // Запуск звуку дощу
    playRain: function() {
        if (this.sounds.rain) return;
        
        var noiseBuffer = this.createWhiteNoiseBuffer();
        var source = this.context.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        
        // Фільтр для звуку дощу
        var bandpass = this.context.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1000;
        bandpass.Q.value = 0.5;
        
        // Додатковий високочастотний фільтр
        var highpass = this.context.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 500;
        
        // Підсилення
        var gainNode = this.context.createGain();
        gainNode.gain.value = 0.3;
        
        source.connect(bandpass);
        bandpass.connect(highpass);
        highpass.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        source.start(0);
        
        this.sounds.rain = {
            source: source,
            gain: gainNode,
            filters: [bandpass, highpass]
        };
    },
    
    // Запуск звуку вогню
    playFire: function() {
        if (this.sounds.fire) return;
        
        var noiseBuffer = this.createWhiteNoiseBuffer();
        var source = this.context.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        
        // Фільтр для тріску вогню
        var lowpass = this.context.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 400;
        
        // Модуляція для тріску
        var lfo = this.context.createOscillator();
        var lfoGain = this.context.createGain();
        lfo.frequency.value = 3;
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain);
        lfoGain.connect(lowpass.frequency);
        lfo.start(0);
        
        // Підсилення
        var gainNode = this.context.createGain();
        gainNode.gain.value = 0.4;
        
        source.connect(lowpass);
        lowpass.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        source.start(0);
        
        this.sounds.fire = {
            source: source,
            gain: gainNode,
            lfo: lfo,
            filters: [lowpass]
        };
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
        
        if (sound.source) {
            sound.source.stop();
        }
        
        if (sound.oscillators) {
            sound.oscillators.forEach(function(osc) {
                osc.stop();
            });
        }
        
        if (sound.lfo) {
            sound.lfo.stop();
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
        this.sounds[name].gain.gain.setTargetAtTime(volume, this.context.currentTime, 0.1);
    },
    
    // Перевірка чи грає звук
    isPlaying: function(name) {
        return !!this.sounds[name];
    }
};
