# チェックポイント：IAMでセキュリティを固めよう

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 3
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "AWS"
  category: "クラウド"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 3 で学んだ IAM セキュリティに関する理解度をチェックします。

- 全6問
- 合格ライン: 80%（5問正解）

---

## 問題

### Q1. IAM ポリシーにおいて、Allow と Deny の両方がマッチした場合の評価結果はどうなりますか？

- A) Allow が優先される
- B) Deny が優先される
- C) 最後に定義されたルールが優先される
- D) エラーになる

<details>
<summary>解答と解説</summary>

**正解: B**

IAM ポリシーの評価では、明示的な Deny は常に Allow より優先されます。これにより、広範な Allow を付与した上で、特定の危険な操作だけを Deny で禁止するという防御的な設計が可能になります。

</details>

---

### Q2. EC2 インスタンス上のアプリケーションが S3 にアクセスする際の推奨される方法はどれですか？

- A) アクセスキーをソースコードに埋め込む
- B) アクセスキーを環境変数に設定する
- C) IAM ロールを EC2 にアタッチする
- D) ルートユーザーのアクセスキーを使用する

<details>
<summary>解答と解説</summary>

**正解: C**

IAM ロールを EC2 にアタッチすることで、一時的な認証情報が自動的に付与・ローテーションされます。アクセスキーの漏洩リスクがなく、最も安全な方法です。アクセスキーのソースコードへの埋め込みやルートユーザーの使用は重大なセキュリティリスクです。

</details>

---

### Q3. IAM ポリシーの Condition で IP アドレスを制限するために使用するキーはどれですか？

- A) `aws:SourceRegion`
- B) `aws:SourceIp`
- C) `aws:IpAddress`
- D) `aws:NetworkOrigin`

<details>
<summary>解答と解説</summary>

**正解: B**

`aws:SourceIp` は、リクエスト元の IP アドレスを条件として使用するための Condition キーです。特定のオフィスの IP アドレスからのみアクセスを許可するなどの制限に使用します。

</details>

---

### Q4. 権限境界（Permissions Boundary）の説明として正しいものはどれですか？

- A) IAM ユーザーに付与される最低限の権限を定義する
- B) IAM ユーザーやロールが持てる権限の上限を定義する
- C) AWS アカウント全体の権限を制限する
- D) 特定のリソースへのアクセスを拒否する

<details>
<summary>解答と解説</summary>

**正解: B**

権限境界は、IAM ユーザーやロールが持つことができる権限の「上限」を定義するものです。実際に有効な権限は、付与されたポリシーと権限境界の「交差部分」（両方で Allow されている範囲）になります。これにより、委任された管理者がユーザーに過剰な権限を付与することを防止できます。

</details>

---

### Q5. アクセスキーのローテーション手順として正しい順序はどれですか？

- A) 古いキーを削除 → 新しいキーを作成 → アプリを更新
- B) 新しいキーを作成 → アプリを更新 → 古いキーを無効化 → 古いキーを削除
- C) アプリを停止 → キーを変更 → アプリを再起動
- D) 新しいキーを作成 → 古いキーを即座に削除

<details>
<summary>解答と解説</summary>

**正解: B**

正しいローテーション手順は、(1) 新しいキーを作成、(2) アプリケーションを新しいキーに更新、(3) 古いキーを無効化して問題がないか確認、(4) 確認後に古いキーを削除です。古いキーを先に削除するとアプリケーションが動かなくなるリスクがあります。

</details>

---

### Q6. MFA を有効にしていない IAM ユーザーの操作を制限するポリシーで使用する Condition キーはどれですか？

- A) `aws:MFAEnabled`
- B) `aws:MultiFactorAuthPresent`
- C) `aws:RequireMFA`
- D) `aws:AuthenticationType`

<details>
<summary>解答と解説</summary>

**正解: B**

`aws:MultiFactorAuthPresent` は、リクエストが MFA で認証されているかどうかを示す Condition キーです。`"BoolIfExists": {"aws:MultiFactorAuthPresent": "false"}` の条件で、MFA 未認証のリクエストを Deny するポリシーを作成できます。

</details>

---

## 結果

### 5問以上正解の場合

**合格です。おめでとうございます。**

Step 3「IAMでセキュリティを固めよう」を完了しました。
次は Step 4「VPCネットワークを設計しよう」に進みましょう。

### 4問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step3_2 ポリシーとロール |
| Q2 | step3_1 IAMの基本概念 |
| Q3, Q4 | step3_3 最小権限の原則を実践 |
| Q5, Q6 | step3_4 MFAとアクセスキー管理 |

---

*推定所要時間: 15分*
