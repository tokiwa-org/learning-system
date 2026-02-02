# git logの基本を覚えよう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 4
subStep: 1
title: "git logの基本を覚えよう"
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

> 「コミットを何回もしてきたけど、履歴ってどうやって見るの？」
>
> 「`git log` を使えばすべての履歴が見れるよ。開発で一番よく使うコマンドの1つだね」
>
> 「バグを見つけたときに『いつこうなった？』って調べられるってことですか？」
>
> 「その通り！履歴を読む力は、デバッグにも役立つんだ」

---

## git logとは

`git log` は、コミット履歴を表示するコマンドです。

```bash
git log
```

---

## 基本の出力を理解しよう

### コマンドを実行

```bash
cd ~/my-first-git
git log
```

### 出力例

```
commit def5678901234567890abcdef1234567890abcdef (HEAD -> main, origin/main)
Author: Taro Yamada <taro@example.com>
Date:   Mon Jan 27 15:00:00 2026 +0900

    hello.txtを更新

commit abc1234567890abcdef1234567890abcdef12345
Author: Taro Yamada <taro@example.com>
Date:   Mon Jan 27 11:00:00 2026 +0900

    最初のファイルを追加
```

---

## 出力の読み方

### 各要素の意味

```
commit def5678901234567890abcdef1234567890abcdef (HEAD -> main, origin/main)
^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^
  ①                    ②                                 ③

Author: Taro Yamada <taro@example.com>
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                    ④

Date:   Mon Jan 27 15:00:00 2026 +0900
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                    ⑤

    hello.txtを更新
    ^^^^^^^^^^^^^^^
          ⑥
```

| 番号 | 項目 | 説明 |
|------|------|------|
| ① | `commit` | コミットを示すラベル |
| ② | ハッシュ値 | コミットの一意な識別子（40文字） |
| ③ | 参照 | このコミットを指すブランチやタグ |
| ④ | Author | コミットした人の名前とメール |
| ⑤ | Date | コミット日時 |
| ⑥ | メッセージ | コミットメッセージ |

---

## HEADとは

`HEAD` は「今自分がいる場所」を示すポインタです。

```
      HEAD
        ↓
commit3 ← 今ここ
commit2
commit1
```

- `HEAD -> main`: mainブランチの先頭にいる
- `origin/main`: リモートのmainブランチの位置

---

## コミットハッシュ

### 40文字のハッシュ

```
def5678901234567890abcdef1234567890abcdef
```

- すべてのコミットに割り当てられる一意なID
- SHA-1というアルゴリズムで生成
- 同じ内容でも別々にコミットすると違うハッシュになる

### 短縮形

最初の7文字だけでも指定できます：

```
def5678
```

---

## ログの終了方法

`git log` の出力が長い場合、ページャ（通常は `less`）で表示されます。

### 操作方法

| キー | 動作 |
|------|------|
| `j` または `↓` | 1行下に移動 |
| `k` または `↑` | 1行上に移動 |
| `スペース` または `f` | 1画面下に移動 |
| `b` | 1画面上に移動 |
| `g` | 先頭に移動 |
| `G` | 末尾に移動 |
| `/検索語` | 検索 |
| `q` | 終了 |

> **重要**: `q` を押すとログ表示を終了できます！

---

## コミット数を制限する

### 最新N件を表示

```bash
git log -n 3
```

または

```bash
git log -3
```

最新の3件だけ表示されます。

### 出力例

```
commit def5678... (HEAD -> main)
    hello.txtを更新

commit bcd4567...
    2回目の変更を追加

commit abc1234...
    最初のファイルを追加
```

---

## 1行で表示する

### --onelineオプション

```bash
git log --oneline
```

出力：
```
def5678 (HEAD -> main, origin/main) hello.txtを更新
bcd4567 2回目の変更を追加
abc1234 最初のファイルを追加
```

各コミットが1行にまとまって見やすくなります。

### 組み合わせ

```bash
git log --oneline -5
```

最新5件を1行ずつ表示。

---

## 日時で絞り込む

### 特定の日以降

```bash
git log --since="2026-01-01"
```

### 特定の日以前

```bash
git log --until="2026-01-31"
```

### 期間指定

```bash
git log --since="2 weeks ago"
git log --since="yesterday"
git log --since="3 days ago"
```

---

## 作成者で絞り込む

### 特定の人のコミット

```bash
git log --author="Taro"
```

名前の一部でも検索できます。

### 複数人で絞り込み

```bash
git log --author="Taro\|Hanako"
```

---

## 統計情報を表示

### --statオプション

```bash
git log --stat
```

出力：
```
commit def5678...
Author: Taro Yamada <taro@example.com>
Date:   Mon Jan 27 15:00:00 2026 +0900

    hello.txtを更新

 hello.txt | 1 +
 1 file changed, 1 insertion(+)
```

どのファイルが何行変更されたかがわかります。

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. リポジトリに移動
cd ~/my-first-git

# 2. 基本のログ
git log

# 3. qで終了

# 4. 1行表示
git log --oneline

# 5. 最新3件
git log -3

# 6. 統計情報付き
git log --stat -3

# 7. 作成者で絞り込み
git log --author="$(git config user.name)" --oneline
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `git log` | 履歴を表示 |
| `git log --oneline` | 1行ずつ表示 |
| `git log -n 数字` | 最新N件を表示 |
| `git log --stat` | 統計情報を表示 |
| `git log --since="日付"` | 日付以降を表示 |
| `git log --author="名前"` | 特定の人のコミット |

### ログ表示の終了

`q` キーで終了！

### チェックリスト

- [ ] `git log` で履歴を表示できた
- [ ] `q` でログを終了できた
- [ ] `--oneline` で1行表示できた

---

## 次のステップへ

git logの基本はマスターできましたか？

次のセクションでは、さらに便利なオプションを学びます。
グラフ表示や、特定のファイルの履歴など、実践的なテクニックを覚えましょう！

---

*推定読了時間: 30分*
