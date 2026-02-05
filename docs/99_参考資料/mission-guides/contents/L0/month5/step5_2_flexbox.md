# Flexboxでレイアウトしよう

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 5
subStep: 2
title: "Flexboxでレイアウトしよう"
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

> 先輩「CSSレイアウトの最強ツール、Flexboxを教えよう」
>
> フレックスボックス？
>
> 先輩「要素を横に並べたり、中央揃えしたり、均等配置したり。レイアウトの悩みの9割はFlexboxで解決するよ」

---

## Flexboxとは

**Flexbox**（Flexible Box Layout）は、要素を柔軟に配置するためのCSSレイアウト手法です。

### 基本の使い方

親要素に `display: flex` を指定するだけです。

```css
.container {
  display: flex;
}
```

```html
<div class="container">
  <div>アイテム1</div>
  <div>アイテム2</div>
  <div>アイテム3</div>
</div>
```

これだけで、子要素が **横に並びます**。

---

## Flexboxの2つの役割

| 要素 | 名前 | 役割 |
|------|------|------|
| 親要素 | **Flexコンテナ** | `display: flex` を指定する要素 |
| 子要素 | **Flexアイテム** | コンテナの中の要素 |

```
Flexコンテナ（display: flex）
┌──────────────────────────────┐
│ ┌────┐  ┌────┐  ┌────┐      │
│ │ 1  │  │ 2  │  │ 3  │      │ ← Flexアイテム
│ └────┘  └────┘  └────┘      │
└──────────────────────────────┘
```

---

## flex-direction（並ぶ方向）

```css
.container {
  display: flex;
  flex-direction: row;      /* 横並び（デフォルト） */
  flex-direction: column;   /* 縦並び */
}
```

| 値 | 方向 |
|----|------|
| `row` | 横並び（左→右）。デフォルト |
| `row-reverse` | 横並び（右→左） |
| `column` | 縦並び（上→下） |
| `column-reverse` | 縦並び（下→上） |

---

## justify-content（主軸の配置）

横並びの場合、**水平方向** の配置を制御します。

```css
.container {
  display: flex;
  justify-content: flex-start;    /* 左寄せ（デフォルト） */
  justify-content: center;        /* 中央 */
  justify-content: flex-end;      /* 右寄せ */
  justify-content: space-between; /* 均等配置（端に寄せる） */
  justify-content: space-around;  /* 均等配置（周囲に余白） */
  justify-content: space-evenly;  /* 完全均等 */
}
```

### 視覚的に理解

```
flex-start:      [1][2][3]
center:               [1][2][3]
flex-end:                      [1][2][3]
space-between:   [1]      [2]      [3]
space-around:     [1]    [2]    [3]
space-evenly:      [1]     [2]     [3]
```

---

## align-items（交差軸の配置）

横並びの場合、**垂直方向** の配置を制御します。

```css
.container {
  display: flex;
  align-items: stretch;     /* 高さを揃える（デフォルト） */
  align-items: flex-start;  /* 上揃え */
  align-items: center;      /* 中央揃え */
  align-items: flex-end;    /* 下揃え */
}
```

> 先輩「`justify-content` は横方向、`align-items` は縦方向。このセットで覚えよう」

---

## gap（アイテム間の間隔）

```css
.container {
  display: flex;
  gap: 20px;        /* アイテム間に20pxの間隔 */
  gap: 10px 20px;   /* 行間10px、列間20px */
}
```

`gap` を使うと、margin を使わずに均等なスペースを作れます。

---

## flex-wrap（折り返し）

```css
.container {
  display: flex;
  flex-wrap: nowrap;  /* 折り返さない（デフォルト） */
  flex-wrap: wrap;    /* 折り返す */
}
```

`wrap` にすると、コンテナの幅に収まらないアイテムが **次の行に折り返されます**。

---

## よく使うパターン

### パターン1: ナビゲーション

```css
nav {
  display: flex;
  justify-content: center;
  gap: 20px;
}
```

### パターン2: ヘッダー（ロゴ左、ナビ右）

```css
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### パターン3: カード並べ

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1;
  min-width: 250px;
}
```

### パターン4: 完全中央配置

```css
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

---

## 実践：Flexboxでレイアウトしよう

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Flexboxの練習</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; }

    /* ヘッダー: ロゴ左、ナビ右 */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #2c3e50;
      color: white;
      padding: 15px 30px;
    }

    /* ナビ: 横並び */
    nav {
      display: flex;
      gap: 20px;
    }

    nav a { color: #ecf0f1; text-decoration: none; }

    /* カード: 横並び＋折り返し */
    .cards {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding: 30px;
    }

    .card {
      flex: 1;
      min-width: 200px;
      background-color: white;
      border: 1px solid #ddd;
      padding: 20px;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <header>
    <h1>My Site</h1>
    <nav>
      <a href="#">ホーム</a>
      <a href="#">自己紹介</a>
      <a href="#">お問い合わせ</a>
    </nav>
  </header>

  <div class="cards">
    <div class="card">
      <h2>HTML</h2>
      <p>Webページの構造を作る言語</p>
    </div>
    <div class="card">
      <h2>CSS</h2>
      <p>Webページの見た目を整える言語</p>
    </div>
    <div class="card">
      <h2>JavaScript</h2>
      <p>Webページに動きを付ける言語</p>
    </div>
  </div>
</body>
</html>
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| `display: flex` | 親要素に指定して子を並べる |
| `flex-direction` | 並ぶ方向（row / column） |
| `justify-content` | 主軸の配置（center, space-between等） |
| `align-items` | 交差軸の配置（center, flex-start等） |
| `gap` | アイテム間の間隔 |
| `flex-wrap` | 折り返しの有無 |

### チェックリスト
- [ ] `display: flex` で子要素を横並びにできる
- [ ] `justify-content` で水平方向の配置を変えられる
- [ ] `align-items` で垂直方向の配置を変えられる
- [ ] `gap` でアイテム間の間隔を設定できる
- [ ] ヘッダーやカードのレイアウトをFlexboxで作れる

---

## 次のステップへ

Flexboxでレイアウトが自在にできるようになりました。次は、スマホでも見やすい「レスポンシブデザイン」の基本を学びましょう。

---

*推定読了時間: 30分*
