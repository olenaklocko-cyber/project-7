// ===== EFFECTS — Візуальні анімації =====

var Effects = {
    rainDrops: [],
    fireParticles: [],
    catWaves: [],
    
    // Ініціалізація
    init: function() {
        this.rainContainer = document.getElementById('rain-container');
        this.fireContainer = document.getElementById('fire-container');
        this.catContainer = document.getElementById('cat-container');
    },
    
    // ===== ДОЩ =====
    startRain: function() {
        if (this.rainDrops.length > 0) return;
        
        this.rainContainer.classList.add('active');
        
        // Створюємо краплі
        for (var i = 0; i < 100; i++) {
            this.createRaindrop();
        }
    },
    
    stopRain: function() {
        this.rainContainer.classList.remove('active');
        
        // Видаляємо краплі
        this.rainDrops.forEach(function(drop) {
            if (drop.element && drop.element.parentNode) {
                drop.element.parentNode.removeChild(drop.element);
            }
        });
        this.rainDrops = [];
    },
    
    createRaindrop: function() {
        var drop = document.createElement('div');
        drop.className = 'raindrop';
        
        var x = Math.random() * 100;
        var delay = Math.random() * 2;
        var duration = 0.5 + Math.random() * 0.5;
        
        drop.style.left = x + '%';
        drop.style.animationDelay = delay + 's';
        drop.style.animationDuration = duration + 's';
        
        this.rainContainer.appendChild(drop);
        this.rainDrops.push({ element: drop });
    },
    
    // ===== ВОГОНЬ =====
    startFire: function() {
        if (this.fireParticles.length > 0) return;
        
        this.fireContainer.classList.add('active');
        
        // Створюємо полум'я
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
        
        // Створюємо пухнасті хвилі
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
                if (active) this.startRain();
                else this.stopRain();
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
    
    // Зупинка всіх ефектів
    stopAll: function() {
        this.stopRain();
        this.stopFire();
        this.stopCat();
    }
};
