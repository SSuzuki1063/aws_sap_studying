#!/usr/bin/env python3
"""
残りの8カテゴリに各5問ずつ（計40問）を追加するスクリプト
"""

import re

# 各カテゴリに追加する問題データ
additional_questions = {
    "development-deployment": [
        # id 11-15
        {
            "id": 11,
            "question": "AWS CodePipeline で複数環境（Dev、Staging、Prod）への段階的デプロイを実装するベストプラクティスは？",
            "options": [
                "1つのパイプラインですべての環境に同時デプロイ",
                "各ステージに承認アクション（Manual Approval）を挿入し、環境ごとにデプロイを制御",
                "環境ごとに独立したパイプラインを作成",
                "すべて手動でデプロイ"
            ],
            "correct": 1,
            "explanation": "CodePipelineでは、各環境へのデプロイステージの間にManual Approval Actionを配置することで、前の環境でのテスト完了後に承認者がレビュー・承認してから次の環境へデプロイする段階的リリースを実装できます。これにより、本番環境への影響を最小化できます。"
        },
        {
            "id": 12,
            "question": "AWS SAM (Serverless Application Model) の主な利点は？",
            "options": [
                "EC2インスタンスの管理を簡素化",
                "Lambda、API Gateway、DynamoDB等のサーバーレスリソースをシンプルな構文で定義し、デプロイを自動化",
                "コンテナイメージのビルド専用",
                "RDSデータベースの管理専用"
            ],
            "correct": 1,
            "explanation": "AWS SAMはCloudFormationの拡張で、Lambda関数、API Gateway、DynamoDBテーブル等のサーバーレスアプリケーションを簡潔なYAML/JSON構文で定義できます。`sam deploy`コマンドで、関数のパッケージング、S3アップロード、CloudFormationスタック作成を自動実行します。"
        },
        {
            "id": 13,
            "question": "AWS CDK (Cloud Development Kit) の TypeScript/Python コードから生成されるものは？",
            "options": [
                "直接AWSリソースが作成される",
                "CloudFormation テンプレート（JSON/YAML）が生成され、それを使ってデプロイ",
                "Terraform設定ファイル",
                "Ansible Playbook"
            ],
            "correct": 1,
            "explanation": "CDKはプログラミング言語（TypeScript、Python、Java等）でインフラを定義し、`cdk synth`コマンドでCloudFormationテンプレートを生成します。その後`cdk deploy`でCloudFormationを使って実際のリソースをデプロイします。これによりIDEの補完機能、型チェック、再利用可能なコンポーネント（Construct）が活用できます。"
        },
        {
            "id": 14,
            "question": "CodeDeploy の In-place デプロイと Blue/Green デプロイの違いは？",
            "options": [
                "機能は同じで名称のみ異なる",
                "In-place: 既存インスタンスにデプロイ（ダウンタイム発生）、Blue/Green: 新インスタンスにデプロイ後トラフィック切替（ダウンタイムなし）",
                "In-place は本番のみ、Blue/Green は開発のみ",
                "In-place の方が高速"
            ],
            "correct": 1,
            "explanation": "In-placeデプロイは既存EC2インスタンスで旧バージョンを停止→新バージョンをデプロイするため短時間のダウンタイムが発生。Blue/Greenデプロイは新しいインスタンス群（Green）を構築し、ELBのトラフィックを切り替えることでゼロダウンタイムを実現し、問題時には即座にロールバック可能です。"
        },
        {
            "id": 15,
            "question": "EventBridge (旧CloudWatch Events) のイベントバスの活用シナリオは？",
            "options": [
                "HTTPリクエストのルーティングのみ",
                "AWSサービス、カスタムアプリケーション、SaaSパートナーからのイベントを受信し、複数のターゲット（Lambda、Step Functions、SNS等）にルーティング",
                "ログの保存専用",
                "メトリクスの集計専用"
            ],
            "correct": 1,
            "explanation": "EventBridgeは、EC2状態変化、S3バケットイベント、カスタムアプリケーションイベント、SaaSパートナー（Datadog、Zendesk等）からのイベントを受信し、ルールに基づいて20以上のAWSサービスや外部HTTPエンドポイントにルーティングします。イベント駆動アーキテクチャの中核となるサービスです。"
        }
    ],
    # 残りのカテゴリも同様に定義...
}

def format_question(q):
    """問題をJavaScript形式にフォーマット"""
    options_str = ",\n                    ".join([f'"{opt}"' for opt in q['options']])

    return f'''            {{
                id: {q['id']},
                question: "{q['question']}",
                options: [
                    {options_str}
                ],
                correct: {q['correct']},
                explanation: "{q['explanation']}"
            }}'''

# この後、他のカテゴリのデータも追加...

print("問題データ準備完了")
print(f"development-deployment: {len(additional_questions['development-deployment'])}問")
