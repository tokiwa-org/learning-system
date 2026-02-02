import React, { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Terminal, X, Minus, Square } from 'lucide-react';

interface FileSystem {
  [path: string]: {
    type: 'dir' | 'file';
    content?: string;
    children?: string[];
  };
}

const initialFileSystem: FileSystem = {
  '/': { type: 'dir', children: ['home'] },
  '/home': { type: 'dir', children: ['tanaka'] },
  '/home/tanaka': { type: 'dir', children: ['Desktop', 'Documents', 'Downloads', '.bashrc', '.profile'] },
  '/home/tanaka/Desktop': { type: 'dir', children: ['memo.txt'] },
  '/home/tanaka/Desktop/memo.txt': { type: 'file', content: 'これはメモファイルです。' },
  '/home/tanaka/Documents': { type: 'dir', children: ['Projects', 'Reports', 'notes.txt'] },
  '/home/tanaka/Documents/Projects': { type: 'dir', children: ['project1', 'project2'] },
  '/home/tanaka/Documents/Projects/project1': { type: 'dir', children: ['README.md', 'src'] },
  '/home/tanaka/Documents/Projects/project1/README.md': { type: 'file', content: '# Project 1\n\nこれはサンプルプロジェクトです。' },
  '/home/tanaka/Documents/Projects/project1/src': { type: 'dir', children: ['main.py'] },
  '/home/tanaka/Documents/Projects/project1/src/main.py': { type: 'file', content: 'print("Hello, World!")' },
  '/home/tanaka/Documents/Projects/project2': { type: 'dir', children: [] },
  '/home/tanaka/Documents/Reports': { type: 'dir', children: ['2024-report.txt'] },
  '/home/tanaka/Documents/Reports/2024-report.txt': { type: 'file', content: '2024年度レポート' },
  '/home/tanaka/Documents/notes.txt': { type: 'file', content: '学習メモ:\n- pwd: 現在地を表示\n- ls: 一覧表示\n- cd: 移動' },
  '/home/tanaka/Downloads': { type: 'dir', children: [] },
  '/home/tanaka/.bashrc': { type: 'file', content: '# .bashrc\nexport PATH=$PATH:/usr/local/bin' },
  '/home/tanaka/.profile': { type: 'file', content: '# .profile\n# ログイン時に読み込まれる設定' },
};

interface HistoryEntry {
  type: 'input' | 'output';
  content: string;
}

interface PseudoTerminalProps {
  className?: string;
  initialMessage?: string;
  initialCommand?: string | null;
}

export const PseudoTerminal: React.FC<PseudoTerminalProps> = ({
  className = '',
  initialMessage = 'ターミナルへようこそ！コマンドを入力してください。\n使えるコマンド: pwd, ls, cd, echo, cat, clear, date, whoami, help',
  initialCommand = null,
}) => {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', content: initialCommand
      ? `${initialMessage}\n\n💡 コマンド「${initialCommand}」が入力されています。Enterで実行！`
      : initialMessage
    }
  ]);
  const [currentInput, setCurrentInput] = useState(initialCommand || '');
  const [currentDir, setCurrentDir] = useState('/home/tanaka');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const username = 'tanaka';
  const hostname = 'ubuntu';

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const getPrompt = () => {
    const displayDir = currentDir === '/home/tanaka' ? '~' :
      currentDir.startsWith('/home/tanaka/') ? '~' + currentDir.slice('/home/tanaka'.length) : currentDir;
    return `${username}@${hostname}:${displayDir}$`;
  };

  const resolvePath = (path: string): string => {
    if (path.startsWith('~')) {
      path = '/home/tanaka' + path.slice(1);
    }
    if (!path.startsWith('/')) {
      path = currentDir + '/' + path;
    }

    // Normalize path (handle . and ..)
    const parts = path.split('/').filter(p => p !== '' && p !== '.');
    const resolved: string[] = [];
    for (const part of parts) {
      if (part === '..') {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    }
    return '/' + resolved.join('/') || '/';
  };

  const executeCommand = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case 'pwd':
        return currentDir;

      case 'ls': {
        let targetPath = currentDir;
        let showHidden = false;
        let showLong = false;

        for (const arg of args) {
          if (arg.startsWith('-')) {
            if (arg.includes('a')) showHidden = true;
            if (arg.includes('l')) showLong = true;
          } else {
            targetPath = resolvePath(arg);
          }
        }

        const entry = initialFileSystem[targetPath];
        if (!entry) {
          return `ls: '${args[args.length - 1] || targetPath}' にアクセスできません: そのようなファイルやディレクトリはありません`;
        }
        if (entry.type === 'file') {
          return targetPath.split('/').pop() || '';
        }

        let children = entry.children || [];
        if (!showHidden) {
          children = children.filter(c => !c.startsWith('.'));
        }

        if (showLong) {
          const lines = children.map(child => {
            const childPath = targetPath === '/' ? `/${child}` : `${targetPath}/${child}`;
            const childEntry = initialFileSystem[childPath];
            const isDir = childEntry?.type === 'dir';
            const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            const size = childEntry?.content?.length || 4096;
            return `${perms}  1 tanaka tanaka ${String(size).padStart(5)} Jan 27 12:00 ${child}`;
          });
          return lines.join('\n');
        }

        return children.join('  ') || '';
      }

      case 'cd': {
        if (args.length === 0 || args[0] === '~') {
          setCurrentDir('/home/tanaka');
          return '';
        }

        if (args[0] === '-') {
          return 'cd: OLDPWD が設定されていません';
        }

        const targetPath = resolvePath(args[0]);
        const entry = initialFileSystem[targetPath];

        if (!entry) {
          return `cd: '${args[0]}': そのようなファイルやディレクトリはありません`;
        }
        if (entry.type !== 'dir') {
          return `cd: '${args[0]}': ディレクトリではありません`;
        }

        setCurrentDir(targetPath);
        return '';
      }

      case 'cat': {
        if (args.length === 0) {
          return 'cat: ファイル名を指定してください';
        }
        const targetPath = resolvePath(args[0]);
        const entry = initialFileSystem[targetPath];

        if (!entry) {
          return `cat: ${args[0]}: そのようなファイルやディレクトリはありません`;
        }
        if (entry.type !== 'file') {
          return `cat: ${args[0]}: ディレクトリです`;
        }

        return entry.content || '';
      }

      case 'echo': {
        const envVars: Record<string, string> = {
          '$SHELL': '/bin/bash',
          '$HOME': '/home/tanaka',
          '$USER': 'tanaka',
          '$PWD': currentDir,
          '$HOSTNAME': 'ubuntu',
          '$PATH': '/usr/local/bin:/usr/bin:/bin',
          '$LANG': 'ja_JP.UTF-8',
        };
        let output = args.join(' ').replace(/^["']|["']$/g, '');
        // 環境変数を展開
        for (const [key, value] of Object.entries(envVars)) {
          output = output.replace(new RegExp(key.replace('$', '\\$'), 'g'), value);
        }
        return output;
      }

      case 'clear':
        setHistory([]);
        return '';

      case 'date': {
        const now = new Date();
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        return `${now.getFullYear()}年 ${months[now.getMonth()]} ${now.getDate()}日 ${days[now.getDay()]}曜日 ${now.toLocaleTimeString('ja-JP')} JST`;
      }

      case 'whoami':
        return username;

      case 'cal': {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const today = now.getDate();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'];

        let cal = `     ${monthNames[month]} ${year}\n`;
        cal += 'Su Mo Tu We Th Fr Sa\n';

        let line = '   '.repeat(firstDay);
        for (let d = 1; d <= lastDate; d++) {
          const dayStr = d === today ? `[${d.toString().padStart(2)}]` : d.toString().padStart(2);
          line += dayStr + ' ';
          if ((firstDay + d) % 7 === 0) {
            cal += line.trimEnd() + '\n';
            line = '';
          }
        }
        if (line) cal += line.trimEnd();

        return cal;
      }

      case 'exit':
        return 'ターミナルを閉じます... (実際には閉じません)';

      case 'help':
        return `利用可能なコマンド:
  pwd     - 現在のディレクトリを表示
  ls      - ファイル一覧を表示 (オプション: -a 隠しファイル, -l 詳細)
  cd      - ディレクトリを移動 (例: cd Documents, cd .., cd ~)
  cat     - ファイルの内容を表示
  echo    - テキストを表示
  date    - 現在の日時を表示
  cal     - カレンダーを表示
  whoami  - ユーザー名を表示
  clear   - 画面をクリア
  help    - このヘルプを表示`;

      default:
        return `${cmd}: コマンドが見つかりません\n'help' で利用可能なコマンドを確認してください`;
    }
  };

  const handleSubmit = () => {
    const prompt = getPrompt();
    const newHistory: HistoryEntry[] = [
      ...history,
      { type: 'input', content: `${prompt} ${currentInput}` }
    ];

    if (currentInput.trim()) {
      setCommandHistory(prev => [...prev, currentInput]);
      const output = executeCommand(currentInput);
      if (output) {
        newHistory.push({ type: 'output', content: output });
      }
    }

    setHistory(newHistory);
    setCurrentInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for cd command
      const parts = currentInput.split(/\s+/);
      if (parts.length === 2 && parts[0] === 'cd') {
        const partial = parts[1];
        const targetDir = partial.includes('/')
          ? resolvePath(partial.substring(0, partial.lastIndexOf('/') + 1))
          : currentDir;
        const searchPart = partial.includes('/')
          ? partial.substring(partial.lastIndexOf('/') + 1)
          : partial;

        const entry = initialFileSystem[targetDir];
        if (entry?.children) {
          const matches = entry.children.filter(c =>
            c.startsWith(searchPart) && initialFileSystem[`${targetDir}/${c}`]?.type === 'dir'
          );
          if (matches.length === 1) {
            const prefix = partial.includes('/')
              ? partial.substring(0, partial.lastIndexOf('/') + 1)
              : '';
            setCurrentInput(`cd ${prefix}${matches[0]}/`);
          }
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-2xl ${className}`}>
      {/* Title bar */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Terminal className="w-4 h-4" />
          <span>tanaka@ubuntu: ~</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Terminal content */}
      <div
        ref={terminalRef}
        onClick={focusInput}
        className="bg-gray-900 text-gray-100 p-4 h-80 overflow-y-auto font-mono text-sm cursor-text"
      >
        {history.map((entry, index) => (
          <div
            key={index}
            className={`whitespace-pre-wrap ${
              entry.type === 'input' ? 'text-green-400' : 'text-gray-300'
            }`}
          >
            {entry.content}
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center text-green-400">
          <span>{getPrompt()}&nbsp;</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-gray-100 caret-green-400"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>

      {/* Hint bar */}
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
        <span>Tab: 補完 | ↑↓: 履歴 | Ctrl+L: クリア</span>
        <span>help で使えるコマンド一覧</span>
      </div>
    </div>
  );
};

export default PseudoTerminal;
