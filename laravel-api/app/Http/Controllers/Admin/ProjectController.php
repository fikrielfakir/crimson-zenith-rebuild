<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::latest();
        if ($request->filled('status'))   $query->where('status', $request->status);
        if ($request->filled('category')) $query->where('category', $request->category);
        if ($request->filled('search'))   $query->where('title', 'like', '%' . $request->search . '%');

        $perPage = max(1, min(100, (int)($request->per_page ?? 20)));
        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'              => 'required|string|max:255',
            'description'        => 'nullable|string',
            'category'           => 'nullable|string|max:100',
            'status'             => 'nullable|in:active,ongoing,planning,completed',
            'progress'           => 'nullable|integer|min:0|max:100',
            'image'              => 'nullable|string',
            'location'           => 'nullable|string|max:255',
            'participants_count' => 'nullable|integer|min:0',
            'impact_people'      => 'nullable|integer|min:0',
            'impact_co2'         => 'nullable|string|max:100',
            'impact_sites'       => 'nullable|integer|min:0',
            'is_featured'        => 'nullable|boolean',
        ]);

        $project = Project::create($data);
        return response()->json($project, 201);
    }

    public function show($id)
    {
        return response()->json(Project::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title'              => 'sometimes|string|max:255',
            'description'        => 'nullable|string',
            'category'           => 'nullable|string|max:100',
            'status'             => 'nullable|in:active,ongoing,planning,completed',
            'progress'           => 'nullable|integer|min:0|max:100',
            'image'              => 'nullable|string',
            'location'           => 'nullable|string|max:255',
            'participants_count' => 'nullable|integer|min:0',
            'impact_people'      => 'nullable|integer|min:0',
            'impact_co2'         => 'nullable|string|max:100',
            'impact_sites'       => 'nullable|integer|min:0',
            'is_featured'        => 'nullable|boolean',
        ]);

        $project = Project::findOrFail($id);
        $project->update($data);
        return response()->json($project->fresh());
    }

    public function destroy($id)
    {
        Project::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function toggleFeatured($id)
    {
        $project = Project::findOrFail($id);
        $project->update(['is_featured' => !$project->is_featured]);
        return response()->json($project->fresh());
    }
}
