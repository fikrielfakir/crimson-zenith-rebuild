<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class RolesController extends Controller
{
    const ROLES = [
        'admin' => [
            'label'       => 'Administrator',
            'description' => 'Full system access with all permissions',
            'color'       => 'red',
            'permissions' => [
                'users.manage', 'clubs.manage', 'events.manage',
                'content.manage', 'settings.manage', 'applications.manage',
            ],
        ],
        'moderator' => [
            'label'       => 'Moderator',
            'description' => 'Can manage content, clubs, events and review applications',
            'color'       => 'orange',
            'permissions' => [
                'clubs.manage', 'events.manage', 'content.manage', 'applications.review',
            ],
        ],
        'club_manager' => [
            'label'       => 'Club Manager',
            'description' => 'Can manage their own clubs, events and view members',
            'color'       => 'blue',
            'permissions' => [
                'clubs.edit', 'events.create', 'events.edit', 'members.view',
            ],
        ],
        'event_organizer' => [
            'label'       => 'Event Organizer',
            'description' => 'Can create and manage events only',
            'color'       => 'purple',
            'permissions' => [
                'events.create', 'events.edit',
            ],
        ],
        'user' => [
            'label'       => 'Member',
            'description' => 'Standard user with basic access',
            'color'       => 'gray',
            'permissions' => [
                'profile.edit', 'clubs.join', 'events.book',
            ],
        ],
    ];

    public function index()
    {
        $counts = User::selectRaw('role, COUNT(*) as count')
            ->groupBy('role')
            ->pluck('count', 'role')
            ->toArray();

        $roles = [];
        foreach (self::ROLES as $key => $def) {
            $roles[] = [
                'key'         => $key,
                'label'       => $def['label'],
                'description' => $def['description'],
                'color'       => $def['color'],
                'permissions' => $def['permissions'],
                'userCount'   => (int) ($counts[$key] ?? 0),
            ];
        }

        $totalUsers       = User::count();
        $totalPermissions = count(array_unique(array_merge(...array_column(self::ROLES, 'permissions'))));

        return response()->json([
            'roles'            => $roles,
            'totalUsers'       => $totalUsers,
            'totalPermissions' => $totalPermissions,
        ]);
    }

    public function users(Request $request, $role)
    {
        $validRoles = array_keys(self::ROLES);
        if (!in_array($role, $validRoles)) {
            return response()->json(['message' => 'Invalid role'], 422);
        }

        $query = User::where('role', $role);

        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('email', 'like', "%$s%")
                  ->orWhere('first_name', 'like', "%$s%")
                  ->orWhere('last_name', 'like', "%$s%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->take(50)->get()->map(function ($u) {
            return [
                'id'         => $u->id,
                'name'       => trim(($u->first_name ?? '') . ' ' . ($u->last_name ?? '')) ?: $u->email,
                'email'      => $u->email,
                'role'       => $u->role ?? 'user',
                'is_active'  => $u->is_active,
                'created_at' => $u->created_at,
            ];
        });

        return response()->json(['users' => $users]);
    }

    public function allUsers(Request $request)
    {
        $query = User::query();

        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('email', 'like', "%$s%")
                  ->orWhere('first_name', 'like', "%$s%")
                  ->orWhere('last_name', 'like', "%$s%");
            });
        }

        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('created_at', 'desc')->take(100)->get()->map(function ($u) {
            return [
                'id'        => $u->id,
                'name'      => trim(($u->first_name ?? '') . ' ' . ($u->last_name ?? '')) ?: $u->email,
                'email'     => $u->email,
                'role'      => $u->role ?? 'user',
                'is_active' => $u->is_active,
                'created_at'=> $u->created_at,
            ];
        });

        return response()->json(['users' => $users]);
    }

    public function updateUserRole(Request $request, $id)
    {
        $validRoles = array_keys(self::ROLES);

        $data = $request->validate([
            'role' => 'required|in:' . implode(',', $validRoles),
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'role'     => $data['role'],
            'is_admin' => $data['role'] === 'admin',
        ]);

        return response()->json([
            'message' => 'Role updated successfully',
            'user'    => [
                'id'    => $user->id,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ]);
    }

    public static function getRoleDefinitions(): array
    {
        return self::ROLES;
    }
}
