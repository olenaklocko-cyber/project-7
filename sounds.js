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
    
    // Запуск звуку вогню (реалістичний тріск)
    playFire: function() {
        if (this.sounds.fire) return;
        
        var noiseBuffer = this.createWhiteNoiseBuffer();
        var source = this.context.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        
        // Низький гул полум'я
        var lowpass = this.context.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 250;
        lowpass.Q.value = 0.7;
        
        // Тріск дров — широкий діапазон
        var crackle1 = this.context.createBiquadFilter();
        crackle1.type = 'bandpass';
        crackle1.frequency.value = 800;
        crackle1.Q.value = 1.5;
        
        var crackle2 = this.context.createBiquadFilter();
        crackle2.type = 'bandpass';
        crackle2.frequency.value = 2000;
        crackle2.Q.value = 2;
        
        // Модуляція тріску — повільна
        var lfo1 = this.context.createOscillator();
        var lfo1Gain = this.context.createGain();
        lfo1.frequency.value = 0.5;
        lfo1Gain.gain.value = 400;
        lfo1.connect(lfo1Gain);
        lfo1Gain.connect(crackle1.frequency);
        lfo1.start(0);
        
        // Друга модуляція — швидша для тріску
        var lfo2 = this.context.createOscillator();
        var lfo2Gain = this.context.createGain();
        lfo2.frequency.value = 3;
        lfo2Gain.gain.value = 800;
        lfo2.connect(lfo2Gain);
        lfo2Gain.connect(crackle2.frequency);
        lfo2.start(0);
        
        // Підсилення
        var gainNode = this.context.createGain();
        gainNode.gain.value = 0.25;
        
        source.connect(lowpass);
        lowpass.connect(crackle1);
        crackle1.connect(crackle2);
        crackle2.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        source.start(0);
        
        this.sounds.fire = {
            source: source,
            gain: gainNode,
            lfo: [lfo1, lfo2],
            filters: [lowpass, crackle1, crackle2]
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
        this.sounds[name].gain.gain.setTargetAtTime(volume, this.context.currentTime, 0.1);
    },
    
    // Перевірка чи грає звук
    isPlaying: function(name) {
        return !!this.sounds[name];
    }
};
