<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    private function transformUser(User $user, int $clubCount = 0): array
    {
        return [
            'id'              => $user->id,
            'firstName'       => $user->first_name,
            'lastName'        => $user->last_name,
            'username'        => $user->username,
            'email'           => $user->email,
            'phone'           => $user->phone,
            'location'        => $user->location,
            'bio'             => $user->bio,
            'interests'       => $user->interests,
            'role'            => $user->role ?? 'user',
            'isAdmin'         => (bool) $user->is_admin,
            'isActive'        => (bool) $user->is_active,
            'profileImageUrl' => $user->profile_image_url,
            'createdAt'       => $user->created_at,
            'updatedAt'       => $user->updated_at,
            'clubCount'       => $clubCount,
        ];
    }

    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('search')) {
            $s = $request->search;
            $query->where(fn($q) =>
                $q->where('email',      'like', "%$s%")
                  ->orWhere('first_name','like', "%$s%")
                  ->orWhere('last_name', 'like', "%$s%")
                  ->orWhere('username',  'like', "%$s%")
            );
        }

        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->has('status')) {
            if ($request->status === 'active')   $query->where('is_active', true);
            if ($request->status === 'inactive') $query->where('is_active', false);
        }

        $page    = max(1, (int) ($request->page    ?? 1));
        $perPage = max(1, min(100, (int) ($request->perPage ?? $request->limit ?? 20)));
        $total   = $query->count();
        $users   = $query->withCount('clubs as owned_clubs_count')
                         ->orderBy('created_at', 'desc')
                         ->skip(($page - 1) * $perPage)
                         ->take($perPage)
                         ->get();

        return response()->json([
            'users'      => $users->map(fn($u) => $this->transformUser($u, $u->owned_clubs_count ?? 0)),
            'total'      => $total,
            'page'       => $page,
            'totalPages' => (int) ceil($total / $perPage),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'firstName' => 'required|string',
            'lastName'  => 'required|string',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|string|min:6',
            'role'      => 'nullable|in:user,admin,moderator,club_manager,event_organizer',
        ]);

        $user = User::create([
            'id'         => 'user_'.time().'_'.Str::random(9),
            'username'   => explode('@', $data['email'])[0],
            'email'      => $data['email'],
            'first_name' => $data['firstName'],
            'last_name'  => $data['lastName'],
            'password'   => Hash::make($data['password']),
            'role'       => $data['role'] ?? 'user',
            'is_admin'   => ($data['role'] ?? 'user') === 'admin',
            'is_active'  => true,
            'interests'  => [],
        ]);

        return response()->json($this->transformUser($user), 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $data = $request->validate([
            'firstName' => 'nullable|string',
            'lastName'  => 'nullable|string',
            'email'     => 'nullable|email',
            'phone'     => 'nullable|string',
            'location'  => 'nullable|string',
            'bio'       => 'nullable|string',
            'role'      => 'nullable|in:user,admin,moderator,club_manager,event_organizer',
            'isActive'  => 'nullable|boolean',
        ]);

        $update = [];
        if (isset($data['firstName'])) $update['first_name'] = $data['firstName'];
        if (isset($data['lastName']))  $update['last_name']  = $data['lastName'];
        if (isset($data['email']))     $update['email']      = $data['email'];
        if (isset($data['phone']))     $update['phone']      = $data['phone'];
        if (isset($data['location']))  $update['location']   = $data['location'];
        if (isset($data['bio']))       $update['bio']        = $data['bio'];
        if (isset($data['isActive']))  $update['is_active']  = $data['isActive'];
        if (isset($data['role'])) {
            $update['role']     = $data['role'];
            $update['is_admin'] = $data['role'] === 'admin';
        }

        $user->update($update);
        return response()->json($this->transformUser($user->fresh()));
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    public function toggleAdmin($id)
    {
        $user = User::findOrFail($id);
        $newAdmin = !$user->is_admin;
        $user->update(['is_admin' => $newAdmin, 'role' => $newAdmin ? 'admin' : 'user']);
        return response()->json($this->transformUser($user->fresh()));
    }

    public function toggleActive($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);
        return response()->json($this->transformUser($user->fresh()));
    }

    public function resetPassword(Request $request, $id)
    {
        $request->validate(['newPassword' => 'required|string|min:6']);
        $user = User::findOrFail($id);
        $user->update(['password' => Hash::make($request->newPassword)]);
        return response()->json(['message' => 'Password reset successfully']);
    }
}
