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
use App\Models\ClubsPageSettings;
use App\Models\LegalPage;
use App\Models\LandingPageSection;
use App\Models\CookieSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

        $data = $request->except(['id']);

        // Map camelCase keys sent by the frontend to snake_case DB columns
        $camelToSnake = [
            'logoType'           => 'logo_type',
            'logoImageId'        => 'logo_image_id',
            'logoUrl'            => 'logo_url',
            'logoSvg'            => 'logo_svg',
            'logoText'           => 'logo_text',
            'logoSize'           => 'logo_size',
            'logoLink'           => 'logo_link',
            'navigationLinks'    => 'navigation_links',
            'showLanguageSwitcher' => 'show_language_switcher',
            'availableLanguages' => 'available_languages',
            'showDarkModeToggle' => 'show_dark_mode_toggle',
            'showLoginButton'    => 'show_login_button',
            'showJoinButton'     => 'show_join_button',
            'loginButtonText'    => 'login_button_text',
            'loginButtonLink'    => 'login_button_link',
            'joinButtonText'     => 'join_button_text',
            'joinButtonLink'     => 'join_button_link',
            'joinButtonStyle'    => 'join_button_style',
            'backgroundColor'    => 'background_color',
            'textColor'          => 'text_color',
            'hoverColor'         => 'hover_color',
            'fontFamily'         => 'font_family',
            'fontSize'           => 'font_size',
            'isSticky'           => 'is_sticky',
            'isTransparent'      => 'is_transparent',
            'transparentBg'      => 'transparent_bg',
            'scrolledBg'         => 'scrolled_bg',
        ];

        $mapped = [];
        foreach ($data as $key => $value) {
            $mapped[$camelToSnake[$key] ?? $key] = $value;
        }

        $settings->update(array_merge($mapped, ['updated_by' => $request->user()->id]));

        $fresh = $settings->fresh();
        return response()->json(array_merge($fresh->toArray(), [
            'logoUrl'  => $fresh->logo_url,
            'logoType' => $fresh->logo_type,
        ]));
    }

    public function updateSeo(Request $request)
    {
        $settings = \App\Models\SeoSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge(
            $request->only([
                'site_title', 'site_description', 'keywords',
                'og_image', 'favicon_url',
                'twitter_handle', 'google_analytics_id', 'facebook_pixel_id',
                'custom_head_code', 'custom_body_code',
            ]),
            ['updated_by' => $request->user()?->id]
        ));

        if ($request->has('faviconUrl'))      $settings->favicon_url      = $request->faviconUrl;
        if ($request->has('siteTitle'))       $settings->site_title       = $request->siteTitle;
        if ($request->has('siteDescription')) $settings->site_description = $request->siteDescription;
        $settings->save();

        return response()->json(array_merge($settings->fresh()->toArray(), [
            'faviconUrl' => $settings->fresh()->favicon_url,
        ]));
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

        $map = [
            'title'              => 'title',
            'subtitle'           => 'subtitle',
            'description'        => 'description',
            'whoWeAreTitle'      => 'who_we_are_title',
            'whoWeAreParagraph2' => 'who_we_are_paragraph2',
            'valuesTitle'        => 'values_title',
            'ctaTitle'           => 'cta_title',
            'ctaDescription'     => 'cta_description',
            'isActive'           => 'is_active',
            'imageId'            => 'image_id',
            'backgroundImageId'  => 'background_image_id',
            'backgroundColor'    => 'background_color',
        ];

        $data = ['updated_by' => $request->user()->id];
        foreach ($map as $camel => $snake) {
            if ($request->has($camel)) {
                $data[$snake] = $request->input($camel);
            }
        }

        // Store translations as JSON
        if ($request->has('translations')) {
            $data['translations'] = $request->input('translations');
        }

        $settings->update($data);
        return response()->json($settings->fresh()->toApiArray());
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

        $data = [];

        if ($request->has('backgroundType'))       $data['background_type']      = $request->input('backgroundType');
        if ($request->has('background_type'))       $data['background_type']      = $request->input('background_type');

        if ($request->has('backgroundImageUrl'))    $data['background_image_url'] = $request->input('backgroundImageUrl');
        if ($request->has('background_image_url'))  $data['background_image_url'] = $request->input('background_image_url');

        if ($request->has('backgroundVideoUrl'))    $data['background_video_url'] = $request->input('backgroundVideoUrl');
        if ($request->has('background_video_url'))  $data['background_video_url'] = $request->input('background_video_url');

        if ($request->has('overlayOpacity'))        $data['overlay_opacity']      = $request->input('overlayOpacity');
        if ($request->has('overlay_opacity'))       $data['overlay_opacity']      = $request->input('overlay_opacity');

        if ($request->has('title'))    $data['title']    = $request->input('title');
        if ($request->has('subtitle')) $data['subtitle'] = $request->input('subtitle');

        $data['updated_by'] = $request->user()?->id;

        $setting->update($data);

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

        $userId   = $request->user()?->id ?? 'system';
        $file     = $request->file('file');
        $mime     = $file->getMimeType() ?? 'application/octet-stream';
        $origName = $file->getClientOriginalName();
        $ext      = $file->getClientOriginalExtension() ?: 'bin';
        $uuid     = (string) Str::uuid();
        $filename = $uuid . '.' . $ext;

        Storage::disk('public')->put('media/' . $filename, file_get_contents($file->getRealPath()));
        $fileUrl = '/storage/media/' . $filename;

        $asset = MediaAsset::create([
            'file_name'     => $origName,
            'file_type'     => $mime,
            'file_size'     => $file->getSize(),
            'file_url'      => $fileUrl,
            'thumbnail_url' => $fileUrl,
            'alt_text'      => $request->input('alt', pathinfo($origName, PATHINFO_FILENAME)),
            'uploaded_by'   => $userId,
        ]);

        return response()->json([
            'url'     => $fileUrl,
            'fileUrl' => $fileUrl,
            'id'      => $asset->id,
        ], 201);
    }

    public function uploadMedia(Request $request)
    {
        $userId = $request->user()?->id ?? 'system';

        // Accept multipart file upload
        if ($request->hasFile('file')) {
            $file     = $request->file('file');
            $mime     = $file->getMimeType() ?? 'image/jpeg';
            $origName = $file->getClientOriginalName();
            $ext      = $file->getClientOriginalExtension() ?: 'bin';
            $uuid     = (string) Str::uuid();
            $filename = $uuid . '.' . $ext;

            Storage::disk('public')->put('media/' . $filename, file_get_contents($file->getRealPath()));
            $fileUrl = '/storage/media/' . $filename;

            $asset = MediaAsset::create([
                'file_name'   => $origName,
                'file_type'   => $mime,
                'file_size'   => $file->getSize(),
                'file_url'    => $fileUrl,
                'thumbnail_url' => $fileUrl,
                'alt_text'    => $request->input('alt', pathinfo($origName, PATHINFO_FILENAME)),
                'uploaded_by' => $userId,
            ]);

            return response()->json([
                'url'      => $fileUrl,
                'imageUrl' => $fileUrl,
                'fileUrl'  => $fileUrl,
                'id'       => $asset->id,
            ], 201);
        }

        // Accept JSON base64 imageData (legacy fallback)
        if ($request->filled('imageData')) {
            $imageData = $request->imageData;
            if (!preg_match('/^data:([^;]+);base64,(.+)$/s', $imageData, $m)) {
                return response()->json(['message' => 'Invalid image format'], 400);
            }

            $mime   = $m[1];
            $binary = base64_decode($m[2]);
            $ext    = $this->mimeToExt($mime);
            $uuid   = (string) Str::uuid();
            $filename = $uuid . '.' . $ext;

            Storage::disk('public')->put('media/' . $filename, $binary);
            $fileUrl = '/storage/media/' . $filename;
            $altText = $request->input('alt', '');

            $asset = MediaAsset::create([
                'file_name'   => ($altText ?: $uuid) . '.' . $ext,
                'file_type'   => $mime,
                'file_size'   => strlen($binary),
                'file_url'    => $fileUrl,
                'thumbnail_url' => $fileUrl,
                'alt_text'    => $altText,
                'uploaded_by' => $userId,
            ]);

            return response()->json([
                'url'      => $fileUrl,
                'imageUrl' => $fileUrl,
                'fileUrl'  => $fileUrl,
                'id'       => $asset->id,
            ], 201);
        }

        return response()->json(['message' => 'No file or imageData provided'], 422);
    }

    private function mimeToExt(string $mime): string
    {
        return match ($mime) {
            'image/jpeg'    => 'jpg',
            'image/png'     => 'png',
            'image/gif'     => 'gif',
            'image/webp'    => 'webp',
            'image/svg+xml' => 'svg',
            'video/mp4'     => 'mp4',
            'video/webm'    => 'webm',
            default         => explode('/', $mime)[1] ?? 'bin',
        };
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
            'logoUrl'     => $p->logo_url,
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
            'logoUrl'     => 'nullable|string|max:2000',
            'websiteUrl'  => 'nullable|string|max:500',
            'description' => 'nullable|string|max:1000',
            'isActive'    => 'boolean',
        ]);

        $maxOrder = Partner::max('ordering') ?? 0;

        $partner = Partner::create([
            'name'        => $validated['name'],
            'logo_url'    => $validated['logoUrl'] ?? null,
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
            'logoUrl'     => 'nullable|string|max:2000',
            'websiteUrl'  => 'nullable|string|max:500',
            'description' => 'nullable|string|max:1000',
            'isActive'    => 'boolean',
            'ordering'    => 'integer|min:0',
        ]);

        $map = [
            'name'        => 'name',
            'logoUrl'     => 'logo_url',
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

    public function listTeamMembers()
    {
        return response()->json(TeamMember::orderBy('ordering')->get()->map(fn($m) => $this->teamMemberToArray($m)));
    }

    public function storeTeamMember(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'role'     => 'required|string|max:255',
            'bio'      => 'nullable|string',
            'email'    => 'nullable|email|max:255',
            'phone'    => 'nullable|string|max:50',
            'isActive' => 'nullable|boolean',
        ]);

        $member = TeamMember::create([
            'name'       => $data['name'],
            'role'       => $data['role'],
            'bio'        => $data['bio'] ?? null,
            'email'      => $data['email'] ?? null,
            'phone'      => $data['phone'] ?? null,
            'is_active'  => $data['isActive'] ?? true,
            'ordering'   => (TeamMember::max('ordering') ?? 0) + 1,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($this->teamMemberToArray($member), 201);
    }

    public function updateTeamMember(Request $request, $id)
    {
        $member = TeamMember::findOrFail($id);

        $data = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'role'     => 'sometimes|string|max:255',
            'bio'      => 'nullable|string',
            'email'    => 'nullable|email|max:255',
            'phone'    => 'nullable|string|max:50',
            'isActive' => 'nullable|boolean',
            'ordering' => 'nullable|integer',
        ]);

        $member->update([
            'name'      => $data['name']     ?? $member->name,
            'role'      => $data['role']     ?? $member->role,
            'bio'       => array_key_exists('bio', $data)   ? $data['bio']   : $member->bio,
            'email'     => array_key_exists('email', $data) ? $data['email'] : $member->email,
            'phone'     => array_key_exists('phone', $data) ? $data['phone'] : $member->phone,
            'is_active' => $data['isActive'] ?? $member->is_active,
            'ordering'  => $data['ordering'] ?? $member->ordering,
        ]);

        return response()->json($this->teamMemberToArray($member->fresh()));
    }

    public function destroyTeamMember($id)
    {
        TeamMember::findOrFail($id)->delete();
        return response()->json(['message' => 'Team member deleted']);
    }

    private function teamMemberToArray(TeamMember $m): array
    {
        return [
            'id'       => $m->id,
            'name'     => $m->name,
            'role'     => $m->role,
            'bio'      => $m->bio,
            'email'    => $m->email,
            'phone'    => $m->phone,
            'isActive' => (bool) $m->is_active,
            'ordering' => $m->ordering,
        ];
    }

    public function updateClubsPage(Request $request)
    {
        $data = $request->validate([
            'introHeading'     => 'nullable|string|max:255',
            'introDescription' => 'nullable|string',
            'ctaHeading'       => 'nullable|string|max:255',
            'ctaDescription'   => 'nullable|string',
            'ctaButtonText'    => 'nullable|string|max:100',
            'ctaButtonLink'    => 'nullable|string|max:500',
        ]);

        $settings = ClubsPageSettings::firstOrCreate(['id' => 'default']);
        $settings->update([
            'intro_heading'     => $data['introHeading']     ?? $settings->intro_heading,
            'intro_description' => $data['introDescription'] ?? $settings->intro_description,
            'cta_heading'       => $data['ctaHeading']       ?? $settings->cta_heading,
            'cta_description'   => $data['ctaDescription']   ?? $settings->cta_description,
            'cta_button_text'   => $data['ctaButtonText']    ?? $settings->cta_button_text,
            'cta_button_link'   => $data['ctaButtonLink']    ?? $settings->cta_button_link,
            'updated_by'        => $request->user()->id,
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

    public function listTestimonials()
    {
        return response()->json(LandingTestimonial::orderBy('ordering')->get());
    }

    public function storeTestimonial(\Illuminate\Http\Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:255',
            'role'       => 'nullable|string|max:255',
            'feedback'   => 'required|string',
            'rating'     => 'nullable|integer|min:1|max:5',
            'isApproved' => 'nullable|boolean',
            'isActive'   => 'nullable|boolean',
        ]);

        $testimonial = LandingTestimonial::create([
            'name'        => $data['name'],
            'role'        => $data['role'] ?? null,
            'feedback'    => $data['feedback'],
            'rating'      => $data['rating'] ?? 5,
            'is_approved' => $data['isApproved'] ?? true,
            'is_active'   => $data['isActive'] ?? true,
            'ordering'    => (LandingTestimonial::max('ordering') ?? 0) + 1,
        ]);

        return response()->json($testimonial, 201);
    }

    public function updateTestimonial(\Illuminate\Http\Request $request, $id)
    {
        $testimonial = LandingTestimonial::findOrFail($id);

        $data = $request->validate([
            'name'       => 'sometimes|string|max:255',
            'role'       => 'nullable|string|max:255',
            'feedback'   => 'sometimes|string',
            'rating'     => 'nullable|integer|min:1|max:5',
            'isApproved' => 'nullable|boolean',
            'isActive'   => 'nullable|boolean',
            'ordering'   => 'nullable|integer',
        ]);

        $testimonial->update([
            'name'        => $data['name']       ?? $testimonial->name,
            'role'        => $data['role']       ?? $testimonial->role,
            'feedback'    => $data['feedback']   ?? $testimonial->feedback,
            'rating'      => $data['rating']     ?? $testimonial->rating,
            'is_approved' => $data['isApproved'] ?? $testimonial->is_approved,
            'is_active'   => $data['isActive']   ?? $testimonial->is_active,
            'ordering'    => $data['ordering']   ?? $testimonial->ordering,
        ]);

        return response()->json($testimonial->fresh());
    }

    public function destroyTestimonial($id)
    {
        LandingTestimonial::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function updateLegalPage(Request $request, string $pageKey)
    {
        $allowed = ['privacy-policy', 'terms-of-service', 'cookie-policy'];
        if (!in_array($pageKey, $allowed)) {
            return response()->json(['message' => 'Invalid page key'], 422);
        }

        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $page = LegalPage::updateOrCreate(
            ['page_key' => $pageKey],
            [
                'title'      => $data['title'],
                'content'    => $data['content'],
                'updated_by' => $request->user()->id,
            ]
        );

        return response()->json($page->fresh()->toApiArray());
    }

    public function getLandingSections()
    {
        $sections = LandingPageSection::orderBy('ordering')->get();
        return response()->json($sections->map(fn($s) => [
            'id'         => $s->id,
            'sectionKey' => $s->section_key,
            'label'      => $s->label,
            'isEnabled'  => (bool) $s->is_enabled,
            'ordering'   => $s->ordering,
        ]));
    }

    public function updateLandingSections(Request $request)
    {
        $updates = $request->validate([
            '*'             => 'array',
            '*.sectionKey'  => 'required|string',
            '*.isEnabled'   => 'required|boolean',
        ]);

        foreach ($updates as $item) {
            LandingPageSection::where('section_key', $item['sectionKey'])
                ->update(['is_enabled' => $item['isEnabled']]);
        }

        return response()->json(['message' => 'Saved']);
    }

    public function getCookieSettings()
    {
        $s = CookieSetting::firstOrCreate(['id' => 'default'], [
            'enabled' => true, 'delay' => 1500,
            'title' => '🍪 We use cookies to enhance your experience',
            'description' => 'Our cookies help us remember your preferences.',
            'categories' => [],
        ]);
        return response()->json([
            'enabled'     => (bool) $s->enabled,
            'delay'       => (int) $s->delay,
            'title'       => $s->title,
            'description' => $s->description,
            'categories'  => $s->categories ?? [],
        ]);
    }

    public function updateCookieSettings(Request $request)
    {
        $data = $request->validate([
            'enabled'     => 'boolean',
            'delay'       => 'integer|min:0',
            'title'       => 'string|max:500',
            'description' => 'nullable|string',
            'categories'  => 'nullable|array',
        ]);

        $s = CookieSetting::firstOrCreate(['id' => 'default']);
        $s->update($data);

        return response()->json([
            'enabled'     => (bool) $s->enabled,
            'delay'       => (int) $s->delay,
            'title'       => $s->title,
            'description' => $s->description,
            'categories'  => $s->categories ?? [],
        ]);
    }

    public function updateStaticMedia(Request $request)
    {
        $incoming = $request->validate([
            '*' => 'nullable|string|max:2048',
        ]);

        $path = storage_path('app/static-media.json');
        $existing = file_exists($path)
            ? (json_decode(file_get_contents($path), true) ?? [])
            : [];

        $merged = array_merge($existing, $incoming);
        file_put_contents($path, json_encode($merged, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        return response()->json($merged);
    }
}
