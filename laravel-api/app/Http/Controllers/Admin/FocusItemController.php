<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FocusItem;
use Illuminate\Http\Request;

class FocusItemController extends Controller
{
    public function index()
    {
        return response()->json(FocusItem::orderBy('ordering')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'icon'        => 'nullable|string',
            'description' => 'nullable|string',
            'ordering'    => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);
        $data['ordering']  = $data['ordering'] ?? (FocusItem::max('ordering') + 1);
        $data['is_active'] = $data['is_active'] ?? true;
        $item = FocusItem::create($data);
        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $item = FocusItem::findOrFail($id);
        $item->update($request->only(['title', 'icon', 'description', 'ordering', 'is_active']));
        return response()->json($item->fresh());
    }

    public function destroy($id)
    {
        FocusItem::findOrFail($id)->delete();
        return response()->json(['message' => 'Focus item deleted']);
    }
}
