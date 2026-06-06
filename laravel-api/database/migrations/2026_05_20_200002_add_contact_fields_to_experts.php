<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('experts', function (Blueprint $table) {
            if (!Schema::hasColumn('experts', 'linkedin_url')) {
                $table->string('linkedin_url')->nullable()->after('image');
            }
            if (!Schema::hasColumn('experts', 'contact_email')) {
                $table->string('contact_email')->nullable()->after('linkedin_url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('experts', function (Blueprint $table) {
            $table->dropColumn(['linkedin_url', 'contact_email']);
        });
    }
};
