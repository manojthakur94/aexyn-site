# Firebase Hosting CI/CD Setup Guide

This guide will walk you through setting up CI/CD for your Aexyn site with Firebase hosting and PR preview URLs.

**Important**: This CI/CD configuration is specifically configured for the `aexyn-contact/aexyn-website` repository only.

### Repository Restriction
The GitHub Actions workflows include repository checks that ensure they only run when:
- The repository is exactly `aexyn-contact/aexyn-website`
- This prevents accidental deployments from forks or other remotes
- If you need to run CI/CD on a different repository, update the repository name in all workflow files

## Prerequisites

1. **GitHub repository** - Your code should be in a GitHub repository
2. **Firebase account** - Sign up at [firebase.google.com](https://firebase.google.com)
3. **Node.js 18+** - Required for the optimized CI/CD pipeline

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., `aexyn-site`)
4. Disable Google Analytics (optional for static sites)
5. Click "Create project"

## Step 2: Initialize Firebase Hosting

1. In Firebase console, go to **Hosting** in the left sidebar
2. Click "Get started"
3. Follow the setup steps (we've already created the config files)

## Step 3: Get Firebase Project ID

1. In Firebase console, click the gear icon → "Project settings"
2. Copy your **Project ID** (e.g., `aexyn-site-12345`)
3. Update `.firebaserc` file:
   ```json
   {
     "projects": {
       "default": "your-actual-project-id-here"
     }
   }
   ```

## Step 4: Create Firebase Service Account

1. Go to **Project Settings** → **Service accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the entire contents of this JSON file

## Step 5: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these repository secrets:

   - **`FIREBASE_PROJECT_ID`**: Your Firebase project ID
   - **`FIREBASE_SERVICE_ACCOUNT_KEY`**: The entire JSON content from step 4

## Step 6: Install Dependencies

Run the following command to install Firebase tools:

```bash
npm install
```

## Step 7: Test Local Deployment

1. Build the site:
   ```bash
   npm run build
   ```

2. Test Firebase hosting locally:
   ```bash
   npm run firebase:serve
   ```

3. Deploy manually (optional):
   ```bash
   npm run firebase:deploy
   ```

## Step 8: Test CI/CD

1. **Push to main branch** - This will trigger the production deployment
2. **Create a Pull Request** - This will create a preview URL
3. **Close/merge PR** - This will clean up the preview deployment

## CI/CD Workflows

### Production Deployment (`deploy.yml`)
- Triggers on push to `main` or `master` branch
- Builds the site and deploys to Firebase Hosting production
- Available at your Firebase hosting URL

### PR Preview (`preview.yml`)
- Triggers on PR creation, updates, and reopening
- Creates a temporary preview URL for each PR
- Comments on PR with the preview URL
- Preview expires after 30 days

### Preview Cleanup (`cleanup-preview.yml`)
- Triggers when PR is closed or merged
- Cleans up the temporary preview deployment

## Available npm Scripts

```bash
# Build the site
npm run build

# Build and serve locally with http-server
npm run dev

# Watch for changes and rebuild
npm run watch

# Serve with Firebase emulator
npm run firebase:serve

# Deploy to Firebase manually
npm run firebase:deploy

# Deploy to preview channel
npm run firebase:deploy:preview
```

## Firebase Hosting Configuration

The `firebase.json` file configures:
- **Public directory**: Root directory (`.`) 
- **Ignored files**: Source files, build scripts, etc.
- **Clean URLs**: Removes `.html` extensions from URLs
- **Rewrites**: Proper routing for blog, services, and industries pages
- **Headers**: Optimized cache control for different file types
  - HTML files: No cache (always fresh)
  - Assets (CSS/JS/Images): 1-year cache with immutable flag

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm install`
- Verify Node.js version: `node --version` (should be 18+)
- Check build logs for specific errors

### Firebase Deploy Fails
- Verify Firebase project ID in `.firebaserc`
- Check GitHub secrets are correctly set
- Ensure service account has Hosting Admin permissions

### PR Preview Not Working
- Verify GitHub token permissions
- Check that the PR is from the same repository (forks won't work with secrets)
- Review workflow logs in GitHub Actions

## Security Notes

- Service account JSON contains sensitive keys - never commit to git
- GitHub secrets are encrypted and only accessible to workflows
- PR previews only work for internal PRs (not forks) for security

## Need Help?

1. Check GitHub Actions logs for specific errors
2. Review Firebase Hosting docs: [firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting)
3. Check Firebase console for deployment history and logs 