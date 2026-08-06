import { collection, doc, getDoc, getDocs, limit, onSnapshot, query, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import type { RowMotionCollectionName } from "@/constants/firestore";
import type { UnknownRecord } from "@/types/rowmotion-ai";

type Normalizer<T> = (id: string, raw: UnknownRecord) => T;

export class RowMotionIntegrationError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "RowMotionIntegrationError";
  }
}

function normalized<T>(item: QueryDocumentSnapshot<DocumentData>, normalizer: Normalizer<T>) {
  return normalizer(item.id, item.data() as UnknownRecord);
}

export async function readCollection<T>(name: RowMotionCollectionName, normalizer: Normalizer<T>, maximum = 250): Promise<T[]> {
  try {
    const snapshot = await getDocs(query(collection(getFirebaseClientDb(), name), limit(maximum)));
    return snapshot.docs.map((item) => normalized(item, normalizer));
  } catch (error) {
    throw new RowMotionIntegrationError(`Impossible de lire la collection RowMotion AI « ${name} ».`, error);
  }
}

export async function readDocument<T>(name: RowMotionCollectionName, id: string, normalizer: Normalizer<T>): Promise<T | null> {
  try {
    const snapshot = await getDoc(doc(getFirebaseClientDb(), name, id));
    return snapshot.exists() ? normalizer(snapshot.id, snapshot.data() as UnknownRecord) : null;
  } catch (error) {
    throw new RowMotionIntegrationError(`Impossible de lire « ${name}/${id} » dans RowMotion AI.`, error);
  }
}

export function subscribeCollection<T>(
  name: RowMotionCollectionName,
  normalizer: Normalizer<T>,
  onChange: (items: T[]) => void,
  onError?: (error: Error) => void,
  maximum = 500
) {
  return onSnapshot(
    query(collection(getFirebaseClientDb(), name), limit(maximum)),
    (snapshot) => onChange(snapshot.docs.map((item) => normalized(item, normalizer))),
    (error) => onError?.(new RowMotionIntegrationError(`Impossible de synchroniser la collection RowMotion AI "${name}".`, error))
  );
}
