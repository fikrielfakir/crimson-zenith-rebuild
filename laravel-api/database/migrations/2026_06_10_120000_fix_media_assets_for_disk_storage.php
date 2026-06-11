<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('media_assets')) {
            Schema::create('media_assets', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('file_name', 500)->default('');
                $table->string('file_type', 100)->default('application/octet-stream');
                $table->string('file_url', 1000)->default('');
                $table->string('thumbnail_url', 1000)->nullable();
                $table->string('alt_text', 500)->nullable();
                $table->string('alt', 500)->nullable();
                $table->text('url')->nullable();
                $table->unsignedBigInteger('file_size')->nullable();
                $table->json('focal_point')->nullable();
                $table->json('metadata')->nullable();
                $table->string('uploaded_by', 255)->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
            return;
        }

        Schema::table('media_assets', function (Blueprint $table) {
            if (!Schema::hasColumn('media_assets', 'url')) {
                $table->text('url')->nullable()->after('file_url');
            }
            if (!Schema::hasColumn('media_assets', 'alt')) {
                $table->string('alt', 500)->nullable()->after('alt_text');
            }
            if (!Schema::hasColumn('media_assets', 'file_size')) {
                $table->unsignedBigInteger('file_size')->nullable()->after('file_type');
            }
            if (!Schema::hasColumn('media_assets', 'metadata')) {
                $table->json('metadata')->nullable()->after('focal_point');
            }
        });
    }

    public function down(): void {}
};
