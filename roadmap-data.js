/**
 * AWS SAP学習リソース - ロードマップ機能 データ定義
 * 経験レベル別の4週間学習プランを提供
 */

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
