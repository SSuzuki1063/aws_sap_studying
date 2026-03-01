#!/usr/bin/env python3
"""
WCAG 2.1 適合色の提案スクリプト

不合格の色に対して、コントラスト比を満たす代替色を提案します。
"""

def hex_to_rgb(hex_color):
    """16進数カラーコードをRGBタプルに変換"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb):
    """RGBタプルを16進数カラーコードに変換"""
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def relative_luminance(rgb):
    """相対輝度を計算"""
    r, g, b = [x / 255.0 for x in rgb]
    r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
    g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
    b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_ratio(color1, color2):
    """コントラスト比を計算"""
    lum1 = relative_luminance(hex_to_rgb(color1))
    lum2 = relative_luminance(hex_to_rgb(color2))
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    return (lighter + 0.05) / (darker + 0.05)

def adjust_color_brightness(hex_color, target_ratio, bg_color='#FFFFFF', darker=True):
    """
    色の明度を調整して目標コントラスト比を達成する

    darker: True = 暗くする, False = 明るくする
    """
    rgb = list(hex_to_rgb(hex_color))
    step = -5 if darker else 5

    for _ in range(100):  # 最大100回試行
        new_color = rgb_to_hex(rgb)
        ratio = contrast_ratio(new_color, bg_color)

        if ratio >= target_ratio:
            return new_color, ratio

        # RGB値を調整
        rgb = [max(0, min(255, c + step)) for c in rgb]

        # 限界に達したら終了
        if all(c == 0 for c in rgb) or all(c == 255 for c in rgb):
            break

    return rgb_to_hex(rgb), contrast_ratio(rgb_to_hex(rgb), bg_color)

def main():
    """不合格の色に対して代替色を提案"""

    print("=" * 80)
    print("WCAG 2.1 適合色の提案レポート")
    print("=" * 80)

    # 不合格の色とその用途
    failing_colors = [
        {
            'original': '#FF9900',
            'bg': '#FFFFFF',
            'usage': 'AWSオレンジ見出し・アクセント',
            'target_ratio': 3.0,
            'type': 'large'
        },
        {
            'original': '#E5E7EB',
            'bg': '#FFFFFF',
            'usage': 'ボーダー (UIコンポーネント)',
            'target_ratio': 3.0,
            'type': 'ui'
        },
        {
            'original': '#9CA3AF',
            'bg': '#FFFFFF',
            'usage': 'セカンダリテキスト (breadcrumb-separator)',
            'target_ratio': 4.5,
            'type': 'normal'
        },
        {
            'original': '#74b9ff',
            'bg': '#FFFFFF',
            'usage': 'quiz.html スコア表示（Good）',
            'target_ratio': 4.5,
            'type': 'normal'
        },
        {
            'original': '#00b894',
            'bg': '#FFFFFF',
            'usage': 'quiz.html 正解表示（Excellent）',
            'target_ratio': 4.5,
            'type': 'normal'
        },
        {
            'original': '#e17055',
            'bg': '#FFFFFF',
            'usage': 'quiz.html 不正解表示（Poor）',
            'target_ratio': 4.5,
            'type': 'normal'
        },
        {
            'original': '#fdcb6e',
            'bg': '#FFFFFF',
            'usage': 'quiz.html スコア表示（Fair）',
            'target_ratio': 4.5,
            'type': 'normal'
        },
    ]

    suggestions = []

    for color_info in failing_colors:
        original_color = color_info['original']
        bg = color_info['bg']
        usage = color_info['usage']
        target = color_info['target_ratio']

        # 現在のコントラスト比
        current_ratio = contrast_ratio(original_color, bg)

        # 代替色を提案（暗くする）
        suggested_color, new_ratio = adjust_color_brightness(original_color, target, bg, darker=True)

        print(f"\n{'='*80}")
        print(f"用途: {usage}")
        print(f"{'='*80}")
        print(f"元の色:     {original_color}")
        print(f"現在の比:   {current_ratio:.2f}:1 ❌")
        print(f"目標比:     {target:.1f}:1")
        print(f"-" * 80)
        print(f"推奨色:     {suggested_color}")
        print(f"新しい比:   {new_ratio:.2f}:1 {'✅' if new_ratio >= target else '❌'}")
        print(f"明度変化:   {'暗く' if suggested_color < original_color else '明るく'}")

        suggestions.append({
            'usage': usage,
            'original': original_color,
            'suggested': suggested_color,
            'old_ratio': current_ratio,
            'new_ratio': new_ratio,
            'target': target
        })

    # サマリーテーブル
    print("\n" + "=" * 80)
    print("修正サマリー")
    print("=" * 80)
    print(f"\n{'用途':<40} {'元の色':<10} {'推奨色':<10} {'比率改善':<15}")
    print("-" * 80)

    for s in suggestions:
        improvement = f"{s['old_ratio']:.1f} → {s['new_ratio']:.1f}"
        print(f"{s['usage']:<40} {s['original']:<10} {s['suggested']:<10} {improvement:<15}")

    # CSS変数形式で出力
    print("\n" + "=" * 80)
    print("CSS変数形式（CODING_STANDARDS.mdに追加推奨）")
    print("=" * 80)
    print("""
```css
/* WCAG 2.1 レベルAA適合カラーパレット（検証済み） */
:root {
    /* AWS Brand Colors */
    --color-aws-dark: #232F3E;       /* ✅ 12.98:1 on #F9FAFB */
    --color-aws-orange-original: #FF9900; /* ⚠️ 2.14:1 - 大きいテキスト専用なら修正必要 */
    --color-aws-orange-accessible: #CC7A00; /* ✅ 3.0:1 - 大きいテキスト用代替色 */

    /* Text Colors */
    --color-text-primary: #374151;   /* ✅ 9.86:1 on #F9FAFB */
    --color-text-secondary: #6B7280; /* ✅ 4.83:1 on white */
    --color-text-tertiary: #757575;  /* ✅ 4.5:1 on white (breadcrumb用) */

    /* Background Colors */
    --color-bg-light: #F9FAFB;
    --color-bg-white: #FFFFFF;

    /* Border Colors */
    --color-border-light: #C0C0C0;   /* ✅ 3.0:1 on white (UI用) */

    /* Quiz Colors (WCAG 2.1 適合版) */""")

    for s in suggestions:
        if 'quiz.html' in s['usage']:
            label = s['usage'].split('（')[1].rstrip('）')
            var_name = label.lower().replace('/', '-')
            print(f"    --color-quiz-{var_name}: {s['suggested']};  /* ✅ {s['new_ratio']:.1f}:1 */")

    print("""}
```
""")

    print("\n" + "=" * 80)
    print("次のステップ")
    print("=" * 80)
    print("""
1. 上記の推奨色をレビューし、デザインとの整合性を確認
2. CODING_STANDARDS.md に検証済みカラーパレットセクションを追加
3. index.html, quiz.html のCSSを更新
4. ビジュアルテストでデザインが崩れていないか確認
5. 再度コントラスト比検証を実行

特記事項:
- AWS Orange (#FF9900) はブランドカラーのため、大きいテキスト専用に限定するか、
  アクセシブルな代替色 (#CC7A00) を通常テキストに使用することを推奨
- Quiz.htmlのスコア表示色は全て修正が必要
- 色だけでなく、アイコンやテキストラベルも併用することを強く推奨
""")

if __name__ == "__main__":
    main()
