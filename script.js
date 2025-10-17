document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupGameCards();
    setupExchangeCards();
    setupReferralLink();
    setupBalanceRefresh();
    
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

function setupReferralLink() {
    const copyBtn = document.getElementById('copy-btn');
    const referralInput = document.getElementById('referral-input');
    const notification = document.getElementById('notification');
    
    if (copyBtn && referralInput && notification) {
        copyBtn.addEventListener('click', function() {
            referralInput.select();
            referralInput.setSelectionRange(0, 99999);
            
            navigator.clipboard.writeText(referralInput.value).then(() => {
                showNotification(notification);
            }).catch(() => {
                // Fallback for older browsers
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

function showNotification(notification) {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function setupBalanceRefresh() {
    const refreshBtn = document.querySelector('.balance-refresh');
    const balanceAmount = document.querySelector('.amount');
    
    if (refreshBtn && balanceAmount) {
        refreshBtn.addEventListener('click', function() {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'rotate(360deg)';
            
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
                
                const currentBalance = parseInt(balanceAmount.textContent.replace(',', ''));
                const randomChange = Math.floor(Math.random() * 10) - 5;
                const newBalance = Math.max(0, currentBalance + randomChange);
                
                balanceAmount.textContent = newBalance.toLocaleString();
                
                const usdValue = (newBalance * 0.01).toFixed(2);
                const usdElement = document.querySelector('.balance-equivalent');
                if (usdElement) {
                    usdElement.textContent = `≈ $${usdValue}`;
                }
            }, 1000);
        });
    }
}

// Simulate user activity for demo
function simulateUserActivity() {
    const balanceElement = document.querySelector('.amount');
    if (!balanceElement) return;

    setInterval(() => {
        const currentBalance = parseInt(balanceElement.textContent.replace(',', ''));
        const randomIncrease = Math.floor(Math.random() * 3);
        const newBalance = currentBalance + randomIncrease;
        
        balanceElement.textContent = newBalance.toLocaleString();
        
        const usdValue = (newBalance * 0.01).toFixed(2);
        const usdElement = document.querySelector('.balance-equivalent');
        if (usdElement) {
            usdElement.textContent = `≈ $${usdValue}`;
        }
    }, 30000);
}

// Start simulation after delay
setTimeout(simulateUserActivity, 5000);
