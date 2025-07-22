# CI/CD Quick Reference

> **Repository**: This CI/CD is configured for `aexyn-contact/aexyn-website` only

## 🚀 Deployment Status

Add these badges to your README.md:

```markdown
![Production Deploy](https://github.com/aexyn-contact/aexyn-website/actions/workflows/firebase-hosting-merge.yml/badge.svg)
![Development Deploy](https://github.com/aexyn-contact/aexyn-website/actions/workflows/firebase-hosting-dev.yml/badge.svg)
```

## 📋 Workflow Triggers

| Action | Trigger | Result |
|--------|---------|---------|
| Push to `main`/`master` | Production deployment | Live site updated at `aexyn-site.web.app` |
| Push to `dev`/`develop` | Development deployment | Dev site updated at `aexyn-site-dev.web.app` |
| Manual trigger | `workflow_dispatch` | Manual deployment |

**Removed**: PR preview deployments for simplified workflow

## 🔧 Local Commands

```bash
# Development
npm run dev                    # Build dev + serve locally (http-server)
npm run watch                  # Auto-rebuild on changes (dev)
npm run firebase:serve         # Test with Firebase emulator

# Build Commands
npm run build                  # Build static site (default)
npm run build:dev             # Build for development environment
npm run build:prod            # Build for production environment

# Deployment
npm run firebase:deploy        # Deploy to production (build:prod)
npm run firebase:deploy:dev    # Deploy to development
```

## 🌐 URLs

- **Production**: `https://aexyn-site.web.app`
- **Development**: `https://aexyn-site-dev.web.app`
- **Custom Domain**: Configure in Firebase Console

## 🔐 Required Secrets

| Secret Name | Description |
|-------------|-------------|
| `FIREBASE_PROJECT_ID` | Production Firebase project ID (`aexyn-site`) |
| `FIREBASE_DEV_PROJECT_ID` | Development Firebase project ID (`aexyn-site-dev`) |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase service account JSON (shared) |

## 📁 Key Files

| File | Purpose |
|------|---------|
| `firebase.json` | Hosting configuration |
| `.firebaserc` | Multi-environment project configuration |
| `.github/workflows/firebase-hosting-merge.yml` | Production deployment |
| `.github/workflows/firebase-hosting-dev.yml` | Development deployment |
| `build-site.js` | Environment-aware build script |

## 🔍 Troubleshooting

```bash
# Check build locally
npm run build

# View Firebase projects
npx firebase projects:list

# Check hosting status
npx firebase hosting:sites:list

# View deploy history
# (Check Firebase Console → Hosting)
```

## ⚡ Quick Setup Checklist

- [ ] Create two Firebase projects (`aexyn-site`, `aexyn-site-dev`)
- [ ] Update `.firebaserc` with both project IDs
- [ ] Generate service account key
- [ ] Add GitHub secrets (`FIREBASE_PROJECT_ID`, `FIREBASE_DEV_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT_KEY`)
- [ ] Install dependencies: `npm install`
- [ ] Test builds: `npm run build:dev` and `npm run build:prod`
- [ ] Push to main branch → triggers production deployment
- [ ] Push to dev branch → triggers development deployment
- [ ] Verify both environments work

## 🚀 CI/CD Features

**Dual-Environment Pipeline:**
- ✅ Environment setup and validation
- ✅ Dependency installation with caching
- ✅ Environment-aware static site builds
- ✅ Firebase deployment to correct environment
- ✅ Live site verification
- ✅ Deployment summaries and notifications

**Features:**
- 🔄 Dependency caching for faster builds
- 🔍 Build quality checks for HTML generation
- 🌐 Environment-specific base URL handling
- 📊 Deployment summaries with metrics
- 🛡️ Repository restrictions for security
- ⚡ Simplified two-environment workflow

---

For detailed setup instructions, see [DEPLOYMENT-SETUP.md](./DEPLOYMENT-SETUP.md) 