# NATゲートウェイとインターネットゲートウェイ

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 4
subStep: 3
title: "NATゲートウェイとインターネットゲートウェイ"
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

> 「プライベートサブネットの DB サーバーから、OS のパッチをダウンロードしたい場合はどうする？」
>
> 山田先輩が質問する。
>
> 「えっと......プライベートサブネットにはインターネットへのルートがないから、
> 直接はダウンロードできないですよね」
>
> 「その通り。だが、パッチの適用は必要だ。そこで使うのが NAT ゲートウェイだ。
> プライベートサブネットからインターネットへの**一方向の通信**を可能にする。
> インターネットからプライベートサブネットへの通信は引き続きブロックされる」
>
> 「なるほど。内側からは出られるけど、外側からは入れないんですね」

---

## IGW と NAT ゲートウェイの違い

```
インターネットゲートウェイ（IGW）:
  双方向通信
  インターネット ←→ パブリックサブネット

NATゲートウェイ:
  一方向通信（アウトバウンドのみ）
  プライベートサブネット → インターネット
  インターネット ×→ プライベートサブネット
```

### 比較表

| 項目 | IGW | NAT ゲートウェイ |
|------|-----|-----------------|
| 用途 | パブリックサブネットのインターネット接続 | プライベートサブネットのアウトバウンド通信 |
| 方向 | 双方向 | アウトバウンドのみ |
| 配置 | VPC レベル | パブリックサブネット内 |
| 料金 | 無料 | 有料（時間 + データ転送量） |
| 可用性 | 高可用性（AWS管理） | AZ 内で冗長化（マルチAZ は手動設定） |

---

## NAT ゲートウェイの構成

```
インターネット
      │
      ▼
  ┌── IGW ──┐
  │          │
  │  ┌──── パブリックサブネット (10.0.1.0/24) ──┐
  │  │                                          │
  │  │  [EC2 Web]     [NAT Gateway]             │
  │  │                     │                    │
  │  └─────────────────────│────────────────────┘
  │                        │
  │  ┌──── プライベートサブネット (10.0.11.0/24) ─┐
  │  │                     │                    │
  │  │  [RDS]        ルートテーブル:              │
  │  │               0.0.0.0/0 → NAT GW        │
  │  │                                          │
  │  └──────────────────────────────────────────┘
  │
  └──────────┘
```

---

## NAT ゲートウェイの作成

```bash
# Elastic IP の割り当て（NAT GW に必要）
EIP_ALLOC=$(aws ec2 allocate-address \
  --domain vpc \
  --query 'AllocationId' \
  --output text)

# NAT ゲートウェイの作成（パブリックサブネットに配置）
NAT_GW=$(aws ec2 create-nat-gateway \
  --subnet-id $PUB_SUBNET_A \
  --allocation-id $EIP_ALLOC \
  --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=nakamura-nat-gw-a}]' \
  --query 'NatGateway.NatGatewayId' \
  --output text)

# NAT GW が available になるまで待機
aws ec2 wait nat-gateway-available \
  --nat-gateway-ids $NAT_GW

# プライベートサブネットのルートテーブルに NAT GW へのルートを追加
aws ec2 create-route \
  --route-table-id $PRIV_RT \
  --destination-cidr-block 0.0.0.0/0 \
  --nat-gateway-id $NAT_GW
```

### ルートテーブルの比較

```
パブリックサブネットのルートテーブル:
| 送信先        | ターゲット  |
|--------------|------------|
| 10.0.0.0/16  | local      |
| 0.0.0.0/0    | igw-xxx    |  ← IGW へ

プライベートサブネットのルートテーブル:
| 送信先        | ターゲット  |
|--------------|------------|
| 10.0.0.0/16  | local      |
| 0.0.0.0/0    | nat-xxx    |  ← NAT GW へ
```

---

## マルチAZ での NAT ゲートウェイ

NAT ゲートウェイは AZ 内で冗長化されていますが、AZ 間のフェイルオーバーはありません。高可用性を確保するには、各 AZ に NAT ゲートウェイを配置します。

```
┌──── AZ-a ────────────┐  ┌──── AZ-c ────────────┐
│                        │  │                        │
│  Public Subnet         │  │  Public Subnet         │
│  ┌──────────────────┐ │  │  ┌──────────────────┐ │
│  │  [NAT GW-a]       │ │  │  │  [NAT GW-c]       │ │
│  └────────┬─────────┘ │  │  └────────┬─────────┘ │
│           │            │  │           │            │
│  Private Subnet        │  │  Private Subnet        │
│  ┌──────────────────┐ │  │  ┌──────────────────┐ │
│  │  [App/DB]         │ │  │  │  [App/DB]         │ │
│  │  0.0.0.0/0→NAT-a │ │  │  │  0.0.0.0/0→NAT-c │ │
│  └──────────────────┘ │  │  └──────────────────┘ │
└────────────────────────┘  └────────────────────────┘
```

```bash
# AZ-c 用の NAT ゲートウェイ
EIP_ALLOC_C=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)

NAT_GW_C=$(aws ec2 create-nat-gateway \
  --subnet-id $PUB_SUBNET_C \
  --allocation-id $EIP_ALLOC_C \
  --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=nakamura-nat-gw-c}]' \
  --query 'NatGateway.NatGatewayId' \
  --output text)

# AZ-c のプライベートサブネット用ルートテーブル
PRIV_RT_C=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=nakamura-private-rt-c}]' \
  --query 'RouteTable.RouteTableId' \
  --output text)

aws ec2 create-route \
  --route-table-id $PRIV_RT_C \
  --destination-cidr-block 0.0.0.0/0 \
  --nat-gateway-id $NAT_GW_C

aws ec2 associate-route-table \
  --route-table-id $PRIV_RT_C \
  --subnet-id $PRIV_SUBNET_C
```

---

## NAT ゲートウェイの料金

| 項目 | 料金（東京リージョン） |
|------|---------------------|
| 時間料金 | 約 $0.062/時間 ≒ 約 $45/月 |
| データ処理 | 約 $0.062/GB |

コスト削減のヒント:
- 開発環境では NAT インスタンス（EC2）を代替として検討
- VPC エンドポイントを使って AWS サービスへの通信を NAT 経由から外す

---

## 踏み台サーバー（Bastion Host）

プライベートサブネットの EC2 に SSH 接続するための中継サーバーです。

```
管理者PC → [踏み台(パブリック)] → [アプリサーバー(プライベート)]

ssh -i key.pem ec2-user@踏み台IP
  → ssh -i key.pem ec2-user@プライベートIP
```

代替手段として **AWS Systems Manager Session Manager** を使えば、踏み台サーバーなしでプライベートサブネットの EC2 に安全に接続できます。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| IGW | VPC とインターネットの双方向通信 |
| NAT GW | プライベートサブネットからのアウトバウンド通信のみ |
| マルチAZ | 各 AZ に NAT GW を配置して高可用性を確保 |
| 料金 | 時間課金 + データ転送量。コスト最適化が重要 |
| 踏み台 | プライベートサブネットへの SSH 中継。Session Manager が代替 |

### チェックリスト

- [ ] IGW と NAT GW の違いを説明できる
- [ ] NAT GW の構成と設定方法を理解した
- [ ] マルチAZ での NAT GW 配置を把握した
- [ ] 踏み台サーバーの役割を理解した

---

## 次のステップへ

次のセクションでは、VPC ピアリングと VPC エンドポイントを学びます。
VPC 間の接続と、AWS サービスへのプライベート接続を実現する方法です。

---

*推定読了時間: 30分*
