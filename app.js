// ===== APP — Головний файл =====

var App = {
    // Стан звуків
    activeSounds: {
        rain: false,
        fire: false,
        cat: false,
        whitenoise: false
    },
    
    // Ініціалізація
    init: function() {
        // Чекаємо на клік для ініціалізації AudioContext
        var self = this;
        document.addEventListener('click', function initAudio() {
            Sounds.init();
            document.removeEventListener('click', initAudio);
        }, { once: true });
        
        Effects.init();
        Timer.init();
        this.bindSoundCards();
        this.loadState();
        
        // Запитуємо дозвіл на сповіщення
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    },
    
    // Прив'язка карток звуків
    bindSoundCards: function() {
        var self = this;
        
        document.querySelectorAll('.sound-card').forEach(function(card) {
            var soundName = card.getAttribute('data-sound');
            
            // Клік по картці
            card.addEventListener('click', function(e) {
                // Якщо клікнули на слайдер — не перемикаємо
                if (e.target.classList.contains('slider')) return;
                
                self.toggleSound(soundName);
            });
            
            // Слайдер гучності
            var slider = card.querySelector('.slider');
            if (slider) {
                slider.addEventListener('input', function() {
                    var volume = parseInt(this.value);
                    Sounds.setVolume(soundName, volume);
                    self.saveState();
                });
            }
        });
    },
    
    // Перемикання звуку
    toggleSound: function(name) {
        // Ініціалізуємо AudioContext якщо потрібно
        if (!Sounds.context) {
            Sounds.init();
        }
        
        // Відновлюємо AudioContext якщо потрібно
        if (Sounds.context.state === 'suspended') {
            Sounds.context.resume();
        }
        
        this.activeSounds[name] = !this.activeSounds[name];
        
        // Оновлюємо UI
        var card = document.querySelector('.sound-card[data-sound="' + name + '"]');
        if (this.activeSounds[name]) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
        
        // Запускаємо/зупиняємо звук
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
        
        // Анімації фону
        Effects.toggleEffect(name, this.activeSounds[name]);
        
        // Зберігаємо стан
        this.saveState();
    },
    
    // Збереження стану
    saveState: function() {
        var state = {
            activeSounds: this.activeSounds,
            volumes: {}
        };
        
        document.querySelectorAll('.sound-card').forEach(function(card) {
            var name = card.getAttribute('data-sound');
            var slider = card.querySelector('.slider');
            if (slider) {
                state.volumes[name] = parseInt(slider.value);
            }
        });
        
        localStorage.setItem('zenHub_state', JSON.stringify(state));
    },
    
    // Завантаження стану
    loadState: function() {
        var data = localStorage.getItem('zenHub_state');
        if (!data) return;
        
        try {
            var state = JSON.parse(data);
            
            // Відновлюємо гучність
            if (state.volumes) {
                for (var name in state.volumes) {
                    var card = document.querySelector('.sound-card[data-sound="' + name + '"]');
                    if (card) {
                        var slider = card.querySelector('.slider');
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

// Запуск при завантаженні
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
