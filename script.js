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
        this.userId = this.generateUserId();
        this.referralCode = null;
        
        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.startAutoMining();
        this.generateReferralCode();
        this.updateDisplay();
        
        // Обработка реферального кода из URL
        this.processReferralFromUrl();
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
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
                console.log('Ошибка загрузки, начинаем новую игру');
            }
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
        const mineBtn = document.getElementById('mineBtn');
        if (mineBtn) {
            mineBtn.addEventListener('click', () => {
                this.mineCoins();
            });
        }

        // Навигационные кнопки
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Убираем активный класс у всех кнопок
                navButtons.forEach(b => b.classList.remove('active'));
                // Добавляем активный класс текущей кнопке
                e.currentTarget.classList.add('active');
            });
        });

        console.log('Event listeners setup complete');
    }

    mineCoins() {
        this.coins += this.powerLevel;
        this.showNotification(+${this.powerLevel} MC!);
        this.animatePlanet();
        this.updateDisplay();
        this.saveGame();
    }

    animatePlanet() {
        const planet = document.getElementById('marsPlanet');
        if (planet) {
            planet.style.transform = 'scale(0.95)';
            setTimeout(() => {
                planet.style.transform = 'scale(1)';
            }, 100);
        }
    }

    buyUpgrade(upgradeType) {
        const upgrade = this.upgrades[upgradeType];
        if (!upgrade) return;

        const cost = this.getUpgradeCost(upgradeType);
        
        if (this.coins >= cost) {
            this.coins -= cost;
            upgrade.level++;
            
            // Применяем эффект улучшения
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
            
            this.showNotification('Улучшение куплено! 🚀');
            this.updateDisplay();
            this.saveGame();
        } else {
            this.showNotification('Недостаточно коинов! 💰');
        }
    }
    getUpgradeCost(upgradeType) {
        const upgrade = this.upgrades[upgradeType];
        return upgrade.baseCost * Math.pow(1.5, upgrade.level);
    }

    startAutoMining() {
        setInterval(() => {
            if (this.autoMineRate > 0) {
                this.coins += this.autoMineRate / 10;
                this.updateDisplay();
                // Сохраняем каждые 10 секунд для производительности
                if (Math.random() < 0.01) this.saveGame();
            }
        }, 100);
    }

    generateReferralCode() {
        this.referralCode = btoa(this.userId).substr(0, 8).toUpperCase();
        const codeElement = document.getElementById('referralCode');
        if (codeElement) {
            codeElement.textContent = this.referralCode;
        }
    }

    async copyReferralCode() {
        const referralLink = https://t.me/your_bot?start=${this.referralCode};
        try {
            await navigator.clipboard.writeText(referralLink);
            this.showNotification('Ссылка скопирована! 📋');
        } catch (err) {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = referralLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Ссылка скопирована! 📋');
        }
    }

    showScreen(screenName) {
        // Скрываем все экраны
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показываем выбранный экран
        const targetScreen = document.getElementById(screenName + 'Screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
        
        // Обновляем данные если нужно
        if (screenName === 'leaders') {
            this.updateLeaderboard();
        }
    }

    updateDisplay() {
        // Обновляем баланс
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.textContent = Math.floor(this.coins) + ' MC';
        }
        
        // Обновляем статистику
        const powerElement = document.getElementById('powerLevel');
        if (powerElement) {
            powerElement.textContent = this.powerLevel + '/клик';
        }
        
        const autoMineElement = document.getElementById('autoMineLevel');
        if (autoMineElement) {
            autoMineElement.textContent = this.autoMineRate.toFixed(1) + '/сек';
        }
        
        // Обновляем стоимость улучшений
        this.updateUpgradeCosts();
        
        // Обновляем реферальную статистику
        const referralsCountElement = document.getElementById('referralsCount');
        if (referralsCountElement) {
            referralsCountElement.textContent = this.referrals.length;
        }
    }

    updateUpgradeCosts() {
        Object.keys(this.upgrades).forEach(upgradeType => {
            const costElement = document.getElementById(upgradeType + 'Cost');
            if (costElement) {
                const cost = Math.floor(this.getUpgradeCost(upgradeType));
                costElement.textContent = cost;
            }
        });
    }

    updateLeaderboard() {
        const leadersList = document.getElementById('leadersList');
        if (!leadersList) return;
        
        leadersList.innerHTML = '';
        
        // Заглушка для демонстрации
        const mockLeaders = [
            { name: 'Космический майнер', score: 15000 },
            { name: 'Марсианский пионер', score: 12000 },
            { name: 'Вы', score: Math.floor(this.coins) },
            { name: 'Галактический искатель', score: 9800 },
            { name: 'Новичок вселенной', score: 3500 }
        ].sort((a, b) => b.score - a.score);
        
        mockLeaders.forEach((leader, index) => {
            const leaderElement = document.createElement('div');
            leaderElement.className = 'leader-item';
            leaderElement.innerHTML = 
                <span>${index + 1}</span>
                <span class="leader-name">${leader.name}</span>
                <span class="leader-score">${leader.score} MC</span>
            ;
            leadersList.appendChild(leaderElement);
        });
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        }
    }

    processReferralFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('start');
        if (refCode && refCode !== this.referralCode && !this.referrals.includes(refCode)) {
            this.referrals.push(refCode);
            this.coins += 100;
            this.showNotification('Реферальный бонус: +100 MC! 🎁');
            this.saveGame();
            this.updateDisplay();
        }
    }
}

// Инициализация игры когда страница загружена
document.addEventListener('DOMContentLoaded', function() {
    window.game = new MarsCoinsGame();
    console.log('Game initialized successfully');
});
