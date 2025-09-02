# GitHub Secrets Setup Guide

To enable automatic publishing to both npm and GitHub Package Registry, you need to set up these secrets in your GitHub repository:

## Required Secrets

### 1. NPM_TOKEN
- Go to [npmjs.com](https://www.npmjs.com) → Account Settings → Access Tokens
- Create a new **Automation** token (or **Publish** token)
- Copy the token value
- In GitHub: Repository → Settings → Secrets and variables → Actions → New repository secret
- Name: `NPM_TOKEN`
- Value: Your npm token

### 2. GITHUB_TOKEN (Automatic)
- This is automatically provided by GitHub Actions
- No manual setup required
- Used for publishing to GitHub Package Registry

## Setup Steps

1. **Enable GitHub Package Registry**:
   ```bash
   # In your repository settings
   Settings → General → Features → Packages ✓
   ```

2. **Set Repository Secrets**:
   ```
   Repository → Settings → Secrets and variables → Actions
   ```

3. **Create npm token**:
   ```bash
   npm login
   npm token create --type=automation
   ```

4. **Test the workflow**:
   ```bash
   # Create a new tag to trigger the workflow
   git tag v1.0.4
   git push origin v1.0.4
   ```

## Manual Publishing to GitHub Package Registry

If you want to publish manually first to test:

```bash
# Login to GitHub Package Registry
npm login --scope=@vnedyalk0v --registry=https://npm.pkg.github.com

# Publish
npm publish --registry=https://npm.pkg.github.com
```

## Verification

After publishing, your package should appear in:
- Repository → Packages (right sidebar)
- https://github.com/vnedyalk0v/react19-simple-maps/packages
