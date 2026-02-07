# 理解度チェック：マルチクラウドの視野を広げよう

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 5
subStep: 6
title: "理解度チェック"
itemType: QUIZ
estimatedMinutes: 20
noiseLevel: MINIMAL
roadmap:
  skill: "マルチクラウド"
  category: "クラウド"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 5 で学んだマルチクラウドに関する理解度をチェックします。

- 全6問
- 合格ライン: 80%（5問正解）

---

## 問題

### Q1. マルチクラウドを採用する最大のメリットはどれですか？

- A) 全てのクラウドの最安値を利用できる
- B) ベンダーロックインの回避とリスク分散
- C) 管理が単純になる
- D) 自動的にマルチリージョンになる

<details>
<summary>解答と解説</summary>

**正解: B**

マルチクラウドの最大のメリットは、特定のクラウドプロバイダへの依存を減らし（ベンダーロックイン回避）、1つのプロバイダの障害時にも事業を継続できる（リスク分散）ことです。管理はむしろ複雑になりますし、自動的にコスト最適化やマルチリージョンになるわけではありません。

</details>

---

### Q2. AWS の S3 に対応する GCP のサービスはどれですか？

- A) Persistent Disk
- B) Cloud Storage
- C) Filestore
- D) BigQuery

<details>
<summary>解答と解説</summary>

**正解: B**

GCP の Cloud Storage は、AWS の S3 に対応するオブジェクトストレージサービスです。Persistent Disk は EBS（ブロックストレージ）に対応し、Filestore は EFS（ファイルストレージ）に対応します。BigQuery はデータウェアハウスサービスです。

</details>

---

### Q3. Azure が特に強みを持つ分野はどれですか？

- A) データ分析と AI/ML
- B) エンタープライズと Microsoft 製品統合
- C) コンテナオーケストレーション
- D) サーバーレスコンピューティング

<details>
<summary>解答と解説</summary>

**正解: B**

Azure は Active Directory（Entra ID）との連携、Office 365 や Teams との統合など、エンタープライズ分野と Microsoft 製品のエコシステムで特に強みを持ちます。データ分析は GCP（BigQuery）が、コンテナは GCP（GKE）がそれぞれ高い評価を得ています。

</details>

---

### Q4. クラウド間のポータビリティを高めるために最も効果的な方法はどれですか？

- A) 各クラウドのマネージドサービスを最大限活用する
- B) コンテナ化し、Kubernetes で統一的に管理する
- C) 全てのリソースを手動で管理する
- D) 1つのクラウドのみを使用する

<details>
<summary>解答と解説</summary>

**正解: B**

コンテナ化（Docker）とKubernetes を使うことで、アプリケーションをクラウドに依存しない形でパッケージングし、AWS EKS / GCP GKE / Azure AKS のいずれでも動作させることができます。マネージドサービスの活用は便利ですが、クラウド固有の依存が生まれるトレードオフがあります。

</details>

---

### Q5. 複数のクラウドプロバイダのインフラを統一的に管理できる IaC ツールはどれですか？

- A) AWS CloudFormation
- B) Azure ARM テンプレート
- C) Terraform
- D) GCP Deployment Manager

<details>
<summary>解答と解説</summary>

**正解: C**

Terraform は HashiCorp が開発した IaC ツールで、AWS、GCP、Azure をはじめとする複数のクラウドプロバイダに対応しています。CloudFormation は AWS のみ、ARM テンプレートは Azure のみ、Deployment Manager は GCP のみに対応するクラウドネイティブの IaC ツールです。

</details>

---

### Q6. GCP のサービスで、ペタバイト規模のデータをサーバーレスで分析できるデータウェアハウスはどれですか？

- A) Cloud SQL
- B) Cloud Spanner
- C) Firestore
- D) BigQuery

<details>
<summary>解答と解説</summary>

**正解: D**

BigQuery は GCP の代表的なサービスの一つで、サーバーレスのデータウェアハウスです。ペタバイト規模のデータを標準 SQL で数秒〜数分で分析でき、インフラ管理が不要です。Cloud SQL は RDS 相当のマネージド RDB、Cloud Spanner はグローバル分散 RDB、Firestore は NoSQL データベースです。

</details>

---

## 結果

### 5問以上正解の場合

**合格です。おめでとうございます。**

Step 5「マルチクラウドの視野を広げよう」を完了しました。
次は最終ステップ Step 6「クラウドアーキテクチャを完成させよう」に進みましょう。

### 4問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step5_1 マルチクラウドの意義 |
| Q2, Q6 | step5_2 GCPの主要サービス |
| Q3 | step5_3 Azureの主要サービス |
| Q2, Q3 | step5_4 クラウドサービス比較 |
| Q4, Q5 | step5_5 マルチクラウド戦略 |

---

*推定所要時間: 20分*
