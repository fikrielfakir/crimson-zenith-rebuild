<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fix sessions.user_id column type on production MySQL.
     *
     * The production table was imported with user_id BIGINT, but users have
     * UUID primary keys (varchar 36). This migration alters the column to
     * varchar(255) so HMAC-authenticated requests no longer throw a
     * "Data truncated for column 'user_id'" 500 error.
     */
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            // Alter the column only if it is currently an integer type.
            $columns = DB::select("SHOW COLUMNS FROM sessions WHERE Field = 'user_id'");
            if (!empty($columns)) {
                $type = strtolower($columns[0]->Type ?? '');
                if (str_contains($type, 'int')) {
                    DB::statement('ALTER TABLE sessions MODIFY COLUMN user_id VARCHAR(255) NULL');
                }
            }
        }

        // Ensure the storage symlink exists (safe to run multiple times).
        if (!file_exists(public_path('storage'))) {
            \Artisan::call('storage:link');
        }
    }

    public function down(): void
    {
        // No destructive rollback — leave the varchar column in place.
    }
};
