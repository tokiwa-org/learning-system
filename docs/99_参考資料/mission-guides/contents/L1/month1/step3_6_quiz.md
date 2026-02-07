# 理解度チェック：Gitの時間を操ろう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 3
subStep: 6
title: "理解度チェック"
itemType: QUIZ
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 3で学んだGit高度操作の理解度をチェックします。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. GitHub Flow で正しくないルールはどれですか？

- A) main ブランチは常にデプロイ可能な状態を保つ
- B) 新しい作業は main から feature ブランチを切る
- C) develop ブランチで統合テストを行う
- D) Pull Request でレビュー後にマージする

<details>
<summary>答えを見る</summary>

**正解: C**

GitHub Flow に `develop` ブランチは存在しません。
`develop` ブランチを使うのは Git Flow です。

GitHub Flow は `main` と feature ブランチだけのシンプルな構成です。

</details>

---

### Q2. リベース（rebase）の特徴として正しいものはどれですか？

- A) マージコミットが作成される
- B) コミットハッシュが変わる
- C) 履歴に分岐・合流が残る
- D) 既存のコミットに影響を与えない

<details>
<summary>答えを見る</summary>

**正解: B**

リベースはコミットを「再作成」するため、コミットハッシュが変わります。

- マージコミットは作成されません（直線的な履歴になる）
- 履歴の分岐・合流は消えます
- 既存のコミットが再作成されるため影響があります

</details>

---

### Q3. コンフリクトマーカーの `=======` は何を示していますか？

- A) コンフリクトの終了
- B) 現在のブランチの変更の始まり
- C) 2つの変更の区切り線
- D) マージ元ブランチの変更の始まり

<details>
<summary>答えを見る</summary>

**正解: C**

コンフリクトマーカーの構造：
- `<<<<<<< HEAD` : 現在のブランチの変更の始まり
- `=======` : 2つの変更の区切り線
- `>>>>>>> branch-name` : マージ元ブランチの変更の終わり

</details>

---

### Q4. `git stash pop` と `git stash apply` の違いとして正しいものはどれですか？

- A) pop は変更を復元し stash を削除、apply は stash を残す
- B) pop は最新の stash のみ対象、apply は全てが対象
- C) pop はステージングも復元、apply はワーキングディレクトリのみ
- D) 違いはない

<details>
<summary>答えを見る</summary>

**正解: A**

- `git stash pop`: 変更を復元し、使用した stash エントリを削除する
- `git stash apply`: 変更を復元するが、stash エントリはリストに残る

stash を再利用する可能性がある場合は `apply`、一度きりなら `pop` を使います。

</details>

---

### Q5. Squash マージの効果として正しいものはどれですか？

- A) マージコミットを作成しない
- B) feature ブランチの全コミットを1つにまとめてマージする
- C) コンフリクトを自動的に解決する
- D) リモートブランチを削除する

<details>
<summary>答えを見る</summary>

**正解: B**

Squash マージ（`git merge --squash`）は、feature ブランチの全てのコミットを
1つのコミットにまとめて、ターゲットブランチにマージします。

細かいコミット（"WIP", "fix typo" など）を整理し、
きれいな1つのコミットとして履歴に残したい場合に使います。

</details>

---

### Q6. リベースの「黄金ルール」として正しいものはどれですか？

- A) リベースは常にマージより優先する
- B) 公開済み（push済み）のブランチをリベースしてはいけない
- C) リベースは main ブランチでのみ使用する
- D) リベースの前に必ず stash する

<details>
<summary>答えを見る</summary>

**正解: B**

リベースはコミットを再作成するため、コミットハッシュが変わります。
他の開発者が参照しているブランチをリベースすると、
全員の作業に影響が出て混乱を招きます。

リベースは自分だけが作業しているローカルブランチに対して使いましょう。

</details>

---

### Q7. Conventional Commits で「バグ修正」に使う type はどれですか？

- A) `bug:`
- B) `fix:`
- C) `patch:`
- D) `repair:`

<details>
<summary>答えを見る</summary>

**正解: B**

Conventional Commits の主な type：
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: コードスタイル（動作に影響しない変更）
- `refactor`: リファクタリング
- `test`: テスト
- `chore`: 雑務（ビルド、CI等）

</details>

---

### Q8. `git cherry-pick` の用途として正しいものはどれですか？

- A) ブランチを削除する
- B) コミットメッセージを変更する
- C) 別ブランチの特定のコミットだけを現在のブランチに取り込む
- D) ステージングエリアをクリアする

<details>
<summary>答えを見る</summary>

**正解: C**

`git cherry-pick <commit-hash>` は、指定したコミットの変更内容を
現在のブランチに新しいコミットとして適用します。

例えば、develop ブランチのバグ修正コミットを
release ブランチにも適用したい場合に使います。

</details>

---

## 結果

### 7問以上正解の場合

**合格です。おめでとうございます。**

Step 3「Gitの時間を操ろう」を完了しました。
次は Step 4「ブランチ戦争を終結させよう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step3_1 ブランチ戦略 |
| Q2, Q5, Q6 | step3_2 マージとリベース |
| Q3 | step3_3 コンフリクト解決 |
| Q4, Q8 | step3_4 stashとcherry-pick |
| Q7 | step3_5 ベストプラクティス |

---

## Step 3 完了

お疲れさまでした。

### 学んだこと

- Git Flow、GitHub Flow、Feature Branch Workflow
- マージ（Fast-Forward、3-Way、Squash）とリベース
- コンフリクトの解決手順
- stash と cherry-pick
- コミットメッセージ規約と .gitignore

### 次のステップ

**Step 4: ブランチ戦争を終結させよう（4時間）**

Pull Request、コードレビュー、チーム開発ワークフローを学びます。

---

*推定所要時間: 15分*
