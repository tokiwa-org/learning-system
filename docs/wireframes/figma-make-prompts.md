# Figma Make用プロンプト集

人事考課システムの画面デザインをFigma Makeで生成するためのプロンプト集です。

---

## 共通スタイル指定（最初に入力）

```
Design system: Modern SaaS admin panel
Style: Clean, minimal, professional
Frontend: Astro.js + React 19 (Islands Architecture)
UI Components: shadcn/ui (Radix UI + Tailwind)
CSS Framework: Tailwind CSS v4.0

Colors (CSS variables with @theme):
- Primary: #1971c2 (Blue) → --color-primary-500
- Success: #40c057 (Green) → --color-success-500
- Warning: #fab005 (Yellow) → --color-warning-500
- Error: #fa5252 (Red) → --color-error-500
- Background: #f8f9fa (Light gray) → bg-gray-50
- Text: #212529 (Dark gray) → text-gray-900

Font: Inter or Noto Sans JP (font-sans)
Border radius: 8px (rounded-lg)
Shadow: soft, subtle (shadow-sm, shadow-md)
Language: Japanese (日本語)

Tailwind v4.0 features:
- Zero config, auto content detection
- CSS-first configuration with @theme
- High-performance engine (5x faster)
- Native cascade layers support

Tailwind utilities reference:
- Spacing: p-4, m-2, gap-4
- Flex: flex, items-center, justify-between
- Grid: grid, grid-cols-2, grid-cols-3
- Responsive: sm:, md:, lg:, xl:
```

### Tailwind v4.0 テーマ設定

```css
/* app.css - Tailwind v4.0 CSS-first configuration */
@import "tailwindcss";

@theme {
  --color-primary-50: #e7f5ff;
  --color-primary-100: #d0ebff;
  --color-primary-200: #a5d8ff;
  --color-primary-300: #74c0fc;
  --color-primary-400: #4dabf7;
  --color-primary-500: #1971c2;  /* Main */
  --color-primary-600: #1864ab;
  --color-primary-700: #1456a0;
  --color-primary-800: #0d3b66;
  --color-primary-900: #0a2647;

  --color-success-500: #40c057;
  --color-warning-500: #fab005;
  --color-error-500: #fa5252;

  --font-sans: "Inter", "Noto Sans JP", sans-serif;
}
```

### React 19 コンポーネント設計指針

```
Astro Islands + React 19:
- 静的部分: Astro (.astro) - Zero JS
- インタラクティブ部分: React 19 (.tsx) - Islands

Hydration directives:
- client:load    → 即時ロード（重要なUI）
- client:idle    → アイドル時（フォーム、モーダル）
- client:visible → 表示時（チャート、下部コンテンツ）

React 19 features to use:
- Server Components for data fetching
- Actions for form submissions
- use() hook for async data
- Suspense boundaries for loading states

Component structure:
src/
├── components/
│   ├── ui/           # shadcn/ui コンポーネント (React)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── progress.tsx
│   │   └── skeleton.tsx
│   ├── forms/        # フォームコンポーネント (React)
│   │   ├── EvaluationForm.tsx
│   │   └── SearchFilter.tsx
│   └── charts/       # チャートコンポーネント (React)
│       ├── ProgressBar.tsx
│       ├── ScoreChart.tsx
│       └── RankDistribution.tsx
├── layouts/          # レイアウト (Astro)
│   ├── MainLayout.astro
│   └── AdminLayout.astro
└── pages/            # ページ (Astro)
    └── [...routes].astro
```

### shadcn/ui コンポーネント対応表

```
画面要素 → shadcn/ui コンポーネント:

ボタン:
- [ログイン] → <Button>
- [下書き保存] → <Button variant="outline">
- [提出] → <Button variant="default">
- [差戻し] → <Button variant="destructive">

フォーム:
- テキスト入力 → <Input>
- テキストエリア → <Textarea>
- ドロップダウン → <Select>
- ラジオボタン → <RadioGroup>
- チェックボックス → <Checkbox>
- ラベル → <Label>

フィードバック:
- 通知 → <Toast> (Sonner)
- ローディング → <Skeleton>
- プログレス → <Progress>
- バッジ → <Badge>

レイアウト:
- カード → <Card>, <CardHeader>, <CardContent>
- タブ → <Tabs>, <TabsList>, <TabsTrigger>
- テーブル → <Table> + TanStack Table
- モーダル → <Dialog>
- ドロップダウンメニュー → <DropdownMenu>
- アコーディオン → <Accordion>

ナビゲーション:
- サイドバー → <Sidebar> (shadcn/ui sidebar)
- パンくず → <Breadcrumb>
- ページネーション → <Pagination>
```

---

## 社員向け画面

### SC01: ログイン画面

```
Create a login screen in Japanese for a performance evaluation system.

Full page, no sidebar, light gray background.

Centered login card (white, shadow):
- Company logo at top (placeholder)
- Title: "人事考課システム" (large)
- Subtitle: "ログイン"

Form fields:
- メールアドレス (email input with mail icon)
- パスワード (password input with lock icon, show/hide toggle)
- "ログイン状態を保持する" checkbox

- [ログイン] button (full width, primary blue)

- Divider: "または"

- [Cloudflare Access でログイン] button (outline style)

- Footer: "© 2026 トキワテック"

Clean, minimal, centered design
Desktop viewport, 1440px wide
```

---

### SC02: ダッシュボード

```
Create an employee dashboard screen in Japanese for a performance evaluation system.

Header: Blue bar with logo "人事考課システム" on left, notification bell 🔔(3) and user dropdown "田中太郎 ▼" on right.

Sidebar (240px, light gray): Navigation menu with icons
- ダッシュボード (selected, highlighted with blue)
- 自己評価
- 同僚評価
- スキルマップ
- 通知

Main content:
- Page title hidden (dashboard is home)

- Top card (full width, light blue background):
  - "2025年度 評価期間"
  - "2024/10/01 〜 2025/09/30"
  - Status badge: [評価中] (green)

- Two-column layout below:

Left column - "あなたの評価状況" card:
  - Current step: "ステップ: 自己評価"
  - Status: "ステータス: 下書き" (gray badge)
  - Progress bar showing 0%
  - [自己評価を入力する →] link button

Right column - "待機中のタスク" card:
  - List with checkboxes:
    ⬜ 自己評価を提出（期限: 9/10）
    ⬜ 佐藤さんの同僚評価（期限: 9/17）
    ⬜ 鈴木さんの同僚評価（期限: 9/17）

- Bottom section - "最新の通知" card:
  - "9/1 自己評価の入力が開始されました"
  - "8/15 2025年度の評価期間が設定されました"
  - [すべて見る →] link

Desktop viewport, 1440px wide
```

---

### SC03: 自己評価入力

```
Create a self-evaluation input screen in Japanese.

Same header and sidebar, with "自己評価" selected.

Main content:
- Breadcrumb: "← ダッシュボードに戻る"
- Page title: "自己評価入力"
- Subtitle: "2025年度 自己評価"
- Right side: [下書き保存] button (outline) + [提出] button (primary)

- Tab navigation:
  [スキル習得度] [職能発揮力] [行動・貢献]
  (First tab selected)

- Progress indicator: "進捗: 30/46項目入力済み"

- Evaluation items list (card style, vertical):

Card 1:
  - Header: "No.1 ITリテラシー" + [ナレッジを見る] link (right side)
  - Divider
  - "要件: 基本的なPC操作、Office利用ができる"
  - Rating row: "自己評価:" + radio buttons ○1 ○2 ○3 ●4 ○5
  - "エビデンス:" label
  - Textarea: "〇〇研修を修了、日常業務でExcel関数を活用"

Card 2:
  - Header: "No.2 ネットワーク基礎" + [ナレッジを見る]
  - Rating: not selected
  - Textarea: empty

(More cards...)

- Bottom section:
  - "総合コメント:" label
  - Large textarea
  - [下書き保存] [提出] buttons

Desktop viewport, 1440px wide
```

---

### SC04: 同僚評価入力

```
Create a peer evaluation input screen in Japanese.

Same header and sidebar, with "同僚評価" selected.

Main content:
- Breadcrumb: "← 同僚評価一覧に戻る"
- Page title: "同僚評価入力"
- Target employee card:
  - Avatar circle
  - "評価対象者: 佐藤花子"
  - "開発部 / L2"
- Subtitle: "2025年度 同僚評価"
- Right side: [提出] button (primary)

- Note box (yellow background):
  "※行動・貢献項目のみを評価してください（No.74-82）"

- Evaluation items (only behavior items):

Card 1:
  - "No.74 責任感"
  - Description: "自分の仕事に責任を持ち、最後までやり遂げる"
  - Rating: ○1 ○2 ○3 ●4 ○5
  - "コメント（任意）:" textarea (small)

Card 2:
  - "No.75 チームワーク"
  - Description: "チームメンバーと協力して業務を遂行する"
  - Rating: ○1 ○2 ●3 ○4 ○5
  - Textarea

(Cards for No.74-82)

- Divider

- "強み（良い点）:"
  - Textarea: "コミュニケーション力が高く、チームの雰囲気を良くしている"

- "改善点:"
  - Textarea: "ドキュメント作成の精度向上が望まれる"

- [提出] button at bottom

Desktop viewport, 1440px wide
```

---

### SC05: 評価結果確認

```
Create an evaluation result screen in Japanese.

Same header and sidebar.

Main content:
- Page title: "評価結果確認"
- Subtitle: "2025年度 評価結果"

- Employee info card (horizontal):
  - Large avatar
  - Name: "田中太郎"
  - "L2 Mid-level / 開発部"
  - Status badge: [確定] (purple)

- Score card (prominent, centered):
  - Large circular chart showing 83%
  - "総合スコア: 83点"
  - Rank badge: [ランク A] (blue, large)
  - "昇給: +3号俸"

- Score breakdown (3 horizontal bars):
  - "スキル習得度 (50点満点):" ████████████████░░░░ 42.5点
  - "職能発揮力 (30点満点):" ████████████████░░░░ 24.0点
  - "行動・貢献 (20点満点):" ████████████████░░░░ 16.5点

- Feedback section:
  - "上司コメント:"
  - Quote box: "今期は大きく成長しました。特にAWS関連のスキルが向上しています..."

- Rank explanation table:
  | ランク | スコア範囲 | 昇給 |
  | S | 90点以上 | +5号俸 |
  | A (あなた) | 75-89点 | +3号俸 |
  | B | 60-74点 | +2号俸 |
  | C | 45-59点 | +1号俸 |
  | D | 44点以下 | +0号俸 |

Desktop viewport, 1440px wide
```

---

### SC06: スキルマップ

```
Create a skill map visualization screen in Japanese.

Same header and sidebar, with "スキルマップ" selected.

Main content:
- Page title: "スキルマップ"
- Employee info: "田中太郎 / L2 Mid-level"

- Summary cards row (3 cards):
  - "スキル習得度": 30/46 (65%) + progress bar
  - "職能発揮力": 15/27 (56%) + progress bar
  - "行動・貢献": 7/9 (78%) + progress bar

- "L2に必要な項目" progress:
  - "45/60達成（75%）"
  - Long progress bar

- Tab navigation:
  [スキル習得度] [職能発揮力] [行動・貢献]

- Category table:
  | カテゴリ | 達成 | 進行中 | 未着手 |
  | 共通スキル | 10 | 3 | 2 |
  | 技術スキル | 15 | 5 | 8 |
  | ビジネススキル | 5 | 2 | 3 |

- Item list (vertical):
  - ✅ No.1 ITリテラシー [達成] (green badge)
  - ✅ No.2 ネットワーク基礎 [達成]
  - 🔄 No.3 セキュリティ基礎 [進行中] (yellow badge)
  - ⬜ No.4 クラウド基礎 [未着手] (gray badge)
  - ...

- Each item clickable to see details

Desktop viewport, 1440px wide
```

---

### SC07: ロードマップ詳細

```
Create a skill roadmap detail screen in Japanese.

Same header and sidebar.

Main content:
- Breadcrumb: "← スキルマップに戻る"
- Page title: "スキルロードマップ"
- Subtitle: "L2 → L3 へのキャリアパス"

- Progress overview card:
  - "現在の職級: L2 Mid-level"
  - "目標: L3 Senior"
  - "達成率: 45/60 (75%)"
  - Progress bar

- Timeline view (vertical):
  - "Phase 1: 基礎スキル（完了）" ✓
    - ✓ ITリテラシー
    - ✓ ネットワーク基礎
    - ✓ セキュリティ基礎
  - "Phase 2: 技術スキル（進行中）" 🔄
    - ✓ AWS基礎
    - 🔄 AWS応用 ← You are here
    - ⬜ インフラ設計
  - "Phase 3: リーダーシップ（未着手）" ⬜
    - ⬜ プロジェクト管理
    - ⬜ チーム育成

- Recommended next items card:
  - "AWS応用" - [ナレッジを見る]
  - "インフラ設計" - [ナレッジを見る]

Desktop viewport, 1440px wide
```

---

### SC08: 通知一覧

```
Create a notification list screen in Japanese.

Same header and sidebar, with "通知" selected.

Main content:
- Page title: "通知一覧"
- Right side: [すべて既読にする] link

- Filter tabs:
  [すべて] [未読(3)] [評価関連] [システム]

- Notification list (card style):

Card 1 (unread, highlighted):
  - 🔔 "自己評価の締切が近づいています"
  - "自己評価の提出期限は9/10です。まだ下書きの状態です。"
  - "3時間前" (gray text)
  - [確認する →] link

Card 2 (unread):
  - 🔔 "佐藤さんの同僚評価をお願いします"
  - "佐藤花子さんの同僚評価が割り当てられました。"
  - "1日前"
  - [評価する →] link

Card 3 (read, gray background):
  - 📢 "2025年度の評価期間が開始されました"
  - "評価期間: 2024/10/01 〜 2025/09/30"
  - "3日前"

Card 4 (read):
  - ✓ "2024年度の評価が確定しました"
  - "ランク: A、昇給: +3号俸"
  - "1ヶ月前"

- Pagination: [< 前へ] [1] [2] [3] [次へ >]

Desktop viewport, 1440px wide
```

---

### SC09: プロフィール

```
Create a profile screen in Japanese.

Same header and sidebar, with user avatar area selected.

Main content:
- Page title: "プロフィール"

- Profile section (card):
  - Large avatar (80px)
  - Name: "田中 太郎"
  - Email: "tanaka@example.com"
  - Badge: "L2 Mid-level"

- Information section (card):
  - Title: "基本情報"
  - 社員番号: EMP-001
  - 部署: 開発部
  - 職級: L2 (Mid-level)
  - 入社日: 2020/04/01
  - 上司: 山田部長
  - 現在の号俸: 15号

- Current period section (card):
  - Title: "2025年度 評価状況"
  - ステータス: 自己評価提出済み
  - 現在のステップ: 同僚評価待ち

- Skill summary (card):
  - Title: "スキル達成状況"
  - Progress bar: "46/82項目達成 (56%)"
  - [スキルマップを見る →] link

Desktop viewport, 1440px wide
```

---

## 上司向け画面

### SC10: 部下一覧

```
Create a subordinate list screen for managers in Japanese.

Same header, sidebar shows manager-specific items:
- ダッシュボード
- 部下管理 (selected)
  - 部下一覧
  - 上司評価
  - 評価承認
- 自己評価
- スキルマップ

Main content:
- Page title: "部下の評価状況"
- Period badge: "2025年度"

- Filter row:
  - Status dropdown: "すべてのステータス ▼"
  - Search input

- Summary cards (4 cards):
  - 部下総数: 5名
  - 自己評価待ち: 1名
  - 評価入力待ち: 2名 (highlighted yellow)
  - 承認待ち: 1名

- Data table:
  | 社員名 | 職級 | ステータス | 現在のステップ | アクション |
  | 佐藤花子 | L2 | 同僚評価完了 | 上司評価 | [評価入力] |
  | 鈴木一郎 | L1 | 同僚評価完了 | 上司評価 | [評価入力] |
  | 田中美咲 | L2 | 上司評価提出済 | 承認待ち | [承認] |
  | 山本健太 | L3 | 自己評価提出済 | 同僚評価 | - |
  | 高橋由美 | L1 | 下書き | 自己評価 | - |

- Status badges colored:
  - 下書き (gray)
  - 自己評価提出済 (light blue)
  - 同僚評価完了 (blue)
  - 上司評価提出済 (yellow)
  - 承認待ち (orange)

Desktop viewport, 1440px wide
```

---

### SC11: 上司評価入力

```
Create a manager evaluation input screen in Japanese.

Same header and sidebar, with "上司評価" selected.

Main content:
- Breadcrumb: "← 部下一覧に戻る"
- Page title: "上司評価入力"
- Target: "評価対象: 佐藤花子（L2）"
- Right side: [下書き保存] + [提出] buttons

- Collapsible sections:

Section 1: "自己評価を確認" (collapsed by default)
  - [展開/折畳] toggle
  - "提出日: 2025/9/10"

Section 2: "同僚評価サマリー" (collapsed)
  - "評価者: 2名 / 平均スコア: 3.8"

- Divider

- Tab navigation:
  [スキル習得度] [職能発揮力] [行動・貢献]

- Evaluation items:

Card 1:
  - "No.1 ITリテラシー"
  - "本人評価: 4 / 同僚評価: -"
  - "上司評価:" ○1 ○2 ○3 ●4 ○5
  - "コメント:" textarea (optional)

(More cards...)

- Divider

- Score calculation card (prominent):
  - "スコア計算結果"
  - "スキル習得度: 42.5 / 50点"
  - "職能発揮力: 24.0 / 30点"
  - "行動・貢献: 16.5 / 20点"
  - Divider line
  - "合計: 83.0 / 100点" (large)
  - "ランク提案: A" (blue badge)

- "総合コメント:" large textarea

- [下書き保存] [提出] buttons

Desktop viewport, 1440px wide
```

---

### SC12: 評価承認

```
Create an evaluation approval screen for managers in Japanese.

Same header and sidebar.

Main content:
- Breadcrumb: "← 部下一覧に戻る"
- Page title: "評価承認"
- Target: "評価対象: 佐藤花子（L2）"
- Status: "ステータス: 上司評価提出済"

- Evaluation summary card:
  - Score breakdown:
    - "スキル習得度: 42.5 / 50点"
    - "職能発揮力: 24.0 / 30点"
    - "行動・貢献: 16.5 / 20点"
  - Divider
  - "合計: 83.0 / 100点"
  - "ランク: A"
  - "昇給: +3号俸"
  - [評価詳細を見る] link

- Approval history timeline:
  - "承認履歴"
  - "9/10 本人が自己評価を提出" (✓)
  - "9/15 同僚評価完了（2名）" (✓)
  - "9/20 上司が評価を提出" (✓)
  - "9/22 上司承認待ち" (current, highlighted)

- Comment input:
  - "コメント:" textarea

- Action buttons (prominent):
  - [差戻し] button (outline, red text)
  - [承認] button (primary, green)

Desktop viewport, 1440px wide
```

---

### SC13: 部下スキル確認

```
Create a subordinate skill confirmation screen for managers in Japanese.

Same header and sidebar, with "部下管理" expanded.

Main content:
- Breadcrumb: "← 部下一覧に戻る"
- Page title: "部下スキル確認"
- Target: "佐藤花子（L2 Mid-level）"

- Summary cards row (3 cards):
  - 達成項目: 46/82項目
  - 達成率: 56%
  - 職級要件充足: 78%

- Skill matrix (table):
  - Headers: カテゴリ | 項目名 | L1 | L2 | L3 | 達成状況
  - Rows showing skills with current grade highlighted
  - Status icons: ✓ (completed), ○ (in progress), - (not started)

- Category tabs:
  [全体] [スキル習得度(46)] [職能発揮力(27)] [行動・貢献(9)]

- Filter row:
  - Status filter: "すべて ▼"
  - Search: "スキルを検索..."

- Skill list (card style):
  Card:
  - "No.1 ITリテラシー" + Status badge: "達成済み"
  - "達成日: 2025/03/15"
  - "エビデンス: 〇〇研修を修了"
  - [詳細を見る] link

- Next steps section (card):
  - Title: "次に習得すべきスキル（推奨）"
  - 3 recommended skill items

Desktop viewport, 1440px wide
```

---

## HR・管理者向け画面

### SC14: 管理ダッシュボード

```
Create an admin dashboard screen in Japanese.

Header shows "管理者" role indicator.

Sidebar (admin version):
- 管理ダッシュボード (selected)
- 評価期間管理
- 社員管理
- 評価基準管理
- HR承認
- 昇格管理
- レポート

Main content:
- Page title: "管理ダッシュボード"
- Period selector: "2025年度" dropdown

- KPI cards row (4 cards):
  - 全社員数: 50名
  - 下書き: 5名 (10%)
  - 進行中: 40名 (80%)
  - 確定済: 5名 (10%)

- Progress visualization:
  - Stacked horizontal bar showing all statuses:
    下書き | 自己評価提出 | 同僚評価完了 | 上司評価提出 | 上司承認 | HR承認 | 確定
    (Each segment colored differently)

- Two-column layout:

Left: "部署別進捗" card
  - 開発部: ████████░░ 80% (16/20)
  - 営業部: ██████░░░░ 60% (9/15)
  - 総務部: ████░░░░░░ 40% (4/10)
  - 人事部: ██████████ 100% (5/5)

Right: "承認待ち" card
  - "HR承認待ち: 5件"
  - [確認する →] link button

- Bottom: "期限超過アラート" (red border)
  - Table:
    | 社員名 | 部署 | 状態 | 期限超過日数 |
    | 山田一郎 | 営業部 | 自己評価未提出 | 3日 |
    | 鈴木二郎 | 総務部 | 自己評価未提出 | 2日 |

Desktop viewport, 1440px wide
```

---

### SC15: 評価期間管理

```
Create an evaluation period management screen in Japanese.

Same header and admin sidebar, with "評価期間管理" selected.

Main content:
- Page title: "評価期間管理"
- [+ 新規期間作成] button (primary)

- Data table:
  | 期間名 | 開始日 | 終了日 | 評価月 | ステータス | 操作 |
  | 2025年度 | 2024/10/01 | 2025/09/30 | 9月 | [評価中] green | [編集] [終了] |
  | 2024年度 | 2023/10/01 | 2024/09/30 | 9月 | [終了] gray | [詳細] |
  | 2023年度 | 2022/10/01 | 2023/09/30 | 9月 | [終了] gray | [詳細] |

- Status badges:
  - 準備中 (yellow)
  - 評価中 (green)
  - 終了 (gray)

- Selected period detail card:
  - "2025年度 詳細"
  - Timeline:
    - "10/1 期間開始"
    - "9/1 自己評価開始"
    - "9/10 自己評価締切"
    - "9/17 同僚評価締切"
    - "9/24 上司評価締切"
    - "9/30 評価確定締切"

Desktop viewport, 1440px wide
```

---

### SC16: 社員管理

```
Create an employee management screen in Japanese.

Same header and admin sidebar, with "社員管理" selected.

Main content:
- Page title: "社員管理"
- Action buttons: [+ 社員追加] [CSVインポート]

- Filter row:
  - Department dropdown
  - Grade dropdown
  - Status dropdown (active/inactive)
  - Search input

- Data table:
  | 社員番号 | 氏名 | 部署 | 職級 | 上司 | ステータス | 操作 |
  | E001 | 田中太郎 | 開発部 | L2 | 山田課長 | 在籍 | [編集] [詳細] |
  | E002 | 佐藤花子 | 開発部 | L2 | 山田課長 | 在籍 | [編集] [詳細] |
  | E003 | 鈴木一郎 | 営業部 | L3 | 伊藤部長 | 在籍 | [編集] [詳細] |
  | E004 | 高橋由美 | 総務部 | L1 | 木村課長 | 休職 | [編集] [詳細] |

- Pagination

Desktop viewport, 1440px wide
```

---

### SC17: 評価基準管理

```
Create an evaluation criteria management screen in Japanese.

Same header and admin sidebar, with "評価基準管理" selected.

Main content:
- Page title: "評価基準管理"

- Tab navigation:
  [評価軸] [評価項目] [職級要件]

- "評価軸" tab content:

Table:
| 軸名 | コード | 配点 | 説明 | 操作 |
| スキル習得度 | SKILL | 50点 | 専門知識・技術の習得状況 | [編集] |
| 職能発揮力 | COMPETENCY | 30点 | 業務での能力発揮度合い | [編集] |
| 行動・貢献 | BEHAVIOR | 20点 | 組織への貢献と行動評価 | [編集] |
| 合計 | - | 100点 | - | - |

- Weight visualization:
  - Pie chart showing 50%/30%/20% distribution

- "評価項目" sub-section:
  - Category tree view:
    - スキル習得度
      - 共通スキル (No.1-15)
      - 技術スキル (No.16-46)
    - 職能発揮力
      - 業務遂行力 (No.47-60)
      - 問題解決力 (No.61-73)
    - 行動・貢献
      - チームワーク (No.74-82)

Desktop viewport, 1440px wide
```

---

### SC18: HR承認

```
Create an HR approval screen in Japanese.

Same header and admin sidebar, with "HR承認" selected.

Main content:
- Page title: "HR承認"
- Action buttons: [一括確定] + [CSVエクスポート]

- Filter row:
  - Department dropdown
  - Status dropdown
  - Search input

- Main table with checkboxes:
  | □ | 氏名 | 部署 | 職級 | スコア | ランク | 昇給 | アクション |
  | □ | 佐藤花子 | 開発部 | L2 | 83 | A | +3 | [詳細] |
  | □ | 鈴木太郎 | 開発部 | L3 | 75 | B | +2 | [詳細] |
  | □ | 田中一郎 | 営業部 | L2 | 92 | S | +5 | [詳細] |
  | □ | 山本健太 | 総務部 | L1 | 65 | B | +2 | [詳細] |

- Divider

- Selected employee detail panel:
  - "佐藤花子（L2 / 開発部）"
  - Score breakdown:
    - スキル習得度: 42.5/50
    - 職能発揮力: 24.0/30
    - 行動・貢献: 16.5/20
    - 合計: 83.0/100 → ランクA → +3号俸
  - "上司コメント:" quote
  - [評価詳細を見る] link
  - "ランク調整:" [S] [A] [B] [C] [D] radio buttons
  - "HRコメント:" textarea
  - Buttons: [差戻し] (outline) [承認] (blue) [確定] (green, primary)

Desktop viewport, 1440px wide
```

---

### SC19: 昇格管理

```
Create a promotion management screen in Japanese.

Same header and admin sidebar, with "昇格管理" selected.

Main content:
- Page title: "昇格管理"
- Period selector: "2025年度"
- Action buttons: [昇格一覧エクスポート]

- Summary cards:
  - 昇格候補: 8名
  - 承認済: 3名
  - 審議中: 5名

- Filter row:
  - Current grade dropdown
  - Target grade dropdown
  - Status dropdown

- Data table:
  | 氏名 | 現職級 | 昇格先 | スコア | ランク | ステータス | 操作 |
  | 田中太郎 | L2 | L3 | 92 | S | 審議中 | [詳細] [承認] |
  | 佐藤花子 | L2 | L3 | 88 | A | 審議中 | [詳細] [承認] |
  | 山本健太 | L1 | L2 | 85 | A | 承認済 | [詳細] |

- Selected detail panel:
  - Employee info with avatar
  - "昇格要件達成状況"
  - Checklist:
    - ✓ スキル習得度: 45/46項目達成
    - ✓ 職能発揮力: 25/27項目達成
    - ✓ 行動・貢献: 9/9項目達成
    - ✓ 在籍期間: 2年 (要件: 1年以上)
    - ✓ 直近評価: S/A (要件: B以上)
  - [昇格承認] button

Desktop viewport, 1440px wide
```

---

### SC20: レポート

```
Create a reports/analytics screen in Japanese.

Same header and admin sidebar, with "レポート" selected.

Main content:
- Page title: "レポート・分析"
- Period selector: "2025年度"
- [PDFエクスポート] button

- Tab navigation:
  [概要] [部署別] [職級別] [推移]

- "概要" tab content:

- KPI row (4 cards):
  - 平均スコア: 72.5点
  - ランク分布: S:5% A:25% B:45% C:20% D:5%
  - 昇格率: 15%
  - 評価完了率: 98%

- Charts section (2 columns):

Left: "ランク分布" pie chart
  - S (5%)
  - A (25%)
  - B (45%)
  - C (20%)
  - D (5%)

Right: "部署別平均スコア" bar chart
  - 開発部: 75
  - 営業部: 70
  - 総務部: 72
  - 人事部: 74

- Bottom: "スコア分布" histogram
  - X-axis: Score ranges (0-20, 21-40, 41-60, 61-80, 81-100)
  - Y-axis: Number of employees

Desktop viewport, 1440px wide
```

---

### SC21: 監査ログ

```
Create an audit log screen in Japanese.

Same header and admin sidebar, with "監査ログ" selected.

Main content:
- Page title: "監査ログ"
- Subtitle: "システム操作履歴"

- Filter row:
  - Date range picker: "2025/01/01" - "2025/01/24"
  - User dropdown: "すべてのユーザー ▼"
  - Action dropdown: "すべての操作 ▼"
  - Entity dropdown: "すべてのエンティティ ▼"
  - [検索] button

- Summary cards (3 cards):
  - 本日の操作数: 156
  - アクティブユーザー: 23名
  - エラー発生: 2件

- Audit log table:
  | 日時 | ユーザー | 操作 | エンティティ | 詳細 |
  | 2025/01/24 15:30 | 田中太郎 | UPDATE | 自己評価 | [詳細] |
  | 2025/01/24 15:25 | 山田部長 | APPROVE | 評価サイクル | [詳細] |
  | 2025/01/24 15:20 | システム | CREATE | 通知 | [詳細] |
  | 2025/01/24 15:15 | 佐藤花子 | UPDATE | 自己評価 | [詳細] |
  | 2025/01/24 15:00 | 管理者 | UPDATE | 評価期間 | [詳細] |

- Action badges colored:
  - CREATE (green)
  - UPDATE (blue)
  - DELETE (red)
  - APPROVE (yellow)

- Pagination: [< 前へ] [1] [2] [3] ... [10] [次へ >]

- Export section:
  - [CSVエクスポート] button

Desktop viewport, 1440px wide
```

---

### SC22: 文章題管理

```
Create an essay question (scenario) management screen in Japanese.

Same header and admin sidebar, with "文章題管理" selected.

Main content:
- Page title: "文章題管理"
- Subtitle: "学習用シナリオの作成・編集"
- Action buttons: [+ 新規シナリオ作成] (primary) + [AIで生成] (outline, with sparkle icon)

- Filter row:
  - Category dropdown: "すべてのカテゴリ ▼" (スキル習得度, 職能発揮力, 行動・貢献)
  - Target grade dropdown: "対象職級 ▼" (L1, L2, L3, L4, L5)
  - Status dropdown: "ステータス ▼" (下書き, 公開中, アーカイブ)
  - Search input: "シナリオを検索..."

- Summary cards (3 cards):
  - 公開中: 12件
  - 下書き: 3件
  - 総学習者数: 45名

- Data table:
  | タイトル | カテゴリ | 対象職級 | 難易度 | ステータス | 操作 |
  | AWS障害対応シナリオ | 技術スキル | L2-L3 | 中級 | [公開中] green | [編集] [プレビュー] |
  | チーム間コンフリクト解決 | 行動・貢献 | L3-L4 | 上級 | [公開中] green | [編集] [プレビュー] |
  | 新人オンボーディング計画 | 職能発揮力 | L2 | 初級 | [下書き] gray | [編集] [プレビュー] |
  | セキュリティインシデント対応 | 技術スキル | L3-L4 | 上級 | [公開中] green | [編集] [プレビュー] |

- Difficulty badges:
  - 初級 (green)
  - 中級 (yellow)
  - 上級 (red)

- Status badges:
  - 下書き (gray)
  - 公開中 (green)
  - アーカイブ (light gray)

- Pagination: [< 前へ] [1] [2] [次へ >]

Desktop viewport, 1440px wide
```

---

### SC22-detail: シナリオ編集画面

```
Create a scenario edit screen in Japanese.

Same header and admin sidebar.

Main content:
- Breadcrumb: "← 文章題管理に戻る"
- Page title: "シナリオ編集"
- Right side: [下書き保存] (outline) + [公開] (primary green)

- Two-column layout:

Left column (60%):
  - "基本情報" card:
    - タイトル: text input
    - 説明: textarea
    - カテゴリ: dropdown
    - 対象職級: multi-select checkboxes (L1-L5)
    - 難易度: radio (初級/中級/上級)
    - 推定学習時間: number input + "時間"

  - "シナリオ本文" card:
    - Rich text editor with toolbar
    - Large textarea for scenario content
    - "背景設定"、"課題"、"期待される行動" sections

  - "評価基準" card:
    - Add criteria rows:
      | 観点 | 配点 | 説明 |
      | 技術的正確性 | 30 | [削除] |
      | 問題解決アプローチ | 40 | [削除] |
      | コミュニケーション | 30 | [削除] |
    - [+ 評価基準を追加] link

Right column (40%):
  - "AIアシスト" card (light purple border):
    - "AIでシナリオを改善"
    - [難易度を調整] button
    - [評価基準を提案] button
    - [類似シナリオを検索] button

  - "関連スキル" card:
    - Tag-style skill chips:
      [AWS基礎] [障害対応] [ログ分析] [+追加]

  - "プレビュー" card:
    - [プレビューを表示] button
    - Last saved: "最終保存: 10分前"

Desktop viewport, 1440px wide
```

---

## モーダル画面

### 評価期間作成モーダル

```
Create a modal for creating evaluation period in Japanese.

Modal overlay with centered white card (480px width):

- Header: "評価期間を作成" + X close button

- Form:
  - "期間名" text input: placeholder "例: 2026年度"
  - "開始日" date picker
  - "終了日" date picker
  - "評価月" number input (1-12)

- Footer:
  - [キャンセル] outline button
  - [作成] primary button

Semi-transparent dark overlay background
```

---

### 差戻しモーダル

```
Create a rejection modal in Japanese.

Modal overlay with centered white card (480px width):

- Header: "評価を差戻す" + X close button
- Warning icon (orange)

- Target info: "対象: 佐藤花子（L2）"

- "差戻し先" radio buttons:
  ○ 上司評価へ
  ○ 自己評価へ

- "差戻し理由" textarea (required)
  - Placeholder: "差戻しの理由を入力してください"

- Footer:
  - [キャンセル] outline button
  - [差戻す] red button

Semi-transparent dark overlay background
```

---

### 確定確認モーダル

```
Create a finalization confirmation modal in Japanese.

Modal overlay with centered white card (400px width):

- Header: "評価を確定" + X close button

- Icon: checkmark in circle (green)

- Text: "以下の内容で評価を確定します。確定後は変更できません。"

- Summary box:
  - "氏名: 佐藤花子"
  - "スコア: 83点"
  - "ランク: A"
  - "昇給: +3号俸"

- Footer:
  - [キャンセル] outline button
  - [確定する] green primary button

Semi-transparent dark overlay background
```

---

### 社員編集モーダル

```
Create an employee edit modal in Japanese.

Modal overlay with centered white card (520px width):

- Header: "社員情報を編集" + X close button

- Form (two columns where appropriate):
  - "社員番号" text input (disabled): "E001"
  - "氏名" text input: "田中太郎"
  - "メールアドレス" email input
  - "部署" dropdown: 開発部, 営業部, 総務部, 人事部
  - "職級" dropdown: L1, L2, L3, L4, L5
  - "上司" dropdown (searchable): employee list
  - "入社日" date picker
  - "ステータス" radio: ○在籍 ○休職 ○退職

- Footer:
  - [キャンセル] outline button
  - [保存] primary button

Semi-transparent dark overlay background
```

---

## ステータスバッジ一覧

```
Status badges reference for all screens:

Evaluation cycle statuses:
- 下書き (DRAFT): Gray background #e9ecef, dark text
- 自己評価提出済 (SELF_SUBMITTED): Light blue #d0ebff
- 同僚評価完了 (PEER_COMPLETED): Blue #a5d8ff
- 上司評価提出済 (MANAGER_SUBMITTED): Yellow #fff3bf
- 上司承認済 (MANAGER_APPROVED): Light green #d3f9d8
- HR承認済 (HR_APPROVED): Green #b2f2bb
- 確定 (FINALIZED): Purple #e5dbff
- 差戻し (REJECTED): Red #ffc9c9

Rank badges:
- S: Gold #ffd43b background
- A: Blue #339af0 background, white text
- B: Green #40c057 background, white text
- C: Orange #fd7e14 background, white text
- D: Gray #868e96 background, white text

Period statuses:
- 準備中 (PREPARING): Yellow #fff3bf
- 評価中 (ACTIVE): Green #d3f9d8
- 終了 (CLOSED): Gray #e9ecef

Skill achievement badges:
- 達成 (ACHIEVED): Green #40c057
- 進行中 (IN_PROGRESS): Yellow #fab005
- 未着手 (NOT_STARTED): Gray #868e96
```

---

## レスポンシブ対応

### タブレット向け (768px)

```
For tablet viewport, add these adjustments:

- Sidebar: Collapsible, hamburger menu toggle
- Cards: Stack vertically instead of 2-3 columns
- Tables: Horizontal scroll or card view for narrow tables
- Modals: Full width with 16px padding

Tablet viewport, 768px wide
```

### モバイル向け (375px)

```
For mobile viewport, add these adjustments:

- Sidebar: Hidden by default, slide-in drawer
- Header: Compact, hamburger menu
- Cards: Single column, full width
- Tables: Card view instead of table
- Forms: Single column, larger touch targets
- Buttons: Full width on mobile

Mobile viewport, 375px wide
```

---

## 使用方法

1. **Figma Makeを開く**
2. **共通スタイル指定**を最初に入力してデザインシステムを設定
3. **各画面のプロンプト**を順番に入力して生成
4. 生成後、細部を調整（フォント、間隔、色など）
5. コンポーネント化して再利用可能にする

## 画面一覧（オントロジー準拠）

| コード | 画面名             | カテゴリ   | 権限     |
| ------ | ------------------ | ---------- | -------- |
| SC01    | ログイン           | 認証       | PUBLIC   |
| SC02    | ダッシュボード     | 社員向け   | EMPLOYEE |
| SC03    | 自己評価入力       | 社員向け   | EMPLOYEE |
| SC04    | 同僚評価入力       | 社員向け   | EMPLOYEE |
| SC05    | 評価結果確認       | 社員向け   | EMPLOYEE |
| SC06    | スキルマップ       | 社員向け   | EMPLOYEE |
| SC07    | ロードマップ詳細   | 社員向け   | EMPLOYEE |
| SC08    | 通知一覧           | 社員向け   | EMPLOYEE |
| SC09    | プロフィール       | 社員向け   | EMPLOYEE |
| SC10    | 部下一覧           | 上司向け   | MANAGER  |
| SC11    | 上司評価入力       | 上司向け   | MANAGER  |
| SC12    | 評価承認           | 上司向け   | MANAGER  |
| SC13    | 部下スキル確認     | 上司向け   | MANAGER  |
| SC14    | 管理ダッシュボード | 管理者向け | ADMIN    |
| SC15    | 評価期間管理       | 管理者向け | ADMIN    |
| SC16    | 社員管理           | 管理者向け | ADMIN    |
| SC17    | 評価基準管理       | 管理者向け | ADMIN    |
| SC18    | HR承認             | 管理者向け | ADMIN/HR |
| SC19    | 昇格管理           | 管理者向け | ADMIN/HR |
| SC20    | レポート           | 管理者向け | ADMIN/HR |
| SC21    | 監査ログ           | 管理者向け | ADMIN    |
| SC22    | 文章題管理         | 管理者向け | ADMIN    |

## Tips

- 生成結果が期待と異なる場合は、より具体的な指示を追加
- 日本語フォントは `Noto Sans JP` を指定すると安定
- モバイル版が必要な場合は `Mobile viewport, 375px wide` に変更
- ダークモードが必要な場合は色指定を調整

---

_作成日: 2026年1月24日_ _トキワテック 人事考課システム_ _オントロジーバージョン:
v2.0_
