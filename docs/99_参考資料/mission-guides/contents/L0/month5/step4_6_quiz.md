# チェックポイント

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 4
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

> 先輩「CSSの基本が身についたね。理解度をチェックしよう」
>
> ページの見た目が変わるのが楽しくて、ずっとCSSを書いていたいです！
>
> 先輩「いいね、その調子だ。じゃあクイズで確認してみよう」

---

## 問題

### Q1. CSSを外部ファイルとして読み込むHTMLタグはどれですか？

- A) `<style src="style.css">`
- B) `<css href="style.css">`
- C) `<link rel="stylesheet" href="style.css">`
- D) `<script src="style.css">`

<details><summary>答えを見る</summary>

**正解: C) `<link rel="stylesheet" href="style.css">`**

外部CSSファイルは `<link>` タグで読み込みます。`rel="stylesheet"` でスタイルシートであることを指定し、`href` でファイルパスを指定します。

</details>

---

### Q2. classセレクタの書き方として正しいものはどれですか？

- A) `#highlight { color: red; }`
- B) `.highlight { color: red; }`
- C) `highlight { color: red; }`
- D) `@highlight { color: red; }`

<details><summary>答えを見る</summary>

**正解: B) `.highlight { color: red; }`**

classセレクタはドット（`.`）で始めます。`#` はidセレクタ、何もつけないのは要素セレクタです。

</details>

---

### Q3. 16進数カラーコード `#ff0000` は何色ですか？

- A) 青
- B) 緑
- C) 赤
- D) 黄色

<details><summary>答えを見る</summary>

**正解: C) 赤**

`#RRGGBB` の形式で、`ff` は赤（R）が最大値、緑（G）と青（B）が0なので、純粋な赤色です。

</details>

---

### Q4. ボックスモデルで、コンテンツと枠線の間の余白は何ですか？

- A) margin
- B) border
- C) padding
- D) spacing

<details><summary>答えを見る</summary>

**正解: C) padding**

padding はコンテンツと枠線（border）の間の内側の余白です。margin は要素の外側の余白です。

</details>

---

### Q5. 要素を中央寄せするCSSはどれですか？

- A) `text-align: center;`
- B) `margin: 0 auto;`（width指定あり）
- C) `padding: center;`
- D) `align: center;`

<details><summary>答えを見る</summary>

**正解: B) `margin: 0 auto;`（width指定あり）**

ブロック要素を中央寄せするには、`width` を指定した上で `margin: 0 auto;` を使います。`text-align: center;` はテキストやインライン要素の中央寄せです。

</details>

---

### Q6. `box-sizing: border-box` の効果はどれですか？

- A) ボックスの角を丸くする
- B) widthにpaddingとborderを含めるようにする
- C) ボックスに影を付ける
- D) ボックスを非表示にする

<details><summary>答えを見る</summary>

**正解: B) widthにpaddingとborderを含めるようにする**

通常、`width` はcontentだけの幅ですが、`box-sizing: border-box` を指定すると、paddingとborderを含めた幅が `width` になります。

</details>

---

### Q7. CSSのセレクタ優先順位が高い順番はどれですか？

- A) 要素 > class > id
- B) class > id > 要素
- C) id > class > 要素
- D) id > 要素 > class

<details><summary>答えを見る</summary>

**正解: C) id > class > 要素**

セレクタの優先順位（詳細度）は、id（`#`）が最も高く、次にclass（`.`）、最も低いのが要素セレクタです。

</details>

---

### Q8. `line-height: 1.8;` の意味はどれですか？

- A) 行間が1.8ピクセル
- B) 行間がフォントサイズの1.8倍
- C) 1行に1.8文字
- D) 行数が1.8行

<details><summary>答えを見る</summary>

**正解: B) 行間がフォントサイズの1.8倍**

`line-height` に単位なしの数値を指定すると、フォントサイズに対する倍率になります。日本語では1.6〜1.8が読みやすいとされています。

</details>

---

## 結果の目安

| 正解数 | 評価 |
|--------|------|
| 8問 | 完璧！ Step 5に進みましょう |
| 6-7問 | よくできました。間違えた部分を復習しましょう |
| 4-5問 | もう一度レッスンを読み返しましょう |
| 3問以下 | Step 4を最初からやり直しましょう |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| CSS読み込み | `<link rel="stylesheet" href="...">` |
| セレクタ | 要素、.class、#id |
| 色 | color, background-color, 16進数 |
| フォント | font-family, font-size, line-height |
| ボックスモデル | content + padding + border + margin |

### チェックリスト
- [ ] 8問中6問以上正解できた
- [ ] 間違えた問題の復習が完了した

---

## 次のステップへ

Step 4が完了しました。CSSの基本を身につけましたね。次のStep 5では、ページの「レイアウト」を学んで、要素を自由に配置できるようになります。

---

*推定読了時間: 30分*
