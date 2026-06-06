<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ProductionSetupCommand extends Command
{
    protected $signature   = 'app:production-setup';
    protected $description = 'Run all one-time production setup tasks: fix sessions table, clear caches, run migrations.';

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

        // 2. Storage symlink status
        $this->info('2. Checking storage symlink...');
        $link = public_path('storage');
        if (file_exists($link) || is_link($link)) {
            $this->info('   ✓ public/storage already exists');
        } else {
            $this->warn('   ! public/storage symlink missing.');
            $this->warn('     Hostinger disables exec() and symlink().');
            $this->warn('     Create it manually via SSH:');
            $this->warn('       ln -s storage/app/public public/storage');
            $this->warn('     Or skip it — image uploads now use public/uploads/ directly.');
        }

        // 3. Ensure public/uploads directory exists (no symlink needed)
        $this->info('3. Ensuring public/uploads/ directory exists...');
        $uploadsDir = public_path('uploads');
        if (!is_dir($uploadsDir)) {
            if (mkdir($uploadsDir, 0755, true)) {
                $this->info('   ✓ Created public/uploads/');
            } else {
                $this->error('   ✗ Could not create public/uploads/ — check permissions');
            }
        } else {
            $this->info('   ✓ public/uploads/ already exists');
        }

        // 4. Clear all caches
        $this->info('4. Clearing caches...');
        $this->call('config:clear');
        $this->call('cache:clear');
        $this->call('route:clear');
        $this->call('view:clear');
        $this->info('   ✓ All caches cleared');

        // 5. Run pending migrations
        $this->info('5. Running pending migrations...');
        $this->call('migrate', ['--force' => true]);
        $this->info('   ✓ Migrations complete');

        $this->newLine();
        $this->info('=== Setup complete! ===');

        return Command::SUCCESS;
    }
}
