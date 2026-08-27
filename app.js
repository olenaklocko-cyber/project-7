// ===== APP — Головний файл =====

var App = {
    activeSounds: {
        rain: false,
        fire: false,
        cat: false,
        whitenoise: false
    },
    
    init: function() {
        var self = this;
        
        document.addEventListener('click', function initAudio() {
            Sounds.init();
            document.removeEventListener('click', initAudio);
        }, { once: true });
        
        Effects.init();
        Timer.init();
        this.bindSoundColumns();
        this.loadState();
        
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    },
    
    bindSoundColumns: function() {
        var self = this;
        
        document.querySelectorAll('.sound-column').forEach(function(column) {
            var soundName = column.getAttribute('data-sound');
            
            column.addEventListener('click', function(e) {
                if (e.target.classList.contains('slider')) return;
                
                // Для дощу — не закриваємо при кліку по картці
                if (soundName === 'rain') {
                    self.toggleSound('rain');
                    return;
                }
                
                self.toggleSound(soundName);
            });
            
            var slider = column.querySelector('.slider');
            if (slider) {
                slider.addEventListener('input', function() {
                    var volume = parseInt(this.value);
                    Sounds.setVolume(soundName, volume);
                    self.saveState();
                });
            }
        });
    },
    
    toggleSound: function(name) {
        if (!Sounds.context) {
            Sounds.init();
        }
        
        if (Sounds.context.state === 'suspended') {
            Sounds.context.resume();
        }
        
        this.activeSounds[name] = !this.activeSounds[name];
        
        var column = document.querySelector('.sound-column[data-sound="' + name + '"]');
        if (this.activeSounds[name]) {
            column.classList.add('active');
        } else {
            column.classList.remove('active');
        }
        
        if (this.activeSounds[name]) {
            switch(name) {
                case 'rain': Sounds.playRain(); break;
                case 'fire': Sounds.playFire(); break;
                case 'cat': Sounds.playCat(); break;
                case 'whitenoise': Sounds.playWhiteNoise(); break;
            }
        } else {
            Sounds.stopSound(name);
        }
        
        Effects.toggleEffect(name, this.activeSounds[name]);
        this.saveState();
    },
    
    saveState: function() {
        var state = {
            activeSounds: this.activeSounds,
            volumes: {}
        };
        
        document.querySelectorAll('.sound-column').forEach(function(column) {
            var name = column.getAttribute('data-sound');
            var slider = column.querySelector('.slider');
            if (slider) {
                state.volumes[name] = parseInt(slider.value);
            }
        });
        
        localStorage.setItem('zenHub_state', JSON.stringify(state));
    },
    
    loadState: function() {
        var data = localStorage.getItem('zenHub_state');
        if (!data) return;
        
        try {
            var state = JSON.parse(data);
            
            if (state.volumes) {
                for (var name in state.volumes) {
                    var column = document.querySelector('.sound-column[data-sound="' + name + '"]');
                    if (column) {
                        var slider = column.querySelector('.slider');
                        if (slider) {
                            slider.value = state.volumes[name];
                        }
                    }
                }
            }
        } catch(e) {
            console.log('Помилка завантаження стану');
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
