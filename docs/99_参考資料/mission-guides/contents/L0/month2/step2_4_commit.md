# git commitで変更を記録しよう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 2
subStep: 4
title: "git commitで変更を記録しよう"
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

> 「ファイルをステージングしたね。いよいよコミットだ！」
>
> 「コミットって何ですか？」
>
> 「変更を『確定』して履歴として保存すること。ゲームでいうセーブポイントみたいなものだよ」
>
> 「あ、なるほど！いつでもそこに戻れるってことですね」
>
> 「そう！じゃあ初めてのコミットをしてみよう」

---

## コミットとは

**コミット（commit）** は、ステージングされた変更を**履歴として永久に記録**することです。

### コミットに含まれる情報

| 情報 | 内容 |
|------|------|
| 変更内容 | 何が変わったか |
| コミットメッセージ | なぜ変更したか（あなたが書く） |
| 作成者 | 誰が変更したか |
| タイムスタンプ | いつ変更したか |
| コミットID | 一意の識別子（ハッシュ値） |

### ゲームのセーブポイントとの違い

| ゲームのセーブ | Gitのコミット |
|--------------|--------------|
| 上書きされる | すべて保存される |
| 1つだけ | 無限に作れる |
| いつでも戻れる | いつでも戻れる |

---

## git commitの基本

### コミットする

```bash
git commit -m "コミットメッセージ"
```

- `-m` はメッセージ（message）のオプション
- `"..."` の中にメッセージを書く

### 例

```bash
git commit -m "初めてのコミット"
```

---

## 実際にやってみよう

### Step 1: ステージング状態を確認

```bash
git status
```

出力：
```
On branch main

No commits yet

Changes to be committed:
        new file:   file2.txt
        new file:   file3.txt
        new file:   hello.txt
```

3つのファイルがステージング済みです。

### Step 2: コミットを実行

```bash
git commit -m "最初のファイルを追加"
```

出力：
```
[main (root-commit) abc1234] 最初のファイルを追加
 3 files changed, 3 insertions(+)
 create mode 100644 file2.txt
 create mode 100644 file3.txt
 create mode 100644 hello.txt
```

**おめでとうございます！初めてのコミットが完了しました！**

### 出力の読み方

| 表示 | 意味 |
|------|------|
| `[main (root-commit) abc1234]` | mainブランチの最初のコミット、ID: abc1234 |
| `3 files changed` | 3つのファイルが変更された |
| `3 insertions(+)` | 3行が追加された |
| `create mode 100644` | 新規ファイルが作成された |

### Step 3: 状態を確認

```bash
git status
```

出力：
```
On branch main
nothing to commit, working tree clean
```

すべてがコミットされ、「クリーン」な状態になりました！

---

## コミット履歴を確認しよう

### git logコマンド

```bash
git log
```

出力：
```
commit abc1234567890abcdef1234567890abcdef12345 (HEAD -> main)
Author: Taro Yamada <taro@example.com>
Date:   Mon Jan 27 11:00:00 2026 +0900

    最初のファイルを追加
```

### 出力の読み方

| 項目 | 意味 |
|------|------|
| `commit abc123...` | コミットID（40文字のハッシュ値） |
| `HEAD -> main` | 現在の位置を示す |
| `Author` | コミットした人 |
| `Date` | コミット日時 |
| メッセージ | あなたが書いたコミットメッセージ |

### コンパクトに表示

```bash
git log --oneline
```

出力：
```
abc1234 最初のファイルを追加
```

---

## 良いコミットメッセージの書き方

### 基本ルール

| ルール | 良い例 | 悪い例 |
|--------|--------|--------|
| 何をしたか明確に | `ログイン機能を追加` | `修正` |
| 現在形で書く | `バグを修正` | `バグを修正した` |
| 50文字以内 | `ヘッダーの色を変更` | `ヘッダーの色を青から緑に変更してナビゲーションバーの高さも調整した` |

### よくあるパターン

```
機能追加: feat: ユーザー登録機能を追加
バグ修正: fix: ログインエラーを修正
リファクタリング: refactor: 認証ロジックを整理
ドキュメント: docs: READMEを更新
```

### 初心者のうちは

「何をしたか」が伝わればOKです。

```bash
git commit -m "hello.txtを作成"
git commit -m "タイトルを修正"
git commit -m "新しいページを追加"
```

---

## もう1回コミットしてみよう

### ファイルを変更

```bash
echo "追加の行です" >> hello.txt
```

> `>>` は「追記」を意味します。`>` は上書きになるので注意！

### 変更を確認

```bash
cat hello.txt
```

出力：
```
Hello Git!
追加の行です
```

### 状態を確認

```bash
git status
```

出力：
```
On branch main
Changes not staged for commit:
        modified:   hello.txt
```

`modified`（変更された）と表示されています。

### ステージング → コミット

```bash
git add hello.txt
git commit -m "hello.txtに行を追加"
```

### 履歴を確認

```bash
git log --oneline
```

出力：
```
def5678 hello.txtに行を追加
abc1234 最初のファイルを追加
```

コミットが2つになりました！

---

## コミットの流れまとめ

```
ファイル作成/変更
     ↓
git add（ステージング）
     ↓
git commit -m "メッセージ"（コミット）
     ↓
git log で確認
```

これがGitの基本的なワークフローです！

---

## よくある間違い

### 間違い1: メッセージなしでコミット

```bash
git commit  # -m を忘れた
```

→ エディタが開きます。メッセージを書いて保存するか、`:q!`（Vimの場合）で中止できます。

### 間違い2: ステージングを忘れてコミット

```bash
git commit -m "変更を保存"
```

出力：
```
nothing to commit, working tree clean
```

→ `git add` を先に実行してください。

### 間違い3: コミットメッセージを空にした

```bash
git commit -m ""
```

→ エラーになります。メッセージは必須です。

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. ステージング状態を確認
git status

# 2. 初めてのコミット
git commit -m "最初のファイルを追加"

# 3. 状態を確認
git status

# 4. 履歴を確認
git log --oneline

# 5. ファイルを変更
echo "2回目の変更" >> hello.txt

# 6. ステージング → コミット
git add hello.txt
git commit -m "hello.txtを更新"

# 7. 履歴を再確認
git log --oneline
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| `git commit -m "メッセージ"` | ステージングした変更を記録 |
| コミットメッセージ | 何をしたかを簡潔に書く |
| `git log` | コミット履歴を表示 |
| `git log --oneline` | 履歴を1行で表示 |

### Gitの基本フロー

```
変更 → add → commit → 繰り返し
```

### チェックリスト

- [ ] `git commit -m "メッセージ"` でコミットできた
- [ ] `git log` で履歴を確認できた
- [ ] 2回以上コミットを作成できた

---

## 次のステップへ

初めてのコミット、おめでとうございます！

次のセクションでは、ここまで学んだことを活用して、
実践的な演習に挑戦します。

3つのファイルを作成し、意味のあるコミットを積み重ねていきましょう！

---

*推定読了時間: 30分*
