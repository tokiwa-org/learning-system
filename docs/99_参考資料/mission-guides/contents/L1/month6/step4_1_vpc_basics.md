# VPCの基本概念

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 4
subStep: 1
title: "VPCの基本概念"
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

> 「EC2、S3、RDS、IAM と個別のサービスを学んできたな。
> ここからはそれらを束ねるネットワークの設計だ」
>
> 山田先輩がネットワーク図を広げる。
>
> 「VPC は Virtual Private Cloud の略で、AWS 上に自分専用の仮想ネットワークを作る機能だ。
> 中村製作所さんのオンプレミスネットワークを、そのまま AWS 上に再現するイメージだ」
>
> 「L1 の月1でネットワークの基礎は学びましたが、クラウドだと何が違うんですか？」
>
> 「基本的な TCP/IP の考え方は同じだ。サブネット、ルーティング、ファイアウォール......
> ただ、クラウドならではの概念として、インターネットゲートウェイ、NAT ゲートウェイ、
> VPC エンドポイントなどが加わる。一つずつ見ていこう」

---

## VPC とは

VPC（Virtual Private Cloud）は、AWS 上に論理的に隔離された仮想ネットワークです。自分専用のネットワーク空間で、IP アドレス範囲、サブネット、ルーティング、セキュリティを完全にコントロールできます。

### VPC の基本構造

```
AWS リージョン (ap-northeast-1)
┌──────────────────────────────────────────┐
│                                            │
│  VPC (10.0.0.0/16)                        │
│  ┌──────────────────────────────────────┐│
│  │                                        ││
│  │  ┌─── AZ-a ──────┐ ┌─── AZ-c ──────┐││
│  │  │                │ │                │││
│  │  │ Public Subnet  │ │ Public Subnet  │││
│  │  │ 10.0.1.0/24   │ │ 10.0.2.0/24   │││
│  │  │                │ │                │││
│  │  │ Private Subnet │ │ Private Subnet │││
│  │  │ 10.0.11.0/24  │ │ 10.0.12.0/24  │││
│  │  │                │ │                │││
│  │  └────────────────┘ └────────────────┘││
│  │                                        ││
│  └──────────────────────────────────────┘│
│                                            │
└──────────────────────────────────────────┘
```

---

## CIDR ブロック

VPC の IP アドレス範囲は CIDR（Classless Inter-Domain Routing）で指定します。

### CIDR の読み方

```
10.0.0.0/16

10.0.0.0 → ネットワークアドレス
/16      → 上位16ビットがネットワーク部
           → 残り16ビット（65,536個）がホストに使える
```

### よく使う CIDR

| CIDR | IPアドレス数 | 用途 |
|------|------------|------|
| /16 | 65,536 | VPC 全体（推奨） |
| /20 | 4,096 | 大きなサブネット |
| /24 | 256 | 標準的なサブネット |
| /28 | 16 | 小さなサブネット（最小） |

### VPC 作成

```bash
# VPC の作成
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=nakamura-vpc}]' \
  --query 'Vpc.VpcId' \
  --output text)

# DNS ホスト名の有効化
aws ec2 modify-vpc-attribute \
  --vpc-id $VPC_ID \
  --enable-dns-hostnames '{"Value": true}'

echo "VPC created: $VPC_ID"
```

---

## パブリックサブネットとプライベートサブネット

### パブリックサブネット

インターネットと直接通信できるサブネットです。Web サーバーや踏み台サーバーを配置します。

### プライベートサブネット

インターネットから直接アクセスできないサブネットです。データベースやアプリケーションサーバーを配置します。

```
パブリック vs プライベート

インターネット
      │
      ▼
┌─── インターネットゲートウェイ ───┐
│                                │
│  ┌──── パブリックサブネット ────┐│
│  │  [EC2 Web Server]           ││
│  │  パブリック IP あり           ││
│  │  インターネットと直接通信可能  ││
│  └────────────────────────────┘│
│                                │
│  ┌──── プライベートサブネット ──┐│
│  │  [RDS Database]             ││
│  │  プライベート IP のみ         ││
│  │  インターネットから直接アクセス不可││
│  └────────────────────────────┘│
└────────────────────────────────┘
```

### サブネットの作成

```bash
# パブリックサブネット（AZ-a）
PUB_SUBNET_A=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone ap-northeast-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nakamura-public-a}]' \
  --query 'Subnet.SubnetId' \
  --output text)

# パブリックサブネット（AZ-c）
PUB_SUBNET_C=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.2.0/24 \
  --availability-zone ap-northeast-1c \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nakamura-public-c}]' \
  --query 'Subnet.SubnetId' \
  --output text)

# プライベートサブネット（AZ-a）
PRIV_SUBNET_A=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.11.0/24 \
  --availability-zone ap-northeast-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nakamura-private-a}]' \
  --query 'Subnet.SubnetId' \
  --output text)

# プライベートサブネット（AZ-c）
PRIV_SUBNET_C=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.12.0/24 \
  --availability-zone ap-northeast-1c \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=nakamura-private-c}]' \
  --query 'Subnet.SubnetId' \
  --output text)
```

---

## サブネット設計のベストプラクティス

| 原則 | 説明 |
|------|------|
| マルチAZ | 各 AZ に同じ構成のサブネットを配置 |
| パブリック/プライベート分離 | Web は パブリック、DB はプライベート |
| 将来の拡張 | IP アドレスに余裕を持たせる（/16 推奨） |
| 用途別に分割 | Web用、App用、DB用、管理用でサブネットを分ける |

### 推奨サブネット設計（中規模環境）

```
VPC: 10.0.0.0/16

AZ-a                        AZ-c
├─ Public:  10.0.1.0/24     ├─ Public:  10.0.2.0/24
├─ App:     10.0.11.0/24    ├─ App:     10.0.12.0/24
├─ DB:      10.0.21.0/24    ├─ DB:      10.0.22.0/24
└─ Mgmt:    10.0.31.0/24    └─ Mgmt:    10.0.32.0/24
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| VPC とは | AWS 上の仮想プライベートネットワーク |
| CIDR | IP アドレス範囲の指定方法。VPC は /16 が推奨 |
| パブリックサブネット | インターネットと直接通信可能（Web サーバー等） |
| プライベートサブネット | インターネットから隔離（DB、アプリサーバー等） |
| マルチAZ | 各 AZ に同じ構成のサブネットを配置して冗長化 |

### チェックリスト

- [ ] VPC の基本概念を理解した
- [ ] CIDR ブロックの読み方を把握した
- [ ] パブリック/プライベートサブネットの違いを説明できる
- [ ] AWS CLI でサブネットを作成できる
- [ ] サブネット設計のベストプラクティスを理解した

---

## 次のステップへ

次のセクションでは、サブネット間のルーティングとルートテーブルの設定を学びます。
パケットがどの経路を通るかを制御するのが、ルーティングの役割です。

---

*推定読了時間: 30分*
