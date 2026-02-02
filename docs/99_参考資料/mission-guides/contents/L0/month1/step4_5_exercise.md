# 演習：プロジェクト内を検索

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 4
subStep: 5
title: "演習：プロジェクト内を検索"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "OS基本コマンド"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「実際の開発では、大量のファイルから必要な情報を探すことが多いんだ」
>
> 「findとgrepを使いこなせれば、効率的に探せますね」
>
> 「そう！今日はサンプルプロジェクトを使って実践してみよう」

---

## 準備：サンプルプロジェクトの作成

```bash
cd ~
rm -rf search-exercise
mkdir -p search-exercise
cd search-exercise

# プロジェクト構造を作成
mkdir -p webapp/{src/{controllers,models,views},tests,config,logs}

# コントローラーファイル
cat > webapp/src/controllers/user_controller.py << 'EOF'
"""User controller module"""
from models.user import User

class UserController:
    def __init__(self):
        self.model = User()

    def get_user(self, user_id):
        # TODO: implement caching
        return self.model.find(user_id)

    def create_user(self, data):
        # TODO: add validation
        return self.model.create(data)

    def delete_user(self, user_id):
        # FIXME: check permissions first
        return self.model.delete(user_id)
EOF

cat > webapp/src/controllers/product_controller.py << 'EOF'
"""Product controller module"""
from models.product import Product

class ProductController:
    def __init__(self):
        self.model = Product()

    def list_products(self):
        return self.model.all()

    def get_product(self, product_id):
        # TODO: add error handling
        return self.model.find(product_id)
EOF

# モデルファイル
cat > webapp/src/models/user.py << 'EOF'
"""User model module"""

class User:
    def find(self, user_id):
        # Database query
        pass

    def create(self, data):
        # Insert into database
        pass

    def delete(self, user_id):
        # Delete from database
        pass
EOF

cat > webapp/src/models/product.py << 'EOF'
"""Product model module"""

class Product:
    def all(self):
        # Return all products
        pass

    def find(self, product_id):
        # Find product by ID
        pass
EOF

# ビューファイル
cat > webapp/src/views/user_view.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>User Profile</title>
</head>
<body>
    <h1>User Profile</h1>
    <!-- TODO: add avatar -->
    <div class="user-info">
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
    </div>
</body>
</html>
EOF

cat > webapp/src/views/product_view.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Product Details</title>
</head>
<body>
    <h1>{{ product.name }}</h1>
    <p>Price: {{ product.price }}</p>
    <!-- FIXME: image not displaying -->
</body>
</html>
EOF

# テストファイル
cat > webapp/tests/test_user.py << 'EOF'
"""User tests"""
import unittest
from src.controllers.user_controller import UserController

class TestUserController(unittest.TestCase):
    def setUp(self):
        self.controller = UserController()

    def test_get_user(self):
        # TODO: implement test
        pass

    def test_create_user(self):
        # TODO: implement test
        pass
EOF

cat > webapp/tests/test_product.py << 'EOF'
"""Product tests"""
import unittest
from src.controllers.product_controller import ProductController

class TestProductController(unittest.TestCase):
    def setUp(self):
        self.controller = ProductController()

    def test_list_products(self):
        result = self.controller.list_products()
        self.assertIsNotNone(result)
EOF

# 設定ファイル
cat > webapp/config/database.yml << 'EOF'
development:
  host: localhost
  port: 5432
  database: webapp_dev
  username: dev_user
  password: dev_password

production:
  host: db.example.com
  port: 5432
  database: webapp_prod
  username: prod_user
  password: prod_password
EOF

cat > webapp/config/app.json << 'EOF'
{
  "name": "WebApp",
  "version": "1.0.0",
  "debug": true,
  "port": 8080,
  "log_level": "INFO"
}
EOF

# ログファイル
cat > webapp/logs/app.log << 'EOF'
2026-01-27 10:00:01 INFO  Application started on port 8080
2026-01-27 10:00:05 INFO  Database connection established
2026-01-27 10:01:15 INFO  User login: user001
2026-01-27 10:02:30 WARN  Slow query detected: 3.2s
2026-01-27 10:03:00 INFO  Product viewed: product_123
2026-01-27 10:05:45 ERROR Database connection timeout
2026-01-27 10:05:50 INFO  Retrying database connection
2026-01-27 10:05:55 INFO  Database connection restored
2026-01-27 10:10:00 INFO  User logout: user001
2026-01-27 10:15:30 WARN  High memory usage: 82%
2026-01-27 10:20:00 ERROR File not found: /uploads/image.png
2026-01-27 10:25:00 INFO  Backup completed
2026-01-27 10:30:00 ERROR Authentication failed for user: hacker
2026-01-27 10:35:00 INFO  User login: user002
2026-01-27 10:40:00 INFO  Product purchased: product_456
EOF

# READMEファイル
cat > webapp/README.md << 'EOF'
# WebApp Project

A sample web application for learning.

## Setup

1. Install dependencies
2. Configure database
3. Run the application

## TODO

- Add user authentication
- Implement product search
- Write more tests
EOF

echo "サンプルプロジェクトを作成しました！"
find webapp -type f
```

---

## Mission 1: ファイルを探す（find）

### タスク 1-1: すべてのPythonファイルを探す

webappディレクトリ内のすべての `.py` ファイルを見つけてください。

<details>
<summary>ヒント</summary>

```bash
find webapp -name "*.py"
```

</details>

<details>
<summary>解答</summary>

```bash
find webapp -name "*.py"
```

出力例：
```
webapp/src/controllers/user_controller.py
webapp/src/controllers/product_controller.py
webapp/src/models/user.py
webapp/src/models/product.py
webapp/tests/test_user.py
webapp/tests/test_product.py
```

</details>

---

### タスク 1-2: テストファイルだけを探す

`test_` で始まるファイルを見つけてください。

<details>
<summary>解答</summary>

```bash
find webapp -name "test_*.py"
```

</details>

---

### タスク 1-3: 設定ファイルを探す

`.yml` または `.json` ファイルを見つけてください。

<details>
<summary>ヒント</summary>

`-o` オプションでOR条件を指定できます。

</details>

<details>
<summary>解答</summary>

```bash
find webapp -name "*.yml" -o -name "*.json"
```

</details>

---

### タスク 1-4: HTMLファイルの場所を特定

HTMLファイルがどこにあるか見つけてください。

<details>
<summary>解答</summary>

```bash
find webapp -name "*.html"
```

出力：
```
webapp/src/views/user_view.html
webapp/src/views/product_view.html
```

</details>

---

## Mission 2: 文字列を検索（grep）

### タスク 2-1: TODOコメントを探す

プロジェクト内のすべてのTODOコメントを見つけてください。

<details>
<summary>解答</summary>

```bash
grep -r "TODO" webapp/
```

</details>

---

### タスク 2-2: FIXMEコメントを探す（行番号付き）

FIXMEコメントを行番号付きで見つけてください。

<details>
<summary>解答</summary>

```bash
grep -rn "FIXME" webapp/
```

</details>

---

### タスク 2-3: ログのエラーを確認

ログファイルからすべてのERRORを見つけ、前後1行も表示してください。

<details>
<summary>解答</summary>

```bash
grep -C 1 "ERROR" webapp/logs/app.log
```

</details>

---

### タスク 2-4: パスワードを含むファイル

「password」という文字列を含むファイルを見つけてください（セキュリティチェック）。

<details>
<summary>解答</summary>

```bash
grep -rl "password" webapp/
```

出力：
```
webapp/config/database.yml
```

</details>

---

### タスク 2-5: ポート番号を探す

「port」という設定を含む行を探してください。

<details>
<summary>解答</summary>

```bash
grep -rn "port" webapp/config/
```

</details>

---

## Mission 3: findとgrepの組み合わせ

### タスク 3-1: Pythonファイル内のTODOを検索

`.py` ファイル内のTODOコメントだけを探してください。

<details>
<summary>ヒント</summary>

findの `-exec` オプションでgrepを実行します。

</details>

<details>
<summary>解答</summary>

```bash
find webapp -name "*.py" -exec grep -l "TODO" {} \;
```

または

```bash
grep -r --include="*.py" "TODO" webapp/
```

</details>

---

### タスク 3-2: HTMLファイル内のコメントを検索

HTMLファイル内のコメント（`<!--`）を探してください。

<details>
<summary>解答</summary>

```bash
grep -r --include="*.html" "<!--" webapp/
```

</details>

---

### タスク 3-3: コントローラーファイルのclassを探す

`controller` を含むファイル内の `class` 定義を探してください。

<details>
<summary>解答</summary>

```bash
grep -rn "class" webapp/src/controllers/
```

</details>

---

## Mission 4: 統計を取る

### タスク 4-1: TODO/FIXMEの数を数える

プロジェクト全体でTODOとFIXMEがそれぞれいくつあるか数えてください。

<details>
<summary>解答</summary>

```bash
echo "TODO count:"
grep -r "TODO" webapp/ | wc -l

echo "FIXME count:"
grep -r "FIXME" webapp/ | wc -l
```

</details>

---

### タスク 4-2: ファイル種類ごとの数

`.py`、`.html`、`.yml`、`.json` ファイルがそれぞれいくつあるか数えてください。

<details>
<summary>解答</summary>

```bash
echo "Python files:"
find webapp -name "*.py" | wc -l

echo "HTML files:"
find webapp -name "*.html" | wc -l

echo "YAML files:"
find webapp -name "*.yml" | wc -l

echo "JSON files:"
find webapp -name "*.json" | wc -l
```

</details>

---

### タスク 4-3: ログレベルの集計

ログファイル内のINFO、WARN、ERRORの数を数えてください。

<details>
<summary>解答</summary>

```bash
echo "INFO:"
grep -c "INFO" webapp/logs/app.log

echo "WARN:"
grep -c "WARN" webapp/logs/app.log

echo "ERROR:"
grep -c "ERROR" webapp/logs/app.log
```

</details>

---

## Mission 5: 実践シナリオ

### シナリオ5-1: セキュリティ監査

ハードコードされた認証情報を探してください。
「password」「secret」「key」を含むファイルを見つけましょう。

<details>
<summary>解答</summary>

```bash
grep -rE "(password|secret|key)" webapp/config/
```

</details>

---

### シナリオ5-2: ログ分析

ログから異常を検出してください。
エラーと警告を時系列で表示しましょう。

<details>
<summary>解答</summary>

```bash
grep -E "(ERROR|WARN)" webapp/logs/app.log
```

</details>

---

### シナリオ5-3: コードレビュー準備

レビューが必要な箇所（TODO/FIXME）をファイルごとにリストアップしてください。

<details>
<summary>解答</summary>

```bash
grep -rn -E "(TODO|FIXME)" webapp/src/
```

</details>

---

## 達成度チェック

| Mission | タスク | 完了 |
|---------|--------|------|
| 1 | すべてのPythonファイルを探す | [ ] |
| 1 | テストファイルを探す | [ ] |
| 1 | 設定ファイルを探す | [ ] |
| 2 | TODOを検索 | [ ] |
| 2 | ERRORを前後行付きで検索 | [ ] |
| 2 | パスワードを含むファイルを検索 | [ ] |
| 3 | Pythonファイル内のTODO | [ ] |
| 4 | TODO/FIXMEの数を数える | [ ] |
| 5 | セキュリティ監査 | [ ] |
| 5 | ログ分析 | [ ] |

**8個以上クリア** → 合格！

---

## クリーンアップ

```bash
cd ~
rm -rf search-exercise
rm -rf find-practice
```

---

## まとめ

この演習で使ったコマンド：

| コマンド | 用途 |
|----------|------|
| `find -name` | ファイル名で検索 |
| `find -type f/d` | ファイル/ディレクトリだけ検索 |
| `grep -r` | 再帰的に文字列検索 |
| `grep -n` | 行番号付きで検索 |
| `grep -l` | ファイル名のみ表示 |
| `grep -c` | マッチ数をカウント |
| `grep -E` | 複数パターンで検索 |
| `grep --include` | 特定のファイルのみ検索 |

---

## 次のステップへ

検索コマンドの演習お疲れさまでした！

次のセクションでは、Step 4の理解度チェックです。
クイズに挑戦して、学んだことを振り返りましょう！

---

*推定所要時間: 90分*
