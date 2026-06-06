<?php

namespace Database\Seeders;

use App\Models\DiscoverSettings;
use App\Models\City;
use Illuminate\Database\Seeder;

class DiscoverPageSeeder extends Seeder
{
    public function run(): void
    {
        // Discover page settings
        if (!DiscoverSettings::find('default')) {
            DiscoverSettings::create([
                'id'                 => 'default',
                'hero_title'         => 'Discover',
                'hero_subtitle'      => "Embark on a journey through Morocco's most enchanting destinations. From ancient medinas to coastal paradises, discover the soul of this magnificent country.",
                'hero_bg_image'      => '/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png',
                'intro_heading'      => 'Morocco, a melting pot of dynasties and cultures',
                'intro_description'  => "From the northern coastal cities touching the Mediterranean to the ancient imperial cities steeped in history, Morocco offers an incredible tapestry of experiences. Each city tells its own unique story, shaped by centuries of diverse cultural influences, from Berber traditions to Arab, Andalusian, and European heritage. Discover the soul of Morocco through its most captivating cities, where ancient medinas meet modern vitality, and every street corner reveals a new chapter in this nation's rich cultural narrative.",
                'cta_heading'        => 'Ready to Start Your Journey?',
                'cta_description'    => 'Join us to explore these magnificent cities and create unforgettable memories in Morocco.',
                'cta_button_text'    => 'JOIN THE JOURNEY',
                'cta_button_link'    => '/join-us',
            ]);
        }

        // Cities
        if (City::count() === 0) {
            $cities = [
                [
                    'name'        => 'Tangier',
                    'slug'        => 'tangier',
                    'title'       => 'Gateway Between Continents',
                    'ordering'    => 1,
                    'description' => "Tangier, Morocco's gateway between Africa and Europe, is a captivating city where cultures converge at the crossroads of the Mediterranean Sea and the Atlantic Ocean.",
                    'image'       => '/attached_assets/generated_images/Tangier_city_aerial_view_03330006.png',
                    'highlights'  => ['Historic Kasbah', 'Café Hafa', 'Strait of Gibraltar', 'American Legation Museum'],
                    'culture'     => [
                        'title'       => 'Culture & Heritage',
                        'description' => "Tangier's rich cultural tapestry reflects centuries of cross-continental exchange.",
                        'highlights'  => ['Multicultural heritage spanning three continents', 'Famous artistic community and literary history', 'Blend of Moroccan, Spanish, and French influences'],
                    ],
                    'cuisine' => [
                        'title'  => 'Local Cuisine',
                        'dishes' => [
                            ['name' => 'Fresh Seafood', 'description' => 'Mediterranean and Atlantic catch prepared with Moroccan spices'],
                            ['name' => 'Tangia',        'description' => 'Slow-cooked meat stew unique to Northern Morocco'],
                            ['name' => 'Pastilla',      'description' => 'Sweet and savory pastry with pigeon or chicken'],
                            ['name' => 'Mint Tea',      'description' => 'Traditional Moroccan tea served at legendary cafés'],
                        ],
                    ],
                    'activities' => [
                        ['name' => 'Explore the Medina',     'icon' => 'map',      'description' => 'Wander through ancient streets filled with artisan workshops'],
                        ['name' => 'Visit Hercules Caves',   'icon' => 'mountain', 'description' => 'Discover mythological caves with stunning Atlantic Ocean views'],
                        ['name' => "Relax at Café Hafa",     'icon' => 'coffee',   'description' => 'Enjoy mint tea at the legendary cliffside café'],
                        ['name' => 'Beach Activities',       'icon' => 'waves',    'description' => 'Swim, surf, or sunbathe on pristine Mediterranean beaches'],
                    ],
                    'best_time' => [
                        'season'      => 'Spring & Fall',
                        'months'      => 'April-May, September-October',
                        'description' => 'Mild temperatures and fewer crowds make these months ideal.',
                        'temperature' => '18-25°C (64-77°F)',
                    ],
                    'getting_there' => [
                        'airport'        => 'Tangier Ibn Battouta Airport (TNG)',
                        'transport'      => ['Direct flights from major European cities', 'High-speed train from Casablanca (2h 10min)', 'Ferry connections from Spain'],
                        'localTransport' => 'Taxis, rental cars, and local buses are readily available.',
                    ],
                    'travel_tips' => ['The medina is best explored on foot', 'Bargaining is expected in souks and markets', 'Learn basic French or Spanish phrases', 'Visit Café Hafa during sunset', 'Book ferry tickets in advance during peak season'],
                    'is_active'   => true,
                ],
                [
                    'name'        => 'Tetouan',
                    'slug'        => 'tetouan',
                    'title'       => 'The White Dove',
                    'ordering'    => 2,
                    'description' => "Tetouan, known as the White Dove, is a gem of Andalusian heritage nestled between the Rif Mountains and the Mediterranean, with one of Morocco's best-preserved medinas.",
                    'image'       => '/attached_assets/generated_images/Tetouan_white_medina_rif_mountains_9ca48cda.png',
                    'highlights'  => ['UNESCO Medina', 'Andalusian Architecture', 'Place Hassan II', 'Royal Palace'],
                    'culture'     => [
                        'title'       => 'Culture & Heritage',
                        'description' => 'Tetouan is the most Andalusian of all Moroccan cities, shaped by Moorish refugees from Spain.',
                        'highlights'  => ['UNESCO World Heritage medina since 1997', 'Strongest Andalusian influence in Morocco', 'Renowned school of traditional music'],
                    ],
                    'cuisine' => [
                        'title'  => 'Local Cuisine',
                        'dishes' => [
                            ['name' => 'Couscous Tetouan', 'description' => 'Seven-vegetable couscous in the Andalusian tradition'],
                            ['name' => 'Briouats',          'description' => 'Crispy pastry parcels filled with meat or cheese'],
                            ['name' => 'Harira',            'description' => 'Rich tomato and lentil soup, a Moroccan staple'],
                            ['name' => 'Chebakia',          'description' => 'Sesame and honey pastry dusted with powdered sugar'],
                        ],
                    ],
                    'activities' => [
                        ['name' => 'Medina Walking Tour', 'icon' => 'map',      'description' => 'Explore the UNESCO-listed medina on foot'],
                        ['name' => 'Museum of Tetouan',   'icon' => 'mountain', 'description' => 'Discover Amazigh art and artefacts'],
                        ['name' => 'Martil Beach',        'icon' => 'waves',    'description' => 'Relax on the nearby Mediterranean beach'],
                        ['name' => 'Artisan Crafts',      'icon' => 'coffee',   'description' => 'Shop for embroidery and zellige tilework'],
                    ],
                    'best_time' => [
                        'season'      => 'Spring & Fall',
                        'months'      => 'April-June, September-October',
                        'description' => 'Ideal weather for exploring the medina and nearby beaches.',
                        'temperature' => '17-27°C (63-81°F)',
                    ],
                    'getting_there' => [
                        'airport'        => 'Tangier Ibn Battouta Airport (TNG) — 60 km',
                        'transport'      => ['Regular buses from Tangier (1 hour)', 'Grand taxis from Tangier or Chefchaouen', 'CTM bus from major Moroccan cities'],
                        'localTransport' => 'Petit taxis and walking are the best ways around the medina.',
                    ],
                    'travel_tips' => ['Hire a local guide for the medina', 'Visit the souk on Friday morning', 'Try local pastries at the medina bakeries', 'The beach resort of Martil is 5 km away', 'Dress modestly inside the medina'],
                    'is_active'   => true,
                ],
                [
                    'name'        => 'Al Hoceima',
                    'slug'        => 'al-hoceima',
                    'title'       => 'Mediterranean Paradise',
                    'ordering'    => 3,
                    'description' => "Al Hoceima is a breathtaking coastal city set against the dramatic backdrop of the Rif Mountains. Its crystal-clear Mediterranean waters and rugged landscapes make it one of Morocco's most unspoiled destinations.",
                    'image'       => '/attached_assets/generated_images/Al_Hoceima_mediterranean_coast_cf7f8f5d.png',
                    'highlights'  => ['Al Hoceima National Park', 'Plage Quemado', 'Rif Mountains', 'Spanish Island'],
                    'culture'     => [
                        'title'       => 'Culture & Heritage',
                        'description' => 'Al Hoceima is the heartland of the Amazigh Riffian culture, with a strong sense of local identity.',
                        'highlights'  => ['Amazigh Riffian cultural heartland', 'Hirak civil movement history', 'Traditional Riffian music and festivals'],
                    ],
                    'cuisine' => [
                        'title'  => 'Local Cuisine',
                        'dishes' => [
                            ['name' => 'Grilled Octopus',     'description' => 'Freshly caught and grilled with chermoula sauce'],
                            ['name' => 'Fried Calamari',      'description' => 'Crispy squid rings served with lemon'],
                            ['name' => 'Amazigh Bread',       'description' => 'Traditional Riffian flatbread baked in clay ovens'],
                            ['name' => 'Fresh Sea Bream',     'description' => 'Mediterranean fish prepared simply with olive oil and herbs'],
                        ],
                    ],
                    'activities' => [
                        ['name' => 'National Park Hiking',   'icon' => 'mountain', 'description' => 'Trek through Mediterranean forests and cliffs'],
                        ['name' => 'Snorkelling & Diving',   'icon' => 'waves',    'description' => 'Explore crystal-clear Mediterranean waters'],
                        ['name' => 'Plage Quemado',          'icon' => 'waves',    'description' => 'Swim at the stunning crescent beach'],
                        ['name' => 'Boat to Spanish Island', 'icon' => 'map',      'description' => "Visit the historic Peñón de Alhucemas island"],
                    ],
                    'best_time' => [
                        'season'      => 'Summer',
                        'months'      => 'June-September',
                        'description' => 'The warmest and sunniest months for beach and water activities.',
                        'temperature' => '22-32°C (72-90°F)',
                    ],
                    'getting_there' => [
                        'airport'        => 'Cherif Al Idrissi Airport (AHU)',
                        'transport'      => ['Seasonal flights from European cities', 'CTM buses from Fes, Casablanca, and Tangier', 'Grand taxis from Nador or Tetouan'],
                        'localTransport' => 'Taxis and rental cars. Many beaches require a car or boat.',
                    ],
                    'travel_tips' => ['Book accommodation early in summer', 'Rent a car to reach hidden beaches', 'Respect local Amazigh customs', 'Try the freshly caught seafood at harbour restaurants', 'Avoid peak July–August if you prefer fewer crowds'],
                    'is_active'   => true,
                ],
                [
                    'name'        => 'Chefchaouen',
                    'slug'        => 'chefchaouen',
                    'title'       => 'The Blue Pearl',
                    'ordering'    => 4,
                    'description' => "Chefchaouen, affectionately known as the Blue Pearl of Morocco, is a mesmerizing mountain town where every corner reveals a new shade of blue.",
                    'image'       => '/attached_assets/generated_images/Chefchaouen_blue_streets_272376ab.png',
                    'highlights'  => ['Blue Medina', 'Spanish Mosque', 'Ras El Maa Waterfall', 'Traditional Crafts'],
                    'culture'     => [
                        'title'       => 'Culture & Heritage',
                        'description' => 'The iconic blue color originated with Jewish refugees in the 1930s.',
                        'highlights'  => ['Iconic blue-washed buildings', 'Blend of Berber, Moorish, and Jewish heritage', 'Traditional weaving workshops'],
                    ],
                    'cuisine' => [
                        'title'  => 'Local Cuisine',
                        'dishes' => [
                            ['name' => 'Goat Cheese',       'description' => 'Fresh local cheese made from Rif Mountain goat milk'],
                            ['name' => 'Bissara',           'description' => 'Hearty fava bean soup topped with olive oil and cumin'],
                            ['name' => 'Tajine Kefta',      'description' => 'Spiced meatballs in rich tomato sauce'],
                            ['name' => 'Moroccan Pancakes', 'description' => 'Msemen served with honey and butter'],
                        ],
                    ],
                    'activities' => [
                        ['name' => 'Wander Blue Streets',     'icon' => 'map',      'description' => 'Get lost in the photogenic blue-washed medina'],
                        ['name' => 'Spanish Mosque Sunset',   'icon' => 'mountain', 'description' => 'Hike to the mosque for panoramic sunset views'],
                        ['name' => 'Ras El Maa Waterfall',   'icon' => 'waves',    'description' => 'Visit the mountain spring and waterfall'],
                        ['name' => 'Artisan Shopping',        'icon' => 'coffee',   'description' => 'Browse handwoven blankets and traditional crafts'],
                    ],
                    'best_time' => [
                        'season'      => 'Spring & Fall',
                        'months'      => 'April-May, September-October',
                        'description' => 'Perfect mountain weather for exploring.',
                        'temperature' => '12-24°C (54-75°F)',
                    ],
                    'getting_there' => [
                        'airport'        => 'Tangier Ibn Battouta Airport (TNG)',
                        'transport'      => ['2.5 hours from Tangier by bus', '3 hours from Fes', 'Regular CTM bus services'],
                        'localTransport' => 'The medina is entirely pedestrian.',
                    ],
                    'travel_tips' => ['Wear comfortable shoes', 'Best photos early morning', 'Bargain politely in shops', 'Stay overnight for the atmosphere', 'Visit the kasbah for panoramic views'],
                    'is_active'   => true,
                ],
                [
                    'name'        => 'Fes',
                    'slug'        => 'fes',
                    'title'       => 'Spiritual & Cultural Heart',
                    'ordering'    => 5,
                    'description' => "Fes el-Bali is one of the best-preserved medieval cities in the Arab world, home to the world's oldest continuously operating university.",
                    'image'       => '/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png',
                    'highlights'  => ['Al Quaraouiyine University', 'Chouara Tannery', 'Bou Inania Madrasa', 'Royal Palace Gates'],
                    'culture'     => [
                        'title'       => 'Culture & Heritage',
                        'description' => "Founded in 789 AD, Fes is Morocco's spiritual and intellectual capital.",
                        'highlights'  => ["World's oldest university since 859 AD", 'UNESCO World Heritage medina', 'Center of traditional craftsmanship'],
                    ],
                    'cuisine' => [
                        'title'  => 'Local Cuisine',
                        'dishes' => [
                            ['name' => 'Fes Pastilla', 'description' => 'Legendary sweet-savory pigeon pie with almonds'],
                            ['name' => 'Rfissa',       'description' => 'Shredded msemen bread with chicken in fenugreek sauce'],
                            ['name' => 'Mechoui',      'description' => 'Slow-roasted whole lamb'],
                            ['name' => 'Zaalouk',      'description' => 'Smoky eggplant and tomato salad'],
                        ],
                    ],
                    'activities' => [
                        ['name' => 'Navigate the Medina',   'icon' => 'map',    'description' => 'Explore 9,000 alleyways with a local guide'],
                        ['name' => 'Visit Tanneries',       'icon' => 'coffee', 'description' => 'Watch leather dyed using 1,000-year-old techniques'],
                        ['name' => 'Madrasa Architecture',  'icon' => 'map',    'description' => 'Marvel at intricate tilework and carved plaster'],
                        ['name' => 'Artisan Workshops',     'icon' => 'coffee', 'description' => 'See craftsmen making pottery and metalwork'],
                    ],
                    'best_time' => [
                        'season'      => 'Spring & Fall',
                        'months'      => 'March-May, September-November',
                        'description' => 'Comfortable temperatures for walking the medina.',
                        'temperature' => '10-26°C (50-79°F)',
                    ],
                    'getting_there' => [
                        'airport'        => 'Fes–Saïss Airport (FEZ)',
                        'transport'      => ['Direct flights from European cities', 'High-speed train from Casablanca (2.5h)', 'Regular bus services'],
                        'localTransport' => 'The medina is pedestrian-only. Hire a guide for your first visit.',
                    ],
                    'travel_tips' => ['Hire an official guide for your first medina visit', 'Visit tanneries in the morning', 'Bring mint leaves near the tanneries', 'Stay in a traditional riad', 'Visit during the Sacred Music Festival in June'],
                    'is_active'   => true,
                ],
                [
                    'name'        => 'Essaouira',
                    'slug'        => 'essaouira',
                    'title'       => 'Wind City of Africa',
                    'ordering'    => 6,
                    'description' => 'Essaouira is a laid-back coastal gem where Atlantic breezes sweep through whitewashed streets, a UNESCO World Heritage site beloved by artists and musicians.',
                    'image'       => '/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png',
                    'highlights'  => ['Skala de la Ville', 'Fishing Port', 'Gnaoua Festival', 'Windsurfing'],
                    'culture'     => [
                        'title'       => 'Culture & Heritage',
                        'description' => 'The UNESCO-listed medina reflects its history as a cosmopolitan trading port.',
                        'highlights'  => ['UNESCO World Heritage fortified medina', 'Annual Gnaoua World Music Festival', 'Thriving contemporary art and music scene'],
                    ],
                    'cuisine' => [
                        'title'  => 'Local Cuisine',
                        'dishes' => [
                            ['name' => 'Fresh Grilled Sardines', 'description' => 'Daily catch grilled at the harbor'],
                            ['name' => 'Seafood Tagine',         'description' => 'Mixed seafood in aromatic chermoula sauce'],
                            ['name' => 'Oysters',                'description' => 'Fresh Atlantic oysters from local farms'],
                            ['name' => 'Argan Oil Amlou',        'description' => 'Sweet spread made from argan oil and almonds'],
                        ],
                    ],
                    'activities' => [
                        ['name' => 'Windsurfing',              'icon' => 'waves',    'description' => 'Ride consistent Atlantic winds at world-class beaches'],
                        ['name' => 'Explore the Ramparts',    'icon' => 'map',      'description' => 'Walk along Skala de la Ville fortifications'],
                        ['name' => 'Art Gallery Hopping',     'icon' => 'coffee',   'description' => 'Browse contemporary Moroccan art galleries'],
                        ['name' => 'Beach Horseback Riding',  'icon' => 'mountain', 'description' => 'Gallop along Atlantic beaches at sunset'],
                    ],
                    'best_time' => [
                        'season'      => 'Year-Round',
                        'months'      => 'April-June, September-November',
                        'description' => 'Mild temperatures year-round thanks to ocean breezes.',
                        'temperature' => '16-24°C (61-75°F)',
                    ],
                    'getting_there' => [
                        'airport'        => 'Essaouira-Mogador Airport (ESU) or Marrakech (RAK)',
                        'transport'      => ['2.5-3 hours from Marrakech by bus', 'Direct flights from European cities (seasonal)', 'Regular Supratours buses'],
                        'localTransport' => 'The compact medina is walkable.',
                    ],
                    'travel_tips' => ['Book early during Gnaoua Festival (late June)', 'Bring layers for the ocean winds', 'Visit the fish market for fresh seafood', 'Take a day trip to Sidi Kaouki beach', 'Thursday souk in Diabat village is authentic'],
                    'is_active'   => true,
                ],
            ];

            foreach ($cities as $city) {
                City::create($city);
            }
        }

        $this->command->info('Discover page seeded.');
    }
}
