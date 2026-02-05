# チェックポイント

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 3
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 先輩「複数ページのサイトが作れたね！ Step 3の理解度をチェックしよう」
>
> リンクも画像もフォームも使いました！
>
> 先輩「いい調子だ。じゃあクイズで確認してみよう」

---

## 問題

### Q1. リンクを作るタグはどれですか？

- A) `<link href="...">`
- B) `<a href="...">`
- C) `<url href="...">`
- D) `<ref href="...">`

<details><summary>答えを見る</summary>

**正解: B) `<a href="...">`**

`<a>`（anchor）タグでリンクを作ります。`<link>` はCSSファイルの読み込みに使うタグで、リンクではありません。

</details>

---

### Q2. リンクを新しいタブで開くための属性はどれですか？

- A) `target="_new"`
- B) `target="_blank"`
- C) `open="new"`
- D) `tab="new"`

<details><summary>答えを見る</summary>

**正解: B) `target="_blank"`**

`target="_blank"` を指定すると、リンク先が新しいタブ（またはウィンドウ）で開きます。

</details>

---

### Q3. 画像タグで必須の属性はどれですか？

- A) `src` と `width`
- B) `src` と `alt`
- C) `alt` と `width`
- D) `src` と `title`

<details><summary>答えを見る</summary>

**正解: B) `src` と `alt`**

`src`（画像ファイルのパス）と `alt`（代替テキスト）が必須です。`alt` はアクセシビリティとSEOのために必ず設定します。

</details>

---

### Q4. ページのメインコンテンツを囲むセマンティックタグはどれですか？

- A) `<content>`
- B) `<body>`
- C) `<main>`
- D) `<section>`

<details><summary>答えを見る</summary>

**正解: C) `<main>`**

`<main>` タグはページのメインコンテンツを囲むセマンティックタグです。1ページに1つだけ使います。`<body>` はHTML文書全体の表示部分、`<section>` はテーマ別のセクションです。

</details>

---

### Q5. ナビゲーションを囲むセマンティックタグはどれですか？

- A) `<menu>`
- B) `<navigation>`
- C) `<nav>`
- D) `<links>`

<details><summary>答えを見る</summary>

**正解: C) `<nav>`**

`<nav>` がナビゲーション用のセマンティックタグです。`<navigation>` や `<menu>` や `<links>` というタグはHTMLの標準には存在しません（`<menu>` は存在しますがナビゲーション用途ではありません）。

</details>

---

### Q6. フォームの入力欄とラベルを関連付ける方法として正しいものはどれですか？

- A) `<label>` の `name` と `<input>` の `name` を一致させる
- B) `<label>` の `for` と `<input>` の `id` を一致させる
- C) `<label>` の `id` と `<input>` の `for` を一致させる
- D) `<label>` と `<input>` を同じ `<div>` に入れる

<details><summary>答えを見る</summary>

**正解: B) `<label>` の `for` と `<input>` の `id` を一致させる**

`<label for="email">` と `<input id="email">` のように、`for` と `id` を一致させることでラベルと入力欄を関連付けます。

</details>

---

### Q7. ページ内の特定の場所に飛ぶリンクの書き方はどれですか？

- A) `<a href="skills">スキルへ</a>`
- B) `<a href="#skills">スキルへ</a>`
- C) `<a href="@skills">スキルへ</a>`
- D) `<a href="!skills">スキルへ</a>`

<details><summary>答えを見る</summary>

**正解: B) `<a href="#skills">スキルへ</a>`**

`#` + `id` でページ内の特定の場所にジャンプするアンカーリンクが作れます。飛び先の要素には `id="skills"` を設定しておきます。

</details>

---

### Q8. 複数行のテキスト入力に使うタグはどれですか？

- A) `<input type="multiline">`
- B) `<input type="text" rows="5">`
- C) `<textarea>`
- D) `<textbox>`

<details><summary>答えを見る</summary>

**正解: C) `<textarea>`**

複数行のテキスト入力には `<textarea>` を使います。`<input type="text">` は1行のテキスト入力専用です。

</details>

---

## 結果の目安

| 正解数 | 評価 |
|--------|------|
| 8問 | 完璧！ Step 4に進みましょう |
| 6-7問 | よくできました。間違えた部分を復習しましょう |
| 4-5問 | もう一度レッスンを読み返しましょう |
| 3問以下 | Step 3を最初からやり直しましょう |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| リンク | `<a href="">` で外部・内部・ページ内リンク |
| 画像 | `<img src="" alt="">` で表示 |
| セマンティック | header, nav, main, section, footer |
| フォーム | form, input, label, textarea, select |

### チェックリスト
- [ ] 8問中6問以上正解できた
- [ ] 間違えた問題の復習が完了した

---

## 次のステップへ

Step 3が完了しました。HTMLの基本はこれで一通り学びました。次のStep 4では、いよいよ **CSS** を使ってページの見た目を整えていきます。

---

*推定読了時間: 30分*
