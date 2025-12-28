#!/bin/bash
# find_svg_without_aria.sh
# SVGタグでrole="img"やaria-labelがないファイルを検出

echo "=========================================="
echo "SVGアクセシビリティ検証スクリプト"
echo "=========================================="
echo ""

total_files_with_svg=0
total_files_missing_aria=0
total_svg_tags=0

# 検証対象ディレクトリ
directories=(
    "networking"
    "security-governance"
    "compute-applications"
    "content-delivery-dns"
    "development-deployment"
    "storage-database"
    "migration"
    "analytics-bigdata"
    "organizational-complexity"
    "continuous-improvement"
    "cost-control"
    "new-solutions"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "📁 検証中: $dir/"
        echo "----------------------------------------"

        # そのディレクトリ内のHTMLファイルを検索
        html_files=$(find "$dir" -name "*.html" -type f 2>/dev/null)

        if [ -z "$html_files" ]; then
            echo "  ℹ️  HTMLファイルが見つかりません"
            echo ""
            continue
        fi

        dir_has_issues=0

        for file in $html_files; do
            # SVGタグの数をカウント
            svg_count=$(grep -c "<svg" "$file" 2>/dev/null || echo "0")

            if [ "$svg_count" -gt 0 ]; then
                ((total_files_with_svg++))
                ((total_svg_tags+=$svg_count))

                # role="img"の有無をチェック
                has_role=$(grep -q 'role="img"' "$file" && echo "yes" || echo "no")

                # aria-labelの有無をチェック
                has_aria_label=$(grep -q 'aria-label=' "$file" && echo "yes" || echo "no")

                # <title>タグ（SVG内）の有無をチェック
                has_title=$(grep -q '<title>' "$file" && echo "yes" || echo "no")

                # 問題がある場合は報告
                if [ "$has_role" = "no" ] || [ "$has_aria_label" = "no" ]; then
                    if [ $dir_has_issues -eq 0 ]; then
                        dir_has_issues=1
                    fi

                    ((total_files_missing_aria++))

                    filename=$(basename "$file")
                    echo "  ⚠️  $filename"
                    echo "      SVGタグ数: $svg_count"

                    if [ "$has_role" = "no" ]; then
                        echo "      ❌ role=\"img\" が不足"
                    else
                        echo "      ✅ role=\"img\" あり"
                    fi

                    if [ "$has_aria_label" = "no" ]; then
                        echo "      ❌ aria-label が不足"
                    else
                        echo "      ✅ aria-label あり"
                    fi

                    if [ "$has_title" = "no" ]; then
                        echo "      ⚠️  <title> が不足（推奨）"
                    else
                        echo "      ✅ <title> あり"
                    fi

                    echo ""
                fi
            fi
        done

        if [ $dir_has_issues -eq 0 ]; then
            echo "  ✅ このディレクトリには問題なし"
        fi

        echo ""
    fi
done

echo "=========================================="
echo "検証結果サマリー"
echo "=========================================="
echo "SVGを含むファイル数: $total_files_with_svg"
echo "アクセシビリティ属性が不足: $total_files_missing_aria"
echo "検出されたSVGタグ総数: $total_svg_tags"
echo ""

if [ $total_files_missing_aria -gt 0 ]; then
    echo "⚠️  修正が必要なファイルがあります"
    echo ""
    echo "推奨される修正:"
    echo "1. SVGタグに role=\"img\" を追加"
    echo "2. aria-label=\"図の説明\" を追加"
    echo "3. SVG内に <title>図のタイトル</title> を追加（推奨）"
    echo "4. SVG内に <desc>詳細な説明</desc> を追加（推奨）"
    echo ""
    echo "例:"
    echo '<svg role="img" aria-label="AWS Direct Connect接続図" width="800" height="600">'
    echo '  <title>AWS Direct Connect接続図</title>'
    echo '  <desc>企業オフィスとAWSデータセンターを接続する専用線の図</desc>'
    echo '  <!-- SVG content -->'
    echo '</svg>'
else
    echo "✅ すべてのSVGに適切なアクセシビリティ属性が設定されています"
fi

echo ""
echo "=========================================="
