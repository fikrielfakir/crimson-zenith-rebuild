<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('about_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('about_settings', 'who_we_are_title')) {
                $table->string('who_we_are_title')->nullable();
            }
            if (!Schema::hasColumn('about_settings', 'who_we_are_paragraph2')) {
                $table->text('who_we_are_paragraph2')->nullable();
            }
            if (!Schema::hasColumn('about_settings', 'values_title')) {
                $table->string('values_title')->nullable();
            }
            if (!Schema::hasColumn('about_settings', 'cta_title')) {
                $table->string('cta_title')->nullable();
            }
            if (!Schema::hasColumn('about_settings', 'cta_description')) {
                $table->text('cta_description')->nullable();
            }
            if (!Schema::hasColumn('about_settings', 'translations')) {
                $table->longText('translations')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('about_settings', function (Blueprint $table) {
            $table->dropColumn([
                'who_we_are_title',
                'who_we_are_paragraph2',
                'values_title',
                'cta_title',
                'cta_description',
                'translations',
            ]);
        });
    }
};
