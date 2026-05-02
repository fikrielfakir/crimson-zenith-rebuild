<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('club_gallery')) {
            Schema::create('club_gallery', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('club_id');
                $table->string('image_url', 500);
                $table->string('caption')->nullable();
                $table->string('uploaded_by', 255)->nullable();
                $table->timestamp('uploaded_at')->useCurrent();
            });
        }

        if (!Schema::hasTable('club_reviews')) {
            Schema::create('club_reviews', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('club_id');
                $table->string('user_id', 255);
                $table->integer('rating');
                $table->text('comment')->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('club_reviews');
        Schema::dropIfExists('club_gallery');
    }
};
