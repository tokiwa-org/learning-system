# マージとリベースを使い分けよう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 3
subStep: 2
title: "マージとリベースを使い分けよう"
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

> コードレビューで先輩から質問された。
>
> 「このブランチ、マージする前にリベースした方がいいんじゃない？」
>
> 「リベース... ですか？マージとどう違うんですか？」
>
> 佐藤先輩がホワイトボードの前に立った。
>
> 「マージとリベースは、ブランチを統合する2つの方法だ。
> どちらも結果は同じだが、**履歴の見え方**が全然違う。使い分けが重要だ」

---

## マージ（merge）

### Fast-Forward マージ

`main` が変更されていない場合、ポインタを前に進めるだけです。

```
# マージ前
main:    A -- B
                \
feature:         C -- D

# Fast-Forward マージ後
main:    A -- B -- C -- D
```

```bash
git checkout main
git merge feature
# Fast-forward と表示される
```

### 3-Way マージ（通常のマージ）

`main` にも変更がある場合、マージコミットが作成されます。

```
# マージ前
main:    A -- B -- E
                \
feature:         C -- D

# 3-Way マージ後
main:    A -- B -- E -- M (マージコミット)
                \      /
feature:         C -- D
```

```bash
git checkout main
git merge feature
# Merge commit が作成される
```

### Squash マージ

フィーチャーブランチの全コミットを1つにまとめてマージします。

```
# マージ前
main:    A -- B
                \
feature:         C -- D -- E

# Squash マージ後
main:    A -- B -- F (C+D+Eを1つにまとめたコミット)
```

```bash
git checkout main
git merge --squash feature
git commit -m "feat: ユーザー認証機能を追加"
```

---

## リベース（rebase）

リベースは、ブランチの「根元」を移動させます。

```
# リベース前
main:    A -- B -- E
                \
feature:         C -- D

# リベース後
main:    A -- B -- E
                    \
feature:             C' -- D' (コミットが再作成される)
```

```bash
git checkout feature
git rebase main
```

### リベースの特徴

- マージコミットが作成されない
- 履歴が直線的（きれいな一本線）になる
- コミットが**再作成**される（ハッシュが変わる）

---

## マージ vs リベース の比較

| 項目 | マージ | リベース |
|------|--------|---------|
| 履歴 | 分岐・合流が残る | 直線的になる |
| マージコミット | 作成される | 作成されない |
| コミットハッシュ | 変わらない | 変わる |
| 安全性 | 高い（既存履歴を変更しない） | 注意が必要 |
| 可読性 | 分岐が多いと複雑 | すっきりしている |

### 使い分けの指針

```
■ マージを使う場面
├── 共有ブランチ（main, develop）への統合
├── 複数人が作業しているブランチ
└── マージの記録を残したい時

■ リベースを使う場面
├── 自分だけのfeatureブランチを最新にする
├── コミット履歴をきれいにしたい時
└── PR作成前に main の変更を取り込む
```

### リベースの黄金ルール

> **公開済みのブランチをリベースしてはいけない**

他の人が参照しているブランチをリベースすると、コミットハッシュが変わるため、
他のメンバーの作業が壊れます。

```bash
# やってはいけない例
git checkout main
git rebase feature  # main をリベース → チームが混乱

# 正しい使い方
git checkout feature
git rebase main     # 自分のブランチを最新に更新
```

---

## 実践的なワークフロー

### PRを出す前の推奨手順

```bash
# 1. main の最新を取得
git checkout main
git pull

# 2. feature ブランチに戻る
git checkout feature/my-feature

# 3. リベースで main の最新変更を取り込む
git rebase main

# 4. (コンフリクトがあれば解決)

# 5. リモートにプッシュ（リベース後はforce pushが必要）
git push --force-with-lease origin feature/my-feature

# 6. PR を作成
```

### `--force-with-lease` について

リベース後は通常の `push` が拒否されます（履歴が書き変わっているため）。

```bash
# 危険: 他の人の変更を上書きする可能性
git push --force

# 安全: リモートが予期しない変更をされていない場合のみ実行
git push --force-with-lease
```

> **推奨**: `--force` ではなく `--force-with-lease` を必ず使いましょう。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Fast-Forward | main が進んでいない場合のシンプルなマージ |
| 3-Way マージ | マージコミットが作成される通常のマージ |
| Squash マージ | 複数コミットを1つにまとめてマージ |
| リベース | ブランチの根元を移動、履歴が直線的に |
| 黄金ルール | 公開済みブランチはリベースしない |

### チェックリスト

- [ ] Fast-Forward マージと3-Way マージの違いを説明できる
- [ ] Squash マージの用途を理解した
- [ ] リベースの仕組みを説明できる
- [ ] マージとリベースの使い分けができる
- [ ] `--force-with-lease` の意味を理解した

---

## 次のステップへ

マージとリベースの使い分けを理解しましたね。

次のセクションでは、避けて通れない「コンフリクト」の解決方法を学びます。
コンフリクトは恐れるものではありません。正しい手順を知れば、冷静に対処できます。

---

*推定読了時間: 25分*
