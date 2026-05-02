<?php

namespace App\Http\Middleware;

use App\Services\AdminTokenService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authenticate
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. HMAC Bearer token — works for both admin and regular users
        $bearer = $request->bearerToken();
        if ($bearer) {
            $user = AdminTokenService::verify($bearer);
            if ($user) {
                // Bind user so $request->user() works in all downstream controllers
                auth()->setUser($user);
                return $next($request);
            }
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // 2. Session-based web guard (legacy fallback)
        if (auth('web')->check()) {
            return $next($request);
        }

        // 3. Sanctum stateful guard (additional fallback)
        if (auth('sanctum')->check()) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }
}
