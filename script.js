document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupGameCards();
    setupExchangeCards();
    setupThemeToggle();
    setupShareButton();
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
                const telegramUrl = `https://t.me/${botUsername}?start=ref_gamesverse`;
                
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
                    const telegramUrl = `https://t.me/${botUsername}?start=ref_gamesverse`;
                    
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
            const exchangeUrl = this.getAttribute('data-url') + '?ref=gamesverse';
            if (exchangeUrl) {
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.openLink(exchangeUrl);
                } else {
                    window.open(exchangeUrl, '_blank');
                }
            }
        });
        
        // Also make the exchange button work
        const exchangeButton = card.querySelector('.exchange-button');
        if (exchangeButton) {
            exchangeButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent triggering the card click event twice
                const exchangeUrl = card.getAttribute('data-url') + '?ref=gamesverse';
                if (exchangeUrl) {
                    if (window.Telegram && window.Telegram.WebApp) {
                        window.Telegram.WebApp.openLink(exchangeUrl);
                    } else {
                        window.open(exchangeUrl, '_blank');
                    }
                }
            });
        }
    });
}

function setupThemeToggle() {
    const themeButton = document.getElementById('theme-button');
    const body = document.body;
    
    if (themeButton) {
        themeButton.addEventListener('click', function() {
            body.classList.toggle('dark-theme');
            
            // Update button text and icon
            const themeIcon = this.querySelector('.action-icon i');
            const themeText = this.querySelector('.action-text');
            
            if (body.classList.contains('dark-theme')) {
                themeIcon.className = 'fas fa-sun';
                themeText.textContent = 'Светлая тема';
            } else {
                themeIcon.className = 'fas fa-moon';
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
            const shareText = 'Открой для себя лучшие игры Telegram и торговые платформы с реферальной программой в одном приложении!';
            
            // Check if Web Share API is available
            if (navigator.share) {
                navigator.share({
                    title: 'Games Verse',
                    text: shareText,
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

function setupReferralSystem() {
    const referralButton = document.getElementById('copy-referral');
    const notification = document.getElementById('notification');
    
    if (referralButton) {
        referralButton.addEventListener('click', function() {
            const referralCode = 'ref_gamesverse_12345';
            const referralUrl = `https://t.me/gamesverse_bot?start=${referralCode}`;
            
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
        notification.querySelector('.notification-text').textContent = message;
    }
    
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
