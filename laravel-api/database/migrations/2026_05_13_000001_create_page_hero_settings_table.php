<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('page_hero_settings')) {
            Schema::create('page_hero_settings', function (Blueprint $table) {
                $table->string('page_key', 50)->primary();
                $table->string('background_type', 20)->default('image');
                $table->text('background_image_url')->nullable();
                $table->text('background_video_url')->nullable();
                $table->unsignedTinyInteger('overlay_opacity')->default(50);
                $table->string('title', 500)->nullable();
                $table->text('subtitle')->nullable();
                $table->string('updated_by', 255)->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('page_hero_settings');
    }
};
