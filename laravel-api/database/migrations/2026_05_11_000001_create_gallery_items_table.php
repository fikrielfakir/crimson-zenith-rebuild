<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('gallery_items')) {
            Schema::create('gallery_items', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('location')->nullable();
                $table->string('category')->nullable();
                $table->string('photographer')->nullable();
                $table->text('description')->nullable();
                $table->string('image_url', 2000);
                $table->boolean('is_featured')->default(false);
                $table->integer('sort_order')->default(0);
                $table->string('aspect')->default('landscape');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
    }
};
