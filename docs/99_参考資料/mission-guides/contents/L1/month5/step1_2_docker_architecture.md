# Dockerのアーキテクチャ

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 1
subStep: 2
title: "Dockerのアーキテクチャ"
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

> 「コンテナの概要はわかりました。でも、Dockerって具体的にどう動いてるんですか？」
>
> 村上先輩がホワイトボードに図を描き始めた。
>
> 「いい質問だ。Dockerはクライアント・サーバーモデルで動いている。
> ターミナルで `docker` コマンドを打つと、裏側で Docker デーモンというサーバーが
> 実際の処理を行っているんだ」
>
> 「つまり、コマンドを打つ側と実行する側は別なんですね」
>
> 「その通り。さらに、イメージを保存・配布するレジストリという仕組みもある。
> この3つの関係を理解すれば、Dockerの全体像が見えてくるよ」

---

## Docker のアーキテクチャ概要

Docker は **クライアント・サーバーモデル** で構成されています。

```
┌────────────────┐     REST API      ┌────────────────┐
│                │  ───────────────→  │                │
│  Docker Client │                   │  Docker Daemon │
│  (docker CLI)  │  ←───────────────  │  (dockerd)     │
│                │                   │                │
└────────────────┘                   └───────┬────────┘
                                            │
                                            │ pull/push
                                            ↓
                                    ┌────────────────┐
                                    │                │
                                    │   Registry     │
                                    │ (Docker Hub等)  │
                                    │                │
                                    └────────────────┘
```

### 3つの主要コンポーネント

| コンポーネント | 役割 | 具体例 |
|-------------|------|--------|
| Docker Client | ユーザーがコマンドを入力するインタフェース | `docker build`, `docker run` |
| Docker Daemon | コンテナの作成・管理を行うバックグラウンドプロセス | `dockerd` |
| Registry | イメージを保存・配布するリポジトリ | Docker Hub, Amazon ECR, GitHub Container Registry |

---

## Docker Client

Docker CLI（コマンドラインインタフェース）は、Docker Daemon に REST API 経由でリクエストを送信します。

```bash
# これらのコマンドはすべて Docker Daemon への API リクエストに変換される
docker build -t myapp .           # イメージをビルド
docker run -d -p 3000:3000 myapp  # コンテナを起動
docker ps                          # 実行中のコンテナを一覧表示
docker stop <container_id>         # コンテナを停止
```

### 通信の流れ

```
ユーザー → docker run myapp
            ↓
Docker Client → POST /containers/create (REST API)
            ↓
Docker Daemon → コンテナを作成・起動
            ↓
結果を返す → ユーザーに表示
```

---

## Docker Daemon (dockerd)

Docker Daemon は、コンテナのライフサイクル全体を管理するプロセスです。

### 主な責務

1. **イメージの管理**: ビルド、プル、プッシュ
2. **コンテナの管理**: 作成、起動、停止、削除
3. **ネットワークの管理**: コンテナ間通信の設定
4. **ボリュームの管理**: データの永続化

### containerd と runc

Docker Daemon の内部は、さらに細かいコンポーネントに分かれています。

```
┌──────────────────────────────────┐
│          Docker Daemon            │
│  ┌────────────────────────────┐  │
│  │       containerd            │  │
│  │  ┌──────────────────────┐  │  │
│  │  │       runc            │  │  │
│  │  │  (コンテナを実際に起動)  │  │  │
│  │  └──────────────────────┘  │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

| コンポーネント | 役割 |
|-------------|------|
| Docker Daemon | 上位のAPI処理、イメージ管理 |
| containerd | コンテナのランタイム管理（OCI準拠） |
| runc | 実際にLinux名前空間とcgroupsを設定してコンテナを起動 |

---

## Registry（レジストリ）

レジストリは、Docker イメージを保存・配布する場所です。

### Docker Hub

Docker Hub は、デフォルトの公開レジストリです。

```bash
# Docker Hub からイメージを取得
docker pull nginx:1.25

# Docker Hub にイメージをプッシュ
docker push myuser/myapp:1.0
```

### 主なレジストリサービス

| レジストリ | 特徴 |
|----------|------|
| Docker Hub | デフォルト。公開イメージが豊富 |
| Amazon ECR | AWSのプライベートレジストリ |
| Google Artifact Registry | GCPのレジストリ |
| GitHub Container Registry | GitHubと統合されたレジストリ |
| Azure Container Registry | Azureのプライベートレジストリ |

### イメージの命名規則

```
[レジストリ]/[名前空間]/[リポジトリ]:[タグ]

例:
docker.io/library/nginx:1.25      # Docker Hub の公式イメージ
ghcr.io/myorg/myapp:latest        # GitHub Container Registry
123456789.dkr.ecr.ap-northeast-1.amazonaws.com/myapp:v1.0  # Amazon ECR
```

---

## Docker オブジェクト

Docker が管理する主要なオブジェクトを整理しましょう。

| オブジェクト | 説明 | 例 |
|------------|------|-----|
| イメージ | コンテナの設計図（読み取り専用テンプレート） | `nginx:1.25`, `node:20-alpine` |
| コンテナ | イメージから作成された実行インスタンス | 稼働中のWebサーバー |
| ボリューム | データを永続化する仕組み | データベースファイル |
| ネットワーク | コンテナ間の通信を制御する仕組み | bridge, host, overlay |

---

## Docker のインストール確認

Docker がインストールされているか確認してみましょう。

```bash
# Docker のバージョン確認
docker version

# Docker の詳細情報
docker info

# Docker Daemon が動作しているか確認
docker ps
```

`docker version` の出力例:

```
Client:
 Version:           24.0.7
 API version:       1.43
 Go version:        go1.21.3
 OS/Arch:           linux/amd64

Server: Docker Engine - Community
 Engine:
  Version:          24.0.7
  API version:      1.43 (minimum version 1.12)
  Go version:       go1.21.3
  OS/Arch:          linux/amd64
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| アーキテクチャ | クライアント・サーバーモデル（CLI + Daemon + Registry） |
| Docker Client | ユーザーコマンドをREST APIに変換 |
| Docker Daemon | コンテナ・イメージ・ネットワーク・ボリュームを管理 |
| Registry | イメージの保存・配布場所（Docker Hub等） |
| 内部構造 | containerd + runc でコンテナを実行 |

### チェックリスト

- [ ] Docker のクライアント・サーバーモデルを理解した
- [ ] Docker Client、Daemon、Registry の役割を説明できる
- [ ] containerd と runc の関係を理解した
- [ ] レジストリの種類を把握した

---

## 次のステップへ

次のセクションでは、Docker イメージとコンテナの関係を深く掘り下げます。
イメージのレイヤー構造や、コンテナのライフサイクルを学びましょう。

---

*推定読了時間: 30分*
