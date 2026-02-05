# セレクタを使い分けよう

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 4
subStep: 2
title: "セレクタを使い分けよう"
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

> 先輩「CSSの基本構文は覚えたね。でも `h1` みたいにタグ名だけだと、すべての `h1` に同じスタイルが当たるよね」
>
> 特定の段落だけ色を変えたい場合はどうすればいいんですか？
>
> 先輩「そこでセレクタの使い分けが重要になるんだ。class と id を覚えよう」

---

## セレクタとは

CSSで「**どの要素にスタイルを当てるか**」を指定する部分がセレクタです。

```css
セレクタ {
  プロパティ: 値;
}
```

---

## 要素セレクタ

タグ名で指定します。**そのタグすべて** にスタイルが当たります。

```css
p {
  color: #333;
}

h2 {
  color: #3498db;
}
```

---

## classセレクタ

特定のグループに **共通のスタイル** を当てます。

### HTMLで class を設定

```html
<p class="highlight">この段落を強調表示します。</p>
<p>この段落は通常です。</p>
<p class="highlight">こちらも強調表示です。</p>
```

### CSSで `.クラス名` で指定

```css
.highlight {
  color: red;
  font-weight: bold;
}
```

| ポイント | 説明 |
|----------|------|
| HTML側 | `class="クラス名"` を付ける |
| CSS側 | `.クラス名` で指定（ドット始まり） |
| 特徴 | **複数の要素** に同じクラスを付けられる |

### 複数のclassを付ける

```html
<p class="highlight large">大きくて赤い文字</p>
```

```css
.highlight {
  color: red;
}

.large {
  font-size: 24px;
}
```

スペースで区切って、複数のクラスを1つの要素に付けられます。

---

## idセレクタ

**1つだけの要素** を特定して指定します。

### HTMLで id を設定

```html
<h1 id="site-title">山田太郎のサイト</h1>
```

### CSSで `#id名` で指定

```css
#site-title {
  color: #2c3e50;
  font-size: 36px;
}
```

| ポイント | 説明 |
|----------|------|
| HTML側 | `id="ID名"` を付ける |
| CSS側 | `#ID名` で指定（シャープ始まり） |
| 特徴 | **1ページに1つだけ**（同じidは使えない） |

---

## class と id の使い分け

| 種類 | 記号 | 用途 | 繰り返し |
|------|------|------|----------|
| class | `.` | 複数の要素に共通スタイル | 何度でも使える |
| id | `#` | 1つの要素を特定 | ページ内で1回だけ |

```html
<!-- class: 複数の要素に使える -->
<p class="info">情報1</p>
<p class="info">情報2</p>

<!-- id: 1つだけ -->
<header id="main-header">...</header>
```

> 先輩「基本は class を使う。id はページ内リンクのターゲットなど、本当に1つだけの場合に使うよ」

---

## 子孫セレクタ

ネストした要素を指定するセレクタです。

```css
/* nav の中の a タグだけに適用 */
nav a {
  color: white;
  text-decoration: none;
}
```

```html
<nav>
  <a href="index.html">ホーム</a>  <!-- スタイルが当たる -->
  <a href="about.html">自己紹介</a>  <!-- スタイルが当たる -->
</nav>

<p>
  <a href="example.com">外部リンク</a>  <!-- スタイルは当たらない -->
</p>
```

スペースで区切ることで、「〇〇の中の△△」を指定できます。

---

## セレクタの優先順位（詳細度）

同じ要素に複数のスタイルが当たる場合、**より具体的なセレクタが優先** されます。

```
要素セレクタ (p)     < classセレクタ (.info) < idセレクタ (#main)
     低い                                         高い
```

### 例

```css
p { color: black; }         /* 全てのp */
.highlight { color: red; }  /* classが優先 */
#special { color: blue; }   /* idが最も優先 */
```

```html
<p id="special" class="highlight">何色？</p>
<!-- → 青色（idが最も優先されるため） -->
```

---

## 実践：セレクタを使い分けよう

### style.css

```css
/* 要素セレクタ */
body {
  font-family: sans-serif;
  color: #333;
}

h1 {
  color: #2c3e50;
}

/* classセレクタ */
.section-title {
  color: #3498db;
  border-bottom: 2px solid #3498db;
}

.highlight {
  color: #e74c3c;
  font-weight: bold;
}

.info-text {
  color: #7f8c8d;
  font-size: 14px;
}

/* idセレクタ */
#main-header {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
}

/* 子孫セレクタ */
nav a {
  color: #3498db;
}
```

### HTML

```html
<header id="main-header">
  <h1>山田太郎のサイト</h1>
  <nav>
    <a href="index.html">ホーム</a> |
    <a href="about.html">自己紹介</a>
  </nav>
</header>

<main>
  <h2 class="section-title">プロフィール</h2>
  <p>私は<span class="highlight">Web開発</span>を学んでいます。</p>
  <p class="info-text">最終更新: 2025年5月</p>
</main>
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 要素セレクタ | タグ名で指定（`p`, `h1`） |
| classセレクタ | `.クラス名` で指定（複数に使える） |
| idセレクタ | `#ID名` で指定（1つだけ） |
| 子孫セレクタ | スペース区切りで入れ子を指定 |
| 優先順位 | 要素 < class < id |
| 基本方針 | class を中心に使う |

### チェックリスト
- [ ] 要素セレクタ、classセレクタ、idセレクタを使い分けられる
- [ ] HTMLで class と id を設定できる
- [ ] CSSで `.` と `#` の違いを理解した
- [ ] 子孫セレクタの書き方を理解した
- [ ] セレクタの優先順位を理解した

---

## 次のステップへ

セレクタの使い分けが分かりました。次は、色とフォントの設定方法を学んで、ページをもっと魅力的にしていきましょう。

---

*推定読了時間: 30分*
