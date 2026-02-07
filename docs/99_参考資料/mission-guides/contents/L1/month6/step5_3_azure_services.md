# Azureの主要サービス

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 5
subStep: 3
title: "Azureの主要サービス"
itemType: LESSON
estimatedMinutes: 20
noiseLevel: MINIMAL
roadmap:
  skill: "マルチクラウド"
  category: "クラウド"
  target_level: "L1"
```

---

## ストーリー

> 「GCP の次は Azure だ。Microsoft のクラウドプラットフォームだな」
>
> 山田先輩が Azure のダッシュボードを開く。
>
> 「Azure はエンタープライズ分野で特に強い。
> 中村製作所さんは社内で Office 365 と Active Directory を使っているから、
> 将来的に Azure との連携も視野に入れている」
>
> 「Microsoft 製品との統合が強みなんですね」
>
> 「そうだ。Active Directory、Teams、Power BI......
> Microsoft のエコシステムを使っている企業にとって、
> Azure は自然な選択肢になる。サービスの対応関係を押さえておこう」

---

## Azure の基本構造

### リソース階層

```
Azure のリソース階層:

  Tenant（テナント）/ Azure AD
      │
      ├── Management Group（管理グループ）
      │     │
      │     ├── Subscription（サブスクリプション）
      │     │     │
      │     │     ├── Resource Group（リソースグループ）
      │     │     │     ├── Virtual Machine
      │     │     │     ├── Storage Account
      │     │     │     └── SQL Database
      │     │     │
      │     │     └── Resource Group
      │     │
      │     └── Subscription
      │
      └── Management Group

AWS との対応:
  Subscription   → AWS アカウント
  Resource Group → （AWS に直接の対応なし。タグで代替）
```

### リージョンとゾーン

| Azure | AWS 対応 | 日本拠点 |
|-------|---------|---------|
| Region | Region | Japan East（東京）, Japan West（大阪） |
| Availability Zone | AZ | Zone 1, 2, 3（一部リージョンのみ） |

---

## 主要サービスの AWS 対応表

### コンピュート

| Azure サービス | AWS 対応 | 説明 |
|---------------|---------|------|
| Virtual Machines | EC2 | 仮想マシン |
| Azure Functions | Lambda | サーバーレス関数 |
| Azure Kubernetes Service (AKS) | EKS | Kubernetes マネージドサービス |
| App Service | Elastic Beanstalk | PaaS（Web アプリ） |
| Container Instances | Fargate | マネージドコンテナ |

### ストレージ

| Azure サービス | AWS 対応 | 説明 |
|---------------|---------|------|
| Blob Storage | S3 | オブジェクトストレージ |
| Managed Disks | EBS | ブロックストレージ |
| Azure Files | EFS | ファイルストレージ |
| Azure Data Lake | S3 + Athena | データレイク |

### データベース

| Azure サービス | AWS 対応 | 説明 |
|---------------|---------|------|
| Azure SQL Database | RDS (SQL Server) | マネージド SQL Server |
| Azure Database for MySQL | RDS (MySQL) | マネージド MySQL |
| Azure Database for PostgreSQL | RDS (PostgreSQL) | マネージド PostgreSQL |
| Cosmos DB | DynamoDB | グローバル分散 NoSQL |

### ネットワーク

| Azure サービス | AWS 対応 | 説明 |
|---------------|---------|------|
| Virtual Network (VNet) | VPC | 仮想ネットワーク |
| Azure Load Balancer | NLB | L4ロードバランサー |
| Application Gateway | ALB | L7ロードバランサー |
| Azure DNS | Route 53 | DNS サービス |
| Azure CDN | CloudFront | CDN |

---

## Azure の特筆すべきサービス

### Azure Active Directory (Entra ID)

クラウドベースの ID 管理サービス。オンプレミスの Active Directory とのハイブリッド連携が強みです。

```
Azure AD の活用例:

  社内 AD ←─同期─→ Azure AD ──→ Office 365
                                  ──→ Azure サービス
                                  ──→ サードパーティ SaaS

  シングルサインオン（SSO）で全サービスにアクセス
```

| 機能 | 説明 |
|------|------|
| SSO | 1回のログインで複数サービスにアクセス |
| MFA | 多要素認証の統合管理 |
| 条件付きアクセス | デバイス・場所に基づくアクセス制御 |
| B2B/B2C | 外部ユーザーやお客様向けの ID 管理 |

### Power BI

ビジネスインテリジェンスツール。データの可視化とダッシュボード作成に優れています。

### Azure DevOps

CI/CD パイプライン、Git リポジトリ、プロジェクト管理を統合した開発プラットフォームです。

---

## Azure CLI の基本

```bash
# Azure CLI のバージョン確認
az version

# ログイン
az login

# サブスクリプションの一覧
az account list --output table

# リソースグループの一覧
az group list --output table

# 仮想マシンの一覧
az vm list --output table

# ストレージアカウントの一覧
az storage account list --output table
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Azure の構造 | Tenant → Management Group → Subscription → Resource Group |
| コンピュート | Virtual Machines（EC2相当）、AKS、App Service |
| ストレージ | Blob Storage（S3相当）、Azure SQL Database（RDS相当） |
| 強み | Azure AD（ID管理）、Microsoft統合、エンタープライズ |
| CLI | az コマンドで操作 |

### チェックリスト

- [ ] Azure のリソース階層を理解した
- [ ] 主要サービスの AWS との対応関係を把握した
- [ ] Azure AD の特徴と強みを説明できる
- [ ] az CLI の基本コマンドを知った

---

## 次のステップへ

次のセクションでは、AWS/GCP/Azure の3大クラウドを横断的に比較します。
各プロバイダの強み・弱みを理解して、適切な選択ができるようになりましょう。

---

*推定読了時間: 20分*
