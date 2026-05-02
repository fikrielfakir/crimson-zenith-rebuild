<?php

namespace App\Http\Controllers;

use App\Mail\WelcomeEmail;
use App\Models\User;
use App\Services\AdminTokenService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'firstName'       => 'required|string|max:255',
            'lastName'        => 'required|string|max:255',
            'email'           => 'required|email|max:255',
            'password'        => 'required|string|min:6',
            'confirmPassword' => 'nullable|string',
        ]);

        if (isset($data['confirmPassword']) && $data['password'] !== $data['confirmPassword']) {
            return response()->json(['message' => 'Passwords do not match'], 400);
        }

        if (User::where('email', $data['email'])->orWhere('username', $data['email'])->exists()) {
            return response()->json(['message' => 'An account with this email already exists'], 400);
        }

        $id = 'user_' . time() . '_' . Str::random(9);

        User::create([
            'id'         => $id,
            'username'   => $data['email'],
            'email'      => $data['email'],
            'first_name' => $data['firstName'],
            'last_name'  => $data['lastName'],
            'password'   => Hash::make($data['password']),
            'role'       => 'user',
            'is_admin'   => false,
            'is_active'  => true,
            'interests'  => [],
        ]);

        // Send welcome email (non-fatal)
        try {
            Mail::to($data['email'])->send(new WelcomeEmail($data['firstName'], $data['email']));
        } catch (\Throwable $e) {
            \Log::warning('Welcome email failed: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Account created successfully',
            'user'    => ['id' => $id, 'email' => $data['email'], 'firstName' => $data['firstName'], 'lastName' => $data['lastName'], 'role' => 'user'],
        ], 201);
    }

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

        // HMAC-signed stateless token — no session DB write, no UUID truncation.
        $token = AdminTokenService::generate((string) $user->id);

        return response()->json([
            'message'      => 'Login successful',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $this->formatUser($user),
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        // Always return the same response to avoid email enumeration
        return response()->json([
            'message' => 'If an account with that email exists, you will receive password reset instructions shortly.',
        ]);
    }

    public function logout(Request $request)
    {
        try {
            Auth::guard('web')->logout();
            if ($request->hasSession()) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }
        } catch (\Throwable $e) {
            // Session save may fail on production if session driver is database
            // with an incompatible schema — log and continue gracefully.
            \Log::warning('Session logout error (non-fatal): ' . $e->getMessage());
        }

        return response()->json(['message' => 'Logout successful']);
    }

    public function user(Request $request)
    {
        // Middleware (Authenticate) already resolved the user via HMAC token
        // or session guard and bound it via auth()->setUser().
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        return response()->json($this->formatUser($user));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'firstName'       => 'nullable|string|max:255',
            'lastName'        => 'nullable|string|max:255',
            'phone'           => 'nullable|string|max:50',
            'location'        => 'nullable|string|max:255',
            'bio'             => 'nullable|string',
            'interests'       => 'nullable|array',
            'profileImageUrl' => 'nullable|string',
        ]);

        $update = [];
        if (isset($data['firstName']))       $update['first_name']         = $data['firstName'];
        if (isset($data['lastName']))        $update['last_name']          = $data['lastName'];
        if (isset($data['phone']))           $update['phone']              = $data['phone'];
        if (isset($data['location']))        $update['location']           = $data['location'];
        if (isset($data['bio']))             $update['bio']                = $data['bio'];
        if (isset($data['interests']))       $update['interests']          = $data['interests'];
        if (isset($data['profileImageUrl'])) $update['profile_image_url']  = $data['profileImageUrl'];

        $user->update($update);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $this->formatUser($user->fresh()),
        ]);
    }

    public function uploadProfileImage(Request $request)
    {
        $request->validate(['imageData' => 'required|string']);

        $imageData = $request->imageData;
        if (!preg_match('/^data:image\/(png|jpeg|jpg|gif|webp);base64,.+$/', $imageData)) {
            return response()->json(['message' => 'Invalid image format'], 400);
        }

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user->update(['profile_image_url' => $imageData]);

        return response()->json([
            'message'         => 'Profile image updated successfully',
            'profileImageUrl' => $imageData,
            'user'            => $this->formatUser($user->fresh()),
        ]);
    }

    private function formatUser(User $user): array
    {
        return [
            'id'              => $user->id,
            'username'        => $user->username,
            'email'           => $user->email,
            'firstName'       => $user->first_name,
            'lastName'        => $user->last_name,
            'isAdmin'         => (bool) $user->is_admin,
            'role'            => $user->role ?? 'user',
            'profileImageUrl' => $user->profile_image_url,
            'bio'             => $user->bio,
            'phone'           => $user->phone,
            'location'        => $user->location,
            'interests'       => $user->interests ?? [],
        ];
    }
}
