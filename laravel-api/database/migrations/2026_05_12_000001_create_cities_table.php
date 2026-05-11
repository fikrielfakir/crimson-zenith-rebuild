<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('cities')) {
            Schema::create('cities', function (Blueprint $table) {
                $table->id();
                $table->string('name', 255);
                $table->string('slug', 255)->unique();
                $table->string('title', 500)->nullable();
                $table->text('description')->nullable();
                $table->text('image')->nullable();
                $table->json('highlights')->default('[]');
                $table->json('culture')->nullable();
                $table->json('cuisine')->nullable();
                $table->json('activities')->default('[]');
                $table->json('best_time')->nullable();
                $table->json('getting_there')->nullable();
                $table->json('travel_tips')->default('[]');
                $table->boolean('is_active')->default(true);
                $table->integer('ordering')->default(0);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
