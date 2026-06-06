<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkOffer;
use Illuminate\Http\Request;

class WorkOfferController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkOffer::latest();
        if ($request->filled('status'))   $query->where('status', $request->status);
        if ($request->filled('category')) $query->where('category', $request->category);
        if ($request->filled('type'))     $query->where('type', $request->type);
        if ($request->filled('search'))   $query->where(fn($q) => $q->where('title', 'like', '%' . $request->search . '%')->orWhere('company', 'like', '%' . $request->search . '%'));

        $perPage = max(1, min(100, (int)($request->per_page ?? 20)));
        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'            => 'required|string|max:255',
            'company'          => 'nullable|string|max:255',
            'location'         => 'nullable|string|max:255',
            'type'             => 'nullable|string|max:100',
            'salary'           => 'nullable|string|max:100',
            'experience_level' => 'nullable|string|max:100',
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

        $offer = WorkOffer::create($data);
        return response()->json($offer, 201);
    }

    public function show($id)
    {
        return response()->json(WorkOffer::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title'            => 'sometimes|string|max:255',
            'company'          => 'nullable|string|max:255',
            'location'         => 'nullable|string|max:255',
            'type'             => 'nullable|string|max:100',
            'salary'           => 'nullable|string|max:100',
            'experience_level' => 'nullable|string|max:100',
            'description'      => 'nullable|string',
            'responsibilities' => 'nullable|array',
            'requirements'     => 'nullable|array',
            'benefits'         => 'nullable|array',
            'category'         => 'nullable|string|max:100',
            'status'           => 'nullable|in:draft,published',
        ]);

        $offer = WorkOffer::findOrFail($id);
        $offer->update($data);
        return response()->json($offer->fresh());
    }

    public function destroy($id)
    {
        WorkOffer::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
