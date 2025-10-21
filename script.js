document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupGameCards();
    setupExchangeCards();
    setupThemeToggle();
    setupShareButton();
    setupEarnCategories();
    setupReferralSystem();
    
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

function setupThemeToggle() {
    const themeButton = document.getElementById('theme-button');
    const body = document.body;
    
    if (themeButton) {
        themeButton.addEventListener('click', function() {
            body.classList.toggle('dark-theme');
            
            // Update button text and icon
            const themeIcon = this.querySelector('.action-icon');
            const themeText = this.querySelector('span:last-child');
            
            if (body.classList.contains('dark-theme')) {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Светлая тема';
            } else {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Темная тема';
            }
        });
    }
}

function setupShareButton() {
    const shareButton = document.getElementById('share-button');
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
                    showNotification(notification, 'Ссылка скопирована в буфер обмена!');
                }).catch(() => {
                    // Fallback for older browsers
                    try {
                        const textArea = document.createElement('textarea');
                        textArea.value = shareUrl;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        showNotification(notification, 'Ссылка скопирована в буфер обмена!');
                    } catch (err) {
                        console.error('Copy failed:', err);
                        showNotification(notification, 'Не удалось скопировать ссылку');
                    }
                });
            }
        });
    }
}

function setupEarnCategories() {
    const chips = document.querySelectorAll('.category-chip');
    const contents = document.querySelectorAll('.category-content');
    
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active chip
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('data-category') === category) {
                    content.classList.add('active');
                }
            });
        });
    });
}

function setupReferralSystem() {
    const referralButton = document.getElementById('copy-referral');
    const notification = document.getElementById('notification');
    
    if (referralButton) {
        referralButton.addEventListener('click', function() {
            const referralCode = 'GAMESVERSE123'; // Генерируйте уникальный код
            const referralUrl = `https://t.me/your_bot?start=${referralCode}`;
            
            navigator.clipboard.writeText(referralUrl).then(() => {
                showNotification(notification, 'Реферальная ссылка скопирована!');
            }).catch(() => {
                // Fallback for older browsers
                try {
                    const textArea = document.createElement('textarea');
                    textArea.value = referralUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showNotification(notification, 'Реферальная ссылка скопирована!');
                } catch (err) {
                    console.error('Copy failed:', err);
                    showNotification(notification, 'Не удалось скопировать ссылку');
                }
            });
        });
    }
}

function showNotification(notification, message) {
    if (message) {
        notification.textContent = message;
    }
    
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}
