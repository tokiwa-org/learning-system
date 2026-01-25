# API仕様書

このディレクトリには人事考課システムのAPI仕様書が含まれています。

## ファイル構成

- `openapi.yaml` - OpenAPI 3.1仕様書（54エンドポイント）

## API概要

### エンドポイント数

| カテゴリ | エンドポイント数 |
|---------|-----------------|
| 認証 | 3 |
| 評価期間 | 5 |
| 評価サイクル | 3 |
| 自己評価 | 3 |
| 同僚評価 | 5 |
| 上司評価 | 6 |
| HR | 5 |
| 社員管理 | 5 |
| ロードマップ | 3 |
| 組織 | 2 |
| 通知 | 3 |
| ダッシュボード | 2 |
| シナリオ | 5 |
| カリキュラム | 2 |
| エクスポート | 1 |
| 管理者機能 | 3 |
| **合計** | **56** |

## 使用方法

### Swagger UIでの確認

```bash
# ローカルでSwagger UIを起動
npx @redocly/cli preview-docs docs/03_API仕様/openapi.yaml

# または
docker run -p 8080:8080 -e SWAGGER_JSON=/openapi.yaml -v $(pwd)/docs/03_API仕様/openapi.yaml:/openapi.yaml swaggerapi/swagger-ui
```

### APIクライアント生成

```bash
# TypeScript (fetch)
npx openapi-generator-cli generate \
  -i docs/03_API仕様/openapi.yaml \
  -g typescript-fetch \
  -o src/generated/api

# TypeScript (axios)
npx openapi-generator-cli generate \
  -i docs/03_API仕様/openapi.yaml \
  -g typescript-axios \
  -o src/generated/api
```

### バリデーション

```bash
# OpenAPI仕様のバリデーション
npx @redocly/cli lint docs/03_API仕様/openapi.yaml

# Spectral（より詳細なルールチェック）
npx @stoplight/spectral-cli lint docs/03_API仕様/openapi.yaml
```

## 認証

### Cloudflare Access認証

全てのAPIリクエストには `Authorization: Bearer <token>` ヘッダーが必要です。

```bash
# 例: 評価期間一覧取得
curl -X GET "https://evaluation.tokiwa-tech.com/api/v1/periods" \
  -H "Authorization: Bearer <CF_ACCESS_TOKEN>"
```

### ロールと権限

| ロール | 説明 | アクセス可能なAPI |
|-------|------|------------------|
| EMPLOYEE | 一般社員 | 自己評価、割当同僚評価、ダッシュボード |
| MANAGER | 管理職 | 上記 + 部下の評価、承認 |
| HR | 人事 | 上記 + HR承認、昇格、シナリオ管理 |
| ADMIN | 管理者 | 全API |

## 主要なワークフロー

### 評価サイクルの状態遷移

```
DRAFT → SELF_SUBMITTED → PEER_COMPLETED → MANAGER_SUBMITTED
→ MANAGER_APPROVED → HR_APPROVED → FINALIZED
                ↓ (差戻し)
            REJECTED
```

### APIコール例

#### 1. 自己評価の提出

```bash
# 1. 自己評価を保存（下書き）
curl -X PUT "https://evaluation.tokiwa-tech.com/api/v1/cycles/{cycleId}/self-evaluation" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "今期は...",
    "scores": [
      {"roadmapItemId": "item_001", "score": 4, "evidence": "研修修了"}
    ]
  }'

# 2. 自己評価を提出
curl -X POST "https://evaluation.tokiwa-tech.com/api/v1/cycles/{cycleId}/self-evaluation/submit" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"comment": "提出します"}'
```

#### 2. 評価の承認

```bash
# 上司による承認
curl -X POST "https://evaluation.tokiwa-tech.com/api/v1/cycles/{cycleId}/approve" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"comment": "承認します"}'

# 差戻し
curl -X POST "https://evaluation.tokiwa-tech.com/api/v1/cycles/{cycleId}/reject" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"comment": "再確認してください", "rejectToStep": "MANAGER"}'
```

## エラーレスポンス

### 共通エラーコード

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| UNAUTHORIZED | 401 | 認証エラー |
| FORBIDDEN | 403 | 権限不足 |
| NOT_FOUND | 404 | リソースなし |
| VALIDATION_ERROR | 400 | バリデーションエラー |
| CONFLICT | 409 | 状態競合 |
| INTERNAL_ERROR | 500 | サーバーエラー |

### エラーレスポンス形式

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "スコアは1〜5の範囲で入力してください"
  }
}
```

## ページネーション

リスト系APIはoffset/limit方式のページネーションをサポート。

### パラメータ

- `page`: ページ番号（1始まり、デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 20、最大: 100）

### レスポンス

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "hasNext": true
  }
}
```

## 更新履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.0.0 | 2026-01-24 | 初版リリース |

---

_トキワテック人事考課システム 2026年度版_
