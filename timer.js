// ===== TIMER — Помодоро =====

var Timer = {
    duration: 25 * 60, // 25 хвилин у секундах
    remaining: 25 * 60,
    isRunning: false,
    interval: null,
    
    // Ініціалізація
    init: function() {
        this.bindEvents();
        this.updateDisplay();
        this.updateProgress();
    },
    
    // Прив'язка подій
    bindEvents: function() {
        var self = this;
        
        document.getElementById('btn-start').addEventListener('click', function() {
            self.start();
        });
        
        document.getElementById('btn-pause').addEventListener('click', function() {
            self.pause();
        });
        
        document.getElementById('btn-reset').addEventListener('click', function() {
            self.reset();
        });
        
        // Пресети
        document.querySelectorAll('.preset-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var minutes = parseInt(this.getAttribute('data-minutes'));
                self.setDuration(minutes);
                
                document.querySelectorAll('.preset-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    },
    
    // Старт
    start: function() {
        if (this.isRunning) return;
        
        // Відновлюємо AudioContext якщо потрібно
        if (Sounds.context && Sounds.context.state === 'suspended') {
            Sounds.context.resume();
        }
        
        this.isRunning = true;
        this.updateButtons();
        
        var self = this;
        this.interval = setInterval(function() {
            self.tick();
        }, 1000);
    },
    
    // Пауза
    pause: function() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.interval);
        this.updateButtons();
    },
    
    // Скидання
    reset: function() {
        this.pause();
        this.remaining = this.duration;
        this.updateDisplay();
        this.updateProgress();
    },
    
    // Тік
    tick: function() {
        if (this.remaining <= 0) {
            this.complete();
            return;
        }
        
        this.remaining--;
        this.updateDisplay();
        this.updateProgress();
    },
    
    // Завершення
    complete: function() {
        this.pause();
        
        // Спеціальний звуковий сигнал
        this.playNotificationSound();
        
        // Сповіщення
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Дзен-Хаб', {
                body: 'Час вийшов! Відпочинь трохи 🧘',
                icon: '🧘'
            });
        }
        
        // Повертаємо початковий час
        this.remaining = this.duration;
        this.updateDisplay();
        this.updateProgress();
    },
    
    // Звуковий сигнал
    playNotificationSound: function() {
        if (!Sounds.context) return;
        
        var osc = Sounds.context.createOscillator();
        var gain = Sounds.context.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 800;
        
        gain.gain.setValueAtTime(0.3, Sounds.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, Sounds.context.currentTime + 0.5);
        
        osc.connect(gain);
        gain.connect(Sounds.context.destination);
        
        osc.start();
        osc.stop(Sounds.context.currentTime + 0.5);
    },
    
    // Встановлення тривалості
    setDuration: function(minutes) {
        this.duration = minutes * 60;
        this.remaining = this.duration;
        this.updateDisplay();
        this.updateProgress();
    },
    
    // Оновлення дисплею
    updateDisplay: function() {
        var minutes = Math.floor(this.remaining / 60);
        var seconds = this.remaining % 60;
        
        var display = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        document.getElementById('timer-time').textContent = display;
        
        // Оновлюємо заголовок сторінки
        document.title = display + ' — Дзен-Хаб';
    },
    
    // Оновлення прогресу
    updateProgress: function() {
        var progress = this.remaining / this.duration;
        var circumference = 2 * Math.PI * 140; // r = 140
        var offset = circumference * (1 - progress);
        
        var circle = document.querySelector('.timer-progress');
        if (circle) {
            circle.style.strokeDashoffset = offset;
        }
    },
    
    // Оновлення кнопок
    updateButtons: function() {
        var startBtn = document.getElementById('btn-start');
        var pauseBtn = document.getElementById('btn-pause');
        
        if (this.isRunning) {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'flex';
        } else {
            startBtn.style.display = 'flex';
            pauseBtn.style.display = 'none';
        }
    }
};
