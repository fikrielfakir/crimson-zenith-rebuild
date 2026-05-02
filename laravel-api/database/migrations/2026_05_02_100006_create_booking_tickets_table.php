<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('booking_tickets')) return;
        Schema::create('booking_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference', 50)->unique();
            $table->string('event_id', 255);
            $table->string('user_id', 255)->nullable();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone', 50)->nullable();
            $table->integer('number_of_participants')->default(1);
            $table->timestamp('event_date');
            $table->decimal('total_price', 10, 2);
            $table->string('payment_status', 20)->default('pending');
            $table->string('payment_method', 50)->nullable();
            $table->string('transaction_id')->nullable();
            $table->text('special_requests')->nullable();
            $table->string('status', 20)->default('pending');
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_tickets');
    }
};
