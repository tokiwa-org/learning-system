# フォームの基本を知ろう

## メタ情報

```yaml
mission: "初めてのWebページを作成しよう"
step: 3
subStep: 4
title: "フォームの基本を知ろう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "HTML/CSS"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 先輩「自己紹介ページにお問い合わせフォームを付けたくない？」
>
> フォーム！ 名前やメールアドレスを入力するやつですよね。
>
> 先輩「そう。HTMLだけだとデータの送信はできないけど、フォームの見た目は作れるよ。基本を覚えておこう」

---

## フォームの基本構造

```html
<form>
  <label for="name">名前:</label>
  <input type="text" id="name" name="name">

  <button type="submit">送信</button>
</form>
```

| タグ | 役割 |
|------|------|
| `<form>` | フォーム全体を囲む |
| `<label>` | 入力欄のラベル（説明文） |
| `<input>` | 入力欄 |
| `<button>` | ボタン |

---

## `<input>` のタイプいろいろ

`<input>` タグは `type` 属性で入力の種類を変えられます。

```html
<input type="text" placeholder="テキスト入力">
<input type="email" placeholder="メールアドレス">
<input type="password" placeholder="パスワード">
<input type="number" placeholder="数値">
<input type="date">
<input type="checkbox"> チェックボックス
<input type="radio" name="gender"> ラジオボタン
```

| type | 表示 | 用途 |
|------|------|------|
| `text` | テキスト入力欄 | 名前、住所など |
| `email` | メール入力欄 | メールアドレス |
| `password` | パスワード入力欄 | パスワード（文字が隠される） |
| `number` | 数値入力欄 | 年齢、数量など |
| `date` | 日付選択 | 誕生日など |
| `checkbox` | チェックボックス | 複数選択 |
| `radio` | ラジオボタン | 単一選択 |
| `submit` | 送信ボタン | フォーム送信 |

---

## `<label>` タグの重要性

`<label>` はフォーム要素のラベル（説明）です。

```html
<label for="email">メールアドレス:</label>
<input type="email" id="email" name="email">
```

| 属性 | 説明 |
|------|------|
| `for` | 対応する `<input>` の `id` を指定 |

### labelのメリット

- ラベルをクリックすると、対応する入力欄にフォーカスが移る
- アクセシビリティの向上（スクリーンリーダーが読み上げる）

> 先輩「`<label>` と `<input>` は `for` と `id` でペアにするのがルールだよ」

---

## `<textarea>` - 複数行テキスト

```html
<label for="message">メッセージ:</label>
<textarea id="message" name="message" rows="5" cols="40"></textarea>
```

| 属性 | 説明 |
|------|------|
| `rows` | 表示する行数 |
| `cols` | 表示する列数（文字数） |

`<input type="text">` は1行だけですが、`<textarea>` は複数行の入力ができます。

---

## `<select>` - ドロップダウン

```html
<label for="prefecture">都道府県:</label>
<select id="prefecture" name="prefecture">
  <option value="">選択してください</option>
  <option value="tokyo">東京都</option>
  <option value="osaka">大阪府</option>
  <option value="kyoto">京都府</option>
</select>
```

| タグ | 役割 |
|------|------|
| `<select>` | ドロップダウン全体 |
| `<option>` | 選択肢 |

---

## チェックボックスとラジオボタン

### チェックボックス（複数選択）

```html
<p>好きな言語（複数選択可）:</p>
<label><input type="checkbox" name="lang" value="html"> HTML</label>
<label><input type="checkbox" name="lang" value="css"> CSS</label>
<label><input type="checkbox" name="lang" value="js"> JavaScript</label>
```

### ラジオボタン（単一選択）

```html
<p>経験レベル:</p>
<label><input type="radio" name="level" value="beginner"> 初心者</label>
<label><input type="radio" name="level" value="intermediate"> 中級者</label>
<label><input type="radio" name="level" value="advanced"> 上級者</label>
```

> 先輩「ラジオボタンは `name` を同じにすることで、1つだけ選べるようになるよ」

---

## 実践：お問い合わせフォームを作ろう

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>お問い合わせ</title>
</head>
<body>
  <h1>お問い合わせ</h1>

  <form>
    <p>
      <label for="name">お名前:</label><br>
      <input type="text" id="name" name="name" placeholder="山田太郎">
    </p>

    <p>
      <label for="email">メールアドレス:</label><br>
      <input type="email" id="email" name="email" placeholder="taro@example.com">
    </p>

    <p>
      <label for="subject">お問い合わせ種別:</label><br>
      <select id="subject" name="subject">
        <option value="">選択してください</option>
        <option value="question">質問</option>
        <option value="request">依頼</option>
        <option value="other">その他</option>
      </select>
    </p>

    <p>
      <label for="message">メッセージ:</label><br>
      <textarea id="message" name="message" rows="5" cols="40" placeholder="お問い合わせ内容を入力してください"></textarea>
    </p>

    <p>
      <button type="submit">送信する</button>
    </p>
  </form>
</body>
</html>
```

> 注意: HTMLだけではフォームデータを実際に送信することはできません。送信処理にはJavaScriptやサーバーサイドの技術が必要です。ここではフォームの **見た目** を作る練習です。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| `<form>` | フォーム全体を囲む |
| `<input>` | 各種入力欄（type で種類を変える） |
| `<label>` | 入力欄のラベル（for と id でペア） |
| `<textarea>` | 複数行テキスト入力 |
| `<select>` | ドロップダウン選択 |
| `<button>` | 送信ボタン |

### チェックリスト
- [ ] `<form>` タグの役割を理解した
- [ ] `<input>` の代表的なtype（text, email, password）を覚えた
- [ ] `<label>` と `<input>` をペアにできる
- [ ] `<textarea>` と `<select>` を使える
- [ ] お問い合わせフォームを作成できた

---

## 次のステップへ

フォームの基本が分かりました。次の演習では、これまでのタグをすべて組み合わせて、複数ページのサイトを作ります。

---

*推定読了時間: 30分*
