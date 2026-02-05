# レスポンシブデザインの基本

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 5
subStep: 3
title: "レスポンシブデザインの基本"
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

> 先輩「作ったサイト、スマホで見てみた？」
>
> あ、まだ見てないです...（スマホで確認）うわ、文字が小さくて読みにくい！
>
> 先輩「そうなるよね。パソコンだけじゃなく、スマホやタブレットでも見やすくするのがレスポンシブデザインだよ」

---

## レスポンシブデザインとは

**画面サイズに応じて、レイアウトを自動的に調整する** デザイン手法です。

| デバイス | 画面幅の目安 |
|----------|-------------|
| スマートフォン | 〜767px |
| タブレット | 768px〜1023px |
| パソコン | 1024px〜 |

1つのHTMLファイルで、すべてのデバイスに対応できます。

---

## viewport メタタグ

レスポンシブデザインの **第一歩** です。

```html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
```

| 属性 | 意味 |
|------|------|
| `width=device-width` | 画面幅をデバイスの幅に合わせる |
| `initial-scale=1.0` | 初期ズームを100%にする |

> 先輩「これがないと、スマホでもPC用の幅で表示されて、すべてが小さく見えるんだ。必ず入れよう」

---

## メディアクエリ

**画面幅に応じてCSSを切り替える** 仕組みです。

```css
/* 基本スタイル（全画面共通） */
body {
  font-size: 16px;
}

/* 画面幅が768px以下のとき（スマホ・タブレット） */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
}
```

### 書き方

```css
@media (条件) {
  /* 条件に合うときだけ適用されるCSS */
}
```

### よく使う条件

| 条件 | 意味 |
|------|------|
| `max-width: 768px` | 画面幅が768px **以下** |
| `min-width: 769px` | 画面幅が769px **以上** |
| `max-width: 480px` | 画面幅が480px **以下**（スマホ） |

---

## モバイルファーストアプローチ

**スマホ用のスタイルを先に書き、大きい画面用を後で追加する** 方法です。

```css
/* === モバイル（デフォルト） === */
.container {
  padding: 10px;
}

nav {
  display: flex;
  flex-direction: column;  /* スマホ: 縦並び */
  gap: 10px;
}

/* === タブレット以上 === */
@media (min-width: 768px) {
  .container {
    padding: 20px;
  }

  nav {
    flex-direction: row;   /* タブレット: 横並び */
    gap: 20px;
  }
}

/* === パソコン === */
@media (min-width: 1024px) {
  .container {
    max-width: 1000px;
    margin: 0 auto;
  }
}
```

> 先輩「モバイルファーストは現代のスタンダード。スマホユーザーが多いからね」

---

## レスポンシブでよく使うテクニック

### テクニック1: 画像を画面幅に合わせる

```css
img {
  max-width: 100%;
  height: auto;
}
```

これで画像が画面からはみ出すことがなくなります。

### テクニック2: Flexboxの折り返し

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1;
  min-width: 250px;  /* 最低250px。それ以下なら折り返す */
}
```

### テクニック3: ナビゲーションの切り替え

```css
/* スマホ: 縦並び */
nav {
  display: flex;
  flex-direction: column;
  text-align: center;
}

/* PC: 横並び */
@media (min-width: 768px) {
  nav {
    flex-direction: row;
    justify-content: center;
  }
}
```

---

## 開発者ツールでレスポンシブ確認

ブラウザの開発者ツールでスマホ表示を確認できます。

### 手順

1. F12 で開発者ツールを開く
2. **デバイスツールバー** アイコンをクリック（スマホとタブレットのアイコン）
3. 上部のドロップダウンでデバイスを選択

```
iPhone 14     → 390px
iPad          → 768px
MacBook       → 1440px
```

> 先輩「実機がなくても開発者ツールで確認できるよ。こまめにチェックしよう」

---

## 実践：レスポンシブ対応のスタイル

```css
/* ===== モバイルファースト ===== */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

img {
  max-width: 100%;
  height: auto;
}

/* ヘッダー */
header {
  background-color: #2c3e50;
  color: white;
  padding: 15px;
  text-align: center;
}

/* ナビ: モバイルは縦並び */
nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

nav a {
  color: #ecf0f1;
  text-decoration: none;
}

/* メイン */
main {
  padding: 15px;
}

section {
  background-color: white;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}

/* ===== タブレット以上 ===== */
@media (min-width: 768px) {
  nav {
    flex-direction: row;
    justify-content: center;
    gap: 20px;
  }

  main {
    max-width: 800px;
    margin: 20px auto;
    padding: 0 20px;
  }

  section {
    padding: 25px;
    margin-bottom: 20px;
  }
}
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| レスポンシブ | 画面サイズに応じてレイアウトを変える |
| viewport | `<meta name="viewport">` を必ず入れる |
| メディアクエリ | `@media (条件) { ... }` でCSS切り替え |
| モバイルファースト | スマホ用を先に書き、PCを後で追加 |
| max-width: 100% | 画像をはみ出させない |
| 開発者ツール | デバイスツールバーでスマホ表示確認 |

### チェックリスト
- [ ] viewport メタタグの役割を理解した
- [ ] メディアクエリの書き方を覚えた
- [ ] モバイルファーストアプローチの考え方を理解した
- [ ] 画像の `max-width: 100%` の効果を理解した
- [ ] 開発者ツールでスマホ表示を確認できる

---

## 次のステップへ

レスポンシブデザインの基本が分かりました。次の演習では、ここまで学んだレイアウト技術をすべて使って、自己紹介ページのレイアウトを整えましょう。

---

*推定読了時間: 30分*
