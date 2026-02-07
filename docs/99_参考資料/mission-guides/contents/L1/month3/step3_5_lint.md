# ESLint/Prettierで品質を守ろう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 3
subStep: 5
title: "ESLint/Prettierで品質を守ろう"
itemType: LESSON
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "メイン開発言語"
  category: "プログラミング"
  target_level: "L1"
```

---

## ストーリー

> 「コードスタイルの議論ほど無駄な時間はない」
>
> 田中先輩はニヤリとした。
>
> 「セミコロンをつけるか、インデントはスペースかタブか...
> そういう議論は**ツールに任せる**。ESLintとPrettierを設定すれば、
> チーム全員のコードが自動的に統一される。人間は本質的な議論に集中しよう」

---

## ESLint: コードの品質チェック

ESLintは「問題のあるコード」を検出するツールです。

### セットアップ

```bash
# ESLint + TypeScript対応をインストール
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 設定ファイルを初期化
npx eslint --init
```

### eslint.config.js（Flat Config）

```javascript
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // any の使用を禁止
      "@typescript-eslint/no-explicit-any": "error",
      // 未使用の変数を警告
      "@typescript-eslint/no-unused-vars": "warn",
      // console.log を警告（本番コードに残さない）
      "no-console": "warn",
      // var の使用を禁止
      "no-var": "error",
      // const を推奨
      "prefer-const": "error",
    },
  },
];
```

### 実行

```bash
# チェック実行
npx eslint src/

# 自動修正
npx eslint src/ --fix
```

### よくあるルール

| ルール | 意味 |
|--------|------|
| `no-explicit-any` | any 型の使用を禁止 |
| `no-unused-vars` | 未使用変数を検出 |
| `no-console` | console.log を検出 |
| `prefer-const` | 再代入しない変数は const を使用 |
| `eqeqeq` | `===` を強制（`==` を禁止） |

---

## Prettier: コードの自動整形

Prettierは「コードの見た目」を統一するツールです。

### セットアップ

```bash
# Prettier をインストール
npm install -D prettier

# ESLint との競合を防ぐ
npm install -D eslint-config-prettier
```

### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

| 設定 | 意味 | 値 |
|------|------|-----|
| semi | セミコロンの有無 | true（あり） |
| trailingComma | 末尾カンマ | "all"（全てにつける） |
| singleQuote | シングルクォート | false（ダブルクォート） |
| printWidth | 1行の最大文字数 | 100 |
| tabWidth | インデント幅 | 2 |

### 実行

```bash
# フォーマット確認（変更なし）
npx prettier --check src/

# 自動フォーマット
npx prettier --write src/
```

---

## package.json のスクリプト設定

```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "check": "npm run lint && npm run format:check"
  }
}
```

```bash
# リント実行
npm run lint

# リント + 自動修正
npm run lint:fix

# フォーマット
npm run format

# CI用: チェックだけ
npm run check
```

---

## pre-commitフック

コミット前に自動的にチェックを実行する仕組みです。

```bash
# husky と lint-staged をインストール
npm install -D husky lint-staged

# husky を初期化
npx husky init
```

### .husky/pre-commit

```bash
npx lint-staged
```

### package.json に lint-staged を追加

```json
{
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

> コミットすると、ステージングされた `.ts` ファイルに対して自動的にESLintとPrettierが実行されます。問題があるとコミットが中止されます。

---

## まとめ

| ツール | 役割 | コマンド |
|--------|------|---------|
| ESLint | コードの品質チェック | `npx eslint src/` |
| Prettier | コードの自動整形 | `npx prettier --write src/` |
| husky | Git hookの管理 | pre-commit で自動実行 |
| lint-staged | ステージファイルだけチェック | コミット時に自動実行 |

### チェックリスト

- [ ] ESLintの設定ファイルを作成できる
- [ ] Prettierの設定ファイルを作成できる
- [ ] npm run lint でコードチェックを実行できる
- [ ] pre-commitフックの目的を理解した

---

## 次のステップへ

コード品質ツールを学びました。

次はStep 3の理解度チェックです。
クリーンコードの知識を確認しましょう。

---

*推定読了時間: 15分*
