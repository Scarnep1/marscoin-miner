document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Translations object
const translations = {
    ru: {
        appTitle: "Games Verse",
        settings: "Настройки",
        theme: "Тема",
        lightTheme: "Светлая",
        darkTheme: "Темная",
        language: "Язык",
        russian: "Русский",
        english: "English",
        done: "Готово",
        games: "Игры",
        bestGames: "Лучшие игры Telegram",
        hamsterGameDevDesc: "Создай свою студию",
        hamsterKingDesc: "Стань королем хомяков",
        hamsterFightClubDesc: "Бойцовский клуб хомяков",
        bitquestDesc: "Приключения в мире крипты",
        play: "Играть",
        exchanges: "Биржи",
        exchangesDesc: "Торгуйте криптовалютами безопасно",
        binanceDesc: "Крупнейшая мировая биржа",
        bybitDesc: "Продвинутая торговая платформа",
        okxDesc: "Надежная и безопасная",
        kucoinDesc: "Множество торговых пар",
        user: "Пользователь",
        shareWithFriends: "Поделиться с друзьями",
        profile: "Профиль",
        linkCopied: "Ссылка скопирована в буфер обмена!"
    },
    en: {
        appTitle: "Games Verse",
        settings: "Settings",
        theme: "Theme",
        lightTheme: "Light",
        darkTheme: "Dark",
        language: "Language",
        russian: "Русский",
        english: "English",
        done: "Done",
        games: "Games",
        bestGames: "Best Telegram Games",
        hamsterGameDevDesc: "Create your own studio",
        hamsterKingDesc: "Become the hamster king",
        hamsterFightClubDesc: "Hamster fighting club",
        bitquestDesc: "Adventures in the crypto world",
        play: "Play",
        exchanges: "Exchanges",
        exchangesDesc: "Trade cryptocurrencies safely",
        binanceDesc: "Largest global exchange",
        bybitDesc: "Advanced trading platform",
        okxDesc: "Reliable and secure",
        kucoinDesc: "Multiple trading pairs",
        user: "User",
        shareWithFriends: "Share with friends",
        profile: "Profile",
        linkCopied: "Link copied to clipboard!"
    }
};

function initializeApp() {
    setupNavigation();
    setupGameCards();
    setupExchangeCards();
    setupSettingsPanel();
    loadThemePreference();
    loadLanguagePreference();
    loadUserData();
    
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
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
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
        });
    });
}

function setupGameCards() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            const botUsername = this.getAttribute('data-bot');
            if (botUsername) {
                const telegramUrl = `https://t.me/${botUsername}`;
                
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.openTelegramLink(telegramUrl);
                } else {
                    window.open(telegramUrl, '_blank');
                }
            }
        });
        
        // Also make the play button work
        const playButton = card.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent triggering the card click event twice
                const botUsername = card.getAttribute('data-bot');
                if (botUsername) {
                    const telegramUrl = `https://t.me/${botUsername}`;
                    
                    if (window.Telegram && window.Telegram.WebApp) {
                        window.Telegram.WebApp.openTelegramLink(telegramUrl);
                    } else {
                        window.open(telegramUrl, '_blank');
                    }
                }
            });
        }
    });
}

function setupExchangeCards() {
    const exchangeCards = document.querySelectorAll('.exchange-card');
    
    exchangeCards.forEach(card => {
        card.addEventListener('click', function() {
            const exchangeUrl = this.getAttribute('data-url');
            if (exchangeUrl) {
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.openLink(exchangeUrl);
                } else {
                    window.open(exchangeUrl, '_blank');
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
            settingsPanel.classList.add('active');
        });
    }
    
    if (closeSettings) {
        closeSettings.addEventListener('click', function() {
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
    
    // Theme switcher in settings
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Update active state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Apply theme
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
            
            // Save to localStorage
            localStorage.setItem('theme', theme);
        });
    });
    
    // Language switcher in settings
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Update active state
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Change language
            setLanguage(lang);
            
            // Save to localStorage
            localStorage.setItem('language', lang);
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

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    updateSettingsThemeOptions();
}

function loadLanguagePreference() {
    const savedLang = localStorage.getItem('language') || 'ru';
    setLanguage(savedLang);
    updateSettingsLanguageOptions(savedLang);
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

function updateSettingsLanguageOptions(lang) {
    const languageOptions = document.querySelectorAll('.language-option');
    
    languageOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });
}

function loadUserData() {
    // Try to get user data from Telegram Web App
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

function setupShareButton() {
    const shareButton = document.getElementById('share-friends-button');
    const notification = document.getElementById('notification');
    
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            const shareUrl = window.location.href;
            
            // Check if Web Share API is available
            if (navigator.share) {
                navigator.share({
                    title: 'Games Verse',
                    text: 'Открой для себя лучшие игры Telegram в одном приложении!',
                    url: shareUrl,
                })
                .then(() => console.log('Успешный шаринг'))
                .catch((error) => console.log('Ошибка шаринга', error));
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(shareUrl).then(() => {
                    showNotification(notification);
                }).catch(() => {
                    // Fallback for older browsers
                    try {
                        const textArea = document.createElement('textarea');
                        textArea.value = shareUrl;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        showNotification(notification);
                    } catch (err) {
                        console.error('Copy failed:', err);
                        showNotification(notification, 'Не удалось скопировать ссылку');
                    }
                });
            }
        });
    }
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
