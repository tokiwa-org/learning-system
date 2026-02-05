# CSSとは何か

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 4
subStep: 1
title: "CSSとは何か"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 先輩「HTMLで構造が作れるようになったね。でも、正直に言って今のページ... 見た目がシンプルすぎない？」
>
> 確かに、白い背景に黒い文字だけで寂しいです...
>
> 先輩「そこでCSSの出番だよ。CSSを使えば、色、フォント、レイアウトを自由にデザインできるんだ」

---

## CSSとは

**CSS** は **Cascading Style Sheets** の略で、Webページの **見た目（デザイン）** を制御する言語です。

### HTMLとCSSの役割分担

| 技術 | 役割 | 例え |
|------|------|------|
| HTML | 構造・内容 | 家の骨組み・間取り |
| CSS | 見た目・デザイン | 壁の色・家具の配置 |

```
HTML（構造）  +  CSS（見た目）  =  Webページ
```

---

## CSSでできること

| できること | 例 |
|-----------|-----|
| 色の変更 | テキストや背景の色 |
| フォントの変更 | 文字の大きさ、書体 |
| 余白の調整 | 要素間のスペース |
| レイアウトの変更 | 要素の並び方 |
| 装飾 | 枠線、影、角丸 |
| アニメーション | ホバー時の変化、遷移 |

---

## CSSの3つの書き方

### 方法1: インラインスタイル

HTMLタグに直接 `style` 属性で書く方法です。

```html
<p style="color: red; font-size: 20px;">赤い大きな文字</p>
```

- メリット: 手軽
- デメリット: 管理しにくい、再利用できない

### 方法2: `<style>` タグ

`<head>` 内に `<style>` タグで書く方法です。

```html
<head>
  <style>
    p {
      color: blue;
      font-size: 18px;
    }
  </style>
</head>
```

- メリット: 1ファイルで完結
- デメリット: 複数ページで共有できない

### 方法3: 外部CSSファイル（推奨）

別ファイル（`.css`）に書いて読み込む方法です。

```html
<!-- index.html -->
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

```css
/* style.css */
p {
  color: green;
  font-size: 16px;
}
```

- メリット: **複数ページで共有できる、管理しやすい**
- デメリット: ファイルが増える

> 先輩「実際の開発では **外部CSSファイル** を使うのが基本だよ。今後はこの方法で書いていこう」

---

## CSSの基本構文

```css
セレクタ {
  プロパティ: 値;
  プロパティ: 値;
}
```

### 具体例

```css
h1 {
  color: navy;
  font-size: 32px;
}
```

| 要素 | 説明 | 例 |
|------|------|-----|
| セレクタ | どの要素にスタイルを当てるか | `h1` |
| プロパティ | 何を変えるか | `color`, `font-size` |
| 値 | どう変えるか | `navy`, `32px` |
| 宣言 | プロパティと値のセット | `color: navy;` |

### 読み方

```css
h1 {
  color: navy;       /* h1の文字色を紺色にする */
  font-size: 32px;   /* h1の文字サイズを32pxにする */
}
```

---

## 実践：CSSを書いてみよう

### ファイル構成

```
my-site/
├── index.html
└── style.css    ← 新しく作る
```

### style.css

```css
/* ページ全体の設定 */
body {
  font-family: sans-serif;
  color: #333;
  background-color: #f5f5f5;
}

/* 見出しの設定 */
h1 {
  color: #2c3e50;
}

h2 {
  color: #3498db;
}

/* 段落の設定 */
p {
  line-height: 1.8;
}
```

### index.html に追加

```html
<head>
  <meta charset="UTF-8">
  <title>CSSの練習</title>
  <link rel="stylesheet" href="style.css">
</head>
```

ブラウザで開いて、文字の色や背景が変わったことを確認しましょう。

---

## CSSのコメント

```css
/* これはコメントです */
h1 {
  color: navy; /* 文字色を紺色に */
}
```

HTMLのコメント（`<!-- -->`）とは書き方が違うので注意してください。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| CSSとは | Webページの見た目を制御する言語 |
| 3つの書き方 | インライン、`<style>`タグ、外部ファイル |
| 推奨 | 外部CSSファイル（.css）を使う |
| 基本構文 | `セレクタ { プロパティ: 値; }` |
| 読み込み | `<link rel="stylesheet" href="style.css">` |

### チェックリスト
- [ ] CSSの役割（見た目の制御）を説明できる
- [ ] CSSの3つの書き方を理解した
- [ ] 外部CSSファイルの作り方と読み込み方が分かる
- [ ] CSSの基本構文（セレクタ・プロパティ・値）を理解した
- [ ] 実際にCSSファイルを作ってHTMLに適用できた

---

## 次のステップへ

CSSの基本が分かりました。次は、CSSの重要な概念「セレクタ」を詳しく学んでいきましょう。

---

*推定読了時間: 30分*
