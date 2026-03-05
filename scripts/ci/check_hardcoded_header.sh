#!/usr/bin/env bash
# check_hardcoded_header.sh — Detect hardcoded header height values in CSS
#
# ヘッダー高さをハードコードすると --header-height 変更時にズレが起きる。
# 新規・変更CSSファイルでハードコード値を検出し警告する。
#
# Usage:
#   bash scripts/ci/check_hardcoded_header.sh [--pr-mode]
#     --pr-mode: git diff で変更ファイルのみチェック

set -euo pipefail

PR_MODE=false
if [[ "${1:-}" == "--pr-mode" ]]; then
  PR_MODE=true
fi

# 検出対象ファイル
if $PR_MODE; then
  FILES=$(git diff --name-only --diff-filter=ACMR HEAD~1 -- '*.css' 2>/dev/null || \
          git diff --name-only --diff-filter=ACMR --cached -- '*.css' 2>/dev/null || true)
else
  FILES=$(find css/ -name '*.css' -type f 2>/dev/null || true)
fi

if [[ -z "$FILES" ]]; then
  echo "No CSS files to check."
  exit 0
fi

# 除外: 個別ページCSS (テンプレート生成の padding-top:80px は既知)
# チェック対象: 共通CSS、コンポーネントCSS、mindmap等の手書きCSS
WARNINGS=0

while IFS= read -r file; do
  [[ -z "$file" || ! -f "$file" ]] && continue

  # padding-top / top / margin-top にヘッダー高さらしき値 (56-80px) をハードコードしている行を検出
  # ただし var(--header-height) を使っている行は除外
  matches=$(grep -nE '(padding-top|^\s*top|margin-top)\s*:\s*(56|60|80)px' "$file" \
    | grep -v 'var(--header-height)' \
    | grep -vi 'touch target\|icon\|border-radius\|font-size' || true)

  if [[ -n "$matches" ]]; then
    # ヘッダー関連コメントがある行のみ警告
    while IFS= read -r line; do
      line_lower=$(echo "$line" | tr '[:upper:]' '[:lower:]')
      if echo "$line_lower" | grep -qE 'ヘッダー|header|固定'; then
        echo "WARNING: $file: $line"
        echo "  → Use var(--header-height, 60px) instead of hardcoded value"
        WARNINGS=$((WARNINGS + 1))
      fi
    done <<< "$matches"
  fi
done <<< "$FILES"

if [[ $WARNINGS -gt 0 ]]; then
  echo ""
  echo "Found $WARNINGS hardcoded header height value(s)."
  echo "Replace with var(--header-height, 60px) from css/variables.css"
  # Advisory only — don't block CI
  exit 0
else
  echo "No hardcoded header heights detected."
  exit 0
fi
