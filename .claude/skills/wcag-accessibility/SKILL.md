---
name: wcag-accessibility
description: |
  WCAG 2.1 AA準拠検証スキル。以下の場面で使用：
  - CSS/HTMLのスタイリング作成・レビュー時
  - カラーコントラスト検証時
  - 見出し階層チェック時
  - デプロイ前のアクセシビリティ監査時
  バイナリ（合格/不合格）判定ルール、自動検証スクリプト、NGパターン集を提供。
---

# WCAG 2.1 AA 準拠検証スキル

AWS SAP学習リソースのアクセシビリティを確保するための検証スキルです。

## 適用範囲

### 対象
| カテゴリ | 検証内容 |
|---------|---------|
| カラーコントラスト | テキスト・UIコンポーネントのコントラスト比 |
| 見出し階層 | h1→h2→h3の順序（スキップ禁止） |
| SVGアクセシビリティ | `role="img"` + `aria-label` |
| セマンティックHTML | `<header>`, `<nav>`, `<main>`, `<article>` |
| キーボード操作 | Tab順序、フォーカス移動 |
| フォーカス表示 | フォーカスインジケーターの可視性 |

### 対象外
- AAA基準（このリポジトリはAA準拠を目標）
- 動画/音声コンテンツ（リポジトリに存在しない）

---

## 数値基準クイックリファレンス

### コントラスト比の最低基準

| 要素タイプ | 最低比率 | 判定 | 備考 |
|-----------|---------|------|------|
| 通常テキスト (<18pt / <14pt太字) | **4.5:1** | PASS/FAIL | 本文、ラベル、キャプション |
| 大きいテキスト (>=18pt / >=14pt太字) | **3.0:1** | PASS/FAIL | 見出し、ヒーローテキスト |
| UIコンポーネント | **3.0:1** | PASS/FAIL | ボタン枠線、フォーム枠線、アイコン |

### 判定フローチャート

```
テキスト色と背景色を特定
    ↓
コントラスト比を計算
    ↓
テキストサイズを確認
    ├─ 18pt以上 または 14pt太字以上 → 3.0:1以上で PASS
    └─ それ未満 → 4.5:1以上で PASS
```

---

## 検証済みカラーパレット（役割別）

### 明るい背景用テキスト色

| CSS変数 | 色コード | コントラスト比 (白背景) | 用途 |
|---------|---------|------------------------|------|
| `--text-heading` | `#1f2937` | 14.68:1 | 見出し |
| `--text-body` | `#374151` | 9.86:1 | 本文 |
| `--text-muted` | `#4b5563` | 7.21:1 | 補足テキスト |
| `--text-caption` | `#6b7280` | 4.83:1 | キャプション |

### 暗い背景用テキスト色

| CSS変数 | 色コード | コントラスト比 (AWS Dark) | 用途 |
|---------|---------|--------------------------|------|
| `--text-on-dark` | `#ffffff` | 12.98:1 | 白テキスト |
| `--text-on-dark-muted` | `#e5e7eb` | 10.15:1 | ミュート白 |

### アクセント色（大きいテキスト・UI用）

| 色名 | 色コード | 白背景比率 | 用途 |
|------|---------|-----------|------|
| AWS Orange (Accessible) | `#dc7600` | 3.17:1 | リンク、アイコン |
| AWS Orange (Original) | `#FF9900` | 2.87:1 | 大きいテキスト専用 |
| Success Green | `#047857` | 5.91:1 | 成功メッセージ |
| Info Blue | `#1d4ed8` | 6.91:1 | 情報メッセージ |
| Error Red | `#b91c1c` | 5.65:1 | エラーメッセージ |

---

## デザイン段階ルール（D-xxx）

Figma/デザインレビュー時に適用するルール。

| ID | ルール | 判定基準 |
|----|--------|---------|
| D-001 | 通常テキストは 4.5:1 以上 | コントラスト比 >= 4.5 |
| D-002 | 大きいテキストは 3.0:1 以上 | コントラスト比 >= 3.0 |
| D-003 | UIコンポーネントは 3.0:1 以上 | 境界線/アイコン比 >= 3.0 |
| D-004 | 背景色が明示されていること | 背景色指定あり |
| D-005 | テキスト役割と背景コンテキストが一致 | 下表参照 |

### D-005: テキスト役割×背景マトリクス

| 背景タイプ | 使用可能なテキスト色 |
|-----------|-------------------|
| 明るい背景 (#fff, #f9fafb等) | `--text-heading`, `--text-body`, `--text-muted`, `--text-caption` |
| 暗い背景 (#232F3E等) | `--text-on-dark`, `--text-on-dark-muted` |
| グラデーション/画像 | 個別検証必要（オーバーレイ考慮） |

---

## 実装段階ルール（I-xxx）

HTML/CSS/JS実装時に適用するルール。

| ID | ルール | 検出方法 | 自動化 |
|----|--------|---------|-------|
| I-001 | テキスト色は `--text-*` CSS変数を使用 | grepで直接色指定を検出 | 可能 |
| I-002 | グローバルな白文字指定禁止 | `h2 { color: #fff; }` 等を検出 | 可能 |
| I-003 | 見出し階層が h1→h2→h3 順序 | スクリプトで検証 | 可能 |
| I-004 | SVGに `role="img"` + `aria-label` 必須 | スクリプトで検証 | 可能 |
| I-005 | `<html lang="ja">` 必須 | grepで検出 | 可能 |
| I-006 | フォーカス表示が可視 | `outline: none` 単独を検出 | 部分的 |

### I-002: グローバル要素スタイリングの禁止パターン

```css
/* NG: グローバルに白文字を指定 */
h2 { color: #fff; }
h2 { color: white; }
.section-title { color: #ffffff; }

/* OK: スコープを限定 */
.hero h2 { color: #fff; }
.dark-section .section-title { color: #ffffff; }
```

---

## NGパターン集

詳細は `references/ng-patterns.md` を参照。

| ID | パターン名 | 概要 |
|----|-----------|------|
| NG-001 | ヒーロースタイル流用 | 白文字スタイルを通常セクションに適用 |
| NG-002 | 背景変更時のリセット漏れ | 背景を明るく変更したがテキスト色を更新しない |
| NG-003 | グローバル要素スタイリング | スコープなしで要素に色を直接指定 |
| NG-004 | 低コントラストグレー | #9CA3AF等のコントラスト不足色 |
| NG-005 | AWSオレンジの誤用 | #FF9900を通常テキストに使用 |

---

## 検証ワークフロー

### 1. 自動検証（CI/プリコミット）

```bash
# 完全なアクセシビリティ検証
python3 scripts/accessibility/check_contrast_ratio.py
python3 scripts/accessibility/check_heading_hierarchy.py
bash scripts/accessibility/find_svg_without_aria.sh
python3 scripts/ci/validate_html_w3c.py --pr-mode
```

### 2. 単一ファイル検証

```bash
# 特定ファイルのコントラスト検証
python3 scripts/accessibility/check_contrast_ratio.py path/to/file.html

# 色抽出と分析
python3 scripts/accessibility/extract_colors_from_html.py path/to/file.html
```

### 3. 手動レビューチェックリスト

`assets/wcag-review-checklist.md` のYes/Noチェックリストを使用。

特に以下は手動確認が必要：
- 背景コンテキストの適切性
- キーボード操作の動作
- フォーカス表示の可視性

---

## 修正ワークフロー

### コントラスト違反の修正

1. **違反の特定**
   ```bash
   python3 scripts/accessibility/check_contrast_ratio.py target.html
   ```

2. **修正提案の取得**
   ```bash
   python3 scripts/accessibility/suggest_color_fixes.py target.html
   ```

3. **一括修正（オプション）**
   ```bash
   python3 scripts/accessibility/fix_colors_bulk.py target.html --apply
   ```

4. **修正後の検証**
   ```bash
   python3 scripts/accessibility/check_contrast_after_fix.py target.html
   ```

### 色のマイグレーション

`assets/color-migration-map.json` を参照して、非準拠色から準拠色への変換を行う。

---

## 既存ドキュメントとの関係

| ドキュメント | 役割 |
|-------------|------|
| `docs/WCAG21_GUIDELINES.md` | WCAG原理・原則の詳細解説（教育目的） |
| **このスキル** | 実務向けクイックリファレンス（判定基準） |
| `css/variables.css` | 実際の色定義（実装） |

---

## 参照ファイル

### references/
- `color-contrast-rules.md` - コントラスト比計算の詳細
- `role-based-colors.md` - 役割別カラーパレット
- `background-context-rules.md` - 背景コンテキスト判定ルール
- `ng-patterns.md` - NGパターン集（実例付き）
- `automation-manual-split.md` - 自動化 vs 手動レビューの切り分け

### assets/
- `wcag-review-checklist.md` - Yes/Noレビューチェックリスト
- `color-migration-map.json` - 旧色→新色マッピング

### scripts/
- `README.md` - 既存スクリプトへの参照

---

## よくある質問

### Q: 新しい色を追加したい場合は？

1. `css/variables.css` にCSS変数として追加
2. WebAIM Contrast Checker でコントラスト比を確認
3. `role-based-colors.md` に用途とコントラスト比を記載
4. `color-migration-map.json` に必要なら追加

### Q: 既存ページでコントラスト違反が見つかった場合は？

1. `check_contrast_ratio.py` で全ページをスキャン
2. `suggest_color_fixes.py` で修正提案を取得
3. 手動でCSS/HTMLを修正、または `fix_colors_bulk.py` で一括修正
4. `check_contrast_after_fix.py` で修正を確認
5. W3C Validator でHTML検証
6. コミット・プッシュ

### Q: ヒーローセクションで白文字を使いたい場合は？

1. 背景が十分に暗いことを確認（輝度 < 0.2）
2. スコープを限定したCSSを記述：
   ```css
   .hero-section h2 { color: #fff; }
   ```
3. グローバルスタイルに影響しないことを確認
