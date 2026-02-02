# grepで文字列を検索

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 4
subStep: 3
title: "grepで文字列を検索"
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

> 「findはファイル名で探すんだよね。中身で探すには？」
>
> 「それが `grep` だよ。ファイルの中から特定の文字列を探し出せるんだ」
>
> 「エディタでCtrl+Fするみたいな感じですか？」
>
> 「そう！でもgrepは複数のファイルを一度に検索できるからもっと強力だよ」

---

## grepとは

`grep` = **Global Regular Expression Print** の略

ファイル内のテキストから、指定したパターンに一致する行を表示します。

---

## 基本的な使い方

### 構文

```bash
grep "検索文字列" ファイル名
```

### 例

```bash
grep "error" log.txt
```

→ log.txt の中で「error」を含む行を表示

---

## 準備: サンプルファイルを作る

```bash
cd ~/find-practice

# サンプルログファイルを作成
cat > project/app.log << 'EOF'
2026-01-27 09:00:01 INFO  Application started
2026-01-27 09:00:15 INFO  User login: admin
2026-01-27 09:01:02 WARN  Slow response: 2.5s
2026-01-27 09:01:30 ERROR Database connection failed
2026-01-27 09:02:00 INFO  Retry connection
2026-01-27 09:02:05 INFO  Connection restored
2026-01-27 09:03:00 ERROR File not found: /data/config.yml
2026-01-27 09:04:00 WARN  High memory usage: 85%
2026-01-27 09:05:00 INFO  User logout: admin
2026-01-27 09:06:00 INFO  Application shutdown
EOF

# サンプルコードを作成
cat > project/src/main.py << 'EOF'
#!/usr/bin/env python3
"""Main application module"""

def main():
    print("Hello, World!")

def helper():
    # TODO: implement this function
    pass

def process_data(data):
    # TODO: add error handling
    return data

if __name__ == "__main__":
    main()
EOF
```

---

## 実際にやってみよう

### 基本的な検索

```bash
# "ERROR"を含む行を検索
grep "ERROR" project/app.log
```

出力：
```
2026-01-27 09:01:30 ERROR Database connection failed
2026-01-27 09:03:00 ERROR File not found: /data/config.yml
```

### 別の例

```bash
# "User"を含む行を検索
grep "User" project/app.log
```

出力：
```
2026-01-27 09:00:15 INFO  User login: admin
2026-01-27 09:05:00 INFO  User logout: admin
```

---

## 複数のファイルを検索

### ワイルドカードを使う

```bash
# project配下のすべての.pyファイルを検索
grep "TODO" project/src/*.py
```

### 再帰的に検索（-r オプション）

```bash
# ディレクトリ以下を再帰的に検索
grep -r "TODO" project/
```

---

## 大文字小文字を区別しない（-i）

```bash
# error、ERROR、Error などすべてマッチ
grep -i "error" project/app.log
```

出力：
```
2026-01-27 09:01:30 ERROR Database connection failed
2026-01-27 09:03:00 ERROR File not found: /data/config.yml
```

---

## マッチしない行を表示（-v）

```bash
# INFOを含まない行を表示
grep -v "INFO" project/app.log
```

出力：
```
2026-01-27 09:01:02 WARN  Slow response: 2.5s
2026-01-27 09:01:30 ERROR Database connection failed
2026-01-27 09:03:00 ERROR File not found: /data/config.yml
2026-01-27 09:04:00 WARN  High memory usage: 85%
```

---

## 行番号を表示（-n）

```bash
grep -n "ERROR" project/app.log
```

出力：
```
4:2026-01-27 09:01:30 ERROR Database connection failed
7:2026-01-27 09:03:00 ERROR File not found: /data/config.yml
```

行番号が分かると、エディタで該当箇所に素早くジャンプできます。

---

## マッチ数を数える（-c）

```bash
grep -c "ERROR" project/app.log
```

出力：
```
2
```

---

## ファイル名のみを表示（-l）

```bash
# TODOを含むファイル名だけを表示
grep -l "TODO" project/src/*.py
```

出力：
```
project/src/main.py
```

---

## grepとパイプの組み合わせ

### 他のコマンドの出力を検索

```bash
# lsの結果から.pyファイルだけを表示
ls project/src | grep ".py"
```

### psの結果を検索

```bash
# 実行中のプロセスを検索
ps aux | grep "python"
```

---

## ハンズオン

```bash
# 1. ERRORを含む行を検索
grep "ERROR" project/app.log

# 2. 大文字小文字を区別せずに検索
grep -i "warn" project/app.log

# 3. 行番号付きで検索
grep -n "INFO" project/app.log

# 4. マッチ数を数える
grep -c "INFO" project/app.log

# 5. INFOを含まない行を表示
grep -v "INFO" project/app.log

# 6. 再帰的にTODOを検索
grep -r "TODO" project/

# 7. lsの結果をgrepでフィルタ
ls -la project/ | grep "^d"  # ディレクトリだけ表示
```

---

## よくある使い方

### ログファイルでエラーを探す

```bash
grep "ERROR" application.log
```

### ソースコードでTODOを探す

```bash
grep -r "TODO" src/
```

### 設定ファイルで特定の設定を探す

```bash
grep "port" config.yml
```

### 履歴から特定のコマンドを探す

```bash
history | grep "git"
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `grep "パターン" ファイル` | 基本的な検索 |
| `grep -i` | 大文字小文字を区別しない |
| `grep -v` | マッチしない行を表示 |
| `grep -n` | 行番号を表示 |
| `grep -c` | マッチ数を数える |
| `grep -l` | ファイル名のみ表示 |
| `grep -r` | 再帰的に検索 |

### grepの強力な点

- 複数ファイルを一度に検索
- パイプで他のコマンドと連携
- オプションで出力を柔軟に調整

### チェックリスト

- [ ] `grep` で文字列を検索できた
- [ ] `-i` で大文字小文字を無視できた
- [ ] `-n` で行番号を表示できた
- [ ] パイプと組み合わせて使えた

---

## 次のステップへ

grepの基本はマスターできましたか？

次のセクションでは、grepのより高度なオプションを学びます。
前後の行を表示したり、正規表現を使ったりできるようになります！

---

*推定読了時間: 30分*
