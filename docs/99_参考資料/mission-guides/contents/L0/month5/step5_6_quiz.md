# チェックポイント：レイアウトの基本

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 5
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L0"
passingScore: 75
```

---

## クイズの説明

Step 5で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 75%（6問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1: displayプロパティで要素を横並びにする値はどれですか？

A) display: block
B) display: inline
C) display: flex
D) display: none

<details><summary>答えを見る</summary>

**正解: C) display: flex**

`display: flex` を親要素に指定すると、子要素が横並び（または縦並び）になります。これがFlexboxレイアウトの基本です。

- block: ブロック要素（縦に積み重なる）
- inline: インライン要素（文中に配置）
- none: 非表示

</details>

---

### Q2: Flexboxで要素を横方向に中央揃えするプロパティはどれですか？

A) align-items: center
B) justify-content: center
C) flex-direction: center
D) text-align: center

<details><summary>答えを見る</summary>

**正解: B) justify-content: center**

Flexboxの配置プロパティ：
- **justify-content**: 主軸方向（デフォルトは横方向）の配置
- **align-items**: 交差軸方向（デフォルトは縦方向）の配置

`justify-content: center` で横方向の中央揃えになります。

</details>

---

### Q3: Flexboxの flex-wrap: wrap の効果として正しいものはどれですか？

A) 要素を縦に並べる
B) 収まりきらない要素を非表示にする
C) 収まりきらない要素を次の行に折り返す
D) 要素を逆順に並べる

<details><summary>答えを見る</summary>

**正解: C) 収まりきらない要素を次の行に折り返す**

`flex-wrap` の値：
- nowrap: 折り返さない（デフォルト）
- **wrap: 折り返す**
- wrap-reverse: 逆方向に折り返す

カードグリッドなど、複数の要素を並べるときに使います。

</details>

---

### Q4: Flexboxで要素間の余白を設定するプロパティはどれですか？

A) margin
B) padding
C) gap
D) spacing

<details><summary>答えを見る</summary>

**正解: C) gap**

`gap` プロパティを使うと、Flexアイテム間の余白を簡単に設定できます。

```css
.container {
  display: flex;
  gap: 20px;  /* アイテム間に20pxの余白 */
}
```

marginを使うより簡潔に書けます。

</details>

---

### Q5: レスポンシブデザインに必須のHTMLメタタグはどれですか？

A) `<meta charset="UTF-8">`
B) `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
C) `<meta name="description" content="...">`
D) `<meta http-equiv="refresh" content="5">`

<details><summary>答えを見る</summary>

**正解: B) `<meta name="viewport" content="width=device-width, initial-scale=1.0">`**

viewport メタタグがないと、スマートフォンでもPC用の幅で表示され、すべてが小さく見えてしまいます。

- width=device-width: 画面幅をデバイスの幅に合わせる
- initial-scale=1.0: 初期ズームを100%にする

</details>

---

### Q6: CSSのメディアクエリで「画面幅が768px以下のとき」を指定する書き方はどれですか？

A) @media (width: 768px)
B) @media (max-width: 768px)
C) @media (min-width: 768px)
D) @media screen 768px

<details><summary>答えを見る</summary>

**正解: B) @media (max-width: 768px)**

メディアクエリの条件：
- **max-width: 768px**: 768px **以下** のとき
- min-width: 768px: 768px **以上** のとき

```css
@media (max-width: 768px) {
  /* スマホ・タブレット向けのスタイル */
}
```

</details>

---

### Q7: 画像が親要素からはみ出さないようにするCSSはどれですか？

A) width: 100%
B) max-width: 100%
C) min-width: 100%
D) overflow: hidden

<details><summary>答えを見る</summary>

**正解: B) max-width: 100%**

`max-width: 100%` を画像に指定すると、画像は親要素の幅を超えて大きくならず、小さい場合はそのままのサイズを維持します。

```css
img {
  max-width: 100%;
  height: auto;  /* 縦横比を維持 */
}
```

`width: 100%` だと、小さい画像も引き伸ばされてしまいます。

</details>

---

### Q8: Flexboxでサイドバーを固定幅250px、メインコンテンツを残りの幅にする設定はどれですか？

A) サイドバー: width: 250px / メイン: width: 100%
B) サイドバー: flex: 1 / メイン: flex: 250px
C) サイドバー: flex: 0 0 250px / メイン: flex: 1
D) サイドバー: min-width: 250px / メイン: max-width: 100%

<details><summary>答えを見る</summary>

**正解: C) サイドバー: flex: 0 0 250px / メイン: flex: 1**

`flex` の書き方: `flex: grow shrink basis`
- `flex: 0 0 250px`: 伸びない、縮まない、基本幅250px（固定幅）
- `flex: 1`: 残りのスペースを占める

```css
.sidebar {
  flex: 0 0 250px;  /* 固定幅 */
}
.main {
  flex: 1;          /* 残りを占める */
}
```

</details>

---

## 結果

### 6問以上正解の場合

**合格です！おめでとうございます！**

Step 5「レイアウトの基本を覚えよう」を完了しました。
次はStep 6「自己紹介ページを完成させよう」に進みましょう。

### 5問以下の場合

**もう少し復習しましょう**

間違えた問題の内容を、該当するセクションで復習してください：

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step5_1 displayプロパティを理解しよう |
| Q2 | step5_2 Flexboxでレイアウトしよう |
| Q3 | step5_2 Flexboxでレイアウトしよう |
| Q4 | step5_2 Flexboxでレイアウトしよう |
| Q5 | step5_3 レスポンシブデザインの基本 |
| Q6 | step5_3 レスポンシブデザインの基本 |
| Q7 | step5_3 レスポンシブデザインの基本 |
| Q8 | step5_5 レイアウト実践練習 |

---

## Step 5 完了！

お疲れさまでした！

### 学んだこと

- displayプロパティ（block, inline, flex, none）
- Flexboxの基本（justify-content, align-items, gap）
- flex-wrap で折り返しレイアウト
- viewport メタタグの重要性
- メディアクエリでレスポンシブ対応
- よく使うレイアウトパターン

### 次のステップ

**Step 6: 自己紹介ページを完成させよう（2時間）**

いよいよ最終ステップです！これまでに学んだHTML/CSSの知識を総動員して、自己紹介サイトを完成させましょう。

---

*推定所要時間: 30分*
