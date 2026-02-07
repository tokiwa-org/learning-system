# stashとcherry-pickを活用しよう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 3
subStep: 4
title: "stashとcherry-pickを活用しよう"
itemType: LESSON
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 機能開発の真っ最中、先輩から急な依頼が来た。
>
> 「悪い、本番で緊急バグが出た。今すぐ hotfix ブランチに切り替えてくれ」
>
> 「でも今、作業途中のコードがあって...コミットするにはまだ早いし...」
>
> 「そういう時は `stash` だ。作業中の変更を一時的に退避させられる」
>
> 佐藤先輩が素早くコマンドを打つ。
>
> 「git stash。これで変更が"棚上げ"される。作業が終わったら戻せばいい」

---

## git stash -- 変更の一時退避

`stash` は作業中の変更を一時的に保存し、ワーキングディレクトリをクリーンにします。

### 基本操作

```bash
# 変更を一時退避
git stash

# メッセージ付きで退避（推奨）
git stash save "WIP: ユーザー認証のバリデーション実装中"

# 退避リストを確認
git stash list
# stash@{0}: On feature/auth: WIP: ユーザー認証のバリデーション実装中
# stash@{1}: WIP on main: abc1234 前回の作業

# 最新の stash を復元（stash は削除される）
git stash pop

# 最新の stash を復元（stash は残る）
git stash apply

# 特定の stash を復元
git stash apply stash@{1}

# stash の内容を確認
git stash show stash@{0}
git stash show -p stash@{0}  # diff形式で表示

# stash を削除
git stash drop stash@{0}

# 全ての stash を削除
git stash clear
```

### 実践的なワークフロー

```bash
# 1. 機能開発中...
vim src/auth.js

# 2. 緊急対応の依頼 → 変更を退避
git stash save "WIP: auth validation"

# 3. hotfix ブランチに切り替えて修正
git checkout hotfix/critical-bug
# ... 修正作業 ...
git add . && git commit -m "fix: critical bug"
git push

# 4. 元のブランチに戻る
git checkout feature/auth

# 5. 退避した変更を復元
git stash pop

# 6. 開発を再開
```

### 便利なオプション

```bash
# 未追跡ファイル（新規ファイル）も含めて stash
git stash -u
# または
git stash --include-untracked

# 特定のファイルだけ stash
git stash push src/auth.js src/config.js

# stash から新しいブランチを作成
git stash branch new-branch-name stash@{0}
```

---

## git cherry-pick -- 特定のコミットを取り込む

`cherry-pick` は、別のブランチから特定のコミットだけを現在のブランチに取り込みます。

### 基本操作

```bash
# 特定のコミットを取り込む
git cherry-pick abc1234

# 複数のコミットを取り込む
git cherry-pick abc1234 def5678

# 範囲指定（開始は含まない）
git cherry-pick abc1234..ghi9012

# コミットせずに変更だけ取り込む
git cherry-pick --no-commit abc1234
```

### 使いどころ

```bash
# 例: develop にマージされたバグ修正を、release ブランチにも適用したい

# 1. 対象のコミットハッシュを確認
git log develop --oneline
# abc1234 fix: ログイン時のバリデーションエラーを修正

# 2. release ブランチで cherry-pick
git checkout release/v1.2
git cherry-pick abc1234
```

### コンフリクトが発生した場合

```bash
# cherry-pick 中のコンフリクト
# 1. ファイルを編集して解決
# 2. ステージング
git add .
# 3. 続行
git cherry-pick --continue

# 中止する場合
git cherry-pick --abort
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| git stash | 作業中の変更を一時退避。ブランチ切り替え時に便利 |
| git stash pop | 退避した変更を復元して stash を削除 |
| git stash apply | 退避した変更を復元して stash を残す |
| git cherry-pick | 別ブランチの特定コミットだけを取り込む |

### チェックリスト

- [ ] git stash で変更を退避できる
- [ ] stash list で退避内容を確認できる
- [ ] stash pop / apply の違いを理解した
- [ ] cherry-pick で特定のコミットを取り込める

---

## 次のステップへ

stash と cherry-pick を学びました。これで Git 操作の引き出しがさらに増えましたね。

次のセクションでは、Git 運用のベストプラクティスを学びます。
.gitignore、コミットメッセージ規約、便利な alias など、プロの運用テクニックです。

---

*推定読了時間: 15分*
