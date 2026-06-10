<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasColumn('clubs', 'hero_image')) return;
        Schema::table('clubs', function (Blueprint $table) {
            $table->string('hero_image', 500)->nullable()->after('image');
        });
    }

    public function down(): void
    {
        if (!Schema::hasColumn('clubs', 'hero_image')) return;
        Schema::table('clubs', function (Blueprint $table) {
            $table->dropColumn('hero_image');
        });
    }
};
