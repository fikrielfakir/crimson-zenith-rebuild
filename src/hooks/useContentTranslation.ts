import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export interface ContentTranslation {
  id: number;
  entityType: string;
  entityId: string;
  field: string;
  language: string;
  value: string;
}

export type TranslationMap = Record<string, Record<string, string>>;

export function useEntityTranslations(entityType: string, entityId: string | number | null | undefined) {
  const id = entityId != null ? String(entityId) : null;
  return useQuery<ContentTranslation[]>({
    queryKey: ["/api/translations", entityType, id],
    queryFn: async () => {
      if (!id) return [];
      const res = await fetch(`/api/translations/${entityType}/${id}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useTranslatedField(
  entityType: string,
  entityId: string | number | null | undefined,
  field: string,
  fallback: string,
): string {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { data: translations } = useEntityTranslations(entityType, entityId);

  if (!translations || lang === "en") return fallback;

  const match = translations.find(
    (t) => t.field === field && t.language === lang
  );
  return match?.value || fallback;
}

export function useTranslatedEntity<T extends Record<string, any>>(
  entity: T | null | undefined,
  entityType: string,
  fields: string[],
): T | null | undefined {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const id = entity ? String((entity as any).id) : null;
  const { data: translations } = useEntityTranslations(entityType, id);

  if (!entity || !translations || lang === "en") return entity;

  const translated = { ...entity };
  for (const field of fields) {
    const match = translations.find(
      (t) => t.field === field && t.language === lang
    );
    if (match?.value) {
      (translated as any)[field] = match.value;
    }
  }
  return translated as T;
}

export function useTranslatedList<T extends Record<string, any>>(
  entities: T[],
  entityType: string,
  fields: string[],
): T[] {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const ids = entities.map((e) => String((e as any).id));
  const { data: allTranslations } = useQuery<ContentTranslation[]>({
    queryKey: ["/api/translations/batch", entityType, ids.join(",")],
    queryFn: async () => {
      if (!ids.length) return [];
      try {
        const res = await fetch(`/api/translations/${entityType}?ids=${ids.join(",")}`);
        if (!res.ok) return [];
        return res.json();
      } catch {
        return [];
      }
    },
    enabled: !!ids.length,
    staleTime: 30_000,
    retry: 2,
    retryDelay: 1000,
  });

  if (!allTranslations || lang === "en") return entities;

  return entities.map((entity) => {
    const entityId = String((entity as any).id);
    const translated = { ...entity };
    for (const field of fields) {
      const match = allTranslations.find(
        (t) => t.entityId === entityId && t.field === field && t.language === lang
      );
      if (match?.value) {
        (translated as any)[field] = match.value;
      }
    }
    return translated as T;
  });
}
