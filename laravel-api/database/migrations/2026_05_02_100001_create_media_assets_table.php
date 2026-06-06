<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('media_assets')) return;
        Schema::create('media_assets', function (Blueprint $table) {
            $table->id();
            $table->string('file_name');
            $table->string('file_type', 50);
            $table->string('file_url', 1000);
            $table->string('thumbnail_url', 1000)->nullable();
            $table->string('alt_text', 500)->nullable();
            $table->json('focal_point')->nullable();
            $table->json('metadata')->default('{}');
            $table->string('uploaded_by', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_assets');
    }
};
