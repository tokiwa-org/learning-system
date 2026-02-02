# chmodで権限を変更

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 5
subStep: 2
title: "chmodで権限を変更"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "OS基本コマンド"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「スクリプトを作ったけど、実行できないんです」
>
> 「実行権限がないからだね。`chmod` で権限を追加しよう」
>
> 「チェンジモード...権限を変えるってことですね」
>
> 「そう！2つの指定方法があるから、両方覚えておくと便利だよ」

---

## chmodとは

`chmod` = **Change Mode**（モード変更）

ファイルやディレクトリの権限を変更するコマンドです。

---

## 準備

```bash
cd ~/permission-practice

# サンプルファイルを作成
echo "Hello World" > hello.txt
cat > script.sh << 'EOF'
#!/bin/bash
echo "Hello from script!"
EOF

# 現在の権限を確認
ls -l
```

---

## 方法1: 数字で指定

### 構文

```bash
chmod 数字3桁 ファイル名
```

### 例

```bash
# 644 = rw-r--r--
chmod 644 hello.txt

# 755 = rwxr-xr-x
chmod 755 script.sh

# 確認
ls -l
```

### よく使う数字

| 数字 | 権限 | 用途 |
|------|------|------|
| 644 | `rw-r--r--` | 通常のファイル |
| 755 | `rwxr-xr-x` | 実行可能ファイル |
| 700 | `rwx------` | 所有者専用 |
| 600 | `rw-------` | 秘密のファイル |

---

## 方法2: 記号で指定

### 構文

```bash
chmod [誰][操作][権限] ファイル名
```

### 誰（Who）

| 記号 | 意味 |
|------|------|
| `u` | User（所有者） |
| `g` | Group（グループ） |
| `o` | Other（その他） |
| `a` | All（全員） |

### 操作

| 記号 | 意味 |
|------|------|
| `+` | 権限を追加 |
| `-` | 権限を削除 |
| `=` | 権限を設定 |

### 権限

| 記号 | 意味 |
|------|------|
| `r` | 読み取り |
| `w` | 書き込み |
| `x` | 実行 |

---

## 記号での例

### 実行権限を追加

```bash
# 所有者に実行権限を追加
chmod u+x script.sh

# 確認
ls -l script.sh
```

### 書き込み権限を削除

```bash
# グループとその他から書き込み権限を削除
chmod go-w hello.txt

# 確認
ls -l hello.txt
```

### 全員に読み取り権限

```bash
# 全員に読み取り権限を追加
chmod a+r hello.txt
```

### 権限をリセット

```bash
# 所有者の権限をrwxに設定
chmod u=rwx script.sh

# グループとその他をr-xに設定
chmod go=rx script.sh
```

---

## 実践：スクリプトを実行可能にする

### Step 1: スクリプトを確認

```bash
cat script.sh
ls -l script.sh
```

### Step 2: 実行してみる（失敗）

```bash
./script.sh
# Permission denied が出る
```

### Step 3: 実行権限を追加

```bash
chmod +x script.sh
# または
chmod 755 script.sh
```

### Step 4: 再度実行

```bash
./script.sh
# Hello from script! と表示される
```

---

## 複数の権限を同時に変更

### カンマ区切りで指定

```bash
# 所有者にrwx、グループにrx、その他にrを設定
chmod u=rwx,g=rx,o=r hello.txt
```

### 数字で指定（こちらが簡単）

```bash
chmod 754 hello.txt
```

---

## ディレクトリの権限

### ディレクトリには実行権限が必要

ディレクトリに入る（`cd`する）には `x` 権限が必要です。

```bash
# ディレクトリを作成
mkdir testdir

# 実行権限を削除
chmod -x testdir

# 入れない
cd testdir
# Permission denied

# 実行権限を追加
chmod +x testdir

# 入れる
cd testdir
```

---

## 再帰的に変更（-R）

ディレクトリ内のすべてのファイルに適用します。

```bash
# ディレクトリと中身すべてを755に
chmod -R 755 directory/
```

**注意**: ファイルに755（実行権限付き）を設定すると、すべてが実行可能になってしまいます。通常はファイルとディレクトリで異なる権限が必要です。

---

## よくある使用場面

### シェルスクリプトを実行可能に

```bash
chmod +x deploy.sh
./deploy.sh
```

### SSH鍵を保護

```bash
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 700 ~/.ssh
```

### Webサーバーの設定

```bash
# HTMLファイル: 誰でも読める
chmod 644 index.html

# CGIスクリプト: 実行可能
chmod 755 script.cgi

# 設定ファイル: 所有者のみ
chmod 600 config.php
```

---

## 権限エラーの対処

### "Permission denied" が出たら

1. `ls -l` で現在の権限を確認
2. 必要な権限を特定
3. `chmod` で権限を追加

```bash
# 例: スクリプトが実行できない
ls -l script.sh
# -rw-r--r-- → 実行権限がない

chmod +x script.sh
./script.sh
# 実行できる
```

---

## ハンズオン

```bash
cd ~/permission-practice

# 1. 新しいファイルを作成
echo "test" > test.txt
cat > test.sh << 'EOF'
#!/bin/bash
echo "Test script"
EOF

# 2. 権限を確認
ls -l test.txt test.sh

# 3. 数字で権限を変更
chmod 644 test.txt
chmod 755 test.sh
ls -l test.txt test.sh

# 4. 記号で権限を変更
chmod go-r test.txt  # グループとその他から読み取り権限を削除
ls -l test.txt

# 5. スクリプトを実行
./test.sh

# 6. 実行権限を削除して再実行
chmod -x test.sh
./test.sh  # Permission denied
chmod +x test.sh
./test.sh  # 成功
```

---

## まとめ

### 数字での指定

| コマンド | 結果 |
|----------|------|
| `chmod 644 file` | rw-r--r-- |
| `chmod 755 file` | rwxr-xr-x |
| `chmod 700 file` | rwx------ |
| `chmod 600 file` | rw------- |

### 記号での指定

| コマンド | 意味 |
|----------|------|
| `chmod +x file` | 実行権限を追加 |
| `chmod -w file` | 書き込み権限を削除 |
| `chmod u=rwx file` | 所有者をrwxに |
| `chmod go-r file` | グループ・その他から読み取りを削除 |

### チェックリスト

- [ ] 数字で権限を変更できた（chmod 755）
- [ ] 記号で権限を変更できた（chmod +x）
- [ ] スクリプトを実行可能にできた
- [ ] 権限エラーに対処できた

---

## 次のステップへ

chmodをマスターできましたか？

次のセクションでは、権限に関する演習問題に挑戦します。
実際のシナリオで権限を設定してみましょう！

---

*推定読了時間: 30分*
