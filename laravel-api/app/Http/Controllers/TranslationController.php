<?php

namespace App\Http\Controllers;

use App\Models\Translation;
use App\Models\EventTranslation;
use Illuminate\Http\Request;

class TranslationController extends Controller
{
    /**
     * EVENT TRANSLATION FIELDS that map to the event_translations table columns.
     * The TranslateDialog saves field-by-field; we merge them into the event_translations row.
     */
    private const EVENT_FIELDS = [
        'title', 'description', 'location', 'highlights', 'importantInfo',
    ];

    // ─── Event-translations bridge helpers ──────────────────────────────────────

    private function eventTranslationsAsGeneric(string $entityId = null): array
    {
        $query = EventTranslation::query();
        if ($entityId !== null) {
            $query->where('event_id', $entityId);
        }

        $rows = [];
        foreach ($query->get() as $t) {
            $fieldMap = [
                'title'       => $t->title,
                'description' => $t->description,
                'location'    => $t->location,
                'highlights'  => is_array($t->highlights) ? implode("\n", $t->highlights) : $t->highlights,
                'importantInfo' => $t->important_info,
            ];
            foreach ($fieldMap as $field => $value) {
                if ($value === null || $value === '') continue;
                $rows[] = [
                    'id'         => $t->id,
                    'entityType' => 'event',
                    'entityId'   => (string) $t->event_id,
                    'field'      => $field,
                    'language'   => $t->locale,
                    'value'      => (string) $value,
                ];
            }
        }
        return $rows;
    }

    private function storeEventTranslation(array $validated): array
    {
        $eventId  = $validated['entityId'];
        $locale   = $validated['language'];
        $field    = $validated['field'];
        $value    = $validated['value'];

        // Map camelCase field names to DB column names
        $columnMap = [
            'title'          => 'title',
            'description'    => 'description',
            'location'       => 'location',
            'highlights'     => 'highlights',
            'importantInfo'  => 'important_info',
        ];

        $column = $columnMap[$field] ?? null;
        if (!$column) {
            // Unknown field — fall through to generic table
            return [];
        }

        // highlights is stored as JSON array in event_translations
        $dbValue = ($column === 'highlights' && $value)
            ? array_filter(explode("\n", $value))
            : $value;

        $row = EventTranslation::firstOrNew(['event_id' => $eventId, 'locale' => $locale]);
        $row->$column = $dbValue;
        $row->save();

        return [
            'id'         => $row->id,
            'entityType' => 'event',
            'entityId'   => (string) $eventId,
            'field'      => $field,
            'language'   => $locale,
            'value'      => is_array($dbValue) ? implode("\n", $dbValue) : $dbValue,
        ];
    }

    // ─── Public endpoints ────────────────────────────────────────────────────────

    public function byType(Request $request, string $entityType)
    {
        if ($entityType === 'event') {
            return response()->json($this->eventTranslationsAsGeneric());
        }

        $translations = Translation::where('entity_type', $entityType)->get();

        return response()->json($translations->map(fn ($t) => [
            'id'         => $t->id,
            'entityType' => $t->entity_type,
            'entityId'   => $t->entity_id,
            'field'      => $t->field,
            'language'   => $t->language,
            'value'      => $t->value,
        ]));
    }

    public function index(string $entityType, string $entityId)
    {
        if ($entityType === 'event') {
            return response()->json($this->eventTranslationsAsGeneric($entityId));
        }

        $translations = Translation::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->get();

        return response()->json($translations->map(fn ($t) => [
            'id'         => $t->id,
            'entityType' => $t->entity_type,
            'entityId'   => $t->entity_id,
            'field'      => $t->field,
            'language'   => $t->language,
            'value'      => $t->value,
        ]));
    }

    public function autoTranslate(Request $request)
    {
        $validated = $request->validate([
            'texts'          => 'required|array|min:1',
            'texts.*.key'    => 'required|string',
            'texts.*.value'  => 'nullable|string',
            'targetLanguage' => 'required|string|in:ar,fr,es',
        ]);

        $langMap = ['ar' => 'ar', 'fr' => 'fr', 'es' => 'es'];
        $targetLang = $langMap[$validated['targetLanguage']];
        $results = [];

        foreach ($validated['texts'] as $item) {
            $key   = $item['key'];
            $text  = trim($item['value'] ?? '');

            if ($text === '') {
                $results[$key] = '';
                continue;
            }

            $url      = 'https://api.mymemory.translated.net/get?q=' . urlencode($text) . '&langpair=en|' . $targetLang;
            $response = @file_get_contents($url);

            if ($response === false) {
                $results[$key] = '';
                continue;
            }

            $data = json_decode($response, true);
            $results[$key] = ($data['responseStatus'] ?? 0) === 200
                ? ($data['responseData']['translatedText'] ?? '')
                : '';
        }

        return response()->json(['results' => $results]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'entityType' => 'required|string|max:100',
            'entityId'   => 'required|string|max:255',
            'field'      => 'required|string|max:100',
            'language'   => 'required|string|max:10',
            'value'      => 'required|string',
        ]);

        // Route event translations to the dedicated event_translations table
        if ($validated['entityType'] === 'event') {
            $result = $this->storeEventTranslation($validated);
            if (!empty($result)) {
                return response()->json($result, 201);
            }
        }

        // Generic translations table for all other entity types
        $translation = Translation::updateOrCreate(
            [
                'entity_type' => $validated['entityType'],
                'entity_id'   => $validated['entityId'],
                'field'       => $validated['field'],
                'language'    => $validated['language'],
            ],
            ['value' => $validated['value']]
        );

        return response()->json([
            'id'         => $translation->id,
            'entityType' => $translation->entity_type,
            'entityId'   => $translation->entity_id,
            'field'      => $translation->field,
            'language'   => $translation->language,
            'value'      => $translation->value,
        ], 201);
    }
}
