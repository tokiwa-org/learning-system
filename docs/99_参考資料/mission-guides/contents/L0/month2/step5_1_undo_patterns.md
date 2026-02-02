# 取り消しパターンを理解しよう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 5
subStep: 1
title: "取り消しパターンを理解しよう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「あ、間違えた...どうしよう」
>
> 「Gitなら大丈夫。取り消す方法はいくつかあるよ」
>
> 「いくつか？どれを使えばいいんですか？」
>
> 「状況によって使い分けるんだ。まずはパターンを理解しよう」

---

## 間違いのパターン

Gitで「間違えた」と感じる状況は、大きく4つあります。

| パターン | 状況 | 解決策 |
|---------|------|--------|
| ① | 編集したけど、やっぱり元に戻したい | `git checkout` / `git restore` |
| ② | add したけど、ステージングを取り消したい | `git reset` / `git restore --staged` |
| ③ | commit したけど、取り消したい | `git reset` / `git revert` |
| ④ | push したけど、取り消したい | `git revert` |

---

## 図で理解しよう

```
ワーキング          ステージング           リポジトリ          リモート
ディレクトリ          エリア              (ローカル)          (GitHub)
    │                  │                    │                  │
    │ ←──① checkout ───│                    │                  │
    │                  │                    │                  │
    │ ────── add ────→ │                    │                  │
    │                  │ ←── ② reset ────── │                  │
    │                  │                    │                  │
    │                  │ ──── commit ────→  │                  │
    │ ←────────────────│←── ③ reset ─────── │                  │
    │                  │                    │                  │
    │                  │                    │ ──── push ────→  │
    │                  │                    │ ←─④ revert ────→ │
```

---

## パターン①: ファイルの変更を取り消す

### 状況

ファイルを編集したけど、保存前の状態に戻したい。

```
hello.txt を編集 → やっぱり元に戻したい
```

### 解決策

```bash
# 従来の方法
git checkout -- hello.txt

# 新しい方法（Git 2.23以降）
git restore hello.txt
```

> 編集内容は完全に失われます！取り消せません。

---

## パターン②: ステージングを取り消す

### 状況

`git add` したけど、ステージングを取り消したい。

```
git add hello.txt → やっぱりステージングを取り消したい
```

### 解決策

```bash
# 従来の方法
git reset HEAD hello.txt

# 新しい方法（Git 2.23以降）
git restore --staged hello.txt
```

> ファイルの内容は変わりません。ステージングだけ取り消されます。

---

## パターン③: コミットを取り消す

### 状況

`git commit` したけど、コミット自体を取り消したい。

```
git commit -m "..." → やっぱりコミットを取り消したい
```

### 解決策A: resetで履歴ごと削除

```bash
git reset --soft HEAD~1   # コミットだけ取り消し（変更は残る）
git reset --mixed HEAD~1  # コミット+ステージング取り消し（変更は残る）
git reset --hard HEAD~1   # すべて取り消し（変更も消える）
```

### 解決策B: revertで打ち消しコミット

```bash
git revert HEAD
```

新しいコミットで変更を打ち消します。履歴は残ります。

---

## パターン④: pushしたコミットを取り消す

### 状況

`git push` してしまった。リモートの変更を取り消したい。

### 解決策

```bash
git revert HEAD
git push
```

**重要**: push済みのコミットには `git reset` を使わない！
チームに迷惑がかかります。

---

## 取り消しコマンドの選び方

```
Q: まだ add していない？
├─ Yes → git checkout / git restore
└─ No
   │
   Q: まだ commit していない？
   ├─ Yes → git reset HEAD / git restore --staged
   └─ No
      │
      Q: まだ push していない？
      ├─ Yes → git reset --soft/mixed/hard
      └─ No → git revert
```

---

## 新旧コマンドの対応

Git 2.23で `git restore` と `git switch` が追加されました。

| 操作 | 従来のコマンド | 新しいコマンド |
|------|--------------|--------------|
| 変更を取り消す | `git checkout -- ファイル` | `git restore ファイル` |
| ステージング取り消し | `git reset HEAD ファイル` | `git restore --staged ファイル` |
| ブランチ切り替え | `git checkout ブランチ` | `git switch ブランチ` |

> 新しいコマンドの方が意図が明確で分かりやすいです。

---

## 危険度レベル

| コマンド | 危険度 | 説明 |
|---------|--------|------|
| `git restore --staged` | 🟢 低 | ステージングを取り消すだけ |
| `git restore` | 🟡 中 | 変更が失われる |
| `git reset --soft` | 🟢 低 | コミットだけ取り消し |
| `git reset --mixed` | 🟡 中 | コミット+ステージング取り消し |
| `git reset --hard` | 🔴 高 | すべての変更が失われる |
| `git push --force` | 🔴 危険 | リモートの履歴を書き換え |

---

## 取り消す前に確認しよう

### 現在の状態を確認

```bash
git status
```

- Untracked files → まだaddしていない
- Changes not staged → addしていない変更
- Changes to be committed → add済み
- nothing to commit → すべてコミット済み

### 履歴を確認

```bash
git log --oneline -5
```

どのコミットを取り消すか確認。

---

## よくある間違い

### 間違い1: checkout と reset を混同

```bash
git checkout HEAD~1  # ブランチが移動してしまう！
git reset HEAD~1     # コミットを取り消す
```

### 間違い2: --hard を安易に使う

```bash
git reset --hard HEAD~1  # 変更が完全に消える！
```

まずは `--soft` で試しましょう。

### 間違い3: push後にresetを使う

```bash
git reset --hard HEAD~1
git push --force  # チームに迷惑！
```

push後は `git revert` を使いましょう。

---

## ハンズオン

まずは状況を確認するコマンドを練習しましょう。

```bash
cd ~/my-first-git

# 1. 現在の状態を確認
git status

# 2. 履歴を確認
git log --oneline -3

# 3. 変更を作成
echo "テスト" >> hello.txt

# 4. 状態を確認（Changes not staged）
git status

# 5. ステージング
git add hello.txt

# 6. 状態を確認（Changes to be committed）
git status
```

---

## まとめ

| パターン | 状況 | コマンド |
|---------|------|----------|
| ① | 編集を取り消したい | `git restore ファイル` |
| ② | ステージングを取り消したい | `git restore --staged ファイル` |
| ③ | コミットを取り消したい（ローカル） | `git reset` |
| ④ | コミットを取り消したい（push済み） | `git revert` |

### 判断のポイント

1. **add前** → `git restore`
2. **add後、commit前** → `git restore --staged`
3. **commit後、push前** → `git reset`
4. **push後** → `git revert`

### チェックリスト

- [ ] 4つの取り消しパターンを理解できた
- [ ] 各パターンで使うコマンドがわかった
- [ ] 危険度を意識できるようになった

---

## 次のステップへ

取り消しパターンの概要は理解できましたか？

次のセクションから、各コマンドを実際に使ってみましょう。
まずは `git checkout` / `git restore` から始めます！

---

*推定読了時間: 30分*
