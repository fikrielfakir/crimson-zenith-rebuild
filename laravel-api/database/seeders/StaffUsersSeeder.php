<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StaffUsersSeeder extends Seeder
{
    private const STAFF = [
        [
            'username'   => 'moderator',
            'email'      => 'moderator@journey.ma',
            'password'   => 'moderator123',
            'name'       => 'Sarah Alami',
            'first_name' => 'Sarah',
            'last_name'  => 'Alami',
            'role'       => 'moderator',
            'is_admin'   => false,
        ],
        [
            'username'   => 'clubmanager',
            'email'      => 'clubmanager@journey.ma',
            'password'   => 'clubmanager123',
            'name'       => 'Youssef Bennani',
            'first_name' => 'Youssef',
            'last_name'  => 'Bennani',
            'role'       => 'club_manager',
            'is_admin'   => false,
        ],
        [
            'username'   => 'eventorg',
            'email'      => 'eventorg@journey.ma',
            'password'   => 'eventorg123',
            'name'       => 'Fatima Zahra',
            'first_name' => 'Fatima',
            'last_name'  => 'Zahra',
            'role'       => 'event_organizer',
            'is_admin'   => false,
        ],
    ];

    public function run(): void
    {
        foreach (self::STAFF as $staff) {
            if (!User::where('username', $staff['username'])->exists()) {
                User::create([
                    'id'         => Str::uuid(),
                    'username'   => $staff['username'],
                    'email'      => $staff['email'],
                    'password'   => Hash::make($staff['password']),
                    'name'       => $staff['name'],
                    'first_name' => $staff['first_name'],
                    'last_name'  => $staff['last_name'],
                    'role'       => $staff['role'],
                    'is_admin'   => $staff['is_admin'],
                    'is_active'  => true,
                    'interests'  => [],
                ]);
                $this->command->info("Created: {$staff['username']} ({$staff['role']})");
            } else {
                User::where('username', $staff['username'])->update([
                    'name'     => $staff['name'],
                    'role'     => $staff['role'],
                    'is_admin' => $staff['is_admin'],
                ]);
                $this->command->info("Updated role for: {$staff['username']}");
            }
        }
    }
}
