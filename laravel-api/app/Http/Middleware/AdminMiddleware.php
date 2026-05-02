<?php

namespace App\Http\Middleware;

use App\Services\AdminTokenService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. HMAC admin token (Authorization: Bearer …)
        $bearer = $request->bearerToken();
        if ($bearer) {
            $user = AdminTokenService::verify($bearer);
            if ($user && $user->is_admin) {
                // Bind user to the request so controllers can call $request->user()
                auth()->setUser($user);
                return $next($request);
            }
            // Invalid or non-admin token — reject immediately
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // 2. Session / Sanctum fallback
        $user = auth('sanctum')->user() ?? auth('web')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (!$user->is_admin) {
            return response()->json(['message' => 'Forbidden - Admin access required'], 403);
        }

        return $next($request);
    }
}
