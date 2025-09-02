# 🔒 GitHub Repository Setup Guide

Complete setup guide for secure automated releases.

## 🔐 1. GitHub Secrets Setup

### Required Secrets

Go to: **Repository → Settings → Secrets and variables → Actions**

#### NPM_TOKEN

1. Go to [npmjs.com](https://www.npmjs.com) → Account Settings → Access Tokens
2. Create new token:
   - **Type**: Automation
   - **Scope**: Publish packages
3. Copy the token
4. Add to GitHub secrets:
   - **Name**: `NPM_TOKEN`
   - **Value**: `npm_xxxxxxxxxxxxxxxx`

#### GITHUB_TOKEN

- ✅ **Automatically provided** by GitHub Actions
- No setup required

## 🛡️ 2. Branch Protection Rules

### Protect Main Branch

Go to: **Repository → Settings → Branches → Add rule**

#### Branch name pattern: `main`

**Settings to enable**:

- ✅ **Require a pull request before merging**
  - ✅ Require approvals: 1
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners (optional)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - **Required status checks**:
    - `ci` (from CI workflow)
    - `test` (if using matrix builds)

- ✅ **Require conversation resolution before merging**

- ✅ **Require signed commits** (recommended)

- ✅ **Require linear history** (optional, keeps clean history)

- ✅ **Do not allow bypassing the above settings**

- ✅ **Restrict pushes that create files**

### Protect Dev Branch (Optional)

#### Branch name pattern: `dev`

**Lighter protection**:

- ✅ **Require status checks to pass before merging**
  - ✅ Required status checks: `ci`

## 🔧 3. Repository Settings

### General Settings

Go to: **Repository → Settings → General**

#### Features

- ✅ **Issues**
- ✅ **Projects**
- ✅ **Wiki** (optional)
- ✅ **Discussions** (optional)

#### Pull Requests

- ✅ **Allow merge commits**
- ✅ **Allow squash merging** (recommended)
- ✅ **Allow rebase merging**
- ✅ **Always suggest updating pull request branches**
- ✅ **Allow auto-merge**
- ✅ **Automatically delete head branches**

#### Pushes

- ✅ **Limit pushes that create files**

### Actions Settings

Go to: **Repository → Settings → Actions → General**

#### Actions permissions

- ✅ **Allow all actions and reusable workflows**

#### Workflow permissions

- ✅ **Read and write permissions**
- ✅ **Allow GitHub Actions to create and approve pull requests**

## 📦 4. Package Settings

### GitHub Packages

Go to: **Repository → Settings → Actions → General**

- ✅ **Read and write permissions** (for package publishing)

### Package Visibility

After first publish, go to: **Repository → Packages → Package Settings**

- ✅ **Public** (for open source packages)
- ✅ **Link to repository**

## 🚀 5. Verification Steps

### Test the Workflow

1. **Create a test changeset**:

   ```bash
   git checkout dev
   npx changeset
   # Select patch, add description
   git add .
   git commit -m "chore: test changeset"
   git push origin dev
   ```

2. **Create PR to main**:

   ```bash
   gh pr create --base main --head dev --title "Test Release"
   ```

3. **Verify CI runs** but no publishing happens

4. **Merge PR** and verify:
   - ✅ Release workflow runs
   - ✅ Version is bumped
   - ✅ Package published to npm
   - ✅ Package published to GitHub
   - ✅ GitHub release created

### Verify Security

- ✅ Direct pushes to `main` are blocked
- ✅ PRs require CI to pass
- ✅ Only `main` branch triggers publishing
- ✅ Secrets are properly configured

## 🔍 6. Monitoring

### GitHub Actions

- Monitor workflow runs in **Actions** tab
- Set up notifications for failed workflows

### Package Registries

- **npm**: https://www.npmjs.com/package/@vnedyalk0v/react19-simple-maps
- **GitHub**: Repository → Packages

### Release Notes

- Automatically generated in **Releases** tab
- Based on changeset descriptions

## 🚨 7. Emergency Procedures

### Disable Automatic Publishing

1. Go to **Repository → Settings → Actions**
2. **Disable Actions** temporarily
3. Fix issues manually
4. Re-enable Actions

### Revoke Compromised Tokens

1. **npm**: Revoke token at npmjs.com
2. **GitHub**: Update `NPM_TOKEN` secret
3. Test with new token

This setup ensures maximum security while maintaining automation! 🎯
