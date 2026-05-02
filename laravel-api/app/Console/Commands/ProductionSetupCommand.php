<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ProductionSetupCommand extends Command
{
    protected $signature   = 'app:production-setup';
    protected $description = 'Run all one-time production setup tasks: fix sessions table, create storage symlink, clear caches.';

    public function handle(): int
    {
        $this->info('=== The Journey Association — Production Setup ===');

        // 1. Fix sessions.user_id column type
        $this->info('1. Checking sessions.user_id column type...');
        try {
            if (DB::getDriverName() === 'mysql') {
                $columns = DB::select("SHOW COLUMNS FROM sessions WHERE Field = 'user_id'");
                if (!empty($columns)) {
                    $type = strtolower($columns[0]->Type ?? '');
                    if (str_contains($type, 'int')) {
                        DB::statement('ALTER TABLE sessions MODIFY COLUMN user_id VARCHAR(255) NULL');
                        $this->info('   ✓ Altered sessions.user_id from INT to VARCHAR(255)');
                    } else {
                        $this->info("   ✓ Already correct type: {$type}");
                    }
                } else {
                    $this->warn('   ! sessions table not found — run migrations first');
                }
            } else {
                $this->info('   ✓ Non-MySQL driver — no fix needed');
            }
        } catch (\Throwable $e) {
            $this->error('   ✗ sessions fix failed: ' . $e->getMessage());
        }

        // 2. Storage symlink — use PHP native symlink() instead of
        //    Artisan storage:link which calls exec() (disabled on Hostinger).
        $this->info('2. Creating storage symlink...');
        $target = storage_path('app/public');
        $link   = public_path('storage');

        if (file_exists($link) || is_link($link)) {
            $this->info('   ✓ public/storage already exists');
        } else {
            if (symlink($target, $link)) {
                $this->info('   ✓ Symlink created: public/storage → storage/app/public');
            } else {
                $this->error('   ✗ symlink() failed — check directory permissions');
            }
        }

        // 3. Clear all caches
        $this->info('3. Clearing caches...');
        $this->call('config:clear');
        $this->call('cache:clear');
        $this->call('route:clear');
        $this->call('view:clear');
        $this->info('   ✓ All caches cleared');

        // 4. Run pending migrations
        $this->info('4. Running pending migrations...');
        $this->call('migrate', ['--force' => true]);
        $this->info('   ✓ Migrations complete');

        $this->newLine();
        $this->info('=== Setup complete! ===');

        return Command::SUCCESS;
    }
}
