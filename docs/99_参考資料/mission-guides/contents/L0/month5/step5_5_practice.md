# レイアウト実践練習

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 5
subStep: 5
title: "レイアウト実践練習"
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

> 先輩「display、Flexbox、レスポンシブデザイン。一通り学んだね」
>
> はい！でもまだ自信がないです...
>
> 先輩「じゃあ、よくあるレイアウトパターンを一緒に練習しよう。これができれば実務でも困らないよ」

---

## この章で練習すること

実際のWebサイトでよく使われるレイアウトパターンを、Flexboxを使って実装します。

| パターン | 使う場面 |
|---------|---------|
| ヘッダーナビ | ほぼすべてのサイト |
| カードグリッド | 商品一覧、記事一覧 |
| サイドバーレイアウト | ブログ、管理画面 |
| フッター固定 | 全ページ共通 |
| 完全中央配置 | ログイン画面、モーダル |

---

## パターン1: ヘッダーナビゲーション

### 完成イメージ

```
┌──────────────────────────────────────────────────────┐
│ [ロゴ]                        [ホーム][紹介][問合せ] │
└──────────────────────────────────────────────────────┘
```

### HTML

```html
<header class="header">
  <h1 class="logo">My Site</h1>
  <nav class="nav">
    <a href="#">ホーム</a>
    <a href="#">紹介</a>
    <a href="#">問合せ</a>
  </nav>
</header>
```

### CSS

```css
.header {
  display: flex;
  justify-content: space-between;  /* 左右に分ける */
  align-items: center;             /* 縦方向中央 */
  padding: 15px 30px;
  background-color: #2c3e50;
  color: white;
}

.logo {
  font-size: 24px;
  margin: 0;
}

.nav {
  display: flex;
  gap: 20px;                       /* リンク間の余白 */
}

.nav a {
  color: #ecf0f1;
  text-decoration: none;
}
```

### ポイント

- `justify-content: space-between` でロゴとナビを左右に分ける
- `align-items: center` で縦方向を中央揃え
- ナビ自体も `display: flex` で横並び

---

## パターン2: カードグリッド

### 完成イメージ

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│ カード1  │  │ カード2  │  │ カード3  │
└─────────┘  └─────────┘  └─────────┘
┌─────────┐  ┌─────────┐
│ カード4  │  │ カード5  │  （折り返し）
└─────────┘  └─────────┘
```

### HTML

```html
<div class="cards">
  <div class="card">
    <h3>カード1</h3>
    <p>説明文がここに入ります。</p>
  </div>
  <div class="card">
    <h3>カード2</h3>
    <p>説明文がここに入ります。</p>
  </div>
  <div class="card">
    <h3>カード3</h3>
    <p>説明文がここに入ります。</p>
  </div>
  <!-- カード4, 5 も同様 -->
</div>
```

### CSS

```css
.cards {
  display: flex;
  flex-wrap: wrap;       /* 折り返しを許可 */
  gap: 20px;             /* カード間の余白 */
  padding: 20px;
}

.card {
  flex: 1;               /* 均等に広がる */
  min-width: 250px;      /* 最小幅（これ以下なら折り返し） */
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}
```

### ポイント

- `flex-wrap: wrap` で収まらないカードを次の行へ
- `min-width` でカードの最小幅を設定
- `flex: 1` で均等に幅を分配

---

## パターン3: サイドバーレイアウト

### 完成イメージ

```
┌──────────┬─────────────────────────────┐
│          │                             │
│ サイドバー │         メインコンテンツ       │
│          │                             │
│          │                             │
└──────────┴─────────────────────────────┘
```

### HTML

```html
<div class="layout">
  <aside class="sidebar">
    <h3>メニュー</h3>
    <ul>
      <li><a href="#">リンク1</a></li>
      <li><a href="#">リンク2</a></li>
      <li><a href="#">リンク3</a></li>
    </ul>
  </aside>
  <main class="main-content">
    <h2>メインコンテンツ</h2>
    <p>ここに本文が入ります。</p>
  </main>
</div>
```

### CSS

```css
.layout {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.sidebar {
  flex: 0 0 250px;       /* 固定幅250px */
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.main-content {
  flex: 1;               /* 残りの幅を占める */
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

/* スマホ対応 */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;  /* 縦並びに変更 */
  }

  .sidebar {
    flex: none;              /* 固定幅を解除 */
  }
}
```

### ポイント

- `flex: 0 0 250px` でサイドバーを固定幅に
- メインコンテンツは `flex: 1` で残りを使用
- スマホでは `flex-direction: column` で縦並びに

---

## パターン4: フッター固定

### 完成イメージ

```
┌─────────────────────────────────────┐
│              ヘッダー                │
├─────────────────────────────────────┤
│                                     │
│           メインコンテンツ            │
│      （コンテンツが少なくても...）     │
│                                     │
├─────────────────────────────────────┤
│              フッター                │  ← 常に画面下部
└─────────────────────────────────────┘
```

### HTML

```html
<body>
  <header>ヘッダー</header>
  <main>メインコンテンツ</main>
  <footer>フッター</footer>
</body>
```

### CSS

```css
body {
  display: flex;
  flex-direction: column;   /* 縦並び */
  min-height: 100vh;        /* 最低でも画面の高さ */
  margin: 0;
}

header {
  background-color: #2c3e50;
  color: white;
  padding: 15px;
}

main {
  flex: 1;                  /* 残りの高さを占める */
  padding: 20px;
}

footer {
  background-color: #2c3e50;
  color: white;
  padding: 15px;
  text-align: center;
}
```

### ポイント

- `body` を `display: flex` + `flex-direction: column` に
- `min-height: 100vh` で最低でも画面の高さを確保
- `main` に `flex: 1` で残りの高さを占有

---

## パターン5: 完全中央配置

### 完成イメージ

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│            ┌─────────┐              │
│            │ ボックス │              │  ← 画面中央
│            └─────────┘              │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### HTML

```html
<div class="center-container">
  <div class="center-box">
    <h2>ログイン</h2>
    <input type="email" placeholder="メールアドレス">
    <input type="password" placeholder="パスワード">
    <button>ログイン</button>
  </div>
</div>
```

### CSS

```css
.center-container {
  display: flex;
  justify-content: center;   /* 横方向中央 */
  align-items: center;       /* 縦方向中央 */
  min-height: 100vh;         /* 画面の高さ */
  background-color: #f8f9fa;
}

.center-box {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.center-box input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.center-box button {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

### ポイント

- `justify-content: center` + `align-items: center` のコンビ
- `min-height: 100vh` で画面全体を使う
- ログイン画面やモーダルでよく使うパターン

---

## 練習問題

以下のレイアウトを実装してみましょう。

### 練習: プロフィールカード

```
┌───────────────────────────────────┐
│  ┌─────┐                          │
│  │ 画像 │  名前: 山田太郎           │
│  └─────┘  職業: Webエンジニア       │
│           自己紹介文がここに...     │
│                                   │
│  [Twitter] [GitHub] [LinkedIn]    │
└───────────────────────────────────┘
```

<details><summary>ヒント</summary>

- 外側の要素は縦並び（`flex-direction: column`）
- 上部の画像と情報は横並び（`display: flex`）
- SNSリンクは横並び（`display: flex` + `gap`）

</details>

<details><summary>解答例</summary>

```html
<div class="profile-card">
  <div class="profile-header">
    <img src="avatar.png" alt="プロフィール画像" class="avatar">
    <div class="profile-info">
      <h3>山田太郎</h3>
      <p class="job">Webエンジニア</p>
      <p>HTMLとCSSを勉強中です。よろしくお願いします。</p>
    </div>
  </div>
  <div class="profile-links">
    <a href="#">Twitter</a>
    <a href="#">GitHub</a>
    <a href="#">LinkedIn</a>
  </div>
</div>
```

```css
.profile-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  gap: 15px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info h3 {
  margin: 0 0 5px 0;
}

.profile-info .job {
  color: #666;
  margin: 0 0 10px 0;
}

.profile-links {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.profile-links a {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
```

</details>

---

## まとめ

| パターン | 主要なCSS |
|---------|----------|
| ヘッダーナビ | `justify-content: space-between` |
| カードグリッド | `flex-wrap: wrap` + `min-width` |
| サイドバー | `flex: 0 0 固定幅` + `flex: 1` |
| フッター固定 | `flex: 1` on main + `min-height: 100vh` |
| 完全中央 | `justify-content: center` + `align-items: center` |

### チェックリスト
- [ ] ヘッダーナビゲーションを実装できる
- [ ] カードグリッドで折り返しレイアウトができる
- [ ] サイドバーレイアウトを作れる
- [ ] フッターを画面下部に固定できる
- [ ] 要素を画面中央に配置できる

---

## 次のステップへ

よく使うレイアウトパターンを練習しました。次は Step 5 のチェックポイントクイズです。レイアウトの知識を確認しましょう。

---

*推定読了時間: 30分*
