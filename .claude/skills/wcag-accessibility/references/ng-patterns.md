# NGパターン集

このドキュメントでは、WCAG 2.1 AA違反を引き起こす一般的なパターンと、その修正方法を解説します。

---

## NG-001: ヒーロースタイル流用

### 概要

ヒーローセクション（暗い背景）用の白文字スタイルを、通常セクション（明るい背景）にそのまま適用してしまうパターン。

### 発生条件

1. ヒーローセクションで白文字を使用
2. 同じHTML構造を別のセクションにコピー
3. 背景色だけ変更し、テキスト色を変更し忘れる

### 検出ルール

```css
/* 検出対象: 明るい背景クラスに白文字が指定されている */
.light-section h2 { color: #fff; }
.card h2 { color: white; }
```

### Before（NG）

```html
<section class="light-section">
    <h2 style="color: #fff;">セクションタイトル</h2>
    <!-- 白背景に白文字 → コントラスト 1:1 -->
</section>
```

### After（OK）

```html
<section class="light-section">
    <h2 style="color: #1f2937;">セクションタイトル</h2>
    <!-- 白背景に暗いグレー → コントラスト 14.68:1 -->
</section>
```

### 実例: iam-access-analyzer-guide.html

このファイルで実際に発生した問題：

```css
/* NG: グローバルに白文字を指定 */
h2 { color: #fff; }

/* 修正後: スコープを限定 */
.hero-section h2 { color: #fff; }
.content-section h2 { color: #1f2937; }
```

---

## NG-002: 背景変更時のリセット漏れ

### 概要

親要素でテキスト色を設定し、子要素で背景だけを変更した結果、不適切な色の組み合わせになるパターン。

### 発生条件

1. 親要素（ダークテーマ）で白文字を設定
2. 子要素で背景を明るい色に変更
3. テキスト色がCSSの継承により白のまま残る

### 検出ルール

CSSの継承を静的解析で検出するのは困難。手動レビューまたはブラウザでの目視確認が必要。

### Before（NG）

```css
/* 親: 暗い背景、白文字 */
.dark-theme {
    background: #232F3E;
    color: #fff;
}

/* 子: 背景だけ変更 */
.dark-theme .highlight-card {
    background: #fff;
    /* color: #fff が継承 → コントラスト 1:1 */
}
```

### After（OK）

```css
.dark-theme {
    background: #232F3E;
    color: #fff;
}

.dark-theme .highlight-card {
    background: #fff;
    color: #374151;  /* テキスト色も変更 */
}
```

---

## NG-003: グローバル要素スタイリング

### 概要

スコープを限定せずに、HTML要素に直接スタイルを適用するパターン。他のセクションに意図しない影響を与える。

### 発生条件

1. 特定セクション用のスタイルを作成
2. クラスセレクタではなく要素セレクタを使用
3. ページ全体に影響が波及

### 検出ルール

```bash
# 検出: 要素セレクタでcolorを直接指定
grep -E "^(h[1-6]|p|span|div)\s*\{" *.css | grep "color:"
```

### Before（NG）

```css
/* グローバルに影響 */
h2 {
    color: #fff;
    font-size: 2em;
}
```

### After（OK）

```css
/* スコープを限定 */
.hero-section h2 {
    color: #fff;
    font-size: 2em;
}

.content-section h2 {
    color: #1f2937;
    font-size: 2em;
}
```

---

## NG-004: コントラスト不足のグレー

### 概要

視覚的に「薄いグレー」を使用した結果、コントラスト基準を満たさないパターン。

### 発生条件

1. テキストに薄いグレー系の色を使用
2. デザイン的な理由で薄い色を好む
3. コントラスト比を確認しない

### 検出ルール（自動化可能）

```python
# 検出対象の色コード
LOW_CONTRAST_GRAYS = [
    '#9ca3af',  # 3.53:1
    '#d1d5db',  # 1.99:1
    '#e5e7eb',  # 1.45:1
]
```

### Before（NG）

```css
.caption {
    color: #9ca3af;  /* コントラスト比 3.53:1 → FAIL */
}

.helper-text {
    color: #d1d5db;  /* コントラスト比 1.99:1 → FAIL */
}
```

### After（OK）

```css
.caption {
    color: #6b7280;  /* コントラスト比 4.83:1 → PASS */
}

.helper-text {
    color: #6b7280;  /* コントラスト比 4.83:1 → PASS */
}
```

### 色の置換マップ

| NG色 | コントラスト比 | 代替色 | コントラスト比 |
|------|--------------|--------|--------------|
| `#9ca3af` | 3.53:1 | `#6b7280` | 4.83:1 |
| `#d1d5db` | 1.99:1 | `#6b7280` | 4.83:1 |
| `#e5e7eb` | 1.45:1 | `#4b5563` | 7.21:1 |

---

## NG-005: AWSオレンジの誤用

### 概要

AWS公式オレンジ（#FF9900）を通常サイズのテキストに使用し、コントラスト不足になるパターン。

### 発生条件

1. ブランドカラーとしてAWSオレンジを使用
2. リンクテキストや本文にそのまま適用
3. 白背景で 2.87:1 のコントラスト → FAIL

### 検出ルール（自動化可能）

```bash
# 検出: テキスト要素に#FF9900を使用
grep -E "color:\s*#[Ff]{2}9{2}0{2}" *.css
```

### Before（NG）

```css
.link {
    color: #FF9900;  /* コントラスト比 2.87:1 → FAIL */
}

.highlight {
    color: #FF9900;  /* 通常テキストでは不可 */
}
```

### After（OK）

```css
/* オプション1: アクセシブル版オレンジを使用 */
.link {
    color: #dc7600;  /* コントラスト比 3.17:1 → 大きいテキストでPASS */
}

/* オプション2: 通常テキストには別の色を使用 */
.link {
    color: #1d4ed8;  /* 青系リンク → 6.91:1 PASS */
}

/* オプション3: 大きいテキストのみオレンジ許可 */
.hero-title {
    color: #FF9900;
    font-size: 24px;  /* 大きいテキスト → PASS */
}
```

### AWS オレンジの使用ガイドライン

| 用途 | 許可 | 推奨色 |
|------|------|--------|
| 18pt以上のテキスト | ✅ | `#FF9900` |
| 14pt太字以上のテキスト | ✅ | `#FF9900` |
| 通常テキスト | ❌ | `#dc7600` または青系 |
| ボタン背景 | ✅ | `#FF9900`（白テキストで3.0:1） |
| アイコン | ✅ | `#FF9900`（3.0:1以上確保） |

---

## NG-006: 色相衝突（Hue Clash）

### 概要

高彩度・異なる色相の背景色が大きな面積で隣接し、認知的な違和感・疲労・意味誤認を引き起こすパターン。

詳細は `hue-clash-rules.md` を参照。

### 発生条件

1. 高彩度の背景色を広い面積で使用
2. 直下または直上に異なる色相の高彩度背景が隣接
3. 色の切り替えに構造情報（見出し・ラベル）がない
4. 警告色（赤系）を装飾目的で使用

### 関連WCAG基準

- **1.4.1 色の使用** - 色だけに意味を依存しない
- **1.3.1 情報及び関係性** - 視覚的手がかりに依存しない構造理解

### Before（NG）

```html
<!-- 高彩度の赤いヒーロー直下に高彩度の青いセクション -->
<section style="background: #DC143C; padding: 60px;">
    <h1 style="color: #fff;">AWS Lambda完全ガイド</h1>
</section>
<section style="background: #1E90FF; padding: 40px;">
    <h2 style="color: #fff;">基本概念</h2>
    <p>説明内容...</p>
</section>
```

**問題点：**
- 赤 × 青の強い色相衝突
- 色の切り替えが装飾的で意味説明がない
- 技術解説なのに警告色（赤）をヒーローに使用

### After（OK）

```html
<!-- パターンA: 同系色での明度差 -->
<section style="background: #232F3E; padding: 60px;">
    <h1 style="color: #fff;">AWS Lambda完全ガイド</h1>
</section>
<section style="background: #374151; padding: 40px;">
    <h2 style="color: #e5e7eb;">基本概念</h2>
    <p style="color: #e5e7eb;">説明内容...</p>
</section>

<!-- パターンB: 中立色背景 + アクセント -->
<section style="background: #232F3E; padding: 60px;">
    <h1 style="color: #fff;">AWS Lambda完全ガイド</h1>
</section>
<section style="background: #ffffff; padding: 40px;">
    <h2 style="color: #1f2937; border-left: 4px solid #dc7600;">基本概念</h2>
    <p style="color: #374151;">説明内容...</p>
</section>
```

### 検出ルール

自動検出は困難。手動レビュー時に以下を確認：

1. 隣接セクションの背景色の色相差
2. 高彩度（鮮やかな）背景の使用有無
3. 色の切り替え箇所に構造情報があるか
4. 赤系の色が警告以外で使われていないか

### Yes/No チェックリスト

| # | チェック項目 | Yes→PASS / No→NG |
|---|-------------|-----------------|
| Q1 | 高彩度背景が大面積で隣接していないか？ | |
| Q2 | 色相切り替えは意味的な区切りと一致しているか？ | |
| Q3 | 色の切り替えに構造情報が併記されているか？ | |
| Q4 | 赤系が装飾目的で使用されていないか？ | |
| Q5 | 色相衝突で文脈が混在して見えないか？ | |

---

## 検出スクリプト一覧

| NGパターン | 自動検出 | スクリプト/方法 |
|-----------|---------|---------------|
| NG-001 | 部分的 | `check_contrast_ratio.py` |
| NG-002 | 不可 | 手動レビュー |
| NG-003 | 可能 | grep + CSS解析 |
| NG-004 | 可能 | `check_contrast_ratio.py` |
| NG-005 | 可能 | grep `#FF9900` |
| NG-006 | 不可 | 手動レビュー（hue-clash-rules.md参照） |

---

## 予防策

### 1. CSS変数の使用を強制

```css
/* CSS変数を定義 */
:root {
    --text-primary: #374151;
    --text-secondary: #6b7280;
}

/* 直接色指定を禁止するESLintルール等を検討 */
```

### 2. コードレビューチェックリスト

- [ ] 新しい色を追加していないか？
- [ ] 背景を変更した場合、テキスト色も更新したか？
- [ ] 要素セレクタにスタイルを適用していないか？
- [ ] AWS公式オレンジを通常テキストに使用していないか？

### 3. プリコミットフック

```bash
# .git/hooks/pre-commit
python3 scripts/accessibility/check_contrast_ratio.py
```
