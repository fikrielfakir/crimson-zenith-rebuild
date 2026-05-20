<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VolunteerPost;
use Illuminate\Http\Request;

class VolunteerPostController extends Controller
{
    public function index(Request $request)
    {
        $query = VolunteerPost::latest();
        if ($request->filled('status'))   $query->where('status', $request->status);
        if ($request->filled('category')) $query->where('category', $request->category);
        if ($request->filled('search'))   $query->where('title', 'like', '%' . $request->search . '%');

        $perPage = max(1, min(100, (int)($request->per_page ?? 20)));
        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'            => 'required|string|max:255',
            'location'         => 'nullable|string|max:255',
            'type'             => 'nullable|string|max:100',
            'duration'         => 'nullable|string|max:100',
            'commitment'       => 'nullable|string|max:100',
            'start_date'       => 'nullable|date',
            'deadline'         => 'nullable|date',
            'description'      => 'nullable|string',
            'responsibilities' => 'nullable|array',
            'responsibilities.*' => 'string',
            'requirements'     => 'nullable|array',
            'requirements.*'   => 'string',
            'benefits'         => 'nullable|array',
            'benefits.*'       => 'string',
            'category'         => 'nullable|string|max:100',
            'status'           => 'nullable|in:draft,published',
        ]);

        $post = VolunteerPost::create($data);
        return response()->json($post, 201);
    }

    public function show($id)
    {
        return response()->json(VolunteerPost::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title'            => 'sometimes|string|max:255',
            'location'         => 'nullable|string|max:255',
            'type'             => 'nullable|string|max:100',
            'duration'         => 'nullable|string|max:100',
            'commitment'       => 'nullable|string|max:100',
            'start_date'       => 'nullable|date',
            'deadline'         => 'nullable|date',
            'description'      => 'nullable|string',
            'responsibilities' => 'nullable|array',
            'requirements'     => 'nullable|array',
            'benefits'         => 'nullable|array',
            'category'         => 'nullable|string|max:100',
            'status'           => 'nullable|in:draft,published',
        ]);

        $post = VolunteerPost::findOrFail($id);
        $post->update($data);
        return response()->json($post->fresh());
    }

    public function destroy($id)
    {
        VolunteerPost::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
