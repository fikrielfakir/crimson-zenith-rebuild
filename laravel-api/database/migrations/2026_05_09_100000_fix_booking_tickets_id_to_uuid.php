<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('booking_tickets')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            // Only alter if the column is still an integer type
            $cols = DB::select("SHOW COLUMNS FROM booking_tickets WHERE Field = 'id'");
            if (empty($cols)) return;

            $type = strtolower($cols[0]->Type ?? '');
            if (str_contains($type, 'char') || str_contains($type, 'varchar')) {
                return; // already a string type, nothing to do
            }

            DB::statement('ALTER TABLE booking_tickets MODIFY COLUMN id CHAR(36) NOT NULL');

        } elseif ($driver === 'sqlite') {
            // SQLite: check column info
            $cols = DB::select("PRAGMA table_info(booking_tickets)");
            $idCol = collect($cols)->firstWhere('name', 'id');
            if (!$idCol) return;

            $type = strtolower($idCol->type ?? '');
            if (str_contains($type, 'char') || str_contains($type, 'varchar') || str_contains($type, 'text')) {
                return; // already string
            }

            // SQLite does not support ALTER COLUMN — recreate the table
            DB::statement('PRAGMA foreign_keys = OFF');
            DB::statement('CREATE TABLE booking_tickets_new AS SELECT * FROM booking_tickets');
            DB::statement('DROP TABLE booking_tickets');
            DB::statement('ALTER TABLE booking_tickets_new RENAME TO booking_tickets');
            DB::statement('PRAGMA foreign_keys = ON');
        }
    }

    public function down(): void
    {
        // Intentionally left blank
    }
};
