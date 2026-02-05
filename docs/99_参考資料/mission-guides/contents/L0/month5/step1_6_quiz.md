# 理解度チェック

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 1
subStep: 6
title: "理解度チェック"
itemType: QUIZ
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 先輩「Step 1の内容を覚えているか、クイズで確認してみよう」
>
> ドキドキ... 大丈夫かな。
>
> 先輩「間違えても大丈夫。復習のチャンスだからね」

---

## 問題

### Q1. HTMLは何の略ですか？

- A) High Tech Modern Language
- B) HyperText Markup Language
- C) Home Tool Markup Language
- D) HyperText Making Language

<details><summary>答えを見る</summary>

**正解: B) HyperText Markup Language**

HTMLは「HyperText Markup Language」の略です。ハイパーテキスト（リンクで結ばれたテキスト）をマークアップ（タグで意味を付ける）するための言語です。

</details>

---

### Q2. HTMLファイルの1行目に書くべきものはどれですか？

- A) `<html lang="ja">`
- B) `<head>`
- C) `<!DOCTYPE html>`
- D) `<meta charset="UTF-8">`

<details><summary>答えを見る</summary>

**正解: C) `<!DOCTYPE html>`**

`<!DOCTYPE html>` はHTML5であることを宣言するもので、必ず1行目に書きます。

</details>

---

### Q3. `<head>` 内に書く内容として正しいものはどれですか？

- A) ページに表示するテキスト
- B) 画像や動画
- C) ページの設定情報（文字コード、タイトルなど）
- D) リンクやボタン

<details><summary>答えを見る</summary>

**正解: C) ページの設定情報（文字コード、タイトルなど）**

`<head>` には画面に表示されない設定情報を書きます。`<meta charset>` や `<title>` などが代表的です。画面に表示する内容は `<body>` に書きます。

</details>

---

### Q4. 次のうち、正しいネスト（入れ子）はどれですか？

- A) `<p>テキスト<strong>太字</p></strong>`
- B) `<p>テキスト<strong>太字</strong></p>`
- C) `<p><strong>太字</p>テキスト</strong>`
- D) `<strong><p>テキスト太字</p></strong>`

<details><summary>答えを見る</summary>

**正解: B) `<p>テキスト<strong>太字</strong></p>`**

タグは開いた順番と逆の順番で閉じます。`<p>` の中で `<strong>` を開いたら、先に `</strong>` を閉じてから `</p>` を閉じます。

</details>

---

### Q5. 終了タグが不要なタグ（自己閉じタグ）はどれですか？

- A) `<p>`
- B) `<br>`
- C) `<h1>`
- D) `<strong>`

<details><summary>答えを見る</summary>

**正解: B) `<br>`**

`<br>` は改行タグで、コンテンツを持たない自己閉じタグです。`<p>`, `<h1>`, `<strong>` はいずれも終了タグが必要です。

</details>

---

### Q6. `<a href="https://example.com">` の `href` は何ですか？

- A) タグ
- B) 要素
- C) 属性
- D) コンテンツ

<details><summary>答えを見る</summary>

**正解: C) 属性**

`href` は `<a>` タグの属性（Attribute）です。属性はタグに追加情報を与えるもので、この場合はリンク先のURLを指定しています。

</details>

---

### Q7. ブラウザの開発者ツールを開くキーはどれですか？

- A) F1
- B) F5
- C) F12
- D) F10

<details><summary>答えを見る</summary>

**正解: C) F12**

F12キーでブラウザの開発者ツールを開けます。Chrome、Firefox、Edgeで共通です。

</details>

---

### Q8. DOMとは何ですか？

- A) HTMLファイルの拡張子
- B) CSSの一種
- C) ブラウザがHTMLを読み込んで作るツリー構造のデータ
- D) Webサーバーの名前

<details><summary>答えを見る</summary>

**正解: C) ブラウザがHTMLを読み込んで作るツリー構造のデータ**

DOM（Document Object Model）は、ブラウザがHTMLを解析して構築するツリー構造のデータです。開発者ツールのElementsタブで確認できます。

</details>

---

## 結果の目安

| 正解数 | 評価 |
|--------|------|
| 8問 | 完璧！ Step 2に進みましょう |
| 6-7問 | よくできました。間違えた部分を復習しましょう |
| 4-5問 | もう一度レッスンを読み返しましょう |
| 3問以下 | Step 1を最初からやり直しましょう |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| HTMLの基本 | Webページの構造を作る言語 |
| 基本構造 | DOCTYPE, html, head, body |
| タグの仕組み | 開始タグ + コンテンツ + 終了タグ |
| 開発者ツール | F12でHTMLを確認・編集 |
| 用語 | 要素、タグ、属性、DOM |

### チェックリスト
- [ ] 8問中6問以上正解できた
- [ ] 間違えた問題の復習が完了した

---

## 次のステップへ

Step 1が完了しました。HTMLの基礎が身につきましたね。次のStep 2では、いよいよ具体的なタグを使って文章を作っていきます。

---

*推定読了時間: 15分*
