# Sass/SCSSで効率化しよう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 5
subStep: 4
title: "Sass/SCSSで効率化しよう"
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

> プロジェクトのCSSファイルが1000行を超え始めた。
>
> 「色を変更するだけで、20箇所を手作業で修正しないといけないんです...」
>
> 佐藤先輩がため息をついた。
>
> 「それはSassを使えば解決する。変数で色を一元管理し、
> ネストで構造を分かりやすくし、ミックスインでコードを再利用する。
> 現代のCSS開発でSassを使わない理由はないよ」

---

## Sass/SCSS とは

Sass（Syntactically Awesome Stylesheets）は、CSSを拡張するプリプロセッサです。
SCSSファイル（`.scss`）を書くと、通常のCSS（`.css`）にコンパイルされます。

### Sass と SCSS の違い

| 構文 | 拡張子 | 特徴 |
|------|--------|------|
| SCSS | `.scss` | CSSに近い構文。波括弧とセミコロンを使用（推奨） |
| Sass | `.sass` | インデントベース。波括弧とセミコロンが不要 |

```scss
// SCSS（推奨）
.container {
    width: 100%;
    .header {
        background: #333;
    }
}
```

```sass
// Sass
.container
    width: 100%
    .header
        background: #333
```

> 本カリキュラムでは SCSS 構文を使います。

### インストールと使い方

```bash
# npm でインストール
npm install -g sass

# SCSS → CSS にコンパイル
sass input.scss output.css

# ファイル変更を監視して自動コンパイル
sass --watch src/scss:dist/css
```

---

## 変数（$variable）

CSSのマジックナンバーを変数で一元管理します。

```scss
// 変数の定義
$primary-color: #3498db;
$secondary-color: #2ecc71;
$font-size-base: 16px;
$spacing-unit: 8px;
$border-radius: 4px;
$max-width: 1200px;

// 変数の使用
.button {
    background-color: $primary-color;
    font-size: $font-size-base;
    padding: $spacing-unit * 2;
    border-radius: $border-radius;

    &:hover {
        background-color: darken($primary-color, 10%);
    }
}

.container {
    max-width: $max-width;
    margin: 0 auto;
    padding: 0 $spacing-unit * 2;
}
```

### カラーマップ

```scss
$colors: (
    primary: #3498db,
    secondary: #2ecc71,
    danger: #e74c3c,
    warning: #f39c12,
    dark: #2c3e50,
    light: #ecf0f1,
);

// マップから値を取得
.alert-danger {
    background-color: map-get($colors, danger);
}
```

---

## ネスト（Nesting）

HTML構造に合わせてCSSをネストできます。

```scss
// SCSS
.navbar {
    background: #333;
    padding: 10px 20px;

    .nav-list {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .nav-item {
        margin-right: 20px;

        a {
            color: white;
            text-decoration: none;

            &:hover {
                color: $primary-color;
            }
        }

        &.active a {
            font-weight: bold;
            border-bottom: 2px solid $primary-color;
        }
    }
}
```

### & -- 親セレクタの参照

`&` は親セレクタを参照する特別な記号です。

```scss
.button {
    // &:hover → .button:hover
    &:hover {
        background: darken($primary-color, 10%);
    }

    // &--large → .button--large（BEM記法）
    &--large {
        font-size: 20px;
        padding: 16px 32px;
    }

    // &__icon → .button__icon（BEM記法）
    &__icon {
        margin-right: 8px;
    }
}
```

> **注意**: ネストは3階層までにしましょう。深すぎるネストは可読性を下げます。

---

## ミックスイン（@mixin）

繰り返し使うスタイルのパターンを再利用可能にします。

```scss
// ミックスインの定義
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

@mixin responsive($breakpoint) {
    @if $breakpoint == mobile {
        @media (max-width: 768px) { @content; }
    } @else if $breakpoint == tablet {
        @media (max-width: 1024px) { @content; }
    } @else if $breakpoint == desktop {
        @media (min-width: 1025px) { @content; }
    }
}

// ミックスインの使用
.hero {
    @include flex-center;
    height: 100vh;

    @include responsive(mobile) {
        flex-direction: column;
        height: auto;
        padding: 40px 20px;
    }
}
```

### 引数付きミックスイン

```scss
@mixin button-style($bg-color, $text-color: white) {
    background-color: $bg-color;
    color: $text-color;
    border: none;
    padding: 12px 24px;
    border-radius: $border-radius;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: darken($bg-color, 10%);
    }
}

.btn-primary {
    @include button-style($primary-color);
}

.btn-danger {
    @include button-style(#e74c3c);
}

.btn-outline {
    @include button-style(transparent, $primary-color);
    border: 2px solid $primary-color;
}
```

---

## パーシャルと@use

### パーシャル（分割ファイル）

ファイル名を `_` で始めると、パーシャル（部分ファイル）になります。
パーシャルは直接CSSにコンパイルされず、他のファイルから読み込んで使います。

```
scss/
├── _variables.scss    # 変数
├── _mixins.scss       # ミックスイン
├── _reset.scss        # リセットCSS
├── _header.scss       # ヘッダー
├── _footer.scss       # フッター
├── _grid.scss         # グリッドレイアウト
└── main.scss          # メインファイル（これだけコンパイルされる）
```

### @use（推奨）

```scss
// main.scss
@use 'variables' as vars;
@use 'mixins' as mix;
@use 'reset';
@use 'header';
@use 'footer';
@use 'grid';

body {
    font-family: vars.$font-family;
    color: vars.$text-color;
}

.container {
    @include mix.flex-center;
}
```

> **注意**: `@import` は非推奨です。`@use` を使いましょう。

---

## 便利な関数

Sassには色やサイズを操作する組み込み関数があります。

```scss
$base-color: #3498db;

.element {
    // 色の操作
    color: lighten($base-color, 20%);     // 明るく
    background: darken($base-color, 10%);  // 暗く
    border-color: rgba($base-color, 0.5);  // 透明度

    // 計算
    width: percentage(3 / 12);   // 25%
    font-size: $font-size-base * 1.5;
    margin: math.div($spacing-unit, 2);
}
```

---

## 実践的なプロジェクト構造

```
scss/
├── abstracts/
│   ├── _variables.scss
│   └── _mixins.scss
├── base/
│   ├── _reset.scss
│   └── _typography.scss
├── components/
│   ├── _buttons.scss
│   ├── _cards.scss
│   └── _forms.scss
├── layout/
│   ├── _header.scss
│   ├── _footer.scss
│   └── _grid.scss
├── pages/
│   ├── _home.scss
│   └── _about.scss
└── main.scss
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 変数（$） | 色、サイズ等を一元管理 |
| ネスト | HTML構造に合わせたCSS記述 |
| ミックスイン | 再利用可能なスタイルパターン |
| パーシャル | ファイル分割で管理しやすく |
| @use | パーシャルの読み込み（@importは非推奨） |

### チェックリスト

- [ ] Sass変数で色やサイズを管理できる
- [ ] ネストと & を使ってCSSを構造的に書ける
- [ ] ミックスインで再利用可能なスタイルを定義できる
- [ ] パーシャルでSCSSファイルを分割管理できる
- [ ] @use でパーシャルを読み込める

---

## 次のステップへ

Sass/SCSSの基本を学びました。

次のセクションでは、ここまで学んだ Grid、アニメーション、Sass を総動員して、
モダンなWebサイトを構築する演習に取り組みます。

---

*推定読了時間: 30分*
