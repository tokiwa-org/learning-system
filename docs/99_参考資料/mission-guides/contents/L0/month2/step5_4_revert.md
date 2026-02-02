# git revertでコミットを打ち消そう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 5
subStep: 4
title: "git revertでコミットを打ち消そう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「pushしちゃったコミットを取り消したいんですけど...」
>
> 「それは `git revert` を使うよ。reset じゃダメなんだ」
>
> 「何が違うんですか？」
>
> 「reset は履歴を書き換えるから、チームに迷惑がかかる。
> revert は『打ち消すコミット』を新しく作るから安全なんだ」

---

## revert と reset の違い

### git reset

履歴を「巻き戻す」。コミット自体が消える。

```
Before:  A → B → C → D (HEAD)
After:   A → B → C (HEAD)
         D は消える
```

### git revert

「打ち消すコミット」を新しく作る。履歴は残る。

```
Before:  A → B → C → D (HEAD)
After:   A → B → C → D → D' (HEAD)
         D' は D の変更を元に戻す
```

---

## なぜ push 後は revert を使うのか

### reset を使うと...

```
あなた:         A → B → C (reset後)
リモート:       A → B → C → D
チームメンバー:  A → B → C → D

→ 履歴がずれて、チームが混乱！
```

### revert を使うと...

```
あなた:         A → B → C → D → D'
リモート:       A → B → C → D → D' (push後)
チームメンバー:  A → B → C → D → D' (pull後)

→ 全員が同じ履歴を持てる
```

---

## 基本的な使い方

### 最新のコミットを打ち消す

```bash
git revert HEAD
```

### 特定のコミットを打ち消す

```bash
git revert コミットハッシュ
```

例：
```bash
git revert abc1234
```

---

## 実際にやってみよう

### Step 1: 変更を作成してコミット

```bash
cd ~/my-first-git

# 変更を追加
echo "間違った変更です" >> hello.txt

# コミット
git add hello.txt
git commit -m "間違った変更を追加"
```

### Step 2: 履歴を確認

```bash
git log --oneline -3
```

出力：
```
abc1234 (HEAD -> main) 間違った変更を追加
def5678 前のコミット
...
```

### Step 3: revert を実行

```bash
git revert HEAD
```

エディタが開いて、コミットメッセージの入力を求められます。

```
Revert "間違った変更を追加"

This reverts commit abc1234567890...
```

デフォルトのメッセージでOKなら、保存して閉じます。

### Step 4: 結果を確認

```bash
git log --oneline -3
```

出力：
```
xyz7890 (HEAD -> main) Revert "間違った変更を追加"
abc1234 間違った変更を追加
def5678 前のコミット
```

新しいコミット（Revert...）が追加されました！

```bash
cat hello.txt
```

ファイルも元に戻っています。

---

## メッセージを指定する

エディタを開かずにメッセージを指定：

```bash
git revert HEAD --no-edit
```

デフォルトメッセージで自動コミット。

```bash
git revert HEAD -m "メッセージ"
```

カスタムメッセージを指定。

---

## コミットせずに revert する

### --no-commit オプション

```bash
git revert HEAD --no-commit
```

または

```bash
git revert HEAD -n
```

変更だけ適用して、コミットは手動で行います。

```bash
git status
# Changes to be committed が表示される

git commit -m "カスタムメッセージで revert"
```

---

## 複数のコミットを revert

### 連続するコミット

```bash
git revert HEAD~3..HEAD --no-commit
git commit -m "最近の3コミットを取り消し"
```

### 個別に revert

```bash
git revert abc1234
git revert def5678
```

---

## コンフリクトが発生したら

revert 時にコンフリクトが発生することがあります。

```bash
git revert abc1234
# CONFLICT が表示される
```

### 解決手順

1. コンフリクトしたファイルを編集
2. `<<<`, `===`, `>>>` を削除して正しい内容に
3. `git add ファイル名`
4. `git revert --continue`

### revert を中止する

```bash
git revert --abort
```

revert 操作を取り消して元の状態に戻ります。

---

## push 後の流れ

### 1. 間違いに気づく

```bash
git log --oneline -3
# あ、このコミットが問題だ...
```

### 2. revert する

```bash
git revert HEAD
```

### 3. push する

```bash
git push
```

これで安全に変更が取り消されます。

---

## revert のメリット・デメリット

### メリット

- 履歴が残るので追跡可能
- チーム開発でも安全
- 「なぜ取り消したか」が記録に残る

### デメリット

- 履歴が増える
- 「きれいな履歴」を保ちにくい

> チーム開発では「安全」が最優先です。

---

## よくある間違い

### 間違い1: push後にresetを使う

```bash
git reset --hard HEAD~1
git push --force  # 絶対NG！
```

チームの作業が壊れる可能性があります。

### 間違い2: revert対象を間違える

```bash
git revert HEAD~2  # 2つ前のコミットを revert
                   # 最新ではない！
```

対象を確認してから実行しましょう。

### 間違い3: revert の revert

```bash
git revert xyz7890  # revert コミットを revert
                    # → 元の変更が復活
```

混乱の元になるので注意。

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. 変更を作成してコミット
cd ~/my-first-git
echo "revert テスト" >> hello.txt
git add hello.txt
git commit -m "revert テスト用のコミット"

# 2. 履歴を確認
git log --oneline -3

# 3. revert を実行
git revert HEAD --no-edit

# 4. 履歴を確認
git log --oneline -3

# 5. ファイルの内容を確認
cat hello.txt
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `git revert HEAD` | 最新コミットを打ち消す |
| `git revert ハッシュ` | 特定コミットを打ち消す |
| `git revert --no-edit` | デフォルトメッセージで実行 |
| `git revert --no-commit` | コミットせずに変更だけ適用 |
| `git revert --abort` | revert を中止 |

### reset と revert の使い分け

| 状況 | コマンド |
|------|----------|
| まだ push していない | `git reset` でOK |
| すでに push した | `git revert` を使う |
| チーム開発 | 常に `git revert` |

### チェックリスト

- [ ] `git revert` でコミットを打ち消せた
- [ ] 履歴に revert コミットが追加されることを確認した
- [ ] reset との違いを理解した

---

## 次のステップへ

git revert をマスターしましたね！

次のセクションでは、ここまで学んだ取り消しテクニックを
使った実践演習に挑戦します。

さまざまな「間違い」を取り消してみましょう！

---

*推定読了時間: 30分*
