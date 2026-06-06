import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '@/lib/apiFetch';

interface TranslationRecord {
  entityType: string;
  entityId: string;
  field: string;
  language: string;
  value: string;
}

/**
 * Fetches ALL translations for a given entityType (one API call per entity type).
 * Returns a translate function: (entityId, field, fallback) => translated string.
 * Falls through to fallback when language is English or no translation is stored.
 */
export function useCmsTranslations(entityType: string) {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];

  const { data = [] } = useQuery<TranslationRecord[]>({
    queryKey: ['cms-translations', entityType, lang],
    queryFn: async () => {
      if (lang === 'en') return [];
      try {
        const res = await apiFetch(`/api/translations/${entityType}`);
        if (!res.ok) return [];
        return res.json();
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: lang !== 'en',
  });

  return (entityId: string, field: string, fallback: string): string => {
    if (lang === 'en') return fallback;
    const found = data.find(
      (t) => t.entityId === String(entityId) && t.field === field && t.language === lang
    );
    return found?.value || fallback;
  };
}
