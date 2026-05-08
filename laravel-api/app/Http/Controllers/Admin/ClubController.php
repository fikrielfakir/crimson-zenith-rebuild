<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ClubController extends Controller
{
    // ------------------------------------------------------------------ //
    // Helpers
    // ------------------------------------------------------------------ //

    private function mapOutput(Club $c): array
    {
        return [
            'id'              => $c->id,
            'name'            => $c->name,
            'slug'            => $c->slug,
            'description'     => $c->description,
            'longDescription' => $c->long_description,
            'image'           => $c->image,
            'location'        => $c->location,
            'contactPhone'    => $c->contact_phone,
            'contactEmail'    => $c->contact_email,
            'website'         => $c->website,
            'established'     => $c->established,
            'isActive'        => (bool) $c->is_active,
            'isFeatured'      => (bool) ($c->is_featured ?? false),
            'latitude'        => $c->latitude,
            'longitude'       => $c->longitude,
            'socialMedia'     => $c->social_media ?? [],
            'features'        => $c->features ?? [],
            'rating'          => $c->rating,
            'memberCount'     => $c->member_count ?? 0,
            'createdAt'       => $c->created_at?->toISOString(),
            'updatedAt'       => $c->updated_at?->toISOString(),
        ];
    }

    private function mapInput(Request $r): array
    {
        return array_filter([
            'name'             => $r->input('name'),
            'slug'             => $r->input('slug'),
            'description'      => $r->input('description'),
            'long_description' => $r->input('longDescription'),
            'image'            => $r->input('image'),
            'location'         => $r->input('location'),
            'contact_phone'    => $r->input('contactPhone'),
            'contact_email'    => $r->input('contactEmail'),
            'website'          => $r->input('website'),
            'established'      => $r->input('established'),
            'is_active'        => $r->has('isActive') ? (bool) $r->input('isActive') : null,
            'latitude'         => $r->input('latitude'),
            'longitude'        => $r->input('longitude'),
            'social_media'     => $r->input('socialMedia', []),
            'features'         => $r->input('features', []),
        ], fn($v) => $v !== null);
    }

    // ------------------------------------------------------------------ //
    // CRUD
    // ------------------------------------------------------------------ //

    public function index(Request $request)
    {
        $query = Club::query();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%$s%")
                ->orWhere('location', 'like', "%$s%"));
        }

        if ($request->filled('status') && $request->status !== 'all') {
            match ($request->status) {
                'active'   => $query->where('is_active', true),
                'inactive' => $query->where('is_active', false),
                'pending'  => $query->whereNull('is_active'),
                default    => null,
            };
        }

        $page    = max(1, (int) ($request->page    ?? 1));
        $perPage = max(1, min(100, (int) ($request->perPage ?? $request->limit ?? 25)));
        $total   = $query->count();

        $clubs = $query->orderBy('created_at', 'desc')
                       ->skip(($page - 1) * $perPage)
                       ->take($perPage)
                       ->get()
                       ->map(fn($c) => $this->mapOutput($c));

        return response()->json([
            'clubs'      => $clubs,
            'total'      => $total,
            'page'       => $page,
            'perPage'    => $perPage,
            'totalPages' => (int) ceil($total / $perPage),
        ]);
    }

    public function show($id)
    {
        return response()->json($this->mapOutput(Club::findOrFail($id)));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'contactEmail' => 'nullable|email|max:255',
            'website'      => 'nullable|url|max:255',
            'latitude'     => 'nullable|numeric',
            'longitude'    => 'nullable|numeric',
        ]);

        $data                = $this->mapInput($request);
        $data['slug']        = $data['slug'] ?? Str::slug($request->input('name'));
        $data['is_active']   = $data['is_active'] ?? true;
        $data['description'] = $data['description'] ?? '';

        $club = Club::create($data);

        return response()->json($this->mapOutput($club->fresh()), 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'contactEmail' => 'nullable|email|max:255',
            'website'      => 'nullable|url|max:255',
            'latitude'     => 'nullable|numeric',
            'longitude'    => 'nullable|numeric',
        ]);

        $club = Club::findOrFail($id);
        $data = $this->mapInput($request);

        if (isset($data['name']) && !isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $club->update($data);

        return response()->json($this->mapOutput($club->fresh()));
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
        return response()->json($this->mapOutput($club->fresh()));
    }

    public function reject($id)
    {
        $club = Club::findOrFail($id);
        $club->update(['is_active' => false]);
        return response()->json($this->mapOutput($club->fresh()));
    }

    public function feature($id)
    {
        $club = Club::findOrFail($id);
        $club->update(['is_featured' => !($club->is_featured ?? false)]);
        return response()->json($this->mapOutput($club->fresh()));
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $file     = $request->file('image');
        $filename = uniqid('club_', true) . '.' . $file->getClientOriginalExtension();
        $dir      = public_path('uploads/clubs');

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $file->move($dir, $filename);

        return response()->json(['url' => url('uploads/clubs/' . $filename)]);
    }
}
