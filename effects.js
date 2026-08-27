// ===== EFFECTS — Візуальні анімації =====

var Effects = {
    rainDrops: [],
    fireParticles: [],
    fireSparks: [],
    catWaves: [],
    isRainFullscreen: false,
    isFireFullscreen: false,
    isCatFullscreen: false,
    
    // Ініціалізація
    init: function() {
        this.fireContainer = document.getElementById('fire-container');
        this.catContainer = document.getElementById('cat-container');
        this.rainFullscreen = document.getElementById('rain-fullscreen');
        this.rainDropsLayer = document.querySelector('.rain-drops-layer');
        this.rainCloseBtn = document.querySelector('.rain-close');
        this.fireFullscreen = document.getElementById('fire-fullscreen');
        this.fireSparksLayer = document.querySelector('.fire-sparks-layer');
        this.fireCloseBtn = document.querySelector('.fire-close');
        this.catFullscreen = document.getElementById('cat-fullscreen');
        this.catCloseBtn = document.querySelector('.cat-close');
        this.bindEvents();
    },
    
    // Події
    bindEvents: function() {
        var self = this;
        
        this.rainCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            self.closeRainFullscreen();
        });
        
        this.rainFullscreen.addEventListener('click', function() {
            self.closeRainFullscreen();
        });
        
        this.fireCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            self.closeFireFullscreen();
        });
        
        this.fireFullscreen.addEventListener('click', function() {
            self.closeFireFullscreen();
        });
        
        this.catCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            self.closeCatFullscreen();
        });
        
        this.catFullscreen.addEventListener('click', function() {
            self.closeCatFullscreen();
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
    
    // ===== ПОВНОЕКРАННИЙ ВОГОНЬ =====
    openFireFullscreen: function() {
        this.isFireFullscreen = true;
        this.fireFullscreen.classList.add('active');
        this.createFireSparks();
        document.body.style.overflow = 'hidden';
    },
    
    closeFireFullscreen: function() {
        this.isFireFullscreen = false;
        this.fireFullscreen.classList.remove('active');
        this.clearFireSparks();
        document.body.style.overflow = '';
    },
    
    createFireSparks: function() {
        this.clearFireSparks();
        
        for (var i = 0; i < 40; i++) {
            this.createSpark();
        }
    },
    
    createSpark: function() {
        var spark = document.createElement('div');
        spark.className = 'fire-spark';
        
        var x = 30 + Math.random() * 40;
        var delay = Math.random() * 3;
        var duration = 1.5 + Math.random() * 2;
        var drift = (Math.random() - 0.5) * 100;
        
        spark.style.left = x + '%';
        spark.style.animationDelay = delay + 's';
        spark.style.animationDuration = duration + 's';
        spark.style.setProperty('--drift', drift + 'px');
        
        this.fireSparksLayer.appendChild(spark);
        this.fireSparks.push(spark);
    },
    
    clearFireSparks: function() {
        this.fireSparks.forEach(function(spark) {
            if (spark.parentNode) {
                spark.parentNode.removeChild(spark);
            }
        });
        this.fireSparks = [];
    },
    
    // ===== ПОВНОЕКРАННИЙ КІТ =====
    openCatFullscreen: function() {
        this.isCatFullscreen = true;
        this.catFullscreen.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    closeCatFullscreen: function() {
        this.isCatFullscreen = false;
        this.catFullscreen.classList.remove('active');
        document.body.style.overflow = '';
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
                if (active) this.openFireFullscreen();
                else this.closeFireFullscreen();
                break;
            case 'cat':
                if (active) this.openCatFullscreen();
                else this.closeCatFullscreen();
                break;
        }
    },
    
    stopAll: function() {
        this.closeRainFullscreen();
        this.closeFireFullscreen();
        this.closeCatFullscreen();
    }
};
