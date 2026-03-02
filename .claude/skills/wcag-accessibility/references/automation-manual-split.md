# 自動化 vs 手動レビュー切り分け

WCAG 2.1 AA検証項目を、自動化可能なものと手動レビューが必要なものに分類します。

---

## 検証項目一覧

| 検証項目 | 自動化 | 手動 | ツール/方法 | 備考 |
|---------|:------:|:----:|------------|------|
| カラーコントラスト（インラインスタイル） | ✅ | - | `check_contrast_ratio.py` | 静的CSS解析 |
| カラーコントラスト（外部CSS） | ✅ | - | `check_contrast_ratio.py` | CSS変数解決 |
| カラーコントラスト（動的スタイル） | - | ✅ | ブラウザ確認 | JS生成スタイル |
| 見出し階層 | ✅ | - | `check_heading_hierarchy.py` | h1→h2→h3順序 |
| SVGアクセシビリティ | ✅ | - | `find_svg_without_aria.sh` | role, aria-label |
| 画像alt属性 | ✅ | ✅ | grep + 目視 | 存在チェック+内容確認 |
| W3C HTML検証 | ✅ | - | `validate_html_w3c.py` | 構文エラー |
| lang属性 | ✅ | - | grep | `<html lang="ja">` |
| 背景コンテキスト判定 | - | ✅ | 目視確認 | 背景画像等 |
| キーボード操作 | - | ✅ | 手動テスト | Tab/Enter/Space |
| フォーカス表示確認 | - | ✅ | 手動テスト | 視覚的確認 |
| リンク目的の明確さ | - | ✅ | 目視確認 | 「こちら」等を避ける |
| フォームラベル関連付け | ✅ | - | HTML解析 | for/id一致 |
| ARIA属性の妥当性 | ✅ | ✅ | W3C + 目視 | 構文+意味 |

---

## 自動化ツール詳細

### check_contrast_ratio.py

**目的**: HTMLファイル内のテキスト色と背景色のコントラスト比を検証

**実行方法**:
```bash
# 全ファイル検証
python3 scripts/accessibility/check_contrast_ratio.py

# 単一ファイル検証
python3 scripts/accessibility/check_contrast_ratio.py path/to/file.html
```

**出力例**:
```
[FAIL] security-governance/iam-guide.html
  Line 45: color #9ca3af on #ffffff (contrast: 3.53:1, required: 4.5:1)
[PASS] networking/vpc-guide.html
```

**検出可能**:
- インラインスタイルのcolor指定
- `<style>`タグ内のcolor指定
- CSS変数（variables.cssを参照）

**検出不可**:
- 外部CSSファイルの動的読み込み
- JavaScriptで生成されたスタイル

---

### check_heading_hierarchy.py

**目的**: 見出しレベル（h1-h6）の階層が正しいか検証

**実行方法**:
```bash
python3 scripts/accessibility/check_heading_hierarchy.py
```

**検出ルール**:
- h1がページに1つだけ存在
- h2の前にh3が出現しない
- レベルのスキップがない（h1→h3等）

**出力例**:
```
[FAIL] storage/s3-guide.html
  Line 120: h4 appears before h3 (skipped level)
  Line 150: Multiple h1 tags found
```

---

### find_svg_without_aria.sh

**目的**: SVG要素に適切なアクセシビリティ属性があるか検証

**実行方法**:
```bash
bash scripts/accessibility/find_svg_without_aria.sh
```

**検出ルール**:
- `<svg>`に`role="img"`がない
- `<svg>`に`aria-label`または`aria-labelledby`がない

---

### validate_html_w3c.py

**目的**: W3C HTML Validatorを使用してHTML構文を検証

**実行方法**:
```bash
# 全ファイル検証
python3 scripts/ci/validate_html_w3c.py

# PRモード（変更ファイルのみ）
python3 scripts/ci/validate_html_w3c.py --pr-mode
```

---

## 手動レビュー詳細

### 背景コンテキスト判定

**チェック方法**:
1. ブラウザでページを開く
2. 開発者ツールで要素を検査
3. 背景色（画像含む）を確認
4. テキスト色が適切か判断

**チェックポイント**:
- [ ] 背景画像上のテキストは十分なコントラストがあるか
- [ ] グラデーション背景の最も明るい部分でもコントラストを確保しているか
- [ ] 半透明オーバーレイは十分な不透明度か

---

### キーボード操作

**チェック方法**:
1. ブラウザでページを開く
2. マウスを使わずにTabキーで移動
3. すべてのインタラクティブ要素にフォーカスできるか確認
4. Enter/Spaceで実行できるか確認

**チェックポイント**:
- [ ] すべてのリンクにTabでフォーカスできる
- [ ] すべてのボタンにTabでフォーカスできる
- [ ] フォーム要素に順序通りフォーカスできる
- [ ] モーダル/ドロップダウンはEscで閉じられる
- [ ] キーボードトラップがない

---

### フォーカス表示確認

**チェック方法**:
1. Tabキーで要素間を移動
2. フォーカスインジケーター（通常は枠線）が表示されるか確認
3. フォーカス位置が視覚的に明確か確認

**チェックポイント**:
- [ ] フォーカスインジケーターが見える
- [ ] フォーカスインジケーターが背景とのコントラスト3.0:1以上
- [ ] `outline: none`が適用されている場合、代替のフォーカス表示がある

---

## CI/CD統合

### プリコミットフック

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running accessibility checks..."

# 自動検証
python3 scripts/accessibility/check_contrast_ratio.py
if [ $? -ne 0 ]; then
    echo "Contrast ratio check failed"
    exit 1
fi

python3 scripts/accessibility/check_heading_hierarchy.py
if [ $? -ne 0 ]; then
    echo "Heading hierarchy check failed"
    exit 1
fi

bash scripts/accessibility/find_svg_without_aria.sh
if [ $? -ne 0 ]; then
    echo "SVG accessibility check failed"
    exit 1
fi

python3 scripts/ci/validate_html_w3c.py --pr-mode
if [ $? -ne 0 ]; then
    echo "HTML validation failed"
    exit 1
fi

echo "All accessibility checks passed!"
```

### GitHub Actions

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Check

on: [push, pull_request]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.x'

      - name: Install dependencies
        run: pip install beautifulsoup4 lxml

      - name: Check contrast ratio
        run: python3 scripts/accessibility/check_contrast_ratio.py

      - name: Check heading hierarchy
        run: python3 scripts/accessibility/check_heading_hierarchy.py

      - name: Check SVG accessibility
        run: bash scripts/accessibility/find_svg_without_aria.sh
```

---

## 優先度マトリクス

| 自動化可能 | 影響度 | 検出頻度 | 優先度 |
|-----------|--------|---------|--------|
| コントラスト検証 | 高 | 高 | **最優先** |
| 見出し階層 | 中 | 中 | 高 |
| SVGアクセシビリティ | 中 | 低 | 中 |
| HTML検証 | 高 | 低 | 高 |
| フォームラベル | 中 | 低 | 中 |

| 手動レビュー | 影響度 | 検出頻度 | 優先度 |
|-------------|--------|---------|--------|
| キーボード操作 | 高 | 低 | **最優先** |
| フォーカス表示 | 高 | 中 | 高 |
| 背景コンテキスト | 高 | 中 | 高 |
| リンク目的 | 中 | 中 | 中 |
