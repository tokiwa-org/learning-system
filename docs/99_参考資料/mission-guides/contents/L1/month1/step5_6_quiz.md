# チェックポイント：CSSグリッドで世界を構築しよう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 5
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 5で学んだCSS Grid、アニメーション、Sassの知識を確認します。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. CSS Grid で3列の均等レイアウトを作るプロパティの書き方はどれですか？

- A) `grid-template-columns: 3`
- B) `grid-template-columns: repeat(3, 1fr)`
- C) `grid-columns: 3`
- D) `display: grid-3`

<details>
<summary>答えを見る</summary>

**正解: B**

`grid-template-columns: repeat(3, 1fr)` で3列の均等分割レイアウトが作成されます。
- `repeat(3, 1fr)` は `1fr 1fr 1fr` と同じ意味
- `fr` は利用可能なスペースを均等に分割する単位

</details>

---

### Q2. `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))` の動作として正しいものはどれですか？

- A) 常に300pxの固定幅列を作る
- B) 画面幅に応じて列数が自動的に変わるレスポンシブレイアウトを作る
- C) 最大3列のレイアウトを作る
- D) 300px以上のスペースがある場合のみ列を作る

<details>
<summary>答えを見る</summary>

**正解: B**

この記述は、各列の最小幅を300px、最大幅を1frとし、
画面幅に応じて列数が自動で調整されるレスポンシブレイアウトを作ります。

- 画面幅1200px → 3列
- 画面幅800px → 2列
- 画面幅400px → 1列

メディアクエリなしでレスポンシブを実現できます。

</details>

---

### Q3. CSS transition について正しい説明はどれですか？

- A) 要素を常にアニメーションさせ続ける
- B) CSSプロパティの値が変化した時に滑らかに遷移させる
- C) JavaScriptでのみ使用できる
- D) 複数のステップを定義できるアニメーション

<details>
<summary>答えを見る</summary>

**正解: B**

`transition` は、CSSプロパティの値が変化した時（例: :hover）に、
変化前から変化後の状態へ滑らかに遷移させます。

- `transition: background-color 0.3s ease;` のように記述
- 複数ステップのアニメーションには @keyframes を使用

</details>

---

### Q4. アニメーションのパフォーマンスが最も高いプロパティの組み合わせはどれですか？

- A) `width` と `height`
- B) `margin` と `padding`
- C) `transform` と `opacity`
- D) `top` と `left`

<details>
<summary>答えを見る</summary>

**正解: C**

`transform` と `opacity` はGPUで処理（合成レイヤー）されるため、
他のプロパティより遥かにパフォーマンスが高いです。

- `width`, `height`, `margin` → レイアウト再計算が必要（重い）
- `color`, `background` → 再描画が必要（中程度）
- `transform`, `opacity` → 合成のみ（軽い、推奨）

</details>

---

### Q5. Sass/SCSSの変数の正しい書き方はどれですか？

- A) `@primary-color: #3498db;`
- B) `--primary-color: #3498db;`
- C) `$primary-color: #3498db;`
- D) `%primary-color: #3498db;`

<details>
<summary>答えを見る</summary>

**正解: C**

Sass/SCSSの変数は `$` プレフィックスで定義します。
- `$primary-color: #3498db;` が正しい
- `--custom-property` はCSS カスタムプロパティ（CSS変数）で、Sassとは別物
- `@` はディレクティブ、`%` はプレースホルダーセレクタに使われる

</details>

---

### Q6. SCSSのネストにおける `&` の意味として正しいものはどれですか？

- A) 子要素を選択する
- B) 親セレクタを参照する
- C) 隣接要素を選択する
- D) 全ての要素を選択する

<details>
<summary>答えを見る</summary>

**正解: B**

`&` は親セレクタ全体を参照する特別な記号です。

```scss
.button {
    &:hover { }     // → .button:hover
    &--large { }    // → .button--large
    &__icon { }     // → .button__icon
}
```

BEM記法との相性が良く、コンポーネントの全スタイルを1ブロックで記述できます。

</details>

---

### Q7. @keyframes アニメーションを無限に繰り返す設定はどれですか？

- A) `animation-repeat: forever;`
- B) `animation-iteration-count: infinite;`
- C) `animation-loop: true;`
- D) `animation-count: -1;`

<details>
<summary>答えを見る</summary>

**正解: B**

`animation-iteration-count: infinite;` でアニメーションが無限に繰り返されます。

ショートハンドでは:
```css
animation: spin 1s linear infinite;
```

`iteration-count` には数値（回数指定）または `infinite` を指定できます。

</details>

---

### Q8. SCSSの @mixin と @include について正しいものはどれですか？

- A) @mixin で使用し、@include で定義する
- B) @mixin で定義し、@include で使用する
- C) @mixin と @include は同じ機能
- D) @include はCSS標準の機能

<details>
<summary>答えを見る</summary>

**正解: B**

- `@mixin` はスタイルのパターンを**定義**する
- `@include` は定義されたミックスインを**使用**する

```scss
// 定義
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

// 使用
.hero {
    @include flex-center;
}
```

</details>

---

## 結果

### 7問以上正解の場合

**合格です。おめでとうございます。**

Step 5「CSSグリッドで世界を構築しよう」を完了しました。
次は Step 6「最終試験：環境構築チャレンジ」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1, Q2 | step5_1, step5_2 CSS Grid |
| Q3, Q4, Q7 | step5_3 CSSアニメーション |
| Q5, Q6, Q8 | step5_4 Sass/SCSS |

---

## Step 5 完了

お疲れさまでした。

### 学んだこと

- CSS Grid の基本と高度なレイアウト
- auto-fit / minmax() によるレスポンシブ
- transition, transform, @keyframes によるアニメーション
- Sass/SCSSの変数、ネスト、ミックスイン、パーシャル

### 次のステップ

**Step 6: 最終試験：環境構築チャレンジ（2時間）**

全ての知識を統合した総合演習と卒業クイズです。

---

*推定所要時間: 30分*
