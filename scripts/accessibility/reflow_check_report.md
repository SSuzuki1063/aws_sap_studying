# 320px幅リフロー検証レポート

**検証日**: 2025-12-28
**対象**: index.html, quiz.html
**基準**: WCAG 2.1 達成基準 1.4.10 リフロー (レベルAA)

---

## 📊 検証結果サマリー

| ファイル | 768pxメディアクエリ | 320pxメディアクエリ | 状態 |
|---------|-------------------|-------------------|------|
| index.html | ✅ あり | ❌ なし | ⚠️ 要改善 |
| quiz.html | ✅ あり | ❌ なし | ⚠️ 要改善 |

---

## 🔍 現在の実装状況

### index.html

**メディアクエリ**: `@media (max-width: 768px)` のみ

```css
@media (max-width: 768px) {
    body { padding: 10px; }
    .header h1 { font-size: 1.8em; }
    .content { padding: 20px; }
    .resource-list { grid-template-columns: 1fr; }
    .category-link { padding: 12px 16px; min-height: 48px; }
    .major-category-header { font-size: 1.7em; }
}
```

### quiz.html

**メディアクエリ**: `@media (max-width: 768px)` のみ

```css
@media (max-width: 768px) {
    .categories-grid { grid-template-columns: 1fr; }
    .quiz-header { flex-direction: column; gap: 15px; }
}
```

---

## ⚠️ 潜在的な問題

### 320px幅で発生する可能性のある問題

1. **フォントサイズが大きすぎる**
   - `.major-category-header { font-size: 1.7em; }` → 320pxでは大きすぎる可能性
   - `.header h1 { font-size: 1.8em; }` → 320pxでは折り返しが多くなる

2. **固定パディング/マージン**
   - `.content { padding: 20px; }` → 320pxでは左右40px（合計）は多い
   - タッチターゲットは維持しつつ、スペースを最適化する必要

3. **グリッドレイアウト**
   - ✅ `grid-template-columns: 1fr` で既に対応済み
   - 横スクロールは発生しないはず

4. **テキストの折り返し**
   - 長い単語や英語のサービス名が折り返されるか確認必要
   - `word-wrap: break-word;` または `overflow-wrap: break-word;` の使用を推奨

---

## ✅ 推奨修正

### index.html に追加すべきメディアクエリ

```css
/* 320px幅用の追加メディアクエリ */
@media (max-width: 480px) {
    .major-category-header {
        font-size: 1.5em; /* 1.7em → 1.5em */
    }

    .content {
        padding: 15px; /* 20px → 15px */
    }

    .header h1 {
        font-size: 1.6em; /* 1.8em → 1.6em */
    }
}

@media (max-width: 320px) {
    .major-category-header {
        font-size: 1.3em; /* 1.5em → 1.3em */
    }

    .content {
        padding: 10px; /* 15px → 10px */
    }

    .header h1 {
        font-size: 1.4em; /* 1.6em → 1.4em */
    }

    body {
        padding: 5px; /* 10px → 5px */
    }

    .stats {
        padding: 20px; /* 30px → 20px */
    }

    .category-nav {
        padding: 20px; /* 30px → 20px */
    }
}

/* テキスト折り返し対策（全画面サイズ） */
.major-category-header,
.header h1,
.resource-list a {
    word-wrap: break-word;
    overflow-wrap: break-word;
}
```

### quiz.html に追加すべきメディアクエリ

```css
/* 320px幅用の追加メディアクエリ */
@media (max-width: 480px) {
    .quiz-header h1 {
        font-size: 1.5em;
    }

    .option-button {
        padding: 12px 15px;
        font-size: 0.95em;
    }
}

@media (max-width: 320px) {
    .quiz-header h1 {
        font-size: 1.3em;
    }

    .option-button {
        padding: 10px 12px;
        font-size: 0.9em;
    }

    .quiz-container {
        padding: 15px;
    }
}

/* テキスト折り返し対策 */
.option-button,
.quiz-header h1 {
    word-wrap: break-word;
    overflow-wrap: break-word;
}
```

---

## 🧪 テスト手順

### ブラウザ開発者ツールでのテスト

1. **Chrome/Edge開発者ツール**:
   ```
   F12 → デバイスツールバー切り替え (Ctrl+Shift+M)
   → レスポンシブモード → 幅を320pxに設定
   ```

2. **テスト項目**:
   - [ ] 横スクロールバーが表示されないか
   - [ ] 全てのテキストが折り返されて表示されるか
   - [ ] ボタンやリンクが48px以上（タッチターゲット）か
   - [ ] フォントサイズが読みやすいか
   - [ ] パディング/マージンが適切か

3. **テストページ**:
   - index.html
   - quiz.html
   - 代表的な学習リソースHTML（5-10ページ）
   - knowledge-base.html
   - table-of-contents.html

---

## 📋 WCAG 2.1 要件

### 達成基準 1.4.10 リフロー (レベルAA)

> コンテンツは、情報や機能を損なうことなく、かつ次の方向でスクロールせずに表示できる:
> - **縦スクロールコンテンツの場合**: 320 CSS ピクセル幅
> - **横スクロールコンテンツの場合**: 256 CSS ピクセル高さ

**例外**:
- 使用や意味の理解に2次元レイアウトが必要なコンテンツ
  - 例: 画像、地図、図表、ビデオ、ゲーム、プレゼンテーション、データテーブル

---

## 🎯 優先度

| 優先度 | タスク | 理由 |
|-------|--------|------|
| 🔴 高 | 320px/480pxメディアクエリ追加 | WCAG 2.1 レベルAA要件 |
| 🟡 中 | テキスト折り返し対策 | 長い単語の横スクロール防止 |
| 🟢 低 | 実機でのビジュアルテスト | 実際のユーザー体験確認 |

---

## ✨ まとめ

**現状**: 768pxのメディアクエリのみで、320px専用の最適化なし

**リスク**: 320px幅で以下の可能性:
- フォントサイズが大きすぎて読みづらい
- パディングが多すぎてコンテンツエリアが狭い
- 一部のテキストが横スクロールを引き起こす可能性

**推奨アクション**:
1. 上記のメディアクエリを追加
2. ブラウザ開発者ツールで320pxテスト
3. 必要に応じて微調整

**推定作業時間**: 2-3時間（実装+テスト）

---

**参考リンク**:
- [WCAG 2.1 達成基準 1.4.10 リフロー](https://waic.jp/translations/WCAG21/#reflow)
- [Responsive Web Design Basics - Google](https://web.dev/responsive-web-design-basics/)
