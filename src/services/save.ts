import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { SaveData } from '@/data/types';
import { getFirebase } from '@/services/firebase';

/**
 * 存檔服務（見 docs/12_Database.md）。
 * 策略：以 LocalStorage 為主（即時、離線），連線時同步至 Firestore。
 * 目前提供基礎讀寫；Auto Save 觸發點與衝突處理於 Task 018 完善。
 */

const LOCAL_KEY = 'qftpb:save';

export function loadLocal(): SaveData | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as SaveData) : null;
  } catch {
    return null;
  }
}

export function saveLocal(data: SaveData): void {
  localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...data, updatedAt: Date.now() }));
}

export async function syncToCloud(data: SaveData): Promise<void> {
  const fb = getFirebase();
  if (!fb) return; // 未設定 Firebase 時略過雲端同步
  await setDoc(doc(fb.db, 'saves', data.userId), { ...data, updatedAt: Date.now() });
}

export async function loadFromCloud(userId: string): Promise<SaveData | null> {
  const fb = getFirebase();
  if (!fb) return null;
  const snap = await getDoc(doc(fb.db, 'saves', userId));
  return snap.exists() ? (snap.data() as SaveData) : null;
}
