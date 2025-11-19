# AWS SAP 試験学習リソース / AWS SAP Exam Study Resources

[日本語](#japanese) | [English](#english)

---

<a name="japanese"></a>
## 📚 概要

このリポジトリは、AWS Solutions Architect Professional (SAP) 試験の学習を支援する、ビジュアル学習プラットフォームです。インフォグラフィック、技術図、詳細な解説を含むHTML形式の学習教材を提供しています。

## ✨ 特徴

- 📊 **ビジュアル学習**: SVG図解とインフォグラフィックで視覚的に理解
- 🎯 **試験対策重視**: AWS SAP試験のドメインに沿った構成
- 🌐 **オフライン対応**: 外部依存なしで完全にローカルで動作
- 🎨 **見やすいデザイン**: AWS公式カラー (#232F3E, #FF9900) を使用
- 🇯🇵 **日本語最適化**: 日本語学習者向けのコンテンツ

## 🗂️ ディレクトリ構成

```
aws_sap_studying/
├── index.html                    # メインナビゲーション画面
├── networking/                   # ネットワーキングサービス
│   ├── Direct Connect
│   ├── Transit Gateway
│   ├── VPN
│   ├── PrivateLink
│   └── EIP/NAT
├── transit-gateway-sharing/      # Transit Gateway & AWS RAM
├── security-governance/          # セキュリティ & ガバナンス
│   ├── SCP (Service Control Policies)
│   ├── IAM
│   ├── WAF
│   └── Tag Policies
├── compute-applications/         # コンピューティング & アプリケーション
│   ├── EC2
│   ├── Lambda
│   ├── EFA
│   └── Auto Scaling
├── content-delivery-dns/         # コンテンツ配信 & DNS
│   ├── CloudFront
│   ├── Route 53
│   └── S3
└── development-deployment/       # 開発 & デプロイメント
    ├── CloudFormation
    └── Service Catalog
```

## 🚀 使い方

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd aws_sap_studying
   ```

2. **学習を開始**
   - `index.html` をブラウザで開く
   - サイドバーから学習したいカテゴリを選択
   - 各HTMLファイルを個別に開くことも可能

3. **オフライン学習**
   - すべてのリソースが自己完結型のため、インターネット接続不要
   - SVGグラフィックもインライン埋め込み

## 📖 コンテンツ形式

各学習モジュールには以下が含まれます：

- **ステップバイステップの解説**: 番号付きセクションで段階的に説明
- **技術図解**: SVGによる詳細な構成図
- **AWS CLIサンプル**: 実践的なコマンド例
- **ユースケース**: 実際のシナリオに基づいた説明

## 🤝 貢献

新しい学習リソースを追加する場合：

1. 既存の命名規則に従ってHTMLファイルを作成
   - `aws-[service]-[topic].html` または
   - `[service]_[topic]_infographic.html`
2. 一貫したCSS スタイリングを使用
3. 視覚的説明のためにSVG図を含める
4. `index.html` のナビゲーションを更新
5. 適切なカテゴリディレクトリに配置

## 📝 ライセンス

個人学習用途のリソースです。

---

<a name="english"></a>
## 📚 Overview

This repository is a visual learning platform designed to support studying for the AWS Solutions Architect Professional (SAP) exam. It provides HTML-based learning materials with infographics, technical diagrams, and detailed explanations.

## ✨ Features

- 📊 **Visual Learning**: Understand concepts through SVG diagrams and infographics
- 🎯 **Exam-Focused**: Organized according to AWS SAP exam domains
- 🌐 **Offline Support**: Works completely locally with no external dependencies
- 🎨 **Clean Design**: Uses official AWS brand colors (#232F3E, #FF9900)
- 🇯🇵 **Japanese Optimized**: Content optimized for Japanese learners

## 🗂️ Directory Structure

```
aws_sap_studying/
├── index.html                    # Main navigation interface
├── networking/                   # Networking services
├── transit-gateway-sharing/      # Transit Gateway & AWS RAM sharing
├── security-governance/          # Security & governance services
├── compute-applications/         # Compute & application services
├── content-delivery-dns/         # Content delivery & DNS services
└── development-deployment/       # Development & deployment services
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aws_sap_studying
   ```

2. **Start learning**
   - Open `index.html` in your browser
   - Select a category from the sidebar
   - Individual HTML files can also be opened directly

3. **Offline learning**
   - All resources are self-contained with no internet connection required
   - SVG graphics are embedded inline

## 📖 Content Format

Each learning module includes:

- **Step-by-step explanations**: Numbered sections for gradual learning
- **Technical diagrams**: Detailed SVG architectural diagrams
- **AWS CLI examples**: Practical command examples
- **Use cases**: Real-world scenario-based explanations

## 🤝 Contributing

To add new learning resources:

1. Create HTML file following existing naming conventions
   - `aws-[service]-[topic].html` or
   - `[service]_[topic]_infographic.html`
2. Use consistent CSS styling with AWS brand colors
3. Include SVG diagrams for visual explanation
4. Update `index.html` navigation
5. Place file in appropriate topical directory

## 📝 License

Resources for personal learning use.
