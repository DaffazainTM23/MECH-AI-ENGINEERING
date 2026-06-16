import { ParsedDataset } from "./utils/fileParser";
import { ModelPerformance, PreprocessedData } from "./utils/mlEngine";

export interface MLTrainingState {
  dataset: ParsedDataset | null;
  selectedFeatures: string[];
  selectedTarget: string;
  preprocessingResult: PreprocessedData | null;
  selectedModels: string[]; // "ExtraTrees" | "CatBoost" | "XGBoost"
  isTraining: boolean;
  trainingStep: string;
  performances: ModelPerformance[];
  bestModelName: string;
  featureImportances: { name: string; value: number }[];
  testActualValues: number[];
  testPredictedValues: number[];
  bestModelInstance: any;
  ensembleModelInstance?: any;
}

export interface PredictionHistoryItem {
  id: string;
  datasetName: string;
  timestamp: string;
  features: string[];
  target: string;
  inputs: { [key: string]: string | number };
  predictedValue: number;
  modelUsed: string;
  metrics: {
    r2: number;
    mae: number;
    rmse: number;
    mape: number;
  };
}

export type ActiveTab =
  | "home"
  | "upload"
  | "features"
  | "train"
  | "performance"
  | "analytics"
  | "predict"
  | "history"
  | "workflow"
  | "ethics"
  | "about"
  | "twin"
  | "assistant";
