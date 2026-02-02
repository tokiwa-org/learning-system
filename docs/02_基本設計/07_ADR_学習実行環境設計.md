# ADR: 学習実行環境の技術選定

## ステータス

**承認済み** - 2026-01-26（改訂）

---

## コンテキスト

ミッション型学習システムでは、ブラウザ上でLinuxコマンドを実行できる環境が必要である。

### 要件

| 要件 | 優先度 | 説明 |
|-----|--------|------|
| Linuxコマンド実行 | 必須 | pwd, ls, cd, mkdir, rm 等の基本コマンド |
| ブラウザ完結 | 必須 | インストール不要、URLアクセスのみで利用可能 |
| 本物のLinux体験 | 高 | 実務と同じコマンド・挙動であること |
| 自前ホスト可能 | 高 | OSSライセンスで自由にカスタマイズ・デプロイ可能 |
| 起動速度 | 中 | 学習の妨げにならない程度（30秒以内） |
| カスタマイズ | 中 | プリセット環境の用意、ファイル配置等 |
| 永続化 | 低 | 学習用途のため毎回リセットでも可 |

### 対象レベル

- **L0（未経験者）**: ターミナル基礎、ファイル操作
- **L1（新人）**: Git操作、Node.js開発環境
- **L2（一人前）**: Python、Web開発
- **L3以上**: 同一環境で継続利用

---

## 検討した選択肢

### 製品レベルの選択肢

#### 1. StackBlitz (WebContainers)

| 項目 | 評価 |
|-----|------|
| 概要 | ブラウザ内でNode.js環境を実行 |
| 得意分野 | モダンWeb開発（React, Vue, Node.js） |
| Linuxコマンド | 一部のみ（Node.js依存） |
| 自前ホスト | ❌ **不可**（プロプライエタリ） |
| ライセンス | 商用 |

**評価**: ❌ 不採用
- WebContainersはプロプライエタリ技術で自前ホスト不可
- Node.js環境に特化しており、汎用的なLinux学習には不向き

#### 2. WebVM

| 項目 | 評価 |
|-----|------|
| 概要 | ブラウザ内で本物のLinux（Debian）を実行 |
| 得意分野 | Linuxシステム、OS学習 |
| Linuxコマンド | 完全対応（本物のバイナリ） |
| 自前ホスト | ⚠️ **制限あり**（CheerpX依存） |
| ライセンス | Apache 2.0（ただしCheerpXは商用） |

**評価**: ⚠️ 条件付き
- 本物のLinux環境がブラウザで動作
- ただし根幹技術のCheerpXは商用ライセンス

#### 3. JupyterLite

| 項目 | 評価 |
|-----|------|
| 概要 | ブラウザ内でJupyter Notebookを実行 |
| 得意分野 | Python、科学計算、データ分析 |
| Linuxコマンド | 限定的（`!`プレフィックスでシェルコマンド） |
| 自前ホスト | ✅ **可能** |
| ライセンス | BSD-3（OSS） |

**評価**: △ 用途限定
- Python学習には最適だが、ターミナル基礎学習には不向き
- Pyodide（Python→Wasm）ベースで完全OSS

---

### 根幹技術の選択肢

製品の裏にある根幹技術を調査した結果：

| 技術 | 開発者 | ライセンス | 自前ホスト | 特徴 |
|-----|--------|-----------|----------|------|
| **container2wasm** | ktock (NTT) | Apache-2.0（OSS） | ✅ 完全可能 | Docker→Wasm変換、本物のコンテナ |
| **v86** | copy.sh | BSD-2（OSS） | ✅ 完全可能 | x86エミュレータ、完全OSS |
| CheerpX | Leaning Tech | 商用 | ⚠️ 要契約 | WebVMの中身、高性能 |
| JSLinux | Fabrice Bellard | 独自 | △ | QEMU作者、軽量 |

#### container2wasm について

- Dockerコンテナをそのまま Wasm に変換可能
- Bochs (x86_64) / TinyEMU (RISC-V) でエミュレート
- [デモ](https://ktock.github.io/container2wasm-demo/) - debian, python, node, vim
- 実験的ソフトウェア（experimental）だが活発に開発中

---

## 決定

**container2wasm + xterm.js** を学習実行環境の推奨技術スタックとして採用する。

| コンポーネント | 推奨技術 | 役割 |
|---------------|---------|------|
| Terminal UI | xterm.js | ユーザーが見る「黒い画面」 |
| OS / Shell | container2wasm (Blink) | ls, cd, grep などのLinux標準操作を本物のバイナリで提供 |
| Code Runner | Service Worker + esbuild-wasm | TSコードをブラウザ側でコンパイル、メインスレッドとは別で実行 |
| File System | SharedArrayBuffer / IndexedDB | ターミナルでの操作結果とエディタでのコード編集を同期 |

**補足**: v86 も引き続き有効な選択肢。シンプルな実装にはv86、本格的な開発環境には container2wasm を推奨。

---

## 理由

### 1. 完全なオープンソース

```
container2wasm = Apache-2.0 ライセンス
v86            = BSD-2-Clause ライセンス

両方とも:
    = 商用利用OK
    = 自由にカスタマイズ可能
    = 自前ホスト完全対応
```

### 2. Dockerイメージ資産の活用（container2wasm）

既存のDockerイメージをそのままブラウザで実行可能：

```
container2wasm
└── Docker Container (debian/node/python等)
    └── 本物のLinuxバイナリ
        ├── ls, cd, grep ← 実際のバイナリ
        ├── git          ← 同上
        ├── node, npm    ← 同上
        └── python       ← 同上
```

### 3. 単一技術での全レベルカバー

container2wasm/v86上のLinuxで全ての学習内容を実現できる：

```
container2wasm (Bochs/TinyEMU) または v86 (x86エミュレータ)
└── Linux (Debian/Alpine)
    ├── 基本コマンド (pwd, ls, cd)      ← L0
    ├── Git                            ← L0-L1
    ├── Node.js / npm                  ← L1-L2
    ├── Python                         ← L2
    ├── 開発ツール全般                  ← L3以上
    └── 学習用途ならDocker CLI不要
```

### 3. 技術スタックの統一

| 観点 | v86統一のメリット |
|-----|------------------|
| 学習体験 | 全レベルで同じ環境、一貫性のある学習 |
| 運用コスト | 1つの技術を理解・保守すればよい |
| 転移学習 | L0で覚えた操作がそのままL3以上でも使える |
| 環境構築 | 1つのカスタムイメージで全レベル対応 |

### 4. 比較検討結果

| 方式 | 技術数 | 管理コスト | ライセンス | 採用 |
|-----|-------|----------|-----------|------|
| 用途別（複数技術） | 3-4個 | 高 | 混在 | ❌ |
| **v86統一** | 1個 | 低 | OSS | ✅ |

---

## アーキテクチャ

### 学習画面構成

```
┌─────────────────────────────────────────────────────────┐
│  ミッション: 初めてのターミナルを起動しよう              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────┐  ┌──────────────────────────┐ │
│  │                     │  │                          │ │
│  │  学習コンテンツ      │  │  v86 (Linux Terminal)    │ │
│  │  (Markdown)         │  │                          │ │
│  │                     │  │  $ pwd                   │ │
│  │  - 説明             │  │  /home/user              │ │
│  │  - 手順             │  │  $ ls                    │ │
│  │  - ヒント           │  │  Documents Downloads     │ │
│  │                     │  │  $ _                     │ │
│  │                     │  │                          │ │
│  └─────────────────────┘  └──────────────────────────┘ │
│                                                         │
│  [前へ]  ステップ 1/6  [次へ]                           │
└─────────────────────────────────────────────────────────┘
```

### 技術スタック

```
┌─────────────────────────────────────────────────────────────┐
│  学習UI (Cloudflare Pages)                                   │
│  - Astro + React                                            │
│  - Markdown コンテンツ                                       │
├─────────────────────────────────────────────────────────────┤
│  xterm.js (Terminal UI)                                      │
│  - ユーザーが見る「黒い画面」                                 │
├─────────────────────────────────────────────────────────────┤
│  container2wasm (Blink) または v86                           │
│  - container2wasm: Bochs/TinyEMU + Docker Container         │
│  - v86: x86エミュレータ + カスタムLinuxイメージ              │
├─────────────────────────────────────────────────────────────┤
│  Service Worker + esbuild-wasm (オプション)                  │
│  - TypeScriptコンパイル                                      │
│  - メインスレッドとは別で実行                                │
├─────────────────────────────────────────────────────────────┤
│  SharedArrayBuffer / IndexedDB                              │
│  - ファイルシステム同期                                      │
│  - ターミナルとエディタの連携                                │
└─────────────────────────────────────────────────────────────┘
```

### カスタムLinuxイメージ構成

```
Alpine Linux (軽量ディストリビューション)
├── 基本ツール
│   ├── bash, zsh
│   ├── coreutils (ls, cat, cp, mv, rm...)
│   ├── vim, nano
│   └── curl, wget
├── 開発ツール
│   ├── git
│   ├── Node.js 20 LTS + npm
│   ├── Python 3.x + pip
│   └── build-essential
├── 学習用設定
│   ├── .bashrc (プロンプトカスタマイズ)
│   ├── .gitconfig (学習用設定)
│   └── /home/user/exercises/ (演習ファイル)
└── 容量目安: 100-200MB
```

### 埋め込み実装例

```html
<!-- v86埋め込み -->
<div id="terminal-container"></div>

<script src="libv86.js"></script>
<script>
var emulator = new V86({
    wasm_path: "v86.wasm",
    memory_size: 512 * 1024 * 1024,  // 512MB
    vga_memory_size: 8 * 1024 * 1024,
    screen_container: document.getElementById("terminal-container"),
    bios: { url: "seabios.bin" },
    vga_bios: { url: "vgabios.bin" },
    cdrom: { url: "linux-image.iso" },
    autostart: true,
});
</script>
```

---

## 影響

### ポジティブ

| 影響 | 詳細 |
|-----|------|
| 学習品質向上 | 本物のLinux環境で実践的な学習が可能 |
| 環境構築不要 | 学習者のPC環境に依存しない |
| スケーラビリティ | クライアントサイドで実行、サーバー負荷なし |
| 運用簡素化 | 単一技術スタックで全レベルカバー |
| コスト削減 | OSSのため、ライセンス費用なし |

### ネガティブ（対策含む）

| 影響 | 対策 |
|-----|------|
| 初回起動が遅い | プリロード、ローディング中に復習コンテンツ表示 |
| エミュレーション性能 | 軽量Linux（Alpine）採用、学習用途なら十分 |
| ブラウザ依存 | 推奨ブラウザ（Chrome, Edge, Firefox）を明記 |
| イメージサイズ | CDN配信、Service Workerでキャッシュ |

---

## レベル別カバー範囲

| レベル | 学習内容 | v86での実現 |
|-------|---------|------------|
| L0 | ターミナル基礎、ファイル操作 | ✅ 標準コマンド |
| L1 | Git基礎、Node.js入門 | ✅ git, node, npm |
| L2 | Web開発、Python | ✅ npm scripts, python |
| L3 | 設計、CI/CD概念 | ✅ シェルスクリプト、ビルドツール |
| L4 | アーキテクチャ | ✅ 設定ファイル操作 |
| L5 | 組織戦略 | ✅ ドキュメント作成 |

---

## 今後の検討事項

| 項目 | 内容 | 優先度 |
|-----|------|--------|
| カスタムイメージ作成 | Alpine + 必要ツールのビルド | 高 |
| 演習ファイル設計 | 各ミッション用のプリセットファイル | 高 |
| 永続化検討 | LocalStorage or IndexedDBでの状態保存 | 中 |
| 性能チューニング | 起動時間短縮、メモリ最適化 | 中 |

---

## 参考資料

### 推奨技術
- [container2wasm GitHub](https://github.com/ktock/container2wasm) - Docker→Wasm変換
- [container2wasm デモ](https://ktock.github.io/container2wasm-demo/) - debian, python, node, vim
- [xterm.js](https://xtermjs.org/) - ブラウザターミナル
- [esbuild-wasm](https://esbuild.github.io/) - ブラウザ内TypeScriptコンパイル

### 代替技術
- [v86 公式デモ](https://copy.sh/v86/)
- [v86 GitHub](https://github.com/copy/v86)
- [Alpine Linux](https://alpinelinux.org/)

### 比較検討で参照した技術

- [WebVM](https://webvm.io/) - CheerpXベース
- [StackBlitz WebContainers](https://webcontainers.io/) - プロプライエタリ
- [JupyterLite](https://jupyterlite.readthedocs.io/) - Python特化

---

*作成日: 2026-01-26*
*改訂日: 2026-01-26（container2wasm + xterm.js 推奨スタックに変更）*
