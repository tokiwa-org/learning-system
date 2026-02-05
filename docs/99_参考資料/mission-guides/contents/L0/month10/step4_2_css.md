# CSSでデザインしよう

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 4
subStep: 2
title: "CSSでデザインしよう"
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

> HTMLの構造ができた。ブラウザで見ると...うーん、まだ味気ない。
>
> 「CSSで見た目を整えよう。先輩が『シンプルでOK、見やすければ大丈夫』って言ってたな」
>
> 月5で学んだFlexboxを使って、カード型のレイアウトに仕上げよう。

---

## ミッション概要

CSSを使って、社内ツール紹介ページをデザインしてください。

### 達成条件

- [ ] ページ全体のレイアウトが整った
- [ ] ナビゲーションがスタイリングされた
- [ ] ツールカードが横並びで表示された
- [ ] テーブルが見やすくスタイリングされた
- [ ] ブラウザで見やすい表示になった

---

## Part 1: CSSの作成

### タスク 1-1: style.css を更新

```bash
cd ~/projects/internal-tools-page

cat > style.css << 'CSSEOF'
/* ============================================
   社内ツール紹介ページ スタイルシート
   ============================================ */

/* --- リセットと基本設定 --- */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f7fa;
}

/* --- ヘッダー --- */
header {
    background-color: #2c3e50;
    color: #fff;
    text-align: center;
    padding: 40px 20px;
}

header h1 {
    font-size: 2em;
    margin-bottom: 10px;
}

header p {
    font-size: 1.1em;
    color: #bdc3c7;
}

/* --- ナビゲーション --- */
nav {
    background-color: #34495e;
    padding: 15px 20px;
    position: sticky;
    top: 0;
    z-index: 100;
}

nav ul {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

nav a {
    color: #ecf0f1;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 4px;
    transition: background-color 0.3s;
}

nav a:hover {
    background-color: #2c3e50;
}

/* --- メインコンテンツ --- */
main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px 20px;
}

/* --- セクション --- */
section {
    margin-bottom: 40px;
}

section h2 {
    font-size: 1.5em;
    color: #2c3e50;
    border-bottom: 3px solid #3498db;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

/* --- サマリーテーブル --- */
table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
}

thead {
    background-color: #3498db;
    color: #fff;
}

th, td {
    padding: 12px 16px;
    text-align: left;
}

tbody tr:nth-child(even) {
    background-color: #f8f9fa;
}

tbody tr:hover {
    background-color: #eaf2f8;
}

/* --- ツールカード --- */
.tool-cards {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.tool-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex: 1 1 280px;
    max-width: 320px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.tool-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.tool-card h3 {
    color: #2c3e50;
    font-size: 1.2em;
    margin-bottom: 8px;
}

.tool-card .rating {
    display: inline-block;
    background-color: #f39c12;
    color: #fff;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.85em;
    font-weight: bold;
    margin-bottom: 10px;
}

.tool-card p {
    color: #555;
    font-size: 0.95em;
    margin-bottom: 12px;
}

.tool-card a {
    color: #3498db;
    text-decoration: none;
    font-weight: bold;
}

.tool-card a:hover {
    text-decoration: underline;
}

/* --- フッター --- */
footer {
    background-color: #2c3e50;
    color: #bdc3c7;
    text-align: center;
    padding: 20px;
    margin-top: 40px;
}

footer p {
    margin-bottom: 5px;
    font-size: 0.9em;
}
CSSEOF
```

---

## Part 2: CSSの解説

### Flexboxレイアウト（月5の復習）

```css
.tool-cards {
    display: flex;      /* Flexboxを有効化 */
    gap: 20px;          /* カード間の余白 */
    flex-wrap: wrap;    /* カードが横に収まらなければ折り返す */
}

.tool-card {
    flex: 1 1 280px;   /* 最低280px、余裕があれば伸びる */
    max-width: 320px;  /* 最大320pxまで */
}
```

### カラースキーム

| 要素 | 色 | 用途 |
|------|-----|------|
| `#2c3e50` | 濃い青灰色 | ヘッダー、見出し |
| `#34495e` | 中間の青灰色 | ナビゲーション |
| `#3498db` | 青 | アクセントカラー |
| `#f39c12` | オレンジ | 評価バッジ |
| `#f5f7fa` | 薄いグレー | 背景 |
| `#fff` | 白 | カード背景 |

### ホバーエフェクト

```css
.tool-card:hover {
    transform: translateY(-2px);          /* 少し浮く */
    box-shadow: 0 4px 8px rgba(0,0,0,0.15); /* 影が濃くなる */
}
```

マウスを乗せるとカードが少し浮き上がるエフェクトです。

### stickyナビゲーション

```css
nav {
    position: sticky;  /* スクロールしても上部に固定 */
    top: 0;
    z-index: 100;      /* 他の要素の上に表示 */
}
```

---

## Part 3: ブラウザで確認

### タスク 3-1: 表示確認

ブラウザで `index.html` を再読み込みして、CSSが適用されていることを確認してください。

```bash
# ブラウザで開く
open index.html  # macOS
# xdg-open index.html  # Linux
```

### タスク 3-2: 表示確認チェックリスト

| # | チェック項目 | OK? |
|---|-------------|-----|
| 1 | ヘッダーが濃い青灰色の背景で表示されている | [ ] |
| 2 | ナビゲーションが横並びで表示されている | [ ] |
| 3 | ナビゲーションがスクロールに追従する | [ ] |
| 4 | サマリーテーブルに背景色と罫線がある | [ ] |
| 5 | ツールカードが横並びで表示されている | [ ] |
| 6 | カードにホバーエフェクトがある | [ ] |
| 7 | 評価がオレンジのバッジで表示されている | [ ] |
| 8 | フッターが表示されている | [ ] |

---

## Part 4: 微調整とコミット

### タスク 4-1: 気になる箇所を修正

表示を確認して、気になる箇所があれば修正してください。

例えば：
- フォントサイズの調整
- 色の変更
- 余白の調整

<details>
<summary>ヒント: よくある微調整</summary>

```css
/* 文字が小さすぎる場合 */
body {
    font-size: 16px;  /* デフォルトフォントサイズを指定 */
}

/* カード間の余白を広げたい場合 */
.tool-cards {
    gap: 30px;  /* 20px → 30px */
}

/* 見出しの色を変えたい場合 */
section h2 {
    color: #1a5276;  /* 少し暗い青に */
}
```

</details>

### タスク 4-2: CSSをコミット

```bash
git add style.css
git commit -m "社内ツール紹介ページのCSSデザインを追加"
```

---

## CSS設計のポイント

### 今回使ったCSS技法

| 技法 | 説明 |
|------|------|
| Flexbox | カードの横並びレイアウト |
| box-shadow | カードに影をつけて立体感を出す |
| border-radius | 角を丸くして柔らかい印象に |
| transition | ホバー時の滑らかなアニメーション |
| sticky | ナビゲーションの固定 |
| nth-child | テーブルの縞模様 |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| レイアウト | Flexboxでカード型レイアウト |
| デザイン | シンプルで見やすい配色 |
| インタラクション | ホバーエフェクトでフィードバック |
| ナビゲーション | sticky で常に表示 |

- [ ] CSSを作成した
- [ ] ブラウザで表示確認した
- [ ] 必要に応じて微調整した
- [ ] コミットした

---

## 次のステップへ

ページのデザインが完成しました。

次のセクションでは、GitHubにリポジトリをプッシュします。
月2で学んだリモートリポジトリとの連携を実践しましょう。

---

*推定所要時間: 60分*
