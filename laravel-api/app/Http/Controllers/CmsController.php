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
use App\Models\PartnerSettings;
use App\Models\FocusSectionSettings;

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
        return response()->json(NavbarSettings::firstOrCreate(['id' => 'default']));
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
        return response()->json(AboutSettings::firstOrCreate(['id' => 'default']));
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

    public function media($id)
    {
        $asset = MediaAsset::findOrFail($id);

        $dataUrl = $asset->url ?? ($asset->file_url ?? null);

        // If it's a base64 data URL, decode and serve as binary image
        if ($dataUrl && preg_match('/^data:([^;]+);base64,(.+)$/s', $dataUrl, $m)) {
            $mime    = $m[1];
            $binary  = base64_decode($m[2]);
            return response($binary, 200)
                ->header('Content-Type', $mime)
                ->header('Cache-Control', 'public, max-age=31536000, immutable');
        }

        // If it's an external URL, redirect to it
        if ($dataUrl && filter_var($dataUrl, FILTER_VALIDATE_URL)) {
            return redirect($dataUrl);
        }

        // Fallback: return JSON representation
        return response()->json($asset);
    }
}
