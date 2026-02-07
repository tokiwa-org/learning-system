# 理解度チェック：SQLの基本を思い出そう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 1
subStep: 6
title: "理解度チェック"
itemType: QUIZ
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 1で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. SELECT文の実行順序として正しいものはどれですか？

- A) SELECT → FROM → WHERE → GROUP BY → ORDER BY
- B) FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
- C) FROM → SELECT → WHERE → GROUP BY → ORDER BY
- D) SELECT → WHERE → FROM → GROUP BY → HAVING

<details>
<summary>答えを見る</summary>

**正解: B**

SELECT文は書いた順ではなく、FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT の順で実行されます。WHEREでフィルタリングした後にGROUP BYでグループ化し、最後にSELECTでカラムを選びます。

</details>

---

### Q2. WHEREとHAVINGの違いとして正しいものはどれですか？

- A) WHEREは文字列、HAVINGは数値のフィルタリング
- B) WHEREは個々の行、HAVINGはグループ化後の結果をフィルタリング
- C) WHEREはSELECTの前、HAVINGはSELECTの後に実行
- D) WHEREとHAVINGは同じ機能で互換性がある

<details>
<summary>答えを見る</summary>

**正解: B**

WHEREは個々の行（レコード）に対するフィルタリングで、GROUP BYの前に実行されます。HAVINGはGROUP BYでグループ化した後の結果に対するフィルタリングです。集計関数を条件にする場合はHAVINGを使います。

</details>

---

### Q3. 外部キー（FOREIGN KEY）の主な目的は何ですか？

- A) テーブルの検索速度を向上させる
- B) データの参照整合性を保証する
- C) テーブルのサイズを小さくする
- D) データを暗号化する

<details>
<summary>答えを見る</summary>

**正解: B**

外部キーは参照整合性（Referential Integrity）を保証します。例えば、employees テーブルの department_id に存在しない部署IDが入ることを防ぎます。

</details>

---

### Q4. 「1つの部署に複数の社員が所属する」というリレーションの種類は？

- A) 1対1
- B) 1対多
- C) 多対多
- D) 自己参照

<details>
<summary>答えを見る</summary>

**正解: B**

1つの部署（1）に対して、複数の社員（多）が所属するため「1対多」のリレーションです。外部キーは「多」側のテーブル（employees）に設定します。

</details>

---

### Q5. 多対多のリレーションを実現するために必要なものは？

- A) 外部キーを両方のテーブルに設定する
- B) 中間テーブル（Junction Table）を作成する
- C) 1つのテーブルに複数の主キーを設定する
- D) VIEWを作成する

<details>
<summary>答えを見る</summary>

**正解: B**

多対多のリレーションは直接表現できないため、中間テーブルを作成して2つの1対多に分解します。今回のデータベースでは、employees と projects の多対多を project_members テーブルで実現しています。

</details>

---

### Q6. SQLiteで外部キー制約を有効にするコマンドは？

- A) SET FOREIGN_KEYS = ON;
- B) PRAGMA foreign_keys = ON;
- C) ALTER TABLE SET FOREIGN_KEY ON;
- D) ENABLE FOREIGN_KEYS;

<details>
<summary>答えを見る</summary>

**正解: B**

SQLiteでは外部キー制約がデフォルトで無効になっています。`PRAGMA foreign_keys = ON;` を実行することで有効にできます。接続のたびに実行する必要があります。

</details>

---

### Q7. ER図でPKとFKはそれぞれ何を意味しますか？

- A) PK = Public Key, FK = File Key
- B) PK = Primary Key, FK = Foreign Key
- C) PK = Partition Key, FK = Function Key
- D) PK = Process Key, FK = Format Key

<details>
<summary>答えを見る</summary>

**正解: B**

PK（Primary Key）は主キーで、テーブル内の各行を一意に識別するカラムです。FK（Foreign Key）は外部キーで、他のテーブルの主キーを参照するカラムです。

</details>

---

### Q8. employees テーブルの manager_id が同じテーブルの id を参照するリレーションを何と呼びますか？

- A) 循環参照
- B) 自己参照（Self Reference）
- C) 逆参照
- D) 交差参照

<details>
<summary>答えを見る</summary>

**正解: B**

自己参照（Self Reference）は、同じテーブル内のカラムが同じテーブルの主キーを参照するリレーションです。上司-部下のような階層構造を表現するのに使われます。Step 2 で学ぶ「自己結合（Self JOIN）」でこのデータを活用します。

</details>

---

## 結果

### 7問以上正解の場合

**合格です！**

Step 1「SQLの基本を思い出そう」を完了しました。
次はStep 2「JOINの迷宮を攻略しよう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう**

| 問題 | 復習セクション |
|------|---------------|
| Q1-Q2 | step1_2 SQL基本の復習 |
| Q3-Q5 | step1_4 外部キーとリレーションを理解しよう |
| Q6 | step1_3 / step1_4 |
| Q7-Q8 | step1_5 ER図の読み方 |

---

## Step 1 完了！

### 学んだこと

- SQL基本（SELECT, WHERE, GROUP BY）の復習
- 4テーブル構成のデータベース構築
- 外部キーと参照整合性
- リレーションの種類（1対1、1対多、多対多）
- ER図の読み方

### 次のステップ

**Step 2: JOINの迷宮を攻略しよう（4時間）**

複数のテーブルを結合して、横断的にデータを取得する技術を学びます。

---

*推定所要時間: 15分*
