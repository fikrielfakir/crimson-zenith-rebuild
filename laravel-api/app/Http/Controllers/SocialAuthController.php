<?php

namespace App\Http\Controllers;

use App\Models\AuthSettings;
use App\Models\User;
use App\Services\AdminTokenService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirectToGoogle()
    {
        $settings = AuthSettings::find('default');

        if (!$settings || !$settings->google_oauth_enabled || !$settings->google_client_id) {
            $frontendUrl = config('app.frontend_url', config('app.url'));
            return redirect(rtrim($frontendUrl, '/') . '/auth/callback?error=Google+login+is+not+enabled');
        }

        $this->applyGoogleConfig($settings);

        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        $settings = AuthSettings::find('default');

        $frontendUrl = config('app.frontend_url', config('app.url'));
        $callbackBase = rtrim($frontendUrl, '/') . '/auth/callback';

        if (!$settings || !$settings->google_oauth_enabled || !$settings->google_client_id) {
            return redirect($callbackBase . '?error=Google+login+is+not+enabled');
        }

        $this->applyGoogleConfig($settings);

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable $e) {
            \Log::warning('Google OAuth error: ' . $e->getMessage());
            return redirect($callbackBase . '?error=Google+authentication+failed');
        }

        $email = $googleUser->getEmail();
        if (!$email) {
            return redirect($callbackBase . '?error=No+email+returned+from+Google');
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            $nameParts = explode(' ', $googleUser->getName() ?? '', 2);
            $firstName  = $nameParts[0] ?? $email;
            $lastName   = $nameParts[1] ?? '';
            $id         = 'user_' . time() . '_' . Str::random(9);

            $user = User::create([
                'id'              => $id,
                'username'        => $email,
                'email'           => $email,
                'name'            => $googleUser->getName() ?? $email,
                'first_name'      => $firstName,
                'last_name'       => $lastName,
                'password'        => bcrypt(Str::random(32)),
                'role'            => 'user',
                'is_admin'        => false,
                'is_active'       => true,
                'email_verified'  => true,
                'profile_image_url' => $googleUser->getAvatar(),
                'google_id'       => $googleUser->getId(),
                'interests'       => [],
            ]);
        } else {
            $update = ['email_verified' => true];
            if (!$user->google_id) {
                $update['google_id'] = $googleUser->getId();
            }
            if (!$user->profile_image_url && $googleUser->getAvatar()) {
                $update['profile_image_url'] = $googleUser->getAvatar();
            }
            $user->update($update);
        }

        $token = AdminTokenService::generate((string) $user->id);

        return redirect($callbackBase . '?token=' . urlencode($token));
    }

    private function applyGoogleConfig(AuthSettings $settings): void
    {
        // Routes in api.php are prefixed with /api — the callback URL must include it.
        $redirectUri = rtrim(config('app.url'), '/') . '/api/auth/google/callback';

        config([
            'services.google.client_id'     => $settings->google_client_id,
            'services.google.client_secret' => $settings->google_client_secret,
            'services.google.redirect'      => $redirectUri,
        ]);
    }
}
