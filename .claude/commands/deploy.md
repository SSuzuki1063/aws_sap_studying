---
allowed-tools: Bash(git status:*), Bash(git branch --show-current), Bash(git log:*), Bash(git push:*), Bash(git remote:*), Bash(git rev-parse:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git checkout:*), Bash(git merge:*), Bash(git fetch:*), Bash(gh run:*), Bash(gh api:*)
description: Commit, merge to master, and deploy via GitHub Actions (build → gh-pages)
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -5`

## Your task

Automate the full deploy pipeline: commit → merge to master → push → GitHub Actions builds and deploys to gh-pages.

### Step 1: Commit (if needed)

- If there are staged or unstaged changes, analyze the diff and create a commit using Conventional Commits format.
- If working tree is clean, skip to Step 2.
- Use `--no-verify` only if pre-commit hook failures are unrelated to the current changes (e.g., legacy file issues). Otherwise, fix the issues first.

### Step 2: Merge to master

- If already on `master`, skip to Step 3.
- If on another branch (e.g., `gh-pages`, `feat/*`):
  1. Note the current branch name and latest commit hash.
  2. `git checkout master`
  3. `git merge <source-branch> -m "Merge branch '<source-branch>' into master"`
  4. If merge conflicts occur, STOP and report to the user.

### Step 3: Push master

- `git push origin master`
- This triggers the `deploy.yml` GitHub Actions workflow (npm run build → dist/ → gh-pages).

### Step 4: Verify deployment

- `gh run list --limit 3` to find the triggered workflow run.
- `gh run watch <run-id> --exit-status` to wait for completion.
- If the run **succeeds**: report success with the run URL.
- If the run **fails**: show the error from `gh run view <run-id> --log-failed` and STOP.

### Step 5: Return to original branch

- Switch back to the branch you were on before Step 2.
- `git fetch origin gh-pages` to update local tracking.

### Summary

Report:
- Commit hash and message (if created in Step 1)
- Deploy workflow run ID and status
- The URL: https://ssuzuki1063.github.io/aws_sap_studying/
