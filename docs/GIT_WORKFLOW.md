# Git Workflow & Deployment

This document provides detailed Git operations, version control best practices, and deployment workflows for the AWS SAP study resource repository.

## Repository Management

- This repository uses Git for version control and change tracking
- User identity is configured as: suzuki100603@gmail.com (Suzuki)
- All changes should be committed with descriptive messages in Japanese or English
- **CRITICAL**: All feature additions, modifications, and source code changes MUST be committed to Git and pushed to the remote repository immediately after completion

## Commit Guidelines

- Make atomic commits for logical changes (single feature/fix per commit)
- Use descriptive commit messages that explain the purpose of changes
- Include both English and Japanese descriptions when helpful for learning context
- Commit messages should follow the format: `[Type]: Brief description`
  - Types: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `refactor` (code restructuring)

## Push to Remote Repository

**CRITICAL WORKFLOW**: After committing changes locally, ALWAYS push to the remote repository immediately.

```bash
# Standard workflow for gh-pages branch
git add .
git commit -m "feat: Your descriptive commit message"
git push origin gh-pages  # REQUIRED: Push to remote immediately

# For other branches
git push origin <branch-name>
```

**Why this is critical:**
- **GitHub Pages deployment**: Changes to `gh-pages` branch trigger automatic deployment
- **Backup**: Ensures your work is backed up to GitHub
- **Collaboration**: Makes your changes visible to other collaborators
- **CI/CD**: Triggers automated testing and deployment pipelines
- **History preservation**: Remote repository serves as the source of truth

**Common mistake to avoid:**
- ❌ Committing locally but forgetting to push
- ✅ Always follow: `git add` → `git commit` → `git push`

**Verification after push:**
```bash
# Verify push was successful
git status
# Should show: "Your branch is up to date with 'origin/gh-pages'"

# For gh-pages branch specifically, verify deployment
# Visit https://ssuzuki1063.github.io/aws_sap_studying/ after 1-2 minutes
```

## Branching Strategy

This repository uses a two-branch workflow with feature branches for development:

### Main Branches

**`gh-pages` (Production/Deployment Branch)**
- **Purpose**: Live production environment deployed to GitHub Pages
- **URL**: https://ssuzuki1063.github.io/aws_sap_studying/
- **Auto-deployment**: All commits are automatically deployed within minutes
- **ウェブページ更新**: このブランチへのコミット＆プッシュがGitHub Pagesのウェブページ更新をトリガーします
- **Usage**: Direct commits for hotfixes and small updates; merge feature branches here after testing
- **Protection**: This is the current active branch - always verify changes work before pushing
- **Deployment Flow**: `git push origin gh-pages` → GitHub Pagesが自動検出 → 1〜2分で本番サイト更新

**`master` (Development Base Branch)**
- **Purpose**: Main development branch and base for pull requests
- **Usage**: Use as the base branch when creating PRs for code review
- **Workflow**: Feature branches should be created from `master` and merged back via PR
- **Sync**: Should be kept in sync with `gh-pages` for consistency

### Feature Branches

Create feature branches for significant additions or experimental changes:

**Naming Conventions:**
- `feature/[service-name]` - New AWS service learning resources (e.g., `feature/lambda-monitoring`)
- `feature/[topic]` - New features or enhancements (e.g., `feature/quiz-categories`)
- `fix/[issue]` - Bug fixes (e.g., `fix/navigation-mobile`)
- `refactor/[component]` - Code refactoring (e.g., `refactor/search-function`)

**Feature Branch Workflow:**
```bash
# Create feature branch from master
git checkout master
git pull origin master
git checkout -b feature/new-service-guide

# Make changes and commit
git add .
git commit -m "feat: Add new service guide"

# Push feature branch
git push origin feature/new-service-guide

# Create PR to master for review
gh pr create --base master --head feature/new-service-guide

# After PR approval, merge to master
# Then merge master to gh-pages for deployment
git checkout gh-pages
git merge master
git push origin gh-pages
```

## Development Workflows

### Option 1: Direct Commit to gh-pages (Quick Updates)

Use for small, tested changes that don't require review:

```bash
# Work directly on gh-pages
git checkout gh-pages
git pull origin gh-pages

# Make changes
python3 scripts/html_management/integrate_new_html.py

# W3C Validation (REQUIRED)
# Validate all modified HTML files at https://validator.w3.org/
# Fix all errors before committing

# Test locally
python3 server.py
# Verify at http://localhost:8080/

# Commit and deploy
git add .
git commit -m "feat: 新規AWS学習リソースを追加"
git push origin gh-pages

# Site automatically deploys in 1-2 minutes
```

### Option 2: Feature Branch + PR (Complex Changes)

Use for significant features, refactoring, or changes that benefit from review:

```bash
# Create feature branch from master
git checkout master
git checkout -b feature/quiz-improvements

# Develop and test
# ... make changes ...

# W3C Validation (REQUIRED)
# Validate all modified HTML files at https://validator.w3.org/
# Fix all errors before committing

python3 server.py  # Test locally

# Commit to feature branch
git add .
git commit -m "feat: クイズシステムを改善"
git push origin feature/quiz-improvements

# Create pull request
gh pr create --base master --title "クイズシステム改善" --body "詳細な説明"

# After review and approval, merge to master
# Then deploy to gh-pages
git checkout gh-pages
git merge master
git push origin gh-pages
```

## Branch Synchronization

Keep `master` and `gh-pages` in sync to avoid divergence:

```bash
# Sync master with gh-pages
git checkout master
git merge gh-pages
git push origin master

# Or sync gh-pages with master
git checkout gh-pages
git merge master
git push origin gh-pages
```

**When to sync:**
- After direct commits to `gh-pages` → sync to `master`
- After merging PRs to `master` → sync to `gh-pages` for deployment
- Before creating new feature branches → ensure `master` is current

## Change Tracking Best Practices

- Commit frequently to track incremental progress on learning materials
- Use `.gitignore` to exclude temporary files, OS-specific files, and build artifacts
- Tag major milestones (e.g., completion of service categories): `git tag -a v1.0 -m "Complete networking section"`

## File Management

- Always commit changes after adding new learning resources
- Update navigation and references in the same commit when adding new files
- Remove outdated or duplicate content through Git operations to maintain history

## Deployment

このリポジトリはGitHub Pagesを使用してウェブページを公開しています。

### GitHub Pages自動デプロイメントの仕組み

**デプロイメントソース**: `gh-pages`ブランチ
**公開URL**: https://ssuzuki1063.github.io/aws_sap_studying/

**重要**: `gh-pages`ブランチへのコミットがウェブページ更新のトリガーになります。

### デプロイメントプロセス

1. **ローカルで変更を加える**
   ```bash
   # ファイルを編集・追加
   python3 scripts/html_management/integrate_new_html.py
   ```

2. **ローカルでテストする**
   ```bash
   python3 server.py
   # http://localhost:8080/ でテスト
   ```

3. **gh-pagesブランチにコミット＆プッシュ**
   ```bash
   git add .
   git commit -m "feat: 新規学習リソースを追加"
   git push origin gh-pages
   ```

4. **GitHub Pagesが自動的にデプロイ**
   - プッシュ後、GitHubが自動的にgh-pagesブランチの内容を検出
   - 1〜2分以内に本番サイトへ自動デプロイ
   - ビルドプロセスなし - 静的ファイルがそのまま配信される

5. **デプロイメント確認**
   ```bash
   # ブラウザで公開サイトを確認
   # https://ssuzuki1063.github.io/aws_sap_studying/
   ```

### デプロイメント設定

- **ソースブランチ**: `gh-pages`（GitHubリポジトリ設定で指定）
- **公開ディレクトリ**: ルートディレクトリ `/`
- **ビルドプロセス**: なし（静的HTMLファイルをそのまま配信）
- **カスタムドメイン**: 未設定（GitHub提供のドメインを使用）

### デプロイメント時の注意事項

- **即座に公開される**: `gh-pages`へのプッシュは1〜2分で本番反映されます
- **テストを忘れずに**: 本番反映前に必ずローカルでテストしてください
- **大きな変更はPRを使用**: 複雑な変更は`master`ブランチでPRレビューしてから`gh-pages`へマージ
- **デプロイメント履歴**: GitHubのActions/Pagesタブでデプロイメント履歴を確認可能

### トラブルシューティング

デプロイメントが反映されない場合：
1. GitHubリポジトリのSettings > Pagesでgh-pagesブランチが選択されているか確認
2. ブラウザのキャッシュをクリア（Ctrl+Shift+R / Cmd+Shift+R）
3. GitHub ActionsタブでPages buildエラーがないか確認
4. `index.html`が正しくコミットされているか確認
