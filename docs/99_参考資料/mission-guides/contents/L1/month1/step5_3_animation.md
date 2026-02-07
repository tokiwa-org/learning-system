# CSSアニメーションを使おう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 5
subStep: 3
title: "CSSアニメーションを使おう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> デザイナーから上がってきたモックアップには、ボタンのホバーエフェクトや
> フェードインアニメーションが施されていた。
>
> 「これ、JavaScript で実装するんですか？」
>
> 佐藤先輩が首を振る。
>
> 「こういう基本的なアニメーションは全部CSSでできる。
> JavaScriptよりパフォーマンスも良い。transition、transform、@keyframes の
> 3つを覚えれば、大抵のアニメーションは実現できる」

---

## transition -- 状態変化のアニメーション

`transition` は、CSSプロパティの値が変わった時に滑らかに遷移させます。

### 基本構文

```css
/* transition: プロパティ 時間 イージング 遅延; */
.button {
    background-color: #3498db;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: #2980b9;
}
```

### 複数プロパティのトランジション

```css
.card {
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transform: translateY(0);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.card:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    transform: translateY(-4px);
}
```

### 全プロパティにトランジション

```css
.element {
    transition: all 0.3s ease;
    /* 注意: パフォーマンスが低下する可能性あり。具体的なプロパティ指定推奨 */
}
```

### イージング関数

| 値 | 動き |
|-----|------|
| `ease` | ゆっくり始まり、速くなり、ゆっくり終わる（デフォルト） |
| `linear` | 一定速度 |
| `ease-in` | ゆっくり始まる |
| `ease-out` | ゆっくり終わる |
| `ease-in-out` | ゆっくり始まり、ゆっくり終わる |
| `cubic-bezier()` | カスタムカーブ |

---

## transform -- 要素の変形

`transform` は要素の移動、回転、拡大/縮小、傾斜を行います。

### 移動（translate）

```css
.element {
    transform: translateX(50px);    /* 右に50px */
    transform: translateY(-20px);   /* 上に20px */
    transform: translate(50px, -20px); /* X, Y 同時 */
}
```

### 回転（rotate）

```css
.element {
    transform: rotate(45deg);     /* 時計回りに45度 */
    transform: rotate(-90deg);    /* 反時計回りに90度 */
}
```

### 拡大/縮小（scale）

```css
.element {
    transform: scale(1.5);        /* 1.5倍に拡大 */
    transform: scale(0.5);        /* 0.5倍に縮小 */
    transform: scaleX(2);         /* 横方向だけ2倍 */
}
```

### 傾斜（skew）

```css
.element {
    transform: skewX(10deg);      /* X方向に傾斜 */
    transform: skew(10deg, 5deg); /* X, Y 同時 */
}
```

### 複数の変形を組み合わせ

```css
.element {
    transform: translateX(50px) rotate(45deg) scale(1.2);
}
```

### 実践例: ホバーエフェクト

```css
.image-card {
    overflow: hidden;
    border-radius: 8px;
}

.image-card img {
    width: 100%;
    transition: transform 0.5s ease;
}

.image-card:hover img {
    transform: scale(1.1);
}
```

---

## @keyframes -- 複雑なアニメーション

`@keyframes` は、開始から終了までのアニメーションの段階を定義します。

### 基本構文

```css
/* アニメーションの定義 */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* アニメーションの適用 */
.element {
    animation: fadeIn 1s ease forwards;
}
```

### 複数のステップ

```css
@keyframes slideInBounce {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    60% {
        transform: translateX(10%);
        opacity: 1;
    }
    80% {
        transform: translateX(-5%);
    }
    100% {
        transform: translateX(0);
    }
}

.element {
    animation: slideInBounce 0.8s ease-out;
}
```

### animation プロパティ

```css
/* animation: 名前 時間 イージング 遅延 回数 方向 fill-mode; */
.element {
    animation-name: fadeIn;
    animation-duration: 1s;
    animation-timing-function: ease;
    animation-delay: 0.5s;
    animation-iteration-count: 1;       /* infinite で無限 */
    animation-direction: normal;         /* alternate で往復 */
    animation-fill-mode: forwards;       /* 終了状態を維持 */

    /* ショートハンド */
    animation: fadeIn 1s ease 0.5s 1 normal forwards;
}
```

| プロパティ | 値 | 説明 |
|-----------|-----|------|
| iteration-count | `1`, `3`, `infinite` | 繰り返し回数 |
| direction | `normal`, `reverse`, `alternate` | 再生方向 |
| fill-mode | `none`, `forwards`, `backwards`, `both` | 開始前・終了後の状態 |

---

## 実践パターン集

### パターン1: フェードインアップ（スクロール表示に最適）

```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fadeInUp 0.6s ease forwards;
}
```

### パターン2: ローディングスピナー

```css
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e0e0e0;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
```

### パターン3: パルスエフェクト

```css
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.notification-badge {
    animation: pulse 2s ease-in-out infinite;
}
```

### パターン4: ボタンのリップルエフェクト

```css
.button {
    position: relative;
    overflow: hidden;
}

.button::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
}

.button:active::after {
    width: 300px;
    height: 300px;
}
```

---

## パフォーマンスの注意点

### アニメーション可能なプロパティ

| パフォーマンス | プロパティ | 理由 |
|--------------|-----------|------|
| 高い（推奨） | `transform`, `opacity` | GPU で処理（合成のみ） |
| 中程度 | `color`, `background-color` | 再描画が必要 |
| 低い（避ける） | `width`, `height`, `margin` | レイアウト再計算が必要 |

> **推奨**: アニメーションには `transform` と `opacity` を優先的に使いましょう。

```css
/* 良い例: transform を使う */
.element:hover {
    transform: translateX(10px);
}

/* 避けるべき例: margin を使う */
.element:hover {
    margin-left: 10px;  /* レイアウト再計算が発生 */
}
```

### will-change（パフォーマンスヒント）

```css
.animated-element {
    will-change: transform, opacity;
    /* ブラウザに「このプロパティが変わる」と事前通知 */
}
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| transition | 状態変化を滑らかにアニメーション |
| transform | 移動、回転、拡大/縮小、傾斜 |
| @keyframes | 複数ステップの複雑なアニメーション |
| パフォーマンス | transform と opacity を優先的に使う |

### チェックリスト

- [ ] transition でホバーエフェクトを作れる
- [ ] transform で要素を移動・回転・拡大できる
- [ ] @keyframes でカスタムアニメーションを定義できる
- [ ] パフォーマンスを意識したプロパティ選択ができる

---

## 次のステップへ

CSSアニメーションを学びました。

次のセクションでは、Sass/SCSS を学びます。
変数、ネスト、ミックスイン -- CSSの生産性を劇的に向上させるプリプロセッサです。

---

*推定読了時間: 30分*
