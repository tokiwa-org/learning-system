# HTMLの基本構造

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 1
subStep: 2
title: "HTMLの基本構造"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 先輩「HTMLが何か分かったところで、実際のHTMLファイルを見てみよう」
>
> HTMLファイルって、どんな構造になっているんですか？
>
> 先輩「HTMLにはお決まりの『型』があるんだ。まずはその基本構造を覚えよう」

---

## HTMLファイルの基本構造

すべてのHTMLファイルは、以下の基本構造を持っています。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ページのタイトル</title>
</head>
<body>
  ここに表示したい内容を書く
</body>
</html>
```

これが **HTMLの最小構成** です。どんなWebページでも、この構造がベースになっています。

---

## 各パーツの役割

### `<!DOCTYPE html>`

```html
<!DOCTYPE html>
```

- 「このファイルはHTML5で書かれています」という宣言
- **必ず1行目に書く**
- これがないと、ブラウザが正しく表示できないことがある

### `<html lang="ja">`

```html
<html lang="ja">
  ...
</html>
```

- HTMLドキュメント全体を囲む **ルート要素**
- `lang="ja"` は「このページは日本語です」という指定
- 英語のページなら `lang="en"` にする

### `<head>` - ページの設定情報

```html
<head>
  <meta charset="UTF-8">
  <title>ページのタイトル</title>
</head>
```

- **画面には表示されない** 裏方の情報
- ページの設定や、ブラウザへの指示を書く場所

| 要素 | 役割 |
|------|------|
| `<meta charset="UTF-8">` | 文字コードの指定（日本語を正しく表示） |
| `<title>` | ブラウザのタブに表示されるタイトル |

### `<body>` - ページの表示内容

```html
<body>
  ここに表示したい内容を書く
</body>
```

- **画面に表示される内容** をすべてここに書く
- テキスト、画像、リンクなど、見えるものはすべて `<body>` の中

---

## 図で理解する構造

```
HTMLファイル
├── <!DOCTYPE html>  ... HTML5宣言
└── <html>           ... ルート要素
    ├── <head>       ... 設定情報（見えない）
    │   ├── <meta>   ... 文字コード
    │   └── <title>  ... タブのタイトル
    └── <body>       ... 表示内容（見える）
        └── ...      ... ここにコンテンツ
```

> 先輩「headは『裏方』、bodyは『表舞台』と覚えるといいよ」

---

## 実際にファイルを作ってみよう

### 手順1: ファイルを作成する

テキストエディタ（VS Codeなど）を開いて、新しいファイルを作ります。

ファイル名: **`hello.html`**

### 手順2: 基本構造を書く

以下のコードを入力してください。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>はじめてのHTML</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>これは私の最初のWebページです。</p>
</body>
</html>
```

### 手順3: ブラウザで開く

1. 保存したファイルをダブルクリック
2. ブラウザが開いて、ページが表示される

画面に以下のように表示されるはずです。

```
Hello, World!
これは私の最初のWebページです。
```

> おおっ！ たったこれだけのコードでWebページが作れた！

---

## `<head>`に書けるもの

基本構造に加えて、`<head>` にはさまざまな設定を追加できます。

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ページの説明文">
  <title>ページのタイトル</title>
  <link rel="stylesheet" href="style.css">
</head>
```

| 要素 | 役割 |
|------|------|
| `meta charset` | 文字コードの指定 |
| `meta viewport` | スマホ対応の設定 |
| `meta description` | 検索結果に表示される説明文 |
| `title` | タブに表示されるタイトル |
| `link` | CSSファイルの読み込み（後のステップで学びます） |

今の段階では `charset` と `title` だけ覚えておけばOKです。

---

## よくあるミス

| ミス | 症状 | 対処法 |
|------|------|--------|
| `<!DOCTYPE html>` を忘れる | 表示が崩れることがある | 必ず1行目に書く |
| `<meta charset="UTF-8">` を忘れる | 日本語が文字化けする | `<head>` 内に必ず書く |
| `</html>` を忘れる | 表示は問題ないが正しくない | 閉じタグを忘れない |
| ファイル名に日本語を使う | エラーの原因になる | 英数字のみ使う |
| 拡張子が `.html` でない | ブラウザで開けない | `.html` で保存する |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 基本構造 | DOCTYPE → html → head + body |
| head | 画面に見えない設定情報 |
| body | 画面に表示される内容 |
| charset | UTF-8で日本語対応 |
| title | ブラウザのタブに表示される |

### チェックリスト
- [ ] HTMLの基本構造（DOCTYPE, html, head, body）を書ける
- [ ] headとbodyの違いを説明できる
- [ ] hello.htmlを作成してブラウザで表示できた
- [ ] meta charsetの役割を理解した

---

## 次のステップへ

HTMLの基本構造が分かりました。次は、HTMLの中心的な仕組みである「タグ」について詳しく学んでいきましょう。

---

*推定読了時間: 25分*
