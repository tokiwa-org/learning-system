# セマンティックHTMLを使おう

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 3
subStep: 3
title: "セマンティックHTMLを使おう"
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

> 先輩「ここまでのページ、全部 `<div>` や `<p>` で書くこともできるんだけど、もっと良い方法があるんだ」
>
> もっと良い方法？
>
> 先輩「セマンティックHTMLっていって、タグ自体に意味を持たせるやり方だよ。HTML5で追加されたタグなんだ」

---

## セマンティックHTMLとは

**セマンティック（Semantic）** は「意味のある」という意味です。

### 非セマンティックなタグ

```html
<div>ヘッダー</div>
<div>ナビゲーション</div>
<div>メインコンテンツ</div>
<div>フッター</div>
```

`<div>` だけでは、何の役割か分かりません。

### セマンティックなタグ

```html
<header>ヘッダー</header>
<nav>ナビゲーション</nav>
<main>メインコンテンツ</main>
<footer>フッター</footer>
```

タグ名を見ただけで、その部分の **役割が分かります**。

---

## 主要なセマンティックタグ

| タグ | 役割 | 使う場所 |
|------|------|----------|
| `<header>` | ページやセクションのヘッダー | サイト名、ロゴ、ナビゲーション |
| `<nav>` | ナビゲーション | メニュー、リンク集 |
| `<main>` | メインコンテンツ | ページの主要な内容 |
| `<section>` | テーマ別のセクション | 各コンテンツブロック |
| `<article>` | 独立したコンテンツ | ブログ記事、ニュース |
| `<aside>` | 補足情報 | サイドバー、関連リンク |
| `<footer>` | ページやセクションのフッター | 著作権、連絡先 |

---

## ページ構造の例

```html
<body>
  <header>
    <h1>山田太郎のポートフォリオ</h1>
    <nav>
      <a href="#profile">プロフィール</a>
      <a href="#skills">スキル</a>
      <a href="#contact">連絡先</a>
    </nav>
  </header>

  <main>
    <section id="profile">
      <h2>プロフィール</h2>
      <p>自己紹介文...</p>
    </section>

    <section id="skills">
      <h2>スキル</h2>
      <ul>
        <li>HTML</li>
        <li>CSS</li>
      </ul>
    </section>

    <section id="contact">
      <h2>連絡先</h2>
      <p>メール: taro@example.com</p>
    </section>
  </main>

  <footer>
    <p>&copy; 2025 山田太郎</p>
  </footer>
</body>
```

---

## 構造図

```
<body>
├── <header>          ... ページ上部
│   ├── <h1>          ... サイト名
│   └── <nav>         ... ナビゲーション
├── <main>            ... メインコンテンツ
│   ├── <section>     ... セクション1
│   ├── <section>     ... セクション2
│   └── <section>     ... セクション3
└── <footer>          ... ページ下部
```

---

## `<div>` と `<section>` の使い分け

| タグ | 使う場面 |
|------|----------|
| `<section>` | テーマや意味でまとまったブロック |
| `<article>` | 独立して成り立つコンテンツ |
| `<div>` | 意味はないがグループ化したいとき（CSS用） |

```html
<!-- section: 意味のあるまとまり -->
<section>
  <h2>スキル一覧</h2>
  <p>...</p>
</section>

<!-- div: CSSのためのグループ化 -->
<div class="container">
  <p>レイアウト用のラッパー</p>
</div>
```

> 先輩「迷ったら `<section>` を使ってみて。見出し（h2など）が付くなら `<section>` が適切なことが多いよ」

---

## セマンティックHTMLのメリット

| メリット | 説明 |
|----------|------|
| アクセシビリティ | スクリーンリーダーがページ構造を正しく読み上げる |
| SEO | 検索エンジンがページ内容を理解しやすくなる |
| 読みやすさ | コードを見ただけで構造が分かる |
| メンテナンス性 | チームで開発するとき、理解しやすい |

---

## `<div>` との比較

### Before（divのみ）

```html
<div id="header">
  <div id="nav">...</div>
</div>
<div id="main">
  <div class="section">...</div>
  <div class="section">...</div>
</div>
<div id="footer">...</div>
```

### After（セマンティックHTML）

```html
<header>
  <nav>...</nav>
</header>
<main>
  <section>...</section>
  <section>...</section>
</main>
<footer>...</footer>
```

どちらもブラウザでの見た目は同じですが、セマンティックHTMLの方が **コードの意味が明確** です。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| セマンティック | タグに意味を持たせる |
| `<header>` | ページの上部（ロゴ、ナビ） |
| `<nav>` | ナビゲーション |
| `<main>` | メインコンテンツ（1ページ1つ） |
| `<section>` | テーマ別のセクション |
| `<footer>` | ページの下部（著作権など） |
| `<div>` | 意味なし。CSS用のグループ化 |

### チェックリスト
- [ ] セマンティックHTMLの意味を説明できる
- [ ] `<header>`, `<nav>`, `<main>`, `<footer>` を使い分けられる
- [ ] `<section>` と `<div>` の違いを理解した
- [ ] セマンティックHTMLのメリットを3つ挙げられる

---

## 次のステップへ

セマンティックHTMLでページの構造がより明確になりました。次は、ユーザーからの入力を受け取る「フォーム」の基本を学びましょう。

---

*推定読了時間: 30分*
