# ポリシーとロール

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 3
subStep: 2
title: "ポリシーとロール"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "AWS"
  category: "クラウド"
  target_level: "L1"
```

---

## ストーリー

> 「IAM の基本概念は掴めたな。次はポリシーの書き方を覚えよう」
>
> 山田先輩が JSON のサンプルを画面に映す。
>
> 「IAM ポリシーは JSON で書く。最初は取っつきにくいかもしれないが、
> 構造はシンプルだ。Effect、Action、Resource の3要素を理解すれば読み書きできる」
>
> 「AWS が用意しているポリシーもありますよね？」
>
> 「そうだ。AWS マネージドポリシーという既成品がある。
> だが、最小権限を実現するためにはカスタムポリシーを書く力が必要だ。
> マネージドポリシーは便利だが、不要な権限が含まれていることも多い」

---

## IAM ポリシーの構造

IAM ポリシーは JSON 形式で記述します。

### 基本構造

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3Read",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::nakamura-design-docs-2024",
        "arn:aws:s3:::nakamura-design-docs-2024/*"
      ]
    }
  ]
}
```

### 各要素の説明

| 要素 | 説明 | 例 |
|------|------|-----|
| Version | ポリシー言語のバージョン | "2012-10-17"（固定） |
| Statement | 1つ以上の許可/拒否のルール | 配列 |
| Sid | ステートメントの識別子（任意） | "AllowS3Read" |
| Effect | 許可 or 拒否 | "Allow" or "Deny" |
| Action | 対象の操作 | "s3:GetObject", "ec2:StartInstances" |
| Resource | 対象のリソース | ARN で指定 |
| Condition | 条件（任意） | IP制限、時間制限等 |

---

## ARN（Amazon Resource Name）

AWS リソースを一意に識別する名前です。

```
ARN の形式:
arn:aws:サービス:リージョン:アカウントID:リソース

例:
arn:aws:s3:::my-bucket                    (S3バケット)
arn:aws:s3:::my-bucket/*                  (バケット内の全オブジェクト)
arn:aws:ec2:ap-northeast-1:123456789012:instance/i-1234567890abcdef0
arn:aws:rds:ap-northeast-1:123456789012:db:my-database
arn:aws:iam::123456789012:user/tanaka     (IAMはグローバル)
```

---

## ポリシーの種類

### AWS マネージドポリシー

AWS が作成・管理する既成ポリシーです。

| ポリシー名 | 説明 |
|-----------|------|
| AdministratorAccess | 全サービスの全操作を許可 |
| ReadOnlyAccess | 全サービスの読み取りのみ許可 |
| AmazonEC2FullAccess | EC2 の全操作を許可 |
| AmazonS3ReadOnlyAccess | S3 の読み取りのみ許可 |
| AmazonRDSFullAccess | RDS の全操作を許可 |

```bash
# マネージドポリシーをグループにアタッチ
aws iam attach-group-policy \
  --group-name readonly \
  --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess
```

### カスタマー管理ポリシー

ユーザーが独自に作成するポリシーです。

```bash
# カスタムポリシーの作成
aws iam create-policy \
  --policy-name NakamuraS3AccessPolicy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "AllowS3BucketAccess",
        "Effect": "Allow",
        "Action": [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ],
        "Resource": [
          "arn:aws:s3:::nakamura-design-docs-2024",
          "arn:aws:s3:::nakamura-design-docs-2024/*"
        ]
      }
    ]
  }'
```

### インラインポリシー

特定のユーザー・グループ・ロールに直接埋め込むポリシーです（再利用不可）。

---

## 実践的なポリシーの例

### 開発者向けポリシー

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowEC2Management",
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:RebootInstances"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "ec2:ResourceTag/Environment": "development"
        }
      }
    },
    {
      "Sid": "DenyTerminateProduction",
      "Effect": "Deny",
      "Action": "ec2:TerminateInstances",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "ec2:ResourceTag/Environment": "production"
        }
      }
    }
  ]
}
```

### EC2 ロール用 S3 アクセスポリシー

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3Access",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::nakamura-static-assets-2024/*"
    },
    {
      "Sid": "AllowS3ListBucket",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::nakamura-static-assets-2024"
    }
  ]
}
```

---

## ポリシーの評価ロジック

```
ポリシー評価の流れ:

  リクエスト
      │
      ▼
  明示的な Deny がある？ ──Yes──→ 拒否
      │
      No
      │
      ▼
  明示的な Allow がある？ ──Yes──→ 許可
      │
      No
      │
      ▼
  暗黙的な拒否（デフォルト拒否）

※ Deny は常に Allow より優先される
```

---

## IAM ロールの詳細設定

### 信頼ポリシー（Trust Policy）

誰がこのロールを引き受けられるかを定義します。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### ロールの作成からEC2への割り当て

```bash
# 1. ロールを作成
aws iam create-role \
  --role-name nakamura-web-role \
  --assume-role-policy-document file://trust-policy.json

# 2. ポリシーをロールにアタッチ
aws iam attach-role-policy \
  --role-name nakamura-web-role \
  --policy-arn arn:aws:iam::123456789012:policy/NakamuraS3AccessPolicy

# 3. インスタンスプロファイルを作成・関連付け
aws iam create-instance-profile \
  --instance-profile-name nakamura-web-profile

aws iam add-role-to-instance-profile \
  --instance-profile-name nakamura-web-profile \
  --role-name nakamura-web-role

# 4. EC2 にインスタンスプロファイルを割り当て
aws ec2 associate-iam-instance-profile \
  --instance-id i-0123456789abcdef0 \
  --iam-instance-profile Name=nakamura-web-profile
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ポリシー構造 | Effect, Action, Resource の3要素が基本 |
| ARN | AWS リソースを一意に識別する名前 |
| ポリシーの種類 | マネージド、カスタマー管理、インライン |
| 評価ロジック | Deny 優先、明示的 Allow がなければ暗黙的拒否 |
| ロール | 信頼ポリシー + アクセス許可ポリシー の2つで構成 |

### チェックリスト

- [ ] IAM ポリシーの JSON 構造を読み書きできる
- [ ] ARN の形式を理解した
- [ ] マネージドポリシーとカスタムポリシーの違いを把握した
- [ ] ポリシーの評価ロジック（Deny 優先）を理解した
- [ ] ロールの信頼ポリシーの役割を理解した

---

## 次のステップへ

次のセクションでは、最小権限の原則を実践的に適用する方法を学びます。
過剰な権限を検出して絞り込むテクニックを身につけましょう。

---

*推定読了時間: 25分*
