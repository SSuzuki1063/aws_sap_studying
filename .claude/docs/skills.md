# Available Skills

## Resource & Content Skills

| Skill | Usage | Purpose |
|-------|-------|---------|
| `resource` | `/skill resource` | HTMLリソース統合管理オーケストレーター（integrate/replace/delete を自動ルーティング） |
| `integrate` | `/skill integrate` | HTML resource integration (categorization → breadcrumbs → TOC → W3C validation → git staging → data update guidance) |
| `replace` | `/skill replace` | 既存HTMLリソースを replace_html/ の新バージョンで置換（data.js/index.js 更新不要） |
| `delete` | `/skill delete` | HTMLリソースをサイトから完全削除（data.js・index.js・HTMLファイル・概念マップ参照・隣接ページナビを整合） |
| `blackbelt` | `/skill blackbelt` | AWS Black Belt PDF を学習リソースとして登録（data.js・index.js のデータ登録のみ。W3C検証・TOC不要） |
| `ship` | `/skill ship` | Stage → commit → push → deploy to gh-pages |
| `wcag-accessibility` | `/skill wcag-accessibility` | WCAG 2.1 AA verification (contrast, headings, SVG, semantic HTML) |
| `aws-knowledge-organizer` | `/skill aws-knowledge-organizer` | Organize AWS study resources: bulk operations, TOC generation, quiz management |
| `concept-map-manager` | `/skill concept-map-manager` | AWS概念マップ JSONデータ管理: L2サービス追加・L3/L4編集・クロスリンク設定・インデックス再生成 |
| `d2-diagram` | `/skill d2-diagram` | D2 diagram language でSVG図版を生成（AWS構成図・ネットワーク図など。SVG直書き禁止） |

## Speckit Feature Development Commands

| Command | Usage | Purpose |
|---------|-------|---------|
| `speckit.specify` | `/speckit.specify` | Create/update feature spec from natural language description |
| `speckit.clarify` | `/speckit.clarify` | Identify underspecified areas in current spec |
| `speckit.plan` | `/speckit.plan` | Generate implementation plan from spec |
| `speckit.tasks` | `/speckit.tasks` | Generate dependency-ordered tasks.md |
| `speckit.implement` | `/speckit.implement` | Execute tasks from tasks.md |
| `speckit.analyze` | `/speckit.analyze` | Cross-artifact consistency analysis (spec/plan/tasks) |
| `speckit.checklist` | `/speckit.checklist` | Generate custom checklist for current feature |
| `speckit.constitution` | `/speckit.constitution` | Create/update project constitution at `.specify/memory/constitution.md` |

Speckit artifacts are stored in `specs/[###-feature-name]/` directories.
