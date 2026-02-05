# 色とフォントを設定しよう

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 4
subStep: 3
title: "色とフォントを設定しよう"
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

> 先輩「セレクタが使えるようになったら、次はデザインの要、色とフォントだ」
>
> 色って `red` とか `blue` って書けばいいんですか？
>
> 先輩「それも使えるけど、プロはもっと細かい色指定を使うんだ。16進数カラーコードっていうのを覚えよう」

---

## 文字色（color）

```css
p {
  color: red;              /* 色名 */
  color: #ff0000;          /* 16進数（同じ赤） */
  color: rgb(255, 0, 0);   /* RGB（同じ赤） */
}
```

---

## 色の指定方法

### 方法1: 色名

```css
color: red;
color: blue;
color: green;
color: navy;
color: gray;
```

よく使う色名:

| 色名 | 色 |
|------|-----|
| `black` | 黒 |
| `white` | 白 |
| `red` | 赤 |
| `blue` | 青 |
| `green` | 緑 |
| `gray` | 灰色 |
| `navy` | 紺 |
| `orange` | オレンジ |

### 方法2: 16進数カラーコード（推奨）

`#` + 6桁の16進数で色を指定します。

```css
color: #333333;  /* 濃い灰色 */
color: #3498db;  /* 明るい青 */
color: #e74c3c;  /* 赤 */
color: #2ecc71;  /* 緑 */
```

| 形式 | 説明 |
|------|------|
| `#RRGGBB` | R=赤、G=緑、B=青（00〜FF） |
| `#333` | `#333333` の省略形 |
| `#000` | 黒（`#000000`） |
| `#fff` | 白（`#ffffff`） |

### 方法3: RGB

```css
color: rgb(52, 152, 219);    /* 明るい青 */
color: rgba(0, 0, 0, 0.5);   /* 50%透明の黒 */
```

`rgba` の `a` はアルファ値（透明度）です。0が完全透明、1が不透明です。

---

## 背景色（background-color）

```css
body {
  background-color: #f5f5f5;  /* 薄い灰色 */
}

header {
  background-color: #2c3e50;  /* 濃い紺色 */
  color: white;               /* 文字は白 */
}

.highlight {
  background-color: #fff3cd;  /* 薄い黄色 */
}
```

---

## おすすめの配色

### 読みやすい配色の基本

| ルール | 説明 |
|--------|------|
| コントラスト | 背景と文字の色差を十分に取る |
| 使う色は3色まで | メインカラー + サブカラー + アクセントカラー |
| 白い背景に濃い文字 | 最も読みやすい組み合わせ |

### よく使われる配色例

```css
/* パターン1: クリーンな青系 */
body { background-color: #f8f9fa; color: #333; }
h1 { color: #2c3e50; }
a { color: #3498db; }

/* パターン2: 温かいオレンジ系 */
body { background-color: #fff8f0; color: #333; }
h1 { color: #d35400; }
a { color: #e67e22; }
```

---

## フォント（font-family）

```css
body {
  font-family: "Helvetica Neue", Arial, sans-serif;
}
```

### フォントの指定ルール

1. **複数のフォントをカンマ区切りで指定**（フォールバック）
2. 最後に **総称ファミリー** を指定

```css
font-family: "第1候補", "第2候補", 総称ファミリー;
```

### 総称ファミリー

| 総称 | 特徴 | 例 |
|------|------|-----|
| `sans-serif` | ゴシック体（角ばった文字） | Arial, メイリオ |
| `serif` | 明朝体（はね・はらいがある） | Times, 游明朝 |
| `monospace` | 等幅フォント（コード用） | Courier, Consolas |

> 先輩「日本語サイトなら `sans-serif` が一般的。読みやすいからね」

---

## フォントサイズ（font-size）

```css
h1 { font-size: 32px; }
h2 { font-size: 24px; }
p  { font-size: 16px; }
small { font-size: 14px; }
```

| 単位 | 説明 |
|------|------|
| `px` | ピクセル（固定サイズ） |
| `em` | 親要素のフォントサイズに対する倍率 |
| `rem` | ルート要素のフォントサイズに対する倍率 |

初心者は **px** を使えばOKです。

---

## フォントの太さ（font-weight）

```css
p { font-weight: normal; }      /* 通常 (400) */
strong { font-weight: bold; }   /* 太字 (700) */
h1 { font-weight: 300; }        /* 細い */
```

| 値 | 意味 |
|----|------|
| `normal` / `400` | 通常の太さ |
| `bold` / `700` | 太字 |
| `100` 〜 `900` | 数値で細かく指定 |

---

## 行間（line-height）

```css
p {
  line-height: 1.8;  /* フォントサイズの1.8倍 */
}
```

行間を広くすると **読みやすく** なります。日本語では `1.6` 〜 `1.8` が推奨です。

---

## Google Fontsの使い方

Google Fonts を使うと、おしゃれなフォントを無料で使えます。

### 手順1: HTMLに読み込み用タグを追加

```html
<head>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
</head>
```

### 手順2: CSSで指定

```css
body {
  font-family: "Noto Sans JP", sans-serif;
}
```

おすすめの日本語フォント:
- **Noto Sans JP**: すっきりしたゴシック体
- **Noto Serif JP**: 美しい明朝体

---

## まとめ

| ポイント | 内容 |
|----------|------|
| `color` | 文字色の指定 |
| `background-color` | 背景色の指定 |
| 色の指定方法 | 色名、16進数（#333）、rgb() |
| `font-family` | フォントの指定 |
| `font-size` | 文字サイズ（px が基本） |
| `font-weight` | 太さ（normal / bold） |
| `line-height` | 行間（1.6〜1.8推奨） |

### チェックリスト
- [ ] 16進数カラーコードの書き方を理解した
- [ ] `color` と `background-color` を使い分けられる
- [ ] `font-family` で複数のフォントを指定できる
- [ ] `font-size`, `font-weight`, `line-height` を設定できる
- [ ] Google Fontsの使い方を知った

---

## 次のステップへ

色とフォントが設定できるようになりました。次は、CSSの最も重要な概念の一つ「ボックスモデル」を学びましょう。

---

*推定読了時間: 30分*
