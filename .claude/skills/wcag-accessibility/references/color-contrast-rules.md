# カラーコントラストルール詳細

## 相対輝度の計算

WCAG 2.1では、コントラスト比は相対輝度に基づいて計算されます。

### 相対輝度の計算式

```
L = 0.2126 * R + 0.7152 * G + 0.0722 * B
```

ここで、R, G, Bは以下のように計算：

```python
def get_relative_luminance(hex_color):
    """HEX色コードから相対輝度を計算"""
    # HEX → RGB (0-255)
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)

    # RGB → sRGB (0-1)
    r = r / 255
    g = g / 255
    b = b / 255

    # sRGB → Linear RGB
    def linearize(c):
        if c <= 0.03928:
            return c / 12.92
        else:
            return ((c + 0.055) / 1.055) ** 2.4

    r = linearize(r)
    g = linearize(g)
    b = linearize(b)

    # 相対輝度
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
```

### コントラスト比の計算式

```
contrast_ratio = (L1 + 0.05) / (L2 + 0.05)
```

ここで：
- L1 = 明るい方の色の相対輝度
- L2 = 暗い方の色の相対輝度

---

## テキストタイプ別の合格条件

### 通常テキスト

| 条件 | コントラスト比 | 判定 |
|------|--------------|------|
| >= 4.5:1 | **PASS** | AA適合 |
| >= 3.0:1 かつ < 4.5:1 | **FAIL** | 大きいテキストとしては適合 |
| < 3.0:1 | **FAIL** | 不適合 |

**通常テキストの定義**：
- 18ポイント（24px）未満
- 14ポイント（18.67px）太字未満

### 大きいテキスト

| 条件 | コントラスト比 | 判定 |
|------|--------------|------|
| >= 3.0:1 | **PASS** | AA適合 |
| < 3.0:1 | **FAIL** | 不適合 |

**大きいテキストの定義**：
- 18ポイント（24px）以上、または
- 14ポイント（18.67px）太字以上

### UIコンポーネント

| 条件 | コントラスト比 | 判定 |
|------|--------------|------|
| >= 3.0:1 | **PASS** | AA適合 |
| < 3.0:1 | **FAIL** | 不適合 |

**UIコンポーネントの例**：
- ボタンの境界線
- フォーム入力の境界線
- アイコン（情報を伝えるもの）
- グラフの重要な線

---

## 境界ケースの判定方法

### ケース1: グラデーション背景

グラデーション背景の場合、**最も低いコントラスト比**で判定します。

```css
/* グラデーション背景 */
background: linear-gradient(135deg, #232F3E 0%, #374151 100%);
color: #ffffff;
```

判定：
1. `#ffffff` vs `#232F3E` → 12.98:1 ✅
2. `#ffffff` vs `#374151` → 9.86:1 ✅
3. **最小値 9.86:1** → PASS

### ケース2: 半透明オーバーレイ

半透明オーバーレイの場合、オーバーレイを適用した最終色で判定します。

```css
/* 半透明オーバーレイ */
background-image: url('image.jpg');
background-color: rgba(0, 0, 0, 0.7);
color: #ffffff;
```

計算：
1. 背景画像の代表色を特定（または最も明るい部分）
2. オーバーレイ色を合成
3. 合成後の色とテキスト色でコントラスト比を計算

### ケース3: ホバー状態

ホバー状態でも同じコントラスト基準を満たす必要があります。

```css
/* 通常状態 */
.button {
    background: #232F3E;
    color: #ffffff;  /* 12.98:1 ✅ */
}

/* ホバー状態 - これも検証必要 */
.button:hover {
    background: #374151;
    color: #ffffff;  /* 9.86:1 ✅ */
}
```

### ケース4: フォーカス状態

フォーカスインジケーター自体のコントラストも確認が必要です。

```css
/* フォーカスインジケーター */
.button:focus {
    outline: 2px solid #FF9900;  /* 背景との比 >= 3.0:1 */
    outline-offset: 2px;
}
```

---

## 実装での注意点

### CSS変数の使用を推奨

```css
/* ❌ 直接色指定 - 検証が困難 */
.text {
    color: #6B7280;
}

/* ✅ CSS変数使用 - 一元管理可能 */
.text {
    color: var(--color-text-secondary);
}
```

### 背景色を明示的に指定

```css
/* ❌ 背景色が不明確 */
.card {
    color: #374151;
}

/* ✅ 背景色を明示 */
.card {
    background-color: #ffffff;
    color: #374151;
}
```

### 継承に注意

```css
/* 親要素で白文字を指定 */
.dark-section {
    background: #232F3E;
    color: #ffffff;
}

/* 子要素で背景だけ変更すると問題発生 */
.dark-section .card {
    background: #ffffff;
    /* color: #ffffff が継承される → FAIL */
}

/* ✅ 背景変更時はテキスト色も指定 */
.dark-section .card {
    background: #ffffff;
    color: #374151;
}
```

---

## ツールリファレンス

### オンラインツール

| ツール | URL | 用途 |
|--------|-----|------|
| WebAIM Contrast Checker | https://webaim.org/resources/contrastchecker/ | 2色のコントラスト検証 |
| Colour Contrast Analyzer | https://www.tpgi.com/color-contrast-checker/ | デスクトップアプリ |
| Accessible Colors | https://accessible-colors.com/ | 代替色の提案 |

### リポジトリ内スクリプト

| スクリプト | 用途 |
|-----------|------|
| `scripts/accessibility/check_contrast_ratio.py` | HTMLファイルのコントラスト検証 |
| `scripts/accessibility/suggest_color_fixes.py` | 修正提案の生成 |
| `scripts/accessibility/fix_colors_bulk.py` | 一括修正 |
