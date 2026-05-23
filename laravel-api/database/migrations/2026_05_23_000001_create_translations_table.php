<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('translations')) {
            Schema::create('translations', function (Blueprint $table) {
                $table->id();
                $table->string('entity_type', 100);
                $table->string('entity_id', 255);
                $table->string('field', 100);
                $table->string('language', 10);
                $table->text('value');
                $table->timestamps();

                $table->unique(['entity_type', 'entity_id', 'field', 'language'], 'translations_unique');
                $table->index(['entity_type', 'language']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
