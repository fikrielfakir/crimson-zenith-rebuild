<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('landing_page_sections')) {
            Schema::create('landing_page_sections', function (Blueprint $table) {
                $table->id();
                $table->string('section_key')->unique();
                $table->string('label');
                $table->boolean('is_enabled')->default(true);
                $table->integer('ordering')->default(0);
                $table->timestamps();
            });

            DB::table('landing_page_sections')->insert([
                ['section_key' => 'hero',              'label' => 'Hero Banner',           'is_enabled' => true,  'ordering' => 1,  'created_at' => now(), 'updated_at' => now()],
                ['section_key' => 'president_message', 'label' => 'President Message',     'is_enabled' => true,  'ordering' => 2,  'created_at' => now(), 'updated_at' => now()],
                ['section_key' => 'about',             'label' => 'About / Focus Areas',   'is_enabled' => true,  'ordering' => 3,  'created_at' => now(), 'updated_at' => now()],
                ['section_key' => 'clubs_map',         'label' => 'Clubs Map',             'is_enabled' => true,  'ordering' => 4,  'created_at' => now(), 'updated_at' => now()],
                ['section_key' => 'events_calendar',   'label' => 'Events Calendar',       'is_enabled' => true,  'ordering' => 5,  'created_at' => now(), 'updated_at' => now()],
                ['section_key' => 'stats',             'label' => 'Statistics',            'is_enabled' => true,  'ordering' => 6,  'created_at' => now(), 'updated_at' => now()],
                ['section_key' => 'testimonials',      'label' => 'Testimonials',          'is_enabled' => true,  'ordering' => 7,  'created_at' => now(), 'updated_at' => now()],
                ['section_key' => 'partners',          'label' => 'Partners',              'is_enabled' => true,  'ordering' => 8,  'created_at' => now(), 'updated_at' => now()],
                ['section_key' => 'contact',           'label' => 'Contact',               'is_enabled' => true,  'ordering' => 9,  'created_at' => now(), 'updated_at' => now()],
            ]);
        }

        if (!Schema::hasTable('cookie_settings')) {
            Schema::create('cookie_settings', function (Blueprint $table) {
                $table->string('id')->primary()->default('default');
                $table->boolean('enabled')->default(true);
                $table->integer('delay')->default(1500);
                $table->string('title')->default('🍪 We use cookies to enhance your experience');
                $table->text('description')->nullable();
                $table->json('categories')->nullable();
                $table->timestamps();
            });

            DB::table('cookie_settings')->insert([
                'id'          => 'default',
                'enabled'     => true,
                'delay'       => 1500,
                'title'       => '🍪 We use cookies to enhance your experience',
                'description' => 'Our cookies help us remember your preferences, analyze site traffic, and provide personalized content. Essential cookies are always active.',
                'categories'  => json_encode([
                    ['key' => 'necessary',  'label' => 'Necessary Cookies',  'description' => 'Required for basic site functionality',               'enabled' => true, 'locked' => true],
                    ['key' => 'functional', 'label' => 'Functional Cookies', 'description' => 'Remember your preferences and settings',              'enabled' => true, 'locked' => false],
                    ['key' => 'analytics',  'label' => 'Analytics Cookies',  'description' => 'Help us understand how our website is being used',    'enabled' => true, 'locked' => false],
                    ['key' => 'marketing',  'label' => 'Marketing Cookies',  'description' => 'Personalized content and ads',                        'enabled' => true, 'locked' => false],
                ]),
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_page_sections');
        Schema::dropIfExists('cookie_settings');
    }
};
