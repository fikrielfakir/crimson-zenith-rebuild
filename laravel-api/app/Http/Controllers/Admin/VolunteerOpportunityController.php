<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VolunteerOpportunity;
use Illuminate\Http\Request;

class VolunteerOpportunityController extends Controller
{
    public function index(Request $request)
    {
        $query = VolunteerOpportunity::latest();
        if ($request->filled('status'))   $query->where('status', $request->status);
        if ($request->filled('urgency'))  $query->where('urgency', $request->urgency);
        if ($request->filled('search'))   $query->where('title', 'like', '%' . $request->search . '%');

        $perPage = max(1, min(100, (int)($request->per_page ?? 20)));
        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'                => 'required|string|max:255',
            'location'             => 'nullable|string|max:255',
            'duration'             => 'nullable|string|max:100',
            'max_participants'     => 'nullable|integer|min:1',
            'current_participants' => 'nullable|integer|min:0',
            'description'          => 'nullable|string',
            'skills'               => 'nullable|array',
            'skills.*'             => 'string',
            'urgency'              => 'nullable|in:high,medium,low',
            'status'               => 'nullable|in:draft,published',
        ]);

        $opportunity = VolunteerOpportunity::create($data);
        return response()->json($opportunity, 201);
    }

    public function show($id)
    {
        return response()->json(VolunteerOpportunity::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title'                => 'sometimes|string|max:255',
            'location'             => 'nullable|string|max:255',
            'duration'             => 'nullable|string|max:100',
            'max_participants'     => 'nullable|integer|min:1',
            'current_participants' => 'nullable|integer|min:0',
            'description'          => 'nullable|string',
            'skills'               => 'nullable|array',
            'skills.*'             => 'string',
            'urgency'              => 'nullable|in:high,medium,low',
            'status'               => 'nullable|in:draft,published',
        ]);

        $opportunity = VolunteerOpportunity::findOrFail($id);
        $opportunity->update($data);
        return response()->json($opportunity->fresh());
    }

    public function destroy($id)
    {
        VolunteerOpportunity::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
