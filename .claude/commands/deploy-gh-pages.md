---
allowed-tools: Bash(git status:*), Bash(git branch --show-current), Bash(git log:*), Bash(git push:*), Bash(git remote:*), Bash(git rev-parse:*), Bash(git show:*),Bash(git checkout:*)
description: Push current branch to gh-pages for GitHub Pages
---

## Context

- Current git status: !`git status`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -5`
- Remotes: !`git remote -v`

## Your task

1. Ensure working tree is clean (no unstaged or uncommitted changes).
2. Ensure the current branch is `gh-pages` (or explicitly confirm what will be pushed).
3. Push to GitHub: `git push origin gh-pages`
4. Summarize what was pushed (latest commit hash and message).
