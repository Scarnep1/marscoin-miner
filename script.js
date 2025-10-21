document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Translations object
const translations = {
    ru: {
        appTitle: "Games Verse",
        settings: "Настройки",
        language: "Язык",
        russian: "Русский",
        english: "English",
        done: "Готово",
        notifications: "Уведомления",
        games: "Игры",
        bestGames: "Лучшие игры Telegram",
        firstGame: "Первая игра",
        playAnyGame: "Сыграйте в любую игру",
        gameCollector: "Коллекционер",
        play5Games: "Сыграйте в 5 игр",
        play: "Играть",
        exchanges: "Биржи",
        exchangesDesc: "Торгуйте криптовалютами безопасно",
        go: "Перейти",
        leaderboard: "Топ игроков",
        weeklyRanking: "Еженедельный рейтинг",
        weekly: "За неделю",
        allTime: "За все время",
        user: "Пользователь",
        level: "Уровень",
        dailyBonus: "Ежедневный бонус",
        claimBonus: "Получить бонус",
        referralTitle: "Пригласи друзей",
        invitedFriends: "Приглашено друзей",
        referralEarnings: "Заработано баллов",
        copy: "Копировать",
        shareWithFriends: "Поделиться с друзьями",
        copyLink: "Скопировать",
        profile: "Профиль",
        linkCopied: "Ссылка скопирована в буфер обмена!",
        bonusClaimed: "Бонус получен!",
        inviteFriend: "Пригласить друга",
        points: "баллов",
        today: "Сегодня",
        tomorrow: "Завтра"
    },
    en: {
        appTitle: "Games Verse",
        settings: "Settings",
        language: "Language",
        russian: "Russian",
        english: "English",
        done: "Done",
        notifications: "Notifications",
        games: "Games",
        bestGames: "Best Telegram Games",
        firstGame: "First Game",
        playAnyGame: "Play any game",
        gameCollector: "Collector",
        play5Games: "Play 5 games",
        play: "Play",
        exchanges: "Exchanges",
        exchangesDesc: "Trade cryptocurrencies safely",
        go: "Go",
        leaderboard: "Leaderboard",
        weeklyRanking: "Weekly ranking",
        weekly: "Weekly",
        allTime: "All Time",
        user: "User",
        level: "Level",
        dailyBonus: "Daily Bonus",
        claimBonus: "Claim Bonus",
        referralTitle: "Invite Friends",
        invitedFriends: "Invited Friends",
        referralEarnings: "Points Earned",
        copy: "Copy",
        shareWithFriends: "Share with friends",
        copyLink: "Copy Link",
        profile: "Profile",
        linkCopied: "Link copied to clipboard!",
        bonusClaimed: "Bonus claimed!",
        inviteFriend: "Invite Friend",
        points: "points",
        today: "Today",
        tomorrow: "Tomorrow"
    }
};

// Game and exchange data
const gamesData = [
    {
        id: 1,
        name: "Hamster GameDev",
        description: "Создай свою студию",
        bot: "hamsterdev_bot",
        image: "images/hamster-gamedev.jpg",
        points: 10
    },
    {
        id: 2,
        name: "Hamster King",
        description: "Стань королем хомяков",
        bot: "hamsterking_bot",
        image: "images/hamster-king.jpg",
        points: 10
    },
    {
        id: 3,
        name: "Hamster Fight Club",
        description: "Бойцовский клуб хомяков",
        bot: "hamsterfightclub_bot",
        image: "images/hamster-fightclub.jpg",
        points: 10
    },
    {
        id: 4,
        name: "BitQuest",
        description: "Приключения в мире крипты",
        bot: "bitquest_bot",
        image: "images/bitquest.jpg",
        points: 15
    },
    {
        id: 5,
        name: "Crypto Hamster",
        description: "Зарабатывай криптовалюту",
        bot: "cryptohamster_bot",
        image: "images/crypto-hamster.jpg",
        points: 20
    },
    {
        id: 6,
        name: "Tap Fantasy",
        description: "Фэнтези RPG игра",
        bot: "tapfantasy_bot",
        image: "images/tap-fantasy.jpg",
        points: 15
    }
];

const exchangesData = [
    {
        id: 1,
        name: "Bybit",
        description: "Продвинутая торговая платформа",
        url: "https://www.bybit.com",
        image: "images/bybit.jpg",
        bonus: "До $30 бонус"
    },
    {
        id: 2,
        name: "BingX",
        description: "Социальная торговля и копирование",
        url: "https://www.bingx.com",
        image: "images/bingx.jpg",
        bonus: "До $50 бонус"
    },
    {
        id: 3,
        name: "Bitget",
        description: "Инновационная торговая платформа",
        url: "https://www.bitget.com",
        image: "images/bitget.jpg",
        bonus: "До $25 бонус"
    },
    {
        id: 4,
        name: "MEXC",
        description: "Глобальная биржа с низкими комиссиями",
        url: "https://www.mexc.com",
        image: "images/mexc.jpg",
        bonus: "До $20 бонус"
    }
];

// User data and state
let userData = {
    points: 0,
    level: 1,
    invitedFriends: 0,
    referralEarnings: 0,
    gamesPlayed: [],
    achievements: {},
    lastBonusDate: null,
    referralCode: null
};

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function initializeApp() {
    loadUserData();
    setupNavigation();
    loadGames();
    loadExchanges();
    loadLeaderboard();
    setupSettingsPanel();
    setupGameButtons();
    setupExchangeButtons();
    setupShareButtons();
    setupDailyBonus();
    setupReferralSystem();
    updateUI();
    
    // Плавная загрузка контента
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Telegram Web App integration
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
        
        const themeParams = window.Telegram.WebApp.themeParams;
        if (themeParams) {
            document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color || '#000000');
            document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color || '#667eea');
            document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color || '#ffffff');
        }
        
        // Track app launch
        trackUserAction('app_launch');
    }
    
    // Check for referral parameter in URL
    checkReferral();
}

function loadUserData() {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        userData = {...userData, ...JSON.parse(savedData)};
    }
    
    // Generate referral code if not exists
    if (!userData.referralCode) {
        userData.referralCode = generateReferralCode();
        saveUserData();
    }
    
    // Load user from Telegram if available
    if (window.Telegram && window.Telegram.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        
        if (user) {
            // Update user name
            const userName = document.getElementById('user-name');
            if (userName && user.first_name) {
                userName.textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
            }
            
            // Update username
            const userUsername = document.getElementById('user-username');
            if (userUsername && user.username) {
                userUsername.textContent = '@' + user.username;
            }
            
            // Update avatar
            const userAvatar = document.getElementById('user-avatar');
            const avatarImg = document.getElementById('avatar-img');
            const avatarFallback = document.getElementById('avatar-fallback');
            
            if (userAvatar && user.photo_url) {
                avatarImg.src = user.photo_url;
                avatarImg.style.display = 'block';
                avatarFallback.style.display = 'none';
            } else if (userAvatar && user.first_name) {
                // Show first letter of first name as fallback
                avatarFallback.textContent = user.first_name.charAt(0).toUpperCase();
            }
        }
    }
}

function saveUserData() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function checkReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    
    if (ref && ref !== userData.referralCode) {
        // Award points to referrer
        awardReferralPoints(ref);
        
        // Track referral
        trackUserAction('referral_joined', { referrer: ref });
    }
}

function awardReferralPoints(referrerCode) {
    // In a real app, you would send this to your backend
    // For now, we'll simulate it
    console.log(`Awarding points to referrer: ${referrerCode}`);
    
    // You can implement backend API call here
    // fetch('/api/award-referral', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ referrerCode })
    // });
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            vibrate();
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
            
            // Track section view
            trackUserAction('section_view', { section: targetSection });
        });
    });
    
    // Leaderboard tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            loadLeaderboard(this.getAttribute('data-tab'));
        });
    });
}

function loadGames() {
    const gamesGrid = document.getElementById('games-grid');
    
    gamesData.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-image">
                <img src="${game.image}" alt="${game.name}" class="game-img" loading="lazy">
            </div>
            <div class="game-info">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <div class="game-points">+${game.points} баллов</div>
            </div>
            <button class="play-button" data-bot="${game.bot}" data-game-id="${game.id}">
                <span data-i18n="play">Играть</span>
            </button>
        `;
        gamesGrid.appendChild(gameCard);
    });
}

function loadExchanges() {
    const exchangesList = document.getElementById('exchanges-list');
    
    exchangesData.forEach(exchange => {
        const exchangeCard = document.createElement('div');
        exchangeCard.className = 'exchange-card';
        exchangeCard.innerHTML = `
            <div class="exchange-logo">
                <img src="${exchange.image}" alt="${exchange.name}" class="exchange-img" loading="lazy">
            </div>
            <div class="exchange-info">
                <h3>${exchange.name}</h3>
                <p>${exchange.description}</p>
                <div class="exchange-bonus">${exchange.bonus}</div>
            </div>
            <button class="exchange-button" data-url="${exchange.url}" data-exchange-id="${exchange.id}">
                <span data-i18n="go">Перейти</span>
            </button>
        `;
        exchangesList.appendChild(exchangeCard);
    });
}

function loadLeaderboard(period = 'weekly') {
    const leaderboardList = document.getElementById('leaderboard-list');
    
    // Simulate leaderboard data
    const leaderboardData = [
        { rank: 1, name: "Алексей", username: "@alexey", points: 1540, avatar: "" },
        { rank: 2, name: "Мария", username: "@maria", points: 1420, avatar: "" },
        { rank: 3, name: "Дмитрий", username: "@dmitry", points: 1380, avatar: "" },
        { rank: 4, name: "Анна", username: "@anna", points: 1250, avatar: "" },
        { rank: 5, name: "Сергей", username: "@sergey", points: 1180, avatar: "" },
        { rank: 6, name: "Вы", username: "@you", points: userData.points, avatar: "", isCurrentUser: true }
    ];
    
    leaderboardList.innerHTML = '';
    
    leaderboardData.forEach(user => {
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = `leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}`;
        leaderboardItem.innerHTML = `
            <span class="rank">${user.rank}</span>
            <div class="user-avatar">
                ${user.avatar ? `<img src="${user.avatar}" alt="${user.name}">` : `<span>${user.name.charAt(0)}</span>`}
            </div>
            <div class="user-info">
                <span class="username">${user.name}</span>
                <span class="user-handle">${user.username}</span>
            </div>
            <span class="user-points">${user.points} баллов</span>
        `;
        leaderboardList.appendChild(leaderboardItem);
    });
}

function setupGameButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.play-button')) {
            const button = e.target.closest('.play-button');
            vibrate();
            const botUsername = button.getAttribute('data-bot');
            const gameId = parseInt(button.getAttribute('data-game-id'));
            
            if (botUsername) {
                // Award points for playing game
                if (!userData.gamesPlayed.includes(gameId)) {
                    const game = gamesData.find(g => g.id === gameId);
                    if (game) {
                        userData.points += game.points;
                        userData.gamesPlayed.push(gameId);
                        saveUserData();
                        updateUI();
                        
                        // Track game play
                        trackUserAction('game_played', { 
                            gameId: gameId, 
                            gameName: game.name,
                            pointsEarned: game.points 
                        });
                    }
                }
                
                const telegramUrl = `https://t.me/${botUsername}`;
                
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.openTelegramLink(telegramUrl);
                } else {
                    window.open(telegramUrl, '_blank');
                }
            }
        }
    });
}

function setupExchangeButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.exchange-button')) {
            const button = e.target.closest('.exchange-button');
            vibrate();
            const exchangeUrl = button.getAttribute('data-url');
            const exchangeId = parseInt(button.getAttribute('data-exchange-id'));
            
            if (exchangeUrl) {
                // Track exchange click
                trackUserAction('exchange_clicked', { 
                    exchangeId: exchangeId,
                    exchangeUrl: exchangeUrl 
                });
                
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.openLink(exchangeUrl);
                } else {
                    window.open(exchangeUrl, '_blank');
                }
            }
        }
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
    
    // Close settings when clicking outside
    if (settingsPanel) {
        settingsPanel.addEventListener('click', function(e) {
            if (e.target === settingsPanel) {
                settingsPanel.classList.remove('active');
            }
        });
    }
    
    // Language switcher in settings
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            vibrate();
            const lang = this.getAttribute('data-lang');
            
            // Update active state
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Change language
            setLanguage(lang);
            
            // Save to localStorage
            localStorage.setItem('language', lang);
            
            // Track language change
            trackUserAction('language_changed', { language: lang });
        });
    });
}

function setLanguage(lang) {
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

function setupShareButtons() {
    const shareButton = document.getElementById('share-friends-button');
    const platformButtons = document.querySelectorAll('.platform-button');
    const notification = document.getElementById('notification');
    
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            vibrate();
            const sharePlatforms = document.getElementById('share-platforms');
            sharePlatforms.classList.toggle('active');
        });
    }
    
    platformButtons.forEach(button => {
        button.addEventListener('click', function() {
            vibrate();
            const platform = this.getAttribute('data-platform');
            shareToPlatform(platform);
            
            // Track share action
            trackUserAction('shared_app', { platform: platform });
        });
    });
    
    // Copy referral link button
    const copyReferralButton = document.getElementById('copy-referral-link');
    if (copyReferralButton) {
        copyReferralButton.addEventListener('click', function() {
            vibrate();
            const referralInput = document.getElementById('referral-link-input');
            referralInput.select();
            
            navigator.clipboard.writeText(referralInput.value).then(() => {
                showNotification(notification);
            }).catch(() => {
                // Fallback
                try {
                    document.execCommand('copy');
                    showNotification(notification);
                } catch (err) {
                    console.error('Copy failed:', err);
                }
            });
        });
    }
}

function shareToPlatform(platform) {
    const shareUrl = `${window.location.origin}${window.location.pathname}?ref=${userData.referralCode}`;
    const shareText = 'Открой для себя лучшие игры Telegram и зарабатывай баллы! Присоединяйся к Games Verse!';
    
    let shareLink = '';
    
    switch(platform) {
        case 'telegram':
            shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
            break;
        case 'whatsapp':
            shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(shareUrl).then(() => {
                showNotification(document.getElementById('notification'));
            });
            return;
    }
    
    if (shareLink) {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openLink(shareLink);
        } else {
            window.open(shareLink, '_blank');
        }
    }
}

function setupDailyBonus() {
    const claimButton = document.getElementById('claim-bonus');
    const notification = document.getElementById('notification');
    
    if (claimButton) {
        claimButton.addEventListener('click', function() {
            vibrate();
            claimDailyBonus();
        });
    }
    
    updateBonusCalendar();
}

function updateBonusCalendar() {
    const today = new Date();
    const lastBonusDate = userData.lastBonusDate ? new Date(userData.lastBonusDate) : null;
    
    // Check if bonus was already claimed today
    if (lastBonusDate && 
        lastBonusDate.getDate() === today.getDate() &&
        lastBonusDate.getMonth() === today.getMonth() &&
        lastBonusDate.getFullYear() === today.getFullYear()) {
        
        document.getElementById('claim-bonus').disabled = true;
        document.getElementById('claim-bonus').textContent = translations[getCurrentLanguage()].bonusClaimed;
    }
    
    // Calculate streak
    let streak = 0;
    if (lastBonusDate) {
        const diffTime = Math.abs(today - lastBonusDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            streak = userData.bonusStreak || 1;
        }
    }
    
    // Update bonus calendar UI
    const bonusDays = document.querySelectorAll('.bonus-day');
    bonusDays.forEach(day => {
        const dayNum = parseInt(day.getAttribute('data-day'));
        
        if (dayNum <= streak) {
            day.classList.add('claimed');
        } else if (dayNum === streak + 1) {
            day.classList.add('today');
        } else {
            day.classList.remove('claimed', 'today');
        }
    });
}

function claimDailyBonus() {
    const today = new Date();
    const lastBonusDate = userData.lastBonusDate ? new Date(userData.lastBonusDate) : null;
    
    // Calculate streak
    let streak = 1;
    if (lastBonusDate) {
        const diffTime = Math.abs(today - lastBonusDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            streak = (userData.bonusStreak || 0) + 1;
        }
    }
    
    // Calculate bonus amount
    const baseBonus = 10;
    const bonusAmount = baseBonus * streak;
    
    // Award bonus
    userData.points += bonusAmount;
    userData.lastBonusDate = today.toISOString();
    userData.bonusStreak = streak;
    saveUserData();
    
    // Update UI
    updateUI();
    updateBonusCalendar();
    
    // Show notification
    const notification = document.getElementById('notification');
    notification.textContent = `Бонус получен! +${bonusAmount} баллов`;
    showNotification(notification);
    
    // Track bonus claim
    trackUserAction('daily_bonus_claimed', { 
        streak: streak, 
        points: bonusAmount 
    });
}

function setupReferralSystem() {
    // Set referral link
    const referralInput = document.getElementById('referral-link-input');
    if (referralInput) {
        referralInput.value = `${window.location.origin}${window.location.pathname}?ref=${userData.referralCode}`;
    }
    
    // Update referral stats
    document.getElementById('invited-count').textContent = userData.invitedFriends;
    document.getElementById('referral-earnings').textContent = userData.referralEarnings;
}

function updateUI() {
    // Update points display
    document.getElementById('points-count').textContent = userData.points;
    
    // Update user level (simplified calculation)
    const newLevel = Math.floor(userData.points / 100) + 1;
    if (newLevel !== userData.level) {
        userData.level = newLevel;
        saveUserData();
    }
    document.getElementById('user-level').textContent = userData.level;
    
    // Update referral stats
    document.getElementById('invited-count').textContent = userData.invitedFriends;
    document.getElementById('referral-earnings').textContent = userData.referralEarnings;
    
    // Update achievements progress
    updateAchievementsProgress();
}

function updateAchievementsProgress() {
    // First game achievement
    const firstGameProgress = userData.gamesPlayed.length > 0 ? 100 : 0;
    document.querySelectorAll('.progress-fill')[0].style.width = `${firstGameProgress}%`;
    
    // Game collector achievement (play 5 games)
    const collectorProgress = Math.min((userData.gamesPlayed.length / 5) * 100, 100);
    document.querySelectorAll('.progress-fill')[1].style.width = `${collectorProgress}%`;
}

function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ru';
}

function loadLanguagePreference() {
    const savedLang = localStorage.getItem('language') || 'ru';
    setLanguage(savedLang);
    updateSettingsLanguageOptions(savedLang);
}

function updateSettingsLanguageOptions(lang) {
    const languageOptions = document.querySelectorAll('.language-option');
    
    languageOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });
}

function showNotification(notification, customMessage) {
    if (customMessage) {
        notification.textContent = customMessage;
    }
    
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function trackUserAction(action, data = {}) {
    // In a real app, send this to your analytics
    console.log('Track:', action, data);
    
    // Example with backend API:
    // fetch('/api/track', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         action,
    //         data,
    //         userId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
    //         timestamp: new Date().toISOString()
    //     })
    // });
}
