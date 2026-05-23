<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSettings;
use App\Models\ThemeSettings;
use App\Models\NavbarSettings;
use App\Models\FooterSettings;
use App\Models\PresidentMessageSettings;
use App\Models\AboutSettings;
use App\Models\DiscoverSettings;
use App\Models\MediaAsset;
use App\Models\PageHeroSetting;
use App\Models\FocusItem;
use App\Models\TeamMember;
use App\Models\LandingTestimonial;
use App\Models\SiteStat;
use App\Models\Partner;
use App\Models\PartnerSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CmsAdminController extends Controller
{
    public function updateHero(Request $request)
    {
        $settings = HeroSettings::firstOrCreate(['id' => 'default']);

        $map = [
            'title'                    => 'title',
            'subtitle'                 => 'subtitle',
            'primaryButtonText'        => 'primary_button_text',
            'primaryButtonLink'        => 'primary_button_link',
            'secondaryButtonText'      => 'secondary_button_text',
            'secondaryButtonLink'      => 'secondary_button_link',
            'showPrimaryButton'        => 'show_primary_button',
            'showSecondaryButton'      => 'show_secondary_button',
            'backgroundType'           => 'background_type',
            'backgroundMediaId'        => 'background_media_id',
            'backgroundImageUrl'       => 'background_image_url',
            'backgroundVideoUrl'       => 'background_video_url',
            'backgroundOverlayColor'   => 'background_overlay_color',
            'backgroundOverlayOpacity' => 'background_overlay_opacity',
            'titleFontSize'            => 'title_font_size',
            'titleColor'               => 'title_color',
            'titleAlignment'           => 'title_alignment',
            'subtitleFontSize'         => 'subtitle_font_size',
            'subtitleColor'            => 'subtitle_color',
            'subtitleAlignment'        => 'subtitle_alignment',
            'heroHeight'               => 'hero_height',
            'contentMaxWidth'          => 'content_max_width',
            'enableTypewriter'         => 'enable_typewriter',
        ];

        $data = ['updated_by' => $request->user()->id];
        foreach ($map as $camel => $snake) {
            if ($request->has($camel)) {
                $data[$snake] = $request->input($camel);
            }
        }

        $settings->update($data);

        // Return camelCase via public controller helper
        return response()->json(app(\App\Http\Controllers\CmsController::class)->hero()->getData(true));
    }

    public function updateTheme(Request $request)
    {
        $settings = ThemeSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge($request->except(['id']), ['updated_by' => $request->user()->id]));
        return response()->json($settings->fresh());
    }

    public function updateNavbar(Request $request)
    {
        $settings = NavbarSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge($request->except(['id']), ['updated_by' => $request->user()->id]));
        return response()->json($settings->fresh());
    }

    public function updateFooter(Request $request)
    {
        $settings = FooterSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge($request->except(['id']), ['updated_by' => $request->user()->id]));
        return response()->json($settings->fresh());
    }

    public function updatePresidentMessage(Request $request)
    {
        $settings = PresidentMessageSettings::firstOrCreate(['id' => 'default']);

        // Map camelCase frontend keys → snake_case DB columns
        $map = [
            'isActive'           => 'is_active',
            'presidentName'      => 'president_name',
            'presidentRole'      => 'president_role',
            'photoId'            => 'photo_id',
            'signatureId'        => 'signature_id',
            'backgroundImageId'  => 'background_image_id',
            'backgroundColor'    => 'background_color',
            'backgroundGradient' => 'background_gradient',
            'titleFontFamily'    => 'title_font_family',
            'titleFontSize'      => 'title_font_size',
            'titleColor'         => 'title_color',
            'titleAlignment'     => 'title_alignment',
            'nameFontFamily'     => 'name_font_family',
            'nameFontSize'       => 'name_font_size',
            'nameColor'          => 'name_color',
            'roleFontFamily'     => 'role_font_family',
            'roleFontSize'       => 'role_font_size',
            'roleColor'          => 'role_color',
            'messageFontFamily'  => 'message_font_family',
            'messageFontSize'    => 'message_font_size',
            'messageColor'       => 'message_color',
            'quoteFontSize'      => 'quote_font_size',
            'quoteColor'         => 'quote_color',
            'imagePosition'      => 'image_position',
            'imageAlignment'     => 'image_alignment',
            'imageWidth'         => 'image_width',
            'sectionPadding'     => 'section_padding',
            'contentGap'         => 'content_gap',
        ];

        $nullableTextFields = ['message', 'quote', 'title', 'president_name', 'president_role'];

        $data = [];
        foreach ($request->except(['id']) as $key => $value) {
            $dbKey = $map[$key] ?? $key;
            // Prevent empty strings from being coerced to null on NOT NULL text columns
            if (in_array($dbKey, $nullableTextFields) && is_null($value)) {
                $value = '';
            }
            $data[$dbKey] = $value;
        }
        $data['updated_by'] = $request->user()?->id;

        $settings->update($data);
        return response()->json($settings->fresh());
    }

    public function updateAbout(Request $request)
    {
        $settings = AboutSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge($request->except(['id']), ['updated_by' => $request->user()->id]));
        return response()->json($settings->fresh());
    }

    public function updateDiscover(Request $request)
    {
        $settings = DiscoverSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge($request->except(['id']), ['updated_by' => $request->user()->id]));
        return response()->json($settings->fresh());
    }

    public function updatePageHero(Request $request, string $page)
    {
        $allowed = ['landing', 'contact', 'volunteers', 'blog', 'projects', 'discover', 'city-detail'];
        if (!in_array($page, $allowed)) {
            return response()->json(['message' => 'Invalid page key'], 422);
        }

        $setting = PageHeroSetting::firstOrCreate(['page_key' => $page]);
        $setting->update(array_merge(
            $request->only([
                'background_type', 'backgroundType',
                'background_image_url', 'backgroundImageUrl',
                'background_video_url', 'backgroundVideoUrl',
                'overlay_opacity', 'overlayOpacity',
                'title', 'subtitle',
            ]),
            ['updated_by' => $request->user()?->id]
        ));

        $fresh = $setting->fresh();
        return response()->json([
            'page_key'             => $fresh->page_key,
            'backgroundType'       => $fresh->background_type,
            'backgroundImageUrl'   => $fresh->background_image_url,
            'backgroundVideoUrl'   => $fresh->background_video_url,
            'overlayOpacity'       => $fresh->overlay_opacity,
            'title'                => $fresh->title,
            'subtitle'             => $fresh->subtitle,
        ]);
    }

    public function uploadPageHeroMedia(Request $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['message' => 'No file provided'], 422);
        }

        $file     = $request->file('file');
        $mime     = $file->getMimeType() ?? 'application/octet-stream';
        $ext      = $file->getClientOriginalExtension() ?: 'bin';
        $id       = (string) Str::uuid();
        $filename = $id . '.' . $ext;

        // Store in public/uploads/hero-media/ so Vite serves it statically
        $targetDir = public_path('uploads/hero-media');
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }
        $file->move($targetDir, $filename);

        return response()->json([
            'url' => '/uploads/hero-media/' . $filename,
            'id'  => $id,
        ], 201);
    }

    public function uploadMedia(Request $request)
    {
        $userId = $request->user()?->id ?? 'system';

        // Accept multipart file upload
        if ($request->hasFile('file')) {
            $file    = $request->file('file');
            $mime    = $file->getMimeType() ?? 'image/jpeg';
            $b64     = base64_encode(file_get_contents($file->getRealPath()));
            $dataUrl = 'data:' . $mime . ';base64,' . $b64;

            $asset = MediaAsset::create([
                'id'          => Str::uuid(),
                'url'         => $dataUrl,
                'alt'         => $request->input('alt', $file->getClientOriginalName()),
                'file_type'   => $mime,
                'file_name'   => $file->getClientOriginalName(),
                'uploaded_by' => $userId,
            ]);

            return response()->json([
                'url'      => $dataUrl,
                'imageUrl' => $dataUrl,
                'id'       => $asset->id,
            ], 201);
        }

        // Accept JSON base64 imageData
        $request->validate(['imageData' => 'required|string', 'alt' => 'nullable|string']);
        $imageData = $request->imageData;
        if (!preg_match('/^data:image\/(png|jpeg|jpg|gif|webp);base64,.+$/', $imageData, $m)) {
            return response()->json(['message' => 'Invalid image format'], 400);
        }

        $asset = MediaAsset::create([
            'id'          => Str::uuid(),
            'url'         => $imageData,
            'alt'         => $request->input('alt', ''),
            'file_type'   => 'image/' . $m[1],
            'uploaded_by' => $userId,
        ]);

        return response()->json([
            'url'      => $imageData,
            'imageUrl' => $imageData,
            'id'       => $asset->id,
        ], 201);
    }

    public function getPartnerSettings()
    {
        $settings = PartnerSettings::firstOrCreate(
            ['id' => 'default'],
            ['title' => 'Our Partners & Supporters', 'subtitle' => 'Associates & Clients', 'is_active' => true]
        );
        return response()->json($settings);
    }

    public function updatePartnerSettings(Request $request)
    {
        $settings = PartnerSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge(
            $request->only(['title', 'subtitle', 'is_active', 'background_color']),
            ['updated_by' => $request->user()?->id]
        ));
        return response()->json($settings->fresh());
    }

    public function getCmsStat(Request $request)
    {
        $type = $request->type ?? 'all';
        $data = [];
        if (in_array($type, ['all', 'focus']))        $data['focusItems']   = FocusItem::where('is_active', true)->orderBy('ordering')->get();
        if (in_array($type, ['all', 'team']))         $data['teamMembers']  = TeamMember::where('is_active', true)->orderBy('ordering')->get();
        if (in_array($type, ['all', 'testimonials'])) $data['testimonials'] = LandingTestimonial::orderBy('ordering')->get();
        if (in_array($type, ['all', 'stats']))        $data['siteStats']    = SiteStat::where('is_active', true)->orderBy('ordering')->get();
        if (in_array($type, ['all', 'partners']))     $data['partners']     = Partner::where('is_active', true)->orderBy('ordering')->get();
        return response()->json($data);
    }

    public function updateCmsStat(Request $request)
    {
        $type = $request->validate(['type' => 'required|in:focus,team,testimonials,stats,partners'])['type'];
        $items = $request->validate(['items' => 'required|array'])['items'];

        $modelMap = [
            'focus'        => FocusItem::class,
            'team'         => TeamMember::class,
            'testimonials' => LandingTestimonial::class,
            'stats'        => SiteStat::class,
            'partners'     => Partner::class,
        ];
        $model = $modelMap[$type];

        foreach ($items as $index => $item) {
            $item['ordering'] = $index + 1;
            if (!empty($item['id'])) {
                $model::find($item['id'])?->update($item);
            } else {
                $model::create($item);
            }
        }

        return response()->json(['message' => 'Updated successfully']);
    }

    public function deleteCmsStat($type, $id)
    {
        $modelMap = [
            'focus'        => FocusItem::class,
            'team'         => TeamMember::class,
            'testimonials' => LandingTestimonial::class,
            'stats'        => SiteStat::class,
            'partners'     => Partner::class,
        ];
        if (!isset($modelMap[$type])) return response()->json(['message' => 'Invalid type'], 400);
        $modelMap[$type]::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    private function partnerToArray(Partner $p): array
    {
        return [
            'id'          => $p->id,
            'name'        => $p->name,
            'logoUrl'     => $p->logo_id,
            'websiteUrl'  => $p->website_url,
            'description' => $p->description,
            'ordering'    => $p->ordering,
            'isActive'    => (bool) $p->is_active,
        ];
    }

    public function listPartners()
    {
        $partners = Partner::orderBy('ordering')->get();
        return response()->json($partners->map(fn($p) => $this->partnerToArray($p)));
    }

    public function storePartner(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'logoUrl'     => 'nullable|string|max:1000',
            'websiteUrl'  => 'nullable|url|max:500',
            'description' => 'nullable|string|max:1000',
            'isActive'    => 'boolean',
        ]);

        $maxOrder = Partner::max('ordering') ?? 0;

        $partner = Partner::create([
            'name'        => $validated['name'],
            'logo_id'     => $validated['logoUrl'] ?? null,
            'website_url' => $validated['websiteUrl'] ?? null,
            'description' => $validated['description'] ?? null,
            'ordering'    => $maxOrder + 1,
            'is_active'   => $validated['isActive'] ?? true,
            'created_by'  => $request->user()?->id,
        ]);

        return response()->json($this->partnerToArray($partner), 201);
    }

    public function updatePartner(Request $request, int $id)
    {
        $partner = Partner::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'logoUrl'     => 'nullable|string|max:1000',
            'websiteUrl'  => 'nullable|url|max:500',
            'description' => 'nullable|string|max:1000',
            'isActive'    => 'boolean',
            'ordering'    => 'integer|min:0',
        ]);

        $map = [
            'name'        => 'name',
            'logoUrl'     => 'logo_id',
            'websiteUrl'  => 'website_url',
            'description' => 'description',
            'isActive'    => 'is_active',
            'ordering'    => 'ordering',
        ];

        $data = [];
        foreach ($validated as $key => $value) {
            $data[$map[$key]] = $value;
        }

        $partner->update($data);

        return response()->json($this->partnerToArray($partner->fresh()));
    }

    public function destroyPartner(int $id)
    {
        Partner::findOrFail($id)->delete();
        return response()->json(['message' => 'Partner removed']);
    }
}
