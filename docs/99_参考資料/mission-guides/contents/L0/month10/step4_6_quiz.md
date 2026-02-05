# チェックポイント：Webページ作成

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 4
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "総合"
  category: "総合演習"
  target_level: "L0"
```

---

## このチェックポイントについて

Step 4（Day 3: Webページ作成）で行った作業を確認します。

- 全8問
- 合格ライン：6問以上正解

---

## 問題

### Q1: HTMLで「ページの主要なコンテンツ」を囲むセマンティックタグは？

A) `<div>`
B) `<main>`
C) `<content>`
D) `<body>`

<details>
<summary>答えを見る</summary>

**正解: B) `<main>`**

`<main>` タグはページの主要なコンテンツを囲むために使用します。`<div>` は汎用タグで意味を持ちません。`<content>` は存在しないタグです。`<body>` はページ全体のコンテンツを囲みます。

</details>

---

### Q2: ナビゲーションリンクを横並びにするCSSプロパティは？

A) `display: inline`
B) `display: flex`
C) `display: horizontal`
D) `display: row`

<details>
<summary>答えを見る</summary>

**正解: B) `display: flex`**

Flexboxを使うと、子要素を簡単に横並びにできます。`display: flex` を親要素に指定することで、子要素が横に並びます。

```css
nav {
  display: flex;
  gap: 1rem;
}
```

</details>

---

### Q3: 外部リンクを新しいタブで開くためのHTML属性は？

A) `href="_new"`
B) `target="_blank"`
C) `open="new"`
D) `link="external"`

<details>
<summary>答えを見る</summary>

**正解: B) `target="_blank"`**

`target="_blank"` を `<a>` タグに追加すると、リンクが新しいタブで開きます。セキュリティのため `rel="noopener noreferrer"` も一緒に追加することが推奨されます。

</details>

---

### Q4: HTMLで「#development」へのリンクを作成する正しい書き方は？

A) `<a href="development">開発ツール</a>`
B) `<a href="#development">開発ツール</a>`
C) `<a link="#development">開発ツール</a>`
D) `<a goto="development">開発ツール</a>`

<details>
<summary>答えを見る</summary>

**正解: B) `<a href="#development">開発ツール</a>`**

ページ内リンク（アンカーリンク）は `href="#id名"` の形式で指定します。`#` をつけることで、同じページ内の対応する `id` 属性を持つ要素にジャンプします。

</details>

---

### Q5: CSSでカード要素に影をつけるプロパティは？

A) `shadow: 2px 2px 5px gray`
B) `box-shadow: 2px 2px 5px gray`
C) `card-shadow: 2px 2px 5px gray`
D) `text-shadow: 2px 2px 5px gray`

<details>
<summary>答えを見る</summary>

**正解: B) `box-shadow: 2px 2px 5px gray`**

`box-shadow` はボックス要素に影をつけるプロパティです。`text-shadow` はテキストに影をつけます。`shadow` や `card-shadow` は存在しないプロパティです。

</details>

---

### Q6: GitHubにローカルの変更をアップロードするコマンドは？

A) `git upload`
B) `git push`
C) `git send`
D) `git deploy`

<details>
<summary>答えを見る</summary>

**正解: B) `git push`**

`git push` でローカルのコミットをリモートリポジトリ（GitHub）にアップロードします。初回は `git push -u origin main` のように上流ブランチを設定します。

</details>

---

### Q7: HTMLで日本語のページを正しく表示するために必要な meta タグは？

A) `<meta language="japanese">`
B) `<meta charset="UTF-8">`
C) `<meta encoding="jp">`
D) `<meta text="nihongo">`

<details>
<summary>答えを見る</summary>

**正解: B) `<meta charset="UTF-8">`**

`<meta charset="UTF-8">` で文字エンコーディングをUTF-8に指定することで、日本語を含む多言語のテキストが正しく表示されます。また、`<html lang="ja">` で言語を指定することも推奨されます。

</details>

---

### Q8: ページの動作確認で最初に行うべきことは？

A) セルフレビューシートを作成する
B) ブラウザでページを開いて表示を確認する
C) CSSファイルを削除してみる
D) 先輩にレビューを依頼する

<details>
<summary>答えを見る</summary>

**正解: B) ブラウザでページを開いて表示を確認する**

動作確認の基本は、実際にブラウザでページを開いて表示を確認することです。その後、ナビゲーション、リンク、レイアウトなどを順番にチェックしていきます。

</details>

---

## 採点

| 正解数 | 判定 |
|--------|------|
| 8問 | 完璧！HTML/CSSとGitをマスターしています |
| 6-7問 | 合格！基本を押さえています |
| 4-5問 | もう少し。Step 4を振り返りましょう |
| 3問以下 | 復習が必要です |

---

## 復習ポイント

間違えた問題があれば、以下のセクションを復習してください。

| 問題 | 復習セクション |
|------|---------------|
| Q1, Q4, Q7 | Step 4-1: HTMLでページ構造を作ろう |
| Q2, Q5 | Step 4-2: CSSでデザインしよう |
| Q3, Q6 | Step 4-3: GitHubにプッシュしよう |
| Q8 | Step 4-5: ページの動作確認 |

---

## Day 3 完了サマリー

### 作業内容

| タスク | 状態 |
|--------|------|
| HTML構造の作成 | 完了 |
| セマンティックタグの使用 | 完了 |
| ツールカード10件の作成 | 完了 |
| CSSでデザイン | 完了 |
| Flexboxでレイアウト | 完了 |
| GitHubリポジトリ作成 | 完了 |
| プッシュ | 完了 |
| 動作確認 | 完了 |
| Day 3日報作成 | 完了 |

### 成果物

- index.html: 社内ツール紹介ページ
- style.css: スタイルシート
- GitHubリポジトリに公開

---

## まとめ

| ポイント | 内容 |
|----------|------|
| セマンティックHTML | header, nav, main, section, footer |
| Flexbox | 横並びレイアウト |
| ページ内リンク | href="#id" と id 属性 |
| 外部リンク | target="_blank" |
| box-shadow | カードに影をつける |
| git push | GitHubにアップロード |

- [ ] 8問中6問以上正解した
- [ ] 間違えた問題の復習ができた
- [ ] Day 4に進む準備ができた

---

## 次のステップへ

Day 3 チェックポイントお疲れさまでした。

次のStep 5では、Day 4〜5の作業に入ります。
セルフレビュー、完了報告書、README、週報を作成します。
品質管理とドキュメント作成の総仕上げです。

「Day 4: 品質の日」「Day 5: 報告の日」のスタートです！

---

*推定所要時間: 30分*
