# 演習：レガシーコードの解読と修正

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 4
subStep: 5
title: "演習：レガシーコードの解読と修正"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "サブ開発言語"
  category: "プログラミング"
  target_level: "L1"
```

---

## ストーリー

> 「本番環境でバグ報告が上がっている」田中先輩が言った。
>
> 「TypeScriptとPythonの両方のコードにバグがある。
> コードを読んで、バグの原因を特定し、修正してくれ」
>
> 「はい！前のレッスンで学んだことを使います」
>
> 「制限時間は90分。5つのミッションだ。頑張れ」

---

## ミッション概要

| ミッション | テーマ | 言語 | 難易度 |
|-----------|--------|------|--------|
| Mission 1 | バグ修正：ユーザー検証 | TypeScript | 初級 |
| Mission 2 | バグ修正：データ集計 | TypeScript | 初級 |
| Mission 3 | コード解読：Pythonスクリプト | Python | 中級 |
| Mission 4 | バグ修正：APIクライアント | TypeScript | 中級 |
| Mission 5 | レガシーコードの改善 | Python | 上級 |

---

## Mission 1: バグ修正 - ユーザー検証（10分）

以下のTypeScriptコードにはバグが3つあります。見つけて修正してください。

### バグのあるコード

```typescript
function validateUser(user: any): string[] {
  const errors = [];

  // 名前の検証
  if (user.name.length = 0) {
    errors.push("名前は必須です");
  }

  // メールの検証
  if (!user.email.includes("@")) {
    errors.push("メールアドレスが不正です");
  }

  // 年齢の検証
  if (user.age < 0 || user.age > 150) {
    errors.push("年齢が不正です");
  }

  return errors;
}

// テスト: 以下の呼び出しでエラーが発生する
const result1 = validateUser({ name: "", email: "test@example.com", age: 25 });
const result2 = validateUser({ name: "田中", email: "invalid", age: 25 });
const result3 = validateUser(null);
```

### 報告されているバグ

1. `name` が空文字列でもエラーにならない
2. `null` を渡すとクラッシュする
3. `any` 型が使われている

<details>
<summary>解答</summary>

```typescript
interface UserInput {
  name: string;
  email: string;
  age: number;
}

function validateUser(user: UserInput | null): string[] {
  const errors: string[] = [];

  // バグ3修正: null チェックを追加
  if (!user) {
    errors.push("ユーザーデータが必要です");
    return errors;
  }

  // バグ1修正: = を === に（代入ではなく比較）
  if (user.name.length === 0) {
    errors.push("名前は必須です");
  }

  // メールの検証
  if (!user.email.includes("@")) {
    errors.push("メールアドレスが不正です");
  }

  // 年齢の検証
  if (user.age < 0 || user.age > 150) {
    errors.push("年齢が不正です");
  }

  return errors;
}
```

**バグの解説:**
1. `user.name.length = 0` は代入（常に0 = falsy）。`===` に修正
2. `null` チェックが不足。ガード句を追加
3. `any` を適切なインターフェースに変更

</details>

---

## Mission 2: バグ修正 - データ集計（15分）

以下のデータ集計コードにバグがあります。修正してください。

### バグのあるコード

```typescript
interface Sale {
  product: string;
  amount: number;
  date: string;
}

function analyzeSales(sales: Sale[]): void {
  // 合計金額
  let total = 0;
  for (const sale of sales) {
    total += sale.amount;
  }
  console.log(`合計: ${total}円`);

  // 商品別の平均金額
  const productTotals: Record<string, number> = {};
  const productCounts: Record<string, number> = {};

  for (const sale of sales) {
    productTotals[sale.product] += sale.amount;
    productCounts[sale.product] += 1;
  }

  for (const product in productTotals) {
    const avg = productTotals[product] / productCounts[product];
    console.log(`${product}: 平均 ${avg}円`);
  }

  // 最も売上が高い日
  const dailyTotals: Record<string, number> = {};
  for (const sale of sales) {
    dailyTotals[sale.date] += sale.amount;
  }

  const topDay = Object.entries(dailyTotals).sort((a, b) => a[1] - b[1])[0];
  console.log(`最高売上日: ${topDay[0]} (${topDay[1]}円)`);
}
```

### 報告されているバグ

1. 商品別集計で `NaN` が表示される
2. 最高売上日が最低売上日になっている

<details>
<summary>解答</summary>

```typescript
function analyzeSales(sales: Sale[]): void {
  // 合計金額（これは正しい）
  let total = 0;
  for (const sale of sales) {
    total += sale.amount;
  }
  console.log(`合計: ${total}円`);

  // バグ1修正: 初期値が undefined のため NaN になる
  const productTotals: Record<string, number> = {};
  const productCounts: Record<string, number> = {};

  for (const sale of sales) {
    // undefined + number = NaN なので、初期値を設定する
    productTotals[sale.product] = (productTotals[sale.product] || 0) + sale.amount;
    productCounts[sale.product] = (productCounts[sale.product] || 0) + 1;
  }

  for (const product in productTotals) {
    const avg = Math.round(productTotals[product] / productCounts[product]);
    console.log(`${product}: 平均 ${avg}円`);
  }

  // バグ1修正（同じ問題）+ バグ2修正: ソート順を降順に
  const dailyTotals: Record<string, number> = {};
  for (const sale of sales) {
    dailyTotals[sale.date] = (dailyTotals[sale.date] || 0) + sale.amount;
  }

  // バグ2修正: b[1] - a[1] で降順ソート
  const topDay = Object.entries(dailyTotals).sort((a, b) => b[1] - a[1])[0];
  console.log(`最高売上日: ${topDay[0]} (${topDay[1]}円)`);
}
```

**バグの解説:**
1. `Record` のプロパティは初期化されていないため `undefined`。`undefined + number = NaN`
2. `a[1] - b[1]` は昇順ソート。降順にするには `b[1] - a[1]`

</details>

---

## Mission 3: コード解読 - Pythonスクリプト（20分）

以下のPythonコードを読んで、質問に答えてください。

### コード

```python
import csv
from collections import defaultdict
from datetime import datetime

def analyze_log(filepath):
    stats = defaultdict(lambda: {"count": 0, "errors": 0, "total_time": 0})

    with open(filepath, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            endpoint = row["endpoint"]
            status = int(row["status_code"])
            response_time = float(row["response_time_ms"])

            stats[endpoint]["count"] += 1
            stats[endpoint]["total_time"] += response_time

            if status >= 400:
                stats[endpoint]["errors"] += 1

    report = []
    for endpoint, data in stats.items():
        avg_time = data["total_time"] / data["count"]
        error_rate = data["errors"] / data["count"] * 100
        report.append({
            "endpoint": endpoint,
            "requests": data["count"],
            "avg_response_ms": round(avg_time, 2),
            "error_rate": f"{error_rate:.1f}%",
        })

    report.sort(key=lambda x: x["requests"], reverse=True)
    return report

if __name__ == "__main__":
    results = analyze_log("access_log.csv")
    for r in results:
        print(f"{r['endpoint']:30s} {r['requests']:>6d} reqs  "
              f"avg {r['avg_response_ms']:>8.2f}ms  "
              f"err {r['error_rate']:>6s}")
```

### 質問

1. このスクリプトは何をするプログラムですか？
2. `defaultdict(lambda: {"count": 0, "errors": 0, "total_time": 0})` は何をしていますか？
3. `status >= 400` のチェックは何を判定していますか？
4. 出力は何順でソートされますか？

<details>
<summary>解答</summary>

1. **Webアクセスログ（CSV形式）を分析するプログラム**。エンドポイントごとのリクエスト数、平均レスポンス時間、エラー率を集計して表示します。

2. **デフォルト値を持つ辞書を作成**しています。存在しないキーにアクセスすると、自動的に `{"count": 0, "errors": 0, "total_time": 0}` が初期値として設定されます。TypeScriptのMission 2で見た `(productTotals[sale.product] || 0)` と同じ目的です。

3. **HTTPエラーレスポンスの判定**です。HTTPステータスコード400以上はクライアントエラー（400番台）またはサーバーエラー（500番台）を意味します。

4. **リクエスト数の降順**（多い順）でソートされます。`reverse=True` が降順を指定しています。

</details>

---

## Mission 4: バグ修正 - APIクライアント（20分）

以下のAPIクライアントコードにバグが3つあります。修正してください。

### バグのあるコード

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const json = await response.json();

  if (response.status === 200) {
    return json.data;
  }

  throw new Error(json.message);
}

async function getUsers(): Promise<User[]> {
  return apiClient("/api/users");
}

async function createUser(name: string, email: string): Promise<User> {
  return apiClient("/api/users", {
    method: "POST",
    body: JSON.stringify({ name, email }),
  });
}

async function main() {
  const users = await getUsers();
  console.log(users);

  const newUser = await createUser("田中", "tanaka@example.com");
  console.log(newUser);
}
```

### 報告されているバグ

1. ステータスコード201（Created）でも成功として扱われない
2. POST リクエストで Content-Type が送られない
3. エラー処理が不十分

<details>
<summary>解答</summary>

```typescript
async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);

    // バグ3修正: ネットワークエラーなどの処理を追加
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // JSONパースに失敗した場合はデフォルトメッセージを使用
      }
      throw new Error(errorMessage);
    }

    const json: ApiResponse<T> = await response.json();
    return json.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("不明なエラーが発生しました");
  }
}

async function getUsers(): Promise<User[]> {
  return apiClient("/api/users");
}

async function createUser(name: string, email: string): Promise<User> {
  return apiClient("/api/users", {
    method: "POST",
    // バグ2修正: Content-Type ヘッダーを追加
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });
}

async function main(): Promise<void> {
  try {
    const users = await getUsers();
    console.log(users);

    const newUser = await createUser("田中", "tanaka@example.com");
    console.log(newUser);
  } catch (error) {
    console.error("エラー:", error instanceof Error ? error.message : error);
  }
}
```

**バグの解説:**
1. `response.status === 200` だと201(Created)を見逃す。`response.ok`（200-299全て）を使用
2. `Content-Type: application/json` がないとサーバーがJSONとして解釈できない
3. fetch自体の失敗（ネットワークエラー等）やmain関数のエラーが処理されていない

</details>

---

## Mission 5: レガシーコードの改善（25分）

以下のPythonコードを読み解き、バグを修正し、改善してください。

### レガシーコード

```python
def proc(d):
    r = []
    for i in range(len(d)):
        x = d[i]
        if x['t'] == 'A':
            v = x['p'] * x['q']
            if v > 10000:
                v = v * 0.9
            r.append({'n': x['n'], 'v': v, 't': 'A'})
        elif x['t'] == 'B':
            v = x['p'] * x['q']
            if v > 20000:
                v = v * 0.85
            r.append({'n': x['n'], 'v': v, 't': 'B'})
        elif x['t'] == 'C':
            v = x['p'] * x['q']
            if v > 5000:
                v = v * 0.95
            r.append({'n': x['n'], 'v': v, 't': 'C'})
    return r
```

### 課題

1. コードが何をしているか説明してください
2. 変数名を改善してください
3. 重複を除去してください
4. 型ヒントを追加してください

<details>
<summary>解答</summary>

**1. コードの説明:**
商品リストを処理し、タイプ（A/B/C）ごとに異なる割引率を適用する関数。
- タイプA: 10,000円超で10%割引
- タイプB: 20,000円超で15%割引
- タイプC: 5,000円超で5%割引

**2-4. 改善後のコード:**

```python
from typing import TypedDict

class Product(TypedDict):
    n: str        # 商品名
    p: float      # 単価
    q: int        # 数量
    t: str        # タイプ

class ProcessedProduct(TypedDict):
    name: str
    total: float
    product_type: str

# 割引ルール: {タイプ: (割引閾値, 割引率)}
DISCOUNT_RULES: dict[str, tuple[float, float]] = {
    "A": (10000, 0.9),
    "B": (20000, 0.85),
    "C": (5000, 0.95),
}

def apply_discount(total: float, threshold: float, rate: float) -> float:
    """閾値を超えた場合に割引を適用する"""
    if total > threshold:
        return total * rate
    return total

def process_products(products: list[Product]) -> list[ProcessedProduct]:
    """商品リストにタイプ別の割引を適用する"""
    results: list[ProcessedProduct] = []

    for product in products:
        total = product["p"] * product["q"]
        product_type = product["t"]

        if product_type in DISCOUNT_RULES:
            threshold, rate = DISCOUNT_RULES[product_type]
            total = apply_discount(total, threshold, rate)

        results.append({
            "name": product["n"],
            "total": total,
            "product_type": product_type,
        })

    return results
```

**改善ポイント:**
- 意味のある変数名に変更
- 割引ルールをデータとして分離（OCP: 新タイプ追加が容易）
- 割引計算を関数に抽出（DRY）
- 型ヒントを追加
- docstringを追加

</details>

---

## 達成度チェック

| ミッション | テーマ | 完了 |
|-----------|--------|------|
| Mission 1 | バグ修正：ユーザー検証 | [ ] |
| Mission 2 | バグ修正：データ集計 | [ ] |
| Mission 3 | コード解読：Pythonスクリプト | [ ] |
| Mission 4 | バグ修正：APIクライアント | [ ] |
| Mission 5 | レガシーコードの改善 | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| バグの発見 | `=` vs `===`、初期値の未設定、型の不一致 |
| コード解読 | 上から順に読み、データの流れを追う |
| Python理解 | defaultdict、with文、内包表記を読み取る |
| リファクタリング | 命名改善、重複除去、データ分離 |

### チェックリスト

- [ ] TypeScriptの典型的なバグを発見・修正できる
- [ ] Pythonコードを読んで目的を理解できる
- [ ] APIクライアントの問題点を特定できる
- [ ] レガシーコードを改善するリファクタリングができる

---

## 次のステップへ

お疲れさまでした。TypeScriptとPythonの両方でコードを読み解き、修正する力がつきました。

次のセクションでは、Step 4の理解度チェックです。

---

*推定所要時間: 90分*
