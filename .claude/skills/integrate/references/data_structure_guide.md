# Data Structure Guide: data.js and index.js

## Critical Rule: Two-Place Update Requirement

**When adding a new HTML learning resource, you MUST update TWO places:**

1. **`data.js`** - Add to appropriate section's resources array AND update counts
2. **`index.js`** - Add to searchData array (search won't work without this!)

Failure to update both places will result in broken navigation or search functionality.

## data.js Structure

### Overall Structure

```javascript
const categoriesData = [
  {
    id: 'category-id',           // kebab-case identifier
    name: 'カテゴリ名',          // Japanese display name
    icon: '🔷',                   // Emoji icon
    count: 0,                    // MUST UPDATE: Total resources in category
    sections: [...]              // Array of subcategories
  },
  // ... more categories
];
```

### Section Structure (Within Categories)

```javascript
sections: [
  {
    title: 'サブカテゴリ名',     // Japanese section title
    count: 0,                    // MUST UPDATE: Number of resources in this section
    resources: [                 // Array of learning resources
      {
        title: 'リソースタイトル',
        href: 'category/filename.html'
      },
      // ... more resources
    ]
  },
  // ... more sections
]
```

## Step-by-Step: Adding a Resource to data.js

### Step 1: Identify the Correct Category and Section

Based on AWS service type, find the appropriate category:

- **networking** - VPC, Direct Connect, Transit Gateway, VPN, PrivateLink, ENI
- **security-governance** - IAM, SCP, Organizations, KMS, WAF, Cognito
- **compute-applications** - EC2, Lambda, ECS, Auto Scaling, ALB, SQS, SNS
- **content-delivery-dns** - CloudFront, Route53, Global Accelerator
- **development-deployment** - CloudFormation, CDK, SAM, CodePipeline, EventBridge, API Gateway
- **storage-database** - S3, EBS, EFS, RDS, Aurora, DynamoDB, ElastiCache, MSK
- **migration** - DMS, Migration Hub, DR strategies, Blue/Green
- **analytics-bigdata** - Kinesis, Redshift, cost tools, CloudWatch, data pipelines
- **organizational-complexity** - RAM, multi-account, Service Catalog
- **continuous-improvement** - Systems Manager, CodeDeploy, CloudTrail
- **cost-control** - Cost optimization, S3 storage classes, Lambda concurrency
- **new-solutions** - New architecture patterns

### Step 2: Add Resource Object

Within the appropriate section's `resources` array, add:

```javascript
{
  title: 'AWS Lambda メトリクスとモニタリング',
  href: 'compute-applications/aws-lambda-metrics.html'
}
```

**Important:**
- `title`: Japanese display name (what users see in navigation)
- `href`: Relative path from index.html to the HTML file

### Step 3: Update Section Count

Increment the section's `count` field by 1:

```javascript
{
  title: 'コンピュート',
  count: 15,  // Was 14, now 15 after adding resource
  resources: [...]
}
```

### Step 4: Update Category Count

Increment the category's `count` field by 1:

```javascript
{
  id: 'compute-applications',
  name: 'コンピュート・アプリケーション',
  icon: '🔷',
  count: 25,  // Was 24, now 25 after adding resource
  sections: [...]
}
```

## index.js Structure: searchData Array

### searchData Structure

```javascript
const searchData = [
  {
    title: 'リソースタイトル',           // Same as data.js title
    category: 'カテゴリ名',             // Japanese category name
    file: 'category/filename.html'     // Same as data.js href
  },
  // ... more entries (120+ total)
];
```

### Adding to searchData

For the same resource added to data.js, add a corresponding entry:

```javascript
{
  title: 'AWS Lambda メトリクスとモニタリング',
  category: 'コンピュート・アプリケーション',
  file: 'compute-applications/aws-lambda-metrics.html'
}
```

**Critical fields:**
- `title`: EXACT same title as in data.js
- `category`: Japanese category name (from categoriesData[].name)
- `file`: EXACT same path as href in data.js

## Common Mistakes to Avoid

### ❌ Mistake 1: Only updating data.js

```javascript
// Added to data.js but NOT to searchData
// Result: Resource appears in navigation but NOT in search
```

### ❌ Mistake 2: Only updating searchData

```javascript
// Added to searchData but NOT to data.js
// Result: Resource appears in search but NOT in navigation
```

### ❌ Mistake 3: Forgetting to update counts

```javascript
{
  title: 'セキュリティ',
  count: 10,  // Still 10 even though you added a resource!
  resources: [...11 resources...]  // Count doesn't match array length
}
```

### ❌ Mistake 4: Mismatched paths

```javascript
// In data.js:
href: 'security-governance/aws-iam-guide.html'

// In searchData:
file: 'security/aws-iam-guide.html'  // Wrong directory!

// Result: Navigation link is broken OR search link is broken
```

## Complete Example: Adding a New Resource

### Scenario: Adding "AWS Lambda Concurrency Management"

**File location:** `compute-applications/aws-lambda-concurrency.html`

### 1. Update data.js

```javascript
// Find the compute-applications category
{
  id: 'compute-applications',
  name: 'コンピュート・アプリケーション',
  icon: '🔷',
  count: 26,  // Increment from 25 to 26
  sections: [
    {
      title: 'コンピュート',
      count: 16,  // Increment from 15 to 16
      resources: [
        // ... existing resources ...
        {
          title: 'AWS Lambda 同時実行数管理',
          href: 'compute-applications/aws-lambda-concurrency.html'
        }
      ]
    }
  ]
}
```

### 2. Update index.js

```javascript
const searchData = [
  // ... existing entries ...
  {
    title: 'AWS Lambda 同時実行数管理',
    category: 'コンピュート・アプリケーション',
    file: 'compute-applications/aws-lambda-concurrency.html'
  }
];
```

### 3. Verification Checklist

- [ ] Resource added to data.js resources array
- [ ] Section count incremented in data.js
- [ ] Category count incremented in data.js
- [ ] Resource added to searchData in index.js
- [ ] title matches exactly between data.js and index.js
- [ ] href/file paths match exactly
- [ ] Category name in searchData matches categoriesData[].name

## Testing After Updates

```bash
# Start local server
python3 server.py

# Open http://localhost:8080/ and verify:
# 1. Resource appears in navigation sidebar
# 2. Category count updated correctly
# 3. Clicking resource loads the HTML file
# 4. Searching for resource title finds it
# 5. Clicking search result loads the HTML file
```
