import type { Phone } from "@/types/index";

export const SAVED_PHONES_STORAGE_KEY = "phonetic-saved-phone-ids";
const SAVED_PHONES_EVENT = "phonetic-saved-phones-changed";
const INITIAL_SAVED_PHONE_IDS = ["oneplus-12", "samsung-galaxy-s24", "google-pixel-8"];
let cachedSerializedIds: string | null | undefined;
let cachedIds: string[] | undefined;

export function getInitialSavedPhoneIds(): string[] {
  return INITIAL_SAVED_PHONE_IDS;
}

export function readSavedPhoneIds(): string[] {
  if (typeof window === "undefined") return getInitialSavedPhoneIds();
  try {
    const value = window.localStorage.getItem(SAVED_PHONES_STORAGE_KEY);
    if (value === cachedSerializedIds && cachedIds) return cachedIds;
    if (!value) {
      const initialIds = getInitialSavedPhoneIds();
      cachedSerializedIds = null;
      cachedIds = initialIds;
      return initialIds;
    }
    const ids = JSON.parse(value) as unknown;
    const validIds = Array.isArray(ids) && ids.every(id => typeof id === "string") ? ids : getInitialSavedPhoneIds();
    cachedSerializedIds = value;
    cachedIds = validIds;
    return validIds;
  } catch {
    const initialIds = getInitialSavedPhoneIds();
    cachedSerializedIds = null;
    cachedIds = initialIds;
    return initialIds;
  }
}

export function writeSavedPhoneIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify([...new Set(ids)]);
  cachedSerializedIds = serialized;
  cachedIds = [...new Set(ids)];
  window.localStorage.setItem(SAVED_PHONES_STORAGE_KEY, serialized);
  window.dispatchEvent(new Event(SAVED_PHONES_EVENT));
}

export function subscribeSavedPhoneIds(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", callback);
  window.addEventListener(SAVED_PHONES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SAVED_PHONES_EVENT, callback);
  };
}

export function savePhoneId(id: string): string[] {
  const ids = readSavedPhoneIds();
  const next = [...new Set([...ids, id])];
  writeSavedPhoneIds(next);
  return next;
}

export function removeSavedPhoneId(id: string): string[] {
  const next = readSavedPhoneIds().filter(savedId => savedId !== id);
  writeSavedPhoneIds(next);
  return next;
}

export function getSavedPhones(phones: Phone[]): Phone[] {
  const ids = new Set(readSavedPhoneIds());
  return phones.filter(phone => ids.has(phone.id));
}
