# 理解度チェック：Dockerの基本を習得しよう

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 1
subStep: 6
title: "理解度チェック"
itemType: QUIZ
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "Docker"
  category: "コンテナ"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 1 で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. コンテナ技術を支える Linux カーネルの2つの仕組みはどれですか？

- A) ファイルシステムとプロセス
- B) 名前空間（Namespace）とcgroups
- C) シェルとカーネルモジュール
- D) systemd と init

<details>
<summary>答えを見る</summary>

**正解: B**

コンテナはLinuxカーネルの「名前空間（Namespace）」と「cgroups（Control Groups）」を利用しています。
名前空間はプロセスごとに独立した視界（PID、ネットワーク、ファイルシステムなど）を提供し、
cgroups はCPU、メモリなどのリソース使用量を制限します。

</details>

---

### Q2. Docker のアーキテクチャにおいて、コンテナの作成・管理を実際に行うのはどのコンポーネントですか？

- A) Docker Client
- B) Docker Daemon
- C) Docker Registry
- D) Docker Compose

<details>
<summary>答えを見る</summary>

**正解: B**

Docker Daemon（dockerd）がコンテナの作成・管理を行うバックグラウンドプロセスです。
Docker Client は CLI でユーザーがコマンドを入力するインタフェースで、REST API 経由で
Docker Daemon にリクエストを送信します。

</details>

---

### Q3. Docker イメージとコンテナの関係として正しいものはどれですか？

- A) イメージは実行中のコンテナのスナップショットである
- B) コンテナはイメージの読み取り専用コピーである
- C) イメージは読み取り専用テンプレートで、コンテナはその実行インスタンスである
- D) イメージとコンテナは同じものを指す

<details>
<summary>答えを見る</summary>

**正解: C**

イメージはアプリケーションの実行に必要な全てを含む読み取り専用テンプレートです。
コンテナはイメージの上に書き込み可能なレイヤーを追加した実行インスタンスです。
1つのイメージから複数のコンテナを作成できます。

</details>

---

### Q4. 次のコマンドの `-p 8080:80` は何を意味しますか？

```bash
docker run -d -p 8080:80 nginx:1.25
```

- A) コンテナのポート8080をホストのポート80にマッピング
- B) ホストのポート8080をコンテナのポート80にマッピング
- C) コンテナのポート8080と80の両方を開放
- D) ホストのポート80をコンテナのポート8080にマッピング

<details>
<summary>答えを見る</summary>

**正解: B**

`-p` オプションの形式は `-p ホスト側ポート:コンテナ側ポート` です。
`-p 8080:80` は、ホストのポート8080へのアクセスをコンテナのポート80に転送します。
つまり、ブラウザで `http://localhost:8080` にアクセスすると、コンテナ内のNginx（ポート80）に到達します。

</details>

---

### Q5. コンテナ内でシェルに接続するコマンドとして正しいものはどれですか？

- A) `docker connect -it my-container /bin/bash`
- B) `docker exec -it my-container /bin/bash`
- C) `docker attach --shell my-container`
- D) `docker ssh my-container`

<details>
<summary>答えを見る</summary>

**正解: B**

`docker exec -it コンテナ名 /bin/bash` で実行中のコンテナ内にシェルで接続できます。
`-i` はインタラクティブモード（標準入力を開く）、`-t` は疑似ターミナルを割り当てるオプションです。
Alpine ベースのイメージの場合は bash がないため `/bin/sh` を使います。

</details>

---

### Q6. Docker Volume について正しい記述はどれですか？

- A) コンテナが削除されるとボリュームのデータも削除される
- B) ボリュームはコンテナ内のメモリにデータを保存する
- C) ボリュームはコンテナのライフサイクルとは独立してデータを永続化する
- D) ボリュームは読み取り専用でありデータを書き込めない

<details>
<summary>答えを見る</summary>

**正解: C**

Docker Volume はコンテナのライフサイクルとは独立しています。
コンテナを削除してもボリュームのデータは残り、新しいコンテナに同じボリュームを
マウントすることでデータを引き継ぐことができます。
データベースなどの永続データの管理に使用します。

</details>

---

### Q7. ユーザー定義の bridge ネットワークの利点として正しいものはどれですか？

- A) コンテナ間でポートの公開が不要になる
- B) コンテナ名（DNS名）で他のコンテナにアクセスできる
- C) ホストネットワークと同じパフォーマンスが得られる
- D) コンテナが自動的にインターネットに接続される

<details>
<summary>答えを見る</summary>

**正解: B**

ユーザー定義の bridge ネットワークでは、Docker の組み込みDNSにより
コンテナ名で他のコンテナにアクセスできます。
例えば、`--name db` で起動したコンテナに対して、同じネットワーク内の
別コンテナから `db` というホスト名でアクセスできます。
デフォルトの bridge ネットワークではこの機能は利用できません。

</details>

---

### Q8. 以下のコマンドで node:20-alpine を使う利点はどれですか？

```bash
docker run node:20-alpine node --version
```

- A) Alpine は最新のNode.jsバージョンを含んでいる
- B) Alpine ベースのイメージは通常版と比べて大幅に軽量（サイズが小さい）
- C) Alpine は Windows でのみ動作する特別なイメージである
- D) Alpine はセキュリティパッチが自動適用される

<details>
<summary>答えを見る</summary>

**正解: B**

Alpine Linux は軽量な Linux ディストリビューションで、Alpine ベースのイメージは
通常版と比べてサイズが大幅に小さくなります。
例えば `node:20` が約1.1GBに対し、`node:20-alpine` は約180MBです。
サイズが小さいため、ダウンロード時間やディスク使用量を削減でき、本番環境に適しています。

</details>

---

## 結果

### 7問以上正解の場合

**合格です。おめでとうございます。**

Step 1「Dockerの基本を習得しよう」を完了しました。
次は Step 2「最適化されたDockerfileを書こう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう。**

間違えた問題の内容を、該当するセクションで復習してください：

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step1_1 コンテナ技術の概要 |
| Q2 | step1_2 Dockerのアーキテクチャ |
| Q3 | step1_3 Dockerイメージとコンテナ |
| Q4, Q5 | step1_4 基本的なDockerコマンド |
| Q6, Q7 | step1_5 Dockerボリュームとネットワーク |
| Q8 | step1_3 Dockerイメージとコンテナ |

---

## Step 1 完了

お疲れさまでした。

### 学んだこと

- コンテナ技術の基本概念（名前空間、cgroups）
- Docker のアーキテクチャ（Client、Daemon、Registry）
- イメージとコンテナの関係、レイヤー構造
- 基本的な Docker コマンド操作
- ボリュームとネットワークによるデータ管理と通信

### 次のステップ

**Step 2: 最適化されたDockerfileを書こう（4時間）**

Docker の基本を理解した今、次は自分でイメージを作成するための Dockerfile の書き方を学びます。

---

*推定所要時間: 15分*
