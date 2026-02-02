# findでファイルを探す

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 4
subStep: 1
title: "findでファイルを探す"
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

> 「プロジェクトのファイルがどこにあるか分からなくなることってない？」
>
> 「あります！どこに保存したっけ...ってなります」
>
> 「そんな時に使うのが `find` コマンドだよ。ファイル名やフォルダ名で検索できるんだ」
>
> 「パソコンの検索機能みたいですね」

---

## findとは

`find` = **ファイルやディレクトリを検索**するコマンド

指定したディレクトリ以下を再帰的に探索し、条件に合うファイルを見つけます。

---

## 基本的な使い方

### 構文

```bash
find 検索開始パス -name "ファイル名"
```

### 例

```bash
find . -name "readme.txt"
```

- `.` = 現在のディレクトリから検索開始
- `-name` = ファイル名で検索
- `"readme.txt"` = 検索するファイル名

---

## 準備: サンプル環境を作る

```bash
cd ~
mkdir -p find-practice/project/{src,docs,tests}
cd find-practice

# サンプルファイルを作成
touch project/README.md
touch project/src/main.py
touch project/src/utils.py
touch project/src/config.json
touch project/docs/guide.md
touch project/docs/api.md
touch project/tests/test_main.py
touch project/tests/test_utils.py

# 確認
find project -type f
```

---

## 実際にやってみよう

### ファイル名で検索

```bash
# README.mdを探す
find project -name "README.md"
```

出力：
```
project/README.md
```

### 複数のファイルを検索（ワイルドカード）

```bash
# .pyファイルをすべて探す
find project -name "*.py"
```

出力：
```
project/src/main.py
project/src/utils.py
project/tests/test_main.py
project/tests/test_utils.py
```

### .mdファイルを検索

```bash
find project -name "*.md"
```

出力：
```
project/README.md
project/docs/guide.md
project/docs/api.md
```

---

## 検索開始パスの指定

### カレントディレクトリから

```bash
find . -name "*.py"
```

### 特定のディレクトリから

```bash
find project/src -name "*.py"
```

### ホームディレクトリから

```bash
find ~ -name "*.txt"
```

### ルートから（注意：時間がかかる）

```bash
find / -name "filename" 2>/dev/null
```

`2>/dev/null` でエラーメッセージ（権限エラーなど）を非表示にします。

---

## 大文字小文字を区別しない検索

### -iname オプション

```bash
# README.md、readme.md、Readme.md などすべてマッチ
find project -iname "readme.md"
```

---

## ディレクトリだけを検索

### -type d オプション

```bash
# ディレクトリだけを検索
find project -type d
```

出力：
```
project
project/src
project/docs
project/tests
```

---

## ファイルだけを検索

### -type f オプション

```bash
# ファイルだけを検索
find project -type f
```

---

## ハンズオン

```bash
# 1. 練習用フォルダに移動
cd ~/find-practice

# 2. すべての.pyファイルを探す
find project -name "*.py"

# 3. すべての.mdファイルを探す
find project -name "*.md"

# 4. testsディレクトリ内だけを検索
find project/tests -name "*.py"

# 5. ディレクトリだけを表示
find project -type d

# 6. ファイルだけを表示
find project -type f
```

---

## findの便利な点

### 再帰的に検索

`find` はサブディレクトリの中も自動的に検索します。

```bash
# project配下のすべての階層を検索
find project -name "*.py"
```

### ワイルドカードが使える

| パターン | 意味 |
|----------|------|
| `*.py` | .pyで終わるファイル |
| `test_*` | test_で始まるファイル |
| `*config*` | configを含むファイル |

---

## よくあるエラーと対処法

### "Permission denied" が大量に出る

```bash
# エラーを非表示にする
find / -name "filename" 2>/dev/null
```

### 「そのようなファイルはありません」

- 検索開始パスが存在するか確認
- ファイル名のスペルを確認

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `find . -name "*.txt"` | カレントから.txtを検索 |
| `find . -iname "*.txt"` | 大文字小文字を区別しない |
| `find . -type d` | ディレクトリだけを検索 |
| `find . -type f` | ファイルだけを検索 |

### チェックリスト

- [ ] `find` で特定のファイルを探せた
- [ ] ワイルドカード `*.py` を使えた
- [ ] `-type d` と `-type f` の違いを理解した

---

## 次のステップへ

findの基本はマスターできましたか？

次のセクションでは、findのさらに便利なオプションを学びます。
ファイルサイズや更新日時での検索など、より高度な条件指定ができるようになります！

---

*推定読了時間: 30分*
