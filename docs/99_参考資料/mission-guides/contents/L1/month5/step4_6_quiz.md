# 理解度チェック：Kubernetesの海図を読もう

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 4
subStep: 6
title: "理解度チェック"
itemType: QUIZ
estimatedMinutes: 20
noiseLevel: MINIMAL
roadmap:
  skill: "Kubernetes"
  category: "コンテナ"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 4 で学んだ Kubernetes の基礎に関する理解度をチェックします。

- 全7問
- 合格ライン: 80%（6問正解）

---

## 問題

### Q1. Kubernetes の宣言的設定（Declarative Configuration）の説明として正しいものはどれですか？

- A) コマンドを1つずつ入力してリソースを操作する方法
- B) あるべき状態を定義し、Kubernetes がその状態を自動的に維持する方法
- C) GUI でリソースを管理する方法
- D) 設定ファイルなしでリソースを管理する方法

<details>
<summary>答えを見る</summary>

**正解: B**

宣言的設定では、YAML マニフェストで「レプリカは3つあるべき」のように望ましい状態を定義します。Kubernetes のコントローラが現在の状態と望ましい状態を比較し、差異があれば自動的に修正します。Pod が落ちた場合の自動復旧もこの仕組みの一部です。

</details>

---

### Q2. Pod、ReplicaSet、Deployment の関係として正しいものはどれですか？

- A) Pod が ReplicaSet を管理し、ReplicaSet が Deployment を管理する
- B) Deployment が Pod を直接管理する
- C) Deployment が ReplicaSet を管理し、ReplicaSet が Pod を管理する
- D) 3つは独立したリソースで関係はない

<details>
<summary>答えを見る</summary>

**正解: C**

Deployment → ReplicaSet → Pod の階層構造です。Deployment は ReplicaSet を管理し、ローリングアップデート時に新旧の ReplicaSet を制御します。ReplicaSet は指定数の Pod が常に動作していることを保証します。通常は Deployment のみを作成し、ReplicaSet と Pod は自動的に管理されます。

</details>

---

### Q3. Service の種類で、クラスタ内部でのみアクセス可能なものはどれですか？

- A) NodePort
- B) LoadBalancer
- C) ClusterIP
- D) ExternalName

<details>
<summary>答えを見る</summary>

**正解: C**

ClusterIP はデフォルトの Service タイプで、クラスタ内部でのみアクセス可能な仮想IPを割り当てます。マイクロサービス間の内部通信に使用します。外部からのアクセスには NodePort（ノードのポートを開放）や LoadBalancer（クラウドLBを作成）を使用します。

</details>

---

### Q4. ConfigMap と Secret の違いとして正しいものはどれですか？

- A) ConfigMap はファイル、Secret は環境変数でしか使えない
- B) ConfigMap は一般的な設定値、Secret はパスワードなどの機密情報に使う
- C) ConfigMap は Pod に注入できるが、Secret はできない
- D) ConfigMap は永続的だが、Secret は一時的

<details>
<summary>答えを見る</summary>

**正解: B**

ConfigMap は NODE_ENV やログレベルなど機密性のない設定データを管理し、Secret はパスワードやAPIキーなどの機密情報を管理します。両方とも環境変数またはボリュームとして Pod に注入できます。Secret は Base64 エンコードで保存され、etcd での暗号化を有効にすることで追加のセキュリティを提供できます。

</details>

---

### Q5. 以下の kubectl コマンドの説明として正しいものはどれですか？

```bash
kubectl rollout undo deployment/my-app
```

- A) Deployment を削除する
- B) Deployment を前のバージョンにロールバックする
- C) Deployment のレプリカ数を0にする
- D) Deployment のイメージを最新版に更新する

<details>
<summary>答えを見る</summary>

**正解: B**

`kubectl rollout undo` は Deployment を前のリビジョンにロールバックします。Kubernetes は Deployment の変更履歴（リビジョン）を保持しており、問題が発生した場合に素早く前の状態に戻すことができます。特定のリビジョンに戻すには `--to-revision=N` を使います。

</details>

---

### Q6. Ingress の役割として正しいものはどれですか？

- A) Pod のリソース使用量を制限する
- B) HTTP/HTTPS のルーティングルールを定義し、パスベースでトラフィックを振り分ける
- C) コンテナイメージをレジストリからダウンロードする
- D) クラスタ内の DNS を管理する

<details>
<summary>答えを見る</summary>

**正解: B**

Ingress は HTTP/HTTPS のルーティングルールを定義するリソースです。ホスト名やURLパスに基づいて、トラフィックを適切な Service に振り分けます。例えば `/api` へのリクエストを api-service に、`/` へのリクエストを web-service に振り分けることができます。Ingress Controller（NGINX等）が実際のルーティングを行います。

</details>

---

### Q7. Pod 内のコンテナのログをリアルタイムで監視するコマンドはどれですか？

- A) `kubectl describe pod my-app`
- B) `kubectl logs -f my-app-abc123`
- C) `kubectl get pod my-app -o yaml`
- D) `kubectl top pod my-app`

<details>
<summary>答えを見る</summary>

**正解: B**

`kubectl logs -f` の `-f`（follow）オプションで、コンテナのログをリアルタイムで監視できます。Docker の `docker logs -f` と同じ動作です。`describe` はリソースの設定とイベントを表示し、`top` はCPU/メモリの使用状況を表示します。

</details>

---

## 結果

### 6問以上正解の場合

**合格です。おめでとうございます。**

Step 4「Kubernetesの海図を読もう」を完了しました。
次は Step 5「アプリをK8sにデプロイしよう」に進みましょう。いよいよ実践です。

### 5問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step4_1 Kubernetesとは何か |
| Q2 | step4_2 Pod、ReplicaSet、Deployment |
| Q3, Q6 | step4_3 ServiceとIngress |
| Q4 | step4_4 ConfigMapとSecret |
| Q5, Q7 | step4_5 kubectlコマンドの基本 |

---

*推定所要時間: 20分*
