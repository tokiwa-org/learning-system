# ストレージサービス（S3）

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 1
subStep: 4
title: "ストレージサービス（S3）"
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

> 「EC2 の概要はわかったな。次はストレージだ」
>
> 山田先輩がモニターに S3 のコンソール画面を映す。
>
> 「中村製作所さんは社内のファイルサーバーに大量の設計図面や画像データを保管しているんだが、
> ストレージが逼迫していて容量が足りなくなりつつある。
> ファイルサーバーを拡張するには新しいハードディスクを購入して......と手間がかかる」
>
> 「それを S3 に移すんですね」
>
> 「そうだ。S3 は容量制限が実質無制限で、耐久性が 99.999999999%（イレブンナイン）だ。
> 画像やドキュメントの保管、バックアップ、静的Webサイトのホスティングまで、何でもこなす万能ストレージだ」

---

## S3 とは

S3（Simple Storage Service）は、AWS が提供するオブジェクトストレージサービスです。ファイルを「オブジェクト」として「バケット」に保存します。

### 基本概念

```
S3 の構造
┌──────────────────────────────────┐
│  バケット (my-company-bucket)      │
│                                    │
│  ├── images/                       │
│  │   ├── logo.png      ← オブジェクト│
│  │   └── banner.jpg    ← オブジェクト│
│  ├── docs/                         │
│  │   ├── report.pdf    ← オブジェクト│
│  │   └── spec.docx     ← オブジェクト│
│  └── backups/                      │
│      └── db-2024-01.sql← オブジェクト│
│                                    │
└──────────────────────────────────┘

バケット名: グローバルで一意（世界中で重複不可）
オブジェクトキー: バケット内のファイルパス
最大オブジェクトサイズ: 5TB
```

### S3 の特徴

| 特徴 | 説明 |
|------|------|
| 耐久性 | 99.999999999%（イレブンナイン）。データが失われる確率が極めて低い |
| 可用性 | 99.99%（S3 Standard の場合） |
| スケーラビリティ | 容量制限なし。自動的にスケール |
| セキュリティ | 暗号化、アクセス制御、バージョニング |
| コスト | 使った分だけ。ストレージ + リクエスト + データ転送で課金 |

---

## ストレージクラス

データのアクセス頻度に応じて最適なストレージクラスを選びます。

| ストレージクラス | アクセス頻度 | 料金（GB/月） | 用途 |
|----------------|------------|-------------|------|
| S3 Standard | 頻繁 | 約$0.025 | アクティブなデータ |
| S3 Standard-IA | 月1回程度 | 約$0.0138 | バックアップ、DR |
| S3 One Zone-IA | 月1回程度 | 約$0.011 | 再作成可能なデータ |
| S3 Glacier Instant | 四半期に1回 | 約$0.005 | アーカイブ（即時取得） |
| S3 Glacier Flexible | 年1〜2回 | 約$0.0045 | 長期アーカイブ |
| S3 Glacier Deep Archive | 年1回未満 | 約$0.002 | 法令遵守用の長期保存 |

```
アクセス頻度と料金の関係

  料金（高）
    │
    │  ■ S3 Standard
    │
    │      ■ S3 Standard-IA
    │
    │          ■ S3 One Zone-IA
    │
    │              ■ Glacier Instant
    │                  ■ Glacier Flexible
    │                      ■ Glacier Deep Archive
    │
    └──────────────────────────────→ アクセス頻度（低）
```

### S3 Intelligent-Tiering

アクセスパターンを自動分析し、最適なストレージクラスに自動移動するオプションもあります。

---

## S3 の主な機能

### バージョニング

同じキーのオブジェクトの変更履歴を保持できます。誤って削除・上書きしても復元可能です。

```bash
# バージョニングの有効化
aws s3api put-bucket-versioning \
  --bucket my-company-bucket \
  --versioning-configuration Status=Enabled
```

### ライフサイクルポリシー

オブジェクトを一定期間後に自動的に別のストレージクラスに移動したり、削除したりできます。

```json
{
  "Rules": [
    {
      "ID": "MoveToIA",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    }
  ]
}
```

### 静的 Web サイトホスティング

HTML/CSS/JS を S3 に配置するだけで Web サイトを公開できます。

```bash
# 静的ウェブサイトホスティングの有効化
aws s3 website s3://my-website-bucket/ \
  --index-document index.html \
  --error-document error.html
```

---

## S3 のアクセス制御

### バケットポリシー

バケット単位でアクセス権限を設定する JSON ポリシーです。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForWebsite",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-website-bucket/*"
    }
  ]
}
```

### パブリックアクセスのブロック

デフォルトで全てのパブリックアクセスがブロックされています。意図しない公開を防ぐ重要な設定です。

```bash
# パブリックアクセスブロックの確認
aws s3api get-public-access-block --bucket my-company-bucket
```

---

## AWS CLI での S3 操作

```bash
# バケットの作成
aws s3 mb s3://my-company-bucket-2024

# ファイルのアップロード
aws s3 cp ./report.pdf s3://my-company-bucket/docs/report.pdf

# ディレクトリごとアップロード（sync）
aws s3 sync ./local-folder s3://my-company-bucket/backup/

# ファイルの一覧表示
aws s3 ls s3://my-company-bucket/docs/

# ファイルのダウンロード
aws s3 cp s3://my-company-bucket/docs/report.pdf ./downloaded-report.pdf

# ファイルの削除
aws s3 rm s3://my-company-bucket/docs/old-file.txt

# バケットの削除（空の場合のみ）
aws s3 rb s3://my-company-bucket-2024
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| S3 とは | オブジェクトストレージサービス。容量無制限、イレブンナインの耐久性 |
| ストレージクラス | アクセス頻度に応じて Standard / IA / Glacier 等を選択 |
| 主要機能 | バージョニング、ライフサイクル、静的Webホスティング |
| アクセス制御 | バケットポリシー、パブリックアクセスブロック |
| CLI操作 | cp, sync, ls, rm 等のコマンドでファイル操作 |

### チェックリスト

- [ ] S3 のバケットとオブジェクトの概念を理解した
- [ ] ストレージクラスの違いと選び方を把握した
- [ ] バージョニングとライフサイクルポリシーを理解した
- [ ] S3 のアクセス制御の仕組みを理解した
- [ ] AWS CLI での S3 操作を把握した

---

## 次のステップへ

次のセクションでは、AWS のマネージドデータベースサービスである RDS を学びます。
オンプレミスのデータベースサーバーをクラウドに移行する際の中心的なサービスです。

---

*推定読了時間: 30分*
