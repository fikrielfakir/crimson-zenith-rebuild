<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('booking_events')) return;
        Schema::create('booking_events', function (Blueprint $table) {
            $table->string('id', 255)->primary();
            $table->unsignedBigInteger('club_id')->nullable();
            $table->boolean('is_association_event')->default(false);
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('description');
            $table->string('location');
            $table->string('location_details')->nullable();
            $table->decimal('latitude', 9, 6)->nullable();
            $table->decimal('longitude', 9, 6)->nullable();
            $table->string('duration', 100)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamp('event_date')->nullable();
            $table->integer('price');
            $table->integer('original_price')->nullable();
            $table->integer('rating')->default(5);
            $table->integer('review_count')->default(0);
            $table->string('category', 100)->nullable();
            $table->json('languages')->default('["English"]');
            $table->string('age_range', 100)->nullable();
            $table->integer('min_age')->nullable();
            $table->string('group_size', 100)->nullable();
            $table->integer('max_people')->nullable();
            $table->integer('max_participants')->nullable();
            $table->integer('current_participants')->default(0);
            $table->text('cancellation_policy')->nullable();
            $table->json('images')->default('[]');
            $table->string('image', 500)->nullable();
            $table->json('highlights')->default('[]');
            $table->json('included')->default('[]');
            $table->json('not_included')->default('[]');
            $table->json('schedule')->default('[]');
            $table->text('important_info')->nullable();
            $table->string('status', 20)->default('upcoming');
            $table->boolean('is_active')->default(true);
            $table->string('created_by', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_events');
    }
};
