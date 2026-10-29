# AWS SAP (Solutions Architect Professional) 学習リソース

AWS Solutions Architect Professional 試験の学習用リソースを集めた Web サイトです。図解・技術解説・練習問題で、試験範囲を効率よく学べるようにしています。

公開サイト: https://ssuzuki1063.github.io/aws_sap_studying/

## コンテンツ

- **学習ページ(300 以上)**: サービスごとの図解と解説。8 つの表示カテゴリ(ネットワーキング / セキュリティ・ガバナンス / コンピュート・アプリケーション / コンテンツ配信・DNS / 開発・デプロイメント / ストレージ・データベース / 移行・転送 / 分析・運用・クイズ)に分けて並べています
- **AWS Black Belt の資料**: AWS 公式のセミナー資料(PDF)へのリンク
- **練習問題(13 カテゴリ・219 問)**: 解説と、関連する学習ページへのリンク付き
- **そのほか**: 概念マップ、用語集、試験ガイド、ロードマップ、ブックマーク、サイト内検索

## 仕組み

[Astro 5](https://astro.build/) で作った静的サイトで、GitHub Pages で公開しています。

- ページは `src/pages/<category>/<name>.astro` に置きます
- 一覧・検索・統計のデータは、`src/data/resource-registry.json` から `scripts/generate-data.mjs` が生成します(`public/data.js` / `public/index.js` / `src/data/resources.ts` は生成物なので、手で編集しません)
- 共通の CSS / JS / 概念マップのデータはリポジトリ直下の `css/` `js/` `concepts/` にあり、ビルド時に `public/` へコピーされます
- `master` に push すると、GitHub Actions(`deploy.yml`)がビルドして `gh-pages` ブランチに公開します。`gh-pages` は CI 専用なので、手で commit や push をしません

## ローカルで動かす

Node.js 24(CI と同じ版)を使います。

```bash
git clone https://github.com/SSuzuki1063/aws_sap_studying.git
cd aws_sap_studying
npm ci
npm run dev        # http://localhost:4321/aws_sap_studying/
```

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド(静的ファイルのコピー → データ生成 → `dist/` に出力) |
| `npm run preview` | ビルド結果の確認(先に `npm run build` が要る) |
| `npm run test:e2e:chromium` | Playwright の E2E テスト |
| `npx astro check` | Astro / TypeScript の型チェック |
| `npm run qa:all` | QA 一式 |

HTML の W3C 検証には Python を使います(`pyproject.toml` は無いので、仮想環境に直接入れます)。

```bash
uv venv && source .venv/bin/activate
uv pip install beautifulsoup4 lxml html5lib requests
npm run build
python3 scripts/ci/validate_html_w3c.py --pr-mode --base-dir dist   # 変更したページだけを、ビルド後の dist/ で検証
```

## コンテンツを追加・更新する

Claude Code のスキルを使う前提で作っています。

| やりたいこと | 使うもの |
|---|---|
| 新しい学習ページを追加する | HTML を `new_html/` に置いて `/skill resource`(デプロイまで一気に進めるなら `/ship`) |
| 既存ページを更新する | 新しい版を `replace_html/` に置いて `/skill replace` |
| ページを削除する | `/skill delete` |
| Black Belt の PDF を登録する | PDF を `BlackBelt/` に置いて `/skill blackbelt` |
| 練習問題を追加する | `public/quiz-data-extended.js` を編集する(書き方は `.claude/docs/quiz.md`) |

スキルを使わずに手で追加するときの手順は `.claude/rules/integration-workflow.md` にあります。

変更は作業ブランチで行い、PR を作って `master` にマージします(マージするとサイトに公開されます)。

## 開発者向けの資料

- `CLAUDE.md`: 守るべきルールの要約
- `.claude/docs/`: コマンド一覧、ビルドの仕組み、テスト、CI、スキルの一覧など
- `.claude/rules/`: HTML・CSS・JS・データの規約(該当するファイルを編集するとき、Claude Code が自動で読み込みます)

`docs/` には、アクセシビリティの資料(WCAG 2.1 の解説と、2025-12 時点の監査記録)だけを置いています。

## ライセンス

学習目的で作成しています。AWS のサービス名・商標・著作権は Amazon Web Services, Inc. に帰属します。

質問・提案・不具合の報告は [GitHub Issues](https://github.com/SSuzuki1063/aws_sap_studying/issues) へお願いします。
