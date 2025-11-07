#!/usr/bin/env python3
"""クイズデータを分析するスクリプト"""

import re
import json

def analyze_quiz_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # カテゴリ情報を抽出
    categories = {}

    # カテゴリの開始位置を検索
    category_pattern = r'(\w+):\s*\{\s*title:\s*["\']([^"\']+)["\']'
    category_matches = re.finditer(category_pattern, content)

    for match in category_matches:
        category_key = match.group(1)
        category_title = match.group(2)
        categories[category_key] = {
            'title': category_title,
            'question_count': 0
        }

    # 各カテゴリの問題数をカウント
    for category_key in categories.keys():
        # カテゴリのquestions配列を探す
        pattern = rf'{category_key}:\s*\{{[^}}]*questions:\s*\[(.*?)\s*\]\s*\}}'
        match = re.search(pattern, content, re.DOTALL)

        if match:
            questions_block = match.group(1)
            # idフィールドの出現回数をカウント（各問題にidがある）
            question_count = len(re.findall(r'\bid:\s*\d+', questions_block))
            categories[category_key]['question_count'] = question_count

    return categories

def main():
    categories = analyze_quiz_data('quiz-data-extended.js')

    print("=== AWS SAP クイズデータベース 現状分析 ===\n")
    print("カテゴリ別問題数:")

    total_questions = 0
    for key, info in categories.items():
        count = info['question_count']
        total_questions += count
        print(f"  {info['title']} ({key}): {count}問")

    print(f"\n合計: {total_questions}問")
    print(f"カテゴリ数: {len(categories)}")

    # 各カテゴリの平均問題数
    avg = total_questions / len(categories) if categories else 0
    print(f"平均問題数/カテゴリ: {avg:.1f}問")

if __name__ == '__main__':
    main()
