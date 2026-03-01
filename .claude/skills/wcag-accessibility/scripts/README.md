# アクセシビリティ検証スクリプト

このスキルは、リポジトリの `scripts/accessibility/` ディレクトリにある既存スクリプトを活用します。新規スクリプトの作成は行わず、既存インフラを参照します。

---

## 既存スクリプト一覧

### コントラスト検証

| スクリプト | 目的 | 使用方法 |
|-----------|------|---------|
| `check_contrast_ratio.py` | HTMLファイルのコントラスト比検証 | `python3 scripts/accessibility/check_contrast_ratio.py [file]` |
| `extract_colors_from_html.py` | HTMLから使用色を抽出 | `python3 scripts/accessibility/extract_colors_from_html.py [file]` |
| `suggest_color_fixes.py` | 非準拠色の修正提案 | `python3 scripts/accessibility/suggest_color_fixes.py [file]` |
| `fix_colors_bulk.py` | 色の一括修正 | `python3 scripts/accessibility/fix_colors_bulk.py [file] --apply` |
| `check_contrast_after_fix.py` | 修正後の再検証 | `python3 scripts/accessibility/check_contrast_after_fix.py [file]` |

### 構造検証

| スクリプト | 目的 | 使用方法 |
|-----------|------|---------|
| `check_heading_hierarchy.py` | 見出し階層の検証 | `python3 scripts/accessibility/check_heading_hierarchy.py [file]` |
| `find_svg_without_aria.sh` | SVGアクセシビリティ検証 | `bash scripts/accessibility/find_svg_without_aria.sh` |

### W3C検証

| スクリプト | 目的 | 使用方法 |
|-----------|------|---------|
| `validate_html_w3c.py` | W3C HTML Validator検証 | `python3 scripts/ci/validate_html_w3c.py [--pr-mode]` |

---

## 検証ワークフロー

### 1. 完全検証（デプロイ前）

```bash
# 1. コントラスト検証
python3 scripts/accessibility/check_contrast_ratio.py

# 2. 見出し階層検証
python3 scripts/accessibility/check_heading_hierarchy.py

# 3. SVGアクセシビリティ検証
bash scripts/accessibility/find_svg_without_aria.sh

# 4. W3C HTML検証
python3 scripts/ci/validate_html_w3c.py --pr-mode
```

### 2. 単一ファイル検証

```bash
# 対象ファイル
TARGET="security-governance/iam-access-analyzer-guide.html"

# コントラスト検証
python3 scripts/accessibility/check_contrast_ratio.py "$TARGET"

# 修正提案
python3 scripts/accessibility/suggest_color_fixes.py "$TARGET"
```

### 3. 修正ワークフロー

```bash
# 1. 違反の特定
python3 scripts/accessibility/check_contrast_ratio.py target.html

# 2. 修正提案の取得
python3 scripts/accessibility/suggest_color_fixes.py target.html

# 3. 一括修正（ドライラン）
python3 scripts/accessibility/fix_colors_bulk.py target.html

# 4. 一括修正（適用）
python3 scripts/accessibility/fix_colors_bulk.py target.html --apply

# 5. 修正後の検証
python3 scripts/accessibility/check_contrast_after_fix.py target.html
```

---

## スクリプトの依存関係

### Python依存関係

```bash
# インストール
uv pip install beautifulsoup4 lxml html5lib requests
```

### 必要なファイル

- `css/variables.css` - CSS変数定義（コントラスト計算で参照）

---

## CI/CD統合

### プリコミットフック

`.git/hooks/pre-commit` に以下を追加：

```bash
#!/bin/bash
python3 scripts/accessibility/check_contrast_ratio.py || exit 1
python3 scripts/accessibility/check_heading_hierarchy.py || exit 1
```

### GitHub Actions

`.github/workflows/accessibility.yml` を参照。

---

## 関連ドキュメント

- `docs/WCAG21_GUIDELINES.md` - WCAG 2.1の原理・原則
- `.claude/skills/wcag-accessibility/SKILL.md` - このスキルのメイン定義
- `assets/color-migration-map.json` - 色変換マップ
