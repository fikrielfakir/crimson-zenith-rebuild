<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/**
 * The original personal_access_tokens migration used morphs('tokenable')
 * which creates tokenable_id as bigint unsigned.  Our User model uses
 * UUID string primary keys, so we must widen the column to varchar(36).
 */
return new class extends Migration
{
    public function up(): void
    {
        // Only run if the table exists but tokenable_id is still a numeric type
        if (!Schema::hasTable('personal_access_tokens')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            // SQLite does not support ALTER COLUMN — recreate the table
            Schema::drop('personal_access_tokens');
            Schema::create('personal_access_tokens', function (Blueprint $table) {
                $table->id();
                $table->uuidMorphs('tokenable');
                $table->text('name');
                $table->string('token', 64)->unique();
                $table->text('abilities')->nullable();
                $table->timestamp('last_used_at')->nullable();
                $table->timestamp('expires_at')->nullable()->index();
                $table->timestamps();
            });
        } else {
            // MySQL / PostgreSQL — alter in-place
            Schema::table('personal_access_tokens', function (Blueprint $table) use ($driver) {
                if ($driver === 'pgsql') {
                    $table->string('tokenable_id', 36)->change();
                } else {
                    // MySQL: also update the index
                    DB::statement('ALTER TABLE personal_access_tokens MODIFY COLUMN tokenable_id varchar(36) NOT NULL');
                }
            });
        }
    }

    public function down(): void
    {
        // Not reversible without data loss — leave as-is on rollback
    }
};
