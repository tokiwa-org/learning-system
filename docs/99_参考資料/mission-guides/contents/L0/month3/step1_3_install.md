# SQLiteをインストールしよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 1
subStep: 3
title: "SQLiteをインストールしよう"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「じゃあ実際にSQLiteで練習してみよう。インストールは簡単だよ」
>
> 「サーバーとか設定とか必要ですか？」
>
> 「SQLiteはファイル1つで動くから、そういうの一切不要。だから学習に最適なんだ」

---

## このセクションで学ぶこと

SQLiteをインストールし、最初の起動とSQL基本コマンドを確認します。

---

## なぜSQLiteなのか

| 特徴 | 説明 |
|------|------|
| **軽量** | ファイル1つで動く（サーバー不要） |
| **簡単** | インストールが数分で完了 |
| **無料** | 完全オープンソース |
| **互換性** | SQLの基本構文はMySQL、PostgreSQLとほぼ同じ |
| **実績** | Android、iOS、Chrome、Firefoxなど多くのソフトで採用 |

> SQLiteは世界で最も使われているデータベースエンジンです。
> スマートフォンには必ずSQLiteが入っています。

---

## まずはSQLiteが入っているか確認

ターミナルを開いて、以下のコマンドを実行してみましょう。

```bash
sqlite3 --version
```

### 出力例（インストール済みの場合）

```
3.43.2 2023-10-10 12:14:04
```

> バージョンが表示されれば、すでにSQLiteはインストールされています！
　「初期設定をしよう」のセクションまで飛ばしてOKです。

### 出力例（未インストールの場合）

```
sqlite3: command not found
```

> SQLiteがインストールされていません。以下の手順でインストールしましょう。

---

## Macの場合

### 方法1: すでにインストールされている（多くの場合）

macOSにはSQLiteがプリインストールされています。

```bash
sqlite3 --version
```

バージョンが表示されれば、追加作業は不要です。

### 方法2: Homebrewを使う（最新版にしたい場合）

```bash
brew install sqlite3
```

### インストール確認

```bash
sqlite3 --version
```

---

## Windowsの場合

### 方法1: 公式サイトからダウンロード（推奨）

1. 公式サイトにアクセス: https://www.sqlite.org/download.html
2. 「Precompiled Binaries for Windows」セクションから以下をダウンロード:
   - `sqlite-tools-win-x64-XXXXXXX.zip`
3. ZIPファイルを展開
4. 展開したフォルダを `C:\sqlite` に移動
5. 環境変数PATHに `C:\sqlite` を追加

### PATHの設定手順

1. 「スタートメニュー」→「設定」→「システム」→「バージョン情報」
2. 「システムの詳細設定」→「環境変数」
3. 「システム環境変数」の `Path` を選択し「編集」
4. 「新規」をクリックし `C:\sqlite` を追加
5. 「OK」で閉じる

### 方法2: Git Bashを使う

Git for Windowsをインストール済みの場合、Git BashからSQLiteが使える場合があります。

### インストール確認

コマンドプロンプトまたはPowerShellで：

```bash
sqlite3 --version
```

---

## Linuxの場合

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install sqlite3
```

### Fedora

```bash
sudo dnf install sqlite
```

### CentOS / RHEL

```bash
sudo yum install sqlite
```

### インストール確認

```bash
sqlite3 --version
```

---

## 初めてSQLiteを起動しよう

### 1. 練習用フォルダを作成

```bash
mkdir ~/db-practice
cd ~/db-practice
```

### 2. SQLiteを起動（練習用データベースを作成）

```bash
sqlite3 practice.db
```

### 出力例

```
SQLite version 3.43.2 2023-10-10 12:14:04
Enter ".help" for usage hints.
sqlite>
```

> `sqlite>` というプロンプトが表示されれば成功です！
> SQLiteの対話モードに入っています。

---

## SQLiteの基本コマンド

SQLiteには「ドットコマンド」と呼ばれる管理用のコマンドがあります。
これらはSQLとは別のSQLite専用コマンドです。

### よく使うドットコマンド

| コマンド | 説明 |
|----------|------|
| `.help` | ヘルプを表示 |
| `.tables` | テーブル一覧を表示 |
| `.schema` | テーブルの構造を表示 |
| `.headers on` | 結果にカラム名を表示する |
| `.mode column` | 結果をカラム形式で表示する |
| `.quit` | SQLiteを終了する |

### 試してみよう

```
sqlite> .help
```

> たくさんのコマンドが表示されます。全部覚える必要はありません。

```
sqlite> .tables
```

> まだテーブルを作っていないので、何も表示されません。

```
sqlite> .quit
```

> SQLiteが終了し、通常のターミナルに戻ります。

---

## 表示を見やすくする設定

SQLiteで結果を見やすく表示するために、起動後に以下を実行しましょう。

```
sqlite> .headers on
sqlite> .mode column
```

### 設定前

```
sqlite> SELECT 1, 'テスト';
1|テスト
```

### 設定後

```
sqlite> SELECT 1 AS id, 'テスト' AS name;
id  name
--  ------
1   テスト
```

> 毎回設定するのが面倒な場合は、ホームディレクトリに `.sqliterc` ファイルを作成できます：

```bash
echo ".headers on" >> ~/.sqliterc
echo ".mode column" >> ~/.sqliterc
```

---

## データベースファイルの確認

SQLiteのデータベースは1つのファイルです。

```bash
ls -la ~/db-practice/
```

出力例：
```
total 8
drwxr-xr-x  3 tanaka  staff   96  2  5 10:00 .
drwxr-xr-x 28 tanaka  staff  896  2  5 10:00 ..
-rw-r--r--  1 tanaka  staff    0  2  5 10:00 practice.db
```

> `practice.db` というファイルがデータベースの本体です。
> このファイルをコピーすればデータベースのバックアップができます。

---

## ハンズオン

以下を順番に実行して、SQLiteが正しく動作しているか確認しましょう。

### 1. SQLiteを起動

```bash
cd ~/db-practice
sqlite3 practice.db
```

> `sqlite>` プロンプトが表示されればOK

### 2. 表示設定

```
sqlite> .headers on
sqlite> .mode column
```

### 3. 簡単なSQLを実行

```
sqlite> SELECT 'Hello, Database!' AS message;
```

出力例：
```
message
----------------
Hello, Database!
```

> SQLが実行できました！

### 4. SQLiteを終了

```
sqlite> .quit
```

> ターミナルに戻ればOK

---

## よくあるトラブル

### 「sqlite3: command not found」が消えない（Mac）

ターミナルを再起動してみてください。それでもダメな場合はHomebrewでインストールしましょう。

### 「sqlite3: command not found」が消えない（Windows）

1. PATHの設定を確認してください
2. コマンドプロンプトを再起動してください
3. `C:\sqlite\sqlite3.exe` と直接パスを指定して起動を試みてください

### データベースファイルが見つからない

`sqlite3 practice.db` を実行したディレクトリにファイルが作成されます。
`pwd` コマンドで現在のディレクトリを確認してください。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| インストール確認 | `sqlite3 --version` |
| 起動 | `sqlite3 データベース名.db` |
| ヘルプ | `.help` |
| テーブル一覧 | `.tables` |
| 終了 | `.quit` |

### チェックリスト

- [ ] `sqlite3 --version` でバージョンが表示される
- [ ] `sqlite3 practice.db` で対話モードに入れる
- [ ] `.tables` でテーブル一覧が表示される（まだ空でOK）
- [ ] `.quit` で終了できる

---

## 次のステップへ

SQLiteのインストールと基本操作は完了しましたか？

次のセクションでは、テーブルの仕組みを詳しく学びます。
データ型やPRIMARY KEYなど、テーブル設計の基礎を理解しましょう。

---

*推定読了時間: 25分*
