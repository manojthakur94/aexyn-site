// Environment Configuration
window.AEXYN_CONFIG = {
    // Development Configuration
    development: {
        baseUrl: 'http://127.0.0.1:5500/',
        environment: 'development'
    },
    
    // Production Configuration  
    production: {
        baseUrl: 'https://manojthakur94.github.io/aexyn-site/',
        environment: 'production'
    },
    
    // Current Environment - Change this to switch between dev/prod
    currentEnv: 'development'
};

// Get current configuration
window.AEXYN_CONFIG.current = window.AEXYN_CONFIG[window.AEXYN_CONFIG.currentEnv];

// Set base href dynamically
(function() {
    // Create or update base tag
    let baseTag = document.querySelector('base[href]');
    if (!baseTag) {
        baseTag = document.createElement('base');
        document.head.insertBefore(baseTag, document.head.firstChild);
    }
    baseTag.href = window.AEXYN_CONFIG.current.baseUrl;
    
    // Optional: Log current environment for debugging
    console.log('Aexyn Site Environment:', window.AEXYN_CONFIG.current.environment);
    console.log('Base URL:', window.AEXYN_CONFIG.current.baseUrl);
})(); 