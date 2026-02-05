# 演習：手順書とREADMEを作成しよう

## メタ情報

```yaml
mission: "ドキュメントを書く力を身につけよう"
step: 4
subStep: 5
title: "演習：手順書とREADMEを作成しよう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "技術ドキュメンテーション"
  category: "ヒューマンスキル"
  target_level: "L0"
```

---

## ストーリー

> 「手順書とREADMEの書き方は学んだね。じゃあ実際に書いてみよう」
>
> 「架空のプロジェクトですか？」
>
> 「そう。『ToDoアプリ』というシンプルなプロジェクトを題材にして、ドキュメントを一式作ってもらうよ」
>
> 「やってみます！」

---

## ミッション概要

架空の「ToDoアプリ」プロジェクトのドキュメントを作成します。

| Part | 内容 | 目安時間 |
|------|------|---------|
| Part 1 | READMEを作成する | 30分 |
| Part 2 | 開発環境セットアップ手順書を作成する | 30分 |
| Part 3 | デプロイ手順書を作成する | 30分 |

### 達成条件

- [ ] Part 1: README.mdを作成できた
- [ ] Part 2: setup.mdを作成できた
- [ ] Part 3: deploy.mdを作成できた

---

## 前提：ToDoアプリの情報

以下の情報をもとにドキュメントを作成してください。

```
プロジェクト名: TaskFlow
概要: シンプルで使いやすいタスク管理Webアプリ

技術スタック:
- フロントエンド: React 18
- バックエンド: Node.js 18 + Express
- データベース: PostgreSQL 14
- パッケージマネージャー: npm

機能:
- タスクの追加・編集・削除
- タスクの完了/未完了切り替え
- カテゴリ別のタスク表示
- タスクの期限設定

リポジトリ: https://github.com/example/taskflow

動作要件:
- Node.js 18.0.0以上
- PostgreSQL 14以上
- npm 9.0.0以上

環境変数:
- DATABASE_URL: PostgreSQLの接続URL
- PORT: サーバーのポート番号（デフォルト: 3000）
- NODE_ENV: 実行環境（development/production）

開発コマンド:
- npm install: 依存パッケージのインストール
- npm run dev: 開発サーバーの起動
- npm run build: 本番ビルド
- npm run test: テストの実行
- npm run lint: コードチェック

デプロイ先: AWS EC2
デプロイ方法: SSH接続してgit pullとnpm run build
```

---

## Part 1: READMEを作成する（30分）

### タスク 1-1: README.mdを作成

上記の情報をもとに、README.mdを作成してください。

以下の項目を含めること:
- プロジェクト名と概要
- 機能一覧
- 動作要件
- クイックスタート（インストールから起動まで）
- 環境変数の設定
- 開発コマンド一覧
- ドキュメントへのリンク

<details>
<summary>解答例</summary>

```markdown
# TaskFlow

シンプルで使いやすいタスク管理Webアプリケーション。

## 機能

- タスクの追加・編集・削除
- タスクの完了/未完了切り替え
- カテゴリ別のタスク表示
- タスクの期限設定

## 動作要件

- Node.js 18.0.0以上
- PostgreSQL 14以上
- npm 9.0.0以上

## クイックスタート

### 1. リポジトリをクローン

```bash
git clone https://github.com/example/taskflow.git
cd taskflow
```

### 2. 依存パッケージをインストール

```bash
npm install
```

### 3. 環境変数を設定

`.env.example` をコピーして `.env` を作成:

```bash
cp .env.example .env
```

`.env` を編集:

```
DATABASE_URL=postgresql://localhost:5432/taskflow
PORT=3000
NODE_ENV=development
```

### 4. データベースをセットアップ

```bash
npm run db:setup
```

### 5. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

## 開発コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番ビルドを作成 |
| `npm run test` | テストを実行 |
| `npm run lint` | コードをチェック |

## 環境変数

| 変数名 | 説明 | デフォルト |
|--------|------|-----------|
| `DATABASE_URL` | PostgreSQLの接続URL | - |
| `PORT` | サーバーのポート番号 | 3000 |
| `NODE_ENV` | 実行環境 | development |

## ドキュメント

- [開発環境セットアップ](./docs/setup.md)
- [デプロイ手順](./docs/deploy.md)

## 技術スタック

- **フロントエンド**: React 18
- **バックエンド**: Node.js 18 + Express
- **データベース**: PostgreSQL 14

## ライセンス

MIT License
```

</details>

---

## Part 2: 開発環境セットアップ手順書を作成する（30分）

### タスク 2-1: setup.mdを作成

詳細な開発環境セットアップ手順書を作成してください。

以下の項目を含めること:
- 概要
- 前提条件（詳細なバージョン確認方法を含む）
- 作業時間の目安
- 手順（各ステップに確認ポイントを含む）
- トラブルシューティング
- 完了確認

<details>
<summary>解答例</summary>

```markdown
# 開発環境セットアップ手順書

## 概要

TaskFlowの開発環境をローカルマシンにセットアップするための手順です。

## 前提条件

以下がインストールされていることを確認してください。

### Node.js 18以上

```bash
node --version
```

出力例: `v18.17.0`

※ 18未満の場合は https://nodejs.org/ からインストール

### npm 9以上

```bash
npm --version
```

出力例: `9.6.7`

### PostgreSQL 14以上

```bash
psql --version
```

出力例: `psql (PostgreSQL) 14.8`

※ インストールされていない場合は https://www.postgresql.org/download/ を参照

### Git

```bash
git --version
```

出力例: `git version 2.39.0`

## 作業時間の目安

約20分（ネットワーク環境による）

## 手順

### 1. リポジトリをクローンする

```bash
git clone https://github.com/example/taskflow.git
cd taskflow
```

【確認】taskflowディレクトリが作成されていること

```bash
ls -la
```

### 2. 依存パッケージをインストールする

```bash
npm install
```

【確認】エラーなく完了し、node_modulesディレクトリが作成されること

```bash
ls node_modules
```

### 3. 環境変数ファイルを作成する

```bash
cp .env.example .env
```

【確認】.envファイルが作成されていること

```bash
ls -la .env
```

### 4. 環境変数を設定する

`.env` ファイルを開き、以下の値を設定:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskflow_dev
PORT=3000
NODE_ENV=development
```

> **Note**: `password` の部分は、PostgreSQLインストール時に設定したパスワードに置き換えてください。

### 5. データベースを作成する

PostgreSQLにログイン:

```bash
psql -U postgres
```

データベースを作成:

```sql
CREATE DATABASE taskflow_dev;
\q
```

【確認】データベースが作成されたことを確認

```bash
psql -U postgres -c "\l" | grep taskflow_dev
```

### 6. データベースをセットアップする

```bash
npm run db:setup
```

【確認】以下のメッセージが表示されること

```
Database setup completed successfully.
```

### 7. 開発サーバーを起動する

```bash
npm run dev
```

【確認】以下のメッセージが表示されること

```
Server started on http://localhost:3000
```

### 8. ブラウザで動作確認する

ブラウザで http://localhost:3000 を開く

【確認】TaskFlowのトップページが表示されること

## 完了確認

- [ ] 開発サーバーが起動している
- [ ] ブラウザでトップページが表示される
- [ ] タスクの追加ができる

## トラブルシューティング

### npm install でエラーが出る

**症状**: `EACCES: permission denied` が表示される

**原因**: npmのグローバルディレクトリの権限問題

**対処**:
```bash
sudo chown -R $(whoami) ~/.npm
npm install
```

### データベース接続エラー

**症状**: `ECONNREFUSED` が表示される

**原因**: PostgreSQLが起動していない

**対処**:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### ポート3000が使用中

**症状**: `EADDRINUSE: address already in use :::3000`

**原因**: 他のプロセスがポート3000を使用中

**対処**:
```bash
# 使用中のプロセスを確認
lsof -i :3000

# プロセスを終了するか、.envでPORTを変更
PORT=3001
```

## 関連ドキュメント

- [README](../README.md)
- [デプロイ手順](./deploy.md)
```

</details>

---

## Part 3: デプロイ手順書を作成する（30分）

### タスク 3-1: deploy.mdを作成

本番環境へのデプロイ手順書を作成してください。

以下の項目を含めること:
- 概要
- 前提条件
- 作業時間の目安
- 手順（SSH接続からデプロイ完了まで）
- 確認ポイント
- ロールバック手順
- トラブルシューティング

<details>
<summary>解答例</summary>

```markdown
# デプロイ手順書

## 概要

TaskFlowを本番環境（AWS EC2）にデプロイするための手順です。

> ⚠️ **注意**: 本番環境への操作です。手順を慎重に確認してから実行してください。

## 前提条件

- AWS EC2へのSSHアクセス権限があること
- 秘密鍵ファイル（taskflow-prod.pem）を持っていること
- mainブランチに最新のコードがマージされていること

## 作業時間の目安

約10分

## デプロイ前の確認

- [ ] mainブランチのCI/CDがすべてパスしている
- [ ] 本番環境用の環境変数に変更がないか確認済み
- [ ] 必要に応じて関係者に通知済み

## 手順

### 1. ローカルでmainブランチを確認する

```bash
git checkout main
git pull origin main
git log -1 --oneline
```

【確認】デプロイするコミットが正しいことを確認

### 2. EC2インスタンスにSSH接続する

```bash
ssh -i ~/.ssh/taskflow-prod.pem ec2-user@<本番サーバーIP>
```

【確認】ログインできること

```
Last login: ...
[ec2-user@ip-xxx-xxx-xxx-xxx ~]$
```

### 3. アプリケーションディレクトリに移動する

```bash
cd /var/www/taskflow
```

【確認】ディレクトリが存在すること

### 4. 現在のバージョンを記録する（ロールバック用）

```bash
git log -1 --oneline > /tmp/previous_version.txt
cat /tmp/previous_version.txt
```

【確認】現在のコミットハッシュが記録されること

### 5. 最新のコードを取得する

```bash
git pull origin main
```

【確認】最新のコードが取得されること

```
Updating abc1234..def5678
Fast-forward
 ...
```

### 6. 依存パッケージを更新する

```bash
npm install --production
```

【確認】エラーなく完了すること

### 7. 本番ビルドを作成する

```bash
npm run build
```

【確認】ビルドが成功すること

```
Build completed successfully.
```

### 8. アプリケーションを再起動する

```bash
pm2 restart taskflow
```

【確認】再起動が成功すること

```bash
pm2 status
```

`taskflow` のステータスが `online` であること

### 9. 動作確認する

ブラウザで https://taskflow.example.com を開く

【確認】
- [ ] トップページが表示される
- [ ] タスクの追加ができる
- [ ] エラーが発生していない

### 10. ログを確認する

```bash
pm2 logs taskflow --lines 50
```

【確認】エラーログがないこと

### 11. SSH接続を終了する

```bash
exit
```

## デプロイ完了後

- [ ] 動作確認が完了した
- [ ] 必要に応じて関係者に完了を通知した

## ロールバック手順

問題が発生した場合は、以下の手順でロールバックします。

### 1. EC2にSSH接続する

```bash
ssh -i ~/.ssh/taskflow-prod.pem ec2-user@<本番サーバーIP>
```

### 2. アプリケーションディレクトリに移動する

```bash
cd /var/www/taskflow
```

### 3. 前のバージョンに戻す

```bash
PREV_VERSION=$(cat /tmp/previous_version.txt | cut -d' ' -f1)
git checkout $PREV_VERSION
```

### 4. ビルドと再起動

```bash
npm install --production
npm run build
pm2 restart taskflow
```

### 5. 動作確認

ブラウザで動作確認を行う

## トラブルシューティング

### SSH接続できない

**症状**: `Connection refused` または `Permission denied`

**対処**:
1. 秘密鍵のパスを確認
2. セキュリティグループでSSH（22番ポート）が許可されているか確認
3. インスタンスが起動しているか確認

### npm install でエラー

**症状**: 依存パッケージのインストールに失敗

**対処**:
```bash
rm -rf node_modules package-lock.json
npm install --production
```

### pm2 restart でエラー

**症状**: アプリケーションが起動しない

**対処**:
```bash
pm2 logs taskflow --lines 100
```
ログを確認してエラー原因を特定

## 関連ドキュメント

- [README](../README.md)
- [開発環境セットアップ](./setup.md)
```

</details>

---

## 達成度チェック

以下を確認してください：

- [ ] Part 1: README.mdを作成できた
- [ ] Part 2: setup.mdを作成できた
- [ ] Part 3: deploy.mdを作成できた

### セルフレビューチェックリスト

| 項目 | README | setup.md | deploy.md |
|------|--------|----------|-----------|
| 概要がわかりやすい | | | |
| 前提条件が明確 | | | |
| 手順が具体的 | | | |
| 確認ポイントがある | | | |
| トラブルシューティングがある | - | | |
| コピペで実行できる | | | |

---

## まとめ

この演習で実践したこと：

| Part | 内容 | ポイント |
|------|------|---------|
| Part 1 | README作成 | プロジェクトの顔、クイックスタート重視 |
| Part 2 | セットアップ手順書 | 詳細な手順、確認ポイント、トラブルシューティング |
| Part 3 | デプロイ手順書 | 本番操作の慎重さ、ロールバック手順 |

### 重要なポイント

1. **READMEは入り口** - 5分で試せるクイックスタートを用意
2. **手順書は詳細に** - 確認ポイントとトラブルシューティングを必ず含める
3. **本番操作は慎重に** - ロールバック手順を必ず用意する

---

## 次のステップへ

手順書とREADMEの作成演習は完了しました。

次のセクションでは、Step 4の理解度を確認するチェックポイントに挑戦します。

---

*推定所要時間: 90分*
