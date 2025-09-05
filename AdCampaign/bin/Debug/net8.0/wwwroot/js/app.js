// App State Management and Utilities
// Global application state
window.appState = {
    url: "",
    projectName: "Akıllı Lens Ameliyatı – Göz İçi Mercek",
    goal: "Traffic", // Traffic | Leads | Sales
    cta: "Daha Fazla Bilgi",
    startAt: "",
    endAt: "",
    locations: ["Turkey", "Istanbul"],
    budget: 30,
    assetsCount: 10,
    adsets: [],
    analysis: {}
};

// State management functions
function loadState() {
    try {
        const saved = localStorage.getItem('appState');
        return saved ? { ...window.appState, ...JSON.parse(saved) } : window.appState;
    } catch (error) {
        console.error('Error loading state:', error);
        return window.appState;
    }
}

function saveState(updates) {
    try {
        const currentState = loadState();
        const newState = { ...currentState, ...updates };
        localStorage.setItem('appState', JSON.stringify(newState));
        
        // Update global state
        Object.assign(window.appState, newState);
        
        // Dispatch custom event for state changes
        window.dispatchEvent(new CustomEvent('stateChanged', { 
            detail: { oldState: currentState, newState: newState } 
        }));
        
        return newState;
    } catch (error) {
        console.error('Error saving state:', error);
        return loadState();
    }
}

function resetState() {
    localStorage.removeItem('appState');
    Object.assign(window.appState, {
        url: "",
        projectName: "Akıllı Lens Ameliyatı – Göz İçi Mercek",
        goal: "Traffic",
        cta: "Daha Fazla Bilgi",
        startAt: "",
        endAt: "",
        locations: ["Turkey", "Istanbul"],
        budget: 30,
        assetsCount: 10,
        adsets: [],
        analysis: {}
    });
}

// Validation functions
function validateUrl(url) {
    if (!url || typeof url !== 'string') return false;
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

function validateDates(startDate, endDate) {
    if (!startDate || !endDate) return false;
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();
        
        // Check if dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
        
        // End date must be >= start date
        return end >= start && start >= now.setHours(0, 0, 0, 0);
    } catch (error) {
        return false;
    }
}

function validateBudget(budget) {
    const num = parseFloat(budget);
    return !isNaN(num) && num >= 10;
}

function validateLocations(locations) {
    return Array.isArray(locations) && locations.length > 0;
}

// Utility functions
function formatCurrency(amount, currency = 'USD') {
    const formatters = {
        USD: (num) => `$${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        TRY: (num) => `₺${num.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        EUR: (num) => `€${num.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    };
    
    return formatters[currency] ? formatters[currency](amount) : `$${amount}`;
}

function formatNumber(num, decimals = 0) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(decimals) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(decimals) + 'K';
    }
    return num.toLocaleString();
}

function formatDate(date, locale = 'tr-TR') {
    try {
        return new Date(date).toLocaleDateString(locale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        return date;
    }
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Form helpers
function bindFormToState(formId, stateKeys) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const state = loadState();
    
    // Populate form with state
    stateKeys.forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input && state[key] !== undefined) {
            if (input.type === 'checkbox') {
                input.checked = !!state[key];
            } else if (input.type === 'radio') {
                const radio = form.querySelector(`[name="${key}"][value="${state[key]}"]`);
                if (radio) radio.checked = true;
            } else {
                input.value = state[key];
            }
        }
    });
    
    // Bind form changes to state
    form.addEventListener('change', function(e) {
        const { name, value, type, checked } = e.target;
        if (stateKeys.includes(name)) {
            const newValue = type === 'checkbox' ? checked : 
                           type === 'number' ? parseFloat(value) || 0 : value;
            saveState({ [name]: newValue });
        }
    });
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Animation helpers
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    const start = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    const start = performance.now();
    const startOpacity = parseFloat(element.style.opacity) || 1;
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = startOpacity * (1 - progress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// Page transition helper
function navigateWithTransition(url, delay = 0) {
    if (delay > 0) {
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    } else {
        window.location.href = url;
    }
}

// URL parameter helpers
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

function updateUrlParams(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.replaceState({}, '', url);
}

// Initialize state on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load saved state
    Object.assign(window.appState, loadState());
    
    // Initialize any page-specific functionality
    const path = window.location.pathname;
    switch(path) {
        case '/':
            initHomePage();
            break;
        case '/analyze':
            initAnalyzePage();
            break;
        case '/setup/summary':
        case '/setup/competitors':
            initSetupPage();
            break;
        case '/adsets':
            initAdSetsPage();
            break;
        case '/forecast':
            initForecastPage();
            break;
    }
});

// Page-specific initialization functions
function initHomePage() {
    const urlInput = document.getElementById('url-input');
    if (urlInput) {
        urlInput.value = window.appState.url || '';
        urlInput.addEventListener('input', debounce(function(e) {
            saveState({ url: e.target.value });
        }, 300));
    }
}

function initAnalyzePage() {
    // Initialize analysis page functionality
    console.log('Analyze page initialized');
}

function initSetupPage() {
    // Initialize setup page functionality
    console.log('Setup page initialized');
}

function initAdSetsPage() {
    // Initialize ad sets page functionality
    console.log('AdSets page initialized');
}

function initForecastPage() {
    // Initialize forecast page functionality
    console.log('Forecast page initialized');
}

// Export global functions
window.loadState = loadState;
window.saveState = saveState;
window.resetState = resetState;
window.validateUrl = validateUrl;
window.validateDates = validateDates;
window.validateBudget = validateBudget;
window.validateLocations = validateLocations;
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;
window.formatDate = formatDate;
window.generateId = generateId;
window.bindFormToState = bindFormToState;
window.debounce = debounce;
window.fadeIn = fadeIn;
window.fadeOut = fadeOut;
window.navigateWithTransition = navigateWithTransition;