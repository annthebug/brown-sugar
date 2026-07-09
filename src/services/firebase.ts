import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'

type FirebaseEnvConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

function getFirebaseEnvConfig(): FirebaseEnvConfig | null {
  const {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID,
  } = import.meta.env

  if (
    !VITE_FIREBASE_API_KEY ||
    !VITE_FIREBASE_AUTH_DOMAIN ||
    !VITE_FIREBASE_PROJECT_ID ||
    !VITE_FIREBASE_STORAGE_BUCKET ||
    !VITE_FIREBASE_MESSAGING_SENDER_ID ||
    !VITE_FIREBASE_APP_ID
  ) {
    return null
  }

  return {
    apiKey: VITE_FIREBASE_API_KEY,
    authDomain: VITE_FIREBASE_AUTH_DOMAIN,
    projectId: VITE_FIREBASE_PROJECT_ID,
    storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: VITE_FIREBASE_APP_ID,
  }
}

let firebaseApp: FirebaseApp | null = null
let firestoreDb: Firestore | null = null

export function isFirebaseConfigured() {
  return getFirebaseEnvConfig() !== null
}

export function getFirebaseAppInstance() {
  if (!isFirebaseConfigured()) {
    return null
  }

  if (firebaseApp) {
    return firebaseApp
  }

  firebaseApp = getApps().length > 0 ? getApp() : initializeApp(getFirebaseEnvConfig()!)

  return firebaseApp
}

export function getFirestoreDb() {
  if (!isFirebaseConfigured()) {
    return null
  }

  if (firestoreDb) {
    return firestoreDb
  }

  const app = getFirebaseAppInstance()

  if (!app) {
    return null
  }

  firestoreDb = getFirestore(app)

  return firestoreDb
}
