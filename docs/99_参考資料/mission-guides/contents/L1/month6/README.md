# L1 月6: クラウドの頂を制覇しよう

## 概要

| 項目 | 内容 |
|-----|------|
| 対象 | L1（新人→一人前） |
| 総時間 | 20時間 |
| スキル | AWS（サービスを構築・運用できる）, マルチクラウド（複数クラウドでリソースを構築できる） |
| 前提 | L0修了、L1 月1〜月5修了（ネットワーク, Linux, DB, セキュリティ, CI/CD の基礎） |

---

## ステップ構成

### Step 1: AWSの基本サービスを理解しよう（3時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 1-1 | クラウドコンピューティングとは | LESSON | 15分 | [step1_1_cloud_overview.md](./step1_1_cloud_overview.md) |
| 1-2 | AWSの全体像とリージョン | LESSON | 30分 | [step1_2_aws_overview.md](./step1_2_aws_overview.md) |
| 1-3 | コンピューティングサービス（EC2） | LESSON | 30分 | [step1_3_ec2_basics.md](./step1_3_ec2_basics.md) |
| 1-4 | ストレージサービス（S3） | LESSON | 30分 | [step1_4_s3_basics.md](./step1_4_s3_basics.md) |
| 1-5 | データベースサービス（RDS） | LESSON | 30分 | [step1_5_rds_basics.md](./step1_5_rds_basics.md) |
| 1-6 | 理解度チェック | QUIZ | 15分 | [step1_6_quiz.md](./step1_6_quiz.md) |

### Step 2: EC2/S3/RDSを構築しよう（5時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 2-1 | EC2インスタンスの起動と設定 | LESSON | 30分 | [step2_1_ec2_launch.md](./step2_1_ec2_launch.md) |
| 2-2 | セキュリティグループの設定 | LESSON | 30分 | [step2_2_security_groups.md](./step2_2_security_groups.md) |
| 2-3 | S3バケットの作成と管理 | LESSON | 30分 | [step2_3_s3_management.md](./step2_3_s3_management.md) |
| 2-4 | RDSの構築とバックアップ | LESSON | 30分 | [step2_4_rds_setup.md](./step2_4_rds_setup.md) |
| 2-5 | 演習：3層アーキテクチャを構築しよう | EXERCISE | 120分 | [step2_5_exercise.md](./step2_5_exercise.md) |
| 2-6 | チェックポイント | QUIZ | 30分 | [step2_6_quiz.md](./step2_6_quiz.md) |

### Step 3: IAMでセキュリティを固めよう（3時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 3-1 | IAMの基本概念 | LESSON | 25分 | [step3_1_iam_basics.md](./step3_1_iam_basics.md) |
| 3-2 | ポリシーとロール | LESSON | 25分 | [step3_2_policies_roles.md](./step3_2_policies_roles.md) |
| 3-3 | 最小権限の原則を実践 | LESSON | 25分 | [step3_3_least_privilege.md](./step3_3_least_privilege.md) |
| 3-4 | MFAとアクセスキー管理 | LESSON | 25分 | [step3_4_mfa_access_keys.md](./step3_4_mfa_access_keys.md) |
| 3-5 | 演習：IAMポリシーを設計しよう | EXERCISE | 30分 | [step3_5_exercise.md](./step3_5_exercise.md) |
| 3-6 | チェックポイント | QUIZ | 15分 | [step3_6_quiz.md](./step3_6_quiz.md) |

### Step 4: VPCネットワークを設計しよう（4時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 4-1 | VPCの基本概念 | LESSON | 30分 | [step4_1_vpc_basics.md](./step4_1_vpc_basics.md) |
| 4-2 | サブネットとルーティング | LESSON | 30分 | [step4_2_subnets_routing.md](./step4_2_subnets_routing.md) |
| 4-3 | NATゲートウェイとインターネットゲートウェイ | LESSON | 30分 | [step4_3_nat_igw.md](./step4_3_nat_igw.md) |
| 4-4 | VPCピアリングとエンドポイント | LESSON | 30分 | [step4_4_peering_endpoints.md](./step4_4_peering_endpoints.md) |
| 4-5 | 演習：本番環境VPCを設計しよう | EXERCISE | 90分 | [step4_5_exercise.md](./step4_5_exercise.md) |
| 4-6 | チェックポイント | QUIZ | 30分 | [step4_6_quiz.md](./step4_6_quiz.md) |

### Step 5: マルチクラウドの視野を広げよう（2時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 5-1 | マルチクラウドの意義 | LESSON | 20分 | [step5_1_multicloud_overview.md](./step5_1_multicloud_overview.md) |
| 5-2 | GCPの主要サービス | LESSON | 20分 | [step5_2_gcp_services.md](./step5_2_gcp_services.md) |
| 5-3 | Azureの主要サービス | LESSON | 20分 | [step5_3_azure_services.md](./step5_3_azure_services.md) |
| 5-4 | クラウドサービス比較 | LESSON | 20分 | [step5_4_cloud_comparison.md](./step5_4_cloud_comparison.md) |
| 5-5 | マルチクラウド戦略 | LESSON | 20分 | [step5_5_multicloud_strategy.md](./step5_5_multicloud_strategy.md) |
| 5-6 | 理解度チェック | QUIZ | 20分 | [step5_6_quiz.md](./step5_6_quiz.md) |

### Step 6: クラウドアーキテクチャを完成させよう（3時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 6-1 | 総合演習：クラウド移行計画を作成しよう | EXERCISE | 90分 | [step6_1_final_exercise.md](./step6_1_final_exercise.md) |
| 6-2 | 卒業クイズ | QUIZ | 90分 | [step6_2_final_quiz.md](./step6_2_final_quiz.md) |

---

## 学習の流れ

```
Step 1 (3h)          Step 2 (5h)            Step 3 (3h)
[AWS基本サービス] → [EC2/S3/RDS構築]  → [IAMセキュリティ]
      ↓                  ↓                     ↓
Step 4 (4h)          Step 5 (2h)            Step 6 (3h)
[VPCネットワーク] → [マルチクラウド]    → [最終演習+クイズ]
```

---

## 前提知識からの成長マップ

| スキル | これまでに学んだこと | 今月学ぶこと |
|--------|---------------------|-------------|
| ネットワーク | TCP/IP、DNS、HTTP | VPC、サブネット、セキュリティグループ |
| Linux | コマンドライン、シェル操作 | EC2上でのサーバー構築・運用 |
| データベース | SQL基礎、テーブル設計 | RDS構築、バックアップ、マルチAZ |
| セキュリティ | OWASP、認証・認可 | IAM、ポリシー、MFA、最小権限 |
| インフラ | ローカル環境構築 | クラウドインフラ設計・構築 |

---

## 達成目標

このミッション完了後にできること：

- クラウドコンピューティングの基本概念とメリットを説明できる
- AWS の主要サービス（EC2、S3、RDS）を理解し、構築できる
- IAM を使ってセキュアなアクセス制御を設計できる
- VPC を使った本番環境レベルのネットワークを設計できる
- AWS/GCP/Azure の主要サービスを比較し、適切に選択できる
- クラウド移行計画を立案できる
