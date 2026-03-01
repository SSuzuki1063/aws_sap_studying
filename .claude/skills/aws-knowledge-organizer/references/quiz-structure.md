# Quiz Data Structure Reference

This reference documents the structure of the quiz system used in `quiz-data-extended.js`.

## Quiz Data Structure

The quiz system uses a JavaScript object with category-based organization:

```javascript
const quizData = {
  'category-key': {
    title: 'Category Display Name',
    icon: 'Emoji Icon',
    questions: [
      // Array of question objects
    ]
  },
  // ... more categories
};
```

## Category Structure

Each category in `quizData` must have these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | Japanese display name for the category |
| `icon` | string | Yes | Emoji icon representing the category |
| `questions` | array | Yes | Array of question objects |

### Example Category

```javascript
'networking': {
  title: 'ネットワーキング',
  icon: '🌐',
  questions: [
    // Question objects here
  ]
}
```

## Question Object Structure

Each question in the `questions` array must have these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the question |
| `question` | string | Yes | The question text (Japanese) |
| `options` | array | Yes | Array of 4 answer options (strings) |
| `correct` | number | Yes | Index of the correct answer (0-3) |
| `explanation` | string | Yes | Detailed explanation of the correct answer (Japanese) |

### Question Object Example

```javascript
{
  id: 'vpc-endpoint-2024',
  question: 'プライベートサブネット内のEC2インスタンスから、インターネット経由せずにS3にアクセスする最適な方法は？',
  options: [
    'NAT Gatewayを使用',
    'VPC Endpointを使用',
    'Internet Gatewayを使用',
    'Direct Connectを使用'
  ],
  correct: 1,
  explanation: 'VPC Endpoint（特にGateway型）を使用することで、インターネットを経由せずにプライベートにS3へアクセスできます。データ転送料金も削減できます。'
}
```

## Question ID Conventions

Question IDs should follow these conventions:

- **Format:** `[service]-[topic]-[year]`
- **Examples:**
  - `s3-storage-class-2024`
  - `vpc-endpoint-2024`
  - `lambda-concurrency-2024`
  - `direct-connect-bgp-2024`

- Use lowercase with hyphens
- Include service or topic abbreviation
- Add year to indicate freshness
- Ensure uniqueness across all categories

## Category Keys

The category keys must match the categories used in the main navigation:

| Category Key | Japanese Title | Icon |
|--------------|----------------|------|
| `networking` | ネットワーキング | 🌐 |
| `security-governance` | セキュリティ・ガバナンス | 🔒 |
| `compute-applications` | コンピュート・アプリケーション | ⚡ |
| `content-delivery-dns` | コンテンツ配信・DNS | 🌍 |
| `development-deployment` | 開発・デプロイメント | 🚀 |
| `storage-database` | ストレージ・データベース | 💾 |
| `migration-transfer` | 移行・転送 | 🔄 |
| `analytics-operations` | 分析・運用 | 📊 |
| `cost-optimization` | コスト最適化 | 💰 |

## Helper Functions

`quiz-data-extended.js` includes helper functions at the end of the file:

### getTotalQuestions(categoryKey)

Returns the total number of questions in a category.

```javascript
function getTotalQuestions(categoryKey) {
  if (!quizData[categoryKey]) return 0;
  return quizData[categoryKey].questions.length;
}
```

**Usage:**
```javascript
const count = getTotalQuestions('networking');
console.log(`Networking has ${count} questions`);
```

### getAllQuestions(categoryKey)

Returns a copy of all questions for a category.

```javascript
function getAllQuestions(categoryKey) {
  if (!quizData[categoryKey]) return [];
  return [...quizData[categoryKey].questions];
}
```

**Usage:**
```javascript
const questions = getAllQuestions('security-governance');
```

## Adding New Questions

To add new quiz questions:

1. Open `quiz-data-extended.js`
2. Locate the appropriate category object
3. Add question object to the `questions` array:

```javascript
'storage-database': {
  title: 'ストレージ・データベース',
  icon: '💾',
  questions: [
    // Existing questions...
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
    // More new questions...
  ]
}
```

4. Test in browser at `/quiz.html`
5. Verify question display, options, and explanation
6. Commit changes to git

## Question Writing Best Practices

### Question Text
- Write in clear, natural Japanese
- Be specific and unambiguous
- Focus on practical scenarios
- Align with AWS SAP exam style

### Options
- Always provide exactly 4 options
- Make distractors plausible but incorrect
- Avoid "all of the above" or "none of the above"
- Vary the position of correct answers

### Explanations
- Explain why the correct answer is right
- Explain why other options are wrong or suboptimal
- Include relevant AWS documentation concepts
- Reference best practices when applicable
- Keep explanations concise but comprehensive (2-4 sentences)

### Example of Good vs Bad Questions

❌ **Bad Question:**
```javascript
{
  question: 'S3は何に使いますか？',
  options: ['ストレージ', 'データベース', 'ネットワーク', '全て'],
  correct: 0,
  explanation: 'S3はストレージサービスです。'
}
```

✅ **Good Question:**
```javascript
{
  question: '大量の非構造化データを長期保存し、年に1回程度しかアクセスしないファイルの最適なストレージクラスは？',
  options: [
    'S3 Standard',
    'S3 Intelligent-Tiering',
    'S3 Glacier Deep Archive',
    'S3 One Zone-IA'
  ],
  correct: 2,
  explanation: 'S3 Glacier Deep Archiveは、年に1〜2回程度のアクセス頻度のデータに最適で、最も低コストなストレージクラスです。取得に12〜48時間かかりますが、長期保存には最適です。'
}
```

## Validation Checklist

Before committing new questions, verify:

- [ ] Unique `id` (search for duplicates)
- [ ] Valid category key
- [ ] Question text is clear and scenario-based
- [ ] Exactly 4 options provided
- [ ] `correct` index is 0-3
- [ ] Explanation is detailed and educational
- [ ] Japanese text is natural and readable
- [ ] Technical terms are accurate
- [ ] Aligns with AWS SAP exam topics
- [ ] No syntax errors in JavaScript

## File Location

The quiz data file is located at:
```
/quiz-data-extended.js
```

Do not create new quiz files - always append to the existing `quiz-data-extended.js`.
