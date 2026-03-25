# CI/CD & Deployment

## CI/CD Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `deploy.yml` | Push to master | `npm run build` → verify critical assets → deploy `dist/` to gh-pages |
| `playwright-e2e.yml` | Push/PR to master | Run concept-map, navigation, links, interaction E2E tests |
| `qa-unified.yml` | Manual / scheduled | 4-job pipeline: static-validation → runtime-validation → visual-regression → publish-report |
| `pr-quality-check.yml` | PR to master | Pre-merge quality checks |

## Pre-Commit Hooks

Git hooks run automatically on every `git commit`:

1. `scripts/git_hooks/update_last_modified.py` — updates `data.js` lastUpdated date
2. `scripts/accessibility/check_contrast_ratio.py` — WCAG AA contrast check
3. `scripts/check_fixed_headers.py` — fixed header presence check

> **`data.js` の `lastUpdated` 行末の `// GIT_LAST_COMMIT_DATE` コメントは削除禁止。**
> Pre-commit hook がこのマーカーで日付を自動更新する。

When modifying or deleting files tracked by pre-commit hooks, always test the hook against the change first. Use `--diff-filter=ACMR` to exclude deletions from validation hooks. Never create hooks that block their own enabling commit.

## Deployment

- Use `/deploy` skill for the full pipeline: commit → merge to master → push → GitHub Actions build → gh-pages
- GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds with `npm run build` and deploys `dist/` to gh-pages on master push
- `master` = source code, `gh-pages` = build output only (managed by CI)
- Standard workflow: implement → validate → `/deploy`
