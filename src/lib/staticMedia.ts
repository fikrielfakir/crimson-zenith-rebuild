export const MEDIA_KEYS = {
  HERO_BG:           "HERO_BG",
  PATTERN_002:       "PATTERN_002",
  GNAOUA:            "GNAOUA",
  TIMITAR:           "TIMITAR",
  NO_EVENTS:         "NO_EVENTS",
  PRESIDENT_PHOTO:   "PRESIDENT_PHOTO",
  BIRD_LOGO:         "BIRD_LOGO",
  CITY_TANGIER:      "CITY_TANGIER",
  CITY_TETOUAN:      "CITY_TETOUAN",
  CITY_ALHOCEIMA:    "CITY_ALHOCEIMA",
  CITY_CHEFCHAOUEN:  "CITY_CHEFCHAOUEN",
  CITY_FES:          "CITY_FES",
  CITY_ESSAOUIRA:    "CITY_ESSAOUIRA",
  CITY_HERITAGE:     "CITY_HERITAGE",
  CITY_FESTIVAL:     "CITY_FESTIVAL",
} as const;

export type MediaKey = keyof typeof MEDIA_KEYS;

const _store: Record<string, string> = {};
let _loaded = false;
let _loadPromise: Promise<void> | null = null;

export function staticMediaUrl(key: string): string | null {
  return _store[key] ?? null;
}

export function getStaticMediaStore(): Record<string, string> {
  return { ..._store };
}

export function setStaticMediaStore(data: Record<string, string>): void {
  Object.assign(_store, data);
}

export async function loadStaticMedia(): Promise<void> {
  if (_loaded) return;
  if (_loadPromise) return _loadPromise;
  _loadPromise = (async () => {
    try {
      const res = await fetch("/api/cms/static-media");
      if (res.ok) {
        const data = await res.json();
        Object.assign(_store, data);
      }
    } catch {
      // silently fall through — fallback URLs are used
    }
    _loaded = true;
  })();
  return _loadPromise;
}
