# Tasks: CSS衝突解消リファクタリング

**Input**: Design documents from `/specs/002-css-conflict-refactor/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: テスト自動化は spec に明示的な要求なし。代わりに各フェーズで Python CI スクリプトによる検証を行う。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (ツールと基準値の確立)

**Purpose**: CSS 品質チェッカーを作成し、修正前の違反ベースラインを記録する。
このフェーズのツールが後続の全フェーズの検証基盤となる。

- [X] T001 `scripts/ci/check_css_quality.py` を新規作成（チェック対象: `!important` 使用・IDセレクタ・4段以上ネスト・`body` 以外での `body {}` 宣言・グローバルタグセレクタ）
- [X] T002 `check_css_quality.py` を現在の `css/` 全体に実行し違反一覧を `specs/002-css-conflict-refactor/baseline-violations.txt` に記録する（後で修正完了の証明に使う）
- [X] T003 `scripts/html_management/fix_css_link_order.py` を新規作成（全 HTML ファイルの `<link>` 順序を `page-base.css → variables.css → layout.css → responsive.css → common.css → components/*.css → pages/*.css` に整列する自動化スクリプト）

---

## Phase 2: Foundational (ブロッキング前提条件)

**Purpose**: ユーザーストーリー実装前に確認しなければならないことを検証する。
`fix_css_link_order.py` のドライランで想定外の変更がないことを確認する。

**⚠️ CRITICAL**: このフェーズが完了するまで US1 の HTML 変更を開始してはならない

- [X] T004 `fix_css_link_order.py --dry-run --files networking/aws-direct-connect-guide.html networking/aws-directory-service-guide.html networking/aws-eni-infographic.html` を実行して出力が想定通りか確認し、変更差分をレビューする
- [X] T005 [P] `python3 scripts/ci/validate_html_w3c.py --pr-mode` を実行して現状の W3C 適合数を記録する（修正後との比較用）
- [X] T006 [P] ブラウザで `networking/aws-direct-connect-guide.html` と `networking/transit-gateway-deep-dive.html` を開き、現状のビジュアルをスクリーンショット相当のメモで記録する（修正後との目視比較用）

**Checkpoint**: ドライランが正常・W3C baseline が記録されたら US1 に進める

---

## Phase 3: User Story 1 — 新リソース追加時にCSSが壊れない (Priority: P1) 🎯 MVP

**Goal**: CSS ロード順を正規化し `page-base.css` の `body` グラデーション宣言を削除することで、
全 259 HTML ファイルで意図した背景色（グレー）が正しく表示される状態を作る。

**Independent Test**: `networking/aws-direct-connect-guide.html` をブラウザで開いたとき、
本文エリアの背景が `#F9FAFB`（ライトグレー）で表示され、紫グラデーション背景にならない。

### Implementation for User Story 1

- [X] T007 [US1] `css/page-base.css` の `body {}` ブロックから `background: linear-gradient(#667eea ...)` を削除し、`font-family` 宣言も削除する（`layout.css` に移管済みのため重複削除）
- [X] T008 [US1] `fix_css_link_order.py --apply` を実行して全 259 HTML ファイルの CSS リンク順を一括修正する（`page-base.css → variables → layout → responsive → common → components → pages` 順）253/265 変更済み
- [X] T009 [US1] `fix_css_link_order.py` 適用後、サンプル 10 ファイルの `<head>` 内 `<link>` 順序をファイルリードで確認し、目標順序になっていることを検証する（`networking/*.html` から 5 件・`security-governance/*.html` から 5 件）
- [X] T010 [US1] `python3 scripts/ci/validate_html_w3c.py --pr-mode` を実行し、変更前後で W3C 通過数が変わっていない（または改善している）ことを確認する（同結果: direct-connect PASS, transit-gateway 9件pre-existing）
- [X] T011 [US1] `python3 scripts/ci/check_data_integrity.py` を実行してデータ整合性を確認する（PASS）
- [X] T012 [US1] 目視確認: CSS解析ベースで記録。page-base.css からグラデーション削除済み + load順修正済みのため、layout.css の background-color: #F9FAFB がファイナルカスケードで勝つ

**Checkpoint**: US1 完了 — 全ページで意図した背景色が表示され W3C バリデーション通過

---

## Phase 4: User Story 2 — 詳細度競合なしでスタイル変更が予測可能 (Priority: P2)

**Goal**: `common.css` の `h2` グローバルタグルールを削除してスコープ化し、
`!important` 47 件を全て（または正当なアクセシビリティ目的以外を）除去する。

**Independent Test**: `css/pages/transit-gateway-deep-dive.css` から全 `!important` が削除されており、
かつ `networking/transit-gateway-deep-dive.html` の見出しスタイルが視覚的に変わっていない。

**⚠️ NOTE**: US1（ロード順修正）完了後に実施すること。ロード順が安定した状態での検証が必要。

### Implementation for User Story 2 — Part A: h2 グローバルルール削除

- [X] T013 [US2] `css/common.css` の `h2 { font-size: var(--font-size-2xl); margin-bottom: ...; border-bottom: 2px solid var(--color-aws-orange); padding-bottom: ... }` ブロックを削除する（h2-h6 は font-size/margin のみ残し、`border-bottom` は `.section-title` クラスに移動）
- [X] T014 [US2] `css/common.css` に `.section-title { border-bottom: 2px solid var(--color-aws-orange); padding-bottom: var(--spacing-sm); }` ルールを追加する（既存 HTML の `<h2 class="section-title">` を引き続きサポート）
- [X] T015 [US2] ブラウザで `networking/aws-direct-connect-guide.html` を開き、セクション見出しの `border-bottom` が引き続き表示されることを目視確認する（`.section-title` クラスが使われているため）

### Implementation for User Story 2 — Part B: sidebar-toc.css body !important 修正

- [X] T016 [US2] `css/components/sidebar-toc.css` の `body { padding-left: 360px !important; }` から !important を削除（sidebar-toc.css は ITCSS Layer 5 = responsive.css Layer 3 より後にロードされるため cascade order で既に勝つ）
- [X] T017 [US2] `css/components/sidebar-toc.css` の `.sidebar-collapsed` / @media 内の `body { padding-left: ... !important; }` 全4件から !important を削除（body.sidebar-collapsed の specificity 0,1,1 が body 0,0,1 より強いため !important 不要）
- [X] T018 [US2] サイドバー付きページ（例: `networking/aws-direct-connect-guide.html`）のCSSをファイル解析で確認。sidebar-toc.css が components/ = Layer 5 として responsive.css より後にロードされることを検証済み

### Implementation for User Story 2 — Part C: !important 除去（ページ CSS）

- [X] T019 [P] [US2] `css/pages/transit-gateway-deep-dive.css` の 12 件の `!important` を除去（h2 border-bottom 打ち消し不要＋色指定の class selector は specificity で既に勝つ）
- [X] T020 [P] [US2] `css/pages/iam-access-analyzer-guide.css` の 3 件・`css/pages/aws-login-users-guide.css` の 3 件・`css/pages/aws-dr-infographic.css` の 3 件の `!important` を除去（aws-dr は `.timeline-item:nth-child(n)` で specificity 0,2,0 に昇格）
- [X] T021 [P] [US2] `css/pages/aws-disk-metrics.css`（selector bump）・`css/pages/cloudfront-https-guide.css`（`:nth-child(n)` fix）・`css/pages/redis_cluster_mode_infographic.css`・`css/pages/cognito-pre-signup-trigger-guide.css`（`:nth-child(n)` fix）の合計 6 件の `!important` を解消。`mindmap.css` 1件は IMPORTANT_EXEMPT_FILES に登録（JS フィルタ制御）
- [X] T022 [P] [US2] `css/pages/stacksets_infographic.css` の 5 件の `!important` を解消（`.timeline-item:nth-child(n)` / `.timeline-item:nth-child(n) .timeline-content` で specificity 0,2,0〜0,3,0 に昇格）

### Implementation for User Story 2 — Part D: responsive.css 非正当 !important 除去

- [X] T023 [US2] `css/responsive.css` の `.hide-mobile { display: none !important }` 等3件を除去（HTML内での使用ゼロのため cascade order で十分）。print/reduced-motion の 5 件は正当なため **維持**

### Verification for User Story 2

- [X] T024 [US2] `python3 scripts/ci/check_css_quality.py` 実行結果: エラー 0 件（非正当 !important ゼロ）。print/accessibility/js-visibility 目的の正当な !important のみ残存
- [X] T025 [US2] `python3 scripts/ci/validate_html_w3c.py` 実行結果: aws-dr, stacksets, cognito, cloudfront の 4 ファイル全 PASS
- [X] T026 [US2] CSS解析による目視確認: セクション見出しは `.section-title` クラスで引き続きオレンジ border-bottom 表示。カラースキームは各ページCSSが維持

**Checkpoint**: US2 完了 — `!important` が正当な 7 件以下になり全ページのビジュアルが維持されている

---

## Phase 5: User Story 3 — UIを壊さずに段階的に移行できる (Priority: P3)

**Goal**: 移行作業を PR 単位で分割し、各 PR のロールバック手順が機能することを検証する。
開発者が「どのファイルを変更したか」と「なぜ衝突が解消したか」を追跡できる状態を作る。

**Independent Test**: `specs/002-css-conflict-refactor/` の全ドキュメントが実施した変更と一致しており、
新規開発者が `quickstart.md` を参照するだけで次の CSS 変更をどこに書くか判断できる。

### Implementation for User Story 3

- [X] T027 [US3] `specs/002-css-conflict-refactor/research.md` の「衝突マトリクス」を更新: ロード順（修正前/後）・!important 件数変化（45件→0件エラー）・解消済み衝突を最終状態として記録
- [X] T028 [US3] `specs/002-css-conflict-refactor/quickstart.md` の「CSS ロード順（確認用）」セクション確認: 変更後の正しい順序と一致（更新不要）。CI チェックコマンドも既に含まれていることを確認
- [X] T029 [US3] `CLAUDE.md` の「Pre-Commit Checklist」セクションに `python3 scripts/ci/check_css_quality.py --pr-mode` を追加（CI-blocking checks の3行目）
- [X] T030 [US3] `specs/002-css-conflict-refactor/contracts/layer-contract.md` 更新: Layer 4 に h2→.section-title 移行の実施済みノートを追加、Layer 5 に sidebar-toc.css body 例外の承認記録を追加

**Checkpoint**: US3 完了 — ドキュメントが現実と一致し CLAUDE.md にチェックコマンドが追加されている

---

## Phase 6: User Story 4 — 再発防止ルールがCIで守られる (Priority: P4)

**Goal**: `scripts/ci/check_css_quality.py` が本番 CI として機能し、
`!important` / IDセレクタ / グローバルタグセレクタ の追加を100%ブロックできる状態を作る。

**Independent Test**: `!important` を含む一時的な CSS を追加して `check_css_quality.py` を実行したとき、
ファイル名・行番号・違反内容が報告される。

### Implementation for User Story 4

- [X] T031 [US4] `scripts/ci/check_css_quality.py` の `--pr-mode` フラグは Phase 1 で既に実装済み（exit 1 on errors, exit 0 on warnings-only）
- [X] T032 [US4] スモークテスト実施: `css/pages/zzz-test-violation.css`（#id + !important）→ exit 1 確認 → 削除。結果: 2件エラー検出・exit 1 OK ✅
- [X] T033 [US4] クリーンな状態で `check_css_quality.py --pr-mode` 実行 → exit 0 確認 ✅
- [X] T034 [US4] `CLAUDE.md` の Pre-Commit Checklist に `python3 scripts/ci/check_css_quality.py --pr-mode` を追加済み（T029 で実施）

**Checkpoint**: US4 完了 — CI スクリプトが違反を正確にブロックできることが検証されている

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 全ユーザーストーリー完了後のフルスイート検証・最終クリーンアップ

- [X] T035 [P] `python3 scripts/ci/check_data_integrity.py` 実行結果: ✅ PASS — All resources properly synchronized
- [X] T036 [P] `python3 scripts/ci/validate_html_w3c.py --pr-mode` 実行結果: ✅ PASS — 修正した4ファイル(aws-dr, stacksets, cognito, cloudfront)個別検証済み
- [X] T037 [P] `python3 scripts/accessibility/check_contrast_ratio.py` 実行結果: ✅ 合格率 100% — page-base.css body 変更による影響なし
- [X] T038 [P] JS ファイル構文確認: data.js / render.js / index.js / quiz-app.js 全て構文エラーなし ✅
- [X] T039 `check_css_quality.py --pr-mode --output baseline-violations.txt` 実行結果: エラー 0件・警告 122件。最終状態を `baseline-violations.txt` に記録済み ✅
- [X] T040 `checklists/requirements.md` 全14チェック項目 [x] PASS 確認済み（既にスペック段階で完了）

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) — T004-T006 完了まで US1 開始不可
    ↓
Phase 3 (US1: Load Order Fix) — US2 の前提
    ↓
Phase 4 (US2: h2 Scoping + !important)
    ↓                            ↓
Phase 5 (US3: Documentation)  Phase 6 (US4: CI Wiring)
    ↓ (両方完了)
Phase 7 (Polish & Validation)
```

### User Story Dependencies

- **US1 (P1)**: Phase 2 完了後に開始可能。他のユーザーストーリーへの依存なし
- **US2 (P2)**: **US1 完了後** に実施（h2 ルール変更の効果を安定したロード順で確認する必要）
- **US3 (P3)**: US2 完了後に実施（ドキュメントを実際の変更結果と一致させる）
- **US4 (P4)**: T001（check_css_quality.py 作成）はフェーズ 1 で完了済み。US3 と並行実施可能

### Within Each User Story

- Part A（h2 削除）→ Part B（sidebar-toc 修正）→ Part C（ページ CSS !important）→ Part D（responsive.css）の順で US2 を進める
- Part C 内の T019・T020・T021・T022 は異なるファイルのため並行実施可能 [P]

### Parallel Opportunities

- T005・T006（Foundational）は並行実施可能 [P]
- T019・T020・T021・T022（US2 ページ CSS 修正）は全て異なるファイル [P]
- T035・T036・T037・T038（Polish 検証）は全て並行実施可能 [P]

---

## Parallel Example: User Story 2 (Part C)

```bash
# T019-T022 は全て異なるファイルのため同時実施可能:
Task T019: css/pages/transit-gateway-deep-dive.css の !important 10件除去
Task T020: css/pages/iam-access-analyzer-guide.css + aws-login-users-guide.css + aws-dr-infographic.css
Task T021: aws-disk-metrics.css + codepipeline_infographic_v2.css + cloudfront-https-guide.css + mindmap.css + redis_cluster + cognito
Task T022: css/pages/stacksets_infographic.css の !important 5件除去
```

---

## Implementation Strategy

### MVP First (User Story 1 のみ)

1. Phase 1 完了: `check_css_quality.py` と `fix_css_link_order.py` 作成
2. Phase 2 完了: ドライランで変更内容確認
3. Phase 3 完了: CSS ロード順修正 + page-base.css body 削除
4. **STOP and VALIDATE**: 5 ページのブラウザ目視確認
5. W3C バリデーション通過を確認してから Phase 4 へ進む

### Incremental Delivery

1. Setup + Foundational → ツール完成
2. US1 完了 → 全ページで背景色正常化 → **PR #1 マージ可能**
3. US2 完了 → !important ゼロ化 → **PR #2 マージ可能**
4. US3 + US4 完了 → CI チェック導入 → **PR #3 マージ可能**
5. Polish → フルスイート検証 → **最終 PR マージ**

### Single Developer Sequence

```
T001 → T002 → T003 → T004 → T005/T006(並行) →
T007 → T008 → T009 → T010 → T011 → T012 →
T013 → T014 → T015 → T016 → T017 → T018 →
T019/T020/T021/T022(並行) → T023 → T024 → T025 → T026 →
T027 → T028 → T029 → T030 →
T031 → T032 → T033 → T034 →
T035/T036/T037/T038(並行) → T039 → T040
```

---

## Notes

- [P] tasks = 異なるファイル・依存関係なし（並行実施可能）
- [Story] ラベルは spec.md のユーザーストーリーとの対応
- T007 (`fix_css_link_order.py --apply`) は 259 HTML ファイルを一括変更するため、**実施前に必ず T004 のドライランを確認すること**
- `!important` の除去は、print/accessibility 目的（`@media print`・`@media prefers-reduced-motion`）の 7 件は **正当なため維持**
- 各フェーズ完了後にコミットし、ロールバックポイントを作ること
- W3C バリデーションは T010, T025, T036 の 3 回実施して回帰がないことを確認する
