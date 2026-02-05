# 演習：レビュー指摘対応シミュレーション

## メタ情報

```yaml
mission: "品質を意識した作業を覚えよう"
step: 5
subStep: 3
title: "演習：レビュー指摘対応シミュレーション"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "品質管理"
  category: "ヒューマンスキル"
  target_level: "L0"
```

---

## ストーリー

> 「よくある指摘パターンは覚えたね。次は実際に対応してみよう」
>
> 「はい、やってみます！」
>
> 「今回は、問題のあるコードを自分で修正して、さらにチェックリストも作ってもらうよ」
>
> 「わかりました！」

---

## ミッション概要

レビュー指摘を受けたコードを修正し、今後のためのチェックリストを作成します。

| Part | 内容 | 目安時間 |
|------|------|---------|
| Part 1 | コードの問題点を特定する | 20分 |
| Part 2 | 指摘に対応してコードを修正する | 40分 |
| Part 3 | 学びをチェックリストに反映する | 30分 |

### 達成条件

- [ ] Part 1: 8つ以上の問題点を特定できた
- [ ] Part 2: すべての問題点を修正したコードを作成できた
- [ ] Part 3: 10項目以上のチェックリストを作成できた

---

## 前提：レビューを受けたコード

あなたは「商品管理機能」を実装し、以下のレビューコメントを受けました。

### 提出したコード（product-service.js）

```javascript
// 商品管理サービス
var products = [];
var TAX = 0.1;

function add(p) {
  // 商品を追加する
  console.log("adding product:", p);
  products.push(p);
  return true;
}

function get(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      return products[i];
    }
  }
  return null;
}

function calc(id, qty) {
  var p = get(id);
  var price = p.price * qty;
  var tax = price * 0.1;
  var total = price + tax;
  console.log("total:", total);
  return total;
}

function remove(id) {
  // TODO: あとで実装
}

function update(id, data) {
  var p = get(id);
  p.name = data.name;
  p.price = data.price;
  p.description = data.description;
  p.category = data.category;
  p.stock = data.stock;
  return p;
}

// ユーザー用の関数
function searchByCategory(cat) {
  var result = [];
  for (var i = 0; i < products.length; i++) {
    if (products[i].category == cat) {
      result.push(products[i]);
    }
  }
  return result;
}

// 管理者用の関数
function searchByCategory2(cat, includeOutOfStock) {
  var result = [];
  for (var i = 0; i < products.length; i++) {
    if (products[i].category == cat) {
      if (includeOutOfStock || products[i].stock > 0) {
        result.push(products[i]);
      }
    }
  }
  return result;
}
```

### 受けたレビューコメント

1. 「`var` ではなく `const`/`let` を使ってください」
2. 「`console.log` が残っています」
3. 「`==` ではなく `===` を使ってください」
4. 「関数名 `add`, `get`, `calc` が何を操作するかわかりません」
5. 「`calc` 関数でTAX定数があるのに `0.1` を直書きしています」
6. 「`calc` 関数で `get(id)` が `null` を返した場合の考慮がありません」
7. 「`update` 関数でも `null` チェックがありません」
8. 「`searchByCategory` と `searchByCategory2` のコードが重複しています」
9. 「`remove` 関数のTODOがそのままです。このPRで実装しますか？」
10. 「`for` ループより `filter` を使った方が簡潔です」

---

## Part 1: コードの問題点を特定する（20分）

### タスク 1-1: 問題点とパターンの対応表を作成

レビューコメントを、Step 5-2で学んだ「よくある指摘パターン」に分類してください。

```markdown
## 問題点とパターンの対応

| コメント番号 | 問題点の要約 | パターン番号 | パターン名 |
|-------------|-------------|-------------|-----------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| ... | | | |
```

<details>
<summary>解答例</summary>

| コメント番号 | 問題点の要約 | パターン番号 | パターン名 |
|-------------|-------------|-------------|-----------|
| 1 | var を使っている | 3 | コーディング規約違反 |
| 2 | console.logが残っている | 1 | デバッグコードの消し忘れ |
| 3 | ==を使っている | 3 | コーディング規約違反 |
| 4 | 関数名が不適切 | 2 | 命名が不適切 |
| 5 | マジックナンバー0.1 | 5 | マジックナンバー |
| 6 | nullチェックがない | 4 | エラーハンドリングの欠如 |
| 7 | nullチェックがない | 4 | エラーハンドリングの欠如 |
| 8 | 重複コード | 8 | 重複コード |
| 9 | TODO放置 | - | （その他） |
| 10 | 改善提案 | - | （改善提案） |

</details>

---

## Part 2: 指摘に対応してコードを修正する（40分）

### タスク 2-1: 修正後のコードを作成

すべての指摘に対応した修正後のコードを作成してください。

```javascript
// 修正後のコード（product-service.js）

// ここにコードを書いてください

```

<details>
<summary>解答例</summary>

```javascript
// 商品管理サービス
const products = [];
const TAX_RATE = 0.1;

/**
 * 商品を追加する
 * @param {Object} product - 商品オブジェクト
 * @returns {boolean} 追加成功時はtrue
 */
function addProduct(product) {
  products.push(product);
  return true;
}

/**
 * IDで商品を取得する
 * @param {string|number} id - 商品ID
 * @returns {Object|null} 商品オブジェクト、見つからない場合はnull
 */
function getProductById(id) {
  return products.find(product => product.id === id) || null;
}

/**
 * 商品の合計金額（税込）を計算する
 * @param {string|number} id - 商品ID
 * @param {number} quantity - 数量
 * @returns {number} 税込合計金額
 * @throws {Error} 商品が見つからない場合
 */
function calculateTotalPrice(id, quantity) {
  const product = getProductById(id);

  if (product === null) {
    throw new Error(`Product not found: ${id}`);
  }

  const subtotal = product.price * quantity;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return total;
}

/**
 * 商品を削除する
 * @param {string|number} id - 商品ID
 * @returns {boolean} 削除成功時はtrue
 * @throws {Error} 商品が見つからない場合
 */
function removeProduct(id) {
  const index = products.findIndex(product => product.id === id);

  if (index === -1) {
    throw new Error(`Product not found: ${id}`);
  }

  products.splice(index, 1);
  return true;
}

/**
 * 商品情報を更新する
 * @param {string|number} id - 商品ID
 * @param {Object} data - 更新データ
 * @returns {Object} 更新後の商品オブジェクト
 * @throws {Error} 商品が見つからない場合
 */
function updateProduct(id, data) {
  const product = getProductById(id);

  if (product === null) {
    throw new Error(`Product not found: ${id}`);
  }

  // 指定されたフィールドのみ更新
  if (data.name !== undefined) product.name = data.name;
  if (data.price !== undefined) product.price = data.price;
  if (data.description !== undefined) product.description = data.description;
  if (data.category !== undefined) product.category = data.category;
  if (data.stock !== undefined) product.stock = data.stock;

  return product;
}

/**
 * カテゴリで商品を検索する
 * @param {string} category - カテゴリ名
 * @param {Object} options - 検索オプション
 * @param {boolean} options.includeOutOfStock - 在庫切れを含むか（デフォルト: false）
 * @returns {Array} 商品の配列
 */
function searchProductsByCategory(category, options = {}) {
  const { includeOutOfStock = false } = options;

  return products.filter(product => {
    if (product.category !== category) {
      return false;
    }
    if (!includeOutOfStock && product.stock <= 0) {
      return false;
    }
    return true;
  });
}

module.exports = {
  addProduct,
  getProductById,
  calculateTotalPrice,
  removeProduct,
  updateProduct,
  searchProductsByCategory
};
```

</details>

### タスク 2-2: 修正内容の説明を作成

各修正について、レビュアーへの返信として説明を書いてください。

```markdown
## 修正内容の説明

### コメント1への対応
修正内容:
理由:

### コメント2への対応
修正内容:
理由:

（続く...）
```

<details>
<summary>解答例</summary>

```markdown
## 修正内容の説明

### コメント1への対応（var → const/let）
修正内容: すべてのvarをconst/letに変更しました
理由: ES6以降の標準に従い、再代入しない変数はconst、再代入する変数はletを使用

### コメント2への対応（console.log削除）
修正内容: すべてのconsole.logを削除しました
理由: 本番環境で不要な出力を防ぐため

### コメント3への対応（== → ===）
修正内容: すべての比較演算子を===に変更しました
理由: 型安全な比較を行うため

### コメント4への対応（関数名の改善）
修正内容: add→addProduct, get→getProductById, calc→calculateTotalPrice
理由: 関数名から何を操作するか明確にするため

### コメント5への対応（マジックナンバー）
修正内容: 0.1をTAX_RATE定数で統一しました
理由: 税率変更時に1箇所の修正で済むようにするため

### コメント6への対応（calc関数のnullチェック）
修正内容: getProductById()がnullを返した場合にErrorをthrowするよう変更
理由: 存在しない商品の計算を防ぎ、呼び出し元で適切にハンドリングできるようにするため

### コメント7への対応（update関数のnullチェック）
修正内容: 同様にnullチェックとError throwを追加
理由: 存在しない商品の更新を防ぐため

### コメント8への対応（重複コードの統合）
修正内容: searchByCategory と searchByCategory2 を searchProductsByCategory に統合し、optionsパラメータで挙動を制御
理由: DRY原則に従い、メンテナンス性を向上させるため

### コメント9への対応（TODO実装）
修正内容: removeProduct関数を実装しました
理由: このPRのスコープ内であったため

### コメント10への対応（filterの使用）
修正内容: forループをfilterメソッドに置き換えました
理由: コードの可読性向上のため
```

</details>

---

## Part 3: 学びをチェックリストに反映する（30分）

### タスク 3-1: 今回の学びを記録

今回のレビューで学んだことを記録してください。

```markdown
## 今回のレビューで学んだこと

| 指摘内容 | 学んだこと | 今後の対策 |
|---------|-----------|-----------|
| | | |
| | | |
```

### タスク 3-2: セルフレビューチェックリストを作成

今回の学びを反映した「セルフレビューチェックリスト」を作成してください。

```markdown
## マイ・セルフレビューチェックリスト

### コーディング規約
- [ ]
- [ ]

### 命名
- [ ]
- [ ]

### エラーハンドリング
- [ ]
- [ ]

### コード品質
- [ ]
- [ ]

### その他
- [ ]
- [ ]
```

<details>
<summary>解答例</summary>

```markdown
## マイ・セルフレビューチェックリスト

### コーディング規約
- [ ] var を使わず const/let を使っている
- [ ] == ではなく === を使っている
- [ ] console.log を削除した

### 命名
- [ ] 関数名は動詞で始まり、何をするかわかる（例: getUser, calculateTotal）
- [ ] 変数名は何が入っているかわかる（例: userName, productList）
- [ ] 略語を使いすぎていない

### エラーハンドリング
- [ ] nullやundefinedが返る可能性のある関数の戻り値をチェックしている
- [ ] 外部API呼び出しやDB操作にtry-catchがある
- [ ] エラーメッセージが具体的で、原因がわかる

### コード品質
- [ ] マジックナンバーを使わず、定数として定義している
- [ ] 重複コードがない（DRY原則）
- [ ] 1つの関数が1つの責務を持っている
- [ ] 50行を超える関数がない

### その他
- [ ] TODOコメントを放置していない
- [ ] 不要なコメントを削除した
- [ ] JSDocコメントで関数の使い方を説明した
```

</details>

---

## 達成度チェック

以下を確認してください：

- [ ] Part 1: 8つ以上の問題点を特定できた
- [ ] Part 2: すべての問題点を修正したコードを作成できた
- [ ] Part 3: 10項目以上のチェックリストを作成できた

---

## まとめ

この演習で実践したこと：

| 操作 | 内容 |
|------|------|
| 問題特定 | レビューコメントをパターンに分類 |
| コード修正 | 指摘に対応した修正を実施 |
| 学びの記録 | 指摘から学んだことを整理 |
| チェックリスト作成 | 今後のためのセルフレビュー項目を作成 |

### 重要なポイント

1. **パターンを知ると気づきやすい** - よくある指摘を事前に知っておく
2. **修正理由を説明できる** - なぜその修正をしたか説明できると理解が深まる
3. **チェックリストに反映** - 同じ指摘を繰り返さないための仕組みを作る

---

## 次のステップへ

レビュー指摘対応のシミュレーションは完了しました。

次のセクションでは、Step 5の理解度を確認するチェックポイントに挑戦します。

---

*推定所要時間: 90分*
