// AWS SAP クイズデータベース - 大幅拡張版
const quizData = {
    networking: {
        title: "ネットワーキング",
        icon: "🌐", 
        questions: [
            {
                id: 1,
                question: "VPC Peering接続に関する正しい説明はどれですか？",
                options: [
                    "異なるリージョン間でも接続可能で、推移的ルーティングをサポートする",
                    "異なるリージョン間でも接続可能だが、推移的ルーティングはサポートしない", 
                    "同一リージョン内のみで接続可能で、推移的ルーティングをサポートする",
                    "同一リージョン内のみで接続可能で、推移的ルーティングはサポートしない"
                ],
                correct: 1,
                explanation: "VPC Peeringは異なるリージョン間でも接続可能ですが、推移的ルーティング（A→B→Cの間接接続）はサポートしていません。各VPC間で個別にPeering接続を設定する必要があります。"
            },
            {
                id: 2,
                question: "AWS Direct Connectの専用線接続で、冗長性を確保するためのベストプラクティスは？",
                options: [
                    "同一ロケーションに2本の専用線を設置する",
                    "異なるロケーションに2本の専用線を設置する",
                    "1本の専用線とVPN接続を組み合わせる",
                    "Direct Connect Gatewayを使用する"
                ],
                correct: 1,
                explanation: "冗長性を確保するには、異なるDirect Connectロケーションに2本の専用線を設置することがベストプラクティスです。同一ロケーションでは施設全体の障害時にすべての接続が影響を受けます。"
            },
            {
                id: 3,
                question: "VPC PrivateLinkの主な利点は何ですか？",
                options: [
                    "インターネットを経由せずにAWSサービスにアクセスできる",
                    "VPC間の推移的ルーティングが可能になる",
                    "ネットワークの帯域幅が向上する",
                    "NAT Gatewayが不要になる"
                ],
                correct: 0,
                explanation: "VPC PrivateLinkの主な利点は、インターネットを経由せずにAWSサービスや他のVPCのサービスに安全にアクセスできることです。トラフィックはAWSネットワーク内にとどまります。"
            },
            {
                id: 4,
                question: "Transit Gatewayに関する正しい説明はどれですか？",
                options: [
                    "最大10個のVPCを接続できる",
                    "同一リージョン内のリソースのみ接続可能",
                    "推移的ルーティングをサポートし、ルートテーブルで制御できる",
                    "Direct Connect接続はサポートしていない"
                ],
                correct: 2,
                explanation: "Transit Gatewayは推移的ルーティングをサポートし、ルートテーブルを使って詳細な接続制御ができます。最大5,000個のVPCを接続でき、Direct Connect接続もサポートしています。"
            },
            {
                id: 5,
                question: "Site-to-Site VPN接続で高可用性を実現するための構成は？",
                options: [
                    "1つのCustomer Gatewayと1つのVPN接続",
                    "1つのCustomer Gatewayと2つのVPN接続",
                    "2つのCustomer Gatewayと2つのVPN接続",
                    "2つのCustomer Gatewayと1つのVPN接続"
                ],
                correct: 2,
                explanation: "高可用性を実現するには、2つの独立したCustomer Gateway（異なる場所またはデバイス）に対してそれぞれVPN接続を設定し、合計2つのVPN接続を使用することが推奨されます。"
            },
            {
                id: 6,
                question: "AWS PrivateLink VPC Endpointと NAT Gatewayの適切な使い分けは？",
                options: [
                    "すべてのインターネット通信にPrivateLink VPC Endpointを使用する",
                    "AWS APIs にはVPC Endpoint、サードパーティAPIには NAT Gatewayを使用する",
                    "コスト削減のため常にNAT Gatewayを使用する",
                    "セキュリティのため常にPrivateLink VPC Endpointを使用する"
                ],
                correct: 1,
                explanation: "VPC EndpointはAWS APIへの通信をプライベートネットワーク内で完結させ、NAT GatewayはサードパーティAPIやインターネットリソースへのアクセスに使用します。適切な使い分けでコストとセキュリティを最適化できます。"
            },
            {
                id: 7,
                question: "Direct Connect + VPN のハイブリッド構成の利点は？",
                options: [
                    "帯域幅が2倍になる",
                    "Direct Connectの冗長性確保とトラフィック暗号化の両立",
                    "設定が簡単になる",
                    "コストが半分になる"
                ],
                correct: 1,
                explanation: "Direct Connect + VPN構成では、Direct Connectの冗長性を確保しつつ、VPNによってトラフィックを暗号化できます。金融機関など高いセキュリティ要件がある場合に適用されます。"
            },
            {
                id: 8,
                question: "ENI (Elastic Network Interface) のホットアタッチの利点は？",
                options: [
                    "ネットワークパフォーマンスが向上する",
                    "インスタンス停止なしでネットワーク設定を変更できる",
                    "複数のサブネットに同時接続できる",
                    "自動的にロードバランシングされる"
                ],
                correct: 1,
                explanation: "ENIのホットアタッチにより、実行中のインスタンスを停止することなく、追加のネットワークインターフェースをアタッチして、IPアドレスやセキュリティグループを動的に変更できます。"
            },
            {
                id: 9,
                question: "VPC Flow Logsの分析に最適なサービス組み合わせは？",
                options: [
                    "CloudWatch Logs + CloudWatch Insights",
                    "S3 + Athena + QuickSight",
                    "Kinesis Data Streams + Lambda",
                    "ElasticSearch + Kibana"
                ],
                correct: 1,
                explanation: "大量のVPC Flow LogsをS3に保存し、Athenaでクエリ分析、QuickSightで可視化する組み合わせが、コスト効率とスケーラビリティの両面で最適です。"
            },
            {
                id: 10,
                question: "Network Load Balancer (NLB) と Application Load Balancer (ALB) の使い分けは？",
                options: [
                    "すべての場合でALBを使用する",
                    "極低レイテンシとstatic IPが必要な場合はNLB、HTTP/HTTPSと高度なルーティングが必要な場合はALB",
                    "コスト重視の場合はNLB、機能重視の場合はALB",
                    "内部向けはNLB、外部向けはALB"
                ],
                correct: 1,
                explanation: "NLBは極低レイテンシ（マイクロ秒単位）とstatic IP要件に適し、ALBはHTTP/HTTPSの高度なルーティング（パスベース、ホストベース）と AWS WAF連携に適しています。"
            },
            {
                id: 11,
                question: "VPC Lattice の主な用途とメリットは？",
                options: [
                    "VPC Peering の代替のみ",
                    "マイクロサービス間の通信を簡素化するサービスメッシュ: 複数VPC/アカウントのサービスを統一的な検出・認証・アクセス制御で接続",
                    "インターネットゲートウェイの代替",
                    "NAT Gateway の高速版"
                ],
                correct: 1,
                explanation: "VPC Lattice（2023年リリース）は、アプリケーションレイヤー（L7）サービスメッシュです。複数VPC、複数アカウント、オンプレミスにまたがるマイクロサービスを、サービス名ベースで検出・接続し、統一的な認証（IAM、SigV4）、きめ細かいアクセス制御、L7ロードバランシング、詳細な可観測性を提供します。従来のVPC Peering、Transit Gateway、PrivateLinkの複雑な組み合わせを簡素化します。"
            }
        ]
    },
    "security-governance": {
        title: "セキュリティ・ガバナンス",
        icon: "🔒",
        questions: [
            {
                id: 1,
                question: "IAM Roleの一時的な認証情報について正しい説明はどれですか？",
                options: [
                    "デフォルトで24時間有効で、最大7日間まで延長可能",
                    "デフォルトで1時間有効で、最大12時間まで延長可能",
                    "デフォルトで1時間有効で、最大36時間まで延長可能",
                    "デフォルトで12時間有効で、最大7日間まで延長可能"
                ],
                correct: 1,
                explanation: "IAM Roleの一時的な認証情報は、デフォルトで1時間有効です。AssumeRole APIを使用する場合、DurationSecondsパラメータで最大12時間（43,200秒）まで延長できます。"
            },
            {
                id: 2,
                question: "AWS Organizations SCPの適用に関する正しい説明は？",
                options: [
                    "マスターアカウントにもSCPが適用される",
                    "SCPは許可リスト（Allow）として機能する",
                    "SCPは拒否リスト（Deny）として機能し、IAMポリシーと組み合わせて評価される",
                    "SCPは個別のIAMユーザーに直接適用できる"
                ],
                correct: 2,
                explanation: "SCP（Service Control Policy）は拒否リスト（ガードレール）として機能し、IAMポリシーの許可があってもSCPで拒否されていれば実行できません。マスターアカウントには適用されません。"
            },
            {
                id: 3,
                question: "AWS WAFのマネージドルールグループの利点は？",
                options: [
                    "カスタムルールよりも処理速度が速い",
                    "AWSが自動的に更新・保守してくれる",
                    "無料で利用できる",
                    "すべてのAWSサービスで利用できる"
                ],
                correct: 1,
                explanation: "AWS WAFのマネージドルールグループは、AWSやMarketplaceの専門家が作成・保守し、新しい脅威に対して自動的に更新されるため、運用負荷を軽減できます。"
            },
            {
                id: 4,
                question: "CloudTrailのデータイベントとマネジメントイベントの違いは？",
                options: [
                    "データイベントは無料、マネジメントイベントは有料",
                    "マネジメントイベントは無料、データイベントは有料",
                    "両方とも有料だが、データイベントの方が高額",
                    "両方とも無料で利用できる"
                ],
                correct: 1,
                explanation: "CloudTrailのマネジメントイベント（API呼び出し等）は各リージョンで無料ですが、データイベント（S3オブジェクトアクセス等）は有料です。"
            },
            {
                id: 5,
                question: "AWS Configルールの評価タイミングについて正しいのは？",
                options: [
                    "設定変更時のトリガー評価のみ",
                    "定期評価のみ",
                    "設定変更時のトリガー評価と定期評価の両方が可能",
                    "手動実行のみ"
                ],
                correct: 2,
                explanation: "AWS Configルールは、リソースの設定変更時にトリガーされる評価と、指定した間隔での定期評価の両方をサポートしています。ルールの種類に応じて適切な評価方法を選択できます。"
            },
            {
                id: 6,
                question: "AWS GuardDutyの機械学習による脅威検出の仕組みは？",
                options: [
                    "事前定義されたルールのみを使用",
                    "過去の攻撃パターンを学習し、異常なネットワーク活動やAPIコールを検出",
                    "ユーザーが手動で設定した条件のみ監視",
                    "CloudTrailログのみを分析"
                ],
                correct: 1,
                explanation: "GuardDutyは機械学習、異常検出、脅威インテリジェンスを組み合わせて、VPC Flow Logs、DNS logs、CloudTrail logsを分析し、未知の脅威や異常な行動パターンを自動検出します。"
            },
            {
                id: 7,
                question: "AWS Systems Manager Parameter Store と Secrets Manager の使い分けは？",
                options: [
                    "すべての設定値にSecrets Managerを使用",
                    "機密情報（パスワード、APIキー）はSecrets Manager、設定値はParameter Store",
                    "コスト削減のため常にParameter Storeを使用",
                    "外部システム連携時のみSecrets Managerを使用"
                ],
                correct: 1,
                explanation: "Secrets Managerは自動ローテーション機能とクロスサービス統合に優れ、Parameter Storeは階層化された設定管理に適しています。機密レベルと必要機能に応じて使い分けます。"
            },
            {
                id: 8,
                question: "AWS Macie の機能と主な用途は？",
                options: [
                    "ネットワークトラフィックの監視",
                    "S3内の機密データ（PII）を自動検出・分類し、データ保護ポリシーを適用",
                    "EC2インスタンスのマルウェアスキャン",
                    "IAMポリシーの自動生成"
                ],
                correct: 1,
                explanation: "AWS Macieは機械学習を使用してS3内の個人識別情報（PII）や機密データを自動で検出・分類し、データプライバシー規制のコンプライアンス維持を支援します。"
            },
            {
                id: 9,
                question: "AWS Security Hub の統合セキュリティ管理機能は？",
                options: [
                    "単一のAWSサービスのみ監視",
                    "複数のAWSセキュリティサービスとサードパーティツールの findings を一元管理",
                    "インシデント対応の自動実行",
                    "セキュリティポリシーの自動生成"
                ],
                correct: 1,
                explanation: "Security Hubは GuardDuty、Inspector、Macie等のAWSセキュリティサービスと、サードパーティセキュリティツールの検出結果を統合し、一元的なセキュリティ態勢管理を提供します。"
            },
            {
                id: 10,
                question: "AWS Inspector V2 の脆弱性評価の対象は？",
                options: [
                    "EC2インスタンスの OS脆弱性のみ",
                    "EC2インスタンスとECRコンテナイメージの脆弱性を継続的に評価",
                    "S3バケットの設定不備のみ",
                    "ネットワーク設定の脆弱性のみ"
                ],
                correct: 1,
                explanation: "Inspector V2は EC2インスタンスのOS・アプリケーション脆弱性と、ECRに保存されたコンテナイメージの脆弱性を継続的にスキャンし、CVE情報との照合により脆弱性を特定します。"
            },
            {
                id: 11,
                question: "金融機関がPCI-DSS準拠のマルチリージョンアプリケーションをAWSで構築する際、必須のセキュリティ対策の組み合わせは？",
                options: [
                    "VPC + セキュリティグループのみ",
                    "VPC Flow Logs + GuardDuty + CloudTrail + Config Rules + KMS暗号化 + マルチリージョンレプリケーション + 定期的な侵入テスト",
                    "IAMのみ",
                    "WAF + Shield Standard のみ"
                ],
                correct: 1,
                explanation: "PCI-DSS準拠には包括的なセキュリティ対策が必須: ①ネットワーク分離（VPC）、②ロギング（CloudTrail全リージョン、VPC Flow Logs、Config）、③脅威検出（GuardDuty、Security Hub）、④暗号化（KMS、転送時・保管時暗号化）、⑤アクセス制御（IAM、MFA）、⑥コンプライアンス監視（Config Rules、Audit Manager）、⑦定期侵入テスト。AWS Artifact でPCI-DSSコンプライアンスレポートを入手できます。"
            }
        ]
    },
    "compute-applications": {
        title: "コンピュート・アプリケーション",
        icon: "💻",
        questions: [
            {
                id: 1,
                question: "EC2 Auto Scalingの予測スケーリングについて正しい説明は？",
                options: [
                    "過去のメトリクスデータに基づいて将来の需要を予測し、事前にスケーリングする",
                    "現在のCPU使用率に基づいてリアルタイムでスケーリングする", 
                    "手動で設定したスケジュールに基づいてスケーリングする",
                    "ターゲット追跡スケーリングと同じ機能"
                ],
                correct: 0,
                explanation: "予測スケーリングは、過去のトラフィックパターンをAIが学習し、将来の需要を予測して事前にインスタンスをスケーリングする機能です。需要の急激な変化に対応できます。"
            },
            {
                id: 2,
                question: "AWS Lambdaの同時実行数制限について正しいのは？",
                options: [
                    "アカウント全体で1,000まで（デフォルト）で、関数ごとに予約可能",
                    "関数ごとに1,000まで、アカウント全体の制限はなし",
                    "アカウント全体で10,000まで（デフォルト）で、変更不可",
                    "制限はなく、無制限に同時実行可能"
                ],
                correct: 0,
                explanation: "Lambdaの同時実行数は、リージョンごとにデフォルト1,000まで（引き上げ申請可能）で、特定の関数に予約済み同時実行数を設定することで安定性を確保できます。"
            },
            {
                id: 3,
                question: "ECS Fargateの特徴として正しいのは？",
                options: [
                    "EC2インスタンスの管理が必要で、コストが安い",
                    "サーバーレスでEC2インスタンスの管理が不要だが、コストが高い",
                    "オンデマンドでのスケーリングができない",
                    "Dockerコンテナをサポートしていない"
                ],
                correct: 1,
                explanation: "ECS Fargateはサーバーレスのコンテナ実行環境で、EC2インスタンスの管理が不要です。EC2起動タイプより単価は高いですが、運用コストを削減できます。"
            },
            {
                id: 4,
                question: "Systems Manager Session Managerの利点は？",
                options: [
                    "SSH/RDPのポートを開く必要がある",
                    "インスタンスにパブリックIPアドレスが必要",
                    "IAMベースのアクセス制御とセッションログが可能",
                    "追加料金が発生する"
                ],
                correct: 2,
                explanation: "Session ManagerはIAMロールベースでアクセス制御でき、セッションログを記録可能です。SSH/RDPポートを開く必要がなく、パブリックIPも不要で、追加料金もかかりません。"
            },
            {
                id: 5,
                question: "EventBridgeのカスタムイベントバスの用途は？",
                options: [
                    "AWSサービス間のイベントルーティングのみ",
                    "サードパーティアプリケーションやカスタムアプリケーションのイベント管理",
                    "CloudWatch Eventsの完全な置き換え",
                    "Lambda関数のトリガーのみ"
                ],
                correct: 1,
                explanation: "カスタムイベントバスは、サードパーティアプリケーションや独自のアプリケーションからのイベントを管理するために使用します。デフォルトイベントバスとは分離してイベントを管理できます。"
            },
            {
                id: 6,
                question: "AWS Batch の適用場面として最適なのは？",
                options: [
                    "リアルタイムWebアプリケーション",
                    "大規模な並列バッチ処理（HPC、機械学習トレーニング）",
                    "小規模な定期実行タスク",
                    "ユーザー向けのAPI処理"
                ],
                correct: 1,
                explanation: "AWS Batchは数千のコンピュートコアを使用する大規模並列処理に最適化されており、科学計算、金融リスク分析、機械学習モデルトレーニングなどのHPCワークロードに適しています。"
            },
            {
                id: 7,
                question: "ECS Service の Auto Scaling における Target Tracking の利点は？",
                options: [
                    "手動設定が不要",
                    "指定したメトリクス値を維持するように自動調整し、急激なスケーリングを抑制",
                    "常に最大容量で実行",
                    "コストが最も安くなる"
                ],
                correct: 1,
                explanation: "Target Tracking スケーリングは指定した目標値（CPU使用率70%など）を維持するように滑らかにスケーリングし、急激な変動を抑制してアプリケーションの安定性を保ちます。"
            },
            {
                id: 8,
                question: "AWS App Runner の特徴と適用場面は？",
                options: [
                    "コンテナオーケストレーションが必要な複雑なアプリケーション",
                    "ソースコードから直接WebアプリケーションやAPIをフルマネージドで実行",
                    "大規模バッチ処理",
                    "データベース管理"
                ],
                correct: 1,
                explanation: "App Runnerはソースコードまたはコンテナイメージから自動的にWebアプリケーションを構築・デプロイ・実行するフルマネージドサービスで、インフラ管理が不要です。"
            },
            {
                id: 9,
                question: "Lambda の Provisioned Concurrency の用途は？",
                options: [
                    "コストを削減する",
                    "コールドスタートを回避し、一貫した低レイテンシを実現",
                    "同時実行数を制限する",
                    "メモリ使用量を最適化する"
                ],
                correct: 1,
                explanation: "Provisioned Concurrencyは指定した数のLambda実行環境を事前に準備することで、コールドスタートによるレイテンシを排除し、一貫したパフォーマンスを提供します。"
            },
            {
                id: 10,
                question: "EKS Fargate と EKS on EC2 の使い分けは？",
                options: [
                    "常にFargateを使用する",
                    "運用負荷軽減重視ならFargate、コスト最適化とカスタマイズ性重視ならEC2",
                    "小規模アプリはFargate、大規模アプリはEC2",
                    "パブリック向けはFargate、プライベート向けはEC2"
                ],
                correct: 1,
                explanation: "Fargateはサーバーレスでノード管理が不要ですが単価が高く、EC2はノード管理が必要ですがコスト効率とカスタマイズ性に優れます。要件に応じて選択します。"
            },
            {
                id: 11,
                question: "Lambda の Provisioned Concurrency と Reserved Concurrency の使い分けは？",
                options: [
                    "両方とも同じ機能",
                    "Provisioned: コールドスタート排除（事前初期化）、Reserved: 特定関数の同時実行数を確保（他関数のスロットル防止）",
                    "Provisioned は本番環境のみ、Reserved は開発環境のみ",
                    "コスト削減には両方とも不要"
                ],
                correct: 1,
                explanation: "Provisioned Concurrency は関数を事前に初期化・ウォーム状態に保ち、コールドスタート遅延（数秒）をゼロにします。レイテンシが重要なAPI、Alexaスキル等で使用。Reserved Concurrency は特定関数に同時実行枠を予約し、他の関数がアカウント全体の同時実行制限を使い切っても、その関数は確実に実行されるよう保証します。用途が異なるため、併用も可能です。"
            }
        ]
    },
    "content-delivery-dns": {
        title: "コンテンツ配信・DNS",
        icon: "🌍",
        questions: [
            {
                id: 1,
                question: "CloudFront Origin Groupsの主な用途は？",
                options: [
                    "複数のオリジンの負荷分散",
                    "プライマリオリジンの障害時にセカンダリオリジンへの自動フェイルオーバー",
                    "キャッシュパフォーマンスの向上",
                    "セキュリティの強化"
                ],
                correct: 1,
                explanation: "Origin Groupsは、プライマリオリジンが利用できない場合にセカンダリオリジンに自動的にフェイルオーバーする高可用性機能です。"
            },
            {
                id: 2,
                question: "Route53のエイリアスレコードとCNAMEレコードの違いは？",
                options: [
                    "エイリアスレコードは有料、CNAMEレコードは無料",
                    "エイリアスレコードはゾーンapexで使用可能、CNAMEレコードは使用不可",
                    "CNAMEレコードの方が高速",
                    "機能的な違いはない"
                ],
                correct: 1,
                explanation: "エイリアスレコードはゾーンapex（example.com）で使用でき、AWSリソースへのマッピングは無料です。CNAMEレコードはゾーンapexでは使用できません。"
            },
            {
                id: 3,
                question: "S3 Transfer Accelerationの仕組みは？",
                options: [
                    "S3バケット内でのマルチパートアップロードを自動化",
                    "CloudFrontエッジロケーションを経由してS3への転送を高速化",
                    "複数のS3リージョンに並列アップロード",
                    "データ圧縮による転送量削減"
                ],
                correct: 1,
                explanation: "S3 Transfer AccelerationはCloudFrontのエッジロケーションを利用し、世界中からS3バケットへの転送を高速化する機能です。"
            },
            {
                id: 4,
                question: "Route53のヘルスチェックで監視できる項目は？",
                options: [
                    "HTTPエンドポイントのみ",
                    "HTTPエンドポイント、TCP接続、計算されたヘルスチェック",
                    "AWSリソースの内部状態のみ",
                    "CloudWatchアラームのみ"
                ],
                correct: 1,
                explanation: "Route53ヘルスチェックは、HTTPエンドポイント、TCP接続、他のヘルスチェックを組み合わせた計算されたヘルスチェック、CloudWatchアラームを監視できます。"
            },
            {
                id: 5,
                question: "S3 Multi-Region Access Points (MRAP)の利点は？",
                options: [
                    "単一のエンドポイントで複数リージョンのS3バケットにアクセス可能",
                    "S3のストレージコストが削減される",
                    "データ転送速度が向上する", 
                    "S3バケットの暗号化が自動化される"
                ],
                correct: 0,
                explanation: "S3 MRAPは単一のグローバルエンドポイントを提供し、複数リージョンのS3バケットに自動的にルーティングします。最も近いリージョンまたは最適なリージョンにリクエストを転送します。"
            },
            {
                id: 6,
                question: "CloudFront の Origin Access Control (OAC) と Origin Access Identity (OAI) の違いは？",
                options: [
                    "機能は同じで名称のみ異なる",
                    "OACは新しい認証方式でSigV4をサポートし、より多くのAWSサービスと統合可能",
                    "OAIの方が高速",
                    "OACは有料、OAIは無料"
                ],
                correct: 1,
                explanation: "OAC（Origin Access Control）はOAIの後継で、Signature Version 4認証をサポートし、S3以外のAWSサービス（EventBridge、Lambda等）との統合も可能な、より汎用的なアクセス制御機能です。"
            },
            {
                id: 7,
                question: "Route53 Resolver Rules の用途は？",
                options: [
                    "外部DNSへのクエリのみ処理",
                    "VPCからオンプレミスDNSへの条件付きフォワーディング設定",
                    "Route53ホストゾーンの管理",
                    "CloudFrontのDNSキャッシュ設定"
                ],
                correct: 1,
                explanation: "Resolver Rulesはハイブリッド環境で、特定のドメイン名クエリをオンプレミスDNSサーバーに転送するための条件付きフォワーディングルールを設定します。"
            },
            {
                id: 8,
                question: "S3 の Intelligent Tiering の動作原理は？",
                options: [
                    "手動でストレージクラスを変更する",
                    "アクセスパターンを分析し、自動的に最適なストレージクラスに移動",
                    "すべてのオブジェクトを最安のクラスに保存",
                    "アクセス頻度に関係なく一定期間で移動"
                ],
                correct: 1,
                explanation: "S3 Intelligent Tieringはオブジェクトのアクセスパターンを機械学習で分析し、アクセス頻度に基づいて自動的に最適なストレージクラス（Frequent/Infrequent/Archive）間を移動します。"
            },
            {
                id: 9,
                question: "Global Accelerator と CloudFront の使い分けは？",
                options: [
                    "すべての場合でCloudFrontを使用",
                    "静的コンテンツ配信はCloudFront、TCP/UDPアプリケーションや地理的ルーティングはGlobal Accelerator",
                    "内部向けはGlobal Accelerator、外部向けはCloudFront",
                    "コスト重視はCloudFront、性能重視はGlobal Accelerator"
                ],
                correct: 1,
                explanation: "CloudFrontはHTTPSコンテンツ配信とキャッシュに特化し、Global AcceleratorはTCP/UDPトラフィックの最適化とヘルスチェックベースのフェイルオーバーに適しています。"
            },
            {
                id: 10,
                question: "Route53 Application Recovery Controller (ARC) の機能は？",
                options: [
                    "DNS設定の自動バックアップ",
                    "アプリケーションレベルの可用性監視と自動フェイルオーバー制御",
                    "Route53の料金最適化",
                    "DNSクエリの高速化"
                ],
                correct: 1,
                explanation: "ARC（Application Recovery Controller）はアプリケーションの可用性を監視し、リージョン障害時に readiness check と routing control により、確実で制御されたフェイルオーバーを実現します。"
            },
            {
                id: 11,
                question: "CloudFront の Field-Level Encryption の用途は？",
                options: [
                    "エッジロケーションでHTTPS接続を終端",
                    "特定のフィールド（クレジットカード番号等）をエッジで公開鍵暗号化し、オリジンまで暗号化状態を維持",
                    "オブジェクト全体の圧縮",
                    "キャッシュヒット率の向上"
                ],
                correct: 1,
                explanation: "Field-Level Encryptionは、POSTリクエスト内の特定フィールドをCloudFrontエッジで暗号化し、アプリケーションまで暗号化状態を保持します。PCI-DSSなど厳格なコンプライアンス要件で、機密データへのアクセスを最小限の権限者に限定できます。"
            },
            {
                id: 12,
                question: "Route53 Traffic Flow の主な利点は？",
                options: [
                    "DNS クエリの高速化",
                    "複雑なルーティングポリシー（地理的、レイテンシ、加重、フェイルオーバーの組み合わせ）をビジュアルエディタで簡単に構築",
                    "ドメイン登録の自動化",
                    "DNSSEC署名の自動設定"
                ],
                correct: 1,
                explanation: "Traffic Flowは、地理的ルーティング、レイテンシベースルーティング、加重ルーティング、ヘルスチェックを組み合わせた複雑なトラフィック管理ポリシーをビジュアルエディタで作成し、複数のホストゾーンに適用できる機能です。"
            },
            {
                id: 13,
                question: "CloudFront の Lambda@Edge と CloudFront Functions の使い分けは？",
                options: [
                    "機能は同じで名称のみ異なる",
                    "Lambda@Edge: 複雑な処理（外部API呼び出し、ボディ変更）可能、CloudFront Functions: 軽量・高速（ヘッダー操作、URL書き換え）特化",
                    "Lambda@Edge は有料、CloudFront Functions は無料",
                    "Lambda@Edge は本番のみ、CloudFront Functions は開発のみ"
                ],
                correct: 1,
                explanation: "Lambda@EdgeはNode.js/Pythonでより複雑な処理（外部API呼び出し、リクエスト/レスポンスボディ変更、1-5秒の実行時間）が可能。CloudFront FunctionsはJavaScriptでサブミリ秒の超高速実行に特化し、軽量な操作（ヘッダー操作、URL書き換え、リクエスト認証）に最適で、コストも1/6です。"
            },
            {
                id: 14,
                question: "Route53 の Geoproximity Routing の主な機能は？",
                options: [
                    "ユーザーの国に基づいてルーティング",
                    "ユーザーとリソース間の地理的距離に基づき、バイアス値で影響範囲を調整可能なルーティング",
                    "最も近いリージョンに自動ルーティング",
                    "レイテンシが最小のエンドポイントにルーティング"
                ],
                correct: 1,
                explanation: "Geoproximity Routingは、ユーザーとリソース間の地理的距離に基づいてルーティングし、バイアス値（-99～+99）で特定リソースへのトラフィック量を調整できます。これによりリージョン間の負荷分散やトラフィックシフトを細かく制御できます。"
            },
            {
                id: 15,
                question: "CloudFront の Real-Time Logs の活用シナリオは？",
                options: [
                    "月次レポートの作成のみ",
                    "Kinesis Data Streams経由でリアルタイムにログを送信し、セキュリティ監視、パフォーマンス分析、異常検知を実施",
                    "ログのバックアップのみ",
                    "コスト削減のためのログ圧縮"
                ],
                correct: 1,
                explanation: "CloudFront Real-Time Logsは、リクエストログを数秒以内にKinesis Data Streamsに送信します。これをLambda、Kinesis Data Analytics、外部SIEM（Splunk、Datadog）と連携し、不正アクセス検知、DDoS攻撃の早期発見、キャッシュヒット率のリアルタイム監視、地域別パフォーマンス分析が可能です。"
            }
        ]
    },
    "development-deployment": {
        title: "開発・デプロイメント",
        icon: "🚀",
        questions: [
            {
                id: 1,
                question: "CloudFormation StackSetsの主な用途は？",
                options: [
                    "単一リージョン内での複数スタックの管理",
                    "複数のAWSアカウントや複数リージョンにわたるスタックの一括デプロイ",
                    "スタックのバージョン管理",
                    "スタックのロールバック機能"
                ],
                correct: 1,
                explanation: "CloudFormation StackSetsは、複数のAWSアカウントや複数リージョンにわたって、CloudFormationスタックを一括でデプロイ・管理する機能です。"
            },
            {
                id: 2,
                question: "AWS CodeDeployのデプロイ設定で、Blue/Greenデプロイの利点は？",
                options: [
                    "デプロイ時間が短縮される",
                    "リソース使用量が削減される",
                    "ゼロダウンタイムでのデプロイが可能で、問題発生時の迅速なロールバックができる",
                    "設定が簡単"
                ],
                correct: 2,
                explanation: "Blue/Greenデプロイは、新しい環境（Green）を並行で構築し、トラフィックを切り替えることでゼロダウンタイムを実現し、問題時には即座に元の環境（Blue）に戻せます。"
            },
            {
                id: 3,
                question: "AWS CDKの主な利点は？",
                options: [
                    "GUIベースでインフラを定義できる",
                    "プログラミング言語でインフラをコードとして定義でき、再利用可能なコンポーネントを作成できる",
                    "CloudFormationより高速にデプロイできる",
                    "AWSサービスのコストが削減される"
                ],
                correct: 1,
                explanation: "AWS CDKは、TypeScript、Python、Java等のプログラミング言語でインフラを定義でき、オブジェクト指向の概念を活用して再利用可能なコンポーネント（Construct）を作成できます。"
            },
            {
                id: 4,
                question: "AWS Service Catalogの主な用途は？",
                options: [
                    "AWSサービスの料金計算",
                    "承認されたITサービスのカタログを作成し、エンドユーザーのセルフサービス展開を可能にする",
                    "AWSリソースの自動バックアップ",
                    "セキュリティコンプライアンスの監査"
                ],
                correct: 1,
                explanation: "AWS Service Catalogは、IT管理者が承認済みの製品（CloudFormationテンプレート）をカタログ化し、エンドユーザーが簡単にデプロイできるセルフサービス環境を提供します。"
            },
            {
                id: 5,
                question: "AWS Migration Hubの機能は？",
                options: [
                    "オンプレミスからAWSへの物理的なデータ転送",
                    "アプリケーション移行の進捗を一元的に追跡・監視する",
                    "自動的にアプリケーションをコンテナ化する",
                    "移行コストの見積もりを提供する"
                ],
                correct: 1,
                explanation: "AWS Migration Hubは、複数の移行ツール（Application Migration Service、Database Migration Service等）を使用した移行プロジェクトの進捗を一元的に追跡・監視する管理サービスです。"
            },
            {
                id: 6,
                question: "AWS CodePipeline の並列実行とシーケンシャル実行の使い分けは？",
                options: [
                    "常に並列実行を使用する",
                    "独立したタスクは並列実行、依存関係があるタスクはシーケンシャル実行",
                    "コスト削減のため常にシーケンシャル実行",
                    "複雑なパイプラインでは並列実行を避ける"
                ],
                correct: 1,
                explanation: "並列実行は独立したテスト（ユニットテスト、統合テスト、セキュリティスキャン）を同時実行して時間短縮を図り、シーケンシャル実行はビルド→テスト→デプロイのような依存関係があるステージで使用します。"
            },
            {
                id: 7,
                question: "AWS Elastic Beanstalk の Blue/Green デプロイメントのメリットは？",
                options: [
                    "設定が最も簡単",
                    "ダウンタイムなしでデプロイでき、問題時に即座にロールバック可能",
                    "リソース使用量が最小",
                    "デプロイ時間が最短"
                ],
                correct: 1,
                explanation: "Blue/Green デプロイメントは新環境を完全に構築してからトラフィック切り替えを行うため、ゼロダウンタイムを実現し、問題発生時に即座に前の環境に戻すことができます。"
            },
            {
                id: 8,
                question: "AWS X-Ray の分散トレーシングで得られる情報は？",
                options: [
                    "アプリケーションのソースコード",
                    "リクエストフローとレスポンス時間、エラー箇所の詳細な分析",
                    "インフラストラクチャのリソース使用量",
                    "データベースのスキーマ情報"
                ],
                correct: 1,
                explanation: "X-Rayは分散システム内でのリクエストの流れを追跡し、各サービス間のレスポンス時間、エラー発生箇所、ボトルネックを視覚的に分析できるトレーシング情報を提供します。"
            },
            {
                id: 9,
                question: "AWS CodeCommit と GitHub の統合における考慮点は？",
                options: [
                    "CodeCommitの方が常に高速",
                    "チーム規模、既存ツールチェーン、セキュリティ要件に応じて選択",
                    "すべてをCodeCommitに移行する",
                    "外部サービスは使用しない"
                ],
                correct: 1,
                explanation: "CodeCommitはAWSネイティブでセキュリティ統合が容易ですが、GitHubは豊富なエコシステムとコラボレーション機能を持ちます。組織の要件、既存のワークフロー、チームのスキルセットを考慮して選択します。"
            },
            {
                id: 10,
                question: "Infrastructure as Code (IaC) で CloudFormation と CDK の使い分けは？",
                options: [
                    "すべてのケースでCDKを使用",
                    "宣言的な設定はCloudFormation、プログラマティックな制御とロジックが必要な場合はCDK",
                    "小規模プロジェクトはCDK、大規模プロジェクトはCloudFormation",
                    "チーム内でランダムに選択"
                ],
                correct: 1,
                explanation: "CloudFormationは宣言的でシンプルな設定に適し、CDKはプログラミング言語の特性（条件分岐、ループ、クラス継承）を活用した複雑なインフラストラクチャ定義に適しています。"
            },
            {
                id: 11,
                question: "AWS CodePipeline で複数環境（Dev、Staging、Prod）への段階的デプロイを実装するベストプラクティスは？",
                options: [
                    "1つのパイプラインですべての環境に同時デプロイ",
                    "各ステージに承認アクション（Manual Approval）を挿入し、環境ごとにデプロイを制御",
                    "環境ごとに独立したパイプラインを作成",
                    "すべて手動でデプロイ"
                ],
                correct: 1,
                explanation: "CodePipelineでは、各環境へのデプロイステージの間にManual Approval Actionを配置することで、前の環境でのテスト完了後に承認者がレビュー・承認してから次の環境へデプロイする段階的リリースを実装できます。これにより、本番環境への影響を最小化できます。"
            },
            {
                id: 12,
                question: "AWS SAM (Serverless Application Model) の主な利点は？",
                options: [
                    "EC2インスタンスの管理を簡素化",
                    "Lambda、API Gateway、DynamoDB等のサーバーレスリソースをシンプルな構文で定義し、デプロイを自動化",
                    "コンテナイメージのビルド専用",
                    "RDSデータベースの管理専用"
                ],
                correct: 1,
                explanation: "AWS SAMはCloudFormationの拡張で、Lambda関数、API Gateway、DynamoDBテーブル等のサーバーレスアプリケーションを簡潔なYAML/JSON構文で定義できます。sam deployコマンドで、関数のパッケージング、S3アップロード、CloudFormationスタック作成を自動実行します。"
            },
            {
                id: 13,
                question: "AWS CDK のコードから生成されるものは？",
                options: [
                    "直接AWSリソースが作成される",
                    "CloudFormation テンプレートが生成され、それを使ってデプロイ",
                    "Terraform設定ファイル",
                    "Ansible Playbook"
                ],
                correct: 1,
                explanation: "CDKはプログラミング言語でインフラを定義し、cdk synthコマンドでCloudFormationテンプレートを生成します。その後cdk deployでCloudFormationを使って実際のリソースをデプロイします。これによりIDEの補完機能、型チェック、再利用可能なコンポーネント（Construct）が活用できます。"
            },
            {
                id: 14,
                question: "CodeDeploy の In-place デプロイと Blue/Green デプロイの違いは？",
                options: [
                    "機能は同じで名称のみ異なる",
                    "In-place: 既存インスタンスにデプロイ、Blue/Green: 新インスタンスにデプロイ後トラフィック切替",
                    "In-place は本番のみ、Blue/Green は開発のみ",
                    "In-place の方が高速"
                ],
                correct: 1,
                explanation: "In-placeデプロイは既存EC2インスタンスで旧バージョンを停止→新バージョンをデプロイするため短時間のダウンタイムが発生。Blue/Greenデプロイは新しいインスタンス群を構築し、ELBのトラフィックを切り替えることでゼロダウンタイムを実現し、問題時には即座にロールバック可能です。"
            },
            {
                id: 15,
                question: "EventBridge のイベントバスの活用シナリオは？",
                options: [
                    "HTTPリクエストのルーティングのみ",
                    "AWSサービス、カスタムアプリ、SaaSからのイベントを受信し、複数ターゲットにルーティング",
                    "ログの保存専用",
                    "メトリクスの集計専用"
                ],
                correct: 1,
                explanation: "EventBridgeは、EC2状態変化、S3バケットイベント、カスタムアプリケーションイベント、SaaSパートナーからのイベントを受信し、ルールに基づいて20以上のAWSサービスや外部HTTPエンドポイントにルーティングします。イベント駆動アーキテクチャの中核となるサービスです。"
            }
        ]
    },
    "transit-gateway": {
        title: "Transit Gateway 共有",
        icon: "🔄",
        questions: [
            {
                id: 1,
                question: "AWS Resource Access Manager (RAM)を使用してTransit Gatewayを共有する利点は？",
                options: [
                    "コストが削減される",
                    "異なるAWSアカウント間でTransit Gatewayを共有し、ネットワークアーキテクチャを簡素化できる",
                    "転送速度が向上する",
                    "セキュリティが強化される"
                ],
                correct: 1,
                explanation: "AWS RAMを使用することで、異なるAWSアカウント間でTransit Gatewayを共有でき、各アカウントが独自のTransit Gatewayを作成する必要がなくなり、ネットワーク管理を簡素化できます。"
            },
            {
                id: 2,
                question: "Transit Gateway Peering接続の制限として正しいのは？",
                options: [
                    "同一リージョン内のTransit Gateway間でのみ接続可能",
                    "異なるリージョン間で接続可能だが、推移的ルーティングはサポートしない",
                    "推移的ルーティングを完全にサポートする",
                    "最大5つのTransit Gatewayまで接続可能"
                ],
                correct: 1,
                explanation: "Transit Gateway Peeringは異なるリージョン間で接続可能ですが、VPC Peeringと同様に推移的ルーティングはサポートしていません。直接接続されたTransit Gateway間でのみ通信できます。"
            },
            {
                id: 3,
                question: "Transit Gateway Route Tableの用途は？",
                options: [
                    "VPC内のサブネット間のルーティング制御",
                    "Transit Gatewayに接続された各アタッチメント間のトラフィックフローを制御",
                    "インターネットゲートウェイへのルーティング",
                    "NAT Gatewayの設定"
                ],
                correct: 1,
                explanation: "Transit Gateway Route Tableは、Transit Gatewayに接続された各アタッチメント（VPC、VPN、Direct Connect Gateway等）間のトラフィックフローを詳細に制御するために使用します。"
            },
            {
                id: 4,
                question: "Transit Gateway Multicastの特徴は？",
                options: [
                    "すべてのVPCで自動的に有効になる",
                    "特定のVPCとサブネットでマルチキャストトラフィックを有効にできる",
                    "インターネット経由でのマルチキャストが可能",
                    "追加料金は発生しない"
                ],
                correct: 1,
                explanation: "Transit Gateway Multicastは、指定したVPCとサブネット内でマルチキャストトラフィックを有効にする機能で、明示的に設定する必要があります。マルチキャストドメインを作成して管理します。"
            },
            {
                id: 5,
                question: "AWS RAMでリソースを共有する際の前提条件は？",
                options: [
                    "すべてのアカウントが同じOrganization内にある必要がある",
                    "Organization内でのリソース共有が有効になっている、または外部アカウントからの招待を承認する必要がある",
                    "同一リージョン内のアカウントのみ",
                    "特別な前提条件はない"
                ],
                correct: 1,
                explanation: "AWS RAMでリソースを共有するには、AWS Organizations内でリソース共有を有効にするか、外部アカウントに招待を送信して承認してもらう必要があります。"
            },
            {
                id: 6,
                question: "Transit Gateway での ルートテーブルの propagation と association の違いは？",
                options: [
                    "機能は同じで用語のみ異なる",
                    "associationはアタッチメントをルートテーブルに紐付け、propagationは動的にルート情報を伝搬",
                    "propagationは手動設定、associationは自動設定",
                    "associationは有料、propagationは無料"
                ],
                correct: 1,
                explanation: "Route Table Associationはアタッチメント（VPC、VPN等）をルートテーブルに関連付け、Route Propagationは接続されたネットワークのルート情報を自動的にルートテーブルに伝搬する機能です。"
            },
            {
                id: 7,
                question: "AWS RAM の resource sharing で共有できないリソースは？",
                options: [
                    "Transit Gateway",
                    "Route53 Resolver Rules",
                    "VPC Security Groups",
                    "Subnet"
                ],
                correct: 2,
                explanation: "Security GroupsはVPC固有のリソースであり、AWS RAMでは共有できません。Subnet、Route53 Resolver Rules、Transit Gateway、License Manager configurations等は共有可能です。"
            },
            {
                id: 8,
                question: "Transit Gateway Connect アタッチメントの主な用途は？",
                options: [
                    "VPC間の接続",
                    "SD-WANアプライアンスとの BGP over GRE 接続",
                    "インターネットへの接続",
                    "オンプレミスとの VPN接続"
                ],
                correct: 1,
                explanation: "Transit Gateway Connectは、SD-WANアプライアンスやルーターとの間でBGP over GREトンネルを確立し、動的ルーティングによる柔軟なネットワーク接続を提供します。"
            },
            {
                id: 9,
                question: "Cross-Region Transit Gateway Peering の制約は？",
                options: [
                    "同じCIDRブロックでも接続可能",
                    "CIDR ブロックが重複していると接続できない",
                    "最大帯域幅制限はない",
                    "すべてのAWSサービスが利用可能"
                ],
                correct: 1,
                explanation: "Cross-Region Peering では、接続するTransit Gateway間でCIDRブロックの重複があると通信ができません。また、帯域幅制限やリージョン間の制約があります。"
            },
            {
                id: 10,
                question: "Transit Gateway Route Tables での blackhole route の用途は？",
                options: [
                    "ルーティングパフォーマンスの向上",
                    "特定の宛先への通信を明示的に遮断するセキュリティ制御",
                    "負荷分散の実現",
                    "ルート情報の圧縮"
                ],
                correct: 1,
                explanation: "Blackhole routeは特定のCIDRブロックへのトラフィックを明示的に破棄する設定で、セキュリティポリシーによる通信制御やトラブルシューティングに使用されます。"
            },
            {
                id: 11,
                question: "Transit Gateway の Route Table 分離による、セキュリティとコンプライアンスの実装方法は？",
                options: [
                    "すべてのVPCで同じルートテーブルを使用",
                    "本番・開発・DMZごとに独立したルートテーブルを作成し、VPC間通信を制御",
                    "ルートテーブルは1つのみ作成可能",
                    "セキュリティグループのみで制御"
                ],
                correct: 1,
                explanation: "Transit Gatewayの複数ルートテーブル機能により、本番VPC、開発VPC、DMZ VPCをそれぞれ異なるルートテーブルに関連付け、通信パターンを細かく制御できます。例：本番→開発の通信は拒否、DMZ→本番は許可、開発→共有サービスVPCのみ許可、など。"
            },
            {
                id: 12,
                question: "Transit Gateway Connect を使用したSD-WANとの統合の利点は？",
                options: [
                    "VPN接続よりも低コスト",
                    "GRE/VXLANトンネルでSD-WANアプライアンスと高速接続し、複数のBGPセッションをサポート",
                    "設定が不要",
                    "オンプレミス接続専用"
                ],
                correct: 1,
                explanation: "Transit Gateway Connectは、GRE（Generic Routing Encapsulation）トンネルを使用してSD-WANアプライアンス（Cisco Viptela、VMware VeloCloud等）とTransit Gatewayを統合します。1つのConnectアタッチメントで複数のBGPピアリングをサポートし、50 Gbpsまでのスループットを実現します。"
            },
            {
                id: 13,
                question: "Transit Gateway Peering で異なるリージョン間のVPCを接続する際のベストプラクティスは？",
                options: [
                    "各リージョンごとにVPC Peeringを使用",
                    "各リージョンにTransit Gatewayを配置し、Transit Gateway Peeringで接続。各リージョン内のVPCはローカルのTGWに接続",
                    "すべてのVPCを1つのリージョンに配置",
                    "Direct Connectのみ使用"
                ],
                correct: 1,
                explanation: "マルチリージョンアーキテクチャでは、各リージョンにTransit Gatewayを配置し、リージョン間はTransit Gateway Peering（AWSバックボーン経由）で接続します。これにより各リージョン内のVPC間通信はローカルTGWで処理され、リージョン間通信は最適化されたルートで転送されます。"
            },
            {
                id: 14,
                question: "Transit Gateway と AWS RAM (Resource Access Manager) を組み合わせた組織全体での共有方法は？",
                options: [
                    "各アカウントが独自のTransit Gatewayを作成",
                    "中央アカウントでTransit Gatewayを作成し、RAMで他のAWSアカウント/OUと共有。各アカウントは自身のVPCをアタッチ",
                    "手動で接続情報を共有",
                    "Transit Gatewayは共有できない"
                ],
                correct: 1,
                explanation: "Transit GatewayをAWS RAMで共有することで、中央ネットワークアカウントが1つのTransit Gatewayを管理し、組織内の他のアカウントがそれぞれのVPCをアタッチできます。これにより、管理の集中化、コスト削減、一貫したネットワークポリシー適用が実現します。"
            },
            {
                id: 15,
                question: "Transit Gateway の Network Manager を使用したグローバルネットワーク可視化の利点は？",
                options: [
                    "コストの自動削減",
                    "オンプレミスサイト、Transit Gateway、VPCを含むグローバルネットワークのトポロジ、メトリクス、イベントを一元的に可視化・監視",
                    "自動的にネットワークを最適化",
                    "セキュリティスキャン専用"
                ],
                correct: 1,
                explanation: "Transit Gateway Network Managerは、AWS Cloud WAN、Transit Gateway、VPN接続、オンプレミスサイトを含むグローバルWAN全体をダッシュボードで可視化します。ネットワークトポロジ、接続状態、パフォーマンスメトリクス、ルート分析、イベント監視を一元管理できます。"
            }
        ]
    },
    // 新規カテゴリ追加
    "organizational-complexity": {
        title: "組織の複雑性・ガバナンス",
        icon: "🏢",
        questions: [
            {
                id: 1,
                question: "AWS Control Tower の Account Factory で作成されるアカウントの特徴は？",
                options: [
                    "手動設定が必要",
                    "事前定義されたガードレールとベースライン設定が自動適用される",
                    "すべてのAWSサービスが無制限",
                    "セキュリティ設定は後から手動で行う"
                ],
                correct: 1,
                explanation: "Account Factoryで作成されるアカウントには、事前に定義されたガードレール（SCP）、ベースライン設定（CloudTrail、Config等）が自動的に適用され、組織のセキュリティとガバナンス要件を満たします。"
            },
            {
                id: 2,
                question: "AWS Organizations の一括請求における Reserved Instance の共有範囲は？",
                options: [
                    "同一アカウント内のみ",
                    "組織内のすべてのアカウント間で自動共有",
                    "手動で設定したアカウント間のみ",
                    "同一リージョン内のアカウントのみ"
                ],
                correct: 1,
                explanation: "Organizations の一括請求では、Reserved Instanceの容量とコスト削減効果が組織内のすべてのアカウント間で自動的に共有され、全体的なコスト最適化が実現されます。"
            },
            {
                id: 3,
                question: "AWS SSO (現 IAM Identity Center) のプロビジョニング機能の利点は？",
                options: [
                    "手動でユーザー管理ができる",
                    "外部IDプロバイダーと連携してユーザーとグループを自動同期",
                    "パスワード管理が簡単になる",
                    "すべてのAWSサービスに無制限アクセス"
                ],
                correct: 1,
                explanation: "IAM Identity Center は Active Directory や外部 SAML プロバイダーと連携し、ユーザーとグループ情報を自動同期して、複数 AWS アカウントへの一元的なアクセス管理を実現します。"
            },
            {
                id: 4,
                question: "Service Control Policies (SCP) の継承ルールは？",
                options: [
                    "子OUは親OUのSCPを継承せず、独立して動作",
                    "子OUは親OUのSCPをすべて継承し、追加的な制限も適用可能",
                    "SCPは最下位のOUでのみ有効",
                    "ROOT OUのSCPのみが有効"
                ],
                correct: 1,
                explanation: "SCPは階層的に継承され、子OUは親OUのすべてのSCPを継承します。さらに子OUレベルで追加の制限を設けることで、より厳しいガバナンスを実現できます。"
            },
            {
                id: 5,
                question: "AWS Config Aggregator の跨組織設定の利点は？",
                options: [
                    "単一アカウントの設定のみ集約",
                    "複数アカウント・複数リージョンの設定情報を一元的に集約・分析",
                    "ネットワーク設定のみ対象",
                    "手動での設定収集が必要"
                ],
                correct: 1,
                explanation: "Config Aggregatorは組織内の複数アカウント・複数リージョンから設定情報を自動収集し、コンプライアンス状況を一元的に監視・分析できるため、大規模組織のガバナンス管理を効率化します。"
            },
            {
                id: 6,
                question: "AWS Landing Zone と AWS Control Tower の違いは？",
                options: [
                    "機能は同じで名称のみ異なる",
                    "Control Tower は Landing Zone の後継で、より自動化されたマネージドサービス",
                    "Landing Zone の方が高機能",
                    "Control Tower は有料、Landing Zone は無料"
                ],
                correct: 1,
                explanation: "AWS Control Tower は AWS Landing Zone の後継サービスで、アカウント作成からガバナンス設定まで高度に自動化されたマネージドサービスとして提供されています。"
            },
            {
                id: 7,
                question: "Tag Policies の強制レベルで正しいのは？",
                options: [
                    "推奨事項の表示のみ",
                    "タグの標準化と命名規則の強制が可能",
                    "すべてのリソースに自動タグ付与",
                    "コスト計算時のみ適用"
                ],
                correct: 1,
                explanation: "Tag Policies では、リソース作成時にタグの命名規則、許可される値、必須タグを強制でき、組織全体でのタグ標準化とコスト管理を実現できます。"
            },
            {
                id: 8,
                question: "AWS CloudFormation StackSets の Organization 統合の利点は？",
                options: [
                    "単一アカウントでの利用のみ",
                    "組織内の複数アカウントに対して自動的にスタックをデプロイ・管理",
                    "手動でのアカウント管理が必要",
                    "コストが高くなる"
                ],
                correct: 1,
                explanation: "StackSets の Organization 統合により、新しいアカウントが作成されると自動的に定義されたスタック（セキュリティベースライン等）がデプロイされ、一貫したガバナンスを維持できます。"
            },
            {
                id: 9,
                question: "AWS Organizations の Trusted Access の用途は？",
                options: [
                    "アカウント間のデータ転送",
                    "他のAWSサービスが組織内のアカウントに代わって操作を実行することを許可",
                    "ユーザー認証の簡素化",
                    "料金の一元管理"
                ],
                correct: 1,
                explanation: "Trusted Access は、CloudFormation StackSets や Config Aggregator 等のサービスが、組織内の各アカウントに代わって必要な操作を実行することを許可する機能です。"
            },
            {
                id: 10,
                question: "AWS Service Catalog の Product Portfolio 管理における Permission Set の役割は？",
                options: [
                    "製品の価格設定",
                    "ユーザーとグループが利用できる製品と操作権限を制御",
                    "製品のバージョン管理",
                    "デプロイメント先の指定"
                ],
                correct: 1,
                explanation: "Permission Set は、Portfolio に関連付けられたユーザーやグループが実行できる操作（起動、更新、削除等）を詳細に制御し、セルフサービス環境でのガバナンスを実現します。"
            },
            {
                id: 11,
                question: "AWS Control Tower の Account Factory によるアカウント作成の自動化のメリットは？",
                options: [
                    "手動でアカウント設定が必要",
                    "事前設定されたベースライン（ネットワーク、セキュリティ、ログ）を持つ新規アカウントを数分で自動プロビジョニング",
                    "アカウント作成のみで設定は不可",
                    "単一アカウントのみ作成可能"
                ],
                correct: 1,
                explanation: "Control Tower の Account Factory は、Service Catalog と統合されており、ユーザーがセルフサービスで新規アカウントを作成すると、事前定義されたネットワーク（VPC構成）、セキュリティ（Guardrails）、ログ（CloudTrail、Config）が自動適用され、ガバナンス基準に準拠したアカウントが即座にプロビジョニングされます。"
            },
            {
                id: 12,
                question: "AWS Organizations の Consolidated Billing で組織全体のボリュームディスカウントを最大化する方法は？",
                options: [
                    "各アカウントが個別に契約",
                    "組織レベルで全アカウントの使用量が合算され、階層割引が自動適用",
                    "手動で割引申請が必要",
                    "特定のアカウントのみ割引適用"
                ],
                correct: 1,
                explanation: "Consolidated Billing により、全メンバーアカウントの EC2、S3、データ転送等の使用量が自動的に合算され、AWS のボリューム階層割引（例: S3 の段階的価格、データ転送料金の階層）が組織全体に適用されます。また、Reserved Instance や Savings Plans も組織内で自動共有されます。"
            },
            {
                id: 13,
                question: "AWS Config Aggregator を組織全体で活用する際のベストプラクティスは？",
                options: [
                    "各アカウントで個別に Config を設定",
                    "中央監査アカウントに Aggregator を配置し、全アカウントの Config データを集約して一元的にコンプライアンス監視",
                    "Config は単一アカウントでのみ使用可能",
                    "手動でレポートを収集"
                ],
                correct: 1,
                explanation: "Config Aggregator を中央監査アカウント（Security/Compliance OU）に作成し、Organizations 統合を有効にすることで、全アカウント・全リージョンの Config データを集約できます。これにより、組織全体のコンプライアンス状態を単一ダッシュボードで監視し、Config Rules の違反を一元管理できます。"
            },
            {
                id: 14,
                question: "AWS SSO (現 IAM Identity Center) による組織全体のアクセス管理の利点は？",
                options: [
                    "各アカウントに個別のIAMユーザーが必要",
                    "Single Sign-On で全アカウントへのアクセスを一元管理し、Active Directory や SAML 2.0 IdP と統合可能",
                    "パスワードのみで認証",
                    "単一アカウントでのみ使用可能"
                ],
                correct: 1,
                explanation: "IAM Identity Center（旧 AWS SSO）は、組織内の全アカウントへのアクセスを一元管理し、Active Directory、Okta、Azure AD 等の既存 IdP と統合できます。ユーザーは一度のサインインで全アカウントにアクセスでき、Permission Sets により各アカウントでのロールベースアクセス制御を統一的に管理できます。"
            },
            {
                id: 15,
                question: "AWS Landing Zone と AWS Control Tower の関係は？",
                options: [
                    "同じサービスで名称のみ異なる",
                    "Landing Zone は旧世代のソリューション、Control Tower はマネージドサービス化された後継",
                    "Control Tower の方が機能が少ない",
                    "Landing Zone の方が新しい"
                ],
                correct: 1,
                explanation: "AWS Landing Zone は CloudFormation ベースの旧世代マルチアカウント環境構築ソリューションでしたが、AWS Control Tower はそれをマネージドサービス化した後継です。Control Tower は、Guardrails（予防・検出型ルール）、Account Factory、ダッシュボード、自動ドリフト検出等を提供し、マルチアカウント環境のセットアップと継続的ガバナンスを大幅に簡素化します。"
            }
        ]
    },
    "cost-optimization": {
        title: "コスト最適化",
        icon: "💰",
        questions: [
            {
                id: 1,
                question: "S3 の Lifecycle Policy で Intelligent Tiering への移行タイミングは？",
                options: [
                    "作成直後",
                    "アクセスパターンが不明確なオブジェクトに対して即座に適用",
                    "30日経過後",
                    "1年経過後"
                ],
                correct: 1,
                explanation: "S3 Intelligent Tieringはアクセスパターンが変動的または予測困難なオブジェクトに対して、作成直後から適用することで、自動的に最適なストレージクラスに配置してコストを最適化します。"
            },
            {
                id: 2,
                question: "AWS Compute Optimizer の推奨事項の精度を向上させる方法は？",
                options: [
                    "1日分のデータで十分",
                    "最低14日間のメトリクスデータを収集し、Enhanced Infrastructure Metrics を有効化",
                    "手動でリソースサイズを調整",
                    "すべての推奨事項を即座に適用"
                ],
                correct: 1,
                explanation: "Compute Optimizer は最低14日間（推奨は3ヶ月）のCloudWatchメトリクスを分析し、Enhanced Infrastructure Metricsを有効にすることで、より正確なサイジング推奨事項を提供します。"
            },
            {
                id: 3,
                question: "Spot Instance を活用したコスト最適化戦略で重要な要素は？",
                options: [
                    "常にSpot Instanceのみ使用",
                    "フォルトトレラントなワークロードに限定し、複数AZの複数インスタンスタイプで分散",
                    "単一インスタンスタイプで運用",
                    "重要なワークロードでも積極活用"
                ],
                correct: 1,
                explanation: "Spot Instanceは最大90%のコスト削減が可能ですが、中断されても影響が少ないワークロードに限定し、複数のAZとインスタンスタイプに分散して可用性を確保することが重要です。"
            },
            {
                id: 4,
                question: "Reserved Instance の適用優先順位は？",
                options: [
                    "リージョン → AZ → インスタンスサイズ",
                    "最も具体的な属性マッチから順に適用（AZ、インスタンスタイプ、サイズ）",
                    "購入日時の順序",
                    "ランダムに適用"
                ],
                correct: 1,
                explanation: "Reserved Instanceは最も具体的な属性（AZ、インスタンスファミリー、サイズ）にマッチするインスタンスから優先的に適用され、その後より柔軟な条件へと適用範囲が広がります。"
            },
            {
                id: 5,
                question: "AWS Cost Anomaly Detection の機械学習による検出精度を高める設定は？",
                options: [
                    "すべてのサービスを一つの検出器で監視",
                    "サービス別、アカウント別に細分化した検出器を設定し、十分な履歴データを蓄積",
                    "検出閾値を最低に設定",
                    "手動での異常検出のみ"
                ],
                correct: 1,
                explanation: "Cost Anomaly Detectionは、サービスや用途別に細分化された検出器を設定し、3ヶ月以上の履歴データを蓄積することで、機械学習モデルの精度が向上し、より正確な異常検出が可能になります。"
            },
            {
                id: 6,
                question: "AWS Savings Plans の種類と最適な選択基準は？",
                options: [
                    "Compute Savings Plans のみを購入",
                    "用途に応じて Compute Savings Plans（柔軟性重視）と EC2 Instance Savings Plans（最大割引率重視）を組み合わせ",
                    "EC2 Instance Savings Plans のみを購入",
                    "Reserved Instance の方が常に有利"
                ],
                correct: 1,
                explanation: "Compute Savings Plans は EC2、Fargate、Lambda で使え柔軟性に優れ、EC2 Instance Savings Plans は最大72%の割引率を提供します。ワークロードの予測可能性に応じて組み合わせが最適です。"
            },
            {
                id: 7,
                question: "S3 Storage Lens の組織レベル設定の利点は？",
                options: [
                    "単一アカウントの分析のみ",
                    "組織全体のストレージ使用状況とコスト最適化推奨事項を一元分析",
                    "手動での設定収集が必要",
                    "追加料金が高額"
                ],
                correct: 1,
                explanation: "S3 Storage Lens の組織設定により、全アカウントのストレージ使用状況、アクセスパターン、コスト最適化機会を一元的に可視化し、データドリブンなストレージ管理が可能になります。"
            },
            {
                id: 8,
                question: "AWS Cost and Usage Report (CUR) の分析に最適なアーキテクチャは？",
                options: [
                    "Excel での手動分析",
                    "S3 + Athena + QuickSight による自動化された分析基盤",
                    "CloudWatch のみでの監視",
                    "手動での月次レポート作成"
                ],
                correct: 1,
                explanation: "CUR を S3 に保存し、Athena でクエリ分析、QuickSight で可視化する組み合わせにより、詳細なコスト分析、トレンド分析、カスタムダッシュボード作成が効率的に実現できます。"
            },
            {
                id: 9,
                question: "Lambda のコスト最適化における実行時間と メモリ配分の関係は？",
                options: [
                    "常に最小メモリで実行",
                    "メモリを増やすとCPU性能も向上し、実行時間短縮により総コストが削減される場合がある",
                    "メモリサイズは課金に影響しない",
                    "最大メモリで常に実行"
                ],
                correct: 1,
                explanation: "Lambda はメモリサイズに比例してCPU性能も向上するため、適切なメモリ増加により実行時間が短縮され、結果的に総コスト（実行時間×メモリサイズ）が削減される場合があります。"
            },
            {
                id: 10,
                question: "AWS Cost Explorer API を活用した自動コスト管理の実装パターンは？",
                options: [
                    "手動でのレポート確認のみ",
                    "Lambda + Cost Explorer API による定期的なコスト分析と閾値超過時のアラート自動化",
                    "CloudWatch メトリクスのみ監視",
                    "月次の手動確認"
                ],
                correct: 1,
                explanation: "Cost Explorer API を Lambda で定期実行し、コスト異常検出、予算超過アラート、部門別コスト分析レポート自動生成により、プロアクティブなコスト管理を実現できます。"
            },
            {
                id: 11,
                question: "Savings Plans と Reserved Instances の使い分けは？",
                options: [
                    "機能は同じで名称のみ異なる",
                    "Savings Plans: 柔軟性高く複数サービス対応、RI: 特定インスタンスタイプに固定で最大割引率",
                    "Savings Plans の方が常に割引率が高い",
                    "小規模はSavings Plans、大規模はRI"
                ],
                correct: 1,
                explanation: "Savings Plansは1年/3年のコミットメントで、EC2、Lambda、Fargateをまたいで柔軟に適用可能（最大72%割引）。Reserved Instancesは特定のインスタンスタイプ・リージョン・OSに固定されますが、最大75%の割引率を実現できます。ワークロードの予測可能性と柔軟性要件に応じて選択します。"
            },
            {
                id: 12,
                question: "AWS Compute Optimizer の推奨事項の実装ベストプラクティスは？",
                options: [
                    "すべての推奨を即座に適用",
                    "推奨事項を評価し、テスト環境で検証後、段階的に本番環境に適用",
                    "推奨事項を無視",
                    "手動で判断せずに完全自動化"
                ],
                correct: 1,
                explanation: "Compute Optimizerは機械学習でEC2、EBS、Lambda、Auto Scaling、ECSの最適化推奨を提供しますが、アプリケーション固有の要件（バースト性能、メモリ要件、I/O特性）を考慮し、テスト環境で負荷テストを実施してから本番適用することが重要です。"
            },
            {
                id: 13,
                question: "S3 Intelligent-Tiering のアーカイブ設定オプションの活用方法は？",
                options: [
                    "すべてのオブジェクトを即座にアーカイブ",
                    "90日以上/180日以上アクセスのないオブジェクトを自動的にArchive/Deep Archiveに移行して大幅コスト削減",
                    "アーカイブ機能は使用不可",
                    "手動でのみアーカイブ可能"
                ],
                correct: 1,
                explanation: "S3 Intelligent-Tieringのオプション設定で、90日以上アクセスのないデータをArchive Access層（Glacier相当）、180日以上をDeep Archive Access層（Glacier Deep Archive相当）に自動移行できます。ストレージコストを最大95%削減しつつ、必要時には自動的に取得可能です。"
            },
            {
                id: 14,
                question: "AWS Cost Anomaly Detection の仕組みと利点は？",
                options: [
                    "手動でコスト異常を検出",
                    "機械学習で通常の支出パターンを学習し、異常なコスト増加を自動検出してアラート通知",
                    "固定の閾値のみ監視",
                    "月次レポートのみ提供"
                ],
                correct: 1,
                explanation: "Cost Anomaly Detectionは機械学習で過去の支出パターンを分析し、サービス、リンクアカウント、コスト配分タグ単位で異常なコスト増加を自動検出します。SNS/Slack/Emailで即座に通知し、予期せぬコスト急増（インスタンス誤起動、設定ミス等）を早期に発見できます。"
            },
            {
                id: 15,
                question: "マルチアカウント環境でのコスト配分タグ戦略は？",
                options: [
                    "タグは不要",
                    "Environment、Project、CostCenter等の統一タグをOrganizationsレベルで強制し、詳細なコスト配分と部門別チャージバックを実現",
                    "各アカウントで独自のタグを使用",
                    "タグはレポート目的のみ"
                ],
                correct: 1,
                explanation: "AWS OrganizationsのTag Policiesで組織全体に統一的なタグ付けルールを強制します。Environment（本番/開発）、Project（プロジェクト名）、CostCenter（コストセンター）、Owner（所有者）などの標準タグにより、Cost ExplorerやCURで詳細なコスト分析、部門別/プロジェクト別のコスト配分、チャージバックが可能になります。"
            }
        ]
    },
    "migration-modernization": {
        title: "移行・モダナイゼーション",
        icon: "🔄",
        questions: [
            {
                id: 1,
                question: "AWS Application Migration Service (MGN) の特徴は？",
                options: [
                    "アプリケーションレベルでの移行のみサポート",
                    "ブロックレベルレプリケーションによる最小ダウンタイムでのリフト&シフト移行",
                    "手動でのデータ転送が必要",
                    "同一OS間の移行のみ可能"
                ],
                correct: 1,
                explanation: "MGN（旧CloudEndure Migration）は、継続的なブロックレベルレプリケーションにより、ソースサーバーを最小限のダウンタイム（数分）でAWSに移行できるリフト&シフトソリューションです。"
            },
            {
                id: 2,
                question: "AWS Database Migration Service (DMS) の Change Data Capture (CDC) の利点は？",
                options: [
                    "初期データロードのみ実行",
                    "継続的な変更データの同期により、ゼロダウンタイム移行が可能",
                    "手動でのデータ同期が必要",
                    "同一データベースエンジン間のみ対応"
                ],
                correct: 1,
                explanation: "DMS の CDC機能は、初期フルロード後に継続的にソースDBの変更を同期し、切り替えタイミングでのダウンタイムを最小化（数分）してゼロダウンタイム移行を実現します。"
            },
            {
                id: 3,
                question: "AWS App2Container の対象アプリケーションは？",
                options: [
                    "新規開発のクラウドネイティブアプリのみ",
                    "レガシーな .NET および Java Web アプリケーションのコンテナ化",
                    "データベースアプリケーションのみ",
                    "モバイルアプリケーションのみ"
                ],
                correct: 1,
                explanation: "App2Container は既存の .NET Framework (IIS) および Java (Tomcat) で動作するレガシーWebアプリケーションを自動的に分析・コンテナ化し、ECSやEKSで実行可能にするツールです。"
            },
            {
                id: 4,
                question: "AWS Migration Evaluator (旧TSO Logic) の分析対象は？",
                options: [
                    "ネットワーク構成のみ",
                    "オンプレミス環境のリソース使用状況とコスト分析によるビジネスケース作成",
                    "アプリケーションのソースコードのみ",
                    "データベースのスキーマのみ"
                ],
                correct: 1,
                explanation: "Migration Evaluator は、オンプレミス環境のサーバー使用状況、アプリケーション依存関係、コストデータを収集・分析し、AWS移行の ROI とビジネスケースを定量的に算出します。"
            },
            {
                id: 5,
                question: "Microservices への分解戦略で Strangler Fig Pattern の適用場面は？",
                options: [
                    "新規システム開発時",
                    "モノリシックアプリケーションを段階的にマイクロサービス化する際の移行パターン",
                    "データベース設計時",
                    "ネットワーク設計時"
                ],
                correct: 1,
                explanation: "Strangler Fig Pattern は、既存のモノリシックシステムを段階的にマイクロサービスに置き換える移行戦略で、新機能を新サービスで実装し、段階的に旧システムの機能を置き換えていく手法です。"
            },
            {
                id: 6,
                question: "AWS Schema Conversion Tool (SCT) の主な機能は？",
                options: [
                    "データベースデータの物理的な転送",
                    "異なるデータベースエンジン間でのスキーマとコードの自動変換・アセスメント",
                    "アプリケーションのリファクタリング",
                    "ネットワーク設定の変換"
                ],
                correct: 1,
                explanation: "SCT は、Oracle から PostgreSQL、SQL Server から MySQL など、異なるデータベースエンジン間でのスキーマ、ストアドプロシージャ、ビューの自動変換と移行アセスメントレポートを提供します。"
            },
            {
                id: 7,
                question: "AWS Snow Family デバイスの使い分け基準は？",
                options: [
                    "すべてのケースで Snowball Edge を使用",
                    "データ量と転送時間要件に応じて Snowcone（8TB）、Snowball Edge（80TB）、Snowmobile（100PB）を選択",
                    "物理的なセキュリティのみ考慮",
                    "コストのみで判断"
                ],
                correct: 1,
                explanation: "Snow Family は転送データ量に応じた選択が重要で、Snowcone（エッジコンピューティング＋小規模転送）、Snowball Edge（中〜大規模転送）、Snowmobile（超大規模転送）の特性を理解して選択します。"
            },
            {
                id: 8,
                question: "AWS Application Discovery Service の収集方法の違いは？",
                options: [
                    "エージェントレス収集のみ対応",
                    "エージェントベース（詳細情報）とエージェントレス（基本情報）の2つの収集方法を提供",
                    "手動での情報入力のみ",
                    "ネットワークスキャンのみ"
                ],
                correct: 1,
                explanation: "Application Discovery Service は、エージェントベース収集（詳細なプロセス・ネットワーク接続情報）とエージェントレス収集（VM基本情報・使用状況）の両方をサポートし、環境に応じて選択できます。"
            },
            {
                id: 9,
                question: "Container 移行における ECS と EKS の選択基準は？",
                options: [
                    "常に EKS を選択",
                    "Kubernetes の既存知識・要件の有無、運用複雑度の許容度、AWS ネイティブ統合の重要度を総合判断",
                    "コンテナ数のみで判断",
                    "常に ECS を選択"
                ],
                correct: 1,
                explanation: "ECS は AWS ネイティブで運用が簡単、EKS は Kubernetes エコシステムとポータビリティを提供します。既存の技術スタック、運用体制、移行後の拡張計画を総合的に評価して選択します。"
            },
            {
                id: 10,
                question: "Well-Architected Framework の移行における 6 R 戦略で、最もコスト効率が良い順序は？",
                options: [
                    "Retire → Retain → Rehost → Replatform → Refactor → Repurchase",
                    "Rehost → Replatform → Refactor → Repurchase → Retain → Retire",
                    "Refactor → Repurchase → Replatform → Rehost → Retain → Retire",
                    "すべて同等のコスト"
                ],
                correct: 0,
                explanation: "一般的にコスト効率順は: Retire（廃止、コスト0）→ Retain（保持、移行コスト0）→ Rehost（リフト&シフト、最小移行コスト）→ Replatform → Refactor → Repurchase となります。"
            },
            {
                id: 11,
                question: "AWS Application Discovery Service のエージェントベース検出とエージェントレス検出の違いは？",
                options: [
                    "エージェントベースは仮想マシンのみ対応、エージェントレスは物理サーバーのみ対応",
                    "エージェントベースは詳細なプロセス・ネットワーク接続情報を取得、エージェントレスは基本的な構成情報のみ",
                    "エージェントレスはコストが高いが、より詳細な情報を取得できる",
                    "両者に機能的な違いはなく、導入方法が異なるだけ"
                ],
                correct: 1,
                explanation: "エージェントベース検出は各サーバーにエージェントをインストールし、プロセスレベルの依存関係やネットワーク接続の詳細情報を取得します。エージェントレス検出（VMware vCenter経由）は基本的な VM 構成情報（CPU、メモリ、ディスク使用量）のみを収集します。詳細な依存関係マッピングが必要な場合はエージェントベースを選択します。"
            },
            {
                id: 12,
                question: "AWS Application Discovery Service で収集したデータを活用する際のベストプラクティスは？",
                options: [
                    "すべてのデータを手動でExcelにエクスポートして分析",
                    "AWS Migration Hub と統合し、視覚化されたダッシュボードで依存関係を分析し移行計画を策定",
                    "データは参照のみで、実際の移行には使用しない",
                    "オンプレミスツールのみで分析を完結"
                ],
                correct: 1,
                explanation: "Application Discovery Service で収集したデータは AWS Migration Hub に自動的に統合され、アプリケーションのグルーピング、依存関係の可視化、移行の進捗管理が可能になります。これにより、移行リスクを最小化し、計画的な移行を実現できます。"
            },
            {
                id: 13,
                question: "AWS Migration Hub における6つの移行戦略（6R）で、「Replatform」の意味は？",
                options: [
                    "アプリケーションをそのままクラウドに移行（リフト＆シフト）",
                    "クラウド最適化のため一部アーキテクチャを変更して移行（リフト、ティンカー＆シフト）",
                    "アプリケーションを完全に再設計してクラウドネイティブ化",
                    "SaaSソリューションに置き換え"
                ],
                correct: 1,
                explanation: "Replatform（リフト、ティンカー＆シフト）は、コアアーキテクチャは維持しつつ、クラウドの利点を活用するため一部最適化を行う戦略です。例：自己管理DBからRDSへの移行、アプリケーションサーバーをEC2からElastic Beanstalkへ移行など。コード変更は最小限で、運用負荷を削減しつつクラウドメリットを享受できます。"
            },
            {
                id: 14,
                question: "大規模移行プロジェクトで AWS Migration Hub を活用する主な利点は？",
                options: [
                    "移行コストの自動削減",
                    "複数の移行ツール（DMS、MGN、SMS等）の進捗を一元管理し、全体像を可視化",
                    "移行作業の完全自動化",
                    "移行後のアプリケーション性能の自動最適化"
                ],
                correct: 1,
                explanation: "Migration Hub は、AWS Application Migration Service (MGN)、Database Migration Service (DMS)、Server Migration Service (SMS) など複数の移行ツールの進捗状況を一元的に追跡・可視化します。これにより、数百～数千のサーバー・DBを含む大規模移行プロジェクトでも、全体の進捗状況、依存関係、移行ステータスを一目で把握できます。"
            },
            {
                id: 15,
                question: "AWS Snowball Edge と AWS Snowmobile の使い分けの基準は？",
                options: [
                    "1TB以下: Snowball Edge、1TB以上: Snowmobile",
                    "10TB以下: Snowball Edge、10TB以上: Snowmobile",
                    "数十TB～数PB: Snowball Edge（複数台並行可）、10PB以上のエクサバイト級: Snowmobile",
                    "データセンター内: Snowball Edge、データセンター外: Snowmobile"
                ],
                correct: 2,
                explanation: "Snowball Edge は最大80TB/台で、数十TB～数PBのデータ転送に適し、複数台を並行利用可能です。Snowmobile は最大100PBの超大規模データ転送用の45フィートコンテナトラックで、データセンター全体の移行やエクサバイト級データに使用します。コスト、転送速度、物理的制約を考慮して選択します。"
            },
            {
                id: 16,
                question: "Snowball Edge Compute Optimized の主な用途は？",
                options: [
                    "単純なデータ転送のみ",
                    "エッジコンピューティング: ローカルでEC2/Lambdaを実行しながらデータ収集・前処理",
                    "長期データアーカイブ専用",
                    "オンプレミスストレージの完全代替"
                ],
                correct: 1,
                explanation: "Snowball Edge Compute Optimized は、52 vCPU、208GB メモリを搭載し、AWS IoT Greengrass、EC2インスタンス、Lambda関数をローカル実行できます。リモートサイトや船舶・航空機などネットワーク接続が限られた環境で、データ収集・前処理・ML推論を行いながら、後でAWSにデータ転送する用途に最適です。"
            },
            {
                id: 17,
                question: "オンプレミスのVMware仮想マシンをAWSにインポートする際の推奨手順は？",
                options: [
                    "手動でVMDKファイルを作成してS3にアップロード",
                    "AWS VM Import/Export または AWS Application Migration Service (MGN) を使用",
                    "スナップショットをUSBドライブで郵送",
                    "VPN経由でVMを直接コピー"
                ],
                correct: 1,
                explanation: "オンプレミスVM移行には、AWS VM Import/Export（VMDK/OVA形式のイメージをAMIに変換）または AWS MGN（継続的レプリケーションでダウンタイム最小化）を使用します。MGNの方が最小ダウンタイムで移行でき、最新のベストプラクティスです。VM Import/Exportは一括移行やオフライン移行に適しています。"
            },
            {
                id: 18,
                question: "VM Importで作成したAMIを本番環境で使用する前のベストプラクティスは？",
                options: [
                    "そのまま本番環境にデプロイ",
                    "AWS Systems Manager を使用してパッチ適用、不要なドライバ削除、EC2用エージェント導入を実施",
                    "AMIを削除して最初から構築",
                    "セキュリティグループ設定のみ確認"
                ],
                correct: 1,
                explanation: "インポートしたAMIは、オンプレミス環境用のドライバや設定が含まれています。本番利用前に、Systems Manager Run Command/State Manager で、①最新パッチ適用、②不要なオンプレミス用ドライバ削除、③CloudWatch/Systems Manager エージェント導入、④セキュリティ設定の最適化を行うことが推奨されます。"
            },
            {
                id: 19,
                question: "AWS DataSync の主な用途とメリットは？",
                options: [
                    "データベースのレプリケーション専用サービス",
                    "オンプレミス↔AWS間の大規模ファイルデータ転送を最大10倍高速化し、自動でデータ整合性検証",
                    "小規模ファイル転送専用（1GB以下）",
                    "手動でのrsync代替ツール"
                ],
                correct: 1,
                explanation: "DataSync は、NFS/SMBストレージとAWS（S3/EFS/FSx）間で、TB～PBスケールのファイル転送を自動化します。並列転送、ネットワーク最適化、組み込み暗号化、自動整合性チェック、スケジューリング機能により、手動スクリプトやオープンソースツールより最大10倍高速で信頼性の高いデータ転送を実現します。"
            },
            {
                id: 20,
                question: "DataSync で定期的にオンプレミスNFSストレージをS3に同期する際の推奨構成は？",
                options: [
                    "DataSync エージェントをオンプレミスにデプロイし、スケジュール化タスクでS3へ増分同期",
                    "手動でcronジョブを作成してaws s3 sync実行",
                    "毎回フルコピーで同期",
                    "VPN経由で手動コピー"
                ],
                correct: 0,
                explanation: "DataSync エージェント（VMware/Hyper-V/EC2にデプロイ）をオンプレミスに配置し、DataSync タスクをスケジュール実行（1時間/日次/週次）することで、変更ファイルのみを自動的に増分転送できます。メタデータ、パーミッション、タイムスタンプも保持され、CloudWatch でモニタリング可能です。"
            },
            {
                id: 21,
                question: "AWS Transfer Family の主なユースケースは？",
                options: [
                    "HTTPベースのファイルアップロードのみ",
                    "既存のSFTP/FTPS/FTPワークフローを変更せずにS3/EFSをバックエンドストレージとして利用",
                    "データベースのバックアップ専用",
                    "EC2へのSSHアクセス提供"
                ],
                correct: 1,
                explanation: "AWS Transfer Family（SFTP/FTPS/FTP/AS2対応）は、レガシーなファイル転送プロトコルを使用する既存のワークフロー（EDI、金融機関、サプライチェーン統合等）を変更することなく、バックエンドにS3またはEFSを使用できます。クライアント側のコード変更不要で、マネージド・高可用性・スケーラブルなファイル転送を実現します。"
            },
            {
                id: 22,
                question: "AWS Transfer Family で外部パートナー企業からのセキュアなファイル受信を実装する際のベストプラクティスは？",
                options: [
                    "匿名FTPを有効化",
                    "SFTP + IAM/ディレクトリサービス認証 + S3バケットポリシーで送信元制限、CloudTrailで監査ログ記録",
                    "パブリックFTPサーバーを使用",
                    "パスワード認証のみ使用"
                ],
                correct: 1,
                explanation: "セキュアなB2Bファイル転送には、①SFTP/FTPSプロトコル使用、②IAM認証または Active Directory/LDAP統合、③パートナーごとに専用のS3バケット/プレフィックス割り当て、④S3バケットポリシーで送信元IP制限、⑤CloudTrail/CloudWatch Logsで全アクセスログ記録、⑥転送後のLambda自動処理、が推奨されます。"
            },
            {
                id: 23,
                question: "AWS Mainframe Modernization サービスの主な利点は？",
                options: [
                    "メインフレームハードウェアのクラウド版提供",
                    "メインフレームアプリケーションをリファクタリング（Java変換）またはリプラットフォーム（Micro Focus実行環境）で段階的モダナイゼーション",
                    "COBOLコードの自動削除",
                    "メインフレームの単純な仮想化のみ"
                ],
                correct: 1,
                explanation: "AWS Mainframe Modernization は、①Automated Refactoring（COBOL→Javaへ自動変換）、②Runtime Platform（Micro Focus/Blu Age実行環境でCOBOLをそのまま実行）の2つのパターンを提供します。段階的移行、既存COBOLスキル活用、クラウドネイティブサービス統合が可能で、大規模メインフレームのモダナイゼーションを加速します。"
            },
            {
                id: 24,
                question: "メインフレームのモダナイゼーション戦略で「Retain & Augment」アプローチとは？",
                options: [
                    "メインフレームを完全に廃止",
                    "コアメインフレーム処理は維持しつつ、新機能はAWSクラウドで構築しAPIで統合",
                    "すべてをクラウドに一括移行",
                    "メインフレームをそのまま仮想化"
                ],
                correct: 1,
                explanation: "「Retain & Augment」は、リスクの高いコアバッチ処理や大規模トランザクション処理はメインフレームに残しつつ、新しい顧客向けWebアプリ、モバイルアプリ、分析基盤はAWSで構築し、API Gateway経由でメインフレームと統合するハイブリッド戦略です。段階的モダナイゼーションが可能で、ビジネスリスクを最小化します。"
            },
            {
                id: 25,
                question: "AWS DMS での Homogeneous Migration と Heterogeneous Migration の違いは？",
                options: [
                    "同じ機能、名称のみ異なる",
                    "Homogeneous（同種）: Oracle→RDS Oracle等、同じDBエンジン間の移行で直接レプリケーション可能。Heterogeneous（異種）: Oracle→PostgreSQL等、異なるエンジン間でSCT必須",
                    "Homogeneous は小規模のみ、Heterogeneous は大規模のみ",
                    "Homogeneous はバックアップベース、Heterogeneous はレプリケーションベース"
                ],
                correct: 1,
                explanation: "Homogeneous Migration（同種移行）は、Oracle→RDS Oracle、MySQL→RDS MySQL等、同じDBエンジン間の移行で、DMSが直接バイナリレプリケーションを実行。Heterogeneous Migration（異種移行）は、Oracle→Aurora PostgreSQL、SQL Server→MySQL等、異なるDBエンジン間の移行で、AWS Schema Conversion Tool (SCT) でスキーマ・コード変換が必要です。"
            },
            {
                id: 26,
                question: "大規模データベース（10TB以上）のAWS移行で、ダウンタイムを最小化する戦略は？",
                options: [
                    "データベース全体をエクスポートしてS3にアップロード",
                    "DMS CDC（Change Data Capture）: 初期フルロード→継続的差分同期→切替でダウンタイム数分",
                    "データベースを停止してSnowballでデータ転送",
                    "手動でSQL dumpを取得して移行"
                ],
                correct: 1,
                explanation: "大規模DB移行のベストプラクティス: ①DMS初期フルロード（数時間～数日、本番稼働継続）、②CDC有効化で継続的に変更データ同期（レプリケーションラグをゼロに近づける）、③アプリケーション停止、④最終同期確認、⑤接続先をAWSのDBに切替（数分のダウンタイム）。Snowball + DMS組み合わせ（初期ロードをSnowball経由、その後CDC）も有効です。"
            }
        ]
    },
    // 新規カテゴリを追加
    "storage-database": {
        title: "ストレージ・データベース",
        icon: "💾",
        questions: [
            {
                id: 1,
                question: "Amazon RDS Multi-AZ と Read Replica の違いは？",
                options: [
                    "Multi-AZ は高可用性、Read Replica は読み取りスケーリングが主目的",
                    "機能は同じで名称のみ異なる",
                    "Multi-AZ の方が高速",
                    "Read Replica の方が可用性が高い"
                ],
                correct: 0,
                explanation: "Multi-AZ は同期レプリケーションによる高可用性（フェイルオーバー）を提供し、Read Replica は非同期レプリケーションによる読み取り性能スケーリングを目的とします。"
            },
            {
                id: 2,
                question: "Amazon Aurora の Auto Scaling 機能で調整される要素は？",
                options: [
                    "ストレージ容量のみ",
                    "Read Replica の数とコンピュート容量の両方",
                    "接続数のみ",
                    "バックアップ頻度のみ"
                ],
                correct: 1,
                explanation: "Aurora Auto Scaling は、Read Replica の自動追加・削除（読み取りワークロード対応）と、Aurora Serverless でのコンピュート容量自動調整の両方をサポートします。"
            },
            {
                id: 3,
                question: "DynamoDB Global Tables の一貫性モデルは？",
                options: [
                    "強一貫性のみ",
                    "結果整合性で、通常1秒以内に全リージョンに伝搬",
                    "設定可能な一貫性レベル",
                    "一貫性保証なし"
                ],
                correct: 1,
                explanation: "DynamoDB Global Tables は結果整合性モデルを採用し、一つのリージョンでの更新が通常1秒以内に他のすべてのリージョンに非同期で伝搬されます。"
            },
            {
                id: 4,
                question: "S3 Cross-Region Replication (CRR) の前提条件は？",
                options: [
                    "ソースとデスティネーションバケットで同じストレージクラスを使用",
                    "バージョニングが両方のバケットで有効になっている必要がある",
                    "同一アカウント内のバケットのみ対象",
                    "手動でのレプリケーション設定が必要"
                ],
                correct: 1,
                explanation: "S3 CRR を設定するには、ソースとデスティネーション両方のバケットでバージョニングが有効になっている必要があります。異なるアカウント間でも設定可能です。"
            },
            {
                id: 5,
                question: "ElastiCache Redis の Auth Token の用途は？",
                options: [
                    "データ暗号化のためのキー",
                    "Redis コマンド実行時の認証パスワード",
                    "バックアップファイルの暗号化",
                    "ネットワーク接続の暗号化"
                ],
                correct: 1,
                explanation: "Redis Auth Token は、Redis クラスターへの接続時にクライアントが提供する必要がある認証パスワードで、認証機能を有効にすることでセキュリティを向上させます。"
            },
            {
                id: 6,
                question: "Amazon EFS の Performance Mode の選択基準は？",
                options: [
                    "常に Max I/O を選択",
                    "低レイテンシ重視なら General Purpose、高スループット重視なら Max I/O",
                    "ストレージ容量で決定",
                    "コストで決定"
                ],
                correct: 1,
                explanation: "General Purpose は低レイテンシを提供し、Max I/O はより高いスループットと IOPS を実現しますが、わずかにレイテンシが高くなります。ワークロードの要件に応じて選択します。"
            },
            {
                id: 7,
                question: "RDS Proxy の主な利点は？",
                options: [
                    "データベースの自動バックアップ",
                    "接続プーリングによる接続効率化とフェイルオーバー時間短縮",
                    "SQL クエリの自動最適化",
                    "データの自動暗号化"
                ],
                correct: 1,
                explanation: "RDS Proxy は接続プーリング、接続の再利用、フェイルオーバー時の迅速な接続切り替えを提供し、特に Lambda のようなサーバーレス環境での DB 接続効率を大幅に改善します。"
            },
            {
                id: 8,
                question: "DynamoDB DAX (DynamoDB Accelerator) の適用場面は？",
                options: [
                    "書き込み集約型ワークロード",
                    "マイクロ秒レベルの読み取りレイテンシが必要な読み取り集約型ワークロード",
                    "データ分析処理",
                    "バックアップ処理"
                ],
                correct: 1,
                explanation: "DAX は DynamoDB の前面に配置されるインメモリキャッシュで、読み取りレイテンシをミリ秒からマイクロ秒レベルまで短縮し、読み取り集約型アプリケーションのパフォーマンスを劇的に向上させます。"
            },
            {
                id: 9,
                question: "S3 の Multipart Upload の利点は？",
                options: [
                    "小さなファイル専用の機能",
                    "大きなファイルの並列アップロード、再開可能、失敗時の部分的リトライ",
                    "コスト削減のみ",
                    "セキュリティ向上のみ"
                ],
                correct: 1,
                explanation: "Multipart Upload は大きなオブジェクト（100MB以上推奨）を複数の部分に分割して並列アップロードし、ネットワーク効率向上、障害時の部分リトライ、アップロード再開を可能にします。"
            },
            {
                id: 10,
                question: "Amazon Redshift の Concurrency Scaling の仕組みは？",
                options: [
                    "ストレージ容量を自動拡張",
                    "読み取りクエリの高負荷時に追加クラスターを自動起動してクエリを分散処理",
                    "接続数を自動調整",
                    "バックアップ頻度を調整"
                ],
                correct: 1,
                explanation: "Concurrency Scaling は、読み取りクエリのキューイングが発生した際に、追加の Redshift クラスターを自動起動してクエリを分散処理し、一貫したパフォーマンスを維持します。"
            },
            {
                id: 11,
                question: "Amazon Aurora Global Database の主な用途は？",
                options: [
                    "単一リージョン内の高可用性のみ",
                    "複数リージョン間でのデータレプリケーションと1秒未満のRPOによるディザスタリカバリ",
                    "データベースのバックアップ専用",
                    "読み取り性能の向上のみ"
                ],
                correct: 1,
                explanation: "Aurora Global Databaseは、最大5つのセカンダリリージョンに1秒未満のレイテンシでレプリケーションし、リージョン障害時には1分未満でフェイルオーバー可能です。グローバルな読み取りスケーリングとディザスタリカバリを同時に実現します。"
            },
            {
                id: 12,
                question: "Amazon S3 Glacier Instant Retrieval の適用シナリオは？",
                options: [
                    "頻繁にアクセスされるデータ",
                    "四半期に1回程度アクセスされ、ミリ秒取得が必要なアーカイブデータ（医療画像、メディアアセット）",
                    "リアルタイム処理データ",
                    "1日複数回アクセスされるデータ"
                ],
                correct: 1,
                explanation: "S3 Glacier Instant Retrievalは、年に数回しかアクセスされないが、必要時には即座（ミリ秒）に取得が必要なデータに最適です。S3 Standard-IAより68%低コストで、取得時間はS3 Standardと同等です。医療画像、ニュースアーカイブ、コンプライアンスデータに適しています。"
            },
            {
                id: 13,
                question: "Amazon DynamoDB の Auto Scaling と On-Demand モードの使い分けは？",
                options: [
                    "機能は同じ",
                    "Auto Scaling: 予測可能なトラフィック、On-Demand: 予測不可能なスパイクトラフィック",
                    "On-Demand は常に高コスト",
                    "Auto Scaling はリアルタイム対応不可"
                ],
                correct: 1,
                explanation: "Auto Scalingは予測可能なトラフィックパターンでコスト効率が良く、On-Demandモードはトラフィックが予測不可能、新規ワークロード、スパイク性トラフィックに適しています。On-Demandは事前容量プランニング不要で、使用量に応じた従量課金です。"
            },
            {
                id: 14,
                question: "Amazon RDS Proxy の主な利点は？",
                options: [
                    "データベースのバックアップ自動化",
                    "データベース接続プーリングとフェイルオーバー時間短縮によるLambda等のサーバーレス接続最適化",
                    "クエリの自動最適化",
                    "ストレージ容量の自動拡張"
                ],
                correct: 1,
                explanation: "RDS Proxyは、データベース接続をプールし、Lambda等のサーバーレスアプリケーションからの大量の短命接続を効率的に管理します。フェイルオーバー時間を最大66%短縮し、IAM認証、Secrets Manager統合によるセキュリティ強化も提供します。"
            },
            {
                id: 15,
                question: "Amazon EFS の Performance Mode と Throughput Mode の選択基準は？",
                options: [
                    "すべて同じ設定を使用",
                    "Performance: 汎用/最大I/O、Throughput: バースティング/プロビジョンド/Elastic を要件に応じて選択",
                    "Performance Modeのみ設定すればよい",
                    "自動で最適化される"
                ],
                correct: 1,
                explanation: "Performance Modeは汎用（レイテンシ重視）と最大I/O（高スループット・並列性重視）から選択。Throughput Modeはバースティング（小～中規模）、プロビジョンド（一定の高スループット）、Elastic（自動スケール、推奨）から選択します。ビッグデータ分析は最大I/O+Elastic、Webサーバーは汎用+バースティングが適しています。"
            }
        ]
    },
    "analytics-bigdata": {
        title: "分析・ビッグデータ",
        icon: "📊",
        questions: [
            {
                id: 1,
                question: "Amazon Kinesis Data Streams と Kinesis Data Firehose の使い分けは？",
                options: [
                    "機能は同じで名称のみ異なる",
                    "Data Streams はリアルタイム処理、Data Firehose はS3/Redshift等への配信に特化",
                    "Data Firehose の方が高速",
                    "Data Streams はバッチ処理専用"
                ],
                correct: 1,
                explanation: "Data Streams はリアルタイムデータ処理（Lambda、Analytics）に適し、Data Firehose はデータレイクやデータウェアハウスへの継続的配信に最適化されています。"
            },
            {
                id: 2,
                question: "AWS Glue Crawler の役割は？",
                options: [
                    "データの物理的な移動",
                    "データソースを自動スキャンしてスキーマを検出・Data Catalog に登録",
                    "データの暗号化",
                    "データのバックアップ"
                ],
                correct: 1,
                explanation: "Glue Crawler は S3、RDS、DynamoDB 等のデータソースを自動スキャンし、スキーマ情報を検出して AWS Glue Data Catalog にメタデータとして登録します。"
            },
            {
                id: 3,
                question: "Amazon EMR の Spot Instance 活用における考慮点は？",
                options: [
                    "Master ノードでも積極的に使用",
                    "Task ノードのみで使用し、Core ノードは On-Demand で安定性確保",
                    "すべてのノードでSpot Instanceを使用",
                    "コスト削減効果がない"
                ],
                correct: 1,
                explanation: "EMR では Master と Core ノードの中断がクラスター全体に影響するため、Task ノード（処理のみ）でSpot Instanceを使用し、Core ノードは On-Demand で安定性を保つのがベストプラクティスです。"
            },
            {
                id: 4,
                question: "Amazon Athena のパフォーマンス最適化手法は？",
                options: [
                    "データをそのまま保存",
                    "データのパーティション化、列指向形式（Parquet）、データ圧縮の組み合わせ",
                    "単一の大きなファイルで保存",
                    "テキスト形式での保存"
                ],
                correct: 1,
                explanation: "Athena のパフォーマンス最適化には、適切なパーティション設計、Parquet等の列指向形式、圧縮、適切なファイルサイズ（128MB-1GB）の組み合わせが効果的です。"
            },
            {
                id: 5,
                question: "AWS Lake Formation の Fine-grained Access Control の特徴は？",
                options: [
                    "テーブルレベルの権限のみ",
                    "行レベル・列レベルでの詳細な権限制御が可能",
                    "ファイルレベルの権限のみ",
                    "読み取り専用の権限のみ"
                ],
                correct: 1,
                explanation: "Lake Formation は、従来のテーブルレベル権限に加えて、特定の行（WHERE条件）や列の組み合わせでの詳細なアクセス制御を提供し、データガバナンスを強化します。"
            },
            {
                id: 6,
                question: "Amazon Kinesis Analytics (現 Kinesis Data Analytics) でのウィンドウ処理の種類は？",
                options: [
                    "固定ウィンドウのみ",
                    "固定ウィンドウ、スライディングウィンドウ、セッションウィンドウが利用可能",
                    "スライディングウィンドウのみ",
                    "ウィンドウ処理はサポートしていない"
                ],
                correct: 1,
                explanation: "Kinesis Data Analytics は時間ベースの固定ウィンドウ、スライディングウィンドウ、非アクティブ時間によるセッションウィンドウなど、多様なウィンドウ処理をサポートします。"
            },
            {
                id: 7,
                question: "Amazon QuickSight の SPICE エンジンの利点は？",
                options: [
                    "データストレージ機能のみ",
                    "インメモリ計算によるクエリ高速化とコスト効率的な分析",
                    "データバックアップ機能",
                    "データ暗号化機能のみ"
                ],
                correct: 1,
                explanation: "SPICE（Super-fast, Parallel, In-memory Calculation Engine）は、データを高速なインメモリストレージに格納し、分析クエリを大幅に高速化すると同時に、ソースデータベースへの負荷も軽減します。"
            },
            {
                id: 8,
                question: "AWS Data Pipeline と AWS Glue の使い分けは？",
                options: [
                    "機能は同じで新旧の違いのみ",
                    "Data Pipeline は従来のETL/スケジューリング、Glue はサーバーレスなETL/データカタログ",
                    "Data Pipeline の方が高機能",
                    "Glue はバッチ処理のみ"
                ],
                correct: 1,
                explanation: "Data Pipeline は EC2 ベースの従来型ETLとスケジューリングに適し、Glue はサーバーレスETL、自動スケーリング、データカタログ統合に優れ、モダンなデータ処理に適しています。"
            },
            {
                id: 9,
                question: "Amazon Elasticsearch Service (現 OpenSearch Service) のクラスター設計ベストプラクティスは？",
                options: [
                    "すべてを単一ノードで処理",
                    "専用マスターノード、データノード、UltraWarm ノードの役割分離",
                    "マスターノードのみで構成",
                    "データノードは必要ない"
                ],
                correct: 1,
                explanation: "大規模クラスターでは、専用マスターノード（クラスター管理）、データノード（インデックス・検索）、UltraWarm ノード（アーカイブデータ）の役割分離により、安定性とコスト効率を両立します。"
            },
            {
                id: 10,
                question: "AWS MSK (Managed Streaming for Apache Kafka) のセキュリティ機能は？",
                options: [
                    "暗号化機能なし",
                    "保存時・転送時暗号化、IAM/SASL認証、ACLによるトピックレベル権限制御",
                    "転送時暗号化のみ",
                    "認証機能なし"
                ],
                correct: 1,
                explanation: "MSK は KMS による保存時暗号化、TLS による転送時暗号化、IAM および SASL/SCRAM 認証、Kafka ACL によるトピック・コンシューマーグループレベルの詳細な権限制御を提供します。"
            },
            {
                id: 11,
                question: "Amazon Kinesis Data Analytics for Apache Flink の主な用途は？",
                options: [
                    "バッチ処理専用",
                    "リアルタイムストリームデータの複雑な変換・集計・分析をSQL/Java/Scalaで実装",
                    "静的データの分析のみ",
                    "ログ保存専用"
                ],
                correct: 1,
                explanation: "Kinesis Data Analytics for Apache Flink は、ストリーミングデータに対してウィンドウ集計、結合、パターン検出、機械学習推論などの複雑な処理を、Apache Flink の Java/Scala/SQL API で実装できるマネージドサービスです。自動スケーリング、チェックポイント、フォールトトレランスを提供します。"
            },
            {
                id: 12,
                question: "Amazon Redshift Spectrum の活用シーンは？",
                options: [
                    "Redshift クラスター内のデータのみクエリ可能",
                    "S3 の Exabyte スケールのデータを Redshift クラスターにロードせずに直接 SQL クエリ",
                    "リアルタイムデータ処理専用",
                    "データのコピーが必須"
                ],
                correct: 1,
                explanation: "Redshift Spectrum は、S3 上の構造化・半構造化データ（Parquet、ORC、JSON、CSV等）を Redshift クラスターにロードすることなく、標準 SQL でクエリできます。Redshift のテーブルと S3 のデータを JOIN することも可能で、コスト効率的なデータレイク分析を実現します。"
            },
            {
                id: 13,
                question: "AWS Glue DataBrew の主な用途は？",
                options: [
                    "データベースのバックアップ",
                    "ビジュアルインターフェースでのデータクレンジング・正規化（コード不要のデータ準備）",
                    "機械学習モデルのトレーニング",
                    "リアルタイムストリーミング"
                ],
                correct: 1,
                explanation: "AWS Glue DataBrew は、データアナリストやビジネスユーザーがコードを書かずに、ビジュアルインターフェースで250以上の事前構築済み変換を使用してデータのクレンジング、正規化、標準化を行えるサービスです。データ品質ルールの定義、異常値検出、データプロファイリングも可能です。"
            },
            {
                id: 14,
                question: "Amazon QuickSight の SPICE エンジンの利点は？",
                options: [
                    "データソースへ常に直接クエリ",
                    "インメモリ計算エンジンで高速なビジュアル分析とダッシュボード応答性を実現",
                    "データの保存は不可",
                    "リアルタイムデータのみ対応"
                ],
                correct: 1,
                explanation: "SPICE（Super-fast, Parallel, In-memory Calculation Engine）は、QuickSight のインメモリエンジンで、データを圧縮・最適化してメモリに格納し、数百万行のデータセットでも秒以下の応答時間を実現します。データソースへの負荷を削減し、コスト効率的な BI 分析を提供します。"
            },
            {
                id: 15,
                question: "AWS Lake Formation の主な機能とメリットは？",
                options: [
                    "S3 バケットの作成専用",
                    "データレイクの構築・セキュリティ・ガバナンスを数日で実装（データ収集、カタログ化、クレンジング、アクセス制御の一元管理）",
                    "データベースのバックアップ専用",
                    "リアルタイム処理専用"
                ],
                correct: 1,
                explanation: "Lake Formation は、S3 ベースのデータレイクを数日で構築できるサービスで、①データ取り込み（バッチ/ストリーミング）、②Glue データカタログとの統合、③行・列・セルレベルの詳細なアクセス制御、④データガバナンス（監査ログ、データ系列追跡）を一元管理します。複雑な IAM ポリシー設定が不要になります。"
            }
        ]
    },
    "monitoring-logging": {
        title: "監視・ログギング",
        icon: "📈",
        questions: [
            {
                id: 1,
                question: "CloudWatch Custom Metrics の名前空間設計のベストプラクティスは？",
                options: [
                    "すべてのメトリクスを同一名前空間に配置",
                    "アプリケーション・環境・チーム別に階層的な名前空間を設計",
                    "名前空間は使用しない",
                    "AWS標準の名前空間のみ使用"
                ],
                correct: 1,
                explanation: "Custom Metrics は「MyCompany/Production/WebApp」のような階層的な名前空間設計により、メトリクスの整理、フィルタリング、権限管理、コスト配分を効率化できます。"
            },
            {
                id: 2,
                question: "AWS X-Ray のサンプリングルールの目的は？",
                options: [
                    "すべてのリクエストを記録",
                    "コストとパフォーマンスを考慮して記録するトレースの割合を制御",
                    "エラーのみを記録",
                    "重要なAPIのみを記録"
                ],
                correct: 1,
                explanation: "X-Ray サンプリングルールは、トレースデータの記録割合を動的に制御し、パフォーマンス影響とコストを最適化しながら、統計的に有意なトレース情報を収集します。"
            },
            {
                id: 3,
                question: "CloudWatch Logs Insights のクエリ最適化手法は？",
                options: [
                    "時間範囲の指定は不要",
                    "適切な時間範囲、fields の限定、filter の早期適用でクエリ効率化",
                    "すべてのフィールドを常に取得",
                    "並列処理は使用しない"
                ],
                correct: 1,
                explanation: "Logs Insights では、検索時間範囲の適切な指定、必要なフィールドのみの選択、filter による早期データ絞り込みにより、クエリパフォーマンスとコストを最適化できます。"
            },
            {
                id: 4,
                question: "AWS Systems Manager Compliance の評価対象は？",
                options: [
                    "ネットワーク設定のみ",
                    "パッチレベル、設定ファイル、ソフトウェアインベントリの合規性",
                    "コストのみ",
                    "パフォーマンスのみ"
                ],
                correct: 1,
                explanation: "SSM Compliance は、パッチ適用状況、セキュリティ設定、インストール済みソフトウェア、カスタム設定などを評価し、組織のコンプライアンス要件に対する準拠状況を一元管理します。"
            },
            {
                id: 5,
                question: "CloudWatch Container Insights が提供するメトリクス情報は？",
                options: [
                    "EC2インスタンスレベルのみ",
                    "ECS/EKSクラスター、サービス、タスク、Pod レベルの詳細なパフォーマンスメトリクス",
                    "ネットワークメトリクスのみ",
                    "ログ情報のみ"
                ],
                correct: 1,
                explanation: "Container Insights は、CPU、メモリ、ディスク、ネットワーク使用率をクラスター、サービス、タスク/Pod、コンテナの各レベルで収集し、コンテナ環境の詳細な可視化を提供します。"
            },
            {
                id: 6,
                question: "AWS CloudTrail の Insight Events の検出内容は？",
                options: [
                    "すべてのAPI呼び出し",
                    "通常と異なるパターンのAPI活動や異常なアクセス行動",
                    "成功したAPIコールのみ",
                    "エラーのAPIコールのみ"
                ],
                correct: 1,
                explanation: "CloudTrail Insights は機械学習を使用して、通常の API 使用パターンを学習し、異常なボリューム増加、新しいユーザーエージェント、地理的に異常なアクセスなどを自動検出します。"
            },
            {
                id: 7,
                question: "Amazon EventBridge でのカスタムパターンマッチングの利点は？",
                options: [
                    "単純な文字列マッチングのみ",
                    "JSON構造を理解した柔軟なルールベースのイベントルーティング",
                    "正規表現は使用できない",
                    "数値比較はできない"
                ],
                correct: 1,
                explanation: "EventBridge は JSON イベントの構造を理解し、ネストしたフィールド、配列、数値範囲、文字列パターンなどの複雑な条件でイベントをフィルタリング・ルーティングできます。"
            },
            {
                id: 8,
                question: "CloudWatch Synthetics の監視タイプは？",
                options: [
                    "API監視のみ",
                    "API エンドポイント監視とブラウザベースのユーザージャーニー監視",
                    "ファイル監視のみ",
                    "データベース監視のみ"
                ],
                correct: 1,
                explanation: "CloudWatch Synthetics は、REST API の可用性・レスポンス時間監視と、実際のブラウザを使用したユーザージャーニー（ログイン、購入フローなど）の総合監視を提供します。"
            },
            {
                id: 9,
                question: "AWS Config Rules の修復アクション（Remediation）の仕組みは？",
                options: [
                    "手動修復のみ",
                    "非準拠リソース検出時にSSM DocumentやLambda関数を自動実行して修復",
                    "ログ出力のみ",
                    "削除のみ可能"
                ],
                correct: 1,
                explanation: "Config Rules の自動修復機能は、非準拠リソースを検出すると事前定義された SSM Document や Lambda 関数を自動実行し、セキュリティグループ設定修正やタグ追加などの自動修復を行います。"
            },
            {
                id: 10,
                question: "CloudWatch Application Signals の主な機能は？",
                options: [
                    "インフラ監視のみ",
                    "アプリケーションパフォーマンスの自動計測とSLI/SLO管理",
                    "ログ収集のみ",
                    "コスト監視のみ"
                ],
                correct: 1,
                explanation: "Application Signals は、分散アプリケーションのレスポンス時間、エラー率、スループットを自動計測し、SLI（Service Level Indicators）と SLO（Service Level Objectives）によるサービス品質管理を支援します。"
            },
            {
                id: 11,
                question: "CloudWatch Logs Insights の高度なクエリパターンは？",
                options: [
                    "固定フォーマットのログのみ検索可能",
                    "SQLライクな構文で、フィルタ、集計、統計、可視化を実行し、アプリケーション問題を迅速に診断",
                    "手動でログをダウンロードして分析",
                    "単純なキーワード検索のみ"
                ],
                correct: 1,
                explanation: "CloudWatch Logs Insightsは、fields、filter、stats、sort等のコマンドを使い、JSON/構造化ログから特定フィールドを抽出・集計・可視化できます。例：5xx エラーの時系列推移、レスポンスタイムのパーセンタイル分析、IPアドレス別アクセス数など。数十億行のログを数秒で分析可能です。"
            },
            {
                id: 12,
                question: "AWS Systems Manager OpsCenter の主な用途は？",
                options: [
                    "コスト管理専用",
                    "運用上の問題（OpsItems）を一元管理し、CloudWatch、Config、EventBridgeと統合して問題解決を追跡",
                    "データベースバックアップ専用",
                    "ネットワーク設定専用"
                ],
                correct: 1,
                explanation: "OpsCenterは、CloudWatchアラーム、Config非準拠、EventBridgeイベント、手動作成からOpsItems（運用問題チケット）を自動生成します。関連ログ、メトリクス、設定変更履歴を集約し、Runbook（自動化ドキュメント）と連携して問題解決を支援します。チーム間のコラボレーションとMTTR短縮を実現します。"
            },
            {
                id: 13,
                question: "CloudWatch Synthetics Canaries の活用シナリオは？",
                options: [
                    "サーバーのCPU監視のみ",
                    "エンドユーザー視点でのWebサイト・APIの可用性とパフォーマンスを定期的に監視（合成監視）",
                    "ログの収集専用",
                    "データベースの監視専用"
                ],
                correct: 1,
                explanation: "Synthetics Canariesは、Node.js/Pythonスクリプトで、Webサイトのマルチステップユーザージャーニー、REST API、UIワークフロー、リンク切れ、ログインフローを定期実行（1分～1時間間隔）し、エンドユーザーが問題に気づく前に障害を検出します。スクリーンショット、HAR ファイル、詳細ログを保存します。"
            },
            {
                id: 14,
                question: "Amazon Managed Grafana と Amazon Managed Service for Prometheus の統合メリットは？",
                options: [
                    "ログ収集の自動化",
                    "Prometheusでメトリクス収集、Grafanaで可視化・アラートの統合オブザーバビリティプラットフォーム",
                    "コスト削減専用",
                    "セキュリティスキャン専用"
                ],
                correct: 1,
                explanation: "Amazon Managed Service for Prometheus（AMP）でコンテナ、Kubernetes、アプリケーションメトリクスを収集・保存し、Amazon Managed Grafana（AMG）で可視化・ダッシュボード作成・アラート設定します。EKS、ECS、EC2、オンプレミスからのメトリクスを統合し、長期保存、高可用性、スケーラビリティをマネージドで実現します。"
            },
            {
                id: 15,
                question: "CloudWatch Contributor Insights の用途は？",
                options: [
                    "コスト分析専用",
                    "ログデータからトップN項目（IPアドレス、エラーコード、ユーザーエージェント等）を特定し、異常なトラフィックパターンを発見",
                    "データベース性能分析専用",
                    "ネットワーク設定専用"
                ],
                correct: 1,
                explanation: "Contributor Insightsは、VPC Flow Logs、CloudTrail、アプリケーションログから、トップ10のIPアドレス、最も頻繁なエラーコード、最大帯域幅消費者などを自動抽出します。DDoS攻撃の検出、ボトルネックの特定、異常なAPI呼び出し元の発見に有効です。ルールベースの分析で、リアルタイムに可視化されます。"
            }
        ]
    },
    "ai-machine-learning": {
        title: "AI・機械学習",
        icon: "🤖",
        questions: [
            {
                id: 1,
                question: "Amazon SageMaker の推論エンドポイントの種類は？",
                options: [
                    "リアルタイム推論のみ",
                    "リアルタイム推論、バッチ変換、マルチモデルエンドポイント、非同期推論",
                    "バッチ処理のみ",
                    "ストリーミング推論のみ"
                ],
                correct: 1,
                explanation: "SageMaker は用途に応じて、リアルタイム推論（低レイテンシ）、バッチ変換（大量データ）、マルチモデルエンドポイント（コスト効率）、非同期推論（長時間処理）の選択肢を提供します。"
            },
            {
                id: 2,
                question: "Amazon Comprehend の感情分析で検出される感情は？",
                options: [
                    "ポジティブ・ネガティブのみ",
                    "ポジティブ、ネガティブ、ニュートラル、混在の4種類",
                    "喜怒哀楽の4種類",
                    "数値スコアのみ"
                ],
                correct: 1,
                explanation: "Amazon Comprehend の感情分析は、ポジティブ、ネガティブ、ニュートラル、混在（Mixed）の4つの感情カテゴリと、それぞれの信頼度スコアを提供します。"
            },
            {
                id: 3,
                question: "Amazon Rekognition の顔認識と顔検索の違いは？",
                options: [
                    "機能は同じ",
                    "顔検識は顔の検出・分析、顔検索は既知の顔データベースとの照合",
                    "顔検索の方が高速",
                    "顔検識の方が高精度"
                ],
                correct: 1,
                explanation: "顔検識（DetectFaces）は画像内の顔検出と属性分析を行い、顔検索（SearchFaces）は事前に登録された顔コレクションとの照合により人物特定を行います。"
            },
            {
                id: 4,
                question: "Amazon Textract の文書分析機能の範囲は？",
                options: [
                    "OCRのみ",
                    "OCR、テーブル抽出、フォーム項目抽出、手書き文字認識",
                    "手書き文字のみ",
                    "英語のみ対応"
                ],
                correct: 1,
                explanation: "Textract は OCR に加えて、表形式データの構造保持、フォームのキー・バリューペア抽出、手書き文字認識、複数言語対応の包括的な文書分析機能を提供します。"
            },
            {
                id: 5,
                question: "Amazon Lex V2 の主な改善点は？",
                options: [
                    "機能は同じ",
                    "多言語サポート、ストリーミング会話、改善された意図認識精度",
                    "価格のみ変更",
                    "UIのみ改善"
                ],
                correct: 1,
                explanation: "Lex V2 は、リアルタイムストリーミング会話、多言語サポート（8言語以上）、改善されたNLU（Natural Language Understanding）エンジン、柔軟な会話フローを提供します。"
            },
            {
                id: 6,
                question: "Amazon Polly の音声カスタマイズ機能は？",
                options: [
                    "音声速度のみ調整可能",
                    "SSML対応による発音、イントネーション、音声速度、音量の詳細制御",
                    "言語変更のみ",
                    "カスタマイズ機能なし"
                ],
                correct: 1,
                explanation: "Amazon Polly は SSML（Speech Synthesis Markup Language）をサポートし、発音記号、イントネーション、間合い、音声速度、音量を詳細にカスタマイズして自然な音声合成を実現します。"
            },
            {
                id: 7,
                question: "Amazon Forecast の予測アルゴリズムの選択方法は？",
                options: [
                    "手動で単一アルゴリズムを選択",
                    "AutoMLによる複数アルゴリズムの自動評価・選択",
                    "線形回帰のみ使用",
                    "ランダムに選択"
                ],
                correct: 1,
                explanation: "Amazon Forecast の AutoML は、CNN-QR、Prophet、ARIMA、ETS など複数の予測アルゴリズムを自動評価し、データセットに最適なアルゴリズムまたはアンサンブルを選択します。"
            },
            {
                id: 8,
                question: "Amazon Personalize のリアルタイム推薦の仕組みは？",
                options: [
                    "バッチ処理のみ",
                    "ユーザーの行動履歴をリアルタイム取得してパーソナライズされた推薦を生成",
                    "事前計算された推薦のみ",
                    "ランダム推薦"
                ],
                correct: 1,
                explanation: "Amazon Personalize は、ユーザーのクリック、購入、評価などのインタラクションデータをリアルタイムで学習し、その場でパーソナライズされた推薦を生成するリアルタイム推論をサポートします。"
            },
            {
                id: 9,
                question: "Amazon Transcribe の話者識別（Speaker Diarization）機能は？",
                options: [
                    "単一話者のみ識別",
                    "複数話者を自動識別し、発話内容を話者別に分離",
                    "話者の感情のみ識別",
                    "話者の年齢のみ識別"
                ],
                correct: 1,
                explanation: "Speaker Diarization は、音声ファイル内の複数話者を自動で識別・分離し、「話者A」「話者B」として発話内容をタイムスタンプ付きで分類する機能です。"
            },
            {
                id: 10,
                question: "Amazon Bedrock の基盤モデル（Foundation Models）の利用方法は？",
                options: [
                    "モデルの再トレーニングが必要",
                    "事前トレーニング済みモデルをAPI経由で直接利用、またはファインチューニング",
                    "ソースコードの提供が必要",
                    "専用ハードウェアが必要"
                ],
                correct: 1,
                explanation: "Amazon Bedrock は、Anthropic Claude、Meta Llama 等の事前トレーニング済み基盤モデルを API 経由で利用でき、さらに独自データでのファインチューニングも可能なマネージドサービスです。"
            },
            {
                id: 11,
                question: "Amazon SageMaker の Multi-Model Endpoint の利点は？",
                options: [
                    "単一モデルのみホスティング可能",
                    "1つのエンドポイントで数千の機械学習モデルをホストしてコスト削減（モデル間で推論インスタンスを共有）",
                    "リアルタイム推論不可",
                    "バッチ推論のみ対応"
                ],
                correct: 1,
                explanation: "Multi-Model Endpoint は、S3 に保存された複数のモデルを 1 つの SageMaker エンドポイントでホストし、リクエストに応じて動的にモデルをロード・推論します。モデルごとにエンドポイントを作成する必要がなく、推論インスタンスのコストを最大70%削減できます。"
            },
            {
                id: 12,
                question: "Amazon SageMaker Autopilot の主な機能は？",
                options: [
                    "手動でのハイパーパラメータ調整が必要",
                    "表形式データから自動的に最適な機械学習モデルを構築（AutoML）し、説明可能性レポートも生成",
                    "画像データのみ対応",
                    "モデルのデプロイは不可"
                ],
                correct: 1,
                explanation: "SageMaker Autopilot は、CSV 形式の表形式データを入力すると、自動的にデータ前処理、特徴量エンジニアリング、アルゴリズム選択、ハイパーパラメータ最適化を実行し、最適なモデルを構築します。さらに、モデルの説明可能性レポート（SHAP値）も自動生成され、モデルの透明性を確保できます。"
            },
            {
                id: 13,
                question: "Amazon Rekognition Custom Labels の活用シーンは？",
                options: [
                    "一般的な物体検出のみ",
                    "独自のビジネス固有オブジェクト（ロゴ、製品、欠陥品等）を少量の画像で学習し、カスタム画像分類・物体検出",
                    "動画処理不可",
                    "事前トレーニングされたモデルのみ使用可能"
                ],
                correct: 1,
                explanation: "Rekognition Custom Labels は、数百枚程度の少量のラベル付き画像から、企業ロゴ、特定製品、製造業の欠陥品、医療画像の異常等、ビジネス固有のオブジェクトを認識するカスタム機械学習モデルを構築できます。転移学習により、少ないデータで高精度なモデルを実現します。"
            },
            {
                id: 14,
                question: "Amazon Comprehend Medical の主な用途は？",
                options: [
                    "一般的なテキスト分析",
                    "医療テキストから病名、薬剤名、検査結果、治療法等の医療情報を自動抽出（HIPAA適格）",
                    "画像の医療診断",
                    "患者の予約管理"
                ],
                correct: 1,
                explanation: "Amazon Comprehend Medical は、医師のノート、電子カルテ、臨床試験報告等の非構造化医療テキストから、Protected Health Information（PHI）、病名、薬剤、投与量、検査結果、治療法、解剖学的部位を自動抽出し、構造化データに変換します。HIPAA 適格サービスで医療データを安全に処理できます。"
            },
            {
                id: 15,
                question: "Amazon Kendra の企業検索における他の検索サービスとの違いは？",
                options: [
                    "キーワードマッチングのみ",
                    "自然言語理解と機械学習により、質問の意図を理解して最も関連性の高い回答を抽出（セマンティック検索）",
                    "ファイル検索のみ",
                    "外部データソース非対応"
                ],
                correct: 1,
                explanation: "Amazon Kendra は、自然言語処理と機械学習を活用した企業向けインテリジェント検索サービスで、「どのように〜するか？」等の質問形式のクエリから意図を理解し、S3、SharePoint、Salesforce、RDS、Confluence等の複数データソースから最適な回答を抽出します。単純なキーワード検索より遥かに高精度な検索結果を提供します。"
            }
        ]
    }
};

// カテゴリごとの質問数をカウントする関数
function getTotalQuestions(categoryKey) {
    const category = quizData[categoryKey];
    if (!category) return 0;
    
    return category.questions.length;
}

// カテゴリの全質問を取得する関数
function getAllQuestions(categoryKey) {
    const category = quizData[categoryKey];
    if (!category) return [];
    
    return [...category.questions];
}