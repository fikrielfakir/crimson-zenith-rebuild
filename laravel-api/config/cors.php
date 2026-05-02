<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Allows the React/Vite frontend (localhost:5000) and production domain
    | to call this API.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5000',
        'http://localhost:3000',
        'https://*.replit.dev',
        'https://*.repl.co',
        'https://*.kirk.replit.dev',
        'https://*.replit.app',
    ],

    'allowed_origins_patterns' => [
        '#^https://.*\.replit\.dev$#',
        '#^https://.*\.replit\.app$#',
        '#^https://.*\.repl\.co$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
