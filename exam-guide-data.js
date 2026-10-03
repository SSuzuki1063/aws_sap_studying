/**
 * AWS SAP-C02 試験ガイド データ定義
 * SAP-C02試験ガイドPDFの内容を完全にデータ化
 */

const examGuideData = {
    examInfo: {
        name: 'AWS Certified Solutions Architect - Professional',
        code: 'SAP-C02',
        questions: 65,
        duration: 180, // 分
        passingScore: 750,
        maxScore: 1000,
        questionTypes: ['複数選択', '複数応答'],
        languages: ['日本語', '英語', '韓国語', '中国語（簡体字）'],
        testingOptions: ['Pearson VUE テストセンター', 'オンラインプロクタリング'],
        validityPeriod: 3 // 年
    },
    domains: [
        {
            id: 'domain1',
            title: '複雑な組織に対応するソリューションの設計',
            weight: 26,
            color: '#3B82F6', // Blue
            icon: '🏢',
            tasks: [
                {
                    id: '1.1',
                    title: 'ネットワーク接続戦略を設計する',
                    knowledge: [
                        'AWSグローバルインフラストラクチャ',
                        'AWSネットワークの概念（Amazon VPC、AWS Direct Connect、AWS VPN、推移的ルーティング、AWSコンテナサービスなど）',
                        'ハイブリッドDNSの概念（Amazon Route 53 Resolver、オンプレミスDNS統合など）',
                        'ネットワークセグメンテーション（サブネット、IPアドレス指定、VPC間の接続など）',
                        'ネットワークトラフィックモニタリング'
                    ],
                    skills: [
                        '複数のVPCの接続オプションを評価する',
                        'オンプレミス、コロケーション、クラウド統合の接続オプションを評価する',
                        'ネットワークとレイテンシーの要件に基づいてAWSリージョンとアベイラビリティーゾーンを選択する',
                        'AWSツールを使用してトラフィックフローの問題を解決する',
                        'サービス統合のためのサービスエンドポイントを使用する'
                    ],
                    relatedResources: [
                        { title: 'Direct Connect ガイド', href: 'networking/aws-direct-connect-guide.html' },
                        { title: 'Transit Gateway 詳細ガイド', href: 'networking/transit-gateway-deep-dive.html' },
                        { title: 'VPC Network Access Analyzer ガイド', href: 'networking/vpc-network-access-analyzer-guide.html' },
                        { title: 'VPN vs PrivateLink', href: 'new-solutions/vpn-vs-privatelink.html' },
                        { title: 'CIDR集約とプレフィックスリスト', href: 'networking/cidr-aggregation-prefix-list-guide.html' },
                        { title: 'AWS ゲートウェイ比較', href: 'networking/aws-gateways.html' }
                    ]
                },
                {
                    id: '1.2',
                    title: 'セキュリティコントロールを規定する',
                    knowledge: [
                        'AWSセキュリティとコンプライアンスの目標',
                        'AWSアイデンティティ・アクセス管理（IAM）機能（ポリシー、ポリシー要素、変数、アクセス境界など）',
                        'ロギング、モニタリング、検出のメカニズム',
                        '暗号化オプションとテクニック',
                        'AWSセキュリティサービス（AWS Security Hub、AWS GuardDuty、AWS Macie、AWS Inspector、AWS Configなど）'
                    ],
                    skills: [
                        'AWSグローバルインフラストラクチャを活用してセキュリティ要件を満たす',
                        'ネットワーク境界でトラフィックフローを制御するためにAWSセキュリティサービスを適用する',
                        'マルチアカウント環境に必要なIAMポリシーを設計する',
                        'コンプライアンス要件に基づいてIAMユーザー、グループ、ロールのベストプラクティスを推奨する',
                        '組織全体のセキュリティ戦略を策定する'
                    ],
                    relatedResources: [
                        { title: 'IAM ロール：権限ポリシー vs 信頼ポリシー', href: 'security-governance/iam-role-policies-guide.html' },
                        { title: 'SCP構文 完全図解ガイド', href: 'security-governance/scp-syntax-visual-guide.html' },
                        { title: 'IAM パーミッションバウンダリー', href: 'security-governance/iam-permission-boundary-guide.html' },
                        { title: 'GuardDuty ログソース完全ガイド', href: 'security-governance/guardduty-log-sources-guide.html' },
                        { title: 'CloudTrail 整合性検証', href: 'security-governance/cloudtrail-integrity-validation-guide.html' },
                        { title: 'Security Lake ガイド', href: 'security-governance/security-lake-guide.html' }
                    ]
                },
                {
                    id: '1.3',
                    title: '信頼性と耐障害性に優れたアーキテクチャを設計する',
                    knowledge: [
                        'リカバリ時間目標（RTO）とリカバリポイント目標（RPO）',
                        '災害復旧（DR）戦略（パイロットライト、ウォームスタンバイ、アクティブ-アクティブ、バックアップとリストアなど）',
                        'データバックアップと同期の方法',
                        '高可用性アーキテクチャ（マルチAZ、マルチリージョン）',
                        'アプリケーションのフェイルオーバーと回復プロセス'
                    ],
                    skills: [
                        '事業継続性のためのDR戦略を設計する',
                        'RTO/RPO要件を満たすバックアップソリューションを決定する',
                        'マルチリージョンアーキテクチャのフェイルオーバーメカニズムを設計する',
                        'リージョンサービスの可用性と機能の違いを評価する',
                        '自己修復ワークロードのアーキテクチャを設計する'
                    ],
                    relatedResources: [
                        { title: 'DR インフォグラフィック', href: 'migration/aws-dr-infographic.html' },
                        { title: 'グローバルアーキテクチャ完全ガイド', href: 'compute-applications/aws-global-architecture-guide.html' },
                        { title: 'AWS us-east-1 障害分析', href: 'continuous-improvement/aws-us-east-1-outage-analysis.html' },
                        { title: 'Auto Scaling ライフサイクル', href: 'compute-applications/autoscaling-lifecycle-guide.html' },
                        { title: 'Well-Architected 完全ガイド', href: 'security-governance/aws-well-architected-complete-guide.html' }
                    ]
                },
                {
                    id: '1.4',
                    title: 'マルチアカウントAWS環境を設計する',
                    knowledge: [
                        'AWS Organizations の概念（SCPs、タグポリシー、アカウント構造など）',
                        'マルチアカウント戦略のデザインパターン（セキュリティ、ログ記録、共有サービスなど）',
                        'AWS Control Tower と AWS Service Catalog',
                        'リソース共有（AWS RAM、クロスアカウントアクセスなど）',
                        'ランディングゾーンのコンセプト'
                    ],
                    skills: [
                        '特定の要件に対応したマルチアカウント戦略を設計する',
                        '組織単位（OU）とアカウント構造を決定する',
                        'SCP、タグポリシー、およびその他のAWS Organizationsポリシーを適用する',
                        'AWS Control TowerとAWS Landing Zoneを使用してアカウントプロビジョニングを自動化する',
                        'クロスアカウントのリソース共有を設計する'
                    ],
                    relatedResources: [
                        { title: 'Organization & Control Tower', href: 'security-governance/aws-organization-control-tower.html' },
                        { title: 'Control Tower 自動展開 (CfCT)', href: 'organizational-complexity/control-tower-cfct-guide.html' },
                        { title: 'AWS Config × Organizations', href: 'security-governance/aws-config-organizations-guide.html' },
                        { title: 'RAM VPC プレフィックス', href: 'organizational-complexity/aws_ram_vpc_prefix_infographic.html' },
                        { title: 'Security Hub 設定ポリシー', href: 'security-governance/securityhub-configuration-policies-guide.html' },
                        { title: 'sts:ExternalId マスターガイド', href: 'security-governance/sts-externalid-complete-guide.html' }
                    ]
                },
                {
                    id: '1.5',
                    title: 'コスト最適化と可視化の戦略を決定する',
                    knowledge: [
                        'AWSコスト管理ツール（Cost Explorer、AWS Budgets、AWS Cost and Usage Reportなど）',
                        '料金モデル（リザーブドインスタンス、Savings Plans、スポットインスタンスなど）',
                        'タギング戦略とコスト配分',
                        '組織全体のコストモニタリングと配分'
                    ],
                    skills: [
                        'コスト配分とチャージバックのためのタギング戦略を設計する',
                        '組織全体のコストモニタリングと最適化の戦略を決定する',
                        'コスト削減の機会を特定し推奨する',
                        '購入オプション（RI、Savings Plans）を評価する'
                    ],
                    relatedResources: [
                        { title: 'コストツール', href: 'analytics-bigdata/aws-cost-tools.html' },
                        { title: 'Well-Architected 完全ガイド', href: 'security-governance/aws-well-architected-complete-guide.html' }
                    ]
                }
            ]
        },
        {
            id: 'domain2',
            title: '新しいソリューションのための設計',
            weight: 29,
            color: '#10B981', // Green
            icon: '🚀',
            tasks: [
                {
                    id: '2.1',
                    title: 'ビジネス要件を満たすデプロイ戦略を設計する',
                    knowledge: [
                        'Infrastructure as Code (IaC) のオプション（AWS CloudFormation、AWS CDKなど）',
                        'CI/CD パイプラインのデプロイ戦略（ブルー/グリーン、カナリア、ローリングなど）',
                        'マルチリージョンおよびマルチアカウントデプロイ',
                        'デプロイメントターゲット（Amazon EC2、AWS Lambda、コンテナなど）',
                        'アプリケーション設定管理（AWS Systems Manager Parameter Store、AWS Secrets Managerなど）'
                    ],
                    skills: [
                        '目的に合ったデプロイサービスを選択する',
                        '適切なデプロイ戦略を決定する',
                        '組織全体にデプロイを自動化する',
                        'デプロイの変更と障害から回復するメカニズムを設計する'
                    ],
                    relatedResources: [
                        { title: 'ブルー/グリーン vs イミュータブル', href: 'migration/blue-green-vs-immutable-visual-guide.html' },
                        { title: 'CloudFormation インフォグラフィック', href: 'development-deployment/aws-cloudformation-infographic.html' },
                        { title: 'ECS Fargate ローリングデプロイ', href: 'compute-applications/ecs-fargate-rolling-deploy-complete-guide.html' },
                        { title: 'Auto Scaling Instance Refresh', href: 'compute-applications/autoscaling-instance-refresh-guide.html' },
                        { title: 'CodePipeline アクションタイプ', href: 'development-deployment/codepipeline-actions-guide.html' },
                        { title: 'EC2 Image Builder', href: 'continuous-improvement/ec2-image-builder-guide.html' }
                    ]
                },
                {
                    id: '2.2',
                    title: '事業継続性を確保するソリューションを設計する',
                    knowledge: [
                        'AWS グローバルインフラストラクチャ（リージョン、アベイラビリティーゾーン）',
                        '高可用性と耐障害性の設計パターン',
                        'RTO と RPO の概念',
                        'DR 戦略とソリューション'
                    ],
                    skills: [
                        'ビジネス要件に基づいて DR 戦略を選択する',
                        'アプリケーションコンポーネントの高可用性を設計する',
                        '自己修復機能を持つシステムを設計する',
                        'フェイルオーバーメカニズムを実装する'
                    ],
                    relatedResources: [
                        { title: 'DR インフォグラフィック', href: 'migration/aws-dr-infographic.html' },
                        { title: 'グローバルアーキテクチャ完全ガイド', href: 'compute-applications/aws-global-architecture-guide.html' },
                        { title: 'Auto Scaling インフォグラフィック', href: 'compute-applications/auto_scaling_infographic.html' },
                        { title: 'EC2 ステータスチェック', href: 'compute-applications/ec2-status-check-guide.html' }
                    ]
                },
                {
                    id: '2.3',
                    title: '要件に基づいてセキュリティコントロールを決定する',
                    knowledge: [
                        'セキュリティのベストプラクティス',
                        '暗号化オプション（保管時および転送中）',
                        'アイデンティティ・アクセス管理の概念',
                        'ネットワークセキュリティコントロール'
                    ],
                    skills: [
                        'アプリケーションのセキュリティ要件を設計する',
                        '暗号化戦略を決定する',
                        'アクセス制御と認証メカニズムを設計する',
                        'ネットワークセキュリティアーキテクチャを設計する'
                    ],
                    relatedResources: [
                        { title: 'KMS キーの種類', href: 'security-governance/kms-key-types.html' },
                        { title: 'KMS Grants ガイド', href: 'security-governance/kms-grants-guide.html' },
                        { title: 'ALB TLSセキュリティポリシー', href: 'security-governance/alb-tls-security-policy-guide.html' },
                        { title: 'EKS セキュリティ完全図解', href: 'networking/eks-security-visual-guide.html' },
                        { title: 'Nitro Enclaves ガイド', href: 'security-governance/nitro-enclaves-guide.html' }
                    ]
                },
                {
                    id: '2.4',
                    title: '信頼性の要件を満たす戦略を策定する',
                    knowledge: [
                        'AWS Well-Architected Framework の信頼性の柱',
                        '高可用性のためのサービスクォータと制限',
                        'マルチリージョンアーキテクチャ',
                        '疎結合アーキテクチャ'
                    ],
                    skills: [
                        'ワークロードの信頼性要件を特定する',
                        '適切なサービスを選択して可用性を最大化する',
                        '障害から自動的に回復するメカニズムを設計する',
                        '需要の変化に対応するスケーリング戦略を設計する'
                    ],
                    relatedResources: [
                        { title: 'Well-Architected 完全ガイド', href: 'security-governance/aws-well-architected-complete-guide.html' },
                        { title: 'EC2 Auto Recovery', href: 'compute-applications/ec2-auto-recovery-guide.html' },
                        { title: 'Auto Scaling ライフサイクル', href: 'compute-applications/autoscaling-lifecycle-guide.html' },
                        { title: 'SQS DLQ & Redrive', href: 'compute-applications/sqs-dlq-redrive-guide.html' }
                    ]
                },
                {
                    id: '2.5',
                    title: 'パフォーマンス目標を満たすソリューションを設計する',
                    knowledge: [
                        'パフォーマンス最適化のベストプラクティス',
                        'キャッシング戦略',
                        'ストレージパフォーマンスの特性',
                        'コンピューティングリソースのスケーリング'
                    ],
                    skills: [
                        'ワークロードに適したコンピューティングリソースを選択する',
                        'パフォーマンス要件に基づいてストレージソリューションを選択する',
                        'キャッシング戦略を設計する',
                        'ネットワークパフォーマンスを最適化する'
                    ],
                    relatedResources: [
                        { title: 'ElastiCache インフォグラフィック', href: 'storage-database/elasticache_infographic.html' },
                        { title: 'CloudFront キャッシュ', href: 'content-delivery-dns/cloudfront-cache-infographic.html' },
                        { title: 'Warm Pool 運用モード', href: 'compute-applications/warmpool-modes-infographic.html' },
                        { title: 'Jumbo Frame MTU ガイド', href: 'networking/jumbo-frame-mtu-guide.html' },
                        { title: 'EBS FSR インフォグラフィック', href: 'storage-database/aws-ebs-fsr-infographic.html' }
                    ]
                },
                {
                    id: '2.6',
                    title: 'ソリューションの目標と目的を達成するためのコスト最適化戦略を決定する',
                    knowledge: [
                        'AWSの料金モデル',
                        'コスト最適化のベストプラクティス',
                        'サービスの選択がコストに与える影響',
                        'データ転送コスト'
                    ],
                    skills: [
                        'コスト効率の高いストレージオプションを選択する',
                        'コスト効率の高いコンピューティングオプションを選択する',
                        'データ転送コストを最小化する戦略を設計する',
                        '適切な購入オプションを推奨する'
                    ],
                    relatedResources: [
                        { title: 'コストツール', href: 'analytics-bigdata/aws-cost-tools.html' },
                        { title: 'S3 ストレージクラス', href: 'storage-database/s3_storage_classes_infographic.html' },
                        { title: 'EC2 キャパシティ', href: 'compute-applications/aws-ec2-capacity-infographic.html' }
                    ]
                }
            ]
        },
        {
            id: 'domain3',
            title: '既存のソリューションの継続的な改善',
            weight: 25,
            color: '#F59E0B', // Amber
            icon: '🔄',
            tasks: [
                {
                    id: '3.1',
                    title: '全体的な運用上の優秀性を向上させる戦略を決定する',
                    knowledge: [
                        '運用ベストプラクティス（AWS Well-Architected Frameworkの運用上の優秀性の柱）',
                        'インフラストラクチャのコード化（IaC）',
                        'オブザーバビリティ（ロギング、モニタリング、トレーシング）',
                        'インシデント管理と自動修復'
                    ],
                    skills: [
                        '運用プロセスを改善するためにオートメーションを設計する',
                        '包括的なモニタリングとアラートソリューションを設計する',
                        'インシデント対応プロセスを改善する',
                        '運用上の問題を特定して修復するメカニズムを設計する'
                    ],
                    relatedResources: [
                        { title: 'OpsCenter ガイド', href: 'compute-applications/opscenter-guide.html' },
                        { title: 'AWS Config CloudTrail 修復', href: 'security-governance/aws-config-cloudtrail-remediation-guide.html' },
                        { title: 'CloudFormation ドリフト検出', href: 'security-governance/cloudformation-drift-detection-auto-remediation-guide.html' },
                        { title: 'CloudWatch Logs 集中集約', href: 'security-governance/cloudwatch-logs-subscription-guide.html' },
                        { title: 'CloudWatch INSIGHT_RULE_METRIC', href: 'continuous-improvement/cloudwatch-insight-rule-metric-guide.html' }
                    ]
                },
                {
                    id: '3.2',
                    title: 'セキュリティを向上させる戦略を決定する',
                    knowledge: [
                        'セキュリティモニタリングと脅威検出',
                        'インシデントレスポンスのベストプラクティス',
                        'セキュリティ自動化',
                        'コンプライアンスモニタリング'
                    ],
                    skills: [
                        'セキュリティ態勢を継続的に評価する',
                        'セキュリティイベントの検出と対応を自動化する',
                        'セキュリティのベストプラクティスを適用する改善点を特定する',
                        'セキュリティ問題の根本原因分析を実施する'
                    ],
                    relatedResources: [
                        { title: 'VPC Network Access Analyzer', href: 'networking/vpc-network-access-analyzer-guide.html' },
                        { title: 'GuardDuty Credential Exfiltration', href: 'networking/guardduty-credential-exfiltration-guide-v2.html' },
                        { title: 'VPC トラフィックミラーリング', href: 'security-governance/vpc-traffic-mirroring-guide.html' },
                        { title: 'IAM認証情報レポート インシデント', href: 'security-governance/iam-credential-report-incident-guide.html' },
                        { title: 'ECS Exec モニタリング', href: 'security-governance/ecs-exec-monitoring-guide.html' },
                        { title: 'CIS Benchmark Security Hub Config', href: 'security-governance/cis-benchmark-security-hub-config-guide.html' }
                    ]
                },
                {
                    id: '3.3',
                    title: 'パフォーマンスを向上させる戦略を決定する',
                    knowledge: [
                        'パフォーマンスモニタリングとベンチマーキング',
                        'パフォーマンスのボトルネック特定',
                        'スケーリング戦略',
                        'キャッシングとコンテンツ配信'
                    ],
                    skills: [
                        'パフォーマンスのボトルネックを特定する',
                        'パフォーマンスメトリクスを分析して改善点を決定する',
                        'スケーリング戦略を最適化する',
                        'キャッシングソリューションを評価して改善する'
                    ],
                    relatedResources: [
                        { title: 'Jumbo Frame MTU ガイド', href: 'networking/jumbo-frame-mtu-guide.html' },
                        { title: 'EC2 MTU ガイド', href: 'networking/ec2-mtu-guide.html' },
                        { title: 'CloudWatch カスタムメトリクス', href: 'compute-applications/cloudwatch-putmetricdata-guide.html' },
                        { title: 'KMS スロットリング Encryption SDK', href: 'security-governance/kms-throttling-encryption-sdk-guide.html' }
                    ]
                },
                {
                    id: '3.4',
                    title: '信頼性を向上させる戦略を決定する',
                    knowledge: [
                        '障害モード分析',
                        '回復力パターン（サーキットブレーカー、リトライ、べき等性など）',
                        'カオスエンジニアリング',
                        'フェイルオーバーテスト'
                    ],
                    skills: [
                        '障害点を特定して軽減策を設計する',
                        'DR 計画をテストして改善する',
                        '回復力パターンを実装する',
                        'サービスの依存関係と障害の影響を分析する'
                    ],
                    relatedResources: [
                        { title: 'ブレークグラスユーザーガイド', href: 'security-governance/breakglass-user-guide.html' },
                        { title: 'EC2 ステータスチェック', href: 'compute-applications/ec2-status-check-guide.html' },
                        { title: 'AWS us-east-1 障害分析', href: 'continuous-improvement/aws-us-east-1-outage-analysis.html' },
                        { title: 'Well-Architected 完全ガイド', href: 'security-governance/aws-well-architected-complete-guide.html' }
                    ]
                },
                {
                    id: '3.5',
                    title: 'コスト最適化の機会を特定する',
                    knowledge: [
                        'AWSコスト管理ツール',
                        'リソースの使用状況分析',
                        '料金モデルの最適化',
                        '未使用リソースの特定'
                    ],
                    skills: [
                        'コスト最適化の機会を分析する',
                        '未使用または過剰プロビジョニングされたリソースを特定する',
                        '購入オプションを最適化する推奨事項を提供する',
                        'コスト配分とチャージバックのモデルを改善する'
                    ],
                    relatedResources: [
                        { title: 'コストツール', href: 'analytics-bigdata/aws-cost-tools.html' },
                        { title: 'Well-Architected 完全ガイド', href: 'security-governance/aws-well-architected-complete-guide.html' }
                    ]
                }
            ]
        },
        {
            id: 'domain4',
            title: 'ワークロードの移行とモダナイゼーションの加速',
            weight: 20,
            color: '#8B5CF6', // Purple
            icon: '📦',
            tasks: [
                {
                    id: '4.1',
                    title: '移行が可能なワークロードとプロセスを選択する',
                    knowledge: [
                        '移行アセスメント手法',
                        'ワークロードの分類と優先順位付け',
                        '依存関係のマッピング',
                        '移行準備状況の評価'
                    ],
                    skills: [
                        'ワークロードの移行準備状況を評価する',
                        '移行するワークロードの優先順位を決定する',
                        '移行に適した戦略を選択する',
                        'ワークロード間の依存関係を分析する'
                    ],
                    relatedResources: [
                        { title: 'Migration Hub インフォグラフィック', href: 'migration/aws-migration-hub-infographic.html' },
                        { title: 'Migration インフォグラフィック', href: 'migration/aws_migration_infographic.html' },
                        { title: 'Migration サービス', href: 'migration/aws_migration_services_infographic.html' }
                    ]
                },
                {
                    id: '4.2',
                    title: '既存ワークロードの最適な移行アプローチを決定する',
                    knowledge: [
                        '移行戦略（7つのR：Rehost、Replatform、Repurchase、Refactor、Retire、Retain、Relocate）',
                        'AWS移行ツール（AWS MGN、AWS DMS、AWS SCTなど）',
                        'データ移行オプション',
                        '移行テストと検証'
                    ],
                    skills: [
                        '各ワークロードに適した移行戦略を選択する',
                        '移行ツールとサービスを選択する',
                        'データ移行計画を設計する',
                        '移行のテスト戦略を決定する'
                    ],
                    relatedResources: [
                        { title: 'DMS CDC インフォグラフィック', href: 'migration/aws_dms_cdc_infographic.html' },
                        { title: 'SCT & DMS Migration', href: 'migration/aws_sct_dms_migration_infographic.html' },
                        { title: 'AWS リロケーション・ガイド', href: 'migration/aws_relocate_guide.html' },
                        { title: 'Systems Manager ハイブリッド', href: 'continuous-improvement/systems-manager-hybrid-guide.html' }
                    ]
                },
                {
                    id: '4.3',
                    title: '既存ワークロードの新しいアーキテクチャを決定する',
                    knowledge: [
                        'モダナイゼーションパターン',
                        'コンテナ化とオーケストレーション',
                        'サーバーレスアーキテクチャ',
                        'マイクロサービスへの分解'
                    ],
                    skills: [
                        'ワークロードをコンテナ化するかサーバーレスにするかを評価する',
                        'モノリシックアプリケーションをマイクロサービスに分解する戦略を設計する',
                        'データベースのモダナイゼーション戦略を決定する',
                        'アプリケーションのリファクタリング範囲を決定する'
                    ],
                    relatedResources: [
                        { title: 'ECS インフォグラフィック', href: 'compute-applications/aws_ecs_infographic.html' },
                        { title: 'Lambda メトリクス', href: 'compute-applications/aws-lambda-metrics-perfect.html' },
                        { title: 'AppSync インフォグラフィック', href: 'development-deployment/aws_appsync_infographic.html' },
                        { title: 'DR インフォグラフィック', href: 'migration/aws-dr-infographic.html' }
                    ]
                },
                {
                    id: '4.4',
                    title: 'モダナイゼーションとエンハンスメントの機会を決定する',
                    knowledge: [
                        'AWSマネージドサービスへの移行',
                        'サーバーレス移行パターン',
                        'コンテナオーケストレーションオプション',
                        'データベースモダナイゼーション'
                    ],
                    skills: [
                        'マネージドサービスへの移行機会を特定する',
                        'サーバーレス化の候補を評価する',
                        'コンテナ化による利点を分析する',
                        '段階的なモダナイゼーション計画を策定する'
                    ],
                    relatedResources: [
                        { title: 'ブルー/グリーン vs イミュータブル', href: 'migration/blue-green-vs-immutable-visual-guide.html' },
                        { title: 'ECS Fargate ローリングデプロイ', href: 'compute-applications/ecs-fargate-rolling-deploy-complete-guide.html' },
                        { title: 'EventBridge インフォグラフィック', href: 'development-deployment/aws-eventbridge-infographic.html' },
                        { title: 'Kinesis Firehose', href: 'analytics-bigdata/kinesis_firehose_infographic.html' }
                    ]
                }
            ]
        }
    ]
};

/**
 * 試験ガイドデータのヘルパー関数
 */

/**
 * ドメインIDからドメイン情報を取得
 * @param {string} domainId - ドメインID (例: 'domain1')
 * @returns {Object|null} ドメインオブジェクト
 */
function getExamDomainById(domainId) {
    return examGuideData.domains.find(d => d.id === domainId) || null;
}

/**
 * タスクIDからタスク情報を取得
 * @param {string} taskId - タスクID (例: '1.1')
 * @returns {Object|null} {domain, task} オブジェクト
 */
function getExamTaskById(taskId) {
    for (const domain of examGuideData.domains) {
        const task = domain.tasks.find(t => t.id === taskId);
        if (task) {
            return { domain, task };
        }
    }
    return null;
}

/**
 * 全ドメインの合計タスク数を取得
 * @returns {number} 全タスク数
 */
function getTotalTaskCount() {
    return examGuideData.domains.reduce((sum, domain) => sum + domain.tasks.length, 0);
}

/**
 * 特定のリソースパスに関連するタスクを取得
 * @param {string} resourcePath - リソースのパス
 * @returns {Array<{domain: Object, task: Object}>} 関連タスクの配列
 */
function getTasksForResource(resourcePath) {
    const results = [];
    for (const domain of examGuideData.domains) {
        for (const task of domain.tasks) {
            const hasResource = task.relatedResources.some(r => r.href === resourcePath);
            if (hasResource) {
                results.push({ domain, task });
            }
        }
    }
    return results;
}
