// AWS SAP クイズデータベース
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
            }
        ]
    }
};