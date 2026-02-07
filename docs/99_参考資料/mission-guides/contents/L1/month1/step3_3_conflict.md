# コンフリクトを解決しよう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 3
subStep: 3
title: "コンフリクトを解決しよう"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> マージを実行した瞬間、ターミナルに赤い文字が表示された。
>
> ```
> CONFLICT (content): Merge conflict in src/app.js
> Automatic merge failed; fix conflicts and then commit the result.
> ```
>
> 「コンフリクトだ...」
>
> 佐藤先輩が横から覗く。
>
> 「初めてか？ 大丈夫、コンフリクトは敵じゃない。
> 同じファイルの同じ場所を2人が同時に変更しただけだ。
> Gitに"どちらを採用するか"を教えてやればいい」

---

## コンフリクトが発生する仕組み

### コンフリクトが起きる条件

2つのブランチが**同じファイルの同じ行**を変更した場合、Gitは自動マージできません。

```
main:     function greet() { return "Hello"; }
                ↓ 変更
main:     function greet() { return "Hi there"; }

feature:  function greet() { return "Hello"; }
                ↓ 変更
feature:  function greet() { return "Hey!"; }
```

両方が `return` 文を変更 → Git は「どちらを採用すべきか」判断できない → コンフリクト

### コンフリクトが起きない場合

- 別々のファイルを変更した場合
- 同じファイルでも離れた行を変更した場合
- 一方だけが変更した場合

---

## コンフリクトマーカーの読み方

コンフリクトが発生すると、Gitはファイル内にマーカーを挿入します。

```
function greet() {
<<<<<<< HEAD
    return "Hi there";
=======
    return "Hey!";
>>>>>>> feature/greeting
}
```

| マーカー | 意味 |
|---------|------|
| `<<<<<<< HEAD` | 現在のブランチの変更の始まり |
| `=======` | 区切り線 |
| `>>>>>>> feature/greeting` | マージ元ブランチの変更の終わり |

### 読み方のコツ

```
<<<<<<< HEAD（こちらが今いるブランチの内容）
    return "Hi there";
=======（ここが区切り）
    return "Hey!";
>>>>>>> feature/greeting（こちらがマージしようとしたブランチの内容）
```

---

## コンフリクトの解決手順

### Step 1: コンフリクトのあるファイルを確認

```bash
git status
# 出力例:
# Unmerged paths:
#   both modified:   src/app.js
#   both modified:   src/config.js
```

### Step 2: ファイルを編集して解決

コンフリクトマーカーを削除し、正しい内容を残します。

**選択肢1: 自分の変更を採用**

```javascript
function greet() {
    return "Hi there";
}
```

**選択肢2: 相手の変更を採用**

```javascript
function greet() {
    return "Hey!";
}
```

**選択肢3: 両方を組み合わせる**

```javascript
function greet(casual) {
    return casual ? "Hey!" : "Hi there";
}
```

> **重要**: コンフリクトマーカー（`<<<<<<<`, `=======`, `>>>>>>>`）は必ず全て削除してください。

### Step 3: 解決済みファイルをステージング

```bash
git add src/app.js src/config.js
```

### Step 4: マージコミット

```bash
git commit
# エディタが開き、マージコミットメッセージが表示される
# そのまま保存して閉じればOK
```

---

## コマンドによる解決

### 片方を丸ごと採用する場合

```bash
# 自分の変更（現在のブランチ）を全採用
git checkout --ours src/app.js

# 相手の変更（マージ元ブランチ）を全採用
git checkout --theirs src/app.js

# ステージング
git add src/app.js
```

### マージを中止する場合

```bash
# マージ自体を取り消す（コンフリクト解決前に限る）
git merge --abort
```

### リベース中のコンフリクト

```bash
# リベース中にコンフリクトが発生した場合
# 1. ファイルを編集して解決
# 2. ステージング
git add .
# 3. リベースを続行
git rebase --continue

# リベースを中止する場合
git rebase --abort
```

---

## コンフリクトを予防する

### チームでの予防策

| 予防策 | 効果 |
|--------|------|
| こまめに main を取り込む | 差分を小さく保つ |
| ブランチの寿命を短くする | 変更の衝突確率を下げる |
| ファイルの責任範囲を分ける | 同じファイルの同時編集を避ける |
| コミュニケーション | 「今この部分を触っている」を共有 |

### 定期的な同期

```bash
# feature ブランチで作業中、定期的に main を取り込む
git checkout feature/my-feature
git fetch origin
git rebase origin/main
# または
git merge origin/main
```

---

## コンフリクト解決のベストプラクティス

1. **パニックにならない**: コンフリクトは正常な状態です
2. **何が変更されたか理解する**: `git log` で両方のブランチの変更を確認
3. **テストを実行する**: 解決後、必ずテストが通ることを確認
4. **レビューを依頼する**: 判断に迷ったら、変更した本人に確認

---

## まとめ

| ポイント | 内容 |
|----------|------|
| コンフリクトの原因 | 同じファイルの同じ行を複数人が変更 |
| マーカー | `<<<<<<<`, `=======`, `>>>>>>>` の3つ |
| 解決手順 | 編集 → add → commit |
| --ours / --theirs | 片方を丸ごと採用するショートカット |
| 予防 | こまめな同期とコミュニケーション |

### チェックリスト

- [ ] コンフリクトマーカーを読める
- [ ] コンフリクトを手動で解決できる
- [ ] --ours / --theirs を使い分けられる
- [ ] マージやリベースを中止（abort）できる
- [ ] コンフリクトの予防策を実践できる

---

## 次のステップへ

コンフリクトの解決方法をマスターしました。もうコンフリクトは怖くありませんね。

次のセクションでは、便利な Git 機能 `stash` と `cherry-pick` を学びます。
作業の一時退避や、特定のコミットだけを取り込む技術です。

---

*推定読了時間: 25分*
