<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FocusItem;
use Illuminate\Http\Request;

class FocusItemController extends Controller
{
    public function index()
    {
        $items = FocusItem::orderBy('ordering')->get()->map(fn($item) => [
            'id'          => $item->id,
            'title'       => $item->title,
            'description' => $item->description,
            'icon'        => $item->icon,
            'ordering'    => $item->ordering,
            'isActive'    => (bool) $item->is_active,
        ]);
        return response()->json(['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'icon'        => 'nullable|string',
            'description' => 'nullable|string',
            'ordering'    => 'nullable|integer',
            'isActive'    => 'nullable|boolean',
        ]);
        $data['ordering']  = $data['ordering'] ?? (FocusItem::max('ordering') + 1);
        $data['is_active'] = $data['isActive'] ?? true;
        unset($data['isActive']);
        $item = FocusItem::create($data);
        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $item = FocusItem::findOrFail($id);
        $data = $request->only(['title', 'icon', 'description', 'ordering']);
        if ($request->has('isActive')) {
            $data['is_active'] = $request->boolean('isActive');
        }
        $item->update($data);
        return response()->json($item->fresh());
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
}
