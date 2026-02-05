# HTMLでページ構造を作ろう

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 4
subStep: 1
title: "HTMLでページ構造を作ろう"
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

> Day 3の朝。いよいよWebページの制作に入る。
>
> 「月5で学んだHTML/CSSの出番だ。まずはHTMLでページの骨格を作ろう」
>
> データベースから取得した情報をもとに、カテゴリ別にツールを紹介するページを作る。
>
> セマンティックHTML、忘れていないだろうか。`<header>`, `<nav>`, `<main>`, `<footer>`...

---

## ミッション概要

社内ツール紹介ページのHTML構造を作成してください。

### 達成条件

- [ ] セマンティックHTMLで構造を作成できた
- [ ] ヘッダー、ナビゲーション、メインコンテンツ、フッターがある
- [ ] 全5カテゴリのツール情報が表示されている
- [ ] 各ツールの名前、説明、URLが含まれている
- [ ] ブラウザで表示確認ができた

---

## Part 1: HTMLの基本構造

### タスク 1-1: index.html を更新

Step 2で作成したテンプレートを、以下の完成版に更新してください。

```bash
cd ~/projects/internal-tools-page

cat > index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>社内ツール紹介 | Internal Tools Guide</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- ヘッダー -->
    <header>
        <h1>社内ツール紹介</h1>
        <p>チームで活用している10のツールを紹介します</p>
    </header>

    <!-- ナビゲーション -->
    <nav>
        <ul>
            <li><a href="#dev">開発ツール</a></li>
            <li><a href="#comm">コミュニケーション</a></li>
            <li><a href="#doc">ドキュメント</a></li>
            <li><a href="#design">デザイン</a></li>
            <li><a href="#pm">プロジェクト管理</a></li>
        </ul>
    </nav>

    <!-- メインコンテンツ -->
    <main>
        <!-- サマリーセクション -->
        <section id="summary">
            <h2>サマリー</h2>
            <table>
                <thead>
                    <tr>
                        <th>カテゴリ</th>
                        <th>ツール数</th>
                        <th>平均評価</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>開発ツール</td>
                        <td>3</td>
                        <td>4.60</td>
                    </tr>
                    <tr>
                        <td>コミュニケーション</td>
                        <td>3</td>
                        <td>4.40</td>
                    </tr>
                    <tr>
                        <td>ドキュメント</td>
                        <td>2</td>
                        <td>4.15</td>
                    </tr>
                    <tr>
                        <td>デザイン</td>
                        <td>1</td>
                        <td>4.60</td>
                    </tr>
                    <tr>
                        <td>プロジェクト管理</td>
                        <td>1</td>
                        <td>4.00</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- 開発ツール -->
        <section id="dev">
            <h2>開発ツール</h2>
            <div class="tool-cards">
                <div class="tool-card">
                    <h3>VS Code</h3>
                    <span class="rating">4.8</span>
                    <p>軽量で高機能なコードエディタ。拡張機能が豊富で多くの言語に対応。</p>
                    <a href="https://code.visualstudio.com" target="_blank">公式サイト</a>
                </div>
                <div class="tool-card">
                    <h3>GitHub</h3>
                    <span class="rating">4.7</span>
                    <p>Gitリポジトリのホスティングサービス。コードレビューやCI/CDも利用可能。</p>
                    <a href="https://github.com" target="_blank">公式サイト</a>
                </div>
                <div class="tool-card">
                    <h3>Docker</h3>
                    <span class="rating">4.3</span>
                    <p>コンテナ型仮想化プラットフォーム。開発環境の統一に活用。</p>
                    <a href="https://www.docker.com" target="_blank">公式サイト</a>
                </div>
            </div>
        </section>

        <!-- コミュニケーション -->
        <section id="comm">
            <h2>コミュニケーション</h2>
            <div class="tool-cards">
                <div class="tool-card">
                    <h3>Slack</h3>
                    <span class="rating">4.5</span>
                    <p>チーム内のリアルタイムコミュニケーションツール。チャンネルごとに話題を整理できる。</p>
                    <a href="https://slack.com" target="_blank">公式サイト</a>
                </div>
                <div class="tool-card">
                    <h3>Google Workspace</h3>
                    <span class="rating">4.5</span>
                    <p>メール、カレンダー、ドキュメントなどのビジネス向け統合ツール。</p>
                    <a href="https://workspace.google.com" target="_blank">公式サイト</a>
                </div>
                <div class="tool-card">
                    <h3>Zoom</h3>
                    <span class="rating">4.2</span>
                    <p>ビデオ会議ツール。オンラインミーティングやウェビナーに利用。</p>
                    <a href="https://zoom.us" target="_blank">公式サイト</a>
                </div>
            </div>
        </section>

        <!-- ドキュメント -->
        <section id="doc">
            <h2>ドキュメント</h2>
            <div class="tool-cards">
                <div class="tool-card">
                    <h3>Notion</h3>
                    <span class="rating">4.4</span>
                    <p>オールインワンのワークスペース。ドキュメント、Wiki、プロジェクト管理に対応。</p>
                    <a href="https://www.notion.so" target="_blank">公式サイト</a>
                </div>
                <div class="tool-card">
                    <h3>Confluence</h3>
                    <span class="rating">3.9</span>
                    <p>チームWikiとドキュメント共有プラットフォーム。Jiraとの連携が強力。</p>
                    <a href="https://www.atlassian.com/software/confluence" target="_blank">公式サイト</a>
                </div>
            </div>
        </section>

        <!-- デザイン -->
        <section id="design">
            <h2>デザイン</h2>
            <div class="tool-cards">
                <div class="tool-card">
                    <h3>Figma</h3>
                    <span class="rating">4.6</span>
                    <p>ブラウザベースのUIデザインツール。チームでのリアルタイム共同編集が可能。</p>
                    <a href="https://www.figma.com" target="_blank">公式サイト</a>
                </div>
            </div>
        </section>

        <!-- プロジェクト管理 -->
        <section id="pm">
            <h2>プロジェクト管理</h2>
            <div class="tool-cards">
                <div class="tool-card">
                    <h3>Jira</h3>
                    <span class="rating">4.0</span>
                    <p>プロジェクト管理・課題追跡ツール。アジャイル開発のスプリント管理に対応。</p>
                    <a href="https://www.atlassian.com/software/jira" target="_blank">公式サイト</a>
                </div>
            </div>
        </section>
    </main>

    <!-- フッター -->
    <footer>
        <p>社内ツール紹介ページ | 作成者: （あなたの名前）</p>
        <p>データソース: 社内ツールデータベース（全10ツール）</p>
    </footer>
</body>
</html>
HTMLEOF
```

---

## Part 2: HTML構造の解説

### セマンティックHTMLタグの使い方（月5の復習）

| タグ | 役割 | 今回の使いどころ |
|------|------|-----------------|
| `<header>` | ページのヘッダー | タイトルとサブタイトル |
| `<nav>` | ナビゲーション | カテゴリへのリンク |
| `<main>` | メインコンテンツ | ツール紹介全体 |
| `<section>` | セクション区切り | 各カテゴリのブロック |
| `<footer>` | ページのフッター | 作成者情報 |

### ページ内リンク

```html
<!-- ナビゲーションのリンク -->
<a href="#dev">開発ツール</a>

<!-- リンク先のセクション -->
<section id="dev">
```

`href="#dev"` は、同じページ内の `id="dev"` にジャンプします。

### ツールカードの構造

```html
<div class="tool-card">
    <h3>ツール名</h3>
    <span class="rating">評価</span>
    <p>説明文</p>
    <a href="URL" target="_blank">公式サイト</a>
</div>
```

`target="_blank"` は、リンクを新しいタブで開く属性です。

---

## Part 3: ブラウザで表示確認

### タスク 3-1: ファイルをブラウザで開く

```bash
# macOSの場合
open index.html

# Linuxの場合
xdg-open index.html

# WSL（Windows）の場合
explorer.exe index.html
```

<details>
<summary>ヒント: ブラウザで直接開く方法</summary>

ブラウザのアドレスバーに以下のようにパスを入力しても開けます。

```
file:///home/yourname/projects/internal-tools-page/index.html
```

または、ファイルマネージャーで `index.html` をダブルクリックしてもOKです。

</details>

### タスク 3-2: 表示確認チェックリスト

| # | チェック項目 | OK? |
|---|-------------|-----|
| 1 | タイトル「社内ツール紹介」が表示されている | [ ] |
| 2 | ナビゲーションリンクが5つ表示されている | [ ] |
| 3 | サマリーテーブルが表示されている | [ ] |
| 4 | 5つのカテゴリセクションがある | [ ] |
| 5 | 全10ツールが表示されている | [ ] |
| 6 | 各ツールに名前、説明、リンクがある | [ ] |
| 7 | フッターが表示されている | [ ] |
| 8 | ナビゲーションのリンクが機能する | [ ] |

---

## Part 4: コミット

### タスク 4-1: HTMLをコミット

```bash
git add index.html
git commit -m "社内ツール紹介ページのHTML構造を作成"
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| セマンティックHTML | header, nav, main, section, footer を適切に使用 |
| ページ内リンク | `href="#id"` でカテゴリ間を移動 |
| ツールカード | 名前、評価、説明、リンクの4要素 |
| 外部リンク | `target="_blank"` で新タブに開く |

- [ ] HTMLの基本構造を作成した
- [ ] 全10ツールの情報を記述した
- [ ] ブラウザで表示確認した
- [ ] コミットした

---

## 次のステップへ

HTMLの構造ができました。しかし、まだ見た目は素朴です。

次のセクションでは、CSSでデザインを整えます。
カード型レイアウトやカラー設定で、見やすいページに仕上げましょう。

---

*推定所要時間: 60分*
