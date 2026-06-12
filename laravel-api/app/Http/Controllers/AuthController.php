<?php

namespace App\Http\Controllers;

use App\Mail\VerifyEmail;
use App\Mail\ResetPasswordEmail;
use App\Models\User;
use App\Models\AuthSettings;
use App\Services\AdminTokenService;
use App\Services\SmtpMailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function __construct(private SmtpMailService $mailer) {}

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

        $verificationToken = Str::random(64);
        $id = 'user_' . time() . '_' . Str::random(9);

        User::create([
            'id'                            => $id,
            'username'                      => $data['email'],
            'email'                         => $data['email'],
            'name'                          => $data['firstName'] . ' ' . $data['lastName'],
            'first_name'                    => $data['firstName'],
            'last_name'                     => $data['lastName'],
            'password'                      => Hash::make($data['password']),
            'role'                          => 'user',
            'is_admin'                      => false,
            'is_active'                     => true,
            'email_verified'                => false,
            'verification_token'            => $verificationToken,
            'verification_token_expires_at' => now()->addHours(24),
            'interests'                     => [],
        ]);

        try {
            $frontendUrl = config('app.frontend_url', config('app.url'));
            $verifyUrl   = rtrim($frontendUrl, '/') . '/verify-email?token=' . $verificationToken;
            $this->mailer->send($data['email'], new VerifyEmail($data['firstName'], $verifyUrl));
        } catch (\Throwable $e) {
            \Log::warning('Verification email failed: ' . $e->getMessage());
        }

        return response()->json([
            'message'              => 'Account created. Please check your email to verify your account.',
            'requiresVerification' => true,
            'user'                 => ['id' => $id, 'email' => $data['email'], 'firstName' => $data['firstName'], 'lastName' => $data['lastName'], 'role' => 'user'],
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

        $authSettings = AuthSettings::find('default');
        if ($authSettings?->require_email_verification && !$user->email_verified) {
            return response()->json([
                'message'              => 'Please verify your email address before logging in.',
                'requiresVerification' => true,
                'email'                => $user->email,
            ], 403);
        }

        $token = AdminTokenService::generate((string) $user->id);

        return response()->json([
            'message'      => 'Login successful',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $this->formatUser($user),
        ]);
    }

    public function verifyEmail(Request $request, string $token)
    {
        $user = User::where('verification_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired verification link.'], 400);
        }

        if ($user->verification_token_expires_at && now()->isAfter($user->verification_token_expires_at)) {
            return response()->json(['message' => 'This verification link has expired. Please request a new one.'], 400);
        }

        $user->update([
            'email_verified'                => true,
            'verification_token'            => null,
            'verification_token_expires_at' => null,
        ]);

        return response()->json(['message' => 'Email verified successfully! You can now log in.']);
    }

    public function resendVerification(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if ($user && !$user->email_verified) {
            $token = Str::random(64);
            $user->update([
                'verification_token'            => $token,
                'verification_token_expires_at' => now()->addHours(24),
            ]);

            try {
                $frontendUrl = config('app.frontend_url', config('app.url'));
                $verifyUrl   = rtrim($frontendUrl, '/') . '/verify-email?token=' . $token;
                $this->mailer->send($user->email, new VerifyEmail($user->first_name ?? 'there', $verifyUrl));
            } catch (\Throwable $e) {
                \Log::warning('Resend verification email failed: ' . $e->getMessage());
            }
        }

        return response()->json(['message' => 'If your email is registered and unverified, a new verification link has been sent.']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $token = Str::random(64);

            DB::table('password_reset_tokens')->upsert(
                ['email' => $user->email, 'token' => Hash::make($token), 'created_at' => now()],
                ['email'],
                ['token', 'created_at']
            );

            try {
                $frontendUrl = config('app.frontend_url', config('app.url'));
                $resetUrl    = rtrim($frontendUrl, '/') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
                $this->mailer->send($user->email, new ResetPasswordEmail($user->first_name ?? 'there', $resetUrl));
            } catch (\Throwable $e) {
                \Log::warning('Reset password email failed: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'If an account with that email exists, you will receive password reset instructions shortly.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'                 => 'required|string',
            'email'                 => 'required|email',
            'password'              => 'required|string|min:6',
            'password_confirmation' => 'required|string|same:password',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Invalid or expired reset link.'], 400);
        }

        if (now()->isAfter(\Carbon\Carbon::parse($record->created_at)->addHour())) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'This reset link has expired. Please request a new one.'], 400);
        }

        if (!Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Invalid or expired reset link.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $user->update(['password' => Hash::make($request->password)]);
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password reset successfully. You can now log in.']);
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
            \Log::warning('Session logout error (non-fatal): ' . $e->getMessage());
        }

        return response()->json(['message' => 'Logout successful']);
    }

    public function user(Request $request)
    {
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
        if (isset($data['firstName']))       $update['first_name']        = $data['firstName'];
        if (isset($data['lastName']))        $update['last_name']         = $data['lastName'];
        if (isset($data['phone']))           $update['phone']             = $data['phone'];
        if (isset($data['location']))        $update['location']          = $data['location'];
        if (isset($data['bio']))             $update['bio']               = $data['bio'];
        if (isset($data['interests']))       $update['interests']         = $data['interests'];
        if (isset($data['profileImageUrl'])) $update['profile_image_url'] = $data['profileImageUrl'];

        $user->update($update);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $this->formatUser($user->fresh()),
        ]);
    }

    public function uploadProfileImage(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // ── Multipart file upload (preferred) ─────────────────────────────
        if ($request->hasFile('image') || $request->hasFile('file')) {
            $file     = $request->file('image') ?? $request->file('file');
            $request->validate(['image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
                                 'file'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120']);

            $origName = $file->getClientOriginalName();
            $ext      = $file->getClientOriginalExtension() ?: 'jpg';
            $uuid     = (string) Str::uuid();
            $filename = $uuid . '.' . $ext;

            Storage::disk('public')->put('media/' . $filename, file_get_contents($file->getRealPath()));
            $fileUrl = '/storage/media/' . $filename;

            $user->update(['profile_image_url' => $fileUrl]);

            return response()->json([
                'message'         => 'Profile image updated successfully',
                'profileImageUrl' => $fileUrl,
                'user'            => $this->formatUser($user->fresh()),
            ]);
        }

        // ── Base64 fallback ───────────────────────────────────────────────
        $request->validate(['imageData' => 'required|string']);
        $imageData = $request->imageData;

        if (!preg_match('/^data:image\/(png|jpeg|jpg|gif|webp);base64,(.+)$/', $imageData, $m)) {
            return response()->json(['message' => 'Invalid image format'], 400);
        }

        // Decode and store on disk instead of bloating the DB column
        $ext      = $m[1] === 'jpeg' ? 'jpg' : $m[1];
        $uuid     = (string) Str::uuid();
        $filename = $uuid . '.' . $ext;
        Storage::disk('public')->put('media/' . $filename, base64_decode($m[2]));
        $fileUrl = '/storage/media/' . $filename;

        $user->update(['profile_image_url' => $fileUrl]);

        return response()->json([
            'message'         => 'Profile image updated successfully',
            'profileImageUrl' => $fileUrl,
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
            'emailVerified'   => (bool) $user->email_verified,
        ];
    }
}
