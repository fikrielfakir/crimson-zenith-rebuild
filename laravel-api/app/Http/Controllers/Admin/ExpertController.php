<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expert;
use Illuminate\Http\Request;

class ExpertController extends Controller
{
    public function index(Request $request)
    {
        $query = Expert::latest();
        if ($request->filled('status'))       $query->where('status', $request->status);
        if ($request->filled('is_available')) $query->where('is_available', (bool)$request->is_available);
        if ($request->filled('search'))       $query->where(fn($q) => $q->where('name', 'like', '%' . $request->search . '%')->orWhere('title', 'like', '%' . $request->search . '%'));

        $perPage = max(1, min(100, (int)($request->per_page ?? 20)));
        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:255',
            'title'            => 'nullable|string|max:255',
            'location'         => 'nullable|string|max:255',
            'image'            => 'nullable|string',
            'expertise'        => 'nullable|array',
            'expertise.*'      => 'string',
            'rating'           => 'nullable|numeric|min:0|max:5',
            'projects_count'   => 'nullable|integer|min:0',
            'years_experience' => 'nullable|integer|min:0',
            'languages'        => 'nullable|array',
            'languages.*'      => 'string',
            'bio'              => 'nullable|string',
            'achievements'     => 'nullable|array',
            'achievements.*'   => 'string',
            'certifications'   => 'nullable|array',
            'certifications.*' => 'string',
            'is_available'     => 'nullable|boolean',
            'status'           => 'nullable|in:draft,published',
        ]);

        $expert = Expert::create($data);
        return response()->json($expert, 201);
    }

    public function show($id)
    {
        return response()->json(Expert::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name'             => 'sometimes|string|max:255',
            'title'            => 'nullable|string|max:255',
            'location'         => 'nullable|string|max:255',
            'image'            => 'nullable|string',
            'expertise'        => 'nullable|array',
            'rating'           => 'nullable|numeric|min:0|max:5',
            'projects_count'   => 'nullable|integer|min:0',
            'years_experience' => 'nullable|integer|min:0',
            'languages'        => 'nullable|array',
            'bio'              => 'nullable|string',
            'achievements'     => 'nullable|array',
            'certifications'   => 'nullable|array',
            'is_available'     => 'nullable|boolean',
            'status'           => 'nullable|in:draft,published',
        ]);

        $expert = Expert::findOrFail($id);
        $expert->update($data);
        return response()->json($expert->fresh());
    }

    public function destroy($id)
    {
        Expert::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
