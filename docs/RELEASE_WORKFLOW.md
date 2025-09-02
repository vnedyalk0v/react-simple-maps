# 🚀 Complete Automated Release Workflow

This guide explains the complete automated release workflow that publishes to both npm and GitHub Package Registry only when merging to `main` branch.

## 🔄 Workflow Overview

- **`dev` branch**: Only runs CI tests, linting, and checks - **NO publishing**
- **`main` branch**: Runs full release workflow with automated publishing
- **Pull Requests**: Run CI tests to ensure quality before merge

## 🔐 Required GitHub Secrets

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

## 📋 Development Workflow

### 1. Feature Development

```bash
# Work on dev branch
git checkout dev
git pull origin dev

# Make your changes
# ... code changes ...

# Commit and push to dev
git add .
git commit -m "feat: add new feature"
git push origin dev
```

**Result**: Only CI tests run, no publishing happens.

### 2. Creating a Release

When ready to release, create a changeset:

```bash
# On dev branch, create a changeset
npx changeset

# Follow the prompts:
# - Select the type of change (patch/minor/major)
# - Write a summary of the changes
# - Commit the changeset

git add .
git commit -m "chore: add changeset for v1.0.4"
git push origin dev
```

### 3. Release to Production

```bash
# Create PR from dev to main
gh pr create --base main --head dev --title "Release v1.0.4" --body "Release new version with features and fixes"

# Or via GitHub UI:
# 1. Go to GitHub repository
# 2. Create Pull Request: dev → main
# 3. Review and merge the PR
```

**Result**: When merged to `main`, the workflow automatically:

1. ✅ Runs all tests and checks
2. ✅ Processes changesets and updates version
3. ✅ Updates CHANGELOG.md
4. ✅ Creates a git tag
5. ✅ Publishes to npm registry
6. ✅ Publishes to GitHub Package Registry
7. ✅ Creates GitHub release

## 🛡️ Security Features

- **Branch Protection**: Only `main` branch triggers publishing
- **Required Checks**: All tests must pass before publishing
- **Automated Versioning**: Uses Changesets for semantic versioning
- **Secure Tokens**: Uses GitHub secrets for authentication
- **Audit Trail**: All releases are tracked in git history

## 🔧 Manual Release (Emergency)

If you need to publish manually:

```bash
# On main branch only
git checkout main
git pull origin main

# Create changeset if needed
npx changeset

# Version and publish
npm run release
```

## 📊 Monitoring

- **CI Status**: Check GitHub Actions tab for build status
- **Package Status**: Monitor npm and GitHub Package Registry
- **Release Notes**: Automatically generated in GitHub Releases

## 🚨 Troubleshooting

### Publishing Fails

1. Check GitHub secrets are set correctly
2. Verify npm token has publish permissions
3. Ensure package version doesn't already exist
4. Check for test failures in CI

### Changeset Issues

```bash
# Reset changesets if needed
rm -rf .changeset/*.md
npx changeset
```

### Version Conflicts

```bash
# Check current version
npm version

# Manually bump if needed
npm version patch|minor|major
```

This workflow ensures secure, automated releases while keeping development safe! 🎯
