<?php

namespace Database\Seeders;

use App\Models\Club;
use Illuminate\Database\Seeder;

class ClubsSeeder extends Seeder
{
    public function run(): void
    {
        if (Club::count() > 0) {
            $this->command->info('Clubs already seeded.');
            return;
        }

        $clubs = [
            [
                'name'        => 'Ensah',
                'slug'        => 'ensah',
                'description' => 'Mountain trekking and hiking adventures',
                'location'    => 'Atlas Mountains',
                'member_count'=> 250,
                'rating'      => 5,
                'image'       => '/images/atlas-hikers.jpg',
                'features'    => ['Hiking', 'Camping', 'Photography'],
                'is_active'   => true,
            ],
            [
                'name'        => 'Desert Explorers',
                'slug'        => 'desert-explorers',
                'description' => 'Sahara expeditions and desert camping',
                'location'    => 'Sahara Desert',
                'member_count'=> 180,
                'rating'      => 5,
                'image'       => '/images/desert-explorers.jpg',
                'features'    => ['Desert Tours', 'Camping', 'Camel Rides'],
                'is_active'   => true,
            ],
            [
                'name'        => 'Coastal Adventures',
                'slug'        => 'coastal-adventures',
                'description' => 'Beach activities and water sports',
                'location'    => 'Atlantic Coast',
                'member_count'=> 320,
                'rating'      => 4,
                'image'       => '/images/coastal-adventures.jpg',
                'features'    => ['Surfing', 'Beach Volleyball', 'Swimming'],
                'is_active'   => true,
            ],
        ];

        foreach ($clubs as $club) {
            Club::create($club);
        }

        $this->command->info('Clubs seeded.');
    }
}
