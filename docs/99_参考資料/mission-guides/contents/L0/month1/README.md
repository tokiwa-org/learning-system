# L0 月1: 初めてのターミナルを起動しよう

## 概要

| 項目 | 内容 |
|-----|------|
| 対象 | L0（未経験者） |
| 総時間 | 20時間 |
| スキル | OS基本コマンド |

---

## ステップ構成

### Step 1: 黒い画面の正体を知ろう（2時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 1-1 | なぜターミナルを学ぶのか | LESSON | 15分 | [step1_1_intro.md](./step1_1_intro.md) |
| 1-2 | ターミナル・シェル・CLIの違い | LESSON | 25分 | [step1_2_terminology.md](./step1_2_terminology.md) |
| 1-3 | ターミナルを起動してみよう | LESSON | 25分 | [step1_3_launch.md](./step1_3_launch.md) |
| 1-4 | プロンプトを読み解く | LESSON | 25分 | [step1_4_prompt.md](./step1_4_prompt.md) |
| 1-5 | 最初の3コマンド | LESSON | 15分 | [step1_5_first_commands.md](./step1_5_first_commands.md) |
| 1-6 | 理解度チェック | QUIZ | 15分 | [step1_6_quiz.md](./step1_6_quiz.md) |

### Step 2: ファイルとフォルダを操ろう（4時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 2-1 | ディレクトリ構造を理解する | LESSON | 30分 | [step2_1_directory_structure.md](./step2_1_directory_structure.md) |
| 2-2 | パスの読み方・書き方 | LESSON | 30分 | [step2_2_path.md](./step2_2_path.md) |
| 2-3 | フォルダを作る・消す | LESSON | 30分 | [step2_3_mkdir_rmdir.md](./step2_3_mkdir_rmdir.md) |
| 2-4 | ファイルを作る・消す | LESSON | 30分 | [step2_4_touch_rm.md](./step2_4_touch_rm.md) |
| 2-5 | 演習：フォルダ構造を作ろう | EXERCISE | 60分 | [step2_5_exercise.md](./step2_5_exercise.md) |
| 2-6 | チェックポイント | QUIZ | 30分 | [step2_6_quiz.md](./step2_6_quiz.md) |

### Step 3: ファイルの中身を見てみよう（4時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 3-1 | catでファイル全体を表示する | LESSON | 30分 | [step3_1_cat.md](./step3_1_cat.md) |
| 3-2 | head/tailで先頭・末尾を表示する | LESSON | 30分 | [step3_2_head_tail.md](./step3_2_head_tail.md) |
| 3-3 | lessでページ単位で閲覧する | LESSON | 30分 | [step3_3_less.md](./step3_3_less.md) |
| 3-4 | wcで統計、diffで比較 | LESSON | 30分 | [step3_4_wc_diff.md](./step3_4_wc_diff.md) |
| 3-5 | 演習：ログファイルを分析しよう | EXERCISE | 60分 | [step3_5_exercise.md](./step3_5_exercise.md) |
| 3-6 | チェックポイント | QUIZ | 30分 | [step3_6_quiz.md](./step3_6_quiz.md) |

### Step 4: 検索コマンドをマスターしよう（4時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 4-1 | findでファイルを探す | LESSON | 30分 | [step4_1_find.md](./step4_1_find.md) |
| 4-2 | findのオプション | LESSON | 30分 | [step4_2_find_options.md](./step4_2_find_options.md) |
| 4-3 | grepで文字列を検索 | LESSON | 30分 | [step4_3_grep.md](./step4_3_grep.md) |
| 4-4 | grepのオプション | LESSON | 30分 | [step4_4_grep_options.md](./step4_4_grep_options.md) |
| 4-5 | 演習：プロジェクト内を検索 | EXERCISE | 90分 | [step4_5_exercise.md](./step4_5_exercise.md) |
| 4-6 | チェックポイント | QUIZ | 30分 | [step4_6_quiz.md](./step4_6_quiz.md) |

### Step 5: 権限の世界を理解しよう（2時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 5-1 | 権限の基本 | LESSON | 30分 | [step5_1_permission_basics.md](./step5_1_permission_basics.md) |
| 5-2 | chmodで権限を変更 | LESSON | 30分 | [step5_2_chmod.md](./step5_2_chmod.md) |
| 5-3 | 演習：権限を設定しよう | EXERCISE | 30分 | [step5_3_exercise.md](./step5_3_exercise.md) |
| 5-4 | チェックポイント | QUIZ | 30分 | [step5_4_quiz.md](./step5_4_quiz.md) |

### Step 6: ターミナル卒業試験（4時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 6-1 | 総合演習：ターミナル卒業試験 | EXERCISE | 180分 | [step6_1_final_exercise.md](./step6_1_final_exercise.md) |
| 6-2 | 卒業クイズ | QUIZ | 60分 | [step6_2_final_quiz.md](./step6_2_final_quiz.md) |

---

## 学習の流れ

```
Step 1 (2h)     Step 2 (4h)     Step 3 (4h)
[導入・基礎] → [ファイル操作] → [中身を見る]
     ↓              ↓               ↓
Step 4 (4h)     Step 5 (2h)     Step 6 (4h)
[検索]     →    [権限]     →   [卒業試験]
```

---

## 達成目標

このミッション完了後にできること：

- `pwd`, `ls`, `cd` で現在地の確認と移動
- `mkdir`, `touch`, `rm` でファイル・フォルダの作成・削除
- `cat`, `head`, `tail`, `less` でファイル内容の確認
- `find`, `grep` でファイル・内容の検索
- `chmod` で権限の基本操作
