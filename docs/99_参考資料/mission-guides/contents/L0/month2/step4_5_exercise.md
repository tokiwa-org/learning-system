# 演習：履歴を調査しよう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 4
subStep: 5
title: "演習：履歴を調査しよう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「先輩からプロジェクトを引き継いだんですが、どこで何が変わったかわからなくて...」
>
> 「よくあるパターンだね。履歴調査のスキルが試されるときだ」
>
> 「git logとgit diffを駆使するってことですね！」
>
> 「その通り。実際に調査してみよう」

---

## 演習の準備

この演習では、履歴のあるサンプルプロジェクトを作成し、
それを調査するミッションに挑戦します。

### サンプルプロジェクトの作成

```bash
# 1. 新しいプロジェクトを作成
cd ~
mkdir git-investigation
cd git-investigation
git init

# 2. 初期ファイルを作成
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <h1>Welcome</h1>
</body>
</html>
EOF

cat > style.css << 'EOF'
body {
    font-family: sans-serif;
}
EOF

cat > app.js << 'EOF'
console.log("App started");
EOF

# 3. 初回コミット
git add .
git commit -m "Initial commit: basic structure"

# 4. 機能追加
echo 'function login() { console.log("login"); }' >> app.js
git add app.js
git commit -m "Add login function"

# 5. スタイル変更
cat > style.css << 'EOF'
body {
    font-family: sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
}
EOF
git add style.css
git commit -m "Update styles with new design"

# 6. バグ修正
sed -i 's/login/Login/g' app.js 2>/dev/null || sed -i '' 's/login/Login/g' app.js
git add app.js
git commit -m "Fix: capitalize Login function name"

# 7. 新機能
echo 'function logout() { console.log("Logout"); }' >> app.js
git add app.js
git commit -m "Add logout function"

# 8. ドキュメント追加
cat > README.md << 'EOF'
# My App

A simple web application.

## Features
- Login
- Logout
EOF
git add README.md
git commit -m "Add README documentation"

echo "サンプルプロジェクトの準備完了！"
```

---

## ミッション

以下の調査ミッションをクリアしてください。

---

## Mission 1: コミット数を数えよう

**課題**: このリポジトリには何個のコミットがありますか？

<details>
<summary>💡 ヒント</summary>

`git log --oneline` を使って、コミットを1行ずつ表示すると数えやすいです。

</details>

<details>
<summary>📝 解答例</summary>

```bash
git log --oneline
```

出力を数えると **6個** のコミットがあります。

より正確に数えるには：
```bash
git rev-list --count HEAD
```

</details>

---

## Mission 2: 最初のコミットを見つけよう

**課題**: 一番最初のコミットのメッセージは何ですか？

<details>
<summary>💡 ヒント</summary>

`git log` の出力は新しい順なので、一番下を見るか、
`--reverse` オプションで順番を逆にできます。

</details>

<details>
<summary>📝 解答例</summary>

```bash
git log --oneline --reverse
```

または

```bash
git log --oneline | tail -1
```

答え: **Initial commit: basic structure**

</details>

---

## Mission 3: app.jsの変更回数を調べよう

**課題**: `app.js` は何回変更されましたか？

<details>
<summary>💡 ヒント</summary>

特定ファイルの履歴だけを表示するには、`git log` にファイル名を渡します。

</details>

<details>
<summary>📝 解答例</summary>

```bash
git log --oneline app.js
```

または

```bash
git log --oneline -- app.js | wc -l
```

答え: **4回**（Initial commit, Add login, Fix, Add logout）

</details>

---

## Mission 4: スタイル変更の内容を確認しよう

**課題**: "Update styles with new design" のコミットで、具体的に何が変わりましたか？

<details>
<summary>💡 ヒント</summary>

1. まず `git log --oneline` でコミットハッシュを見つける
2. `git show ハッシュ` で詳細を確認

</details>

<details>
<summary>📝 解答例</summary>

```bash
# ハッシュを確認
git log --oneline --grep="Update styles"

# 詳細を表示
git show [ハッシュ]
```

変更内容:
- `background-color: #f0f0f0;` を追加
- `margin: 0;` を追加
- `padding: 20px;` を追加
- `h1 { color: #333; }` を追加

</details>

---

## Mission 5: "login" が追加されたコミットを特定しよう

**課題**: "login" という文字列が最初に追加されたのはどのコミットですか？

<details>
<summary>💡 ヒント</summary>

`git log -S "文字列"` で、その文字列が追加/削除されたコミットを探せます。

</details>

<details>
<summary>📝 解答例</summary>

```bash
git log -S "login" --oneline
```

答え: **Add login function** のコミット

</details>

---

## Mission 6: READMEが追加される直前の状態を確認しよう

**課題**: README.md が追加される直前、app.js の内容はどうなっていましたか？

<details>
<summary>💡 ヒント</summary>

`git show コミット:ファイル名` で、特定時点のファイル内容を見れます。
READMEが追加されたコミットの1つ前を指定します。

</details>

<details>
<summary>📝 解答例</summary>

```bash
# READMEが追加されたコミットを確認
git log --oneline -- README.md

# その1つ前のコミットのapp.jsを表示
git show HEAD~1:app.js
```

または

```bash
# READMEコミットの親
git show HEAD^:app.js
```

</details>

---

## Mission 7: 差分を比較しよう

**課題**: 最初のコミットと最新のコミットで、style.css はどう変わりましたか？

<details>
<summary>💡 ヒント</summary>

`git diff コミットA コミットB -- ファイル名` で2つのコミット間の差分を表示できます。
最初のコミットは `git log --oneline | tail -1` で確認できます。

</details>

<details>
<summary>📝 解答例</summary>

```bash
# 最初のコミットハッシュを取得
FIRST=$(git rev-list --max-parents=0 HEAD)

# 最初と最新の差分
git diff $FIRST HEAD -- style.css
```

または

```bash
git log --oneline | tail -1  # ハッシュを確認
git diff [最初のハッシュ] HEAD -- style.css
```

</details>

---

## Mission 8: 統計レポートを作成しよう

**課題**: 各コミットで変更されたファイル数と行数を表示してください。

<details>
<summary>💡 ヒント</summary>

`git log --stat` で各コミットの統計情報を表示できます。

</details>

<details>
<summary>📝 解答例</summary>

```bash
git log --stat
```

または簡潔に：

```bash
git log --shortstat --oneline
```

</details>

---

## チャレンジ課題

### Challenge 1: グラフを表示

ブランチ構造をグラフで表示してください。

```bash
git log --oneline --graph --all
```

### Challenge 2: 作成者と日付

各コミットの作成者と相対日付を表示してください。

```bash
git log --pretty=format:"%h - %an, %ar : %s"
```

### Challenge 3: エイリアス設定

履歴調査用のエイリアスを設定してください。

```bash
git config --global alias.history "log --oneline --graph --all --decorate"
git history
```

---

## 達成度チェック

以下のミッションをクリアできましたか？

| Mission | 課題 | 完了 |
|---------|------|------|
| 1 | コミット数を数える | □ |
| 2 | 最初のコミットを見つける | □ |
| 3 | 特定ファイルの変更回数 | □ |
| 4 | 特定コミットの内容確認 | □ |
| 5 | 文字列が追加されたコミット特定 | □ |
| 6 | 過去時点のファイル内容確認 | □ |
| 7 | コミット間の差分比較 | □ |
| 8 | 統計レポート作成 | □ |

**6個以上クリア** → 合格！

---

## まとめ

この演習で使ったコマンド：

| コマンド | 用途 |
|----------|------|
| `git log --oneline` | 履歴を1行表示 |
| `git log --reverse` | 古い順に表示 |
| `git log -- ファイル名` | 特定ファイルの履歴 |
| `git log -S "文字列"` | 文字列変更を検索 |
| `git show ハッシュ` | コミット詳細 |
| `git show ハッシュ:ファイル` | 過去のファイル内容 |
| `git diff A B` | コミット間の差分 |
| `git log --stat` | 統計情報付き |

---

## 次のステップへ

履歴調査のスキルは身につきましたか？

次のセクションでは、Step 4の理解度を確認するチェックポイントです。
クイズに挑戦して、学んだことを振り返りましょう！

---

*推定所要時間: 90分*
