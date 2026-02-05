# READMEを書こう

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 5
subStep: 3
title: "READMEを書こう"
itemType: EXERCISE
estimatedMinutes: 60
noiseLevel: MINIMAL
roadmap:
  skill: "総合"
  category: "総合演習"
  target_level: "L0"
```

---

## ストーリー

> 「GitHubリポジトリにはREADMEが必要だ」
>
> 月9で学んだREADMEの書き方を思い出す。
>
> READMEはプロジェクトの「顔」。これを見た人がプロジェクトの内容を理解できるように書こう。
>
> 先輩だけでなく、他のチームメンバーが見ても分かるように。

---

## ミッション概要

プロジェクトのREADMEファイルを作成してください。

### 達成条件

- [ ] プロジェクトの概要が書かれている
- [ ] ファイル構成が記載されている
- [ ] セットアップ手順が記載されている
- [ ] データベースの再現手順が記載されている
- [ ] コミット・プッシュした

---

## READMEの構成（月9の復習）

良いREADMEには以下の要素が含まれます。

| セクション | 内容 |
|-----------|------|
| タイトル | プロジェクト名 |
| 概要 | 何のプロジェクトか |
| 特徴 | 主な機能・特長 |
| ファイル構成 | ディレクトリ構造 |
| セットアップ | 環境構築手順 |
| 使い方 | 基本的な使い方 |
| 作成者 | 誰が作ったか |

---

## Part 1: READMEの作成

### タスク 1-1: README.md を作成

```bash
cd ~/projects/internal-tools-page

cat > README.md << 'EOF'
# 社内ツール紹介ページ

社内で活用しているツール10件を紹介するWebページです。

## 概要

社内ツールの情報をデータベースで管理し、HTML/CSSでカテゴリ別に紹介するページを作成しました。

### 掲載ツール

| カテゴリ | ツール |
|---------|--------|
| 開発ツール | VS Code, GitHub, Docker |
| コミュニケーション | Slack, Google Workspace, Zoom |
| ドキュメント | Notion, Confluence |
| デザイン | Figma |
| プロジェクト管理 | Jira |

## 特徴

- カテゴリ別にツールを整理して表示
- 各ツールの名前、説明、公式サイトへのリンクを掲載
- ナビゲーションでカテゴリ間を移動可能
- シンプルで見やすいカード型デザイン

## ファイル構成

```
internal-tools-page/
├── index.html              # メインページ
├── style.css               # スタイルシート
├── data/
│   ├── create_tables.sql   # テーブル定義
│   ├── insert_data.sql     # サンプルデータ
│   └── queries.sql         # クエリ集
├── docs/
│   ├── analysis.md         # データ分析レポート
│   ├── url_check.md        # URL疎通確認結果
│   ├── tool_list.txt       # ツール一覧
│   ├── review_result.md    # セルフレビュー結果
│   ├── daily/              # 日報
│   │   ├── day1.md
│   │   ├── day2.md
│   │   ├── day3.md
│   │   ├── day4.md
│   │   └── day5.md
│   └── report/             # 報告書
│       ├── completion_report.md
│       └── weekly.md
├── .gitignore
└── README.md               # このファイル
```

## セットアップ

### 必要なツール

- ブラウザ（Chrome, Firefox, Safari など）
- SQLite3（データベースを再現する場合）

### Webページの表示

`index.html` をブラウザで開いてください。

```bash
open index.html  # macOS
xdg-open index.html  # Linux
```

### データベースの再現

```bash
# データベースの作成
sqlite3 data/tools.db < data/create_tables.sql

# サンプルデータの投入
sqlite3 data/tools.db < data/insert_data.sql

# データの確認
sqlite3 -header -column data/tools.db "SELECT * FROM tools;"
```

## 技術スタック

| 技術 | 用途 |
|------|------|
| HTML5 | ページ構造（セマンティックHTML） |
| CSS3 | デザイン（Flexbox） |
| SQLite | データベース |
| Git/GitHub | バージョン管理・公開 |

## 作成者

（あなたの名前）

## ライセンス

社内利用限定
EOF
```

---

## Part 2: READMEのチェック

### タスク 2-1: 内容の確認

```bash
cat README.md
```

### チェックリスト

| # | チェック項目 | OK? |
|---|-------------|-----|
| 1 | プロジェクトの目的がすぐわかるか | [ ] |
| 2 | ファイル構成が正しいか | [ ] |
| 3 | セットアップ手順が明確か | [ ] |
| 4 | データベースの再現手順があるか | [ ] |
| 5 | Markdownの記法が正しいか | [ ] |
| 6 | 誤字脱字がないか | [ ] |

---

## Part 3: コミット・プッシュ

### タスク 3-1: コミット

```bash
git add README.md
git commit -m "プロジェクトREADMEを作成"
```

### タスク 3-2: プッシュ

```bash
git push
```

### タスク 3-3: GitHubで確認

GitHubのリポジトリページを開いて、READMEが表示されることを確認してください。

GitHubでは、リポジトリのトップページにREADME.mdの内容が自動的に表示されます。

---

## 良いREADMEのポイント

### ポイント1: 最初の3秒で伝える

READMEを開いた人は、最初の数秒で「このプロジェクトは何か」を判断します。
タイトルと最初の1文で伝えましょう。

```markdown
# 社内ツール紹介ページ
社内で活用しているツール10件を紹介するWebページです。
```

### ポイント2: セットアップは「コピペで動く」レベルで

初めてこのプロジェクトに触れる人が、コマンドをコピペするだけで環境を作れるように書きます。

### ポイント3: ファイル構成でプロジェクトの全体像を示す

ディレクトリツリーを見れば、どこに何があるかが一目でわかります。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| READMEの役割 | プロジェクトの「顔」 |
| 必須要素 | 概要、構成、セットアップ、使い方 |
| コツ | 最初の数秒で伝える、コピペで動く |

- [ ] READMEを作成した
- [ ] 内容を確認した
- [ ] コミット・プッシュした
- [ ] GitHubで表示を確認した

---

## 次のステップへ

READMEの作成が完了しました。

次のセクションでは、1週間の週報を作成します。
Day 5の最後の作業です。

---

*推定所要時間: 60分*
