"use client";

import { addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import type { Boat } from "@/types/federation";
import { boatsCollection } from "./livePaths";

export function subscribeBoats(onChange: (boats: Boat[]) => void) {
  return onSnapshot(query(boatsCollection(), orderBy("boatNumber", "asc")), (snapshot) => {
    onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Boat));
  });
}

export function createBoat(input: Omit<Boat, "id" | "createdAt" | "updatedAt">) {
  return addDoc(boatsCollection(), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
