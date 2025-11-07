// 残りの8カテゴリに追加する40問（各5問）

// ========================================
// 開発・デプロイメント (+5問: id 11-15)
// ========================================
const developmentDeploymentQuestions = [
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
        explanation: "AWS SAMはCloudFormationの拡張で、Lambda関数、API Gateway、DynamoDBテーブル等のサーバーレスアプリケーションを簡潔なYAML/JSON構文で定義できます。`sam deploy`コマンドで、関数のパッケージング、S3アップロード、CloudFormationスタック作成を自動実行します。"
    },
    {
        id: 13,
        question: "AWS CDK (Cloud Development Kit) の TypeScript/Python コードから生成されるものは？",
        options: [
            "直接AWSリソースが作成される",
            "CloudFormation テンプレート（JSON/YAML）が生成され、それを使ってデプロイ",
            "Terraform設定ファイル",
            "Ansible Playbook"
        ],
        correct: 1,
        explanation: "CDKはプログラミング言語（TypeScript、Python、Java等）でインフラを定義し、`cdk synth`コマンドでCloudFormationテンプレートを生成します。その後`cdk deploy`でCloudFormationを使って実際のリソースをデプロイします。これによりIDEの補完機能、型チェック、再利用可能なコンポーネント（Construct）が活用できます。"
    },
    {
        id: 14,
        question: "CodeDeploy の In-place デプロイと Blue/Green デプロイの違いは？",
        options: [
            "機能は同じで名称のみ異なる",
            "In-place: 既存インスタンスにデプロイ（ダウンタイム発生）、Blue/Green: 新インスタンスにデプロイ後トラフィック切替（ダウンタイムなし）",
            "In-place は本番のみ、Blue/Green は開発のみ",
            "In-place の方が高速"
        ],
        correct: 1,
        explanation: "In-placeデプロイは既存EC2インスタンスで旧バージョンを停止→新バージョンをデプロイするため短時間のダウンタイムが発生。Blue/Greenデプロイは新しいインスタンス群（Green）を構築し、ELBのトラフィックを切り替えることでゼロダウンタイムを実現し、問題時には即座にロールバック可能です。"
    },
    {
        id: 15,
        question: "EventBridge (旧CloudWatch Events) のイベントバスの活用シナリオは？",
        options: [
            "HTTPリクエストのルーティングのみ",
            "AWSサービス、カスタムアプリケーション、SaaSパートナーからのイベントを受信し、複数のターゲット（Lambda、Step Functions、SNS等）にルーティング",
            "ログの保存専用",
            "メトリクスの集計専用"
        ],
        correct: 1,
        explanation: "EventBridgeは、EC2状態変化、S3バケットイベント、カスタムアプリケーションイベント、SaaSパートナー（Datadog、Zendesk等）からのイベントを受信し、ルールに基づいて20以上のAWSサービスや外部HTTPエンドポイントにルーティングします。イベント駆動アーキテクチャの中核となるサービスです。"
    }
];

// ========================================
// Transit Gateway (+5問: id 11-15)
// ========================================
const transitGatewayQuestions = [
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
];

// 続く...（残りのカテゴリも同様に定義）
// 字数制限のため、次のファイルに分割します

console.log("開発・デプロイメント:", developmentDeploymentQuestions.length, "問");
console.log("Transit Gateway:", transitGatewayQuestions.length, "問");
