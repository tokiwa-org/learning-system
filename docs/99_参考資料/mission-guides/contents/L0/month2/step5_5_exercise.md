# 演習：間違いを取り消そう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 5
subStep: 5
title: "演習：間違いを取り消そう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「取り消しコマンドは覚えたけど、実際に使えるかな...」
>
> 「練習あるのみ！いろんな『間違い』を意図的に作って、取り消す練習をしよう」
>
> 「失敗しても取り消せるから、Gitは安心ですね」
>
> 「その通り。恐れずに試してみよう」

---

## 準備

演習用のリポジトリを作成します。

```bash
# 1. 新しいフォルダを作成
cd ~
mkdir undo-practice
cd undo-practice
git init

# 2. 初期ファイルを作成
cat > document.txt << 'EOF'
# プロジェクトドキュメント

## はじめに
これはサンプルドキュメントです。

## 内容
- 項目1
- 項目2
- 項目3
EOF

cat > config.txt << 'EOF'
# 設定ファイル
debug=false
version=1.0
EOF

# 3. 初回コミット
git add .
git commit -m "Initial commit"

echo "準備完了！"
```

---

## Mission 1: ファイルの変更を取り消す

### シナリオ

`document.txt` を編集したけど、やっぱり元に戻したい。

### タスク

1. `document.txt` に行を追加する
2. 変更を確認する
3. 変更を取り消す
4. 元に戻ったことを確認する

### 実行

```bash
# 1. 変更を追加
echo "## 間違って追加した内容" >> document.txt

# 2. 変更を確認
git diff document.txt

# 3. ここで取り消しコマンドを実行！
# ヒント: git restore または git checkout --
```

<details>
<summary>📝 解答</summary>

```bash
git restore document.txt
# または
git checkout -- document.txt
```

確認：
```bash
cat document.txt
git status
```

</details>

---

## Mission 2: ステージングを取り消す

### シナリオ

`config.txt` を編集して add したけど、このコミットには含めたくない。

### タスク

1. `config.txt` を編集する
2. `git add` する
3. ステージングを取り消す
4. 変更は残したまま、ステージングだけ取り消されたことを確認

### 実行

```bash
# 1. 変更を追加
echo "new_setting=true" >> config.txt

# 2. ステージング
git add config.txt

# 3. 状態確認（緑色）
git status

# 4. ここでステージング取り消しを実行！
# ヒント: git restore --staged または git reset
```

<details>
<summary>📝 解答</summary>

```bash
git restore --staged config.txt
# または
git reset config.txt
```

確認：
```bash
git status  # 赤色（Changes not staged）に変わる
cat config.txt  # 変更は残っている
```

</details>

---

## Mission 3: コミットを取り消す（--soft）

### シナリオ

コミットしたけど、メッセージを間違えた。コミットだけ取り消してやり直したい。

### タスク

1. 現在の変更をコミット（メッセージを間違える）
2. `--soft` でコミットを取り消す
3. 正しいメッセージで再コミット

### 実行

```bash
# 1. 変更をコミット（間違ったメッセージ）
git add config.txt
git commit -m "あsdfghjk"  # タイプミス！

# 2. 履歴を確認
git log --oneline -2

# 3. ここで reset --soft を実行！
```

<details>
<summary>📝 解答</summary>

```bash
git reset --soft HEAD~1

# 状態確認（ステージング済みに戻る）
git status

# 正しいメッセージでコミット
git commit -m "設定に new_setting を追加"

# 履歴確認
git log --oneline -2
```

</details>

---

## Mission 4: コミットを完全に取り消す（--hard）

### シナリオ

間違った変更をコミットしてしまった。変更ごと完全になかったことにしたい。

### タスク

1. 間違った変更を作成してコミット
2. `--hard` で完全に取り消す
3. ファイルも元に戻ったことを確認

### 実行

```bash
# 1. 間違った変更を作成
echo "DELETE THIS LINE" >> document.txt
git add document.txt
git commit -m "間違った変更"

# 2. ファイルを確認
cat document.txt

# 3. ここで reset --hard を実行！
# ⚠️ 注意: 変更が完全に消えます
```

<details>
<summary>📝 解答</summary>

```bash
git reset --hard HEAD~1

# 確認
cat document.txt  # 変更が消えている
git log --oneline -2  # コミットが消えている
git status  # clean
```

</details>

---

## Mission 5: revert でコミットを打ち消す

### シナリオ

（push したと仮定して）履歴を残しながらコミットを取り消したい。

### タスク

1. 変更をコミット
2. revert で打ち消す
3. 履歴に「元のコミット」と「revert コミット」の両方があることを確認

### 実行

```bash
# 1. 変更をコミット
echo "revert で取り消す予定の変更" >> document.txt
git add document.txt
git commit -m "この変更は revert する"

# 2. 履歴を確認
git log --oneline -2

# 3. ここで git revert を実行！
```

<details>
<summary>📝 解答</summary>

```bash
git revert HEAD --no-edit

# 履歴確認（両方のコミットが残っている）
git log --oneline -3

# ファイル確認（元に戻っている）
cat document.txt
```

</details>

---

## Mission 6: 複合シナリオ

### シナリオ

1. `document.txt` を編集
2. `config.txt` も編集
3. 両方 add
4. `document.txt` だけステージング取り消し
5. `config.txt` だけコミット
6. `document.txt` の変更も取り消す

### 実行

```bash
# 1-2. 両方のファイルを編集
echo "document の変更" >> document.txt
echo "config の変更" >> config.txt

# 3. 両方 add
git add document.txt config.txt

# 4. document.txt だけステージング取り消し
# ここにコマンドを入力

# 5. config.txt だけコミット
# ここにコマンドを入力

# 6. document.txt の変更も取り消す
# ここにコマンドを入力
```

<details>
<summary>📝 解答</summary>

```bash
# 4. document.txt だけステージング取り消し
git restore --staged document.txt

# 確認
git status
# config.txt は緑（staged）
# document.txt は赤（not staged）

# 5. config.txt だけコミット
git commit -m "config に変更を追加"

# 6. document.txt の変更も取り消す
git restore document.txt

# 最終確認
git status  # clean
cat document.txt  # 元に戻っている
```

</details>

---

## チャレンジ課題

### Challenge 1: 特定のコミット時点に戻す

3つのコミットを作成し、2つ前の状態に `document.txt` だけ戻してください。

<details>
<summary>💡 ヒント</summary>

```bash
git restore --source=HEAD~2 document.txt
```

</details>

### Challenge 2: add の部分取り消し

大きな変更を add したあと、一部だけステージングを取り消してください。

<details>
<summary>💡 ヒント</summary>

```bash
git reset -p
```

対話的に選択できます。

</details>

---

## 達成度チェック

| Mission | 課題 | 完了 |
|---------|------|------|
| 1 | ファイルの変更を取り消す | □ |
| 2 | ステージングを取り消す | □ |
| 3 | コミットを取り消す（--soft） | □ |
| 4 | コミットを完全に取り消す（--hard） | □ |
| 5 | revert でコミットを打ち消す | □ |
| 6 | 複合シナリオ | □ |

**5個以上クリア** → 合格！

---

## まとめ

この演習で使ったコマンド：

| 状況 | コマンド |
|------|----------|
| 編集を取り消す | `git restore ファイル` |
| ステージング取り消し | `git restore --staged ファイル` |
| コミット取り消し（変更維持） | `git reset --soft HEAD~1` |
| コミット取り消し（完全） | `git reset --hard HEAD~1` |
| コミット打ち消し | `git revert HEAD` |

### 判断フローチャート

```
add した？
├─ No → git restore
└─ Yes
   │
   commit した？
   ├─ No → git restore --staged
   └─ Yes
      │
      push した？
      ├─ No → git reset
      └─ Yes → git revert
```

---

## 次のステップへ

おめでとうございます！
さまざまな「間違い」を取り消すスキルを身につけました。

次のセクションでは、Step 5の理解度を確認するチェックポイントです。
クイズに挑戦して、学んだことを振り返りましょう！

---

*推定所要時間: 90分*
