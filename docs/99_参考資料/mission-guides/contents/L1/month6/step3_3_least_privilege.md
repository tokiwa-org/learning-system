# 最小権限の原則を実践

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 3
subStep: 3
title: "最小権限の原則を実践"
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

> 「ポリシーの書き方は分かったな。だが、ポリシー設計で最も重要なのは
> "何を許可するか" よりも "何を許可しないか" だ」
>
> 山田先輩が過去のインシデントレポートを見せる。
>
> 「これは以前、別のクライアントで起きた事故だ。
> 開発者全員に AdministratorAccess を付与していたところ、
> 新人がうっかり本番の RDS インスタンスを削除してしまった」
>
> 「......それは大変ですね」
>
> 「最小権限の原則は、こういう事故を防ぐためにある。
> 必要な権限だけを、必要な範囲で、必要な期間だけ付与する。
> これを徹底するのがプロのクラウドエンジニアだ」

---

## 最小権限の原則とは

**必要最低限の権限のみを付与する**という原則です。

```
悪い例（過剰な権限）:
┌──────────────────────────────┐
│  開発者: AdministratorAccess   │
│                                │
│  → EC2/S3/RDS/IAM/...        │
│  → 全リージョンの全リソース     │
│  → 作成/読取/更新/削除 全操作   │
│                                │
│  リスク: 誤操作で本番環境を破壊  │
└──────────────────────────────┘

良い例（最小権限）:
┌──────────────────────────────┐
│  開発者: カスタムポリシー        │
│                                │
│  → EC2/S3 のみ               │
│  → 開発環境のリソースのみ       │
│  → 起動/停止/読取のみ（削除不可）│
│                                │
│  誤操作の影響範囲が限定的        │
└──────────────────────────────┘
```

---

## 最小権限を実現するテクニック

### 1. リソースレベルの権限制御

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSpecificBucketOnly",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::nakamura-design-docs-2024/*"
    }
  ]
}
```

`"Resource": "*"` を避け、特定のリソース ARN を指定します。

### 2. 条件（Condition）の活用

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowEC2InDevOnly",
      "Effect": "Allow",
      "Action": ["ec2:StartInstances", "ec2:StopInstances"],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "ec2:ResourceTag/Environment": "development"
        }
      }
    },
    {
      "Sid": "AllowFromOfficeIPOnly",
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::nakamura-*",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "203.0.113.0/24"
        }
      }
    }
  ]
}
```

### よく使う Condition キー

| Condition キー | 説明 | 用途 |
|---------------|------|------|
| `aws:SourceIp` | リクエスト元の IP | オフィスからのみ許可 |
| `ec2:ResourceTag/キー` | リソースのタグ | 環境ごとの権限分離 |
| `aws:RequestedRegion` | リクエスト先リージョン | 東京リージョンのみ許可 |
| `aws:MultiFactorAuthPresent` | MFA 認証済みか | MFA 必須の操作 |
| `aws:CurrentTime` | 現在時刻 | 業務時間内のみ許可 |

### 3. 明示的な Deny で防御

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyDeleteProduction",
      "Effect": "Deny",
      "Action": [
        "ec2:TerminateInstances",
        "rds:DeleteDBInstance",
        "s3:DeleteBucket"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:ResourceTag/Environment": "production"
        }
      }
    }
  ]
}
```

---

## IAM Access Analyzer

IAM Access Analyzer は、外部からアクセス可能なリソースを検出するツールです。

```bash
# Access Analyzer の作成
aws accessanalyzer create-analyzer \
  --analyzer-name nakamura-analyzer \
  --type ACCOUNT

# 検出結果の確認
aws accessanalyzer list-findings \
  --analyzer-arn arn:aws:access-analyzer:ap-northeast-1:123456789012:analyzer/nakamura-analyzer
```

---

## 未使用の権限を特定する

### IAM Access Advisor

各サービスへの最終アクセス日時を確認し、使われていない権限を特定します。

```bash
# サービス最終アクセス情報の取得
JOB_ID=$(aws iam generate-service-last-accessed-details \
  --arn arn:aws:iam::123456789012:user/tanaka \
  --query 'JobId' \
  --output text)

# 結果の確認
aws iam get-service-last-accessed-details \
  --job-id $JOB_ID
```

### 権限の棚卸しフロー

```
1. 広めの権限でスタート
   │
   ▼
2. CloudTrail でアクションログを記録
   │   （2〜4週間運用）
   │
   ▼
3. Access Advisor で未使用サービスを特定
   │
   ▼
4. 実際に使用しているアクションのみに絞り込む
   │
   ▼
5. カスタムポリシーを作成してアタッチ
   │
   ▼
6. 定期的に見直し（四半期ごと推奨）
```

---

## 権限境界（Permissions Boundary）

IAM ユーザーやロールに設定できる「権限の上限」です。

```bash
# 権限境界として使うポリシーの作成
aws iam create-policy \
  --policy-name NakamuraBoundary \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": ["ec2:*", "s3:*", "rds:*", "cloudwatch:*"],
        "Resource": "*"
      },
      {
        "Effect": "Deny",
        "Action": ["iam:*", "organizations:*"],
        "Resource": "*"
      }
    ]
  }'

# ユーザーに権限境界を設定
aws iam put-user-permissions-boundary \
  --user-name tanaka \
  --permissions-boundary arn:aws:iam::123456789012:policy/NakamuraBoundary
```

```
権限境界の仕組み:

  IAM ポリシー（付与された権限）
  ┌──────────────────────┐
  │ EC2  S3  RDS  IAM    │
  │ ■    ■   ■    ■      │
  └──────────────────────┘
           ∩
  権限境界（許可される上限）
  ┌──────────────────────┐
  │ EC2  S3  RDS         │
  │ ■    ■   ■    ×      │  ← IAM は境界外
  └──────────────────────┘
           ↓
  実際に有効な権限
  ┌──────────────────────┐
  │ EC2  S3  RDS         │
  │ ■    ■   ■           │  ← IAM は使えない
  └──────────────────────┘
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 最小権限 | 必要最低限の権限のみ付与。過剰な権限は事故の元 |
| リソース限定 | `Resource: "*"` を避け、特定 ARN を指定 |
| Condition | IP制限、タグ、MFA、時間帯等の条件で権限を絞る |
| Deny | 明示的 Deny で本番環境の破壊的操作を防御 |
| 権限境界 | ユーザー/ロールの権限の上限を設定 |

### チェックリスト

- [ ] 最小権限の原則の重要性を理解した
- [ ] Condition を使った権限制御を実装できる
- [ ] 明示的 Deny の活用方法を理解した
- [ ] IAM Access Analyzer / Access Advisor の使い方を把握した
- [ ] 権限境界の概念を理解した

---

## 次のステップへ

次のセクションでは、MFA（多要素認証）とアクセスキーの管理を学びます。
認証の強化は、IAM セキュリティの重要な柱です。

---

*推定読了時間: 25分*
