# 演習：自己紹介ページをデザインしよう

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 4
subStep: 5
title: "演習：自己紹介ページをデザインしよう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 先輩「CSS の基本が揃ったね。いよいよ自己紹介ページにスタイルを当てよう」
>
> ついに見た目が変わるんですね！ ワクワクします。
>
> 先輩「まずは色とフォントで印象を変えて、ボックスモデルで余白を整えよう。劇的にかっこよくなるよ」

---

## ミッション

Step 3 で作った自己紹介サイト（index.html, about.html, contact.html）に CSS を適用して、見た目を整えてください。

### ファイル構成

```
my-site/
├── index.html
├── about.html
├── contact.html
└── style.css      ← 新規作成
```

---

## 要件

### 必須要件

| 要件 | プロパティ |
|------|-----------|
| 全ページにCSSを適用 | `<link rel="stylesheet" href="style.css">` |
| `box-sizing: border-box` を設定 | `* { box-sizing: border-box; }` |
| 背景色を設定 | `background-color` |
| 文字色を設定 | `color` |
| フォントを設定 | `font-family`, `font-size` |
| 行間を設定 | `line-height` |
| ヘッダーにスタイルを当てる | 背景色、文字色、padding |
| フッターにスタイルを当てる | 背景色、文字色、padding |
| コンテンツに余白を付ける | margin, padding |
| テーブルにスタイルを当てる | border, padding |
| リンクの色を変える | color, text-decoration |

---

## ヒント

### CSSの基本テンプレート

```css
/* リセット */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ページ全体 */
body {
  font-family: "Helvetica Neue", Arial, "Hiragino Sans", sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  background-color: #f8f9fa;
}

/* ヘッダー */
header {
  /* ここにスタイルを書く */
}

/* ナビゲーション */
nav a {
  /* ここにスタイルを書く */
}

/* メインコンテンツ */
main {
  /* ここにスタイルを書く */
}

/* フッター */
footer {
  /* ここにスタイルを書く */
}
```

### テーブルのスタイリングヒント

```css
table {
  border-collapse: collapse;  /* セル間の隙間をなくす */
  width: 100%;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
```

---

## チャレンジ（余裕がある人向け）

- [ ] Google Fonts を使ってフォントを変える
- [ ] リンクにホバー効果を付ける（`a:hover { color: ...; }`）
- [ ] ヘッダーに影を付ける（`box-shadow`）
- [ ] テーブルの偶数行に背景色を付ける（`tr:nth-child(even)`）
- [ ] フォームの入力欄にスタイルを当てる

---

## 解答例

<details><summary>解答</summary>

```css
/* ===== リセット ===== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ===== ページ全体 ===== */
body {
  font-family: "Helvetica Neue", Arial, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  background-color: #f8f9fa;
}

/* ===== ヘッダー ===== */
header {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  text-align: center;
}

header h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

/* ===== ナビゲーション ===== */
nav {
  margin-top: 10px;
}

nav a {
  color: #ecf0f1;
  text-decoration: none;
  margin: 0 10px;
  font-size: 14px;
}

nav a:hover {
  color: #3498db;
  text-decoration: underline;
}

/* ===== メインコンテンツ ===== */
main {
  max-width: 800px;
  margin: 30px auto;
  padding: 0 20px;
}

/* ===== セクション ===== */
section {
  background-color: white;
  padding: 25px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
}

section h2 {
  color: #2c3e50;
  font-size: 22px;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 2px solid #3498db;
}

/* ===== テーブル ===== */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 15px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px 15px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #2c3e50;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* ===== リスト ===== */
ul, ol {
  padding-left: 25px;
  margin: 10px 0;
}

li {
  margin-bottom: 5px;
}

/* ===== リンク ===== */
a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* ===== フォーム ===== */
input[type="text"],
input[type="email"],
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #3498db;
  outline: none;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  margin-top: 15px;
}

button[type="submit"] {
  background-color: #3498db;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
}

button[type="submit"]:hover {
  background-color: #2980b9;
}

/* ===== フッター ===== */
footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  text-align: center;
  padding: 15px;
  font-size: 14px;
  margin-top: 30px;
}

/* ===== 画像 ===== */
img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

figure {
  text-align: center;
  margin: 20px 0;
}

figcaption {
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 8px;
}

/* ===== ユーティリティ ===== */
.highlight {
  color: #e74c3c;
  font-weight: bold;
}

hr {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 20px 0;
}
```

</details>

---

## 確認ポイント

| 確認項目 | チェック |
|----------|----------|
| 全ページにCSSが適用されている | 3ファイルとも `<link>` で読み込み |
| ヘッダーにスタイルがある | 背景色、白文字 |
| フッターにスタイルがある | 背景色、白文字 |
| テーブルに枠線がある | border, padding |
| 文字が読みやすい | font-size, line-height |
| 余白が適切 | padding, margin |
| リンクの色がデフォルトと違う | color の変更 |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 外部CSS | 1つのCSSファイルを全ページで共有 |
| リセット | `box-sizing: border-box` を最初に |
| 色・フォント | 統一感のある配色とフォント |
| ボックスモデル | padding と margin で余白を調整 |
| テーブル | `border-collapse: collapse` で枠線を整える |

### チェックリスト
- [ ] style.css を作成した
- [ ] 全ページにCSSが適用されている
- [ ] ヘッダー・フッターにスタイルが当たっている
- [ ] テーブルにスタイルが当たっている
- [ ] ブラウザで見た目が改善されたことを確認した

---

## 次のステップへ

自己紹介ページのデザインが一気に良くなりました。Step 4の最後にクイズで理解度を確認しましょう。

---

*推定読了時間: 90分*
