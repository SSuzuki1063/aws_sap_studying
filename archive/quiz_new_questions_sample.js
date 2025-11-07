// AWS SAP クイズ 新規問題サンプル
// 移行・モダナイゼーションカテゴリに追加する16問の例

// ========================================
// 移行・モダナイゼーションカテゴリ拡張 (+16問)
// ========================================

const newMigrationQuestions = [
    // AWS Application Discovery Service (2問)
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

    // AWS Migration Hub (2問)
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

    // AWS Snow Family (2問)
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

    // VM Import/Export (2問)
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

    // AWS DataSync (2問)
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

    // AWS Transfer Family (2問)
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

    // AWS Mainframe Modernization (2問)
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

    // Database Migration Patterns (2問)
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
];

// ========================================
// その他のカテゴリへの追加問題例
// ========================================

// セキュリティ・ガバナンス: シナリオベース問題
const newSecurityQuestions = [
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
];

// コンピュート: Lambda 詳細問題
const newComputeQuestions = [
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
];

// ネットワーキング: VPC Lattice 最新サービス
const newNetworkingQuestions = [
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
];

console.log("新規問題数:");
console.log(`  移行・モダナイゼーション: ${newMigrationQuestions.length}問`);
console.log(`  セキュリティ・ガバナンス（シナリオ）: ${newSecurityQuestions.length}問`);
console.log(`  コンピュート・アプリケーション: ${newComputeQuestions.length}問`);
console.log(`  ネットワーキング（最新サービス）: ${newNetworkingQuestions.length}問`);
console.log(`\n合計新規問題: ${newMigrationQuestions.length + newSecurityQuestions.length + newComputeQuestions.length + newNetworkingQuestions.length}問`);
