<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('auth_settings', function (Blueprint $table) {
            $table->boolean('google_oauth_enabled')->default(false)->after('max_login_attempts');
            $table->string('google_client_id')->nullable()->after('google_oauth_enabled');
            $table->text('google_client_secret')->nullable()->after('google_client_id');
        });
    }

    public function down(): void
    {
        Schema::table('auth_settings', function (Blueprint $table) {
            $table->dropColumn(['google_oauth_enabled', 'google_client_id', 'google_client_secret']);
        });
    }
};
