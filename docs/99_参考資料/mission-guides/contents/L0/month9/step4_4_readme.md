# READMEの書き方

## メタ情報

```yaml
mission: "ドキュメントを書く力を身につけよう"
step: 4
subStep: 4
title: "READMEの書き方"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "技術ドキュメンテーション"
  category: "ヒューマンスキル"
  target_level: "L0"
```

---

## ストーリー

> 「GitHubでプロジェクトを見たとき、最初に何を見る？」
>
> 「えーと...READMEですか？」
>
> 「そう！READMEはプロジェクトの『顔』なんだ。これがしっかり書けるかどうかで、プロジェクトの印象が大きく変わるよ」

---

## READMEとは

READMEは、**プロジェクトを初めて見る人が最初に読むドキュメント**です。

```
READMEの役割:
- プロジェクトが何なのかを説明する
- どうやって使うのかを案内する
- どうやって開発に参加するかを説明する
```

GitHubでは `README.md` がリポジトリのトップページに自動表示されます。

---

## READMEに書くべき内容

### 必須項目

| 項目 | 説明 |
|------|------|
| プロジェクト名 | 何というプロジェクトか |
| 概要 | 何をするプロジェクトか（1-2文） |
| インストール方法 | どうやってセットアップするか |
| 使い方 | 基本的な使用方法 |

### 推奨項目

| 項目 | 説明 |
|------|------|
| 機能一覧 | 主な機能のリスト |
| 動作要件 | 必要な環境やバージョン |
| 設定方法 | 環境変数や設定ファイルの説明 |
| 開発への参加方法 | コントリビューションガイド |
| ライセンス | 利用条件 |

---

## READMEテンプレート

```markdown
# プロジェクト名

[プロジェクトの概要を1-2文で説明]

## 機能

- 機能1の説明
- 機能2の説明
- 機能3の説明

## 動作要件

- Node.js 18.0.0以上
- npm 9.0.0以上

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/username/project.git

# ディレクトリに移動
cd project

# 依存パッケージをインストール
npm install
```

## 使い方

```bash
# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 を開く

## 設定

環境変数を `.env` ファイルに設定してください。

```
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY=your-api-key
```

## 開発

### ブランチ戦略

- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 新機能開発

### テストの実行

```bash
npm test
```

## ライセンス

MIT License
```

---

## 良いREADMEの特徴

### 1. 最初の3秒で内容がわかる

```markdown
❌ 悪い例:
# MyProject
このプロジェクトは様々な機能を提供するものです。

✅ 良い例:
# TaskManager
チームのタスク管理を簡単にするWebアプリケーション。
カンバンボードでタスクの進捗を可視化できます。
```

### 2. すぐに試せる

```markdown
❌ 悪い例:
## インストール
環境を整えてからセットアップしてください。

✅ 良い例:
## クイックスタート
```bash
git clone https://github.com/user/taskmanager.git
cd taskmanager
npm install
npm run dev
```
30秒でローカル環境が立ち上がります。
```

### 3. スクリーンショットやGIFがある

視覚的に「何ができるか」が伝わります。

```markdown
## デモ

![タスク管理画面](./docs/images/demo.gif)
```

### 4. バッジで状態がわかる

```markdown
# TaskManager

![Build Status](https://github.com/user/taskmanager/workflows/CI/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![npm version](https://img.shields.io/npm/v/taskmanager.svg)
```

---

## READMEとドキュメントの使い分け

| ドキュメント | 内容 | 対象読者 |
|------------|------|---------|
| README | プロジェクト概要、クイックスタート | 初めての人 |
| docs/setup.md | 詳細なセットアップ手順 | 開発者 |
| docs/api.md | API仕様 | 開発者 |
| CONTRIBUTING.md | 開発参加ガイド | コントリビューター |

READMEは**入り口**であり、詳細は別ドキュメントに委譲します。

```markdown
## 詳細ドキュメント

- [セットアップガイド](./docs/setup.md)
- [API リファレンス](./docs/api.md)
- [コントリビューションガイド](./CONTRIBUTING.md)
```

---

## READMEを書くときのコツ

### 1. 「5分で試せる」を意識する

```
読者の目標: 「このプロジェクトを5分で動かしたい」

→ クイックスタートを用意する
→ 最小限の手順で動く状態にする
→ 詳細は後から読めるようにする
```

### 2. コピペで動くようにする

```markdown
❌ 悪い例:
リポジトリをクローンして、npmでインストールしてください。

✅ 良い例:
```bash
git clone https://github.com/user/project.git
cd project
npm install
npm start
```
```

### 3. 更新日を意識する

古いREADMEは信頼性が下がります。

```
- コマンドが変わったら更新する
- バージョンが上がったら更新する
- 機能が増えたら更新する
```

### 4. 読者の疑問を先回りする

```markdown
## よくある質問

### Q: Node.js 16でも動きますか？
A: Node.js 18以上が必要です。16では一部機能が動作しません。

### Q: Windows でも動きますか？
A: はい、Windows、macOS、Linux で動作確認済みです。
```

---

## チーム開発でのREADME

チーム内プロジェクトでも、READMEは重要です。

```
メリット:
- 新メンバーのオンボーディングが楽になる
- 「あれどうやるんだっけ？」が減る
- 属人化を防げる
```

社内プロジェクトでも、以下は必ず書きましょう:

```markdown
# 社内プロジェクトのREADMEに必要なもの

- プロジェクトの目的
- 開発環境のセットアップ手順
- デプロイ方法（または手順書へのリンク）
- 関連ドキュメントへのリンク
- 問い合わせ先（Slackチャンネルなど）
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| READMEとは | プロジェクトを初めて見る人が最初に読むドキュメント |
| 必須項目 | プロジェクト名、概要、インストール、使い方 |
| 良いREADME | 3秒で内容がわかる、すぐ試せる、視覚的 |
| コツ | 5分で試せる、コピペで動く、更新を忘れない |

### チェックリスト

- [ ] READMEの役割と重要性を理解した
- [ ] READMEに書くべき必須項目を理解した
- [ ] 良いREADMEの特徴を理解した

---

## 次のステップへ

READMEの書き方は理解できましたか？

次のセクションでは、手順書とREADMEを実際に作成する演習を行います。
学んだ内容を実践で試してみましょう。

---

*推定読了時間: 30分*
