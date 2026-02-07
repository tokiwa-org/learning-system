# 演習：本番環境VPCを設計しよう

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 4
subStep: 5
title: "演習：本番環境VPCを設計しよう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "AWS"
  category: "クラウド"
  target_level: "L1"
```

---

## ストーリー

> 「ここまでの知識を全て使って、中村製作所さんの本番環境 VPC を設計してもらう」
>
> 山田先輩が要件書を手渡す。
>
> 「本番環境は障害に強く、セキュリティが堅牢で、将来の拡張にも対応できる設計が必要だ。
> まずはネットワーク設計図を作成して、その後 AWS CLI コマンドで構築する」
>
> 「かなり本格的な演習ですね」
>
> 「本番環境のネットワーク設計は、一度作ると後から変更するのが大変だ。
> 最初の設計が重要だからこそ、しっかり考えて作ろう」

---

## 演習の概要

中村製作所の本番環境 VPC を設計・構築してください。

### 要件

| 項目 | 要件 |
|------|------|
| VPC | CIDR: 10.0.0.0/16 |
| AZ | 2つの AZ（ap-northeast-1a, ap-northeast-1c） |
| サブネット | パブリック x2、アプリ x2、DB x2、管理 x2（計8つ） |
| ゲートウェイ | IGW x1、NAT GW x2（各AZに1つ） |
| エンドポイント | S3 ゲートウェイエンドポイント |
| セキュリティ | 用途別のセキュリティグループ |

---

## 課題1: サブネット設計

以下のサブネット構成を設計し、CIDR ブロックを割り当ててください。

```
VPC: 10.0.0.0/16

AZ-a (ap-northeast-1a)          AZ-c (ap-northeast-1c)
├─ Public:  ???                  ├─ Public:  ???
├─ App:     ???                  ├─ App:     ???
├─ DB:      ???                  ├─ DB:      ???
└─ Mgmt:    ???                  └─ Mgmt:    ???
```

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```
VPC: 10.0.0.0/16

AZ-a (ap-northeast-1a)          AZ-c (ap-northeast-1c)
├─ Public:  10.0.1.0/24         ├─ Public:  10.0.2.0/24
├─ App:     10.0.11.0/24        ├─ App:     10.0.12.0/24
├─ DB:      10.0.21.0/24        ├─ DB:      10.0.22.0/24
└─ Mgmt:    10.0.31.0/24        └─ Mgmt:    10.0.32.0/24
```

設計のポイント:
- パブリック: 1.x / 2.x（小さい番号）
- アプリ: 11.x / 12.x（10番台）
- DB: 21.x / 22.x（20番台）
- 管理: 31.x / 32.x（30番台）
- /24 で各サブネット 251 個のホスト IP（十分な余裕）
- 将来の AZ 追加にも対応可能（3.x, 13.x, 23.x, 33.x）

</details>

---

## 課題2: ネットワーク構成図

以下の要素を含むネットワーク構成図をASCIIアートで作成してください。

- IGW、NAT GW、ALB、EC2、RDS
- パブリック/プライベートサブネットの区別
- 通信経路（矢印）

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```
                    インターネット
                         │
                    ┌────┴────┐
                    │   IGW    │
                    └────┬────┘
                         │
  ┌──────────────────────┴──────────────────────┐
  │  VPC: 10.0.0.0/16                            │
  │                                                │
  │  ┌─── AZ-a ────────────┐ ┌─── AZ-c ────────────┐│
  │  │ Public (10.0.1.0/24) │ │ Public (10.0.2.0/24) ││
  │  │  [ALB]    [NAT-GW-a]│ │ [ALB]    [NAT-GW-c] ││
  │  ├─────────────────────┤ ├─────────────────────┤│
  │  │ App (10.0.11.0/24)  │ │ App (10.0.12.0/24)  ││
  │  │  [EC2 App Server]   │ │  [EC2 App Server]   ││
  │  ├─────────────────────┤ ├─────────────────────┤│
  │  │ DB (10.0.21.0/24)   │ │ DB (10.0.22.0/24)   ││
  │  │  [RDS Primary]      │ │  [RDS Standby]      ││
  │  ├─────────────────────┤ ├─────────────────────┤│
  │  │ Mgmt (10.0.31.0/24) │ │ Mgmt (10.0.32.0/24) ││
  │  │  [踏み台]            │ │                      ││
  │  └─────────────────────┘ └─────────────────────┘│
  │                                                │
  │  [S3 Endpoint] ──────────────────→ S3          │
  │                                                │
  └────────────────────────────────────────────────┘
```

</details>

---

## 課題3: AWS CLI で VPC を構築

課題1・2の設計に基づいて、VPC を構築する AWS CLI コマンドを記述してください。

以下の要素を全て含めること:
1. VPC の作成
2. 8つのサブネットの作成
3. IGW の作成とアタッチ
4. パブリックサブネット用ルートテーブル
5. NAT GW の作成（2つ）
6. プライベートサブネット用ルートテーブル（AZ ごと）
7. S3 ゲートウェイエンドポイント

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```bash
#!/bin/bash
# 中村製作所 本番環境 VPC 構築スクリプト

set -e

REGION="ap-northeast-1"

# === 1. VPC の作成 ===
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=nakamura-prod-vpc},{Key=Environment,Value=production}]' \
  --query 'Vpc.VpcId' --output text)

aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames '{"Value":true}'
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support '{"Value":true}'
echo "VPC: $VPC_ID"

# === 2. サブネットの作成 ===
# パブリック
PUB_A=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 \
  --availability-zone ${REGION}a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nakamura-public-a}]' \
  --query 'Subnet.SubnetId' --output text)

PUB_C=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 \
  --availability-zone ${REGION}c \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nakamura-public-c}]' \
  --query 'Subnet.SubnetId' --output text)

# アプリ
APP_A=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.11.0/24 \
  --availability-zone ${REGION}a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nakamura-app-a}]' \
  --query 'Subnet.SubnetId' --output text)

APP_C=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.12.0/24 \
  --availability-zone ${REGION}c \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nakamura-app-c}]' \
  --query 'Subnet.SubnetId' --output text)

# DB
DB_A=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.21.0/24 \
  --availability-zone ${REGION}a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nakamura-db-a}]' \
  --query 'Subnet.SubnetId' --output text)

DB_C=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.22.0/24 \
  --availability-zone ${REGION}c \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nakamura-db-c}]' \
  --query 'Subnet.SubnetId' --output text)

# 管理
MGMT_A=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.31.0/24 \
  --availability-zone ${REGION}a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nakamura-mgmt-a}]' \
  --query 'Subnet.SubnetId' --output text)

MGMT_C=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.32.0/24 \
  --availability-zone ${REGION}c \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nakamura-mgmt-c}]' \
  --query 'Subnet.SubnetId' --output text)

# === 3. IGW ===
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=nakamura-igw}]' \
  --query 'InternetGateway.InternetGatewayId' --output text)

aws ec2 attach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID

# === 4. パブリック ルートテーブル ===
PUB_RT=$(aws ec2 create-route-table --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=nakamura-public-rt}]' \
  --query 'RouteTable.RouteTableId' --output text)

aws ec2 create-route --route-table-id $PUB_RT \
  --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID

aws ec2 associate-route-table --route-table-id $PUB_RT --subnet-id $PUB_A
aws ec2 associate-route-table --route-table-id $PUB_RT --subnet-id $PUB_C

aws ec2 modify-subnet-attribute --subnet-id $PUB_A --map-public-ip-on-launch
aws ec2 modify-subnet-attribute --subnet-id $PUB_C --map-public-ip-on-launch

# === 5. NAT GW (各 AZ) ===
EIP_A=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
NAT_A=$(aws ec2 create-nat-gateway --subnet-id $PUB_A --allocation-id $EIP_A \
  --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=nakamura-nat-a}]' \
  --query 'NatGateway.NatGatewayId' --output text)

EIP_C=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
NAT_C=$(aws ec2 create-nat-gateway --subnet-id $PUB_C --allocation-id $EIP_C \
  --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=nakamura-nat-c}]' \
  --query 'NatGateway.NatGatewayId' --output text)

aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_A $NAT_C

# === 6. プライベート ルートテーブル (AZ ごと) ===
PRIV_RT_A=$(aws ec2 create-route-table --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=nakamura-private-rt-a}]' \
  --query 'RouteTable.RouteTableId' --output text)

aws ec2 create-route --route-table-id $PRIV_RT_A \
  --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_A

aws ec2 associate-route-table --route-table-id $PRIV_RT_A --subnet-id $APP_A
aws ec2 associate-route-table --route-table-id $PRIV_RT_A --subnet-id $DB_A
aws ec2 associate-route-table --route-table-id $PRIV_RT_A --subnet-id $MGMT_A

PRIV_RT_C=$(aws ec2 create-route-table --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=nakamura-private-rt-c}]' \
  --query 'RouteTable.RouteTableId' --output text)

aws ec2 create-route --route-table-id $PRIV_RT_C \
  --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_C

aws ec2 associate-route-table --route-table-id $PRIV_RT_C --subnet-id $APP_C
aws ec2 associate-route-table --route-table-id $PRIV_RT_C --subnet-id $DB_C
aws ec2 associate-route-table --route-table-id $PRIV_RT_C --subnet-id $MGMT_C

# === 7. S3 ゲートウェイエンドポイント ===
aws ec2 create-vpc-endpoint \
  --vpc-id $VPC_ID \
  --service-name com.amazonaws.${REGION}.s3 \
  --route-table-ids $PRIV_RT_A $PRIV_RT_C \
  --tag-specifications 'ResourceType=vpc-endpoint,Tags=[{Key=Name,Value=nakamura-s3-endpoint}]'

echo "VPC construction completed!"
```

</details>

---

## 課題4: セキュリティグループの設計

以下の4つのセキュリティグループのインバウンドルールを設計してください。

| SG | 用途 |
|----|------|
| sg-alb | ALB用（HTTP/HTTPS を全世界から受け付け） |
| sg-app | アプリサーバー用（ALB からの HTTP のみ） |
| sg-db | DB用（アプリサーバーからの MySQL のみ） |
| sg-mgmt | 管理用（社内 IP からの SSH のみ） |

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

| SG | プロトコル | ポート | ソース |
|----|-----------|--------|--------|
| sg-alb | TCP | 80 | 0.0.0.0/0 |
| sg-alb | TCP | 443 | 0.0.0.0/0 |
| sg-app | TCP | 80 | sg-alb |
| sg-app | TCP | 22 | sg-mgmt |
| sg-db | TCP | 3306 | sg-app |
| sg-mgmt | TCP | 22 | 203.0.113.0/24（社内IP） |

ポイント:
- ALB のみがインターネットに公開
- アプリサーバーは ALB からのみアクセス可能
- DB はアプリサーバーからのみアクセス可能
- SSH は管理サブネットの踏み台からのみ（または社内 IP からのみ）

</details>

---

## 達成度チェック

| 課題 | 内容 | 完了 |
|------|------|------|
| 課題1 | サブネット設計 | [ ] |
| 課題2 | ネットワーク構成図 | [ ] |
| 課題3 | AWS CLI で VPC 構築 | [ ] |
| 課題4 | セキュリティグループ設計 | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| サブネット設計 | 用途別・AZ別に整理。将来の拡張を見据えた CIDR 設計 |
| マルチAZ | NAT GW を各 AZ に配置して高可用性を確保 |
| S3 エンドポイント | NAT 経由を避けてコスト削減とセキュリティ向上 |
| SG 設計 | 多層防御。各層に専用のセキュリティグループ |

### チェックリスト

- [ ] 本番環境レベルのサブネット設計ができた
- [ ] ネットワーク構成図を作成できた
- [ ] 全ての要素を AWS CLI で構築するコマンドを書けた
- [ ] セキュリティグループの多層防御を設計できた

---

## 次のステップへ

本番環境 VPC の設計演習を完了しました。次のセクションでは、Step 4 のチェックポイントクイズに挑戦しましょう。

---

*推定所要時間: 90分*
