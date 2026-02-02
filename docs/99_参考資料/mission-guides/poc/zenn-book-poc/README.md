# Zenn Book形式 PoC

Month1 Step1のコンテンツをZenn book形式に変換したPoCです。

## ディレクトリ構成

```
poc/zenn-book-poc/
├── README.md                           # このファイル
├── books/
│   └── terminal-basics/               # Zenn book本体
│       ├── config.yaml                # 本のメタデータ
│       ├── 1.md                       # チャプター1
│       ├── 2.md                       # チャプター2
│       ├── 3.md                       # チャプター3
│       ├── 4.md                       # チャプター4
│       ├── 5.md                       # チャプター5
│       └── 6.md                       # チャプター6（クイズ）
└── (UIコンポーネント → ui/src/components/ZennBookViewer.tsx)
```

## 形式の比較

### 変換前（mission-guides形式）

```
contents/L0/month1/
├── README.md                          # ステップ一覧
├── step1_1_intro.md                   # サブステップ1-1
├── step1_2_terminology.md             # サブステップ1-2
├── step1_3_launch.md                  # サブステップ1-3
├── step1_4_prompt.md                  # サブステップ1-4
├── step1_5_first_commands.md          # サブステップ1-5
└── step1_6_quiz.md                    # サブステップ1-6（クイズ）
```

各ファイルにYAMLフロントマターでメタ情報を含む：

```yaml
mission: "初めてのターミナルを起動しよう"
step: 1
subStep: 1
title: "なぜターミナルを学ぶのか"
itemType: LESSON
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "OS"
  category: "IT基本"
  target_level: "L0"
```

### 変換後（Zenn book形式）

```
books/terminal-basics/
├── config.yaml                        # 本のメタデータ
├── 1.md                               # チャプター1
├── 2.md                               # チャプター2
...
└── 6.md                               # チャプター6
```

**config.yaml:**
```yaml
title: "黒い画面の正体を知ろう"
summary: |
  IT初心者向けのターミナル入門。「黒い画面」の正体を理解し、
  基本的なコマンド操作ができるようになることを目指します。
topics:
  - ターミナル
  - CLI
  - シェル
  - Linux
  - コマンドライン
published: true
price: 0
chapters:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
```

**各チャプターファイル:**
```yaml
---
title: "チャプタータイトル"
free: true
---

# 本文内容...
```

## Zenn記法の特徴

### メッセージボックス

```markdown
:::message
通常のメッセージボックス
:::

:::message alert
警告メッセージボックス
:::
```

### 詳細（アコーディオン）

```markdown
:::details タイトル
折りたたまれる内容
:::
```

### インラインコード・コードブロック

```markdown
`インラインコード`

\`\`\`言語名
コードブロック
\`\`\`
```

## UIコンポーネント

`ui/src/components/ZennBookViewer.tsx` にZenn風のReactコンポーネントを作成しました。

**使用しているshadcn/uiコンポーネント:**
- Button
- Progress
- ScrollArea
- Badge
- Tooltip

**特徴:**
- サイドバーにチャプター一覧
- 読了進捗の表示
- Zenn風のマークダウンレンダリング
  - メッセージボックス（`:::message`）
  - 詳細アコーディオン（`:::details`）
  - コードブロックのシンタックスハイライト風表示
  - テーブル表示
- レスポンシブ対応（モバイル/デスクトップ）
- 前後チャプターナビゲーション

## 使用方法

### Astroページに追加

```tsx
---
import ZennBookViewer from '../components/ZennBookViewer';
---

<ZennBookViewer client:load />
```

### 直接インポート

```tsx
import { ZennBookViewer } from './components/ZennBookViewer';

function App() {
  return <ZennBookViewer />;
}
```

## メリット・デメリット

### Zenn形式のメリット

1. **シンプルな構造**: 番号付きファイル名で順序が明確
2. **標準的なフォーマット**: Zennユーザーに馴染みがある
3. **記法の統一**: `:::message`、`:::details`など独自記法が便利
4. **公開しやすい**: Zennにそのまま公開可能

### Zenn形式のデメリット

1. **メタ情報の制限**: 独自メタ情報（estimatedMinutes等）を含めにくい
2. **階層構造の表現**: Step → SubStep という階層を表現しにくい
3. **学習管理機能との連携**: 進捗管理に必要な情報が不足
4. **クイズの表現**: インタラクティブなクイズは別実装が必要

## 結論

Zenn book形式は**コンテンツの公開・共有**には適していますが、
学習管理システムとの統合を考えると、元のmission-guides形式の方が
メタ情報を柔軟に持てる点で優れています。

**ハイブリッドアプローチの提案:**
- コンテンツ本体: mission-guides形式（メタ情報付き）
- 公開用エクスポート: Zenn形式に自動変換
- UI表示: Zenn風のリーディング体験を提供
