# 演習：3層アーキテクチャを構築しよう

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 2
subStep: 5
title: "演習：3層アーキテクチャを構築しよう"
itemType: EXERCISE
estimatedMinutes: 120
noiseLevel: MINIMAL
roadmap:
  skill: "AWS"
  category: "クラウド"
  target_level: "L1"
```

---

## ストーリー

> 「ここまでで EC2、S3、RDS の個別の構築方法を学んだな。
> いよいよそれらを組み合わせて、中村製作所さんの本番環境を想定した
> 3層アーキテクチャを構築してもらう」
>
> 山田先輩がホワイトボードにアーキテクチャ図を描く。
>
> 「Web 層、アプリケーション層、データベース層の3層だ。
> それぞれにセキュリティグループを設定して、最小権限でアクセス制御する。
> S3 は静的アセットの配信とバックアップに使う」
>
> 「結構大きな構成ですね......」
>
> 「大丈夫だ。一つずつ積み上げていけば完成する。
> まずは設計図を書いてから、AWS CLI で構築していこう」

---

## 演習の概要

中村製作所の受注管理システムを AWS 上に3層アーキテクチャで構築してください。

### 完成形のアーキテクチャ

```
            インターネット
                │
                ▼
       ┌───────────────┐
       │   ALB (ELB)    │
       │ (ロードバランサー)│
       └───────┬───────┘
               │
    ┌──────────┴──────────┐
    ▼                      ▼
┌─── AZ-a ────┐     ┌─── AZ-c ────┐
│              │     │              │
│  [EC2 Web]   │     │  [EC2 Web]   │   ← Web/App層
│              │     │              │
│  [RDS Primary]│    │  [RDS Standby]│   ← DB層
│              │     │              │
└──────────────┘     └──────────────┘

┌──────────────────────────┐
│  [S3] 静的アセット + バックアップ │
└──────────────────────────┘
```

### 要件

| 項目 | 要件 |
|------|------|
| Web/App サーバー | EC2 t3.small x 2台（マルチAZ） |
| ロードバランサー | ALB でトラフィックを分散 |
| データベース | RDS MySQL 8.0、マルチAZ |
| ストレージ | S3 バケット（静的アセット + バックアップ用） |
| セキュリティ | 3層それぞれにセキュリティグループ |
| 暗号化 | EBS, RDS, S3 全て暗号化 |

---

## 課題1: セキュリティグループの設計

以下の要件を満たすセキュリティグループを3つ設計してください。

- **ALB 用 SG**: インターネットから HTTP(80) / HTTPS(443) のみ許可
- **EC2 用 SG**: ALB からの HTTP(80) のみ許可、SSH(22) は踏み台のみ
- **RDS 用 SG**: EC2 からの MySQL(3306) のみ許可

各 SG のインバウンドルールを AWS CLI コマンドとして記述してください。

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```bash
# VPC の作成（既存VPCを使用する場合はスキップ）
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --query 'Vpc.VpcId' \
  --output text)

# ALB 用セキュリティグループ
ALB_SG=$(aws ec2 create-security-group \
  --group-name nakamura-alb-sg \
  --description "ALB Security Group" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG \
  --protocol tcp --port 80 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG \
  --protocol tcp --port 443 --cidr 0.0.0.0/0

# EC2 用セキュリティグループ
EC2_SG=$(aws ec2 create-security-group \
  --group-name nakamura-ec2-sg \
  --description "EC2 Security Group" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

aws ec2 authorize-security-group-ingress \
  --group-id $EC2_SG \
  --protocol tcp --port 80 --source-group $ALB_SG

aws ec2 authorize-security-group-ingress \
  --group-id $EC2_SG \
  --protocol tcp --port 22 --cidr 10.0.0.0/16

# RDS 用セキュリティグループ
RDS_SG=$(aws ec2 create-security-group \
  --group-name nakamura-rds-sg \
  --description "RDS Security Group" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

aws ec2 authorize-security-group-ingress \
  --group-id $RDS_SG \
  --protocol tcp --port 3306 --source-group $EC2_SG
```

</details>

---

## 課題2: EC2 インスタンスの起動

2つの AZ に1台ずつ EC2 インスタンスを起動してください。以下の条件を満たすこと。

- AMI: Amazon Linux 2023
- インスタンスタイプ: t3.small
- EBS: 30GB gp3（暗号化あり）
- ユーザーデータ: Apache をインストールして起動

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```bash
# ユーザーデータスクリプト
USER_DATA='#!/bin/bash
yum update -y
yum install -y httpd php mysql
systemctl start httpd
systemctl enable httpd
echo "<h1>Nakamura Manufacturing - Server $(hostname)</h1>" > /var/www/html/index.html
timedatectl set-timezone Asia/Tokyo'

# AZ-a にEC2を起動
INSTANCE_1=$(aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.small \
  --key-name nakamura-web-key \
  --security-group-ids $EC2_SG \
  --subnet-id $SUBNET_A \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=nakamura-web-1}]' \
  --block-device-mappings '[{
    "DeviceName": "/dev/xvda",
    "Ebs": {"VolumeSize": 30, "VolumeType": "gp3", "Encrypted": true}
  }]' \
  --user-data "$USER_DATA" \
  --query 'Instances[0].InstanceId' \
  --output text)

# AZ-c にEC2を起動
INSTANCE_2=$(aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.small \
  --key-name nakamura-web-key \
  --security-group-ids $EC2_SG \
  --subnet-id $SUBNET_C \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=nakamura-web-2}]' \
  --block-device-mappings '[{
    "DeviceName": "/dev/xvda",
    "Ebs": {"VolumeSize": 30, "VolumeType": "gp3", "Encrypted": true}
  }]' \
  --user-data "$USER_DATA" \
  --query 'Instances[0].InstanceId' \
  --output text)

echo "Instance 1: $INSTANCE_1"
echo "Instance 2: $INSTANCE_2"
```

</details>

---

## 課題3: ALB の設定

Application Load Balancer を作成して、2台の EC2 にトラフィックを分散してください。

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```bash
# ターゲットグループの作成
TG_ARN=$(aws elbv2 create-target-group \
  --name nakamura-web-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id $VPC_ID \
  --health-check-path /index.html \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

# EC2 インスタンスをターゲットグループに登録
aws elbv2 register-targets \
  --target-group-arn $TG_ARN \
  --targets Id=$INSTANCE_1 Id=$INSTANCE_2

# ALB の作成
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name nakamura-alb \
  --subnets $SUBNET_A $SUBNET_C \
  --security-groups $ALB_SG \
  --scheme internet-facing \
  --type application \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# リスナーの作成（HTTP:80 → ターゲットグループ）
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN

# ALB の DNS 名を確認
aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN \
  --query 'LoadBalancers[0].DNSName' \
  --output text
```

</details>

---

## 課題4: RDS の構築

マルチAZ 構成の MySQL RDS インスタンスを作成してください。

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```bash
# DB サブネットグループの作成
aws rds create-db-subnet-group \
  --db-subnet-group-name nakamura-db-subnet \
  --db-subnet-group-description "DB Subnet for Nakamura" \
  --subnet-ids $SUBNET_DB_A $SUBNET_DB_C

# RDS インスタンスの作成
aws rds create-db-instance \
  --db-instance-identifier nakamura-prod-db \
  --db-instance-class db.m5.large \
  --engine mysql \
  --engine-version 8.0 \
  --master-username admin \
  --master-user-password "StrongP@ssw0rd2024!" \
  --allocated-storage 100 \
  --storage-type gp3 \
  --storage-encrypted \
  --multi-az \
  --db-subnet-group-name nakamura-db-subnet \
  --vpc-security-group-ids $RDS_SG \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --deletion-protection \
  --db-name nakamura_orders \
  --tags Key=Environment,Value=production

# 作成状態の確認（available になるまで待つ）
aws rds wait db-instance-available \
  --db-instance-identifier nakamura-prod-db

echo "RDS is now available!"
```

</details>

---

## 課題5: S3 バケットの設定

静的アセット用とバックアップ用の2つの S3 バケットを作成し、適切な設定を行ってください。

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```bash
# 静的アセット用バケット
aws s3api create-bucket \
  --bucket nakamura-static-assets-2024 \
  --region ap-northeast-1 \
  --create-bucket-configuration LocationConstraint=ap-northeast-1

# 暗号化の設定
aws s3api put-bucket-encryption \
  --bucket nakamura-static-assets-2024 \
  --server-side-encryption-configuration '{
    "Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]
  }'

# バックアップ用バケット
aws s3api create-bucket \
  --bucket nakamura-backups-2024 \
  --region ap-northeast-1 \
  --create-bucket-configuration LocationConstraint=ap-northeast-1

# バージョニングの有効化（バックアップ用）
aws s3api put-bucket-versioning \
  --bucket nakamura-backups-2024 \
  --versioning-configuration Status=Enabled

# ライフサイクルポリシー（バックアップ用）
aws s3api put-bucket-lifecycle-configuration \
  --bucket nakamura-backups-2024 \
  --lifecycle-configuration '{
    "Rules": [{
      "ID": "BackupLifecycle",
      "Status": "Enabled",
      "Filter": {"Prefix": ""},
      "Transitions": [
        {"Days": 30, "StorageClass": "STANDARD_IA"},
        {"Days": 90, "StorageClass": "GLACIER"}
      ]
    }]
  }'
```

</details>

---

## 達成度チェック

| 課題 | 内容 | 完了 |
|------|------|------|
| 課題1 | セキュリティグループの設計 | [ ] |
| 課題2 | EC2 インスタンスの起動 | [ ] |
| 課題3 | ALB の設定 | [ ] |
| 課題4 | RDS の構築 | [ ] |
| 課題5 | S3 バケットの設定 | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 3層構成 | ALB → EC2 (Web/App) → RDS (DB)、各層に SG を設定 |
| 可用性 | マルチAZ 構成で EC2 と RDS の冗長化 |
| セキュリティ | SG による最小権限、暗号化、削除保護 |
| ストレージ | S3 でアセット配信とバックアップを管理 |

### チェックリスト

- [ ] 3層アーキテクチャの全体像を設計できた
- [ ] セキュリティグループを階層的に設計できた
- [ ] ALB でトラフィック分散を構成できた
- [ ] マルチAZ 構成の RDS を作成できた
- [ ] S3 バケットにライフサイクルポリシーを設定できた

---

## 次のステップへ

3層アーキテクチャの構築演習を完了しました。次のセクションでは、Step 2 のチェックポイントクイズに挑戦しましょう。

---

*推定所要時間: 120分*
