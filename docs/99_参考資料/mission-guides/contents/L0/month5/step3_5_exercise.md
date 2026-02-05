# 演習：複数ページのサイトを作ろう

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 3
subStep: 5
title: "演習：複数ページのサイトを作ろう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 先輩「リンク、画像、セマンティックHTML、フォーム。パーツが揃ったから、いよいよ本格的なサイトを作ろう」
>
> 複数ページのサイトですか？ すごいですね！
>
> 先輩「3ページ作って、ナビゲーションでつなげるんだ。これができればWebサイトの基本は完璧だよ」

---

## ミッション

3つのHTMLファイルからなるサイトを作成してください。

### ファイル構成

```
my-site/
├── index.html       ← トップページ
├── about.html       ← 自己紹介ページ
└── contact.html     ← お問い合わせページ
```

---

## 要件

### 共通要件（全ページ）

| 要素 | 説明 |
|------|------|
| セマンティックHTML | `<header>`, `<nav>`, `<main>`, `<footer>` を使う |
| ナビゲーション | 3ページ間を行き来できるリンク |
| フッター | 著作権表示 |
| meta charset | UTF-8 |
| title | ページごとに異なるタイトル |

### ナビゲーションの共通パーツ

全ページに以下のナビゲーションを入れてください。

```html
<nav>
  <a href="index.html">ホーム</a> |
  <a href="about.html">自己紹介</a> |
  <a href="contact.html">お問い合わせ</a>
</nav>
```

---

### index.html（トップページ）

| 要素 | 内容 |
|------|------|
| h1 | サイト名 |
| 画像 | プロフィール画像（プレースホルダーでOK） |
| 紹介文 | 2段落以上の自己紹介 |
| 各ページへの誘導リンク | 「自己紹介を見る」「お問い合わせ」 |

### about.html（自己紹介ページ）

| 要素 | 内容 |
|------|------|
| h1 | 自己紹介 |
| プロフィールテーブル | 基本情報 |
| スキルテーブル | スキル一覧 |
| 趣味リスト | 箇条書き |
| 学習計画 | 番号付きリスト |

### contact.html（お問い合わせページ）

| 要素 | 内容 |
|------|------|
| h1 | お問い合わせ |
| フォーム | 名前、メール、種別、メッセージ |
| 連絡先情報 | メールリンク |

---

## ヒント

### ページの基本テンプレート

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ページタイトル | サイト名</title>
</head>
<body>
  <header>
    <h1>サイト名</h1>
    <nav>
      <a href="index.html">ホーム</a> |
      <a href="about.html">自己紹介</a> |
      <a href="contact.html">お問い合わせ</a>
    </nav>
  </header>

  <main>
    <!-- ページ固有のコンテンツ -->
  </main>

  <footer>
    <p>&copy; 2025 山田太郎</p>
  </footer>
</body>
</html>
```

---

## チャレンジ（余裕がある人向け）

- [ ] ページ内ナビゲーション（アンカーリンク）を追加
- [ ] `<figure>` と `<figcaption>` で画像にキャプションを付ける
- [ ] フォームにラジオボタンやチェックボックスを追加
- [ ] `<aside>` で補足情報セクションを追加
- [ ] 外部サイトへのリンク集ページを作成

---

## 解答例

<details><summary>解答</summary>

### index.html

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ホーム | 山田太郎のサイト</title>
</head>
<body>
  <header>
    <h1>山田太郎のWebサイト</h1>
    <nav>
      <a href="index.html">ホーム</a> |
      <a href="about.html">自己紹介</a> |
      <a href="contact.html">お問い合わせ</a>
    </nav>
  </header>

  <main>
    <section>
      <h2>ようこそ！</h2>
      <figure>
        <img src="https://via.placeholder.com/200x200" alt="山田太郎のプロフィール写真" width="200" height="200">
        <figcaption>山田太郎</figcaption>
      </figure>
      <p>はじめまして、<strong>山田太郎</strong>です。IT企業でWebエンジニアの見習いとして働いています。</p>
      <p>このサイトは、HTML学習の一環として作成した自己紹介サイトです。まだまだ勉強中ですが、少しずつスキルを伸ばしています。</p>
    </section>

    <section>
      <h2>このサイトについて</h2>
      <ul>
        <li><a href="about.html">自己紹介を見る</a> - プロフィールやスキルを紹介</li>
        <li><a href="contact.html">お問い合わせ</a> - ご連絡はこちらから</li>
      </ul>
    </section>
  </main>

  <footer>
    <hr>
    <p>&copy; 2025 山田太郎</p>
  </footer>
</body>
</html>
```

### about.html

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>自己紹介 | 山田太郎のサイト</title>
</head>
<body>
  <header>
    <h1>自己紹介</h1>
    <nav>
      <a href="index.html">ホーム</a> |
      <a href="about.html">自己紹介</a> |
      <a href="contact.html">お問い合わせ</a>
    </nav>
  </header>

  <main>
    <section>
      <h2>プロフィール</h2>
      <table>
        <tbody>
          <tr><th>名前</th><td>山田太郎</td></tr>
          <tr><th>年齢</th><td>25歳</td></tr>
          <tr><th>職業</th><td>Webエンジニア（見習い）</td></tr>
          <tr><th>住所</th><td>東京都</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>スキル</h2>
      <table>
        <thead>
          <tr><th>スキル</th><th>レベル</th><th>学習期間</th></tr>
        </thead>
        <tbody>
          <tr><td>HTML</td><td>学習中</td><td>1ヶ月</td></tr>
          <tr><td>CSS</td><td>学習中</td><td>2週間</td></tr>
          <tr><td>Excel</td><td>中級</td><td>2年</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>趣味</h2>
      <ul>
        <li>プログラミング</li>
        <li>読書</li>
        <li>映画鑑賞</li>
        <li>散歩</li>
      </ul>
    </section>

    <section>
      <h2>学習計画</h2>
      <ol>
        <li>HTMLの基本を学ぶ <strong>← 完了！</strong></li>
        <li>CSSでデザインを整える</li>
        <li>JavaScriptで動きを付ける</li>
        <li>フレームワークを学ぶ</li>
      </ol>
    </section>
  </main>

  <footer>
    <hr>
    <p>&copy; 2025 山田太郎</p>
  </footer>
</body>
</html>
```

### contact.html

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>お問い合わせ | 山田太郎のサイト</title>
</head>
<body>
  <header>
    <h1>お問い合わせ</h1>
    <nav>
      <a href="index.html">ホーム</a> |
      <a href="about.html">自己紹介</a> |
      <a href="contact.html">お問い合わせ</a>
    </nav>
  </header>

  <main>
    <section>
      <h2>お問い合わせフォーム</h2>
      <form>
        <p>
          <label for="name">お名前:</label><br>
          <input type="text" id="name" name="name" placeholder="山田太郎">
        </p>
        <p>
          <label for="email">メールアドレス:</label><br>
          <input type="email" id="email" name="email" placeholder="taro@example.com">
        </p>
        <p>
          <label for="subject">お問い合わせ種別:</label><br>
          <select id="subject" name="subject">
            <option value="">選択してください</option>
            <option value="question">質問</option>
            <option value="request">依頼</option>
            <option value="other">その他</option>
          </select>
        </p>
        <p>
          <label for="message">メッセージ:</label><br>
          <textarea id="message" name="message" rows="5" cols="40"></textarea>
        </p>
        <p>
          <button type="submit">送信する</button>
        </p>
      </form>
    </section>

    <section>
      <h2>その他の連絡方法</h2>
      <p>メール: <a href="mailto:taro@example.com">taro@example.com</a></p>
    </section>
  </main>

  <footer>
    <hr>
    <p>&copy; 2025 山田太郎</p>
  </footer>
</body>
</html>
```

</details>

---

## 確認ポイント

| 確認項目 | チェック |
|----------|----------|
| 3つのHTMLファイルがある | index.html, about.html, contact.html |
| ナビゲーションで全ページに行ける | リンクをクリックして確認 |
| セマンティックタグを使っている | header, nav, main, footer |
| 画像が表示されている | index.html にプロフィール画像 |
| テーブルがある | about.html にプロフィール表・スキル表 |
| フォームがある | contact.html にお問い合わせフォーム |
| 文字化けしていない | 全ページで日本語が正しく表示 |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 複数ページ | ファイルを分けてサイトを構成する |
| ナビゲーション | 全ページに共通のリンクを配置 |
| セマンティックHTML | header, nav, main, footer で構造化 |
| リンクで接続 | ファイル名で内部リンクを作る |

### チェックリスト
- [ ] 3つのHTMLファイルを作成した
- [ ] ナビゲーションで全ページを行き来できる
- [ ] セマンティックHTMLを使っている
- [ ] 各ページに適切なコンテンツが入っている
- [ ] ブラウザで正しく表示されることを確認した

---

## 次のステップへ

複数ページのサイトが完成しました。Step 3の最後にクイズで理解度を確認しましょう。

---

*推定読了時間: 90分*
