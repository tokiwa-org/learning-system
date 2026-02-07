# サブネットとルーティング

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 4
subStep: 2
title: "サブネットとルーティング"
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

> 「VPC とサブネットを作ったが、このままではサブネット間の通信もインターネットとの通信もできない」
>
> 山田先輩がルートテーブルの概念を説明し始める。
>
> 「パケットがどこに向かうかを決めるのがルートテーブルだ。
> パブリックサブネットには インターネットゲートウェイ へのルートが必要だし、
> サブネット間の通信にはローカルルートが使われる」
>
> 「ルーターの設定みたいなものですか？」
>
> 「そうだ。オンプレのルーター設定と考え方は同じだ。
> ただ、AWS ではルートテーブルという設定ファイルをサブネットに関連付ける形で管理する」

---

## ルートテーブルとは

ルートテーブルは、サブネット内のトラフィックのルーティング先を決定するルールの集合です。

### ルートテーブルの基本構造

```
ルートテーブルの例（パブリックサブネット用）:

| 送信先 (Destination) | ターゲット (Target)      |
|---------------------|-------------------------|
| 10.0.0.0/16         | local                   |
| 0.0.0.0/0           | igw-0123456789abcdef0   |

解説:
- 10.0.0.0/16 → local: VPC 内の通信はローカルで処理
- 0.0.0.0/0 → igw-xxx: それ以外はインターネットゲートウェイへ
```

---

## インターネットゲートウェイ（IGW）

VPC からインターネットへの出入口です。パブリックサブネットのルートテーブルに IGW へのルートを追加することで、インターネット通信が可能になります。

```bash
# インターネットゲートウェイの作成
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=nakamura-igw}]' \
  --query 'InternetGateway.InternetGatewayId' \
  --output text)

# VPC にアタッチ
aws ec2 attach-internet-gateway \
  --internet-gateway-id $IGW_ID \
  --vpc-id $VPC_ID
```

### パブリックサブネットのルートテーブル設定

```bash
# ルートテーブルの作成
PUB_RT=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=nakamura-public-rt}]' \
  --query 'RouteTable.RouteTableId' \
  --output text)

# インターネットへのルートを追加
aws ec2 create-route \
  --route-table-id $PUB_RT \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id $IGW_ID

# パブリックサブネットに関連付け
aws ec2 associate-route-table \
  --route-table-id $PUB_RT \
  --subnet-id $PUB_SUBNET_A

aws ec2 associate-route-table \
  --route-table-id $PUB_RT \
  --subnet-id $PUB_SUBNET_C

# パブリック IP の自動割り当てを有効化
aws ec2 modify-subnet-attribute \
  --subnet-id $PUB_SUBNET_A \
  --map-public-ip-on-launch
```

---

## ルーティングの流れ

```
パブリックサブネットのEC2からインターネットへの通信:

  EC2 (10.0.1.10)
      │
      ▼
  ルートテーブル参照
  ┌────────────────────────────┐
  │ 10.0.0.0/16 → local       │  ← マッチしない
  │ 0.0.0.0/0   → igw-xxx     │  ← マッチ！
  └────────────────────────────┘
      │
      ▼
  インターネットゲートウェイ (igw-xxx)
      │
      ▼
  インターネット


VPC内のEC2間の通信:

  EC2-A (10.0.1.10) → EC2-B (10.0.11.20)
      │
      ▼
  ルートテーブル参照
  ┌────────────────────────────┐
  │ 10.0.0.0/16 → local       │  ← マッチ！
  └────────────────────────────┘
      │
      ▼
  VPC 内部ルーティング → EC2-B に到達
```

---

## プライベートサブネットのルートテーブル

プライベートサブネットにはインターネットへの直接ルートを設定しません。

```bash
# プライベート用ルートテーブルの作成
PRIV_RT=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=nakamura-private-rt}]' \
  --query 'RouteTable.RouteTableId' \
  --output text)

# プライベートサブネットに関連付け
aws ec2 associate-route-table \
  --route-table-id $PRIV_RT \
  --subnet-id $PRIV_SUBNET_A

aws ec2 associate-route-table \
  --route-table-id $PRIV_RT \
  --subnet-id $PRIV_SUBNET_C
```

```
プライベートサブネットのルートテーブル:

| 送信先            | ターゲット |
|------------------|-----------|
| 10.0.0.0/16      | local     |

※ 0.0.0.0/0 へのルートがないため、
   インターネットへの直接通信は不可
```

---

## ルートテーブルの確認

```bash
# ルートテーブルの一覧
aws ec2 describe-route-tables \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'RouteTables[*].{ID:RouteTableId,Name:Tags[?Key==`Name`].Value|[0],Routes:Routes[*].{Dest:DestinationCidrBlock,Target:GatewayId||NatGatewayId||InstanceId}}' \
  --output table

# 特定のルートテーブルの詳細
aws ec2 describe-route-tables \
  --route-table-ids $PUB_RT
```

---

## ネットワーク ACL（NACL）

サブネットレベルのファイアウォールです。セキュリティグループと組み合わせて多層防御を実現します。

```bash
# カスタム NACL の作成
NACL_ID=$(aws ec2 create-network-acl \
  --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=network-acl,Tags=[{Key=Name,Value=nakamura-public-nacl}]' \
  --query 'NetworkAcl.NetworkAclId' \
  --output text)

# インバウンドルール（HTTP許可）
aws ec2 create-network-acl-entry \
  --network-acl-id $NACL_ID \
  --rule-number 100 \
  --protocol tcp \
  --port-range From=80,To=80 \
  --cidr-block 0.0.0.0/0 \
  --rule-action allow \
  --ingress

# インバウンドルール（HTTPS許可）
aws ec2 create-network-acl-entry \
  --network-acl-id $NACL_ID \
  --rule-number 110 \
  --protocol tcp \
  --port-range From=443,To=443 \
  --cidr-block 0.0.0.0/0 \
  --rule-action allow \
  --ingress

# アウトバウンドルール（エフェメラルポート許可）
aws ec2 create-network-acl-entry \
  --network-acl-id $NACL_ID \
  --rule-number 100 \
  --protocol tcp \
  --port-range From=1024,To=65535 \
  --cidr-block 0.0.0.0/0 \
  --rule-action allow \
  --egress
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ルートテーブル | パケットのルーティング先を決定するルールの集合 |
| IGW | VPC とインターネットを接続するゲートウェイ |
| パブリック RT | IGW へのルートあり → インターネット通信可能 |
| プライベート RT | IGW へのルートなし → インターネットから隔離 |
| NACL | サブネットレベルのステートレスなファイアウォール |

### チェックリスト

- [ ] ルートテーブルの仕組みを理解した
- [ ] IGW の役割と設定方法を把握した
- [ ] パブリック/プライベートサブネットの違いをルーティングの観点で説明できる
- [ ] AWS CLI でルートテーブルを設定できる
- [ ] NACL の基本を理解した

---

## 次のステップへ

次のセクションでは、NAT ゲートウェイとインターネットゲートウェイの使い分けを学びます。
プライベートサブネットからインターネットへの安全なアクセス方法を理解しましょう。

---

*推定読了時間: 30分*
