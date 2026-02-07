# チェックポイント：シェルスクリプトの魔法

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 2
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "OS"
  category: "IT基本"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 2で学んだシェルスクリプトの知識を確認します。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. Shebang（シバン）の役割として正しいものはどれですか？

- A) スクリプトのタイトルを定義する
- B) スクリプトを実行するインタプリタを指定する
- C) スクリプトに実行権限を付与する
- D) スクリプトのバージョンを記録する

<details>
<summary>答えを見る</summary>

**正解: B**

Shebang（`#!/usr/bin/env bash`）は、スクリプトの1行目に記述し、
どのプログラム（インタプリタ）でスクリプトを実行するかをOSに指示します。

</details>

---

### Q2. `set -euo pipefail` の `set -u` が検出するエラーはどれですか？

- A) コマンドが失敗した
- B) 未定義の変数を使用した
- C) パイプの途中で失敗した
- D) ファイルが存在しない

<details>
<summary>答えを見る</summary>

**正解: B**

- `set -e`: コマンドの失敗時にスクリプトを停止
- `set -u`: 未定義の変数を使用した場合にエラー
- `set -o pipefail`: パイプラインの途中での失敗を検出

</details>

---

### Q3. 以下のスクリプトの出力として正しいものはどれですか？

```bash
#!/usr/bin/env bash
x=10
my_func() {
    local x=20
    echo $x
}
my_func
echo $x
```

- A) 20, 20
- B) 10, 10
- C) 20, 10
- D) 10, 20

<details>
<summary>答えを見る</summary>

**正解: C**

`local` キーワードにより、関数内の `x=20` は関数のローカルスコープに限定されます。
- 関数内: `local x=20` → 20が出力
- 関数外: グローバルの `x=10` のまま → 10が出力

</details>

---

### Q4. シェルスクリプトで `$?` が返すものは何ですか？

- A) 現在のプロセスID
- B) 引数の数
- C) 直前のコマンドの終了コード
- D) スクリプト名

<details>
<summary>答えを見る</summary>

**正解: C**

- `$?`: 直前のコマンドの終了コード（0=成功、1以上=エラー）
- `$$`: 現在のプロセスID
- `$#`: 引数の数
- `$0`: スクリプト名

</details>

---

### Q5. 以下のcase文で `"hello"` が入力された場合、出力はどれですか？

```bash
case "hello" in
    he*)   echo "A" ;;
    *llo)  echo "B" ;;
    hello) echo "C" ;;
    *)     echo "D" ;;
esac
```

- A) A
- B) B
- C) C
- D) D

<details>
<summary>答えを見る</summary>

**正解: A**

`case` 文は上から順にマッチングを行い、最初にマッチしたパターンの処理を実行します。
`"hello"` は `he*` パターン（heで始まる任意の文字列）に最初にマッチするため、"A"が出力されます。

</details>

---

### Q6. ファイルを1行ずつ読み込む正しい方法はどれですか？

- A) `for line in $(cat file.txt); do echo $line; done`
- B) `while IFS= read -r line; do echo "$line"; done < file.txt`
- C) `cat file.txt | for line; do echo $line; done`
- D) `read file.txt | while line; do echo $line; done`

<details>
<summary>答えを見る</summary>

**正解: B**

`while IFS= read -r line; do ... done < file.txt` が正しい方法です。

- `IFS=`: フィールドセパレータを無効化（先頭/末尾の空白を保持）
- `read -r`: バックスラッシュのエスケープを無効化
- 選択肢Aは、空白で単語分割されてしまう問題があります

</details>

---

### Q7. `trap` コマンドの用途として正しいものはどれですか？

- A) ファイルのアクセス権を変更する
- B) 特定のシグナルを受け取った時に実行する処理を登録する
- C) 関数の戻り値をキャプチャする
- D) バックグラウンドプロセスを管理する

<details>
<summary>答えを見る</summary>

**正解: B**

`trap` はシグナルハンドラを登録するコマンドです。

```bash
trap 'echo "クリーンアップ"' EXIT   # スクリプト終了時
trap 'echo "エラー発生"' ERR         # エラー時
trap 'echo "中断"' INT               # Ctrl+C 時
```

一時ファイルの削除やリソースの解放に使用します。

</details>

---

### Q8. 以下のスクリプトを `./test.sh apple banana cherry` として実行した場合、出力はどれですか？

```bash
#!/usr/bin/env bash
echo "$# - $2"
```

- A) `3 - apple`
- B) `3 - banana`
- C) `cherry - banana`
- D) `3 - cherry`

<details>
<summary>答えを見る</summary>

**正解: B**

- `$#` は引数の数 → 3（apple, banana, cherry）
- `$2` は2番目の引数 → banana

出力: `3 - banana`

</details>

---

## 結果

### 7問以上正解の場合

**合格です。おめでとうございます。**

Step 2「シェルスクリプトの魔法を習得しよう」を完了しました。
次は Step 3「Gitの時間を操ろう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1, Q2 | step2_1 シェルスクリプトの基本 |
| Q3, Q8 | step2_2 変数と制御構文 |
| Q4, Q7 | step2_3 関数とエラー処理 |
| Q5, Q6 | step2_2, step2_3 |

---

## Step 2 完了

お疲れさまでした。

### 学んだこと

- Shebang、実行権限、set -euo pipefail
- 変数、引数、条件分岐、ループ、case文
- 関数、local変数、戻り値
- エラー処理、trap、クリーンアップ
- 実践的なスクリプト（ログ解析、バックアップ、セットアップ）

### 次のステップ

**Step 3: Gitの時間を操ろう（2時間）**

ブランチ戦略、マージとリベース、コンフリクト解決を学びます。

---

*推定所要時間: 30分*
