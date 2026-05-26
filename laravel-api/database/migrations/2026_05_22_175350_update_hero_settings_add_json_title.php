<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('hero_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('hero_settings', 'background_image_url')) {
                $table->string('background_image_url', 1000)->nullable()->after('background_media_id');
            }
            if (!Schema::hasColumn('hero_settings', 'background_video_url')) {
                $table->string('background_video_url', 1000)->nullable()->after('background_image_url');
            }
            if (!Schema::hasColumn('hero_settings', 'show_primary_button')) {
                $table->boolean('show_primary_button')->default(true)->after('secondary_button_link');
            }
            if (!Schema::hasColumn('hero_settings', 'show_secondary_button')) {
                $table->boolean('show_secondary_button')->default(true)->after('show_primary_button');
            }
            if (!Schema::hasColumn('hero_settings', 'title_alignment')) {
                $table->string('title_alignment', 20)->default('center')->after('title_color');
            }
            if (!Schema::hasColumn('hero_settings', 'subtitle_alignment')) {
                $table->string('subtitle_alignment', 20)->default('center')->after('subtitle_color');
            }
            if (!Schema::hasColumn('hero_settings', 'hero_height')) {
                $table->string('hero_height', 20)->default('600')->after('subtitle_alignment');
            }
            if (!Schema::hasColumn('hero_settings', 'content_max_width')) {
                $table->string('content_max_width', 20)->default('800')->after('hero_height');
            }
        });

        // Migrate: convert title (text) → json array using existing typewriter_texts if populated
        // Use SQLite-compatible syntax (no JSON_LENGTH, JSON_ARRAY, JSON_OBJECT)
        $driver = DB::connection()->getDriverName();
        if ($driver === 'sqlite') {
            DB::statement("
                UPDATE hero_settings
                SET title = CASE
                    WHEN typewriter_texts IS NOT NULL
                      AND json_valid(typewriter_texts)
                    THEN typewriter_texts
                    ELSE json('[{\"text\":\"' || replace(coalesce(title,''), '\"', '\\\"') || '\",\"twoLines\":true}]')
                END
                WHERE json_valid(title) = 0 OR title IS NULL
            ");
        } else {
            DB::statement("
                UPDATE hero_settings
                SET title = CASE
                    WHEN typewriter_texts IS NOT NULL
                      AND JSON_VALID(typewriter_texts)
                      AND JSON_LENGTH(typewriter_texts) > 0
                    THEN typewriter_texts
                    ELSE JSON_ARRAY(JSON_OBJECT('text', title, 'twoLines', TRUE))
                END
                WHERE JSON_VALID(title) = 0 OR title IS NULL
            ");
        }

        // Change title column from text to json
        Schema::table('hero_settings', function (Blueprint $table) {
            $table->json('title')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('hero_settings', function (Blueprint $table) {
            $table->text('title')->nullable()->change();
            $table->dropColumn([
                'background_image_url', 'background_video_url',
                'show_primary_button', 'show_secondary_button',
                'title_alignment', 'subtitle_alignment',
                'hero_height', 'content_max_width',
            ]);
        });
    }
};
