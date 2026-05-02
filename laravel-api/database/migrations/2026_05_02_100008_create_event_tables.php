<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('event_participants')) {
            Schema::create('event_participants', function (Blueprint $table) {
                $table->id();
                $table->string('event_id', 255);
                $table->string('user_id', 255);
                $table->timestamp('registered_at')->useCurrent();
                $table->boolean('attended')->default(false);
            });
        }

        if (!Schema::hasTable('events_clubs')) {
            Schema::create('events_clubs', function (Blueprint $table) {
                $table->id();
                $table->string('event_id', 255);
                $table->unsignedBigInteger('club_id');
                $table->boolean('is_primary_club')->default(false);
                $table->timestamp('created_at')->useCurrent();
            });
        }

        if (!Schema::hasTable('event_gallery')) {
            Schema::create('event_gallery', function (Blueprint $table) {
                $table->id();
                $table->string('event_id', 255);
                $table->string('image_url', 500);
                $table->integer('sort_order')->default(0);
                $table->timestamp('created_at')->useCurrent();
            });
        }

        if (!Schema::hasTable('event_schedule')) {
            Schema::create('event_schedule', function (Blueprint $table) {
                $table->id();
                $table->string('event_id', 255);
                $table->integer('day_number');
                $table->string('title')->nullable();
                $table->text('description')->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
        }

        if (!Schema::hasTable('event_reviews')) {
            Schema::create('event_reviews', function (Blueprint $table) {
                $table->id();
                $table->string('event_id', 255);
                $table->string('user_name')->nullable();
                $table->integer('rating');
                $table->text('review')->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
        }

        if (!Schema::hasTable('event_prices')) {
            Schema::create('event_prices', function (Blueprint $table) {
                $table->id();
                $table->string('event_id', 255);
                $table->integer('travelers');
                $table->decimal('price_per_person', 10, 2);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('event_prices');
        Schema::dropIfExists('event_reviews');
        Schema::dropIfExists('event_schedule');
        Schema::dropIfExists('event_gallery');
        Schema::dropIfExists('events_clubs');
        Schema::dropIfExists('event_participants');
    }
};
