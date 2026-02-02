import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  ArrowRight,
  Book,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Circle,
  Copy,
  Info,
  Menu,
  MessageCircle,
  Terminal,
  X,
  Play,
} from 'lucide-react';
import PseudoTerminal from './PseudoTerminal';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface Chapter {
  number: number;
  title: string;
  free: boolean;
  content: string;
}

interface BookConfig {
  title: string;
  summary: string;
  topics: string[];
  published: boolean;
  price: number;
  chapters: number[];
}

const bookConfig: BookConfig = {
  title: '黒い画面の正体を知ろう',
  summary: 'IT初心者向けのターミナル入門。「黒い画面」の正体を理解し、基本的なコマンド操作ができるようになることを目指します。',
  topics: ['ターミナル', 'CLI', 'シェル', 'Linux', 'コマンドライン'],
  published: true,
  price: 0,
  chapters: [1, 2, 3, 4, 5, 6],
};

const chapters: Chapter[] = [
  {
    number: 1,
    title: 'なぜターミナルを学ぶのか',
    free: true,
    content: `# 黒い画面の正体を知ろう

IT企業への入社初日。

> 「まずはターミナルを開いてみて」と先輩に言われた。
>
> 言われるままにアプリを起動すると、黒い画面が表示される。
> カーソルが点滅しているだけで、何も起きない...。
>
> 「この黒い画面って、一体なんですか？」

## ターミナルを学ぶ理由

「プログラマーって、なんで黒い画面をカタカタやってるの？」

そう思ったことはありませんか？

実は、この「黒い画面」こそがエンジニアの最強の武器なのです。

## 現在の状況

### エンジニアの作業環境（2025年）

| 項目 | 実態 |
|------|------|
| ターミナル使用率 | エンジニアの **95%以上** が日常的に使用 |
| 求人での必須スキル | 開発系求人の **87%** で「コマンドライン操作」が必須または歓迎 |
| 作業効率 | マウス操作と比較して **2〜10倍** 高速（タスクによる） |

> 「GUIは人間を助けるために作られた。CLIはコンピュータを操るために作られた」
> — Unix哲学より

## なぜマウスではダメなのか

### シナリオ: 100個のファイルの名前を変更する

**マウス操作の場合**

1. ファイルを右クリック
2. 「名前の変更」を選択
3. 新しい名前を入力
4. Enterキーを押す
5. これを100回繰り返す...

→ **所要時間: 約30分**（ミスがなければ）

**ターミナルの場合**

\`\`\`bash
for i in {1..100}; do mv "file$i.txt" "document$i.txt"; done
\`\`\`

→ **所要時間: 約10秒**

## ターミナルでできること

| できること | 具体例 |
|-----------|--------|
| ファイル操作 | 作成、移動、コピー、削除、検索 |
| プログラム実行 | スクリプト実行、アプリ起動 |
| サーバー接続 | リモートサーバーへのログイン |
| バージョン管理 | Git操作 |
| 自動化 | 繰り返し作業の自動実行 |

## よくある不安

### 「難しそう...」

大丈夫です。最初は誰でも怖いものです。
覚えるコマンドは最初は **5つだけ**。それだけで仕事の80%はカバーできます。

### 「間違えたらパソコンが壊れそう...」

心配いりません。危険なコマンドには確認が表示されます。
また、このカリキュラムでは安全な環境で練習するので、何度失敗しても大丈夫です。

## このチャプターで学ぶこと

このチャプターを完了すると、以下ができるようになります：

- ターミナルを起動できる
- 今いる場所（ディレクトリ）を確認できる
- フォルダの中身を一覧表示できる
- フォルダを移動できる

**準備はいいですか？ 黒い画面の世界へようこそ！**`,
  },
  {
    number: 2,
    title: 'ターミナル・シェル・CLIの違い',
    free: true,
    content: `# ターミナル・シェル・CLIの違い

「ターミナル」「シェル」「CLI」「コマンドライン」...

エンジニアの会話には似たような言葉がたくさん出てきます。
これらの違いを理解して、混乱しないようにしましょう。

## 3つの言葉の関係

**入れ子構造**になっています：

| 層 | 名前 | 役割 |
|----|------|------|
| 外側 | **ターミナル** | 画面（文字を表示するウィンドウ） |
| 中間 | **シェル** | 通訳（コマンドを解釈・実行） |
| 内側 | **コマンド** | 指示（ls, cd, pwd など） |

> ターミナル（画面）の中で、シェル（通訳）が動いていて、コマンド（指示）を受け取って実行する

## ターミナル（Terminal）とは

### 一言で言うと

**「黒い画面」そのもの。文字を表示するウィンドウ。**

### 役割

- 文字を表示する
- キーボード入力を受け付ける
- それだけ！（計算や処理はしない）

### 例え話

ターミナルは「**テレビ画面**」のようなもの。
映像を映すだけで、番組を作っているわけではありません。

### 代表的なターミナルアプリ（Linux）

| ディストリビューション | デフォルトのターミナル |
|----------------------|---------------------|
| Ubuntu / GNOME系 | GNOME Terminal |
| Kubuntu / KDE系 | Konsole |
| Linux Mint | GNOME Terminal |
| Fedora | GNOME Terminal |

他にも多くのターミナルアプリがあり、好みに合わせて変更できます。

## シェル（Shell）とは

### 一言で言うと

**コマンドを解釈して実行するプログラム。ターミナルの「中身」。**

### 役割

- 入力されたコマンドを理解する
- OSに「これをやって」と伝える
- 結果をターミナルに返す

### 例え話

シェルは「**通訳者**」のようなもの。
あなたの言葉（コマンド）をコンピュータの言葉に翻訳します。

### 今どのシェルを使っているか確認する

\`\`\`bash
echo $SHELL
\`\`\`

出力例：

\`\`\`
/bin/zsh      # zshを使用中
/bin/bash     # bashを使用中
\`\`\`

## CLI（Command Line Interface）とは

### 一言で言うと

**「文字で操作する方式」全般を指す言葉。**

### GUIとの比較

| 項目 | CLI | GUI |
|------|-----|-----|
| 正式名称 | Command Line Interface | Graphical User Interface |
| 操作方法 | キーボードで文字入力 | マウスでクリック |
| 見た目 | 黒い画面、文字だけ | アイコン、ボタン、ウィンドウ |
| 学習コスト | 最初は高い | 低い（直感的） |
| 作業効率 | 慣れれば高い | 慣れても限界がある |
| 自動化 | しやすい | しにくい |

## まとめ

| 用語 | 役割 | 例え |
|------|------|------|
| **ターミナル** | 文字を表示する画面 | テレビ画面 |
| **シェル** | コマンドを解釈・実行 | 通訳者 |
| **CLI** | 文字で操作する方式 | 操作スタイル |

厳密な違いを覚える必要はありません。
大事なのは「黒い画面でコマンドを打つ」ことができるようになること！`,
  },
  {
    number: 3,
    title: 'ターミナルを起動してみよう',
    free: true,
    content: `# ターミナルを起動してみよう

いよいよ実際にターミナルを起動します！

## ターミナルの起動方法

### 方法1: ショートカットキー（推奨）

\`Ctrl\` + \`Alt\` + \`T\`

これが最も簡単で速い方法です。覚えておきましょう！

### 方法2: アプリケーションメニューから

1. アプリケーションメニューを開く
2. 「ターミナル」または「端末」を検索
3. クリックして起動

### 方法3: 右クリックメニュー

デスクトップやファイルマネージャーで右クリック → 「ターミナルで開く」

## 起動したら見える画面

ターミナルを起動すると、こんな画面が表示されます：

\`\`\`
username@hostname:~$
\`\`\`

この表示を「プロンプト」と呼びます。詳しくは次のチャプターで説明します。

## 最初の一歩：何か入力してみよう

プロンプトが表示されたら、以下を入力してEnterキーを押してください：

\`\`\`bash
echo "Hello, Terminal!"
\`\`\`

**結果:**

\`\`\`
Hello, Terminal!
\`\`\`

おめでとうございます！ これがあなたの最初のコマンドです！

### 何が起きたのか

| 入力 | 意味 |
|------|------|
| \`echo\` | 「表示しろ」というコマンド |
| \`"Hello, Terminal!"\` | 表示する内容 |

\`echo\` は「こだま」という意味。入力した内容をそのまま返してくれます。

## もう少し試してみよう

### 現在の日時を表示

\`\`\`bash
date
\`\`\`

### カレンダーを表示

\`\`\`bash
cal
\`\`\`

### 自分のユーザー名を確認

\`\`\`bash
whoami
\`\`\`

## ターミナルを閉じる方法

### 方法1: コマンドで閉じる

\`\`\`bash
exit
\`\`\`

### 方法2: ショートカットキー

\`Ctrl\` + \`D\`（入力がない状態で）

### 方法3: ウィンドウを閉じる

普通のアプリと同じように × ボタンをクリック

## まとめ

| 操作 | 方法 |
|------|------|
| 起動 | \`Ctrl\` + \`Alt\` + \`T\` |
| 終了 | \`exit\` または \`Ctrl\` + \`D\` |`,
  },
  {
    number: 4,
    title: 'プロンプトを読み解く',
    free: true,
    content: `# プロンプトを読み解く

ターミナルに表示される「プロンプト」。
一見すると暗号のように見えますが、実は大切な情報が詰まっています。

プロンプトを読めるようになると、「今どこにいるか」が一目でわかります。

## プロンプトとは

**プロンプト（Prompt）** = 「促す」という意味

「コマンドを入力してください」という合図です。

> \`tanaka@ubuntu:~$\` ← この部分がプロンプト。ここにコマンドを入力します。

プロンプトが表示されている = **入力待ち状態**

## プロンプトの構造

プロンプトは4つの部分で構成されています：

> \`tanaka\` @ \`ubuntu\` : \`~\` \`$\`

| 部分 | 例 | 意味 |
|------|-----|------|
| **ユーザー名** | tanaka | 今ログインしているユーザー |
| **ホスト名** | ubuntu | コンピュータの名前 |
| **カレントディレクトリ** | ~ | 今いる場所 |
| **プロンプト記号** | $ または % | 入力開始の目印 |

## 「~」（チルダ）の意味

\`~\` はホームディレクトリを表す特別な記号です。

| 表示 | 実際のパス | 意味 |
|------|-----------|------|
| \`~\` | /home/tanaka | ホームディレクトリ |
| \`~/Desktop\` | /home/tanaka/Desktop | デスクトップ |
| \`~/Documents\` | /home/tanaka/Documents | ドキュメント |

### なぜ「~」を使うのか

毎回 \`/home/tanaka\` と入力するのは面倒だから！

\`\`\`bash
# 長い書き方
cd /home/tanaka/Documents

# 短い書き方（同じ意味）
cd ~/Documents
\`\`\`

## プロンプト記号の種類

### 一般ユーザー

| シェル | 記号 |
|--------|------|
| bash | \`$\` |
| zsh | \`%\` |

### 管理者（root/Administrator）

\`#\` が表示されている時は要注意！
管理者権限で実行されるため、間違ったコマンドでシステムを壊す可能性があります。

## 実際に確認してみよう

### 今いる場所を確認するコマンド

\`\`\`bash
pwd
\`\`\`

\`pwd\` = **P**rint **W**orking **D**irectory（作業ディレクトリを表示）

## まとめ

| 要素 | 読み方 | 例 |
|------|--------|-----|
| ユーザー名 | 今ログインしている人 | tanaka |
| ホスト名 | コンピュータの名前 | ubuntu-pc |
| カレントディレクトリ | 今いる場所 | ~, Documents |
| プロンプト記号 | 入力開始の合図 | $, % |`,
  },
  {
    number: 5,
    title: '最初の3コマンド',
    free: true,
    content: `# 最初の3コマンド

ターミナル操作の基本中の基本、**3つのコマンド**を覚えましょう。

この3つさえ覚えれば、ターミナルの中を自由に移動できます。

## 最初の3コマンド

| コマンド | 意味 | 覚え方 |
|---------|------|--------|
| \`pwd\` | 今いる場所を表示 | **P**rint **W**orking **D**irectory |
| \`ls\` | フォルダの中身を一覧表示 | **L**i**s**t |
| \`cd\` | 場所を移動する | **C**hange **D**irectory |

\`\`\`
「今どこ？」 → pwd
「何がある？」 → ls
「移動したい」 → cd
\`\`\`

## pwd：今いる場所を確認

### 使い方

\`\`\`bash
pwd
\`\`\`

### 実行例

\`\`\`bash
tanaka@ubuntu:~$ pwd
/home/tanaka
\`\`\`

## ls：中身を一覧表示

### 使い方

\`\`\`bash
ls
\`\`\`

### よく使うオプション

| コマンド | 結果 |
|---------|------|
| \`ls\` | ファイル名だけ表示 |
| \`ls -l\` | 詳細情報も表示（サイズ、日付など） |
| \`ls -a\` | 隠しファイルも表示 |
| \`ls -la\` | 詳細 + 隠しファイル（よく使う！） |

> **ポイント:** \`.\` で始まるファイル/フォルダは「隠しファイル」

## cd：場所を移動

### 使い方

\`\`\`bash
cd [移動先]
\`\`\`

### よく使う移動先

| コマンド | 移動先 |
|---------|--------|
| \`cd Desktop\` | Desktopフォルダに移動 |
| \`cd ~\` | ホームディレクトリに戻る |
| \`cd ..\` | 1つ上のフォルダに戻る |
| \`cd ../..\` | 2つ上のフォルダに戻る |
| \`cd -\` | 直前にいた場所に戻る |

## 入力のコツ

### Tab補完を活用しよう

フォルダ名を途中まで入力して \`Tab\` キーを押すと、自動で補完されます。

\`\`\`bash
tanaka@ubuntu:~$ cd Doc[Tab]
tanaka@ubuntu:~$ cd Documents/
                     ↑
              自動で補完された！
\`\`\`

**これを使えば:**

- タイプミスが減る
- 入力が速くなる
- フォルダ名を覚えていなくてもOK

### ↑キーで履歴を呼び出し

\`↑\` キーを押すと、前に実行したコマンドが表示されます。

## まとめ

| コマンド | 機能 | 例 |
|---------|------|-----|
| \`pwd\` | 現在地を表示 | \`pwd\` → /home/tanaka |
| \`ls\` | 一覧表示 | \`ls -la\` で詳細表示 |
| \`cd\` | 移動 | \`cd ..\` で上へ、\`cd ~\` でホームへ |`,
  },
  {
    number: 6,
    title: '理解度チェック',
    free: true,
    content: `# 理解度チェック

Step 1で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 80%（6問正解）

## 問題

### Q1. ターミナルの役割として正しいものはどれですか？

- A) コマンドを解釈して実行する
- B) 文字を表示し、キーボード入力を受け付ける
- C) ファイルを保存する
- D) インターネットに接続する

**正解: B**

ターミナルは「文字を表示するウィンドウ」です。
コマンドを解釈・実行するのはシェルの役割です。

---

### Q2. シェルの役割として正しいものはどれですか？

- A) 黒い画面を表示する
- B) 入力されたコマンドを解釈して実行する
- C) ファイルを削除する
- D) プログラムを作成する

**正解: B**

シェルは「通訳者」のような役割で、ユーザーが入力したコマンドを解釈し、OSに伝えます。

---

### Q3. プロンプトに表示される「~」は何を意味しますか？

- A) ルートディレクトリ
- B) ホームディレクトリ
- C) デスクトップ
- D) ダウンロードフォルダ

**正解: B**

\`~\`（チルダ）はホームディレクトリを表す特別な記号です。

---

### Q4. 「今いる場所（カレントディレクトリ）」を表示するコマンドはどれですか？

- A) \`ls\`
- B) \`cd\`
- C) \`pwd\`
- D) \`dir\`

**正解: C**

\`pwd\` = **P**rint **W**orking **D**irectory（作業ディレクトリを表示）

---

### Q5. フォルダの中身を一覧表示するコマンドはどれですか？

- A) \`pwd\`
- B) \`ls\`
- C) \`cd\`
- D) \`list\`

**正解: B**

\`ls\` = **L**i**s**t（一覧表示）

---

### Q6. 1つ上のフォルダに移動するコマンドはどれですか？

- A) \`cd ~\`
- B) \`cd ..\`
- C) \`cd -\`
- D) \`cd /\`

**正解: B**

- \`cd ..\` = 1つ上のフォルダに移動
- \`cd ~\` = ホームディレクトリに移動
- \`cd -\` = 直前の場所に戻る
- \`cd /\` = ルートディレクトリに移動

---

### Q7. Tab補完の説明として正しいものはどれですか？

- A) コマンドを実行する
- B) 入力途中のファイル名やフォルダ名を自動補完する
- C) ターミナルを閉じる
- D) 新しいタブを開く

**正解: B**

Tabキーを押すと、入力途中のファイル名やフォルダ名が自動で補完されます。

---

### Q8. ターミナルを終了するコマンドはどれですか？

- A) \`quit\`
- B) \`close\`
- C) \`exit\`
- D) \`end\`

**正解: C**

\`exit\` でターミナル（シェル）を終了できます。

---

## 結果判定

### 6問以上正解の場合

**合格です！おめでとうございます！**

Step 1「黒い画面の正体を知ろう」を完了しました。
次はStep 2「ファイルとフォルダを操ろう」に進みましょう。

### 5問以下の場合

**もう少し復習しましょう**

間違えた問題の内容を、該当するセクションで復習してください。`,
  },
];

export const ZennBookViewer: React.FC = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [readChapters, setReadChapters] = useState<Set<number>>(new Set([1]));
  const [copied, setCopied] = useState<string | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalCommand, setTerminalCommand] = useState<string | null>(null);

  const openTerminalWithCommand = (command: string) => {
    setTerminalCommand(command);
    setTerminalOpen(true);
  };

  const supportedCommands = ['pwd', 'ls', 'cd', 'cat', 'echo', 'date', 'cal', 'whoami', 'clear', 'help'];

  const isCommandSupported = (code: string): boolean => {
    const firstLine = code.split('\n')[0].trim();
    // コメント行は除外
    if (firstLine.startsWith('#')) return false;
    const firstWord = firstLine.split(/\s+/)[0];
    return supportedCommands.includes(firstWord);
  };

  const chapter = chapters[currentChapter];
  const progress = Math.round((readChapters.size / chapters.length) * 100);

  const markAsRead = (chapterNumber: number) => {
    setReadChapters(prev => new Set([...prev, chapterNumber]));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-900 truncate max-w-[200px]">{bookConfig.title}</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl">
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                <span className="font-semibold">目次</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-2 hover:bg-white/20 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ScrollArea className="h-[calc(100vh-64px)]">
              <nav className="p-4 space-y-1">
                {chapters.map((ch, index) => (
                  <button
                    key={ch.number}
                    onClick={() => {
                      setCurrentChapter(index);
                      markAsRead(ch.number);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-all ${
                      index === currentChapter
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {readChapters.has(ch.number) ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300" />
                      )}
                      <span className="text-xs text-gray-400 font-mono">{ch.number}.</span>
                    </div>
                    <span className="text-sm font-medium truncate">{ch.title}</span>
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r transition-all duration-300 z-40 ${
            sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
          }`}
        >
          {/* Book Header */}
          <div className="p-5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Book className="w-6 h-6" />
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                無料
              </Badge>
            </div>
            <h1 className="font-bold text-lg leading-tight mb-2">{bookConfig.title}</h1>
            <p className="text-sm text-blue-100 line-clamp-2">{bookConfig.summary}</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {bookConfig.topics.slice(0, 3).map(topic => (
                <span key={topic} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="px-5 py-3 border-b bg-gray-50">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">読了進捗</span>
              <span className="font-semibold text-blue-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">
              {readChapters.size} / {chapters.length} チャプター完了
            </div>
          </div>

          {/* Chapter List */}
          <ScrollArea className="flex-1">
            <nav className="p-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-2">
                チャプター
              </div>
              <div className="space-y-0.5">
                {chapters.map((ch, index) => (
                  <button
                    key={ch.number}
                    onClick={() => {
                      setCurrentChapter(index);
                      markAsRead(ch.number);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all group ${
                      index === currentChapter
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      readChapters.has(ch.number)
                        ? 'bg-green-100 text-green-600'
                        : index === currentChapter
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-500'
                    }`}>
                      {readChapters.has(ch.number) ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        ch.number
                      )}
                    </div>
                    <span className="text-sm font-medium truncate">{ch.title}</span>
                  </button>
                ))}
              </div>
            </nav>
          </ScrollArea>
        </aside>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`hidden lg:flex fixed z-50 top-4 w-8 h-8 items-center justify-center bg-white border rounded-full shadow-sm hover:shadow-md transition-all ${
            sidebarOpen ? 'left-[308px]' : 'left-4'
          }`}
        >
          {sidebarOpen ? <ArrowLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Main Content */}
        <main
          className={`flex-1 min-h-screen transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-80' : 'lg:ml-0'
          }`}
        >
          <div className="pt-16 lg:pt-0">
            {/* Chapter Header */}
            <div className="sticky top-0 lg:top-0 z-30 bg-white/95 backdrop-blur border-b">
              <div className="max-w-3xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {chapter.number}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Chapter {chapter.number}</div>
                      <h2 className="font-semibold text-gray-900">{chapter.title}</h2>
                    </div>
                  </div>
                  {readChapters.has(chapter.number) && (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      読了済み
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <article className="max-w-3xl mx-auto px-6 py-10">
              <div className="zenn-content text-base text-gray-800 leading-7">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-gray-900 mt-0 mb-8">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold text-gray-900 mt-14 mb-5 pb-3 border-b border-gray-200">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">{children}</h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg font-bold text-gray-900 mt-8 mb-3">{children}</h4>
                    ),
                    p: ({ children }) => (
                      <p className="my-5 text-gray-700 leading-8">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-5 pl-6 space-y-2 list-disc text-gray-700">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-5 pl-6 space-y-2 list-decimal text-gray-700">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-7">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-gray-900">{children}</strong>
                    ),
                    pre: ({ children }) => (
                      <div className="my-6 rounded-xl overflow-hidden shadow-md">
                        <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm leading-6">
                          {children}
                        </pre>
                      </div>
                    ),
                    code: ({ className, children, ...props }) => {
                      const isBlock = className?.includes('language-');
                      if (isBlock) {
                        const lang = className?.replace('language-', '') || '';
                        const code = String(children).replace(/\n$/, '');
                        const blockId = `code-${Math.random().toString(36).slice(2)}`;
                        return (
                          <div className="relative">
                            <div className="absolute top-0 left-0 right-0 bg-gray-800 text-gray-400 px-4 py-2 text-xs flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5" />
                                <span>{lang || 'code'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {lang === 'bash' && isCommandSupported(code) && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={() => openTerminalWithCommand(code.split('\n')[0])}
                                          className="p-1 rounded hover:bg-gray-700 transition-colors flex items-center gap-1 text-green-400 hover:text-green-300"
                                        >
                                          <Play className="w-3.5 h-3.5" />
                                          <span className="text-xs">試す</span>
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>ターミナルで試す</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        onClick={() => copyToClipboard(code, blockId)}
                                        className="p-1 rounded hover:bg-gray-700 transition-colors"
                                      >
                                        {copied === blockId ? (
                                          <Check className="w-3.5 h-3.5 text-green-400" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>コピー</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            <code className={`${className} block pt-10`} {...props}>
                              {children}
                            </code>
                          </div>
                        );
                      }
                      return (
                        <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-[0.9em] font-mono" {...props}>
                          {children}
                        </code>
                      );
                    },
                    table: ({ children }) => (
                      <div className="my-6 overflow-x-auto">
                        <table className="w-full text-sm border-collapse border border-gray-300 rounded-lg overflow-hidden">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-100">{children}</thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-gray-200">{children}</tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-gray-50">{children}</tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-3 text-left font-semibold text-gray-800 border border-gray-300 bg-gray-100">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-3 text-gray-700 border border-gray-300">
                        {children}
                      </td>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-6 border-l-4 border-blue-400 bg-blue-50 py-4 px-5 rounded-r-lg text-gray-700">
                        {children}
                      </blockquote>
                    ),
                    hr: () => <hr className="my-12 border-gray-300" />,
                    a: ({ href, children }) => (
                      <a href={href} className="text-blue-600 hover:text-blue-800 underline underline-offset-2">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {chapter.content}
                </ReactMarkdown>
              </div>
            </article>

            {/* Footer Navigation */}
            <footer className="border-t bg-gray-50">
              <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="flex items-stretch gap-4">
                  {currentChapter > 0 && (
                    <button
                      onClick={() => {
                        setCurrentChapter(currentChapter - 1);
                        markAsRead(chapters[currentChapter - 1].number);
                        window.scrollTo(0, 0);
                      }}
                      className="flex-1 p-4 rounded-xl border hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <ArrowLeft className="w-4 h-4" />
                        前のチャプター
                      </div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {chapters[currentChapter - 1].title}
                      </div>
                    </button>
                  )}

                  {currentChapter < chapters.length - 1 && (
                    <button
                      onClick={() => {
                        setCurrentChapter(currentChapter + 1);
                        markAsRead(chapters[currentChapter + 1].number);
                        window.scrollTo(0, 0);
                      }}
                      className="flex-1 p-4 rounded-xl border hover:border-blue-300 hover:bg-blue-50 transition-all text-right group"
                    >
                      <div className="flex items-center justify-end gap-2 text-gray-500 text-sm mb-1">
                        次のチャプター
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {chapters[currentChapter + 1].title}
                      </div>
                    </button>
                  )}
                </div>

                {/* Completion */}
                {currentChapter === chapters.length - 1 && readChapters.size === chapters.length && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">全チャプター読了完了！</h3>
                    <p className="text-green-600">
                      おめでとうございます！「{bookConfig.title}」を読み終えました。
                    </p>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Floating Terminal Button */}
      <button
        onClick={() => {
          if (terminalOpen) {
            setTerminalOpen(false);
          } else {
            setTerminalCommand(null);
            setTerminalOpen(true);
          }
        }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-110 ${
          terminalOpen
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-gray-900 hover:bg-gray-800 text-green-400'
        }`}
      >
        {terminalOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Terminal className="w-6 h-6" />
        )}
      </button>

      {/* Terminal Panel */}
      {terminalOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[600px] max-w-[calc(100vw-3rem)]">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow">
              <Play className="w-4 h-4 text-green-500" />
              <span>コマンドを試してみよう！</span>
            </div>
          </div>
          <PseudoTerminal
            key={terminalCommand || 'default'}
            initialCommand={terminalCommand}
            initialMessage={`ターミナルへようこそ！
ここでコマンドを練習できます。

試してみよう:
  pwd    - 今いる場所を確認
  ls     - ファイル一覧を表示
  cd Documents - Documentsへ移動

'help' で全コマンドを確認できます。`}
          />
        </div>
      )}
    </div>
  );
};

export default ZennBookViewer;
