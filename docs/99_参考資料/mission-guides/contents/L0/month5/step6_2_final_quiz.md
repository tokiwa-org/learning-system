# 卒業クイズ：HTML/CSS基礎

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 6
subStep: 2
title: "卒業クイズ"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L0"
passingScore: 80
```

---

## 卒業クイズについて

今月学んだHTML/CSSの知識を総確認する最終テストです。

- 全15問
- 合格ライン: 80%（12問正解）
- 合格すると「HTML/CSS基礎 修了証明書」を獲得！

---

## 問題

### Q1: HTMLの正式名称として正しいものはどれですか？

A) High Technology Markup Language
B) HyperText Markup Language
C) Home Tool Markup Language
D) HyperText Making Language

<details><summary>答えを見る</summary>

**正解: B) HyperText Markup Language**

HTML = HyperText Markup Language（ハイパーテキストマークアップ言語）
Webページの構造を記述するための言語です。

</details>

---

### Q2: HTML文書の言語を日本語に指定する正しい書き方はどれですか？

A) `<html lang="jp">`
B) `<html lang="ja">`
C) `<html language="japanese">`
D) `<meta lang="ja">`

<details><summary>答えを見る</summary>

**正解: B) `<html lang="ja">`**

言語コードは ISO 639-1 に基づいています。
- ja = 日本語
- en = 英語
- ko = 韓国語
- zh = 中国語

</details>

---

### Q3: 見出しタグの階層として正しい使い方はどれですか？

A) h1 → h3 → h2 → h4
B) h2 → h1 → h3 → h4
C) h1 → h2 → h3 → h4
D) h4 → h3 → h2 → h1

<details><summary>答えを見る</summary>

**正解: C) h1 → h2 → h3 → h4**

見出しは h1（最上位）から順に使い、階層をスキップしないのが正しい使い方です。
- h1: ページのメインタイトル（通常1つ）
- h2: 大見出し
- h3: 中見出し
- h4: 小見出し

</details>

---

### Q4: リンクを新しいタブで開くために使う属性はどれですか？

A) `href="_blank"`
B) `target="_blank"`
C) `open="new"`
D) `link="new-tab"`

<details><summary>答えを見る</summary>

**正解: B) `target="_blank"`**

```html
<a href="https://example.com" target="_blank">リンク</a>
```

target属性の値：
- _blank: 新しいタブ/ウィンドウ
- _self: 同じタブ（デフォルト）
- _parent: 親フレーム
- _top: 最上位フレーム

</details>

---

### Q5: セマンティックHTMLでページのメインコンテンツを囲むタグはどれですか？

A) `<div id="main">`
B) `<content>`
C) `<main>`
D) `<section class="main">`

<details><summary>答えを見る</summary>

**正解: C) `<main>`**

セマンティックタグ：
- `<header>`: ヘッダー
- `<nav>`: ナビゲーション
- **`<main>`**: メインコンテンツ
- `<section>`: セクション
- `<article>`: 記事
- `<aside>`: サイドバー
- `<footer>`: フッター

</details>

---

### Q6: フォームの入力欄とラベルを紐づける正しい方法はどれですか？

A) `<label>名前<input name="name"></label>`
B) `<label for="name">名前</label><input id="name">`
C) `<label link="name">名前</label><input id="name">`
D) `<label>名前</label><input label="name">`

<details><summary>答えを見る</summary>

**正解: B) `<label for="name">名前</label><input id="name">`**

labelの `for` 属性と inputの `id` 属性を一致させることで紐づけます。

```html
<label for="email">メールアドレス</label>
<input type="email" id="email" name="email">
```

ラベルをクリックすると入力欄にフォーカスが移るようになります。

</details>

---

### Q7: CSSでHTMLファイルと別ファイルにスタイルを書く方式を何と呼びますか？

A) インラインスタイル
B) 内部スタイル
C) 外部スタイル
D) グローバルスタイル

<details><summary>答えを見る</summary>

**正解: C) 外部スタイル**

CSSの3つの書き方：
- **外部スタイル**: 別ファイル（.css）にCSSを書く（推奨）
- 内部スタイル: `<style>`タグ内にCSSを書く
- インラインスタイル: style属性に直接書く

</details>

---

### Q8: CSSセレクタでクラス名「card」を指定する書き方はどれですか？

A) #card
B) .card
C) card
D) *card

<details><summary>答えを見る</summary>

**正解: B) .card**

セレクタの書き方：
- `.クラス名`: クラスセレクタ（.card）
- `#ID名`: IDセレクタ（#header）
- `要素名`: 要素セレクタ（p, div）
- `*`: 全称セレクタ

</details>

---

### Q9: CSSのボックスモデルで、内側の余白を設定するプロパティはどれですか？

A) margin
B) padding
C) border
D) spacing

<details><summary>答えを見る</summary>

**正解: B) padding**

ボックスモデルの構成（外側から）：
1. margin: 外側の余白
2. border: 境界線
3. **padding: 内側の余白**
4. content: コンテンツ

</details>

---

### Q10: Flexboxで要素を縦方向の中央に揃えるプロパティはどれですか？

A) justify-content: center
B) align-items: center
C) vertical-align: middle
D) text-align: center

<details><summary>答えを見る</summary>

**正解: B) align-items: center**

Flexboxの配置（横並びの場合）：
- `justify-content`: 横方向（主軸）の配置
- **`align-items`: 縦方向（交差軸）の配置**

`justify-content: center` + `align-items: center` で完全中央配置になります。

</details>

---

### Q11: Flexboxで要素間に均等な余白を設定するプロパティはどれですか？

A) margin
B) space
C) gap
D) gutter

<details><summary>答えを見る</summary>

**正解: C) gap**

```css
.container {
  display: flex;
  gap: 20px;  /* アイテム間に20pxの余白 */
}
```

gapはmarginより簡潔に書けます。

</details>

---

### Q12: レスポンシブデザインに必須のmetaタグはどれですか？

A) `<meta charset="UTF-8">`
B) `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
C) `<meta name="description" content="...">`
D) `<meta name="keywords" content="...">`

<details><summary>答えを見る</summary>

**正解: B) `<meta name="viewport" content="width=device-width, initial-scale=1.0">`**

viewport メタタグがないと、スマホでもPC用の幅で表示され、すべてが小さく見えます。

- width=device-width: 画面幅をデバイスに合わせる
- initial-scale=1.0: 初期ズームを100%に

</details>

---

### Q13: CSSのメディアクエリで「画面幅768px以下」を指定する条件はどれですか？

A) @media (width: 768px)
B) @media (max-width: 768px)
C) @media (min-width: 768px)
D) @media screen 768

<details><summary>答えを見る</summary>

**正解: B) @media (max-width: 768px)**

- **max-width: 768px**: 768px以下
- min-width: 768px: 768px以上

```css
@media (max-width: 768px) {
  /* スマホ・タブレット向けスタイル */
}
```

</details>

---

### Q14: 画像が親要素からはみ出さないようにする正しいCSSはどれですか？

A) `width: auto`
B) `width: 100%`
C) `max-width: 100%`
D) `min-width: 100%`

<details><summary>答えを見る</summary>

**正解: C) `max-width: 100%`**

```css
img {
  max-width: 100%;  /* 親要素を超えない */
  height: auto;     /* 縦横比を維持 */
}
```

`width: 100%` だと小さい画像も引き伸ばされてしまいます。

</details>

---

### Q15: モバイルファーストアプローチの正しい説明はどれですか？

A) スマホアプリを先に開発してからWebサイトを作る
B) PCサイトを作ってからスマホ対応のCSSを追加する
C) スマホ向けの基本スタイルを書き、大きい画面用を後で追加する
D) スマホではCSSを使わない

<details><summary>答えを見る</summary>

**正解: C) スマホ向けの基本スタイルを書き、大きい画面用を後で追加する**

モバイルファーストでは、まずスマホ向けのシンプルなスタイルを書き、メディアクエリ（min-width）でタブレット・PC向けのスタイルを追加します。

```css
/* スマホ（デフォルト） */
nav { flex-direction: column; }

/* タブレット以上 */
@media (min-width: 768px) {
  nav { flex-direction: row; }
}
```

</details>

---

## 結果

### 12問以上正解の場合

**合格です！おめでとうございます！**

「HTML/CSS基礎 修了証明書」を獲得しました。

### 11問以下の場合

**もう少し復習しましょう**

間違えた問題の内容を、該当するStepで復習してください：

| 問題 | 復習ステップ |
|------|-------------|
| Q1, Q2, Q3 | Step 1: HTMLの構造 |
| Q4, Q5 | Step 3: リンクとセマンティックHTML |
| Q6 | Step 3: フォーム |
| Q7, Q8, Q9 | Step 4: CSSの基本 |
| Q10, Q11 | Step 5: Flexbox |
| Q12, Q13, Q14, Q15 | Step 5: レスポンシブデザイン |

---

## HTML/CSS基礎 修了証明書

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                    CERTIFICATE OF COMPLETION                     ║
║                                                                  ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │                                                            │  ║
║  │                   HTML/CSS 基礎                            │  ║
║  │                   修 了 証 明 書                            │  ║
║  │                                                            │  ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ║
║  │                                                            │  ║
║  │   本証明書は、以下の内容を修了したことを証明します。        │  ║
║  │                                                            │  ║
║  │   ○ HTMLの基本構造とセマンティックタグ                     │  ║
║  │   ○ 見出し・段落・リスト・テーブル・フォーム               │  ║
║  │   ○ リンクと画像の配置                                     │  ║
║  │   ○ CSSの基本（セレクタ・ボックスモデル・色・フォント）    │  ║
║  │   ○ Flexboxレイアウト                                      │  ║
║  │   ○ レスポンシブデザイン（メディアクエリ）                 │  ║
║  │   ○ 複数ページのWebサイト構築                              │  ║
║  │                                                            │  ║
║  │                                                            │  ║
║  │                  Mission: L0-Month5                        │  ║
║  │              「初めてのWebページを作成しよう」              │  ║
║  │                                                            │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                                                                  ║
║                     Congratulations!                             ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Month 5 完了！

お疲れさまでした！

### 今月学んだこと

- HTMLの基本構造と文書の書き方
- セマンティックHTMLの重要性
- 見出し、段落、リスト、テーブル、フォームの使い方
- リンクと画像の配置
- CSSの3つの書き方（外部・内部・インライン）
- セレクタとボックスモデル
- 色、フォント、余白の設定
- Flexboxによるレイアウト
- レスポンシブデザインとメディアクエリ
- 複数ページのサイト構築

### 身についたスキル

- HTMLで文書構造を正しくマークアップできる
- CSSでWebページをデザインできる
- Flexboxでレイアウトを組める
- スマホ対応のレスポンシブサイトを作れる
- 自己紹介サイトを一から構築できる

### 作成した成果物

- 自己紹介サイト（複数ページ、レスポンシブ対応）

### 次のステップ

**JavaScript入門へ！**

HTML/CSSの基礎を身につけたあなたは、次のステップとしてJavaScriptを学ぶ準備ができています。JavaScriptを使えば、Webページに動きやインタラクションを追加できます。

おすすめの学習内容：
- JavaScriptの基本文法
- DOM操作
- イベント処理
- フォームバリデーション

---

*推定所要時間: 30分*
