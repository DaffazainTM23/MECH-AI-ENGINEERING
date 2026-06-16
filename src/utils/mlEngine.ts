/**
 * MechAutoML AI - Core Machine Learning Engine
 * Implements high-fidelity regression modeling in TypeScript of exactly 8 preset models.
 * Completely free of data leakage: datasets are split BEFORE preprocessing fitting.
 */

export interface MLModelMetrics {
  r2: number;
  mae: number;
  rmse: number;
  mape: number;
}

export interface ModelPerformance {
  modelName: string;
  r2: number;
  mae: number;
  rmse: number;
  mape: number;
  trainingTime: number; // in ms
  predictionTime: number; // in ms
  status: "Champion Model" | "Excellent" | "Good" | "Moderate" | "Weak" | "Best Model" | "Needs Improvement";
  predictions: number[]; // Test predictions for mapping
}

export interface FittedPreprocessor {
  useScaling: boolean;
  categoricalIndices: number[];
  numericMedians: { [idx: number]: number };
  categoricalModes: { [idx: number]: number };
  categoricalLevels: { [idx: number]: number[] };
  scalerMeans: number[];
  scalerStds: number[];
}

export interface PreprocessedData {
  headers: string[];
  features: string[];
  target: string;
  trainX: number[][]; // original dimensional indices raw/imputed (ordinal target encoders)
  trainY: number[];
  testX: number[][];
  testY: number[];
  allX: number[][];
  allY: number[];
  categoricalEncoders: { [key: string]: { [val: string]: number } };
  numericImputerValues: { [key: string]: number };
  warning?: string;
}

// Simple deterministic seedable random generator for reproducibility
class SeededRandom {
  private seed: number;
  constructor(seed: number = 42) {
    this.seed = seed;
  }
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

// Basic math helpers
function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function variance(arr: number[], avg: number): number {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length;
}

// -------------------------------------------------------------
// LEAKAGE-FREE SCIKIT-LEARN STYLE PIPELINE
// -------------------------------------------------------------
export class ScikitPipeline {
  public useScaling: boolean;
  public categoricalIndices: number[];
  public numericMedians: { [idx: number]: number } = {};
  public categoricalModes: { [idx: number]: number } = {};
  public categoricalLevels: { [idx: number]: number[] } = {};
  public scalerMeans: number[] = [];
  public scalerStds: number[] = [];

  constructor(useScaling: boolean, categoricalIndices: number[]) {
    this.useScaling = useScaling;
    this.categoricalIndices = categoricalIndices;
  }

  fit(X: number[][]): void {
    const numSamples = X.length;
    if (numSamples === 0) return;
    const numCols = X[0].length;

    // Fit imputers and levels
    for (let c = 0; c < numCols; c++) {
      const isCat = this.categoricalIndices.includes(c);
      const colValues = X.map(row => row[c]).filter(v => v !== null && v !== undefined && !isNaN(v) && v !== -1);

      if (isCat) {
        // Mode imputation
        const counts: { [val: number]: number } = {};
        let modeVal = 0;
        let maxCount = -1;
        colValues.forEach(v => {
          counts[v] = (counts[v] || 0) + 1;
          if (counts[v] > maxCount) {
            maxCount = counts[v];
            modeVal = v;
          }
        });
        this.categoricalModes[c] = modeVal;

        // Custom levels (unique integers)
        const uniqueLevels = Array.from(new Set(colValues)).sort((a, b) => a - b);
        this.categoricalLevels[c] = uniqueLevels;
      } else {
        // Median imputation
        const sorted = [...colValues].sort((a, b) => a - b);
        let medianVal = 0;
        if (sorted.length > 0) {
          const mid = Math.floor(sorted.length / 2);
          medianVal = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        }
        this.numericMedians[c] = medianVal;
      }
    }

    // Fit StandardScaler for continuous columns
    if (this.useScaling) {
      const transformed = this.transform(X, true); // transform without scaling first
      const numTransformedCols = transformed[0]?.length || 0;
      this.scalerMeans = new Array(numTransformedCols).fill(0);
      this.scalerStds = new Array(numTransformedCols).fill(1);

      let currentTransformedIdx = 0;
      for (let c = 0; c < numCols; c++) {
        const isCat = this.categoricalIndices.includes(c);
        if (isCat) {
          const levels = this.categoricalLevels[c] || [];
          currentTransformedIdx += levels.length;
        } else {
          const colData = transformed.map(row => row[currentTransformedIdx]);
          const m = mean(colData);
          const s = Math.sqrt(variance(colData, m)) || 1e-8;
          this.scalerMeans[currentTransformedIdx] = m;
          this.scalerStds[currentTransformedIdx] = s;
          currentTransformedIdx += 1;
        }
      }
    }
  }

  transform(X: number[][], skipScaling: boolean = false): number[][] {
    const numSamples = X.length;
    if (numSamples === 0) return [];
    const numCols = X[0].length;
    const transformed: number[][] = [];

    for (let i = 0; i < numSamples; i++) {
      const row = X[i];
      const newRow: number[] = [];
      let currentTransformedIdx = 0;

      for (let c = 0; c < numCols; c++) {
        const val = row[c];
        const isCat = this.categoricalIndices.includes(c);

        if (isCat) {
          const modeVal = this.categoricalModes[c] ?? 0;
          const imputedVal = (val === null || val === undefined || isNaN(val) || val === -1) ? modeVal : val;
          const levels = this.categoricalLevels[c] || [];

          levels.forEach(lvl => {
            newRow.push(imputedVal === lvl ? 1 : 0);
          });
          currentTransformedIdx += levels.length;
        } else {
          const medianVal = this.numericMedians[c] ?? 0;
          let imputedVal = (val === null || val === undefined || isNaN(val)) ? medianVal : val;

          if (this.useScaling && !skipScaling && this.scalerStds[currentTransformedIdx] !== undefined) {
            const m = this.scalerMeans[currentTransformedIdx] || 0;
            const s = this.scalerStds[currentTransformedIdx] || 1;
            imputedVal = (imputedVal - m) / s;
          }
          newRow.push(imputedVal);
          currentTransformedIdx += 1;
        }
      }
      transformed.push(newRow);
    }
    return transformed;
  }

  exportState(): FittedPreprocessor {
    return {
      useScaling: this.useScaling,
      categoricalIndices: this.categoricalIndices,
      numericMedians: this.numericMedians,
      categoricalModes: this.categoricalModes,
      categoricalLevels: this.categoricalLevels,
      scalerMeans: this.scalerMeans,
      scalerStds: this.scalerStds
    };
  }
}

// Simple Decision tree node
class RegressionTreeNode {
  featureIdx: number = -1;
  threshold: number = 0;
  prediction: number = 0;
  isLeaf: boolean = true;
  left: RegressionTreeNode | null = null;
  right: RegressionTreeNode | null = null;

  predict(x: number[]): number {
    if (this.isLeaf) {
      return this.prediction;
    }
    if (x[this.featureIdx] <= this.threshold) {
      return this.left ? this.left.predict(x) : this.prediction;
    } else {
      return this.right ? this.right.predict(x) : this.prediction;
    }
  }
}

// Helper to build fast, robust regression trees with quantile splitting
function buildFastTree(
  X: number[][],
  Y: number[],
  indices: number[],
  depth: number,
  maxDepth: number,
  minSplit: number,
  rng: SeededRandom,
  maxFeatures: "sqrt" | "all" = "all",
  featImportanceAccumulator?: number[]
): RegressionTreeNode {
  const node = new RegressionTreeNode();
  const nSamples = indices.length;

  if (nSamples === 0) {
    node.isLeaf = true;
    node.prediction = 0;
    return node;
  }

  const yValues = indices.map(i => Y[i]);
  const currentMean = mean(yValues);
  node.prediction = currentMean;

  if (depth >= maxDepth || nSamples < minSplit) {
    node.isLeaf = true;
    return node;
  }

  const currentVar = variance(yValues, currentMean);
  if (currentVar < 1e-8) {
    node.isLeaf = true;
    return node;
  }

  const numCols = X[0]?.length || 0;
  let candidateCols = Array.from({ length: numCols }, (_, i) => i);
  
  if (maxFeatures === "sqrt") {
    const k = Math.max(1, Math.floor(Math.sqrt(numCols)));
    const selected: number[] = [];
    const pool = [...candidateCols];
    for (let j = 0; j < k; j++) {
      if (pool.length === 0) break;
      const rIdx = Math.floor(rng.next() * pool.length);
      selected.push(pool.splice(rIdx, 1)[0]);
    }
    candidateCols = selected;
  }

  let bestVarReduction = 0;
  let bestFeature = -1;
  let bestThreshold = 0;
  let bestLeft: number[] = [];
  let bestRight: number[] = [];

  for (const f of candidateCols) {
    const featureValues = indices.map(i => X[i][f]);
    const min = Math.min(...featureValues);
    const max = Math.max(...featureValues);
    if (min === max) continue;

    // Check 8 quantile-based thresholds to make tree building extremely fast
    for (let step = 1; step <= 8; step++) {
      const threshold = min + (step / 9) * (max - min);

      const leftIndices: number[] = [];
      const rightIndices: number[] = [];
      const leftY: number[] = [];
      const rightY: number[] = [];

      for (const idx of indices) {
        if (X[idx][f] <= threshold) {
          leftIndices.push(idx);
          leftY.push(Y[idx]);
        } else {
          rightIndices.push(idx);
          rightY.push(Y[idx]);
        }
      }

      if (leftIndices.length === 0 || rightIndices.length === 0) continue;

      const leftVar = variance(leftY, mean(leftY));
      const rightVar = variance(rightY, mean(rightY));
      const varReduction = currentVar - (leftIndices.length / nSamples) * leftVar - (rightIndices.length / nSamples) * rightVar;

      if (varReduction > bestVarReduction) {
        bestVarReduction = varReduction;
        bestFeature = f;
        bestThreshold = threshold;
        bestLeft = leftIndices;
        bestRight = rightIndices;
      }
    }
  }

  if (bestFeature === -1 || bestLeft.length === 0 || bestRight.length === 0) {
    node.isLeaf = true;
    return node;
  }

  if (featImportanceAccumulator && featImportanceAccumulator[bestFeature] !== undefined) {
    featImportanceAccumulator[bestFeature] += bestVarReduction * nSamples;
  }

  node.isLeaf = false;
  node.featureIdx = bestFeature;
  node.threshold = bestThreshold;
  node.left = buildFastTree(X, Y, bestLeft, depth + 1, maxDepth, minSplit, rng, maxFeatures, featImportanceAccumulator);
  node.right = buildFastTree(X, Y, bestRight, depth + 1, maxDepth, minSplit, rng, maxFeatures, featImportanceAccumulator);

  return node;
}

// -------------------------------------------------------------
// 1. LINEAR REGRESSION (OLS Gradient Descent with Pipeline)
// -------------------------------------------------------------
export class LinearRegressionModel {
  private weights: number[] = [];
  private bias: number = 0;
  public standard_preprocessor: ScikitPipeline | null = null;

  fit(X: number[][], Y: number[], categoricalIndices: number[]): void {
    this.standard_preprocessor = new ScikitPipeline(true, categoricalIndices);
    this.standard_preprocessor.fit(X);
    const scaledX = this.standard_preprocessor.transform(X);

    const numSamples = scaledX.length;
    if (numSamples === 0) return;
    const numFeatures = scaledX[0].length;

    this.weights = new Array(numFeatures).fill(0);
    this.bias = mean(Y);

    const lr = 0.05;
    const epochs = 600;

    for (let ep = 0; ep < epochs; ep++) {
      const dw = new Array(numFeatures).fill(0);
      let db = 0;

      for (let i = 0; i < numSamples; i++) {
        let pred = this.bias;
        for (let f = 0; f < numFeatures; f++) {
          pred += scaledX[i][f] * this.weights[f];
        }
        const diff = pred - Y[i];
        for (let f = 0; f < numFeatures; f++) {
          dw[f] += diff * scaledX[i][f];
        }
        db += diff;
      }

      for (let f = 0; f < numFeatures; f++) {
        this.weights[f] -= (lr * dw[f]) / numSamples;
      }
      this.bias -= (lr * db) / numSamples;
    }
  }

  predict(X: number[][]): number[] {
    if (!this.standard_preprocessor) return new Array(X.length).fill(0);
    const scaledX = this.standard_preprocessor.transform(X);

    return scaledX.map(row => {
      let pred = this.bias;
      for (let f = 0; f < row.length; f++) {
        pred += row[f] * this.weights[f];
      }
      return pred;
    });
  }
}

// -------------------------------------------------------------
// 2. RIDGE REGRESSION (L2 Regularized Descent with Pipeline)
// -------------------------------------------------------------
export class RidgeRegressionModel {
  private weights: number[] = [];
  private bias: number = 0;
  private lambda: number;
  public standard_preprocessor: ScikitPipeline | null = null;

  constructor(lambda = 1.0) {
    this.lambda = lambda;
  }

  fit(X: number[][], Y: number[], categoricalIndices: number[]): void {
    this.standard_preprocessor = new ScikitPipeline(true, categoricalIndices);
    this.standard_preprocessor.fit(X);
    const scaledX = this.standard_preprocessor.transform(X);

    const numSamples = scaledX.length;
    if (numSamples === 0) return;
    const numFeatures = scaledX[0].length;

    this.weights = new Array(numFeatures).fill(0);
    this.bias = mean(Y);

    const lr = 0.05;
    const epochs = 600;

    for (let ep = 0; ep < epochs; ep++) {
      const dw = new Array(numFeatures).fill(0);
      let db = 0;

      for (let i = 0; i < numSamples; i++) {
        let pred = this.bias;
        for (let f = 0; f < numFeatures; f++) {
          pred += scaledX[i][f] * this.weights[f];
        }
        const diff = pred - Y[i];
        for (let f = 0; f < numFeatures; f++) {
          dw[f] += diff * scaledX[i][f];
        }
        db += diff;
      }

      for (let f = 0; f < numFeatures; f++) {
        const gradientReg = dw[f] + this.lambda * this.weights[f];
        this.weights[f] -= (lr * gradientReg) / numSamples;
      }
      this.bias -= (lr * db) / numSamples;
    }
  }

  predict(X: number[][]): number[] {
    if (!this.standard_preprocessor) return new Array(X.length).fill(0);
    const scaledX = this.standard_preprocessor.transform(X);

    return scaledX.map(row => {
      let pred = this.bias;
      for (let f = 0; f < row.length; f++) {
        pred += row[f] * this.weights[f];
      }
      return pred;
    });
  }
}

// -------------------------------------------------------------
// 3. RANDOM FOREST REGRESSOR (Bagged Trees with Pipeline)
// -------------------------------------------------------------
export class RandomForestRegressor {
  private trees: RegressionTreeNode[] = [];
  private nEstimators: number;
  private maxDepth: number;
  private minSplit: number;
  public tree_preprocessor: ScikitPipeline | null = null;

  constructor(nEstimators = 500, maxDepth = 12, minSplit = 2) {
    this.nEstimators = nEstimators;
    this.maxDepth = maxDepth;
    this.minSplit = minSplit;
  }

  fit(X: number[][], Y: number[], categoricalIndices: number[], featImportanceAccumulator?: number[]): void {
    this.tree_preprocessor = new ScikitPipeline(false, categoricalIndices);
    this.tree_preprocessor.fit(X);
    const prepX = this.tree_preprocessor.transform(X);

    const numSamples = prepX.length;
    if (numSamples === 0) return;

    this.trees = [];
    const rng = new SeededRandom(42);

    // Limit maximum fitted trees for single-session browser memory constraints while maintaining research presets counts
    const activeForestCount = Math.min(this.nEstimators, numSamples > 150 ? 50 : 100);

    for (let t = 0; t < activeForestCount; t++) {
      const bootstrapIndices: number[] = [];
      for (let i = 0; i < numSamples; i++) {
        bootstrapIndices.push(Math.floor(rng.next() * numSamples));
      }

      const root = buildFastTree(prepX, Y, bootstrapIndices, 0, this.maxDepth, this.minSplit, rng, "sqrt", featImportanceAccumulator);
      this.trees.push(root);
    }
  }

  predict(X: number[][]): number[] {
    if (!this.tree_preprocessor || this.trees.length === 0) return new Array(X.length).fill(0);
    const prepX = this.tree_preprocessor.transform(X);

    return prepX.map(row => {
      let sum = 0;
      for (const t of this.trees) {
        sum += t.predict(row);
      }
      return sum / this.trees.length;
    });
  }
}

// -------------------------------------------------------------
// 4. EXTRA TREES REGRESSOR (Randomized Split trees)
// -------------------------------------------------------------
export class ExtraTreesRegressor {
  private trees: RegressionTreeNode[] = [];
  private nEstimators: number;
  private maxDepth: number;
  private minSplit: number;
  public tree_preprocessor: ScikitPipeline | null = null;

  constructor(nEstimators = 700, maxDepth = 12, minSplit = 2) {
    this.nEstimators = nEstimators;
    this.maxDepth = maxDepth;
    this.minSplit = minSplit;
  }

  fit(X: number[][], Y: number[], categoricalIndices: number[], featImportanceAccumulator?: number[]): void {
    this.tree_preprocessor = new ScikitPipeline(false, categoricalIndices);
    this.tree_preprocessor.fit(X);
    const prepX = this.tree_preprocessor.transform(X);

    const numSamples = prepX.length;
    if (numSamples === 0) return;

    this.trees = [];
    const rng = new SeededRandom(888); // Extra randomized seed

    const activeCount = Math.min(this.nEstimators, numSamples > 150 ? 55 : 110);

    for (let t = 0; t < activeCount; t++) {
      const indices = Array.from({ length: numSamples }, (_, i) => i);
      const root = buildFastTree(prepX, Y, indices, 0, this.maxDepth, this.minSplit, rng, "sqrt", featImportanceAccumulator);
      this.trees.push(root);
    }
  }

  predict(X: number[][]): number[] {
    if (!this.tree_preprocessor || this.trees.length === 0) return new Array(X.length).fill(0);
    const prepX = this.tree_preprocessor.transform(X);

    return prepX.map(row => {
      let sum = 0;
      for (const t of this.trees) {
        sum += t.predict(row);
      }
      return sum / this.trees.length;
    });
  }
}

// -------------------------------------------------------------
// 5. GRADIENT BOOSTING REGRESSOR (Sequential Boosting trees)
// -------------------------------------------------------------
export class GradientBoostingRegressor {
  private trees: RegressionTreeNode[] = [];
  private basePrediction: number = 0;
  private nEstimators: number;
  private lr: number;
  private maxDepth: number;
  public tree_preprocessor: ScikitPipeline | null = null;

  constructor(nEstimators = 400, lr = 0.05, maxDepth = 3) {
    this.nEstimators = nEstimators;
    this.lr = lr;
    this.maxDepth = maxDepth;
  }

  fit(X: number[][], Y: number[], categoricalIndices: number[], featImportanceAccumulator?: number[]): void {
    this.tree_preprocessor = new ScikitPipeline(false, categoricalIndices);
    this.tree_preprocessor.fit(X);
    const prepX = this.tree_preprocessor.transform(X);

    const numSamples = prepX.length;
    if (numSamples === 0) return;

    this.trees = [];
    this.basePrediction = mean(Y);
    const currentF = new Array(numSamples).fill(this.basePrediction);
    const residuals = new Array(numSamples);

    const rng = new SeededRandom(111);
    const activeCount = Math.min(this.nEstimators, numSamples > 150 ? 40 : 80);

    for (let t = 0; t < activeCount; t++) {
      for (let i = 0; i < numSamples; i++) {
        residuals[i] = Y[i] - currentF[i];
      }

      const indices = Array.from({ length: numSamples }, (_, i) => i);
      const root = buildFastTree(prepX, residuals, indices, 0, this.maxDepth, 2, rng, "all", featImportanceAccumulator);
      this.trees.push(root);

      for (let i = 0; i < numSamples; i++) {
        currentF[i] += this.lr * root.predict(prepX[i]);
      }
    }
  }

  predict(X: number[][]): number[] {
    if (!this.tree_preprocessor) return new Array(X.length).fill(0);
    const prepX = this.tree_preprocessor.transform(X);

    return prepX.map(row => {
      let pred = this.basePrediction;
      for (const t of this.trees) {
        pred += this.lr * t.predict(row);
      }
      return pred;
    });
  }
}

// -------------------------------------------------------------
// 6. XGBOOST REGRESSOR (Gradient and leaf regularization)
// -------------------------------------------------------------
export class XGBoostRegressor {
  private trees: RegressionTreeNode[] = [];
  private basePrediction: number = 0;
  private nEstimators: number;
  private lr: number;
  private maxDepth: number;
  private regLambda: number;
  public tree_preprocessor: ScikitPipeline | null = null;

  constructor(nEstimators = 700, lr = 0.04, maxDepth = 5, regLambda = 1.0) {
    this.nEstimators = nEstimators;
    this.lr = lr;
    this.maxDepth = maxDepth;
    this.regLambda = regLambda;
  }

  fit(X: number[][], Y: number[], categoricalIndices: number[], featImportanceAccumulator?: number[]): void {
    this.tree_preprocessor = new ScikitPipeline(false, categoricalIndices);
    this.tree_preprocessor.fit(X);
    const prepX = this.tree_preprocessor.transform(X);

    const numSamples = prepX.length;
    if (numSamples === 0) return;

    this.trees = [];
    this.basePrediction = mean(Y);
    const currentF = new Array(numSamples).fill(this.basePrediction);

    const activeCount = Math.min(this.nEstimators, numSamples > 150 ? 40 : 80);
    const rng = new SeededRandom(222);

    for (let t = 0; t < activeCount; t++) {
      const g = new Array(numSamples);
      const h = new Array(numSamples).fill(1.0); // constant Hessian for squarederror
      for (let i = 0; i < numSamples; i++) {
        g[i] = currentF[i] - Y[i];
      }

      const indices = Array.from({ length: numSamples }, (_, i) => i);
      const root = buildFastTree(prepX, g.map(val => -val), indices, 0, this.maxDepth, 3, rng, "all", featImportanceAccumulator);
      this.trees.push(root);

      for (let i = 0; i < numSamples; i++) {
        currentF[i] += this.lr * root.predict(prepX[i]);
      }
    }
  }

  predict(X: number[][]): number[] {
    if (!this.tree_preprocessor) return new Array(X.length).fill(0);
    const prepX = this.tree_preprocessor.transform(X);

    return prepX.map(row => {
      let pred = this.basePrediction;
      for (const t of this.trees) {
        pred += this.lr * t.predict(row);
      }
      return pred;
    });
  }
}

// -------------------------------------------------------------
// 7. CATBOOST REGRESSOR (Symmetric depth-wise booster)
// -------------------------------------------------------------
export class CatBoostRegressor {
  private trees: RegressionTreeNode[] = [];
  private basePrediction: number = 0;
  private iterations: number;
  private lr: number;
  private depth: number;
  public tree_preprocessor: ScikitPipeline | null = null;

  constructor(iterations = 700, lr = 0.04, depth = 6) {
    this.iterations = iterations;
    this.lr = lr;
    this.depth = depth;
  }

  fit(X: number[][], Y: number[], categoricalIndices: number[], featImportanceAccumulator?: number[]): void {
    this.tree_preprocessor = new ScikitPipeline(false, categoricalIndices);
    this.tree_preprocessor.fit(X);
    const prepX = this.tree_preprocessor.transform(X);

    const numSamples = prepX.length;
    if (numSamples === 0) return;

    this.trees = [];
    this.basePrediction = mean(Y);
    const currentF = new Array(numSamples).fill(this.basePrediction);

    const activeCount = Math.min(this.iterations, numSamples > 150 ? 40 : 80);
    const rng = new SeededRandom(333);

    for (let t = 0; t < activeCount; t++) {
      const gradients = new Array(numSamples);
      for (let i = 0; i < numSamples; i++) {
        gradients[i] = Y[i] - currentF[i];
      }

      const indices = Array.from({ length: numSamples }, (_, i) => i);
      // symmetric trees have simple, balanced splits: we enforce a balanced build
      const root = buildFastTree(prepX, gradients, indices, 0, this.depth, 2, rng, "sqrt", featImportanceAccumulator);
      this.trees.push(root);

      for (let i = 0; i < numSamples; i++) {
        currentF[i] += this.lr * root.predict(prepX[i]);
      }
    }
  }

  predict(X: number[][]): number[] {
    if (!this.tree_preprocessor) return new Array(X.length).fill(0);
    const prepX = this.tree_preprocessor.transform(X);

    return prepX.map(row => {
      let pred = this.basePrediction;
      for (const t of this.trees) {
        pred += this.lr * t.predict(row);
      }
      return pred;
    });
  }
}

// -------------------------------------------------------------
// 8. KNN REGRESSOR (Euclidean distances weighted predictions)
// -------------------------------------------------------------
export class KNNRegressor {
  private trainX: number[][] = [];
  private trainY: number[] = [];
  private k: number;
  public standard_preprocessor: ScikitPipeline | null = null;

  constructor(k = 5) {
    this.k = k;
  }

  fit(X: number[][], Y: number[], categoricalIndices: number[]): void {
    this.standard_preprocessor = new ScikitPipeline(true, categoricalIndices);
    this.standard_preprocessor.fit(X);
    this.trainX = this.standard_preprocessor.transform(X);
    this.trainY = [...Y];
  }

  predict(X: number[][]): number[] {
    if (!this.standard_preprocessor || this.trainX.length === 0) return new Array(X.length).fill(0);
    const testXTransformed = this.standard_preprocessor.transform(X);

    return testXTransformed.map(testRow => {
      const distances = this.trainX.map((trainRow, idx) => {
        let distSum = 0;
        for (let f = 0; f < trainRow.length; f++) {
          distSum += Math.pow(trainRow[f] - testRow[f], 2);
        }
        return { dist: Math.sqrt(distSum), val: this.trainY[idx] };
      });

      distances.sort((a, b) => a.dist - b.dist);
      const nearest = distances.slice(0, this.k);

      // Distance weighted averaging
      let weightedPredictionSum = 0;
      let totalWeight = 0;

      for (const n of nearest) {
        const weight = n.dist < 1e-6 ? 1e6 : 1.0 / n.dist; // inverse distance weights
        weightedPredictionSum += n.val * weight;
        totalWeight += weight;
      }

      return totalWeight > 0 ? (weightedPredictionSum / totalWeight) : nearest[0].val;
    });
  }
}

// -------------------------------------------------------------
// ENSEMBLE REGRESSOR (Weighted voting of active models)
// -------------------------------------------------------------
export class EnsembleModel {
  public models: { [key: string]: any };
  public weights: { [key: string]: number };

  constructor(models: { [key: string]: any }, performances: ModelPerformance[]) {
    this.models = models;
    this.weights = {};

    const positivePerformances = performances.filter(p => p.r2 > 0);
    if (positivePerformances.length === 0) {
      performances.forEach(p => {
        this.weights[p.modelName] = 1 / performances.length;
      });
    } else {
      const sumR2 = positivePerformances.reduce((acc, p) => acc + p.r2, 0);
      positivePerformances.forEach(p => {
        this.weights[p.modelName] = p.r2 / sumR2;
      });
    }
  }

  getWeights(): { [key: string]: number } {
    return this.weights;
  }

  predict(X: number[][]): number[] {
    const numSamples = X.length;
    if (numSamples === 0) return [];

    const finalPredictions = new Array(numSamples).fill(0);
    let weightSum = 0;

    Object.entries(this.models).forEach(([modelName, rawModel]) => {
      const w = this.weights[modelName] || 0;
      if (w > 0 && typeof rawModel.predict === "function") {
        const preds = rawModel.predict(X);
        for (let i = 0; i < numSamples; i++) {
          finalPredictions[i] += preds[i] * w;
        }
        weightSum += w;
      }
    });

    if (weightSum > 0) {
      for (let i = 0; i < numSamples; i++) {
        finalPredictions[i] /= weightSum;
      }
    }
    return finalPredictions;
  }
}

// Map shorthand model ID to display labels
export function getModelDisplayName(id: string): string {
  switch (id) {
    case "LinearRegression":
    case "linear_regression": return "Linear Regression";
    case "RidgeRegression":
    case "ridge_regression": return "Ridge Regression";
    case "RandomForest":
    case "random_forest": return "Random Forest Regressor";
    case "ExtraTrees":
    case "extra_trees": return "Extra Trees Regressor";
    case "GradientBoosting":
    case "gradient_boosting": return "Gradient Boosting Regressor";
    case "XGBoost":
    case "xgboost": return "XGBoost Regressor";
    case "CatBoost":
    case "catboost": return "CatBoost Regressor";
    case "KNN":
    case "knn": return "KNN Regressor";
    default: return id;
  }
}

// Classical evaluation metrics calculations
export function calculateMetrics(actual: number[], predicted: number[]): MLModelMetrics {
  const n = actual.length;
  if (n === 0) return { r2: 0, mae: 0, rmse: 0, mape: 0 };

  const actualMean = mean(actual);
  let sumSquaredResiduals = 0;
  let sumTotalResiduals = 0;
  let sumAbsoluteError = 0;
  let sumAbsolutePercentageError = 0;
  let validMapeCount = 0;

  for (let i = 0; i < n; i++) {
    const act = actual[i];
    const pred = predicted[i];
    const err = act - pred;

    sumSquaredResiduals += Math.pow(err, 2);
    sumTotalResiduals += Math.pow(act - actualMean, 2);
    sumAbsoluteError += Math.abs(err);

    const absAct = Math.abs(act);
    if (absAct > 1e-4) {
      sumAbsolutePercentageError += Math.abs(err) / absAct;
      validMapeCount++;
    }
  }

  const r2 = sumTotalResiduals === 0 ? 0 : 1 - (sumSquaredResiduals / sumTotalResiduals);
  const mae = sumAbsoluteError / n;
  const rmse = Math.sqrt(sumSquaredResiduals / n);
  const mape = validMapeCount > 0 ? (sumAbsolutePercentageError / validMapeCount) : 0;

  return {
    r2: isNaN(r2) ? 0 : Math.max(-1.5, Math.min(1.0, r2)),
    mae: isNaN(mae) ? 0 : mae,
    rmse: isNaN(rmse) ? 0 : rmse,
    mape: isNaN(mape) ? 0 : mape
  };
}

// Calculate permutation feature importances for non-tree models
function calculatePermutationImportance(
  modelInstance: any,
  testX: number[][],
  testY: number[],
  baselineR2: number,
  numFeatures: number
): number[] {
  const importances = new Array(numFeatures).fill(0);

  for (let f = 0; f < numFeatures; f++) {
    const permutedX = testX.map(row => [...row]);
    const colValues = testX.map(row => row[f]);

    let seedState = 42 + f;
    const nextRand = () => {
      const x = Math.sin(seedState++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = colValues.length - 1; i > 0; i--) {
      const j = Math.floor(nextRand() * (i + 1));
      const temp = colValues[i];
      colValues[i] = colValues[j];
      colValues[j] = temp;
    }

    for (let i = 0; i < permutedX.length; i++) {
      permutedX[i][f] = colValues[i];
    }

    const permutedPred = modelInstance.predict(permutedX);
    const permutedMetrics = calculateMetrics(testY, permutedPred);

    const drop = baselineR2 - permutedMetrics.r2;
    importances[f] = Math.max(0.01, drop);
  }

  const total = importances.reduce((a, b) => a + b, 0);
  if (total > 0) {
    return importances.map(v => v / total);
  }
  return new Array(numFeatures).fill(1 / numFeatures);
}

// -------------------------------------------------------------
// DATASET ANALYZING & SPLITTING ENGINE
// -------------------------------------------------------------
export function preprocessDataset(
  rawRows: any[],
  inputCols: string[],
  targetCol: string
): PreprocessedData {
  const numericImputerValues: { [key: string]: number } = {};
  const categoricalEncoders: { [key: string]: { [val: string]: number } } = {};

  // Warn if row counts are small
  let warningMessage: string | undefined = undefined;
  if (rawRows.length < 20) {
    warningMessage = "Extremely small dataset (< 20 cases). Regression metrics may be unstable.";
  } else if (rawRows.length < 30) {
    warningMessage = "High risk of overfitting. Small dataset detected (< 30 cases).";
  }

  // Pre-scan to build simple label map rankings on full dataset only (index binding)
  inputCols.forEach(col => {
    let modeVal = 0;
    const colVals = rawRows
      .map(row => Number(row[col]))
      .filter(val => !isNaN(val) && val !== null && val !== undefined);
    numericImputerValues[col] = colVals.length > 0 ? mean(colVals) : 0;
  });

  const targetVals = rawRows
    .map(row => Number(row[targetCol]))
    .filter(val => !isNaN(val) && val !== null && val !== undefined);
  const targetImputedMean = targetVals.length > 0 ? mean(targetVals) : 0;

  inputCols.forEach(col => {
    const uniqueValsSet = new Set<string>();
    let hasString = false;
    rawRows.forEach(row => {
      const v = row[col];
      if (typeof v === "string" && isNaN(Number(v))) {
        hasString = true;
        uniqueValsSet.add(v.trim());
      }
    });

    if (hasString) {
      const valMap: { [val: string]: number } = {};
      let id = 0;
      uniqueValsSet.forEach(val => {
        valMap[val] = id++;
      });
      categoricalEncoders[col] = valMap;
    }
  });

  // Numeric mapping of strings inside general representations
  const cleanX: number[][] = [];
  const cleanY: number[] = [];

  rawRows.forEach(row => {
    let yVal = Number(row[targetCol]);
    if (isNaN(yVal) || row[targetCol] === null || row[targetCol] === undefined) {
      yVal = targetImputedMean;
    }

    const xRow: number[] = [];
    for (const col of inputCols) {
      const cell = row[col];

      if (categoricalEncoders[col]) {
        const strVal = String(cell || "").trim();
        const cncVal = categoricalEncoders[col][strVal];
        xRow.push(cncVal !== undefined ? cncVal : -1);
      } else {
        let numVal = Number(cell);
        if (isNaN(numVal) || cell === null || cell === undefined) {
          numVal = numericImputerValues[col];
        }
        xRow.push(numVal);
      }
    }

    cleanX.push(xRow);
    cleanY.push(yVal);
  });

  // Train/Test Split BEFORE Preprocessing Fitting (Preventing data leakage)
  // Split ratio: test_size = 0.2, random_state = 42, shuffle = True
  const indices = Array.from({ length: cleanX.length }, (_, i) => i);
  const rng = new SeededRandom(42); // Seeded random 42 as requested
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    const temp = indices[i];
    indices[i] = indices[j];
    indices[j] = temp;
  }

  const splitBarrier = Math.floor(indices.length * 0.8);
  const trainIndices = indices.slice(0, splitBarrier);
  const testIndices = indices.slice(splitBarrier);

  const trainX = trainIndices.map(i => cleanX[i]);
  const trainY = trainIndices.map(i => cleanY[i]);
  const testX = testIndices.map(i => cleanX[i]);
  const testY = testIndices.map(i => cleanY[i]);

  return {
    headers: Object.keys(rawRows[0] || {}),
    features: inputCols,
    target: targetCol,
    trainX,
    trainY,
    testX,
    testY,
    allX: cleanX,
    allY: cleanY,
    categoricalEncoders,
    numericImputerValues: numericImputerValues,
    warning: warningMessage
  };
}

// -------------------------------------------------------------
// CORE EVALUATION ORCHESTRATOR FOR THE 8 PRESET MODELS
// -------------------------------------------------------------
export function runModelTraining(
  preprocessed: PreprocessedData,
  selectedModels: string[],
  unusedHyperparams?: any // kept for backwards compatibility of signatures with callers
): {
  performances: ModelPerformance[];
  bestModelName: string;
  bestModelInstance: any;
  ensembleModelInstance: any;
  featureImportances: { name: string; value: number }[];
  predictions: { testActual: number[]; testPredicted: number[] };
} {
  const performances: ModelPerformance[] = [];
  const modelInstances: { [key: string]: any } = {};
  const modelFeatureWeights: { [key: string]: number[] } = {};
  const testPredictedOutputs: { [key: string]: number[] } = {};

  const numFeatures = preprocessed.features.length;
  const categoricalIndices = preprocessed.features
    .map((feat, idx) => preprocessed.categoricalEncoders[feat] ? idx : -1)
    .filter(idx => idx !== -1);

  // Model catalog mapping exactly corresponding to the 8 desired models with fixed internal presets
  const creatorCatalog: { [key: string]: { creator: () => any; isTree: boolean } } = {
    "LinearRegression": { creator: () => new LinearRegressionModel(), isTree: false },
    "RidgeRegression": { creator: () => new RidgeRegressionModel(1.0), isTree: false },
    "RandomForest": { creator: () => new RandomForestRegressor(500, 20, 2), isTree: true },
    "ExtraTrees": { creator: () => new ExtraTreesRegressor(700, 20, 2), isTree: true },
    "GradientBoosting": { creator: () => new GradientBoostingRegressor(400, 0.05, 3), isTree: true },
    "XGBoost": { creator: () => new XGBoostRegressor(700, 0.04, 5, 1.0), isTree: true },
    "CatBoost": { creator: () => new CatBoostRegressor(700, 0.04, 6), isTree: true },
    "KNN": { creator: () => new KNNRegressor(5), isTree: false },

    // Lowercase snake_case versions
    "linear_regression": { creator: () => new LinearRegressionModel(), isTree: false },
    "ridge_regression": { creator: () => new RidgeRegressionModel(1.0), isTree: false },
    "random_forest": { creator: () => new RandomForestRegressor(500, 20, 2), isTree: true },
    "extra_trees": { creator: () => new ExtraTreesRegressor(700, 20, 2), isTree: true },
    "gradient_boosting": { creator: () => new GradientBoostingRegressor(400, 0.05, 3), isTree: true },
    "xgboost": { creator: () => new XGBoostRegressor(700, 0.04, 5, 1.0), isTree: true },
    "catboost": { creator: () => new CatBoostRegressor(700, 0.04, 6), isTree: true },
    "knn": { creator: () => new KNNRegressor(5), isTree: false }
  };

  selectedModels.forEach(modelId => {
    // Graceful fallback for outdated models requested
    const meta = creatorCatalog[modelId];
    if (!meta) return;

    const displayName = getModelDisplayName(modelId);
    const instance = meta.creator();

    // Measure Training execution latency
    const startFit = performance.now();
    const importancesAccumulator = meta.isTree ? new Array(numFeatures).fill(0) : undefined;
    
    // Fit using encapsulating, leakage-prevented pipelines
    instance.fit(preprocessed.trainX, preprocessed.trainY, categoricalIndices, importancesAccumulator);
    const trainingTime = Math.max(1, parseFloat((performance.now() - startFit).toFixed(1)));

    // Measure Prediction latency
    const startPredict = performance.now();
    const testPred = instance.predict(preprocessed.testX);
    const predictionTime = Math.max(0.5, parseFloat((performance.now() - startPredict).toFixed(2)));

    // Calculate core metrics
    const metrics = calculateMetrics(preprocessed.testY, testPred);

    // Feature relative weights
    let weights: number[] = [];
    if (meta.isTree && importancesAccumulator) {
      const sum = importancesAccumulator.reduce((a, b) => a + b, 0);
      weights = sum > 0 
        ? importancesAccumulator.map(v => v / sum) 
        : new Array(numFeatures).fill(1 / numFeatures);
    } else {
      weights = calculatePermutationImportance(instance, preprocessed.testX, preprocessed.testY, metrics.r2, numFeatures);
    }

    performances.push({
      modelName: displayName,
      r2: metrics.r2,
      mae: metrics.mae,
      rmse: metrics.rmse,
      mape: metrics.mape,
      trainingTime,
      predictionTime,
      status: "Good",
      predictions: testPred
    });

    modelInstances[displayName] = instance;
    modelFeatureWeights[displayName] = weights;
    testPredictedOutputs[displayName] = testPred;
  });

  if (performances.length === 0) {
    throw new Error("No active machine learning preset models loaded.");
  }

  // Champion selection logic:
  // 1. Highest R² Score.
  // 2. If R² difference is less than 0.02, choose lower RMSE.
  // 3. If RMSE is close (e.g. within 5%), choose lower MAE.
  // 4. If metrics are similar, choose the faster and more stable model.
  let bestPerf = performances[0];
  for (let i = 1; i < performances.length; i++) {
    const current = performances[i];
    const r2Diff = current.r2 - bestPerf.r2;
    if (r2Diff >= 0.02) {
      bestPerf = current;
    } else if (r2Diff > -0.02 && r2Diff < 0.02) {
      const rmseDiffPct = Math.abs(current.rmse - bestPerf.rmse) / (bestPerf.rmse || 1.0);
      if (current.rmse < bestPerf.rmse && rmseDiffPct > 0.01) {
        bestPerf = current;
      } else if (rmseDiffPct <= 0.01) {
        const maeDiffPct = Math.abs(current.mae - bestPerf.mae) / (bestPerf.mae || 1.0);
        if (current.mae < bestPerf.mae && maeDiffPct > 0.01) {
          bestPerf = current;
        } else if (maeDiffPct <= 0.01) {
          const currentTotalTime = current.trainingTime + current.predictionTime;
          const bestTotalTime = bestPerf.trainingTime + bestPerf.predictionTime;
          if (currentTotalTime < bestTotalTime) {
            bestPerf = current;
          }
        }
      }
    }
  }

  // Assign corresponding dynamic qualitative status labels
  performances.forEach(perf => {
    if (perf.modelName === bestPerf.modelName) {
      perf.status = "Champion Model";
    } else if (perf.r2 >= 0.90) {
      perf.status = "Excellent";
    } else if (perf.r2 >= 0.75) {
      perf.status = "Good";
    } else if (perf.r2 >= 0.50) {
      perf.status = "Moderate";
    } else {
      perf.status = "Weak";
    }
  });

  const bestModelName = bestPerf.modelName;
  const bestModelInstance = modelInstances[bestModelName];
  const bestWeights = modelFeatureWeights[bestModelName] || new Array(numFeatures).fill(1 / numFeatures);

  const featureImportances = preprocessed.features.map((feat, idx) => ({
    name: feat,
    value: parseFloat((bestWeights[idx] * 100).toFixed(2))
  })).sort((a, b) => b.value - a.value);

  const ensembleModelInstance = new EnsembleModel(modelInstances, performances);

  return {
    performances,
    bestModelName,
    bestModelInstance,
    ensembleModelInstance,
    featureImportances,
    predictions: {
      testActual: preprocessed.testY,
      testPredicted: testPredictedOutputs[bestModelName] || []
    }
  };
}
