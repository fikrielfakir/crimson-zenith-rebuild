<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        if (!User::where('username', 'admin')->exists()) {
            User::create([
                'id'         => Str::uuid(),
                'username'   => 'admin',
                'email'      => 'admin@morocclubs.com',
                'password'   => Hash::make('admin123'),
                'first_name' => 'Admin',
                'last_name'  => 'User',
                'role'       => 'admin',
                'is_admin'   => true,
                'is_active'  => true,
                'interests'  => [],
            ]);
            $this->command->info('Admin user created.');
        } else {
            $this->command->info('Admin user already exists.');
        }
    }
}
