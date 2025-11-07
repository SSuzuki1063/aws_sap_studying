#!/usr/bin/env python3
"""クイズデータを詳細分析するスクリプト"""

import re

def analyze_quiz_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # カテゴリ情報を抽出
    categories = []

    # カテゴリのパターン: category_key: { title: "...", icon: "...", questions: [
    category_pattern = r'(\w[\w-]*):\s*\{\s*title:\s*["\']([^"\']+)["\']'

    for match in re.finditer(category_pattern, content):
        category_key = match.group(1)
        category_title = match.group(2)
        start_pos = match.end()

        # このカテゴリの終了位置を探す（次の閉じカッコ}まで）
        # カテゴリ内のid:をカウント
        next_category_match = re.search(r'\n\s{4}\w[\w-]*:\s*\{', content[start_pos:])

        if next_category_match:
            end_pos = start_pos + next_category_match.start()
        else:
            # 最後のカテゴリの場合
            end_pos = content.find('\n};', start_pos)

        category_block = content[start_pos:end_pos]
        question_count = len(re.findall(r'\bid:\s*\d+', category_block))

        categories.append({
            'key': category_key,
            'title': category_title,
            'count': question_count
        })

    return categories

def main():
    categories = analyze_quiz_data('quiz-data-extended.js')

    print("=" * 60)
    print("AWS SAP クイズデータベース 現状分析")
    print("=" * 60)
    print()
    print("カテゴリ別問題数:")
    print("-" * 60)

    total_questions = 0
    for i, cat in enumerate(categories, 1):
        count = cat['count']
        total_questions += count
        print(f"{i:2d}. {cat['title']:30s} ({cat['key']:25s}): {count:3d}問")

    print("-" * 60)
    print(f"合計カテゴリ数: {len(categories)}")
    print(f"合計問題数: {total_questions}問")

    if categories:
        avg = total_questions / len(categories)
        print(f"平均問題数/カテゴリ: {avg:.1f}問")

        # 最大・最小を表示
        max_cat = max(categories, key=lambda x: x['count'])
        min_cat = min(categories, key=lambda x: x['count'])

        print()
        print(f"最多問題数: {max_cat['title']} ({max_cat['count']}問)")
        print(f"最少問題数: {min_cat['title']} ({min_cat['count']}問)")

if __name__ == '__main__':
    main()
