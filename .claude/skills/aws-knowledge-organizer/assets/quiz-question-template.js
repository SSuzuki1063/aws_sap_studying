// Quiz Question Template
// Copy this template when adding new questions to quiz-data-extended.js

// Add to the appropriate category in quiz-data-extended.js:
{
  id: '[service]-[topic]-[year]',  // Example: 's3-storage-class-2024'
  question: '[問題文をここに記述]',
  options: [
    '[選択肢1]',
    '[選択肢2]',
    '[選択肢3]',
    '[選択肢4]'
  ],
  correct: 0,  // Index of correct answer (0-3)
  explanation: '[正解の詳細な解説をここに記述。なぜこれが正解か、他の選択肢が不適切な理由も含める]'
}

// ============================================
// EXAMPLE: Good Quiz Question
// ============================================

{
  id: 's3-glacier-retrieval-2024',
  question: 'S3 Glacier Deep Archiveから大量データを復元する際、最もコスト効率が良い方法は？',
  options: [
    'Expedited取得を使用',
    'Standard取得を使用',
    'Bulk取得を使用し、取得期間を48時間に設定',
    'S3 Intelligent-Tieringに自動移行させてから取得'
  ],
  correct: 2,
  explanation: 'Bulk取得は最も低コストで、Deep Archiveでは12-48時間で復元可能。大量データの場合、コスト削減効果が大きい。Expeditedは高コスト、StandardはBulkより高い。Intelligent-Tieringへの移行は不要なステップ。'
}

// ============================================
// CHECKLIST BEFORE ADDING
// ============================================

// ID Requirements:
// - [ ] Unique across all categories
// - [ ] Format: [service]-[topic]-[year]
// - [ ] Lowercase with hyphens

// Question Requirements:
// - [ ] Written in clear Japanese
// - [ ] Scenario-based or practical
// - [ ] Unambiguous and specific
// - [ ] Aligned with AWS SAP exam style

// Options Requirements:
// - [ ] Exactly 4 options
// - [ ] All options are plausible
// - [ ] Correct answer index is valid (0-3)
// - [ ] Varies position of correct answers

// Explanation Requirements:
// - [ ] Explains why correct answer is right
// - [ ] Explains why other options are wrong
// - [ ] References AWS concepts/best practices
// - [ ] Concise but comprehensive (2-4 sentences)

// ============================================
// CATEGORY KEYS
// ============================================

// Use these exact category keys when adding questions:
// - 'networking'
// - 'security-governance'
// - 'compute-applications'
// - 'content-delivery-dns'
// - 'development-deployment'
// - 'storage-database'
// - 'migration-transfer'
// - 'analytics-operations'
// - 'cost-optimization'

// ============================================
// FULL EXAMPLE WITH CATEGORY
// ============================================

/*
In quiz-data-extended.js, add to the appropriate category:

const quizData = {
  'storage-database': {
    title: 'ストレージ・データベース',
    icon: '💾',
    questions: [
      // ... existing questions ...
      {
        id: 's3-intelligent-tiering-2024',
        question: 'S3 Intelligent-Tieringストレージクラスの特徴として正しいものは？',
        options: [
          'アクセスパターンに基づいて自動的にストレージ階層を移動する',
          '手動でオブジェクトを階層間で移動する必要がある',
          'Glacierへの移行はできない',
          '最小オブジェクトサイズの制限はない'
        ],
        correct: 0,
        explanation: 'S3 Intelligent-Tieringは、アクセスパターンを監視し、30日間アクセスがないオブジェクトを自動的に低頻度アクセス階層に移動します。さらに90日間アクセスがない場合はアーカイブ階層に移動します。'
      }
    ]
  }
};
*/
