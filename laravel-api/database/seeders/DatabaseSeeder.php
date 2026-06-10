<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            StaffUsersSeeder::class,
            ClubsSeeder::class,
            EventsSeeder::class,
            CmsSeeder::class,
            DiscoverPageSeeder::class,
        ]);
    }
}
