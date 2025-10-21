document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Система пользователя
const userData = {
    points: 0,
    level: 1,
    gamesPlayed: 0,
    friendsInvited: 0,
    achievements: [],
    gameHistory: [],
    exchangeVisits: []
};

// Партнерские ссылки (замените YOUR_REF_CODE на ваши реф-коды)
const affiliateLinks = {
    'bybit': 'https://www.bybit.com/register?ref=YOUR_REF_CODE',
    'bingx': 'https://www.bingx.com/register?ref=YOUR_REF_CODE',
    'bitget': 'https://www.bitget.com/register?ref=YOUR_REF_CODE',
    'mexc': 'https://www.mexc.com/register?ref=YOUR_REF_CODE'
};

// Достижения
const achievements = {
    'first_play': { name: 'Первая игра', points: 10, earned: false },
    'invite_3': { name: 'Пригласи 3 друзей', points: 50, earned: false },
    'play_5_games': { name: '5 разных игр', points: 30, earned: false },
    'exchange_visit': { name: 'Посети биржу', points: 25, earned: false }
};

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function initializeApp() {
    loadUserData();
    setupNavigation();
    setupGameButtons();
    setupExchangeButtons();
    setupSettingsPanel();
    setupReferralSystem();
    setupShareButtons();
    loadThemePreference();
    updateUI();
    
    // Плавная загрузка контента
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Telegram Web App integration
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
        loadUserDataFromTelegram();
    }
    
    // Кэширование данных
    cacheEssentialData();
}

function loadUserData() {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        Object.assign(userData, JSON.parse(savedData));
    }
    
    // Обработка реферальных параметров
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode && !localStorage.getItem('referrer')) {
        localStorage.setItem('referrer', refCode);
        awardReferralBonus(refCode);
    }
}

function saveUserData() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

function loadUserDataFromTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        
        if (user) {
            // Обновление имени пользователя
            const userName = document.getElementById('user-name');
            if (userName && user.first_name) {
                userName.textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
            }
            
            // Обновление username
            const userUsername = document.getElementById('user-username');
            if (userUsername && user.username) {
                userUsername.textContent = '@' + user.username;
            }
            
            // Обновление аватара
            const userAvatar = document.getElementById('user-avatar');
            const avatarImg = document.getElementById('avatar-img');
            const avatarFallback = document.getElementById('avatar-fallback');
            
            if (userAvatar && user.photo_url) {
                avatarImg.src = user.photo_url;
                avatarImg.style.display = 'block';
                avatarFallback.style.display = 'none';
            } else if (userAvatar && user.first_name) {
                avatarFallback.textContent = user.first_name.charAt(0).toUpperCase();
            }
        }
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            vibrate();
            const targetSection = this.getAttribute('data-section');
            
            // Обновление активного элемента навигации
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Показать целевую секцию
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                    
                    // Обновление рекомендаций при переходе в игры
                    if (targetSection === 'games-section') {
                        updateGameRecommendations();
                    }
                }
            });
        });
    });
}

function setupGameButtons() {
    const playButtons = document.querySelectorAll('.play-button');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            vibrate();
            
            const botUsername = this.getAttribute('data-bot');
            const gameName = this.getAttribute('data-game');
            
            // Отслеживание игры
            trackGamePlay(gameName);
            
            // Начисление достижений
            checkAndAwardAchievement('first_play');
            
            if (botUsername) {
                const telegramUrl = `https://t.me/${botUsername}`;
                
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.openTelegramLink(telegramUrl);
                } else {
                    window.open(telegramUrl, '_blank');
                }
            }
        });
    });
}

function setupExchangeButtons() {
    const exchangeButtons = document.querySelectorAll('.exchange-button');
    
    exchangeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            vibrate();
            
            const exchangeName = this.getAttribute('data-exchange');
            const affiliateUrl = affiliateLinks[exchangeName.toLowerCase()] || this.getAttribute('data-url');
            
            // Отслеживание посещения биржи
            trackExchangeVisit(exchangeName);
            
            // Начисление достижений
            checkAndAwardAchievement('exchange_visit');
            
            if (affiliateUrl) {
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.openLink(affiliateUrl);
                } else {
                    window.open(affiliateUrl, '_blank');
                }
            }
        });
    });
}

function setupSettingsPanel() {
    const settingsButton = document.getElementById('settings-button');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettings = document.getElementById('close-settings');
    
    if (settingsButton) {
        settingsButton.addEventListener('click', function() {
            vibrate();
            settingsPanel.classList.add('active');
        });
    }
    
    if (closeSettings) {
        closeSettings.addEventListener('click', function() {
            vibrate();
            settingsPanel.classList.remove('active');
        });
    }
    
    // Закрытие настроек при клике снаружи
    if (settingsPanel) {
        settingsPanel.addEventListener('click', function(e) {
            if (e.target === settingsPanel) {
                settingsPanel.classList.remove('active');
            }
        });
    }
    
    // Переключатель темы в настройках
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            vibrate();
            const theme = this.getAttribute('data-theme');
            
            // Обновление активного состояния
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Применение темы
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
            
            // Сохранение в localStorage
            localStorage.setItem('theme', theme);
        });
    });
}

function setupReferralSystem() {
    // Генерация реферального кода
    if (!localStorage.getItem('refCode')) {
        const refCode = generateRefCode();
        localStorage.setItem('refCode', refCode);
    }
    
    // Обновление реферальной ссылки
    updateReferralLink();
}

function generateRefCode() {
    return 'GV' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function updateReferralLink() {
    const refCode = localStorage.getItem('refCode');
    const currentUrl = window.location.origin + window.location.pathname;
    const referralLink = `${currentUrl}?ref=${refCode}`;
    
    const referralInput = document.getElementById('referral-link-input');
    if (referralInput) {
        referralInput.value = referralLink;
    }
}

function copyReferralLink() {
    const referralInput = document.getElementById('referral-link-input');
    if (referralInput) {
        navigator.clipboard.writeText(referralInput.value).then(() => {
            showNotification('Реферальная ссылка скопирована!');
        });
    }
}

function awardReferralBonus(refCode) {
    // Здесь можно интегрировать с бэкендом для начисления бонусов
    userData.points += 100;
    userData.friendsInvited += 1;
    
    // Проверка достижений
    if (userData.friendsInvited >= 3) {
        checkAndAwardAchievement('invite_3');
    }
    
    saveUserData();
    updateUI();
    showNotification('+100 очков за приглашенного друга!');
}

function setupShareButtons() {
    const shareOptions = document.querySelectorAll('.share-option');
    
    shareOptions.forEach(option => {
        option.addEventListener('click', function() {
            vibrate();
            const platform = this.getAttribute('data-platform');
            shareToPlatform(platform);
        });
    });
}

function shareToPlatform(platform) {
    const referralLink = document.getElementById('referral-link-input').value;
    const shareText = 'Присоединяйся к Games Verse - лучшие игры Telegram и крипто-биржи в одном месте! 🎮';
    
    let shareUrl = '';
    
    switch (platform) {
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralLink)}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(shareText + ' ' + referralLink).then(() => {
                showNotification('Текст для шаринга скопирован!');
            });
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
}

function trackGamePlay(gameName) {
    if (!userData.gameHistory.includes(gameName)) {
        userData.gameHistory.push(gameName);
        userData.gamesPlayed += 1;
        
        // Начисление очков
        userData.points += 10;
        
        // Проверка достижений
        if (userData.gameHistory.length >= 5) {
            checkAndAwardAchievement('play_5_games');
        }
        
        saveUserData();
        updateUI();
    }
    
    // Аналитика
    trackUserAction('game_play', gameName);
}

function trackExchangeVisit(exchangeName) {
    if (!userData.exchangeVisits.includes(exchangeName)) {
        userData.exchangeVisits.push(exchangeName);
        
        // Начисление очков
        userData.points += 15;
        
        saveUserData();
        updateUI();
    }
    
    // Аналитика
    trackUserAction('exchange_visit', exchangeName);
}

function checkAndAwardAchievement(achievementId) {
    if (!achievements[achievementId] || achievements[achievementId].earned) return;
    
    achievements[achievementId].earned = true;
    userData.points += achievements[achievementId].points;
    
    // Обновление UI достижения
    const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
    if (achievementElement) {
        achievementElement.classList.add('earned');
    }
    
    saveUserData();
    updateUI();
    showNotification(`Достижение разблокировано: +${achievements[achievementId].points} очков!`);
}

function updateGameRecommendations() {
    const recommendedContainer = document.getElementById('recommended-games');
    if (!recommendedContainer) return;
    
    const recommendations = getGameRecommendations();
    
    // Очистка и добавление рекомендаций
    recommendedContainer.innerHTML = '';
    recommendations.forEach(gameName => {
        const gameCard = createRecommendedGameCard(gameName);
        if (gameCard) {
            recommendedContainer.appendChild(gameCard);
        }
    });
}

function getGameRecommendations() {
    // Простая логика рекомендаций
    if (userData.gameHistory.includes('Hamster')) {
        return ['Hamster King', 'Hamster Fight Club'];
    } else if (userData.gameHistory.length === 0) {
        return ['BitQuest', 'Hamster GameDev'];
    }
    
    return ['BitQuest', 'Hamster King'];
}

function createRecommendedGameCard(gameName) {
    // Здесь можно создать карточку игры на основе названия
    // Для простоты возвращаем существующую карточку
    const allGames = document.querySelectorAll('.game-card');
    for (let game of allGames) {
        if (game.querySelector('h3').textContent === gameName) {
            return game.cloneNode(true);
        }
    }
    return null;
}

function updateUI() {
    // Обновление статистики
    document.getElementById('games-played').textContent = userData.gamesPlayed;
    document.getElementById('friends-invited').textContent = userData.friendsInvited;
    document.getElementById('points-earned').textContent = userData.points;
    document.getElementById('user-points').textContent = `${userData.points} очков`;
    
    // Обновление прогресса уровня
    const levelProgress = (userData.points % 100) / 100 * 100;
    document.getElementById('level-progress').style.width = levelProgress + '%';
    
    // Обновление достижений
    updateAchievementsUI();
}

function updateAchievementsUI() {
    const achievementElements = document.querySelectorAll('.achievement');
    achievementElements.forEach(element => {
        const achievementId = element.getAttribute('data-achievement');
        if (achievements[achievementId] && achievements[achievementId].earned) {
            element.classList.add('earned');
        }
    });
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    updateSettingsThemeOptions();
}

function updateSettingsThemeOptions() {
    const themeOptions = document.querySelectorAll('.theme-option');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if ((isDarkTheme && option.getAttribute('data-theme') === 'dark') || 
            (!isDarkTheme && option.getAttribute('data-theme') === 'light')) {
            option.classList.add('active');
        }
    });
}

function cacheEssentialData() {
    if ('caches' in window) {
        caches.open('games-verse-v1').then(cache => {
            cache.addAll([
                '/',
                '/style.css',
                '/script.js',
                '/images/'
            ]);
        });
    }
}

function trackUserAction(action, value) {
    const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
    analytics.push({
        action,
        value,
        timestamp: Date.now(),
        userId: localStorage.getItem('refCode') || 'anonymous'
    });
    localStorage.setItem('analytics', JSON.stringify(analytics.slice(-1000)));
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
}

// Экспорт для глобального использования
window.copyReferralLink = copyReferralLink;
