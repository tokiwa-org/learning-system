# フォルダを作る・消す

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 2
subStep: 3
title: "フォルダを作る・消す"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "OS基本コマンド"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「ディレクトリ構造もパスもわかった。いよいよ自分でフォルダを作れるんですね！」
>
> 「そう！`mkdir` でフォルダを作って、`rmdir` で消せるよ」
>
> 「GUIでフォルダ作るのと同じことですよね？」
>
> 「同じだけど、ターミナルの方がずっと速いし、複数のフォルダを一気に作れるよ」

---

## mkdir - フォルダを作る

### 基本構文

```bash
mkdir フォルダ名
```

### 例

```bash
mkdir projects
```

`projects` というフォルダが作成されます。

### 確認

```bash
ls
```

---

## 実際にやってみよう

```bash
# ホームに移動
cd ~

# フォルダを作成
mkdir test-folder

# 確認
ls

# 作成したフォルダに移動
cd test-folder

# 現在地を確認
pwd
```

---

## 複数のフォルダを作る

### 同時に複数作成

```bash
mkdir folder1 folder2 folder3
```

3つのフォルダが同時に作成されます。

### 確認

```bash
ls
```

出力：
```
folder1  folder2  folder3
```

---

## 入れ子のフォルダを作る

### 問題: 親フォルダがないとエラー

```bash
mkdir projects/web/html
```

エラー：
```
mkdir: projects/web: No such file or directory
```

親フォルダ `projects` と `web` がないため、エラーになります。

### 解決: -p オプション

```bash
mkdir -p projects/web/html
```

`-p` オプションで、必要な親フォルダも一緒に作成されます。

```
projects/
└── web/
    └── html/
```

---

## rmdir - 空のフォルダを消す

### 基本構文

```bash
rmdir フォルダ名
```

### 例

```bash
rmdir test-folder
```

**注意**: `rmdir` は**空のフォルダ**しか削除できません。

### 中身があるとエラー

```bash
rmdir projects
```

エラー：
```
rmdir: projects: Directory not empty
```

---

## rm -r - 中身ごとフォルダを消す

### 基本構文

```bash
rm -r フォルダ名
```

- `-r` = recursive（再帰的）
- フォルダの中身ごとすべて削除

### 例

```bash
rm -r projects
```

**⚠️ 警告**: 取り消しできません！慎重に使いましょう。

### 確認付きで削除

```bash
rm -ri projects
```

`-i` オプションで、削除前に確認メッセージが表示されます。

```
rm: descend into directory 'projects'? y
rm: remove directory 'projects/web'? y
```

---

## 安全な削除の習慣

### 削除前に中身を確認

```bash
ls フォルダ名
```

### -i オプションをつける

```bash
rm -ri フォルダ名
```

### ゴミ箱に移動（Mac）

```bash
mv フォルダ名 ~/.Trash/
```

---

## フォルダ名のルール

### 推奨

| 良い例 | 理由 |
|--------|------|
| `my-project` | ハイフン区切り |
| `my_project` | アンダースコア区切り |
| `project2024` | 数字を含む |

### 避けるべき

| 悪い例 | 理由 |
|--------|------|
| `my project` | スペースが入っている |
| `日本語フォルダ` | 日本語は問題が起きやすい |
| `project/new` | スラッシュはパス区切り |

### スペースを含む名前を作る場合

```bash
mkdir "My Project"
```

引用符で囲む必要があります。

---

## 実践: プロジェクト構造を作る

Webプロジェクトの一般的な構造を作ってみましょう。

```bash
# ホームに移動
cd ~

# プロジェクトフォルダを作成
mkdir -p my-website/css
mkdir -p my-website/js
mkdir -p my-website/images

# 確認
ls my-website
```

出力：
```
css  images  js
```

または一行で：

```bash
mkdir -p my-website/{css,js,images}
```

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. ホームに移動
cd ~

# 2. 練習用フォルダを作成
mkdir practice

# 3. 中に移動
cd practice

# 4. 複数のフォルダを作成
mkdir folder1 folder2 folder3

# 5. 確認
ls

# 6. 入れ子のフォルダを作成
mkdir -p deep/nested/folder

# 7. ツリー構造を確認（tree コマンドがある場合）
# tree .
# または
ls -R

# 8. 空のフォルダを削除
rmdir folder1

# 9. 確認
ls

# 10. 中身があるフォルダを削除
rm -r deep

# 11. 確認
ls

# 12. 練習用フォルダを削除
cd ..
rm -r practice
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `mkdir フォルダ名` | フォルダを作成 |
| `mkdir -p パス` | 親フォルダも一緒に作成 |
| `mkdir a b c` | 複数フォルダを同時作成 |
| `rmdir フォルダ名` | 空のフォルダを削除 |
| `rm -r フォルダ名` | フォルダを中身ごと削除 |
| `rm -ri フォルダ名` | 確認しながら削除 |

### 注意点

- `rm -r` は取り消しできない
- 削除前に `ls` で中身を確認
- 迷ったら `-i` オプションをつける

### チェックリスト

- [ ] `mkdir` でフォルダを作成できた
- [ ] `mkdir -p` で入れ子フォルダを作成できた
- [ ] `rmdir` で空フォルダを削除できた
- [ ] `rm -r` でフォルダを削除できた

---

## 次のステップへ

フォルダの作成・削除はマスターできましたか？

次のセクションでは、**ファイル**を作ったり消したりする方法を学びます。
フォルダの次はファイルです！

---

*推定読了時間: 30分*
