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