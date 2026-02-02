# チェックポイント：検索コマンドをマスターしよう

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 4
subStep: 6
title: "チェックポイント：検索コマンドをマスターしよう"
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

Step 4で学んだ内容を確認します。

- 全10問
- 合格ライン：8問以上正解

---

## 問題

### Q1: ファイル名でファイルを検索するコマンドは？

A) `search`
B) `locate`
C) `find`
D) `seek`

<details>
<summary>答えを見る</summary>

**正解: C) `find`**

`find` コマンドでファイル名やその他の条件でファイルを検索できます。

</details>

---

### Q2: カレントディレクトリ以下の `.txt` ファイルを探すコマンドは？

A) `find . -name "*.txt"`
B) `find . -type "*.txt"`
C) `find -name "*.txt"`
D) `search . "*.txt"`

<details>
<summary>答えを見る</summary>

**正解: A) `find . -name "*.txt"`**

`.` はカレントディレクトリを表し、`-name` でファイル名のパターンを指定します。

</details>

---

### Q3: findで大文字小文字を区別せずにファイル名を検索するオプションは？

A) `-name -i`
B) `-iname`
C) `-case-insensitive`
D) `-nocase`

<details>
<summary>答えを見る</summary>

**正解: B) `-iname`**

`-iname` は case-insensitive name の略で、大文字小文字を区別しません。

</details>

---

### Q4: findでディレクトリだけを検索するオプションは？

A) `-type d`
B) `-type dir`
C) `-dir`
D) `-directory`

<details>
<summary>答えを見る</summary>

**正解: A) `-type d`**

`-type d` でディレクトリのみ、`-type f` でファイルのみを検索します。

</details>

---

### Q5: ファイルの中身から文字列を検索するコマンドは？

A) `find`
B) `search`
C) `grep`
D) `look`

<details>
<summary>答えを見る</summary>

**正解: C) `grep`**

`grep` はファイルの内容から指定したパターンに一致する行を表示します。

</details>

---

### Q6: grepで大文字小文字を区別せずに検索するオプションは？

A) `-c`
B) `-i`
C) `-n`
D) `-v`

<details>
<summary>答えを見る</summary>

**正解: B) `-i`**

`-i` は case-insensitive の略で、大文字小文字を区別しません。

</details>

---

### Q7: grepでマッチした行の前後3行も表示するオプションは？

A) `-A 3`
B) `-B 3`
C) `-C 3`
D) `-n 3`

<details>
<summary>答えを見る</summary>

**正解: C) `-C 3`**

`-C` は Context の略で前後の行を表示します。`-A` は After（後）、`-B` は Before（前）のみです。

</details>

---

### Q8: grepでディレクトリを再帰的に検索するオプションは？

A) `-R`
B) `-r`
C) `-d`
D) A と B 両方

<details>
<summary>答えを見る</summary>

**正解: D) A と B 両方**

`-r` と `-R` はどちらも再帰的な検索を行います（大文字小文字の違いはシンボリックリンクの扱いに影響します）。

</details>

---

### Q9: grepで「ERROR」または「WARN」を検索するコマンドは？

A) `grep "ERROR WARN" file.txt`
B) `grep "ERROR|WARN" file.txt`
C) `grep -E "ERROR|WARN" file.txt`
D) `grep -o "ERROR,WARN" file.txt`

<details>
<summary>答えを見る</summary>

**正解: C) `grep -E "ERROR|WARN" file.txt`**

`-E` オプションで拡張正規表現を使い、`|` でOR条件を指定します。

</details>

---

### Q10: findで見つけたファイルに対してコマンドを実行するオプションは？

A) `-run`
B) `-do`
C) `-exec`
D) `-command`

<details>
<summary>答えを見る</summary>

**正解: C) `-exec`**

`-exec コマンド {} \;` の形式で、見つけたファイルに対してコマンドを実行できます。

</details>

---

## 実技問題

### 実技1: ファイルを探す

```bash
# テスト用の構造を作成
mkdir -p ~/quiz-test/{src,docs}
touch ~/quiz-test/src/main.py
touch ~/quiz-test/src/utils.py
touch ~/quiz-test/docs/readme.md
```

`quiz-test` ディレクトリ内のすべての `.py` ファイルを探してください。

<details>
<summary>解答</summary>

```bash
find ~/quiz-test -name "*.py"
```

</details>

---

### 実技2: 文字列を検索

```bash
# テスト用ファイルを作成
cat > ~/quiz-test/src/main.py << 'EOF'
# TODO: implement main function
def main():
    print("Hello")
    # FIXME: add error handling
EOF
```

`main.py` からTODOを含む行を行番号付きで表示してください。

<details>
<summary>解答</summary>

```bash
grep -n "TODO" ~/quiz-test/src/main.py
```

</details>

---

### 実技3: 組み合わせ

`.py` ファイル内の `FIXME` を再帰的に検索してください。

<details>
<summary>解答</summary>

```bash
grep -r --include="*.py" "FIXME" ~/quiz-test/
```

または

```bash
find ~/quiz-test -name "*.py" -exec grep -l "FIXME" {} \;
```

</details>

---

### 実技4: クリーンアップ

```bash
rm -rf ~/quiz-test
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

## Step 4 完了！

おめでとうございます！
検索コマンドのスキルを習得しました。

### 習得したスキル

- [x] `find` でファイルを検索
- [x] `find` のオプション（-name, -type, -size, -mtime）
- [x] `grep` で文字列を検索
- [x] `grep` のオプション（-i, -n, -r, -C）
- [x] `find` と `grep` の組み合わせ

---

## 次のステップへ

Step 5では、ファイルのアクセス権限について学びます。

- 権限の読み方
- `chmod` で権限を変更
- 実行可能にする方法

セキュリティの基本となる重要な知識です！

---

*推定所要時間: 30分*
