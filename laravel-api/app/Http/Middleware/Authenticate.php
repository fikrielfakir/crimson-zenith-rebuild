<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authenticate
{
    public function handle(Request $request, Closure $next): Response
    {
        // Try Sanctum guard first (checks both Bearer tokens and stateful sessions).
        // Fallback to the default web guard for session-only environments.
        if (!auth('sanctum')->check() && !auth('web')->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
