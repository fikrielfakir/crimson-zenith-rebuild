<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuthSettings;
use Illuminate\Http\Request;

class AuthSettingsController extends Controller
{
    private function toApi(AuthSettings $settings): array
    {
        return [
            'allowRegistration'         => (bool) $settings->allow_registration,
            'passwordMinLength'         => (int)  $settings->password_min_length,
            'sessionDurationHours'      => (int)  $settings->session_duration_hours,
            'requireEmailVerification'  => (bool) $settings->require_email_verification,
            'maxLoginAttempts'          => (int)  $settings->max_login_attempts,
        ];
    }

    public function show()
    {
        $settings = AuthSettings::firstOrCreate(
            ['id' => 'default'],
            [
                'id'                          => 'default',
                'allow_registration'          => true,
                'password_min_length'         => 8,
                'session_duration_hours'      => 24,
                'require_email_verification'  => false,
                'max_login_attempts'          => 5,
            ]
        );

        return response()->json($this->toApi($settings));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'allowRegistration'        => 'nullable|boolean',
            'passwordMinLength'        => 'nullable|integer|min:4|max:32',
            'sessionDurationHours'     => 'nullable|integer|min:1|max:720',
            'requireEmailVerification' => 'nullable|boolean',
            'maxLoginAttempts'         => 'nullable|integer|min:1|max:20',
        ]);

        $settings = AuthSettings::firstOrCreate(['id' => 'default']);

        $map = [
            'allowRegistration'        => 'allow_registration',
            'passwordMinLength'        => 'password_min_length',
            'sessionDurationHours'     => 'session_duration_hours',
            'requireEmailVerification' => 'require_email_verification',
            'maxLoginAttempts'         => 'max_login_attempts',
        ];

        $update = ['updated_by' => $request->user()?->id ?? 'admin'];
        foreach ($map as $camel => $snake) {
            if (array_key_exists($camel, $validated)) {
                $update[$snake] = $validated[$camel];
            }
        }

        $settings->update($update);

        return response()->json($this->toApi($settings->fresh()));
    }
}
