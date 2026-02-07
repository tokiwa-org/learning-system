# デバッグの技法

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 4
subStep: 4
title: "デバッグの技法"
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

> 「バグに遭遇した。どうする？」
>
> 「えっと... console.log を入れて...」
>
> 田中先輩は頷いた。
>
> 「console.log は悪くない。でもそれだけじゃ限界がある。
> **効率的なデバッグの手順**を身につければ、
> バグの解決速度が3倍は変わる」

---

## デバッグの基本手順

```
1. バグを再現する
   └── いつ、どんな操作で発生するか特定

2. 仮説を立てる
   └── 「この変数がnullだからでは？」

3. 仮説を検証する
   └── ログ出力、デバッガ、テスト

4. 原因を特定する
   └── 期待値と実際の値の差を確認

5. 修正して確認する
   └── 修正後に再度テスト
```

---

## console.log デバッグ

最も基本的で手軽なデバッグ手法です。

### TypeScript

```typescript
function processOrder(order: Order): number {
  console.log("=== processOrder 開始 ===");
  console.log("order:", JSON.stringify(order, null, 2));

  const subtotal = order.items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    console.log(`item: ${item.name}, total: ${itemTotal}`);
    return sum + itemTotal;
  }, 0);

  console.log("subtotal:", subtotal);

  const tax = Math.floor(subtotal * 0.1);
  console.log("tax:", tax);

  const total = subtotal + tax;
  console.log("total:", total);
  console.log("=== processOrder 終了 ===");

  return total;
}
```

### Python

```python
def process_order(order):
    print("=== process_order 開始 ===")
    print(f"order: {order}")

    subtotal = 0
    for item in order["items"]:
        item_total = item["price"] * item["quantity"]
        print(f"item: {item['name']}, total: {item_total}")
        subtotal += item_total

    print(f"subtotal: {subtotal}")

    tax = int(subtotal * 0.1)
    total = subtotal + tax
    print(f"tax: {tax}, total: {total}")
    print("=== process_order 終了 ===")

    return total
```

### console のバリエーション（TypeScript）

```typescript
// 基本
console.log("値:", value);

// テーブル表示
console.table(users);

// オブジェクトの詳細表示
console.dir(complexObject, { depth: null });

// 時間計測
console.time("処理名");
expensiveOperation();
console.timeEnd("処理名"); // "処理名: 123.45ms"

// 警告・エラー
console.warn("注意: この値は予期しないかもしれません");
console.error("エラー: データが不正です");
```

---

## デバッガの使い方

### VS Code デバッガ（TypeScript）

1. 行番号の左をクリックしてブレークポイントを設定
2. `F5` でデバッグ開始
3. ブレークポイントで停止したら変数の値を確認

### launch.json の設定

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TypeScript",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["ts-node", "${file}"],
      "console": "integratedTerminal"
    }
  ]
}
```

### デバッガの操作

| 操作 | ショートカット | 説明 |
|------|-------------|------|
| 続行 | `F5` | 次のブレークポイントまで実行 |
| ステップオーバー | `F10` | 現在の行を実行して次の行へ |
| ステップイン | `F11` | 関数の中に入る |
| ステップアウト | `Shift+F11` | 現在の関数から出る |
| 停止 | `Shift+F5` | デバッグを終了 |

### Python のデバッグ

```python
# breakpoint() を使う（Python 3.7+）
def process_data(data):
    result = transform(data)
    breakpoint()  # ここでデバッガが起動
    return result

# pdb コマンド
# n: 次の行（step over）
# s: 関数に入る（step in）
# c: 続行（continue）
# p 変数名: 変数の値を表示
# q: 終了
```

---

## スタックトレースの読み方

### TypeScript のエラー

```
TypeError: Cannot read properties of undefined (reading 'name')
    at getUserName (/src/services/user.ts:15:24)
    at processOrder (/src/services/order.ts:42:18)
    at main (/src/index.ts:10:3)
```

読み方:
1. **1行目**: エラーの種類とメッセージ（`undefined` の `name` にアクセスしようとした）
2. **2行目以降**: コールスタック（下から上へ呼び出し順）
3. **最上段**: エラーが発生した場所（`user.ts` の15行目24文字目）

### Python のエラー

```
Traceback (most recent call last):
  File "/src/main.py", line 10, in <module>
    process_order(order)
  File "/src/services/order.py", line 42, in process_order
    name = get_user_name(user)
  File "/src/services/user.py", line 15, in get_user_name
    return user["name"]
KeyError: 'name'
```

> **Python は下が最新**: TypeScript（上が最新）と逆順なので注意。

---

## よくあるバグとその対処

### 1. undefined / null エラー

```typescript
// バグ: user が undefined の場合にエラー
const name = user.name; // TypeError!

// 対処: 事前チェック
const name = user?.name ?? "不明";

// 対処: ガード句
if (!user) {
  throw new Error("ユーザーが見つかりません");
}
```

### 2. 型の不一致

```typescript
// バグ: 文字列の "1" と数値の 1 を混同
const id = "1";
if (id === 1) { // false! 型が違う
  // ...
}

// 対処: 型を変換
if (Number(id) === 1) {
  // ...
}
```

### 3. 非同期処理の await 忘れ

```typescript
// バグ: await を忘れて Promise オブジェクトが入る
const user = fetchUser(1); // Promise<User> が入ってしまう
console.log(user.name);     // undefined!

// 対処: await を追加
const user = await fetchUser(1);
console.log(user.name);     // OK
```

### 4. 配列の破壊的操作

```typescript
// バグ: sort は元の配列を変更する
const original = [3, 1, 2];
const sorted = original.sort();
console.log(original); // [1, 2, 3] ← 元の配列も変わっている！

// 対処: コピーしてからソート
const sorted = [...original].sort();
```

---

## デバッグのコツ

| コツ | 説明 |
|------|------|
| 二分探索 | コードの真ん中にログを入れ、問題の範囲を半分に絞る |
| 最小再現 | 問題を再現する最小限のコードを作る |
| ラバーダック | 問題を誰か（ぬいぐるみでも可）に口で説明する |
| git bisect | どのコミットでバグが入ったか二分探索する |
| 休憩 | 30分以上詰まったら一度休憩する |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 手順 | 再現 → 仮説 → 検証 → 特定 → 修正 |
| console.log | 手軽だが体系的に使う |
| デバッガ | ブレークポイントで変数を確認 |
| スタックトレース | エラーの発生場所と呼び出し順を読む |
| よくあるバグ | undefined, 型不一致, await忘れ, 破壊的操作 |

### チェックリスト

- [ ] console.log を使って変数の値を追跡できる
- [ ] スタックトレースからエラーの発生場所を特定できる
- [ ] デバッガのブレークポイントを設定できる
- [ ] よくあるバグのパターンを知っている
- [ ] 体系的なデバッグ手順を実践できる

---

## 次のステップへ

デバッグの技法を学びました。

次はいよいよ**演習**です。
TypeScriptとPythonのレガシーコードを読み解き、バグを修正する実践課題に挑みましょう。

---

*推定読了時間: 30分*
