# 高度なGit操作

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 4
subStep: 4
title: "高度なGit操作"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「本番環境でバグが出た。でも、いつから壊れていたか分からない」
>
> チーム全体が困っている中、佐藤先輩が冷静に言った。
>
> 「git bisect を使おう。二分探索でバグが入ったコミットを特定できる」
>
> 「二分探索... アルゴリズムの？」
>
> 「そうだ。Git にはこういう"調査ツール"が揃っている。
> bisect, reflog, blame, worktree -- これらを使えば、
> どんなトラブルでも原因を追跡できる」

---

## git bisect -- バグ混入コミットの特定

`git bisect` は二分探索でバグが混入したコミットを効率的に見つけます。

### 使い方

```bash
# 1. bisect 開始
git bisect start

# 2. 現在のコミットはバグがある（bad）
git bisect bad

# 3. このコミットでは正常だった（good）
git bisect good abc1234

# 4. Git が中間のコミットをチェックアウト
# → テストして good か bad かを判定
git bisect good  # このコミットは正常
# または
git bisect bad   # このコミットはバグあり

# 5. Git がさらに中間をチェックアウト...
# → 繰り返し

# 6. 原因コミットが特定される
# abc1234 is the first bad commit

# 7. bisect 終了（元のブランチに戻る）
git bisect reset
```

### 自動化（スクリプトと組み合わせ）

```bash
# テストスクリプトで自動判定
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
git bisect run npm test
# テストが失敗するコミットを自動で特定
```

### 実践例

```bash
# 例: ログインが壊れている
git bisect start
git bisect bad                    # 現在は壊れている
git bisect good v2.3.0           # v2.3.0 では動いていた

# Git が中間コミットをチェックアウト
# → ログイン機能をテスト
# → 「動く」→ git bisect good
# → 「壊れている」→ git bisect bad
# → 数回の繰り返しで原因コミットを特定

git bisect reset
```

100コミットの中から原因を見つける場合、最大 log2(100) = 約7回 のテストで特定可能です。

---

## git reflog -- 操作履歴のセーフティネット

`git reflog` は、HEADの移動履歴を記録しています。
間違えた操作を取り消す「最後の砦」です。

### 基本操作

```bash
git reflog
# abc1234 HEAD@{0}: commit: feat: 新機能追加
# def5678 HEAD@{1}: checkout: moving from main to feature
# ghi9012 HEAD@{2}: commit: fix: バグ修正
# jkl3456 HEAD@{3}: reset: moving to HEAD~3
```

### 救出パターン

```bash
# 間違えて reset --hard した場合
git reset --hard HEAD~3    # あ、やりすぎた！

# reflog で元のコミットを見つける
git reflog
# jkl3456 HEAD@{0}: reset: moving to HEAD~3
# abc1234 HEAD@{1}: commit: 消してしまったコミット

# 元に戻す
git reset --hard abc1234

# 間違えて削除したブランチを復元
git branch -D feature/important   # あ、消してしまった！

git reflog
# ... checkout: moving from feature/important to main のログを見つける
git checkout -b feature/important abc1234
```

> `reflog` のおかげで、Gitではほとんどの操作が取り消し可能です。
> ただし、reflog の記録は約90日で期限切れになります。

---

## git blame -- 変更者と変更理由の追跡

`git blame` は、ファイルの各行が「誰が」「いつ」「どのコミットで」変更したかを表示します。

### 基本操作

```bash
# ファイル全体の blame
git blame src/app.js

# 出力例:
# abc1234 (Tanaka 2025-01-10 10:30 +0900  1) const express = require('express');
# def5678 (Sato   2025-01-12 14:20 +0900  2) const cors = require('cors');
# abc1234 (Tanaka 2025-01-10 10:30 +0900  3) const app = express();

# 特定の行範囲だけ
git blame -L 10,20 src/app.js

# 空白の変更を無視
git blame -w src/app.js
```

### 実践的な使い方

```bash
# 「この行、なんでこうなってるんだ？」
git blame src/config.js
# → コミットハッシュを取得

# そのコミットの詳細を確認
git show abc1234
# → コミットメッセージに理由が書かれている（はず）

# さらに関連するPRを調査
gh pr list --search "abc1234"
```

---

## git worktree -- 複数ブランチの同時作業

`git worktree` は、1つのリポジトリで複数のブランチを同時にチェックアウトできます。

### 使いどころ

- 緊急のバグ修正中に、別のブランチの動作確認が必要
- レビュー中のPRを手元で実行して確認したい
- 長時間のビルド中に別のブランチで作業したい

### 基本操作

```bash
# 新しい worktree を作成
git worktree add ../my-project-hotfix hotfix/critical-bug

# ディレクトリ構造:
# my-project/        ← main ブランチ（元の作業ディレクトリ）
# my-project-hotfix/ ← hotfix/critical-bug ブランチ

# worktree 一覧
git worktree list

# worktree の削除
git worktree remove ../my-project-hotfix
```

### worktree vs ブランチ切り替え

| 方法 | 作業ディレクトリ | ステージングの状態 |
|------|-----------------|-------------------|
| `git checkout` | 1つ | 切り替え時にリセット |
| `git worktree` | 複数 | それぞれ独立 |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| git bisect | 二分探索でバグ混入コミットを特定 |
| git reflog | 操作履歴から間違った操作を復元 |
| git blame | 各行の変更者・変更理由を追跡 |
| git worktree | 複数ブランチを同時にチェックアウト |

### チェックリスト

- [ ] git bisect の手順を理解した
- [ ] git reflog で操作を復元できる
- [ ] git blame でコードの変更履歴を追跡できる
- [ ] git worktree の使いどころを理解した

---

## 次のステップへ

高度なGit操作を学びました。トラブルシューティングの武器が揃いましたね。

次のセクションでは、ここまでの全Git知識を使った演習に挑戦します。
チーム開発のシミュレーションです。

---

*推定読了時間: 30分*
