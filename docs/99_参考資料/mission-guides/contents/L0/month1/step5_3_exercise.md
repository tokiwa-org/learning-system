# 演習：権限を設定しよう

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 5
subStep: 3
title: "演習：権限を設定しよう"
itemType: EXERCISE
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "OS基本コマンド"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「権限の読み方と変更方法は分かった？」
>
> 「はい、`rwx` と数字の対応も理解できました」
>
> 「じゃあ、実際のシナリオで練習してみよう！」

---

## 準備：演習環境の作成

```bash
cd ~
rm -rf permission-exercise
mkdir -p permission-exercise/{scripts,configs,logs,secrets}
cd permission-exercise

# 各種ファイルを作成
cat > scripts/deploy.sh << 'EOF'
#!/bin/bash
echo "Deploying application..."
echo "Deploy complete!"
EOF

cat > scripts/backup.sh << 'EOF'
#!/bin/bash
echo "Starting backup..."
echo "Backup complete!"
EOF

cat > configs/app.conf << 'EOF'
# Application Configuration
DEBUG=false
PORT=8080
EOF

cat > configs/database.yml << 'EOF'
development:
  host: localhost
  port: 5432
EOF

echo "Application started at $(date)" > logs/app.log
echo "API_KEY=secret123" > secrets/api.key
echo "DB_PASSWORD=dbpass456" > secrets/db.credentials

echo "演習環境を作成しました"
ls -la
```

---

## Mission 1: 権限を読み取る

### タスク 1-1: 現在の権限を確認

各ファイルの権限を確認してください。

```bash
ls -l scripts/
ls -l configs/
ls -l secrets/
```

<details>
<summary>確認ポイント</summary>

- 新しく作成したファイルのデフォルト権限は？
- スクリプトファイルに実行権限はある？
- 秘密ファイルは誰でも読める状態？

</details>

---

### タスク 1-2: 権限を日本語で説明

`-rw-r--r--` をそれぞれの立場で説明してください。

<details>
<summary>解答</summary>

- **所有者 (rw-)**: 読み取りと書き込みができる
- **グループ (r--)**: 読み取りのみ可能
- **その他 (r--)**: 読み取りのみ可能

</details>

---

## Mission 2: スクリプトを実行可能に

### タスク 2-1: deploy.sh を実行してみる

```bash
./scripts/deploy.sh
```

<details>
<summary>予想される結果</summary>

```
bash: ./scripts/deploy.sh: Permission denied
```

実行権限がないため、実行できません。

</details>

---

### タスク 2-2: 実行権限を追加

deploy.sh に実行権限を追加してください。

<details>
<summary>ヒント</summary>

2つの方法があります：
1. `chmod +x`
2. `chmod 755`

</details>

<details>
<summary>解答</summary>

```bash
chmod +x scripts/deploy.sh
# または
chmod 755 scripts/deploy.sh
```

</details>

---

### タスク 2-3: 実行を確認

```bash
./scripts/deploy.sh
```

「Deploying application...」と表示されれば成功です！

---

### タスク 2-4: backup.sh も同様に

backup.sh にも実行権限を追加して、実行できることを確認してください。

<details>
<summary>解答</summary>

```bash
chmod +x scripts/backup.sh
./scripts/backup.sh
```

</details>

---

## Mission 3: 秘密ファイルを保護

### タスク 3-1: 現在の状態を確認

```bash
ls -l secrets/
```

誰でも読める状態になっていませんか？

---

### タスク 3-2: 所有者のみ読み書き可能に

secrets/ 内のファイルを所有者のみがアクセスできるように変更してください。

<details>
<summary>ヒント</summary>

権限を `600` (rw-------)  に設定します。

</details>

<details>
<summary>解答</summary>

```bash
chmod 600 secrets/api.key
chmod 600 secrets/db.credentials
```

または一括で：

```bash
chmod 600 secrets/*
```

</details>

---

### タスク 3-3: 権限を確認

```bash
ls -l secrets/
```

`-rw-------` になっていれば成功です！

---

## Mission 4: 設定ファイルを適切に保護

### タスク 4-1: 設定ファイルの権限を設定

configs/ 内のファイルを以下の権限に設定してください：
- 所有者: 読み書き可能
- グループ: 読み取りのみ
- その他: 権限なし

<details>
<summary>ヒント</summary>

権限は `640` (rw-r-----) です。

</details>

<details>
<summary>解答</summary>

```bash
chmod 640 configs/app.conf
chmod 640 configs/database.yml
```

または：

```bash
chmod 640 configs/*
```

</details>

---

### タスク 4-2: 確認

```bash
ls -l configs/
```

`-rw-r-----` になっていれば成功！

---

## Mission 5: ログファイルの設定

### タスク 5-1: ログファイルの権限

logs/app.log を以下の権限に設定してください：
- 所有者: 読み書き可能
- グループ: 読み取りのみ
- その他: 読み取りのみ

<details>
<summary>解答</summary>

```bash
chmod 644 logs/app.log
```

</details>

---

## Mission 6: 権限の問題を診断

### タスク 6-1: 問題のあるディレクトリ

```bash
mkdir problem-dir
chmod 000 problem-dir
```

このディレクトリにはどんな問題がありますか？

<details>
<summary>解答</summary>

```bash
ls problem-dir/    # Permission denied
cd problem-dir/    # Permission denied
```

権限が `000` なので、誰も（所有者でさえも）アクセスできません。

</details>

---

### タスク 6-2: 問題を修正

problem-dir にアクセスできるように修正してください。

<details>
<summary>解答</summary>

```bash
chmod 755 problem-dir
# または
chmod u+rwx problem-dir
```

</details>

---

## Mission 7: 総合問題

### タスク 7-1: プロジェクト構成を完成

以下の権限設定を完成させてください：

| ファイル/ディレクトリ | 権限 | 説明 |
|----------------------|------|------|
| scripts/ | 755 | ディレクトリは入れるように |
| scripts/*.sh | 755 | スクリプトは実行可能 |
| configs/ | 750 | グループまで読み取り可能 |
| configs/* | 640 | 設定ファイルは保護 |
| logs/ | 755 | ログディレクトリ |
| logs/* | 644 | ログは読み取り可能 |
| secrets/ | 700 | 所有者のみアクセス可能 |
| secrets/* | 600 | 秘密ファイルは厳重保護 |

<details>
<summary>解答</summary>

```bash
# scripts
chmod 755 scripts
chmod 755 scripts/*.sh

# configs
chmod 750 configs
chmod 640 configs/*

# logs
chmod 755 logs
chmod 644 logs/*

# secrets
chmod 700 secrets
chmod 600 secrets/*

# 確認
ls -la
ls -l scripts/
ls -l configs/
ls -l logs/
ls -l secrets/
```

</details>

---

## 達成度チェック

| Mission | タスク | 完了 |
|---------|--------|------|
| 1 | 権限を読み取る | [ ] |
| 2 | スクリプトを実行可能に | [ ] |
| 3 | 秘密ファイルを保護（600） | [ ] |
| 4 | 設定ファイルを保護（640） | [ ] |
| 5 | ログファイルを設定（644） | [ ] |
| 6 | 権限の問題を診断 | [ ] |
| 7 | 総合問題を完成 | [ ] |

**5個以上クリア** → 合格！

---

## クリーンアップ

```bash
cd ~
rm -rf permission-exercise
rm -rf permission-practice
```

---

## まとめ

### よく使う権限設定

| 対象 | 推奨権限 | 理由 |
|------|----------|------|
| 通常のファイル | 644 | 誰でも読めるが、編集は所有者のみ |
| 実行スクリプト | 755 | 誰でも実行できる |
| 秘密ファイル | 600 | 所有者のみアクセス可能 |
| SSH鍵 | 600 | セキュリティ要件 |
| ディレクトリ | 755 | 誰でも中に入れる |
| 秘密ディレクトリ | 700 | 所有者のみ入れる |

---

## 次のステップへ

権限設定の演習お疲れさまでした！

次のセクションでは、Step 5の理解度チェックです。
クイズに挑戦して、学んだことを振り返りましょう！

---

*推定所要時間: 30分*
