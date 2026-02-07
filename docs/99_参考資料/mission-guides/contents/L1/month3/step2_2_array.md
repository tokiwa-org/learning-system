# 配列メソッドを使いこなそう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 2
subStep: 2
title: "配列メソッドを使いこなそう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "メイン開発言語"
  category: "プログラミング"
  target_level: "L1"
```

---

## ストーリー

> 「データベースから取得したユーザーリストを加工してほしいんだ」
>
> 田中先輩がAPIレスポンスのサンプルを見せた。
>
> 「フィルタリング、変換、集計... forループで全部書く必要はない。
> **配列メソッド**を使えば、やりたいことを宣言的に書ける」
>
> 「宣言的って？」
>
> 「"どう処理するか"ではなく"何をしたいか"を書くんだ。
> コードが短く、読みやすく、バグも減る。プロのやり方だ」

---

## サンプルデータ

このセクション全体を通して使うデータです。

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

const products: Product[] = [
  { id: 1, name: "ノートPC", price: 89800, category: "電子機器", inStock: true },
  { id: 2, name: "マウス", price: 3980, category: "電子機器", inStock: true },
  { id: 3, name: "デスク", price: 29800, category: "家具", inStock: false },
  { id: 4, name: "チェア", price: 45000, category: "家具", inStock: true },
  { id: 5, name: "モニター", price: 34800, category: "電子機器", inStock: true },
  { id: 6, name: "キーボード", price: 12800, category: "電子機器", inStock: false },
  { id: 7, name: "本棚", price: 15800, category: "家具", inStock: true },
];
```

---

## map: 変換する

配列の各要素を変換して新しい配列を作ります。

```typescript
// 商品名の一覧を取得
const names = products.map((product) => product.name);
// ["ノートPC", "マウス", "デスク", "チェア", "モニター", "キーボード", "本棚"]

// 税込価格を計算
const withTax = products.map((product) => ({
  ...product,
  priceWithTax: Math.floor(product.price * 1.1),
}));

// 表示用の文字列に変換
const labels = products.map((p) => `${p.name} (${p.price.toLocaleString()}円)`);
// ["ノートPC (89,800円)", "マウス (3,980円)", ...]
```

> **ポイント**: `map` は元の配列を変更しません。常に新しい配列を返します。

---

## filter: 絞り込む

条件に合う要素だけを取り出した新しい配列を作ります。

```typescript
// 在庫ありの商品だけ
const inStock = products.filter((product) => product.inStock);
// [ノートPC, マウス, チェア, モニター, 本棚]

// 電子機器カテゴリだけ
const electronics = products.filter((p) => p.category === "電子機器");
// [ノートPC, マウス, モニター, キーボード]

// 価格が30000円以下の商品
const affordable = products.filter((p) => p.price <= 30000);
// [マウス, デスク, キーボード, 本棚]

// 複数条件の組み合わせ
const availableElectronics = products.filter(
  (p) => p.category === "電子機器" && p.inStock
);
// [ノートPC, マウス, モニター]
```

---

## reduce: 集約する

配列の全要素を1つの値にまとめます。

```typescript
// 合計金額を計算
const total = products.reduce((sum, product) => sum + product.price, 0);
console.log(total); // 231980

// 最も高い商品を見つける
const mostExpensive = products.reduce((max, product) =>
  product.price > max.price ? product : max
);
console.log(mostExpensive.name); // "ノートPC"

// カテゴリ別にグループ化
const grouped = products.reduce<Record<string, Product[]>>((groups, product) => {
  const key = product.category;
  if (!groups[key]) {
    groups[key] = [];
  }
  groups[key].push(product);
  return groups;
}, {});
// { "電子機器": [...], "家具": [...] }

// カテゴリ別の商品数をカウント
const counts = products.reduce<Record<string, number>>((acc, product) => {
  acc[product.category] = (acc[product.category] || 0) + 1;
  return acc;
}, {});
// { "電子機器": 4, "家具": 3 }
```

> **reduce の構造**: `array.reduce((累積値, 現在の要素) => 新しい累積値, 初期値)`

---

## find と findIndex

条件に合う最初の要素を見つけます。

```typescript
// 最初にマッチした要素を返す（見つからない場合 undefined）
const desk = products.find((p) => p.name === "デスク");
console.log(desk?.price); // 29800

// IDで検索
const productById = products.find((p) => p.id === 3);

// インデックスを取得（見つからない場合 -1）
const index = products.findIndex((p) => p.name === "モニター");
console.log(index); // 4
```

---

## some と every

条件を満たす要素があるか確認します。

```typescript
// some: 1つでも条件を満たす要素があれば true
const hasExpensive = products.some((p) => p.price > 50000);
console.log(hasExpensive); // true（ノートPCが89800円）

// every: 全ての要素が条件を満たせば true
const allInStock = products.every((p) => p.inStock);
console.log(allInStock); // false（デスクとキーボードが在庫なし）

// 実用例: バリデーション
const isValid = products.every((p) => p.price > 0 && p.name.length > 0);
```

---

## sort: 並び替え

```typescript
// 数値でソート（昇順）
const byPriceAsc = [...products].sort((a, b) => a.price - b.price);
// マウス(3980) → キーボード(12800) → 本棚(15800) → ...

// 数値でソート（降順）
const byPriceDesc = [...products].sort((a, b) => b.price - a.price);
// ノートPC(89800) → チェア(45000) → モニター(34800) → ...

// 文字列でソート
const byName = [...products].sort((a, b) => a.name.localeCompare(b.name, "ja"));
```

> **注意**: `sort()` は元の配列を変更します。元を保持したい場合は `[...array].sort()` でコピーしてからソートしましょう。

---

## forEach: 繰り返し処理

```typescript
// 各要素に対して処理を実行（戻り値なし）
products.forEach((product) => {
  console.log(`${product.name}: ${product.price}円`);
});

// インデックスも取得できる
products.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name}`);
});
```

> **map vs forEach**: 変換結果が必要なら `map`、副作用（ログ出力など）だけなら `forEach`。

---

## メソッドチェーン

配列メソッドを連続して呼び出す、強力なテクニックです。

```typescript
// 在庫ありの電子機器を価格順で名前一覧を取得
const result = products
  .filter((p) => p.category === "電子機器")  // 電子機器だけ
  .filter((p) => p.inStock)                   // 在庫ありだけ
  .sort((a, b) => a.price - b.price)          // 価格の安い順
  .map((p) => `${p.name} (${p.price.toLocaleString()}円)`); // 表示用文字列

console.log(result);
// ["マウス (3,980円)", "モニター (34,800円)", "ノートPC (89,800円)"]

// 在庫あり商品の合計金額
const totalInStock = products
  .filter((p) => p.inStock)
  .reduce((sum, p) => sum + p.price, 0);

console.log(`在庫あり合計: ${totalInStock.toLocaleString()}円`);
// "在庫あり合計: 193,380円"
```

### forループとの比較

```typescript
// forループ版（命令的: "どうやるか"を書く）
const result1: string[] = [];
for (let i = 0; i < products.length; i++) {
  if (products[i].category === "電子機器" && products[i].inStock) {
    result1.push(products[i].name);
  }
}

// メソッドチェーン版（宣言的: "何をしたいか"を書く）
const result2 = products
  .filter((p) => p.category === "電子機器" && p.inStock)
  .map((p) => p.name);

// 結果は同じだが、メソッドチェーンの方が意図が明確
```

---

## まとめ

| メソッド | 用途 | 戻り値 |
|----------|------|--------|
| map | 各要素を変換 | 新しい配列 |
| filter | 条件で絞り込み | 新しい配列 |
| reduce | 全要素を1つに集約 | 任意の値 |
| find | 最初にマッチする要素 | 要素 or undefined |
| some | 1つでも条件を満たすか | boolean |
| every | 全て条件を満たすか | boolean |
| sort | 並び替え | 元の配列（破壊的） |
| forEach | 副作用のある繰り返し | undefined |

### チェックリスト

- [ ] map で配列の各要素を変換できる
- [ ] filter で条件に合う要素を抽出できる
- [ ] reduce で合計・グループ化ができる
- [ ] find/some/every を使い分けられる
- [ ] メソッドチェーンで複数の操作を組み合わせられる

---

## 次のステップへ

配列メソッドをマスターしました。

次のセクションでは、**非同期処理**を学びます。
Promise と async/await を使いこなせれば、APIとの通信やファイル操作など、
実務で必須のスキルが身につきます。

---

*推定読了時間: 30分*
