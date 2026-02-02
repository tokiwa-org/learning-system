# チェックポイント：ファイルの中身を見てみよう

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 3
subStep: 6
title: "チェックポイント：ファイルの中身を見てみよう"
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

Step 3で学んだ内容を確認します。

- 全10問
- 合格ライン：8問以上正解

---

## 問題

### Q1: ファイルの内容を全て表示するコマンドは？

A) `show`
B) `cat`
C) `view`
D) `display`

<details>
<summary>答えを見る</summary>

**正解: B) `cat`**

`cat` は concatenate（連結）の略で、ファイル内容を表示します。

</details>

---

### Q2: ファイルの先頭10行を表示するコマンドは？

A) `top`
B) `first`
C) `head`
D) `start`

<details>
<summary>答えを見る</summary>

**正解: C) `head`**

`head` はデフォルトで先頭10行を表示します。

</details>

---

### Q3: ファイルの末尾20行を表示するコマンドは？

A) `tail -20`
B) `tail -n 20`
C) `end -20`
D) `last -20`

<details>
<summary>答えを見る</summary>

**正解: B) `tail -n 20`**

`-n` オプションで行数を指定します。`tail -20` も多くの環境で動作します。

</details>

---

### Q4: ログファイルをリアルタイムで監視するコマンドは？

A) `watch log.txt`
B) `tail -f log.txt`
C) `cat -f log.txt`
D) `less -f log.txt`

<details>
<summary>答えを見る</summary>

**正解: B) `tail -f log.txt`**

`-f` は follow の略で、ファイルの更新をリアルタイムで表示します。

</details>

---

### Q5: `less` を終了するキーは？

A) `x`
B) `q`
C) `Esc`
D) `Ctrl+C`

<details>
<summary>答えを見る</summary>

**正解: B) `q`**

`q` で less を終了します。

</details>

---

### Q6: `less` でファイルの末尾にジャンプするキーは？

A) `E`
B) `End`
C) `G`
D) `$`

<details>
<summary>答えを見る</summary>

**正解: C) `G`**

大文字の `G` で末尾へ、小文字の `g` で先頭へジャンプします。

</details>

---

### Q7: ファイルの行数を数えるコマンドは？

A) `count -l`
B) `wc -l`
C) `lines`
D) `num`

<details>
<summary>答えを見る</summary>

**正解: B) `wc -l`**

`wc` は word count の略で、`-l` オプションで行数を表示します。

</details>

---

### Q8: 2つのファイルの差分を表示するコマンドは？

A) `compare`
B) `diff`
C) `cmp`
D) `delta`

<details>
<summary>答えを見る</summary>

**正解: B) `diff`**

`diff file1 file2` で差分を表示します。

</details>

---

### Q9: `cat -n file.txt` の `-n` オプションは何をする？

A) 行番号を表示
B) 改行を表示
C) 空行を削除
D) ファイル名を表示

<details>
<summary>答えを見る</summary>

**正解: A) 行番号を表示**

`-n` は number の略で、各行に行番号を付けます。

</details>

---

### Q10: `less` での検索で使うキーは？

A) `Ctrl+F`
B) `s`
C) `/`
D) `?` または `/`

<details>
<summary>答えを見る</summary>

**正解: D) `?` または `/`**

`/` で前方検索、`?` で後方検索ができます。

</details>

---

## 実技問題

### 実技1: 行数を数える

```bash
# 100行のファイルを作成
for i in {1..100}; do echo "Line $i"; done > test100.txt

# 行数を確認
wc -l test100.txt
```

**確認**: 100と表示されましたか？

### 実技2: 中間部分を表示

`test100.txt` の51〜60行目を表示してください。

<details>
<summary>📝 解答</summary>

```bash
head -n 60 test100.txt | tail -n 10
```

</details>

### 実技3: クリーンアップ

```bash
rm test100.txt
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

## Step 3 完了！

おめでとうございます！
ファイルの中身を見るスキルを習得しました。

### 習得したスキル

- [x] `cat` でファイル全体を表示
- [x] `head` / `tail` で部分表示
- [x] `less` でページング閲覧
- [x] `wc` で統計情報
- [x] `diff` で差分確認

---

## 次のステップへ

Step 4では、ファイルやテキストを検索するコマンドを学びます。

- `find` でファイルを探す
- `grep` でテキストを検索

大量のファイルから必要な情報を見つける力を身につけましょう！

---

*推定所要時間: 30分*
