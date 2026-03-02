#!/usr/bin/env python3
"""
AWS SAP-C02 試験ドメイン別配点 ドーナツチャート生成スクリプト
output_images/exam-domain-weights.webp に出力
"""

import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np
from pathlib import Path

# フォントパス設定
font_dir = Path.home() / '.local' / 'share' / 'fonts'
regular_font = font_dir / 'NotoSansCJKjp-Regular.otf'
bold_font = font_dir / 'NotoSansCJKjp-Bold.otf'

# フォント登録
fm.fontManager.addfont(str(regular_font))
fm.fontManager.addfont(str(bold_font))

# ドメインデータ（exam-guide-data.js と同期）
domains = [
    {
        'title': '複雑な組織に対応する\nソリューションの設計',
        'short': 'ドメイン 1',
        'weight': 26,
        'color': '#3B82F6',
        'light_color': '#93bbfd',
        'icon': '🏢',
        'tasks': 5,
    },
    {
        'title': '新しいソリューション\nのための設計',
        'short': 'ドメイン 2',
        'weight': 29,
        'color': '#10B981',
        'light_color': '#86e4c0',
        'icon': '🚀',
        'tasks': 6,
    },
    {
        'title': '既存のソリューションの\n継続的な改善',
        'short': 'ドメイン 3',
        'weight': 25,
        'color': '#F59E0B',
        'light_color': '#fcd68d',
        'icon': '🔄',
        'tasks': 5,
    },
    {
        'title': 'ワークロードの移行と\nモダナイゼーションの加速',
        'short': 'ドメイン 4',
        'weight': 20,
        'color': '#8B5CF6',
        'light_color': '#c4aefb',
        'icon': '📦',
        'tasks': 4,
    },
]

# グラフ作成
fig = plt.figure(figsize=(14, 8), facecolor='white', dpi=150)

# サブプロット配置: ドーナツチャート中央、説明テキスト周囲
ax_donut = fig.add_axes([0.30, 0.08, 0.40, 0.78])

# ドーナツチャートデータ
weights = [d['weight'] for d in domains]
colors = [d['color'] for d in domains]
light_colors = [d['light_color'] for d in domains]

# 外側リング（メインカラー）
wedges_outer, _ = ax_donut.pie(
    weights,
    radius=1.0,
    colors=colors,
    startangle=90,
    counterclock=False,
    wedgeprops=dict(width=0.22, edgecolor='white', linewidth=2.5),
)

# 内側リング（ライトカラー）
wedges_inner, _ = ax_donut.pie(
    weights,
    radius=0.78,
    colors=light_colors,
    startangle=90,
    counterclock=False,
    wedgeprops=dict(width=0.12, edgecolor='white', linewidth=1.5),
)

# 中央テキスト
ax_donut.text(0, 0.06, 'SAP-C02', fontsize=16,
              fontfamily='Noto Sans CJK JP', fontweight='bold',
              ha='center', va='center', color='#232F3E')
ax_donut.text(0, -0.08, '試験配点', fontsize=13,
              fontfamily='Noto Sans CJK JP',
              ha='center', va='center', color='#6B7280')
ax_donut.text(0, -0.22, '全65問', fontsize=11,
              fontfamily='Noto Sans CJK JP',
              ha='center', va='center', color='#9CA3AF')

# 凡例テキスト（左上: ドメイン1、右上: ドメイン2、左下: ドメイン3、右下: ドメイン4）
positions = [
    (0.02, 0.85),   # 左上
    (0.72, 0.85),   # 右上
    (0.02, 0.22),   # 左下
    (0.72, 0.22),   # 右下
]

for i, (domain, (x, y)) in enumerate(zip(domains, positions)):
    # ドメイン番号とパーセント
    fig.text(x, y, domain['short'], fontsize=11,
             fontfamily='Noto Sans CJK JP',
             color='#6B7280', transform=fig.transFigure)

    fig.text(x + 0.16, y - 0.005, f"{domain['weight']}%", fontsize=28,
             fontfamily='Noto Sans CJK JP', fontweight='bold',
             color=domain['color'], transform=fig.transFigure)

    # 区切り線
    fig.patches.append(plt.Rectangle(
        (x, y - 0.04), 0.24, 0.002,
        transform=fig.transFigure, facecolor=domain['color'],
        alpha=0.4, clip_on=False
    ))

    # ドメインタイトル
    fig.text(x, y - 0.07, domain['title'], fontsize=9,
             fontfamily='Noto Sans CJK JP',
             color='#374151', transform=fig.transFigure,
             linespacing=1.4)

    # タスク数
    fig.text(x, y - 0.15, f"{domain['tasks']} タスク",
             fontsize=8.5,
             fontfamily='Noto Sans CJK JP',
             color='#9CA3AF', transform=fig.transFigure)

# タイトル
fig.text(0.50, 0.97, 'ドメイン別配点',
         fontsize=18, fontfamily='Noto Sans CJK JP', fontweight='bold',
         ha='center', va='top', color='#232F3E',
         transform=fig.transFigure)

fig.text(0.50, 0.93, 'AWS Certified Solutions Architect - Professional (SAP-C02)',
         fontsize=10, fontfamily='Noto Sans CJK JP',
         ha='center', va='top', color='#6B7280',
         transform=fig.transFigure)

# 出力
output_path = Path(__file__).parent.parent / 'output_images' / 'exam-domain-weights.webp'
output_path.parent.mkdir(parents=True, exist_ok=True)
fig.savefig(str(output_path), format='webp', bbox_inches='tight',
            pad_inches=0.3, facecolor='white')
plt.close(fig)

print(f"Generated: {output_path}")
