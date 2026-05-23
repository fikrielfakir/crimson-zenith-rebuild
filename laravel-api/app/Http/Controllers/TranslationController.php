<?php

namespace App\Http\Controllers;

use App\Models\Translation;
use Illuminate\Http\Request;

class TranslationController extends Controller
{
    public function byType(string $entityType)
    {
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'entityType' => 'required|string|max:100',
            'entityId'   => 'required|string|max:255',
            'field'      => 'required|string|max:100',
            'language'   => 'required|string|max:10',
            'value'      => 'required|string',
        ]);

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
