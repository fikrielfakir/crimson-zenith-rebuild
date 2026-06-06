<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Fix sessions.user_id column type on production MySQL.
     *
     * The production table was imported with user_id BIGINT but users have
     * UUID primary keys (varchar 36). This migration alters the column so
     * HMAC-authenticated requests no longer throw a truncation 500 error.
     *
     * NOTE: Storage symlink creation has been removed from this migration.
     * Hostinger disables both exec() and symlink(). Create it via SSH:
     *   ln -s storage/app/public public/storage
     * Or use public/uploads/ for file storage (no symlink needed — see
     * ClubController::uploadImage which writes directly to public/uploads/).
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        $columns = DB::select("SHOW COLUMNS FROM sessions WHERE Field = 'user_id'");
        if (empty($columns)) {
            return;
        }

        $type = strtolower($columns[0]->Type ?? '');
        if (str_contains($type, 'int')) {
            DB::statement('ALTER TABLE sessions MODIFY COLUMN user_id VARCHAR(255) NULL');
        }
    }

    public function down(): void
    {
        // No destructive rollback.
    }
};
