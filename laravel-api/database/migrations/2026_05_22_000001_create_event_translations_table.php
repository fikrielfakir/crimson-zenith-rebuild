<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('event_translations')) return;
        Schema::create('event_translations', function (Blueprint $table) {
            $table->id();
            $table->string('event_id', 255);
            $table->string('locale', 10);
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->string('location_details')->nullable();
            $table->json('highlights')->nullable();
            $table->json('included')->nullable();
            $table->json('not_included')->nullable();
            $table->text('important_info')->nullable();
            $table->timestamps();
            $table->unique(['event_id', 'locale']);
            $table->foreign('event_id')
                  ->references('id')
                  ->on('booking_events')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_translations');
    }
};
