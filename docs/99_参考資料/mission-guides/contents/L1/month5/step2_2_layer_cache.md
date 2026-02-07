# レイヤーキャッシュの仕組み

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 2
subStep: 2
title: "レイヤーキャッシュの仕組み"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "Docker"
  category: "コンテナ"
  target_level: "L1"
```

---

## ストーリー

> 「Dockerfile は書けるようになった？」
>
> 「はい。でも、ビルドするたびに全部やり直しになって時間がかかるんです......」
>
> 村上先輩がニヤリとした。
>
> 「それは Dockerfile の書き方に問題があるな。Docker にはビルドキャッシュという
> 強力な仕組みがある。命令の順番を工夫するだけで、ビルド時間が劇的に変わるんだ」
>
> 「順番だけで？」
>
> 「そう。変更頻度の低いものを先に、高いものを後に書く。これが鉄則だ」

---

## レイヤーキャッシュの基本原則

Docker はイメージのビルド時に、各命令の結果をレイヤーとしてキャッシュします。

### キャッシュの判定ルール

1. 各命令が前回と同じか確認する
2. `COPY` / `ADD` の場合は、コピー対象ファイルの内容（チェックサム）を比較する
3. 命令が変わっていなければキャッシュを使用する
4. **一度キャッシュが無効になると、それ以降の全レイヤーが再ビルドされる**

```
ルール: キャッシュ無効化は「下に伝播」する

FROM node:20-alpine        ← キャッシュ有効
WORKDIR /app               ← キャッシュ有効
COPY package.json ./       ← package.json が変更された → キャッシュ無効!
RUN npm install            ← 上が無効なので再実行 (キャッシュ無効)
COPY . .                   ← 上が無効なので再実行 (キャッシュ無効)
CMD ["node", "server.js"]  ← 上が無効なので再作成 (キャッシュ無効)
```

---

## 悪い例と良い例

### 悪い例: キャッシュが効かない Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app

# 全ファイルを先にコピーしてしまう
COPY . .

# 依存パッケージをインストール
RUN npm install

CMD ["node", "server.js"]
```

**問題点**: ソースコードを1行でも変更すると、`COPY . .` のキャッシュが無効になり、
`RUN npm install` も毎回再実行されます（数分かかることもある）。

```
COPY . .          ← ソースコード変更でキャッシュ無効!
RUN npm install   ← 毎回再実行（2〜5分かかる）
```

### 良い例: キャッシュを活用する Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app

# 1. 依存パッケージの定義ファイルだけを先にコピー
COPY package.json package-lock.json ./

# 2. 依存パッケージをインストール
RUN npm ci

# 3. アプリケーションコードを後からコピー
COPY . .

CMD ["node", "server.js"]
```

**改善点**: `package.json` が変わらない限り、`npm ci` のキャッシュが有効です。

```
ソースコード変更時:
COPY package.json ./  ← 変更なし → キャッシュ有効!
RUN npm ci            ← キャッシュ有効! (スキップ)
COPY . .              ← ソース変更 → キャッシュ無効
CMD [...]             ← 再作成
```

---

## ビルド時間の比較

```
悪い例（キャッシュなし）:
┌────────────────────────────────────────────┐
│ FROM node:20-alpine     0.1s  [cached]     │
│ COPY . .                2.0s  [rebuild]    │
│ RUN npm install       180.0s  [rebuild]    │
│ CMD [...]               0.1s  [rebuild]    │
├────────────────────────────────────────────┤
│ 合計: 約 182秒                              │
└────────────────────────────────────────────┘

良い例（キャッシュ活用）:
┌────────────────────────────────────────────┐
│ FROM node:20-alpine     0.1s  [cached]     │
│ COPY package*.json      0.1s  [cached]     │
│ RUN npm ci              0.1s  [cached]     │
│ COPY . .                2.0s  [rebuild]    │
│ CMD [...]               0.1s  [rebuild]    │
├────────────────────────────────────────────┤
│ 合計: 約 2.4秒                              │
└────────────────────────────────────────────┘
```

---

## キャッシュ活用の原則

### 原則1: 変更頻度の低いものを先に書く

```dockerfile
FROM node:20-alpine        # ほぼ変わらない
WORKDIR /app               # 変わらない

# 依存パッケージ（たまに変わる）
COPY package*.json ./
RUN npm ci

# アプリケーションコード（頻繁に変わる）
COPY . .

CMD ["node", "server.js"]
```

### 原則2: RUN コマンドを適切にまとめる

```dockerfile
# 悪い例: レイヤーが多い
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN rm -rf /var/lib/apt/lists/*

# 良い例: 1つの RUN にまとめる
RUN apt-get update && \
    apt-get install -y \
      curl \
      git && \
    rm -rf /var/lib/apt/lists/*
```

### 原則3: COPY は必要なファイルだけ

```dockerfile
# 悪い例: 全ファイルをコピー
COPY . .

# 良い例: 必要なファイルだけコピー
COPY package.json package-lock.json ./
RUN npm ci
COPY src/ ./src/
COPY public/ ./public/
```

---

## キャッシュの確認方法

ビルド時の出力で、キャッシュの使用状況を確認できます。

```bash
$ docker build -t my-app .

[+] Building 2.4s (9/9) FINISHED
 => [internal] load build definition from Dockerfile    0.0s
 => [1/5] FROM node:20-alpine                           0.0s
 => CACHED [2/5] WORKDIR /app                           0.0s
 => CACHED [3/5] COPY package*.json ./                  0.0s
 => CACHED [4/5] RUN npm ci                             0.0s
 => [5/5] COPY . .                                      2.0s
 => exporting to image                                  0.3s
```

`CACHED` と表示されているレイヤーはキャッシュが使用されています。

### キャッシュを無効にしてビルド

```bash
# 全キャッシュを無視してビルド
docker build --no-cache -t my-app .
```

---

## Python アプリでのキャッシュ活用例

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# 依存パッケージの定義ファイルを先にコピー
COPY requirements.txt ./

# 依存パッケージをインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . .

CMD ["python", "app.py"]
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| キャッシュの原則 | 変更されたレイヤー以降は全て再ビルドされる |
| 順序の最適化 | 変更頻度の低いものを先に、高いものを後に書く |
| 依存パッケージ | 定義ファイルだけを先にコピーしてインストール |
| RUN のまとめ | 関連するコマンドは && で1つの RUN にまとめる |

### チェックリスト

- [ ] レイヤーキャッシュの仕組みを理解した
- [ ] キャッシュ無効化が下に伝播することを理解した
- [ ] 変更頻度に基づいた命令の順序を設計できる
- [ ] ビルド出力でキャッシュの使用状況を確認できる

---

## 次のステップへ

次のセクションでは、Dockerfile のベストプラクティスを学びます。
イメージのサイズ削減やセキュリティを考慮した書き方を身につけましょう。

---

*推定読了時間: 30分*
