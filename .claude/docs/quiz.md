# クイズ問題の追加

クイズのデータは `public/quiz-data-extended.js` の `quizData` にあり、`src/pages/quiz.astro` が読み込む。`public/` のファイルはそのまま配信されるので、generate-data は要らない。

(以前は `integrate` スキルにあったテンプレートを、2026-10 に実データに合わせて書き直したもの。)

## 問題の形

```javascript
{
  id: 27,                       // カテゴリ内の通し番号(カテゴリごとに 1 から振る数値)
  question: '問題文(日本語)',
  options: [                    // 選択肢はちょうど 4 つ
    '選択肢 1',
    '選択肢 2',
    '選択肢 3',
    '選択肢 4'
  ],
  correct: 1,                   // 正解の添字(0〜3)
  explanation: '解説(日本語、2〜4 文)。ほかの選択肢がなぜ違うかにも触れる',
  relatedResources: [           // 任意。解説の下に関連リンクとして出る
    { title: 'Direct Connect ガイド', path: 'networking/aws-direct-connect-guide.html', type: 'internal' },
    { title: 'AWS Direct Connect Documentation', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/', type: 'external' }
  ]
}
```

- `id` はカテゴリの中で重複させない。追加するときは、そのカテゴリの最大値 + 1 にする
- `relatedResources` の `internal` は、サイト内のページを `<category>/<name>.html` の形で指す(`resource-registry.json` のキーと同じ)。`external` は `url` に AWS ドキュメントなどを書く

## カテゴリ

`quizData` のキーは、サイトの表示カテゴリとは別に 13 個ある。

`networking` / `security-governance` / `compute-applications` / `content-delivery-dns` / `development-deployment` / `transit-gateway` / `organizational-complexity` / `cost-optimization` / `migration-modernization` / `storage-database` / `analytics-bigdata` / `monitoring-logging` / `ai-machine-learning`

新しいカテゴリを作るときは、ほかのカテゴリと同じく `title` と `icon` も付ける。

## 問題の書き方

- SAP 試験と同じく、「ある組織が〜したい。最も適切なソリューションはどれか」のような状況設定の問題にする
- 誤りの選択肢も、もっともらしいもの(実在する機能の組み合わせ)にする
- 解説では、正解の理由と、ほかの選択肢が外れる理由を書く

## 追加したあとに確かめること

```bash
node --check public/quiz-data-extended.js   # 構文エラーが無いか
npm run dev                                  # http://localhost:4321/aws_sap_studying/quiz.html で表示を確認
```

- 選択肢がちょうど 4 つ、`correct` が 0〜3、`id` がカテゴリ内で重複していない
- `relatedResources` の `internal` のページが実在する(`ls src/pages/<category>/<name>.astro`)

## 古いスクリプトについて

`scripts/quiz/add_related_resources_to_quiz.py` と `scripts/quiz_management/analyze_quiz.py` は、移行前の場所(ルート直下の `quiz-data-extended.js`)を読みにいくため、今のままでは動かない。`relatedResources` は手で書く。
