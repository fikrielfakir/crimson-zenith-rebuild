<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('gallery_items', function (Blueprint $table) {
            if (!Schema::hasColumn('gallery_items', 'panorama_url')) {
                $table->string('panorama_url', 2000)->nullable()->after('image_url');
            }
            if (!Schema::hasColumn('gallery_items', 'has_360')) {
                $table->boolean('has_360')->default(false)->after('panorama_url');
            }
            if (!Schema::hasColumn('gallery_items', 'hotspots')) {
                $table->json('hotspots')->nullable()->after('has_360');
            }
        });
    }

    public function down(): void
    {
        Schema::table('gallery_items', function (Blueprint $table) {
            $table->dropColumn(['panorama_url', 'has_360', 'hotspots']);
        });
    }
};
