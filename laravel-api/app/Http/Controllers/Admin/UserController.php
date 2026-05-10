<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();
        if ($request->has('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('email', 'like', "%$s%")->orWhere('first_name', 'like', "%$s%")->orWhere('last_name', 'like', "%$s%"));
        }
        if ($request->has('role'))   $query->where('role', $request->role);
        if ($request->has('active')) $query->where('is_active', filter_var($request->active, FILTER_VALIDATE_BOOLEAN));

        $page  = max(1, (int) ($request->page ?? 1));
        $limit = max(1, min(100, (int) ($request->limit ?? 20)));
        $total = $query->count();
        $users = $query->orderBy('created_at', 'desc')->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json(['users' => $users, 'total' => $total, 'page' => $page, 'limit' => $limit]);
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
            'username'   => $data['email'],
            'email'      => $data['email'],
            'first_name' => $data['firstName'],
            'last_name'  => $data['lastName'],
            'password'   => Hash::make($data['password']),
            'role'       => $data['role'] ?? 'user',
            'is_admin'   => ($data['role'] ?? 'user') === 'admin',
            'is_active'  => true,
            'interests'  => [],
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $data = $request->validate([
            'firstName' => 'nullable|string',
            'lastName'  => 'nullable|string',
            'email'     => 'nullable|email',
            'role'      => 'nullable|in:user,admin,moderator,club_manager,event_organizer',
        ]);

        $update = [];
        if (isset($data['firstName'])) $update['first_name'] = $data['firstName'];
        if (isset($data['lastName']))  $update['last_name']  = $data['lastName'];
        if (isset($data['email']))     $update['email']      = $data['email'];
        if (isset($data['role']))      { $update['role'] = $data['role']; $update['is_admin'] = $data['role'] === 'admin'; }

        $user->update($update);
        return response()->json($user->fresh());
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
        $user->update(['is_admin' => !$user->is_admin, 'role' => !$user->is_admin ? 'admin' : 'user']);
        return response()->json($user->fresh());
    }

    public function toggleActive($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);
        return response()->json($user->fresh());
    }

    public function resetPassword(Request $request, $id)
    {
        $request->validate(['password' => 'required|string|min:6']);
        $user = User::findOrFail($id);
        $user->update(['password' => Hash::make($request->password)]);
        return response()->json(['message' => 'Password reset successfully']);
    }
}
