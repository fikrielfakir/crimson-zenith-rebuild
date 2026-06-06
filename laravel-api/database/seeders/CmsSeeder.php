<?php

namespace Database\Seeders;

use App\Models\FocusItem;
use App\Models\TeamMember;
use App\Models\LandingTestimonial;
use App\Models\SiteStat;
use App\Models\NavbarSettings;
use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        // Navbar
        if (!NavbarSettings::find('default')) {
            NavbarSettings::create([
                'id' => 'default',
                'navigation_links' => [
                    ['label' => 'Discover',    'url' => '/discover',    'isExternal' => false, 'hasDropdown' => true],
                    ['label' => 'Activities',  'url' => '/activities',  'isExternal' => false],
                    ['label' => 'Projects',    'url' => '/projects',    'isExternal' => false],
                    ['label' => 'Clubs',       'url' => '/clubs',       'isExternal' => false],
                    ['label' => 'Gallery',     'url' => '/gallery',     'isExternal' => false],
                    ['label' => 'Blog',        'url' => '/blog',        'isExternal' => false],
                    ['label' => 'Talents',     'url' => '/talents',     'isExternal' => false, 'hasDropdown' => true],
                    ['label' => 'Contact',     'url' => '/contact',     'isExternal' => false],
                ],
            ]);
        }

        // Focus items
        if (FocusItem::count() === 0) {
            $items = [
                ['title' => 'Adventure & Exploration',  'icon' => 'mountain', 'description' => 'Experience thrilling outdoor adventures from Atlas Mountains to Sahara Desert', 'ordering' => 1],
                ['title' => 'Cultural Immersion',       'icon' => 'globe',    'description' => 'Connect with local communities and discover authentic Moroccan traditions',   'ordering' => 2],
                ['title' => 'Sustainable Tourism',      'icon' => 'leaf',     'description' => 'Travel responsibly while supporting local economies and preserving nature',   'ordering' => 3],
                ['title' => 'Community Building',       'icon' => 'users',    'description' => 'Join a vibrant network of adventurers and culture enthusiasts',               'ordering' => 4],
            ];
            foreach ($items as $item) FocusItem::create(array_merge($item, ['is_active' => true]));
        }

        // Team members
        if (TeamMember::count() === 0) {
            $members = [
                ['name' => 'Ahmed Benali',     'role' => 'Founder & CEO',         'bio' => 'Passionate about sustainable tourism and cultural preservation.', 'ordering' => 1, 'social_links' => ['linkedin' => '#', 'twitter' => '#']],
                ['name' => 'Fatima El Amrani', 'role' => 'Operations Director',   'bio' => 'With 15 years of experience in tourism management.',              'ordering' => 2, 'social_links' => ['linkedin' => '#']],
                ['name' => 'Youssef Kadiri',   'role' => 'Head Guide',            'bio' => "Born and raised in the Atlas Mountains.",                         'ordering' => 3, 'social_links' => ['instagram' => '#']],
            ];
            foreach ($members as $m) TeamMember::create(array_merge($m, ['is_active' => true]));
        }

        // Testimonials
        if (LandingTestimonial::count() === 0) {
            $testimonials = [
                ['name' => 'Sarah Martinez', 'role' => 'Adventure Traveler',    'rating' => 5, 'feedback' => 'The Atlas Mountains trek was absolutely incredible!', 'ordering' => 1],
                ['name' => 'James Wilson',   'role' => 'Cultural Explorer',     'rating' => 5, 'feedback' => 'I loved the cultural immersion.',                      'ordering' => 2],
                ['name' => 'Emma Thompson',  'role' => 'Photography Enthusiast','rating' => 5, 'feedback' => 'The desert sunset was magical.',                       'ordering' => 3],
            ];
            foreach ($testimonials as $t) LandingTestimonial::create(array_merge($t, ['is_approved' => true, 'is_active' => true]));
        }

        // Site stats
        if (SiteStat::count() === 0) {
            $stats = [
                ['label' => 'Happy Travelers', 'value' => '2500', 'icon' => 'users',    'suffix' => '+', 'ordering' => 1],
                ['label' => 'Active Clubs',    'value' => '15',   'icon' => 'map',      'suffix' => '',  'ordering' => 2],
                ['label' => 'Events Per Year', 'value' => '120',  'icon' => 'calendar', 'suffix' => '+', 'ordering' => 3],
                ['label' => 'Countries',       'value' => '25',   'icon' => 'globe',    'suffix' => '+', 'ordering' => 4],
            ];
            foreach ($stats as $s) SiteStat::create(array_merge($s, ['is_active' => true]));
        }

        $this->command->info('CMS data seeded.');
    }
}
