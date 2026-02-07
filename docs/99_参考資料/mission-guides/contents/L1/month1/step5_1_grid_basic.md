# CSS Gridの基本

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 5
subStep: 1
title: "CSS Gridの基本"
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

> 「L0で Flexbox は覚えたよね？」佐藤先輩がデザインカンプを開いた。
>
> 「はい。横並びレイアウトなら Flexbox で作れます」
>
> 「じゃあこのレイアウトはどう作る？」
>
> 画面には、ヘッダー・サイドバー・メインコンテンツ・フッターが整然と並ぶダッシュボードが表示されている。
>
> 「Flexbox だけだと... ネストが深くなって複雑になりそうです」
>
> 「そこで CSS Grid だ。2次元レイアウトには Grid が圧倒的に強い」

---

## CSS Grid とは

CSS Grid は**2次元レイアウト**（行と列の両方）を制御するシステムです。

### Flexbox vs Grid

| 特性 | Flexbox | Grid |
|------|---------|------|
| 次元 | 1次元（行 or 列） | 2次元（行 と 列） |
| 用途 | ナビバー、カードの横並び | ページ全体、ダッシュボード |
| アイテム配置 | 順序に沿って配置 | 行・列を指定して自由に配置 |
| 使い分け | コンポーネント内 | ページ全体のレイアウト |

> **使い分けの目安**: ページの骨格は Grid、コンポーネント内は Flexbox

---

## Grid の基本

### Grid コンテナの作成

```css
.container {
    display: grid;
}
```

### 列の定義（grid-template-columns）

```css
.container {
    display: grid;
    /* 3列のグリッド */
    grid-template-columns: 200px 1fr 200px;
}
```

```html
<div class="container">
    <div>サイドバー左</div>
    <div>メインコンテンツ</div>
    <div>サイドバー右</div>
</div>
```

### 行の定義（grid-template-rows）

```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 100px auto 50px;
}
```

---

## fr 単位

`fr`（fraction）は、利用可能なスペースを分割する単位です。

```css
/* 3列を均等に分割 */
grid-template-columns: 1fr 1fr 1fr;

/* 左: 1/4, 中央: 2/4, 右: 1/4 */
grid-template-columns: 1fr 2fr 1fr;

/* 固定幅 + 残りを均等分割 */
grid-template-columns: 250px 1fr 1fr;
```

---

## gap -- アイテム間の余白

```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    /* 行間と列間を同時に設定 */
    gap: 20px;

    /* 行間と列間を別々に設定 */
    row-gap: 20px;
    column-gap: 10px;

    /* ショートハンド（行 列） */
    gap: 20px 10px;
}
```

---

## repeat() -- 繰り返し

```css
/* repeat(回数, サイズ) */

/* 3列の均等分割（上と同じ） */
grid-template-columns: repeat(3, 1fr);

/* 4列の200px固定 */
grid-template-columns: repeat(4, 200px);

/* パターンの繰り返し */
grid-template-columns: repeat(3, 1fr 2fr);
/* → 1fr 2fr 1fr 2fr 1fr 2fr の6列 */
```

---

## 実践例1: 基本的な3列レイアウト

```html
<div class="page-layout">
    <header>ヘッダー</header>
    <nav>ナビ</nav>
    <main>メインコンテンツ</main>
    <aside>サイドバー</aside>
    <footer>フッター</footer>
</div>
```

```css
.page-layout {
    display: grid;
    grid-template-columns: 200px 1fr 250px;
    grid-template-rows: 60px 1fr 40px;
    gap: 10px;
    min-height: 100vh;
}

header {
    grid-column: 1 / -1;   /* 全列に広がる */
}

footer {
    grid-column: 1 / -1;   /* 全列に広がる */
}
```

### grid-column / grid-row

```css
/* 開始ライン / 終了ライン */
grid-column: 1 / 3;     /* 1列目から3列目の手前まで（2列分） */
grid-column: 1 / -1;    /* 1列目から最後まで */
grid-column: span 2;    /* 2列分の幅 */

grid-row: 1 / 3;        /* 1行目から3行目の手前まで */
```

---

## 実践例2: カードグリッド

```html
<div class="card-grid">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
    <div class="card">Card 4</div>
    <div class="card">Card 5</div>
    <div class="card">Card 6</div>
</div>
```

```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
}

.card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

---

## アイテムの配置

### justify-items / align-items（セル内でのアイテム配置）

```css
.container {
    display: grid;
    grid-template-columns: repeat(3, 200px);

    /* 水平方向（セル内） */
    justify-items: start;   /* 左寄せ */
    justify-items: center;  /* 中央 */
    justify-items: end;     /* 右寄せ */
    justify-items: stretch; /* 伸張（デフォルト） */

    /* 垂直方向（セル内） */
    align-items: start;
    align-items: center;
    align-items: end;
    align-items: stretch;

    /* ショートハンド */
    place-items: center center;  /* align justify */
}
```

### justify-content / align-content（グリッド全体の配置）

```css
.container {
    display: grid;
    grid-template-columns: repeat(3, 200px);
    height: 100vh;

    /* グリッド全体の水平配置 */
    justify-content: center;
    justify-content: space-between;
    justify-content: space-around;

    /* グリッド全体の垂直配置 */
    align-content: center;
    align-content: space-between;
}
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| display: grid | Grid コンテナの作成 |
| grid-template-columns/rows | 列・行の定義 |
| fr 単位 | 利用可能スペースの分割 |
| gap | アイテム間の余白 |
| repeat() | パターンの繰り返し |
| grid-column/row | アイテムの配置範囲指定 |

### チェックリスト

- [ ] display: grid で Grid コンテナを作れる
- [ ] grid-template-columns で列を定義できる
- [ ] fr 単位の動作を理解した
- [ ] gap でアイテム間の余白を設定できる
- [ ] grid-column で複数列にまたがるアイテムを作れる

---

## 次のステップへ

CSS Grid の基本を学びました。

次のセクションでは、Grid のより高度な機能を学びます。
grid-area、名前付きライン、auto-fill/auto-fit など、実践的なレイアウトパターンです。

---

*推定読了時間: 30分*
