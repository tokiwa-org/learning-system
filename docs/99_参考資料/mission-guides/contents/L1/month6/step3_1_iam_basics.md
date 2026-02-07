# IAMの基本概念

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 3
subStep: 1
title: "IAMの基本概念"
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

> 「EC2、S3、RDS を構築できるようになったな。
> だが、今のままでは一つ大きな問題がある」
>
> 山田先輩が真剣な表情で言う。
>
> 「セキュリティだ。中村製作所さんの AWS 環境に誰が何をできるか、
> 適切にコントロールしないと大変なことになる」
>
> 「先月学んだ最小権限の原則ですね」
>
> 「その通り。AWS でそれを実現するのが IAM（Identity and Access Management）だ。
> ユーザー、グループ、ロール、ポリシー......IAM は AWS セキュリティの根幹だ。
> ここをしっかり押さえないと、本番環境は任せられない」

---

## IAM とは

IAM（Identity and Access Management）は、AWS のリソースへのアクセスを安全に制御するためのサービスです。「誰が」「何に対して」「何をできるか」を管理します。

### IAM の4つの構成要素

```
IAM の構成要素

┌──────────────────────────────────────────┐
│                 IAM                       │
│                                           │
│  ┌──────────┐    ┌──────────┐            │
│  │ ユーザー   │    │  グループ  │            │
│  │ (User)    │    │ (Group)   │            │
│  │           │    │           │            │
│  │ 田中      │───→│ 開発チーム │            │
│  │ 佐藤      │───→│           │            │
│  │ 鈴木      │───→│ 運用チーム │            │
│  └──────────┘    └─────┬────┘            │
│                        │                  │
│                        ▼                  │
│  ┌──────────────────────────────────┐    │
│  │ ポリシー (Policy)                  │    │
│  │ "EC2の起動・停止を許可"             │    │
│  │ "S3の読み取りのみ許可"              │    │
│  └──────────────────────────────────┘    │
│                                           │
│  ┌──────────┐                            │
│  │ ロール    │ ← EC2やLambdaに割り当てる  │
│  │ (Role)   │                            │
│  └──────────┘                            │
└──────────────────────────────────────────┘
```

---

## ルートユーザーと IAM ユーザー

### ルートユーザー

AWS アカウント作成時のメールアドレスでログインするユーザーです。全ての権限を持ちます。

| 項目 | 説明 |
|------|------|
| 権限 | 全ての AWS リソースに無制限アクセス |
| 用途 | アカウント設定、課金管理など限定的な操作のみ |
| 注意 | 日常業務では絶対に使用しない |

### IAM ユーザー

個人に割り当てる AWS 操作用のアカウントです。

```bash
# IAMユーザーの作成
aws iam create-user --user-name tanaka

# コンソールアクセス用のパスワード設定
aws iam create-login-profile \
  --user-name tanaka \
  --password "InitialP@ss123!" \
  --password-reset-required

# アクセスキーの作成（CLI/API用）
aws iam create-access-key --user-name tanaka
```

---

## IAM グループ

複数のユーザーに同じ権限をまとめて付与するための仕組みです。

```bash
# グループの作成
aws iam create-group --group-name developers
aws iam create-group --group-name operators

# ユーザーをグループに追加
aws iam add-user-to-group --user-name tanaka --group-name developers
aws iam add-user-to-group --user-name sato --group-name developers
aws iam add-user-to-group --user-name suzuki --group-name operators
```

### グループ設計のベストプラクティス

```
中村製作所の IAM グループ構成例

┌──────────────────────────────────────┐
│  管理者グループ (admins)                │
│  ポリシー: AdministratorAccess         │
│  メンバー: 山田（CTO）                  │
├──────────────────────────────────────┤
│  開発者グループ (developers)            │
│  ポリシー: EC2/S3/RDS 操作権限          │
│  メンバー: 田中, 佐藤                    │
├──────────────────────────────────────┤
│  運用チームグループ (operators)          │
│  ポリシー: EC2/RDS の監視・停止/起動     │
│  メンバー: 鈴木, 高橋                    │
├──────────────────────────────────────┤
│  閲覧専用グループ (readonly)            │
│  ポリシー: 全リソースの読み取りのみ       │
│  メンバー: 経営陣                        │
└──────────────────────────────────────┘
```

---

## IAM ロール

ロールはユーザーではなく、AWS サービスやアプリケーションに権限を付与するための仕組みです。

### ロールの主な用途

| 用途 | 説明 |
|------|------|
| EC2 用ロール | EC2 インスタンス上のアプリケーションが S3 や RDS にアクセスする |
| Lambda 用ロール | Lambda 関数が他の AWS サービスを利用する |
| クロスアカウントロール | 別の AWS アカウントのリソースにアクセスする |
| フェデレーション | 外部 IdP（Active Directory 等）のユーザーが AWS にアクセスする |

```bash
# EC2 用ロールの作成
aws iam create-role \
  --role-name nakamura-ec2-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {"Service": "ec2.amazonaws.com"},
        "Action": "sts:AssumeRole"
      }
    ]
  }'

# インスタンスプロファイルの作成と関連付け
aws iam create-instance-profile \
  --instance-profile-name nakamura-ec2-profile

aws iam add-role-to-instance-profile \
  --instance-profile-name nakamura-ec2-profile \
  --role-name nakamura-ec2-role
```

---

## ユーザーとロールの使い分け

```
アクセスキーを使う方法（非推奨）:

  EC2 インスタンス
  ┌────────────────┐
  │ アプリケーション │
  │                │
  │ AWS_ACCESS_KEY │  ← キーが漏洩するリスク
  │ AWS_SECRET_KEY │
  └────────────────┘

IAM ロールを使う方法（推奨）:

  EC2 インスタンス
  ┌────────────────┐
  │ アプリケーション │
  │                │
  │  IAM ロール     │  ← 一時的な認証情報が自動的に付与
  │  (自動ローテーション)│
  └────────────────┘
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| IAM とは | AWS リソースへのアクセスを管理するサービス |
| 構成要素 | ユーザー、グループ、ロール、ポリシー |
| ルートユーザー | 全権限を持つ。日常業務では使用しない |
| グループ | 複数ユーザーに同じ権限を効率的に付与 |
| ロール | AWS サービスやアプリケーションに権限を付与 |

### チェックリスト

- [ ] IAM の4つの構成要素を説明できる
- [ ] ルートユーザーと IAM ユーザーの違いを理解した
- [ ] グループによる権限管理のメリットを理解した
- [ ] IAM ロールの用途と必要性を把握した

---

## 次のステップへ

次のセクションでは、IAM ポリシーとロールの詳細を学びます。
JSON 形式のポリシーの読み書きは、AWS セキュリティ設計の必須スキルです。

---

*推定読了時間: 25分*
