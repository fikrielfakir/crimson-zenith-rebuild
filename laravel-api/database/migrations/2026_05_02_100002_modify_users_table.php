<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->string('id', 255)->primary();
                $table->string('username', 255)->unique()->nullable();
                $table->string('password', 255)->nullable();
                $table->string('email', 255)->unique()->nullable();
                $table->string('first_name', 255)->nullable();
                $table->string('last_name', 255)->nullable();
                $table->string('profile_image_url', 500)->nullable();
                $table->text('bio')->nullable();
                $table->string('phone', 50)->nullable();
                $table->string('location', 255)->nullable();
                $table->json('interests')->default('[]');
                $table->string('role', 20)->default('user');
                $table->boolean('is_admin')->default(false);
                $table->boolean('is_active')->default(true);
                $table->boolean('email_verified')->default(false);
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        } else {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'role')) $table->string('role', 20)->default('user')->after('interests');
                if (!Schema::hasColumn('users', 'is_active')) $table->boolean('is_active')->default(true);
                if (!Schema::hasColumn('users', 'email_verified')) $table->boolean('email_verified')->default(false);
            });
        }
    }

    public function down(): void {}
};
