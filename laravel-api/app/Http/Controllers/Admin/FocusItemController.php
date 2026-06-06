<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FocusItem;
use App\Models\FocusSectionSettings;
use Illuminate\Http\Request;

class FocusItemController extends Controller
{
    private function itemToArray(FocusItem $item): array
    {
        return [
            'id'          => $item->id,
            'title'       => $item->title,
            'description' => $item->description,
            'icon'        => $item->icon,
            'imageUrl'    => $item->image_url,
            'ordering'    => $item->ordering,
            'isActive'    => (bool) $item->is_active,
        ];
    }

    public function index()
    {
        $items = FocusItem::orderBy('ordering')->get()->map(function ($item) {
            try {
                return $this->itemToArray($item);
            } catch (\Throwable $e) {
                return [
                    'id'          => $item->id,
                    'title'       => $item->title,
                    'description' => $item->description,
                    'icon'        => $item->icon,
                    'imageUrl'    => null,
                    'ordering'    => $item->ordering,
                    'isActive'    => (bool) $item->is_active,
                ];
            }
        });
        return response()->json(['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'icon'        => 'nullable|string',
            'description' => 'nullable|string',
            'imageUrl'    => 'nullable|string|max:1000',
            'ordering'    => 'nullable|integer',
            'isActive'    => 'nullable|boolean',
        ]);
        $data['ordering']  = $data['ordering'] ?? (FocusItem::max('ordering') + 1);
        $data['is_active'] = $data['isActive'] ?? true;
        $data['image_url'] = $data['imageUrl'] ?? null;
        unset($data['isActive'], $data['imageUrl']);
        $item = FocusItem::create($data);
        return response()->json($this->itemToArray($item), 201);
    }

    public function update(Request $request, $id)
    {
        $item = FocusItem::findOrFail($id);
        $data = $request->only(['title', 'icon', 'description', 'ordering']);
        if ($request->has('isActive')) {
            $data['is_active'] = $request->boolean('isActive');
        }
        if ($request->has('imageUrl')) {
            $data['image_url'] = $request->input('imageUrl');
        }
        $item->update($data);
        return response()->json($this->itemToArray($item->fresh()));
    }

    public function destroy($id)
    {
        FocusItem::findOrFail($id)->delete();
        return response()->json(['message' => 'Focus item deleted']);
    }

    public function bulkReorder(Request $request)
    {
        $request->validate([
            'items'            => 'required|array',
            'items.*.id'       => 'required|integer|exists:focus_items,id',
            'items.*.ordering' => 'required|integer',
        ]);

        foreach ($request->items as $item) {
            FocusItem::where('id', $item['id'])->update(['ordering' => $item['ordering']]);
        }

        return response()->json(['message' => 'Items reordered successfully']);
    }

    public function getSection()
    {
        try {
            $s = FocusSectionSettings::firstOrCreate(
                ['id' => 'default'],
                ['title' => 'Our Focus', 'subtitle' => 'Tourism, Culture, Entertainment']
            );
            return response()->json([
                'title'    => $s->title,
                'subtitle' => $s->subtitle,
                'isActive' => (bool) $s->is_active,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'title'    => 'Our Focus',
                'subtitle' => 'Tourism, Culture, Entertainment',
                'isActive' => true,
            ]);
        }
    }

    public function updateSection(Request $request)
    {
        $data = $request->validate([
            'title'    => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'isActive' => 'nullable|boolean',
        ]);

        if (!\Schema::hasTable('focus_section_settings')) {
            return response()->json([
                'migrationNeeded' => true,
                'title'           => $data['title'],
                'subtitle'        => $data['subtitle'] ?? null,
                'isActive'        => true,
            ], 200);
        }

        try {
            $s = FocusSectionSettings::firstOrCreate(['id' => 'default']);
            $s->title    = $data['title'];
            $s->subtitle = $data['subtitle'] ?? null;
            if (isset($data['isActive'])) {
                $s->is_active = $data['isActive'];
            }
            $s->save();

            return response()->json([
                'title'    => $s->title,
                'subtitle' => $s->subtitle,
                'isActive' => (bool) $s->is_active,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'migrationNeeded' => true,
                'title'           => $data['title'],
                'subtitle'        => $data['subtitle'] ?? null,
                'isActive'        => true,
            ], 200);
        }
    }
}
