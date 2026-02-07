# MFAとアクセスキー管理

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 3
subStep: 4
title: "MFAとアクセスキー管理"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "AWS"
  category: "クラウド"
  target_level: "L1"
```

---

## ストーリー

> 「IAM ポリシーの設計はバッチリだ。次は認証の強化だ」
>
> 山田先輩がスマートフォンの認証アプリを見せながら言う。
>
> 「パスワードだけの認証は脆弱だ。先月のセキュリティの授業で学んだよな？
> AWS でも同じだ。MFA（多要素認証）を有効にして認証を強化する」
>
> 「アクセスキーの管理も重要ですよね？
> GitHub にアクセスキーをコミットして大変なことになったという話を聞いたことがあります」
>
> 「その通りだ。アクセスキーの漏洩は AWS セキュリティ事故の上位に常にランクインしている。
> 正しい管理方法を身につけよう」

---

## MFA（多要素認証）とは

MFA は、パスワード（知識要素）に加えて、別の認証要素を要求するセキュリティ機能です。

```
MFA なし:
  パスワード → ログイン成功
  (パスワードが漏洩したらアウト)

MFA あり:
  パスワード + MFA コード → ログイン成功
  (パスワードが漏洩しても MFA デバイスがなければログインできない)
```

### MFA デバイスの種類

| 種類 | 説明 | 推奨度 |
|------|------|--------|
| 仮想 MFA | スマートフォンアプリ（Google Authenticator 等） | 標準 |
| FIDO セキュリティキー | YubiKey 等の物理キー | 高 |
| ハードウェア MFA | 専用トークンデバイス | 高（ルートユーザー向け） |

### MFA の設定

```bash
# 仮想MFAデバイスの作成
aws iam create-virtual-mfa-device \
  --virtual-mfa-device-name tanaka-mfa \
  --outfile qr-code.png \
  --bootstrap-method QRCodePNG

# MFAデバイスの有効化（認証アプリで連続する2つのコードを入力）
aws iam enable-mfa-device \
  --user-name tanaka \
  --serial-number arn:aws:iam::123456789012:mfa/tanaka-mfa \
  --authentication-code1 123456 \
  --authentication-code2 789012
```

### MFA を必須にするポリシー

特定の操作に MFA を必須とするポリシーを設定できます。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyAllExceptListedIfNoMFA",
      "Effect": "Deny",
      "NotAction": [
        "iam:CreateVirtualMFADevice",
        "iam:EnableMFADevice",
        "iam:GetUser",
        "iam:ListMFADevices",
        "iam:ListVirtualMFADevices",
        "iam:ResyncMFADevice",
        "sts:GetSessionToken"
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}
```

---

## アクセスキーの管理

### アクセスキーとは

AWS CLI や SDK から AWS API を呼び出すための認証情報です。

```
アクセスキー:
  Access Key ID:     AKIAIOSFODNN7EXAMPLE
  Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

この2つのセットで認証が行われる
```

### アクセスキーのベストプラクティス

| プラクティス | 説明 |
|-------------|------|
| ルートユーザーのキーは作らない | ルートユーザーにアクセスキーを作成しない |
| IAM ロールを優先 | EC2/Lambda 上ではロールを使い、キーを置かない |
| 定期的なローテーション | 90日以内にキーをローテーション |
| 未使用キーの無効化 | 使っていないキーは無効化・削除 |
| コードに埋め込まない | ソースコードにキーをハードコードしない |

### アクセスキーの管理コマンド

```bash
# アクセスキーの一覧
aws iam list-access-keys --user-name tanaka

# アクセスキーの最終利用日を確認
aws iam get-access-key-last-used \
  --access-key-id AKIAIOSFODNN7EXAMPLE

# アクセスキーの無効化
aws iam update-access-key \
  --user-name tanaka \
  --access-key-id AKIAIOSFODNN7EXAMPLE \
  --status Inactive

# 新しいアクセスキーの作成（ローテーション）
aws iam create-access-key --user-name tanaka

# 古いアクセスキーの削除
aws iam delete-access-key \
  --user-name tanaka \
  --access-key-id AKIAIOSFODNN7EXAMPLE
```

### アクセスキーのローテーション手順

```
1. 新しいアクセスキーを作成
   │
   ▼
2. アプリケーションを新しいキーに更新
   │
   ▼
3. 古いキーを無効化（Inactive）
   │   ※ 問題がないか数日間確認
   │
   ▼
4. 問題なければ古いキーを削除
```

---

## AWS Secrets Manager

アクセスキーやデータベースのパスワードなどの機密情報を安全に管理するサービスです。

```bash
# シークレットの作成
aws secretsmanager create-secret \
  --name nakamura/db-credentials \
  --description "Database credentials for Nakamura" \
  --secret-string '{"username":"admin","password":"StrongP@ss2024!"}'

# シークレットの取得
aws secretsmanager get-secret-value \
  --secret-id nakamura/db-credentials \
  --query 'SecretString' \
  --output text

# 自動ローテーションの設定
aws secretsmanager rotate-secret \
  --secret-id nakamura/db-credentials \
  --rotation-lambda-arn arn:aws:lambda:ap-northeast-1:123456789012:function:rotate-db-secret \
  --rotation-rules AutomaticallyAfterDays=30
```

---

## パスワードポリシーの設定

IAM ユーザーのパスワード要件を組織レベルで設定します。

```bash
# パスワードポリシーの設定
aws iam update-account-password-policy \
  --minimum-password-length 14 \
  --require-symbols \
  --require-numbers \
  --require-uppercase-characters \
  --require-lowercase-characters \
  --max-password-age 90 \
  --password-reuse-prevention 12 \
  --allow-users-to-change-password
```

| 設定項目 | 推奨値 | 説明 |
|---------|--------|------|
| 最小文字数 | 14文字以上 | 短いパスワードは推測されやすい |
| 記号必須 | はい | 複雑さの要件 |
| 数字必須 | はい | 複雑さの要件 |
| 大文字必須 | はい | 複雑さの要件 |
| 最大有効期限 | 90日 | 定期的な変更を強制 |
| 再利用防止 | 12世代 | 同じパスワードの使い回しを防止 |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| MFA | パスワード + 別要素で認証を強化。全ユーザーに必須 |
| アクセスキー | ロールを優先。キーは定期ローテーション、コードに埋め込まない |
| Secrets Manager | 機密情報を安全に保管・自動ローテーション |
| パスワードポリシー | 組織レベルで複雑さ・有効期限を設定 |

### チェックリスト

- [ ] MFA の設定方法と必須化ポリシーを理解した
- [ ] アクセスキーのローテーション手順を把握した
- [ ] Secrets Manager の用途を理解した
- [ ] パスワードポリシーの設定項目を把握した

---

## 次のステップへ

次のセクションでは、これまで学んだ IAM の知識を使って、中村製作所の IAM ポリシーを実際に設計する演習に挑戦します。

---

*推定読了時間: 25分*
