/* Check rule in storage, if it exist or expired */

/* export function getValidRule(): number | null {
  const stored = localStorage.getItem("rule");
  if (!stored) return null;

  try {
    const { rule, expiresAt } = JSON.parse(stored);
    const now = Date.now();

    if (now > expiresAt) {
      localStorage.removeItem("rule");
      return null;
    }

    // Extend expiry by 2 hours on access. On second thought, this is bothersome, let's not do it lol
    // const newExpiresAt = now + 2 * 60 * 60 * 1000;
    // localStorage.setItem("rule", JSON.stringify({ rule, expiresAt: newExpiresAt })); 

    return rule;
  } catch {
    localStorage.removeItem("rule");
    return null;
  }
} */
// services/https/ruleUtils.ts
export interface TTLBox<T> {
  value: T;
  expiresAt: number;
}

const DEFAULT_TTL_MS = 12 * 60 * 60 * 1000; // 12 ชั่วโมง 

export function setWithTTL<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL_MS) {
  const expiresAt = Date.now() + ttlMs;
  const box: TTLBox<T> = { value, expiresAt };
  localStorage.setItem(key, JSON.stringify(box));
}

export function getValidItem<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const box = JSON.parse(raw) as Partial<TTLBox<T>>;
    if (!box || typeof box.expiresAt !== "number") {
      localStorage.removeItem(key);
      return null;
    }
    if (Date.now() > box.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return box.value as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function clearKey(key: string) {
  localStorage.removeItem(key);
}

/** optional: ยังคงใช้ได้ตามเดิม */
export function getValidRule(): number | null {
  const stored = localStorage.getItem("rule");
  if (!stored) return null;
  try {
    const { rule, expiresAt } = JSON.parse(stored) as { rule?: number; expiresAt?: number };
    const now = Date.now();
    if (!rule || !expiresAt || now > expiresAt) {
      localStorage.removeItem("rule");
      return null;
    }
    return rule;
  } catch {
    localStorage.removeItem("rule");
    return null;
  }
}

/** ทำ fingerprint จากโรค + แท็กที่เลือกในแต่ละ slot (ใช้ตรวจว่าควร reuse แผนหรือไม่) */
export function makePlanFingerprint(
  diseaseId: number,
  slotTagIdMatrix: number[][] // ตัวอย่าง [[1,5],[2],[9,10,11]]
): string {
  const norm = slotTagIdMatrix
    .map(arr => [...arr].sort((a, b) => a - b).join(","))
    .join("|");
  return `${diseaseId}::${norm}`;
}
