# 作業環境を準備しよう

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 2
subStep: 1
title: "作業環境を準備しよう"
itemType: LESSON
estimatedMinutes: 45
noiseLevel: MINIMAL
roadmap:
  skill: "総合"
  category: "総合演習"
  target_level: "L0"
```

---

## ストーリー

> Day 1の朝。計画に従って、まずは環境構築から始める。
>
> 「月1で学んだターミナル操作の出番だ。プロジェクト用のフォルダを作ろう」
>
> キーボードに手を置く。9ヶ月前の自分なら、ターミナルを開くことすら怖かったかもしれない。
>
> でも今は違う。

---

## 必要なツールの確認

作業を始める前に、必要なツールが使えるか確認します。

### ツール一覧

| ツール | 用途 | 確認コマンド |
|--------|------|-------------|
| ターミナル | コマンド操作 | （起動するだけ） |
| Git | バージョン管理 | `git --version` |
| SQLite3 | データベース操作 | `sqlite3 --version` |
| ブラウザ | Webページの表示確認 | （起動するだけ） |
| テキストエディタ | ファイルの編集 | （VSCodeなど） |

### 確認手順

ターミナルを開いて、以下のコマンドを実行してください。

```bash
# Gitのバージョン確認
git --version

# SQLite3のバージョン確認
sqlite3 --version
```

両方ともバージョン番号が表示されればOKです。

<details>
<summary>ヒント: ツールがインストールされていない場合</summary>

**Git がない場合:**
```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt install git
```

**SQLite3 がない場合:**
```bash
# macOS（デフォルトで入っている場合が多い）
sqlite3 --version

# Ubuntu/Debian
sudo apt install sqlite3
```

</details>

---

## プロジェクトフォルダの作成（月1の復習）

### ディレクトリ構成

今回のプロジェクトのフォルダ構成を考えます。

```
~/projects/
  └── internal-tools-page/     # プロジェクトルート
      ├── index.html            # メインページ
      ├── style.css             # スタイルシート
      ├── data/                 # データ関連
      │   └── tools.db          # SQLiteデータベース
      ├── docs/                 # ドキュメント
      │   ├── daily/            # 日報
      │   └── report/           # 報告書
      ├── .gitignore            # Git除外ファイル
      └── README.md             # プロジェクト説明
```

### フォルダ作成の実行

```bash
# ホームディレクトリに移動
cd ~

# projectsフォルダがなければ作成
mkdir -p projects

# プロジェクトフォルダを作成
mkdir -p projects/internal-tools-page

# プロジェクトフォルダに移動
cd projects/internal-tools-page

# サブフォルダを作成
mkdir -p data
mkdir -p docs/daily
mkdir -p docs/report

# 構成を確認
ls -la
```

### 確認

```bash
# ディレクトリ構造を確認
find . -type d
```

期待される出力：
```
.
./data
./docs
./docs/daily
./docs/report
```

---

## .gitignore の作成

Gitで管理しないファイルを指定する `.gitignore` ファイルを作成します。

### 何を除外するか

| 除外対象 | 理由 |
|---------|------|
| `*.db` | データベースファイルはローカルで生成する |
| `.DS_Store` | macOSのシステムファイル |
| `Thumbs.db` | Windowsのシステムファイル |
| `*.swp` | Vimの一時ファイル |

### .gitignore の作成

以下の内容で `.gitignore` を作成してください。

```bash
cat > .gitignore << 'EOF'
# Database files
*.db

# OS generated files
.DS_Store
Thumbs.db

# Editor files
*.swp
*.swo
*~

# IDE
.vscode/
.idea/
EOF
```

### 確認

```bash
cat .gitignore
```

<details>
<summary>ヒント: なぜDBファイルを除外するのか</summary>

データベースファイル（`*.db`）はバイナリファイルです。Gitはテキストファイルの差分管理が得意ですが、バイナリファイルは差分が取れず、リポジトリサイズが大きくなります。

今回はSQLのCREATE TABLE文とINSERT文をファイルとして保存し、誰でもデータベースを再現できるようにします。

</details>

---

## 初期ファイルの作成

プロジェクトの骨格となるファイルを作成します。

### index.html（空のテンプレート）

```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>社内ツール紹介</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- TODO: コンテンツを追加する -->
</body>
</html>
EOF
```

### style.css（空のテンプレート）

```bash
cat > style.css << 'EOF'
/* 社内ツール紹介ページ スタイルシート */
/* TODO: スタイルを追加する */
EOF
```

### 確認

```bash
ls -la
```

期待される出力（一部）：
```
.gitignore
index.html
style.css
data/
docs/
```

---

## 環境構築チェックリスト

すべての項目を確認してください。

| # | チェック項目 | 状態 |
|---|-------------|------|
| 1 | Gitが使える | [ ] |
| 2 | SQLite3が使える | [ ] |
| 3 | プロジェクトフォルダが作成された | [ ] |
| 4 | サブフォルダ（data, docs）が作成された | [ ] |
| 5 | .gitignore が作成された | [ ] |
| 6 | index.html のテンプレートが作成された | [ ] |
| 7 | style.css のテンプレートが作成された | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ツール確認 | Git, SQLite3, ブラウザ, エディタ |
| フォルダ構成 | 用途ごとにサブフォルダを分ける |
| .gitignore | 管理不要なファイルを事前に除外 |
| テンプレート | 空のHTML/CSSファイルを準備 |

- [ ] 必要なツールがすべて使えることを確認した
- [ ] プロジェクトフォルダを作成した
- [ ] .gitignore を作成した
- [ ] 初期ファイルを作成した

---

## 次のステップへ

環境が整いました。

次のセクションでは、このプロジェクトフォルダをGitリポジトリとして初期化し、最初のコミットを行います。

---

*推定読了時間: 45分*
