// Основной класс игры
class MarsCoinMiner {
    constructor() {
        this.init();
    }

    init() {
        // Инициализация Telegram Web App
        this.tg = window.Telegram.WebApp;
        if (this.tg && this.tg.expand) {
            this.tg.expand(); // Раскрываем на весь экран
        }
        
        // Данные игры
        this.balance = 0;
        this.clickPower = 1;
        this.coinsPerSecond = 0;
        this.upgrades = {
            1: { count: 0, baseCost: 15, power: 0.5, name: "Ледяной бур" },
            2: { count: 0, baseCost: 100, power: 2, name: "Марсоход-майнер" },
            3: { count: 0, baseCost: 500, power: 10, name: "Майнинг-база" }
        };

        // Элементы интерфейса
        this.elements = {
            balance: document.getElementById('balance'),
            mineBtn: document.getElementById('mine-btn'),
            coinsPerSecond: document.getElementById('coins-per-second'),
            clickPower: document.getElementById('click-power')
        };

        this.setupEventListeners();
        this.loadGameData();
        this.startGameLoop();
        
        console.log('🚀 MarsCoin Miner запущен!');
    }

    setupEventListeners() {
        // Обработчик клика по кнопке майнинга
        this.elements.mineBtn.addEventListener('click', (event) => {
            this.mineCoins();
            this.createClickEffect(event);
        });

        // Обработчики для кнопок покупки улучшений
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const upgradeId = parseInt(e.target.getAttribute('data-upgrade'));
                this.buyUpgrade(upgradeId);
            });
        });
    }

    // Создание эффекта при клике
    createClickEffect(event) {
        const effect = document.createElement('div');
        effect.textContent = +${this.clickPower};
        effect.style.position = 'fixed';
        effect.style.left = ${event.clientX}px;
        effect.style.top = ${event.clientY}px;
        effect.style.color = '#4cc9f0';
        effect.style.fontWeight = 'bold';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '1000';
        effect.style.animation = 'floatUp 1s ease-out forwards';
        
        document.body.appendChild(effect);
        
        // Удаляем эффект после анимации
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }

    // Добыча коинов кликом
    mineCoins() {
        this.balance += this.clickPower;
        this.updateUI();
        this.saveGameData();
        console.log('⛏️ Добыто коинов:', this.clickPower, 'Баланс:', this.balance);
    }

    // Покупка улучшения
    buyUpgrade(upgradeId) {
        const upgrade = this.upgrades[upgradeId];
        if (!upgrade) {
            console.error('Улучшение не найдено:', upgradeId);
            return;
        }

        const cost = this.getUpgradeCost(upgradeId);
        
        if (this.balance >= cost) {
            this.balance -= cost;
            upgrade.count++;
            this.coinsPerSecond += upgrade.power;
            
            this.updateUI();
            this.saveGameData();
            
            // Визуальное подтверждение покупки
            this.showPurchaseMessage(upgrade.name);
            console.log('🛠️ Куплено улучшение:', upgrade.name, 'Цена:', cost);
        } else {
            console.log('💰 Недостаточно средств для покупки улучшения');
        }
    }

    // Расчет стоимости улучшения (увеличивается с каждой покупкой)
    getUpgradeCost(upgradeId) {
        const upgrade = this.upgrades[upgradeId];
        return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.count));
    }

    // Обновление интерфейса
    updateUI() {
        // Обновляем баланс
        this.elements.balance.textContent = this.formatNumber(this.balance);
        this.elements.coinsPerSecond.textContent = this.coinsPerSecond.toFixed(1);
        this.elements.clickPower.textContent = this.clickPower;
        // Обновляем кнопки улучшений
        for (let i = 1; i <= 3; i++) {
            const upgrade = this.upgrades[i];
            if (!upgrade) continue;

            const cost = this.getUpgradeCost(i);
            const btn = document.querySelector([data-upgrade="${i}"]);
            const countElement = document.getElementById(upgrade${i}-count);
            
            if (countElement) {
                countElement.textContent = upgrade.count;
            }
            
            if (btn) {
                const costElement = btn.querySelector('.cost');
                if (costElement) {
                    costElement.textContent = cost;
                }
                
                // Блокируем кнопку если не хватает денег
                btn.disabled = this.balance < cost;
                
                // Меняем стиль кнопки в зависимости от доступности
                if (this.balance < cost) {
                    btn.style.opacity = '0.6';
                } else {
                    btn.style.opacity = '1';
                }
            }
        }

        // Обновляем таблицу лидеров
        this.updateLeaderboard();
    }

    // Форматирование чисел (1000 -> 1 000)
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    // Показ сообщения о покупке
    showPurchaseMessage(upgradeName) {
        const message = document.createElement('div');
        message.textContent = ✅ Куплено: ${upgradeName};
        message.style.cssText = 
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(76, 201, 240, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 1000;
            animation: slideDown 0.5s ease-out;
        ;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }

    // Обновление таблицы лидеров
    updateLeaderboard() {
        const leaderboard = document.getElementById('leaderboard');
        if (!leaderboard) return;
        
        // В реальном приложении здесь будет запрос к серверу
        // Сейчас используем демо-данные
        const demoData = [
            { name: this.tg?.initDataUnsafe?.user?.first_name || 'Вы', score: this.balance },
            { name: 'Илон Маск', score: 15000 },
            { name: 'Марсианин', score: 8000 },
            { name: 'Космонавт', score: 4500 }
        ].sort((a, b) => b.score - a.score);

        leaderboard.innerHTML = demoData.map((user, index) => 
            <div class="leaderboard-item">
                <span class="leaderboard-position">${index + 1}</span>
                <span class="leaderboard-name">${user.name}</span>
                <span class="leaderboard-score">${this.formatNumber(user.score)}</span>
            </div>
        ).join('');
    }

    // Главный игровой цикл (автоматический доход)
    startGameLoop() {
        setInterval(() => {
            if (this.coinsPerSecond > 0) {
                const income = this.coinsPerSecond / 10; // Обновляем 10 раз в секунду для плавности
                this.balance += income;
                this.updateUI();
                
                // Сохраняем каждые 5 секунд при активном авто-майнинге
                if (Math.random() < 0.02) { // Примерно каждые 5 секунд
                    this.saveGameData();
                }
            }
        }, 100);
    }

    // Сохранение данных в Telegram Cloud Storage
    saveGameData() {
        if (!this.tg?.CloudStorage?.setItem) {
            console.log('Telegram Cloud Storage не доступен, сохраняем в localStorage');
            this.saveToLocalStorage();
            return;
        }

        const gameData = {
            balance: this.balance,
            coinsPerSecond: this.coinsPerSecond,
            upgrades: this.upgrades,
            lastSave: Date.now()
        };
        this.tg.CloudStorage.setItem('marscoin_save', JSON.stringify(gameData), 
            (err, result) => {
                if (err) {
                    console.error('Ошибка сохранения:', err);
                    // Если Telegram сохранение не работает, сохраняем в localStorage
                    this.saveToLocalStorage();
                } else {
                    console.log('💾 Данные сохранены в Telegram Cloud Storage');
                }
            }
        );
    }

    // Сохранение в localStorage (для тестирования вне Telegram)
    saveToLocalStorage() {
        const gameData = {
            balance: this.balance,
            coinsPerSecond: this.coinsPerSecond,
            upgrades: this.upgrades,
            lastSave: Date.now()
        };
        localStorage.setItem('marscoin_save', JSON.stringify(gameData));
        console.log('💾 Данные сохранены в localStorage');
    }

    // Загрузка сохраненных данных
    loadGameData() {
        // Сначала пробуем загрузить из Telegram Cloud Storage
        if (this.tg?.CloudStorage?.getItem) {
            this.tg.CloudStorage.getItem('marscoin_save', (err, data) => {
                if (!err && data) {
                    this.loadFromData(data);
                } else {
                    // Если в Telegram нет данных, пробуем localStorage
                    this.loadFromLocalStorage();
                }
            });
        } else {
            // Если не в Telegram, загружаем из localStorage
            this.loadFromLocalStorage();
        }
    }

    loadFromData(data) {
        try {
            const savedData = JSON.parse(data);
            this.balance = savedData.balance || 0;
            this.coinsPerSecond = savedData.coinsPerSecond || 0;
            this.upgrades = savedData.upgrades || this.upgrades;
            
            console.log('💾 Данные игры загружены! Баланс:', this.balance);
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
            this.balance = 0;
            this.coinsPerSecond = 0;
        }
        
        this.updateUI();
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('marscoin_save');
        if (savedData) {
            this.loadFromData(savedData);
        } else {
            console.log('🎮 Нет сохраненных данных, начинаем новую игру');
            this.updateUI();
        }
    }
}

// Добавляем CSS анимации
const style = document.createElement('style');
style.textContent = 
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
    }
    
    @keyframes slideDown {
        0% { transform: translate(-50%, -100%); opacity: 0; }
        100% { transform: translate(-50%, 0); opacity: 1; }
    }
    
    /* Анимация для кнопки майнинга */
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .mine-button:active {
        animation: pulse 0.1s ease-in-out;
    }
;
document.head.appendChild(style);

// Запускаем игру когда страница загрузится
document.addEventListener('DOMContentLoaded', () => {
    window.game = new MarsCoinMiner();
});

// Добавляем глобальную функцию для отладки
window.debugGame = function() {
    if (window.game) {
        console.log('🎮 Отладочная информация:');
        console.log('Баланс:', window.game.balance);
        console.log('Коин/сек:', window.game.coinsPerSecond);
        console.log('Улучшения:', window.game.upgrades);
    }
};
