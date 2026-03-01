# Automation Workflow Reference

`integrate_resource_complete.py` の完全ガイド。概要は [SKILL.md](../SKILL.md) を参照。

## 現在の自動化パイプライン

```
new_html/
  ├── aws-service-A.html
  └── aws-service-B.html
        ↓
[integrate_resource_complete.py]
        ↓
Step 1: integrate_new_html.py
  ✓ HTMLタイトル・コンテンツ解析
  ✓ キーワードスコアリングでカテゴリ判定
  ✓ 適切なカテゴリディレクトリへ移動
  ✓ 共通CSSリンク自動追加
  ✓ 固定ヘッダー自動追加
  ✓ data.js / index.js スニペット出力
        ↓
Step 2: add_breadcrumbs.py
  ✓ ファイルパスからカテゴリ検出
  ✓ パンくずHTML生成・挿入
        ↓
Step 3: add_sidebar_toc.py
  ✓ h2/h3タグからTOC生成（div.section-titleは対象外）
  ✓ 固定左サイドバー形式で挿入
  ⚠️ スキップ時は「⚠️【要対応】」を出力
        ↓
Step 4: add_home_button.py
  ✓ 「リソース集に戻る」ボタン追加（右下固定フローティング）
        ↓
Step 5: add_prev_next_nav.py --bottom-nav-only
  ✓ ページ下部ナビゲーション追加（前後ページリンク）
        ↓
Step 6: W3C HTML Validation（自動）
  ✓ W3C Validator APIで全ファイルを検証
  ✗ エラーがあればここで中断 → git stageはスキップ
        ↓
Step 7: git add（自動）
  ✓ 検証済みHTMLファイルを自動ステージング
        ↓
[MANUAL: data.js 更新 — resources, counts, updateHistory]
[MANUAL: index.js 更新 — searchData]
[MANUAL: ローカルテスト]
[MANUAL: git commit && git push]
```

## コマンドリファレンス

```bash
# 標準実行
python3 scripts/html_management/integrate_resource_complete.py

# ドライラン（変更なし・プレビューのみ）
python3 scripts/html_management/integrate_resource_complete.py --dry-run

# W3C検証スキップ（オフライン・高速イテレーション）
python3 scripts/html_management/integrate_resource_complete.py --skip-validation

# カスタムソースディレクトリ
python3 scripts/html_management/integrate_resource_complete.py --source replace_html/

# 詳細出力
python3 scripts/html_management/integrate_resource_complete.py --verbose
```

## ユーティリティスクリプト

```bash
# カウント自動更新（data.js の section/category count を同期）
python3 scripts/html_management/update_counts.py

# 統合後の整合性チェック
python3 scripts/ci/post_integration_check.py
python3 scripts/ci/post_integration_check.py --verbose

# HTML W3C検証
python3 scripts/ci/validate_html_w3c.py --files networking/foo.html
python3 scripts/ci/validate_html_w3c.py --pr-mode  # 変更HTMLファイルのみ

# CSS W3C検証（CSSファイルを変更した場合は必須）
npm run qa:css-validate:pr    # 変更CSSファイルのみ（PRモード）
npm run qa:css-validate       # 全CSSファイル（フルスキャン）
# 出力: qa-reports/css-validation.json

# パンくず・TOC・ボタンの個別実行
python3 scripts/html_management/add_breadcrumbs.py
python3 scripts/html_management/add_sidebar_toc.py [--dry-run]
python3 scripts/html_management/add_home_button.py
python3 scripts/html_management/add_prev_next_nav.py --bottom-nav-only [--force-update]

# HTMLバルク修正
python3 scripts/html_management/fix_html_issues.py

# クイズ統計
python3 scripts/quiz_management/analyze_quiz.py
```

## エラーハンドリング

### W3C検証エラー（Step 6で中断）

```
❌ W3C validation failed for networking/foo.html
   Error: Element "div" not allowed as child of element "ul" in this context.
```

対処:
1. エラー箇所を修正
2. 単独で再検証: `python3 scripts/ci/validate_html_w3c.py --files networking/foo.html`
3. 修正できたら `--skip-validation` で残りのパイプラインを通す

### TOCスキップ（Step 3の警告）

```
⚠️【要対応】add_sidebar_toc.py: TOCがスキップされました
```

原因: `<div class="section-title">` を使用している
対処: `<h2 class="section-title">` に変換してから `add_sidebar_toc.py` を再実行

### カテゴリ誤分類

`--dry-run` で確認してから手動でファイルを正しいディレクトリに移動し、再実行。
→ カテゴリマッピング: [category_mappings.md](category_mappings.md)

## 関連ドキュメント

- [SKILL.md](../SKILL.md) — スキル概要
- [html_integration_workflow.md](html_integration_workflow.md) — 詳細統合手順（Option A/B/C）
- [data_structure_guide.md](data_structure_guide.md) — data.js / index.js 構造
- [validation_checklist.md](validation_checklist.md) — 検証・デプロイチェックリスト
- [category_mappings.md](category_mappings.md) — カテゴリ判定ロジック
