<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('clubs_page_settings')) {
            Schema::create('clubs_page_settings', function (Blueprint $table) {
                $table->string('id')->primary()->default('default');
                $table->string('intro_heading')->nullable();
                $table->text('intro_description')->nullable();
                $table->string('cta_heading')->nullable();
                $table->text('cta_description')->nullable();
                $table->string('cta_button_text')->nullable();
                $table->string('cta_button_link')->nullable();
                $table->unsignedBigInteger('updated_by')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('clubs_page_settings');
    }
};
