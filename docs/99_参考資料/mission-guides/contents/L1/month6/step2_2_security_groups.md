# セキュリティグループの設定

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 2
subStep: 2
title: "セキュリティグループの設定"
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

> 「EC2 の起動はできたな。次はセキュリティグループの設定だ」
>
> 山田先輩が表情を引き締める。
>
> 「セキュリティグループは EC2 の仮想ファイアウォールだ。
> 不要なポートを開けっぱなしにすると、攻撃者に侵入される恐れがある。
> 先月セキュリティを学んだから分かるだろう？」
>
> 「はい。必要最小限のポートだけを開ける、最小権限の原則ですね」
>
> 「その通り。Web サーバーなら HTTP/HTTPS だけ、
> DB サーバーなら Web サーバーからのアクセスだけ許可する。
> シンプルだが、ここをミスると全てが台無しになる」

---

## セキュリティグループとは

セキュリティグループ（SG）は、EC2 インスタンスに対する仮想ファイアウォールです。インバウンド（受信）とアウトバウンド（送信）のトラフィックを制御します。

### 特徴

| 特徴 | 説明 |
|------|------|
| ステートフル | 許可したインバウンドへの応答は自動許可（アウトバウンドルール不要） |
| 許可ルールのみ | 「拒否」ルールは設定できない。ルールに一致しないトラフィックは全て拒否 |
| インスタンス単位 | 1つのインスタンスに複数の SG を関連付け可能 |
| 動的変更 | ルールの変更は即時反映（再起動不要） |

---

## インバウンドルールの設定

### Web サーバー用 SG

```bash
# セキュリティグループの作成
aws ec2 create-security-group \
  --group-name web-server-sg \
  --description "Security group for web server" \
  --vpc-id vpc-0123456789abcdef0

# HTTP を許可（全てのIPから）
aws ec2 authorize-security-group-ingress \
  --group-id sg-web123 \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# HTTPS を許可（全てのIPから）
aws ec2 authorize-security-group-ingress \
  --group-id sg-web123 \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# SSH を許可（自社IPのみ）
aws ec2 authorize-security-group-ingress \
  --group-id sg-web123 \
  --protocol tcp \
  --port 22 \
  --cidr 203.0.113.0/24
```

### DB サーバー用 SG

```bash
# DB用セキュリティグループの作成
aws ec2 create-security-group \
  --group-name db-server-sg \
  --description "Security group for database server" \
  --vpc-id vpc-0123456789abcdef0

# MySQL を Web サーバーの SG からのみ許可
aws ec2 authorize-security-group-ingress \
  --group-id sg-db123 \
  --protocol tcp \
  --port 3306 \
  --source-group sg-web123
```

---

## セキュリティグループの設計パターン

### 3層アーキテクチャの場合

```
インターネット
      │
      ▼
┌──────────────────────────────────┐
│  Web SG (sg-web)                  │
│  インバウンド:                      │
│   - TCP 80  (0.0.0.0/0)          │
│   - TCP 443 (0.0.0.0/0)          │
│   - TCP 22  (社内IP/32)           │
│  ┌──────────┐                    │
│  │ Web Server│                    │
│  └─────┬────┘                    │
└────────│─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  App SG (sg-app)                  │
│  インバウンド:                      │
│   - TCP 8080 (sg-web)            │
│  ┌──────────┐                    │
│  │ App Server│                    │
│  └─────┬────┘                    │
└────────│─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  DB SG (sg-db)                    │
│  インバウンド:                      │
│   - TCP 3306 (sg-app)            │
│  ┌──────────┐                    │
│  │ DB Server │                    │
│  └──────────┘                    │
└──────────────────────────────────┘
```

### ポイント

- **Web SG**: インターネットからの HTTP/HTTPS のみ許可
- **App SG**: Web SG からの特定ポートのみ許可
- **DB SG**: App SG からの DB ポートのみ許可
- **SSH**: 全てのサーバーで社内 IP からのみ許可（または踏み台サーバーからのみ）

---

## よくある設定ミスと対策

### 危険な設定例

```
× SSH (22) を 0.0.0.0/0 に開放
  → ブルートフォース攻撃のリスク

× DB ポート (3306) を 0.0.0.0/0 に開放
  → データベースへの直接攻撃のリスク

× 全ポート (0-65535) を開放
  → あらゆるサービスへのアクセスが可能
```

### 安全な設定原則

| 原則 | 説明 |
|------|------|
| 最小権限 | 必要最小限のポートのみ開放 |
| ソースの限定 | 0.0.0.0/0 を避け、特定の IP や SG を指定 |
| SG 参照 | IP アドレスではなく SG ID で参照（動的な IP 変更に対応） |
| SSH 制限 | SSH は踏み台サーバーまたは Session Manager 経由 |

---

## セキュリティグループの確認と管理

```bash
# セキュリティグループの一覧
aws ec2 describe-security-groups \
  --query 'SecurityGroups[*].{Name:GroupName, ID:GroupId, VPC:VpcId}' \
  --output table

# 特定の SG の詳細（インバウンドルール）
aws ec2 describe-security-groups \
  --group-ids sg-web123 \
  --query 'SecurityGroups[0].IpPermissions'

# ルールの削除
aws ec2 revoke-security-group-ingress \
  --group-id sg-web123 \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0
```

---

## ネットワーク ACL との違い

| 項目 | セキュリティグループ | ネットワーク ACL |
|------|---------------------|-----------------|
| 適用範囲 | インスタンス単位 | サブネット単位 |
| ルールタイプ | 許可のみ | 許可と拒否 |
| ステートフル | はい（応答は自動許可） | いいえ（明示的に許可が必要） |
| 評価順序 | 全ルールを評価 | 番号順に評価（最初にマッチで終了） |
| デフォルト | 全インバウンド拒否 | 全トラフィック許可 |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| SG とは | EC2 の仮想ファイアウォール。ステートフル、許可ルールのみ |
| 設計原則 | 最小権限、ソース限定、SG 参照、SSH 制限 |
| 3層構成 | Web → App → DB と段階的にアクセスを制限 |
| NACL との違い | SG はインスタンス単位、NACL はサブネット単位 |

### チェックリスト

- [ ] セキュリティグループの基本動作を理解した
- [ ] AWS CLI で SG を作成・設定できる
- [ ] 3層アーキテクチャでの SG 設計パターンを把握した
- [ ] よくある設定ミスと対策を理解した
- [ ] SG と NACL の違いを説明できる

---

## 次のステップへ

次のセクションでは、S3 バケットの作成と管理を実践的に学びます。
バケットポリシーやバージョニングなど、運用で必要な設定を一つずつ確認していきましょう。

---

*推定読了時間: 30分*
