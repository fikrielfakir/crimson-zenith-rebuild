<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\Request;

class GalleryAdminController extends Controller
{
    public function publicIndex(Request $request)
    {
        $query = GalleryItem::query();

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $items = $query->orderBy('sort_order')->orderBy('created_at', 'desc')->get();

        return response()->json(['items' => $items, 'total' => $items->count()]);
    }

    public function index(Request $request)
    {
        $query = GalleryItem::query();

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', "%$q%")
                    ->orWhere('location', 'like', "%$q%")
                    ->orWhere('photographer', 'like', "%$q%");
            });
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $items = $query->orderBy('sort_order')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'items' => $items,
            'total' => $items->count(),
            'featured_count' => GalleryItem::where('is_featured', true)->count(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'location'     => 'nullable|string|max:255',
            'category'     => 'nullable|string|max:100',
            'photographer' => 'nullable|string|max:255',
            'description'  => 'nullable|string',
            'image_url'    => 'required|string',
            'is_featured'  => 'nullable|boolean',
            'sort_order'   => 'nullable|integer',
            'aspect'       => 'nullable|string|in:landscape,portrait',
        ]);

        $item = GalleryItem::create($validated);

        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $item = GalleryItem::findOrFail($id);

        $validated = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'location'     => 'nullable|string|max:255',
            'category'     => 'nullable|string|max:100',
            'photographer' => 'nullable|string|max:255',
            'description'  => 'nullable|string',
            'image_url'    => 'sometimes|string',
            'is_featured'  => 'nullable|boolean',
            'sort_order'   => 'nullable|integer',
            'aspect'       => 'nullable|string|in:landscape,portrait',
        ]);

        $item->update($validated);

        return response()->json($item);
    }

    public function destroy($id)
    {
        GalleryItem::findOrFail($id)->delete();

        return response()->json(['message' => 'Gallery item deleted']);
    }

    public function bulkReorder(Request $request)
    {
        $request->validate([
            'order'   => 'required|array',
            'order.*' => 'integer',
        ]);

        foreach ($request->order as $sortOrder => $id) {
            GalleryItem::where('id', $id)->update(['sort_order' => $sortOrder]);
        }

        return response()->json(['message' => 'Order updated']);
    }

    public function toggleFeatured($id)
    {
        $item = GalleryItem::findOrFail($id);
        $item->update(['is_featured' => !$item->is_featured]);

        return response()->json($item);
    }
}
