#!/usr/bin/env python3
"""クイズデータを詳細分析するスクリプト（改良版）"""

import re

def analyze_quiz_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    categories = []
    current_category = None
    question_count = 0

    for i, line in enumerate(lines):
        # カテゴリの開始を検出（インデント4スペース + カテゴリ名）
        # networking: { または "security-governance": { のパターン
        category_match = re.match(r'^    (["\']?)([a-z][\w-]*)(["\']?):\s*\{', line)

        if category_match:
            # 前のカテゴリを保存
            if current_category:
                categories.append({
                    'key': current_category['key'],
                    'title': current_category['title'],
                    'count': question_count
                })

            # 新しいカテゴリを開始
            category_key = category_match.group(2)
            current_category = {
                'key': category_key,
                'title': '',
                'line': i + 1
            }
            question_count = 0

        # titleを検出
        elif current_category and re.search(r'title:\s*["\']([^"\']+)["\']', line):
            title_match = re.search(r'title:\s*["\']([^"\']+)["\']', line)
            current_category['title'] = title_match.group(1)

        # 問題のidを検出してカウント
        elif current_category and re.match(r'\s+id:\s*\d+', line):
            question_count += 1

    # 最後のカテゴリを保存
    if current_category:
        categories.append({
            'key': current_category['key'],
            'title': current_category['title'],
            'count': question_count
        })

    return categories

def main():
    categories = analyze_quiz_data('quiz-data-extended.js')

    print("=" * 70)
    print("AWS SAP クイズデータベース 現状分析")
    print("=" * 70)
    print()
    print("カテゴリ別問題数:")
    print("-" * 70)

    total_questions = 0
    for i, cat in enumerate(categories, 1):
        count = cat['count']
        total_questions += count
        status = "✓" if count >= 10 else "⚠"
        print(f"{status} {i:2d}. {cat['title']:32s} ({cat['key']:28s}): {count:3d}問")

    print("-" * 70)
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

        # 10問未満のカテゴリを警告
        low_count = [c for c in categories if c['count'] < 10]
        if low_count:
            print()
            print("⚠ 10問未満のカテゴリ:")
            for cat in low_count:
                print(f"  - {cat['title']}: {cat['count']}問")

if __name__ == '__main__':
    main()
