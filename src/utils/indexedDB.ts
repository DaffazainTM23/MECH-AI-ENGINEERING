/**
 * MechAutoML AI - IndexedDB State Persistence Manager
 * Implements low-level client-side browser database storage 
 * to serialize and deserialize the current ML state and multi-files registry.
 */

const DB_NAME = "mechautoml_db";
const DB_VERSION = 1;
const STATE_STORE = "ml_state_store";

export interface SerializedState {
  id: string;
  activeTab: string;
  mlState: {
    selectedFeatures: string[];
    selectedTarget: string;
    preprocessingResult: any;
    selectedModels: string[];
    performances: any[];
    bestModelName: string;
    featureImportances: any[];
    testActualValues: number[];
    testPredictedValues: number[];
  };
  dataset: any;
  datasetRegistry: Array<{ fileName: string; rowCount: number; colCount: number; headers: string[]; rows: any[]; summary: any }>;
  theme: "navy" | "contrast";
}

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STATE_STORE)) {
        db.createObjectStore(STATE_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAppState(state: SerializedState): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STATE_STORE, "readwrite");
      const store = transaction.objectStore(STATE_STORE);
      
      // Clone state without any non-serializable objects (like function refs)
      const cleanedState = JSON.parse(JSON.stringify(state));
      
      const request = store.put(cleanedState);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("IndexedDB Save Failed", error);
  }
}

export async function loadAppState(): Promise<SerializedState | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STATE_STORE, "readonly");
      const store = transaction.objectStore(STATE_STORE);
      const request = store.get("current_app_session");

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("IndexedDB Load Failed", error);
    return null;
  }
}

export async function clearAppState(): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STATE_STORE, "readwrite");
      const store = transaction.objectStore(STATE_STORE);
      const request = store.delete("current_app_session");

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("IndexedDB Clear Failed", error);
  }
}
