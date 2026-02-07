# 演習：モダンWebサイトを構築しよう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 5
subStep: 5
title: "演習：モダンWebサイトを構築しよう"
itemType: EXERCISE
estimatedMinutes: 120
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「ここまでの知識を全て使って、1つのサイトを完成させよう」
>
> 佐藤先輩がワイヤーフレームを見せた。
>
> 「ポートフォリオサイトだ。CSS Grid でレイアウト、アニメーションで演出、
> Sass で効率的に管理する。実務と同じ流れで作ってみろ」
>
> 「やります！」

---

## ミッション概要

レスポンシブなポートフォリオサイトを構築します。

### 完成イメージ

```
+------------------------------------------+
|              ヘッダー（ナビ）              |
+------------------------------------------+
|                                          |
|         ヒーローセクション                |
|         (大きなタイトル + CTA)            |
|                                          |
+------------------------------------------+
|   カード1   |   カード2   |   カード3    |
|   (作品1)   |   (作品2)   |   (作品3)    |
+-------------+-------------+--------------+
|   カード4   |   カード5   |   カード6    |
+-------------+-------------+--------------+
|                                          |
|         スキルセクション                   |
|         (プログレスバー)                   |
|                                          |
+------------------------------------------+
|              フッター                     |
+------------------------------------------+
```

---

## Part 1: プロジェクトのセットアップ（15分）

### タスク 1-1: ディレクトリ構造の作成

```bash
mkdir -p portfolio/{scss/{abstracts,components,layout},css,images,js}
cd portfolio
```

目標の構造：

```
portfolio/
├── index.html
├── scss/
│   ├── abstracts/
│   │   ├── _variables.scss
│   │   └── _mixins.scss
│   ├── components/
│   │   ├── _buttons.scss
│   │   ├── _cards.scss
│   │   └── _hero.scss
│   ├── layout/
│   │   ├── _header.scss
│   │   ├── _grid.scss
│   │   └── _footer.scss
│   └── main.scss
├── css/
│   └── style.css (コンパイル後)
├── images/
└── js/
    └── main.js
```

### タスク 1-2: 変数とミックスインの定義

`scss/abstracts/_variables.scss` を作成してください。

<details>
<summary>解答</summary>

```scss
// _variables.scss

// Colors
$primary-color: #2563eb;
$secondary-color: #10b981;
$accent-color: #f59e0b;
$dark-color: #1e293b;
$light-color: #f8fafc;
$text-color: #334155;
$text-light: #94a3b8;
$white: #ffffff;

// Typography
$font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
$font-size-base: 16px;
$font-size-sm: 14px;
$font-size-lg: 20px;
$font-size-xl: 24px;
$font-size-2xl: 32px;
$font-size-3xl: 48px;

// Spacing
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;
$spacing-3xl: 64px;

// Layout
$max-width: 1200px;
$border-radius: 8px;
$border-radius-lg: 16px;

// Shadows
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

// Transitions
$transition-fast: 0.2s ease;
$transition-normal: 0.3s ease;
$transition-slow: 0.5s ease;
```

</details>

`scss/abstracts/_mixins.scss` を作成してください。

<details>
<summary>解答</summary>

```scss
// _mixins.scss
@use 'variables' as *;

@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

@mixin responsive($breakpoint) {
    @if $breakpoint == mobile {
        @media (max-width: 640px) { @content; }
    } @else if $breakpoint == tablet {
        @media (max-width: 1024px) { @content; }
    } @else if $breakpoint == desktop {
        @media (min-width: 1025px) { @content; }
    }
}

@mixin section-padding {
    padding: $spacing-3xl $spacing-lg;

    @include responsive(mobile) {
        padding: $spacing-2xl $spacing-md;
    }
}

@mixin container {
    max-width: $max-width;
    margin: 0 auto;
    padding: 0 $spacing-lg;
}

@mixin button-style($bg-color, $text-color: $white) {
    display: inline-block;
    background-color: $bg-color;
    color: $text-color;
    border: none;
    padding: $spacing-sm $spacing-xl;
    border-radius: $border-radius;
    font-size: $font-size-base;
    cursor: pointer;
    text-decoration: none;
    transition: all $transition-normal;

    &:hover {
        background-color: darken($bg-color, 10%);
        transform: translateY(-2px);
        box-shadow: $shadow-md;
    }
}
```

</details>

---

## Part 2: HTMLの作成（20分）

### タスク 2-1: index.html を作成してください

<details>
<summary>解答</summary>

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- ヘッダー -->
    <header class="header">
        <div class="header__container">
            <a href="#" class="header__logo">Portfolio</a>
            <nav class="header__nav">
                <a href="#works" class="header__link">Works</a>
                <a href="#skills" class="header__link">Skills</a>
                <a href="#contact" class="header__link">Contact</a>
            </nav>
        </div>
    </header>

    <!-- ヒーローセクション -->
    <section class="hero">
        <div class="hero__content">
            <h1 class="hero__title">Hello, I'm a<br>Web Developer</h1>
            <p class="hero__subtitle">モダンなWebサイトを構築します</p>
            <a href="#works" class="btn btn--primary">Works を見る</a>
        </div>
    </section>

    <!-- 作品セクション -->
    <section id="works" class="works">
        <div class="works__container">
            <h2 class="section-title">Works</h2>
            <div class="card-grid">
                <div class="card">
                    <div class="card__image" style="background-color: #3b82f6;"></div>
                    <div class="card__body">
                        <h3 class="card__title">ECサイト</h3>
                        <p class="card__text">レスポンシブなECサイトのフロントエンド開発</p>
                        <span class="card__tag">HTML/CSS</span>
                        <span class="card__tag">JavaScript</span>
                    </div>
                </div>
                <div class="card">
                    <div class="card__image" style="background-color: #10b981;"></div>
                    <div class="card__body">
                        <h3 class="card__title">ダッシュボード</h3>
                        <p class="card__text">管理画面のUI/UXデザインと実装</p>
                        <span class="card__tag">React</span>
                        <span class="card__tag">CSS Grid</span>
                    </div>
                </div>
                <div class="card">
                    <div class="card__image" style="background-color: #f59e0b;"></div>
                    <div class="card__body">
                        <h3 class="card__title">ポートフォリオ</h3>
                        <p class="card__text">アニメーション豊富なポートフォリオサイト</p>
                        <span class="card__tag">Sass</span>
                        <span class="card__tag">Animation</span>
                    </div>
                </div>
                <div class="card">
                    <div class="card__image" style="background-color: #ef4444;"></div>
                    <div class="card__body">
                        <h3 class="card__title">ブログ</h3>
                        <p class="card__text">技術ブログのデザインと実装</p>
                        <span class="card__tag">Next.js</span>
                        <span class="card__tag">Tailwind</span>
                    </div>
                </div>
                <div class="card">
                    <div class="card__image" style="background-color: #8b5cf6;"></div>
                    <div class="card__body">
                        <h3 class="card__title">チャットアプリ</h3>
                        <p class="card__text">リアルタイムチャットのフロントエンド</p>
                        <span class="card__tag">WebSocket</span>
                        <span class="card__tag">Vue.js</span>
                    </div>
                </div>
                <div class="card">
                    <div class="card__image" style="background-color: #ec4899;"></div>
                    <div class="card__body">
                        <h3 class="card__title">LP制作</h3>
                        <p class="card__text">コンバージョン最適化されたLP</p>
                        <span class="card__tag">HTML/CSS</span>
                        <span class="card__tag">jQuery</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- スキルセクション -->
    <section id="skills" class="skills">
        <div class="skills__container">
            <h2 class="section-title">Skills</h2>
            <div class="skill-grid">
                <div class="skill">
                    <div class="skill__header">
                        <span class="skill__name">HTML/CSS</span>
                        <span class="skill__percent">90%</span>
                    </div>
                    <div class="skill__bar">
                        <div class="skill__fill" style="width: 90%;"></div>
                    </div>
                </div>
                <div class="skill">
                    <div class="skill__header">
                        <span class="skill__name">JavaScript</span>
                        <span class="skill__percent">80%</span>
                    </div>
                    <div class="skill__bar">
                        <div class="skill__fill" style="width: 80%;"></div>
                    </div>
                </div>
                <div class="skill">
                    <div class="skill__header">
                        <span class="skill__name">Git</span>
                        <span class="skill__percent">85%</span>
                    </div>
                    <div class="skill__bar">
                        <div class="skill__fill" style="width: 85%;"></div>
                    </div>
                </div>
                <div class="skill">
                    <div class="skill__header">
                        <span class="skill__name">Sass/SCSS</span>
                        <span class="skill__percent">75%</span>
                    </div>
                    <div class="skill__bar">
                        <div class="skill__fill" style="width: 75%;"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- フッター -->
    <footer id="contact" class="footer">
        <div class="footer__container">
            <p class="footer__text">Get in touch: hello@example.com</p>
            <p class="footer__copyright">2025 Portfolio. All rights reserved.</p>
        </div>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>
```

</details>

---

## Part 3: SCSSコンポーネントの作成（45分）

### タスク 3-1: レイアウトファイルを作成

`scss/layout/_header.scss`, `scss/layout/_grid.scss`, `scss/layout/_footer.scss` を作成してください。

<details>
<summary>解答: _header.scss</summary>

```scss
@use '../abstracts/variables' as *;
@use '../abstracts/mixins' as *;

.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba($white, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: $shadow-sm;
    z-index: 1000;

    &__container {
        @include container;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 64px;
    }

    &__logo {
        font-size: $font-size-xl;
        font-weight: 700;
        color: $dark-color;
        text-decoration: none;
    }

    &__nav {
        display: flex;
        gap: $spacing-lg;

        @include responsive(mobile) {
            gap: $spacing-md;
        }
    }

    &__link {
        color: $text-color;
        text-decoration: none;
        font-weight: 500;
        transition: color $transition-fast;

        &:hover {
            color: $primary-color;
        }
    }
}
```

</details>

<details>
<summary>解答: _grid.scss</summary>

```scss
@use '../abstracts/variables' as *;
@use '../abstracts/mixins' as *;

.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: $spacing-xl;

    @include responsive(mobile) {
        grid-template-columns: 1fr;
        gap: $spacing-lg;
    }
}

.skill-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-xl;

    @include responsive(mobile) {
        grid-template-columns: 1fr;
    }
}

.section-title {
    font-size: $font-size-2xl;
    color: $dark-color;
    text-align: center;
    margin-bottom: $spacing-2xl;
}
```

</details>

<details>
<summary>解答: _footer.scss</summary>

```scss
@use '../abstracts/variables' as *;
@use '../abstracts/mixins' as *;

.footer {
    background: $dark-color;
    color: $white;
    padding: $spacing-2xl $spacing-lg;
    text-align: center;

    &__container {
        @include container;
    }

    &__text {
        font-size: $font-size-lg;
        margin-bottom: $spacing-sm;
    }

    &__copyright {
        color: $text-light;
        font-size: $font-size-sm;
    }
}
```

</details>

### タスク 3-2: コンポーネントファイルを作成

`scss/components/_hero.scss`, `scss/components/_cards.scss`, `scss/components/_buttons.scss` を作成してください。

<details>
<summary>解答: _hero.scss</summary>

```scss
@use '../abstracts/variables' as *;
@use '../abstracts/mixins' as *;

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

.hero {
    @include flex-center;
    min-height: 100vh;
    background: linear-gradient(135deg, $dark-color 0%, lighten($dark-color, 15%) 100%);
    color: $white;
    padding-top: 64px;

    &__content {
        text-align: center;
        animation: fadeInUp 1s ease forwards;
    }

    &__title {
        font-size: $font-size-3xl;
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: $spacing-lg;

        @include responsive(mobile) {
            font-size: $font-size-2xl;
        }
    }

    &__subtitle {
        font-size: $font-size-lg;
        color: $text-light;
        margin-bottom: $spacing-2xl;
    }
}
```

</details>

<details>
<summary>解答: _cards.scss</summary>

```scss
@use '../abstracts/variables' as *;
@use '../abstracts/mixins' as *;

.card {
    background: $white;
    border-radius: $border-radius-lg;
    overflow: hidden;
    box-shadow: $shadow-md;
    transition: transform $transition-normal, box-shadow $transition-normal;

    &:hover {
        transform: translateY(-8px);
        box-shadow: $shadow-xl;
    }

    &__image {
        height: 200px;
        transition: transform $transition-slow;
    }

    &:hover &__image {
        transform: scale(1.05);
    }

    &__body {
        padding: $spacing-lg;
    }

    &__title {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $dark-color;
        margin-bottom: $spacing-sm;
    }

    &__text {
        color: $text-color;
        font-size: $font-size-sm;
        line-height: 1.6;
        margin-bottom: $spacing-md;
    }

    &__tag {
        display: inline-block;
        background: $light-color;
        color: $text-color;
        font-size: 12px;
        padding: $spacing-xs $spacing-sm;
        border-radius: $border-radius;
        margin-right: $spacing-xs;
        margin-bottom: $spacing-xs;
    }
}

.skill {
    &__header {
        display: flex;
        justify-content: space-between;
        margin-bottom: $spacing-sm;
    }

    &__name {
        font-weight: 600;
        color: $dark-color;
    }

    &__percent {
        color: $primary-color;
        font-weight: 600;
    }

    &__bar {
        height: 8px;
        background: $light-color;
        border-radius: 4px;
        overflow: hidden;
    }

    &__fill {
        height: 100%;
        background: linear-gradient(90deg, $primary-color, $secondary-color);
        border-radius: 4px;
        transition: width 1s ease;
    }
}
```

</details>

<details>
<summary>解答: _buttons.scss</summary>

```scss
@use '../abstracts/variables' as *;
@use '../abstracts/mixins' as *;

.btn {
    @include button-style($primary-color);
    font-size: $font-size-base;
    padding: $spacing-md $spacing-2xl;
    border-radius: $border-radius;

    &--primary {
        @include button-style($primary-color);
    }

    &--secondary {
        @include button-style($secondary-color);
    }
}
```

</details>

---

## Part 4: メインSCSSのコンパイル（10分）

### タスク 4-1: main.scss を作成

<details>
<summary>解答</summary>

```scss
// main.scss
@use 'abstracts/variables' as *;

// Reset
*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: $font-family;
    font-size: $font-size-base;
    color: $text-color;
    line-height: 1.6;
}

// Layout
@use 'layout/header';
@use 'layout/grid';
@use 'layout/footer';

// Components
@use 'components/hero';
@use 'components/buttons';
@use 'components/cards';

// Sections
.works {
    padding: $spacing-3xl $spacing-lg;
    background: $light-color;

    &__container {
        max-width: $max-width;
        margin: 0 auto;
    }
}

.skills {
    padding: $spacing-3xl $spacing-lg;

    &__container {
        max-width: 800px;
        margin: 0 auto;
    }
}
```

</details>

### タスク 4-2: コンパイルして確認

```bash
# コンパイル
sass scss/main.scss css/style.css

# 監視モードで開発
sass --watch scss/main.scss:css/style.css
```

---

## Part 5: チャレンジ課題（30分）

以下の追加機能に挑戦してください。

### Challenge 1: スムーズスクロール

ナビゲーションリンクをクリックした時に滑らかにスクロールさせてください。

<details>
<summary>解答</summary>

```css
/* CSSで実現 */
html {
    scroll-behavior: smooth;
}
```

</details>

### Challenge 2: カードのスタッガーアニメーション

カードが順番に表示されるアニメーションを追加してください。

<details>
<summary>解答</summary>

```scss
.card {
    opacity: 0;
    animation: fadeInUp 0.6s ease forwards;

    @for $i from 1 through 6 {
        &:nth-child(#{$i}) {
            animation-delay: #{$i * 0.1}s;
        }
    }
}
```

</details>

### Challenge 3: ダークモード対応

`prefers-color-scheme` メディアクエリでダークモードに対応してください。

<details>
<summary>解答</summary>

```scss
@media (prefers-color-scheme: dark) {
    body {
        background: $dark-color;
        color: $light-color;
    }

    .card {
        background: lighten($dark-color, 10%);
    }

    .works {
        background: darken($dark-color, 5%);
    }

    .header {
        background: rgba($dark-color, 0.95);
    }
}
```

</details>

---

## 達成度チェック

| パート | 内容 | 完了 |
|--------|------|------|
| Part 1 | プロジェクトセットアップ | [ ] |
| Part 2 | HTML作成 | [ ] |
| Part 3 | SCSSコンポーネント | [ ] |
| Part 4 | コンパイルと確認 | [ ] |
| Part 5 | チャレンジ課題 | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| CSS Grid | auto-fit + minmax でレスポンシブカードグリッド |
| アニメーション | fadeInUp、ホバーエフェクト、スタッガー |
| Sass | 変数、ネスト、ミックスイン、パーシャル分割 |
| BEM | Block__Element--Modifier の命名規則 |

### チェックリスト

- [ ] Grid でレスポンシブなカードレイアウトを作れた
- [ ] アニメーションでインタラクティブなUIを実現した
- [ ] Sassで効率的にCSSを管理できた
- [ ] レスポンシブデザインが実装できた

---

## 次のステップへ

お疲れさまでした。モダンなWebサイトを完成させましたね。

次はStep 5の理解度チェックです。

---

*推定所要時間: 120分*
