<?php

namespace App\Http\Controllers;

use App\Models\HeroSettings;
use App\Models\ThemeSettings;
use App\Models\NavbarSettings;
use App\Models\PresidentMessageSettings;
use App\Models\ContactSettings;
use App\Models\FooterSettings;
use App\Models\SeoSettings;
use App\Models\AboutSettings;
use App\Models\DiscoverSettings;
use App\Models\FocusItem;
use App\Models\PageHeroSetting;
use App\Models\TeamMember;
use App\Models\LandingTestimonial;
use App\Models\SiteStat;
use App\Models\MediaAsset;
use App\Models\Partner;
use Illuminate\Support\Facades\Storage;
use App\Models\PartnerSettings;
use App\Models\FocusSectionSettings;
use App\Models\ClubsPageSettings;
use App\Models\LegalPage;
use App\Models\LandingPageSection;
use App\Models\CookieSetting;

class CmsController extends Controller
{
    public function hero()
    {
        $settings = HeroSettings::firstOrCreate(['id' => 'default']);
        return response()->json($this->heroToCamel($settings));
    }

    private function heroToCamel(HeroSettings $s): array
    {
        $title = $s->title;
        // Ensure title is always an array of {text, twoLines} objects
        if (empty($title)) {
            $title = [];
        } elseif (is_string($title)) {
            $title = [['text' => $title, 'twoLines' => str_contains($title, "\n")]];
        }

        return [
            'id'                      => $s->id,
            'title'                   => $title,
            'subtitle'                => $s->subtitle,
            'primaryButtonText'       => $s->primary_button_text,
            'primaryButtonLink'       => $s->primary_button_link,
            'secondaryButtonText'     => $s->secondary_button_text,
            'secondaryButtonLink'     => $s->secondary_button_link,
            'showPrimaryButton'       => (bool) ($s->show_primary_button ?? true),
            'showSecondaryButton'     => (bool) ($s->show_secondary_button ?? true),
            'backgroundType'          => $s->background_type,
            'backgroundMediaId'       => $s->background_media_id,
            'backgroundImageUrl'      => $s->background_image_url,
            'backgroundVideoUrl'      => $s->background_video_url,
            'backgroundOverlayColor'  => $s->background_overlay_color,
            'backgroundOverlayOpacity'=> $s->background_overlay_opacity,
            'titleFontSize'           => $s->title_font_size,
            'titleColor'              => $s->title_color,
            'titleAlignment'          => $s->title_alignment ?? 'center',
            'subtitleFontSize'        => $s->subtitle_font_size,
            'subtitleColor'           => $s->subtitle_color,
            'subtitleAlignment'       => $s->subtitle_alignment ?? 'center',
            'heroHeight'              => $s->hero_height ?? '600',
            'contentMaxWidth'         => $s->content_max_width ?? '800',
            'enableTypewriter'        => (bool) $s->enable_typewriter,
            'typewriterTexts'         => $title,
            'updatedBy'               => $s->updated_by,
            'updatedAt'               => $s->updated_at,
        ];
    }

    public function theme()
    {
        return response()->json(ThemeSettings::firstOrCreate(['id' => 'default']));
    }

    public function navbar()
    {
        $s = NavbarSettings::firstOrCreate(['id' => 'default']);
        return response()->json(array_merge($s->toArray(), [
            'logoUrl'  => $s->logo_url,
            'logoType' => $s->logo_type,
        ]));
    }

    public function presidentMessage()
    {
        return response()->json(PresidentMessageSettings::firstOrCreate(['id' => 'default']));
    }

    public function contact()
    {
        return response()->json(ContactSettings::firstOrCreate(['id' => 'default']));
    }

    public function footer()
    {
        return response()->json(FooterSettings::firstOrCreate(['id' => 'default']));
    }

    public function seo()
    {
        return response()->json(SeoSettings::firstOrCreate(['id' => 'default']));
    }

    public function about()
    {
        $settings = AboutSettings::firstOrCreate(['id' => 'default']);
        return response()->json($settings->toApiArray());
    }

    public function discoverSettings()
    {
        return response()->json(DiscoverSettings::firstOrCreate(['id' => 'default']));
    }

    public function focusSection()
    {
        try {
            $s = FocusSectionSettings::firstOrCreate(
                ['id' => 'default'],
                ['title' => 'Our Focus', 'subtitle' => 'Tourism, Culture, Entertainment']
            );
            return response()->json([
                'title'    => $s->title,
                'subtitle' => $s->subtitle,
                'isActive' => (bool) $s->is_active,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'title'    => 'Our Focus',
                'subtitle' => 'Tourism, Culture, Entertainment',
                'isActive' => true,
            ]);
        }
    }

    public function pageHero(string $page)
    {
        $setting = PageHeroSetting::where('page_key', $page)->first();
        if (!$setting) {
            return response()->json((object) []);
        }

        return response()->json([
            'page_key'           => $setting->page_key,
            'backgroundType'     => $setting->background_type,
            'backgroundImageUrl' => $setting->background_image_url,
            'backgroundVideoUrl' => $setting->background_video_url,
            'overlayOpacity'     => $setting->overlay_opacity,
            'title'              => $setting->title,
            'subtitle'           => $setting->subtitle,
        ]);
    }

    public function focusItems()
    {
        return response()->json(FocusItem::where('is_active', true)->orderBy('ordering')->get());
    }

    public function teamMembers()
    {
        return response()->json(TeamMember::where('is_active', true)->orderBy('ordering')->get());
    }

    public function clubsPage()
    {
        $settings = ClubsPageSettings::firstOrCreate(['id' => 'default'], [
            'intro_heading'     => 'Join a Community of Adventurers',
            'intro_description' => 'From the Atlantic to the Sahara, our clubs connect passionate explorers across Morocco\'s most iconic destinations.',
            'cta_heading'       => 'Start your own club',
            'cta_description'   => 'Passionate about a region or activity? Create a club and build your community of adventurers.',
            'cta_button_text'   => 'Get Started',
            'cta_button_link'   => '/join-us',
        ]);

        return response()->json([
            'intro_heading'     => $settings->intro_heading,
            'intro_description' => $settings->intro_description,
            'cta_heading'       => $settings->cta_heading,
            'cta_description'   => $settings->cta_description,
            'cta_button_text'   => $settings->cta_button_text,
            'cta_button_link'   => $settings->cta_button_link,
        ]);
    }

    public function testimonials()
    {
        return response()->json(
            LandingTestimonial::where('is_active', true)->where('is_approved', true)->orderBy('ordering')->get()
        );
    }

    public function stats()
    {
        return response()->json(SiteStat::where('is_active', true)->orderBy('ordering')->get());
    }

    public function partners()
    {
        return response()->json(Partner::where('is_active', true)->orderBy('ordering')->get());
    }

    public function partnerSettings()
    {
        $settings = PartnerSettings::firstOrCreate(
            ['id' => 'default'],
            ['title' => 'Our Partners & Supporters', 'subtitle' => 'Associates & Clients', 'is_active' => true]
        );
        return response()->json($settings);
    }

    public function legalPage($pageKey)
    {
        $page = LegalPage::where('page_key', $pageKey)->first();
        if (!$page) {
            return response()->json(null, 404);
        }
        return response()->json($page->toApiArray());
    }

    public function landingSections()
    {
        try {
            $sections = LandingPageSection::orderBy('ordering')->get();
            return response()->json($sections->map(fn($s) => [
                'id'         => $s->id,
                'sectionKey' => $s->section_key,
                'label'      => $s->label,
                'isEnabled'  => (bool) $s->is_enabled,
                'ordering'   => $s->ordering,
            ]));
        } catch (\Throwable $e) {
            return response()->json([]);
        }
    }

    public function cookieSettings()
    {
        try {
            $s = CookieSetting::firstOrCreate(['id' => 'default'], [
                'enabled'     => true,
                'delay'       => 1500,
                'title'       => '🍪 We use cookies to enhance your experience',
                'description' => 'Our cookies help us remember your preferences, analyze site traffic, and provide personalized content. Essential cookies are always active.',
                'categories'  => [
                    ['key' => 'necessary',  'label' => 'Necessary Cookies',  'description' => 'Required for basic site functionality',            'enabled' => true, 'locked' => true],
                    ['key' => 'functional', 'label' => 'Functional Cookies', 'description' => 'Remember your preferences and settings',           'enabled' => true, 'locked' => false],
                    ['key' => 'analytics',  'label' => 'Analytics Cookies',  'description' => 'Help us understand how our website is being used', 'enabled' => true, 'locked' => false],
                    ['key' => 'marketing',  'label' => 'Marketing Cookies',  'description' => 'Personalized content and ads',                     'enabled' => true, 'locked' => false],
                ],
            ]);
            return response()->json([
                'enabled'     => (bool) $s->enabled,
                'delay'       => (int) $s->delay,
                'title'       => $s->title,
                'description' => $s->description,
                'categories'  => $s->categories ?? [],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'enabled'     => true,
                'delay'       => 1500,
                'title'       => '🍪 We use cookies to enhance your experience',
                'description' => 'Our cookies help us remember your preferences, analyze site traffic, and provide personalized content.',
                'categories'  => [],
            ]);
        }
    }

    public function media($id)
    {
        $asset = MediaAsset::find($id);

        if (!$asset) {
            // Return a branded placeholder SVG rather than a 404
            $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">'
                 . '<rect width="400" height="300" fill="#1a2a5e"/>'
                 . '<text x="200" y="155" font-family="sans-serif" font-size="14" fill="#D8C18D" text-anchor="middle">Image unavailable</text>'
                 . '</svg>';
            return response($svg, 200)
                ->header('Content-Type', 'image/svg+xml')
                ->header('Cache-Control', 'no-cache');
        }

        $fileUrl = $asset->file_url ?? null;
        $dataUrl = $asset->url ?? null;

        // Serve from disk if it's a /storage/ path
        if ($fileUrl && str_starts_with($fileUrl, '/storage/media/')) {
            $storagePath = 'media/' . basename($fileUrl);
            if (Storage::disk('public')->exists($storagePath)) {
                $binary = Storage::disk('public')->get($storagePath);
                $mime   = $asset->file_type ?? 'application/octet-stream';
                return response($binary, 200)
                    ->header('Content-Type', $mime)
                    ->header('Cache-Control', 'public, max-age=31536000, immutable');
            }
        }

        // Legacy: decode base64 data URL stored in DB
        $src = $dataUrl ?? $fileUrl;
        if ($src && preg_match('/^data:([^;]+);base64,(.+)$/s', $src, $m)) {
            $mime   = $m[1];
            $binary = base64_decode($m[2]);
            return response($binary, 200)
                ->header('Content-Type', $mime)
                ->header('Cache-Control', 'public, max-age=31536000, immutable');
        }

        // External URL — redirect
        if ($src && filter_var($src, FILTER_VALIDATE_URL)) {
            return redirect($src);
        }

        // JSON fallback
        return response()->json($asset);
    }

    public function staticMedia()
    {
        $path = storage_path('app/static-media.json');
        if (!file_exists($path)) {
            return response()->json((object)[]);
        }
        $data = json_decode(file_get_contents($path), true) ?? [];
        return response()->json($data);
    }
}
