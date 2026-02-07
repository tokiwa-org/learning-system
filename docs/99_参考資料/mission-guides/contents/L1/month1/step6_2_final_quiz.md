# 卒業クイズ：開発環境の支配者

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 6
subStep: 2
title: "卒業クイズ"
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

L1 Month 1 の全範囲から出題される卒業クイズです。

- 全15問
- 合格ライン: 80%（12問正解）
- 不合格の場合は関連ステップを復習してから再挑戦してください

---

## 問題

### Q1. 以下のコマンドの目的は何ですか？

```bash
find . -name "*.log" -mtime +30 | xargs rm
```

- A) 30行以上のログファイルを削除する
- B) 30日以上前のログファイルを削除する
- C) 拡張子が .log のファイルを30個削除する
- D) ログファイルの最新30件以外を削除する

<details>
<summary>答えを見る</summary>

**正解: B**

- `find . -name "*.log"` : カレントディレクトリ以下の .log ファイルを検索
- `-mtime +30` : 最終更新が30日以上前のファイル
- `| xargs rm` : 見つかったファイルを rm の引数に渡して削除

</details>

---

### Q2. `set -euo pipefail` で `set -o pipefail` が検出するエラーはどれですか？

- A) 未定義変数の使用
- B) パイプラインの途中で発生したエラー
- C) ファイルの権限エラー
- D) コマンドの構文エラー

<details>
<summary>答えを見る</summary>

**正解: B**

通常、パイプラインの終了コードは最後のコマンドの終了コードになります。
`set -o pipefail` を設定すると、パイプラインのどこかでエラーが発生した場合に
そのエラーが検出されるようになります。

例: `cat nonexistent | sort` で、pipefail がないと sort の成功（0）が返るが、
pipefail があると cat のエラーが検出される。

</details>

---

### Q3. シェルスクリプトの `trap cleanup EXIT` はいつ実行されますか？

- A) スクリプトの開始時
- B) エラーが発生した時のみ
- C) スクリプトの終了時（正常・異常問わず）
- D) Ctrl+C が押された時のみ

<details>
<summary>答えを見る</summary>

**正解: C**

`trap cleanup EXIT` は、スクリプトが終了する時に `cleanup` 関数を実行します。
正常終了でも異常終了（エラー、Ctrl+C等）でも実行されるため、
一時ファイルの削除やリソースの解放に最適です。

</details>

---

### Q4. GitHub Flow と Git Flow の最大の違いは何ですか？

- A) GitHub Flow はブランチを使わない
- B) Git Flow には develop ブランチがあるが、GitHub Flow にはない
- C) GitHub Flow はマージを使わない
- D) Git Flow はリモートリポジトリを使わない

<details>
<summary>答えを見る</summary>

**正解: B**

Git Flow は main と develop の2つの永続ブランチを持ち、
feature, release, hotfix の一時ブランチを使い分ける複雑な戦略です。

GitHub Flow は main ブランチのみを永続ブランチとし、
feature ブランチとPRだけで運用するシンプルな戦略です。

</details>

---

### Q5. `git rebase` の黄金ルールは何ですか？

- A) リベースは毎回コミット前に実行する
- B) 公開済み（push済み）のブランチをリベースしてはいけない
- C) リベースはmainブランチでのみ使用する
- D) リベースの前にはタグを付ける

<details>
<summary>答えを見る</summary>

**正解: B**

リベースはコミットを再作成するためハッシュが変わります。
他の人が参照しているブランチをリベースすると、チーム全体に混乱を招きます。

リベースは自分だけが作業しているローカルブランチに対して使いましょう。

</details>

---

### Q6. コンフリクトマーカーで `<<<<<<< HEAD` と `=======` の間にあるコードは何ですか？

- A) マージ元ブランチの変更
- B) 現在チェックアウトしているブランチの変更
- C) 共通の祖先のコード
- D) Gitが自動解決した結果

<details>
<summary>答えを見る</summary>

**正解: B**

コンフリクトマーカーの構造：
- `<<<<<<< HEAD` から `=======` : 現在のブランチ（HEAD）の変更
- `=======` から `>>>>>>>` : マージ元ブランチの変更

</details>

---

### Q7. `git stash` の主な用途は何ですか？

- A) コミットを取り消す
- B) 作業中の変更を一時的に退避し、ワーキングディレクトリをクリーンにする
- C) ブランチを削除する
- D) リモートの変更を取得する

<details>
<summary>答えを見る</summary>

**正解: B**

`git stash` は作業中の変更（コミット前の変更）を一時的に保存し、
ワーキングディレクトリをクリーンな状態に戻します。

典型的な使用場面：作業中に別ブランチに切り替える必要がある時

</details>

---

### Q8. `git bisect` が使うアルゴリズムは何ですか？

- A) 線形探索
- B) 二分探索
- C) 幅優先探索
- D) 深さ優先探索

<details>
<summary>答えを見る</summary>

**正解: B**

`git bisect` は二分探索を使って、バグが混入したコミットを効率的に特定します。
「正常なコミット」と「バグのあるコミット」の間を半分ずつ絞り込みます。

100コミットの範囲でも、最大約7回（log2(100)）のテストで原因を特定できます。

</details>

---

### Q9. CSS Grid の `fr` 単位の意味は何ですか？

- A) ピクセル数の省略形
- B) パーセンテージの省略形
- C) 利用可能なスペースの分割割合
- D) フォントサイズの相対単位

<details>
<summary>答えを見る</summary>

**正解: C**

`fr`（fraction）は、Grid コンテナ内の利用可能なスペースを分割する単位です。

例: `grid-template-columns: 1fr 2fr 1fr;`
→ 利用可能なスペースを 1:2:1 の比率で分割

固定幅（px）のカラムを除いた残りのスペースを分割するため、
柔軟なレイアウトが簡単に作れます。

</details>

---

### Q10. `repeat(auto-fit, minmax(300px, 1fr))` の動作として正しいものは？

- A) 常に300px固定幅の列を作る
- B) 画面幅に応じて列数が自動調整されるレスポンシブレイアウト
- C) 最大300pxの列を作る
- D) 3列固定のレイアウトを作る

<details>
<summary>答えを見る</summary>

**正解: B**

`auto-fit` + `minmax()` の組み合わせは、メディアクエリなしで
レスポンシブなグリッドレイアウトを実現します。

各列は最小300px、最大1frとなり、画面幅に応じて自動的に列数が変わります。

</details>

---

### Q11. CSSアニメーションで最もパフォーマンスが高いプロパティはどれですか？

- A) `width` と `height`
- B) `margin` と `padding`
- C) `transform` と `opacity`
- D) `top` と `left`

<details>
<summary>答えを見る</summary>

**正解: C**

`transform` と `opacity` はブラウザのGPU（合成レイヤー）で処理されるため、
レイアウトの再計算や再描画が不要で、最もパフォーマンスが高いです。

アニメーションでは `transform`（移動、回転、拡大）と `opacity`（透明度）を
優先的に使うべきです。

</details>

---

### Q12. SCSSで `&` が表すものは何ですか？

- A) 子要素
- B) 親セレクタの参照
- C) 隣接要素
- D) 全称セレクタ

<details>
<summary>答えを見る</summary>

**正解: B**

`&` はネスト内で親セレクタ全体を参照する特別な記号です。

```scss
.button {
    &:hover { }     // → .button:hover
    &--large { }    // → .button--large
    &__icon { }     // → .button__icon
}
```

</details>

---

### Q13. 以下のawkコマンドは何をしますか？

```bash
awk -F',' '{sum += $3} END {print sum}' sales.csv
```

- A) CSVの3行目を表示する
- B) CSVの3列目の値を合計して表示する
- C) CSVを3列に分割する
- D) CSVから3を含む行を検索する

<details>
<summary>答えを見る</summary>

**正解: B**

- `-F','` : カンマ区切り
- `{sum += $3}` : 各行の3列目を変数 sum に加算
- `END {print sum}` : 全行処理後に合計を表示

これはCSVデータの集計でよく使われるパターンです。

</details>

---

### Q14. コードレビューのコメント接頭辞 `[must]` と `[nit]` の違いは？

- A) どちらも修正必須
- B) [must] は修正必須、[nit] は些細な指摘で対応は任意
- C) [must] はバグ、[nit] はスタイル
- D) [must] は先輩のみ使える、[nit] は誰でも使える

<details>
<summary>答えを見る</summary>

**正解: B**

- `[must]` : 修正必須。セキュリティの問題やバグなど、マージ前に修正が必要
- `[nit]` : nitpick（些細な指摘）。変数名の改善やスタイルの提案など、対応は任意

他にも `[should]`（修正推奨）、`[question]`（質問）、`[praise]`（褒め）があります。

</details>

---

### Q15. SCSSの `@mixin` と `@include` の関係として正しいものは？

- A) @mixin で使用し、@include で定義する
- B) @mixin で定義し、@include で使用する
- C) 両方とも定義に使う
- D) 両方とも使用に使う

<details>
<summary>答えを見る</summary>

**正解: B**

```scss
// @mixin で定義
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

// @include で使用
.hero {
    @include flex-center;
    height: 100vh;
}
```

ミックスインは引数も受け取れるため、再利用性の高いスタイルパターンを定義できます。

</details>

---

## 結果

### 12問以上正解の場合

**合格です。おめでとうございます。**

```
================================
  L1 Month 1 修了証明書

  開発環境マスター

  認定スキル:
    - シェルスクリプト
    - Git高度操作
    - CSS Grid / Sass

  修了日: ____年__月__日
================================
```

あなたは「開発環境の支配者」の称号を得ました。

### 習得したスキル

| スキル | レベル |
|--------|--------|
| シェルスクリプト | 実務で自動化スクリプトが書ける |
| Git高度操作 | ブランチ戦略・コンフリクト解決ができる |
| CSS Grid / Sass | レスポンシブデザインが効率的に作れる |

### 11問以下の場合

**もう少し復習が必要です。**

| 問題 | 復習ステップ |
|------|-------------|
| Q1 | Step 1: 上級コマンド |
| Q2, Q3 | Step 2: シェルスクリプト |
| Q4, Q5, Q6, Q7, Q8 | Step 3, 4: Git |
| Q9, Q10, Q11 | Step 5: CSS Grid |
| Q12, Q13, Q14, Q15 | Step 5: Sass / 全般 |

---

## L1 Month 1 完了

お疲れさまでした。

### 学んだこと

| Step | テーマ | 主なスキル |
|------|--------|-----------|
| Step 1 | ターミナル制覇 | 上級コマンド、パイプ、プロセス管理 |
| Step 2 | シェルスクリプト | bash スクリプト、エラー処理、自動化 |
| Step 3 | Git高度操作 | ブランチ戦略、マージ/リベース |
| Step 4 | チーム開発 | PR、コードレビュー、CI/CD |
| Step 5 | CSS Grid / Sass | Grid、アニメーション、Sass |
| Step 6 | 最終試験 | 総合演習 + 卒業クイズ |

### 次のミッション

**L1 Month 2** では、さらに高度なスキルに挑戦します。

開発環境の支配者として、次のステージへ進みましょう。

---

*推定所要時間: 30分*
