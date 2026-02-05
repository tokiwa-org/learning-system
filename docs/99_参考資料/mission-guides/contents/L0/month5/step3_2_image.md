# 画像を表示しよう

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 3
subStep: 2
title: "画像を表示しよう"
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

> 先輩「テキストだけのページは寂しいよね。画像を入れてみよう」
>
> プロフィール写真とか入れたいです！
>
> 先輩「`<img>` タグを使えばすぐだよ。ただし、覚えておくべきルールがいくつかあるんだ」

---

## 画像タグの基本

画像は `<img>` タグで表示します。

```html
<img src="photo.jpg" alt="プロフィール写真">
```

| 属性 | 役割 | 必須 |
|------|------|------|
| `src` | 画像ファイルのパス | 必須 |
| `alt` | 画像の代替テキスト | 必須 |

`<img>` は自己閉じタグなので、終了タグは不要です。

---

## `src` 属性 - 画像ファイルの指定

### 同じフォルダの画像

```
my-site/
├── index.html
└── photo.jpg
```

```html
<img src="photo.jpg" alt="写真">
```

### サブフォルダの画像

```
my-site/
├── index.html
└── images/
    └── photo.jpg
```

```html
<img src="images/photo.jpg" alt="写真">
```

### Web上の画像（URL指定）

```html
<img src="https://example.com/images/photo.jpg" alt="写真">
```

> 先輩「自分のサイトの画像は相対パス、外部の画像はURLで指定するよ」

---

## `alt` 属性 - 代替テキスト

`alt` 属性は **必ず設定** してください。

```html
<!-- 良い例 -->
<img src="profile.jpg" alt="山田太郎のプロフィール写真">

<!-- 悪い例 -->
<img src="profile.jpg">
<img src="profile.jpg" alt="">
```

### alt属性が重要な理由

| 理由 | 説明 |
|------|------|
| 画像が表示されないとき | 代替テキストが表示される |
| アクセシビリティ | 視覚障害のある方のスクリーンリーダーが読み上げる |
| SEO | 検索エンジンが画像の内容を理解する手がかり |

### alt属性の書き方

| 画像の種類 | alt の書き方 |
|-----------|-------------|
| プロフィール写真 | 「山田太郎のプロフィール写真」 |
| 風景写真 | 「東京タワーの夜景」 |
| グラフ | 「2024年の売上推移グラフ」 |
| 装飾画像 | `alt=""` （空でよい） |

---

## 画像サイズの指定

```html
<!-- width と height で指定 -->
<img src="photo.jpg" alt="写真" width="300" height="200">

<!-- width だけ指定すると、高さは自動調整 -->
<img src="photo.jpg" alt="写真" width="300">
```

| 属性 | 説明 |
|------|------|
| `width` | 幅（ピクセル） |
| `height` | 高さ（ピクセル） |

> 先輩「サイズ指定は CSS でやることが多いけど、HTMLで指定しておくとページの読み込みが安定するよ」

---

## `<figure>` と `<figcaption>`

画像にキャプション（説明文）を付けるときに使います。

```html
<figure>
  <img src="team-photo.jpg" alt="チームの集合写真">
  <figcaption>2025年4月 チーム集合写真</figcaption>
</figure>
```

| タグ | 役割 |
|------|------|
| `<figure>` | 画像とキャプションをまとめる |
| `<figcaption>` | キャプション（説明文） |

---

## 画像ファイルの形式

| 形式 | 拡張子 | 特徴 | 用途 |
|------|--------|------|------|
| JPEG | `.jpg` | 写真に向いている。圧縮率が高い | プロフィール写真、風景写真 |
| PNG | `.png` | 透過に対応。画質が良い | ロゴ、アイコン、スクリーンショット |
| GIF | `.gif` | アニメーションに対応 | 簡単なアニメーション |
| SVG | `.svg` | 拡大してもぼやけない | アイコン、図形 |
| WebP | `.webp` | 圧縮率が高く軽量 | 最新のWeb画像 |

> 先輩「写真はJPEG、ロゴやアイコンはPNG、と覚えておけば大丈夫」

---

## 画像の準備方法

練習用の画像がない場合は、以下の方法で準備できます。

### 方法1: フリー素材サイトを使う

- Unsplash（https://unsplash.com）
- Pixabay（https://pixabay.com）

### 方法2: プレースホルダー画像を使う

```html
<!-- サイズ指定のダミー画像 -->
<img src="https://via.placeholder.com/300x200" alt="ダミー画像">
```

### 方法3: 自分で撮った写真を使う

スマホで撮った写真をパソコンに移して使えます。

---

## 実践：画像を使ったページを作ろう

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>画像の練習</title>
</head>
<body>
  <h1>画像の練習ページ</h1>

  <h2>プロフィール</h2>
  <img src="https://via.placeholder.com/150x150" alt="プロフィール写真" width="150" height="150">
  <p><strong>山田太郎</strong> - Webエンジニア見習い</p>

  <h2>作品ギャラリー</h2>
  <figure>
    <img src="https://via.placeholder.com/400x300" alt="最初のWebページのスクリーンショット">
    <figcaption>初めて作ったWebページ</figcaption>
  </figure>

  <figure>
    <img src="https://via.placeholder.com/400x300" alt="自己紹介ページのスクリーンショット">
    <figcaption>自己紹介ページ（制作中）</figcaption>
  </figure>
</body>
</html>
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| `<img>` | 画像を表示する自己閉じタグ |
| `src` | 画像ファイルのパス（必須） |
| `alt` | 代替テキスト（必須・アクセシビリティ） |
| `width/height` | 画像サイズの指定 |
| `<figure>` | 画像 + キャプションのセット |
| 形式 | 写真はJPEG、ロゴはPNG |

### チェックリスト
- [ ] `<img>` タグで画像を表示できる
- [ ] `src` と `alt` 属性の役割を理解した
- [ ] alt属性を必ず書く理由を説明できる
- [ ] `<figure>` と `<figcaption>` を使える
- [ ] 画像ファイル形式の違いを理解した

---

## 次のステップへ

画像が表示できるようになりました。次は、ページの構造をより意味的に正しくする「セマンティックHTML」を学びましょう。

---

*推定読了時間: 30分*
