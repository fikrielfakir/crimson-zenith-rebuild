<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ClubController extends Controller
{
    public function index(Request $request)
    {
        $query = Club::query();
        if ($request->has('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%$s%")->orWhere('location', 'like', "%$s%"));
        }
        $page  = max(1, (int)($request->page ?? 1));
        $limit = max(1, min(100, (int)($request->limit ?? 20)));
        $total = $query->count();
        $clubs = $query->orderBy('created_at', 'desc')->skip(($page - 1) * $limit)->take($limit)->get();
        return response()->json(['clubs' => $clubs, 'total' => $total, 'page' => $page, 'limit' => $limit]);
    }

    public function show($id)
    {
        return response()->json(Club::findOrFail($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|unique:clubs,name',
            'description' => 'nullable|string',
            'location'    => 'nullable|string',
            'image'       => 'nullable|string',
            'features'    => 'nullable|array',
        ]);
        $data['slug']      = Str::slug($data['name']);
        $data['is_active'] = true;
        $data['features']  = $data['features'] ?? [];
        $club = Club::create($data);
        return response()->json($club, 201);
    }

    public function update(Request $request, $id)
    {
        $club = Club::findOrFail($id);
        $data = $request->only(['name','description','location','image','features','is_active','rating']);
        if (isset($data['name'])) $data['slug'] = Str::slug($data['name']);
        $club->update($data);
        return response()->json($club->fresh());
    }

    public function destroy($id)
    {
        Club::findOrFail($id)->delete();
        return response()->json(['message' => 'Club deleted']);
    }

    public function approve($id)
    {
        $club = Club::findOrFail($id);
        $club->update(['is_active' => true]);
        return response()->json($club->fresh());
    }

    public function reject($id)
    {
        $club = Club::findOrFail($id);
        $club->update(['is_active' => false]);
        return response()->json($club->fresh());
    }

    public function feature($id)
    {
        $club = Club::findOrFail($id);
        $club->update(['is_featured' => !($club->is_featured ?? false)]);
        return response()->json($club->fresh());
    }
}
