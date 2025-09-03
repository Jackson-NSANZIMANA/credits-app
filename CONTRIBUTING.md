# 📌 Version Control Strategy – Credits App

This document describes the branching model, commit style, and protection rules agreed upon by the team. All contributors must follow this workflow to ensure a clean, maintainable, and professional codebase.

---

## 🔀 Branching Model

We follow a GitHub Flow with feature branches, customized for our needs.

### 1. Main (`main`)
- **Always production-ready.**
- Code here is what’s running in deployment.
- **Protected:** No direct pushes. Only PR merges allowed.

### 2. Develop (`develop`)
- **Integration branch for upcoming features.**
- All features are merged here before going into main.
- **Protected:** No direct pushes. Only PR merges allowed.

### 3. Feature Branches (`feature/*`)
- For building new features.
- **Branch off from `develop`.**
- **Naming convention:**
    - `feature/authentication`
    - `feature/reporting`
    - `feature/credit-reminders`
- **Merged back into `develop` via Pull Requests (PR).**

### 4. Hotfix Branches (`hotfix/*`)
- For urgent bug fixes in production.
- **Branch off from `main`.**
- **Merged back into both `main` and `develop`.**
- **Naming convention:**
    - `hotfix/fix-login-bug`
    - `hotfix/fix-sms-service`

---

## 📝 Commit Message Guidelines

We use **Conventional Commits** to keep history clean:

- `feat:` → A new feature
- `fix:` → A bug fix
- `chore:` → Non-feature tasks (setup, configs, cleanup)
- `docs:` → Documentation changes
- `refactor:` → Code improvements (no feature changes)
- `test:` → Adding or updating tests

**Examples:**
- `feat(auth): add login API and token validation`
- `fix(reporting): correct monthly totals`
- `chore: clean project history and conclude Sprint 1`

---

## 🔒 Branch Protection Rules

### `main`
- Require PR before merging.
- Require 1 reviewer approval.
- Disallow direct pushes.

### `develop`
- Same protections as `main`.

### `feature/*`
- No strict protection, but PRs required for merge into `develop`.

---

## 📂 Workflow Summary

**Start a new feature**
```sh
git checkout develop
git pull origin develop
git checkout -b feature/feature-name
```

**Work locally**
- Write code.
- Commit often with clear messages.

**Push to GitHub**
```sh
git push -u origin feature/feature-name
```

**Open a PR → develop**
- Get review from at least 1 teammate.
- Fix issues if needed.

**Merge PR**
- Squash and merge preferred.
- Delete branch after merge.

**Release to production**
- When `develop` is stable → PR into `main`.

---

## 👉 With this setup:
- History is clean.
- `main` = always stable.
- `develop` = active but safe.
- Features are isolated.
- Everyone follows the same rules.