# S3バケットの作成と管理

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 2
subStep: 3
title: "S3バケットの作成と管理"
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

> 「次は S3 バケットを実際に作って管理してみよう」
>
> 山田先輩がターミナルを開く。
>
> 「中村製作所さんの設計図面データを S3 に移行するために、
> バケットを作成して、アクセス制御やバージョニングを設定する。
> 設計図面は機密データだから、暗号化とアクセスログも必須だ」
>
> 「設計図面の量はどのくらいですか？」
>
> 「約500GBだ。しかも毎月増え続けている。
> 古い図面はアクセス頻度が低いから、ライフサイクルポリシーでコスト最適化もする。
> S3 の機能をフル活用するいい練習になるぞ」

---

## S3 バケットの作成

### 基本的なバケット作成

```bash
# バケットの作成（東京リージョン）
aws s3api create-bucket \
  --bucket nakamura-design-docs-2024 \
  --region ap-northeast-1 \
  --create-bucket-configuration LocationConstraint=ap-northeast-1

# 作成確認
aws s3 ls
```

### バケット命名規則

| ルール | 説明 |
|--------|------|
| グローバル一意 | 世界中で一意の名前が必要 |
| 3〜63文字 | 短すぎず長すぎない名前 |
| 小文字・数字・ハイフン | 大文字やアンダースコアは使用不可 |
| 先頭は文字か数字 | ハイフンで始められない |

---

## サーバーサイド暗号化の設定

```bash
# デフォルト暗号化の有効化（SSE-S3）
aws s3api put-bucket-encryption \
  --bucket nakamura-design-docs-2024 \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        },
        "BucketKeyEnabled": true
      }
    ]
  }'
```

### 暗号化方式の比較

| 方式 | 説明 | 鍵の管理 |
|------|------|---------|
| SSE-S3 | S3 が鍵を管理 | AWS が完全管理 |
| SSE-KMS | AWS KMS で鍵を管理 | ユーザーが鍵ポリシーを設定 |
| SSE-C | ユーザーが鍵を提供 | ユーザーが完全管理 |

---

## バージョニングの設定

```bash
# バージョニングの有効化
aws s3api put-bucket-versioning \
  --bucket nakamura-design-docs-2024 \
  --versioning-configuration Status=Enabled

# バージョニングの確認
aws s3api get-bucket-versioning \
  --bucket nakamura-design-docs-2024
```

### バージョニングの動作

```
ファイル: drawings/part-A.pdf

バージョン1 ─→ バージョン2 ─→ バージョン3（現在）
 (v1: 初回)     (v2: 修正)     (v3: 最新)

全バージョンが保持されるため:
- 誤って上書きしても復元可能
- 誤って削除しても復元可能（削除マーカーの除去で復元）
```

```bash
# バージョン一覧の確認
aws s3api list-object-versions \
  --bucket nakamura-design-docs-2024 \
  --prefix drawings/part-A.pdf

# 特定バージョンのダウンロード
aws s3api get-object \
  --bucket nakamura-design-docs-2024 \
  --key drawings/part-A.pdf \
  --version-id "v2_version_id_here" \
  part-A-v2.pdf
```

---

## ライフサイクルポリシーの設定

アクセス頻度が低下したデータを自動的にコスト効率の良いストレージクラスに移動します。

```bash
# ライフサイクルポリシーの設定
aws s3api put-bucket-lifecycle-configuration \
  --bucket nakamura-design-docs-2024 \
  --lifecycle-configuration '{
    "Rules": [
      {
        "ID": "DesignDocsLifecycle",
        "Status": "Enabled",
        "Filter": {
          "Prefix": "drawings/"
        },
        "Transitions": [
          {
            "Days": 90,
            "StorageClass": "STANDARD_IA"
          },
          {
            "Days": 365,
            "StorageClass": "GLACIER"
          }
        ],
        "NoncurrentVersionTransitions": [
          {
            "NoncurrentDays": 30,
            "StorageClass": "STANDARD_IA"
          }
        ],
        "NoncurrentVersionExpiration": {
          "NoncurrentDays": 730
        }
      }
    ]
  }'
```

```
ライフサイクルの流れ:

アップロード ─→ 90日後 ─────→ 365日後 ────→
 (Standard)      (Standard-IA)    (Glacier)

旧バージョン: 30日後に IA、730日後に削除
```

---

## アクセスログの設定

誰がいつどのオブジェクトにアクセスしたかを記録します。

```bash
# ログ保存先バケットの作成
aws s3api create-bucket \
  --bucket nakamura-access-logs-2024 \
  --region ap-northeast-1 \
  --create-bucket-configuration LocationConstraint=ap-northeast-1

# アクセスログの有効化
aws s3api put-bucket-logging \
  --bucket nakamura-design-docs-2024 \
  --bucket-logging-status '{
    "LoggingEnabled": {
      "TargetBucket": "nakamura-access-logs-2024",
      "TargetPrefix": "design-docs-logs/"
    }
  }'
```

---

## ファイルのアップロードと管理

### 基本操作

```bash
# 単一ファイルのアップロード
aws s3 cp ./drawings/part-A.pdf \
  s3://nakamura-design-docs-2024/drawings/part-A.pdf

# ディレクトリごとアップロード
aws s3 sync ./drawings/ \
  s3://nakamura-design-docs-2024/drawings/ \
  --storage-class STANDARD

# 特定ファイルタイプのみアップロード
aws s3 sync ./drawings/ \
  s3://nakamura-design-docs-2024/drawings/ \
  --exclude "*" \
  --include "*.pdf" \
  --include "*.dwg"

# ファイル一覧の確認
aws s3 ls s3://nakamura-design-docs-2024/drawings/ --recursive --human-readable

# 合計サイズの確認
aws s3 ls s3://nakamura-design-docs-2024/ --recursive --summarize --human-readable
```

### プレサインURL（一時的な共有リンク）

外部にファイルを一時的に共有したい場合に使用します。

```bash
# 1時間有効なダウンロードURLを生成
aws s3 presign \
  s3://nakamura-design-docs-2024/drawings/part-A.pdf \
  --expires-in 3600
```

---

## CORS の設定（Web アプリからのアクセス）

Web アプリケーションから S3 に直接アクセスする場合は CORS 設定が必要です。

```bash
aws s3api put-bucket-cors \
  --bucket nakamura-design-docs-2024 \
  --cors-configuration '{
    "CORSRules": [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT"],
        "AllowedOrigins": ["https://app.nakamura-mfg.co.jp"],
        "MaxAgeSeconds": 3600
      }
    ]
  }'
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| バケット作成 | グローバル一意の名前、リージョン指定 |
| 暗号化 | SSE-S3（標準）、SSE-KMS（カスタム鍵） |
| バージョニング | 変更履歴を保持、誤操作からの復元 |
| ライフサイクル | アクセス頻度に応じてストレージクラスを自動移行 |
| アクセスログ | 監査証跡として誰が何にアクセスしたかを記録 |

### チェックリスト

- [ ] S3 バケットの作成と暗号化設定ができる
- [ ] バージョニングの仕組みと設定方法を理解した
- [ ] ライフサイクルポリシーの設計ができる
- [ ] AWS CLI でのファイル操作を把握した
- [ ] プレサインURLの用途を理解した

---

## 次のステップへ

次のセクションでは、RDS データベースの構築とバックアップの設定を学びます。
中村製作所さんのデータベースをクラウドに移行する準備を進めましょう。

---

*推定読了時間: 30分*
