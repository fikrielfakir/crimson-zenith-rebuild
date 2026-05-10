<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('payment_settings') && !Schema::hasColumn('payment_settings', 'demo_mode')) {
            Schema::table('payment_settings', function (Blueprint $table) {
                $table->boolean('demo_mode')->default(false)->after('cmi_mode');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('payment_settings', 'demo_mode')) {
            Schema::table('payment_settings', function (Blueprint $table) {
                $table->dropColumn('demo_mode');
            });
        }
    }
};
