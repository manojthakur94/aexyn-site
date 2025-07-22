# 🎯 Single Firebase Project Setup Guide

## Overview

**Approach**: One Firebase project with **two hosting sites**
- **Production Site**: `aexyn-site` → `https://aexyn-site.web.app`
- **Development Site**: `aexyn-site-dev` → `https://aexyn-site-dev.web.app`

**Benefits**: 
- ✅ Cost-effective (single project)
- ✅ Shared resources (database, functions, etc.)
- ✅ Simpler billing and management

## 🔧 Setup Steps

### 1. **Create Firebase Project**
```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create project (if not exists)
firebase projects:create aexyn-site
```

### 2. **Create Two Hosting Sites**

In Firebase Console:
1. Go to **Hosting** → **Get started**
2. After creating the first site (`aexyn-site`), create a second site:
   - Click **"Add another site"**
   - Enter site ID: `aexyn-site-dev`

Or via CLI:
```bash
# Select your project
firebase use aexyn-site

# Create the additional hosting site
firebase hosting:sites:create aexyn-site-dev
```

### 3. **Configure Hosting Targets**
```bash
# Set up hosting targets
firebase target:apply hosting production aexyn-site
firebase target:apply hosting development aexyn-site-dev
```

### 4. **Verify Configuration**

Your `.firebaserc` should look like:
```json
{
  "projects": {
    "default": "aexyn-site"
  },
  "targets": {
    "aexyn-site": {
      "hosting": {
        "production": ["aexyn-site"],
        "development": ["aexyn-site-dev"]
      }
    }
  }
}
```

### 5. **Set GitHub Secrets**

Only **2 secrets needed**:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `FIREBASE_PROJECT_ID` | `aexyn-site` | Your Firebase project ID |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | JSON content | Service account for deployments |

**Direct link**: [GitHub Secrets Settings](https://github.com/aexyn-contact/aexyn-website/settings/secrets/actions)

### 6. **Generate Service Account Key**

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click **"Generate new private key"**
3. Copy the **entire JSON content**
4. Add to GitHub secret `FIREBASE_SERVICE_ACCOUNT_KEY`

## 🚀 Deployment Configuration

### Automatic Deployments
| Branch | Target | URL | Environment |
|--------|--------|-----|-------------|
| `main` | `production` | `https://aexyn-site.web.app` | Production |
| `dev` | `development` | `https://aexyn-site-dev.web.app` | Development |

### Manual Deployments
```bash
# Deploy to production
npm run firebase:deploy

# Deploy to development  
npm run firebase:deploy:dev

# Deploy to both
firebase deploy
```

## 🔍 Verification

### Test Local Setup
```bash
# Build for development
npm run build:dev

# Build for production  
npm run build:prod

# Test Firebase targets
firebase hosting:sites:list
```

**Expected output**:
```
Site ID: aexyn-site (default site)
Site ID: aexyn-site-dev
```

### Test Deployments
```bash
# Test development deployment
git checkout dev
git commit --allow-empty -m "Test dev deployment"
git push origin dev

# Test production deployment  
git checkout main
git commit --allow-empty -m "Test prod deployment"
git push origin main
```

## 📊 Firebase Console Access

- **Project Overview**: `https://console.firebase.google.com/project/aexyn-site`
- **Hosting Dashboard**: `https://console.firebase.google.com/project/aexyn-site/hosting`
- **Site Management**: View both sites in the hosting section

## 🎯 Expected Workflow Results

### Development Pipeline Success
```
✅ Development Deployment Complete
✅ Dev URL: https://aexyn-site-dev.web.app
✅ Target: development (aexyn-site-dev)
✅ Project ID: aexyn-site
```

### Production Pipeline Success
```  
✅ Production Deployment Complete
✅ Live URL: https://aexyn-site.web.app
✅ Target: production (aexyn-site)
✅ Project ID: aexyn-site
```

## 🛠️ Configuration Files

### Firebase.json Structure
```json
{
  "hosting": [
    {
      "target": "production",
      "public": "."
    },
    {
      "target": "development", 
      "public": "."
    }
  ]
}
```

### .firebaserc Structure
```json
{
  "projects": {
    "default": "aexyn-site"
  },
  "targets": {
    "aexyn-site": {
      "hosting": {
        "production": ["aexyn-site"],
        "development": ["aexyn-site-dev"]
      }
    }
  }
}
```

## 🔧 Troubleshooting

### Common Issues

**Issue**: `Target "development" not found`
```bash
# Solution: Apply hosting targets
firebase target:apply hosting development aexyn-site-dev
```

**Issue**: `Site "aexyn-site-dev" not found`
```bash
# Solution: Create the site
firebase hosting:sites:create aexyn-site-dev
```

**Issue**: Deployment fails with permission errors
- Check service account has **Firebase Hosting Admin** role
- Verify service account JSON is complete in GitHub secret

### Validate Setup
```bash
# Check Firebase project
firebase projects:list

# Check hosting sites
firebase hosting:sites:list

# Check targets
firebase target
```

## ✅ Benefits Achieved

| Benefit | Description |
|---------|-------------|
| **Single Project** | One Firebase project to manage |
| **Cost Effective** | Shared quotas and billing |
| **Dual Environments** | Separate URLs for dev and prod |
| **Simple CI/CD** | Same workflows, different targets |
| **Easy Management** | All resources in one console |

---

**Result**: Clean, cost-effective dual environment setup with proper separation! 🎉 