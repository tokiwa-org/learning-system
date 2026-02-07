# 演習：チーム開発シミュレーション

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 4
subStep: 5
title: "演習：チーム開発シミュレーション"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「今日はチーム開発の実践演習だ」佐藤先輩がタスクリストを配る。
>
> 「1人で複数の役割を演じてもらう。ブランチを切って、PRを作って、
> コンフリクトも解決する。全部ローカルでシミュレーションできる」
>
> 「1人でチーム開発を？」
>
> 「そうだ。手順を体で覚えるのが目的だ。やってみよう」

---

## ミッション概要

8つのミッションでチーム開発の一連のフローを体験します。

| ミッション | テーマ | 難易度 |
|-----------|--------|--------|
| Mission 1 | リポジトリの初期設定 | 初級 |
| Mission 2 | feature ブランチでの開発 | 初級 |
| Mission 3 | コンフリクトの発生と解決 | 中級 |
| Mission 4 | stash を使った作業切り替え | 中級 |
| Mission 5 | Interactive Rebase でコミット整理 | 中級 |
| Mission 6 | cherry-pick での修正適用 | 中級 |
| Mission 7 | git blame と git log での調査 | 上級 |
| Mission 8 | 総合シナリオ：リリースフロー | 上級 |

---

## Mission 1: リポジトリの初期設定（10分）

プロジェクトのリポジトリをセットアップしてください。

### 要件

1. `team-project` ディレクトリを作成し、git init する
2. `.gitignore`（node_modules, .env, dist）を作成
3. `README.md` を作成
4. 初期コミットを行う
5. `develop` ブランチを作成

<details>
<summary>解答</summary>

```bash
mkdir ~/team-project && cd ~/team-project
git init

cat > .gitignore << 'EOF'
node_modules/
.env
dist/
*.log
EOF

cat > README.md << 'EOF'
# Team Project
チーム開発シミュレーション用プロジェクト
EOF

git add .gitignore README.md
git commit -m "chore: 初期セットアップ"

git checkout -b develop
```

</details>

---

## Mission 2: feature ブランチでの開発（10分）

2つの機能を別々のブランチで並行開発してください。

### 要件

1. `develop` から `feature/header` ブランチを作成
2. `src/header.html` を作成してコミット
3. `develop` に戻り、`feature/footer` ブランチを作成
4. `src/footer.html` を作成してコミット
5. 両方を `develop` にマージ

<details>
<summary>解答</summary>

```bash
cd ~/team-project

# header の開発
git checkout develop
git checkout -b feature/header
mkdir -p src
cat > src/header.html << 'EOF'
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
EOF
git add src/header.html
git commit -m "feat: ヘッダーコンポーネントを追加"

# footer の開発
git checkout develop
git checkout -b feature/footer
cat > src/footer.html << 'EOF'
<footer>
  <p>&copy; 2025 Team Project</p>
</footer>
EOF
git add src/footer.html
git commit -m "feat: フッターコンポーネントを追加"

# develop にマージ
git checkout develop
git merge feature/header
git merge feature/footer
```

</details>

---

## Mission 3: コンフリクトの発生と解決（15分）

意図的にコンフリクトを発生させ、解決してください。

### 要件

1. `develop` で `src/index.html` を作成してコミット
2. `feature/style-a` ブランチで `src/index.html` の `<h1>` を変更してコミット
3. `develop` に戻り、`feature/style-b` ブランチで同じ `<h1>` を別の内容に変更してコミット
4. `develop` に `feature/style-a` をマージ
5. 続けて `feature/style-b` をマージ（コンフリクト発生）
6. コンフリクトを解決してコミット

<details>
<summary>解答</summary>

```bash
cd ~/team-project

# ベースファイル作成
git checkout develop
cat > src/index.html << 'EOF'
<!DOCTYPE html>
<html>
<body>
  <h1>Welcome to our project</h1>
  <p>This is the main page.</p>
</body>
</html>
EOF
git add src/index.html
git commit -m "feat: メインページを追加"

# style-a: タイトルを変更
git checkout -b feature/style-a
sed -i 's/Welcome to our project/Team Project - Official Site/' src/index.html
git add src/index.html
git commit -m "feat: タイトルを公式サイト名に変更"

# style-b: 同じタイトルを別の内容に変更
git checkout develop
git checkout -b feature/style-b
sed -i 's/Welcome to our project/Our Amazing Team Project/' src/index.html
git add src/index.html
git commit -m "feat: タイトルをキャッチーに変更"

# マージ
git checkout develop
git merge feature/style-a  # 成功

git merge feature/style-b  # コンフリクト発生！

# コンフリクト解決
# エディタで src/index.html を開き、マーカーを削除して適切な内容にする
# 例: 両方の案を組み合わせる
cat > src/index.html << 'EOF'
<!DOCTYPE html>
<html>
<body>
  <h1>Team Project - Our Amazing Official Site</h1>
  <p>This is the main page.</p>
</body>
</html>
EOF

git add src/index.html
git commit -m "merge: style-a と style-b のタイトルを統合"
```

</details>

---

## Mission 4: stash を使った作業切り替え（10分）

作業中の変更を stash で退避し、緊急修正を行ってください。

### 要件

1. `feature/sidebar` ブランチで `src/sidebar.html` を作成中（コミット前）
2. 緊急で `hotfix/typo` ブランチに切り替え、README.md のtypoを修正してコミット
3. `hotfix/typo` を `develop` にマージ
4. `feature/sidebar` に戻り、stash を復元して作業を再開

<details>
<summary>解答</summary>

```bash
cd ~/team-project

# sidebar の開発開始（コミット前の状態）
git checkout develop
git checkout -b feature/sidebar
cat > src/sidebar.html << 'EOF'
<aside>
  <h2>Sidebar</h2>
  <ul>
    <li>Menu 1</li>
    <li>Menu 2</li>
  </ul>
</aside>
EOF
# まだコミットしない！

# 緊急対応 → stash で退避
git stash save "WIP: サイドバー作成中"

# hotfix ブランチで修正
git checkout develop
git checkout -b hotfix/typo
sed -i 's/チーム開発シミュレーション用プロジェクト/チーム開発シミュレーション用のプロジェクト/' README.md
git add README.md
git commit -m "fix: README.md のtypoを修正"

# develop にマージ
git checkout develop
git merge hotfix/typo

# sidebar に戻って stash を復元
git checkout feature/sidebar
git stash pop

# 作業を確認
ls src/sidebar.html  # ファイルが復元されている

# コミットして完了
git add src/sidebar.html
git commit -m "feat: サイドバーコンポーネントを追加"
```

</details>

---

## Mission 5: Interactive Rebase でコミット整理（10分）

コミットを整理して、きれいな履歴にしてください。

### 要件

1. `feature/cleanup` ブランチを作成
2. 3つの細かいコミットを行う（機能追加、typo修正、typo再修正）
3. Interactive Rebase で typo 修正コミットを機能追加に統合

<details>
<summary>解答</summary>

```bash
cd ~/team-project

git checkout develop
git checkout -b feature/cleanup

# 3つのコミット
echo "<div>Contact Form</div>" > src/contact.html
git add src/contact.html
git commit -m "feat: お問い合わせフォームを追加"

sed -i 's/Contact Form/Contatc Form/' src/contact.html  # 意図的なtypo
git add src/contact.html
git commit -m "fix: typo修正"

sed -i 's/Contatc Form/Contact Form/' src/contact.html  # typo再修正
git add src/contact.html
git commit -m "fix: typo再修正"

# Interactive Rebase で整理
# 直近3つのコミットを対象
git rebase -i HEAD~3

# エディタで以下のように変更:
# pick abc1234 feat: お問い合わせフォームを追加
# fixup def5678 fix: typo修正
# fixup ghi9012 fix: typo再修正

# 保存して閉じる → 3つのコミットが1つに統合される
```

注意: Interactive Rebase はエディタが開くため、対話的な操作が必要です。
`GIT_SEQUENCE_EDITOR` 環境変数を使って自動化することも可能です。

</details>

---

## Mission 6: cherry-pick での修正適用（10分）

develop のバグ修正を release ブランチにも適用してください。

### 要件

1. `release/v1.0` ブランチを `develop` から作成
2. `develop` でバグ修正コミットを行う
3. そのコミットを `release/v1.0` に cherry-pick

<details>
<summary>解答</summary>

```bash
cd ~/team-project

# release ブランチ作成
git checkout develop
git checkout -b release/v1.0

# develop でバグ修正
git checkout develop
sed -i 's/This is the main page./This is the main page of our team project./' src/index.html
git add src/index.html
git commit -m "fix: メインページの説明文を修正"

# コミットハッシュを確認
COMMIT_HASH=$(git log -1 --format='%h')

# release に cherry-pick
git checkout release/v1.0
git cherry-pick $COMMIT_HASH

# 確認
git log --oneline -3
```

</details>

---

## Mission 7: git blame と git log での調査（10分）

ファイルの変更履歴を調査してください。

### 要件

1. `src/index.html` の各行の最終変更者を確認
2. 特定のコミットの詳細を確認
3. ファイル変更回数を含むログを出力

<details>
<summary>解答</summary>

```bash
cd ~/team-project

# blame で各行の変更者を確認
git blame src/index.html

# 特定行の blame
git blame -L 3,5 src/index.html

# ファイルに関連するコミット一覧
git log --follow src/index.html

# 各著者のコミット数
git shortlog -sn

# ファイル変更の統計
git log --stat --oneline

# 特定のコミットの詳細
git show HEAD
```

</details>

---

## Mission 8: 総合シナリオ：リリースフロー（15分）

リリースの一連のフローを実行してください。

### シナリオ

1. `develop` から `release/v1.1` ブランチを作成
2. リリース準備（バージョン番号の更新）をコミット
3. テスト中にバグを発見 → 修正してコミット
4. `release/v1.1` を `main` にマージ（リリース）
5. `main` にタグ `v1.1.0` を付与
6. `release/v1.1` を `develop` にもマージ（修正を反映）
7. release ブランチを削除

<details>
<summary>解答</summary>

```bash
cd ~/team-project

# main ブランチが存在しない場合は作成
git checkout -b main 2>/dev/null || git checkout main
git merge develop  # develop の内容を main に反映

# release ブランチ作成
git checkout develop
git checkout -b release/v1.1

# バージョン番号更新
echo "v1.1.0" > VERSION
git add VERSION
git commit -m "chore: バージョンを v1.1.0 に更新"

# テスト中にバグ発見 → 修正
echo "<!-- bugfix applied -->" >> src/index.html
git add src/index.html
git commit -m "fix: リリース前のバグ修正"

# main にマージ（リリース）
git checkout main
git merge --no-ff release/v1.1 -m "release: v1.1.0"

# タグ付与
git tag -a v1.1.0 -m "Release version 1.1.0"

# develop にもマージ
git checkout develop
git merge release/v1.1

# release ブランチ削除
git branch -d release/v1.1

# タグ確認
git tag -l
```

</details>

---

## 達成度チェック

| ミッション | テーマ | 完了 |
|-----------|--------|------|
| Mission 1 | リポジトリ初期設定 | [ ] |
| Mission 2 | feature ブランチ開発 | [ ] |
| Mission 3 | コンフリクト解決 | [ ] |
| Mission 4 | stash での作業切替 | [ ] |
| Mission 5 | Interactive Rebase | [ ] |
| Mission 6 | cherry-pick | [ ] |
| Mission 7 | blame / log 調査 | [ ] |
| Mission 8 | リリースフロー | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| チーム開発フロー | ブランチ作成 → 開発 → PR → レビュー → マージ |
| コンフリクト解決 | マーカーを読み、適切な内容を残す |
| 便利ツール | stash, cherry-pick, bisect, blame |
| リリース | release ブランチ → main マージ → タグ付与 |

### チェックリスト

- [ ] feature ブランチでの開発フローを体験した
- [ ] コンフリクトを手動で解決できた
- [ ] stash での作業退避と復元を体験した
- [ ] cherry-pick で特定コミットを別ブランチに適用できた
- [ ] リリースフローの一連の手順を実行できた

---

## 次のステップへ

お疲れさまでした。チーム開発の一連のフローを体験しました。

次はStep 4の理解度チェックです。

---

*推定所要時間: 90分*
