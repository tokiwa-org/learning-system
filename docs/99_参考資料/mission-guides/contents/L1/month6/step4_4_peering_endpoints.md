# VPCピアリングとエンドポイント

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 4
subStep: 4
title: "VPCピアリングとエンドポイント"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "AWS"
  category: "クラウド"
  target_level: "L1"
```

---

## ストーリー

> 「中村製作所さんの環境には、本番 VPC と開発 VPC を分けて運用したいという要件がある。
> だが、開発チームが本番環境の一部のデータにアクセスする必要もある」
>
> 山田先輩がネットワーク図に2つの VPC を描く。
>
> 「こういう時に使うのが VPC ピアリングだ。
> 2つの VPC をプライベートネットワークで接続して、安全に通信させる」
>
> 「あと、プライベートサブネットの EC2 から S3 にアクセスする時、
> 毎回 NAT ゲートウェイを経由するとコストがかかりますよね？」
>
> 「いい質問だ。VPC エンドポイントを使えば、NAT を経由せずに
> AWS サービスにプライベート接続できる。コスト削減とセキュリティ向上の一石二鳥だ」

---

## VPC ピアリング

### 概要

VPC ピアリングは、2つの VPC 間をプライベートネットワークで接続する機能です。インターネットを経由せず、AWS のバックボーンネットワークを通じて安全に通信します。

```
VPC ピアリング接続

┌──── VPC-A (本番) ────┐     ┌──── VPC-B (開発) ────┐
│  10.0.0.0/16          │     │  10.1.0.0/16          │
│                        │     │                        │
│  ┌──────────┐         │     │         ┌──────────┐  │
│  │  EC2-A    │─────────│─────│─────────│  EC2-B    │  │
│  │10.0.1.10 │ ピアリング│     │         │10.1.1.10 │  │
│  └──────────┘  接続    │     │         └──────────┘  │
│                        │     │                        │
└────────────────────────┘     └────────────────────────┘

※ CIDR が重複する VPC 間ではピアリング不可
```

### VPC ピアリングの作成

```bash
# ピアリング接続のリクエスト
PEERING_ID=$(aws ec2 create-vpc-peering-connection \
  --vpc-id vpc-prod-123 \
  --peer-vpc-id vpc-dev-456 \
  --tag-specifications 'ResourceType=vpc-peering-connection,Tags=[{Key=Name,Value=prod-to-dev}]' \
  --query 'VpcPeeringConnection.VpcPeeringConnectionId' \
  --output text)

# ピアリング接続の承認（ピア側で実行）
aws ec2 accept-vpc-peering-connection \
  --vpc-peering-connection-id $PEERING_ID

# 本番VPCのルートテーブルにルート追加
aws ec2 create-route \
  --route-table-id rtb-prod-xxx \
  --destination-cidr-block 10.1.0.0/16 \
  --vpc-peering-connection-id $PEERING_ID

# 開発VPCのルートテーブルにルート追加
aws ec2 create-route \
  --route-table-id rtb-dev-xxx \
  --destination-cidr-block 10.0.0.0/16 \
  --vpc-peering-connection-id $PEERING_ID
```

### VPC ピアリングの制約

| 制約 | 説明 |
|------|------|
| CIDR 重複不可 | 接続する VPC の CIDR が重複してはいけない |
| 推移的ピアリング不可 | A↔B、B↔C のピアリングがあっても、A→C の通信は不可 |
| 帯域幅制限なし | 同一リージョン内のピアリングに帯域幅制限はない |

---

## VPC エンドポイント

VPC エンドポイントは、VPC 内から AWS サービスにプライベート接続するための機能です。インターネットや NAT ゲートウェイを経由せずに通信できます。

### 2種類のエンドポイント

| 種類 | 説明 | 対象サービス | 料金 |
|------|------|------------|------|
| ゲートウェイ型 | ルートテーブルにルートを追加 | S3, DynamoDB | 無料 |
| インターフェース型 | ENI（ネットワークインターフェース）を作成 | その他の AWS サービス | 有料 |

---

### ゲートウェイ型エンドポイント（S3）

```bash
# S3 用ゲートウェイエンドポイントの作成
aws ec2 create-vpc-endpoint \
  --vpc-id $VPC_ID \
  --service-name com.amazonaws.ap-northeast-1.s3 \
  --route-table-ids $PRIV_RT \
  --tag-specifications 'ResourceType=vpc-endpoint,Tags=[{Key=Name,Value=nakamura-s3-endpoint}]'
```

```
ゲートウェイエンドポイント使用前:
  EC2 (Private) → NAT GW → IGW → インターネット → S3
  ※ NAT GW のデータ転送料金が発生

ゲートウェイエンドポイント使用後:
  EC2 (Private) → VPC Endpoint → S3
  ※ 無料、かつプライベート接続
```

### エンドポイントポリシー

エンドポイント経由でアクセスできるリソースを制限できます。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSpecificBucket",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::nakamura-*/*"
      ]
    }
  ]
}
```

---

### インターフェース型エンドポイント（PrivateLink）

```bash
# CloudWatch Logs 用インターフェースエンドポイント
aws ec2 create-vpc-endpoint \
  --vpc-id $VPC_ID \
  --service-name com.amazonaws.ap-northeast-1.logs \
  --vpc-endpoint-type Interface \
  --subnet-ids $PRIV_SUBNET_A $PRIV_SUBNET_C \
  --security-group-ids $ENDPOINT_SG \
  --private-dns-enabled \
  --tag-specifications 'ResourceType=vpc-endpoint,Tags=[{Key=Name,Value=nakamura-logs-endpoint}]'
```

```
インターフェースエンドポイントの構成:

┌──── プライベートサブネット ─────────┐
│                                      │
│  [EC2] → [ENI (VPC Endpoint)] → CloudWatch Logs
│           10.0.11.100               │
│           (プライベートDNS有効)       │
│                                      │
│  ※ アプリケーションのコード変更不要    │
│  ※ DNS が自動的にエンドポイントに解決 │
└──────────────────────────────────────┘
```

---

## Transit Gateway

複数の VPC やオンプレミスネットワークを中央で接続するハブ型のサービスです。VPC ピアリングの拡張版と考えられます。

```
VPC ピアリング（多対多はメッシュになる）:
  VPC-A ─── VPC-B
   │  ╲      │
   │   ╲     │
   │    ╲    │
  VPC-C ─── VPC-D

Transit Gateway（ハブ&スポーク型）:
  VPC-A ─┐
  VPC-B ─┤
  VPC-C ─┼── Transit Gateway
  VPC-D ─┤
  On-Prem─┘
```

VPC が3つ以上の場合は Transit Gateway の方が管理しやすくなります。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| VPC ピアリング | 2つの VPC をプライベート接続。CIDR 重複不可 |
| ゲートウェイ EP | S3/DynamoDB への無料プライベート接続 |
| インターフェース EP | その他の AWS サービスへのプライベート接続（有料） |
| Transit Gateway | 複数 VPC のハブ型接続。大規模環境向け |

### チェックリスト

- [ ] VPC ピアリングの概念と設定方法を理解した
- [ ] ゲートウェイ型とインターフェース型エンドポイントの違いを説明できる
- [ ] S3 用ゲートウェイエンドポイントの設定方法を把握した
- [ ] エンドポイントポリシーによるアクセス制御を理解した
- [ ] Transit Gateway の用途を把握した

---

## 次のステップへ

次のセクションでは、これまで学んだ VPC の知識を総動員して、本番環境レベルの VPC を設計する演習に挑戦します。

---

*推定読了時間: 30分*
