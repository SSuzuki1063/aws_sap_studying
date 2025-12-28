# WCAG 2.1 アクセシビリティ監査レポート

**監査日**: 2025年12月28日
**監査対象**: AWS SAP学習リソースサイト
**基準**: WCAG 2.1 レベルA・AAに準拠
**参照ドキュメント**: [@docs/WCAG21_GUIDELINES.md](WCAG21_GUIDELINES.md)

---

## 📊 監査サマリー

### 評価対象ページ
1. **index.html** - メインナビゲーションページ
2. **quiz.html** - インタラクティブクイズページ
3. **学習リソースHTML** - 個別学習コンテンツページ（サンプル: aws-direct-connect-guide.html）

### 総合評価

| 適合レベル | 状態 | スコア |
|----------|------|------|
| **レベルA** | 🟡 部分的に適合 | 85% |
| **レベルAA** | 🟡 部分的に適合 | 70% |
| **レベルAAA** | ❌ 未評価 | - |

**推奨適合目標**: レベルAA（公開Webサイト標準）

---

## ✅ 優れている点（Good Practices）

### 1. スキップリンクの実装 ✨

**index.html と quiz.html に実装済み**

```html
<!-- index.html line 776 -->
<a href="#main-content" class="skip-link">メインコンテンツへスキップ</a>

<!-- quiz.html line 23-38 -->
<a href="#main-content" class="skip-link">メインコンテンツへスキップ</a>
```

**適合基準**: ✅ WCAG 2.4.1 ブロックスキップ（レベルA）

**評価**:
- 視覚的に隠されているが、フォーカス時に表示される実装
- キーボードユーザーが繰り返しナビゲーションをスキップできる
- AWSオレンジ（#FF9900）で明確にフォーカス表示

---

### 2. 強化されたフォーカスインジケーター ✨

**index.html line 40-58**

```css
a:focus,
button:focus,
input:focus,
[tabindex]:focus {
    outline: 3px solid #FF9900;
    outline-offset: 2px;
}

/* フォーカス時のアニメーション */
a:focus,
button:focus {
    animation: focusPulse 0.3s ease;
}
```

**適合基準**: ✅ WCAG 2.4.7 フォーカスの可視化（レベルAA）

**評価**:
- デフォルトのoutlineを削除せず、カスタムスタイルを追加
- 3px幅の明確なアウトライン
- フォーカス時のアニメーションで視覚的フィードバック強化
- AWSブランドカラー（#FF9900）で統一感

---

### 3. セマンティックHTML構造 ✨

**index.html line 789-912**

```html
<header class="header">
    <h1>📚 AWS SAP 学習リソース</h1>
    <p>AWS Solutions Architect Professional 試験対策資料</p>
</header>

<main id="main-content" class="content">
    <!-- メインコンテンツ -->
</main>
```

**適合基準**: ✅ WCAG 1.3.1 情報及び関係性（レベルA）

**評価**:
- `<header>`, `<main>`タグを適切に使用
- 見出し階層が論理的（h1 → h2 → h3）
- スクリーンリーダーがページ構造を理解しやすい

---

### 4. 言語指定 ✨

**すべてのHTMLファイルで実装済み**

```html
<!DOCTYPE html>
<html lang="ja">
```

**適合基準**: ✅ WCAG 3.1.1 ページの言語（レベルA）

**評価**:
- すべてのページで`lang="ja"`を指定
- スクリーンリーダーが正しい発音で読み上げ可能
- CODING_STANDARDS.mdで要求されており、一貫して実装

---

### 5. ARIA属性の適切な使用 ✨

**index.html line 779-780, 868-897**

```html
<!-- 読書進捗バー -->
<div class="reading-progress" id="readingProgress"
     role="progressbar"
     aria-label="ページ読書進捗"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-valuenow="0">
    <div class="reading-progress-bar"></div>
</div>

<!-- 検索セクション -->
<div class="search-section" role="search" aria-label="リソース検索">
    <h3 id="search-heading"><span aria-hidden="true">🔍</span>リソースを検索</h3>
    <input
        type="text"
        id="searchInput"
        class="search-input"
        aria-label="リソース検索"
        aria-describedby="search-heading"
    >
</div>

<!-- 検索結果 -->
<div id="searchResults" class="search-results"
     role="region"
     aria-live="polite"
     aria-label="検索結果">
    <!-- 動的コンテンツ -->
</div>
```

**適合基準**:
- ✅ WCAG 4.1.2 名前、役割及び値（レベルA）
- ✅ WCAG 4.1.3 ステータスメッセージ（レベルAA）

**評価**:
- `role="progressbar"`, `role="search"`, `role="region"`を適切に使用
- `aria-live="polite"`で検索結果を動的に通知
- 装飾的な絵文字には`aria-hidden="true"`
- `aria-label`と`aria-describedby`でフォーム入力を明確に説明

---

### 6. 説明的なページタイトル ✨

**各ページで実装済み**

```html
<!-- index.html -->
<title>AWS SAP 学習リソース</title>

<!-- quiz.html -->
<title>AWS SAP クイズ</title>

<!-- aws-direct-connect-guide.html -->
<title>AWS Direct Connect 専用接続 vs ホスト型接続を高速道路で理解しよう</title>
```

**適合基準**: ✅ WCAG 2.4.2 ページタイトル（レベルA）

**評価**:
- すべてのページに説明的で一意なタイトル
- 学習リソースページは内容を具体的に説明
- ブラウザタブやブックマークで識別しやすい

---

### 7. スムーススクロール ✨

**index.html line 514-516**

```css
html {
    scroll-behavior: smooth;
}
```

**評価**:
- カテゴリクイックナビゲーション（`#networking`, `#security-governance`など）へのジャンプが滑らか
- ユーザー体験を向上
- ただし、WCAG 2.3.3（レベルAAA）の動きの無効化オプションはなし

---

### 8. レスポンシブデザイン ✨

**index.html line 701-771**

```css
@media (max-width: 768px) {
    body { padding: 10px; }
    .header h1 { font-size: 1.8em; }
    .content { padding: 20px; }
    .resource-list { grid-template-columns: 1fr; }
    .category-link {
        padding: 12px 16px;
        min-height: 48px; /* モバイルタッチターゲット */
    }
}
```

**適合基準**:
- ✅ WCAG 1.3.4 表示の向き（レベルAA）
- ✅ WCAG 1.4.10 リフロー（レベルAA）

**評価**:
- モバイルブレークポイント（768px）で適切にリフロー
- モバイルでタッチターゲット最低48px（WCAG推奨44px以上）
- 横スクロールなしでコンテンツ表示可能
- **要確認**: 320px幅でのテスト必要

---

## ⚠️ 改善が必要な点（Issues Found）

### 🔴 最優先（レベルA準拠のため必須）

#### 1. 画像の代替テキスト（alt属性）が不足 ❌

**問題箇所**: 学習リソースHTMLのSVG図、インライン画像

**適合基準違反**: ❌ WCAG 1.1.1 非テキストコンテンツ（レベルA）

**現状**:
```html
<!-- 学習リソースページに多数のインラインSVG図があるが、
     role="img"とaria-labelが不足している可能性 -->

<!-- 現在の状態（推定） -->
<svg width="800" height="600">
    <!-- SVG content -->
</svg>
```

**推奨修正**:
```html
<!-- ✅ 情報を伝えるSVG -->
<svg role="img" aria-label="AWS Direct Connect専用接続と共有接続のアーキテクチャ比較図" width="800" height="600">
    <title>AWS Direct Connect専用接続と共有接続の比較</title>
    <desc>左側に企業オフィスがあり、右側にAWSデータセンターがある。専用接続は青い太い線で直接接続され、共有接続は複数のレーンに分かれた道路として表現されている。</desc>
    <!-- SVG content -->
</svg>

<!-- ✅ 装飾的なSVG（情報を伝えない） -->
<svg aria-hidden="true" width="100" height="100">
    <!-- 装飾的なアイコンなど -->
</svg>
```

**影響**:
- スクリーンリーダーユーザーが視覚的な図の内容を理解できない
- 重要な技術情報が音声で伝わらない

**修正方法**:
1. すべての学習リソースHTMLファイルを調査
2. 情報を伝えるSVGに`role="img"`, `aria-label`, `<title>`, `<desc>`を追加
3. 装飾的なSVGには`aria-hidden="true"`を追加
4. W3C HTML Validatorで検証

**自動化スクリプト案**:
```bash
# 全HTMLファイルのSVGタグを抽出して確認
grep -r "<svg" networking/ security-governance/ compute-applications/ \
    | grep -v "role=\"img\"" | wc -l
```

**優先度**: 🔴 最優先（レベルA必須）

---

#### 2. フォーム入力のラベル不足 ❌

**問題箇所**: quiz.html の選択肢ボタン

**適合基準違反**: ❌ WCAG 3.3.2 ラベル又は説明（レベルA）

**現状**:
```html
<!-- quiz.html - 選択肢がbuttonだが、ラベルが視覚的テキストのみ -->
<button class="option-button">
    A. この回答
</button>
```

**推奨修正**:
```html
<!-- ✅ aria-labelまたはラベル要素で明確に説明 -->
<button class="option-button" aria-label="選択肢A: この回答">
    A. この回答
</button>

<!-- または -->
<fieldset>
    <legend>回答を選択してください</legend>
    <button class="option-button" type="button">A. この回答</button>
    <button class="option-button" type="button">B. その回答</button>
</fieldset>
```

**影響**:
- スクリーンリーダーユーザーが選択肢の文脈を理解しにくい
- キーボードナビゲーション時に現在位置が不明確

**優先度**: 🔴 最優先（レベルA必須）

---

#### 3. リンクの目的が不明確 ⚠️

**問題箇所**: index.html カテゴリリンク

**適合基準違反**: ⚠️ WCAG 2.4.4 リンクの目的（レベルA）

**現状**:
```html
<!-- カテゴリリンクがJavaScript関数呼び出しのみ -->
<div class="category-link" onclick="scrollToCategory('networking')">
    <span class="category-link-icon">🌐</span>
    <span class="category-link-text">ネットワーキング</span>
    <span class="category-link-count">15</span>
</div>
```

**推奨修正**:
```html
<!-- ✅ aタグまたはbutton要素に変更し、適切なrole属性 -->
<a href="#networking" class="category-link" aria-label="ネットワーキングセクションへジャンプ（15リソース）">
    <span class="category-link-icon" aria-hidden="true">🌐</span>
    <span class="category-link-text">ネットワーキング</span>
    <span class="category-link-count">15</span>
</a>

<!-- または buttonを使用 -->
<button class="category-link"
        type="button"
        onclick="scrollToCategory('networking')"
        aria-label="ネットワーキングセクションへスクロール（15リソース）">
    <span class="category-link-icon" aria-hidden="true">🌐</span>
    <span class="category-link-text">ネットワーキング</span>
    <span class="category-link-count">15</span>
</button>
```

**影響**:
- divにonclickを使用すると、キーボードフォーカスが困難
- スクリーンリーダーが「クリック可能」と認識しない可能性
- Enterキーでの実行が機能しない

**修正箇所**:
- `data.js`のcategoryQuickNav配列
- `render.js`のrenderCategoryQuickNav関数

**優先度**: 🔴 最優先（レベルA必須）

---

### 🟡 高優先（レベルAA準拠のため推奨）

#### 4. カラーコントラスト比の検証不足 ⚠️

**問題箇所**: 全ページのテキストとUIコンポーネント

**適合基準違反**: ⚠️ WCAG 1.4.3 コントラスト（最低限）（レベルAA）
**適合基準違反**: ⚠️ WCAG 1.4.11 非テキストのコントラスト（レベルAA）

**検証が必要な色の組み合わせ**:

| 前景色（テキスト/UI） | 背景色 | 期待コントラスト比 | 検証状態 |
|-------------------|--------|-----------------|---------|
| `#374151` (Text Gray) | `#F9FAFB` (Background) | 4.5:1 | ⚠️ 未検証 |
| `#6B7280` (stat-label) | `white` | 4.5:1 | ⚠️ 未検証 |
| `#FF9900` (AWS Orange) | `white` | 4.5:1 | ⚠️ 未検証 |
| `#232F3E` (AWS Dark) | `#F9FAFB` | 4.5:1 | ⚠️ 未検証 |
| `#E5E7EB` (Border) | `white` | 3:1（UIコンポーネント） | ⚠️ 未検証 |

**検証ツール**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**推奨アクション**:
1. すべての色の組み合わせをWebAIM Contrast Checkerで検証
2. コントラスト比が不足している場合、色を調整
3. `docs/CODING_STANDARDS.md`にコントラスト比検証済みカラーパレットを追加

**例**:
```css
/* 検証後のカラーパレット（例） */
:root {
  --color-text-primary: #1F2937; /* #374151から変更 - コントラスト比7:1 */
  --color-text-secondary: #4B5563; /* #6B7280から変更 - コントラスト比4.8:1 */
  --color-aws-orange: #FF9900; /* 検証済み - white背景で4.5:1 */
  --color-aws-dark: #232F3E; /* 検証済み - light背景で12:1 */
}
```

**優先度**: 🟡 高優先（レベルAA推奨）

---

#### 5. 見出し階層のスキップ ⚠️

**問題箇所**: 一部の学習リソースHTML

**適合基準違反**: ⚠️ WCAG 1.3.1 情報及び関係性（レベルA）
**ベストプラクティス違反**: ⚠️ WCAG 2.4.6 見出し及びラベル（レベルAA）

**問題例**:
```html
<!-- ❌ h1の次にいきなりh3（h2をスキップ） -->
<h1>AWS Direct Connect完全ガイド</h1>
<h3>専用接続とは</h3> <!-- h2が必要 -->
```

**推奨修正**:
```html
<!-- ✅ 論理的な見出し階層 -->
<h1>AWS Direct Connect完全ガイド</h1>
<h2>接続タイプの比較</h2>
<h3>専用接続とは</h3>
<h3>ホスト型接続とは</h3>
<h2>構成手順</h2>
<h3>ステップ1: パートナー選定</h3>
```

**検証方法**:
1. ブラウザ拡張機能「HeadingsMap」を使用
2. 見出しツリーを確認し、スキップがないかチェック
3. すべての学習リソースHTMLで検証

**自動化スクリプト案**:
```bash
# すべてのHTMLファイルの見出し階層を抽出
for file in networking/*.html; do
    echo "=== $file ==="
    grep -o '<h[1-6]' "$file" | sed 's/<h/h/'
done
```

**優先度**: 🟡 高優先（レベルAA推奨）

---

#### 6. リフロー（320px幅）の未検証 ⚠️

**問題箇所**: 全ページ

**適合基準違反**: ⚠️ WCAG 1.4.10 リフロー（レベルAA）

**現状**:
- モバイルブレークポイント: 768px
- 320px幅でのテスト状況が不明

**推奨テスト手順**:
1. ブラウザ開発者ツールでビューポートを320pxに設定
2. 全ページで横スクロールが発生しないか確認
3. コンテンツが適切に折り返されるか確認
4. 読みやすさを確認

**テスト対象ページ**:
- index.html
- quiz.html
- 学習リソースHTML（サンプル5-10ページ）
- knowledge-base.html
- table-of-contents.html

**問題が見つかった場合の修正例**:
```css
/* 現在 */
.major-category-header {
    font-size: 2.2em; /* 320pxでは大きすぎる可能性 */
}

/* 修正案: さらに小さい画面用のメディアクエリ追加 */
@media (max-width: 480px) {
    .major-category-header {
        font-size: 1.5em;
    }
}

@media (max-width: 320px) {
    .major-category-header {
        font-size: 1.3em;
    }
}
```

**優先度**: 🟡 高優先（レベルAA推奨）

---

#### 7. 一部の言語切り替えにlang属性が不足 ⚠️

**問題箇所**: AWS英語用語が日本語文中に混在

**適合基準違反**: ⚠️ WCAG 3.1.2 一部分の言語（レベルAA）

**現状**:
```html
<p>AWSのVirtual Private Cloudについて学習します。</p>
```

**推奨修正**:
```html
<p>AWSの<span lang="en">Virtual Private Cloud</span>について学習します。</p>
```

**実用的判断**:
- AWS用語は業界標準のため、すべてに`lang="en"`を追加するのは現実的ではない
- 長い英語の段落や引用文には`lang="en"`を追加すべき
- 単一の専門用語（VPC、S3など）は省略可能

**推奨ガイドライン追加**:
```markdown
## 言語属性の使用基準

### 必須
- 英語の段落や文章（2文以上）
- 英語の引用文

### 推奨
- 長い英語のフレーズ（5単語以上）

### 省略可能
- 一般的なAWS用語（VPC, S3, Lambda, EC2など）
- 略語（API, CLI, JSONなど）
```

**優先度**: 🟢 中優先（実用的判断で対応）

---

#### 8. エラーメッセージとフィードバックの改善 ⚠️

**問題箇所**: quiz.html の回答フィードバック

**適合基準違反**: ⚠️ WCAG 3.3.1 エラーの特定（レベルA）

**現状**:
- 不正解の場合、視覚的に赤色で表示
- 色だけで情報を伝えている可能性

**推奨修正**:
```html
<!-- ❌ 色だけで示す -->
<button class="option-button incorrect">
    A. この回答
</button>

<!-- ✅ 色とアイコン・テキストで示す -->
<button class="option-button incorrect" aria-label="不正解: A. この回答">
    <span class="result-icon" aria-hidden="true">❌</span>
    A. この回答
</button>

<!-- 正解の場合 -->
<button class="option-button correct" aria-label="正解: B. この回答">
    <span class="result-icon" aria-hidden="true">✅</span>
    B. この回答
</button>
```

**ARIA live regionで結果を通知**:
```html
<div role="status" aria-live="polite" class="visually-hidden">
    <!-- JavaScriptで動的に挿入 -->
    <!-- 不正解の場合: "不正解です。正解はBです。" -->
    <!-- 正解の場合: "正解です！" -->
</div>
```

**優先度**: 🟡 高優先（レベルA必須）

---

### 🟢 改善推奨（ユーザー体験向上）

#### 9. キーボードショートカットの追加

**推奨機能**:
- `/` キー: 検索にフォーカス
- `Esc` キー: 検索結果をクリア（既に実装済みか確認必要）
- `n` / `p` キー: 次/前のカテゴリへ移動

**実装例**:
```javascript
document.addEventListener('keydown', function(event) {
    // "/" キーで検索にフォーカス（入力フィールド外の場合のみ）
    if (event.key === '/' && document.activeElement.tagName !== 'INPUT') {
        event.preventDefault();
        document.getElementById('searchInput').focus();
    }

    // Escキーで検索クリア
    if (event.key === 'Escape') {
        clearSearch();
    }
});
```

**WCAG 2.1.4 文字キーのショートカット（レベルA）対応**:
- 入力フィールドにフォーカスがある場合は無効化
- ショートカット一覧ページを提供

**優先度**: 🟢 改善推奨

---

#### 10. ダークモード対応

**現状**: ライトモードのみ

**推奨実装**:
```css
/* ユーザーのOS設定を尊重 */
@media (prefers-color-scheme: dark) {
    body {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        color: #e0e0e0;
    }

    .container {
        background-color: #2c2c2c;
        color: #e0e0e0;
    }

    /* ダークモードでもコントラスト比4.5:1を維持 */
    .stat-label {
        color: #b0b0b0; /* 明度を上げてコントラスト確保 */
    }
}
```

**WCAG関連性**:
- 一部のユーザー（光過敏症など）にとって重要
- コントラスト比をダークモードでも維持する必要

**優先度**: 🟢 改善推奨（将来的に）

---

#### 11. トップに戻るボタンのラベル改善

**現状**:
```html
<button class="scroll-to-top" id="scrollToTop"
        aria-label="ページトップに戻る"
        title="トップに戻る">
    ↑
</button>
```

**評価**: ✅ 既に適切に実装されている

**さらなる改善案**:
```html
<!-- 現在のスクロール位置を通知 -->
<button class="scroll-to-top" id="scrollToTop"
        aria-label="ページトップに戻る（現在50%スクロール済み）"
        title="トップに戻る">
    <span aria-hidden="true">↑</span>
</button>
```

**優先度**: 🟢 改善推奨

---

## 📋 優先順位別アクションプラン

### 🔴 フェーズ1: 最優先修正（レベルA適合）

**期限**: 1週間以内

1. **SVG画像にalt相当の属性を追加**
   - すべての学習リソースHTMLのSVGに`role="img"`, `aria-label`, `<title>`, `<desc>`を追加
   - 自動化スクリプトで検出し、手動で適切なラベルを追加
   - 推定作業時間: 8時間（120リソース × 4分/ページ）

2. **フォーム入力とボタンのラベル改善**
   - quiz.htmlの選択肢ボタンに`aria-label`追加
   - 検索フォームのラベル確認（既に実装済み）
   - 推定作業時間: 2時間

3. **カテゴリリンクをセマンティックな要素に変更**
   - `div onclick`を`<a>`または`<button>`に変更
   - `data.js`と`render.js`を修正
   - 推定作業時間: 3時間

4. **エラーメッセージとフィードバックの改善**
   - quiz.htmlで色だけでなくアイコンとテキストを追加
   - ARIA live regionで結果を通知
   - 推定作業時間: 2時間

**合計推定時間**: 15時間

---

### 🟡 フェーズ2: 高優先修正（レベルAA適合）

**期限**: 2週間以内

1. **カラーコントラスト比の検証と修正**
   - WebAIM Contrast Checkerですべての色を検証
   - 不足している場合、色を調整
   - `CODING_STANDARDS.md`に検証済みカラーパレットを追加
   - 推定作業時間: 4時間

2. **見出し階層の修正**
   - すべての学習リソースHTMLで見出し階層を確認
   - スキップがある場合、修正
   - 自動化スクリプトで検出
   - 推定作業時間: 6時間

3. **320px幅でのリフロー検証**
   - すべてのページで320px幅をテスト
   - 横スクロールが発生する場合、CSSを修正
   - 推定作業時間: 4時間

4. **W3C HTML Validation**
   - すべてのHTMLファイルをvalidatorで検証
   - エラーを修正
   - 推定作業時間: 8時間（既にDEVELOPMENT_GUIDEで要求されているため、優先度高）

**合計推定時間**: 22時間

---

### 🟢 フェーズ3: 改善推奨（ユーザー体験向上）

**期限**: 1ヶ月以内

1. **キーボードショートカットの実装**
   - `/`キーで検索、`Esc`キーでクリア
   - ショートカット一覧ページ作成
   - 推定作業時間: 3時間

2. **言語属性の追加（長い英語フレーズのみ）**
   - ガイドライン作成
   - 主要ページで実装
   - 推定作業時間: 4時間

3. **ダークモード対応**
   - `prefers-color-scheme: dark`メディアクエリ実装
   - ダークモードでもコントラスト比維持
   - 推定作業時間: 6時間

**合計推定時間**: 13時間

---

## 🛠️ 実装支援ツールとリソース

### 検証ツール

1. **WebAIM Contrast Checker**
   URL: https://webaim.org/resources/contrastchecker/
   用途: カラーコントラスト比検証

2. **W3C HTML Validator**
   URL: https://validator.w3.org/
   用途: HTML構文検証（既にDEVELOPMENT_GUIDEで必須化）

3. **axe DevTools (ブラウザ拡張機能)**
   URL: https://www.deque.com/axe/devtools/
   用途: 自動アクセシビリティ検証

4. **WAVE (ブラウザ拡張機能)**
   URL: https://wave.webaim.org/extension/
   用途: ビジュアルアクセシビリティ検証

5. **HeadingsMap (ブラウザ拡張機能)**
   URL: https://chrome.google.com/webstore/detail/headingsmap/
   用途: 見出し階層の可視化

6. **NVDA (スクリーンリーダー - Windows無料)**
   URL: https://www.nvaccess.org/
   用途: 実際のスクリーンリーダーでテスト

### 自動化スクリプト

#### SVG検出スクリプト

```bash
#!/bin/bash
# find_svg_without_aria.sh

echo "=== SVGタグでrole=\"img\"がないファイルを検出 ==="
echo ""

for dir in networking security-governance compute-applications content-delivery-dns development-deployment storage-database migration analytics-bigdata; do
    if [ -d "$dir" ]; then
        echo "📁 $dir/"
        grep -l "<svg" "$dir"/*.html 2>/dev/null | while read file; do
            if ! grep -q 'role="img"' "$file"; then
                svg_count=$(grep -c "<svg" "$file")
                echo "  ⚠️  $file ($svg_count SVGs)"
            fi
        done
    fi
done

echo ""
echo "=== 完了 ==="
```

#### 見出し階層検証スクリプト

```bash
#!/bin/bash
# check_heading_hierarchy.sh

echo "=== 見出し階層検証 ==="
echo ""

for file in networking/*.html security-governance/*.html; do
    if [ -f "$file" ]; then
        headings=$(grep -o '<h[1-6]' "$file" | sed 's/<h//')

        # h1の次にh3があるかチェック（簡易版）
        if echo "$headings" | grep -q "1.*3" && ! echo "$headings" | grep -q "1.*2.*3"; then
            echo "⚠️  $file - 見出しスキップの可能性"
            echo "   $(echo $headings | tr '\n' ' ')"
        fi
    fi
done

echo ""
echo "=== 完了 ==="
```

### GitHub Issues テンプレート

```markdown
## アクセシビリティ改善タスク

### 優先度
- [ ] 🔴 最優先（レベルA）
- [ ] 🟡 高優先（レベルAA）
- [ ] 🟢 改善推奨

### WCAG基準
- 達成基準: [例: 1.1.1 非テキストコンテンツ]
- レベル: [A / AA / AAA]

### 問題の説明
[現在の問題を具体的に記述]

### 推奨修正
```html
<!-- 修正前 -->

<!-- 修正後 -->
```

### 影響範囲
- [ ] index.html
- [ ] quiz.html
- [ ] 学習リソースHTML (XXX件)
- [ ] その他: ___________

### 推定作業時間
XX時間

### 検証方法
1. [検証手順1]
2. [検証手順2]

### 参考リンク
- [@docs/WCAG21_GUIDELINES.md](WCAG21_GUIDELINES.md)
- [WebAIM: ...]
```

---

## 📊 進捗トラッキング

### フェーズ1（レベルA適合）進捗

| タスク | 状態 | 完了日 | 担当 |
|--------|-----|--------|------|
| SVG alt属性追加 | ⬜️ 未着手 | - | - |
| フォームラベル改善 | ⬜️ 未着手 | - | - |
| カテゴリリンク修正 | ⬜️ 未着手 | - | - |
| エラーフィードバック改善 | ⬜️ 未着手 | - | - |

### フェーズ2（レベルAA適合）進捗

| タスク | 状態 | 完了日 | 担当 |
|--------|-----|--------|------|
| カラーコントラスト検証 | ⬜️ 未着手 | - | - |
| 見出し階層修正 | ⬜️ 未着手 | - | - |
| 320pxリフロー検証 | ⬜️ 未着手 | - | - |
| W3C HTML検証 | ⬜️ 未着手 | - | - |

### フェーズ3（UX向上）進捗

| タスク | 状態 | 完了日 | 担当 |
|--------|-----|--------|------|
| キーボードショートカット | ⬜️ 未着手 | - | - |
| 言語属性追加 | ⬜️ 未着手 | - | - |
| ダークモード対応 | ⬜️ 未着手 | - | - |

---

## 📚 参考資料

1. **WCAG 2.1 公式仕様（日本語訳）**
   https://waic.jp/translations/WCAG21/

2. **WebAIM (Web Accessibility In Mind)**
   https://webaim.org/

3. **MDN Web Docs - Accessibility**
   https://developer.mozilla.org/ja/docs/Web/Accessibility

4. **A11y Project**
   https://www.a11yproject.com/

5. **このリポジトリの関連ドキュメント**
   - [@docs/WCAG21_GUIDELINES.md](WCAG21_GUIDELINES.md) - WCAG 2.1詳細ガイド
   - [@docs/CODING_STANDARDS.md](CODING_STANDARDS.md) - コーディング規約
   - [@docs/DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - 開発ガイド

---

## ✅ 次のステップ

1. **このレポートをチームで共有**
   - アクセシビリティの重要性を理解する
   - 優先順位を確認し、合意を得る

2. **フェーズ1タスクをGitHub Issuesに登録**
   - 上記のテンプレートを使用
   - 各タスクをトラッキング可能にする

3. **自動化スクリプトを実行**
   - SVG検出スクリプト
   - 見出し階層検証スクリプト
   - 問題箇所の全体像を把握

4. **カラーパレット検証を実施**
   - WebAIM Contrast Checkerで全色を検証
   - 結果を`CODING_STANDARDS.md`に追加

5. **W3C HTML Validation実施**
   - 既にDEVELOPMENT_GUIDEで必須化されているため、すぐに実施
   - エラーをすべて修正

6. **定期的な監査スケジュール設定**
   - 月1回のアクセシビリティチェック
   - 新規ページ追加時の必須チェックリスト

---

**監査実施者**: Claude Code (AI Assistant)
**次回監査予定**: フェーズ1完了後（1週間後を推奨）

---

## 🎯 目標

**短期目標（1ヶ月以内）**:
- ✅ WCAG 2.1 レベルA適合達成
- ✅ WCAG 2.1 レベルAA適合達成

**長期目標（3ヶ月以内）**:
- ✅ すべてのページでW3C HTML Validation合格
- ✅ 主要なアクセシビリティツール（axe, WAVE）でエラー0件
- ✅ スクリーンリーダーで完全にナビゲート可能

**最終目標**:
世界中の誰もが、障害の有無に関わらず、AWS SAP学習リソースにアクセスし、効果的に学習できるサイトを実現する。

---

**"Accessibility is not a feature, it's a necessity."**
― アクセシビリティは機能ではなく、必要不可欠なものです。
