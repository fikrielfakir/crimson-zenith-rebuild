<?php

namespace Database\Seeders;

use App\Models\BookingEvent;
use Illuminate\Database\Seeder;

class EventsSeeder extends Seeder
{
    public function run(): void
    {
        if (BookingEvent::count() > 0) {
            $this->command->info('Events already seeded.');
            return;
        }

        $events = [
            [
                'id'                  => 'atlas-trek-3day',
                'title'               => '3-Day Atlas Mountains Trek',
                'subtitle'            => 'Discover the majestic peaks and Berber villages',
                'description'         => 'Embark on an unforgettable 3-day journey through the Atlas Mountains.',
                'location'            => 'Atlas Mountains, Morocco',
                'latitude'            => 31.2578,
                'longitude'           => -7.9928,
                'duration'            => '3 Days / 2 Nights',
                'start_date'          => '2024-12-15',
                'end_date'            => '2025-03-30',
                'price'               => 299,
                'original_price'      => 399,
                'rating'              => 5,
                'review_count'        => 127,
                'category'            => 'Mountain Trek',
                'languages'           => ['English', 'French', 'Arabic'],
                'age_range'           => '12-65 years',
                'group_size'          => 'Max 12 people',
                'cancellation_policy' => 'Free cancellation up to 48 hours before departure',
                'images'              => [],
                'highlights'          => ['Trek through stunning mountain valleys', 'Visit authentic Berber villages'],
                'included'            => ['Professional mountain guide', 'All meals during the trek'],
                'not_included'        => ['Personal travel insurance', 'Tips for guides'],
                'schedule'            => [['time' => 'Day 1', 'activity' => 'Depart Marrakech at 8am']],
                'is_active'           => true,
                'is_association_event'=> true,
            ],
            [
                'id'                  => 'sahara-desert-adventure',
                'title'               => 'Sahara Desert Adventure',
                'subtitle'            => 'Sleep under the stars in the Moroccan Sahara',
                'description'         => 'Experience the magic of the Sahara Desert on this 2-day adventure.',
                'location'            => 'Merzouga, Sahara Desert',
                'latitude'            => 31.0801,
                'longitude'           => -4.0133,
                'duration'            => '2 Days / 1 Night',
                'start_date'          => '2024-12-01',
                'end_date'            => '2025-04-30',
                'price'               => 199,
                'original_price'      => 279,
                'rating'              => 5,
                'review_count'        => 243,
                'category'            => 'Desert Experience',
                'languages'           => ['English', 'French', 'Spanish'],
                'age_range'           => '8-80 years',
                'group_size'          => 'Max 15 people',
                'cancellation_policy' => 'Free cancellation up to 24 hours before departure',
                'images'              => [],
                'highlights'          => ['Camel trek across sand dunes', 'Spectacular sunset and sunrise views'],
                'included'            => ['Camel ride to and from camp', 'Dinner and breakfast'],
                'not_included'        => ['Transport to Merzouga', 'Lunch'],
                'schedule'            => [['time' => '4:00 PM', 'activity' => 'Meet at Merzouga, camel trek begins']],
                'is_active'           => true,
                'is_association_event'=> true,
            ],
            [
                'id'                  => 'coastal-surf-camp',
                'title'               => 'Atlantic Coast Surf Camp',
                'subtitle'            => "Learn to surf in Morocco's best waves",
                'description'         => "Join our 5-day surf camp on Morocco's stunning Atlantic coast.",
                'location'            => 'Essaouira, Atlantic Coast',
                'latitude'            => 31.5084,
                'longitude'           => -9.7595,
                'duration'            => '5 Days / 4 Nights',
                'start_date'          => '2024-12-10',
                'end_date'            => '2025-05-31',
                'price'               => 449,
                'original_price'      => 599,
                'rating'              => 5,
                'review_count'        => 89,
                'category'            => 'Water Sports',
                'languages'           => ['English', 'French'],
                'age_range'           => '14-50 years',
                'group_size'          => 'Max 8 people',
                'cancellation_policy' => 'Free cancellation up to 7 days before start date',
                'images'              => [],
                'highlights'          => ['Daily professional surf coaching', 'Beachfront accommodation'],
                'included'            => ['4 nights beachfront accommodation', 'Daily surf lessons (2 hours)'],
                'not_included'        => ['Lunch and dinner', 'Travel insurance'],
                'schedule'            => [['time' => '7:00 AM', 'activity' => 'Beach yoga session']],
                'is_active'           => true,
                'is_association_event'=> true,
            ],
        ];

        foreach ($events as $event) {
            BookingEvent::create($event);
        }

        $this->command->info('Events seeded.');
    }
}
