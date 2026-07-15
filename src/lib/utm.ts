// Client-side UTM attribution: captured once per session on landing,
// attached to every lead submitted afterwards.

const STORAGE_KEY = "snx-utm";
const UTM_KEYS = ["source", "medium", "campaign", "term", "content"] as const;

export type StoredUtm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export function captureUtmFromLocation() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: StoredUtm = {};
    for (const key of UTM_KEYS) {
      const value = params.get(`utm_${key}`);
      if (value) utm[key] = value.slice(0, 120);
    }
    // First touch wins for the session.
    if (Object.keys(utm).length > 0 && !sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    }
  } catch {
    // sessionStorage unavailable (private mode etc.) — attribution is best-effort
  }
}

export function getStoredUtm(): StoredUtm | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredUtm) : undefined;
  } catch {
    return undefined;
  }
}
