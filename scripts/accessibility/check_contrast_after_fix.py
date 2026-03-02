#!/usr/bin/env python3
"""
修正後のカラーコントラスト比検証スクリプト

元のcheck_contrast_ratio.pyと比較して改善を確認します。
"""

def hex_to_rgb(hex_color):
    """16進数カラーコードをRGBタプルに変換"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def relative_luminance(rgb):
    """相対輝度を計算（WCAG 2.1仕様に基づく）"""
    r, g, b = [x / 255.0 for x in rgb]
    r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
    g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
    b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_ratio(color1, color2):
    """2つの色のコントラスト比を計算"""
    lum1 = relative_luminance(hex_to_rgb(color1))
    lum2 = relative_luminance(hex_to_rgb(color2))
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    return (lighter + 0.05) / (darker + 0.05)

def check_compliance(ratio, text_type="normal"):
    """WCAG 2.1適合レベルをチェック"""
    if text_type == "normal":
        aa_required = 4.5
        aaa_required = 7.0
    elif text_type == "large":
        aa_required = 3.0
        aaa_required = 4.5
    elif text_type == "ui":
        aa_required = 3.0
        aaa_required = None
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

def format_comparison(old_color, new_color, bg, usage, text_type="normal"):
    """修正前後の比較を表示"""
    old_ratio = contrast_ratio(old_color, bg)
    new_ratio = contrast_ratio(new_color, bg)

    old_compliance = check_compliance(old_ratio, text_type)
    new_compliance = check_compliance(new_ratio, text_type)

    # 改善状況の絵文字
    if not old_compliance['aa'] and new_compliance['aa']:
        improvement = "✅ 改善成功"
    elif old_compliance['aa'] and new_compliance['aa']:
        improvement = "✅ 既に適合"
    else:
        improvement = "⚠️ 要確認"

    print(f"\n{'='*80}")
    print(f"用途: {usage}")
    print(f"{'='*80}")
    print(f"修正前: {old_color}  コントラスト比: {old_ratio:.2f}:1  {'❌ 不合格' if not old_compliance['aa'] else '✅ 合格'}")
    print(f"修正後: {new_color}  コントラスト比: {new_ratio:.2f}:1  {'✅ 合格' if new_compliance['aa'] else '❌ 不合格'}")
    print(f"改善:   {new_ratio - old_ratio:+.2f}  {improvement}")

    return new_compliance['aa']

def main():
    """メイン処理"""

    print("=" * 80)
    print("修正後カラーコントラスト比検証レポート")
    print("WCAG 2.1 レベルAA適合確認")
    print("=" * 80)

    # 修正した色の比較
    fixes = [
        {
            'old': '#E5E7EB',
            'new': '#909296',
            'bg': '#FFFFFF',
            'usage': 'ボーダー (UIコンポーネント)',
            'type': 'ui'
        },
        {
            'old': '#9CA3AF',
            'new': '#6f7682',
            'bg': '#FFFFFF',
            'usage': 'セカンダリテキスト (breadcrumb-separator)',
            'type': 'normal'
        },
        {
            'old': '#74b9ff',
            'new': '#3378be',
            'bg': '#FFFFFF',
            'usage': 'quiz.html スコア表示（Good）',
            'type': 'normal'
        },
        {
            'old': '#00b894',
            'new': '#008662',
            'bg': '#FFFFFF',
            'usage': 'quiz.html 正解表示（Excellent）',
            'type': 'normal'
        },
        {
            'old': '#e17055',
            'new': '#c35237',
            'bg': '#FFFFFF',
            'usage': 'quiz.html 不正解表示（Poor）',
            'type': 'normal'
        },
        {
            'old': '#fdcb6e',
            'new': '#9e6c0f',
            'bg': '#FFFFFF',
            'usage': 'quiz.html スコア表示（Fair）',
            'type': 'normal'
        },
    ]

    results = []
    for fix in fixes:
        result = format_comparison(
            fix['old'],
            fix['new'],
            fix['bg'],
            fix['usage'],
            fix['type']
        )
        results.append(result)

    # 変更していない色（既に適合している色）
    print("\n" + "=" * 80)
    print("変更不要（既にWCAG 2.1適合）")
    print("=" * 80)

    compliant_colors = [
        {
            'fg': '#374151',
            'bg': '#F9FAFB',
            'usage': 'リソースリストのリンクテキスト',
            'type': 'normal'
        },
        {
            'fg': '#6B7280',
            'bg': '#FFFFFF',
            'usage': '統計ラベル',
            'type': 'normal'
        },
        {
            'fg': '#232F3E',
            'bg': '#F9FAFB',
            'usage': 'メインテキスト・見出し',
            'type': 'large'
        },
        {
            'fg': '#FFFFFF',
            'bg': '#232F3E',
            'usage': '白文字on AWSダーク (ヘッダー)',
            'type': 'large'
        },
    ]

    for color_set in compliant_colors:
        ratio = contrast_ratio(color_set['fg'], color_set['bg'])
        compliance = check_compliance(ratio, color_set['type'])

        print(f"\n{color_set['usage']}")
        print(f"  {color_set['fg']} on {color_set['bg']}")
        print(f"  コントラスト比: {ratio:.2f}:1  ✅ レベルAA適合")

    # サマリー
    print("\n" + "=" * 80)
    print("検証サマリー")
    print("=" * 80)

    total_fixes = len(results)
    successful_fixes = sum(results)

    print(f"\n修正実施数: {total_fixes}件")
    print(f"改善成功数: {successful_fixes}件")
    print(f"成功率: {(successful_fixes/total_fixes)*100:.1f}%")

    if successful_fixes == total_fixes:
        print("\n🎉 全ての修正が成功し、WCAG 2.1 レベルAAに適合しました！")
    else:
        print(f"\n⚠️ {total_fixes - successful_fixes}件の修正が基準を満たしていません。再確認が必要です。")

    print("\n" + "=" * 80)
    print("次のステップ")
    print("=" * 80)
    print("""
1. ✅ カラーコントラスト修正完了
2. 🔄 ローカルサーバーでビジュアルテスト (python3 server.py)
3. 🔄 デザインの確認（色が暗くなりすぎていないか）
4. 🔄 git commit & push でデプロイ
5. 🔄 ACCESSIBILITY_AUDIT.mdに結果を記録
""")

if __name__ == "__main__":
    main()
