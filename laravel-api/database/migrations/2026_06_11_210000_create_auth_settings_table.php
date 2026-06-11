<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auth_settings', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->boolean('allow_registration')->default(true);
            $table->integer('password_min_length')->default(8);
            $table->integer('session_duration_hours')->default(24);
            $table->boolean('require_email_verification')->default(false);
            $table->integer('max_login_attempts')->default(5);
            $table->string('updated_by')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auth_settings');
    }
};
