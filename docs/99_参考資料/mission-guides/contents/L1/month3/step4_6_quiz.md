# チェックポイント：レガシーコードを解読しよう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 4
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "サブ開発言語"
  category: "プログラミング"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 4で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. PythonとTypeScriptの対応として正しいものはどれですか？

- A) Pythonの `True` はTypeScriptの `TRUE` に相当する
- B) Pythonの `None` はTypeScriptの `null` / `undefined` に相当する
- C) Pythonの `def` はTypeScriptの `class` に相当する
- D) Pythonの `list` はTypeScriptの `object` に相当する

<details>
<summary>答えを見る</summary>

**正解: B**

- Pythonの `True/False` はTypeScriptの `true/false`（小文字）に相当
- Pythonの `None` はTypeScriptの `null` / `undefined` に相当
- Pythonの `def` はTypeScriptの `function` に相当
- Pythonの `list` はTypeScriptの `Array` に相当

</details>

---

### Q2. 以下のPythonコードの出力として正しいものはどれですか？

```python
numbers = [1, 2, 3, 4, 5]
result = [n * 2 for n in numbers if n % 2 == 0]
print(result)
```

- A) `[2, 4, 6, 8, 10]`
- B) `[4, 8]`
- C) `[1, 2, 3, 4, 5]`
- D) `[2, 4]`

<details>
<summary>答えを見る</summary>

**正解: B**

リスト内包表記の処理:
1. `if n % 2 == 0` で偶数のみフィルタ → `[2, 4]`
2. `n * 2` で各要素を2倍 → `[4, 8]`

TypeScriptで書くと `numbers.filter(n => n % 2 === 0).map(n => n * 2)` と同じです。

</details>

---

### Q3. Pythonの辞書（dict）操作として正しいものはどれですか？

```python
user = {"name": "田中", "age": 28}
```

- A) `user.name` で名前にアクセスできる
- B) `user["name"]` で名前にアクセスできる
- C) `user->name` で名前にアクセスできる
- D) `user.get["name"]` で名前にアクセスできる

<details>
<summary>答えを見る</summary>

**正解: B**

Pythonの辞書は `dict["key"]` でアクセスします。`user.name` はオブジェクトの属性アクセス（TypeScriptの方式）であり、辞書には使えません。`user.get("name")` はキーが存在しない場合にNoneを返す安全なアクセス方法です（括弧 `()` であり、ブラケット `[]` ではありません）。

</details>

---

### Q4. コードリーディングの正しいアプローチはどれですか？

- A) 最初から1行ずつ全てのコードを読む
- B) README → エントリーポイント → データの流れの順に読む
- C) テストコードだけ読めば十分
- D) コメントだけ読めば十分

<details>
<summary>答えを見る</summary>

**正解: B**

トップダウンアプローチが効率的です:
1. README、package.json でプロジェクトの全体像を把握
2. エントリーポイント（index.ts、main.py）を見つける
3. import文を辿ってデータの流れを追う
4. 必要な部分だけ詳細を読む

全行を読む必要はなく、コメントやテストだけでは不十分です。

</details>

---

### Q5. TypeScriptのスタックトレースで最初に確認すべき場所はどれですか？

```
TypeError: Cannot read properties of undefined (reading 'name')
    at getUserName (/src/services/user.ts:15:24)
    at processOrder (/src/services/order.ts:42:18)
    at main (/src/index.ts:10:3)
```

- A) main (/src/index.ts:10:3)
- B) processOrder (/src/services/order.ts:42:18)
- C) getUserName (/src/services/user.ts:15:24)
- D) エラーメッセージは無視して全ファイルを確認

<details>
<summary>答えを見る</summary>

**正解: C**

TypeScriptのスタックトレースはエラー発生場所が最上段に表示されます。`getUserName` の `user.ts` 15行目でエラーが発生しています。エラーメッセージから「`undefined` の `name` プロパティにアクセスしようとした」ことが分かるので、この行で使っている変数が `undefined` になっている原因を追跡します。

</details>

---

### Q6. 以下のTypeScriptコードのバグはどれですか？

```typescript
async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = response.json();
  return data;
}
```

- A) fetch の URL が間違っている
- B) response.json() に await が付いていない
- C) return 文が不要
- D) バグはない

<details>
<summary>答えを見る</summary>

**正解: B**

`response.json()` は Promise を返すため `await` が必要です。`await` がないと `Promise<User>` ではなく `Promise<Promise<User>>` のような状態になり、データが正しく返されません。

```typescript
// 修正
const data = await response.json();
```

</details>

---

### Q7. Pythonのf-stringの出力として正しいものはどれですか？

```python
name = "田中"
score = 85.678
print(f"{name}さんのスコア: {score:.1f}点")
```

- A) `田中さんのスコア: 85.678点`
- B) `田中さんのスコア: 85.7点`
- C) `田中さんのスコア: 86点`
- D) エラーになる

<details>
<summary>答えを見る</summary>

**正解: B**

`:.1f` は小数点以下1桁に丸めるフォーマット指定です。85.678 は小数点以下1桁で四捨五入されて `85.7` になります。TypeScriptでは `score.toFixed(1)` に相当します。

</details>

---

### Q8. デバッグの進め方として最も効率的なのはどれですか？

- A) コード全体に console.log を入れてから実行する
- B) バグを再現 → 仮説を立てる → 検証 → 原因特定の順で進める
- C) コードを全て書き直す
- D) エラーメッセージを無視して直感で修正する

<details>
<summary>答えを見る</summary>

**正解: B**

効率的なデバッグは体系的な手順に従います:
1. **再現**: いつ、どんな条件で発生するか特定
2. **仮説**: 「この変数が null だからでは？」
3. **検証**: ログやデバッガで仮説を確認
4. **特定**: 期待値と実際の値の差分を確認
5. **修正**: 修正後にテストで確認

闇雲にログを追加したり、直感で修正するのは非効率です。

</details>

---

## 結果

### 7問以上正解の場合

**合格です。おめでとうございます。**

Step 4「レガシーコードを解読しよう」を完了しました。
次は Step 5「機能追加を実装しよう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1, Q7 | step4_1 Pythonの基本 |
| Q2, Q3 | step4_2 Pythonのデータ構造 |
| Q4 | step4_3 他人のコードを読む技術 |
| Q5, Q6, Q8 | step4_4 デバッグの技法 |

---

## Step 4 完了

お疲れさまでした。

### 学んだこと

- Python基本: 変数、関数、f-string、条件分岐、ループ
- Pythonデータ構造: list, dict, tuple, set, リスト内包表記
- コードリーディング: トップダウンアプローチ、import追跡
- デバッグ: console.log, デバッガ, スタックトレースの読み方

### 次のステップ

**Step 5: 機能追加を実装しよう（5時間）**

要件分析、TDD、REST API、クラス設計を学び、実際に機能を追加する経験を積みます。

---

*推定所要時間: 30分*
