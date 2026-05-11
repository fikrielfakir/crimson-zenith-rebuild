<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CityAdminController extends Controller
{
    private function mapOutput(City $city): array
    {
        return [
            'id'           => $city->id,
            'name'         => $city->name,
            'slug'         => $city->slug,
            'title'        => $city->title,
            'description'  => $city->description,
            'image'        => $city->image,
            'highlights'   => $city->highlights ?? [],
            'culture'      => $city->culture,
            'cuisine'      => $city->cuisine,
            'activities'   => $city->activities ?? [],
            'bestTime'     => $city->best_time,
            'gettingThere' => $city->getting_there,
            'travelTips'   => $city->travel_tips ?? [],
            'isActive'     => (bool) $city->is_active,
            'ordering'     => $city->ordering,
            'createdAt'    => $city->created_at,
            'updatedAt'    => $city->updated_at,
        ];
    }

    private function mapInput(Request $request): array
    {
        $name = $request->input('name');
        $slug = $request->input('slug') ?: Str::slug($name);

        $culture = $request->input('culture');
        $cuisine = $request->input('cuisine');
        $bestTime = $request->input('bestTime');
        $gettingThere = $request->input('gettingThere');

        return array_filter([
            'name'         => $name,
            'slug'         => $slug,
            'title'        => $request->input('title'),
            'description'  => $request->input('description'),
            'image'        => $request->input('image'),
            'highlights'   => $request->input('highlights', []),
            'culture'      => $culture,
            'cuisine'      => $cuisine,
            'activities'   => $request->input('activities', []),
            'best_time'    => $bestTime,
            'getting_there' => $gettingThere,
            'travel_tips'  => $request->input('travelTips', []),
            'is_active'    => (bool) $request->input('isActive', true),
            'ordering'     => (int) $request->input('ordering', 0),
        ], fn($v) => $v !== null);
    }

    public function index(Request $request)
    {
        $query = City::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $cities = $query->orderBy('ordering')->orderBy('id')->get()->map(fn($c) => $this->mapOutput($c));

        return response()->json(['cities' => $cities, 'total' => $cities->count()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $data = $this->mapInput($request);

        if (City::where('slug', $data['slug'])->exists()) {
            $data['slug'] = $data['slug'] . '-' . time();
        }

        $city = City::create($data);

        return response()->json($this->mapOutput($city->fresh()), 201);
    }

    public function update(Request $request, $id)
    {
        $city = City::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $data = $this->mapInput($request);

        if (isset($data['slug']) && $data['slug'] !== $city->slug) {
            if (City::where('slug', $data['slug'])->where('id', '!=', $id)->exists()) {
                $data['slug'] = $data['slug'] . '-' . time();
            }
        }

        $city->update($data);

        return response()->json($this->mapOutput($city->fresh()));
    }

    public function destroy($id)
    {
        City::findOrFail($id)->delete();
        return response()->json(['message' => 'City deleted']);
    }

    public function bulkReorder(Request $request)
    {
        $items = $request->input('items', []);
        foreach ($items as $item) {
            City::where('id', $item['id'])->update(['ordering' => $item['ordering']]);
        }
        return response()->json(['message' => 'Order updated']);
    }

    public function seedDefaults()
    {
        if (City::count() > 0) {
            return response()->json(['message' => 'Cities already exist', 'count' => City::count()]);
        }

        $cities = [
            [
                'name' => 'Tangier', 'slug' => 'tangier', 'title' => 'Gateway Between Continents', 'ordering' => 1,
                'description' => "Tangier, Morocco's gateway between Africa and Europe, is a captivating city where cultures converge at the crossroads of the Mediterranean Sea and the Atlantic Ocean. This historic port city has long been a melting pot of civilizations, attracting artists, writers, and travelers from around the world. Explore the vibrant medina with its maze of narrow streets, visit the historic Kasbah overlooking the Strait of Gibraltar, and experience the city's unique blend of Moroccan, Spanish, and French influences. From the legendary Café Hafa where literary giants once gathered to the pristine beaches along the coast, Tangier offers an unforgettable journey through Morocco's cosmopolitan soul.",
                'image' => '/attached_assets/generated_images/Tangier_city_aerial_view_03330006.png',
                'highlights' => ['Historic Kasbah', 'Café Hafa', 'Strait of Gibraltar', 'American Legation Museum'],
                'culture' => ['title' => 'Culture & Heritage', 'description' => "Tangier's rich cultural tapestry reflects centuries of cross-continental exchange. The city has been a haven for artists, writers, and musicians, including Paul Bowles, William S. Burroughs, and Henri Matisse.", 'highlights' => ['Multicultural heritage spanning three continents', 'Famous artistic community and literary history', 'Blend of Moroccan, Spanish, and French influences']],
                'cuisine' => ['title' => 'Local Cuisine', 'dishes' => [['name' => 'Fresh Seafood', 'description' => 'Mediterranean and Atlantic catch prepared with Moroccan spices'], ['name' => 'Tangia', 'description' => 'Slow-cooked meat stew unique to Northern Morocco'], ['name' => 'Pastilla', 'description' => 'Sweet and savory pastry with pigeon or chicken'], ['name' => 'Mint Tea', 'description' => 'Traditional Moroccan tea served at legendary cafés']]],
                'activities' => [['name' => 'Explore the Medina', 'icon' => 'map', 'description' => 'Wander through ancient streets filled with artisan workshops and traditional souks'], ['name' => 'Visit Hercules Caves', 'icon' => 'mountain', 'description' => 'Discover mythological caves with stunning Atlantic Ocean views'], ['name' => 'Relax at Café Hafa', 'icon' => 'coffee', 'description' => 'Enjoy mint tea at the legendary cliffside café with panoramic sea views'], ['name' => 'Beach Activities', 'icon' => 'waves', 'description' => 'Swim, surf, or sunbathe on pristine Mediterranean beaches']],
                'best_time' => ['season' => 'Spring & Fall', 'months' => 'April-May, September-October', 'description' => 'Mild temperatures and fewer crowds make these months ideal.', 'temperature' => '18-25°C (64-77°F)'],
                'getting_there' => ['airport' => 'Tangier Ibn Battouta Airport (TNG)', 'transport' => ['Direct flights from major European cities', 'High-speed train (Al Boraq) from Casablanca (2h 10min)', 'Ferry connections from Spain (Tarifa, Algeciras)'], 'localTransport' => 'Taxis, rental cars, and local buses are readily available.'],
                'travel_tips' => ['The medina is best explored on foot - wear comfortable shoes', 'Bargaining is expected in souks and markets', 'Learn basic French or Spanish phrases - widely spoken', 'Visit Café Hafa during sunset for unforgettable views', 'Book ferry tickets in advance during peak season'],
                'is_active' => true,
            ],
            [
                'name' => 'Tetouan', 'slug' => 'tetouan', 'title' => 'The White Dove', 'ordering' => 2,
                'description' => "Nestled in the Rif Mountains, Tetouan is known as 'The White Dove' for its stunning whitewashed buildings. This UNESCO World Heritage site boasts one of Morocco's best-preserved medinas, where Andalusian architecture tells the story of its Spanish-Moorish heritage.",
                'image' => '/attached_assets/generated_images/Tetouan_medina_panorama_b1f6dcbc.png',
                'highlights' => ['UNESCO Medina', 'Royal Palace', 'Archaeological Museum', 'Rif Mountains'],
                'culture' => ['title' => 'Culture & Heritage', 'description' => "Tetouan's UNESCO-listed medina is a living museum of Andalusian-Moorish architecture.", 'highlights' => ['UNESCO World Heritage medina since 1997', 'Andalusian architectural heritage', 'Traditional artisan crafts including zellige and embroidery']],
                'cuisine' => ['title' => 'Local Cuisine', 'dishes' => [['name' => 'Trid', 'description' => 'Layered pastry with chicken and almonds, a Tetouan specialty'], ['name' => 'Kaak', 'description' => 'Sesame-covered bread rings sold in the medina'], ['name' => 'Harira Tetouania', 'description' => "Local version of Morocco's famous soup"], ['name' => 'Seafood Couscous', 'description' => 'Fresh Mediterranean catch served over fluffy couscous']]],
                'activities' => [['name' => 'Explore UNESCO Medina', 'icon' => 'map', 'description' => 'Discover pristine Andalusian architecture in the whitewashed medina'], ['name' => 'Royal Palace Visit', 'icon' => 'map', 'description' => 'Admire the stunning gates of the Royal Palace'], ['name' => 'Rif Mountain Hiking', 'icon' => 'mountain', 'description' => 'Trek through scenic mountain trails with panoramic views'], ['name' => 'Artisan Workshops', 'icon' => 'coffee', 'description' => 'Watch craftsmen create traditional zellige tiles and embroidery']],
                'best_time' => ['season' => 'Spring & Fall', 'months' => 'March-May, September-November', 'description' => 'Pleasant mountain temperatures ideal for exploring.', 'temperature' => '15-26°C (59-79°F)'],
                'getting_there' => ['airport' => 'Tétouan-Sania Ramel Airport (TTU) or Tangier Ibn Battouta (TNG)', 'transport' => ['60km from Tangier (1-hour drive)', 'Regular buses from Tangier and Chefchaouen', 'Shared taxis from nearby cities'], 'localTransport' => 'The medina is pedestrian-only. Taxis and local buses connect to nearby beaches and mountains.'],
                'travel_tips' => ['Hire a local guide to discover hidden corners of the medina', 'Visit the School of Traditional Arts to see artisans at work', 'Nearby Martil beach is perfect for a seaside afternoon', 'Photography is generally welcome but ask permission for people', 'Friday mornings offer the most authentic souk experience'],
                'is_active' => true,
            ],
            [
                'name' => 'Al Hoceima', 'slug' => 'al-hoceima', 'title' => 'Mediterranean Paradise', 'ordering' => 3,
                'description' => "Al Hoceima is Morocco's hidden gem on the Mediterranean coast, a pristine paradise known for its crystal-clear turquoise waters and dramatic mountainous coastline.",
                'image' => '/attached_assets/generated_images/Al_Hoceima_coastal_view_9e4e9e0c.png',
                'highlights' => ['Plage Quemado', 'National Park', 'Peñón de Alhucemas', 'Rif Mountain Trails'],
                'culture' => ['title' => 'Culture & Heritage', 'description' => 'Al Hoceima embodies authentic Berber (Amazigh) culture with Riffian traditions preserved through generations.', 'highlights' => ['Rich Berber (Riffian) cultural heritage', 'Spanish colonial architecture influence', 'Traditional fishing community practices']],
                'cuisine' => ['title' => 'Local Cuisine', 'dishes' => [['name' => 'Grilled Fresh Fish', 'description' => 'Daily catch prepared Mediterranean-style with olive oil and herbs'], ['name' => 'Berber Pizza (Madfouna)', 'description' => 'Stuffed flatbread with vegetables and meat'], ['name' => 'Seafood Tagine', 'description' => 'Fresh prawns, fish, and calamari in aromatic tomato sauce'], ['name' => 'Rif Mountain Honey', 'description' => 'Pure honey from mountain wildflowers, a local delicacy']]],
                'activities' => [['name' => 'Beach Hopping', 'icon' => 'waves', 'description' => 'Visit pristine beaches including Plage Quemado, Cala Bonita, and Tala Youssef'], ['name' => 'National Park Hiking', 'icon' => 'mountain', 'description' => "Explore Al Hoceima National Park's trails and marine reserve"], ['name' => 'Water Sports', 'icon' => 'waves', 'description' => 'Snorkeling, diving, and kayaking in crystal-clear waters'], ['name' => 'Fishing Villages', 'icon' => 'map', 'description' => 'Visit traditional fishing harbors and watch daily catches arrive']],
                'best_time' => ['season' => 'Late Spring to Early Fall', 'months' => 'May-June, September-October', 'description' => 'Perfect beach weather with warm sunshine and calm seas.', 'temperature' => '22-28°C (72-82°F)'],
                'getting_there' => ['airport' => 'Al Hoceima Charif Al Idrissi Airport (AHU)', 'transport' => ['Domestic flights from Casablanca, Tangier, and other major cities', 'Bus services from Fes (6 hours), Tangier (5 hours)', 'Scenic coastal road drive from Tetouan'], 'localTransport' => 'Taxis and rental cars are the best options.'],
                'travel_tips' => ['Book accommodation in advance during July-August peak season', 'Rent a car to explore hidden beaches and coastal roads', 'Try fresh seafood at the local fish market restaurants', 'Bring sun protection - the Mediterranean sun is strong', 'Visit during the Cultural Festival in July for traditional music and dance'],
                'is_active' => true,
            ],
            [
                'name' => 'Chefchaouen', 'slug' => 'chefchaouen', 'title' => 'The Blue Pearl', 'ordering' => 4,
                'description' => "Chefchaouen, affectionately known as the 'Blue Pearl' of Morocco, is a mesmerizing mountain town where every corner reveals a new shade of blue. Founded in 1471, this picturesque city in the Rif Mountains has become one of Morocco's most photographed destinations.",
                'image' => '/attached_assets/generated_images/Chefchaouen_blue_streets_272376ab.png',
                'highlights' => ['Blue Medina', 'Spanish Mosque', 'Ras El Maa Waterfall', 'Traditional Crafts'],
                'culture' => ['title' => 'Culture & Heritage', 'description' => "Chefchaouen's iconic blue color palette originated with Jewish refugees in the 1930s who painted buildings blue to represent heaven.", 'highlights' => ['Iconic blue-washed buildings with spiritual significance', 'Blend of Berber, Moorish, and Jewish heritage', 'Traditional weaving and handicraft workshops']],
                'cuisine' => ['title' => 'Local Cuisine', 'dishes' => [['name' => 'Goat Cheese', 'description' => 'Fresh local cheese made from Rif Mountain goat milk'], ['name' => 'Bissara', 'description' => 'Hearty fava bean soup topped with olive oil and cumin'], ['name' => 'Tajine Kefta', 'description' => 'Spiced meatballs in rich tomato sauce with eggs'], ['name' => 'Moroccan Pancakes', 'description' => 'Msemen and rghaif served with honey and butter']]],
                'activities' => [['name' => 'Wander Blue Streets', 'icon' => 'map', 'description' => 'Get lost in the photogenic blue-washed medina'], ['name' => 'Spanish Mosque Sunset', 'icon' => 'mountain', 'description' => 'Hike to the mosque for panoramic sunset views over the city'], ['name' => 'Ras El Maa Waterfall', 'icon' => 'waves', 'description' => 'Visit the mountain spring where locals do laundry'], ['name' => 'Artisan Shopping', 'icon' => 'coffee', 'description' => 'Browse handwoven blankets, leather goods, and traditional crafts']],
                'best_time' => ['season' => 'Spring & Fall', 'months' => 'April-May, September-October', 'description' => 'Perfect mountain weather for exploring. Summers are pleasant but busy.', 'temperature' => '12-24°C (54-75°F)'],
                'getting_there' => ['airport' => 'Tangier Ibn Battouta Airport (TNG) - closest major airport', 'transport' => ['2.5 hours from Tangier by bus or grand taxi', '3 hours from Fes', 'Regular CTM and Supratours bus services'], 'localTransport' => 'The medina is entirely pedestrian. Walking is the best way to explore.'],
                'travel_tips' => ['Wear comfortable shoes - the medina has steep, cobbled streets', 'Best photos are early morning when streets are empty', 'Bargain politely in shops - it\'s expected and part of the culture', 'Stay overnight to experience the peaceful evening atmosphere', 'Visit the kasbah for panoramic views and garden tranquility'],
                'is_active' => true,
            ],
            [
                'name' => 'Fes', 'slug' => 'fes', 'title' => 'Spiritual & Cultural Heart', 'ordering' => 5,
                'description' => "Fes el-Bali, the ancient walled city of Fes, is the world's largest car-free urban area and one of the best-preserved medieval cities in the Arab world. Founded in the 9th century, Fes served as Morocco's capital for over 400 years and remains the country's spiritual and cultural heart.",
                'image' => '/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png',
                'highlights' => ['Al Quaraouiyine University', 'Chouara Tannery', 'Bou Inania Madrasa', 'Royal Palace Gates'],
                'culture' => ['title' => 'Culture & Heritage', 'description' => 'Founded in 789 AD, Fes is Morocco\'s spiritual and intellectual capital. Home to the world\'s oldest continuously operating university (Al Quaraouiyine, est. 859 AD).', 'highlights' => ['World\'s oldest operating university since 859 AD', 'UNESCO World Heritage medina with medieval architecture', 'Center of traditional Moroccan craftsmanship and learning']],
                'cuisine' => ['title' => 'Local Cuisine', 'dishes' => [['name' => 'Fes Pastilla', 'description' => 'Legendary sweet-savory pigeon pie with almonds and cinnamon'], ['name' => 'Rfissa', 'description' => 'Shredded msemen bread with chicken in fenugreek sauce'], ['name' => 'Mechoui', 'description' => 'Slow-roasted whole lamb, a Fassi celebration dish'], ['name' => 'Zaalouk', 'description' => 'Smoky eggplant and tomato salad with Moroccan spices']]],
                'activities' => [['name' => 'Navigate the Medina', 'icon' => 'map', 'description' => 'Explore 9,000 alleyways with a local guide in the car-free medina'], ['name' => 'Visit Tanneries', 'icon' => 'coffee', 'description' => 'Watch leather being dyed using 1,000-year-old techniques'], ['name' => 'Madrasa Architecture', 'icon' => 'map', 'description' => 'Marvel at intricate tilework in Bou Inania and Al-Attarine madrasas'], ['name' => 'Artisan Workshops', 'icon' => 'coffee', 'description' => 'See craftsmen making pottery, textiles, and metalwork']],
                'best_time' => ['season' => 'Spring & Fall', 'months' => 'March-May, September-November', 'description' => 'Comfortable temperatures for walking the medina. Summers are hot, winters can be chilly.', 'temperature' => '10-26°C (50-79°F)'],
                'getting_there' => ['airport' => 'Fes–Saïss Airport (FEZ)', 'transport' => ['Direct flights from European cities and domestic routes', 'High-speed train (Al Boraq) from Tangier (3.5h), Casablanca (2.5h)', 'Regular bus services from all major Moroccan cities'], 'localTransport' => 'The medina is pedestrian-only. Hire a guide for your first visit.'],
                'travel_tips' => ['Hire an official guide for your first medina visit - it\'s truly labyrinthine', 'Visit tanneries in morning when work is most active', 'Bring mint leaves for your nose near the tanneries', 'Stay in a traditional riad inside the medina for authentic experience', 'Visit during the Sacred Music Festival in June for world-class performances'],
                'is_active' => true,
            ],
            [
                'name' => 'Essaouira', 'slug' => 'essaouira', 'title' => 'Wind City of Africa', 'ordering' => 6,
                'description' => "Essaouira, Morocco's 'Wind City of Africa,' is a laid-back coastal gem where Atlantic breezes sweep through whitewashed and blue-shuttered streets. This former Portuguese trading post, now a UNESCO World Heritage site, perfectly balances bohemian charm with historical grandeur.",
                'image' => '/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png',
                'highlights' => ['Skala de la Ville', 'Fishing Port', 'Gnaoua Festival', 'Windsurfing'],
                'culture' => ['title' => 'Culture & Heritage', 'description' => "Essaouira's UNESCO-listed medina reflects its history as a cosmopolitan trading port. The 18th-century fortifications blend European and Moorish architecture.", 'highlights' => ['UNESCO World Heritage fortified medina', 'Annual Gnaoua World Music Festival', 'Thriving contemporary art and music scene']],
                'cuisine' => ['title' => 'Local Cuisine', 'dishes' => [['name' => 'Fresh Grilled Sardines', 'description' => 'Daily catch grilled at the harbor and served with bread'], ['name' => 'Seafood Tagine', 'description' => 'Mixed seafood in aromatic chermoula sauce'], ['name' => 'Oysters', 'description' => 'Fresh Atlantic oysters from local farms'], ['name' => 'Argan Oil Amlou', 'description' => 'Sweet spread made from argan oil, almonds, and honey']]],
                'activities' => [['name' => 'Windsurfing & Kitesurfing', 'icon' => 'waves', 'description' => 'Ride consistent Atlantic winds at world-class beaches'], ['name' => 'Explore the Ramparts', 'icon' => 'map', 'description' => 'Walk along Skala de la Ville fortifications with ocean views'], ['name' => 'Art Gallery Hopping', 'icon' => 'coffee', 'description' => 'Browse contemporary Moroccan art in medina galleries'], ['name' => 'Beach Horseback Riding', 'icon' => 'mountain', 'description' => 'Gallop along endless Atlantic beaches at sunset']],
                'best_time' => ['season' => 'Year-Round (Best: Spring & Fall)', 'months' => 'April-June, September-November', 'description' => 'Mild temperatures year-round thanks to ocean breezes.', 'temperature' => '16-24°C (61-75°F)'],
                'getting_there' => ['airport' => 'Essaouira-Mogador Airport (ESU) or Marrakech (RAK)', 'transport' => ['2.5-3 hours from Marrakech by bus or car', 'Direct flights to Essaouira from European cities (seasonal)', 'Regular Supratours buses from Marrakech and Casablanca'], 'localTransport' => 'The compact medina is walkable. Taxis available for beach clubs and surrounding areas.'],
                'travel_tips' => ['Book accommodations early during Gnaoua Festival (late June)', 'Strong Atlantic winds make evenings cool - bring layers', 'Visit the fish market at the port for the freshest seafood', 'Take a day trip to Sidi Kaouki beach for quieter shores', "Thursday's souk in Diabat village offers authentic local shopping"],
                'is_active' => true,
            ],
        ];

        foreach ($cities as $city) {
            City::create($city);
        }

        return response()->json(['message' => 'Cities seeded', 'count' => City::count()]);
    }
}
