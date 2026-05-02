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

        if ($request->has('search') && $request->search !== '') {
            $s = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%$s%")
                ->orWhere('location', 'like', "%$s%"));
        }

        if ($request->has('status') && $request->status !== 'all') {
            match ($request->status) {
                'active'   => $query->where('is_active', true),
                'inactive' => $query->where('is_active', false),
                'pending'  => $query->whereNull('is_active'),
                default    => null,
            };
        }

        $page     = max(1, (int)($request->page    ?? 1));
        $perPage  = max(1, min(100, (int)($request->perPage ?? $request->limit ?? 25)));
        $total    = $query->count();
        $clubs    = $query->orderBy('created_at', 'desc')
                          ->skip(($page - 1) * $perPage)
                          ->take($perPage)
                          ->get();

        return response()->json([
            'clubs'      => $clubs,
            'total'      => $total,
            'page'       => $page,
            'perPage'    => $perPage,
            'totalPages' => (int)ceil($total / $perPage),
        ]);
    }

    public function show($id)
    {
        $club = Club::findOrFail($id);

        return response()->json([
            'id'              => $club->id,
            'name'            => $club->name,
            'slug'            => $club->slug,
            'description'     => $club->description,
            'longDescription' => $club->long_description,
            'image'           => $club->image,
            'location'        => $club->location,
            'contactPhone'    => $club->contact_phone,
            'contactEmail'    => $club->contact_email,
            'website'         => $club->website,
            'established'     => $club->established,
            'isActive'        => $club->is_active,
            'latitude'        => $club->latitude,
            'longitude'       => $club->longitude,
            'socialMedia'     => $club->social_media,
            'features'        => $club->features,
            'rating'          => $club->rating,
            'memberCount'     => $club->member_count,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'            => 'required|string|max:255|unique:clubs,name',
            'slug'            => 'nullable|string|max:255',
            'description'     => 'nullable|string',
            'longDescription' => 'nullable|string',
            'image'           => 'nullable|string',
            'location'        => 'nullable|string|max:255',
            'contactPhone'    => 'nullable|string|max:50',
            'contactEmail'    => 'nullable|email|max:255',
            'website'         => 'nullable|url|max:255',
            'established'     => 'nullable|string|max:100',
            'isActive'        => 'nullable|boolean',
            'latitude'        => 'nullable|numeric',
            'longitude'       => 'nullable|numeric',
            'socialMedia'     => 'nullable|array',
            'features'        => 'nullable|array',
        ]);

        $club = Club::create([
            'name'             => $data['name'],
            'slug'             => $data['slug'] ?? Str::slug($data['name']),
            'description'      => $data['description'] ?? null,
            'long_description' => $data['longDescription'] ?? null,
            'image'            => $data['image'] ?? null,
            'location'         => $data['location'] ?? null,
            'contact_phone'    => $data['contactPhone'] ?? null,
            'contact_email'    => $data['contactEmail'] ?? null,
            'website'          => $data['website'] ?? null,
            'established'      => $data['established'] ?? null,
            'is_active'        => $data['isActive'] ?? true,
            'latitude'         => $data['latitude'] ?? null,
            'longitude'        => $data['longitude'] ?? null,
            'social_media'     => $data['socialMedia'] ?? null,
            'features'         => $data['features'] ?? [],
        ]);

        return response()->json($club, 201);
    }

    public function update(Request $request, $id)
    {
        $club = Club::findOrFail($id);

        $data = $request->validate([
            'name'            => 'sometimes|string|max:255',
            'slug'            => 'sometimes|string|max:255',
            'description'     => 'nullable|string',
            'longDescription' => 'nullable|string',
            'image'           => 'nullable|string',
            'location'        => 'nullable|string|max:255',
            'contactPhone'    => 'nullable|string|max:50',
            'contactEmail'    => 'nullable|email|max:255',
            'website'         => 'nullable|url|max:255',
            'established'     => 'nullable|string|max:100',
            'isActive'        => 'nullable|boolean',
            'latitude'        => 'nullable|numeric',
            'longitude'       => 'nullable|numeric',
            'socialMedia'     => 'nullable|array',
            'features'        => 'nullable|array',
        ]);

        $mapped = [];
        if (array_key_exists('name', $data))            $mapped['name']             = $data['name'];
        if (array_key_exists('name', $data))            $mapped['slug']             = $data['slug'] ?? Str::slug($data['name']);
        if (array_key_exists('slug', $data))            $mapped['slug']             = $data['slug'];
        if (array_key_exists('description', $data))     $mapped['description']      = $data['description'];
        if (array_key_exists('longDescription', $data)) $mapped['long_description'] = $data['longDescription'];
        if (array_key_exists('image', $data))           $mapped['image']            = $data['image'];
        if (array_key_exists('location', $data))        $mapped['location']         = $data['location'];
        if (array_key_exists('contactPhone', $data))    $mapped['contact_phone']    = $data['contactPhone'];
        if (array_key_exists('contactEmail', $data))    $mapped['contact_email']    = $data['contactEmail'];
        if (array_key_exists('website', $data))         $mapped['website']          = $data['website'];
        if (array_key_exists('established', $data))     $mapped['established']      = $data['established'];
        if (array_key_exists('isActive', $data))        $mapped['is_active']        = $data['isActive'];
        if (array_key_exists('latitude', $data))        $mapped['latitude']         = $data['latitude'];
        if (array_key_exists('longitude', $data))       $mapped['longitude']        = $data['longitude'];
        if (array_key_exists('socialMedia', $data))     $mapped['social_media']     = $data['socialMedia'];
        if (array_key_exists('features', $data))        $mapped['features']         = $data['features'];

        $club->update($mapped);

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

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        // Store directly in public/uploads/clubs/ — no storage symlink needed.
        // This works on Hostinger where exec() and symlink() are both disabled.
        $file     = $request->file('image');
        $filename = uniqid('club_', true) . '.' . $file->getClientOriginalExtension();
        $dir      = public_path('uploads/clubs');

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $file->move($dir, $filename);

        $url = url('uploads/clubs/' . $filename);

        return response()->json(['url' => $url]);
    }
}
