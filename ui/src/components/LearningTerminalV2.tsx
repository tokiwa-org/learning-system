import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Terminal,
  BookOpen,
  Maximize2,
  Minimize2,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

// ミッションデータ
const missionData = {
  title: '黒い画面の正体を知ろう',
  objective: 'ターミナルの基本を理解し、最初のコマンドを実行する',
  steps: [
    {
      id: 'step1',
      title: 'ターミナルとは何か',
      description:
        'ターミナル（端末）は、コンピュータに文字で命令を送るためのツールです。マウスでクリックする代わりに、キーボードで命令を入力します。',
      commands: [],
      checkpoint: null,
    },
    {
      id: 'step2',
      title: '現在地を確認しよう',
      description:
        '`pwd` コマンドを使って、今いる場所（ディレクトリ）を確認してみましょう。pwdは "Print Working Directory" の略です。',
      commands: ['pwd'],
      checkpoint: {
        command: 'pwd',
        expectedOutput: '/home',
      },
    },
    {
      id: 'step3',
      title: 'ファイル一覧を見てみよう',
      description:
        '`ls` コマンドで、現在のディレクトリにあるファイルやフォルダの一覧を表示できます。lsは "list" の略です。',
      commands: ['ls', 'ls -la'],
      checkpoint: {
        command: 'ls',
        expectedOutput: null,
      },
    },
    {
      id: 'step4',
      title: 'ディレクトリを移動しよう',
      description:
        '`cd` コマンドでディレクトリを移動できます。cdは "Change Directory" の略です。`cd ..` で一つ上のディレクトリに移動します。',
      commands: ['cd Documents', 'cd ..', 'cd ~'],
      checkpoint: {
        command: 'cd',
        expectedOutput: null,
      },
    },
  ],
};

// シンプルなシェルエミュレータ（PoC用）
class SimpleShell {
  private currentDir: string = '/home/user';
  private fileSystem: Record<string, string[]> = {
    '/': ['home', 'usr', 'etc', 'var'],
    '/home': ['user'],
    '/home/user': ['Documents', 'Downloads', 'Desktop', '.bashrc', '.profile'],
    '/home/user/Documents': ['notes.txt', 'project'],
    '/home/user/Downloads': [],
    '/home/user/Desktop': [],
  };
  private history: string[] = [];

  executeCommand(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return '';

    this.history.push(trimmed);
    const [cmd, ...args] = trimmed.split(/\s+/);

    switch (cmd) {
      case 'pwd':
        return this.currentDir;
      case 'ls':
        return this.ls(args);
      case 'cd':
        return this.cd(args[0]);
      case 'echo':
        return args.join(' ');
      case 'whoami':
        return 'user';
      case 'date':
        return new Date().toString();
      case 'clear':
        return '\x1b[2J\x1b[H';
      case 'help':
        return 'Available commands: pwd, ls, cd, echo, whoami, date, clear, help';
      case 'cat':
        return this.cat(args[0]);
      case 'mkdir':
        return this.mkdir(args[0]);
      default:
        return `bash: ${cmd}: command not found`;
    }
  }

  private ls(args: string[]): string {
    const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
    const showLong = args.includes('-l') || args.includes('-la') || args.includes('-al');

    const files = this.fileSystem[this.currentDir] || [];
    let result = showHidden ? ['.', '..', ...files] : files.filter((f) => !f.startsWith('.'));

    if (showLong) {
      return result
        .map((f) => {
          const isDir = !f.includes('.');
          return `${isDir ? 'd' : '-'}rwxr-xr-x  1 user user  4096 Jan 26 10:00 ${f}`;
        })
        .join('\n');
    }

    return result.join('  ');
  }

  private cd(path?: string): string {
    if (!path || path === '~') {
      this.currentDir = '/home/user';
      return '';
    }

    if (path === '..') {
      const parts = this.currentDir.split('/').filter(Boolean);
      parts.pop();
      this.currentDir = '/' + parts.join('/') || '/';
      return '';
    }

    if (path.startsWith('/')) {
      if (this.fileSystem[path]) {
        this.currentDir = path;
        return '';
      }
    } else {
      const newPath =
        this.currentDir === '/' ? `/${path}` : `${this.currentDir}/${path}`;
      if (this.fileSystem[newPath]) {
        this.currentDir = newPath;
        return '';
      }
    }

    return `bash: cd: ${path}: No such file or directory`;
  }

  private cat(file?: string): string {
    if (!file) return 'cat: missing operand';
    if (file === 'notes.txt') {
      return 'Welcome to the learning system!\nThis is a sample note file.';
    }
    return `cat: ${file}: No such file or directory`;
  }

  private mkdir(dir?: string): string {
    if (!dir) return 'mkdir: missing operand';
    const newPath =
      this.currentDir === '/' ? `/${dir}` : `${this.currentDir}/${dir}`;
    if (!this.fileSystem[newPath]) {
      this.fileSystem[newPath] = [];
      const parentFiles = this.fileSystem[this.currentDir] || [];
      if (!parentFiles.includes(dir)) {
        parentFiles.push(dir);
      }
    }
    return '';
  }

  getPrompt(): string {
    const shortDir =
      this.currentDir === '/home/user' ? '~' : this.currentDir.replace('/home/user', '~');
    return `\x1b[32muser@learning\x1b[0m:\x1b[34m${shortDir}\x1b[0m$ `;
  }

  getCurrentDir(): string {
    return this.currentDir;
  }
}

export const LearningTerminalV2: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isTerminalFullscreen, setIsTerminalFullscreen] = useState(false);
  const [isTerminalReady, setIsTerminalReady] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const shellRef = useRef<SimpleShell>(new SimpleShell());
  const inputBufferRef = useRef<string>('');

  const currentStep = missionData.steps[currentStepIndex];

  // xterm.js の初期化
  useEffect(() => {
    let terminal: any = null;
    let fitAddon: any = null;

    const initTerminal = async () => {
      if (!terminalRef.current) return;

      // Dynamic import to avoid SSR issues
      const { Terminal } = await import('@xterm/xterm');
      const { FitAddon } = await import('@xterm/addon-fit');
      const { WebLinksAddon } = await import('@xterm/addon-web-links');

      // Import CSS
      await import('@xterm/xterm/css/xterm.css');

      terminal = new Terminal({
        theme: {
          background: '#1a1b26',
          foreground: '#a9b1d6',
          cursor: '#c0caf5',
          cursorAccent: '#1a1b26',
          black: '#32344a',
          red: '#f7768e',
          green: '#9ece6a',
          yellow: '#e0af68',
          blue: '#7aa2f7',
          magenta: '#ad8ee6',
          cyan: '#449dab',
          white: '#787c99',
          brightBlack: '#444b6a',
          brightRed: '#ff7a93',
          brightGreen: '#b9f27c',
          brightYellow: '#ff9e64',
          brightBlue: '#7da6ff',
          brightMagenta: '#bb9af7',
          brightCyan: '#0db9d7',
          brightWhite: '#acb0d0',
        },
        fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, monospace',
        fontSize: 14,
        lineHeight: 1.2,
        cursorBlink: true,
        cursorStyle: 'block',
      });

      fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      terminal.loadAddon(fitAddon);
      terminal.loadAddon(webLinksAddon);

      terminal.open(terminalRef.current);
      fitAddon.fit();

      xtermRef.current = terminal;

      // Welcome message
      terminal.writeln('\x1b[1;36m=== Learning Terminal (PoC) ===\x1b[0m');
      terminal.writeln('\x1b[90mPowered by xterm.js + SimpleShell\x1b[0m');
      terminal.writeln('\x1b[90mType "help" for available commands\x1b[0m');
      terminal.writeln('');
      terminal.write(shellRef.current.getPrompt());

      // Handle input
      terminal.onData((data: string) => {
        const shell = shellRef.current;

        if (data === '\r') {
          // Enter key
          terminal.writeln('');
          const output = shell.executeCommand(inputBufferRef.current);
          if (output) {
            if (output.startsWith('\x1b[2J')) {
              terminal.clear();
            } else {
              terminal.writeln(output);
            }
          }
          inputBufferRef.current = '';
          terminal.write(shell.getPrompt());
        } else if (data === '\x7f') {
          // Backspace
          if (inputBufferRef.current.length > 0) {
            inputBufferRef.current = inputBufferRef.current.slice(0, -1);
            terminal.write('\b \b');
          }
        } else if (data === '\x03') {
          // Ctrl+C
          terminal.writeln('^C');
          inputBufferRef.current = '';
          terminal.write(shell.getPrompt());
        } else if (data >= ' ' && data <= '~') {
          // Printable characters
          inputBufferRef.current += data;
          terminal.write(data);
        }
      });

      setIsTerminalReady(true);

      // Handle resize
      const resizeObserver = new ResizeObserver(() => {
        fitAddon?.fit();
      });
      resizeObserver.observe(terminalRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    };

    initTerminal();

    return () => {
      terminal?.dispose();
    };
  }, []);

  // コマンドをターミナルに送信
  const sendCommand = useCallback((command: string) => {
    if (xtermRef.current && isTerminalReady) {
      const term = xtermRef.current;
      const shell = shellRef.current;

      // Clear current input
      while (inputBufferRef.current.length > 0) {
        term.write('\b \b');
        inputBufferRef.current = inputBufferRef.current.slice(0, -1);
      }

      // Type command
      term.write(command);
      inputBufferRef.current = command;

      // Execute
      term.writeln('');
      const output = shell.executeCommand(command);
      if (output) {
        term.writeln(output);
      }
      inputBufferRef.current = '';
      term.write(shell.getPrompt());
    }
  }, [isTerminalReady]);

  // コピー機能
  const copyCommand = useCallback((command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  }, []);

  // ステップ完了
  const completeStep = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, currentStep.id]));
    if (currentStepIndex < missionData.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [currentStep.id, currentStepIndex]);

  const progress = ((currentStepIndex + 1) / missionData.steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Mission Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Terminal className="w-4 h-4" />
            <span>L0 - ターミナル基礎</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            MISSION: {missionData.title}
          </h1>
          <p className="text-gray-600">{missionData.objective}</p>

          {/* Progress Bar */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">
              STEP {currentStepIndex + 1}/{missionData.steps.length}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`grid gap-4 ${isTerminalFullscreen ? 'grid-cols-1' : 'grid-cols-2'}`}
        >
          {/* Learning Content Panel */}
          {!isTerminalFullscreen && (
            <div className="h-[500px] flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {currentStep.title}
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    STEP {currentStepIndex + 1}
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6">
                {/* Step Description */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>

                {/* Commands */}
                {currentStep.commands.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      試してみよう
                    </h4>
                    <div className="space-y-2">
                      {currentStep.commands.map((cmd, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-gray-900 text-green-400 px-4 py-2 rounded-lg font-mono text-sm"
                        >
                          <span className="text-gray-500">$</span>
                          <span className="flex-1">{cmd}</span>
                          <button
                            onClick={() => copyCommand(cmd)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Copy"
                          >
                            {copiedCommand === cmd ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                          <button
                            onClick={() => sendCommand(cmd)}
                            className="px-2 py-0.5 bg-green-600 hover:bg-green-500 text-white text-xs rounded transition-colors"
                          >
                            実行
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step Progress */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    進捗
                  </h4>
                  <div className="space-y-2">
                    {missionData.steps.map((step, idx) => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-2 text-sm ${
                          idx === currentStepIndex
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-500'
                        }`}
                      >
                        {completedSteps.has(step.id) ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : idx === currentStepIndex ? (
                          <Circle className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        <span>
                          STEP {idx + 1}: {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-4 border-t flex items-center justify-between">
                <button
                  className="inline-flex items-center px-3 py-1.5 text-sm border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                  disabled={currentStepIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  前へ
                </button>

                <button
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                  onClick={completeStep}
                >
                  {currentStepIndex === missionData.steps.length - 1 ? (
                    '完了'
                  ) : (
                    <>
                      次へ
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Terminal Panel */}
          <div
            className={`flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm ${isTerminalFullscreen ? 'h-[700px]' : 'h-[500px]'}`}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  ターミナル
                  {!isTerminalReady && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    xterm.js + SimpleShell
                  </span>
                  <button
                    onClick={() => setIsTerminalFullscreen(!isTerminalFullscreen)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title={isTerminalFullscreen ? '縮小' : '拡大'}
                  >
                    {isTerminalFullscreen ? (
                      <Minimize2 className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div
                ref={terminalRef}
                className="w-full h-full"
                style={{ backgroundColor: '#1a1b26' }}
              />
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>PoC版:</strong> このターミナルはSimpleShell（シンプルなシェルエミュレータ）で動作しています。
            本番環境では container2wasm を使用して本物のLinux環境を提供予定です。
          </p>
        </div>
      </div>
    </div>
  );
};
