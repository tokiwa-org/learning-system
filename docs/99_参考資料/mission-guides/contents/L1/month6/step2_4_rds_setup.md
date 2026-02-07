# RDSの構築とバックアップ

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 2
subStep: 4
title: "RDSの構築とバックアップ"
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

> 「EC2 と S3 の構築ができたな。次はデータベースだ」
>
> 山田先輩がアーキテクチャ図に RDS のアイコンを追加する。
>
> 「中村製作所さんの MySQL データベースを RDS に移行する。
> オンプレでは深夜にバックアップスクリプトを手動で回していたらしいが、
> RDS なら自動バックアップが使える」
>
> 「マルチAZ も設定するんですか？」
>
> 「当然だ。受注管理のデータベースが停止したら、業務が止まる。
> マルチAZ で高可用性を確保し、リードレプリカで読み取り負荷を分散する。
> 本番環境を想定した構成を組んでいこう」

---

## RDS インスタンスの作成

### サブネットグループの作成

RDS は VPC 内の複数の AZ にまたがるサブネットグループが必要です。

```bash
# DB サブネットグループの作成
aws rds create-db-subnet-group \
  --db-subnet-group-name nakamura-db-subnet \
  --db-subnet-group-description "Subnet group for Nakamura DB" \
  --subnet-ids subnet-0aaa111 subnet-0bbb222
```

### RDS インスタンスの起動

```bash
# MySQL RDS インスタンスの作成
aws rds create-db-instance \
  --db-instance-identifier nakamura-production-db \
  --db-instance-class db.m5.large \
  --engine mysql \
  --engine-version 8.0 \
  --master-username admin \
  --master-user-password "$(openssl rand -base64 24)" \
  --allocated-storage 100 \
  --storage-type gp3 \
  --storage-encrypted \
  --multi-az \
  --db-subnet-group-name nakamura-db-subnet \
  --vpc-security-group-ids sg-db123 \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:05:00-sun:06:00" \
  --auto-minor-version-upgrade \
  --deletion-protection \
  --tags Key=Environment,Value=production Key=Project,Value=nakamura
```

### 各パラメータの説明

| パラメータ | 値 | 説明 |
|-----------|-----|------|
| `--db-instance-class` | db.m5.large | 2vCPU, 8GB メモリ |
| `--engine` | mysql | MySQL 8.0 |
| `--allocated-storage` | 100 | 100GB の初期ストレージ |
| `--storage-type` | gp3 | 汎用 SSD |
| `--storage-encrypted` | - | 保存時暗号化を有効化 |
| `--multi-az` | - | マルチAZ 配置を有効化 |
| `--backup-retention-period` | 7 | 自動バックアップを7日間保持 |
| `--deletion-protection` | - | 誤削除防止 |

---

## パラメータグループの設定

データベースの動作パラメータをカスタマイズします。

```bash
# カスタムパラメータグループの作成
aws rds create-db-parameter-group \
  --db-parameter-group-name nakamura-mysql-params \
  --db-parameter-group-family mysql8.0 \
  --description "Custom params for Nakamura DB"

# 文字コードの設定（UTF-8）
aws rds modify-db-parameter-group \
  --db-parameter-group-name nakamura-mysql-params \
  --parameters \
    "ParameterName=character_set_server,ParameterValue=utf8mb4,ApplyMethod=pending-reboot" \
    "ParameterName=collation_server,ParameterValue=utf8mb4_unicode_ci,ApplyMethod=pending-reboot" \
    "ParameterName=slow_query_log,ParameterValue=1,ApplyMethod=immediate" \
    "ParameterName=long_query_time,ParameterValue=1,ApplyMethod=immediate"
```

---

## 自動バックアップの管理

### バックアップの仕組み

```
自動バックアップ（ポイントインタイムリカバリ対応）

 日次スナップショット                 トランザクションログ
┌────┐ ┌────┐ ┌────┐ ┌────┐    ┌──────────────────┐
│ Day1│ │ Day2│ │ Day3│ │ Day4│   │  5分ごとに S3 へ  │
│ Full│ │ Full│ │ Full│ │ Full│   │  自動バックアップ  │
└────┘ └────┘ └────┘ └────┘    └──────────────────┘

↓

任意の秒まで復元可能（過去7日間 ※設定による）
```

### ポイントインタイムリカバリ

```bash
# 指定した時刻の状態に復元（新しいインスタンスとして作成）
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier nakamura-production-db \
  --target-db-instance-identifier nakamura-restored-db \
  --restore-time "2024-01-15T10:30:00Z" \
  --db-instance-class db.m5.large \
  --db-subnet-group-name nakamura-db-subnet
```

### 手動スナップショットの作成

```bash
# 手動スナップショットの作成
aws rds create-db-snapshot \
  --db-instance-identifier nakamura-production-db \
  --db-snapshot-identifier nakamura-db-before-migration-20240115

# スナップショット一覧の確認
aws rds describe-db-snapshots \
  --db-instance-identifier nakamura-production-db \
  --query 'DBSnapshots[*].{ID:DBSnapshotIdentifier,Status:Status,Created:SnapshotCreateTime}' \
  --output table
```

---

## リードレプリカの作成

読み取り負荷を分散するために、リードレプリカを追加できます。

```bash
# リードレプリカの作成
aws rds create-db-instance-read-replica \
  --db-instance-identifier nakamura-read-replica \
  --source-db-instance-identifier nakamura-production-db \
  --db-instance-class db.m5.large \
  --availability-zone ap-northeast-1c
```

```
リードレプリカの構成

┌─── AZ-a ──────┐     ┌─── AZ-c ──────┐
│                │     │                │
│  ┌──────────┐  │     │  ┌──────────┐  │
│  │ Primary   │  │────→│  │ Standby  │  │
│  │ (読み書き) │  │同期  │  │ (待機)   │  │
│  └─────┬────┘  │     │  └──────────┘  │
│        │       │     │                │
│        │非同期  │     │  ┌──────────┐  │
│        └──────│────→│  │ Read     │  │
│               │     │  │ Replica  │  │
│               │     │  │ (読み取り)│  │
│               │     │  └──────────┘  │
└───────────────┘     └───────────────┘

アプリケーション:
  書き込み → Primary エンドポイント
  読み取り → Replica エンドポイント
```

---

## RDS の監視

### CloudWatch メトリクス

```bash
# CPU 使用率の確認
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name CPUUtilization \
  --dimensions Name=DBInstanceIdentifier,Value=nakamura-production-db \
  --start-time 2024-01-15T00:00:00Z \
  --end-time 2024-01-15T23:59:59Z \
  --period 3600 \
  --statistics Average
```

### 監視すべき主要メトリクス

| メトリクス | 説明 | 注意すべき値 |
|-----------|------|-------------|
| CPUUtilization | CPU使用率 | 80%以上が継続 |
| FreeableMemory | 空きメモリ | 急激な低下 |
| FreeStorageSpace | 空きストレージ | 残り20%未満 |
| ReadIOPS / WriteIOPS | I/O操作数 | 異常な増加 |
| DatabaseConnections | 接続数 | 最大接続数に近い |
| ReplicaLag | レプリカの遅延 | 数秒以上の遅延 |

---

## RDS への接続確認

```bash
# エンドポイントの確認
aws rds describe-db-instances \
  --db-instance-identifier nakamura-production-db \
  --query 'DBInstances[0].{
    Endpoint: Endpoint.Address,
    Port: Endpoint.Port,
    Status: DBInstanceStatus,
    MultiAZ: MultiAZ,
    Engine: Engine
  }' \
  --output table

# EC2 から MySQL クライアントで接続
mysql -h nakamura-production-db.xxxx.ap-northeast-1.rds.amazonaws.com \
  -P 3306 \
  -u admin \
  -p

# 接続後の確認
mysql> SHOW DATABASES;
mysql> SELECT VERSION();
mysql> SHOW VARIABLES LIKE 'character_set%';
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| RDS 作成 | DB サブネットグループ → インスタンス作成 → パラメータ設定 |
| バックアップ | 自動バックアップ（日次）+ トランザクションログ → ポイントインタイムリカバリ |
| リードレプリカ | 非同期レプリケーションで読み取り負荷を分散 |
| 監視 | CloudWatch で CPU、メモリ、ストレージ、接続数を監視 |

### チェックリスト

- [ ] AWS CLI で RDS インスタンスを作成できる
- [ ] パラメータグループの設定方法を理解した
- [ ] 自動バックアップとポイントインタイムリカバリを理解した
- [ ] リードレプリカの用途と構成を把握した
- [ ] CloudWatch での監視項目を理解した

---

## 次のステップへ

EC2、S3、RDS の構築方法を学びました。次のセクションでは、これらを組み合わせた3層アーキテクチャの構築演習に挑戦します。

---

*推定読了時間: 30分*
