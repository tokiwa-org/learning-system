# git logのオプションを使いこなそう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 4
subStep: 2
title: "git logのオプションを使いこなそう"
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

> 「git logの基本は覚えたね。でも実際の開発ではもっと複雑な履歴を見ることになる」
>
> 「どんなときに困るんですか？」
>
> 「たとえば100人のチームで毎日何十もコミットがあると、見たい情報を見つけるのが大変なんだ」
>
> 「確かに...。絞り込む方法があるってことですね！」

---

## グラフ表示

### --graphオプション

ブランチの分岐やマージを視覚的に表示します。

```bash
git log --oneline --graph
```

出力例：
```
* def5678 (HEAD -> main) hello.txtを更新
* bcd4567 2回目の変更を追加
* abc1234 最初のファイルを追加
```

### ブランチがある場合

```
*   merge123 マージコミット
|\
| * feature1 新機能を追加
* | abc4567 別の変更
|/
* abc1234 共通の親
```

> 今はブランチを使っていないので単純な履歴になります。

---

## 特定ファイルの履歴

### ファイルを指定

```bash
git log ファイル名
```

例：
```bash
git log hello.txt
```

そのファイルに関連するコミットだけが表示されます。

### 1行表示と組み合わせ

```bash
git log --oneline hello.txt
```

出力：
```
def5678 hello.txtを更新
abc1234 最初のファイルを追加
```

---

## コミットメッセージで検索

### --grepオプション

```bash
git log --grep="修正"
```

「修正」を含むコミットメッセージを検索します。

### 大文字小文字を無視

```bash
git log --grep="fix" -i
```

`-i` オプションで大文字小文字を区別しません。

---

## 変更内容で検索

### -Sオプション（ピックアックス）

特定の文字列が追加または削除されたコミットを検索：

```bash
git log -S "Hello"
```

「Hello」という文字列が増減したコミットを表示します。

### 使用例

```bash
# "TODO" が追加されたコミットを探す
git log -S "TODO" --oneline

# 特定の関数名を探す
git log -S "calculateTotal" --oneline
```

---

## フォーマットをカスタマイズ

### --prettyオプション

```bash
git log --pretty=format:"%h %s"
```

出力：
```
def5678 hello.txtを更新
bcd4567 2回目の変更を追加
```

### よく使うプレースホルダー

| プレースホルダー | 意味 |
|-----------------|------|
| `%H` | 完全なハッシュ |
| `%h` | 短縮ハッシュ |
| `%s` | コミットメッセージ（件名） |
| `%an` | 作成者名 |
| `%ae` | 作成者メール |
| `%ad` | 作成日 |
| `%ar` | 作成日（相対） |

### 実践的なフォーマット例

```bash
git log --pretty=format:"%h - %an, %ar : %s"
```

出力：
```
def5678 - Taro Yamada, 2 hours ago : hello.txtを更新
bcd4567 - Taro Yamada, 5 hours ago : 2回目の変更を追加
```

---

## 日付のフォーマット

### --date オプション

```bash
git log --date=short
```

日付を `YYYY-MM-DD` 形式で表示。

### 日付フォーマットの種類

| オプション | 出力例 |
|-----------|--------|
| `--date=short` | 2026-01-27 |
| `--date=relative` | 2 hours ago |
| `--date=local` | Mon Jan 27 15:00:00 2026 |
| `--date=iso` | 2026-01-27 15:00:00 +0900 |

---

## 範囲を指定

### コミット間

```bash
git log abc1234..def5678
```

abc1234 から def5678 までのコミットを表示。

### 最近のN件

```bash
git log HEAD~3..HEAD
```

最新3件のコミットを表示。

---

## 便利なエイリアス

よく使うコマンドは短縮名を設定しましょう。

### エイリアスの設定

```bash
git config --global alias.lg "log --oneline --graph --all"
```

### 使用方法

```bash
git lg
```

`git lg` だけで `git log --oneline --graph --all` が実行されます。

### おすすめのエイリアス

```bash
# シンプルなログ
git config --global alias.l "log --oneline -10"

# グラフ付きログ
git config --global alias.lg "log --oneline --graph --all --decorate"

# 詳細ログ
git config --global alias.ll "log --pretty=format:'%h %ad | %s%d [%an]' --date=short"
```

---

## 全ブランチを表示

### --allオプション

```bash
git log --oneline --all
```

現在のブランチだけでなく、すべてのブランチの履歴を表示します。

### グラフと組み合わせ

```bash
git log --oneline --graph --all
```

ブランチの全体像が見えます。

---

## 実践：お気に入りのコマンドを見つけよう

### パターン1: シンプル派

```bash
git log --oneline -10
```

最新10件を1行で。

### パターン2: 詳細派

```bash
git log --stat -3
```

最新3件の変更ファイルを確認。

### パターン3: ビジュアル派

```bash
git log --oneline --graph --all
```

ブランチ構造を視覚的に把握。

### パターン4: 調査派

```bash
git log --all --oneline --grep="fix"
```

修正コミットを探す。

---

## ハンズオン

以下のコマンドを試してください。

```bash
# 1. グラフ表示
git log --oneline --graph

# 2. 特定ファイルの履歴
git log --oneline hello.txt

# 3. カスタムフォーマット
git log --pretty=format:"%h - %an, %ar : %s"

# 4. 相対日付
git log --date=relative -3

# 5. エイリアスを設定
git config --global alias.lg "log --oneline --graph --all"

# 6. エイリアスを使用
git lg
```

---

## まとめ

| オプション | 説明 |
|-----------|------|
| `--graph` | ブランチ構造を視覚化 |
| `--all` | 全ブランチを表示 |
| `--grep="文字列"` | メッセージで検索 |
| `-S "文字列"` | 変更内容で検索 |
| `--pretty=format:"..."` | 出力形式をカスタマイズ |
| `--date=形式` | 日付形式を指定 |
| `ファイル名` | 特定ファイルの履歴 |

### チェックリスト

- [ ] `--graph` でグラフ表示できた
- [ ] 特定ファイルの履歴を確認できた
- [ ] エイリアスを設定できた

---

## 次のステップへ

git logのオプションをマスターしましたね！

次のセクションでは、`git diff` を使って
変更の「中身」を確認する方法を学びます。

「何が変わったか」を詳しく見ていきましょう！

---

*推定読了時間: 30分*
