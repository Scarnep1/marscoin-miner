class MarsCoinsGame {
    constructor() {
        this.coins = 0;
        this.powerLevel = 1;
        this.autoMineRate = 0;
        this.upgrades = {
            pickaxe: { level: 0, baseCost: 10 },
            autoMiner: { level: 0, baseCost: 50 },
            rover: { level: 0, baseCost: 200 },
            station: { level: 0, baseCost: 1000 }
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
        this.initTelegram();
    }

    initTelegram() {
        if (window.Telegram && Telegram.WebApp) {
            this.userId = Telegram.WebApp.initDataUnsafe.user?.id || this.generateId();
            Telegram.WebApp.expand();
            Telegram.WebApp.enableClosingConfirmation();
        } else {
            this.userId = this.generateId();
        }
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    loadGame() {
        const saved = localStorage.getItem('marsCoinsGame');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.coins = data.coins || 0;
                this.powerLevel = data.powerLevel || 1;
                this.autoMineRate = data.autoMineRate || 0;
                this.upgrades = data.upgrades || this.upgrades;
                this.referrals = data.referrals || [];
            } catch (e) {
                console.error('Error loading game:', e);
            }
        }
    }

    saveGame() {
        const data = {
            coins: this.coins,
            powerLevel: this.powerLevel,
            autoMineRate: this.autoMineRate,
            upgrades: this.upgrades,
            referrals: this.referrals,
            timestamp: Date.now()
        };
        localStorage.setItem('marsCoinsGame', JSON.stringify(data));
    }

    setupEventListeners() {
        // Кнопка добычи
        document.getElementById('mineBtn').addEventListener('click', (e) => {
            this.mineCoins();
            this.createClickEffect(e);
        });

        // Навигация
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleNavigation(e.currentTarget);
            });
        });

        // Покупка улучшений
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.upgrade-card');
                if (card) {
                    this.buyUpgrade(card.dataset.upgrade);
                }
            });
        });

        // Копирование реферального кода
        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copyReferralCode();
        });

        // Обработка реферального кода из URL
        this.processUrlReferral();
    }

    handleNavigation(navItem) {
        // Убрать активный класс у всех кнопок
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Добавить активный класс к текущей кнопке
        navItem.classList.add('active');
        
        // Показать соответствующий экран
        const screenName = navItem.dataset.screen;
        this.showScreen(screenName);
    }

    mineCoins() {
        const coinsEarned = this.powerLevel;
        this.coins += coinsEarned;
        
        // Анимация планеты
        this.animatePlanet();
        
        // Показать уведомление
        this.showNotification(+${coinsEarned} MC!, 'success');
        
        // Обновить отображение
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

    createClickEffect(e) {
        const effect = document.querySelector('.click-effect');
        effect.style.left = (e.clientX - 10) + 'px';
        effect.style.top = (e.clientY - 10) + 'px';
        effect.style.opacity = '1';
        
        setTimeout(() => {
            effect.style.opacity = '0';
        }, 500);
    }

    buyUpgrade(upgradeType) {
        const upgrade = this.upgrades[upgradeType];
        if (!upgrade) return;

        const cost = this.getUpgradeCost(upgradeType);
        
        if (this.coins >= cost) {
            this.coins -= cost;
            upgrade.level++;
            
            // Применить эффект улучшения
            switch(upgradeType) {
                case 'pickaxe':
                    this.powerLevel += 1;
                    break;
                case 'autoMiner':
                    this.autoMineRate += 0.2;
                    break;
                case 'rover':
                    this.autoMineRate += 0.5;
                    break;
                case 'station':
                    this.autoMineRate += 2;
                    break;
            }
            
            this.showNotification('Улучшение приобретено! 🚀', 'success');
            this.updateDisplay();
            this.saveGame();
        } else {
            this.showNotification('Недостаточно коинов! 💰', 'error');
        }
    }

    getUpgradeCost(upgradeType) {
        const upgrade = this.upgrades[upgradeType];
        return Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));
    }

    startAutoMining() {
        setInterval(() => {
            if (this.autoMineRate > 0) {
                this.coins += this.autoMineRate / 10; // Обновляем 10 раз в секунду для плавности
                this.updateDisplay();
                // Сохраняем реже для производительности
                if (Math.random() < 0.1) this.saveGame();
            }
        }, 100);
    }

    generateReferralCode() {
        this.referralCode = btoa(this.userId).substr(0, 8).toUpperCase();
        document.getElementById('referralCode').textContent = this.referralCode;
    }

    async copyReferralCode() {
        const referralLink = https://t.me/your_bot?start=${this.referralCode};
        try {
            await navigator.clipboard.writeText(referralLink);
            this.showNotification('Ссылка скопирована! 📋', 'success');
        } catch (err) {
            this.showNotification('Ошибка копирования', 'error');
        }
    }

    showScreen(screenName) {
        // Скрыть все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показать выбранный экран
        const targetScreen = document.getElementById(screenName + 'Screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
        
        // Обновить данные на экранах
        if (screenName === 'leaders') {
            this.updateLeaderboard();
        }
    }

    updateDisplay() {
        // Баланс
        document.getElementById('balance').textContent = Math.floor(this.coins) + ' MC';
        
        // Статистика
        document.getElementById('powerLevel').textContent = this.powerLevel + '/клик';
        document.getElementById('autoMineLevel').textContent = this.autoMineRate.toFixed(1) + '/сек';
        
        // Уровни улучшений
        Object.keys(this.upgrades).forEach(upgrade => {
            const levelElement = document.getElementById(upgrade + 'Level');
            if (levelElement) {
                levelElement.textContent = this.upgrades[upgrade].level;
            }
        });
        
        // Реферальная статистика
        document.getElementById('referralsCount').textContent = this.referrals.length;
        document.getElementById('referralBonus').textContent = (this.referrals.length * 100) + ' MC';
        
        // Обновить кнопки улучшений
        this.updateUpgradeButtons();
    }

    updateUpgradeButtons() {
        document.querySelectorAll('.upgrade-card').forEach(card => {
            const upgradeType = card.dataset.upgrade;
            const cost = this.getUpgradeCost(upgradeType);
            const btn = card.querySelector('.upgrade-btn');
            
            btn.innerHTML = <span>${cost} MC</span>;
            btn.disabled = this.coins < cost;
        });
    }

    updateLeaderboard() {
        const leadersList = document.getElementById('leadersList');
        leadersList.innerHTML = '';
        
        // Заглушка для демонстрации
        const mockLeaders = [
            { name: 'Космический майнер', score: 15000, isCurrent: false },
            { name: 'Марсианский пионер', score: 12000, isCurrent: false },
            { name: 'Галактический искатель', score: 9800, isCurrent: false },
            { name: 'Вы', score: Math.floor(this.coins), isCurrent: true },
            { name: 'Новичок вселенной', score: 3500, isCurrent: false }
        ].sort((a, b) => b.score - a.score);

        mockLeaders.forEach((leader, index) => {
            const item = document.createElement('div');
            item.className = leader-item ${leader.isCurrent ? 'current-user' : ''};
            item.innerHTML = 
                <div class="leader-rank rank-${index + 1}">${index + 1}</div>
                <div class="leader-name">${leader.name}</div>
                <div class="leader-score">${leader.score} MC</div>
            ;
            leadersList.appendChild(item);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const content = notification.querySelector('.notification-content');
        
        content.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    processUrlReferral() {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('start');
        if (refCode && refCode !== this.referralCode && !this.referrals.includes(refCode)) {
            this.referrals.push(refCode);
            this.coins += 100;
            this.showNotification('Реферальный бонус: +100 MC! 🎁', 'success');
            this.saveGame();
            this.updateDisplay();
        }
    }
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    window.game = new MarsCoinsGame();
});
