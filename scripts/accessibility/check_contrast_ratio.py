#!/usr/bin/env python3
"""
WCAG 2.1 カラーコントラスト比計算スクリプト

このスクリプトは、サイトで使用されている色の組み合わせのコントラスト比を計算し、
WCAG 2.1 レベルAA（4.5:1）およびレベルAAA（7:1）に適合しているか検証します。

参考: https://www.w3.org/TR/WCAG21/#contrast-minimum
"""

def hex_to_rgb(hex_color):
    """16進数カラーコードをRGBタプルに変換"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def relative_luminance(rgb):
    """
    相対輝度を計算（WCAG 2.1仕様に基づく）

    参考: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
    """
    r, g, b = [x / 255.0 for x in rgb]

    # ガンマ補正を適用
    r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
    g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
    b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4

    # 相対輝度を計算
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_ratio(color1, color2):
    """
    2つの色のコントラスト比を計算

    コントラスト比 = (明るい色の輝度 + 0.05) / (暗い色の輝度 + 0.05)
    """
    lum1 = relative_luminance(hex_to_rgb(color1))
    lum2 = relative_luminance(hex_to_rgb(color2))

    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)

    return (lighter + 0.05) / (darker + 0.05)

def check_compliance(ratio, text_type="normal"):
    """
    WCAG 2.1適合レベルをチェック

    text_type: "normal" (通常テキスト), "large" (大きいテキスト), "ui" (UIコンポーネント)
    """
    if text_type == "normal":
        aa_required = 4.5
        aaa_required = 7.0
    elif text_type == "large":
        aa_required = 3.0
        aaa_required = 4.5
    elif text_type == "ui":
        aa_required = 3.0
        aaa_required = None  # UIコンポーネントにはAAA要件なし
    else:
        aa_required = 4.5
        aaa_required = 7.0

    aa_pass = ratio >= aa_required
    aaa_pass = ratio >= aaa_required if aaa_required else False

    return {
        'aa': aa_pass,
        'aaa': aaa_pass,
        'aa_required': aa_required,
        'aaa_required': aaa_required
    }

def format_result(fg, bg, usage, text_type="normal"):
    """結果を整形して表示"""
    ratio = contrast_ratio(fg, bg)
    compliance = check_compliance(ratio, text_type)

    # 結果の絵文字
    aa_emoji = "✅" if compliance['aa'] else "❌"
    aaa_emoji = "✅" if compliance['aaa'] else ("❌" if compliance['aaa_required'] else "➖")

    print(f"\n{'='*80}")
    print(f"前景色: {fg} | 背景色: {bg}")
    print(f"用途: {usage}")
    print(f"テキストタイプ: {text_type}")
    print(f"-" * 80)
    print(f"コントラスト比: {ratio:.2f}:1")
    print(f"レベルAA  (≥{compliance['aa_required']:.1f}:1): {aa_emoji} {'PASS' if compliance['aa'] else 'FAIL'}")
    if compliance['aaa_required']:
        print(f"レベルAAA (≥{compliance['aaa_required']:.1f}:1): {aaa_emoji} {'PASS' if compliance['aaa'] else 'FAIL'}")
    else:
        print(f"レベルAAA: ➖ (要件なし)")

    return compliance['aa']

def main():
    """メイン処理: 全ての色の組み合わせを検証"""

    print("=" * 80)
    print("WCAG 2.1 カラーコントラスト比検証レポート")
    print("AWS SAP学習リソースサイト")
    print("=" * 80)

    # index.htmlで使用されている色の組み合わせ
    index_colors = [
        {
            'fg': '#374151',
            'bg': '#F9FAFB',
            'usage': 'リソースリストのリンクテキスト (resource-list a)',
            'type': 'normal'
        },
        {
            'fg': '#6B7280',
            'bg': '#FFFFFF',
            'usage': '統計ラベル (stat-label)',
            'type': 'normal'
        },
        {
            'fg': '#FF9900',
            'bg': '#FFFFFF',
            'usage': 'AWSオレンジ見出し・アクセント',
            'type': 'large'
        },
        {
            'fg': '#232F3E',
            'bg': '#F9FAFB',
            'usage': 'メインテキスト・見出し',
            'type': 'large'
        },
        {
            'fg': '#E5E7EB',
            'bg': '#FFFFFF',
            'usage': 'ボーダー (UIコンポーネント)',
            'type': 'ui'
        },
        {
            'fg': '#9CA3AF',
            'bg': '#FFFFFF',
            'usage': 'セカンダリテキスト (breadcrumb-separator)',
            'type': 'normal'
        },
        {
            'fg': '#FFFFFF',
            'bg': '#FF9900',
            'usage': '白文字on AWSオレンジ (ボタン、バッジ)',
            'type': 'normal'
        },
        {
            'fg': '#FFFFFF',
            'bg': '#232F3E',
            'usage': '白文字on AWSダーク (ヘッダー)',
            'type': 'large'
        },
    ]

    # quiz.htmlで使用されている色の組み合わせ
    quiz_colors = [
        {
            'fg': '#2c3e50',
            'bg': '#FFFFFF',
            'usage': 'quiz.html メインテキスト',
            'type': 'normal'
        },
        {
            'fg': '#4a5568',
            'bg': '#FFFFFF',
            'usage': 'quiz.html セカンダリテキスト',
            'type': 'normal'
        },
        {
            'fg': '#74b9ff',
            'bg': '#FFFFFF',
            'usage': 'quiz.html スコア表示（Good）',
            'type': 'normal'
        },
        {
            'fg': '#00b894',
            'bg': '#FFFFFF',
            'usage': 'quiz.html 正解表示（Excellent）',
            'type': 'normal'
        },
        {
            'fg': '#e17055',
            'bg': '#FFFFFF',
            'usage': 'quiz.html 不正解表示（Poor）',
            'type': 'normal'
        },
        {
            'fg': '#fdcb6e',
            'bg': '#FFFFFF',
            'usage': 'quiz.html スコア表示（Fair）',
            'type': 'normal'
        },
    ]

    print("\n" + "=" * 80)
    print("INDEX.HTML カラーコントラスト検証")
    print("=" * 80)

    index_results = []
    for color_set in index_colors:
        result = format_result(
            color_set['fg'],
            color_set['bg'],
            color_set['usage'],
            color_set['type']
        )
        index_results.append(result)

    print("\n" + "=" * 80)
    print("QUIZ.HTML カラーコントラスト検証")
    print("=" * 80)

    quiz_results = []
    for color_set in quiz_colors:
        result = format_result(
            color_set['fg'],
            color_set['bg'],
            color_set['usage'],
            color_set['type']
        )
        quiz_results.append(result)

    # サマリー
    print("\n" + "=" * 80)
    print("検証サマリー")
    print("=" * 80)

    total_checks = len(index_results) + len(quiz_results)
    total_pass = sum(index_results) + sum(quiz_results)
    pass_rate = (total_pass / total_checks) * 100

    print(f"\n総検証数: {total_checks}")
    print(f"合格数 (レベルAA): {total_pass}")
    print(f"不合格数: {total_checks - total_pass}")
    print(f"合格率: {pass_rate:.1f}%")

    if pass_rate == 100:
        print("\n✅ 全ての色の組み合わせがWCAG 2.1 レベルAAに適合しています！")
    elif pass_rate >= 80:
        print("\n🟡 大部分の色の組み合わせが適合していますが、一部修正が必要です。")
    else:
        print("\n❌ 多くの色の組み合わせがWCAG 2.1 レベルAAに適合していません。修正が必要です。")

    print("\n" + "=" * 80)
    print("推奨アクション")
    print("=" * 80)
    print("""
1. 不合格の色の組み合わせを修正してください
2. WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/) で再確認
3. CODING_STANDARDS.md に検証済みカラーパレットを追加
4. 新しい色を追加する際は必ずコントラスト比を検証

WCAG 2.1 レベルAA要件:
- 通常テキスト: 4.5:1以上
- 大きいテキスト (18pt以上 or 14pt太字以上): 3:1以上
- UIコンポーネント: 3:1以上
""")

if __name__ == "__main__":
    main()
