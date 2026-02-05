# displayプロパティを理解しよう

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 5
subStep: 1
title: "displayプロパティを理解しよう"
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

> 先輩「色やフォントは整えたけど、要素の並び方をもっと自由にしたくない？」
>
> 確かに、全部縦に積み重なっちゃってます。横に並べたいときはどうすれば？
>
> 先輩「まずは `display` プロパティを理解しよう。これが要素の並び方の基本なんだ」

---

## displayプロパティとは

`display` プロパティは、要素の **表示方法** を決めるCSSプロパティです。

すべてのHTML要素は、デフォルトで `block` または `inline` のどちらかです。

---

## block（ブロック要素）

**1行を丸ごと占有** する要素です。

```css
display: block;
```

### 特徴

| 特徴 | 説明 |
|------|------|
| 幅 | 親要素の幅いっぱいに広がる |
| 改行 | 前後に自動的に改行が入る |
| サイズ | width, height を指定できる |

### ブロック要素の例

```
┌────────────────────────────┐
│ <h1>見出し</h1>            │  ← 1行全部使う
└────────────────────────────┘
┌────────────────────────────┐
│ <p>段落テキスト</p>         │  ← 1行全部使う
└────────────────────────────┘
┌────────────────────────────┐
│ <div>div要素</div>         │  ← 1行全部使う
└────────────────────────────┘
```

### デフォルトがblockの要素

`<h1>`〜`<h6>`, `<p>`, `<div>`, `<section>`, `<header>`, `<footer>`, `<main>`, `<ul>`, `<ol>`, `<table>`, `<form>`

---

## inline（インライン要素）

テキストの流れの **中に入る** 要素です。

```css
display: inline;
```

### 特徴

| 特徴 | 説明 |
|------|------|
| 幅 | コンテンツの分だけ |
| 改行 | 前後に改行が入らない（横に並ぶ） |
| サイズ | width, height を指定 **できない** |

### インライン要素の例

```
テキストの中に <strong>太字</strong> と <a>リンク</a> が入る
```

### デフォルトがinlineの要素

`<a>`, `<strong>`, `<em>`, `<span>`, `<img>`, `<br>`, `<input>`

---

## inline-block

`inline` と `block` の **いいとこ取り** です。

```css
display: inline-block;
```

### 特徴

| 特徴 | 説明 |
|------|------|
| 並び方 | 横に並ぶ（inlineと同じ） |
| サイズ | width, height を指定 **できる**（blockと同じ） |

### 使いどころ

ナビゲーションのリンクを横に並べて、サイズを指定したいとき。

```css
nav a {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
}
```

---

## none（非表示）

要素を **完全に非表示** にします。

```css
display: none;
```

ページ上から消えて、スペースも取りません。

---

## 比較表

| display | 横に並ぶ | width/height | 改行 |
|---------|----------|-------------|------|
| `block` | いいえ | 指定できる | あり |
| `inline` | はい | 指定できない | なし |
| `inline-block` | はい | 指定できる | なし |
| `none` | - | - | 非表示 |

---

## 実践：displayプロパティを試そう

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>displayの練習</title>
  <style>
    .block-demo {
      display: block;
      background-color: #3498db;
      color: white;
      padding: 10px;
      margin: 5px 0;
    }

    .inline-demo {
      display: inline;
      background-color: #e74c3c;
      color: white;
      padding: 5px;
    }

    .inline-block-demo {
      display: inline-block;
      background-color: #2ecc71;
      color: white;
      padding: 10px 20px;
      width: 150px;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>displayプロパティの比較</h1>

  <h2>block</h2>
  <div class="block-demo">ブロック1</div>
  <div class="block-demo">ブロック2</div>
  <div class="block-demo">ブロック3</div>

  <h2>inline</h2>
  <span class="inline-demo">インライン1</span>
  <span class="inline-demo">インライン2</span>
  <span class="inline-demo">インライン3</span>

  <h2>inline-block</h2>
  <div class="inline-block-demo">IB 1</div>
  <div class="inline-block-demo">IB 2</div>
  <div class="inline-block-demo">IB 3</div>
</body>
</html>
```

ブラウザで開いて、それぞれの並び方の違いを確認しましょう。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| `block` | 1行を占有。widthを指定できる |
| `inline` | 横に並ぶ。widthを指定できない |
| `inline-block` | 横に並ぶ + widthを指定できる |
| `none` | 完全に非表示 |
| デフォルト | 要素ごとにblockかinlineが決まっている |

### チェックリスト
- [ ] block, inline, inline-block の違いを説明できる
- [ ] 代表的なブロック要素を3つ挙げられる
- [ ] 代表的なインライン要素を3つ挙げられる
- [ ] inline-block の使いどころを理解した
- [ ] 実際にdisplayプロパティを変更して違いを確認した

---

## 次のステップへ

displayの基本が分かりました。次は、現代のCSSレイアウトの主役「Flexbox」を学びましょう。これを覚えると、レイアウトが自由自在になります。

---

*推定読了時間: 30分*
