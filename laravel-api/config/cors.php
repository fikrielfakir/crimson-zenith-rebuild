<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5000',
        'http://localhost:3000',
        'https://*.replit.dev',
        'https://*.repl.co',
        'https://*.replit.app',
    ],

    'allowed_origins_patterns' => [
        '#^https://.*\.replit\.dev$#',
        '#^https://.*\.replit\.app$#',
        '#^https://.*\.repl\.co$#',
        '#^http://.*$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
