import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/**
 * Firebase 初始化（見 docs/12_Database.md、docs/13_Deployment.md）。
 * 若環境變數未設定，回傳 null，讓應用可在無雲端設定下以純 LocalStorage 執行。
 */

interface FirebaseBundle {
  app: FirebaseApp;
  db: Firestore;
  storage: FirebaseStorage;
}

let bundle: FirebaseBundle | null | undefined;

function readConfig() {
  const env = import.meta.env;
  const config = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };
  const isComplete = Object.values(config).every((v) => typeof v === 'string' && v.length > 0);
  return isComplete ? (config as Record<string, string>) : null;
}

/** 取得 Firebase 實例；未設定環境變數時回傳 null。 */
export function getFirebase(): FirebaseBundle | null {
  if (bundle !== undefined) return bundle;

  const config = readConfig();
  if (!config) {
    bundle = null;
    return null;
  }

  const app = initializeApp(config);
  bundle = {
    app,
    db: getFirestore(app),
    storage: getStorage(app),
  };
  return bundle;
}

/** 是否已設定 Firebase。 */
export function isFirebaseEnabled(): boolean {
  return getFirebase() !== null;
}
