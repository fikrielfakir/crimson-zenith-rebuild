<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Fix sessions.user_id column type on production MySQL.
     *
     * The production table was imported with user_id BIGINT, but users have
     * UUID primary keys (varchar 36). This migration alters the column to
     * varchar(255) so HMAC-authenticated requests no longer throw a
     * "Data truncated for column 'user_id'" 500 error.
     *
     * Also creates the public/storage symlink using PHP's native symlink()
     * instead of Artisan storage:link — Hostinger disables exec() so the
     * Artisan command fails with "Call to undefined function exec()".
     */
    public function up(): void
    {
        // 1. Fix sessions.user_id column type
        if (DB::getDriverName() === 'mysql') {
            $columns = DB::select("SHOW COLUMNS FROM sessions WHERE Field = 'user_id'");
            if (!empty($columns)) {
                $type = strtolower($columns[0]->Type ?? '');
                if (str_contains($type, 'int')) {
                    DB::statement('ALTER TABLE sessions MODIFY COLUMN user_id VARCHAR(255) NULL');
                }
            }
        }

        // 2. Create storage symlink without exec().
        //    symlink() is a native PHP function — no shell access needed.
        $target = storage_path('app/public');
        $link   = public_path('storage');

        if (!file_exists($link) && !is_link($link)) {
            symlink($target, $link);
        }
    }

    public function down(): void
    {
        // No destructive rollback.
    }
};
