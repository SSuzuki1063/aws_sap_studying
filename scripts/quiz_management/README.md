# クイズ管理スクリプト

クイズのデータは `public/quiz-data-extended.js` にあり、`src/pages/quiz.astro` と `public/quiz-app.js` が読み込んで表示する。問題の書き方とカテゴリの一覧は `.claude/docs/quiz.md` にまとめてある。

## analyze_quiz.py

カテゴリ別の問題数と、関連リンク(`relatedResources`)のうちサイトに存在しないページを指しているものを表示する。

```bash
python3 scripts/quiz_management/analyze_quiz.py   # どのディレクトリから実行してもよい
```

出力の例:

```
カテゴリ別問題数:
----------------------------------------------------------------------
✓  1. ネットワーキング                         (networking                  ):  26問
...
合計カテゴリ数: 13
合計問題数: 219問
...
⚠ 存在しないページを指す関連リンク: 164件
  - quiz-data-extended.js:3495  continuous-improvement/systems-manager-guide.html
```

- 10 問未満のカテゴリには `⚠` が付く
- 関連リンクの存在確認は、`src/data/resource-registry.json` のキーと突き合わせて行う
- 標準ライブラリだけで動く(Python 3.9 以降)

## 関連リンクを自動で付ける

```bash
python3 scripts/quiz/add_related_resources_to_quiz.py
```

`relatedResources` が無い問題に、問題文と解説のキーワードから関連リンクを最大 3 件付ける。サイトに存在するページだけを付け、元のファイルは `backups/quiz-data-extended.js.backup` に保存する(`backups/` は gitignore 済み)。

## 問題を足したあとに

```bash
node --check public/quiz-data-extended.js       # 構文エラーが無いか
python3 scripts/quiz_management/analyze_quiz.py  # 問題数とリンク切れ
npm run dev                                      # http://localhost:4321/aws_sap_studying/quiz.html で表示を確認
```

構文エラーでよくある原因: カンマの付け忘れや余分なカンマ、引用符の閉じ忘れ、括弧の対応ずれ。
