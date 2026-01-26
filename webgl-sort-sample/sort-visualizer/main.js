import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// Algorithm Information
// ============================================
const algorithmInfo = {
  bubble: {
    name: 'Bubble Sort',
    description: '隣り合う要素を比較し、大きい方を右に移動させていくシンプルなアルゴリズム。各パスで最大の要素が「泡のように」浮かび上がってくることから名付けられました。',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    pseudocode: [
      '<span class="keyword">for</span> i = 0 <span class="keyword">to</span> n-1:',
      '  <span class="keyword">for</span> j = 0 <span class="keyword">to</span> n-i-1:',
      '    <span class="keyword">if</span> arr[j] > arr[j+1]:',
      '      <span class="function">swap</span>(arr[j], arr[j+1])'
    ]
  },
  selection: {
    name: 'Selection Sort',
    description: '未ソート部分から最小の要素を「選択」し、先頭に移動させていくアルゴリズム。直感的で理解しやすいが、効率は良くありません。',
    complexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    pseudocode: [
      '<span class="keyword">for</span> i = 0 <span class="keyword">to</span> n-1:',
      '  minIdx = i',
      '  <span class="keyword">for</span> j = i+1 <span class="keyword">to</span> n:',
      '    <span class="keyword">if</span> arr[j] < arr[minIdx]:',
      '      minIdx = j',
      '  <span class="function">swap</span>(arr[i], arr[minIdx])'
    ]
  },
  insertion: {
    name: 'Insertion Sort',
    description: 'トランプを手札に並べるように、各要素を適切な位置に「挿入」していくアルゴリズム。ほぼソート済みのデータに対して非常に効率的です。',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    pseudocode: [
      '<span class="keyword">for</span> i = 1 <span class="keyword">to</span> n:',
      '  key = arr[i]',
      '  j = i - 1',
      '  <span class="keyword">while</span> j >= 0 <span class="keyword">and</span> arr[j] > key:',
      '    arr[j+1] = arr[j]',
      '    j = j - 1',
      '  arr[j+1] = key'
    ]
  },
  quick: {
    name: 'Quick Sort',
    description: '「ピボット」を基準に配列を分割し、再帰的にソートする高速なアルゴリズム。平均的なケースで最も効率的なソートの1つです。',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)'
    },
    pseudocode: [
      '<span class="function">quickSort</span>(arr, low, high):',
      '  <span class="keyword">if</span> low < high:',
      '    pivot = <span class="function">partition</span>(arr, low, high)',
      '    <span class="function">quickSort</span>(arr, low, pivot-1)',
      '    <span class="function">quickSort</span>(arr, pivot+1, high)',
      '',
      '<span class="function">partition</span>(arr, low, high):',
      '  pivot = arr[high]',
      '  i = low - 1',
      '  <span class="keyword">for</span> j = low <span class="keyword">to</span> high-1:',
      '    <span class="keyword">if</span> arr[j] <= pivot:',
      '      i++; <span class="function">swap</span>(arr[i], arr[j])',
      '  <span class="function">swap</span>(arr[i+1], arr[high])',
      '  <span class="keyword">return</span> i + 1'
    ]
  },
  merge: {
    name: 'Merge Sort',
    description: '配列を半分ずつ分割し、ソート済みの部分配列を「マージ」していく分割統治法のアルゴリズム。安定ソートで、常にO(n log n)の計算量を保証します。',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)'
    },
    pseudocode: [
      '<span class="function">mergeSort</span>(arr, left, right):',
      '  <span class="keyword">if</span> left < right:',
      '    mid = (left + right) / 2',
      '    <span class="function">mergeSort</span>(arr, left, mid)',
      '    <span class="function">mergeSort</span>(arr, mid+1, right)',
      '    <span class="function">merge</span>(arr, left, mid, right)',
      '',
      '<span class="function">merge</span>(arr, l, m, r):',
      '  <span class="comment">// 左右の部分配列をマージ</span>',
      '  <span class="keyword">while</span> comparing elements:',
      '    pick smaller element'
    ]
  },
  heap: {
    name: 'Heap Sort',
    description: '配列をヒープ（完全二分木）として扱い、最大値を取り出しながらソートするアルゴリズム。常にO(n log n)の計算量で、追加メモリも不要です。',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)'
    },
    pseudocode: [
      '<span class="function">heapSort</span>(arr):',
      '  <span class="comment">// Build max heap</span>',
      '  <span class="keyword">for</span> i = n/2-1 <span class="keyword">downto</span> 0:',
      '    <span class="function">heapify</span>(arr, n, i)',
      '  ',
      '  <span class="comment">// Extract elements</span>',
      '  <span class="keyword">for</span> i = n-1 <span class="keyword">downto</span> 0:',
      '    <span class="function">swap</span>(arr[0], arr[i])',
      '    <span class="function">heapify</span>(arr, i, 0)'
    ]
  },
  counting: {
    name: 'Counting Sort',
    description: '各値の出現回数をカウントし、その情報を使ってソートする線形時間アルゴリズム。値の範囲が限られている整数データに対して非常に高速です。比較を行わないため「非比較ソート」とも呼ばれます。',
    complexity: {
      best: 'O(n + k)',
      average: 'O(n + k)',
      worst: 'O(n + k)',
      space: 'O(k)'
    },
    pseudocode: [
      '<span class="comment">// k = max value in array</span>',
      'count[0..k] = 0',
      '<span class="keyword">for</span> i = 0 <span class="keyword">to</span> n-1:',
      '  count[arr[i]]++',
      '',
      '<span class="comment">// Reconstruct sorted array</span>',
      '<span class="keyword">for</span> i = 0 <span class="keyword">to</span> k:',
      '  <span class="keyword">while</span> count[i] > 0:',
      '    output[idx++] = i',
      '    count[i]--'
    ]
  },
  radix: {
    name: 'Radix Sort',
    description: '数値を桁ごとに分解し、各桁でソート（通常はCounting Sort）を繰り返すアルゴリズム。最下位桁から処理するLSD（Least Significant Digit）方式が一般的です。',
    complexity: {
      best: 'O(d × n)',
      average: 'O(d × n)',
      worst: 'O(d × n)',
      space: 'O(n + k)'
    },
    pseudocode: [
      '<span class="comment">// d = number of digits</span>',
      '<span class="keyword">for</span> digit = 1 <span class="keyword">to</span> d:',
      '  <span class="comment">// Sort by current digit</span>',
      '  <span class="function">countingSort</span>(arr, digit)',
      '',
      '<span class="function">getDigit</span>(num, place):',
      '  <span class="keyword">return</span> (num / place) % 10'
    ]
  },
  bucket: {
    name: 'Bucket Sort',
    description: 'データを複数のバケット（箱）に分散させ、各バケット内でソートしてから結合するアルゴリズム。データが均等に分布している場合に非常に効率的です。',
    complexity: {
      best: 'O(n + k)',
      average: 'O(n + k)',
      worst: 'O(n²)',
      space: 'O(n + k)'
    },
    pseudocode: [
      '<span class="comment">// Create k empty buckets</span>',
      'buckets[0..k-1] = []',
      '',
      '<span class="keyword">for</span> i = 0 <span class="keyword">to</span> n-1:',
      '  idx = arr[i] * k / (max + 1)',
      '  buckets[idx].<span class="function">add</span>(arr[i])',
      '',
      '<span class="keyword">for</span> bucket <span class="keyword">in</span> buckets:',
      '  <span class="function">sort</span>(bucket)',
      '  <span class="function">concat</span>(result, bucket)'
    ]
  }
};

// ============================================
// Three.js Scene Setup
// ============================================
const container = document.getElementById('container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 15, 25);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

const gridHelper = new THREE.GridHelper(30, 30, 0x444444, 0x333333);
scene.add(gridHelper);

// ============================================
// State
// ============================================
let bars = [];
let array = [];
let sorting = false;
let paused = false;
let comparisons = 0;
let swaps = 0;

// ============================================
// DOM Elements
// ============================================
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const algorithmSelect = document.getElementById('algorithm');
const arraySizeSelect = document.getElementById('arraySize');
const speedSelect = document.getElementById('speed');
const comparisonsEl = document.getElementById('comparisons');
const swapsEl = document.getElementById('swaps');
const sortStatusEl = document.getElementById('sortStatus');
const algorithmNameEl = document.getElementById('algorithmName');
const algorithmDescEl = document.getElementById('algorithmDescription');
const codeLinesEl = document.getElementById('codeLines');
const stepTextEl = document.getElementById('stepText');
const stepDetailEl = document.getElementById('stepDetail');

// ============================================
// Colors
// ============================================
const colors = {
  default: new THREE.Color(0x4fc3f7),
  compare: new THREE.Color(0xff5722),
  sorted: new THREE.Color(0x4caf50),
  swap: new THREE.Color(0xffeb3b),
  pivot: new THREE.Color(0xe91e63)
};

// ============================================
// Bar Functions
// ============================================
function createBar(value, index, total) {
  const width = 20 / total;
  const gap = 0.1;
  const geometry = new THREE.BoxGeometry(width - gap, value, width - gap);
  const material = new THREE.MeshPhongMaterial({ color: colors.default });
  const mesh = new THREE.Mesh(geometry, material);

  const x = (index - total / 2) * width + width / 2;
  mesh.position.set(x, value / 2, 0);

  return mesh;
}

function updateBar(index, value, color = null) {
  const total = array.length;
  const width = 20 / total;
  const gap = 0.1;

  const oldColor = color || bars[index].material.color.clone();
  scene.remove(bars[index]);

  const geometry = new THREE.BoxGeometry(width - gap, value, width - gap);
  const material = new THREE.MeshPhongMaterial({ color: oldColor });
  const mesh = new THREE.Mesh(geometry, material);

  const x = (index - total / 2) * width + width / 2;
  mesh.position.set(x, value / 2, 0);

  bars[index] = mesh;
  scene.add(mesh);
}

function setBarColor(index, color) {
  bars[index].material.color.copy(color);
}

function setBarColors(indices, color) {
  indices.forEach(i => setBarColor(i, color));
}

// ============================================
// UI Functions
// ============================================
function updateStats() {
  comparisonsEl.textContent = comparisons;
  swapsEl.textContent = swaps;
}

function setStep(text, detail = '') {
  stepTextEl.textContent = text;
  stepDetailEl.textContent = detail;
}

function highlightCodeLine(lineIndex) {
  const lines = codeLinesEl.querySelectorAll('.code-line');
  lines.forEach((line, i) => {
    line.classList.toggle('active', i === lineIndex);
  });
}

function updateAlgorithmInfo() {
  const algo = algorithmSelect.value;
  const info = algorithmInfo[algo];

  algorithmNameEl.textContent = info.name;
  // 説明に計算量を含める
  const complexityText = `計算量: ${info.complexity.average}`;
  algorithmDescEl.textContent = `${info.description}\n\n${complexityText}`;

  codeLinesEl.innerHTML = info.pseudocode
    .map(line => `<div class="code-line">${line || '&nbsp;'}</div>`)
    .join('');
}

// ============================================
// Array Functions
// ============================================
function initArray() {
  bars.forEach(bar => scene.remove(bar));
  bars = [];

  const size = parseInt(arraySizeSelect.value);
  array = [];

  for (let i = 0; i < size; i++) {
    array.push(Math.random() * 10 + 1);
  }

  for (let i = 0; i < array.length; i++) {
    const bar = createBar(array[i], i, array.length);
    bars.push(bar);
    scene.add(bar);
  }

  comparisons = 0;
  swaps = 0;
  updateStats();
  sortStatusEl.textContent = 'Ready';
  setStep('Press "Start Sort" to begin');
  highlightCodeLine(-1);
}

// ============================================
// Utility Functions
// ============================================
function sleep(ms) {
  return new Promise(resolve => {
    const check = () => {
      if (!paused) {
        setTimeout(resolve, ms);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

async function compare(i, j, highlight = true) {
  if (!sorting) return false;

  if (highlight) {
    setBarColors([i, j], colors.compare);
  }

  comparisons++;
  updateStats();

  await sleep(parseInt(speedSelect.value));

  if (highlight) {
    setBarColors([i, j], colors.default);
  }

  return array[i] > array[j];
}

async function swap(i, j) {
  if (!sorting) return;

  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;

  setBarColors([i, j], colors.swap);

  updateBar(i, array[i], colors.swap);
  updateBar(j, array[j], colors.swap);

  swaps++;
  updateStats();

  await sleep(parseInt(speedSelect.value));

  setBarColors([i, j], colors.default);
}

// ============================================
// Sorting Algorithms
// ============================================
async function bubbleSort() {
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    highlightCodeLine(0);
    setStep(`Pass ${i + 1} of ${n - 1}`, 'Moving largest element to the end');
    await sleep(parseInt(speedSelect.value) / 2);

    for (let j = 0; j < n - i - 1; j++) {
      if (!sorting) return;

      highlightCodeLine(1);
      setStep(`Comparing elements`, `arr[${j}]=${array[j].toFixed(1)} vs arr[${j + 1}]=${array[j + 1].toFixed(1)}`);

      highlightCodeLine(2);
      if (await compare(j, j + 1)) {
        highlightCodeLine(3);
        setStep(`Swapping elements`, `${array[j].toFixed(1)} > ${array[j + 1].toFixed(1)}`);
        await swap(j, j + 1);
      }
    }
    setBarColor(n - i - 1, colors.sorted);
  }
  setBarColor(0, colors.sorted);
}

async function selectionSort() {
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    if (!sorting) return;

    highlightCodeLine(0);
    setStep(`Finding minimum for position ${i}`, 'Scanning unsorted portion');

    let minIdx = i;
    highlightCodeLine(1);

    for (let j = i + 1; j < n; j++) {
      if (!sorting) return;

      highlightCodeLine(2);
      setStep(`Comparing`, `arr[${j}]=${array[j].toFixed(1)} vs current min arr[${minIdx}]=${array[minIdx].toFixed(1)}`);

      setBarColors([j, minIdx], colors.compare);
      comparisons++;
      updateStats();
      await sleep(parseInt(speedSelect.value));

      highlightCodeLine(3);
      if (array[j] < array[minIdx]) {
        setBarColor(minIdx, colors.default);
        minIdx = j;
        highlightCodeLine(4);
      }
      setBarColor(j, colors.default);
    }

    if (minIdx !== i) {
      highlightCodeLine(5);
      setStep(`Swapping`, `Moving minimum ${array[minIdx].toFixed(1)} to position ${i}`);
      await swap(i, minIdx);
    }

    setBarColor(i, colors.sorted);
  }
  setBarColor(n - 1, colors.sorted);
}

async function insertionSort() {
  const n = array.length;
  setBarColor(0, colors.sorted);

  for (let i = 1; i < n; i++) {
    if (!sorting) return;

    highlightCodeLine(0);
    const key = array[i];
    setStep(`Inserting element ${i}`, `Key value: ${key.toFixed(1)}`);

    highlightCodeLine(1);
    highlightCodeLine(2);

    let j = i;
    setBarColor(j, colors.compare);
    await sleep(parseInt(speedSelect.value));

    while (j > 0) {
      if (!sorting) return;

      highlightCodeLine(3);
      setStep(`Comparing with sorted portion`, `arr[${j - 1}]=${array[j - 1].toFixed(1)} vs key=${key.toFixed(1)}`);

      const shouldSwap = await compare(j - 1, j);

      if (shouldSwap) {
        highlightCodeLine(4);
        highlightCodeLine(5);
        setStep(`Shifting element`, `Moving ${array[j - 1].toFixed(1)} to the right`);
        await swap(j - 1, j);
        j--;
      } else {
        break;
      }
    }

    highlightCodeLine(6);
    for (let k = 0; k <= i; k++) {
      setBarColor(k, colors.sorted);
    }
  }
}

async function quickSort() {
  async function partition(low, high) {
    const pivot = array[high];
    setBarColor(high, colors.pivot);
    highlightCodeLine(7);
    setStep(`Pivot selected`, `Pivot value: ${pivot.toFixed(1)} at index ${high}`);
    await sleep(parseInt(speedSelect.value));

    let i = low - 1;
    highlightCodeLine(8);

    for (let j = low; j < high; j++) {
      if (!sorting) return low;

      highlightCodeLine(9);
      setStep(`Partitioning`, `Comparing arr[${j}]=${array[j].toFixed(1)} with pivot ${pivot.toFixed(1)}`);

      setBarColor(j, colors.compare);
      comparisons++;
      updateStats();
      await sleep(parseInt(speedSelect.value));

      highlightCodeLine(10);
      if (array[j] <= pivot) {
        i++;
        highlightCodeLine(11);
        if (i !== j) {
          setStep(`Swapping`, `arr[${i}] and arr[${j}]`);
          await swap(i, j);
        }
      }
      if (j !== high) setBarColor(j, colors.default);
    }

    highlightCodeLine(12);
    setStep(`Placing pivot`, `Moving pivot to correct position ${i + 1}`);
    await swap(i + 1, high);
    setBarColor(i + 1, colors.sorted);

    highlightCodeLine(13);
    return i + 1;
  }

  async function sort(low, high) {
    if (!sorting) return;

    highlightCodeLine(1);
    if (low < high) {
      highlightCodeLine(2);
      setStep(`QuickSort`, `Sorting range [${low}, ${high}]`);

      const pi = await partition(low, high);

      highlightCodeLine(3);
      await sort(low, pi - 1);

      highlightCodeLine(4);
      await sort(pi + 1, high);
    } else if (low === high) {
      setBarColor(low, colors.sorted);
    }
  }

  highlightCodeLine(0);
  await sort(0, array.length - 1);
}

async function mergeSort() {
  async function merge(left, mid, right) {
    highlightCodeLine(7);
    setStep(`Merging`, `Merging [${left}..${mid}] and [${mid + 1}..${right}]`);

    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;

    highlightCodeLine(9);
    while (i < leftArr.length && j < rightArr.length) {
      if (!sorting) return;

      setStep(`Comparing`, `${leftArr[i].toFixed(1)} vs ${rightArr[j].toFixed(1)}`);
      setBarColors([left + i, mid + 1 + j], colors.compare);

      comparisons++;
      updateStats();
      await sleep(parseInt(speedSelect.value));

      highlightCodeLine(10);
      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        updateBar(k, array[k], colors.swap);
        i++;
      } else {
        array[k] = rightArr[j];
        updateBar(k, array[k], colors.swap);
        j++;
      }
      swaps++;
      updateStats();
      await sleep(parseInt(speedSelect.value) / 2);
      setBarColor(k, colors.default);
      k++;
    }

    while (i < leftArr.length) {
      if (!sorting) return;
      array[k] = leftArr[i];
      updateBar(k, array[k]);
      i++;
      k++;
    }

    while (j < rightArr.length) {
      if (!sorting) return;
      array[k] = rightArr[j];
      updateBar(k, array[k]);
      j++;
      k++;
    }
  }

  async function sort(left, right) {
    if (!sorting) return;

    highlightCodeLine(1);
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      highlightCodeLine(2);
      setStep(`Dividing`, `Split at index ${mid}`);

      for (let i = left; i <= right; i++) {
        setBarColor(i, colors.compare);
      }
      await sleep(parseInt(speedSelect.value));
      for (let i = left; i <= right; i++) {
        setBarColor(i, colors.default);
      }

      highlightCodeLine(3);
      await sort(left, mid);

      highlightCodeLine(4);
      await sort(mid + 1, right);

      highlightCodeLine(5);
      await merge(left, mid, right);

      for (let i = left; i <= right; i++) {
        if (left === 0 && right === array.length - 1) {
          setBarColor(i, colors.sorted);
        }
      }
    }
  }

  highlightCodeLine(0);
  await sort(0, array.length - 1);

  for (let i = 0; i < array.length; i++) {
    setBarColor(i, colors.sorted);
  }
}

async function heapSort() {
  const n = array.length;

  async function heapify(size, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    setBarColor(i, colors.compare);

    if (left < size) {
      setBarColor(left, colors.compare);
      comparisons++;
      updateStats();
      await sleep(parseInt(speedSelect.value) / 2);

      if (array[left] > array[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      setBarColor(right, colors.compare);
      comparisons++;
      updateStats();
      await sleep(parseInt(speedSelect.value) / 2);

      if (array[right] > array[largest]) {
        largest = right;
      }
    }

    setBarColor(i, colors.default);
    if (left < size) setBarColor(left, colors.default);
    if (right < size) setBarColor(right, colors.default);

    if (largest !== i) {
      highlightCodeLine(8);
      setStep(`Heapify`, `Swapping arr[${i}] and arr[${largest}]`);
      await swap(i, largest);
      await heapify(size, largest);
    }
  }

  // Build max heap
  highlightCodeLine(2);
  setStep(`Building Max Heap`, 'Converting array to heap structure');

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (!sorting) return;
    highlightCodeLine(3);
    await heapify(n, i);
  }

  // Extract elements
  highlightCodeLine(6);
  for (let i = n - 1; i > 0; i--) {
    if (!sorting) return;

    highlightCodeLine(7);
    setStep(`Extracting max`, `Moving ${array[0].toFixed(1)} to position ${i}`);
    await swap(0, i);

    setBarColor(i, colors.sorted);

    highlightCodeLine(8);
    await heapify(i, 0);
  }

  setBarColor(0, colors.sorted);
}

async function countingSort() {
  const n = array.length;

  // 元の値を保存（キーは値を10倍して整数化 - より細かい粒度でソート）
  const scale = 10;
  const items = array.map((val, idx) => ({ val, key: Math.floor(val * scale) }));
  const max = Math.max(...items.map(item => item.key));

  highlightCodeLine(0);
  setStep('Counting Sort', `Max key: ${max}`);
  await sleep(parseInt(speedSelect.value));

  // カウント配列を作成
  const count = new Array(max + 1).fill(0);

  highlightCodeLine(1);
  setStep('Initializing count array', `Size: ${max + 1}`);
  await sleep(parseInt(speedSelect.value));

  // 各値をカウント
  highlightCodeLine(2);
  for (let i = 0; i < n; i++) {
    if (!sorting) return;

    highlightCodeLine(3);
    setBarColor(i, colors.compare);
    setStep('Counting', `Value ${items[i].val.toFixed(1)} → key ${items[i].key}`);

    count[items[i].key]++;
    comparisons++;
    updateStats();

    await sleep(parseInt(speedSelect.value));
    setBarColor(i, colors.default);
  }

  // 累積カウントを計算
  highlightCodeLine(5);
  setStep('Cumulative count', 'Calculating positions');
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  await sleep(parseInt(speedSelect.value));

  // 出力配列を作成（後ろから処理で安定ソート）
  const output = new Array(n);

  highlightCodeLine(6);
  setStep('Placing elements', 'Building sorted array');
  await sleep(parseInt(speedSelect.value));

  highlightCodeLine(7);
  for (let i = n - 1; i >= 0; i--) {
    if (!sorting) return;

    const item = items[i];
    count[item.key]--;
    const pos = count[item.key];
    output[pos] = item.val;

    highlightCodeLine(8);
    swaps++;
    updateStats();
  }

  // 結果を反映：一旦すべてのバーを削除して再構築
  highlightCodeLine(9);
  setStep('Rebuilding', 'Displaying sorted array');

  for (let i = 0; i < n; i++) {
    if (!sorting) return;

    array[i] = output[i];

    // バーを削除して新しい高さで再作成
    scene.remove(bars[i]);
    bars[i] = createBar(array[i], i, n);
    bars[i].material.color.copy(colors.swap);
    scene.add(bars[i]);

    setStep('Result', `Position ${i}: ${array[i].toFixed(1)}`);
    await sleep(parseInt(speedSelect.value) / 2);

    bars[i].material.color.copy(colors.sorted);
  }
}

async function radixSort() {
  const n = array.length;

  // 整数値に変換（1-100の範囲にスケール）
  const scale = 10;
  for (let i = 0; i < n; i++) {
    array[i] = Math.floor(array[i] * scale);
    updateBar(i, array[i] / scale);
  }

  const max = Math.max(...array);
  const maxDigits = Math.floor(Math.log10(max)) + 1;

  highlightCodeLine(0);
  setStep('Radix Sort', `Max value: ${max}, Digits: ${maxDigits}`);
  await sleep(parseInt(speedSelect.value));

  // 各桁でソート（LSD方式）
  for (let digit = 0; digit < maxDigits; digit++) {
    if (!sorting) return;

    const place = Math.pow(10, digit);

    highlightCodeLine(1);
    setStep(`Processing digit ${digit + 1}`, `Place value: ${place}`);
    await sleep(parseInt(speedSelect.value));

    // Counting sortを使用して現在の桁でソート
    const output = new Array(n);
    const count = new Array(10).fill(0);

    // 各桁のカウント
    highlightCodeLine(2);
    for (let i = 0; i < n; i++) {
      if (!sorting) return;

      const digitValue = Math.floor(array[i] / place) % 10;
      count[digitValue]++;

      setBarColor(i, colors.compare);
      setStep(`Counting digit`, `Value ${array[i]}, digit ${digitValue}`);
      comparisons++;
      updateStats();

      await sleep(parseInt(speedSelect.value) / 2);
      setBarColor(i, colors.default);
    }

    // 累積カウント
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // 出力配列を構築（後ろから処理して安定ソートを保証）
    highlightCodeLine(3);
    for (let i = n - 1; i >= 0; i--) {
      if (!sorting) return;

      const digitValue = Math.floor(array[i] / place) % 10;
      const newPos = count[digitValue] - 1;
      output[newPos] = array[i];
      count[digitValue]--;

      setBarColor(i, colors.swap);
      setStep(`Moving element`, `${array[i]} to position ${newPos}`);
      swaps++;
      updateStats();

      await sleep(parseInt(speedSelect.value) / 2);
      setBarColor(i, colors.default);
    }

    // 配列を更新
    for (let i = 0; i < n; i++) {
      array[i] = output[i];
      updateBar(i, array[i] / scale, colors.pivot);
    }
    await sleep(parseInt(speedSelect.value));

    for (let i = 0; i < n; i++) {
      setBarColor(i, colors.default);
    }
  }

  // 元のスケールに戻す
  for (let i = 0; i < n; i++) {
    array[i] = array[i] / scale;
    updateBar(i, array[i], colors.sorted);
  }
}

async function bucketSort() {
  const n = array.length;
  const bucketCount = Math.ceil(Math.sqrt(n)); // バケット数
  const max = Math.max(...array);
  const min = Math.min(...array);
  const range = max - min;

  highlightCodeLine(0);
  setStep('Bucket Sort', `${bucketCount} buckets for ${n} elements`);
  await sleep(parseInt(speedSelect.value));

  // バケットを作成
  const buckets = Array.from({ length: bucketCount }, () => []);

  highlightCodeLine(1);
  setStep('Creating buckets', `Range: ${min.toFixed(1)} - ${max.toFixed(1)}`);
  await sleep(parseInt(speedSelect.value));

  // 要素をバケットに分配
  highlightCodeLine(3);
  for (let i = 0; i < n; i++) {
    if (!sorting) return;

    highlightCodeLine(4);
    const bucketIdx = Math.min(
      Math.floor(((array[i] - min) / range) * (bucketCount - 1)),
      bucketCount - 1
    );

    setBarColor(i, colors.compare);
    setStep('Distributing', `${array[i].toFixed(1)} → bucket ${bucketIdx}`);

    buckets[bucketIdx].push({ value: array[i], originalIdx: i });
    comparisons++;
    updateStats();

    await sleep(parseInt(speedSelect.value));

    // バケットの色で表示（バケットごとに異なる色相）
    const hue = (bucketIdx / bucketCount) * 0.7; // 0-0.7の範囲
    const bucketColor = new THREE.Color().setHSL(hue, 0.8, 0.5);
    setBarColor(i, bucketColor);
  }

  await sleep(parseInt(speedSelect.value));

  // 各バケット内をソート（挿入ソート）
  highlightCodeLine(7);
  for (let b = 0; b < bucketCount; b++) {
    if (buckets[b].length > 1) {
      highlightCodeLine(8);
      setStep(`Sorting bucket ${b}`, `${buckets[b].length} elements`);

      // 簡易的な挿入ソート
      for (let i = 1; i < buckets[b].length; i++) {
        const key = buckets[b][i];
        let j = i - 1;
        while (j >= 0 && buckets[b][j].value > key.value) {
          buckets[b][j + 1] = buckets[b][j];
          j--;
          swaps++;
          updateStats();
        }
        buckets[b][j + 1] = key;
      }
      await sleep(parseInt(speedSelect.value));
    }
  }

  // バケットを結合
  highlightCodeLine(9);
  let idx = 0;
  for (let b = 0; b < bucketCount; b++) {
    for (const item of buckets[b]) {
      if (!sorting) return;

      array[idx] = item.value;
      updateBar(idx, array[idx], colors.swap);
      setStep('Concatenating', `Placing ${item.value.toFixed(1)} at index ${idx}`);
      swaps++;
      updateStats();

      await sleep(parseInt(speedSelect.value) / 2);
      setBarColor(idx, colors.sorted);
      idx++;
    }
  }
}

// ============================================
// Event Handlers
// ============================================
async function startSort() {
  if (sorting) return;

  sorting = true;
  paused = false;
  startBtn.disabled = true;
  resetBtn.disabled = true;
  pauseBtn.style.display = 'block';
  pauseBtn.textContent = 'Pause';
  sortStatusEl.textContent = 'Sorting...';

  const algorithm = algorithmSelect.value;

  switch (algorithm) {
    case 'bubble':
      await bubbleSort();
      break;
    case 'selection':
      await selectionSort();
      break;
    case 'insertion':
      await insertionSort();
      break;
    case 'quick':
      await quickSort();
      break;
    case 'merge':
      await mergeSort();
      break;
    case 'heap':
      await heapSort();
      break;
    case 'counting':
      await countingSort();
      break;
    case 'radix':
      await radixSort();
      break;
    case 'bucket':
      await bucketSort();
      break;
  }

  sorting = false;
  startBtn.disabled = false;
  resetBtn.disabled = false;
  pauseBtn.style.display = 'none';

  if (sortStatusEl.textContent === 'Sorting...') {
    sortStatusEl.textContent = 'Complete!';
    setStep('Sorting Complete!', `${comparisons} comparisons, ${swaps} swaps`);
    highlightCodeLine(-1);
  }
}

function togglePause() {
  paused = !paused;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
  sortStatusEl.textContent = paused ? 'Paused' : 'Sorting...';
}

function reset() {
  sorting = false;
  paused = false;
  pauseBtn.style.display = 'none';
  initArray();
}

// ============================================
// Event Listeners
// ============================================
startBtn.addEventListener('click', startSort);
resetBtn.addEventListener('click', reset);
pauseBtn.addEventListener('click', togglePause);
arraySizeSelect.addEventListener('change', reset);
algorithmSelect.addEventListener('change', () => {
  updateAlgorithmInfo();
  reset();
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// Animation Loop
// ============================================
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// ============================================
// Initialize
// ============================================
updateAlgorithmInfo();
initArray();
animate();
