# Quiz Question Template & Guidelines

## Question Structure

All quiz questions in `quiz-data-extended.js` follow this exact structure:

```javascript
{
  id: 'unique-identifier',  // Format: [service]-[topic]-[year] e.g., 'lambda-concurrency-2024'
  question: 'Question text in Japanese',
  options: [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4'
  ],
  correct: 0,  // Index of correct answer (0-3)
  explanation: 'Detailed explanation in Japanese (2-4 sentences)'
}
```

## Question Writing Guidelines

### ID Naming Convention

- Format: `[service]-[topic]-[year]`
- Use lowercase with hyphens
- Examples:
  - `lambda-metrics-2024`
  - `s3-encryption-2025`
  - `vpc-peering-2024`

### Question Text

- Write in clear, professional Japanese
- Be specific and unambiguous
- Focus on practical scenarios, not just definitions
- Typical length: 2-4 sentences including scenario setup
- Example: "ある企業がAWS Lambdaを使用してサーバーレスアプリケーションを構築しています。同時実行数の制限を管理する必要があります。最も適切なアプローチはどれですか？"

### Options (4 Required)

- Provide exactly 4 options
- Make all options plausible to test understanding
- Avoid obvious "trick" answers
- Similar length across all options
- Use consistent formatting

### Correct Answer Index

- `correct: 0` for first option
- `correct: 1` for second option
- `correct: 2` for third option
- `correct: 3` for fourth option

### Explanation

- Write 2-4 sentences in Japanese
- Explain WHY the correct answer is right
- Optionally explain why other options are wrong
- Include relevant AWS service details
- Reference AWS best practices when applicable
- Example: "予約済み同時実行数を設定することで、Lambda関数の同時実行数を制御できます。これにより、他の関数への影響を防ぎ、予測可能なパフォーマンスを実現できます。プロビジョニング済み同時実行数とは異なり、予約済み同時実行数はコールドスタートの削減を目的としていません。"

## Category Placement

Place questions in the appropriate category object in `quiz-data-extended.js`:

- `networking` - VPC, Direct Connect, Transit Gateway, VPN, PrivateLink
- `security-governance` - IAM, SCP, Organizations, KMS, WAF, Cognito
- `compute-applications` - EC2, Lambda, ECS, Auto Scaling, ALB, SQS, SNS
- `content-delivery-dns` - CloudFront, Route53, Global Accelerator
- `development-deployment` - CloudFormation, CDK, SAM, CodePipeline, EventBridge
- `storage-database` - S3, EBS, EFS, RDS, Aurora, DynamoDB, ElastiCache
- `migration-transfer` - DMS, Migration Hub, DR strategies
- `analytics-operations` - Kinesis, Redshift, cost tools, CloudWatch
- `organizational-complexity` - RAM, multi-account management, Service Catalog
- `continuous-improvement` - Systems Manager, CodeDeploy, CloudTrail
- `cost-control` - Cost optimization, S3 storage classes
- `new-solutions` - New architecture patterns
- `comprehensive` - Cross-domain questions

## Example Complete Question

```javascript
{
  id: 's3-encryption-kms-2024',
  question: 'ある組織がS3バケットに保存されている機密データを暗号化する必要があります。暗号化キーのローテーションを自動化し、キーの使用状況を監査したいと考えています。最も適切なソリューションはどれですか？',
  options: [
    'S3のサーバー側暗号化（SSE-S3）を使用する',
    'S3のサーバー側暗号化（SSE-KMS）とAWS KMSカスタマーマネージドキーを使用する',
    'クライアント側暗号化を実装する',
    'S3のサーバー側暗号化（SSE-C）を使用する'
  ],
  correct: 1,
  explanation: 'SSE-KMSとカスタマーマネージドキーを使用することで、自動キーローテーション、詳細な監査ログ（CloudTrail）、きめ細かいアクセス制御が可能になります。SSE-S3は自動暗号化を提供しますが、キー管理機能は限定的です。SSE-Cはクライアントがキーを管理する必要があり、運用負荷が高くなります。'
}
```

## Validation Before Committing

1. **Syntax check**: Run `node -c quiz-data-extended.js` to verify JavaScript syntax
2. **Manual verification**:
   - Unique ID (no duplicates)
   - Exactly 4 options
   - `correct` index is 0-3
   - Question and explanation in Japanese
   - Placed in correct category
3. **UI test**: Load quiz.html locally and verify question displays correctly
