<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('users')) {
            // Fresh install — create our full users table
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
                $table->json('interests')->nullable();
                $table->string('role', 20)->default('user');
                $table->boolean('is_admin')->default(false);
                $table->boolean('is_active')->default(true);
                $table->boolean('email_verified')->default(false);
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        } else {
            // Existing table — add columns that are missing, no ->after() on new columns
            // Step 1: fix the primary key if it is still a bigint auto-increment
            $idType = DB::select("SELECT DATA_TYPE FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME   = 'users'
                  AND COLUMN_NAME  = 'id' LIMIT 1");

            if (!empty($idType) && $idType[0]->DATA_TYPE === 'bigint') {
                // Remove auto-increment, change type to varchar, re-set as PK
                DB::statement('ALTER TABLE `users` MODIFY `id` VARCHAR(255) NOT NULL');
            }

            Schema::table('users', function (Blueprint $table) {
                // Add all custom columns that the default Laravel users table is missing
                // NOTE: no ->after() on any column — avoids "column not found" errors
                if (!Schema::hasColumn('users', 'username'))
                    $table->string('username', 255)->unique()->nullable();
                if (!Schema::hasColumn('users', 'first_name'))
                    $table->string('first_name', 255)->nullable();
                if (!Schema::hasColumn('users', 'last_name'))
                    $table->string('last_name', 255)->nullable();
                if (!Schema::hasColumn('users', 'profile_image_url'))
                    $table->string('profile_image_url', 500)->nullable();
                if (!Schema::hasColumn('users', 'bio'))
                    $table->text('bio')->nullable();
                if (!Schema::hasColumn('users', 'phone'))
                    $table->string('phone', 50)->nullable();
                if (!Schema::hasColumn('users', 'location'))
                    $table->string('location', 255)->nullable();
                if (!Schema::hasColumn('users', 'interests'))
                    $table->json('interests')->nullable();
                if (!Schema::hasColumn('users', 'role'))
                    $table->string('role', 20)->default('user');
                if (!Schema::hasColumn('users', 'is_admin'))
                    $table->boolean('is_admin')->default(false);
                if (!Schema::hasColumn('users', 'is_active'))
                    $table->boolean('is_active')->default(true);
                if (!Schema::hasColumn('users', 'email_verified'))
                    $table->boolean('email_verified')->default(false);
            });
        }
    }

    public function down(): void {}
};
