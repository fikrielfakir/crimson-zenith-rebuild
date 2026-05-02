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
        // 1. HMAC admin token (Authorization: Bearer …)
        $bearer = $request->bearerToken();
        if ($bearer && AdminTokenService::verify($bearer)) {
            return $next($request);
        }

        // 2. Session-based auth (web guard)
        if (auth('web')->check()) {
            return $next($request);
        }

        // 3. Sanctum stateful session guard (fallback)
        if (auth('sanctum')->check()) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }
}
