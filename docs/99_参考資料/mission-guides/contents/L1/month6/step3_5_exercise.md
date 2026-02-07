# 演習：IAMポリシーを設計しよう

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 3
subStep: 5
title: "演習：IAMポリシーを設計しよう"
itemType: EXERCISE
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "AWS"
  category: "クラウド"
  target_level: "L1"
```

---

## ストーリー

> 「IAM の知識が一通り身についたな。
> ここからは中村製作所さんの実際の要件に基づいて、IAM 設計をしてもらう」
>
> 山田先輩が要件書を渡す。
>
> 「中村製作所さんには4つのチームがある。
> 各チームに適切な権限を設計してほしい。
> 過剰な権限はNG、足りない権限もNG。そのバランスが腕の見せどころだ」

---

## 演習の概要

中村製作所の AWS 環境に対して、以下の4チーム向けの IAM ポリシーを設計してください。

### チーム構成と要件

| チーム | メンバー数 | 必要な権限 |
|--------|-----------|-----------|
| 開発チーム | 5名 | EC2/S3/RDS の操作（開発環境のみ）。本番環境の削除は不可 |
| 運用チーム | 3名 | EC2/RDS の監視・停止/起動。CloudWatch ログの閲覧 |
| 管理者 | 1名 | IAM の管理を含む全権限（MFA 必須） |
| 外部パートナー | 2名 | S3 の特定バケットの読み取りのみ。社外 IP からのアクセス |

---

## 課題1: 開発チーム用ポリシー

開発チームが以下を行えるポリシーを JSON で作成してください。

- EC2: 開発環境（Environment=development タグ）の起動、停止、再起動、参照
- S3: `nakamura-dev-*` バケットの読み書き
- RDS: 開発用 DB の参照（変更不可）
- 本番環境（Environment=production タグ）の EC2 の終了（Terminate）は明示的に拒否

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowEC2DevEnvironment",
      "Effect": "Allow",
      "Action": [
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:RebootInstances"
      ],
      "Resource": "arn:aws:ec2:ap-northeast-1:123456789012:instance/*",
      "Condition": {
        "StringEquals": {
          "ec2:ResourceTag/Environment": "development"
        }
      }
    },
    {
      "Sid": "AllowEC2Describe",
      "Effect": "Allow",
      "Action": "ec2:Describe*",
      "Resource": "*"
    },
    {
      "Sid": "AllowS3DevBuckets",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::nakamura-dev-*",
        "arn:aws:s3:::nakamura-dev-*/*"
      ]
    },
    {
      "Sid": "AllowRDSReadOnly",
      "Effect": "Allow",
      "Action": [
        "rds:Describe*",
        "rds:ListTagsForResource"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyTerminateProduction",
      "Effect": "Deny",
      "Action": "ec2:TerminateInstances",
      "Resource": "arn:aws:ec2:ap-northeast-1:123456789012:instance/*",
      "Condition": {
        "StringEquals": {
          "ec2:ResourceTag/Environment": "production"
        }
      }
    }
  ]
}
```

</details>

---

## 課題2: 運用チーム用ポリシー

運用チームが以下を行えるポリシーを JSON で作成してください。

- EC2: 全環境の参照、停止、起動（終了・削除は不可）
- RDS: 全環境の参照、停止、起動（削除・変更は不可）
- CloudWatch: ログとメトリクスの閲覧

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowEC2Operations",
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:RebootInstances"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyEC2Terminate",
      "Effect": "Deny",
      "Action": [
        "ec2:TerminateInstances",
        "ec2:RunInstances"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AllowRDSOperations",
      "Effect": "Allow",
      "Action": [
        "rds:Describe*",
        "rds:ListTagsForResource",
        "rds:StartDBInstance",
        "rds:StopDBInstance",
        "rds:RebootDBInstance"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyRDSDestructive",
      "Effect": "Deny",
      "Action": [
        "rds:DeleteDBInstance",
        "rds:ModifyDBInstance",
        "rds:CreateDBInstance"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AllowCloudWatchRead",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetMetricData",
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:ListMetrics",
        "cloudwatch:DescribeAlarms",
        "logs:GetLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:FilterLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

</details>

---

## 課題3: 管理者用ポリシー（MFA 必須）

管理者が全権限を持つが、MFA 認証なしでは IAM 操作ができないポリシーを設計してください。

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAllActions",
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    },
    {
      "Sid": "DenyIAMWithoutMFA",
      "Effect": "Deny",
      "Action": [
        "iam:CreateUser",
        "iam:DeleteUser",
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:AttachUserPolicy",
        "iam:DetachUserPolicy",
        "iam:AttachGroupPolicy",
        "iam:DetachGroupPolicy",
        "iam:PutUserPolicy",
        "iam:DeleteUserPolicy",
        "iam:CreateAccessKey",
        "iam:DeleteAccessKey",
        "iam:UpdateLoginProfile"
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}
```

**ポイント**: 全権限を Allow した上で、IAM の変更操作を MFA なしでは Deny しています。Deny は常に Allow より優先されるため、MFA なしでは IAM 操作ができません。

</details>

---

## 課題4: 外部パートナー用ポリシー

外部パートナーが S3 の特定バケットのみ読み取れるポリシーを設計してください。IP 制限（203.0.113.0/24）付きで。

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadSpecificBucket",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::nakamura-partner-share",
        "arn:aws:s3:::nakamura-partner-share/*"
      ],
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "203.0.113.0/24"
        }
      }
    },
    {
      "Sid": "DenyAllOtherS3",
      "Effect": "Deny",
      "Action": "s3:*",
      "NotResource": [
        "arn:aws:s3:::nakamura-partner-share",
        "arn:aws:s3:::nakamura-partner-share/*"
      ]
    }
  ]
}
```

**ポイント**: `NotResource` を使って、指定バケット以外の S3 操作を明示的に Deny しています。また、`Condition` で IP アドレスを制限し、パートナーのオフィスからのみアクセスを許可しています。

</details>

---

## 達成度チェック

| 課題 | 内容 | 完了 |
|------|------|------|
| 課題1 | 開発チーム用ポリシー | [ ] |
| 課題2 | 運用チーム用ポリシー | [ ] |
| 課題3 | 管理者用ポリシー（MFA必須） | [ ] |
| 課題4 | 外部パートナー用ポリシー | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| チームごとの設計 | 各チームの業務に必要な権限のみを付与 |
| タグによる制御 | Environment タグで環境ごとに権限を分離 |
| 明示的 Deny | 破壊的操作を明示的に拒否して安全性を確保 |
| MFA 条件 | 重要な操作に MFA を必須化 |
| IP 制限 | 外部アクセスはソース IP で制限 |

### チェックリスト

- [ ] チームの要件を分析して適切なポリシーを設計できた
- [ ] Condition を活用した権限制御を実装できた
- [ ] Deny を使った防御的なポリシーを書けた
- [ ] 外部パートナー向けの制限付きアクセスを設計できた

---

## 次のステップへ

IAM ポリシーの設計演習を完了しました。次のセクションでは、Step 3 のチェックポイントクイズに挑戦しましょう。

---

*推定所要時間: 30分*
