<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            if (!Schema::hasColumn('cities', 'hero_type')) {
                $table->string('hero_type', 20)->default('image')->after('image');
            }
            if (!Schema::hasColumn('cities', 'hero_video')) {
                $table->text('hero_video')->nullable()->after('hero_type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            $table->dropColumn(['hero_type', 'hero_video']);
        });
    }
};
