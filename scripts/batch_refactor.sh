#!/bin/bash
#
# 一括CSSリファクタリングスクリプト
# 指定されたディレクトリ内の全HTMLファイルをリファクタリング
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REFACTOR_SCRIPT="$SCRIPT_DIR/refactor_css.py"
REPO_ROOT="/home/meme1/aws_sap_studying"

# 使用方法
usage() {
    echo "使用法: $0 <ディレクトリパス> [--dry-run]"
    echo ""
    echo "例:"
    echo "  $0 content-delivery-dns"
    echo "  $0 content-delivery-dns --dry-run"
    exit 1
}

if [ $# -eq 0 ]; then
    usage
fi

TARGET_DIR="$1"
DRY_RUN=""

if [ "$2" == "--dry-run" ]; then
    DRY_RUN="--dry-run"
    echo "🔍 DRY-RUNモード: 実際の変更は行いません"
fi

# ディレクトリの存在確認
if [ ! -d "$REPO_ROOT/$TARGET_DIR" ]; then
    echo "❌ エラー: ディレクトリが見つかりません: $REPO_ROOT/$TARGET_DIR"
    exit 1
fi

# venv環境をアクティブ化
source "$REPO_ROOT/.venv/bin/activate"

# 対象ファイルを取得（cloudfront-https-guide.html は除外 - 既にリファクタリング済み）
FILES=$(find "$REPO_ROOT/$TARGET_DIR" -name "*.html" -type f ! -name "cloudfront-https-guide.html" | sort)
TOTAL=$(echo "$FILES" | wc -l)

echo ""
echo "=========================================="
echo "📦 一括CSSリファクタリング"
echo "=========================================="
echo "対象ディレクトリ: $TARGET_DIR"
echo "対象ファイル数: $TOTAL"
echo "=========================================="
echo ""

COUNTER=0
SUCCESS=0
FAILED=0

for FILE in $FILES; do
    COUNTER=$((COUNTER + 1))
    FILENAME=$(basename "$FILE")

    echo ""
    echo "[$COUNTER/$TOTAL] 処理中: $FILENAME"
    echo "----------------------------------------"

    if python3 "$REFACTOR_SCRIPT" "$FILE" $DRY_RUN; then
        SUCCESS=$((SUCCESS + 1))
    else
        FAILED=$((FAILED + 1))
        echo "❌ エラー: $FILENAME の処理に失敗しました"
    fi

    echo ""
done

echo ""
echo "=========================================="
echo "📊 一括処理完了"
echo "=========================================="
echo "成功: $SUCCESS ファイル"
echo "失敗: $FAILED ファイル"
echo "合計: $TOTAL ファイル"
echo "=========================================="

exit 0
