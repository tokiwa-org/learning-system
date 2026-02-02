# チェックポイント：権限の世界を理解しよう

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 5
subStep: 4
title: "チェックポイント：権限の世界を理解しよう"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "OS基本コマンド"
  category: "IT基本"
  target_level: "L0"
```

---

## このチェックポイントについて

Step 5で学んだ内容を確認します。

- 全10問
- 合格ライン：8問以上正解

---

## 問題

### Q1: `-rw-r--r--` の所有者の権限は？

A) 読み取りのみ
B) 読み取りと書き込み
C) 読み取り、書き込み、実行
D) 権限なし

<details>
<summary>答えを見る</summary>

**正解: B) 読み取りと書き込み**

`rw-` は読み取り（r）と書き込み（w）の権限があり、実行（x）はありません。

</details>

---

### Q2: ファイルの権限を変更するコマンドは？

A) `chperm`
B) `chmod`
C) `chown`
D) `chgrp`

<details>
<summary>答えを見る</summary>

**正解: B) `chmod`**

`chmod` は change mode の略で、権限を変更します。
`chown` は所有者、`chgrp` はグループを変更するコマンドです。

</details>

---

### Q3: 権限 `755` を記号で表すと？

A) `rw-r--r--`
B) `rwxr-xr-x`
C) `rwx------`
D) `rw-rw-rw-`

<details>
<summary>答えを見る</summary>

**正解: B) `rwxr-xr-x`**

- 7 = rwx (4+2+1)
- 5 = r-x (4+0+1)
- 5 = r-x (4+0+1)

</details>

---

### Q4: スクリプトに実行権限を追加するコマンドは？

A) `chmod +r script.sh`
B) `chmod +w script.sh`
C) `chmod +x script.sh`
D) `chmod 644 script.sh`

<details>
<summary>答えを見る</summary>

**正解: C) `chmod +x script.sh`**

`+x` で実行権限を追加します。

</details>

---

### Q5: SSH秘密鍵に推奨される権限は？

A) 644
B) 755
C) 600
D) 777

<details>
<summary>答えを見る</summary>

**正解: C) 600**

SSH秘密鍵は所有者のみが読み書きできる `600` (rw-------) に設定すべきです。

</details>

---

### Q6: `drwxr-xr-x` の最初の `d` は何を意味する？

A) 削除可能
B) ディレクトリ
C) デフォルト
D) ドキュメント

<details>
<summary>答えを見る</summary>

**正解: B) ディレクトリ**

ファイルタイプを示し、`d` はディレクトリ、`-` は通常のファイル、`l` はシンボリックリンクです。

</details>

---

### Q7: 権限の数字 `4` が表すものは？

A) 実行
B) 書き込み
C) 読み取り
D) すべて

<details>
<summary>答えを見る</summary>

**正解: C) 読み取り**

- r (読み取り) = 4
- w (書き込み) = 2
- x (実行) = 1

</details>

---

### Q8: グループから書き込み権限を削除するコマンドは？

A) `chmod g-w file`
B) `chmod g+w file`
C) `chmod -g-w file`
D) `chmod w-g file`

<details>
<summary>答えを見る</summary>

**正解: A) `chmod g-w file`**

`g` はグループ、`-` は削除、`w` は書き込み権限を表します。

</details>

---

### Q9: 権限 `rw-r-----` を数字で表すと？

A) 644
B) 640
C) 620
D) 600

<details>
<summary>答えを見る</summary>

**正解: B) 640**

- rw- = 4+2+0 = 6
- r-- = 4+0+0 = 4
- --- = 0+0+0 = 0

</details>

---

### Q10: ディレクトリに `cd` で入るために必要な権限は？

A) r (読み取り)
B) w (書き込み)
C) x (実行)
D) rw (読み書き)

<details>
<summary>答えを見る</summary>

**正解: C) x (実行)**

ディレクトリの実行権限は、そのディレクトリに入る（cd）権限を意味します。

</details>

---

## 実技問題

### 実技1: 権限を確認

```bash
# テストファイルを作成
mkdir -p ~/quiz-perm
cd ~/quiz-perm
touch test.txt

# 権限を確認
ls -l test.txt
```

このファイルの権限を答えてください。

---

### 実技2: 権限を変更

test.txt の権限を `600` に変更してください。

<details>
<summary>解答</summary>

```bash
chmod 600 test.txt
ls -l test.txt
# -rw------- と表示される
```

</details>

---

### 実技3: スクリプトを実行可能に

```bash
cat > ~/quiz-perm/hello.sh << 'EOF'
#!/bin/bash
echo "Hello!"
EOF
```

このスクリプトを実行可能にして、実行してください。

<details>
<summary>解答</summary>

```bash
chmod +x ~/quiz-perm/hello.sh
~/quiz-perm/hello.sh
# Hello! と表示される
```

</details>

---

### 実技4: クリーンアップ

```bash
rm -rf ~/quiz-perm
```

---

## 採点

### 選択問題（10問）

| 正解数 | 判定 |
|--------|------|
| 10問 | 完璧！ |
| 8-9問 | 合格 |
| 6-7問 | もう少し |
| 5問以下 | 復習が必要 |

---

## Step 5 完了！

おめでとうございます！
ファイル権限のスキルを習得しました。

### 習得したスキル

- [x] 権限表記（rwx）の読み方
- [x] 数字表記（755, 644など）の理解
- [x] `chmod` での権限変更
- [x] 適切な権限設定の選択

### 権限のまとめ

```
-rwxr-xr-x = 755
 │  │  │
 │  │  └── その他: r-x (5)
 │  └───── グループ: r-x (5)
 └──────── 所有者: rwx (7)
```

---

## 次のステップへ

Step 6は、ターミナル卒業試験です！

これまで学んだすべてのコマンドを使った総合演習に挑戦します。
- ディレクトリ操作
- ファイル操作
- テキスト表示
- 検索コマンド
- 権限設定

すべてのスキルを統合して、ターミナルマスターになりましょう！

---

*推定所要時間: 30分*
