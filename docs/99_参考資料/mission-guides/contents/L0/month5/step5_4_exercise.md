# 演習：レイアウトを整えよう

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 5
subStep: 4
title: "演習：レイアウトを整えよう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 先輩「displayプロパティ、Flexbox、レスポンシブデザイン。レイアウトの三種の神器が揃ったね」
>
> これで自己紹介ページのレイアウトも整えられますね！
>
> 先輩「そう。ヘッダーのナビを横並びにして、カード風のデザインにして、スマホでも見やすくしよう」

---

## ミッション

自己紹介サイトのCSSを更新して、以下のレイアウト要件を実現してください。

---

## 要件

### 必須要件

| 要件 | 使う技術 |
|------|----------|
| ヘッダーのロゴとナビを横並び | Flexbox（`space-between`） |
| ナビゲーションリンクを横並び | Flexbox + gap |
| コンテンツを中央配置 | `max-width` + `margin: 0 auto` |
| スマホで縦並びに切り替え | メディアクエリ |
| 画像がはみ出さない | `max-width: 100%` |
| viewport メタタグ | 全ページに追加 |

### レイアウトイメージ

#### パソコン表示（768px以上）

```
┌─────────────────────────────────────────┐
│ [ロゴ]                    [ホーム][紹介][問合せ] │  ← Flexbox横並び
├─────────────────────────────────────────┤
│                                         │
│    ┌─────────────────────────────┐      │
│    │  セクション1                 │      │  ← 中央配置
│    └─────────────────────────────┘      │
│    ┌─────────────────────────────┐      │
│    │  セクション2                 │      │
│    └─────────────────────────────┘      │
│                                         │
├─────────────────────────────────────────┤
│             (c) 2025 山田太郎             │  ← フッター
└─────────────────────────────────────────┘
```

#### スマホ表示（767px以下）

```
┌──────────────────┐
│     [ロゴ]        │
│  [ホーム]          │  ← 縦並び
│  [紹介]           │
│  [問合せ]         │
├──────────────────┤
│ ┌──────────────┐ │
│ │ セクション1    │ │  ← 全幅
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ セクション2    │ │
│ └──────────────┘ │
├──────────────────┤
│  (c) 2025 山田   │
└──────────────────┘
```

---

## ヒント

### HTMLに追加するもの

全ページの `<head>` に以下を追加してください。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### CSSのレイアウト部分

```css
/* ヘッダーのFlexbox */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* ... 他のスタイル */
}

/* ナビのFlexbox */
nav {
  display: flex;
  gap: 20px;
}

/* メインの中央配置 */
main {
  max-width: 800px;
  margin: 30px auto;
  padding: 0 20px;
}

/* スマホ対応 */
@media (max-width: 767px) {
  header {
    flex-direction: column;
    text-align: center;
  }

  nav {
    flex-direction: column;
    gap: 8px;
  }

  main {
    margin: 15px auto;
    padding: 0 15px;
  }
}
```

---

## チャレンジ（余裕がある人向け）

- [ ] スキルカードを横並びに配置（Flexbox + flex-wrap）
- [ ] ヘッダーに `position: sticky` を付けてスクロール時に固定
- [ ] ホバー時にカードに影が付くアニメーション（`transition` + `box-shadow`）
- [ ] フッターをページ下部に固定する（Flexboxでページ全体をレイアウト）
- [ ] ブレイクポイントを2つ作る（スマホ/タブレット/PC）

---

## 解答例

<details><summary>解答</summary>

```css
/* ===== リセット ===== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ===== ページ全体 ===== */
body {
  font-family: "Helvetica Neue", Arial, "Hiragino Sans", sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== ヘッダー ===== */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  padding: 15px 30px;
}

header h1 {
  font-size: 24px;
}

/* ===== ナビゲーション ===== */
nav {
  display: flex;
  gap: 20px;
}

nav a {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: #34495e;
}

/* ===== メインコンテンツ ===== */
main {
  max-width: 800px;
  margin: 30px auto;
  padding: 0 20px;
  flex: 1;
  width: 100%;
}

/* ===== セクション ===== */
section {
  background-color: white;
  padding: 25px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

section h2 {
  color: #2c3e50;
  font-size: 22px;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 2px solid #3498db;
}

/* ===== テーブル ===== */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 15px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px 15px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  color: #2c3e50;
}

/* ===== リスト ===== */
ul, ol {
  padding-left: 25px;
  margin: 10px 0;
}

li {
  margin-bottom: 5px;
}

/* ===== リンク ===== */
main a {
  color: #3498db;
  text-decoration: none;
}

main a:hover {
  text-decoration: underline;
}

/* ===== 画像 ===== */
img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

figure {
  text-align: center;
  margin: 20px 0;
}

figcaption {
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 8px;
}

/* ===== フォーム ===== */
label {
  font-weight: bold;
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}

button[type="submit"] {
  background-color: #3498db;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
}

button[type="submit"]:hover {
  background-color: #2980b9;
}

/* ===== フッター ===== */
footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  text-align: center;
  padding: 15px;
  font-size: 14px;
}

/* ===== レスポンシブ: スマホ ===== */
@media (max-width: 767px) {
  header {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }

  header h1 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  nav {
    flex-direction: column;
    gap: 8px;
  }

  main {
    margin: 15px auto;
    padding: 0 15px;
  }

  section {
    padding: 15px;
  }

  section h2 {
    font-size: 18px;
  }

  /* テーブルのスクロール対応 */
  table {
    display: block;
    overflow-x: auto;
  }
}
```

</details>

---

## 確認ポイント

| 確認項目 | チェック方法 |
|----------|-------------|
| viewportメタタグがある | HTMLソースを確認 |
| ヘッダーが横並び（PC） | ブラウザ幅を広げて確認 |
| ヘッダーが縦並び（スマホ） | ブラウザ幅を狭めて確認 |
| ナビリンクが横並び（PC） | ブラウザ幅を広げて確認 |
| コンテンツが中央配置 | 広い画面で余白を確認 |
| 画像がはみ出さない | スマホ幅で確認 |
| 全体的に余白が適切 | padding, marginの効果 |

> 先輩「開発者ツールのデバイスツールバーで、いろんな画面サイズを試してみよう」

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Flexboxレイアウト | ヘッダー、ナビに適用 |
| 中央配置 | max-width + margin: 0 auto |
| レスポンシブ | メディアクエリで切り替え |
| モバイルファースト | スマホ→PCの順でスタイル |
| 画像対応 | max-width: 100% |

### チェックリスト
- [ ] viewportメタタグを全ページに追加した
- [ ] ヘッダーにFlexboxレイアウトを適用した
- [ ] コンテンツを中央配置した
- [ ] メディアクエリでスマホ対応した
- [ ] 開発者ツールで複数の画面サイズを確認した

---

## 次のステップへ

レイアウトが整い、レスポンシブ対応もできました。次のStep 6は最終ステップです。すべての知識を結集して、自己紹介サイトを完成させましょう。

---

*推定読了時間: 90分*
