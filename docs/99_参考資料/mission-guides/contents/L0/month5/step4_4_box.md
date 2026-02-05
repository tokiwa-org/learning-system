# ボックスモデルを理解しよう

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 4
subStep: 4
title: "ボックスモデルを理解しよう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 先輩「CSSを使いこなすには、ボックスモデルの理解が欠かせないんだ」
>
> ボックスモデル？
>
> 先輩「HTMLのすべての要素は『箱（ボックス）』として扱われる。その箱の仕組みがボックスモデルだよ」

---

## ボックスモデルとは

HTMLのすべての要素は、目に見えない **箱（ボックス）** で囲まれています。

この箱は4つの層で構成されています。

```
┌─────────────────────── margin（外側の余白）
│ ┌───────────────────── border（枠線）
│ │ ┌─────────────────── padding（内側の余白）
│ │ │ ┌─────────────────┐
│ │ │ │   content        │ ← コンテンツ（テキストや画像）
│ │ │ │                  │
│ │ │ └─────────────────┘
│ │ └─────────────────────
│ └───────────────────────
└─────────────────────────
```

---

## 4つの層

| 層 | 説明 | CSS プロパティ |
|----|------|---------------|
| content | テキストや画像などの内容 | `width`, `height` |
| padding | コンテンツと枠線の間の余白 | `padding` |
| border | 枠線 | `border` |
| margin | 要素の外側の余白 | `margin` |

---

## padding（内側の余白）

コンテンツと枠線の間のスペースです。

```css
.box {
  padding: 20px;              /* 上下左右すべて20px */
  padding: 10px 20px;         /* 上下10px、左右20px */
  padding: 10px 20px 30px 40px; /* 上、右、下、左 */
}
```

### 個別指定

```css
.box {
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 30px;
  padding-left: 40px;
}
```

> 先輩「paddingは『箱の中のクッション』だと思えばいいよ。内容が枠にぴったりくっつかないようにする」

---

## margin（外側の余白）

要素と要素の間のスペースです。

```css
.box {
  margin: 20px;              /* 上下左右すべて20px */
  margin: 10px 20px;         /* 上下10px、左右20px */
  margin: 0 auto;            /* 上下0、左右は自動（中央寄せ） */
}
```

### 個別指定

```css
.box {
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 30px;
  margin-left: 40px;
}
```

### 中央寄せのテクニック

```css
.container {
  width: 800px;
  margin: 0 auto;  /* 左右のmarginを自動にすると中央寄せ */
}
```

---

## border（枠線）

```css
.box {
  border: 1px solid #333;  /* 太さ 種類 色 */
}
```

### 枠線の種類

| 値 | 表示 |
|----|------|
| `solid` | 実線 ────── |
| `dashed` | 破線 - - - - |
| `dotted` | 点線 ...... |
| `none` | なし |

### 個別指定

```css
.box {
  border-bottom: 2px solid #3498db;  /* 下線だけ */
}
```

---

## paddingとmarginの違い

```css
.box {
  background-color: #3498db;
  padding: 20px;   /* 背景色の内側にスペース */
  margin: 20px;    /* 背景色の外側にスペース */
}
```

| プロパティ | 場所 | 背景色の影響 |
|-----------|------|-------------|
| padding | コンテンツの内側 | **背景色が適用される** |
| margin | 要素の外側 | 背景色は適用されない |

---

## box-sizing: border-box

### 問題

通常、`width` は **content だけの幅** です。padding と border を足すと、実際の幅が大きくなります。

```css
.box {
  width: 300px;
  padding: 20px;
  border: 1px solid #333;
  /* 実際の幅: 300 + 20*2 + 1*2 = 342px */
}
```

### 解決策

`box-sizing: border-box` を使うと、`width` に padding と border が **含まれる** ようになります。

```css
.box {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  border: 1px solid #333;
  /* 実際の幅: 300px（padding と border 込み） */
}
```

### 全要素に適用する（推奨）

```css
* {
  box-sizing: border-box;
}
```

> 先輩「`box-sizing: border-box` はほぼ必須。CSSファイルの最初に書いておこう」

---

## 開発者ツールで確認

ブラウザの開発者ツール（F12）でボックスモデルを視覚的に確認できます。

1. 要素を選択
2. Computedタブを開く
3. ボックスモデルの図が表示される

```
    margin
  ┌──────────┐
  │  border   │
  │ ┌──────┐ │
  │ │padding│ │
  │ │┌────┐│ │
  │ ││content│ │
  │ │└────┘│ │
  │ └──────┘ │
  └──────────┘
```

各層の値がピクセル単位で表示されます。

---

## 実践：ボックスモデルを体験しよう

```css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}

.container {
  width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background-color: white;
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
}

.card h2 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ボックスモデル | content + padding + border + margin |
| padding | 内側の余白（背景色あり） |
| margin | 外側の余白（背景色なし） |
| border | 枠線 |
| `box-sizing: border-box` | widthにpadding・borderを含める（推奨） |
| 中央寄せ | `margin: 0 auto` + width指定 |

### チェックリスト
- [ ] ボックスモデルの4つの層を説明できる
- [ ] padding と margin の違いを理解した
- [ ] border の書き方を覚えた
- [ ] `box-sizing: border-box` の効果を理解した
- [ ] 開発者ツールでボックスモデルを確認した

---

## 次のステップへ

ボックスモデルが理解できました。次の演習では、ここまで学んだCSSを使って自己紹介ページをデザインしましょう。

---

*推定読了時間: 30分*
