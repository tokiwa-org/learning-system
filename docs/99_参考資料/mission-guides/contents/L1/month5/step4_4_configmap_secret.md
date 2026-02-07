# ConfigMapとSecret

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 4
subStep: 4
title: "ConfigMapとSecret"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "Kubernetes"
  category: "コンテナ"
  target_level: "L1"
```

---

## ストーリー

> 「アプリの設定情報......データベースのURLとか、APIキーとかはどう管理するんですか？」
>
> 村上先輩が重要なポイントだと強調した。
>
> 「Docker では環境変数や .env ファイルを使ったよね。Kubernetes にはもっと
> 体系的な仕組みがある。設定値は ConfigMap、機密情報は Secret に分けて管理するんだ」
>
> 「分けるメリットは何ですか？」
>
> 「イメージを変えずに設定だけ変更できる。開発環境と本番環境で同じイメージを使い、
> 設定だけ差し替えるのが理想形だ」

---

## ConfigMap

ConfigMap は、機密性のない設定データを key-value ペアで管理するリソースです。

### ConfigMap の作成

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  # key-value 形式
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  API_TIMEOUT: "30000"

  # ファイルとして保存する設定
  nginx.conf: |
    server {
      listen 80;
      server_name localhost;
      location / {
        proxy_pass http://localhost:3000;
      }
    }
```

### コマンドラインからの作成

```bash
# リテラル値から作成
kubectl create configmap app-config \
  --from-literal=NODE_ENV=production \
  --from-literal=LOG_LEVEL=info

# ファイルから作成
kubectl create configmap nginx-config \
  --from-file=nginx.conf

# ディレクトリから作成
kubectl create configmap app-configs \
  --from-file=config/
```

### ConfigMap の使用方法

#### 方法1: 環境変数として注入

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  template:
    spec:
      containers:
      - name: my-app
        image: my-app:1.0
        env:
        # 個別のキーを環境変数に
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: NODE_ENV
        # 全キーを環境変数に
        envFrom:
        - configMapRef:
            name: app-config
```

#### 方法2: ボリュームとしてマウント

```yaml
spec:
  containers:
  - name: my-app
    image: my-app:1.0
    volumeMounts:
    - name: config-volume
      mountPath: /etc/nginx/conf.d
  volumes:
  - name: config-volume
    configMap:
      name: nginx-config
```

---

## Secret

Secret は、パスワードやAPIキーなどの機密情報を管理するリソースです。

### Secret の作成

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  # Base64 エンコードした値
  DB_PASSWORD: cGFzc3dvcmQxMjM=
  API_KEY: bXktc2VjcmV0LWtleQ==
```

```bash
# Base64 エンコード
echo -n 'password123' | base64
# → cGFzc3dvcmQxMjM=

# Base64 デコード
echo 'cGFzc3dvcmQxMjM=' | base64 -d
# → password123
```

### コマンドラインからの作成

```bash
# リテラル値から作成
kubectl create secret generic app-secret \
  --from-literal=DB_PASSWORD=password123 \
  --from-literal=API_KEY=my-secret-key

# ファイルから作成
kubectl create secret generic tls-secret \
  --from-file=tls.crt=server.crt \
  --from-file=tls.key=server.key
```

### Secret の使用方法

```yaml
spec:
  containers:
  - name: my-app
    image: my-app:1.0
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secret
          key: DB_PASSWORD
    envFrom:
    - secretRef:
        name: app-secret
```

---

## ConfigMap と Secret の違い

| 項目 | ConfigMap | Secret |
|------|-----------|--------|
| 用途 | 設定値、環境変数 | パスワード、APIキー |
| エンコード | プレーンテキスト | Base64 エンコード |
| 暗号化 | なし | etcd で暗号化可能 |
| サイズ制限 | 1MB | 1MB |
| Git管理 | 可能 | 非推奨（Sealed Secrets等を使用） |

### 注意点

- Secret の Base64 は暗号化ではありません（簡単にデコードできます）
- 本番環境では etcd の暗号化を有効にするか、外部シークレット管理（AWS Secrets Manager、HashiCorp Vault）と連携すべきです
- Secret を Git リポジトリにコミットしてはいけません

---

## 実践例: フルスタックアプリの設定

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: "production"
  PORT: "3000"
  DB_HOST: "db-service"
  DB_PORT: "5432"
  DB_NAME: "myapp"
---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
stringData:  # stringData なら Base64 エンコード不要
  DB_USER: "appuser"
  DB_PASSWORD: "supersecret123"
---
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-app:1.0
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secret
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ConfigMap | 機密性のない設定データを管理 |
| Secret | パスワード、APIキーなどの機密情報を管理 |
| 使用方法 | 環境変数またはボリュームマウント |
| stringData | Base64 エンコード不要で Secret を定義可能 |
| セキュリティ | Secret は Git にコミットしない。外部管理を検討 |

### チェックリスト

- [ ] ConfigMap と Secret の違いを説明できる
- [ ] ConfigMap のマニフェストを書ける
- [ ] Secret のマニフェストを書ける
- [ ] 環境変数としての注入方法を理解した

---

## 次のステップへ

次のセクションでは、kubectl コマンドの基本操作を学びます。
Kubernetes クラスタを操作するための必須コマンドを身につけましょう。

---

*推定読了時間: 25分*
