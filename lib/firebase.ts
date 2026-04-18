import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  inMemoryPersistence,
  setPersistence,
  signInAnonymously,
  type Auth,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;

export function hasFirebaseConfig() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

export function getFirebaseApp() {
  if (!hasFirebaseConfig()) {
    return null;
  }

  if (app) {
    return app;
  }

  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const currentApp = getFirebaseApp();
  if (!currentApp) {
    return null;
  }

  return getAuth(currentApp);
}

export function getFirebaseDb(): Firestore | null {
  const currentApp = getFirebaseApp();
  if (!currentApp) {
    return null;
  }

  return getFirestore(currentApp);
}

export function getGoogleProvider() {
  return new GoogleAuthProvider();
}

export async function ensureAnonymousSession() {
  const auth = getFirebaseAuth();
  if (!auth) return null;

  await setPersistence(auth, browserLocalPersistence).catch(() =>
    setPersistence(auth, inMemoryPersistence),
  );

  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  return auth.currentUser;
}

export async function getMnemonicDoc(char: string) {
  const db = getFirebaseDb();
  if (!db) return null;

  const snapshot = await getDoc(doc(collection(db, "mnemonics"), char));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function seedMnemonicDoc(char: string, data: Record<string, unknown>) {
  const db = getFirebaseDb();
  if (!db) return false;

  await setDoc(doc(collection(db, "mnemonics"), char), data, { merge: true });
  return true;
}
