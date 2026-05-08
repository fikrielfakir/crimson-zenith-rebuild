<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('payment_settings')) {
            Schema::create('payment_settings', function (Blueprint $table) {
                $table->string('id', 255)->primary()->default('default');

                // Global toggles
                $table->boolean('cmi_enabled')->default(false);
                $table->boolean('cash_enabled')->default(true);

                // CMI credentials
                $table->string('cmi_merchant_id', 255)->nullable();
                $table->text('cmi_store_key')->nullable();
                $table->string('cmi_gateway_url', 500)->default('https://testpayment.cmi.co.ma/fim/est3Dgate');
                $table->string('cmi_currency', 10)->default('504');
                $table->string('cmi_mode', 10)->default('test');

                // CMI callback / redirect URLs (admin can override)
                $table->string('cmi_ok_url', 500)->nullable();
                $table->string('cmi_fail_url', 500)->nullable();
                $table->string('cmi_callback_url', 500)->nullable();

                // Stripe (kept for future use)
                $table->boolean('stripe_enabled')->default(false);
                $table->text('stripe_publishable_key')->nullable();
                $table->text('stripe_secret_key')->nullable();
                $table->string('stripe_mode', 10)->default('test');

                $table->string('updated_by', 255)->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_settings');
    }
};
