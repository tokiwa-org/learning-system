# EC2インスタンスの起動と設定

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 2
subStep: 1
title: "EC2インスタンスの起動と設定"
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

> 「よし、基本を学んだところで、次は実際にリソースを作ってみよう」
>
> 山田先輩が AWS コンソールを開く。
>
> 「まずは EC2 インスタンスを起動する。中村製作所さんの Web サーバーを想定して、
> Amazon Linux 2023 の t3.small で立ち上げてみよう」
>
> 「AWS コンソールからポチポチ設定するんですか？」
>
> 「最初はコンソールで流れを理解してから、CLI でも同じことをやってみよう。
> 本番運用では CLI やIaC（Infrastructure as Code）で管理するのが基本だからな」

---

## コンソールからの EC2 起動手順

### ステップバイステップ

1. **AMI の選択** - Amazon Linux 2023 を選択
2. **インスタンスタイプの選択** - t3.small（2vCPU, 2GB）
3. **キーペアの設定** - SSH 接続用のキーペアを作成または選択
4. **ネットワーク設定** - VPC、サブネット、パブリック IP の割り当て
5. **ストレージ設定** - EBS ボリュームのサイズとタイプ
6. **セキュリティグループの設定** - 許可するポートの設定
7. **確認と起動**

---

## AWS CLI からの EC2 起動

### キーペアの作成

```bash
# キーペアの作成
aws ec2 create-key-pair \
  --key-name nakamura-web-key \
  --key-type rsa \
  --query 'KeyMaterial' \
  --output text > nakamura-web-key.pem

# 権限の設定（自分だけ読み取り可能に）
chmod 400 nakamura-web-key.pem
```

### インスタンスの起動

```bash
# EC2 インスタンスを起動
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.small \
  --key-name nakamura-web-key \
  --security-group-ids sg-0123456789abcdef0 \
  --subnet-id subnet-0123456789abcdef0 \
  --associate-public-ip-address \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=nakamura-web-server}]' \
  --block-device-mappings '[{
    "DeviceName": "/dev/xvda",
    "Ebs": {
      "VolumeSize": 30,
      "VolumeType": "gp3",
      "Encrypted": true
    }
  }]'
```

### 各パラメータの説明

| パラメータ | 説明 |
|-----------|------|
| `--image-id` | AMI ID（Amazon Linux 2023 のID） |
| `--instance-type` | インスタンスタイプ |
| `--key-name` | SSH 接続用キーペア名 |
| `--security-group-ids` | セキュリティグループID |
| `--subnet-id` | 配置するサブネット |
| `--associate-public-ip-address` | パブリック IP を割り当てる |
| `--tag-specifications` | Name タグを付与 |
| `--block-device-mappings` | EBS ボリューム設定 |

---

## EBS ボリュームの設定

EBS（Elastic Block Store）は EC2 にアタッチするブロックストレージです。

### EBS ボリュームタイプ

| タイプ | 名称 | IOPS | 用途 |
|--------|------|------|------|
| gp3 | 汎用SSD（第3世代） | 3,000〜16,000 | 一般的なワークロード |
| gp2 | 汎用SSD（第2世代） | 容量に比例 | レガシー環境 |
| io2 | プロビジョンドIOPS SSD | 最大64,000 | 高性能DB |
| st1 | スループット最適化HDD | 500 | ログ、ビッグデータ |
| sc1 | コールドHDD | 250 | アクセス頻度の低いデータ |

```bash
# 追加 EBS ボリュームの作成
aws ec2 create-volume \
  --volume-type gp3 \
  --size 100 \
  --availability-zone ap-northeast-1a \
  --encrypted \
  --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=nakamura-data}]'

# EC2 にアタッチ
aws ec2 attach-volume \
  --volume-id vol-0123456789abcdef0 \
  --instance-id i-0123456789abcdef0 \
  --device /dev/xvdf
```

---

## EC2 の初期設定（ユーザーデータ）

インスタンス起動時にスクリプトを自動実行できます。

```bash
# ユーザーデータスクリプトの例
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.small \
  --key-name nakamura-web-key \
  --user-data '#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Nakamura Web Server</h1>" > /var/www/html/index.html'
```

### ユーザーデータで行う一般的な初期設定

```bash
#!/bin/bash
# 1. パッケージの更新
yum update -y

# 2. 必要なソフトウェアのインストール
yum install -y httpd php mysql

# 3. サービスの起動と自動起動設定
systemctl start httpd
systemctl enable httpd

# 4. タイムゾーンの設定
timedatectl set-timezone Asia/Tokyo

# 5. CloudWatch エージェントのインストール
yum install -y amazon-cloudwatch-agent
```

---

## インスタンスの管理

### 状態の確認

```bash
# インスタンスの詳細情報を表示
aws ec2 describe-instances \
  --instance-ids i-0123456789abcdef0 \
  --query 'Reservations[0].Instances[0].{
    State: State.Name,
    Type: InstanceType,
    PublicIP: PublicIpAddress,
    PrivateIP: PrivateIpAddress,
    AZ: Placement.AvailabilityZone
  }'
```

### 停止・開始・終了

```bash
# 停止（EBS料金のみ発生）
aws ec2 stop-instances --instance-ids i-0123456789abcdef0

# 開始
aws ec2 start-instances --instance-ids i-0123456789abcdef0

# 終了（削除）※ 取り消し不可
aws ec2 terminate-instances --instance-ids i-0123456789abcdef0
```

### SSH 接続

```bash
# パブリック IP を確認
PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids i-0123456789abcdef0 \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text)

# SSH 接続
ssh -i nakamura-web-key.pem ec2-user@$PUBLIC_IP
```

---

## Elastic IP（固定 IP アドレス）

EC2 インスタンスを停止・起動すると、パブリック IP が変わります。固定 IP が必要な場合は Elastic IP を使います。

```bash
# Elastic IP の割り当て
aws ec2 allocate-address --domain vpc

# EC2 に関連付け
aws ec2 associate-address \
  --instance-id i-0123456789abcdef0 \
  --allocation-id eipalloc-0123456789abcdef0
```

注意: 使用していない Elastic IP には料金が発生します。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 起動方法 | コンソール or AWS CLI で起動。本番は CLI/IaC を推奨 |
| 起動時の設定項目 | AMI、インスタンスタイプ、キーペア、SG、サブネット、EBS |
| EBS | ブロックストレージ。gp3 が標準。暗号化を推奨 |
| ユーザーデータ | 起動時に自動実行するスクリプト |
| Elastic IP | 固定パブリック IP アドレス |

### チェックリスト

- [ ] AWS CLI で EC2 インスタンスを起動する手順を理解した
- [ ] EBS ボリュームタイプの選び方を把握した
- [ ] ユーザーデータによる初期設定の方法を理解した
- [ ] インスタンスの停止・開始・終了の違いを理解した
- [ ] Elastic IP の用途を把握した

---

## 次のステップへ

次のセクションでは、EC2 のセキュリティの要であるセキュリティグループの設定方法を学びます。
どのポートをどの IP アドレスからアクセス許可するかは、セキュリティの基本です。

---

*推定読了時間: 30分*
