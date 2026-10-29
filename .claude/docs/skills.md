# Available Skills

## Resource & Content Skills

| Skill | Usage | Purpose |
|-------|-------|---------|
| `resource` | `/skill resource` | 学習リソースの追加・更新・削除・PDF 登録の入口。新規追加は ship の Step 1b で変換し、共通の仕上げ手順を持つ |
| `replace` | `/skill replace` | 既存ページを replace_html/ の新しい版で置き換える(registry はそのまま、本文・目次・CSS だけ更新) |
| `delete` | `/skill delete` | ページを削除する(.astro・CSS・registry・前後ナビ・概念マップ参照を整合させる) |
| `blackbelt` | `/skill blackbelt` | BlackBelt PDF を registry に登録する(変換・W3C 検証・目次は不要) |
| `ship` | `/skill ship` | new_html/ と replace_html/ の取り込み → Build / W3C / E2E ゲート → commit → master 経由でデプロイ |
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
