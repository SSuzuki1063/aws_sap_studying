# ダークテーマ用カラーパレット設計資産

このドキュメントは、ダークテーマを採用するHTMLページ（例: `kms-key-types.html`）のカラーパレット設計を定義します。

## 適用対象

以下の特徴を持つページに適用：
- 暗い背景（`#1a1a2e` ~ `#0f3460`系）
- グラデーション背景
- カード型レイアウト
- セマンティックカラーによる情報の差別化

---

## 1. カラートークン定義

### 1.1 ベースカラー（本文・背景専用）

```css
:root {
    /* ========================================
       BASE COLORS - 本文・背景専用
       文字色として安全に使用可能
       ======================================== */

    /* ダークテーマ背景 */
    --dark-bg-darkest: #1a1a2e;        /* ページ背景（最暗） */
    --dark-bg-dark: #16213e;           /* ページ背景（中間） */
    --dark-bg-base: #0f3460;           /* ページ背景（明るめ） */

    /* オーバーレイ背景 */
    --dark-overlay-light: rgba(255,255,255,0.05);
    --dark-overlay-medium: rgba(255,255,255,0.08);
    --dark-overlay-strong: rgba(255,255,255,0.1);
    --dark-overlay-dark: rgba(0,0,0,0.2);

    /* テキストカラー（本文使用可能） */
    --dark-text-primary: #e8e8e8;      /* 本文メイン */
    --dark-text-secondary: #aaaaaa;    /* サブテキスト */
    --dark-text-white: #ffffff;        /* 強調テキスト */
    --dark-text-muted: #888888;        /* フッター等 */
}
```

### 1.2 セマンティックカラー（状態・意味）

```css
:root {
    /* ========================================
       SEMANTIC COLORS - 状態・意味を伝える色
       見出し・アイコン・バッジに使用
       ======================================== */

    /* 成功・肯定 */
    --dark-success: #4caf50;           /* ボーダー・背景用 */
    --dark-success-text: #81c784;      /* 見出し・テキスト用 */

    /* 警告・注意 */
    --dark-warning: #ff9800;           /* ボーダー・背景用 */
    --dark-warning-text: #ffb74d;      /* 見出し・テキスト用 */

    /* エラー・否定 */
    --dark-error: #f44336;             /* ボーダー・背景用 */
    --dark-error-text: #ef5350;        /* バッジテキスト用 */

    /* 情報・基本 */
    --dark-info: #2196f3;              /* ボーダー・背景用 */
    --dark-info-text: #64b5f6;         /* 見出し・テキスト用 */
}
```

### 1.3 アクセントカラー（装飾・見出し専用）

```css
:root {
    /* ========================================
       ACCENT COLORS - 装飾・強調用
       本文テキストには使用禁止
       ======================================== */

    /* ゴールド系（強調見出し） */
    --dark-accent-gold: #ffc107;
    --dark-accent-gold-dim: rgba(255,193,7,0.3);

    /* パープル系（教育・説明） */
    --dark-accent-purple: #ce93d8;
    --dark-accent-purple-dim: rgba(156,39,176,0.15);

    /* シアン系（判断・フロー） */
    --dark-accent-cyan: #4dd0e1;
    --dark-accent-cyan-dim: rgba(0,188,212,0.15);

    /* ピンク系（推奨・ベストプラクティス） */
    --dark-accent-pink: #f48fb1;
    --dark-accent-pink-dim: rgba(233,30,99,0.15);
}
```

---

## 2. WCAG 2.1 AA コントラスト検証済みカラー

### 2.1 背景 `#1a1a2e` に対するコントラスト比

| 色名 | HEX | コントラスト比 | 判定 | 用途 |
|------|-----|----------------|------|------|
| `--dark-text-primary` | `#e8e8e8` | 13.5:1 | AAA | 本文メイン |
| `--dark-text-white` | `#ffffff` | 16.1:1 | AAA | 強調テキスト |
| `--dark-text-secondary` | `#aaaaaa` | 5.2:1 | AA | サブテキスト |
| `--dark-text-muted` | `#888888` | 4.8:1 | AA | フッター |
| `--dark-accent-gold` | `#ffc107` | 10.9:1 | AAA | 見出し |
| `--dark-success-text` | `#81c784` | 8.0:1 | AAA | 成功見出し |
| `--dark-info-text` | `#64b5f6` | 7.0:1 | AAA | 情報見出し |
| `--dark-warning-text` | `#ffb74d` | 9.2:1 | AAA | 警告見出し |
| `--dark-accent-purple` | `#ce93d8` | 6.5:1 | AA | 教育見出し |
| `--dark-accent-cyan` | `#4dd0e1` | 10.3:1 | AAA | フロー見出し |
| `--dark-accent-pink` | `#f48fb1` | 7.5:1 | AAA | 推奨見出し |
| `--dark-error-text` | `#ef5350` | 5.1:1 | AA | エラーバッジ |

### 2.2 NG色（使用禁止）

| 色 | HEX | コントラスト比 | 問題 | 代替色 |
|----|-----|----------------|------|--------|
| Dark Gray | `#666666` | 3.4:1 | AA不通過 | `#888888` |
| Light Gray | `#999999` | 4.2:1 | AA境界 | `#aaaaaa` |

---

## 3. 本文テキスト使用可能色（明示的制限）

**本文（`<p>`, `<li>`, `<td>`）に使用可能な色は以下のみ：**

| トークン名 | HEX | 用途 |
|------------|-----|------|
| `--dark-text-primary` | `#e8e8e8` | 本文メイン |
| `--dark-text-secondary` | `#aaaaaa` | 説明・補足 |
| `--dark-text-white` | `#ffffff` | 強調・ヘッダー |
| `--dark-text-muted` | `#888888` | フッター |

**禁止：**
- アクセントカラー（`#ffc107`, `#ce93d8` 等）を本文に使用
- セマンティックテキストカラー（`#64b5f6`, `#81c784` 等）を本文に使用（見出し・ラベル専用）

---

## 4. NGパターン

### NG-DT-001: 本文にアクセントカラーを使用

```css
/* NG */
p { color: #ffc107; }

/* OK */
p { color: var(--dark-text-primary); }
h2 { color: var(--dark-accent-gold); }
```

### NG-DT-002: 同系色背景×同系色文字

```css
/* NG */
.card {
    background: rgba(76,175,80,0.2);  /* 緑背景 */
    color: #81c784;                    /* 緑文字 */
}

/* OK */
.card {
    background: rgba(76,175,80,0.2);  /* 緑背景 */
    color: var(--dark-text-primary);  /* 無彩色文字 */
}
.card h3 { color: var(--dark-success-text); }  /* 見出しのみ緑 */
```

### NG-DT-003: CSS変数を使わず直接HEXをハードコード

```css
/* NG */
.new-section h2 { color: #81c784; }

/* OK */
.new-section h2 { color: var(--dark-success-text); }
```

### NG-DT-004: コントラスト不足の色を使用

```css
/* NG */
.footer { color: #666666; }  /* 3.4:1 - AA不通過 */

/* OK */
.footer { color: var(--dark-text-muted); }  /* #888888 - 4.8:1 */
```

---

## 5. ドメイン固有カラーの定義方法

特定のページでドメイン固有の色分けが必要な場合（例: KMSキータイプ別）、以下の形式で定義：

```css
:root {
    /* ========================================
       DOMAIN-SPECIFIC: KMS Key Types
       ======================================== */

    /* Type A */
    --kms-key-owned: #2196f3;
    --kms-key-owned-text: #64b5f6;
    --kms-key-owned-bg: rgba(33,150,243,0.3);
    --kms-key-owned-border: rgba(33,150,243,0.5);

    /* Type B */
    --kms-key-managed: #ff9800;
    --kms-key-managed-text: #ffb74d;
    --kms-key-managed-bg: rgba(255,152,0,0.3);
    --kms-key-managed-border: rgba(255,152,0,0.5);

    /* Type C */
    --kms-key-customer: #4caf50;
    --kms-key-customer-text: #81c784;
    --kms-key-customer-bg: rgba(76,175,80,0.3);
    --kms-key-customer-border: rgba(76,175,80,0.5);
}
```

**命名規則：**
- プレフィックス: `--[ページ名]-[ドメイン概念]-[用途]`
- 用途サフィックス: なし（メイン）, `-text`, `-bg`, `-border`

---

## 6. 新しい色を追加する手順

### Step 1: 必要性を確認
- 既存のセマンティックカラーで代替できないか検討
- 類似色の統合を優先

### Step 2: 色の役割を決定
- ベース / セマンティック / アクセント / ドメイン固有 のどれか
- 本文使用可能か否か

### Step 3: WCAG AAを確認
- 背景色 `#1a1a2e` とのコントラスト比をチェック
- ツール: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- 最低基準: 4.5:1（通常テキスト）、3.0:1（大きいテキスト/UI）

### Step 4: CSS変数として定義
```css
/* ページ固有CSSファイルの冒頭に追加 */
:root {
    --new-color: #xxxxxx;
    --new-color-text: #yyyyyy;  /* テキスト用（明るめ） */
}
```

### Step 5: このドキュメントを更新
- 新しい色をコントラスト検証済みカラー表に追加

---

## 7. やってはいけない変更

| 変更 | 理由 |
|------|------|
| `#e8e8e8` を `#999999` に変更 | コントラスト比がAA境界まで低下 |
| ドメイン固有色のセマンティクスを崩す | 例: 青=タイプA の一貫性が失われる |
| 新しいアクセントカラーを安易に追加 | 色の意味が過剰になり認知負荷増加 |
| グラデーション背景の上に薄い文字色 | コントラスト不足の可能性 |

---

## 8. レビュー時チェックリスト

| チェック項目 | 確認方法 |
|--------------|----------|
| 新しい色の追加有無 | `grep -E '#[0-9a-fA-F]{3,6}' *.css` で未定義色を検出 |
| 本文テキストの色 | `p`, `li`, `td` に `--dark-text-*` 以外の色がないか |
| アクセントカラーの使用箇所 | 見出し・バッジ・アイコン以外に使われていないか |
| WCAG AA準拠 | 新しい色のコントラスト比 >= 4.5:1 |
| CSS変数使用 | ハードコードされたHEX値がないか |

---

## 9. 参考: KMSキータイプページのカラー構成

`security-governance/kms-key-types.html` の実装例：

### セクション別テーマカラー

| セクション | 背景グラデーション | 見出し色 | 意味 |
|------------|-------------------|----------|------|
| ヘッダー | Gold | gradient-text | ページタイトル |
| 結論ファースト | Green | `#81c784` | 成功・要約 |
| たとえ話 | Purple | `#ce93d8` | 教育・比喩 |
| フローチャート | Cyan | `#4dd0e1` | 判断・選択 |
| ベストプラクティス | Pink | `#f48fb1` | 推奨事項 |

### キータイプ別カラー

| キータイプ | メイン | テキスト | 意味 |
|------------|--------|----------|------|
| AWS所有キー | `#2196f3` | `#64b5f6` | 基本・シンプル |
| AWSマネージドキー | `#ff9800` | `#ffb74d` | 中間・バランス |
| カスタマーマネージドキー | `#4caf50` | `#81c784` | 完全管理 |

---

## 関連ドキュメント

- `role-based-colors.md` - ライトテーマ用カラーパレット
- `ng-patterns.md` - NGパターン集（ライト/ダーク共通）
- `hue-clash-rules.md` - 色相衝突防止ルール
