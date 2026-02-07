# チェックポイント：アプリをK8sにデプロイしよう

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 5
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "Kubernetes"
  category: "コンテナ"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 5 で学んだ Kubernetes デプロイ実践の理解度をチェックします。

- 全6問
- 合格ライン: 80%（5問正解）

---

## 問題

### Q1. ローリングアップデートで `maxSurge: 1, maxUnavailable: 0` を設定した場合の動作はどれですか？

- A) 全ての Pod を同時に停止し、新しい Pod を起動する
- B) 新しい Pod を1つ追加してから古い Pod を1つ停止する（ダウンタイムなし）
- C) 古い Pod を1つ停止してから新しい Pod を1つ起動する
- D) 全ての Pod を一度に新しいバージョンに入れ替える

<details>
<summary>答えを見る</summary>

**正解: B**

`maxSurge: 1` は同時に1つの追加 Pod を作成できることを意味し、`maxUnavailable: 0` は既存の Pod を停止する前に新しい Pod が Ready になっていることを保証します。つまり、まず新しい Pod を1つ追加し、Ready になったら古い Pod を1つ停止します。これにより、常に全ての Pod が利用可能な状態が維持されます。

</details>

---

### Q2. Readiness Probe が失敗した場合の動作はどれですか？

- A) コンテナが再起動される
- B) Pod が削除される
- C) Service からのルーティングが停止される（Pod は動作し続ける）
- D) ノードがドレインされる

<details>
<summary>答えを見る</summary>

**正解: C**

Readiness Probe が失敗すると、その Pod は Service のエンドポイントから除外され、新しいトラフィックが振り分けられなくなります。ただし Pod 自体は動作し続けます。Readiness が回復すれば、再び Service のルーティング対象に戻ります。コンテナの再起動は Liveness Probe の失敗時に行われます。

</details>

---

### Q3. Kubernetes のリソース設定で `requests` と `limits` の説明として正しいものはどれですか？

- A) requests はリソースの上限、limits はリソースの下限
- B) requests は最低保証のリソース量、limits は使用上限
- C) requests と limits は同じ値を設定しなければならない
- D) requests はCPUのみ、limits はメモリのみの設定

<details>
<summary>答えを見る</summary>

**正解: B**

`requests` は Pod に最低限保証されるリソース量で、Scheduler が Pod の配置先を決定する際に使用します。`limits` は Pod が使用できるリソースの上限です。CPU の limits を超えるとスロットリング（速度制限）が発生し、メモリの limits を超えると OOMKill（プロセス強制終了）が発生します。

</details>

---

### Q4. HPA が Pod をスケールアップする条件として正しいものはどれですか？

- A) Pod の数が minReplicas に達した時
- B) メトリクス（CPU等）の平均値が目標値を超えた時
- C) 新しい Deployment が作成された時
- D) ノードのリソースに余裕がある時

<details>
<summary>答えを見る</summary>

**正解: B**

HPA は定期的に（デフォルト15秒間隔で）メトリクスを取得し、現在のメトリクス値が目標値を超えている場合にスケールアップします。例えば、CPU 使用率の目標が70%で、現在の平均が90%の場合、「現在のレプリカ数 x (90/70)」で必要なレプリカ数を計算し、maxReplicas の範囲内でスケールアップします。

</details>

---

### Q5. PersistentVolumeClaim（PVC）の主な用途はどれですか？

- A) Pod のネットワーク設定を保存する
- B) コンテナイメージを永続的に保存する
- C) データベースのデータなど、Pod が削除されても失われないストレージを確保する
- D) ConfigMap のデータを暗号化して保存する

<details>
<summary>答えを見る</summary>

**正解: C**

PersistentVolumeClaim（PVC）は、永続的なストレージをリクエストするリソースです。Pod が削除・再起動されてもデータが保持されるため、データベースのデータファイルやアップロードされたファイルの保存に使用します。PVC はクラスタの PersistentVolume（PV）にバインドされ、実際のストレージ（EBS、GCE Persistent Disk等）と接続されます。

</details>

---

### Q6. 以下のマニフェストで、API サーバーがデータベースに接続するために使用する DNS 名はどれですか？

```yaml
apiVersion: v1
kind: Service
metadata:
  name: db-service
  namespace: webapp
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
```

- A) `postgres:5432`
- B) `db-service:5432`
- C) `db-service.webapp:5432`
- D) B と C の両方（同じ名前空間では B、異なる名前空間では C）

<details>
<summary>答えを見る</summary>

**正解: D**

同じ名前空間（webapp）内の Pod からは `db-service:5432` でアクセスできます。異なる名前空間からは `db-service.webapp:5432`（または完全修飾名 `db-service.webapp.svc.cluster.local:5432`）でアクセスします。Kubernetes の内部 DNS が Service 名を自動的にクラスタ IP に解決します。

</details>

---

## 結果

### 5問以上正解の場合

**合格です。おめでとうございます。**

Step 5「アプリをK8sにデプロイしよう」を完了しました。
次は最終ステップ「航海の成果を確認しよう」に進みましょう。

### 4問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step5_2 Deploymentの作成と更新戦略 |
| Q2, Q3 | step5_3 ヘルスチェックとリソース管理 |
| Q4 | step5_4 HPA（水平オートスケーリング） |
| Q5, Q6 | step5_5 演習 |

---

*推定所要時間: 30分*
