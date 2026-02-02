# チェックポイント：ファイルとフォルダを操ろう

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 2
subStep: 6
title: "チェックポイント：ファイルとフォルダを操ろう"
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

Step 2で学んだ内容を確認します。

- 全10問
- 合格ライン：8問以上正解

---

## 問題

### Q1: 新しいフォルダを作成するコマンドは？

A) `create folder`
B) `mkdir`
C) `newfolder`
D) `makedir`

<details>
<summary>答えを見る</summary>

**正解: B) `mkdir`**

`mkdir` は「make directory」の略です。

</details>

---

### Q2: `/Users/taro/Documents` のような表記を何と呼ぶ？

A) 相対パス
B) 絶対パス
C) ショートパス
D) フルパス

<details>
<summary>答えを見る</summary>

**正解: B) 絶対パス**

ルート（`/`）から始まる完全な道順を絶対パスと呼びます。

</details>

---

### Q3: 親ディレクトリを表す記号は？

A) `.`
B) `..`
C) `~`
D) `/`

<details>
<summary>答えを見る</summary>

**正解: B) `..`**

- `.` = 現在のディレクトリ
- `..` = 親ディレクトリ
- `~` = ホームディレクトリ
- `/` = ルートディレクトリ

</details>

---

### Q4: 入れ子のフォルダ `a/b/c` を一度に作成するオプションは？

A) `mkdir -a a/b/c`
B) `mkdir -r a/b/c`
C) `mkdir -p a/b/c`
D) `mkdir -n a/b/c`

<details>
<summary>答えを見る</summary>

**正解: C) `mkdir -p a/b/c`**

`-p` は「parent」の略で、必要な親ディレクトリも作成します。

</details>

---

### Q5: 空のファイルを作成するコマンドは？

A) `touch`
B) `create`
C) `new`
D) `make`

<details>
<summary>答えを見る</summary>

**正解: A) `touch`**

`touch` はファイルのタイムスタンプを更新するコマンドですが、
ファイルが存在しない場合は新規作成されます。

</details>

---

### Q6: `echo "hello" > file.txt` の `>` は何をする？

A) ファイルを読み込む
B) ファイルに上書きで書き込む
C) ファイルに追記する
D) ファイルを削除する

<details>
<summary>答えを見る</summary>

**正解: B) ファイルに上書きで書き込む**

- `>` = 上書き（リダイレクト）
- `>>` = 追記

</details>

---

### Q7: ファイルを削除するコマンドは？

A) `delete`
B) `remove`
C) `rm`
D) `del`

<details>
<summary>答えを見る</summary>

**正解: C) `rm`**

`rm` は「remove」の略です。

</details>

---

### Q8: フォルダを中身ごと削除するオプションは？

A) `rm -a`
B) `rm -f`
C) `rm -r`
D) `rm -d`

<details>
<summary>答えを見る</summary>

**正解: C) `rm -r`**

`-r` は「recursive（再帰的）」の略で、フォルダの中身ごと削除します。

</details>

---

### Q9: ファイルを移動またはリネームするコマンドは？

A) `move`
B) `rename`
C) `mv`
D) `rn`

<details>
<summary>答えを見る</summary>

**正解: C) `mv`**

`mv` は「move」の略で、移動とリネームの両方に使います。

</details>

---

### Q10: ホームディレクトリを表す記号は？

A) `$`
B) `@`
C) `~`
D) `#`

<details>
<summary>答えを見る</summary>

**正解: C) `~`**

`~` はチルダと読み、ホームディレクトリへのショートカットです。

</details>

---

## 実技問題

### 実技1: フォルダ作成

以下の構造を作成してください：

```
test-project/
├── src/
└── docs/
```

<details>
<summary>📝 解答</summary>

```bash
mkdir test-project
mkdir test-project/src test-project/docs
```

または

```bash
mkdir -p test-project/{src,docs}
```

</details>

### 実技2: ファイル作成

`test-project/src/` に `main.js` を作成し、`console.log("hello");` を書き込んでください。

<details>
<summary>📝 解答</summary>

```bash
echo 'console.log("hello");' > test-project/src/main.js
```

</details>

### 実技3: コピーとリネーム

`main.js` を `app.js` という名前でコピーしてください。

<details>
<summary>📝 解答</summary>

```bash
cp test-project/src/main.js test-project/src/app.js
```

</details>

---

## 採点

### 選択問題（10問）

| 正解数 | 判定 |
|--------|------|
| 10問 | 完璧！ |
| 8-9問 | 合格 |
| 6-7問 | もう少し |
| 5問以下 | 復習が必要 |

### 実技問題（3問）

| 完了数 | 判定 |
|--------|------|
| 3問 | 完璧！ |
| 2問 | 合格 |
| 1問以下 | 復習が必要 |

---

## 復習ポイント

| 問題 | 復習セクション |
|------|---------------|
| Q1-Q4 | Step 2-1〜2-3: ディレクトリ構造とパス |
| Q5-Q9 | Step 2-3〜2-4: ファイル・フォルダ操作 |
| Q10 | Step 2-1: ディレクトリ構造 |

---

## Step 2 完了！

おめでとうございます！
ファイルとフォルダの操作をマスターしました。

### 習得したスキル

- [x] ディレクトリ構造の理解
- [x] 絶対パスと相対パス
- [x] `mkdir` でフォルダ作成
- [x] `touch` / `echo >` でファイル作成
- [x] `rm` で削除
- [x] `cp` / `mv` でコピー・移動

---

## クリーンアップ

```bash
rm -r test-project
```

---

## 次のステップへ

Step 3では、ファイルの中身を見る方法を学びます。

- `cat` で全体表示
- `head` / `tail` で部分表示
- `less` でページング

ファイルの内容を確認するスキルを身につけましょう！

---

*推定所要時間: 30分*
