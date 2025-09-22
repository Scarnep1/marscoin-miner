class MarsCoinsGame {
    constructor() {
        this.coins = 0;
        this.powerLevel = 1;
        this.autoMineRate = 0;
        this.upgrades = {
            pickaxe: 0,
            autoMiner: 0,
            rover: 0,
            station: 0
        };
        this.referrals = [];
        this.userId = null;
        this.referralCode = null;
        
        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.startAutoMining();
        this.generateReferralCode();
        this.updateDisplay();
        
        // Имитация инициализации Telegram Web App
        if (window.Telegram && Telegram.WebApp) {
            this.userId = Telegram.WebApp.initDataUnsafe.user?.id || Math.random().toString(36).substr(2, 9);
            Telegram.WebApp.expand();
        } else {
            this.userId = Math.random().toString(36).substr(2, 9);
        }
    }

    loadGame() {
        const saved = localStorage.getItem('marsCoinsGame');
        if (saved) {
            const data = JSON.parse(saved);
            this.coins = data.coins || 0;
            this.powerLevel = data.powerLevel || 1;
            this.autoMineRate = data.autoMineRate || 0;
            this.upgrades = data.upgrades || this.upgrades;
            this.referrals = data.referrals || [];
        }
    }

    saveGame() {
        const data = {
            coins: this.coins,
            powerLevel: this.powerLevel,
            autoMineRate: this.autoMineRate,
            upgrades: this.upgrades,
            referrals: this.referrals
        };
        localStorage.setItem('marsCoinsGame', JSON.stringify(data));
    }

    setupEventListeners() {
        // Кнопка добычи
        document.getElementById('mineBtn').addEventListener('click', () => {
            this.mineCoins();
            this.animatePlanet();
        });

        // Навигация
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showScreen(e.target.dataset.screen);
            });
        });

        // Кнопки назад
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showScreen(e.target.dataset.screen);
            });
        });

        // Покупка улучшений
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const upgrade = e.target.dataset.upgrade;
                const cost = parseInt(e.target.dataset.cost);
                this.buyUpgrade(upgrade, cost);
            });
        });

        // Копирование реферальной ссылки
        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copyReferralCode();
        });
    }

    mineCoins() {
        this.coins += this.powerLevel;
        this.showNotification(+${this.powerLevel} MC!);
        this.updateDisplay();
        this.saveGame();
    }

    animatePlanet() {
        const planet = document.getElementById('marsPlanet');
        planet.style.transform = 'scale(0.95)';
        setTimeout(() => {
            planet.style.transform = 'scale(1)';
        }, 100);
    }

    buyUpgrade(upgrade, cost) {
        if (this.coins >= cost) {
            this.coins -= cost;
            
            switch(upgrade) {
                case 'pickaxe':
                    this.powerLevel += 1;
                    this.upgrades.pickaxe++;
                    break;
                case 'autoMiner':
                    this.autoMineRate += 0.1;
                    this.upgrades.autoMiner++;
                    break;
                case 'rover':
                    this.autoMineRate += 0.5;
                    this.upgrades.rover++;
                    break;
                case 'station':
                    this.autoMineRate += 2;
                    this.upgrades.station++;
                    break;
            }
            
            this.showNotification(Улучшение куплено!);
            this.updateDisplay();
            this.saveGame();
        } else {
            this.showNotification('Недостаточно коинов!');
        }
    }

    startAutoMining() {
        setInterval(() => {
            if (this.autoMineRate > 0) {
                this.coins += this.autoMineRate;
                this.updateDisplay();
                this.saveGame();
            }
        }, 1000);
    }

    generateReferralCode() {
        this.referralCode = btoa(this.userId).substr(0, 8).toUpperCase();
        document.getElementById('referralCode').textContent = this.referralCode;
    }

    copyReferralCode() {
        const referralLink = https://t.me/your_bot?start=${this.referralCode};
        navigator.clipboard.writeText(referralLink).then(() => {
            this.showNotification('Ссылка скопирована!');
        });
    }

    showScreen(screenName) {
        // Скрыть все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показать выбранный экран
        document.getElementById(screenName + 'Screen').classList.add('active');
        
        // Обновить данные на экране лидеров
        if (screenName === 'leaders') {
            this.updateLeaderboard();
        }
    }

    updateDisplay() {
        // Обновление баланса
        document.getElementById('balance').textContent = Math.floor(this.coins) + ' MC';
        
        // Обновление статистики
        document.getElementById('powerLevel').textContent = this.powerLevel + ' коин/клик';
        document.getElementById('autoMineLevel').textContent = this.autoMineRate.toFixed(1) + ' коин/сек';
        
        // Обновление реферальной статистики
        document.getElementById('referralsCount').textContent = this.referrals.length;
        
        // Обновление кнопок улучшений
        this.updateUpgradeButtons();
    }

    updateUpgradeButtons() {
        const upgrades = [
            { type: 'pickaxe', cost: 10 + (this.upgrades.pickaxe * 5) },
            { type: 'autoMiner', cost: 50 + (this.upgrades.autoMiner * 25) },
            { type: 'rover', cost: 200 + (this.upgrades.rover * 100) },
            { type: 'station', cost: 1000 + (this.upgrades.station * 500) }
        ];

        upgrades.forEach(upgrade => {
            const btn = document.querySelector([data-upgrade="${upgrade.type}"]);
            if (btn) {
                btn.dataset.cost = upgrade.cost;
                btn.textContent = Купить за ${upgrade.cost} MC;
                btn.disabled = this.coins < upgrade.cost;
            }
        });
    }

    updateLeaderboard() {
        // В реальном приложении здесь был бы запрос к серверу
        const leadersList = document.getElementById('leadersList');
        leadersList.innerHTML = '';
        
        const mockLeaders = [
            { name: 'Космический майнер', score: 15000 },
            { name: 'Марсианский пионер', score: 12000 },
            { name: 'Галактический искатель', score: 9800 },
            { name: 'Вы', score: Math.floor(this.coins) },
            { name: 'Новичок вселенной', score: 3500 }
        ].sort((a, b) => b.score - a.score);

        mockLeaders.forEach((leader, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = 
                <span class="rank">${index + 1}</span>
                <span class="name">${leader.name}</span>
                <span class="score">${leader.score} MC</span>
            ;
            if (leader.name === 'Вы') {
                item.style.border = '2px solid #e94560';
            }
            leadersList.appendChild(item);
        });
    }
showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }

    // Метод для обработки реферальных ссылок (вызывается при старте бота)
    processReferral(code) {
        if (code && code !== this.referralCode && !this.referrals.includes(code)) {
            this.referrals.push(code);
            this.coins += 100; // Бонус за реферала
            this.showNotification('Реферальный бонус: +100 MC!');
            this.saveGame();
            this.updateDisplay();
        }
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.game = new MarsCoinsGame();
    
    // Обработка реферального кода из URL параметров
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('start');
    if (refCode) {
        window.game.processReferral(refCode);
    }
});
