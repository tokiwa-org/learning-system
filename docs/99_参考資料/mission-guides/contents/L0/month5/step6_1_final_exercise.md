# 総合演習：自己紹介サイトの完成

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 6
subStep: 1
title: "総合演習：自己紹介サイトの完成"
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

> 先輩「いよいよ最終演習だね。自己紹介サイトを完成させよう」
>
> HTMLの構造、CSSのスタイリング、レスポンシブデザイン...全部使うんですね！
>
> 先輩「そう。5つのパートに分けて、一つずつ仕上げていこう。完成したサイトは、ポートフォリオの第一歩になるよ」

---

## ミッション概要

5つのパートに分けて、自己紹介サイトを完成させます。

### 完成イメージ

```
┌─────────────────────────────────────────────────────────┐
│ [ロゴ]                    [ホーム][紹介][スキル][問合せ]  │  ← ヘッダー
├─────────────────────────────────────────────────────────┤
│                                                         │
│    ┌─────────────────────────────────────────────┐      │
│    │  プロフィール                                │      │
│    │  [画像]  名前・職業・自己紹介文              │      │
│    └─────────────────────────────────────────────┘      │
│    ┌─────────────────────────────────────────────┐      │
│    │  スキル                                     │      │
│    │  HTML / CSS / その他のスキル                │      │
│    └─────────────────────────────────────────────┘      │
│    ┌─────────────────────────────────────────────┐      │
│    │  趣味                                       │      │
│    │  ・趣味1  ・趣味2  ・趣味3                  │      │
│    └─────────────────────────────────────────────┘      │
│    ┌─────────────────────────────────────────────┐      │
│    │  お問い合わせフォーム                        │      │
│    │  名前 / メール / メッセージ / 送信ボタン      │      │
│    └─────────────────────────────────────────────┘      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                (c) 2026 あなたの名前                     │  ← フッター
└─────────────────────────────────────────────────────────┘
```

### 達成条件

- [ ] Part 1〜5 すべてを完了した
- [ ] レスポンシブ対応している
- [ ] 複数ページ構成になっている

---

## Part 1: HTML構造 - セマンティックなマークアップ

### ミッション1-1: 基本構造を作成

以下の構造で `index.html` を作成してください。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>山田太郎 | 自己紹介サイト</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <!-- ロゴとナビゲーション -->
  </header>

  <main>
    <!-- メインコンテンツ -->
  </main>

  <footer>
    <!-- フッター -->
  </footer>
</body>
</html>
```

### ミッション1-2: ヘッダーを作成

```html
<header>
  <h1 class="logo">Taro's Portfolio</h1>
  <nav>
    <a href="index.html">ホーム</a>
    <a href="#profile">プロフィール</a>
    <a href="#skills">スキル</a>
    <a href="contact.html">お問い合わせ</a>
  </nav>
</header>
```

### ミッション1-3: フッターを作成

```html
<footer>
  <p>&copy; 2026 山田太郎. All rights reserved.</p>
</footer>
```

<details><summary>確認ポイント</summary>

- [ ] `<!DOCTYPE html>` がある
- [ ] `<html lang="ja">` で日本語指定
- [ ] viewport メタタグがある
- [ ] セマンティックタグ（header, main, footer）を使用
- [ ] CSSファイルがリンクされている

</details>

---

## Part 2: コンテンツ - プロフィール・スキル・趣味・フォーム

### ミッション2-1: プロフィールセクション

```html
<section id="profile" class="profile-section">
  <h2>プロフィール</h2>
  <div class="profile-content">
    <figure class="profile-image">
      <img src="images/avatar.png" alt="プロフィール画像">
    </figure>
    <div class="profile-text">
      <h3>山田 太郎</h3>
      <p class="job-title">Webエンジニア見習い</p>
      <p>
        はじめまして、山田太郎です。<br>
        プログラミングを勉強中の初心者です。<br>
        HTMLとCSSを学び、このサイトを作りました。
      </p>
    </div>
  </div>
</section>
```

### ミッション2-2: スキルセクション（テーブル）

```html
<section id="skills" class="skills-section">
  <h2>スキル</h2>
  <table>
    <thead>
      <tr>
        <th>スキル</th>
        <th>レベル</th>
        <th>経験期間</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>HTML</td>
        <td>初級</td>
        <td>1ヶ月</td>
      </tr>
      <tr>
        <td>CSS</td>
        <td>初級</td>
        <td>1ヶ月</td>
      </tr>
      <tr>
        <td>JavaScript</td>
        <td>勉強中</td>
        <td>-</td>
      </tr>
    </tbody>
  </table>
</section>
```

### ミッション2-3: 趣味セクション（リスト）

```html
<section id="hobbies" class="hobbies-section">
  <h2>趣味</h2>
  <ul>
    <li>
      <strong>プログラミング</strong>
      <p>Webサイトを作るのが楽しいです。</p>
    </li>
    <li>
      <strong>読書</strong>
      <p>技術書やビジネス書を読んでいます。</p>
    </li>
    <li>
      <strong>ゲーム</strong>
      <p>RPGが好きです。</p>
    </li>
  </ul>
</section>
```

### ミッション2-4: お問い合わせフォーム

```html
<section id="contact" class="contact-section">
  <h2>お問い合わせ</h2>
  <form action="#" method="post">
    <div class="form-group">
      <label for="name">お名前</label>
      <input type="text" id="name" name="name" required>
    </div>
    <div class="form-group">
      <label for="email">メールアドレス</label>
      <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
      <label for="subject">件名</label>
      <select id="subject" name="subject">
        <option value="">選択してください</option>
        <option value="general">一般的なお問い合わせ</option>
        <option value="work">お仕事のご依頼</option>
        <option value="other">その他</option>
      </select>
    </div>
    <div class="form-group">
      <label for="message">メッセージ</label>
      <textarea id="message" name="message" rows="5" required></textarea>
    </div>
    <button type="submit">送信する</button>
  </form>
</section>
```

---

## Part 3: CSSスタイリング - 基本デザイン

### ミッション3-1: リセットと基本スタイル

`style.css` を作成して、基本スタイルを設定します。

```css
/* ===== リセット ===== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ===== 基本スタイル ===== */
body {
  font-family: "Helvetica Neue", Arial, "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  background-color: #f8f9fa;
}

img {
  max-width: 100%;
  height: auto;
}

a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

### ミッション3-2: ヘッダースタイル

```css
/* ===== ヘッダー ===== */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  padding: 15px 30px;
}

.logo {
  font-size: 24px;
  margin: 0;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  color: #ecf0f1;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: #34495e;
  text-decoration: none;
}
```

### ミッション3-3: セクション共通スタイル

```css
/* ===== メイン ===== */
main {
  max-width: 800px;
  margin: 30px auto;
  padding: 0 20px;
}

/* ===== セクション共通 ===== */
section {
  background-color: white;
  padding: 30px;
  margin-bottom: 30px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

section h2 {
  color: #2c3e50;
  font-size: 24px;
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 3px solid #3498db;
}
```

### ミッション3-4: テーブルとフォームスタイル

```css
/* ===== テーブル ===== */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #3498db;
  color: white;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

/* ===== フォーム ===== */
.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

button[type="submit"] {
  background-color: #3498db;
  color: white;
  padding: 15px 40px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #2980b9;
}

/* ===== フッター ===== */
footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  text-align: center;
  padding: 20px;
  font-size: 14px;
}
```

---

## Part 4: Flexboxレイアウトとレスポンシブ対応

### ミッション4-1: プロフィールセクションのレイアウト

```css
/* ===== プロフィール ===== */
.profile-content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.profile-image img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #3498db;
}

.profile-text h3 {
  font-size: 22px;
  margin-bottom: 5px;
}

.job-title {
  color: #3498db;
  font-weight: bold;
  margin-bottom: 15px;
}
```

### ミッション4-2: レスポンシブ対応

```css
/* ===== レスポンシブ: スマホ ===== */
@media (max-width: 767px) {
  /* ヘッダー */
  header {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }

  .logo {
    font-size: 20px;
    margin-bottom: 15px;
  }

  nav {
    flex-direction: column;
    gap: 10px;
  }

  /* メイン */
  main {
    margin: 15px auto;
    padding: 0 15px;
  }

  section {
    padding: 20px;
  }

  section h2 {
    font-size: 20px;
  }

  /* プロフィール */
  .profile-content {
    flex-direction: column;
    text-align: center;
  }

  .profile-image img {
    width: 120px;
    height: 120px;
  }

  /* テーブルスクロール */
  table {
    display: block;
    overflow-x: auto;
  }
}
```

---

## Part 5: 複数ページ化

### ミッション5-1: お問い合わせページを別ファイルに

`contact.html` を作成します。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>お問い合わせ | 山田太郎</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1 class="logo">Taro's Portfolio</h1>
    <nav>
      <a href="index.html">ホーム</a>
      <a href="index.html#profile">プロフィール</a>
      <a href="index.html#skills">スキル</a>
      <a href="contact.html">お問い合わせ</a>
    </nav>
  </header>

  <main>
    <section class="contact-section">
      <h2>お問い合わせ</h2>
      <!-- フォームをここに移動 -->
    </section>
  </main>

  <footer>
    <p>&copy; 2026 山田太郎. All rights reserved.</p>
  </footer>
</body>
</html>
```

### ミッション5-2: ファイル構成

最終的なファイル構成：

```
my-portfolio/
├── index.html        # トップページ（プロフィール、スキル、趣味）
├── contact.html      # お問い合わせページ
├── style.css         # スタイルシート
└── images/
    └── avatar.png    # プロフィール画像
```

---

## 最終チェックリスト

### HTML

- [ ] セマンティックタグ（header, main, footer, section, nav）を使っている
- [ ] viewport メタタグがある
- [ ] 見出し階層が正しい（h1 → h2 → h3）
- [ ] リンクのhrefが正しく設定されている
- [ ] フォームの各入力欄にlabelが紐づいている

### CSS

- [ ] ボックスモデルの理解（margin, padding, border）
- [ ] Flexboxでレイアウトしている
- [ ] 色・フォントが統一されている
- [ ] ホバーエフェクトがある

### レスポンシブ

- [ ] viewport メタタグがある
- [ ] メディアクエリでスマホ対応している
- [ ] 画像が max-width: 100% で収まる
- [ ] 開発者ツールで複数の画面サイズを確認した

### 複数ページ

- [ ] 2ページ以上ある
- [ ] ナビゲーションで相互にリンクしている
- [ ] 同じCSSファイルを共有している

---

## まとめ

| パート | 学んだこと |
|-------|----------|
| Part 1 | セマンティックHTML |
| Part 2 | 見出し・段落・テーブル・リスト・フォーム |
| Part 3 | CSSの基本（色・フォント・余白） |
| Part 4 | Flexbox + レスポンシブデザイン |
| Part 5 | 複数ページ構成 |

---

## 次のステップへ

自己紹介サイトの完成、お疲れさまでした！

次は最終関門「卒業クイズ」です。今月学んだHTML/CSSの知識を総動員して挑みましょう。80%以上の正解で「HTML/CSS基礎 修了証明書」を獲得できます！

---

*推定所要時間: 90分*
