document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupGameCards();
    setupEarningCards();
    setupReferralSystem();
    setupThemeToggle();
    
    // Telegram Web App integration
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
        applyTelegramTheme();
    }
}

function applyTelegramTheme() {
    if (window.Telegram && window.Telegram.WebApp) {
        const themeParams = window.Telegram.WebApp.themeParams;
        if (themeParams) {
            // Apply Telegram theme if needed
            if (window.Telegram.WebApp.colorScheme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
                updateThemeButton('dark');
            }
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
                openTelegramLink(`https://t.me/${botUsername}`);
            }
        });
    });
}

function setupEarningCards() {
    const exchangeCards = document.querySelectorAll('.exchange-card');
    const earningCards = document.querySelectorAll('.earning-card');
    
    exchangeCards.forEach(card => {
        card.addEventListener('click', function() {
            const exchangeUrl = this.getAttribute('data-url');
            if (exchangeUrl) {
                openExternalLink(exchangeUrl);
            }
        });
    });
    
    earningCards.forEach(card => {
        card.addEventListener('click', function() {
            const botUsername = this.getAttribute('data-bot');
            if (botUsername) {
                openTelegramLink(`https://t.me/${botUsername}`);
            }
        });
    });
}

function setupReferralSystem() {
    const copyBtn = document.getElementById('copy-btn');
    const referralInput = document.getElementById('referral-input');
    const shareButton = document.getElementById('share-button');
    const notification = document.getElementById('notification');
    
    if (copyBtn && referralInput) {
        copyBtn.addEventListener('click', function() {
            copyToClipboard(referralInput.value, notification);
        });
    }
    
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            shareReferralLink(referralInput.value, notification);
        });
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.setAttribute('data-theme', 'dark');
        updateThemeButton('dark');
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });
}

function updateThemeButton(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

function openTelegramLink(url) {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink(url);
    } else {
        window.open(url, '_blank');
    }
}

function openExternalLink(url) {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openLink(url);
    } else {
        window.open(url, '_blank');
    }
}

function copyToClipboard(text, notification) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(notification, 'Ссылка скопирована в буфер обмена!');
    }).catch(() => {
        // Fallback for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
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

function shareReferralLink(url, notification) {
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'Games Verse - Лучшие игры Telegram',
            text: 'Присоединяйся к Games Verse и получай бонусы за игры!',
            url: url,
        })
        .then(() => console.log('Успешный шаринг'))
        .catch((error) => {
            console.log('Ошибка шаринга', error);
            copyToClipboard(url, notification);
        });
    } else {
        // Fallback to copy
        copyToClipboard(url, notification);
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

// Simulate user activity for demo
function simulateUserActivity() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    setInterval(() => {
        // Randomly increase referral stats
        const randomIncrease = Math.floor(Math.random() * 2);
        const currentStat = parseInt(statNumbers[0].textContent);
        statNumbers[0].textContent = currentStat + randomIncrease;
        
        // Also increase bonus points
        const bonusIncrease = Math.floor(Math.random() * 5);
        const currentBonus = parseInt(statNumbers[1].textContent);
        statNumbers[1].textContent = currentBonus + bonusIncrease;
    }, 30000);
}

// Start simulation after delay
setTimeout(simulateUserActivity, 10000);
