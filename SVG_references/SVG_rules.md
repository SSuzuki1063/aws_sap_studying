
以下の統一テンプレート仕様に従ってSVG図を生成してください。

【必須手順】
1. まずノード一覧を作る
2. 次にノード配置表を出す
3. その後で完成SVGを書く

【統一デザイン仕様】
- viewBox="0 0 1200 640"
- 外側カード: x=24, y=24, width=1152, height=592, rx=22
- 内側パネル: x=40, y=92, width=1120, height=500, rx=18
- ノードサイズ: width=220, height=96
- 列座標: 80, 360, 640, 920
- 行座標: 200, 360
- ノード角丸: 16
- 文字は中央揃え
- text-anchor="middle"
- dominant-baseline="middle"
- タイトルは中央上部に固定
- テキストは最大2行
- 改行は必ず tspan を使う
- 各ノードは <g> で囲む
- 矢印はノード中心から描く
- 文字の見切れ・重なり・ズレは禁止
- 文字が長い場合は必ず2行化
- 外側余白40px以上を維持

【配色】
- on-prem: fill #F8FAFC, stroke #CBD5E1
- aws service: fill #FFF7ED, stroke #FDBA74
- endpoint/network: fill #EEF2FF, stroke #818CF8
- private resource: fill #ECFDF5, stroke #34D399
- routing/control: fill #FEFCE8, stroke #FACC15
- primary arrows: #3B82F6
- return arrows: #10B981

【出力形式】
- 1. ノード配置表
- 2. 完成SVGコード
- 3. どこに何を配置したかの簡単な説明