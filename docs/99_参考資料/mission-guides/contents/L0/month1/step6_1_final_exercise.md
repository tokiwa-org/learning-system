# 総合演習：ターミナル卒業試験

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 6
subStep: 1
title: "総合演習：ターミナル卒業試験"
itemType: EXERCISE
estimatedMinutes: 180
noiseLevel: MINIMAL
roadmap:
  skill: "OS基本コマンド"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「ここまでよく頑張ったね。いよいよ卒業試験だ」
>
> 「緊張します...」
>
> 「大丈夫。これまで学んだことを使えば解けるよ。実際の開発シナリオをベースにしているから、実践的な力が試されるよ」
>
> 「やってみます！」

---

## 試験概要

- **制限時間**: 180分（目安）
- **合格基準**: 全8ミッションのうち6ミッション以上クリア
- **ルール**:
  - インターネット検索OK
  - `man` コマンドでヘルプを見てOK
  - 何度やり直してもOK

---

## 準備

まず、演習用の環境を作成します。

```bash
cd ~
rm -rf final-exam
mkdir final-exam
cd final-exam

echo "準備完了！試験を開始してください。"
```

---

## Mission 1: プロジェクト構造を作成 (15分)

### 課題

以下のディレクトリ構造を作成してください。

```
webapp/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── views/
│   └── utils/
├── tests/
│   ├── unit/
│   └── integration/
├── config/
├── logs/
├── docs/
└── scripts/
```

### 確認コマンド

```bash
find webapp -type d | sort
```

<details>
<summary>解答</summary>

```bash
mkdir -p webapp/{src/{controllers,models,views,utils},tests/{unit,integration},config,logs,docs,scripts}

# 確認
find webapp -type d | sort
```

</details>

---

## Mission 2: ファイルを作成 (20分)

### 課題

以下のファイルを作成してください。

**src/controllers/user_controller.py**
```python
"""User Controller"""
# TODO: implement user authentication

class UserController:
    def get_user(self, user_id):
        pass

    def create_user(self, data):
        # FIXME: validate input data
        pass
```

**src/models/user.py**
```python
"""User Model"""

class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
```

**config/settings.json**
```json
{
  "app_name": "WebApp",
  "version": "1.0.0",
  "debug": true,
  "port": 8080
}
```

**scripts/deploy.sh**
```bash
#!/bin/bash
echo "Starting deployment..."
echo "Deployment complete!"
```

**README.md** (webapp直下)
```markdown
# WebApp Project

A sample web application.

## TODO
- Add authentication
- Add database connection
```

### 確認コマンド

```bash
find webapp -type f
```

<details>
<summary>解答</summary>

```bash
# user_controller.py
cat > webapp/src/controllers/user_controller.py << 'EOF'
"""User Controller"""
# TODO: implement user authentication

class UserController:
    def get_user(self, user_id):
        pass

    def create_user(self, data):
        # FIXME: validate input data
        pass
EOF

# user.py
cat > webapp/src/models/user.py << 'EOF'
"""User Model"""

class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
EOF

# settings.json
cat > webapp/config/settings.json << 'EOF'
{
  "app_name": "WebApp",
  "version": "1.0.0",
  "debug": true,
  "port": 8080
}
EOF

# deploy.sh
cat > webapp/scripts/deploy.sh << 'EOF'
#!/bin/bash
echo "Starting deployment..."
echo "Deployment complete!"
EOF

# README.md
cat > webapp/README.md << 'EOF'
# WebApp Project

A sample web application.

## TODO
- Add authentication
- Add database connection
EOF

# 確認
find webapp -type f
```

</details>

---

## Mission 3: ログファイルを作成・分析 (25分)

### 課題 3-1: ログファイルを作成

`webapp/logs/app.log` に以下の内容を作成してください。

```
2026-01-28 09:00:00 INFO  Application started
2026-01-28 09:00:05 INFO  Database connected
2026-01-28 09:01:00 INFO  User login: user001
2026-01-28 09:02:30 WARN  Slow query detected: 2.5s
2026-01-28 09:03:00 INFO  User login: user002
2026-01-28 09:05:00 ERROR Database connection lost
2026-01-28 09:05:10 INFO  Reconnecting to database
2026-01-28 09:05:15 INFO  Database reconnected
2026-01-28 09:10:00 WARN  High memory usage: 85%
2026-01-28 09:15:00 ERROR File not found: /data/missing.txt
2026-01-28 09:20:00 INFO  User logout: user001
2026-01-28 09:25:00 INFO  User login: user003
2026-01-28 09:30:00 ERROR Authentication failed: invalid_user
2026-01-28 09:35:00 INFO  Backup started
2026-01-28 09:40:00 INFO  Backup completed
2026-01-28 09:45:00 WARN  Disk space low: 10% remaining
2026-01-28 09:50:00 INFO  User logout: user002
2026-01-28 09:55:00 INFO  Maintenance mode enabled
2026-01-28 10:00:00 INFO  Application shutdown
```

<details>
<summary>解答</summary>

```bash
cat > webapp/logs/app.log << 'EOF'
2026-01-28 09:00:00 INFO  Application started
2026-01-28 09:00:05 INFO  Database connected
2026-01-28 09:01:00 INFO  User login: user001
2026-01-28 09:02:30 WARN  Slow query detected: 2.5s
2026-01-28 09:03:00 INFO  User login: user002
2026-01-28 09:05:00 ERROR Database connection lost
2026-01-28 09:05:10 INFO  Reconnecting to database
2026-01-28 09:05:15 INFO  Database reconnected
2026-01-28 09:10:00 WARN  High memory usage: 85%
2026-01-28 09:15:00 ERROR File not found: /data/missing.txt
2026-01-28 09:20:00 INFO  User logout: user001
2026-01-28 09:25:00 INFO  User login: user003
2026-01-28 09:30:00 ERROR Authentication failed: invalid_user
2026-01-28 09:35:00 INFO  Backup started
2026-01-28 09:40:00 INFO  Backup completed
2026-01-28 09:45:00 WARN  Disk space low: 10% remaining
2026-01-28 09:50:00 INFO  User logout: user002
2026-01-28 09:55:00 INFO  Maintenance mode enabled
2026-01-28 10:00:00 INFO  Application shutdown
EOF
```

</details>

### 課題 3-2: ログを分析

以下の質問に答えてください。

1. ログは全部で何行ありますか？
2. ERRORは何件ありますか？
3. WARNは何件ありますか？
4. エラーの前後1行を含めて表示してください
5. 09:00〜09:10の間のログだけを表示してください

<details>
<summary>解答</summary>

```bash
# 1. 行数
wc -l webapp/logs/app.log
# 答え: 19行

# 2. ERRORの数
grep -c "ERROR" webapp/logs/app.log
# 答え: 3件

# 3. WARNの数
grep -c "WARN" webapp/logs/app.log
# 答え: 3件

# 4. エラーの前後1行
grep -C 1 "ERROR" webapp/logs/app.log

# 5. 09:00〜09:10のログ
grep "09:0[0-9]" webapp/logs/app.log
```

</details>

---

## Mission 4: ファイルを検索 (20分)

### 課題

1. webapp内のすべての `.py` ファイルを探してください
2. webapp内のすべての `.json` ファイルを探してください
3. `TODO` を含むファイルを探してください（ファイル名のみ表示）
4. `FIXME` を含む行を行番号付きで表示してください
5. `class` という文字列を含むPythonファイルを探してください

<details>
<summary>解答</summary>

```bash
# 1. .pyファイル
find webapp -name "*.py"

# 2. .jsonファイル
find webapp -name "*.json"

# 3. TODOを含むファイル名
grep -rl "TODO" webapp/

# 4. FIXMEを行番号付きで
grep -rn "FIXME" webapp/

# 5. classを含むPythonファイル
grep -l "class" webapp/src/**/*.py
# または
find webapp -name "*.py" -exec grep -l "class" {} \;
```

</details>

---

## Mission 5: ファイルを表示・操作 (20分)

### 課題

1. `webapp/logs/app.log` の先頭5行を表示してください
2. `webapp/logs/app.log` の末尾5行を表示してください
3. `webapp/logs/app.log` の行数、単語数、バイト数を表示してください
4. `webapp/config/settings.json` の内容を行番号付きで表示してください
5. `webapp/README.md` を `less` で開き、「TODO」を検索して閉じてください

<details>
<summary>解答</summary>

```bash
# 1. 先頭5行
head -n 5 webapp/logs/app.log

# 2. 末尾5行
tail -n 5 webapp/logs/app.log

# 3. 行数、単語数、バイト数
wc webapp/logs/app.log

# 4. 行番号付きで表示
cat -n webapp/config/settings.json

# 5. lessで検索
less webapp/README.md
# /TODO と入力してEnter
# q で終了
```

</details>

---

## Mission 6: 権限を設定 (25分)

### 課題

以下の権限を設定してください。

| ファイル/ディレクトリ | 権限 | 説明 |
|----------------------|------|------|
| `webapp/scripts/deploy.sh` | 755 | 実行可能スクリプト |
| `webapp/config/settings.json` | 640 | 設定ファイル（グループまで読み取り可） |
| `webapp/logs/app.log` | 644 | ログファイル（誰でも読み取り可） |

### 確認

設定後、`ls -l` で確認してください。

<details>
<summary>解答</summary>

```bash
# 権限を設定
chmod 755 webapp/scripts/deploy.sh
chmod 640 webapp/config/settings.json
chmod 644 webapp/logs/app.log

# 確認
ls -l webapp/scripts/deploy.sh
ls -l webapp/config/settings.json
ls -l webapp/logs/app.log
```

出力例：
```
-rwxr-xr-x 1 user group   53 Jan 28 10:00 webapp/scripts/deploy.sh
-rw-r----- 1 user group   68 Jan 28 10:00 webapp/config/settings.json
-rw-r--r-- 1 user group  789 Jan 28 10:00 webapp/logs/app.log
```

</details>

### 追加課題

deploy.sh を実行してみてください。

<details>
<summary>解答</summary>

```bash
./webapp/scripts/deploy.sh
# Starting deployment...
# Deployment complete!
```

</details>

---

## Mission 7: テストファイルを作成 (20分)

### 課題

`webapp/tests/unit/` に以下のテストファイルを作成してください。

**test_user.py**
```python
"""Unit tests for User model"""
import unittest
from src.models.user import User

class TestUser(unittest.TestCase):
    def test_create_user(self):
        user = User("John", "john@example.com")
        self.assertEqual(user.name, "John")
        self.assertEqual(user.email, "john@example.com")

if __name__ == "__main__":
    unittest.main()
```

**test_controller.py**
```python
"""Unit tests for UserController"""
import unittest
from src.controllers.user_controller import UserController

class TestUserController(unittest.TestCase):
    def setUp(self):
        self.controller = UserController()

    def test_get_user(self):
        # TODO: implement test
        pass

if __name__ == "__main__":
    unittest.main()
```

### 確認

```bash
find webapp/tests -name "*.py"
```

<details>
<summary>解答</summary>

```bash
# test_user.py
cat > webapp/tests/unit/test_user.py << 'EOF'
"""Unit tests for User model"""
import unittest
from src.models.user import User

class TestUser(unittest.TestCase):
    def test_create_user(self):
        user = User("John", "john@example.com")
        self.assertEqual(user.name, "John")
        self.assertEqual(user.email, "john@example.com")

if __name__ == "__main__":
    unittest.main()
EOF

# test_controller.py
cat > webapp/tests/unit/test_controller.py << 'EOF'
"""Unit tests for UserController"""
import unittest
from src.controllers.user_controller import UserController

class TestUserController(unittest.TestCase):
    def setUp(self):
        self.controller = UserController()

    def test_get_user(self):
        # TODO: implement test
        pass

if __name__ == "__main__":
    unittest.main()
EOF

# 確認
find webapp/tests -name "*.py"
```

</details>

---

## Mission 8: 総合レポート作成 (35分)

### 課題

プロジェクトの状態をレポートとして作成してください。

**webapp/docs/project_report.txt** を作成し、以下の情報を含めてください。

1. プロジェクト内のファイル総数
2. ディレクトリ総数
3. Pythonファイルの数
4. TODO/FIXMEの総数
5. ログファイルのサマリー（INFO/WARN/ERRORの件数）

### ヒント

各情報を取得するコマンドの結果をファイルに書き込みます。

<details>
<summary>解答</summary>

```bash
# レポートを作成
cat > webapp/docs/project_report.txt << EOF
=== Project Report ===
Generated: $(date)

1. Total Files: $(find webapp -type f | wc -l)

2. Total Directories: $(find webapp -type d | wc -l)

3. Python Files: $(find webapp -name "*.py" | wc -l)

4. TODO count: $(grep -r "TODO" webapp/ | wc -l)
   FIXME count: $(grep -r "FIXME" webapp/ | wc -l)

5. Log Summary:
   - INFO:  $(grep -c "INFO" webapp/logs/app.log)
   - WARN:  $(grep -c "WARN" webapp/logs/app.log)
   - ERROR: $(grep -c "ERROR" webapp/logs/app.log)

=== End of Report ===
EOF

# 確認
cat webapp/docs/project_report.txt
```

</details>

---

## 達成度チェック

| Mission | 内容 | 配点 | 完了 |
|---------|------|------|------|
| 1 | プロジェクト構造を作成 | 10点 | [ ] |
| 2 | ファイルを作成 | 15点 | [ ] |
| 3 | ログファイルを分析 | 15点 | [ ] |
| 4 | ファイルを検索 | 15点 | [ ] |
| 5 | ファイルを表示・操作 | 10点 | [ ] |
| 6 | 権限を設定 | 15点 | [ ] |
| 7 | テストファイルを作成 | 10点 | [ ] |
| 8 | 総合レポート作成 | 10点 | [ ] |

### 合格基準

- **6ミッション以上クリア**: 合格
- **8ミッションすべてクリア**: 優秀

---

## クリーンアップ

試験が終わったら、クリーンアップしてください。

```bash
cd ~
rm -rf final-exam
```

---

## 試験完了！

お疲れさまでした！

すべてのミッションをクリアできましたか？
難しかった部分があれば、該当するステップを復習してみましょう。

---

## 次のステップへ

総合演習を終えたら、最後のチェックポイント（卒業クイズ）に進みましょう！
クイズに合格すれば、ターミナルマスターとして認定です！

---

*推定所要時間: 180分*
