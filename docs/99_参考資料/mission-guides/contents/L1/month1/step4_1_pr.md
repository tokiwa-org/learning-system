# Pull Requestを作成しよう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 4
subStep: 1
title: "Pull Requestを作成しよう"
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

> 初めての機能開発が終わった。
>
> 「コード書きました。main にマージしていいですか？」
>
> 佐藤先輩が首を振る。
>
> 「直接マージはしない。Pull Requestを作成して、レビューを受けてからだ」
>
> 「Pull Request... PRですか？」
>
> 「そうだ。PRは"自分の変更をチームに見てもらう場"だ。
> コードの品質を保ち、知識を共有する。チーム開発の要だよ」

---

## Pull Request（PR）とは

Pull Requestは「自分のブランチの変更を、別のブランチにマージしてほしい」というリクエストです。

### PRの目的

| 目的 | 説明 |
|------|------|
| コード品質の維持 | レビューによるバグの早期発見 |
| 知識共有 | チームメンバーが変更内容を把握 |
| ドキュメント | 何を・なぜ変更したかの記録 |
| CI/CDの実行 | 自動テスト・ビルドのトリガー |

---

## PR作成の手順

### Step 1: feature ブランチで開発

```bash
# ブランチ作成
git checkout -b feature/user-profile

# 開発作業
vim src/components/UserProfile.js
vim src/styles/profile.css

# コミット
git add src/components/UserProfile.js src/styles/profile.css
git commit -m "feat: ユーザープロフィールページを追加"

# 追加のコミット
vim src/components/UserProfile.js
git add src/components/UserProfile.js
git commit -m "feat: プロフィール画像のアップロード機能を追加"
```

### Step 2: リモートにプッシュ

```bash
# 初回プッシュ（upstream を設定）
git push -u origin feature/user-profile
```

### Step 3: GitHub でPR作成

GitHub のリポジトリページで "Compare & pull request" ボタンを押すか、
`gh` CLI を使用します。

```bash
# gh CLI で PR 作成
gh pr create \
  --title "feat: ユーザープロフィールページを追加" \
  --body "## 概要
ユーザープロフィールページを新規作成しました。

## 変更内容
- プロフィール表示コンポーネント
- プロフィール画像アップロード機能
- レスポンシブ対応

## テスト方法
1. /profile にアクセス
2. プロフィール情報が表示されることを確認
3. 画像アップロードが動作することを確認

## スクリーンショット
(添付予定)"
```

---

## PRの説明文テンプレート

### 基本テンプレート

```markdown
## 概要
<!-- このPRで何を実現するか、1-2文で説明 -->

## 変更内容
<!-- 主な変更点をリストで記述 -->
-
-
-

## 関連Issue
<!-- 関連するIssue番号 -->
Closes #123

## テスト方法
<!-- レビュアーが動作確認する手順 -->
1.
2.
3.

## スクリーンショット
<!-- UIの変更がある場合 -->

## チェックリスト
- [ ] テストを追加/更新した
- [ ] ドキュメントを更新した
- [ ] セルフレビューを行った
```

### PRテンプレートの設置

リポジトリに `.github/pull_request_template.md` を配置すると、
PR作成時に自動的にテンプレートが挿入されます。

```bash
mkdir -p .github
cat > .github/pull_request_template.md << 'EOF'
## 概要


## 変更内容
-

## テスト方法
1.

## チェックリスト
- [ ] セルフレビュー完了
- [ ] テスト追加/更新
- [ ] ドキュメント更新（該当する場合）
EOF
```

---

## Draft PR（下書きPR）

作業中の段階でPRを作成し、進捗を共有したい場合に使います。

```bash
# Draft PR を作成
gh pr create --draft \
  --title "WIP: ユーザープロフィールページ" \
  --body "作業中です。フィードバックをお願いします。"
```

### Draft PR の活用

- 実装方針について早期にフィードバックを得たい
- 作業の進捗をチームに共有したい
- CIの結果を確認しながら開発したい

レビュー準備が整ったら "Ready for review" に変更します。

---

## ラベルの活用

PRにラベルを付けると、分類や優先度が一目で分かります。

| ラベル | 用途 |
|--------|------|
| `feature` | 新機能 |
| `bug` | バグ修正 |
| `enhancement` | 改善 |
| `documentation` | ドキュメント |
| `breaking-change` | 破壊的変更 |
| `priority: high` | 優先度高 |
| `needs-review` | レビュー待ち |

```bash
# ラベルを付けてPR作成
gh pr create --label "feature" --label "needs-review" \
  --title "feat: ユーザープロフィールページ"
```

---

## PRのセルフレビュー

PRを作成したら、まず自分でレビューしましょう。

### セルフレビューのポイント

1. **差分を確認**: 意図しない変更が含まれていないか
2. **コミット履歴**: メッセージが適切か、不要なコミットがないか
3. **テスト**: 必要なテストが含まれているか
4. **ドキュメント**: 変更に伴うドキュメント更新があるか
5. **機密情報**: パスワードやAPIキーが含まれていないか

```bash
# PR の差分を確認
gh pr diff

# PR の詳細を確認
gh pr view
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| PR の目的 | コード品質、知識共有、ドキュメント |
| 作成手順 | ブランチ開発 → push → PR作成 |
| 説明文 | 概要、変更内容、テスト方法を記述 |
| Draft PR | 作業中の段階で共有 |
| セルフレビュー | PRを出す前に自分で確認 |

### チェックリスト

- [ ] feature ブランチからPRを作成できる
- [ ] PRの説明文を適切に書ける
- [ ] Draft PRの使い方を理解した
- [ ] gh CLI でPRを操作できる
- [ ] セルフレビューの習慣を理解した

---

## 次のステップへ

PR作成の方法を学びました。

次のセクションでは、PRのもう半分 -- 「コードレビュー」の作法を学びます。
レビューする側の視点を知ることで、より良いPRが書けるようになります。

---

*推定読了時間: 30分*
