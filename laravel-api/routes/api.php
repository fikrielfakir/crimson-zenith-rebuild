<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'The Journey Association API',
        'timestamp' => now()->toISOString(),
    ]);
});
