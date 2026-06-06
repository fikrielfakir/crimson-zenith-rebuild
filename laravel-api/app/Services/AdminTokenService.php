<?php

namespace App\Services;

use App\Models\User;

/**
 * Stateless HMAC admin token — no database table required.
 *
 * Token format:  base64url(userId|expiresAt)  +  '.'  +  base64url(HMAC-SHA256(payload, APP_KEY))
 *
 * Advantages over Sanctum personal access tokens:
 *  - Zero database dependencies (no personal_access_tokens table)
 *  - Works on any deployment immediately — no migration needed
 *  - Secure as long as APP_KEY is kept secret
 */
class AdminTokenService
{
    private const TTL = 8 * 3600; // 8 hours

    // ------------------------------------------------------------------ //

    public static function generate(string $userId): string
    {
        $expires = time() + self::TTL;
        $payload = self::b64e($userId . '|' . $expires);
        $sig     = self::b64e(hash_hmac('sha256', $payload, self::key(), true));
        return $payload . '.' . $sig;
    }

    /**
     * Verify token and return the User model, or null on failure.
     */
    public static function verify(string $token): ?User
    {
        $parts = explode('.', $token, 2);
        if (count($parts) !== 2) return null;

        [$payload, $sig] = $parts;

        // Constant-time comparison to prevent timing attacks
        $expected = self::b64e(hash_hmac('sha256', $payload, self::key(), true));
        if (!hash_equals($expected, $sig)) return null;

        $decoded = self::b64d($payload);
        if ($decoded === false) return null;

        $sep = strrpos($decoded, '|');
        if ($sep === false) return null;

        $userId  = substr($decoded, 0, $sep);
        $expires = (int) substr($decoded, $sep + 1);

        if (time() > $expires) return null;

        return User::find($userId);
    }

    // ------------------------------------------------------------------ //

    private static function key(): string
    {
        $key = config('app.key');
        // Laravel prefixes the key with "base64:" when it is base64-encoded
        if (str_starts_with($key, 'base64:')) {
            $key = base64_decode(substr($key, 7));
        }
        return $key;
    }

    private static function b64e(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function b64d(string $data): string|false
    {
        $padded = str_pad(strtr($data, '-_', '+/'), strlen($data) + (4 - strlen($data) % 4) % 4, '=');
        return base64_decode($padded, true);
    }
}
