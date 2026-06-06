<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add image_url to focus_items
        if (Schema::hasTable('focus_items') && !Schema::hasColumn('focus_items', 'image_url')) {
            Schema::table('focus_items', function (Blueprint $table) {
                $table->string('image_url', 1000)->nullable()->after('media_id');
            });
        }

        // Create focus_section_settings table
        if (!Schema::hasTable('focus_section_settings')) {
            Schema::create('focus_section_settings', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->string('title')->default('Our Focus');
                $table->string('subtitle')->nullable();
                $table->boolean('is_active')->default(true);
                $table->string('updated_by', 100)->nullable();
            });

            // Insert default record
            \DB::table('focus_section_settings')->insert([
                'id'       => 'default',
                'title'    => 'Our Focus',
                'subtitle' => 'Tourism, Culture, Entertainment',
            ]);
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('focus_items') && Schema::hasColumn('focus_items', 'image_url')) {
            Schema::table('focus_items', function (Blueprint $table) {
                $table->dropColumn('image_url');
            });
        }
        Schema::dropIfExists('focus_section_settings');
    }
};
