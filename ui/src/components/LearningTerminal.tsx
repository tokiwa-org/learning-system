import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Circle,
  Terminal,
  Lightbulb,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Layout } from './Layout';

// ステップの型定義
interface LessonStep {
  id: string;
  title: string;
  type: 'LESSON' | 'EXERCISE' | 'QUIZ';
  estimatedMinutes: number;
  content: React.ReactNode;
  checkpoints?: string[];
  commands?: { command: string; description: string }[];
}

// ミッションの型定義
interface Mission {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  month: number;
  totalSteps: number;
  currentStep: number;
  steps: LessonStep[];
}

export const LearningTerminal: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isTerminalFullscreen, setIsTerminalFullscreen] = useState(false);
  const [isTerminalLoading, setIsTerminalLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // サンプルミッションデータ
  const mission: Mission = {
    id: 'mission_l0_m1_s1',
    title: '初めてのターミナルを起動しよう',
    subtitle: 'L0 - 月1 - ステップ1: 黒い画面の正体を知ろう',
    level: 'L0',
    month: 1,
    totalSteps: 6,
    currentStep: 1,
    steps: [
      {
        id: 'step_1_1',
        title: 'なぜターミナルを学ぶのか',
        type: 'LESSON',
        estimatedMinutes: 15,
        content: (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              「プログラマーって、なんで黒い画面をカタカタやってるの？」
              そう思ったことはありませんか？
            </p>
            <p className="text-muted-foreground">
              実は、この「黒い画面」こそがエンジニアの最強の武器なのです。
              ターミナルを使えば、マウス操作の何倍も速く作業できます。
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📊 エンジニアの実態</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• エンジニアの95%以上が日常的にターミナルを使用</li>
                <li>• 開発系求人の87%で「コマンドライン操作」が必須または歓迎</li>
                <li>• マウス操作と比較して2〜10倍高速</li>
              </ul>
            </div>
          </div>
        ),
        checkpoints: [
          'ターミナルの重要性を理解した',
          'なぜエンジニアがターミナルを使うか分かった',
        ],
      },
      {
        id: 'step_1_2',
        title: 'ターミナル・シェル・CLIの違い',
        type: 'LESSON',
        estimatedMinutes: 25,
        content: (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              「ターミナル」「シェル」「CLI」...似たような言葉がたくさん出てきます。
              これらの違いを理解しましょう。
            </p>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <pre>{`┌─────────────────────────┐
│  ターミナル（画面）      │
│  ┌───────────────────┐  │
│  │  シェル（通訳）    │  │
│  │  ┌─────────────┐  │  │
│  │  │ コマンド     │  │  │
│  │  └─────────────┘  │  │
│  └───────────────────┘  │
└─────────────────────────┘`}</pre>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>ターミナル</strong> = 文字を表示する画面（テレビ画面のようなもの）</li>
              <li><strong>シェル</strong> = コマンドを解釈するプログラム（通訳者）</li>
              <li><strong>CLI</strong> = 文字で操作する方式全般</li>
            </ul>
          </div>
        ),
        checkpoints: [
          'ターミナルとシェルの違いが分かった',
          'CLIの意味を理解した',
        ],
      },
      {
        id: 'step_1_3',
        title: '最初の3コマンドを試してみよう',
        type: 'EXERCISE',
        estimatedMinutes: 25,
        content: (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              右側のターミナルで、以下のコマンドを実行してみましょう。
              Linuxが起動したら、プロンプト（$マーク）が表示されます。
            </p>
          </div>
        ),
        commands: [
          { command: 'pwd', description: '今いる場所を確認（Print Working Directory）' },
          { command: 'ls', description: 'フォルダの中身を一覧表示（List）' },
          { command: 'ls -la', description: '詳細情報と隠しファイルも表示' },
        ],
        checkpoints: [
          'pwd で現在地が表示された',
          'ls でファイル一覧が表示された',
          'ls -la で詳細が表示された',
        ],
      },
      {
        id: 'step_1_4',
        title: 'フォルダを移動してみよう',
        type: 'EXERCISE',
        estimatedMinutes: 25,
        content: (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              cd コマンドを使ってフォルダ間を移動してみましょう。
            </p>
          </div>
        ),
        commands: [
          { command: 'cd /', description: 'ルートディレクトリ（一番上）に移動' },
          { command: 'ls', description: '中身を確認' },
          { command: 'cd /home', description: '/home に移動' },
          { command: 'pwd', description: '現在地を確認' },
        ],
        checkpoints: [
          'cd で別のフォルダに移動できた',
          'pwd で移動後の場所を確認できた',
        ],
      },
      {
        id: 'step_1_5',
        title: 'ファイルを作成してみよう',
        type: 'EXERCISE',
        estimatedMinutes: 15,
        content: (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              touch コマンドでファイルを作成し、echo でファイルに書き込んでみましょう。
            </p>
          </div>
        ),
        commands: [
          { command: 'touch myfile.txt', description: '空のファイルを作成' },
          { command: 'ls', description: 'ファイルが作成されたか確認' },
          { command: 'echo "Hello" > myfile.txt', description: 'ファイルに書き込み' },
          { command: 'cat myfile.txt', description: 'ファイルの中身を表示' },
        ],
        checkpoints: [
          'touch でファイルを作成できた',
          'echo でファイルに書き込めた',
          'cat でファイルの中身を確認できた',
        ],
      },
      {
        id: 'step_1_6',
        title: '理解度チェック',
        type: 'QUIZ',
        estimatedMinutes: 15,
        content: (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              ここまでの内容を振り返りましょう。右のターミナルで確認しながら回答してください。
            </p>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold mb-2">Q1. 今いる場所を表示するコマンドは？</p>
                <p className="text-sm text-muted-foreground">ヒント: Print Working Directory の略</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold mb-2">Q2. フォルダの中身を表示するコマンドは？</p>
                <p className="text-sm text-muted-foreground">ヒント: List の略</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold mb-2">Q3. フォルダを移動するコマンドは？</p>
                <p className="text-sm text-muted-foreground">ヒント: Change Directory の略</p>
              </div>
            </div>
          </div>
        ),
        checkpoints: [
          'pwd の意味を理解している',
          'ls の意味を理解している',
          'cd の意味を理解している',
        ],
      },
    ],
  };

  const currentStep = mission.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / mission.steps.length) * 100;

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < mission.steps.length - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep.id));
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleStepComplete = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStep.id));
  };

  const handleTerminalReload = () => {
    setIsTerminalLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsTerminalLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'LESSON':
        return 'bg-blue-500/10 text-blue-500';
      case 'EXERCISE':
        return 'bg-green-500/10 text-green-500';
      case 'QUIZ':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <Layout currentPage="learning">
      <div className="space-y-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                {mission.level}
              </Badge>
              <Badge variant="outline">月{mission.month}</Badge>
            </div>
            <h1 className="text-2xl font-bold">{mission.title}</h1>
            <p className="text-muted-foreground">{mission.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              ステップ {currentStepIndex + 1} / {mission.steps.length}
            </p>
            <Progress value={progress} className="w-48 mt-2" />
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className={`grid gap-4 ${isTerminalFullscreen ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {/* 学習コンテンツパネル */}
          {!isTerminalFullscreen && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span className="font-semibold">{currentStep.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStepTypeColor(currentStep.type)}>
                      {currentStep.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {currentStep.estimatedMinutes}分
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* コンテンツ */}
                {currentStep.content}

                {/* コマンド一覧 */}
                {currentStep.commands && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      実行するコマンド
                    </h4>
                    {currentStep.commands.map((cmd, index) => (
                      <div
                        key={index}
                        className="bg-zinc-900 rounded-lg p-3 font-mono text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">$</span>
                          <span className="text-white">{cmd.command}</span>
                        </div>
                        <p className="text-zinc-400 text-xs mt-1">{cmd.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* チェックポイント */}
                {currentStep.checkpoints && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      チェックポイント
                    </h4>
                    <div className="space-y-1">
                      {currentStep.checkpoints.map((checkpoint, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Circle className="h-4 w-4" />
                          <span>{checkpoint}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ターミナルパネル */}
          <Card className={isTerminalFullscreen ? 'col-span-1' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  <span className="font-semibold">Linux ターミナル</span>
                  <Badge variant="outline" className="text-xs">v86</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleTerminalReload}
                    title="リロード"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsTerminalFullscreen(!isTerminalFullscreen)}
                    title={isTerminalFullscreen ? '縮小' : '拡大'}
                  >
                    {isTerminalFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative bg-black rounded-b-lg overflow-hidden">
                {isTerminalLoading && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent" />
                    <p className="text-zinc-400 mt-4">Linux を起動中...</p>
                    <div className="mt-4 bg-zinc-800 p-4 rounded-lg max-w-xs text-center">
                      <p className="text-yellow-500 text-sm font-semibold">💡 豆知識</p>
                      <p className="text-zinc-400 text-xs mt-1">
                        ターミナルは「端末」とも呼ばれます。
                        昔のコンピュータは、本体と画面が別々だったんです。
                      </p>
                    </div>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  src="https://copy.sh/v86/?profile=linux26"
                  className={`w-full border-0 ${isTerminalFullscreen ? 'h-[600px]' : 'h-[400px]'}`}
                  allow="cross-origin-isolated"
                  onLoad={() => setIsTerminalLoading(false)}
                />
              </div>
              <div className="bg-zinc-900 px-3 py-2 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span>copy.sh/v86 デモ</span>
                </div>
                <span>クリックしてフォーカス</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ナビゲーション */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                前へ
              </Button>

              <div className="flex items-center gap-2">
                {mission.steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStepIndex(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                      index === currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : completedSteps.has(step.id)
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {completedSteps.has(step.id) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={currentStepIndex === mission.steps.length - 1}
              >
                次へ
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 注意書き */}
        <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg text-sm">
          <strong className="text-amber-500">📝 PoC について:</strong>
          <span className="text-muted-foreground ml-2">
            このデモは copy.sh/v86 を iframe で埋め込んでいます。
            本番環境では、v86 を自前ホストし、カスタム Linux イメージを使用します。
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default LearningTerminal;
