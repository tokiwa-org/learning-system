# API設計

本ドキュメントは、人事考課システムのREST API設計を定義します。

---

## 1. API基本情報

### 1.1 ベース設定

| 項目           | 値                                          |
| -------------- | ------------------------------------------- |
| ベースURL      | `https://evaluation-api.workers.dev/api/v1` |
| 認証           | Bearer Token (JWT)                          |
| レスポンス形式 | JSON                                        |

### 1.2 共通レスポンス形式

```typescript
// 成功時
{
  "success": true,
  "data": T
}

// エラー時
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ"
  }
}

// ページネーション
{
  "success": true,
  "data": T[],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "hasNext": boolean
  }
}
```

### 1.3 共通エラーコード

| コード             | HTTPステータス | 説明                 |
| ------------------ | -------------- | -------------------- |
| `UNAUTHORIZED`     | 401            | 認証エラー           |
| `FORBIDDEN`        | 403            | 権限不足             |
| `NOT_FOUND`        | 404            | リソースなし         |
| `VALIDATION_ERROR` | 400            | バリデーションエラー |
| `CONFLICT`         | 409            | 状態競合             |
| `INTERNAL_ERROR`   | 500            | サーバーエラー       |

---

## 2. 認証 API

### POST /auth/login

ログイン。

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "expiresAt": "2025-01-01T00:00:00Z",
    "user": {
      "id": "emp_001",
      "name": "田中太郎",
      "email": "tanaka@example.com",
      "role": "EMPLOYEE",
      "departmentId": "dept_001",
      "gradeId": "grade_L2"
    }
  }
}
```

### POST /auth/logout

ログアウト。

### GET /auth/me

現在のユーザー情報取得。

---

## 3. 評価期間 API

### GET /periods

評価期間一覧取得。

**Query Parameters:**

- `status`: `PREPARING` | `ACTIVE` | `CLOSED`
- `page`: number
- `limit`: number

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "period_2025",
      "name": "2025年度",
      "startDate": "2024-10-01",
      "endDate": "2025-09-30",
      "evaluationMonth": 9,
      "status": "ACTIVE"
    }
  ]
}
```

### GET /periods/:periodId

評価期間詳細取得。

### POST /periods (管理者のみ)

評価期間作成。

**Request:**

```json
{
  "name": "2025年度",
  "startDate": "2024-10-01",
  "endDate": "2025-09-30",
  "evaluationMonth": 9
}
```

### PUT /periods/:periodId/activate (管理者のみ)

評価期間を開始（PREPARING → ACTIVE）。ロードマップのスナップショットを作成。

### PUT /periods/:periodId/close (管理者のみ)

評価期間を終了（ACTIVE → CLOSED）。

---

## 4. 評価サイクル API

### GET /cycles

自分の評価サイクル一覧。

**Query Parameters:**

- `periodId`: string（必須）

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "cycle_001",
    "periodId": "period_2025",
    "employeeId": "emp_001",
    "status": "DRAFT",
    "currentStep": "SELF",
    "finalScore": null,
    "finalRank": null
  }
}
```

### GET /cycles/:cycleId

評価サイクル詳細取得。

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "cycle_001",
    "period": {
      "id": "period_2025",
      "name": "2025年度"
    },
    "employee": {
      "id": "emp_001",
      "name": "田中太郎"
    },
    "status": "SELF_SUBMITTED",
    "currentStep": "PEER",
    "selfEvaluation": {
      "id": "self_001",
      "submittedAt": "2025-09-10T10:00:00Z"
    },
    "peerEvaluations": [
      {
        "id": "peer_001",
        "evaluator": { "id": "emp_002", "name": "佐藤花子" },
        "submittedAt": "2025-09-12T10:00:00Z"
      }
    ],
    "managerEvaluation": null,
    "approvalHistory": [
      {
        "step": "SELF",
        "action": "SUBMIT",
        "actorId": "emp_001",
        "createdAt": "2025-09-10T10:00:00Z"
      }
    ]
  }
}
```

### GET /admin/cycles (管理者のみ)

全評価サイクル一覧。

**Query Parameters:**

- `periodId`: string
- `status`: string
- `departmentId`: string
- `page`: number
- `limit`: number

---

## 5. 自己評価 API

### GET /cycles/:cycleId/self-evaluation

自己評価取得。

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "self_001",
    "cycleId": "cycle_001",
    "comment": "今期は...",
    "scores": [
      {
        "roadmapItemId": "item_001",
        "roadmapItem": {
          "itemNumber": 1,
          "category": "SKILL",
          "title": "ITリテラシー"
        },
        "score": 4,
        "evidence": "〇〇研修を修了",
        "comment": ""
      }
    ],
    "submittedAt": null
  }
}
```

### PUT /cycles/:cycleId/self-evaluation

自己評価保存（下書き）。

**Request:**

```json
{
  "comment": "今期は...",
  "scores": [
    {
      "roadmapItemId": "item_001",
      "score": 4,
      "evidence": "〇〇研修を修了",
      "comment": ""
    }
  ]
}
```

### POST /cycles/:cycleId/self-evaluation/submit

自己評価提出。

**Request:**

```json
{
  "comment": "提出コメント"
}
```

---

## 6. 同僚評価 API

### GET /cycles/:cycleId/peer-evaluations

同僚評価一覧取得（評価対象者または管理者）。

> **注**: 同僚評価の個別操作は `/cycles/:cycleId/peer-evaluations/:peerId/*` に統合されました。

---

## 7. 上司評価 API

### GET /manager/cycles

部下の評価サイクル一覧。

**Query Parameters:**

- `periodId`: string
- `status`: string

### GET /cycles/:cycleId/manager-evaluation

上司評価取得。

### PUT /cycles/:cycleId/manager-evaluation

上司評価保存。

**Request:**

```json
{
  "scores": [
    {
      "roadmapItemId": "item_001",
      "score": 4,
      "comment": ""
    }
  ],
  "skillScore": 42.5,
  "competencyScore": 24.0,
  "behaviorScore": 16.5,
  "totalScore": 83.0,
  "rankSuggestion": "A",
  "overallComment": "今期は大きく成長した"
}
```

### POST /cycles/:cycleId/manager-evaluation/submit

上司評価提出。

### POST /cycles/:cycleId/approve

評価承認（上司/HR）。

**Request:**

```json
{
  "comment": "承認します"
}
```

### POST /cycles/:cycleId/reject

評価差戻し。

**Request:**

```json
{
  "comment": "〇〇の部分を再検討してください",
  "rejectToStep": "MANAGER"
}
```

---

## 8. HR評価確定 API

> **注**: HR承認機能は `/cycles/:cycleId/approve` および `/cycles/:cycleId/reject` に統合されました。
> `requireRole('HR', 'ADMIN')` でアクセス制御されます。

---

## 9. 社員 API

### GET /employees

社員一覧（管理者のみ）。

**Query Parameters:**

- `departmentId`: string
- `gradeId`: string
- `search`: string
- `page`: number
- `limit`: number

### GET /employees/:employeeId

社員詳細取得。

### PUT /employees/:employeeId (管理者のみ)

社員情報更新。

### GET /employees/:employeeId/achievements

社員のスキル達成状況。

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 82,
      "completed": 45,
      "inProgress": 10,
      "notStarted": 27
    },
    "byCategory": {
      "SKILL": { "total": 46, "completed": 30 },
      "COMPETENCY": { "total": 27, "completed": 10 },
      "BEHAVIOR": { "total": 9, "completed": 5 }
    },
    "items": [
      {
        "roadmapItem": {
          "id": "item_001",
          "itemNumber": 1,
          "title": "ITリテラシー",
          "category": "SKILL"
        },
        "status": "COMPLETED",
        "completedAt": "2025-05-01T00:00:00Z"
      }
    ]
  }
}
```

---

## 10. ロードマップ API

### GET /roadmap-items

ロードマップ項目一覧。

**Query Parameters:**

- `category`: `SKILL` | `COMPETENCY` | `BEHAVIOR`
- `gradeId`: string

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "item_001",
      "itemNumber": 1,
      "category": "SKILL",
      "categoryName": "スキル習得度",
      "subcategory": "共通",
      "title": "ITリテラシー",
      "description": "...",
      "levels": [
        {
          "gradeId": "grade_L1",
          "gradeCode": "L1",
          "requirement": "基本操作ができる",
          "isRequired": true
        }
      ]
    }
  ]
}
```

### GET /roadmap-items/:itemId

ロードマップ項目詳細。

### POST /roadmap-items/:itemId/achievements

達成状況更新。

**Request:**

```json
{
  "status": "COMPLETED",
  "evidence": "〇〇研修を修了"
}
```

---

## 11. 部署・職級 API

> **注**: 部署・職級のマスタデータは `/employees` エンドポイントのレスポンスに含まれるか、Admin APIで管理されます。

---

## 12. 通知 API

### GET /notifications

通知一覧。

**Query Parameters:**

- `unreadOnly`: boolean
- `page`: number
- `limit`: number

### PUT /notifications/:notificationId/read

既読にする。

### PUT /notifications/read-all

全て既読にする。

---

## 13. ダッシュボード API

### GET /dashboard

ダッシュボードデータ。

**Response:**

```json
{
  "success": true,
  "data": {
    "currentPeriod": {
      "id": "period_2025",
      "name": "2025年度",
      "status": "ACTIVE"
    },
    "myCycle": {
      "id": "cycle_001",
      "status": "DRAFT",
      "currentStep": "SELF"
    },
    "pendingPeerEvaluations": 2,
    "subordinateCycles": [
      {
        "employeeId": "emp_002",
        "employeeName": "佐藤花子",
        "status": "PEER_COMPLETED",
        "awaitsAction": true
      }
    ],
    "notifications": [
      {
        "id": "notif_001",
        "title": "自己評価の提出依頼",
        "createdAt": "2025-09-01T00:00:00Z"
      }
    ]
  }
}
```

### GET /admin/dashboard (管理者のみ)

管理者ダッシュボード。

**Response:**

```json
{
  "success": true,
  "data": {
    "currentPeriod": { ... },
    "cycleStats": {
      "total": 50,
      "byStatus": {
        "DRAFT": 5,
        "SELF_SUBMITTED": 10,
        "PEER_COMPLETED": 15,
        "MANAGER_SUBMITTED": 10,
        "MANAGER_APPROVED": 5,
        "HR_APPROVED": 3,
        "FINALIZED": 2
      }
    },
    "departmentProgress": [
      {
        "departmentId": "dept_001",
        "departmentName": "開発部",
        "total": 20,
        "completed": 5
      }
    ]
  }
}
```

---

## 14. 昇格 API

> **注**: 昇格機能は将来バージョンで実装予定です。

---

## 15. エクスポート API

### GET /export/evaluations (管理者のみ)

評価データエクスポート。

**Query Parameters:**

- `periodId`: string
- `format`: `csv` | `excel`

---

## 16. 監査ログ API

### GET /admin/audit-logs (管理者のみ)

監査ログ取得。

**Query Parameters:**

- `userId`: string
- `entityType`: string
- `startDate`: string
- `endDate`: string
- `page`: number
- `limit`: number

---

## 17. シナリオ（文章題）API

### GET /scenarios (HR・管理者のみ)

文章題一覧取得。

**Query Parameters:**

- `targetGrade`: string (対象職級でフィルタ)
- `status`: `DRAFT` | `ACTIVE` | `ARCHIVED`
- `page`: number
- `limit`: number

### GET /scenarios/:id (HR・管理者のみ)

文章題詳細取得。

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "scn_001",
    "title": "バグ調査シナリオ",
    "description": "先輩から引き継いだコードにバグがあります...",
    "targetGrades": ["G1", "G2"],
    "skillCategory": "デバッグ",
    "difficulty": "BEGINNER",
    "status": "ACTIVE",
    "createdBy": "emp_hr_001",
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

### POST /scenarios (HR・管理者のみ)

文章題作成。

**Request:**

```json
{
  "title": "API設計シナリオ",
  "description": "新機能の設計を任されました...",
  "targetGrades": ["G3"],
  "skillCategory": "設計",
  "difficulty": "INTERMEDIATE"
}
```

### PUT /scenarios/:id (HR・管理者のみ)

文章題更新。

### DELETE /scenarios/:id (管理者のみ)

文章題削除。

### POST /scenarios/:id/questions (HR・管理者のみ)

設問追加。

**Request:**

```json
{
  "questionNumber": 1,
  "questionType": "MULTIPLE_CHOICE",
  "questionText": "この問題の答えは？",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A",
  "explanation": "解説...",
  "points": 10,
  "relatedRoadmapItems": ["item_001"]
}
```

### POST /scenarios/:id/review (HR・管理者のみ)

シナリオレビュー。

**Request:**

```json
{
  "approved": true,
  "comment": "内容を確認しました"
}
```

### POST /scenarios/:id/publish (HR・管理者のみ)

シナリオ公開。ステータスをPUBLISHEDに変更。

### POST /scenarios/:id/generate-curriculum (HR・管理者のみ)

文章題からカリキュラムを自動生成。

**Request:**

```json
{
  "targetGradeId": "grade_G2",
  "includeNoise": true,
  "noiseType": "SEARCH_POLLUTION"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "curriculumId": "cur_001",
    "title": "AWS基礎マスターコース",
    "chapters": [...],
    "estimatedHours": 12,
    "status": "GENERATED"
  }
}
```

---

## 18. カリキュラムAPI

### GET /curriculums

カリキュラム一覧取得。

**Query Parameters:**

- `scenarioId`: string
- `status`: `DRAFT` | `GENERATED` | `REVIEWED` | `PUBLISHED` | `ARCHIVED`
- `learningPhase`: string
- `page`: number
- `limit`: number

### POST /curriculums (HR・管理者のみ)

カリキュラム作成。

**Request:**

```json
{
  "scenarioId": "scn_001",
  "name": "AWS基礎マスターコース",
  "description": "AWSの基本を学ぶコース",
  "targetGrades": ["G1", "G2"],
  "learningPhase": "入門",
  "estimatedHours": 12
}
```

### GET /curriculums/my-assignments

自分に割り当てられたカリキュラム一覧。

### GET /curriculums/:id

カリキュラム詳細取得（項目含む）。

### PUT /curriculums/:id (HR・管理者のみ)

カリキュラム更新。

### POST /curriculums/:id/review (HR・管理者のみ)

カリキュラムレビュー。

**Request:**

```json
{
  "approved": true,
  "comment": "内容を確認しました"
}
```

### POST /curriculums/:id/publish (HR・管理者のみ)

カリキュラム公開。

### POST /curriculums/:id/assign (HR・管理者・マネージャー)

カリキュラム割り当て。

**Request:**

```json
{
  "employeeId": "emp_001",
  "deadline": "2026-03-31",
  "passThreshold": 70
}
```

### GET /curriculums/:id/progress

自分の学習進捗取得。

**Response:**

```json
{
  "success": true,
  "data": {
    "curriculumId": "cur_001",
    "assignmentId": "assign_001",
    "progress": 45,
    "status": "IN_PROGRESS",
    "progressItems": [...]
  }
}
```

### PUT /curriculums/:id/progress

学習進捗更新。

**Request:**

```json
{
  "curriculumItemId": "item_003",
  "status": "COMPLETED",
  "score": 85,
  "maxScore": 100,
  "timeSpentMinutes": 30
}
```

### POST /curriculums/:id/complete

カリキュラム完了処理。

**Request:**

```json
{
  "totalScore": 85
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "curriculumId": "cur_001",
    "assignmentId": "assign_001",
    "status": "COMPLETED",
    "totalScore": 85,
    "isPassed": true
  }
}
```

---

## 19. エンドポイント一覧

| Method | Path                                       | 説明                 | 権限                |
| ------ | ------------------------------------------ | -------------------- | ------------------- |
| POST   | /auth/login                                | ログイン             | -                   |
| POST   | /auth/logout                               | ログアウト           | All                 |
| GET    | /auth/me                                   | 自分の情報           | All                 |
| GET    | /periods                                   | 評価期間一覧         | All                 |
| GET    | /periods/:periodId                         | 評価期間詳細         | All                 |
| POST   | /periods                                   | 評価期間作成         | Admin               |
| PUT    | /periods/:periodId/activate                | 評価期間開始         | Admin               |
| PUT    | /periods/:periodId/close                   | 評価期間終了         | Admin               |
| GET    | /cycles                                    | 自分の評価サイクル   | All                 |
| GET    | /cycles/:cycleId                           | 評価サイクル詳細     | Owner/Manager/Admin |
| GET    | /admin/cycles                              | 全評価サイクル       | Admin               |
| GET    | /cycles/:cycleId/self-evaluation           | 自己評価取得         | Owner/Manager/Admin |
| PUT    | /cycles/:cycleId/self-evaluation           | 自己評価保存         | Owner               |
| POST   | /cycles/:cycleId/self-evaluation/submit    | 自己評価提出         | Owner               |
| GET    | /cycles/:cycleId/peer-evaluations          | 同僚評価一覧         | Owner/Admin         |
| GET    | /manager/cycles                            | 部下の評価一覧       | Manager             |
| GET    | /cycles/:cycleId/manager-evaluation        | 上司評価取得         | Manager/Admin       |
| PUT    | /cycles/:cycleId/manager-evaluation        | 上司評価保存         | Manager             |
| POST   | /cycles/:cycleId/manager-evaluation/submit | 上司評価提出         | Manager             |
| POST   | /cycles/:cycleId/approve                   | 評価承認             | Manager/HR/Admin    |
| POST   | /cycles/:cycleId/reject                    | 評価差戻し           | Manager/HR/Admin    |
| GET    | /employees                                 | 社員一覧             | Admin               |
| GET    | /employees/:id                             | 社員詳細             | Self/Manager/Admin  |
| GET    | /employees/:id/achievements                | 達成状況             | Self/Manager/Admin  |
| GET    | /employees/:id/learning-progress           | 学習進捗取得         | Self/Manager/Admin  |
| GET    | /roadmap-items                             | ロードマップ一覧     | All                 |
| POST   | /roadmap-items/:id/achievements            | 達成更新             | Self                |
| GET    | /notifications                             | 通知一覧             | All                 |
| GET    | /dashboard                                 | ダッシュボード       | All                 |
| GET    | /admin/dashboard                           | 管理者ダッシュボード | Admin               |
| GET    | /admin/settings                            | システム設定取得     | Admin               |
| PUT    | /admin/settings                            | システム設定更新     | Admin               |
| GET    | /admin/statistics                          | システム統計         | Admin               |
| GET    | /admin/audit-logs                          | 監査ログ             | Admin               |
| POST   | /admin/export                              | エクスポート開始     | Admin               |
| GET    | /admin/export/:jobId                       | エクスポート状態     | Admin               |
| GET    | /scenarios                                 | 文章題一覧           | HR/Admin            |
| GET    | /scenarios/:id                             | 文章題詳細           | HR/Admin            |
| POST   | /scenarios                                 | 文章題作成           | HR/Admin            |
| PUT    | /scenarios/:id                             | 文章題更新           | HR/Admin            |
| DELETE | /scenarios/:id                             | 文章題削除           | Admin               |
| POST   | /scenarios/:id/questions                   | 設問追加             | HR/Admin            |
| POST   | /scenarios/:id/review                      | シナリオレビュー     | HR/Admin            |
| POST   | /scenarios/:id/publish                     | シナリオ公開         | HR/Admin            |
| POST   | /scenarios/:id/generate-curriculum         | カリキュラム生成     | HR/Admin            |
| GET    | /curriculums                               | カリキュラム一覧     | All (PUBLISHED のみ)|
| POST   | /curriculums                               | カリキュラム作成     | HR/Admin            |
| GET    | /curriculums/my-assignments                | 自分の割り当て       | All                 |
| GET    | /curriculums/:id                           | カリキュラム詳細     | All (PUBLISHED のみ)|
| PUT    | /curriculums/:id                           | カリキュラム更新     | HR/Admin            |
| POST   | /curriculums/:id/review                    | カリキュラムレビュー | HR/Admin            |
| POST   | /curriculums/:id/publish                   | カリキュラム公開     | HR/Admin            |
| POST   | /curriculums/:id/assign                    | カリキュラム割り当て | HR/Admin/Manager    |
| GET    | /curriculums/:id/progress                  | 学習進捗取得         | Self                |
| PUT    | /curriculums/:id/progress                  | 学習進捗更新         | Self                |
| POST   | /curriculums/:id/complete                  | カリキュラム完了     | Self                |

---

_トキワテック人事考課システム 2026年度版_
