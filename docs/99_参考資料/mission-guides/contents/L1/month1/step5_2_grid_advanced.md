# 高度なGridレイアウト

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 5
subStep: 2
title: "高度なGridレイアウト"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「基本的な Grid レイアウトが作れるようになったな」
>
> 佐藤先輩がブラウザのウィンドウサイズを変え始めた。
>
> 「でも、これだとスマホで見るとどうなる？」
>
> 画面が小さくなると、3列レイアウトがはみ出した。
>
> 「Grid には auto-fill や minmax() という"レスポンシブの魔法"がある。
> メディアクエリなしでレスポンシブを実現できるんだ」

---

## grid-template-areas -- エリア名でレイアウト

`grid-template-areas` を使うと、レイアウトを「見たまま」に記述できます。

```css
.page {
    display: grid;
    grid-template-areas:
        "header header header"
        "nav    main   aside"
        "footer footer footer";
    grid-template-columns: 200px 1fr 250px;
    grid-template-rows: 60px 1fr 50px;
    gap: 10px;
    min-height: 100vh;
}

header { grid-area: header; }
nav    { grid-area: nav; }
main   { grid-area: main; }
aside  { grid-area: aside; }
footer { grid-area: footer; }
```

### レスポンシブ対応

```css
/* モバイル: 1列レイアウト */
@media (max-width: 768px) {
    .page {
        grid-template-areas:
            "header"
            "nav"
            "main"
            "aside"
            "footer";
        grid-template-columns: 1fr;
        grid-template-rows: auto;
    }
}
```

> `grid-template-areas` の利点は、レイアウト構造がコード上で視覚的に把握できることです。

---

## minmax() -- 最小・最大サイズの指定

```css
/* 最小200px、最大1fr */
grid-template-columns: minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr);

/* 固定サイドバー + 可変メイン */
grid-template-columns: minmax(200px, 250px) minmax(400px, 1fr);

/* 行の高さ */
grid-template-rows: minmax(100px, auto);
```

---

## auto-fill と auto-fit -- 自動レスポンシブ

### auto-fill

利用可能なスペースに、指定サイズの列を自動で可能な限り詰め込みます。

```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}
```

この設定だけで以下の動作が実現します：

- 画面幅1200px → 3列（300px以上の3列）
- 画面幅800px → 2列
- 画面幅400px → 1列

**メディアクエリなしで自動レスポンシブ！**

### auto-fill vs auto-fit

| 特性 | auto-fill | auto-fit |
|------|-----------|----------|
| 空きスペース | 空のトラックを維持 | 空のトラックを折り畳む |
| アイテムが少ない場合 | 列幅を維持 | アイテムが伸びる |

```css
/* auto-fill: アイテムが3つでも、スペースがあれば空列を保持 */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* auto-fit: アイテムが3つなら、残りスペースを分け合う */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

> **使い分け**: 通常は `auto-fit` を使い、アイテムがスペースいっぱいに広がるようにします。

---

## 名前付きライン

グリッドラインに名前を付けて、配置を分かりやすくできます。

```css
.layout {
    display: grid;
    grid-template-columns:
        [sidebar-start] 250px
        [sidebar-end main-start] 1fr
        [main-end];
    grid-template-rows:
        [header-start] 60px
        [header-end content-start] 1fr
        [content-end footer-start] 50px
        [footer-end];
}

.header {
    grid-column: sidebar-start / main-end;
    grid-row: header-start / header-end;
}

.sidebar {
    grid-column: sidebar-start / sidebar-end;
    grid-row: content-start / content-end;
}
```

---

## 実践パターン集

### パターン1: ダッシュボードレイアウト

```css
.dashboard {
    display: grid;
    grid-template-areas:
        "header header header"
        "sidebar main stats"
        "sidebar footer footer";
    grid-template-columns: 250px 1fr 300px;
    grid-template-rows: 64px 1fr 48px;
    gap: 1px;
    min-height: 100vh;
    background: #e0e0e0;
}

.dashboard > * {
    background: #fff;
    padding: 16px;
}
```

### パターン2: マガジンレイアウト

```css
.magazine {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 200px);
    gap: 10px;
}

.featured {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
}

.secondary {
    grid-column: 3 / 5;
}
```

### パターン3: Holy Grail レイアウト

```css
.holy-grail {
    display: grid;
    grid-template:
        "header header header" auto
        "nav    main   aside"  1fr
        "footer footer footer" auto
        / 200px 1fr 200px;
    min-height: 100vh;
    gap: 8px;
}
```

`grid-template` はショートハンドで、areas, rows, columns を1つのプロパティで定義します。

---

## Grid と Flexbox の併用

実務では Grid と Flexbox を組み合わせて使います。

```css
/* ページ全体は Grid */
.page {
    display: grid;
    grid-template-areas:
        "header"
        "main"
        "footer";
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}

/* ヘッダー内はFlexbox */
header {
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

/* メインコンテンツ内のカードは Grid */
.card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    padding: 20px;
}

/* カード内はFlexbox */
.card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| grid-template-areas | エリア名で視覚的にレイアウト定義 |
| minmax() | 列・行の最小・最大サイズを指定 |
| auto-fill / auto-fit | メディアクエリなしで自動レスポンシブ |
| 名前付きライン | ラインに名前をつけて配置を分かりやすく |
| Grid + Flexbox | ページ構造は Grid、コンポーネント内は Flexbox |

### チェックリスト

- [ ] grid-template-areas でレイアウトを定義できる
- [ ] minmax() を使ったレスポンシブ列を作れる
- [ ] auto-fill と auto-fit の違いを説明できる
- [ ] Grid と Flexbox を適切に使い分けられる

---

## 次のステップへ

高度なGrid レイアウトを学びました。

次のセクションでは、CSSアニメーションを学びます。
transition、transform、@keyframes でWebサイトに動きを加えましょう。

---

*推定読了時間: 30分*
