<?php

namespace App\Http\Middleware;

use App\Services\AdminTokenService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    const STAFF_ROLES = ['admin', 'moderator', 'club_manager', 'event_organizer'];

    private static function hasStaffRole($user): bool
    {
        return $user->is_admin || in_array($user->role ?? '', self::STAFF_ROLES);
    }

    public function handle(Request $request, Closure $next): Response
    {
        // 1. HMAC Bearer token — stateless, no session side-effects.
        //    Use setUserResolver() so StartSession never reads a UUID user_id
        //    and never attempts to write it to sessions.user_id (bigint).
        $bearer = $request->bearerToken();
        if ($bearer) {
            $user = AdminTokenService::verify($bearer);
            if ($user && self::hasStaffRole($user)) {
                $request->setUserResolver(fn () => $user);
                return $next($request);
            }
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // 2. Session / Sanctum fallback (local dev only)
        $user = auth('sanctum')->user() ?? auth('web')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (!self::hasStaffRole($user)) {
            return response()->json(['message' => 'Forbidden - Admin access required'], 403);
        }

        return $next($request);
    }
}
