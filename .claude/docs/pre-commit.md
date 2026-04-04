# Pre-Commit Checklist

## CI-Blocking Checks (exit 1 = must fix before commit)

```bash
python3 scripts/ci/check_data_integrity.py               # public/data.js ⟷ public/index.js sync
python3 scripts/ci/validate_html_w3c.py --pr-mode        # W3C HTML validation
python3 scripts/ci/check_css_quality.py --pr-mode        # CSS quality: !important / ID selectors / nesting / global tags
python3 scripts/accessibility/check_contrast_ratio.py    # WCAG color contrast
python3 scripts/accessibility/check_heading_hierarchy.py # h1→h2→h3 order (exit 1 if violations)
python3 scripts/check_fixed_headers.py                   # Fixed header present in all content pages
node -c js/quiz-data-extended.js public/data.js public/render.js public/index.js js/quiz-app.js  # JS syntax
```

## Advisory Checks (warnings only)

```bash
python3 scripts/ci/check_internal_links.py                # Broken links
python3 scripts/ci/check_file_naming.py                   # Naming conventions
```

## Pre-Commit Hook (runs automatically on every `git commit`)

Four auto-checks (`.git/hooks/pre-commit`):

1. **Guard**: blocks staging `public/concepts/` (build-time generated)
2. `scripts/git_hooks/update_last_modified.py` — updates `public/data.js` lastUpdated date
3. `scripts/accessibility/check_contrast_ratio.py` — WCAG AA contrast check
4. `scripts/check_fixed_headers.py` — fixed header presence check

> `public/data.js` の `lastUpdated` 行末の `// GIT_LAST_COMMIT_DATE` コメントは **削除禁止**。
> pre-commit hook がこのマーカーを正規表現で検索して日付を書き換える。消すと自動更新が止まる。
