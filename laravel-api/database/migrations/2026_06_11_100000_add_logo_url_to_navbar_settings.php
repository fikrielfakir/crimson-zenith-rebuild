<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('navbar_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('navbar_settings', 'logo_url')) {
                $table->text('logo_url')->nullable()->after('logo_image_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('navbar_settings', function (Blueprint $table) {
            $table->dropColumn('logo_url');
        });
    }
};
