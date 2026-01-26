# v86 PoC - 学習実行環境

## 概要

ブラウザ上で Linux を実行する学習環境の PoC です。

## デモの実行

### 方法1: ローカルサーバー

```bash
cd poc/v86
npx serve .
# または
python3 -m http.server 8080
```

ブラウザで http://localhost:8080 または http://localhost:3000 を開く

### 方法2: 直接ファイルを開く

`index.html` をブラウザで直接開く（一部機能制限あり）

## 現在の実装

| 項目 | 状態 | 説明 |
|-----|------|------|
| 学習UI | ✅ 実装済み | 左右分割レイアウト |
| v86埋め込み | ✅ iframe | copy.sh/v86 を使用 |
| 自前ホスト | ⬜ 未実装 | 本番では自前ホスト予定 |

## 画面構成

```
┌──────────────────────────────────────────────┐
│  ミッションタイトル                            │
├─────────────────────┬────────────────────────┤
│                     │                        │
│  学習コンテンツ      │  v86 Linux Terminal    │
│  - コマンド説明      │                        │
│  - 手順             │  $ pwd                 │
│  - チェックポイント  │  /root                 │
│                     │  $ _                   │
│                     │                        │
├─────────────────────┴────────────────────────┤
│  [前へ]    ステップ 1/6    [次へ]              │
└──────────────────────────────────────────────┘
```

## 次のステップ

### Phase 1: 自前ホスト化

```bash
# v86 リポジトリをクローン
git clone https://github.com/copy/v86.git

# 必要なファイル
v86/
├── libv86.js       # メインライブラリ
├── v86.wasm        # WebAssembly
├── bios/
│   ├── seabios.bin
│   └── vgabios.bin
└── images/
    └── linux.iso   # カスタムイメージ
```

### Phase 2: カスタム Linux イメージ作成

```dockerfile
# Alpine Linux ベース
FROM alpine:latest

RUN apk add --no-cache \
    bash \
    git \
    nodejs \
    npm \
    python3 \
    vim

# 学習用ファイル配置
COPY exercises/ /home/user/exercises/
```

### Phase 3: 学習UIとの統合

- Astro/React コンポーネント化
- Markdown コンテンツの動的読み込み
- 進捗管理との連携

## 参考

- [v86 GitHub](https://github.com/copy/v86)
- [v86 デモ](https://copy.sh/v86/)
- [ADR: 学習実行環境設計](../../docs/02_基本設計/07_ADR_学習実行環境設計.md)
