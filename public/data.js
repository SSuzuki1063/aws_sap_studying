// AWS SAP学習リソース - データ定義ファイル (自動生成)
// このファイルは scripts/generate-data.mjs により自動生成されます
// 手動編集しないでください

const categoriesData = [
  {
    id: 'networking',
    title: 'ネットワーキング',
    icon: '🌐',
    count: 92,
    sections: [
      {
        title: 'Direct Connect & ハイブリッドネットワーク',
        icon: '🔗',
        count: 20,
        lastUpdated: '2026-03-28',
        resources: [
          {
            title: 'AWS Direct Connect 専用接続 vs ホスト型接続を高速道路で理解しよう',
            href: 'networking/aws-direct-connect-guide.html',
            priority: 'high',
            service: 'Direct Connect',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'comparison'
            ],
            summary: 'DX専用/ホスト型接続の違いを高速道路の例で図解'
          },
          {
            title: 'AWS VPN接続を郵便システムで理解しよう + Direct Connect比較',
            href: 'networking/aws-vpn-with-direct-connect-guide.html',
            priority: 'high',
            service: 'Direct Connect',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 30,
            tags: [
              'ha'
            ],
            summary: 'VPN接続とDirect Connectの仕組み・使い分けを比較解説'
          },
          {
            title: 'BFD完全ガイド - AWS Direct Connectのフェイルオーバー時間を劇的に短縮',
            href: 'networking/bfd-failover-optimization-guide.html',
            priority: 'low',
            service: 'Direct Connect',
            exam_domains: [
              1,
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'ha'
            ]
          },
          {
            title: 'AWS Direct Connect ルーティングポリシーと BGP コミュニティ完全ガイド',
            href: 'networking/direct-connect-bgp-routing-guide.html',
            service: 'Direct Connect',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 35,
            tags: [
              'networking',
              'ha'
            ]
          },
          {
            title: 'Direct Connect CloudWatchメトリクス 完全ガイド',
            href: 'networking/direct-connect-cloudwatch-metrics-guide.html',
            priority: 'low',
            service: 'Direct Connect',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'monitoring'
            ]
          },
          {
            title: 'AWS Direct Connect 接続タイプ完全ガイド',
            href: 'networking/direct-connect-connection-types-guide.html',
            priority: 'high',
            service: 'Direct Connect',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 30,
            tags: [
              'comparison'
            ],
            summary: 'DX専用接続/ホスト接続/ホストVIFの選定基準を比較表で整理'
          },
          {
            title: 'AWS Direct Connect ルート制限とルート集約（サマライゼーション）完全ガイド',
            href: 'networking/direct-connect-route-summarization-guide.html',
            service: 'Direct Connect',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 30
          },
          {
            title: 'AWS Direct Connect SiteLink 完全ガイド | データセンター間接続',
            href: 'networking/direct-connect-sitelink-guide.html',
            service: 'Direct Connect',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'Direct Connect暗号化ガイド - VPNで実現するセキュアな専用線',
            href: 'networking/direct_connect_encryption_vpn.html',
            service: 'Direct Connect',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'security'
            ]
          },
          {
            title: 'AWS Direct Connect アクティブ/パッシブBGP設定 完全ガイド',
            href: 'networking/dx-active-passive-bgp.html',
            priority: 'high',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'BGP',
              'ha'
            ]
          },
          {
            title: 'AWS Direct Connect BGPルーティング（2つのVIF構成）完全ガイド',
            href: 'networking/dx-bgp-routing-2vifs.html',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 30,
            tags: [
              'networking',
              'ha'
            ]
          },
          {
            title: 'Direct Connect Gateway・VGW・VIF 完全ガイド | AWS SAP学習リソース',
            href: 'networking/dx-gateway-vgw-vif-guide.html',
            priority: 'high',
            service: 'Direct Connect',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 30,
            summary: 'DXGW・VGW・VIFの3層構造と接続パターンをステップ解説'
          },
          {
            title: 'AWS Direct Connect ゲートウェイ 許可プレフィックスリスト完全ガイド - Transit Gateway構成',
            href: 'networking/dx-gw-allowed-prefix.html',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 20
          },
          {
            title: 'Direct Connect ルーティングポリシーと BGP コミュニティ - AWS図解ガイド',
            href: 'networking/dx-routing-bgp-community-guide.html',
            priority: 'high',
            service: 'Direct Connect',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 45,
            tags: [
              'networking'
            ],
            summary: 'DXルーティングポリシーとBGPコミュニティ値を体系的に整理'
          },
          {
            title: 'AWS Direct Connect VIF 設定パラメータ完全ガイド',
            href: 'networking/dx-vif-parameters.html',
            priority: 'high',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'comparison',
              'deep-dive'
            ]
          },
          {
            title: 'LAG × ハイブリッドBGP - 階層的冗長性システム完全ガイド',
            href: 'networking/lag_hybrid_bgp_relationship.html',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'networking'
            ]
          },
          {
            title: 'Direct Connect LAG環境でのMACsec実装ガイド',
            href: 'networking/macsec-lag-implementation-guide.html',
            priority: 'low',
            service: 'Direct Connect',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'AWS Direct Connect仮想ゲートウェイ解説',
            href: 'new-solutions/aws-direct-connect-vgw.html',
            priority: 'high',
            service: 'Direct Connect',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            summary: 'DX仮想ゲートウェイ(VGW)の役割と構成パターンを図解'
          },
          {
            title: 'VPNピアリングとPrivatelinkの比較',
            href: 'new-solutions/vpn-vs-privatelink.html',
            service: 'VPC PrivateLink',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'comparison'
            ]
          },
          {
            title: '【Black Belt】AWS Site-to-Site VPN (2021年10月)',
            href: 'BlackBelt/202110_AWS_Black_Belt_Site-to-Site_VPN.pdf',
            priority: 'high',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 30,
            summary: 'Site-to-Site VPNの設計・冗長化パターンを公式資料で学ぶ'
          }
        ]
      },
      {
        title: 'VPC & ネットワーク基礎',
        icon: '🏗️',
        count: 51,
        lastUpdated: '2026-03-28',
        resources: [
          {
            title: 'AWS Directory Service 完全ガイド - AD/Managed AD/AD Connector/Simple AD',
            href: 'networking/aws-directory-service-guide.html',
            service: 'Directory Service',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'AWS Egress-Only Internet Gateway 完全ガイド | IPv6出口専用ゲートウェイ',
            href: 'networking/aws-eigw-guide.html',
            priority: 'medium',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 15,
            tags: [
              'IPv6',
              'comparison'
            ]
          },
          {
            title: 'AWS ENI（Elastic Network Interface）初心者向け図解',
            href: 'networking/aws-eni-infographic.html',
            priority: 'low',
            service: 'ENI',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'AWSグローバルインフラストラクチャ完全ガイド | AWS初心者向けインフォグラフィック',
            href: 'networking/aws-global-infrastructure-guide.html',
            priority: 'high',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            summary: 'リージョン/AZ/エッジロケーション/Local Zonesの設計思想を図解'
          },
          {
            title: 'AWS Hyperplane 完全ガイド - 見えないけど超重要なAWSの交通システム',
            href: 'networking/aws-hyperplane-guide.html',
            priority: 'low',
            service: 'Hyperplane',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'AWS IPv6サポート完全ガイド - 住所体系の大革命',
            href: 'networking/aws-ipv6-support-guide-v2.html',
            priority: 'medium',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'AWS Local Zones 完全ガイド - 都市のユーザーに最も近い場所でAWSを動かす',
            href: 'networking/aws-local-zones-guide.html',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'AWS Network Firewall デプロイモデル完全ガイド - 分散型・集中型・複合型',
            href: 'networking/aws-network-firewall-deploy-models.html',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'AWS プレフィックスリスト完全ガイド',
            href: 'networking/aws-prefix-list-guide.html',
            service: 'Prefix List',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'AWS PrivateLink & VPC エンドポイントサービス 完全ガイド',
            href: 'networking/aws-privatelink-vpc-endpoint-service-guide.html',
            priority: 'high',
            service: 'VPC PrivateLink',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'networking'
            ],
            summary: 'PrivateLinkの接続フローと3種類のVPCエンドポイントを図解'
          },
          {
            title: 'AWS Site-to-Site VPN 完全ガイド',
            href: 'networking/aws-site-to-site-vpn-guide.html',
            priority: 'high',
            service: 'VPN',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            summary: 'Site-to-Site VPNの4大コンポーネントと冗長トンネル構成を図解'
          },
          {
            title: 'AWS Site-to-Site VPN IPv4/IPv6 トラフィック 完全ガイド',
            href: 'networking/aws-site-to-site-vpn-ipv4-ipv6-guide.html',
            service: 'VPN',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'AWS Site-to-Site VPN 非対称ルーティング問題の解決方法',
            href: 'networking/aws-vpn-asymmetric-routing-guide.html',
            service: 'VPN',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'networking',
              'monitoring'
            ]
          },
          {
            title: 'BGPルート選択アルゴリズム完全ガイド',
            href: 'networking/bgp-route-selection-guide.html',
            priority: 'high',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 20,
            tags: [
              'networking'
            ],
            summary: 'BGPルート選択の優先順位(LP/AS_PATH/MED等)をステップ解説'
          },
          {
            title: 'AWS BYOIP 完全ガイド - 自社IPアドレスをAWSに持ち込む',
            href: 'networking/byoip-guide.html',
            priority: 'low',
            service: 'VPC',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'CIDRブロック集約と許可プレフィックスリスト完全ガイド',
            href: 'networking/cidr-aggregation-prefix-list-guide.html',
            service: 'VPC',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'ha'
            ]
          },
          {
            title: 'CIDRブロックの重複とVPC接続 完全ガイド',
            href: 'networking/cidr-vpc-connectivity-guide.html',
            priority: 'high',
            service: 'VPC',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'ha',
              'networking'
            ],
            summary: 'CIDR重複判定とPrivateLinkによる解決策を判断フロー付きで解説'
          },
          {
            title: 'CloudFront HTTPセキュリティヘッダー完全ガイド',
            href: 'networking/cloudfront-security-headers-guide.html',
            priority: 'low',
            service: 'CloudFront',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'DNS64 & NAT64 完全図解ガイド',
            href: 'networking/dns64-nat64-guide.html',
            priority: 'medium',
            service: 'NAT Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'dns'
            ]
          },
          {
            title: '📦 EC2インスタンスのネットワークMTU完全ガイド - 宅配便で理解するパケットサイズ',
            href: 'networking/ec2-mtu-guide.html',
            priority: 'low',
            service: 'EC2',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'Amazon EKS セキュリティ完全図解ガイド',
            href: 'networking/eks-security-visual-guide.html',
            service: 'EKS',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'security',
              'containers'
            ]
          },
          {
            title: 'AWS ファイアウォール デプロイメントモデル完全ガイド - シングルアーム vs デュアルアーム',
            href: 'networking/firewall-deployment-models.html',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20
          },
          {
            title: 'AWS Global Accelerator × VPN パフォーマンス向上ガイド',
            href: 'networking/global-accelerator-vpn-performance-guide.html',
            priority: 'low',
            service: 'VPN',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'GuardDuty InstanceCredentialExfiltration 完全対処ガイド',
            href: 'networking/guardduty-credential-exfiltration-guide-v2.html',
            service: 'GuardDuty',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'Gateway Load Balancer によるディープパケットインスペクション',
            href: 'networking/gwlb-deep-packet-inspection-guide.html',
            priority: 'high',
            service: 'Gateway Load Balancer',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'security'
            ],
            summary: 'GWLBによるディープパケットインスペクションの仕組みを空港検査で図解'
          },
          {
            title: 'ハイブリッド DNS アーキテクチャ 完全ガイド',
            href: 'networking/hybrid-dns-architecture-guide.html',
            priority: 'high',
            service: 'Route 53',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 30,
            tags: [
              'dns'
            ],
            summary: 'Route 53 ResolverエンドポイントによるハイブリッドDNS設計を図解'
          },
          {
            title: 'ジャンボフレーム＆MTU問題 完全図解ガイド',
            href: 'networking/jumbo-frame-mtu-guide.html',
            priority: 'low',
            service: 'EC2',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'ネットワークACL vs セキュリティグループ 完全ガイド',
            href: 'networking/nacl-sg-comparison-guide.html',
            priority: 'high',
            service: 'VPC',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'comparison',
              'security'
            ],
            summary: 'NACLとSGの違いをマンションセキュリティで比較整理'
          },
          {
            title: 'NAT ゲートウェイのタイムアウト動作 完全ガイド',
            href: 'networking/nat-gateway-timeout-guide.html',
            service: 'NAT Gateway'
          },
          {
            title: 'プレフィックスリスト × AWS RAM 完全ガイド - マルチアカウントIP管理ソリューション',
            href: 'networking/prefix-list-ram-guide.html',
            priority: 'medium',
            service: 'Prefix List',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'S3バケットポリシー Principal要素 完全ガイド',
            href: 'networking/s3-bucket-policy-principal-guide.html',
            service: 'S3',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'storage'
            ]
          },
          {
            title: 'S3バケットポリシー × VPCエンドポイント完全ガイド',
            href: 'networking/s3-vpc-endpoint-policy-guide.html',
            priority: 'high',
            service: 'VPC PrivateLink',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'networking',
              'storage'
            ],
            summary: 'S3用VPCエンドポイントと条件キー付きバケットポリシーを解説'
          },
          {
            title: 'AWS Site-to-Site VPN + Route 53 Resolver 完全ガイド',
            href: 'networking/site-to-site-vpn-route53-resolver-guide.html',
            service: 'VPN',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'dns'
            ]
          },
          {
            title: 'スプリットトンネル vs フルトンネル VPN - AWS Client VPN | AWS SAP学習リソース',
            href: 'networking/split-vs-full-tunnel-vpn.html',
            priority: 'high',
            service: 'VPN',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'comparison'
            ],
            summary: 'スプリット/フルトンネルVPNの通信経路と判断フローを比較'
          },
          {
            title: 'Amazon VPC CNI 完全ガイド',
            href: 'networking/vpc-cni-guide.html',
            priority: 'medium',
            service: 'VPC',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'networking'
            ]
          },
          {
            title: 'VPC DNS設定 完全ガイド — enableDnsSupport & enableDnsHostnames',
            href: 'networking/vpc-dns-settings-guide.html',
            service: 'VPC',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'networking',
              'dns'
            ]
          },
          {
            title: 'VPCとデュアルスタックネットワーキング完全ガイド | AWS学習リソース',
            href: 'networking/vpc-dual-stack-networking-guide.html',
            priority: 'medium',
            service: 'VPC',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'networking'
            ]
          },
          {
            title: 'インターフェースVPCエンドポイントのDNS動作 完全ガイド',
            href: 'networking/vpc-endpoint-dns-behavior-guide.html',
            service: 'VPC PrivateLink',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'networking'
            ]
          },
          {
            title: 'VPCフローログ フィールド完全ガイド',
            href: 'networking/vpc-flow-log-fields-guide.html',
            priority: 'medium',
            service: 'VPC',
            exam_domains: [
              1,
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 30,
            tags: [
              'networking',
              'monitoring'
            ]
          },
          {
            title: 'Amazon VPC Network Access Analyzer 完全図解ガイド',
            href: 'networking/vpc-network-access-analyzer-guide.html',
            priority: 'low',
            service: 'VPC',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'networking'
            ]
          },
          {
            title: 'パケットの気持ちになって辿る Amazon VPC のルーティング | AWS学習リソース',
            href: 'networking/vpc-routing-packet-journey.html',
            priority: 'high',
            service: 'VPC',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'networking'
            ],
            summary: 'VPCルーティングとパケットの経路をシナリオ別にステップ図解'
          },
          {
            title: 'VPCトラフィックミラーリング完全ガイド - 4つの構成要素を徹底図解',
            href: 'networking/vpc-traffic-mirroring-deep-guide.html',
            service: 'VPC'
          },
          {
            title: 'VPCトラフィックミラーリング vs VPC Flow Logs - 使い分けガイド',
            href: 'networking/vpc-traffic-mirroring-vs-flow-logs.html',
            priority: 'high',
            service: 'VPC',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'comparison',
              'networking',
              'monitoring'
            ],
            summary: 'トラフィックミラーリングとフローログの使い分けを比較図解'
          },
          {
            title: 'VPNアクセラレーション vs Global Accelerator - 関係と違いを徹底解説',
            href: 'networking/vpn-acceleration-vs-global-accelerator.html',
            priority: 'low',
            service: 'VPN',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 20,
            tags: [
              'comparison'
            ]
          },
          {
            title: 'AWS Site-to-Site VPN IKEセッション復旧ガイド',
            href: 'networking/vpn-ike-dpd-recovery-guide.html',
            priority: 'low',
            service: 'VPN',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'ha'
            ]
          },
          {
            title: 'AWS VPNスループットスケーリング完全ガイド - Transit Gateway + ECMP + アクセラレーション',
            href: 'networking/vpn-throughput-scaling-guide.html',
            service: 'VPN',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'scaling'
            ]
          },
          {
            title: 'AWS EIP &amp; NATゲートウェイ 超初心者ガイド',
            href: 'new-solutions/aws_eip_nat_infographic.html',
            priority: 'low',
            service: 'NAT Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'ネットワーク層とアプリケーション層の違い',
            href: 'new-solutions/vpc_privatelink_cidr_overlap.html',
            priority: 'high',
            service: 'VPC PrivateLink',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'ha',
              'networking'
            ],
            summary: 'CIDR重複時のPrivateLinkによるL7接続解決策を図解'
          },
          {
            title: 'AWS RAM VPCプレフィックスリスト共有ガイド',
            href: 'organizational-complexity/aws_ram_vpc_prefix_infographic.html',
            service: 'VPC',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'networking'
            ]
          },
          {
            title: '【Black Belt】AWS VPC (2020年10月)',
            href: 'BlackBelt/20201021_AWS-BlackBelt-VPC.pdf',
            priority: 'high',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 30,
            tags: [
              'networking'
            ],
            summary: 'VPCの基本設計とネットワーク構成を公式Black Belt資料で学ぶ'
          },
          {
            title: '【Black Belt】AWS Networking Fundamentals',
            href: 'BlackBelt/AWS-54_AWS_networking_Fundamentals_KMD41.pdf',
            priority: 'high',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 30,
            summary: 'AWSネットワーキング基礎を公式資料で体系的に学ぶ'
          }
        ]
      },
      {
        title: 'Transit Gateway & ゲートウェイ',
        icon: '🚪',
        count: 19,
        lastUpdated: '2026-03-28',
        resources: [
          {
            title: 'AWSネットワークゲートウェイの比較',
            href: 'networking/aws-gateways.html',
            priority: 'high',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            summary: 'IGW/NAT GW/TGW等の各ゲートウェイの役割とトラフィックフローを図解'
          },
          {
            title: 'AWS Cloud WAN アタッチメント承認ポリシー完全ガイド',
            href: 'networking/cloud-wan-attachment-policy-guide.html',
            service: 'Cloud WAN',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'AWS Cloud WAN ポリシールールと評価順序・タグベースセグメントマッピング完全ガイド',
            href: 'networking/cloud-wan-policy-rules.html',
            service: 'Cloud WAN',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'Cloud WAN / TGW ルート分離設計の極意',
            href: 'networking/cloud-wan-tgw-route-isolation-guide.html',
            priority: 'high',
            service: 'Transit Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 35,
            tags: [
              'comparison'
            ],
            summary: 'Cloud WANセグメントとTGWルートテーブルの分離設計を比較'
          },
          {
            title: 'AWS Cloud WAN アタッチメントポリシー完全ガイド',
            href: 'networking/cloudwan-attachment-policy.html',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20
          },
          {
            title: 'AWS Cloud WAN スタティックルーティングとセグメント共有 完全ガイド',
            href: 'networking/cloudwan-static-routing-segment-sharing-v2.html',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'ha',
              'networking'
            ]
          },
          {
            title: 'AWS Transit Gateway Network Manager Route Analyzer 完全ガイド',
            href: 'networking/route-analyzer-guide.html',
            priority: 'high',
            service: 'Transit Gateway Route Analyzer',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            summary: 'TGW Route Analyzerの仕組みとルート診断の活用方法を解説'
          },
          {
            title: 'Transit Gateway アプライアンスモード 完全ガイド',
            href: 'networking/tgw-appliance-mode-guide.html',
            service: 'Transit Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'AWS Transit Gateway クロスアカウント共有 完全ガイド',
            href: 'networking/tgw-cross-account-sharing.html',
            service: 'Transit Gateway',
            exam_domains: [
              1,
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'networking',
              'multi-account'
            ]
          },
          {
            title: 'AWS Transit Gateway 完全図解 - 共有サービスによる分離VPCパターン',
            href: 'networking/tgw-isolated-shared-services.html',
            service: 'Transit Gateway'
          },
          {
            title: 'AWS Transit Gateway マルチキャスト完全ガイド - ケーブルTV局で理解するマルチキャスト配信',
            href: 'networking/tgw-multicast-guide.html',
            service: 'Transit Gateway'
          },
          {
            title: 'AWS Transit Gateway Network Manager 完全ガイド',
            href: 'networking/tgw-network-manager-guide.html',
            service: 'Transit Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'Transit Gateway ルーティング完全ガイド - クロスリージョン・クロスアカウントVPC接続',
            href: 'networking/tgw-routing-guide.html',
            service: 'Transit Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'networking'
            ]
          },
          {
            title: 'Transit Gateway Connect 完全ガイド',
            href: 'networking/transit-gateway-connect-guide.html',
            service: 'Transit Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'AWS Transit Gateway Deep Dive 完全ガイド',
            href: 'networking/transit-gateway-deep-dive.html',
            priority: 'high',
            service: 'Transit Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 40,
            summary: 'TGWの4つのコアコンセプトとアタッチメント種別を詳細図解'
          },
          {
            title: 'AWS Transit Gateway ピアリング完全ガイド - 空港ネットワークで理解する',
            href: 'networking/transit-gateway-peering-guide.html',
            priority: 'high',
            service: 'Transit Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            summary: 'TGWピアリングによるリージョン間接続を試験シナリオ付きで図解'
          },
          {
            title: 'WAN・SD-WAN・AWS Transit Gateway 完全図解ガイド',
            href: 'networking/wan-sdwan-transit-gateway-guide.html',
            service: 'Transit Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 30,
            tags: [
              'networking'
            ]
          },
          {
            title: 'AWS Transit Gateway共有の超簡単ガイド',
            href: 'organizational-complexity/aws-ram-tgw-sharing.html',
            priority: 'high',
            service: 'Transit Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'ha'
            ],
            summary: 'RAMによるTGWクロスアカウント共有の手順をステップ解説'
          },
          {
            title: '【Black Belt】AWS Transit Gateway Deep Dive (2025年1月)',
            href: 'BlackBelt/AWS-Black-Belt_2025_AWS-Transit-Gateway-deepdive_0122_v1.pdf',
            service: 'Transit Gateway',
            exam_domains: [
              1,
              2
            ],
            estimated_minutes: 30
          }
        ]
      },
      {
        title: 'その他',
        icon: '📄',
        count: 2,
        lastUpdated: '2026-03-28',
        resources: [
          { title: 'クロスリージョンEC2通信アーキテクチャ &amp; トラブルシューティング完全ガイド', href: 'networking/cross-region-ec2-communication.html', service: 'EC2' },
          { title: 'VPC Traffic Mirroring × UDP トラフィックキャプチャ完全ガイド', href: 'networking/traffic-mirroring-udp-guide.html', service: 'VPC Traffic Mirroring' }
        ]
      }
    ]
  },
  {
    id: 'security-governance',
    title: 'セキュリティ・ガバナンス',
    icon: '🛡️',
    count: 81,
    sections: [
      {
        title: 'セキュリティ監視・脅威検知',
        icon: '🛡️',
        count: 16,
        lastUpdated: '2026-03-21',
        resources: [
          {
            title: 'AWS Elastic Disaster Recovery を災害対策で理解しよう',
            href: 'continuous-improvement/aws_edr_infographic.html',
            service: 'Disaster Recovery',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'ha'
            ]
          },
          {
            title: 'AWS Systems Manager Run Command を会社経営で理解しよう',
            href: 'continuous-improvement/aws_ssm_runcommand_infographic.html',
            service: 'Systems Manager',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'AWS WAF Web ACLルールモード - 警備システムで理解する',
            href: 'continuous-improvement/aws_waf_infographic.html',
            priority: 'high',
            service: 'WAF',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            summary: 'AWS WAFのルール/モード/マネージドルールの基本を図解整理'
          },
          {
            title: 'AWS CloudTrail Lake 初心者ガイド',
            href: 'continuous-improvement/cloudtrail-lake-infographic.html',
            service: 'CloudTrail',
            exam_domains: [
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'AWS Session Manager セキュリティコントロール強化ガイド',
            href: 'continuous-improvement/session-manager-security-guide.html',
            service: 'Systems Manager',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'ALB TLSセキュリティポリシー完全ガイド',
            href: 'security-governance/alb-tls-security-policy-guide.html',
            priority: 'low',
            service: 'ACM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'EC2ボットネットC2通信からの保護ガイド - Route 53 Resolver DNS Firewall',
            href: 'security-governance/botnet-c2-protection-guide.html',
            priority: 'medium',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'AWS CloudTrail Lake 初心者ガイド',
            href: 'security-governance/cloudtrail-lake-infographic.html',
            service: 'CloudTrail',
            exam_domains: [
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'ECS Exec 完全ガイド - コンテナモニタリングの決定版',
            href: 'security-governance/ecs-exec-monitoring-guide.html',
            priority: 'low',
            service: 'ECS',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'monitoring',
              'containers'
            ]
          },
          {
            title: 'GuardDuty EKS Protection 完全ガイド',
            href: 'security-governance/guardduty-eks-protection-guide.html',
            priority: 'low',
            service: 'GuardDuty',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'containers'
            ]
          },
          {
            title: 'GuardDuty EKS/RDS Protection 完全ガイド',
            href: 'security-governance/guardduty-eks-rds-protection-guide.html',
            priority: 'low',
            service: 'GuardDuty',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'containers',
              'database'
            ]
          },
          {
            title: 'GuardDuty ログソース完全ガイド - 最大カバレッジ設定',
            href: 'security-governance/guardduty-log-sources-guide.html',
            priority: 'high',
            service: 'GuardDuty',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'monitoring'
            ],
            summary: 'GuardDutyのログソース(VPCフローログ/DNS/CloudTrail等)を図解'
          },
          {
            title: 'GuardDutyによるトラフィックパターン分析 完全ガイド',
            href: 'security-governance/guardduty-traffic-analysis-guide.html',
            priority: 'low',
            service: 'GuardDuty',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'Amazon Security Lake 完全ガイド - セキュリティ情報の総合図書館',
            href: 'security-governance/security-lake-guide.html',
            service: 'Security Lake',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'VPC トラフィックミラーリング完全ガイド',
            href: 'security-governance/vpc-traffic-mirroring-guide.html',
            service: 'VPC',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'networking'
            ]
          },
          {
            title: '【Black Belt】AWS Network Firewall Basic (2021年6月)',
            href: 'BlackBelt/BlackBelt202106_AWS_Network_Firewall_Basic.pdf',
            priority: 'high',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 30,
            summary: 'AWS Network Firewallの基本構成を公式Black Belt資料で学ぶ'
          }
        ]
      },
      {
        title: 'IAM & 認証・認可',
        icon: '👤',
        count: 19,
        lastUpdated: '2026-03-21',
        resources: [
          {
            title: 'AWS IAM フェデレーション入門',
            href: 'continuous-improvement/iam_federation_infographic.html',
            priority: 'high',
            service: 'IAM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'security'
            ],
            summary: 'SAML連携によるIAMフェデレーションの信頼関係を図解'
          },
          {
            title: 'AWS ABAC完全ガイド - PrincipalTag vs ResourceTag',
            href: 'security-governance/abac-principaltag-resourcetag-guide.html',
            service: 'IAM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'API Gateway認証・認可方式 図解版',
            href: 'security-governance/api_gateway_auth_infographic.html',
            service: 'API Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'AWS CLI 認証情報の指定方法 完全ガイド',
            href: 'security-governance/aws-cli-credentials-guide.html',
            priority: 'low',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'AWS Cognito ユーザープールとIDプールの違い',
            href: 'security-governance/aws-cognito-infographic.html',
            service: 'Cognito',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'AWS ログインユーザーの種類 - 完全ガイド',
            href: 'security-governance/aws-login-users-guide.html',
            priority: 'low',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'monitoring'
            ]
          },
          {
            title: 'SAML障害時のブレークグラスユーザー完全ガイド',
            href: 'security-governance/breakglass-user-guide.html',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'Amazon Cognito Pre Sign-up Lambda トリガー 完全ガイド',
            href: 'security-governance/cognito-pre-signup-trigger-guide.html',
            priority: 'low',
            service: 'Cognito',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'IAM Access Analyzer 完全ガイド - AWS初心者向け図解',
            href: 'security-governance/iam-access-analyzer-guide.html',
            service: 'IAM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'IAM Access Analyzer ポリシー生成機能 完全ガイド',
            href: 'security-governance/iam-access-analyzer-policy-generation-guide.html',
            service: 'IAM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'IAM 認証情報レポート完全ガイド',
            href: 'security-governance/iam-credential-report-guide.html',
            service: 'IAM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'IAM認証情報レポート - セキュリティインシデント初動調査ガイド',
            href: 'security-governance/iam-credential-report-incident-guide.html',
            priority: 'low',
            service: 'IAM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'IAM Identity Center 完全ガイド - Organizations一括管理',
            href: 'security-governance/iam-identity-center-guide.html',
            priority: 'high',
            service: 'IAM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'security'
            ],
            summary: 'IAM Identity Centerによるマルチアカウント一元認証の構成を解説'
          },
          {
            title: 'IAM MFA緊急時の救済ガイド - コンソールの限界とAPI直接操作',
            href: 'security-governance/iam-mfa-emergency-rescue-guide.html',
            priority: 'low',
            service: 'IAM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'IAM パーミッションバウンダリー 完全ガイド',
            href: 'security-governance/iam-permission-boundary-guide.html',
            priority: 'high',
            service: 'IAM',
            exam_domains: [
              1
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'security'
            ],
            summary: 'パーミッションバウンダリーの制限範囲と設計パターンを図解'
          },
          {
            title: 'IAM 権限評価モデル &amp; 操作経路 完全ガイド',
            href: 'security-governance/iam-permission-evaluation-guide.html',
            priority: 'high',
            service: 'IAM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'security'
            ],
            summary: 'IAM権限評価ロジックの優先順位をオフィスビルの例で図解'
          },
          {
            title: 'IAM ロール：権限ポリシー vs 信頼ポリシー完全ガイド',
            href: 'security-governance/iam-role-policies-guide.html',
            priority: 'high',
            service: 'IAM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'security'
            ],
            summary: '信頼/アイデンティティ/リソースポリシーの違いを比較表で整理'
          },
          {
            title: 'SAML証明書ローテーション完全ガイド - IAM IDプロバイダー設定更新',
            href: 'security-governance/saml-certificate-rotation-guide.html',
            priority: 'low',
            service: 'SAML Federation',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'sts:ExternalId 完全マスターガイド',
            href: 'security-governance/sts-externalid-complete-guide.html',
            priority: 'high',
            service: 'STS',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 40,
            summary: 'STS ExternalIdによる混乱した代理問題の防止メカニズムを解説'
          }
        ]
      },
      {
        title: 'Organizations & ガバナンス',
        icon: '🏢',
        count: 38,
        lastUpdated: '2026-03-21',
        resources: [
          {
            title: 'AWS Organizations SCPの継承：超シンプル解説',
            href: 'organizational-complexity/aws-scp-simplified.html',
            priority: 'high',
            service: 'Organizations',
            exam_domains: [
              1
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            summary: 'SCPの継承・評価ルールを組織階層の具体例でステップ解説'
          },
          {
            title: 'AWS Organizations &amp; Control Tower - 視覚的プロセス図解',
            href: 'organizational-complexity/aws_org_infographic.html',
            service: 'Organizations',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'AWS Control Tower 自動展開完全ガイド',
            href: 'organizational-complexity/control-tower-cfct-guide.html',
            service: 'Control Tower',
            exam_domains: [
              1
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'OSログローテーション × CloudWatch Logs エージェント 適合確認ガイド',
            href: 'organizational-complexity/log-rotation-cloudwatch-guide.html',
            priority: 'low',
            service: 'CloudWatch',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'monitoring'
            ]
          },
          {
            title: 'Amazon Inspector エージェントレス脆弱性評価 完全ガイド',
            href: 'security-governance/amazon-inspector-agentless-guide.html',
            priority: 'low',
            service: 'Amazon Inspector',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'Amazon Q Business アクセス制御 &amp; ガードレール完全ガイド',
            href: 'security-governance/amazon-q-business-access-guardrails-guide.html',
            priority: 'low',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'ha'
            ]
          },
          {
            title: 'Amazon Time Sync Service 完全図解ガイド',
            href: 'security-governance/amazon-time-sync-service-guide.html',
            priority: 'low',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'AWS Config access-keys-rotated 完全ガイド',
            href: 'security-governance/aws-config-access-keys-rotated-guide.html',
            priority: 'low',
            service: 'AWS Config',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'AWS Config 管理ルール＆CloudTrail修復アクション完全ガイド',
            href: 'security-governance/aws-config-cloudtrail-remediation-guide.html',
            service: 'CloudTrail',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'AWS Config コンフォーマンスパック &amp; StackSets 完全ガイド',
            href: 'security-governance/aws-config-conformance-stacksets-guide.html',
            service: 'AWS Config',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'AWS Config × Organizations 完全ガイド',
            href: 'security-governance/aws-config-organizations-guide.html',
            priority: 'high',
            service: 'AWS Config',
            exam_domains: [
              1
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'multi-account'
            ],
            summary: 'AWS Config×Organizationsによるマルチアカウント準拠管理を解説'
          },
          {
            title: 'AWS Config S3配信エラー解決ガイド',
            href: 'security-governance/aws-config-s3-delivery-error-guide.html',
            priority: 'low',
            service: 'AWS Config',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'storage'
            ]
          },
          {
            title: 'AWS Config - S3パブリックアクセス検出完全ガイド',
            href: 'security-governance/aws-config-s3-public-access-guide.html',
            service: 'AWS Config',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'storage'
            ]
          },
          {
            title: 'AWS Control Tower ガードレール解説',
            href: 'security-governance/aws-control-tower-guardrails.html',
            priority: 'high',
            service: 'Control Tower',
            exam_domains: [
              1
            ],
            difficulty: 'intermediate',
            estimated_minutes: 15,
            tags: [
              'multi-account'
            ],
            summary: 'Control Tower予防的/検出的/プロアクティブガードレールを分類整理'
          },
          {
            title: 'AWS マネージドポリシー vs カスタマーマネージドポリシー 完全ガイド',
            href: 'security-governance/aws-managed-vs-customer-managed-policies.html',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'comparison'
            ]
          },
          {
            title: 'AWS CloudTrail + CloudWatch + SNS 運用監視完全ガイド',
            href: 'security-governance/aws-monitoring-guide.html',
            service: 'CloudTrail',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'monitoring'
            ]
          },
          {
            title: 'AWS Organization と AWS Control Tower の関係',
            href: 'security-governance/aws-organization-control-tower.html',
            priority: 'high',
            service: 'Control Tower',
            exam_domains: [
              1
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            summary: 'OrganizationsとControl Towerの違いをマンション管理で比較'
          },
          {
            title: 'AWS Well-Architected フレームワーク 完全図解ガイド',
            href: 'security-governance/aws-well-architected-complete-guide.html',
            priority: 'high',
            service: 'Well-Architected',
            exam_domains: [
              1,
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 30,
            summary: 'Well-Architected 6本柱の設計思想と実践ポイントを体系整理'
          },
          {
            title: 'CIS AWS Foundations ベンチマーク継続評価ガイド',
            href: 'security-governance/cis-benchmark-security-hub-config-guide.html',
            priority: 'low',
            service: 'Security Hub',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'CloudFormationドリフト検出と自動修復完全ガイド',
            href: 'security-governance/cloudformation-drift-detection-auto-remediation-guide.html',
            service: 'CloudFormation',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 30,
            tags: [
              'ha',
              'monitoring'
            ]
          },
          {
            title: 'CloudTrail 管理イベント vs データイベント 完全ガイド',
            href: 'security-governance/cloudtrail-events-guide.html',
            priority: 'high',
            service: 'CloudTrail',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            summary: 'CloudTrail管理イベントとデータイベントの違いと設定方法を整理'
          },
          {
            title: 'CloudTrail 整合性検証 &amp; ダイジェストファイル 完全ガイド',
            href: 'security-governance/cloudtrail-integrity-validation-guide.html',
            service: 'CloudTrail',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'CloudTrail ログプレフィックス完全ガイド',
            href: 'security-governance/cloudtrail-log-prefix-guide.html',
            priority: 'low',
            service: 'CloudTrail',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'monitoring'
            ]
          },
          {
            title: 'AWS CloudTrail主要操作 完全図解ガイド',
            href: 'security-governance/cloudtrail-operations-guide.html',
            service: 'CloudTrail',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'CloudWatch Logs 集中集約完全ガイド',
            href: 'security-governance/cloudwatch-logs-subscription-guide.html',
            service: 'CloudWatch',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'monitoring'
            ]
          },
          {
            title: 'AWS CodeArtifact 完全ガイド',
            href: 'security-governance/codeartifact-guide.html',
            priority: 'low',
            service: 'CodeArtifact',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'Cognito IDプールIAMロール完全ガイド',
            href: 'security-governance/cognito-identity-pool-roles-guide.html',
            service: 'Cognito',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'EKS コントロールプレーンログ &amp; CloudTrail 監査ログ 完全図解ガイド',
            href: 'security-governance/eks-control-plane-logging-guide.html',
            priority: 'low',
            service: 'CloudTrail',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'monitoring',
              'containers'
            ]
          },
          {
            title: 'AWS Firewall Manager セキュリティグループポリシー 完全ガイド',
            href: 'security-governance/firewall-manager-sg-policy-guide.html',
            priority: 'high',
            service: 'Firewall Manager',
            exam_domains: [
              1
            ],
            difficulty: 'intermediate',
            estimated_minutes: 30,
            tags: [
              'security',
              'multi-account'
            ],
            summary: 'Firewall Managerの3種SGポリシー(共通/監査/使用状況)を比較整理'
          },
          {
            title: 'AWS認証サービス完全比較ガイド - IAM Identity Center vs IAM vs Cognito',
            href: 'security-governance/iam-identity-center-comparison-guide.html',
            priority: 'high',
            service: 'Cognito',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'comparison',
              'security'
            ],
            summary: 'IAM Identity Center/IAM/Cognitoの使い分けを比較表で整理'
          },
          {
            title: 'AWS IAMポリシー vs リソースポリシー - 明示的Denyの重要性 完全図解ガイド',
            href: 'security-governance/iam-resource-policy-deny-guide.html',
            priority: 'high',
            service: 'IAM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'security'
            ],
            summary: 'リソースポリシーの明示的Denyが他ポリシーに優先する仕組みを解説'
          },
          {
            title: 'IAM Roles Anywhere 完全ガイド',
            href: 'security-governance/iam-roles-anywhere-guide.html',
            service: 'IAM',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'Amazon Inspector Lambda関数スキャン 完全図解ガイド',
            href: 'security-governance/inspector-lambda-scan-guide.html',
            priority: 'low',
            service: 'Amazon Inspector',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'serverless'
            ]
          },
          {
            title: 'AWS Nitro Enclaves 完全ガイド',
            href: 'security-governance/nitro-enclaves-guide.html',
            priority: 'low',
            service: 'Nitro Enclaves',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'OpenSearch Dashboards によるログデータの可視化 - 完全ガイド',
            href: 'security-governance/opensearch-dashboards-guide.html',
            priority: 'low',
            service: 'RDS',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'database'
            ]
          },
          {
            title: 'AWS SCP構文 完全図解ガイド',
            href: 'security-governance/scp-syntax-visual-guide.html',
            priority: 'high',
            service: 'Organizations',
            exam_domains: [
              1
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            summary: 'SCPポリシーの7構成要素(Effect/Action/Resource等)を図解'
          },
          {
            title: 'AWS Security Hub 設定ポリシー完全図解ガイド',
            href: 'security-governance/securityhub-configuration-policies-guide.html',
            service: 'Security Hub',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'Storage Gateway RefreshCache 自動化完全ガイド',
            href: 'security-governance/storage-gateway-refreshcache-automation-guide.html',
            priority: 'low',
            service: 'Storage Gateway',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'storage'
            ]
          }
        ]
      },
      {
        title: '暗号化 & 証明書管理',
        icon: '🔐',
        count: 8,
        lastUpdated: '2026-03-21',
        resources: [
          { title: 'AWS KMS BYOK 完全ガイド', href: 'organizational-complexity/kms_byok_infographic.html', service: 'KMS', exam_domains: [1, 2], difficulty: 'beginner', estimated_minutes: 15 },
          { title: 'AWS ACMでSANを利用した複数ドメインSSL証明書取得ガイド', href: 'security-governance/acm-san-infographic.html', priority: 'low', service: 'ACM', exam_domains: [1, 2], difficulty: 'beginner', estimated_minutes: 15 },
          { title: 'AWS CMK（暗号化キー）を銀行の貸金庫で理解しよう', href: 'security-governance/aws_cmk_infographic.html', service: 'KMS', exam_domains: [1, 2], difficulty: 'beginner', estimated_minutes: 15 },
          { title: '証明書ベースVPN認証 & ACM完全ガイド', href: 'security-governance/cert-vpn-acm-guide.html', service: 'VPN', exam_domains: [1, 2], difficulty: 'intermediate', estimated_minutes: 25, tags: ['security', 'networking'] },
          { title: 'エンドツーエンド暗号化 完全ガイド - CloudFront → ALB → EC2', href: 'security-governance/e2e-encryption-guide.html', service: 'CloudFront', exam_domains: [1, 2], difficulty: 'intermediate', estimated_minutes: 25, tags: ['security'] },
          { title: 'AWS KMS グラント（Grants）完全ガイド - 一時的なアクセス許可の仕組み', href: 'security-governance/kms-grants-guide.html', priority: 'high', service: 'KMS', exam_domains: [1, 2], difficulty: 'intermediate', estimated_minutes: 20, summary: 'KMSグラントによる一時的な暗号化キー権限委任の仕組みを解説' },
          { title: 'AWS KMS キーの種類 完全ガイド', href: 'security-governance/kms-key-types.html', priority: 'high', service: 'KMS', exam_domains: [1, 2], difficulty: 'intermediate', estimated_minutes: 20, summary: 'AWS管理/カスタマー管理/持ち込みキーの3種比較と選定フロー' },
          { title: 'AWS KMS スロットリング対策 &amp; Encryption SDK キャッシュ完全ガイド', href: 'security-governance/kms-throttling-encryption-sdk-guide.html', service: 'KMS', exam_domains: [1, 2], difficulty: 'intermediate', estimated_minutes: 25, tags: ['security'] }
        ]
      }
    ]
  },
  {
    id: 'compute-applications',
    title: 'コンピュート・アプリケーション',
    icon: '⚙️',
    count: 58,
    sections: [
      {
        title: 'Auto Scaling & ロードバランシング',
        icon: '⚖️',
        count: 25,
        lastUpdated: '2026-03-27',
        resources: [
          {
            title: 'なぜALBはVPCエンドポイントサービスとして使えないのか？',
            href: 'compute-applications/alb-nlb-privatelink-guide.html',
            priority: 'high',
            service: 'VPC PrivateLink',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            summary: 'PrivateLink接続にNLBが必須な技術的理由を4つの観点で解説'
          },
          {
            title: 'ALB ターゲットグループ完全ガイド',
            href: 'compute-applications/alb-target-group-guide.html',
            service: 'ALB',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'ALBスティッキーセッション完全ガイド',
            href: 'compute-applications/alb_sticky_session_infographic.html',
            service: 'ALB',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: '大規模瞬間スケール完全図解',
            href: 'compute-applications/auto_scaling_infographic.html',
            priority: 'high',
            service: 'Auto Scaling',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'scaling'
            ],
            summary: 'Auto Scalingの基本動作をブラックフライデーシナリオで図解'
          },
          {
            title: 'Auto Scaling インスタンスリフレッシュ完全ガイド',
            href: 'compute-applications/autoscaling-instance-refresh-guide.html',
            service: 'Auto Scaling',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'scaling'
            ]
          },
          {
            title: 'Auto Scaling ライフサイクル完全ガイド',
            href: 'compute-applications/autoscaling-lifecycle-guide.html',
            priority: 'high',
            service: 'Auto Scaling',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'scaling'
            ],
            summary: 'ライフサイクルフック3必須コマンドの実行フローをステップ解説'
          },
          {
            title: 'Auto Scaling安全なOSアップデート戦略完全ガイド',
            href: 'compute-applications/autoscaling-safe-os-update-guide.html',
            service: 'Auto Scaling',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'scaling'
            ]
          },
          {
            title: 'AWS AutoScaling Warm Pool 完全ガイド',
            href: 'compute-applications/autoscaling_warmpool_infographic.html',
            service: 'Auto Scaling',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'scaling'
            ]
          },
          {
            title: 'AWSグローバルアーキテクチャ完全ガイド',
            href: 'compute-applications/aws-global-architecture-guide.html',
            priority: 'high',
            exam_domains: [
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'ha'
            ],
            summary: 'AWSグローバル4層アーキテクチャをテーマパーク運営で図解'
          },
          {
            title: 'CloudWatch Agent Procstat 完全ガイド',
            href: 'compute-applications/cloudwatch-procstat-guide.html',
            priority: 'low',
            service: 'CloudWatch',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'monitoring'
            ]
          },
          {
            title: 'CloudWatch カスタムメトリクス &amp; PutMetricData 完全ガイド',
            href: 'compute-applications/cloudwatch-putmetricdata-guide.html',
            service: 'CloudWatch',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'monitoring'
            ]
          },
          {
            title: 'CodePipeline Deploy Stage と DeploymentGroup の関係',
            href: 'compute-applications/codepipeline-deploymentgroup-guide.html',
            priority: 'low',
            service: 'CodePipeline',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'deployment'
            ]
          },
          {
            title: 'EC2 Auto Scaling SNS通知完全ガイド',
            href: 'compute-applications/ec2-autoscaling-notifications-guide.html',
            priority: 'low',
            service: 'EC2',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'scaling'
            ]
          },
          {
            title: 'EC2終了前ログ退避設計ガイド',
            href: 'compute-applications/ec2-log-backup-before-termination-guide.html',
            priority: 'low',
            service: 'EC2',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'monitoring'
            ]
          },
          {
            title: 'CodeシリーズでECS Fargateローリングデプロイ完全ガイド',
            href: 'compute-applications/ecs-fargate-rolling-deploy-complete-guide.html',
            service: 'ECS',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 35,
            tags: [
              'deployment',
              'serverless',
              'containers'
            ]
          },
          {
            title: 'AWS Elastic Load Balancing (ELB) 完全ガイド - ALB vs NLB',
            href: 'compute-applications/elb-types-guide.html',
            priority: 'high',
            service: 'ELB',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            summary: 'ALB(L7)とNLB(L4)の動作レイヤーと機能差を比較表で整理'
          },
          {
            title: 'Amazon EventBridge イベントパターン完全図解ガイド',
            href: 'compute-applications/eventbridge-event-patterns-guide.html',
            service: 'EventBridge',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'Fargate awslogsログドライバ完全ガイド',
            href: 'compute-applications/fargate-awslogs-complete-guide.html',
            priority: 'low',
            service: 'ECS',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 35,
            tags: [
              'monitoring',
              'serverless'
            ]
          },
          {
            title: 'Gateway Load Balancer (GWLB) 完全ガイド',
            href: 'compute-applications/gwlb-guide.html',
            priority: 'high',
            service: 'Gateway Load Balancer',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 30,
            tags: [
              'security',
              'networking'
            ],
            summary: 'GWLBのGeneveカプセル化とトラフィックフローの仕組みを図解'
          },
          {
            title: 'IAM PassRole vs AssumeRole 完全ガイド',
            href: 'compute-applications/iam-passrole-vs-assumerole-guide.html',
            priority: 'high',
            service: 'IAM',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'comparison',
              'security'
            ],
            summary: 'PassRoleとAssumeRoleの違いをレストラン代理店長の例で比較'
          },
          {
            title: 'NLB + TCPリスナー + mTLS + EKS 完全ガイド',
            href: 'compute-applications/nlb-mtls-eks-guide.html',
            priority: 'low',
            service: 'NLB',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'security',
              'containers'
            ]
          },
          {
            title: 'NLB ターゲットタイプ 完全解説',
            href: 'compute-applications/nlb-target-types.html',
            priority: 'high',
            service: 'NLB',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            summary: 'NLBターゲットタイプ(インスタンス/IP/ALB)の違いを完全比較'
          },
          {
            title: 'VPC DHCP オプションとカスタム DNS 完全ガイド',
            href: 'compute-applications/vpc-dhcp-options-guide.html',
            priority: 'low',
            service: 'VPC',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'networking'
            ]
          },
          {
            title: 'Auto Scaling ウォームプール運用モード完全ガイド',
            href: 'compute-applications/warmpool-modes-infographic.html',
            service: 'Auto Scaling',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'EC2 Auto Scaling ライフサイクルフックの図解',
            href: 'new-solutions/ec2-autoscaling-lifecycle-hooks.html',
            priority: 'high',
            service: 'EC2',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'scaling'
            ],
            summary: 'ライフサイクルフックの動作タイミングとユースケースを図解'
          }
        ]
      },
      {
        title: 'コンテナ & アプリケーション統合',
        icon: '📦',
        count: 6,
        lastUpdated: '2026-03-27',
        resources: [
          {
            title: 'Amazon AppStream 2.0 完全ガイド',
            href: 'compute-applications/appstream-infographic.html',
            priority: 'low',
            service: 'AppStream',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'AWS ECSを料理店経営で理解しよう',
            href: 'compute-applications/aws_ecs_infographic.html',
            priority: 'high',
            service: 'ECS',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'containers'
            ],
            summary: 'ECSの4要素(タスク/サービス/クラスタ/定義)を料理店運営で図解'
          },
          {
            title: 'AWS SQS Dead-letter Queue &amp; Redrive Policy 完全ガイド',
            href: 'compute-applications/sqs-dlq-redrive-guide.html',
            service: 'SQS',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'ha'
            ]
          },
          {
            title: 'AWS SQS DLQ &amp; Redrive Policy インフォグラフィック',
            href: 'compute-applications/sqs_dlq_infographic.html',
            priority: 'high',
            service: 'SQS',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            summary: 'SQSデッドレターキューの流れとRedrive Policyを宅配便で図解'
          },
          {
            title: 'AWS Systems Manager 機能解説',
            href: 'continuous-improvement/aws_systems_manager_infographic.html',
            service: 'Systems Manager',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'AWS SSM ドキュメントを料理レシピで理解しよう',
            href: 'continuous-improvement/ssm_document_guide.html',
            service: 'Systems Manager',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          }
        ]
      },
      {
        title: 'EC2 & インスタンス管理',
        icon: '🖥️',
        count: 10,
        lastUpdated: '2026-03-27',
        resources: [
          {
            title: 'AWS EC2のInsufficientInstanceCapacityエラーと再起動による解決メカニズム',
            href: 'compute-applications/aws-ec2-capacity-infographic.html',
            priority: 'high',
            service: 'EC2',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            summary: 'EC2容量不足エラーの原因と再起動による解決メカニズムを図解'
          },
          {
            title: 'AWS クラスタプレイスメントグループ + EFA 解説',
            href: 'compute-applications/aws_cluster_pg_efa_infographic.html',
            service: 'EC2',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'EC2 Auto Recovery完全ガイド',
            href: 'compute-applications/ec2-auto-recovery-guide.html',
            priority: 'high',
            service: 'EC2',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'ha'
            ],
            summary: 'EC2 Auto Recoveryの動作フローと手動対応との違いを比較'
          },
          {
            title: 'EC2 ネットワークパフォーマンス最適化 完全ガイド | Enhanced Networking・EFA・インスタンスサイジング',
            href: 'compute-applications/ec2-network-performance.html',
            service: 'EC2',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'EC2ステータスチェック図解ガイド',
            href: 'compute-applications/ec2-status-check-guide.html',
            service: 'EC2',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'AWS Placement Group — Infographic',
            href: 'compute-applications/placement-group-infographic.html',
            priority: 'high',
            service: 'EC2',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            summary: 'Cluster/Spread/Partition配置グループの特性と選定基準を図解'
          },
          {
            title: 'AWS Fault Injection Simulator 完全ガイド',
            href: 'continuous-improvement/aws_fis_infographic.html',
            service: 'FIS',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'Amazon CloudWatch Synthetics 完全ガイド',
            href: 'continuous-improvement/cloudwatch_synthetics_infographic.html',
            service: 'CloudWatch',
            exam_domains: [
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'monitoring'
            ]
          },
          {
            title: 'EC2ブートストラップ入門ガイド',
            href: 'new-solutions/ec2-bootstrap-infographic.html',
            service: 'EC2',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'Amazon EC2 Elastic Fabric Adapter (EFA) 完全ガイド',
            href: 'new-solutions/efa_infographic.html',
            priority: 'low',
            service: 'EFA',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          }
        ]
      },
      {
        title: 'Lambda & サーバーレス',
        icon: 'λ',
        count: 8,
        lastUpdated: '2026-03-27',
        resources: [
          {
            title: 'AWS Lambda Invocationメトリクスの完全ガイド',
            href: 'compute-applications/aws-lambda-metrics-perfect.html',
            priority: 'high',
            service: 'Lambda',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 40,
            tags: [
              'monitoring',
              'serverless'
            ],
            summary: 'Lambdaメトリクスのアラート設定とコールドスタート最適化を解説'
          },
          {
            title: 'AWS Lambda Invocationメトリクスの解説',
            href: 'compute-applications/aws-lambda-metrics.html',
            priority: 'low',
            service: 'Lambda',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 20,
            tags: [
              'monitoring',
              'serverless'
            ]
          },
          {
            title: 'Amazon EventBridge 概要',
            href: 'compute-applications/eventbridge_infographic (1).html',
            service: 'EventBridge',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'Amazon EventBridge 概要',
            href: 'compute-applications/eventbridge_infographic.html',
            service: 'EventBridge',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'Amazon EventBridge 概要',
            href: 'continuous-improvement/eventbridge_infographic.html',
            service: 'EventBridge',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'AWS Lambda ベストプラクティス - レストランキッチンで理解しよう',
            href: 'continuous-improvement/lambda_best_practices_guide.html',
            service: 'Lambda',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'serverless'
            ]
          },
          {
            title: 'Lambda 予約済み同時実行数とは？',
            href: 'cost-control/lambda_reserved_concurrency_infographic.html',
            service: 'Lambda',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'serverless'
            ]
          },
          {
            title: 'Lambda関数のエイリアス＆カナリアリリース解説',
            href: 'new-solutions/lambda-alias-canary.html',
            priority: 'high',
            service: 'Lambda',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'serverless'
            ],
            summary: 'Lambdaエイリアスによるカナリアリリースの手順をステップ図解'
          }
        ]
      },
      {
        title: 'システム運用 & パッチ管理',
        icon: '🔧',
        count: 9,
        lastUpdated: '2026-03-27',
        resources: [
          { title: 'AWS Patch Manager - 大規模環境での自動パッチ適用', href: 'compute-applications/aws_patch_manager_infographic.html', priority: 'high', service: 'Systems Manager', exam_domains: [2, 3], difficulty: 'beginner', estimated_minutes: 15, summary: 'Patch Managerのパッチベースライン設定と適用手順を図解' },
          { title: 'AWS Systems Manager OpsCenter 完全ガイド', href: 'compute-applications/opscenter-guide.html', service: 'OpsCenter', exam_domains: [2, 3], difficulty: 'intermediate', estimated_minutes: 25 },
          { title: 'AWS障害はなぜグローバルに拡大したか？ US-EAST-1の「単一障害点」構造を徹底分析', href: 'continuous-improvement/aws-us-east-1-outage-analysis.html', priority: 'low', exam_domains: [2, 3], difficulty: 'advanced', estimated_minutes: 20 },
          { title: 'CloudWatch INSIGHT_RULE_METRIC 完全ガイド', href: 'continuous-improvement/cloudwatch-insight-rule-metric-guide.html', priority: 'low', service: 'CloudWatch', exam_domains: [3], difficulty: 'advanced', estimated_minutes: 25, tags: ['monitoring'] },
          { title: 'CloudWatch Logs データ保護ポリシー完全ガイド', href: 'continuous-improvement/cloudwatch-logs-data-protection-guide.html', priority: 'low', service: 'CloudWatch', exam_domains: [3], difficulty: 'advanced', estimated_minutes: 25, tags: ['monitoring'] },
          { title: 'EC2 Image Builder 完全ガイド', href: 'continuous-improvement/ec2-image-builder-guide.html', service: 'EC2', exam_domains: [2, 3], difficulty: 'intermediate', estimated_minutes: 25 },
          { title: 'AWS Config ec2-managedinstance-applications-required 完全ガイド', href: 'continuous-improvement/ec2-managedinstance-applications-required-guide.html', priority: 'low', service: 'EC2', exam_domains: [2, 3], difficulty: 'advanced', estimated_minutes: 25 },
          { title: 'AWS ECR イメージスキャン完全ガイド', href: 'continuous-improvement/ecr-image-scanning-guide.html', service: 'ECR', exam_domains: [2, 3], difficulty: 'intermediate', estimated_minutes: 25 },
          { title: 'AWS Systems Manager完全ガイド', href: 'continuous-improvement/systems-manager-hybrid-guide.html', priority: 'high', service: 'Systems Manager', exam_domains: [2, 3], difficulty: 'intermediate', estimated_minutes: 25, summary: 'Systems Managerのオンプレ/ハイブリッド環境管理の構成を解説' }
        ]
      }
    ]
  },
  {
    id: 'content-delivery-dns',
    title: 'コンテンツ配信・DNS',
    icon: '🌍',
    count: 25,
    sections: [
      {
        title: 'CloudFront & コンテンツ配信',
        icon: '⚡',
        count: 14,
        lastUpdated: '2026-03-10',
        resources: [
          {
            title: 'ACM + ALB + EC2 TLS証明書設定 完全ガイド',
            href: 'content-delivery-dns/acm-alb-ec2-tls-guide.html',
            service: 'ACM',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'ACM DNS検証 - 超かんたん図解ガイド',
            href: 'content-delivery-dns/acm-dns-simple-guide.html',
            service: 'ACM',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 25,
            tags: [
              'dns'
            ]
          },
          {
            title: 'ALB × PFS 暗号スイート完全ガイド',
            href: 'content-delivery-dns/alb-pfs-cipher-suites-guide.html',
            priority: 'low',
            service: 'ACM',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'ALB セキュリティポリシー完全ガイド',
            href: 'content-delivery-dns/alb-security-policy-guide.html',
            priority: 'low',
            service: 'ALB',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'security'
            ]
          },
          {
            title: 'AWS Global Accelerator × IoT デバイス接続 完全ガイド',
            href: 'content-delivery-dns/aws-global-accelerator-iot-guide.html',
            service: 'Global Accelerator',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'CloudFrontのカスタムHTTPヘッダーとCache-Control入門ガイド',
            href: 'content-delivery-dns/cloudfront-cache-infographic.html',
            priority: 'high',
            service: 'CloudFront',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            summary: 'CloudFrontの静的コンテンツキャッシュ最適化戦略を図解'
          },
          {
            title: 'CloudFront HTTPSハンドシェイク完全ガイド',
            href: 'content-delivery-dns/cloudfront-https-guide.html',
            service: 'CloudFront',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'CloudFront オリジンフェイルオーバー完全ガイド | AWS学習リソース',
            href: 'content-delivery-dns/cloudfront-origin-failover-guide.html',
            priority: 'high',
            service: 'CloudFront',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'ha'
            ],
            summary: 'CloudFrontオリジンフェイルオーバーの発動条件と構造をステップ解説'
          },
          {
            title: 'DNSレコード完全ガイド - 住所録で理解するAWS Route 53',
            href: 'content-delivery-dns/dns-records-guide.html',
            priority: 'high',
            service: 'Route 53',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'dns',
              'database'
            ],
            summary: 'A/CNAME/MX/TXT等の主要DNSレコード種別を体系的に解説'
          },
          {
            title: 'AWS Global Accelerator 完全ガイド',
            href: 'content-delivery-dns/global_accelerator_infographic.html',
            priority: 'high',
            service: 'Global Accelerator',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            summary: 'Global Acceleratorのエニーキャストルーティングと利点を図解'
          },
          {
            title: 'Lambda@Edge Origin Response X-Frame-Options完全ガイド',
            href: 'content-delivery-dns/lambda-edge-x-frame-options-guide.html',
            service: 'CloudFront',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'serverless'
            ]
          },
          {
            title: 'OSI参照モデル × AWSサービス完全ガイド',
            href: 'content-delivery-dns/osi-aws-services-guide.html',
            priority: 'low',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'Amazon S3 マルチリージョンアクセスポイント',
            href: 'content-delivery-dns/s3-mrap-infographic.html',
            service: 'CloudFront',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'storage'
            ]
          },
          {
            title: 'AWS CloudFront オリジングループ簡単解説',
            href: 'new-solutions/cloudfront-origin-groups.html',
            priority: 'high',
            service: 'CloudFront',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            summary: 'CloudFrontオリジングループによるフェイルオーバー設定を3ステップで解説'
          }
        ]
      },
      {
        title: 'Route53 & DNS管理',
        icon: '🌍',
        count: 9,
        lastUpdated: '2026-03-10',
        resources: [
          {
            title: 'AWS条件付きフォワーダールール解説',
            href: 'content-delivery-dns/aws-dns-infographic.html',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'dns'
            ]
          },
          {
            title: 'Route 53 Resolver DNS Firewall｜ボットネットC&amp;C対策完全ガイド',
            href: 'content-delivery-dns/aws-route53-dns-firewall-botnet-guide.html',
            priority: 'medium',
            service: 'Route 53',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'dns'
            ]
          },
          {
            title: 'Route 53 Application Recovery Controller 解説',
            href: 'content-delivery-dns/route53-arc-infographic (1).html',
            service: 'Route 53',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'dns'
            ]
          },
          {
            title: 'Route 53 Resolver DNS Firewall 完全ガイド - フェイルオープン＆フェイルクローズ',
            href: 'content-delivery-dns/route53-dns-firewall-guide.html',
            priority: 'high',
            service: 'Route 53',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'dns'
            ],
            summary: 'Route 53 DNS Firewallによる悪意あるドメインのブロック機構を解説'
          },
          {
            title: 'Route 53 DNSSEC 完全ガイド',
            href: 'content-delivery-dns/route53-dnssec-100.html',
            priority: 'medium',
            service: 'Route 53',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'dns'
            ]
          },
          {
            title: 'Amazon Route 53 プライベートホストゾーン完全ガイド',
            href: 'content-delivery-dns/route53-private-hosted-zone-guide.html',
            priority: 'high',
            service: 'Route 53',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'dns'
            ],
            summary: 'プライベートホストゾーンとスプリットビューDNSの設計を比較解説'
          },
          {
            title: 'Route 53 プライベートホストゾーン クロスアカウント関連付け',
            href: 'content-delivery-dns/route53_cross_account_guide.html',
            priority: 'high',
            service: 'Route 53',
            exam_domains: [
              1,
              2
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'dns',
              'multi-account'
            ],
            summary: 'Route 53プライベートホストゾーンのクロスアカウント関連付け手順を解説'
          },
          {
            title: 'Route 53 Application Recovery Controller 解説',
            href: 'continuous-improvement/route53-arc-infographic.html',
            service: 'Route 53',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'dns'
            ]
          },
          {
            title: 'Route53 ホストゾーン完全ガイド',
            href: 'new-solutions/route53_hosted_zones_infographic.html',
            priority: 'high',
            service: 'Route 53',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'dns'
            ],
            summary: 'Route 53パブリック/プライベートホストゾーンの使い分けを図解'
          }
        ]
      },
      {
        title: 'その他',
        icon: '📄',
        count: 2,
        lastUpdated: '2026-03-10',
        resources: [
          { title: 'DNSサービスのダウンタイムなし移行プロセス - Route 53完全ガイド', href: 'content-delivery-dns/dns-migration-guide.html', service: 'Route 53' },
          { title: 'サブドメイン委任（Subdomain Delegation）完全ガイド - Route 53', href: 'content-delivery-dns/subdomain-delegation-guide.html', service: 'Route 53' }
        ]
      }
    ]
  },
  {
    id: 'development-deployment',
    title: '開発・デプロイメント',
    icon: '🚀',
    count: 23,
    sections: [
      {
        title: 'CI/CD & デプロイ',
        icon: '📄',
        count: 6,
        lastUpdated: '2026-04-24',
        resources: [
          { title: 'AWS CI/CDパイプライン - レシピ開発から出版まで', href: 'continuous-improvement/aws_pipeline_infographic.html', service: 'CI/CD Pipeline', exam_domains: [2, 3], difficulty: 'beginner', estimated_minutes: 15, tags: ['deployment'] },
          { title: 'Elastic Beanstalk Blue/Green デプロイメント', href: 'continuous-improvement/beanstalk_blue_green_infographic.html', exam_domains: [2, 3], difficulty: 'beginner', estimated_minutes: 15 },
          { title: 'Elastic Beanstalk ブルー/グリーンデプロイ完全ガイド', href: 'continuous-improvement/blue_green_deploy_infographic.html', service: 'CodeDeploy', exam_domains: [2, 3], difficulty: 'beginner', estimated_minutes: 15, tags: ['deployment'] },
          { title: 'AWS CodeBuild buildspec.yaml 完全ガイド', href: 'continuous-improvement/buildspec_infographic.html', service: 'CodeBuild', exam_domains: [2, 3], difficulty: 'beginner', estimated_minutes: 15 },
          { title: 'CanaryとLinearデプロイメントの違い', href: 'continuous-improvement/canary_linear_infographic.html', service: 'CodeDeploy', exam_domains: [2, 3], difficulty: 'beginner', estimated_minutes: 15 },
          { title: 'AWS CodeDeploy を劇場システムで理解しよう', href: 'continuous-improvement/codedeploy_infographic.html', service: 'CodeDeploy', exam_domains: [2, 3], difficulty: 'beginner', estimated_minutes: 15, tags: ['deployment'] }
        ]
      },
      {
        title: 'IaC & CloudFormation',
        icon: '📜',
        count: 12,
        lastUpdated: '2026-04-24',
        resources: [
          {
            title: 'AWS CloudFormation変更セットを建築業界で理解しよう',
            href: 'continuous-improvement/cloudformation_changeset_infographic.html',
            service: 'CloudFormation',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'ha'
            ]
          },
          {
            title: 'Amazon Inspector ECRスキャン完全ガイド',
            href: 'development-deployment/amazon-inspector-ecr-scanning-guide.html',
            priority: 'low',
            service: 'Amazon Inspector',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'AWS CloudFormation テンプレート作成ガイド',
            href: 'development-deployment/aws-cloudformation-infographic.html',
            priority: 'high',
            service: 'CloudFormation',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            summary: 'CloudFormationテンプレート構造と組み込み関数の基本を図解'
          },
          {
            title: 'AWS SAM レストラン経営で理解しよう',
            href: 'development-deployment/aws_sam_infographic.html',
            service: 'SAM',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'AWS CDKを家づくり設計で理解しよう',
            href: 'development-deployment/cdk_infographic.html',
            service: 'CDK',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'CloudFormation Guard (cfn-guard) 完全ガイド',
            href: 'development-deployment/cfn-guard-infographic.html',
            service: 'CloudFormation',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'CloudFormation リソース保持メカニズム',
            href: 'development-deployment/cloudformation-protection-guide.html',
            priority: 'high',
            service: 'CloudFormation',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            summary: 'DeletionPolicy/UpdateReplacePolicy/削除保護の3安全策を比較'
          },
          {
            title: 'CloudWatch Logs ログ保持期間 完全ガイド',
            href: 'development-deployment/cloudwatch-logs-retention-guide.html',
            priority: 'low',
            service: 'CloudWatch',
            exam_domains: [
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25,
            tags: [
              'monitoring'
            ]
          },
          {
            title: 'CodePipeline &amp; タスク概要 完全ガイド',
            href: 'development-deployment/codepipeline_infographic_v2.html',
            priority: 'high',
            service: 'CodePipeline',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'deployment'
            ],
            summary: 'CodePipelineのSource/Build/Deployステージ構成を図解'
          },
          {
            title: 'AWS GuardDuty 抑制ルール（Suppression Rule）完全ガイド',
            href: 'development-deployment/guardduty-suppression-rules.html',
            service: 'GuardDuty',
            exam_domains: [
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20
          },
          {
            title: 'CloudFormation StackSets 詳細図解',
            href: 'development-deployment/stacksets_infographic.html',
            priority: 'high',
            service: 'CloudFormation',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            summary: 'StackSetsの委任管理者とサービスマネージド型の仕組みを詳細図解'
          },
          {
            title: 'CloudFormationからAWS Service Catalog製品を作成する方法',
            href: 'organizational-complexity/cf-service-catalog-infographic.html',
            priority: 'high',
            service: 'CloudFormation',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'monitoring'
            ],
            summary: 'CloudFormationからService Catalog製品を作成する手順を図解'
          }
        ]
      },
      {
        title: 'CI/CD & デプロイメント',
        icon: '🔄',
        count: 2,
        lastUpdated: '2026-04-24',
        resources: [
          { title: 'Amazon Q Developer 完全ガイド｜初心者向けインフォグラフィック図解', href: 'development-deployment/amazon-q-developer-guide.html', priority: 'medium', exam_domains: [2, 3], difficulty: 'beginner', estimated_minutes: 20, tags: ['Amazon Q', 'Generative AI', 'Developer Productivity'] },
          { title: 'CodePipeline アクションタイプ図解ガイド', href: 'development-deployment/codepipeline-actions-guide.html', service: 'CodePipeline', exam_domains: [2, 3], difficulty: 'intermediate', estimated_minutes: 25, tags: ['deployment'] }
        ]
      },
      {
        title: 'API & イベント駆動',
        icon: '⚡',
        count: 3,
        lastUpdated: '2026-04-24',
        resources: [
          { title: 'AWS API Gateway をレストランで理解しよう', href: 'development-deployment/api_gateway_infographic.html', priority: 'high', service: 'API Gateway', exam_domains: [2, 3], difficulty: 'beginner', estimated_minutes: 15, summary: 'REST/HTTP/WebSocket 3種APIタイプの特徴と料金をレストランで比較' },
          { title: 'AWS EventBridge API宛先と入力トランスフォーマー機能の解説', href: 'development-deployment/aws-eventbridge-infographic.html', priority: 'high', service: 'EventBridge', exam_domains: [2, 3], difficulty: 'beginner', estimated_minutes: 15, summary: 'EventBridge API宛先と入力トランスフォーマーの連携を図解' },
          { title: 'AWS AppSync - 初心者向けガイド', href: 'development-deployment/aws_appsync_infographic.html', service: 'AppSync', exam_domains: [2, 3], difficulty: 'beginner', estimated_minutes: 15 }
        ]
      }
    ]
  },
  {
    id: 'storage-database',
    title: 'ストレージ・データベース',
    icon: '💾',
    count: 14,
    sections: [
      {
        title: 'S3 & オブジェクトストレージ',
        icon: '🪣',
        count: 6,
        lastUpdated: '2026-02-19',
        resources: [
          {
            title: 'AWS S3 ストレージクラスを家の収納で理解しよう',
            href: 'cost-control/s3_storage_classes_infographic.html',
            service: 'S3',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'storage'
            ]
          },
          {
            title: 'AWS S3 機能解説 - 初心者向けガイド',
            href: 'storage-database/aws_s3_infographic.html',
            priority: 'high',
            service: 'S3',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'storage'
            ],
            summary: 'S3ライフサイクル/CRR/オブジェクトロックの3機能を図解'
          },
          {
            title: 'OpenSearch Service ISM ポリシー完全ガイド',
            href: 'storage-database/opensearch-ism-policy-guide.html',
            priority: 'low',
            service: 'OpenSearch',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 25
          },
          {
            title: 'QuickSight vs OpenSearch Dashboards 完全比較ガイド',
            href: 'storage-database/quicksight-opensearch-comparison-guide.html',
            priority: 'low',
            service: 'OpenSearch',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'advanced',
            estimated_minutes: 20,
            tags: [
              'comparison'
            ]
          },
          {
            title: 'Amazon S3 セキュリティ機能の違い',
            href: 'storage-database/s3-security-infographic.html',
            priority: 'high',
            service: 'S3',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'security',
              'storage'
            ],
            summary: 'S3バケットポリシー/ACL/暗号化等セキュリティ機能の使い分けを比較'
          },
          {
            title: 'AWS S3 ストレージクラスを家の収納で理解しよう',
            href: 'storage-database/s3_storage_classes_infographic.html',
            priority: 'high',
            service: 'S3',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'storage'
            ],
            summary: 'S3の6ストレージクラスとGlacier 3種の取り出し速度を比較表で整理'
          }
        ]
      },
      {
        title: 'データベース & キャッシング',
        icon: '🗄️',
        count: 6,
        lastUpdated: '2026-02-19',
        resources: [
          {
            title: 'Amazon MSK をレストランの注文システムで理解しよう',
            href: 'storage-database/amazon_msk_infographic.html',
            priority: 'low',
            service: 'MSK',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'Aurora Data API &amp; IAM認証 完全ガイド',
            href: 'storage-database/aurora_dataapi_iam_infographic.html',
            priority: 'high',
            service: 'IAM',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'security',
              'database'
            ],
            summary: 'Aurora Data API×IAM認証の構成をホテルセキュリティで図解'
          },
          {
            title: 'ElastiCache 可用性・スケーラビリティ機能 詳細ガイド',
            href: 'storage-database/elasticache_infographic.html',
            priority: 'high',
            service: 'ElastiCache',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            summary: 'ElastiCacheの可用性・スケーラビリティ機能と構成パターンを図解'
          },
          {
            title: 'Amazon OpenSearch Service 完全ガイド',
            href: 'storage-database/opensearch-guide.html',
            service: 'OpenSearch',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'Redis クラスターモード完全図解',
            href: 'storage-database/redis_cluster_mode_infographic.html',
            service: 'ElastiCache',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'Amazon Redshift Data Sharing 完全ガイド',
            href: 'storage-database/redshift-data-sharing-guide.html',
            service: 'Redshift',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25,
            tags: [
              'ha'
            ]
          }
        ]
      },
      {
        title: 'ブロック & ファイルストレージ',
        icon: '💿',
        count: 2,
        lastUpdated: '2026-02-19',
        resources: [
          {
            title: 'Amazon EBS高速スナップショット復元(FSR)初心者ガイド',
            href: 'storage-database/aws-ebs-fsr-infographic.html',
            priority: 'high',
            service: 'EBS',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'storage'
            ],
            summary: 'EBS高速スナップショット復元(FSR)の仕組みとユースケースを図解'
          },
          {
            title: 'AWS EFS マウントターゲットの説明',
            href: 'storage-database/aws-efs-mount-target-infographic.html',
            service: 'EFS',
            exam_domains: [
              2,
              3
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'storage'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'migration',
    title: '移行・転送',
    icon: '🔄',
    count: 11,
    sections: [
      {
        title: 'ディザスタリカバリ (DR)',
        icon: '🆘',
        count: 1,
        lastUpdated: '2026-02-19',
        resources: [
          {
            title: 'AWS災害復旧戦略をレストランで理解しよう',
            href: 'migration/aws-dr-infographic.html',
            priority: 'high',
            service: 'Disaster Recovery',
            exam_domains: [
              2,
              4
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            tags: [
              'ha'
            ],
            summary: '4つのDR戦略(Backup〜Multi-Site)をRPO/RTO比較で整理'
          }
        ]
      },
      {
        title: 'Migration Hub & 移行戦略',
        icon: '🚚',
        count: 6,
        lastUpdated: '2026-02-19',
        resources: [
          {
            title: 'AWS Migration Hub 超わかりやすいガイド',
            href: 'migration/aws-migration-hub-infographic.html',
            priority: 'high',
            service: 'Migration Hub',
            exam_domains: [
              4
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            summary: 'Migration Hubの4機能による移行追跡・一元管理を図解'
          },
          {
            title: 'AWS Migration Hubを引っ越し会社で理解しよう',
            href: 'migration/aws_migration_hub_infographic.html',
            service: 'Migration Hub',
            exam_domains: [
              4
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'AWS移行戦略7Rと移行サービス群',
            href: 'migration/aws_migration_infographic.html',
            priority: 'high',
            service: 'Migration Hub',
            exam_domains: [
              4
            ],
            difficulty: 'beginner',
            estimated_minutes: 15,
            summary: '7R移行戦略と対応AWSサービス群を引っ越しの例で体系整理'
          },
          {
            title: 'AWS移行サービス群 完全ガイド',
            href: 'migration/aws_migration_services_infographic.html',
            service: 'Migration Hub',
            exam_domains: [
              4
            ],
            difficulty: 'beginner',
            estimated_minutes: 15
          },
          {
            title: 'AWS Relocate（再配置）戦略 - 完全解説',
            href: 'migration/aws_relocate_guide.html',
            exam_domains: [
              2,
              4
            ],
            difficulty: 'intermediate',
            estimated_minutes: 25
          },
          {
            title: 'ブルー/グリーン vs イミュータブル - 完全図解ガイド',
            href: 'migration/blue-green-vs-immutable-visual-guide.html',
            priority: 'high',
            service: 'CodeDeploy',
            exam_domains: [
              2,
              4
            ],
            difficulty: 'intermediate',
            estimated_minutes: 20,
            tags: [
              'comparison'
            ],
            summary: 'Blue/GreenとImmutableデプロイ戦略の違いを比較図解'
          }
        ]
      },
      {
        title: 'DMS & データベース移行',
        icon: '🔁',
        count: 4,
        lastUpdated: '2026-02-19',
        resources: [
          { title: 'AWS SCT &amp; DMS データベース移行を図書館の引っ越しで理解しよう', href: 'migration/aws_database_migration_infographic.html', service: 'DMS', exam_domains: [4], difficulty: 'beginner', estimated_minutes: 15, tags: ['database'] },
          { title: 'AWS DMS Change Data Capture ガイド', href: 'migration/aws_dms_cdc_infographic.html', priority: 'high', service: 'DMS', exam_domains: [4], difficulty: 'beginner', estimated_minutes: 15, summary: 'DMS CDCによる無停止データ移行の仕組みを引っ越し業者で図解' },
          { title: 'AWS DMS機能詳細ガイド', href: 'migration/aws_dms_features_infographic.html', priority: 'high', service: 'DMS', exam_domains: [4], difficulty: 'beginner', estimated_minutes: 15, summary: 'DMSのセキュリティ・変換・検証機能の詳細を図解' },
          { title: 'AWS SCT・DMS オンラインマイグレーション完全ガイド', href: 'migration/aws_sct_dms_migration_infographic.html', priority: 'high', service: 'DMS', exam_domains: [4], difficulty: 'beginner', estimated_minutes: 15, summary: 'SCT+DMSの異種DB移行フローを図書館移転プロジェクトで図解' }
        ]
      }
    ]
  },
  {
    id: 'analytics-operations',
    title: '分析・運用・クイズ',
    icon: '📊',
    count: 17,
    sections: [
      {
        title: '分析・運用',
        icon: '📉',
        count: 7,
        lastUpdated: '2026-04-24',
        resources: [
          { title: 'AWS コスト管理ツール比較', href: 'analytics-bigdata/aws-cost-tools.html', priority: 'high', service: 'Cost Explorer', exam_domains: [1, 3], difficulty: 'intermediate', estimated_minutes: 20, summary: 'Cost Explorer/Budgets/CUR等コスト管理ツールの使い分けを比較' },
          { title: 'AWS EC2ディスクメトリクスの違い', href: 'analytics-bigdata/aws-disk-metrics.html', priority: 'low', exam_domains: [3], difficulty: 'advanced', estimated_minutes: 20, tags: ['monitoring'] },
          { title: 'AWSエラー比較: InstanceLimitExceeded vs Insufficient Instance Capacity', href: 'analytics-bigdata/aws-errors-infographic.html', exam_domains: [3], difficulty: 'beginner', estimated_minutes: 15 },
          { title: 'AWS可用性指標：MTTD・MTTR・MTBF完全ガイド', href: 'analytics-bigdata/aws_availability_infographic.html', priority: 'high', exam_domains: [3], difficulty: 'beginner', estimated_minutes: 15, summary: 'MTTD/MTTR/MTBF可用性3指標の計算式と実装パターンを図解' },
          { title: 'CloudWatch エージェント × VPC エンドポイント 完全ガイド', href: 'analytics-bigdata/cw-agent-vpc-endpoint.html', service: 'VPC PrivateLink', exam_domains: [1, 4], difficulty: 'intermediate', estimated_minutes: 20 },
          { title: 'Amazon Kinesis Data Streamsをベルトコンベアで理解しよう', href: 'analytics-bigdata/kinesis-infographic.html', priority: 'high', service: 'Kinesis', exam_domains: [3], difficulty: 'beginner', estimated_minutes: 15, summary: 'Kinesis Data Streamsのシャード・パーティションキーをベルトコンベアで図解' },
          { title: 'SageMaker AI 推論エンドポイント 4種類 完全図解ガイド', href: 'analytics-bigdata/sagemaker-endpoints.html', priority: 'high', exam_domains: [2, 3], difficulty: 'intermediate', estimated_minutes: 25, tags: ['SageMaker', 'ML Inference', 'Endpoint', 'Serverless'] }
        ]
      },
      {
        title: 'データ分析',
        icon: '📈',
        count: 3,
        lastUpdated: '2026-04-24',
        resources: [
          { title: 'Kinesis Data Firehose 高度機能完全図解', href: 'analytics-bigdata/kinesis_firehose_infographic.html', priority: 'high', service: 'Kinesis', exam_domains: [3], difficulty: 'beginner', estimated_minutes: 15, summary: 'Firehoseの動的パーティショニングとParquet変換の高度機能を図解' },
          { title: 'Redshift スケーリング手段完全図解', href: 'analytics-bigdata/redshift_scaling_infographic.html', service: 'Redshift', exam_domains: [3], difficulty: 'beginner', estimated_minutes: 15, tags: ['scaling'] },
          { title: 'サーバーレスデータパイプライン完全図解', href: 'analytics-bigdata/serverless_data_pipeline_infographic.html', service: 'CI/CD Pipeline', exam_domains: [3], difficulty: 'beginner', estimated_minutes: 15, tags: ['deployment', 'serverless'] }
        ]
      },
      {
        title: '理解度クイズ・用語集',
        icon: '✏️',
        count: 7,
        lastUpdated: '2026-04-24',
        resources: [
          { title: '🗺️ 開発向けロードマップ', href: 'development-roadmap.html', exam_domains: [3], difficulty: 'intermediate', estimated_minutes: 20 },
          { title: '📊 開発フローチャート', href: 'development-flowchart.html', exam_domains: [3], difficulty: 'intermediate', estimated_minutes: 20, tags: ['ha'] },
          { title: '💡 開発ユースケース', href: 'development-usecase.html', exam_domains: [3], difficulty: 'intermediate', estimated_minutes: 20 },
          { title: '📚 学習リソース集', href: 'learning-resources.html', exam_domains: [3], difficulty: 'intermediate', estimated_minutes: 20 },
          { title: 'AWS SAP ナレッジベース', href: 'knowledge-base.html', exam_domains: [3], difficulty: 'intermediate', estimated_minutes: 20 },
          { title: 'AWS SAP 理解度クイズ', href: 'quiz.html', exam_domains: [3], difficulty: 'intermediate', estimated_minutes: 20 },
          { title: 'AWS SAP 用語集', href: 'aws_glossary.html', exam_domains: [3], difficulty: 'intermediate', estimated_minutes: 20 }
        ]
      }
    ]
  }
];

const categoryQuickNav = [
  {
    id: 'networking',
    icon: '🌐',
    text: 'ネットワーキング',
    count: 92
  },
  {
    id: 'security-governance',
    icon: '🔒',
    text: 'セキュリティ・ガバナンス',
    count: 81
  },
  {
    id: 'compute-applications',
    icon: '💻',
    text: 'コンピュート・アプリケーション',
    count: 58
  },
  {
    id: 'content-delivery-dns',
    icon: '🚀',
    text: 'コンテンツ配信・DNS',
    count: 25
  },
  {
    id: 'development-deployment',
    icon: '🛠️',
    text: '開発・デプロイメント',
    count: 23
  },
  {
    id: 'storage-database',
    icon: '💾',
    text: 'ストレージ・データベース',
    count: 14
  },
  {
    id: 'migration',
    icon: '🔄',
    text: '移行・転送',
    count: 11
  },
  {
    id: 'analytics-operations',
    icon: '📊',
    text: '分析・運用・クイズ',
    count: 17
  }
];

// 統計データ
const siteStats = {
  majorCategories: 8,
  minorCategories: 29,
  totalResources: '321+',
  offlineSupport: '100%',
  lastUpdated: '2026/04/19'
};

// サービスインデックス（自動生成）
const serviceIndex = [
  {
    name: 'ACM',
    count: 5,
    categories: [
      'security-governance',
      'content-delivery-dns'
    ]
  },
  {
    name: 'ALB',
    count: 3,
    categories: [
      'compute-applications',
      'content-delivery-dns'
    ]
  },
  {
    name: 'Amazon Inspector',
    count: 3,
    categories: [
      'security-governance',
      'development-deployment'
    ]
  },
  {
    name: 'API Gateway',
    count: 2,
    categories: [
      'security-governance',
      'development-deployment'
    ]
  },
  {
    name: 'AppStream',
    count: 1,
    categories: [
      'compute-applications'
    ]
  },
  {
    name: 'AppSync',
    count: 1,
    categories: [
      'development-deployment'
    ]
  },
  {
    name: 'Auto Scaling',
    count: 6,
    categories: [
      'compute-applications'
    ]
  },
  {
    name: 'AWS Config',
    count: 5,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'CDK',
    count: 1,
    categories: [
      'development-deployment'
    ]
  },
  {
    name: 'CI/CD Pipeline',
    count: 2,
    categories: [
      'development-deployment',
      'analytics-operations'
    ]
  },
  {
    name: 'Cloud WAN',
    count: 2,
    categories: [
      'networking'
    ]
  },
  {
    name: 'CloudFormation',
    count: 7,
    categories: [
      'security-governance',
      'development-deployment'
    ]
  },
  {
    name: 'CloudFront',
    count: 8,
    categories: [
      'networking',
      'security-governance',
      'content-delivery-dns'
    ]
  },
  {
    name: 'CloudTrail',
    count: 9,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'CloudWatch',
    count: 8,
    categories: [
      'security-governance',
      'compute-applications',
      'development-deployment'
    ]
  },
  {
    name: 'CodeArtifact',
    count: 1,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'CodeBuild',
    count: 1,
    categories: [
      'development-deployment'
    ]
  },
  {
    name: 'CodeDeploy',
    count: 4,
    categories: [
      'development-deployment',
      'migration'
    ]
  },
  {
    name: 'CodePipeline',
    count: 3,
    categories: [
      'compute-applications',
      'development-deployment'
    ]
  },
  {
    name: 'Cognito',
    count: 4,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'Control Tower',
    count: 3,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'Cost Explorer',
    count: 1,
    categories: [
      'analytics-operations'
    ]
  },
  {
    name: 'Direct Connect',
    count: 13,
    categories: [
      'networking'
    ]
  },
  {
    name: 'Directory Service',
    count: 1,
    categories: [
      'networking'
    ]
  },
  {
    name: 'Disaster Recovery',
    count: 2,
    categories: [
      'security-governance',
      'migration'
    ]
  },
  {
    name: 'DMS',
    count: 4,
    categories: [
      'migration'
    ]
  },
  {
    name: 'EBS',
    count: 1,
    categories: [
      'storage-database'
    ]
  },
  {
    name: 'EC2',
    count: 15,
    categories: [
      'networking',
      'compute-applications'
    ]
  },
  {
    name: 'ECR',
    count: 1,
    categories: [
      'compute-applications'
    ]
  },
  {
    name: 'ECS',
    count: 4,
    categories: [
      'security-governance',
      'compute-applications'
    ]
  },
  {
    name: 'EFA',
    count: 1,
    categories: [
      'compute-applications'
    ]
  },
  {
    name: 'EFS',
    count: 1,
    categories: [
      'storage-database'
    ]
  },
  {
    name: 'EKS',
    count: 1,
    categories: [
      'networking'
    ]
  },
  {
    name: 'ElastiCache',
    count: 2,
    categories: [
      'storage-database'
    ]
  },
  {
    name: 'ELB',
    count: 1,
    categories: [
      'compute-applications'
    ]
  },
  {
    name: 'ENI',
    count: 1,
    categories: [
      'networking'
    ]
  },
  {
    name: 'EventBridge',
    count: 5,
    categories: [
      'compute-applications',
      'development-deployment'
    ]
  },
  {
    name: 'Firewall Manager',
    count: 1,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'FIS',
    count: 1,
    categories: [
      'compute-applications'
    ]
  },
  {
    name: 'Gateway Load Balancer',
    count: 2,
    categories: [
      'networking',
      'compute-applications'
    ]
  },
  {
    name: 'Global Accelerator',
    count: 2,
    categories: [
      'content-delivery-dns'
    ]
  },
  {
    name: 'GuardDuty',
    count: 6,
    categories: [
      'networking',
      'security-governance',
      'development-deployment'
    ]
  },
  {
    name: 'Hyperplane',
    count: 1,
    categories: [
      'networking'
    ]
  },
  {
    name: 'IAM',
    count: 15,
    categories: [
      'security-governance',
      'compute-applications',
      'storage-database'
    ]
  },
  {
    name: 'Kinesis',
    count: 2,
    categories: [
      'analytics-operations'
    ]
  },
  {
    name: 'KMS',
    count: 5,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'Lambda',
    count: 5,
    categories: [
      'compute-applications'
    ]
  },
  {
    name: 'Migration Hub',
    count: 4,
    categories: [
      'migration'
    ]
  },
  {
    name: 'MSK',
    count: 1,
    categories: [
      'storage-database'
    ]
  },
  {
    name: 'NAT Gateway',
    count: 3,
    categories: [
      'networking'
    ]
  },
  {
    name: 'Nitro Enclaves',
    count: 1,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'NLB',
    count: 2,
    categories: [
      'compute-applications'
    ]
  },
  {
    name: 'OpenSearch',
    count: 3,
    categories: [
      'storage-database'
    ]
  },
  {
    name: 'OpsCenter',
    count: 1,
    categories: [
      'compute-applications'
    ]
  },
  {
    name: 'Organizations',
    count: 3,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'Prefix List',
    count: 2,
    categories: [
      'networking'
    ]
  },
  {
    name: 'RDS',
    count: 1,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'Redshift',
    count: 2,
    categories: [
      'storage-database',
      'analytics-operations'
    ]
  },
  {
    name: 'Route 53',
    count: 12,
    categories: [
      'networking',
      'content-delivery-dns'
    ]
  },
  {
    name: 'S3',
    count: 5,
    categories: [
      'networking',
      'storage-database'
    ]
  },
  {
    name: 'SAM',
    count: 1,
    categories: [
      'development-deployment'
    ]
  },
  {
    name: 'SAML Federation',
    count: 1,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'Security Hub',
    count: 2,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'Security Lake',
    count: 1,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'SQS',
    count: 2,
    categories: [
      'compute-applications'
    ]
  },
  {
    name: 'Storage Gateway',
    count: 1,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'STS',
    count: 1,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'Systems Manager',
    count: 6,
    categories: [
      'security-governance',
      'compute-applications'
    ]
  },
  {
    name: 'Transit Gateway',
    count: 13,
    categories: [
      'networking'
    ]
  },
  {
    name: 'Transit Gateway Route Analyzer',
    count: 1,
    categories: [
      'networking'
    ]
  },
  {
    name: 'VPC',
    count: 15,
    categories: [
      'networking',
      'security-governance',
      'compute-applications'
    ]
  },
  {
    name: 'VPC PrivateLink',
    count: 7,
    categories: [
      'networking',
      'compute-applications',
      'analytics-operations'
    ]
  },
  {
    name: 'VPC Traffic Mirroring',
    count: 1,
    categories: [
      'networking'
    ]
  },
  {
    name: 'VPN',
    count: 10,
    categories: [
      'networking',
      'security-governance'
    ]
  },
  {
    name: 'WAF',
    count: 1,
    categories: [
      'security-governance'
    ]
  },
  {
    name: 'Well-Architected',
    count: 1,
    categories: [
      'security-governance'
    ]
  }
];

// ドメインインデックス（自動生成）
const domainIndex = [
  {
    domainId: 1,
    count: 145,
    categories: [
      'networking',
      'security-governance',
      'compute-applications',
      'content-delivery-dns',
      'analytics-operations'
    ]
  },
  {
    domainId: 2,
    count: 247,
    categories: [
      'networking',
      'security-governance',
      'compute-applications',
      'content-delivery-dns',
      'development-deployment',
      'storage-database',
      'migration',
      'analytics-operations'
    ]
  },
  {
    domainId: 3,
    count: 161,
    categories: [
      'networking',
      'security-governance',
      'compute-applications',
      'content-delivery-dns',
      'development-deployment',
      'storage-database',
      'analytics-operations'
    ]
  },
  {
    domainId: 4,
    count: 12,
    categories: [
      'migration',
      'analytics-operations'
    ]
  }
];

// SAP-C02試験ドメイン
const examDomains = [
  {
    id: 1,
    title_ja: '組織の複雑さに対応するソリューションの設計',
    title_en: 'Design Solutions for Organizational Complexity',
    weight: '26%',
    icon: '🏢'
  },
  {
    id: 2,
    title_ja: '新しいソリューションの設計',
    title_en: 'Design for New Solutions',
    weight: '29%',
    icon: '🆕'
  },
  {
    id: 3,
    title_ja: '既存ソリューションの継続的な改善',
    title_en: 'Continuous Improvement for Existing Solutions',
    weight: '25%',
    icon: '🔄'
  },
  {
    id: 4,
    title_ja: 'ワークロードの移行とモダナイゼーション',
    title_en: 'Workload Migration and Modernization',
    weight: '20%',
    icon: '🚀'
  }
];

// 学習モード
const learningModes = [
  {
    id: 'beginner',
    title: '初学者向け',
    icon: '🌱',
    description: '初級リソース × 高優先度に絞り込み',
    filters: {
      difficulty: [
        'beginner'
      ],
      priority: [
        'high'
      ]
    }
  },
  {
    id: '30days',
    title: '試験まで30日',
    icon: '📅',
    description: '高・中優先度リソースで効率学習',
    filters: {
      priority: [
        'high',
        'medium'
      ]
    }
  },
  {
    id: 'last-minute',
    title: '直前復習',
    icon: '⚡',
    description: '高優先度リソースのみ集中表示',
    filters: {
      priority: [
        'high'
      ]
    }
  },
  {
    id: 'weakness',
    title: '弱点補強',
    icon: '🎯',
    description: 'カテゴリ・ドメインを選んで弱点対策',
    filters: {}
  },
  {
    id: 'networking-focus',
    title: 'ネットワーク集中',
    icon: '🌐',
    description: 'ネットワーキングカテゴリに絞り込み',
    filters: {
      category: 'networking'
    }
  },
  {
    id: 'security-focus',
    title: 'セキュリティ集中',
    icon: '🛡️',
    description: 'セキュリティ・ガバナンスに絞り込み',
    filters: {
      category: 'security-governance'
    }
  },
  {
    id: 'high-frequency',
    title: '高頻出論点',
    icon: '🔥',
    description: '高優先度リソースのみ集中表示',
    filters: {
      priority: [
        'high'
      ]
    }
  },
  {
    id: 'comparison',
    title: '比較問題重点',
    icon: '⚖️',
    description: 'comparisonタグ付きリソースに絞り込み',
    filters: {
      tags: [
        'comparison'
      ]
    }
  }
];

// 更新履歴データ
// type: 'content'(コンテンツ追加) | 'feature'(機能追加) | 'exam'(試験変更対応) | 'fix'(修正)
const updateHistory = [
  {
    date: '2026-04-24',
    type: 'content',
    title: '新規リソース追加: Amazon Q Developer 完全ガイド, SageMaker AI 推論エンドポイント 4種類完全図解',
    description: 'Amazon Q Developerの5大エージェント機能（/dev・/doc・/review・/test・/transform）を「ペアプロ仲間」のたとえ話で解説した初心者向けインフォグラフィックと、SageMaker AI 推論オプション4種類（リアルタイム・サーバーレス・非同期・バッチ変換）をレストラン業態のたとえ話で図解した完全ガイドを追加。',
    categories: [
      'development-deployment',
      'analytics-operations'
    ],
    tags: [
      'Amazon Q',
      'Generative AI',
      'SageMaker',
      'ML Inference',
      'Endpoint'
    ]
  },
  {
    date: '2026-03-28',
    type: 'content',
    title: '新規リソース追加: EIGW完全ガイド, DX Active/Passive BGP設定ガイド',
    description: 'Egress-Only Internet Gateway（IPv6出口専用ゲートウェイ）の仕組み・NAT Gatewayとの比較ガイドと、Direct ConnectにおけるActive/Passive BGP接続設定の完全ガイドを追加。',
    categories: [
      'networking'
    ],
    tags: [
      'EIGW',
      'IPv6',
      'Direct Connect',
      'BGP',
      'Active/Passive'
    ]
  },
  {
    date: '2026-03-28',
    type: 'content',
    title: '新規リソース追加: Direct Connect VIF 設定パラメータ完全ガイド',
    description: 'AWS Direct Connect Virtual Interface（VIF）の全設定パラメータを、Private/Public/Transit VIFの違いとともにホテル予約のたとえ話で図解。CLI設定例・試験対策も網羅。',
    categories: [
      'networking'
    ],
    tags: [
      'Direct Connect',
      'VIF',
      'BGP',
      'パラメータ'
    ]
  },
  {
    date: '2026-03-27',
    type: 'content',
    title: '4リソース追加 — Site-to-Site VPN IPv4/IPv6, Cloud WAN Attachment Policy, CloudWatch Agent VPC Endpoint, EC2ネットワークパフォーマンス',
    description: 'AWS Site-to-Site VPN IPv4/IPv6トラフィック完全ガイド、Cloud WANアタッチメントポリシー完全ガイド、CloudWatchエージェント×VPCエンドポイント完全ガイド、EC2ネットワークパフォーマンス完全ガイドの4件を追加。',
    categories: [
      'networking',
      'analytics-operations',
      'compute-applications'
    ],
    tags: [
      'Site-to-Site VPN',
      'IPv6',
      'Cloud WAN',
      'CloudWatch Agent',
      'VPC Endpoint',
      'EC2',
      'ネットワークパフォーマンス'
    ]
  },
  {
    date: '2026-03-23',
    type: 'content',
    title: 'ネットワーキング5リソース追加 — Network Firewallデプロイモデル, Cloud WANポリシールール, DXゲートウェイ許可プレフィックス, ファイアウォールデプロイメントモデル, TGW Network Manager',
    description: 'AWS Network Firewallデプロイモデル完全ガイド（分散型・集中型・複合型）、Cloud WANポリシールールと評価順序ガイド、Direct Connectゲートウェイ許可プレフィックスリスト完全ガイド、ファイアウォールデプロイメントモデル完全ガイド（シングルアーム vs デュアルアーム）、Transit Gateway Network Manager完全ガイドの5件を追加。',
    categories: [
      'networking'
    ],
    tags: [
      'Network Firewall',
      'Cloud WAN',
      'Direct Connect',
      'Transit Gateway',
      'デプロイモデル',
      'ポリシールール',
      'プレフィックスリスト',
      'Network Manager'
    ]
  },
  {
    date: '2026-03-21',
    type: 'content',
    title: '5リソース追加 — 証明書VPN認証, DX BGP 2VIF, TGWクロスアカウント, VPCエンドポイントDNS, WAN/SD-WAN',
    description: '証明書ベースVPN認証&ACM完全ガイド、Direct Connect BGPルーティング(2VIF構成)ガイド、Transit Gatewayクロスアカウント共有ガイド、VPCエンドポイントDNS動作ガイド、WAN・SD-WAN・Transit Gateway完全図解ガイドの5件を追加。',
    categories: [
      'security-governance',
      'networking'
    ],
    tags: [
      'VPN',
      'ACM',
      '証明書',
      'Direct Connect',
      'BGP',
      'Transit Gateway',
      'クロスアカウント',
      'VPCエンドポイント',
      'DNS',
      'SD-WAN',
      'WAN'
    ]
  },
  {
    date: '2026-03-14',
    type: 'content',
    title: 'ネットワーキング4リソース追加 — Local Zones, Cloud WAN静的ルーティング, DX SiteLink, TGWルーティング',
    description: 'AWS Local Zones完全ガイド、Cloud WANスタティックルーティング&セグメント共有ガイド、Direct Connect SiteLink完全ガイド、Transit Gatewayルーティング完全ガイドの4件を追加。',
    categories: [
      'networking'
    ],
    tags: [
      'Local Zones',
      'Cloud WAN',
      'Direct Connect',
      'SiteLink',
      'Transit Gateway',
      'ルーティング'
    ]
  },
  {
    date: '2026-03-10',
    type: 'content',
    title: '3リソース追加 — Global Accelerator IoT, E2E暗号化, VPC DNS設定',
    description: 'Global Accelerator×IoTデバイス接続ガイド、エンドツーエンド暗号化（CloudFront→ALB→EC2）ガイド、VPC DNS設定（enableDnsSupport/enableDnsHostnames）ガイドの3件を追加。',
    categories: [
      'content-delivery-dns',
      'security-governance',
      'networking'
    ],
    tags: [
      'Global Accelerator',
      'IoT',
      '暗号化',
      'CloudFront',
      'ALB',
      'VPC',
      'DNS'
    ]
  },
  {
    date: '2026-03-08',
    type: 'content',
    title: 'ネットワーキング・DNS 3リソース追加 — TGWマルチキャスト, NATタイムアウト, サブドメイン委任',
    description: 'Transit Gatewayマルチキャスト完全ガイド、NAT Gatewayタイムアウト動作ガイド、Route 53サブドメイン委任ガイドの3件を追加。',
    categories: [
      'networking',
      'content-delivery-dns'
    ],
    tags: [
      'Transit Gateway',
      'Multicast',
      'NAT Gateway',
      'Route 53',
      'DNS'
    ]
  },
  {
    date: '2026-02-28',
    type: 'content',
    title: 'ネットワーキング 8リソース追加 — DX, VPC, TGW ガイド群',
    description: 'Direct Connect Gateway/VGW/VIF, BGPコミュニティ, グローバルインフラ, プレフィックスリスト×RAM, スプリット/フルトンネルVPN, VPCパケットルーティング, トラフィックミラーリング vs Flow Logs, Route Analyzerの8件を追加。',
    categories: [
      'networking'
    ],
    tags: [
      'Direct Connect',
      'VGW',
      'BGP',
      'VPN',
      'VPC',
      'Transit Gateway',
      'Route Analyzer',
      'RAM'
    ]
  },
  {
    date: '2026-02-27',
    type: 'content',
    title: 'EC2 プレイスメントグループ 完全インフォグラフィック追加',
    description: 'EC2の3種プレイスメントグループ（Cluster・Spread・Partition）を網羅したインフォグラフィックを追加。概念マップにも比較表ダイアグラムとPartitionキーワードを追加。',
    categories: [
      'compute-applications'
    ],
    tags: [
      'EC2',
      'プレイスメントグループ',
      'HPC',
      'EFA'
    ]
  },
  {
    date: '2026-02-26',
    type: 'content',
    title: 'Black Belt PDF 4件を追加 — VPC, Site-to-Site VPN, Networking Fundamentals, Network Firewall',
    description: 'AWS Black Belt Online Seminar PDF資料をナレッジベースに追加。VPC (2020年10月)、Site-to-Site VPN (2021年10月)、Networking Fundamentals、Network Firewall Basic (2021年6月)。',
    categories: [
      'networking',
      'security-governance'
    ],
    tags: [
      'Black Belt',
      'PDF'
    ]
  },
  {
    date: '2026-02-24',
    type: 'content',
    title: '6リソースを統合（ネットワーキング・セキュリティ・コンテンツ配信・コンピュート）',
    description: 'AWS IPv6サポート完全ガイド・DNS64/NAT64・Cloud WAN/TGWルート分離（networking）、Firewall Manager SGポリシー（security-governance）、CloudFrontオリジンフェイルオーバー（content-delivery-dns）、NLBターゲットタイプ（compute-applications）を統合。',
    categories: [
      'networking',
      'security-governance',
      'content-delivery-dns',
      'compute-applications'
    ],
    tags: [
      '新リソース'
    ]
  },
  {
    date: '2026-02-22',
    type: 'content',
    title: 'ネットワーキング系4リソースを統合',
    description: 'VPCフローログフィールドガイド・GWLB DPI・VPCデュアルスタック（networking新規3本）、BGPルート選択ガイド更新（networking既存1本）を統合。',
    categories: [
      'networking'
    ],
    tags: [
      '新リソース'
    ]
  },
  {
    date: '2026-02-21',
    type: 'feature',
    title: 'AWS概念マップ エンジン 初期リリース',
    description: '5階層知識エンジン（設計軸→ドメイン→サービス→概念→キーワード）・設計軸タグフィルタ・横断検索・クロスリンクバッジを追加。Route53・VPC・EC2・S3・RDS・Lambda・ELB・CloudFront・IAM・CloudWatch 10サービスを収録。',
    categories: [
      'networking',
      'new-solutions',
      'cost-optimization',
      'organizational-complexity'
    ],
    tags: [
      '新機能',
      '概念マップ',
      'SAP対策'
    ]
  },
  {
    date: '2026-02-21',
    type: 'content',
    title: 'ネットワーキング・DNS・セキュリティ系5リソースを統合',
    description: 'VPC CNI・BGPルート選択（networking）、Route53 DNSSEC・DNS Firewallボットネット対策（content-delivery-dns）、ボットネットC2保護ガイド（security-governance）を追加。BlackBelt VPC PDF資料も追加。',
    categories: [
      'networking',
      'content-delivery-dns',
      'security-governance'
    ],
    tags: [
      '新サービス'
    ]
  },
  {
    date: '2026-02-19',
    type: 'fix',
    title: 'サイドバーTOC欠落バグを修正',
    description: 'div.section-titleをh2タグに変換してTOC生成が正常動作するよう修正、integrateスクリプトに警告を追加',
    categories: [
      'all'
    ],
    tags: []
  },
  {
    date: '2026-02-18',
    type: 'feature',
    title: 'W3C自動検証・git自動ステージング機能を追加',
    description: 'integrate_resource_complete.py にW3C Validator API連携とgit addの自動実行を統合',
    categories: [
      'all'
    ],
    tags: []
  },
  {
    date: '2026-02-18',
    type: 'content',
    title: 'ネットワーキング・DNS系リソースを統合',
    description: 'CIDRブロック・VPC接続ガイド、AWS Hyperplaneガイド、Route 53 Resolver DNS Firewallガイドを追加',
    categories: [
      'networking',
      'content-delivery-dns'
    ],
    tags: [
      '新サービス'
    ]
  },
  {
    date: '2026-02-18',
    type: 'feature',
    title: '既存リソースにパンくずリスト・サイドバーTOC・ナビゲーションを追加',
    description: 'compute-applications/networking/security-governance の8ファイルに共通ナビゲーション要素を付与',
    categories: [
      'networking',
      'compute-applications',
      'security-governance'
    ],
    tags: []
  },
  {
    date: '2026-02-17',
    type: 'feature',
    title: '更新履歴タイムライン・コンテンツ鮮度バッジ機能を追加',
    description: 'index.htmlに更新履歴タイムラインとリソースカードへの鮮度バッジ表示機能を追加',
    categories: [
      'all'
    ],
    tags: []
  },
  {
    date: '2026-02-16',
    type: 'feature',
    title: '優先度別リソースグルーピング機能を追加',
    description: 'カテゴリ内リソースを優先度別にグループ分け表示',
    categories: [
      'all'
    ],
    tags: []
  },
  {
    date: '2026-02-16',
    type: 'fix',
    title: 'ACM/CloudWAN ガイドの表示修正',
    description: 'acm-alb-ec2-tls-guide にCSS link追加、cloud-wan-attachment-policy-guide のタイトル色修正',
    categories: [
      'content-delivery-dns',
      'networking'
    ],
    tags: []
  },
  {
    date: '2026-02-15',
    type: 'content',
    title: 'ネットワーキング・コンピュート・セキュリティ系8リソースを統合',
    description: 'GuardDutyトラフィック分析、ELBガイド、NLB mTLS、PrivateLinkガイド等を追加',
    categories: [
      'networking',
      'compute-applications',
      'security-governance'
    ],
    tags: [
      '新サービス'
    ]
  },
  {
    date: '2026-02-14',
    type: 'content',
    title: 'AWS ANS試験サンプル問題10問を追加',
    description: 'ネットワーキングカテゴリにANS試験対策クイズを追加',
    categories: [
      'networking'
    ],
    tags: []
  },
  {
    date: '2026-02-13',
    type: 'feature',
    title: 'レスポンシブデザイン改善・ハンバーガーメニュー追加',
    description: 'モバイル対応のハンバーガーメニュー、WCAG対応、インラインCSS整理',
    categories: [
      'all'
    ],
    tags: []
  },
  {
    date: '2026-02-12',
    type: 'content',
    title: 'ネットワーキング・コンピュート系15リソースを統合',
    description: 'VPN/Direct Connect/GWLB等のネットワーキング系リソースを大量追加',
    categories: [
      'networking',
      'compute-applications'
    ],
    tags: [
      '新サービス'
    ]
  },
  {
    date: '2026-02-08',
    type: 'content',
    title: 'Black Belt Transit Gateway Deep Dive資料を追加',
    description: 'ナレッジベースにAWS Black Belt 2025年1月版を追加',
    categories: [
      'networking'
    ],
    tags: []
  },
  {
    date: '2026-02-05',
    type: 'feature',
    title: 'SAP-C02試験ガイドページを追加',
    description: 'ドメイン別タスク・知識・スキル・関連リソースの試験ガイドを新規作成',
    categories: [
      'analytics-operations'
    ],
    tags: [
      'AWS試験変更対応'
    ]
  },
  {
    date: '2026-02-02',
    type: 'feature',
    title: '学習ロードマップ・ブックマーク機能を追加',
    description: '経験レベル別4週間学習ロードマップ、localStorage永続化ブックマーク機能',
    categories: [
      'all'
    ],
    tags: []
  },
  {
    date: '2026-01-31',
    type: 'content',
    title: '新規AWS学習リソース11件を統合',
    description: 'Transit Gateway Deep Dive、Route 53プライベートホストゾーン、Redshift Data Sharing等',
    categories: [
      'networking',
      'content-delivery-dns',
      'storage-database',
      'compute-applications'
    ],
    tags: [
      '新サービス'
    ]
  },
  {
    date: '2026-01-10',
    type: 'content',
    title: 'セキュリティ・ネットワーキング系20リソースを追加',
    description: 'KMS、Well-Architected、Config、CloudTrail、ACM等の完全ガイドを追加',
    categories: [
      'security-governance',
      'networking',
      'content-delivery-dns'
    ],
    tags: []
  },
  {
    date: '2026-01-03',
    type: 'content',
    title: 'セキュリティ・コンピュート系12リソースを追加',
    description: 'Inspector、CloudTrail、EKS、IAM Identity Center等の完全ガイドを追加',
    categories: [
      'security-governance',
      'compute-applications',
      'networking'
    ],
    tags: []
  }
];
