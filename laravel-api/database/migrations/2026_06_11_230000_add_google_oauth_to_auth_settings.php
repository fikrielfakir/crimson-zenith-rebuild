<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('auth_settings')) {
            return;
        }

        Schema::table('auth_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('auth_settings', 'google_oauth_enabled')) {
                $table->boolean('google_oauth_enabled')->default(false)->after('max_login_attempts');
            }
            if (!Schema::hasColumn('auth_settings', 'google_client_id')) {
                $table->string('google_client_id')->nullable()->after('google_oauth_enabled');
            }
            if (!Schema::hasColumn('auth_settings', 'google_client_secret')) {
                $table->text('google_client_secret')->nullable()->after('google_client_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('auth_settings', function (Blueprint $table) {
            $table->dropColumn(['google_oauth_enabled', 'google_client_id', 'google_client_secret']);
        });
    }
};
