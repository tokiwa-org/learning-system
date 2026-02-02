# findのオプション

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 4
subStep: 2
title: "findのオプション"
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

> 「findでファイル名以外でも検索できるの？」
>
> 「もちろん！サイズとか更新日時とか、いろんな条件で探せるよ」
>
> 「それは便利そうですね」
>
> 「さらに、見つけたファイルに対してコマンドを実行することもできるんだ」

---

## サイズで検索

### 指定サイズより大きいファイル

```bash
find . -size +10M
```

- `+10M` = 10MBより大きい

### 指定サイズより小さいファイル

```bash
find . -size -1k
```

- `-1k` = 1KB未満

### サイズの単位

| 単位 | 意味 |
|------|------|
| `c` | バイト |
| `k` | キロバイト |
| `M` | メガバイト |
| `G` | ギガバイト |

---

## 準備: サンプルファイルを作る

```bash
cd ~/find-practice

# 異なるサイズのファイルを作成
dd if=/dev/zero of=project/small.txt bs=100 count=1 2>/dev/null
dd if=/dev/zero of=project/medium.txt bs=1024 count=10 2>/dev/null
dd if=/dev/zero of=project/large.txt bs=1024 count=100 2>/dev/null

# サイズを確認
ls -lh project/*.txt
```

---

## サイズで検索してみよう

```bash
# 5KB以上のファイル
find project -size +5k

# 5KB未満のファイル
find project -size -5k
```

---

## 更新日時で検索

### N日以内に変更されたファイル

```bash
find . -mtime -7
```

- `-mtime -7` = 7日以内に変更

### N日より前に変更されたファイル

```bash
find . -mtime +30
```

- `-mtime +30` = 30日より前に変更

### 分単位で指定

```bash
find . -mmin -60
```

- `-mmin -60` = 60分以内に変更

---

## 複数条件の組み合わせ

### AND条件（両方満たす）

```bash
# .pyファイルで、1日以内に更新されたもの
find project -name "*.py" -mtime -1
```

### OR条件（どちらか満たす）

```bash
# .pyまたは.mdファイル
find project -name "*.py" -o -name "*.md"
```

### NOT条件（除外）

```bash
# .pyファイル以外
find project -type f ! -name "*.py"
```

---

## 検索結果に対してコマンドを実行

### -exec オプション

```bash
find project -name "*.txt" -exec ls -l {} \;
```

- `{}` = 見つかったファイル名が入る
- `\;` = コマンドの終わり

### 例：見つけたファイルの内容を表示

```bash
find project -name "*.md" -exec cat {} \;
```

### 例：見つけたファイルを削除（注意！）

```bash
# 確認してから削除
find project -name "*.tmp" -exec rm {} \;
```

---

## 検索深度の制限

### 1階層だけ検索

```bash
find project -maxdepth 1 -name "*.md"
```

### 2階層まで検索

```bash
find project -maxdepth 2 -name "*.py"
```

---

## 空のファイル・ディレクトリを検索

### 空のファイル

```bash
# 空ファイルを作成
touch project/empty.txt

# 検索
find project -type f -empty
```

### 空のディレクトリ

```bash
# 空ディレクトリを作成
mkdir project/empty_dir

# 検索
find project -type d -empty
```

---

## 実践的な使用例

### 1. 古いログファイルを探す

```bash
find /var/log -name "*.log" -mtime +30
```

### 2. 大きなファイルを探す

```bash
find ~ -size +100M 2>/dev/null
```

### 3. 特定の拡張子を持つ最近のファイル

```bash
find project -name "*.py" -mtime -1
```

### 4. バックアップファイルを削除

```bash
find project -name "*~" -type f -delete
```

または

```bash
find project -name "*.bak" -exec rm {} \;
```

---

## ハンズオン

```bash
# 1. 5KB以上のファイルを探す
find project -size +5k

# 2. .py以外のファイルを探す
find project -type f ! -name "*.py"

# 3. ファイルの詳細情報を表示
find project -name "*.md" -exec ls -l {} \;

# 4. 空のファイルを探す
find project -type f -empty

# 5. 1階層だけ検索
find project -maxdepth 1 -type f

# 6. 複数の拡張子を検索
find project -name "*.py" -o -name "*.md"
```

---

## findオプション早見表

| オプション | 説明 | 例 |
|------------|------|-----|
| `-name` | ファイル名（大文字小文字区別） | `-name "*.py"` |
| `-iname` | ファイル名（区別しない） | `-iname "readme*"` |
| `-type f` | ファイルのみ | |
| `-type d` | ディレクトリのみ | |
| `-size +N` | Nより大きい | `-size +10M` |
| `-size -N` | Nより小さい | `-size -1k` |
| `-mtime -N` | N日以内に変更 | `-mtime -7` |
| `-mtime +N` | N日より前に変更 | `-mtime +30` |
| `-maxdepth N` | N階層まで | `-maxdepth 2` |
| `-empty` | 空のファイル/ディレクトリ | |
| `-exec CMD {} \;` | コマンドを実行 | `-exec rm {} \;` |
| `!` | 否定（NOT） | `! -name "*.py"` |
| `-o` | または（OR） | `-name "*.py" -o -name "*.md"` |

---

## まとめ

| 使いたい場面 | コマンド例 |
|--------------|------------|
| 大きなファイルを探す | `find . -size +100M` |
| 最近更新されたファイル | `find . -mtime -1` |
| 複数条件で絞り込む | `find . -name "*.log" -mtime +7` |
| 見つけたファイルを処理 | `find . -name "*.tmp" -exec rm {} \;` |

### チェックリスト

- [ ] サイズで検索できた
- [ ] 更新日時で検索できた
- [ ] `-exec` でコマンドを実行できた
- [ ] 複数条件を組み合わせられた

---

## 次のステップへ

findのオプションをマスターしましたか？

次のセクションでは `grep` コマンドを学びます。
ファイルの「中身」を検索する強力なツールです！

---

*推定読了時間: 30分*
