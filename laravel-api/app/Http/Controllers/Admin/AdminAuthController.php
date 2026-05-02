<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)
            ->orWhere('email', $request->username)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid username or password'], 401);
        }

        if (!$user->is_admin) {
            return response()->json(['message' => 'Admin access required'], 403);
        }

        Auth::login($user);

        return response()->json([
            'message' => 'Login successful',
            'user'    => [
                'id'        => $user->id,
                'username'  => $user->username,
                'email'     => $user->email,
                'firstName' => $user->first_name,
                'lastName'  => $user->last_name,
                'isAdmin'   => true,
                'role'      => $user->role ?? 'admin',
            ],
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout successful']);
    }
}
