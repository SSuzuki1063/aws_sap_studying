/**
 * AWS SAP学習リソース - ロードマップ機能 データ定義
 * 経験レベル別の4週間学習プランを提供
 * SAP-C02試験ドメイン対応
 */

/**
 * SAP-C02試験ドメイン定義
 * @type {Object.<string, {id: string, title: string, weight: number, color: string, icon: string, tasks: Array<{id: string, title: string}>}>}
 */
const examDomains = {
    domain1: {
        id: 'domain1',
        title: '複雑な組織に対応するソリューションの設計',
        weight: 26,
        color: '#3B82F6', // Blue
        icon: '🏢',
        tasks: [
            { id: '1.1', title: 'ネットワーク接続戦略を設計する' },
            { id: '1.2', title: 'セキュリティコントロールを規定する' },
            { id: '1.3', title: '信頼性と耐障害性に優れたアーキテクチャを設計する' },
            { id: '1.4', title: 'マルチアカウントAWS環境を設計する' },
            { id: '1.5', title: 'コスト最適化と可視化の戦略を決定する' }
        ]
    },
    domain2: {
        id: 'domain2',
        title: '新しいソリューションのための設計',
        weight: 29,
        color: '#10B981', // Green
        icon: '🚀',
        tasks: [
            { id: '2.1', title: 'ビジネス要件を満たすデプロイ戦略を設計する' },
            { id: '2.2', title: 'ビジネス要件を満たすコスト最適化・パフォーマンス戦略を設計する' },
            { id: '2.3', title: 'ソリューションの信頼性を確保する戦略を決定する' },
            { id: '2.4', title: 'ソリューションのセキュリティ要件と戦略を決定する' },
            { id: '2.5', title: 'アプリケーション設計戦略を決定する' },
            { id: '2.6', title: 'データベース戦略を決定する' }
        ]
    },
    domain3: {
        id: 'domain3',
        title: '既存ソリューションの継続的な改善',
        weight: 25,
        color: '#F59E0B', // Amber
        icon: '🔄',
        tasks: [
            { id: '3.1', title: '全体的な運用上の優秀性を向上させる戦略を決定する' },
            { id: '3.2', title: 'セキュリティを向上させる戦略を決定する' },
            { id: '3.3', title: 'パフォーマンスを向上させる戦略を決定する' },
            { id: '3.4', title: '信頼性を向上させる戦略を決定する' },
            { id: '3.5', title: 'コスト最適化の機会を特定する' }
        ]
    },
    domain4: {
        id: 'domain4',
        title: 'ワークロードの移行とモダナイゼーション',
        weight: 20,
        color: '#8B5CF6', // Purple
        icon: '📦',
        tasks: [
            { id: '4.1', title: '移行が可能なワークロードとプロセスを選択する' },
            { id: '4.2', title: '既存ワークロードの最適な移行アプローチを決定する' },
            { id: '4.3', title: '既存ワークロードの新しいアーキテクチャを決定する' },
            { id: '4.4', title: 'モダナイゼーションとエンハンスメントの機会を決定する' }
        ]
    }
};

/**
 * 難易度レベル定義
 * @type {Array<{id: string, title: string, description: string, weeklyHours: number, icon: string}>}
 */
const roadmapLevels = [
    {
        id: 'beginner',
        title: 'AWS経験 0〜1年',
        description: '基礎から着実に学習。VPC・IAM・EC2の土台を固めてから応用へ進みます。',
        weeklyHours: 5,
        icon: '🌱',
        color: '#10B981' // Green
    },
    {
        id: 'intermediate',
        title: 'AWS経験 1〜3年',
        description: '実務経験を活かしながら、試験重点分野を効率的にカバーします。',
        weeklyHours: 8,
        icon: '🌿',
        color: '#3B82F6' // Blue
    },
    {
        id: 'advanced',
        title: 'AWS経験 3年以上',
        description: 'ベストプラクティスと最新サービスを重点的に学習。弱点補強に集中します。',
        weeklyHours: 10,
        icon: '🌳',
        color: '#8B5CF6' // Purple
    }
];

/**
 * ファイル名パターンから難易度を自動判定
 * @param {string} filename - ファイル名（パス含む）
 * @returns {{level: string, estimatedMinutes: number}}
 */
function classifyResourceDifficulty(filename) {
    // Infographic系 → 初心者向け（15分）
    if (filename.includes('-infographic') || filename.includes('_infographic')) {
        return { level: 'beginner', estimatedMinutes: 15 };
    }

    // Analysis/Troubleshooting系 → 上級者向け（45分）
    if (filename.includes('-analysis') || filename.includes('-troubleshooting')) {
        return { level: 'advanced', estimatedMinutes: 45 };
    }

    // Complete-guide系 → 中級者向け（35分）
    if (filename.includes('-complete-guide')) {
        return { level: 'intermediate', estimatedMinutes: 35 };
    }

    // Guide系 → 中級者向け（30分）
    if (filename.includes('-guide') || filename.includes('_guide')) {
        return { level: 'intermediate', estimatedMinutes: 30 };
    }

    // その他 → 中級者向け（25分）
    return { level: 'intermediate', estimatedMinutes: 25 };
}

/**
 * 週別学習プラン
 * 各レベルに対して4週間の学習計画を定義
 */
const weeklyPlans = {
    beginner: [
        {
            week: 1,
            title: '基礎固め週',
            theme: 'VPC・IAM・EC2の基礎',
            description: 'AWSの3大基礎サービスを図解で理解します',
            quizCategory: 'networking',
            learningObjectives: {
                purpose: 'AWSにおけるネットワーク・認証・コンピューティングの基礎を理解する',
                objectives: [
                    'VPCの構造と各コンポーネント（サブネット、ルートテーブル、IGW）が果たす役割を説明できる',
                    'IAMの認証・認可モデルとポリシー構造を理解する',
                    'EC2インスタンスのライフサイクルとステータスチェックを理解する'
                ]
            },
            domainFocus: {
                primary: 'domain1',
                tasks: ['1.1', '1.2'],
                coverage: { domain1: 50, domain2: 35, domain3: 10, domain4: 5 }
            },
            resources: [
                // VPC基礎
                'networking/aws-eni-infographic.html',
                'new-solutions/aws_eip_nat_infographic.html',
                'networking/nacl-sg-comparison-guide.html',
                // IAM基礎
                'security-governance/aws-cognito-infographic.html',
                'security-governance/iam-role-policies-guide.html',
                'security-governance/aws-login-users-guide.html',
                // EC2基礎
                'compute-applications/aws-ec2-capacity-infographic.html',
                'compute-applications/ec2-status-check-guide.html'
            ]
        },
        {
            week: 2,
            title: 'ネットワーク深堀り週',
            theme: 'Direct Connect・Transit Gateway・VPN',
            description: 'ハイブリッドネットワークの構成パターンを学びます',
            quizCategory: 'networking',
            learningObjectives: {
                purpose: 'オンプレミスとAWSを接続するハイブリッドネットワークアーキテクチャを習得する',
                objectives: [
                    'Direct ConnectとVPNの違いと使い分けを説明できる',
                    'Transit Gatewayを使った複数VPC・複数リージョンの接続パターンを理解する',
                    'VPN over Direct Connectの冗長化構成を設計できる'
                ]
            },
            domainFocus: {
                primary: 'domain1',
                tasks: ['1.1', '1.3'],
                coverage: { domain1: 70, domain2: 20, domain3: 5, domain4: 5 }
            },
            resources: [
                'networking/aws-direct-connect-guide.html',
                'networking/aws-vpn-with-direct-connect-guide.html',
                'networking/aws-gateways.html',
                'networking/transit-gateway-deep-dive.html',
                'new-solutions/vpn-vs-privatelink.html',
                'new-solutions/vpc_privatelink_cidr_overlap.html'
            ]
        },
        {
            week: 3,
            title: 'セキュリティ基礎週',
            theme: 'KMS・CloudTrail・GuardDuty',
            description: 'セキュリティサービスの基本を押さえます',
            quizCategory: 'security-governance',
            learningObjectives: {
                purpose: 'AWSのセキュリティサービスの役割と基本的な設定方法を理解する',
                objectives: [
                    'KMSの鍵タイプ（CMK、AWS管理キー）と暗号化方式を説明できる',
                    'CloudTrailのイベント種別と監査ログの保管方法を理解する',
                    'GuardDutyの検知ソースと脅威検出の仕組みを理解する'
                ]
            },
            domainFocus: {
                primary: 'domain1',
                tasks: ['1.2', '3.2'],
                coverage: { domain1: 45, domain2: 25, domain3: 25, domain4: 5 }
            },
            resources: [
                'security-governance/aws_cmk_infographic.html',
                'security-governance/kms-key-types.html',
                'security-governance/cloudtrail-events-guide.html',
                'security-governance/guardduty-log-sources-guide.html',
                'continuous-improvement/aws_waf_infographic.html',
                'security-governance/aws-monitoring-guide.html'
            ]
        },
        {
            week: 4,
            title: '総仕上げ週',
            theme: 'Auto Scaling・デプロイ・DR',
            description: '運用系サービスを学んで総復習します',
            quizCategory: null,
            learningObjectives: {
                purpose: '可用性と信頼性を担保する運用系サービスを理解し、4週間の学習を総復習する',
                objectives: [
                    'Auto Scalingのポリシーとライフサイクルフックを設定できる',
                    'CloudFormationによるインフラのコード化（IaC）を理解する',
                    'DRの4戦略（Backup、Pilot Light、Warm Standby、Multi-Site）を説明できる'
                ]
            },
            domainFocus: {
                primary: 'domain2',
                tasks: ['2.1', '2.3', '1.3'],
                coverage: { domain1: 25, domain2: 40, domain3: 20, domain4: 15 }
            },
            resources: [
                'compute-applications/auto_scaling_infographic.html',
                'compute-applications/autoscaling-lifecycle-guide.html',
                'development-deployment/aws-cloudformation-infographic.html',
                'migration/aws-dr-infographic.html',
                'migration/blue-green-vs-immutable-visual-guide.html'
            ]
        }
    ],
    intermediate: [
        {
            week: 1,
            title: 'ネットワーク集中週',
            theme: '高度なネットワーク設計',
            description: 'Transit Gateway・Cloud WAN・BGPルーティングを深堀りします',
            quizCategory: 'networking',
            learningObjectives: {
                purpose: 'エンタープライズ規模のネットワークアーキテクチャを設計できるようになる',
                objectives: [
                    'Transit Gatewayのルートテーブルとアタッチメントの設計パターンを説明できる',
                    'BGPルーティングとAS-PATH prepending等の制御手法を理解する',
                    'MTU/Jumbo Frameの最適化とパフォーマンスへの影響を説明できる'
                ]
            },
            domainFocus: {
                primary: 'domain1',
                tasks: ['1.1', '1.3', '1.4'],
                coverage: { domain1: 65, domain2: 15, domain3: 15, domain4: 5 }
            },
            resources: [
                'networking/transit-gateway-deep-dive.html',
                'networking/transit-gateway-peering-guide.html',
                'networking/cloud-wan-attachment-policy-guide.html',
                'networking/direct-connect-bgp-routing-guide.html',
                'networking/cidr-aggregation-prefix-list-guide.html',
                'networking/vpc-network-access-analyzer-guide.html',
                'networking/jumbo-frame-mtu-guide.html'
            ]
        },
        {
            week: 2,
            title: 'セキュリティ深堀り週',
            theme: 'IAM高度設定・監視・暗号化',
            description: 'ABAC・Permissions Boundary・KMS Grantsなど高度なセキュリティ設定',
            quizCategory: 'security-governance',
            learningObjectives: {
                purpose: '大規模環境でのアクセス制御と暗号化の高度なパターンを習得する',
                objectives: [
                    'ABACとRBACの違いを理解し、タグベースのアクセス制御を設計できる',
                    'Permissions BoundaryとSCPの組み合わせによる権限委譲を説明できる',
                    'KMS Grantsを使った細粒度の暗号鍵アクセス制御を実装できる'
                ]
            },
            domainFocus: {
                primary: 'domain1',
                tasks: ['1.2', '1.4', '2.4'],
                coverage: { domain1: 50, domain2: 25, domain3: 20, domain4: 5 }
            },
            resources: [
                'security-governance/abac-principaltag-resourcetag-guide.html',
                'security-governance/iam-permission-boundary-guide.html',
                'security-governance/kms-grants-guide.html',
                'security-governance/kms-throttling-encryption-sdk-guide.html',
                'security-governance/cloudtrail-integrity-validation-guide.html',
                'security-governance/security-lake-guide.html',
                'security-governance/sts-externalid-complete-guide.html'
            ]
        },
        {
            week: 3,
            title: 'コンピュート・運用週',
            theme: 'Auto Scaling高度設定・ECS/EKS',
            description: 'ライフサイクルフック・Warm Pool・コンテナセキュリティを学びます',
            quizCategory: 'compute-applications',
            learningObjectives: {
                purpose: '高可用性コンピュート環境の構築とコンテナワークロードの運用を習得する',
                objectives: [
                    'Auto Scalingのライフサイクルフックとカスタムアクションを実装できる',
                    'Warm PoolとInstance Refreshによるデプロイ戦略を説明できる',
                    'ECS/EKSのセキュリティベストプラクティスとGuardDuty連携を理解する'
                ]
            },
            domainFocus: {
                primary: 'domain2',
                tasks: ['2.1', '2.3', '2.5', '3.2'],
                coverage: { domain1: 15, domain2: 40, domain3: 35, domain4: 10 }
            },
            resources: [
                'compute-applications/autoscaling-lifecycle-guide.html',
                'compute-applications/warmpool-modes-infographic.html',
                'compute-applications/autoscaling-instance-refresh-guide.html',
                'compute-applications/ecs-fargate-rolling-deploy-complete-guide.html',
                'networking/eks-security-visual-guide.html',
                'security-governance/guardduty-eks-protection-guide.html',
                'security-governance/ecs-exec-monitoring-guide.html'
            ]
        },
        {
            week: 4,
            title: '組織・ガバナンス週',
            theme: 'Organizations・Control Tower・Config',
            description: 'マルチアカウント戦略とガバナンスの全体像を把握します',
            quizCategory: 'security-governance',
            learningObjectives: {
                purpose: 'エンタープライズのマルチアカウント戦略とガバナンス体制を設計できるようになる',
                objectives: [
                    'AWS Organizationsの組織単位(OU)設計とSCPの適用パターンを説明できる',
                    'Control TowerとCfCTによるアカウントファクトリーを理解する',
                    'AWS Configルールの組織展開とConformance Packを実装できる'
                ]
            },
            domainFocus: {
                primary: 'domain1',
                tasks: ['1.4', '3.1', '3.2'],
                coverage: { domain1: 55, domain2: 15, domain3: 25, domain4: 5 }
            },
            resources: [
                'security-governance/aws-organization-control-tower.html',
                'organizational-complexity/control-tower-cfct-guide.html',
                'security-governance/scp-syntax-visual-guide.html',
                'security-governance/aws-config-organizations-guide.html',
                'security-governance/aws-config-conformance-stacksets-guide.html',
                'security-governance/securityhub-configuration-policies-guide.html',
                'security-governance/aws-well-architected-complete-guide.html'
            ]
        }
    ],
    advanced: [
        {
            week: 1,
            title: '高度ネットワーク設計週',
            theme: 'エンタープライズネットワーク',
            description: 'BGP・MTU最適化・複雑なハイブリッド構成を理解します',
            quizCategory: 'networking',
            learningObjectives: {
                purpose: '大規模エンタープライズ向けの高度なネットワーク設計と最適化手法を習得する',
                objectives: [
                    'BGPの高度なルーティング制御（MED、Local Preference、AS-PATH）を設計できる',
                    'MTU/MSS最適化とパスMTU Discoveryの問題を診断・解決できる',
                    'VPCエンドポイントポリシーを使った細粒度のアクセス制御を実装できる'
                ]
            },
            domainFocus: {
                primary: 'domain1',
                tasks: ['1.1', '1.3', '3.3'],
                coverage: { domain1: 60, domain2: 15, domain3: 20, domain4: 5 }
            },
            resources: [
                'networking/direct-connect-bgp-routing-guide.html',
                'networking/jumbo-frame-mtu-guide.html',
                'networking/ec2-mtu-guide.html',
                'networking/cidr-aggregation-prefix-list-guide.html',
                'networking/cloud-wan-attachment-policy-guide.html',
                'networking/vpc-network-access-analyzer-guide.html',
                'networking/s3-vpc-endpoint-policy-guide.html'
            ]
        },
        {
            week: 2,
            title: 'セキュリティアーキテクチャ週',
            theme: '高度なセキュリティ設計',
            description: 'Security Lake・Nitro Enclaves・フォレンジック対応を学びます',
            quizCategory: 'security-governance',
            learningObjectives: {
                purpose: 'セキュリティインシデント対応とデータ保護の高度なアーキテクチャを習得する',
                objectives: [
                    'Security Lakeを使ったセキュリティデータレイクの設計を理解する',
                    'Nitro Enclavesによる機密データ処理のアーキテクチャを説明できる',
                    'インシデント発生時のフォレンジック調査手順とBreak Glass対応を実行できる'
                ]
            },
            domainFocus: {
                primary: 'domain3',
                tasks: ['1.2', '3.2', '3.4'],
                coverage: { domain1: 30, domain2: 20, domain3: 45, domain4: 5 }
            },
            resources: [
                'security-governance/security-lake-guide.html',
                'security-governance/nitro-enclaves-guide.html',
                'networking/guardduty-credential-exfiltration-guide-v2.html',
                'security-governance/iam-credential-report-incident-guide.html',
                'security-governance/vpc-traffic-mirroring-guide.html',
                'security-governance/cloudtrail-integrity-validation-guide.html',
                'security-governance/breakglass-user-guide.html'
            ]
        },
        {
            week: 3,
            title: '大規模運用週',
            theme: 'スケーラブルな運用自動化',
            description: 'Config修復・OpsCenter・Image Builder等の運用自動化を深堀りします',
            quizCategory: 'compute-applications',
            learningObjectives: {
                purpose: '大規模環境での運用自動化と障害対応の仕組みを構築できるようになる',
                objectives: [
                    'AWS Configルールと自動修復アクションを設計・実装できる',
                    'Systems Manager OpsCenterを使った運用イベント管理を理解する',
                    'EC2 Image Builderによる標準AMIパイプラインを構築できる'
                ]
            },
            domainFocus: {
                primary: 'domain3',
                tasks: ['3.1', '3.4', '4.2'],
                coverage: { domain1: 15, domain2: 15, domain3: 55, domain4: 15 }
            },
            resources: [
                'security-governance/aws-config-cloudtrail-remediation-guide.html',
                'security-governance/cloudformation-drift-detection-auto-remediation-guide.html',
                'compute-applications/opscenter-guide.html',
                'continuous-improvement/ec2-image-builder-guide.html',
                'continuous-improvement/systems-manager-hybrid-guide.html',
                'continuous-improvement/cloudwatch-insight-rule-metric-guide.html',
                'continuous-improvement/aws-us-east-1-outage-analysis.html'
            ]
        },
        {
            week: 4,
            title: '試験対策総仕上げ週',
            theme: 'Well-Architectedと弱点補強',
            description: '試験頻出の複合シナリオと設計原則を総復習します',
            quizCategory: null,
            learningObjectives: {
                purpose: 'Well-Architectedフレームワークを軸に全ドメインの知識を統合し、試験に備える',
                objectives: [
                    'Well-Architectedの6つの柱と設計原則を試験問題に適用できる',
                    'グローバルアーキテクチャとマルチリージョン設計パターンを説明できる',
                    '複合シナリオ問題で適切なサービス選択と設計判断ができる'
                ]
            },
            domainFocus: {
                primary: 'domain2',
                tasks: ['1.3', '2.3', '2.5', '4.4'],
                coverage: { domain1: 25, domain2: 35, domain3: 20, domain4: 20 }
            },
            resources: [
                'security-governance/aws-well-architected-complete-guide.html',
                'compute-applications/aws-global-architecture-guide.html',
                'security-governance/iam-identity-center-comparison-guide.html',
                'security-governance/amazon-q-business-access-guardrails-guide.html',
                'content-delivery-dns/osi-aws-services-guide.html',
                'migration/blue-green-vs-immutable-visual-guide.html'
            ]
        }
    ]
};

/**
 * リソースと試験ドメインのマッピング
 * 各リソースがどのドメイン・タスクに対応するかを定義
 * @type {Object.<string, {domains: string[], tasks: string[]}>}
 */
const resourceDomainMapping = {
    // === ネットワーキング系 ===
    'networking/aws-eni-infographic.html': {
        domains: ['domain1'],
        tasks: ['1.1']
    },
    'networking/nacl-sg-comparison-guide.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.1', '1.2', '2.4']
    },
    'networking/aws-direct-connect-guide.html': {
        domains: ['domain1'],
        tasks: ['1.1']
    },
    'networking/aws-vpn-with-direct-connect-guide.html': {
        domains: ['domain1'],
        tasks: ['1.1', '1.3']
    },
    'networking/aws-gateways.html': {
        domains: ['domain1'],
        tasks: ['1.1']
    },
    'networking/transit-gateway-deep-dive.html': {
        domains: ['domain1'],
        tasks: ['1.1', '1.4']
    },
    'networking/transit-gateway-peering-guide.html': {
        domains: ['domain1'],
        tasks: ['1.1', '1.4']
    },
    'networking/cloud-wan-attachment-policy-guide.html': {
        domains: ['domain1'],
        tasks: ['1.1', '1.4']
    },
    'networking/direct-connect-bgp-routing-guide.html': {
        domains: ['domain1'],
        tasks: ['1.1', '1.3']
    },
    'networking/cidr-aggregation-prefix-list-guide.html': {
        domains: ['domain1'],
        tasks: ['1.1']
    },
    'networking/vpc-network-access-analyzer-guide.html': {
        domains: ['domain1', 'domain3'],
        tasks: ['1.1', '1.2', '3.2']
    },
    'networking/jumbo-frame-mtu-guide.html': {
        domains: ['domain1', 'domain3'],
        tasks: ['1.1', '3.3']
    },
    'networking/ec2-mtu-guide.html': {
        domains: ['domain1', 'domain3'],
        tasks: ['1.1', '3.3']
    },
    'networking/s3-vpc-endpoint-policy-guide.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.1', '1.2', '2.4']
    },
    'networking/eks-security-visual-guide.html': {
        domains: ['domain2', 'domain3'],
        tasks: ['2.4', '2.5', '3.2']
    },
    'networking/guardduty-credential-exfiltration-guide-v2.html': {
        domains: ['domain3'],
        tasks: ['3.2']
    },

    // === new-solutions ===
    'new-solutions/aws_eip_nat_infographic.html': {
        domains: ['domain1'],
        tasks: ['1.1']
    },
    'new-solutions/vpn-vs-privatelink.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.1', '2.4']
    },
    'new-solutions/vpc_privatelink_cidr_overlap.html': {
        domains: ['domain1'],
        tasks: ['1.1']
    },

    // === セキュリティ・ガバナンス系 ===
    'security-governance/aws-cognito-infographic.html': {
        domains: ['domain2'],
        tasks: ['2.4']
    },
    'security-governance/iam-role-policies-guide.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.2', '2.4']
    },
    'security-governance/aws-login-users-guide.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.2', '1.4', '2.4']
    },
    'security-governance/aws_cmk_infographic.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.2', '2.4']
    },
    'security-governance/kms-key-types.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.2', '2.4']
    },
    'security-governance/cloudtrail-events-guide.html': {
        domains: ['domain1', 'domain3'],
        tasks: ['1.2', '3.1', '3.2']
    },
    'security-governance/guardduty-log-sources-guide.html': {
        domains: ['domain3'],
        tasks: ['3.2']
    },
    'security-governance/aws-monitoring-guide.html': {
        domains: ['domain3'],
        tasks: ['3.1', '3.2']
    },
    'security-governance/abac-principaltag-resourcetag-guide.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.2', '2.4']
    },
    'security-governance/iam-permission-boundary-guide.html': {
        domains: ['domain1'],
        tasks: ['1.2', '1.4']
    },
    'security-governance/kms-grants-guide.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.2', '2.4']
    },
    'security-governance/kms-throttling-encryption-sdk-guide.html': {
        domains: ['domain2', 'domain3'],
        tasks: ['2.4', '3.3']
    },
    'security-governance/cloudtrail-integrity-validation-guide.html': {
        domains: ['domain1', 'domain3'],
        tasks: ['1.2', '3.2']
    },
    'security-governance/security-lake-guide.html': {
        domains: ['domain1', 'domain3'],
        tasks: ['1.2', '1.4', '3.2']
    },
    'security-governance/sts-externalid-complete-guide.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.2', '1.4', '2.4']
    },
    'security-governance/guardduty-eks-protection-guide.html': {
        domains: ['domain3'],
        tasks: ['3.2']
    },
    'security-governance/ecs-exec-monitoring-guide.html': {
        domains: ['domain3'],
        tasks: ['3.1', '3.2']
    },
    'security-governance/aws-organization-control-tower.html': {
        domains: ['domain1'],
        tasks: ['1.4']
    },
    'security-governance/scp-syntax-visual-guide.html': {
        domains: ['domain1'],
        tasks: ['1.2', '1.4']
    },
    'security-governance/aws-config-organizations-guide.html': {
        domains: ['domain1', 'domain3'],
        tasks: ['1.4', '3.1', '3.2']
    },
    'security-governance/aws-config-conformance-stacksets-guide.html': {
        domains: ['domain1', 'domain3'],
        tasks: ['1.4', '3.1']
    },
    'security-governance/securityhub-configuration-policies-guide.html': {
        domains: ['domain1', 'domain3'],
        tasks: ['1.4', '3.2']
    },
    'security-governance/aws-well-architected-complete-guide.html': {
        domains: ['domain1', 'domain2', 'domain3'],
        tasks: ['1.3', '1.5', '2.2', '2.3', '3.1', '3.4', '3.5']
    },
    'security-governance/nitro-enclaves-guide.html': {
        domains: ['domain2'],
        tasks: ['2.4']
    },
    'security-governance/iam-credential-report-incident-guide.html': {
        domains: ['domain3'],
        tasks: ['3.2']
    },
    'security-governance/vpc-traffic-mirroring-guide.html': {
        domains: ['domain1', 'domain3'],
        tasks: ['1.2', '3.2']
    },
    'security-governance/breakglass-user-guide.html': {
        domains: ['domain1', 'domain3'],
        tasks: ['1.2', '3.4']
    },
    'security-governance/aws-config-cloudtrail-remediation-guide.html': {
        domains: ['domain3'],
        tasks: ['3.1', '3.2']
    },
    'security-governance/cloudformation-drift-detection-auto-remediation-guide.html': {
        domains: ['domain3'],
        tasks: ['3.1', '3.4']
    },
    'security-governance/iam-identity-center-comparison-guide.html': {
        domains: ['domain1'],
        tasks: ['1.2', '1.4']
    },
    'security-governance/amazon-q-business-access-guardrails-guide.html': {
        domains: ['domain2'],
        tasks: ['2.4', '2.5']
    },

    // === コンピュート・アプリケーション系 ===
    'compute-applications/aws-ec2-capacity-infographic.html': {
        domains: ['domain2'],
        tasks: ['2.2', '2.3']
    },
    'compute-applications/ec2-status-check-guide.html': {
        domains: ['domain2', 'domain3'],
        tasks: ['2.3', '3.4']
    },
    'compute-applications/auto_scaling_infographic.html': {
        domains: ['domain2', 'domain3'],
        tasks: ['2.2', '2.3', '3.3', '3.4']
    },
    'compute-applications/autoscaling-lifecycle-guide.html': {
        domains: ['domain2', 'domain3'],
        tasks: ['2.1', '2.3', '3.3', '3.4']
    },
    'compute-applications/warmpool-modes-infographic.html': {
        domains: ['domain2', 'domain3'],
        tasks: ['2.2', '3.3']
    },
    'compute-applications/autoscaling-instance-refresh-guide.html': {
        domains: ['domain2', 'domain3'],
        tasks: ['2.1', '3.1']
    },
    'compute-applications/ecs-fargate-rolling-deploy-complete-guide.html': {
        domains: ['domain2', 'domain4'],
        tasks: ['2.1', '2.5', '4.4']
    },
    'compute-applications/opscenter-guide.html': {
        domains: ['domain3'],
        tasks: ['3.1']
    },
    'compute-applications/aws-global-architecture-guide.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.3', '2.3']
    },

    // === 開発・デプロイ系 ===
    'development-deployment/aws-cloudformation-infographic.html': {
        domains: ['domain2', 'domain3'],
        tasks: ['2.1', '3.1']
    },

    // === 移行系 ===
    'migration/aws-dr-infographic.html': {
        domains: ['domain1', 'domain4'],
        tasks: ['1.3', '4.2', '4.3']
    },
    'migration/blue-green-vs-immutable-visual-guide.html': {
        domains: ['domain2', 'domain4'],
        tasks: ['2.1', '4.4']
    },

    // === 継続的改善系 ===
    'continuous-improvement/aws_waf_infographic.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.2', '2.4']
    },
    'continuous-improvement/ec2-image-builder-guide.html': {
        domains: ['domain2', 'domain3'],
        tasks: ['2.1', '3.1']
    },
    'continuous-improvement/systems-manager-hybrid-guide.html': {
        domains: ['domain3', 'domain4'],
        tasks: ['3.1', '4.2']
    },
    'continuous-improvement/cloudwatch-insight-rule-metric-guide.html': {
        domains: ['domain3'],
        tasks: ['3.1', '3.3']
    },
    'continuous-improvement/aws-us-east-1-outage-analysis.html': {
        domains: ['domain1', 'domain3'],
        tasks: ['1.3', '3.4']
    },

    // === 組織・複雑さ系 ===
    'organizational-complexity/control-tower-cfct-guide.html': {
        domains: ['domain1'],
        tasks: ['1.4']
    },

    // === コンテンツ配信・DNS系 ===
    'content-delivery-dns/osi-aws-services-guide.html': {
        domains: ['domain1', 'domain2'],
        tasks: ['1.1', '2.5']
    }
};

/**
 * 全リソースのメタデータ（level, estimatedMinutes）を生成
 * data.jsとindex.jsの更新用ヘルパー
 * @param {Array} categoriesData - data.jsのcategoriesData
 * @returns {Map<string, {level: string, estimatedMinutes: number}>}
 */
function generateResourceMetadata(categoriesData) {
    const metadata = new Map();

    categoriesData.forEach(category => {
        category.sections.forEach(section => {
            section.resources.forEach(resource => {
                const classification = classifyResourceDifficulty(resource.href);
                metadata.set(resource.href, classification);
            });
        });
    });

    return metadata;
}
