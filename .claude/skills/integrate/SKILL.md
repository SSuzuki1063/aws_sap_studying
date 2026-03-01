---
name: integrate
description: HTML resource integration and deployment workflows for AWS SAP learning resource repository. Use when working with the AWS SAP study resource repository (https://ssuzuki1063.github.io/aws_sap_studying/) for: (1) Adding new HTML learning resources, (2) Creating quiz questions, (3) Managing data-driven architecture (data.js, index.js updates), (4) W3C HTML validation, (5) GitHub Pages deployment, (6) Running automation scripts (breadcrumbs, TOC, integration). Handles static site constraints (NO backend, NO build process, NO external dependencies). Critical workflow: MUST update TWO places when adding resources (data.js AND index.js).
---

# AWS SAP Learning Resource Integration Skill

## Overview

**Live Site:** https://ssuzuki1063.github.io/aws_sap_studying/
**Architecture:** Data-driven (data.js + render.js + index.js) — NO build process

## ⚠️ CRITICAL: File Placement

HTMLファイルは必ずルートレベルのカテゴリディレクトリに置く。`scripts/` には置かない。

| Category Directory | Example Services |
|-------------------|-----------------|
| `networking/` | Transit Gateway, VPN, Direct Connect |
| `security-governance/` | KMS, IAM, WAF, Cognito |
| `compute-applications/` | Lambda, ECS, Auto Scaling |
| `storage-database/` | S3, RDS, DynamoDB |
| `content-delivery-dns/` | CloudFront, Route 53 |
| `development-deployment/` | CloudFormation, CDK, EventBridge |
| `migration/` | DMS, Migration Hub |
| `analytics-bigdata/` | Kinesis, Redshift, Glue |
| `organizational-complexity/` | Organizations, Control Tower, RAM |
| `continuous-improvement/` | Systems Manager, CloudTrail |
| `cost-control/` | Savings Plans, storage optimization |

## Workflow 1: HTML リソース追加（最頻出）

```bash
# 1. new_html/ にファイルを配置
# 2. 実行（W3C検証・git stageまで自動）
python3 scripts/html_management/integrate_resource_complete.py [--dry-run] [--skip-validation]
# 3. data.js を更新: resources配列 + priority + updateHistory（先頭に追加）
# 4. index.js を更新: searchData配列
python3 scripts/html_management/update_counts.py  # カウント自動更新
# 5. コミット＆デプロイ
git add data.js index.js && git commit -m "feat: ..." && git push origin gh-pages
```

**⚠️ updateHistory を必ず更新** — 忘れると index.html の更新履歴タイムラインが古くなる:
```javascript
// data.js の updateHistory 配列先頭に追加
{ date: 'YYYY-MM-DD', type: 'content', title: '...', description: '...', categories: ['networking'], tags: [] }
```

→ 詳細手順（Option A/B/C・トラブルシュート）: **[html_integration_workflow.md](references/html_integration_workflow.md)**

## Workflow 2: クイズ問題追加

```bash
# quiz-data-extended.js の適切なカテゴリに追加
node -c quiz-data-extended.js  # 構文チェック
git add quiz-data-extended.js && git commit -m "feat: クイズ追加" && git push origin gh-pages
```

→ テンプレート・ガイドライン: **[quiz_question_template.md](references/quiz_question_template.md)**

## Workflow 3: 自動化スクリプト

```bash
python3 scripts/html_management/update_counts.py        # カウント同期
python3 scripts/ci/post_integration_check.py [--verbose] # 統合後確認
python3 scripts/ci/validate_html_w3c.py --pr-mode        # HTML W3C検証（変更ファイルのみ）
npm run qa:css-validate:pr                               # CSS W3C検証（変更ファイルのみ）
```

→ 全スクリプトリファレンス: **[automation_workflow.md](references/automation_workflow.md)**

## データ構造ルール（Two-Place Update）

リソース追加時は必ず**2箇所**更新:

1. `data.js` — `section.resources` 配列 + カウント + `updateHistory`
2. `index.js` — `searchData` 配列

→ 詳細: **[data_structure_guide.md](references/data_structure_guide.md)**

## Repository Constraints

**Deployed site (GitHub Pages):**
- ❌ NO backend, database, build process, external dependencies, CDNs
- ✅ Pure HTML/CSS/JavaScript, all resources inline or local, works offline
- ✅ GitHub Pages paths must include `/aws_sap_studying/` prefix

**Dev tooling (local / CI only):**
- ✅ Node.js/npm — Playwright E2E + QA (`npm ci`, `tsx`, `qa:css-validate:pr`)
- ✅ Python (`uv venv`) — HTML integration scripts, W3C validation

## Troubleshooting

| 症状 | 対処 |
|------|------|
| リソースがナビに出ない | `data.js` の resources配列とカウントを確認 |
| リソースが検索に出ない | `index.js` の `searchData` を確認 |
| TOCが生成されない | `<div>` → `<h2>` タグに変換してから再実行 |
| デプロイが反映されない | `git push origin gh-pages` を確認、1-2分待つ |
| クイズが動かない | `node -c quiz-data-extended.js` で構文確認 |

→ 詳細チェックリスト: **[validation_checklist.md](references/validation_checklist.md)**

## Reference Files

| ファイル | 内容 |
|---------|------|
| [html_integration_workflow.md](references/html_integration_workflow.md) | HTML統合詳細手順（Option A/B/C） |
| [automation_workflow.md](references/automation_workflow.md) | スクリプトリファレンス・エラー対処 |
| [data_structure_guide.md](references/data_structure_guide.md) | data.js / index.js 構造 |
| [quiz_question_template.md](references/quiz_question_template.md) | クイズ問題テンプレート |
| [validation_checklist.md](references/validation_checklist.md) | W3C検証・デプロイチェックリスト |
| [category_mappings.md](references/category_mappings.md) | AWSサービス → カテゴリマッピング |
| [assets/html_resource_template.html](assets/html_resource_template.html) | 新規HTMLリソーステンプレート |
