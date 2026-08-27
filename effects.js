// ===== EFFECTS — Візуальні анімації =====

var Effects = {
    rainDrops: [],
    fireParticles: [],
    catWaves: [],
    isRainFullscreen: false,
    
    // Ініціалізація
    init: function() {
        this.fireContainer = document.getElementById('fire-container');
        this.catContainer = document.getElementById('cat-container');
        this.rainFullscreen = document.getElementById('rain-fullscreen');
        this.rainDropsLayer = document.querySelector('.rain-drops-layer');
        this.rainCloseBtn = document.querySelector('.rain-close');
        this.bindRainEvents();
    },
    
    // Події для дощу
    bindRainEvents: function() {
        var self = this;
        
        // Закриття повноекранного дощу
        this.rainCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            self.closeRainFullscreen();
        });
        
        // Клік по фону закриває
        this.rainFullscreen.addEventListener('click', function() {
            self.closeRainFullscreen();
        });
    },
    
    // Відкрити повноекранний дощ
    openRainFullscreen: function() {
        this.isRainFullscreen = true;
        this.rainFullscreen.classList.add('active');
        this.createRealRainDrops();
        document.body.style.overflow = 'hidden';
    },
    
    // Закрити повноекранний дощ
    closeRainFullscreen: function() {
        this.isRainFullscreen = false;
        this.rainFullscreen.classList.remove('active');
        this.clearRealRainDrops();
        document.body.style.overflow = '';
    },
    
    // Створити реальні краплі дощу (м'якші)
    createRealRainDrops: function() {
        this.clearRealRainDrops();
        
        for (var i = 0; i < 60; i++) {
            this.createRealDrop();
        }
    },
    
    createRealDrop: function() {
        var drop = document.createElement('div');
        drop.className = 'rain-drop-real';
        
        var x = Math.random() * 100;
        var delay = Math.random() * 4;
        var duration = 0.8 + Math.random() * 0.6;
        var height = 10 + Math.random() * 15;
        
        drop.style.left = x + '%';
        drop.style.height = height + 'px';
        drop.style.animationDelay = delay + 's';
        drop.style.animationDuration = duration + 's';
        
        this.rainDropsLayer.appendChild(drop);
        this.rainDrops.push(drop);
    },
    
    clearRealRainDrops: function() {
        this.rainDrops.forEach(function(drop) {
            if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
            }
        });
        this.rainDrops = [];
    },
    
    // ===== ВОГОНЬ =====
    startFire: function() {
        if (this.fireParticles.length > 0) return;
        
        this.fireContainer.classList.add('active');
        
        for (var i = 0; i < 30; i++) {
            this.createFireParticle();
        }
    },
    
    stopFire: function() {
        this.fireContainer.classList.remove('active');
        
        this.fireParticles.forEach(function(particle) {
            if (particle.element && particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        });
        this.fireParticles = [];
    },
    
    createFireParticle: function() {
        var particle = document.createElement('div');
        particle.className = 'fire-particle';
        
        var x = 10 + Math.random() * 80;
        var size = 10 + Math.random() * 30;
        var delay = Math.random() * 2;
        var duration = 1 + Math.random() * 2;
        
        particle.style.left = x + '%';
        particle.style.width = size + 'px';
        particle.style.height = size * 1.5 + 'px';
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = duration + 's';
        
        this.fireContainer.appendChild(particle);
        this.fireParticles.push({ element: particle });
    },
    
    // ===== КІТ =====
    startCat: function() {
        if (this.catWaves.length > 0) return;
        
        this.catContainer.classList.add('active');
        
        for (var i = 0; i < 5; i++) {
            this.createCatWave(i);
        }
    },
    
    stopCat: function() {
        this.catContainer.classList.remove('active');
        
        this.catWaves.forEach(function(wave) {
            if (wave.element && wave.element.parentNode) {
                wave.element.parentNode.removeChild(wave.element);
            }
        });
        this.catWaves = [];
    },
    
    createCatWave: function(index) {
        var wave = document.createElement('div');
        wave.className = 'cat-wave';
        
        var delay = index * 0.5;
        wave.style.animationDelay = delay + 's';
        
        this.catContainer.appendChild(wave);
        this.catWaves.push({ element: wave });
    },
    
    // ===== УПРАВЛІННЯ =====
    toggleEffect: function(name, active) {
        switch(name) {
            case 'rain':
                if (active) this.openRainFullscreen();
                else this.closeRainFullscreen();
                break;
            case 'fire':
                if (active) this.startFire();
                else this.stopFire();
                break;
            case 'cat':
                if (active) this.startCat();
                else this.stopCat();
                break;
        }
    },
    
    stopAll: function() {
        this.closeRainFullscreen();
        this.stopFire();
        this.stopCat();
    }
};
