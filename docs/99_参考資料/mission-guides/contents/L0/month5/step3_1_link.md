# リンクを作ろう

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 3
subStep: 1
title: "リンクを作ろう"
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

> 先輩「Webページの醍醐味といえば、やっぱりリンクだよね」
>
> リンクって、クリックすると別のページに飛ぶやつですよね？
>
> 先輩「そう。HTMLの"HyperText"はまさにリンクのことなんだ。リンクがあるからこそWebは"Web（網）"なんだよ」

---

## リンクの基本

リンクは `<a>` タグ（anchor = アンカー）で作ります。

```html
<a href="https://example.com">サンプルサイト</a>
```

| 部分 | 説明 |
|------|------|
| `<a>` | リンクタグ |
| `href` | リンク先のURLを指定する属性 |
| `https://example.com` | リンク先のURL |
| `サンプルサイト` | クリックするテキスト（リンクテキスト） |

---

## 外部リンク

他のWebサイトへのリンクです。

```html
<a href="https://www.google.com">Googleで検索する</a>
<a href="https://developer.mozilla.org">MDN Web Docs</a>
```

### 新しいタブで開く

外部リンクは新しいタブで開くのが一般的です。

```html
<a href="https://www.google.com" target="_blank">Googleで検索する（新しいタブ）</a>
```

| 属性 | 値 | 動作 |
|------|-----|------|
| `target` | `_blank` | 新しいタブで開く |
| `target` | `_self` | 同じタブで開く（デフォルト） |

> 先輩「外部サイトは `target="_blank"` で新しいタブを開くのがユーザーに親切だよ」

---

## 内部リンク

自分のサイト内の別ページへのリンクです。

```
my-site/
├── index.html     ← トップページ
├── about.html     ← 自己紹介ページ
└── contact.html   ← お問い合わせページ
```

```html
<!-- index.html から about.html へのリンク -->
<a href="about.html">自己紹介ページへ</a>
<a href="contact.html">お問い合わせページへ</a>
```

内部リンクでは **相対パス**（同じフォルダ内のファイル名）を使います。

---

## アンカーリンク（ページ内リンク）

同じページ内の特定の場所に飛ぶリンクです。

### 手順1: 飛び先に id を設定

```html
<h2 id="profile">プロフィール</h2>
<h2 id="skills">スキル</h2>
<h2 id="hobbies">趣味</h2>
```

### 手順2: リンクで # + id を指定

```html
<a href="#profile">プロフィールへ</a>
<a href="#skills">スキルへ</a>
<a href="#hobbies">趣味へ</a>
```

`#` を付けることで、ページ内の対応する `id` の場所にスクロールします。

### ページ内ナビゲーションの例

```html
<!-- ページ上部のナビゲーション -->
<p>
  <a href="#profile">プロフィール</a> |
  <a href="#skills">スキル</a> |
  <a href="#hobbies">趣味</a>
</p>

<!-- コンテンツ -->
<h2 id="profile">プロフィール</h2>
<p>...</p>

<h2 id="skills">スキル</h2>
<p>...</p>

<h2 id="hobbies">趣味</h2>
<p>...</p>
```

---

## メールリンクと電話リンク

```html
<!-- メールを送るリンク -->
<a href="mailto:taro@example.com">メールを送る</a>

<!-- 電話をかけるリンク（スマホで便利） -->
<a href="tel:090-1234-5678">電話する</a>
```

---

## リンクテキストのベストプラクティス

| 悪い例 | 良い例 | 理由 |
|--------|--------|------|
| `<a href="...">ここ</a>をクリック` | `<a href="...">自己紹介ページ</a>を見る` | リンク先が分かる |
| `<a href="...">https://example.com</a>` | `<a href="...">サンプルサイト</a>` | 読みやすい |
| `<a href="...">クリック！</a>` | `<a href="...">お問い合わせフォーム</a>` | 内容が明確 |

> 先輩「リンクテキストだけ読んでも、どこに飛ぶか分かるのが理想だよ」

---

## 実践：リンクを使ったページを作ろう

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>リンクの練習</title>
</head>
<body>
  <h1>リンクの練習ページ</h1>

  <!-- ページ内ナビゲーション -->
  <p>
    <a href="#external">外部リンク</a> |
    <a href="#internal">内部リンク</a> |
    <a href="#contact">連絡先</a>
  </p>

  <hr>

  <h2 id="external">外部リンク集</h2>
  <ul>
    <li><a href="https://developer.mozilla.org" target="_blank">MDN Web Docs</a></li>
    <li><a href="https://www.google.com" target="_blank">Google</a></li>
  </ul>

  <h2 id="internal">サイト内リンク</h2>
  <ul>
    <li><a href="about.html">自己紹介ページ</a></li>
    <li><a href="contact.html">お問い合わせ</a></li>
  </ul>

  <h2 id="contact">連絡先</h2>
  <p><a href="mailto:taro@example.com">メールを送る</a></p>
</body>
</html>
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| `<a href="">` | リンクを作る基本タグ |
| 外部リンク | `https://` で始まるURL |
| 内部リンク | 同じサイト内のファイル名 |
| アンカーリンク | `#id` でページ内の場所に飛ぶ |
| `target="_blank"` | 新しいタブで開く |
| リンクテキスト | 内容が分かるテキストにする |

### チェックリスト
- [ ] `<a>` タグでリンクを作れる
- [ ] 外部リンクと内部リンクの違いを理解した
- [ ] `target="_blank"` の使い方を覚えた
- [ ] アンカーリンク（`#id`）でページ内ジャンプができる
- [ ] メールリンク（`mailto:`）の書き方を知った

---

## 次のステップへ

リンクが作れるようになりました。次は、Webページに欠かせない画像の表示方法を学びましょう。

---

*推定読了時間: 30分*
