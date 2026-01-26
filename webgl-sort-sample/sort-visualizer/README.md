# Sort Algorithm Visualizer

WebGL (Three.js) を使ったソートアルゴリズムの3D可視化デモ。

## 機能

- 3種類のソートアルゴリズム
  - Bubble Sort（バブルソート）
  - Selection Sort（選択ソート）
  - Insertion Sort（挿入ソート）
- 配列サイズの変更（10〜50）
- 速度調整（Slow / Normal / Fast）
- 比較回数・スワップ回数のカウント
- 3Dカメラ操作（ドラッグで回転、スクロールでズーム）

## 起動方法

ローカルサーバーが必要です（ES Modules使用のため）。

```bash
# Python 3
cd samples/sort-visualizer
python -m http.server 8080

# Node.js (npx)
npx serve .
```

ブラウザで http://localhost:8080 を開く。

## 技術スタック

- Three.js (WebGL)
- ES Modules
- CDN経由でライブラリ読み込み（ビルド不要）

## 色の意味

| 色 | 意味 |
|----|------|
| 水色 | 未ソート |
| オレンジ | 比較中 |
| 黄色 | スワップ中 |
| 緑 | ソート完了 |

## スクリーンショット

```
    ████
    ████  ██████
██  ████  ██████  ████████
██  ████  ██████  ████████  ██████████
──────────────────────────────────────
```

## 今後の拡張案

- [ ] Quick Sort, Merge Sort の追加
- [ ] ステップ実行（一時停止/再開）
- [ ] アルゴリズムの説明パネル
- [ ] 計算量の表示（O(n²) 等）
