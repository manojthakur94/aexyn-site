// Environment Configuration Template
window.AEXYN_CONFIG = {
    // Development Configuration
    development: {
        baseUrl: 'http://127.0.0.1:5500/',
        environment: 'development'
    },
    
    // Production Configuration  
    production: {
        baseUrl: 'https://your-project-id.web.app/',
        environment: 'production'
    },
    
    // Preview Configuration (for PR deployments)
    preview: {
        baseUrl: 'https://your-project-id.web.app/',
        environment: 'preview'
    },
    
    // Current Environment - This will be set dynamically
    currentEnv: 'development'
};

// Get current configuration
window.AEXYN_CONFIG.current = window.AEXYN_CONFIG[window.AEXYN_CONFIG.currentEnv];

// Set base href dynamically
(function() {
    // Auto-detect environment based on current URL
    const currentHost = window.location.hostname;
    const currentOrigin = window.location.origin + '/';
    
    // Detect if this is a Firebase preview URL (contains -- pattern)
    const isFirebasePreview = currentHost.includes('--') && currentHost.includes('.web.app');
    const isLocalDev = currentHost === '127.0.0.1' || currentHost === 'localhost';
    
    let detectedEnv = window.AEXYN_CONFIG.currentEnv;
    let actualBaseUrl = window.AEXYN_CONFIG.current.baseUrl;
    
    // Override environment detection for dynamic URLs
    if (isLocalDev) {
        detectedEnv = 'development';
        actualBaseUrl = window.AEXYN_CONFIG.development.baseUrl;
    } else if (isFirebasePreview) {
        detectedEnv = 'preview';
        actualBaseUrl = currentOrigin; // Use the actual preview URL
        console.log('🔍 Auto-detected Firebase preview deployment');
    } else if (currentHost.includes('.web.app') || currentHost.includes('.firebaseapp.com')) {
        detectedEnv = 'production';
        actualBaseUrl = currentOrigin;
    }
    
    // Update current config
    window.AEXYN_CONFIG.currentEnv = detectedEnv;
    window.AEXYN_CONFIG.current = {
        baseUrl: actualBaseUrl,
        environment: detectedEnv
    };
    
    // Create or update base tag
    let baseTag = document.querySelector('base[href]');
    if (!baseTag) {
        baseTag = document.createElement('base');
        document.head.insertBefore(baseTag, document.head.firstChild);
    }
    baseTag.href = actualBaseUrl;
    
    // Optional: Log current environment for debugging
    console.log('🌐 Aexyn Site Environment:', detectedEnv);
    console.log('📍 Base URL:', actualBaseUrl);
    console.log('🔗 Current host:', currentHost);
    
    // Add environment indicator for previews
    if (detectedEnv === 'preview') {
        console.log('🔍 This is a PR preview deployment');
        // Add visual indicator for preview
        const previewBadge = document.createElement('div');
        previewBadge.innerHTML = '🔍 PR Preview';
        previewBadge.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 9999;
            background: #ff9800; color: white; padding: 5px 10px;
            border-radius: 4px; font-size: 12px; font-family: monospace;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(previewBadge);
    }
})(); 