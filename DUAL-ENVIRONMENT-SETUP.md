# Dual Environment CI/CD Setup

## 🎯 Overview

This project now uses a simplified CI/CD setup with two environments:
- **Production** (`main` branch) → `aexyn-site.web.app`
- **Development** (`dev` branch) → `aexyn-site-dev.web.app`

**Removed**: PR preview deployments for simplified workflow

## 🌐 Environment Configuration

### Branches & Deployments
| Branch | Environment | Domain | Workflow |
|--------|-------------|---------|----------|
| `main`, `master` | Production | `https://aexyn-site.web.app` | `firebase-hosting-merge.yml` |
| `dev`, `develop`, `development` | Development | `https://aexyn-site-dev.web.app` | `firebase-hosting-dev.yml` |

### Base URL Handling
- **Production**: Uses absolute URLs for all assets
- **Development**: Uses environment-specific base URL
- **Local**: Uses relative paths

## 🚀 Workflow Features

### Production Pipeline (`main` branch)
```yaml
Environment: production
BASE_URL: https://aexyn-site.web.app
Build Command: npm run build:prod
```

**Stages:**
1. 🔧 Environment Setup (Node.js 20)
2. 📦 Dependencies Installation & Caching
3. 🏗️ Production Build (with absolute URLs)
4. 🔍 Quality Checks
5. 🚀 Firebase Deployment
6. ✅ Live Site Verification

### Development Pipeline (`dev` branch)
```yaml
Environment: development
BASE_URL: https://aexyn-site-dev.web.app
Build Command: npm run build:dev
```

**Stages:**
1. 🔧 Environment Setup (Node.js 20)
2. 📦 Dependencies Installation & Caching
3. 🏗️ Development Build
4. 🔍 Quality Checks
5. 🚀 Firebase Deployment (Dev Project)
6. ✅ Development Site Verification

## ⚙️ Configuration Files

### `.firebaserc` - Multi-Environment
```json
{
  "projects": {
    "default": "aexyn-site",
    "prod": "aexyn-site", 
    "dev": "aexyn-site-dev"
  },
  "targets": {
    "aexyn-site": {
      "hosting": { "production": ["aexyn-site"] }
    },
    "aexyn-site-dev": {
      "hosting": { "development": ["aexyn-site-dev"] }
    }
  }
}
```

### Package.json Scripts
```json
{
  "build": "node build-site.js",
  "build:dev": "cross-env NODE_ENV=development node build-site.js",
  "build:prod": "cross-env NODE_ENV=production node build-site.js",
  "dev": "npm run build:dev && npm run serve",
  "firebase:deploy": "npm run build:prod && firebase deploy",
  "firebase:deploy:dev": "npm run build:dev && firebase deploy --project dev"
}
```

## 🔐 Required GitHub Secrets

| Secret | Description | Used By |
|--------|-------------|---------|
| `FIREBASE_PROJECT_ID` | Production Firebase project ID (`aexyn-site`) | Production workflow |
| `FIREBASE_DEV_PROJECT_ID` | Development Firebase project ID (`aexyn-site-dev`) | Development workflow |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Service account JSON (same for both) | Both workflows |

## 🏗️ Build Process

### Environment Variables
- `NODE_ENV`: `production` or `development`
- `BASE_URL`: Full domain URL for the target environment

### Asset URL Resolution
```javascript
// Development: Relative paths
<link href="css/style.css" rel="stylesheet">

// Production: Absolute URLs  
<link href="https://aexyn-site.web.app/css/style.css" rel="stylesheet">
```

### Template Variables
- `{{basePath}}`: Relative path to root
- `{{baseUrl}}`: Full domain URL (production only)
- `{{nodeEnv}}`: Current environment

## 📋 Setup Steps

### 1. Create Firebase Projects
```bash
# Production project
firebase projects:create aexyn-site

# Development project  
firebase projects:create aexyn-site-dev
```

### 2. Initialize Hosting
```bash
# Production
firebase use aexyn-site
firebase hosting:sites:create aexyn-site

# Development
firebase use aexyn-site-dev
firebase hosting:sites:create aexyn-site-dev
```

### 3. Configure GitHub Secrets
Add these secrets to your GitHub repository:
- `FIREBASE_PROJECT_ID`: `aexyn-site`
- `FIREBASE_DEV_PROJECT_ID`: `aexyn-site-dev`
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Service account JSON

### 4. Update Domain Configuration
Update any hardcoded domain references in your content to use:
- `{{baseUrl}}` for full URLs
- `{{basePath}}` for relative paths

## 🔄 Development Workflow

### Feature Development
```bash
# Work on dev branch
git checkout dev
git pull origin dev

# Make changes
# Commit and push
git push origin dev  # Triggers dev deployment
```

### Production Release
```bash
# Merge dev to main
git checkout main
git merge dev
git push origin main  # Triggers production deployment
```

### Local Development
```bash
# Development build with relative paths
npm run dev

# Test production build locally
npm run build:prod
npm run serve
```

## 🎯 Benefits

✅ **Simplified workflow** - No PR previews to manage
✅ **Environment parity** - Dev and prod use same build process
✅ **URL consistency** - Proper base URL handling
✅ **Cost effective** - Only two environments to maintain
✅ **Clear separation** - Distinct domains for each environment
✅ **Fast deployments** - Optimized build process

## 🔍 Monitoring & Verification

### Deployment Status
- **Production**: Check `https://aexyn-site.web.app`
- **Development**: Check `https://aexyn-site-dev.web.app`

### Build Logs
- View in GitHub Actions → Workflows
- Production: "🚀 Production Pipeline"
- Development: "🔧 Development Pipeline"

### Firebase Console
- Production: `https://console.firebase.google.com/project/aexyn-site`
- Development: `https://console.firebase.google.com/project/aexyn-site-dev`

---

*Simplified dual-environment setup for efficient development and deployment workflows.* 