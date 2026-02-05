# ツールのURLを調査しよう

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 3
subStep: 3
title: "ツールのURLを調査しよう"
itemType: EXERCISE
estimatedMinutes: 60
noiseLevel: MINIMAL
roadmap:
  skill: "総合"
  category: "総合演習"
  target_level: "L0"
```

---

## ストーリー

> 「Webページにツールへのリンクを貼るなら、そのURLがちゃんとアクセスできるか確認しないと」
>
> 月4で学んだネットワークの知識が役に立つ。
>
> curl でHTTPステータスを確認して、ping でサーバーの応答を見る。
>
> リンク切れの紹介ページなんて、信用を失うだけだ。

---

## ミッション概要

データベースに登録されているツールのURLが正しくアクセスできるか調査してください。

### 達成条件

- [ ] 全ツールのURLにcurlでアクセス確認できた
- [ ] HTTPステータスコードを取得できた
- [ ] DNS情報を確認できた
- [ ] 調査結果をファイルに保存した

---

## Part 1: URLの一覧を取得

### タスク 1-1: データベースからURL一覧を取得

```bash
cd ~/projects/internal-tools-page

sqlite3 data/tools.db "SELECT name, url FROM tools;"
```

期待される出力：
```
Slack|https://slack.com
VS Code|https://code.visualstudio.com
GitHub|https://github.com
Docker|https://www.docker.com
Notion|https://www.notion.so
Figma|https://www.figma.com
Jira|https://www.atlassian.com/software/jira
Confluence|https://www.atlassian.com/software/confluence
Zoom|https://zoom.us
Google Workspace|https://workspace.google.com
```

---

## Part 2: curlでアクセス確認（月4の復習）

### タスク 2-1: HTTPステータスコードの確認

curlを使って各URLのHTTPステータスコードを確認します。

```bash
# Slack
curl -s -o /dev/null -w "%{http_code}" https://slack.com
echo ""

# VS Code
curl -s -o /dev/null -w "%{http_code}" https://code.visualstudio.com
echo ""

# GitHub
curl -s -o /dev/null -w "%{http_code}" https://github.com
echo ""
```

<details>
<summary>ヒント: curlのオプション説明</summary>

| オプション | 意味 |
|-----------|------|
| `-s` | サイレントモード（進捗表示なし） |
| `-o /dev/null` | 出力を破棄（レスポンスの中身は不要） |
| `-w "%{http_code}"` | HTTPステータスコードだけ表示 |

### ステータスコードの意味

| コード | 意味 |
|--------|------|
| 200 | OK（正常にアクセス可能） |
| 301 | リダイレクト（URLが移動した） |
| 302 | 一時的リダイレクト |
| 403 | アクセス禁止 |
| 404 | ページが見つからない |

200番台、300番台ならリンクとして問題ありません。

</details>

### タスク 2-2: 全URLを一括で確認

以下のスクリプトを使って、全URLを一括でチェックします。

```bash
# 全ツールのURL確認スクリプト
sqlite3 data/tools.db "SELECT name, url FROM tools;" | while IFS='|' read name url; do
  status=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$url")
  echo "$name: $url -> HTTP $status"
done
```

<details>
<summary>ヒント: スクリプトがうまく動かない場合</summary>

ネットワーク環境によっては、一部のURLにアクセスできない場合があります。

その場合は、手動で1つずつ確認してみてください。

```bash
curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 https://slack.com
```

`--max-time 10` は、10秒でタイムアウトするオプションです。
`-L` は、リダイレクトを自動的にフォローするオプションです。

</details>

---

## Part 3: DNS調査（月4の復習）

### タスク 3-1: ドメインの確認

主要なツールのドメインについて、DNS情報を確認します。

```bash
# slack.comのDNS情報
nslookup slack.com

# github.comのDNS情報
nslookup github.com
```

<details>
<summary>ヒント: nslookupが使えない場合</summary>

`host` コマンドや `dig` コマンドでも同様の情報が得られます。

```bash
# host コマンド
host slack.com

# dig コマンド
dig slack.com +short
```

</details>

### タスク 3-2: ping で応答確認

```bash
# github.com にpingを送信（3回だけ）
ping -c 3 github.com
```

> 注意: 一部のサーバーはpingに応答しない設定になっています。
> pingが通らなくてもWebサイトにはアクセスできる場合があります。

---

## Part 4: 調査結果の記録

### タスク 4-1: 調査結果ファイルの作成

```bash
cat > docs/url_check.md << 'EOF'
# URL疎通確認結果

## 確認日
Day 2

## 確認方法
- curl コマンドでHTTPステータスコードを確認
- nslookup でDNS解決を確認

## 結果一覧

| ツール名 | URL | ステータス | 備考 |
|---------|-----|----------|------|
| Slack | https://slack.com | 200 | OK |
| VS Code | https://code.visualstudio.com | 200 | OK |
| GitHub | https://github.com | 200 | OK |
| Docker | https://www.docker.com | 200 | OK |
| Notion | https://www.notion.so | 200 | OK |
| Figma | https://www.figma.com | 200 | OK |
| Jira | https://www.atlassian.com/software/jira | 200 | OK |
| Confluence | https://www.atlassian.com/software/confluence | 200 | OK |
| Zoom | https://zoom.us | 200 | OK |
| Google Workspace | https://workspace.google.com | 200 | OK |

## 結論
全10件のURLに正常にアクセスできることを確認。
リンク切れはなし。
EOF
```

> 注意: 実際にcurlで確認したステータスコードに合わせて、表を更新してください。

### タスク 4-2: コミット

```bash
git add docs/url_check.md
git commit -m "URL疎通確認結果を追加"
```

---

## ネットワーク調査で学んだこと

### なぜURL確認が必要なのか

| 理由 | 説明 |
|------|------|
| リンク切れ防止 | 訪問者がクリックしてエラーになると信頼を失う |
| 情報の正確性 | URLが変わっていないか確認する |
| セキュリティ | HTTPSが使われているか確認する |

### HTTPSの確認ポイント

今回のデータでは全URLが `https://` で始まっています。これは：

- 通信が暗号化されている
- サーバーの身元が証明されている

ことを意味します。`http://`（sなし）のリンクがある場合は、`https://` に変更できるか確認しましょう。

---

## まとめ

| 操作 | コマンド |
|------|----------|
| HTTPステータス確認 | `curl -s -o /dev/null -w "%{http_code}" URL` |
| DNS確認 | `nslookup ドメイン` |
| 疎通確認 | `ping -c 3 ドメイン` |
| リダイレクト対応 | `curl -L URL` |

- [ ] 全URLのHTTPステータスを確認した
- [ ] DNS情報を確認した
- [ ] 調査結果をファイルにまとめた
- [ ] 調査結果をコミットした

---

## 次のステップへ

URL調査が完了しました。リンク切れがないことが確認できました。

次のセクションでは、Day 2の日報を書きます。
データ取得・分析・URL調査の成果を報告しましょう。

---

*推定所要時間: 60分*
