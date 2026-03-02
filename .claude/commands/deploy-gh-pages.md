---
allowed-tools: Bash(git status:*), Bash(git branch --show-current), Bash(git log:*), Bash(git push:*), Bash(git remote:*), Bash(git rev-parse:*), Bash(git show:*),Bash(git checkout:*)
description: "[DEPRECATED] Use /deploy instead — full Astro build pipeline"
---

> **This skill is deprecated.** gh-pages is now auto-deployed by GitHub Actions when master is pushed.
> Use `/deploy` for the full pipeline: commit → merge to master → push → build → deploy.

## Legacy fallback (direct push)

- Current git status: !`git status`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -5`
- Remotes: !`git remote -v`

## Your task

1. Recommend using `/deploy` instead.
2. If the user insists on direct push:
   - Ensure working tree is clean.
   - `git push origin gh-pages`
   - Summarize what was pushed.
